
async function login() {
    const userVal = document.getElementById("username").value;
    const passVal = document.getElementById("password").value;

    if (!userVal || !passVal) {
        alert("Please enter both username and password");
        return;
    }

    const formData = new FormData();
    formData.append("username", userVal);
    formData.append("password", passVal);

    try {
        const res = await fetch(API_BASE_URL + "/login", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.status === "success") {
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("role", data.role);

            if (data.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } else {
            alert("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Connection error. Is the backend running?");
    }
}

async function register() {
    const userVal = document.getElementById("regUser").value;
    const passVal = document.getElementById("regPass").value;

    if (!userVal || !passVal) {
        alert("Please enter both username and password");
        return;
    }

    const formData = new FormData();
    formData.append("username", userVal);
    formData.append("password", passVal);

    try {
       const res = await fetch(API_BASE_URL + "/register", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.status === "registered") {
            alert("Registration successful! You can now login.");
            toggleAuth(); // Switch back to login form
        } else {
            alert(data.message || "User already exists or registration failed.");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Connection error. Is the backend running?");
    }
}
