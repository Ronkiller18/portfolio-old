// ==========================================================
// Imports
// ==========================================================

import { createFinding }
    from "../utils/createFinding.js";


// ==========================================================
// CSP Analyzer
// ==========================================================

export function analyzeCSP(policy) {

    const findings = [];

    const normalized =
        policy.toLowerCase().trim();

    // ======================================================
    // Basic CSP Validation
    // ======================================================

    const looksLikeCSP =
        /(default-src|script-src|style-src|img-src|object-src|frame-ancestors|connect-src)/i;

    if (!looksLikeCSP.test(normalized)) {
        return [];
    }

    // ======================================================
    // Unsafe Inline Scripts
    // ======================================================

    if (
        normalized.includes("'unsafe-inline'")
    ) {

        findings.push(
            createFinding({

                type:
                    "Unsafe Inline Scripts",

                severity:
                    "High",

                confidence:
                    90,

                description:
                    "CSP allows inline JavaScript execution which weakens XSS protections.",

                recommendation:
                    "Avoid unsafe-inline and use nonce- or hash-based policies."
            })
        );
    }

    // ======================================================
    // Unsafe Eval
    // ======================================================

    if (
        normalized.includes("'unsafe-eval'")
    ) {

        findings.push(
            createFinding({

                type:
                    "Unsafe Eval Usage",

                severity:
                    "High",

                confidence:
                    90,

                description:
                    "unsafe-eval allows dangerous dynamic code execution.",

                recommendation:
                    "Remove unsafe-eval from script-src directives."
            })
        );
    }

    // ======================================================
    // Wildcard Scripts
    // ======================================================

    if (
        normalized.includes("script-src *")
    ) {

        findings.push(
            createFinding({

                type:
                    "Wildcard Script Source",

                severity:
                    "High",

                confidence:
                    85,

                description:
                    "Wildcard script sources allow JavaScript from any domain.",

                recommendation:
                    "Restrict script-src to trusted domains only."
            })
        );
    }

    // ======================================================
    // Wildcard Object Source
    // ======================================================

    if (
        normalized.includes("object-src *")
    ) {

        findings.push(
            createFinding({

                type:
                    "Permissive object-src",

                severity:
                    "Medium",

                confidence:
                    80,

                description:
                    "object-src wildcard may allow unsafe embedded content.",

                recommendation:
                    "Restrict or disable object-src entirely."
            })
        );
    }

    // ======================================================
    // Missing Frame Ancestors
    // ======================================================

    if (
        !normalized.includes(
            "frame-ancestors"
        )
    ) {

        findings.push(
            createFinding({

                type:
                    "Missing frame-ancestors",

                severity:
                    "Medium",

                confidence:
                    75,

                description:
                    "Missing frame-ancestors may increase clickjacking risk.",

                recommendation:
                    "Add frame-ancestors directive to reduce framing risks."
            })
        );
    }

    return findings;
}