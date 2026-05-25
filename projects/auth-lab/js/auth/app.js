import {
    setLoginSession,
    removeLoginSession,
    hasLoginSession,
    setSessionId,
    getSessionId,
    setSessionMode,
    getSessionMode
} from "./storage.js";

import { showMessage } from "./ui.js";
import { validateLogin } from "./auth.js";
import { analyzePasswordStrength } from "./password-checker.js";
import { generateSessionId } from "./session.js";

// ==========================
// DOM ELEMENTS
// ==========================
const messageBox = document.getElementById("message");
const exploitBtn = document.getElementById("autoExploitBtn");
const resetBtn = document.getElementById("resetExploitBtn");
const fixateSessionBtn = document.getElementById("fixateSessionBtn");
const loginForm = document.getElementById("loginForm");
const passwordInput =
    document.getElementById("password");

const passwordStrength =
    document.getElementById("passwordStrength");

const passwordFeedback =
    document.getElementById("passwordFeedback");

const sessionModeInputs = document.querySelectorAll('input[name="sessionMode"]');

// ==========================
// GET CURRENT SESSION MODE
// ==========================
function getCurrentSessionMode() {

    let selectedMode = "vulnerable";

    sessionModeInputs.forEach(input => {

        if (input.checked) {
            selectedMode = input.value;
        }
    });

    return selectedMode;
}

// ==========================
// LOGIN HANDLER
// ==========================
if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const isValid = validateLogin(username, password);

        if (isValid) {

            setLoginSession();

            const currentMode = getCurrentSessionMode();

            setSessionMode(currentMode);    

            let sessionId = getSessionId();

            // ==========================
            // VULNERABLE MODE
            // ==========================
            if (currentMode === "vulnerable") {

                // Reuse attacker-controlled session
                if (!sessionId) {

                    sessionId = generateSessionId();

                    setSessionId(sessionId);
                }
            }

            // ==========================
            // SECURE MODE
            // ==========================
            if (currentMode === "secure") {

                // Regenerate session after login
                sessionId = generateSessionId();

                setSessionId(sessionId);
            }

            showMessage(
                messageBox,
                `Login successful | Session: ${sessionId}`,
                "lightgreen"
            );

            window.location.href = "dashboard.html";
        } else {
            showMessage(
                messageBox,
                "Invalid credentials",
                "red"
            );
        }
    });
}

// ==========================
// SESSION CHECK
// ==========================
if (messageBox && hasLoginSession()) {
    showMessage(
        messageBox,
        "User is already logged in (session exists)",
        "orange"
    );
}

// ==========================
// EXPLOIT BUTTON
// ==========================
if (exploitBtn) {
    exploitBtn.addEventListener("click", () => {

        setLoginSession();

        showMessage(
            messageBox,
            "⚠️ Exploit successful: Session manually set in localStorage",
            "orange"
        );
    });
}

// ==========================
// RESET BUTTON
// ==========================
if (resetBtn) {
    resetBtn.addEventListener("click", () => {

        removeLoginSession();

        showMessage(
            messageBox,
            "Session cleared. You are logged out.",
            "white"
        );
    });
}

// ==========================
// PASSWORD STRENGTH ANALYSIS
// ==========================
if (
    passwordInput &&
    passwordStrength &&
    passwordFeedback
) {
    passwordInput.addEventListener("input", () => {

        const result =
            analyzePasswordStrength(passwordInput.value);

        // Strength label
        passwordStrength.textContent =
            `Strength: ${result.strength}`;

        passwordStrength.className =
            `password-strength ${result.className}`;

        // Feedback list
        passwordFeedback.innerHTML = "";

        result.feedback.forEach(item => {

            const li = document.createElement("li");

            li.textContent = item;

            passwordFeedback.appendChild(li);
        });
    });
}

// ==========================
// SESSION FIXATION EXPLOIT
// ==========================
if (fixateSessionBtn) {

    fixateSessionBtn.addEventListener("click", () => {

        const attackerSession =
            "attacker-session-123";

        setSessionId(attackerSession);

        showMessage(
            messageBox,
            `Session fixed to: ${attackerSession}`,
            "orange"
        );
    });
}

// ==========================
// SESSION DISPLAY
// ==========================
const sessionDisplay =
    document.getElementById("sessionDisplay");

const sessionRiskBadge =
    document.getElementById("sessionRiskBadge");

const sessionWarning =
    document.getElementById("sessionWarning");

if (
    sessionDisplay &&
    sessionRiskBadge &&
    sessionWarning
) {
    const activeSession = getSessionId();

    const currentMode = getSessionMode();

    sessionDisplay.textContent =
        activeSession || "No active session";

    // ==========================
    // VULNERABLE MODE
    // ==========================
    if (currentMode === "vulnerable") {

        sessionRiskBadge.textContent =
            "HIGH RISK";

        sessionRiskBadge.classList.add("high");

        sessionWarning.textContent =
            "Session ID was NOT regenerated after login. " +
            "An attacker who knows this value may hijack the session.";
    }

    // ==========================
    // SECURE MODE
    // ==========================
    if (currentMode === "secure") {

        sessionRiskBadge.textContent =
            "LOW RISK";

        sessionRiskBadge.classList.add("low");

        sessionWarning.textContent =
            "Session ID was regenerated after login. " +
            "Previously fixed attacker sessions become invalid.";
    }
}