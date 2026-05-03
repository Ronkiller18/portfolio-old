function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
        document.getElementById("message").textContent = "Login successful";
    } else {
        document.getElementById("message").textContent = "Invalid credentials";
    }
}

if (localStorage.getItem("isLoggedIn") === "true") {
    document.getElementById("message").textContent = "User is already logged in";
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    document.getElementById("message").textContent = "Logged out";
}