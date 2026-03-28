
let selectedFiles = [];

document.addEventListener("DOMContentLoaded", function () {

    // -------- LOGIN CHECK --------
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        window.location.href = "/user/result.html";
        return;
    }

    const imageInput = document.getElementById('imageInput');
    const dropArea = document.getElementById('dropArea');
    const fileNameDisplay = document.getElementById('fileName');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const predictButton = document.getElementById('predictButton');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // -------- File Select --------
    imageInput.addEventListener('change', function (event) {
        handleFiles(event.target.files);
    });

    // -------- Drag Drop --------
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add('active');
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove('active');
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove('active');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        selectedFiles = Array.from(files);
        if (selectedFiles.length > 0) {
            fileNameDisplay.textContent = `✓ ${selectedFiles[0].name} selected`;
            
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewSection.style.display = 'block';
                // Smooth scroll to preview
                previewSection.scrollIntoView({ behavior: 'smooth' });
            };
            reader.readAsDataURL(selectedFiles[0]);
        }
    }

    // -------- Analyze Image --------
    predictButton.addEventListener('click', async function () {
        const patientName = document.getElementById("patientName").value.trim();
        const patientId = document.getElementById("patientId").value.trim();
        const user_id = localStorage.getItem("user_id");

        if (selectedFiles.length === 0) {
            alert("Please select or drop an image first.");
            return;
        }

        if (!patientName || !patientId) {
            alert("Please enter both Patient Name and Patient ID.");
            return;
        }

        predictButton.disabled = true;
        loadingIndicator.style.display = 'flex';

        const formData = new FormData();
        formData.append('file', selectedFiles[0]);
        formData.append('patient_name', patientName);
        formData.append('patient_id', patientId);
        formData.append('user_id', user_id);

        try {
            const response = await fetch(API_BASE_URL + '/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error("Server response was not ok");

            const data = await response.json();

            // Save result and patient info in localStorage
            localStorage.setItem("prediction", data.prediction);
            localStorage.setItem("confidence", data.confidence_percent);
            localStorage.setItem("heatmap", data.heatmap_url);
            localStorage.setItem("report", data.report_url);
            localStorage.setItem("lastPatientName", patientName);

            // Redirect to result page
            window.location.href = "/result-page";

        } catch (error) {
            console.error("Prediction error:", error);
            alert("An error occurred during analysis. Please ensure the backend is running.");
        } finally {
            predictButton.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    });

});
