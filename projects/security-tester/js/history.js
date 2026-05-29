import { escapeHTML } from "./utils/sanitize.js";

const scanHistory = [];

export function addToHistory(input, findings) {

    const timestamp =
        new Date().toLocaleTimeString();

    scanHistory.unshift({
        input,
        findings,
        timestamp
    });

    if (scanHistory.length > 5) {
        scanHistory.pop();
    }

    renderHistory();
}

function renderHistory() {

    const historyContainer =
        document.getElementById("history");

    const historyCount =
        document.getElementById("historyCount");

    historyCount.textContent =
        `${scanHistory.length} Scans`;

    if (scanHistory.length === 0) {

        historyContainer.innerHTML = `
            <p class="empty-history">
                No scans performed yet.
            </p>
        `;

        return;
    }

    let html = "";

    scanHistory.forEach(scan => {

        const highRisk =
            scan.findings.some(
                finding => finding.severity === "High"
            );

        html += `
            <div class="history-item">

                <div class="history-top">

                    <span class="history-time">
                        ${scan.timestamp}
                    </span>

                    <span class="
                        history-risk
                        ${highRisk ? "high" : "low"}
                    ">
                        ${highRisk ? "HIGH RISK" : "LOW RISK"}
                    </span>

                </div>

                <p class="history-input">
                    ${escapeHTML(scan.input.slice(0, 80))}
                </p>

            </div>
        `;
    });

    historyContainer.innerHTML = html;
}