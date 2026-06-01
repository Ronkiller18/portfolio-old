// ==========================================================
// Imports
// ==========================================================

import { createFinding }
    from "../utils/createFinding.js";


// ==========================================================
// DOM Sink Detection
// ==========================================================

export function detectDOMRisk(input) {

    const patterns = [
        /innerHTML\s*=/i,
        /outerHTML\s*=/i,
        /document\.write\s*\(/i,
        /insertAdjacentHTML\s*\(/i,
        /eval\s*\(/i
    ];

    const matched =
        patterns.some(pattern =>
            pattern.test(input)
        );

    if (!matched) {
        return null;
    }

    return createFinding({

        type:
            "Unsafe DOM Manipulation",

        severity:
            "High",

        confidence:
            90,

        description:
            "Potentially dangerous DOM sink detected.",

        recommendation:
            "Use textContent or safe templating instead of unsafe HTML injection methods.",

        payloads: [
            "element.innerHTML = userInput",
            "document.write(userData)",
            "eval(userInput)"
        ]
    });
}