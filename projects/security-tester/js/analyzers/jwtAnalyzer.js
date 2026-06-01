// ==========================================================
// Imports
// ==========================================================

import { createFinding }
    from "../utils/createFinding.js";


// ==========================================================
// Helpers
// ==========================================================

function base64UrlDecode(str) {

    str = str
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    while (str.length % 4) {
        str += "=";
    }

    return atob(str);
}


// ==========================================================
// JWT Analysis
// ==========================================================

export function analyzeJWT(token) {

    try {

        const parts = token.split(".");

        if (parts.length !== 3) {

            return {
                error:
                    "Invalid JWT structure."
            };
        }

        const header = JSON.parse(
            base64UrlDecode(parts[0])
        );

        const payload = JSON.parse(
            base64UrlDecode(parts[1])
        );

        const findings = [];

        // ==================================================
        // Unsigned JWT
        // ==================================================

        if (header.alg === "none") {

            findings.push(
                createFinding({

                    type:
                        "Unsigned JWT",

                    severity:
                        "High",

                    confidence:
                        95,

                    description:
                        "JWT uses alg:none which disables signature verification.",

                    recommendation:
                        "Always enforce signed JWTs using RS256 or HS256."
                })
            );
        }

        // ==================================================
        // Missing Expiration
        // ==================================================

        if (!payload.exp) {

            findings.push(
                createFinding({

                    type:
                        "Missing Expiration",

                    severity:
                        "Medium",

                    confidence:
                        85,

                    description:
                        "JWT does not contain an expiration timestamp.",

                    recommendation:
                        "Add exp claims to reduce replay and token abuse risks."
                })
            );
        }

        // ==================================================
        // Sensitive Data Exposure
        // ==================================================

        const payloadKeys =
            Object.keys(payload)
                .join(" ")
                .toLowerCase();

        const sensitivePattern =
            /(password|passwd|secret|apikey|api_key|tokensecret)/i;

        if (
            sensitivePattern.test(
                payloadKeys
            )
        ) {

            findings.push(
                createFinding({

                    type:
                        "Sensitive Data Exposure",

                    severity:
                        "High",

                    confidence:
                        90,

                    description:
                        "Sensitive information detected inside JWT payload.",

                    recommendation:
                        "Avoid storing passwords, API keys, secrets, or sensitive internal data inside JWTs."
                })
            );
        }

        return {
            header,
            payload,
            findings
        };
    }

    catch {

        return {
            error:
                "Failed to decode JWT."
        };
    }
}