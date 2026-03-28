
async function loadStats() {
    try {
        const res = await fetch(API_BASE_URL + "/stats-details");
        const data = await res.json();

        // Pie Chart
        const labels = data.prediction_counts.map(item => item[0]);
        const values = data.prediction_counts.map(item => item[1]);

        new Chart(document.getElementById("pieChart"), {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });

        // Line Chart
        const dates = data.daily_predictions.map(item => item[0]);
        const counts = data.daily_predictions.map(item => item[1]);

        new Chart(document.getElementById("lineChart"), {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: "Predictions per Day",
                    data: counts,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error loading stats details:", error);
    }
}

loadStats();
