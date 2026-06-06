// ============================================================
// history.js — Scan history store and rendering
// ============================================================

import { escapeHTML } from "./utils/sanitize.js";

// ---- State ---- (max 20 entries, newest first)
const scanHistory = [];


// ============================================================
// Public API
// ============================================================

export function addToHistory(tool, input, findings) {
    const timestamp = new Date().toLocaleTimeString();

    scanHistory.unshift({ tool, input, findings, timestamp });

    if (scanHistory.length > 20) {
        scanHistory.pop();
    }

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
    const container = document.getElementById("history");
    if (!container) return;

    if (scanHistory.length === 0) {
        container.innerHTML = "";   // CSS :empty handles the empty message
        return;
    }

    container.innerHTML = scanHistory.map(createHistoryCard).join("");
}

function createHistoryCard(scan) {
    // Show the highest severity found, not just high vs everything-else
    const highestSeverity =
        scan.findings.some(f => f.severity === "High")   ? "high"   :
        scan.findings.some(f => f.severity === "Medium") ? "medium" :
        "low";

    return `
        <div class="history-item">
            <div class="history-top">
                <span class="history-time">${scan.timestamp}</span>
                <span class="history-risk ${highestSeverity}">
                    ${scan.findings.length} Findings
                </span>
            </div>
            <div class="history-tool">${escapeHTML(scan.tool)}</div>
            <p class="history-input">${escapeHTML((scan.input || "").slice(0, 60))}</p>
        </div>
    `;
}