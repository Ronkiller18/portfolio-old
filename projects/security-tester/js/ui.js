import { escapeHTML } from "./utils/sanitize.js";

export function renderFindings(findings) {
    const results = document.getElementById("results");

    if (findings.length === 0) {
        results.innerHTML = `
            <div class="result low">
                <div class="result-title">
                    <strong>No Major Findings</strong>
                    <span class="risk-badge">SAFE</span>
                </div>

                <p>No obvious client-side security issues detected.</p>
            </div>
        `;

        return;
    }

    let html = "";

    findings.forEach(finding => {
        html += `
            <div class="result ${finding.severity.toLowerCase()}">

                <div class="result-title">
                <div class="finding-meta">

                    <strong>
                        ${escapeHTML(finding.type)}
                    </strong>

                    <small class="finding-source">
                        ${escapeHTML(finding.source || "Scanner")}
                    </small>

                </div>

                    <span class="risk-badge">
                        ${escapeHTML(finding.severity)}
                    </span>
                </div>

                <p>${escapeHTML(finding.description)}</p>

                <small>
                    Confidence: ${finding.confidence}%
                </small>

                <p>
                    <strong>Recommendation:</strong>
                    ${escapeHTML(finding.recommendation)}
                </p>
        `;

        if (finding.payloads && finding.payloads.length > 0){
            html += `<ul>`;

            finding.payloads.forEach(payload => {
                html += `<li>${escapeHTML(payload)}</li>`;
            });

            html += `</ul>`;
        }

        html += `</div>`;
    });

    results.innerHTML = html;
}

export function updateSummary(findings) {

    const findingCount =
        document.getElementById("findingCount");

    const highCount =
        document.getElementById("highCount");

    const riskScore =
        document.getElementById("riskScore");

    findingCount.textContent = findings.length;

    const findingLabel = document.getElementById("findingLabel");

    findingLabel.textContent =
        `${findings.length} Active`;

    const highRiskFindings =
        findings.filter(f => f.severity === "High");

    highCount.textContent =
        highRiskFindings.length;

    let score = 0;

    findings.forEach(finding => {
        if (finding.severity === "High") {
            score += 40;
        }

        else if (finding.severity === "Medium") {
            score += 20;
        }

        else {
            score += 10;
        }
    });

    riskScore.textContent = score;
}

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
    JSON.stringify(data, null, 2)
)}
            </pre>

        </div>
    `;
}