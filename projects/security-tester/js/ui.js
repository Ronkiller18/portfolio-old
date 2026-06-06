// ============================================================
// ui.js — DOM rendering for findings, summary, tool output
// ============================================================

import { escapeHTML } from "./utils/sanitize.js";


// ============================================================
// Findings Rendering
// ============================================================

export function renderFindings(findings) {
    const container = document.getElementById("results");
    if (!container) return;

    if (findings.length === 0) {
        container.innerHTML = "";   // let CSS :empty pseudo handle the empty state
        return;
    }

    container.innerHTML = findings.map(createFindingCard).join("");
}


// ============================================================
// Summary / Metrics
// ============================================================

export function updateSummary(findings) {
    const findingCount = document.getElementById("findingCount");
    const highCount    = document.getElementById("highCount");
    const riskScore    = document.getElementById("riskScore");
    const findingLabel = document.getElementById("findingLabel");

    if (!findingCount || !highCount || !riskScore || !findingLabel) return;

    findingCount.textContent = findings.length;
    findingLabel.textContent = `${findings.length} Active`;
    highCount.textContent    = findings.filter(f => f.severity === "High").length;
    riskScore.textContent    = calculateRiskScore(findings);
}


// ============================================================
// Tool Output
// ============================================================

export function renderToolOutput(title, data) {
    const container = document.getElementById("toolOutput");
    if (!container) return;

    container.innerHTML = `
        <div class="tool-output-card">
            <div class="tool-output-header">
                <h4>${escapeHTML(title)}</h4>
            </div>
            <pre class="tool-output-content">${escapeHTML(JSON.stringify(data, null, 2))}</pre>
        </div>
    `;
}

export function renderEmptyOutput() {
    const container = document.getElementById("toolOutput");
    if (!container) return;
    container.innerHTML = `<p class="empty-state">Run a tool to view analysis output.</p>`;
}


// ============================================================
// Finding Card
// ============================================================

function createFindingCard(finding) {
    const severity = finding.severity.toLowerCase(); // "high" | "medium" | "low"

    return `
        <article class="finding-card severity-${severity}">

            <div class="finding-card-header">
                <span class="finding-title">${escapeHTML(finding.type)}</span>
                <span class="badge badge-${severity}">${escapeHTML(finding.severity)}</span>
            </div>

            <div class="finding-source">${escapeHTML(finding.source || "Analyzer")}</div>

            <p class="finding-description">${escapeHTML(finding.description)}</p>

            <p class="finding-confidence">Confidence: ${finding.confidence}%</p>

            <p class="finding-recommendation">
                <strong>Recommendation:</strong> ${escapeHTML(finding.recommendation)}
            </p>

            ${createPayloadList(finding.payloads)}

        </article>
    `;
}


// ============================================================
// Payload List
// ============================================================

function createPayloadList(payloads) {
    if (!payloads || payloads.length === 0) return "";

    return `
        <ul class="payload-list">
            ${payloads.map(p => `<li>${escapeHTML(p)}</li>`).join("")}
        </ul>
    `;
}


// ============================================================
// Risk Score Calculator
// ============================================================

function calculateRiskScore(findings) {
    return findings.reduce((score, finding) => {
        switch (finding.severity) {
            case "High":   return score + 40;
            case "Medium": return score + 20;
            case "Low":    return score + 10;
            default:       return score;
        }
    }, 0);
}