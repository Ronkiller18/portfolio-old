import {
    hasLoginSession,
    getSessionMode
} from "./storage.js";

export function protectDashboardRoute() {

    const currentMode =
        getSessionMode();

    // ==========================
    // VULNERABLE MODE
    // ==========================
    if (currentMode === "vulnerable") {

        console.log(
            "[VULNERABLE MODE] Route protection disabled."
        );

        return;
    }

    // ==========================
    // SECURE MODE
    // ==========================
    if (currentMode === "secure") {

        const authenticated =
            hasLoginSession();

        // User NOT authenticated
        if (!authenticated) {

            window.location.href = "index.html?error=unauthorized";
        }
    }
}