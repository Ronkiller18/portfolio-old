// ============================================================
// Imports
// ============================================================

import { getFindings } from "./findings.js";


// ============================================================
// Public API
// ============================================================

export function exportResults() {

    const findings =
        getFindings();

    if (findings.length === 0) {

        alert(
            "No findings available to export."
        );

        return;
    }

    const report =
        createExportReport(findings);

    downloadJSON(
        report,
        createFileName()
    );
}


// ============================================================
// Report Builder
// ============================================================

function createExportReport(findings) {

    return {

        exportedAt:
            new Date().toISOString(),

        totalFindings:
            findings.length,

        findings
    };
}


// ============================================================
// Download Helpers
// ============================================================

function downloadJSON(data, filename) {

    const blob = new Blob(
        [
            JSON.stringify(
                data,
                null,
                2
            )
        ],
        {
            type: "application/json"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);
}

function createFileName() {

    const timestamp =
        new Date()
            .toISOString()
            .replace(/:/g, "-");

    return `
security-report-${timestamp}.json
    `.trim();
}