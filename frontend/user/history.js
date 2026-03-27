
document.addEventListener("DOMContentLoaded", loadHistory);

async function loadHistory() {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        window.location.href = "/login";
        return;
    }

    const tableBody = document.querySelector("#historyTable tbody");
    tableBody.innerHTML = `<tr><td colspan="6" style="padding: 40px; text-align: center; color: #64748b;">Loading history...</td></tr>`;

    try {
        console.log("Fetching history for user:", user_id);
        const res = await fetch(API_BASE_URL + "/history/" + user_id);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        
        const data = await res.json();
        console.log("History data received:", data);

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format received from server");
        }

        // Filter for privacy: user sees only their own, admin sees all
        const userRole = localStorage.getItem("role");
        const filteredData = data.filter(item => {
            if (userRole === "admin") return true;
            return String(item.user_id) === String(user_id);
        });

        window.allHistoryData = filteredData; 
        renderHistory(filteredData);
    } catch (error) {
        console.error("Error loading history:", error);
        tableBody.innerHTML = `<tr><td colspan="6" style="padding: 40px; text-align: center; color: #ef4444;">Failed to load history. Error: ${error.message}</td></tr>`;
    }
}

function refreshHistory() {
    const refreshBtn = document.querySelector("button[onclick='refreshHistory()']");
    if (!refreshBtn) return;
    
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = "🔄 Refreshing...";
    refreshBtn.disabled = true;
    
    loadHistory().finally(() => {
        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }, 500);
    });
}

function renderHistory(data) {
    const tableBody = document.querySelector("#historyTable tbody");
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="padding: 40px; text-align: center; color: #64748b;">No history found. Start by uploading an image.</td></tr>`;
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
        
        // Ensure prediction matches filter values
        const prediction = item.prediction || "N/A";
        const confidence = item.confidence_percent || 0;
        const dateStr = item.date ? new Date(item.date).toLocaleString() : "N/A";

        const row = `
            <tr>
                <td style="font-weight: 600; color: #1e293b;">${item.patient_name || 'Unknown'}</td>
                <td><code>${item.patient_id || 'N/A'}</code></td>
                <td>
                    <img src="${imgSrc}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 1px solid #e2e8f0;" 
                         onclick="openModal('${imgSrc}')"
                         onerror="this.src='https://via.placeholder.com/60?text=Error'">
                </td>
                <td>
                    <span style="color: ${prediction === 'Tumor' ? '#ef4444' : '#10b981'}; font-weight: 700;">
                        ${prediction}
                    </span>
                </td>
                <td>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <div style="width: 50px; height: 6px; background: #e2e8f0; border-radius: 3px;">
                            <div style="height: 100%; background: #3b82f6; border-radius: 3px; width: ${confidence}%"></div>
                        </div>
                        <span>${confidence}%</span>
                    </div>
                </td>
                <td style="color: #64748b; font-size: 0.875rem;">${dateStr}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function filterHistory() {
    const searchInput = document.getElementById("searchInput")?.value.toUpperCase() || "";
    const filterValue = document.getElementById("filterPrediction")?.value || "all";
    
    if (!window.allHistoryData) return;

    const filteredData = window.allHistoryData.filter(item => {
        const name = (item.patient_name || "").toUpperCase();
        const id = (item.patient_id || "").toString().toUpperCase();
        const prediction = (item.prediction || "").toUpperCase();

        const matchesSearch = name.includes(searchInput) || id.includes(searchInput);
        
        let matchesFilter = false;
        if (filterValue === "all") {
            matchesFilter = true;
        } else if (filterValue === "Tumor") {
            // Match "Tumor" or "Tumor Detected"
            matchesFilter = prediction.includes("TUMOR") && !prediction.includes("NO TUMOR");
        } else if (filterValue === "No Tumor") {
            // Match "No Tumor" or "Normal"
            matchesFilter = prediction.includes("NO TUMOR") || prediction.includes("NORMAL");
        }

        return matchesSearch && matchesFilter;
    });

    renderHistory(filteredData);
}

function openModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = src;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}