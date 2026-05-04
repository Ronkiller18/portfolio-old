// ==========================
// 1. DOM ELEMENTS
// ==========================
const messageBox = document.getElementById("message");
const exploitBtn = document.getElementById("autoExploitBtn");
const resetBtn = document.getElementById("resetExploitBtn");

// ==========================
// 2. LOGIN FUNCTION (VULNERABLE)
// ==========================
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("isLoggedIn", "true");

        if (messageBox) {
            messageBox.textContent = "Login successful";
            messageBox.style.color = "lightgreen";
        }

        // Redirect (simulating access to protected page)
        window.location.href = "dashboard.html";

    } else {
        if (messageBox) {
            messageBox.textContent = "Invalid credentials";
            messageBox.style.color = "red";
        }
    }
}

// ==========================
// 3. SESSION CHECK (INSECURE)
// ==========================
if (messageBox && localStorage.getItem("isLoggedIn") === "true") {
    messageBox.textContent = "User is already logged in (session exists)";
    messageBox.style.color = "orange";
}

// ==========================
// 4. LOGOUT FUNCTION
// ==========================
function logout() {
    localStorage.removeItem("isLoggedIn");

    if (messageBox) {
        messageBox.textContent = "Logged out";
        messageBox.style.color = "white";
    }
}

// ==========================
// 5. EXPLOIT BUTTON (ATTACK SIMULATION)
// ==========================
if (exploitBtn && messageBox) {
    exploitBtn.addEventListener("click", () => {
        localStorage.setItem("isLoggedIn", "true");

        messageBox.textContent =
            "⚠️ Exploit successful: Session manually set in localStorage";
        messageBox.style.color = "orange";
    });
}

// ==========================
// 6. RESET BUTTON (TESTING LOOP)
// ==========================
if (resetBtn && messageBox) {
    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");

        messageBox.textContent =
            "Session cleared. You are logged out.";
        messageBox.style.color = "white";
    });
}