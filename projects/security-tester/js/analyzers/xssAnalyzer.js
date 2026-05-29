export function detectXSS(input) {
    const patterns = [
        /<script[\s\S]*?>[\s\S]*?<\/script>/i,
        /<[^>]+on\w+\s*=/i,
        /onerror\s*=/i,
        /javascript\s*:/i,
        /<img[\s\S]*?>/i,
        /<svg[\s\S]*?>/i
    ];

    const matched = patterns.some(pattern => pattern.test(input));

    if (!matched) {
        return null;
    }

    return {
        type: "Cross-Site Scripting (XSS)",
        severity: "High",
        confidence: 85,
        description: "Potential client-side script injection pattern detected.",
        recommendation:
            "Avoid unsafe HTML rendering and sanitize untrusted input before inserting into the DOM.",
        payloads: [
            "<script>alert(1)</script>",
            "<img src=x onerror=alert(1)>",
            "<svg onload=alert(1)>"
        ]
    };
}