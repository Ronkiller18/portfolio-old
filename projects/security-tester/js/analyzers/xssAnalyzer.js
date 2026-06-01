// ==========================================================
// Imports
// ==========================================================

import { createFinding }
    from "../utils/createFinding.js";


// ==========================================================
// XSS Detection
// ==========================================================

export function detectXSS(input) {

    const patterns = [

        /<script[\s\S]*?>[\s\S]*?<\/script>/i,

        /<[^>]+on\w+\s*=/i,

        /onerror\s*=/i,

        /onload\s*=/i,

        /javascript\s*:/i
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
            "Cross-Site Scripting (XSS)",

        severity:
            "High",

        confidence:
            85,

        description:
            "Potential client-side script injection pattern detected.",

        recommendation:
            "Avoid unsafe HTML rendering and sanitize untrusted input before inserting untrusted content into the DOM.",

        payloads: [
            "<script>alert(1)</script>",
            "<img src=x onerror=alert(1)>",
            "<svg onload=alert(1)>"
        ]
    });
}