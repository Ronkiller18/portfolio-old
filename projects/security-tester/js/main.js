// ======================================================
// Imports
// ======================================================

import { detectXSS } from "./analyzers/xssAnalyzer.js";
import { detectDOMRisk } from "./analyzers/domAnalyzer.js";
import { detectPhishing } from "./analyzers/phishingAnalyzer.js";
import { analyzeJWT } from "./analyzers/jwtAnalyzer.js";
import { analyzeCSP } from "./analyzers/cspAnalyzer.js";

import { addToHistory } from "./history.js";
import { initializeActivityPanel } from "./activityPanel.js";
import { exportResults } from "./export.js";

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


// ======================================================
// DOM Elements
// ======================================================

const elements = {

    inputData:
        document.getElementById("inputData"),

    jwtInput:
        document.getElementById("jwtInput"),

    cspInput:
        document.getElementById("cspInput"),

    analyzeBtn:
        document.getElementById("analyzeBtn"),

    clearBtn:
        document.getElementById("clearBtn"),

    decodeJwtBtn:
        document.getElementById("decodeJwtBtn"),

    analyzeCspBtn:
        document.getElementById("analyzeCspBtn"),

    exportBtn:
        document.getElementById("exportBtn")
};


// ======================================================
// Initialization
// ======================================================

initializeActivityPanel();


// ======================================================
// Event Listeners
// ======================================================

elements.analyzeBtn.addEventListener(
    "click",
    runAnalysis
);

elements.clearBtn.addEventListener(
    "click",
    clearDashboard
);

elements.decodeJwtBtn.addEventListener(
    "click",
    handleJWTDecode
);

elements.analyzeCspBtn.addEventListener(
    "click",
    handleCSPAnalysis
);

elements.exportBtn.addEventListener(
    "click",
    exportResults
);


// ======================================================
// Dashboard Helpers
// ======================================================

function refreshDashboard() {

    const findings =
        getFindings();

    renderFindings(findings);

    updateSummary(findings);

    return findings;
}

function resetDashboard() {

    clearFindings();

    renderFindings([]);

    updateSummary([]);
}


// ======================================================
// Security Scanner
// ======================================================

function runAnalysis() {

    const input =
        elements.inputData.value.trim();

    if (!input) {
        return;
    }

    clearFindings();

    const analyzers = [
        detectXSS,
        detectDOMRisk,
        detectPhishing
    ];

    analyzers.forEach(analyzer => {

        const result =
            analyzer(input);

        if (result) {

            addFindings(
                "Security Scanner",
                [result]
            );
        }
    });

    const findings =
        refreshDashboard();

    if (findings.length > 0) {

        addToHistory(
            "Security Scanner",
            input,
            findings
        );
    }
}


// ======================================================
// JWT Analyzer
// ======================================================

function handleJWTDecode() {

    const token =
        elements.jwtInput.value.trim();

    if (!token) {

        resetDashboard();

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
        refreshDashboard();

    addToHistory(
        "JWT Analyzer",
        token,
        findings
    );
}


// ======================================================
// CSP Analyzer
// ======================================================

function handleCSPAnalysis() {

    const policy =
        elements.cspInput.value.trim();

    if (!policy) {

        resetDashboard();

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
        refreshDashboard();

    addToHistory(
        "CSP Analyzer",
        policy,
        allFindings
    );
}


// ======================================================
// Dashboard Utilities
// ======================================================

function clearDashboard() {

    elements.inputData.value = "";

    elements.jwtInput.value = "";

    elements.cspInput.value = "";

    resetDashboard();

    renderToolOutput(
        "Security Dashboard",
        {
            message:
                "All inputs and findings cleared."
        }
    );
}