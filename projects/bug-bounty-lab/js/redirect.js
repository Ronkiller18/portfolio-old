function redirectUser() {
    const url = document.getElementById("redirectInput").value;

    // 🚨 VULNERABLE
    window.location.href = url;
}

function safeRedirect() {
    const input = document.getElementById("redirectInput").value;

    try {
        const url = new URL(input);

        // ✅ whitelist allowed domains
        const allowedDomains = ["google.com", "github.com"];

        if (allowedDomains.some(domain => url.hostname.includes(domain))) {
            window.location.href = url.href;
        } else {
            alert("⚠️ Blocked: Untrusted domain");
        }

    } catch (e) {
        alert("❌ Invalid URL");
    }
}