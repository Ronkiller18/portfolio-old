// ============================================================
// Imports
// ============================================================

import { escapeHTML } from "./utils/sanitize.js";


// ============================================================
// Findings Rendering
// ============================================================

export function renderFindings(findings) {

    const container =
        document.getElementById("results");

    if (findings.length === 0) {

        container.innerHTML =
            createEmptyState();

        return;
    }

    container.innerHTML =
        findings
            .map(createFindingCard)
            .join("");
}


// ============================================================
// Summary Rendering
// ============================================================

export function updateSummary(findings) {

    const findingCount =
        document.getElementById("findingCount");

    const highCount =
        document.getElementById("highCount");

    const riskScore =
        document.getElementById("riskScore");

    const findingLabel =
        document.getElementById("findingLabel");

    findingCount.textContent =
        findings.length;

    findingLabel.textContent =
        `${findings.length} Active`;

    highCount.textContent =
        findings.filter(
            finding =>
                finding.severity === "High"
        ).length;

    riskScore.textContent =
        calculateRiskScore(findings);
}


// ============================================================
// Tool Output Rendering
// ============================================================

export function renderToolOutput(
    title,
    data
) {

    const container =
        document.getElementById("toolOutput");

    container.innerHTML = `
        <div class="tool-output-card">

            <h5>
                ${escapeHTML(title)}
            </h5>

            <pre>
${escapeHTML(
    JSON.stringify(
        data,
        null,
        2
    )
)}
            </pre>

        </div>
    `;
}


// ============================================================
// Helpers
// ============================================================

function createEmptyState() {

    return `
        <div class="result low">

            <div class="result-title">

                <strong>
                    No Major Findings
                </strong>

                <span class="risk-badge">
                    SAFE
                </span>

            </div>

            <p>
                No obvious client-side security
                issues detected.
            </p>

        </div>
    `;
}

function createFindingCard(finding) {

    return `
        <div class="
            result
            ${finding.severity.toLowerCase()}
        ">

            <div class="result-title">

                <div class="finding-meta">

                    <strong>
                        ${escapeHTML(finding.type)}
                    </strong>

                    <small class="finding-source">
                        ${escapeHTML(
                            finding.source ||
                            "Scanner"
                        )}
                    </small>

                </div>

                <span class="risk-badge">
                    ${escapeHTML(
                        finding.severity
                    )}
                </span>

            </div>

            <p>
                ${escapeHTML(
                    finding.description
                )}
            </p>

            <small>
                Confidence:
                ${finding.confidence}%
            </small>

            <p>

                <strong>
                    Recommendation:
                </strong>

                ${escapeHTML(
                    finding.recommendation
                )}

            </p>

            ${createPayloadList(
                finding.payloads
            )}

        </div>
    `;
}

function createPayloadList(payloads) {

    if (
        !payloads ||
        payloads.length === 0
    ) {
        return "";
    }

    return `
        <ul>

            ${payloads
                .map(
                    payload =>
                        `<li>${escapeHTML(payload)}</li>`
                )
                .join("")}

        </ul>
    `;
}

function calculateRiskScore(findings) {

    let score = 0;

    findings.forEach(finding => {

        switch (
            finding.severity
        ) {

            case "High":
                score += 40;
                break;

            case "Medium":
                score += 20;
                break;

            case "Low":
                score += 10;
                break;
        }
    });

    return score;
}