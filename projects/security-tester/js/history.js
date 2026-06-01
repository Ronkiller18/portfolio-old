// ============================================================
// Imports
// ============================================================

import { escapeHTML } from "./utils/sanitize.js";


// ============================================================
// State
// ============================================================

const scanHistory = [];


// ============================================================
// Public API
// ============================================================

export function addToHistory(
    tool,
    input,
    findings
) {

    const timestamp =
        new Date().toLocaleTimeString();

    scanHistory.unshift({
        tool,
        input,
        findings,
        timestamp
    });

    renderHistory();
}

export function getHistory() {

    return scanHistory;
}

export function clearHistory() {

    scanHistory.length = 0;

    renderHistory();
}


// ============================================================
// Rendering
// ============================================================

function renderHistory() {

    const container =
        document.getElementById("history");

    if (!container) {
        return;
    }

    if (scanHistory.length === 0) {

        container.innerHTML = `
            <p class="empty-history">
                No scans performed yet.
            </p>
        `;

        return;
    }

    container.innerHTML =
        scanHistory
            .map(createHistoryCard)
            .join("");
}

function createHistoryCard(scan) {

    const highRisk =
        scan.findings.some(
            finding =>
                finding.severity === "High"
        );

        return `
            <div class="history-item">

                <div class="history-top">

                    <span class="history-time">
                        ${scan.timestamp}
                    </span>

                    <span
                        class="
                            history-risk
                            ${highRisk ? "high" : "low"}
                        "
                    >
                        ${scan.findings.length} Findings
                    </span>

                </div>

                <div class="history-tool">
                    ${escapeHTML(scan.tool)}
                </div>

                <p class="history-input">
                    ${escapeHTML(
                        scan.input.slice(0, 60)
                    )}
                </p>

            </div>
        `;
}