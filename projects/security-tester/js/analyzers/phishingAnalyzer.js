// ==========================================================
// Imports
// ==========================================================

import { createFinding }
    from "../utils/createFinding.js";


// ==========================================================
// Phishing URL Detection
// ==========================================================

export function detectPhishing(input) {

    const phishingKeywords = [
        /login/i,
        /verify/i,
        /secure/i,
        /account/i,
        /update/i
    ];

    const suspiciousDomains =
        /\.(xyz|tk|ml|ga|cf)/i;

    const looksLikeUrl =
        /https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,}/i;

    if (!looksLikeUrl.test(input)) {
        return null;
    }

    let score = 0;

    phishingKeywords.forEach(pattern => {

        if (pattern.test(input)) {
            score++;
        }
    });

    if (
        suspiciousDomains.test(input)
    ) {
        score++;
    }

    if (score < 2) {
        return null;
    }

    return createFinding({

        type:
            "Suspicious URL Pattern",

        severity:
            "Medium",

        confidence:
            65,

        description:
            "Potential phishing-related wording or suspicious domain detected.",

        recommendation:
            "Verify domains carefully before entering credentials or sensitive information.",

        payloads: [
            "https://secure-login-update.xyz",
            "https://verify-account-now.tk"
        ]
    });
}