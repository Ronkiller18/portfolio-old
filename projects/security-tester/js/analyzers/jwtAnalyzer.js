function base64UrlDecode(str) {

    str = str
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    while (str.length % 4) {
        str += "=";
    }

    return atob(str);
}

export function analyzeJWT(token) {

    try {

        const parts = token.split(".");

        if (parts.length !== 3) {
            return {
                error: "Invalid JWT structure."
            };
        }

        const header = JSON.parse(
            base64UrlDecode(parts[0])
        );

        const payload = JSON.parse(
            base64UrlDecode(parts[1])
        );

        const findings = [];

        if (header.alg === "none") {

            findings.push({
                type: "Unsigned JWT",
                severity: "High",
                description:
                    "JWT uses alg:none which disables signature verification."
            });
        }

        if (!payload.exp) {

            findings.push({
                type: "Missing Expiration",
                severity: "Medium",
                description:
                    "JWT does not contain an expiration timestamp."
            });
        }

        if (
            payload.password ||
            payload.secret
        ) {

            findings.push({
                type: "Sensitive Data Exposure",
                severity: "High",
                description:
                    "Sensitive information detected inside JWT payload."
            });
        }

        return {
            header,
            payload,
            findings
        };

    }

    catch (error) {

        return {
            error: "Failed to decode JWT."
        };
    }
}