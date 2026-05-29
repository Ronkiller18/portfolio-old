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
                    <strong>${escapeHTML(finding.type)}</strong>

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

        if (finding.payloads.length > 0) {
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

export function renderJWTResults(result) {

    const container =
        document.getElementById("jwtResults");

    if (result.error) {

        container.innerHTML = `
            <div class="result medium">
                <p>${result.error}</p>
            </div>
        `;

        return;
    }

    let findingsHTML = "";

    result.findings.forEach(finding => {

        findingsHTML += `
            <div class="result ${finding.severity.toLowerCase()}">

                <div class="result-title">
                    <strong>${finding.type}</strong>

                    <span class="risk-badge">
                        ${finding.severity}
                    </span>
                </div>

                <p>${finding.description}</p>

            </div>
        `;
    });

    container.innerHTML = `
        <div class="jwt-output">

            <h4>Header</h4>

            <pre>
${JSON.stringify(result.header, null, 2)}
            </pre>

            <h4>Payload</h4>

            <pre>
${JSON.stringify(result.payload, null, 2)}
            </pre>

            ${findingsHTML}

        </div>
    `;
}