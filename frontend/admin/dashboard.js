
document.addEventListener("DOMContentLoaded", function () {
    // Check admin role
    const role = localStorage.getItem("role");
    if (role !== "admin") {
        window.location.href = "/user/login.html";
        return;
    }

    loadStats();
    loadAllPredictions();
});

async function loadStats() {
    try {
        const res = await fetch(API_BASE_URL + "/stats");
        const data = await res.json();

        document.getElementById("totalPredictions").innerText = data.total_predictions || 0;
        document.getElementById("tumorCases").innerText = data.tumor_cases || 0;
        document.getElementById("noTumorCases").innerText = data.no_tumor_cases || 0;
        document.getElementById("totalPatients").innerText = data.total_patients || 0;
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

async function loadAllPredictions() {
    const tableBody = document.querySelector("#predictionTable tbody");
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: #64748b;">Loading predictions...</td></tr>`;

    try {
        console.log("Fetching predictions from:", API_BASE_URL + "/admin/all-history");
        const res = await fetch(API_BASE_URL + "/admin/all-history");
        
        if (!res.ok) {
            console.error("Fetch failed with status:", res.status);
            throw new Error(`Server error: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Predictions loaded:", data.length);

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format received from server");
        }

        window.allAdminData = data; 
        renderAdminTable(data);
    } catch (error) {
        console.error("Error loading predictions:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 40px; color: #ef4444;">
                    <div style="margin-bottom: 10px;">⚠️ Failed to load data.</div>
                    <div style="font-size: 0.8rem; color: #94a3b8;">Error: ${error.message}</div>
                    <button onclick="loadAllPredictions()" style="margin-top: 15px; padding: 8px 16px; font-size: 0.8rem;">Retry Connection</button>
                </td>
            </tr>`;
    }
}

function refreshAdmin() {
    const refreshBtn = document.getElementById("refreshBtn");
    if (!refreshBtn) return;
    
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = "🔄 Refreshing...";
    refreshBtn.disabled = true;
    
    Promise.all([loadStats(), loadAllPredictions()]).finally(() => {
        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }, 500);
    });
}

function renderAdminTable(data) {
    const tableBody = document.querySelector("#predictionTable tbody");
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: #64748b;">No predictions found in database.</td></tr>`;
        return;
    }

    data.forEach(item => {
        // Safe path construction
        let imgSrc = "https://via.placeholder.com/60?text=No+Image";

if (item.image_path) {
    if (item.image_path.startsWith("http")) {
        imgSrc = item.image_path;
    } else {
        imgSrc = API_BASE_URL + (item.image_path.startsWith("/") ? item.image_path : "/" + item.image_path);
    }
}
        
        const prediction = item.prediction || "N/A";
        const confidence = item.confidence_percent || 0;
        const dateStr = item.date ? new Date(item.date).toLocaleString() : "N/A";

        const row = `
            <tr>
                <td style="font-weight: 600;">${item.patient_name || 'Unknown'}</td>
                <td><code>${item.patient_id || 'N/A'}</code></td>
                <td>
                    <img src="${imgSrc}" class="patient-img" 
                         style="cursor: pointer; width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" 
                         onclick="window.open('${imgSrc}', '_blank')"
                         onerror="this.src='https://via.placeholder.com/60?text=Error'">
                </td>
                <td>
                    <span style="color: ${prediction === 'Tumor' ? '#ef4444' : '#10b981'}; font-weight: 700;">
                        ${prediction}
                    </span>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 60px; height: 6px; background: #e2e8f0; border-radius: 3px;">
                            <div style="height: 100%; background: #3b82f6; border-radius: 3px; width: ${confidence}%"></div>
                        </div>
                        <span>${confidence}%</span>
                    </div>
                </td>
                <td style="color: #64748b; font-size: 0.875rem;">${dateStr}</td>
                <td>
                    <button class="delete-btn" onclick="deleteRecord(${item.id})" style="padding: 6px 12px; font-size: 0.8rem;">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function filterTable() {
    const input = document.getElementById("searchInput");
    if (!input) return;
    
    const filter = input.value.toUpperCase();
    if (!window.allAdminData) return;

    const filteredData = window.allAdminData.filter(item => {
        const name = (item.patient_name || "").toUpperCase();
        const id = (item.patient_id || "").toString().toUpperCase();
        const prediction = (item.prediction || "").toUpperCase();
        
        return name.includes(filter) || id.includes(filter) || prediction.includes(filter);
    });

    renderAdminTable(filteredData);
}

async function deleteRecord(id) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
        const res = await fetch(API_BASE_URL + `/delete/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            loadAllPredictions();
            loadStats();
        } else {
            alert("Failed to delete record.");
        }
    } catch (error) {
        console.error("Error deleting record:", error);
    }
}
