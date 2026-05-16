// ===========================================================
// Scan History Storage
// ===========================================================

let scanHistory = [];

// ===========================================================
// Utility
// ===========================================================

function getCurrentTime() {

    return new Date().toLocaleTimeString();
}

// ===========================================================
// Detection Engine
// ===========================================================

function analyzeRequest() {

    const input =
        document.getElementById("requestBox").value.trim();

    const status =
        document.getElementById("scanStatus");

    // Prevent empty scans
    if (!input) {

        if (status) {
            status.textContent = "⚪ No input";
        }

        renderResults([]);

        return;
    }

    if (status) {
        status.textContent = "🔍 Scanning...";
    }

    setTimeout(() => {

        let findings = [];

        // ===================================================
        // XSS Detection
        // ===================================================

        if (
            /<script[\s\S]*?>/i.test(input) ||
            /on\w+\s*=/i.test(input) ||
            /javascript:/i.test(input)
        ) {

            findings.push({
                type: "XSS",
                severity: "High",
                message: "Script injection pattern detected"
            });
        }

        // ===================================================
        // Open Redirect Detection
        // ===================================================

        if (
            /redirect\s*=/i.test(input) ||
            /url\s*=/i.test(input)
        ) {

            findings.push({
                type: "Open Redirect",
                severity: "Medium",
                message: "Suspicious redirect parameter"
            });
        }

        // ===================================================
        // Dangerous DOM APIs
        // ===================================================

        if (
            /innerHTML\s*=/i.test(input) ||
            /document\.write/i.test(input) ||
            /eval\s*\(/i.test(input)
        ) {

            findings.push({
                type: "DOM Risk",
                severity: "High",
                message: "Unsafe DOM manipulation"
            });
        }

        // ===================================================
        // Render + Save
        // ===================================================

        renderResults(findings);

        saveScanToHistory(findings);

        // ===================================================
        // Status
        // ===================================================

        if (status) {

            status.textContent =
                findings.length > 0
                    ? "⚠️ Vulnerabilities Found"
                    : "✅ Clean";
        }

    }, 500);
}

// ===========================================================
// Render Scan Results
// ===========================================================

function renderResults(findings) {

    const container =
        document.getElementById("scannerResults");

    if (!container) return;

    // No issues found
    if (findings.length === 0) {

        container.innerHTML =
            "<p class='safe'>✅ No issues detected</p>";

        return;
    }

    let html = "";

    findings.forEach(f => {

        html += `
            <div class="scan-card ${f.severity.toLowerCase()}">

                <div class="scan-header">

                    <span class="scan-type">
                        ${f.type}
                    </span>

                    <span class="scan-severity">
                        ${f.severity}
                    </span>

                </div>

                <p>${f.message}</p>

            </div>
        `;
    });

    container.innerHTML = html;
}

// ===========================================================
// Save Scan History
// ===========================================================

function saveScanToHistory(findings) {

    scanHistory.unshift({

        time: getCurrentTime(),

        findings: findings
    });

    renderScanHistory();
}

// ===========================================================
// Render History
// ===========================================================

function renderScanHistory() {

    const container =
        document.getElementById("scanHistory");

    if (!container) return;

    // Empty history
    if (scanHistory.length === 0) {

        container.innerHTML =
            "<p class='placeholder'>No scan history yet</p>";

        return;
    }

    let html = "";

    scanHistory.forEach(scan => {

        const count =
            scan.findings.length;

        const severity =
            scan.findings.some(
                f => f.severity === "High"
            )
                ? "high"
                : "medium";

        html += `
            <div class="history-card ${severity}">

                <div class="history-header">

                    <span>
                        ${scan.time}
                    </span>

                    <span>
                        ${count} finding${count !== 1 ? "s" : ""}
                    </span>

                </div>

            </div>
        `;
    });

    container.innerHTML = html;
}