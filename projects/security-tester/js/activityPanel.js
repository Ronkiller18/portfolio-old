// ============================================================
// activityPanel.js — Collapsible panel behaviour for
// Security Findings and Activity History panels
// ============================================================

export function initializeActivityPanel() {
    const headers = document.querySelectorAll(".collapsible-header");

    headers.forEach(header => {
        const targetId = header.dataset.target;
        const body     = document.getElementById(targetId);
        const icon     = header.querySelector(".collapse-icon");

        if (!body) return;

        header.addEventListener("click", () => {
            const isCollapsed = body.classList.toggle("collapsed");
            if (icon) icon.style.transform = isCollapsed ? "rotate(-90deg)" : "";
        });
    });
}