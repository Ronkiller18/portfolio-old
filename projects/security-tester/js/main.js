import { detectXSS } from "./analyzers/xssAnalyzer.js";
import { detectDOMRisk } from "./analyzers/domAnalyzer.js";
import { detectPhishing } from "./analyzers/phishingAnalyzer.js";
import { analyzeJWT } from "./analyzers/jwtAnalyzer.js";
import { analyzeCSP } from "./analyzers/cspAnalyzer.js";
import { addToHistory } from "./history.js";

import {
    renderFindings,
    updateSummary,
    renderToolOutput
} from "./ui.js";

import {
    clearFindings,
    addFindings,
    getFindings
} from "./findings.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const decodeJwtBtn = document.getElementById("decodeJwtBtn");
const analyzeCspBtn = document.getElementById("analyzeCspBtn");

analyzeBtn.addEventListener("click", runAnalysis);
decodeJwtBtn.addEventListener("click", handleJWTDecode);
analyzeCspBtn.addEventListener("click", handleCSPAnalysis);

function runAnalysis() {

    clearFindings();

    const input =
        document.getElementById("inputData").value;

    const analyzers = [
        detectXSS,
        detectDOMRisk,
        detectPhishing
    ];

    analyzers.forEach(analyzer => {

        const result = analyzer(input);

        if (result) {

            addFindings(
                "Security Scanner",
                [result]
            );
        }
    });

    const findings = getFindings();

    renderFindings(findings);

    updateSummary(findings);

    addToHistory(input, findings);
}

function handleJWTDecode() {

    const token =
        document.getElementById("jwtInput").value;

    if (!token.trim()) {

        clearFindings();

        renderFindings([]);

        updateSummary([]);

        renderToolOutput(
            "JWT Decoder",
            {
                message:
                    "Paste a JWT token to inspect decoded data."
            }
        );

        return;
    }

    clearFindings();

    const result =
        analyzeJWT(token);

    if (result.error) {

        addFindings(
            "JWT Analyzer",
            [
                {
                    type: "JWT Error",

                    severity: "Medium",

                    description:
                        result.error,

                    confidence: 100,

                    recommendation:
                        "Ensure JWT format is valid.",

                    payloads: []
                }
            ]
        );
    }

    else {

        renderToolOutput(
            "Decoded JWT",
            {
                header: result.header,
                payload: result.payload
            }
        );

        addFindings(
            "JWT Analyzer",
            result.findings
        );
    }

    const findings =
        getFindings();

    renderFindings(findings);

    updateSummary(findings);
}

function handleCSPAnalysis() {

    const policy =
        document.getElementById("cspInput").value;

    if (!policy.trim()) {

        clearFindings();

        renderFindings([]);

        updateSummary([]);

        renderToolOutput(
            "CSP Analyzer",
            {
                message:
                    "Paste a CSP policy to inspect directives."
            }
        );

        return;
    }

    clearFindings();

    const findings =
        analyzeCSP(policy);

    renderToolOutput(
        "Parsed CSP Policy",
        {
            policy
        }
    );

    addFindings(
        "CSP Analyzer",
        findings
    );

    const allFindings =
        getFindings();

    renderFindings(allFindings);

    updateSummary(allFindings);
}