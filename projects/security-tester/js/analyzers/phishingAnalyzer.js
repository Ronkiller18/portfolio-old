// ============================================================
// phishingAnalyzer.js — Phishing URL detection
// Returns: Finding[] (empty array = no match)
// ============================================================

import { createFinding } from "../utils/createFinding.js";

const PHISHING_KEYWORDS = [
    /login/i,
    /verify/i,
    /secure/i,
    /account/i,
    /update/i
];

const SUSPICIOUS_TLDS = /\.(xyz|tk|ml|ga|cf)/i;

// Anchored to start — avoids false matches on code like element.innerHTML
const LOOKS_LIKE_URL = /^https?:\/\/|^www\./i;

export function detectPhishing(input) {
    if (!LOOKS_LIKE_URL.test(input)) return [];    // always return array

    let score = 0;

    PHISHING_KEYWORDS.forEach(pattern => {
        if (pattern.test(input)) score++;
    });

    if (SUSPICIOUS_TLDS.test(input)) score++;

    // Require at least 2 signals to reduce false positives on
    // legitimate sites that happen to use keywords like "secure" or "login"
    if (score < 2) return [];

    return [
        createFinding({
            type:           "Suspicious URL Pattern",
            severity:       "Medium",
            confidence:     65,
            description:    "Potential phishing-related wording or suspicious domain detected.",
            recommendation: "Verify domains carefully before entering credentials or sensitive information.",
            payloads: [
                "https://secure-login-update.xyz",
                "https://verify-account-now.tk"
            ]
        })
    ];
}