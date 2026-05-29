export function analyzeCSP(policy) {

    const findings = [];

    const normalized =
        policy.toLowerCase();

    if (
        normalized.includes("'unsafe-inline'")
    ) {

        findings.push({
            type: "Unsafe Inline Scripts",

            severity: "High",

            description:
                "CSP allows inline JavaScript execution which weakens XSS protections.",

            confidence: 90,

            recommendation:
                "Avoid unsafe-inline and use nonce- or hash-based policies.",

            payloads: []
        });
    }

    if (
        normalized.includes("'unsafe-eval'")
    ) {

        findings.push({
            type: "Unsafe Eval Usage",

            severity: "High",

            description:
                "unsafe-eval allows dangerous dynamic code execution.",

            confidence: 90,

            recommendation:
                "Remove unsafe-eval from script-src directives.",

            payloads: []
        });
    }

    if (
        normalized.includes("script-src *")
    ) {

        findings.push({
            type: "Wildcard Script Source",

            severity: "High",

            description:
                "Wildcard script sources allow JavaScript from any domain.",

            confidence: 85,

            recommendation:
                "Restrict script-src to trusted domains only.",

            payloads: []
        });
    }

    if (
        normalized.includes("object-src *")
    ) {

        findings.push({
            type: "Permissive object-src",

            severity: "Medium",

            description:
                "object-src wildcard may allow unsafe embedded content.",

            confidence: 80,

            recommendation:
                "Restrict or disable object-src entirely.",

            payloads: []
        });
    }

    if (
        !normalized.includes("frame-ancestors")
    ) {

        findings.push({
            type: "Missing frame-ancestors",

            severity: "Medium",

            description:
                "Missing frame-ancestors may increase clickjacking risk.",

            confidence: 75,

            recommendation:
                "Add frame-ancestors directive to reduce framing risks.",

            payloads: []
        });
    }

    return findings;
}