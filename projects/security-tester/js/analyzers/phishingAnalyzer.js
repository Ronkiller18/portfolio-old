export function detectPhishing(input) {
    const patterns = [
        /login/i,
        /verify/i,
        /secure/i,
        /account/i,
        /update/i
    ];

    const suspiciousDomain = /\.(xyz|tk|ml|ga|cf)/i;

    let score = 0;

    patterns.forEach(pattern => {
        if (pattern.test(input)) {
            score++;
        }
    });

    if (suspiciousDomain.test(input)) {
        score++;
    }

    if (score < 2) {
        return null;
    }

    return {
        type: "Suspicious URL Pattern",
        severity: "Medium",
        confidence: 65,
        description: "Potential phishing-related wording or suspicious domain detected.",
        recommendation:
            "Verify domains carefully and avoid trusting login/account verification links blindly.",
        payloads: []
    };
}