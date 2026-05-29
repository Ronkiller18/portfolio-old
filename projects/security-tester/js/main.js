import { detectXSS } from "./analyzers/xssAnalyzer.js";
import { detectDOMRisk } from "./analyzers/domAnalyzer.js";
import { detectPhishing } from "./analyzers/phishingAnalyzer.js";
import { analyzeJWT } from "./analyzers/jwtAnalyzer.js";
import { addToHistory } from "./history.js";

import {
    renderFindings,
    updateSummary,
    renderJWTResults
} from "./ui.js";

const analyzeBtn = document.getElementById("analyzeBtn");
const decodeJwtBtn = document.getElementById("decodeJwtBtn");

analyzeBtn.addEventListener("click", runAnalysis);
decodeJwtBtn.addEventListener("click", handleJWTDecode);

function runAnalysis() {
    const input = document.getElementById("inputData").value;

    const findings = [];

    const analyzers = [
        detectXSS,
        detectDOMRisk,
        detectPhishing
    ];

    analyzers.forEach(analyzer => {
        const result = analyzer(input);

        if (result) {
            findings.push(result);
        }
    });

    renderFindings(findings);

    updateSummary(findings);

    addToHistory(input, findings);

}

function handleJWTDecode() {

    const token =
        document.getElementById("jwtInput").value;

    const result =
        analyzeJWT(token);

    renderJWTResults(result);
}