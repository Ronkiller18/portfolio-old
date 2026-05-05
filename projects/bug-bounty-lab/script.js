// unsafe
let comments = [];

function addComment() {
    const input = document.getElementById("commentInput").value;

    // store input
    comments.push(input);

    displayComments();
}

function displayComments() {
    const container = document.getElementById("comments");

    let html = "";

    comments.forEach(comment => {
        html += `<p>${comment}</p>`;
    });

    // 🚨 VULNERABILITY HERE
    container.innerHTML = html;
}

// safer
let safeComments = [];

function addSafeComment() {
    const input = document.getElementById("safeInput").value;

    safeComments.push(input);

    displaySafeComments();
}

function displaySafeComments() {
    const container = document.getElementById("safeComments");

    container.innerHTML = ""; // clear first

    safeComments.forEach(comment => {
        const p = document.createElement("p");

        // ✅ SAFE LINE
        p.textContent = comment;

        container.appendChild(p);
    });
}

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

function hiddenAction() {
    alert("⚠️ You just clicked a hidden action!");
}

function safeAction() {
    alert("✅ Safe: You clicked the real button");
}

//Request 
function analyzeRequest() {
    const input = document.getElementById("requestBox").value;

    const status = document.getElementById("scanStatus");
    const results = document.getElementById("scannerResults");

    if (status) status.textContent = "🔍 Scanning...";

    setTimeout(() => {
        let findings = [];

        // 🔴 XSS
        if (
            /<script[\s\S]*?>/i.test(input) ||
            /on\w+\s*=/i.test(input) ||
            /javascript:/i.test(input)
        ) {
            findings.push({
                type: "XSS",
                severity: "High",
                message: "Script injection pattern detected"
            });
        }

        // 🔁 Open Redirect
        if (/redirect\s*=/i.test(input) || /url\s*=/i.test(input)) {
            findings.push({
                type: "Open Redirect",
                severity: "Medium",
                message: "Suspicious redirect parameter"
            });
        }

        // 🧠 DOM Risk
        if (
            /innerHTML\s*=/i.test(input) ||
            /document\.write/i.test(input) ||
            /eval\s*\(/i.test(input)
        ) {
            findings.push({
                type: "DOM Risk",
                severity: "High",
                message: "Unsafe DOM manipulation"
            });
        }

        renderResults(findings);

        if (status) {
            status.textContent =
                findings.length > 0 ? "⚠️ Vulnerabilities Found" : "✅ Clean";
        }

    }, 500); // fake scan delay
}

function renderResults(findings) {
    const container = document.getElementById("scannerResults");

    if (!container) return;

    if (findings.length === 0) {
        container.innerHTML = "<p class='safe'>✅ No issues detected</p>";
        return;
    }

    let html = "";

    findings.forEach(f => {
        html += `
            <div class="scan-card ${f.severity.toLowerCase()}">
                <div class="scan-header">
                    <span class="scan-type">${f.type}</span>
                    <span class="scan-severity">${f.severity}</span>
                </div>
                <p>${f.message}</p>
            </div>
        `;
    });

    container.innerHTML = html;
}

//===========================================================
const selector = document.getElementById("payloadSelector");
const applyBtn = document.getElementById("applyPayloadBtn");
const runBtn = document.getElementById("runXSSBtn");
const input = document.getElementById("commentInput");
const msg = document.getElementById("xssMessage");
const explain = document.getElementById("xssExplanation");

// Apply payload
if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    let payload = "";

    switch (selector.value) {
      case "alert":
        payload = "<img src=x onerror=alert('XSS')>";
        break;

      case "img":
        payload = "<img src=x onerror=\"alert('Image XSS')\">";
        break;

      case "style":
        payload = "<img src=x onerror=\"document.body.style.background='red'\">";
        break;
    }

    if (input) input.value = payload;

    if (msg) {
      msg.textContent = payload
        ? "✅ Payload ready. Click Run Attack"
        : "⚠️ Select a payload first";
    }
  });
}

// Explanation
if (selector) {
  selector.addEventListener("change", () => {
    let text = "";

    switch (selector.value) {
      case "alert":
        text = "Triggers JavaScript using an image error event.";
        break;

      case "img":
        text = "Browser fails to load image → onerror executes code.";
        break;

      case "style":
        text = "Manipulates DOM → proves code execution.";
        break;
    }

    if (explain) explain.textContent = text;
  });
}

// Run attack
if (runBtn) {
  runBtn.addEventListener("click", () => {
    addComment();

    if (status) {
      status.textContent = "🟢 Executed";
    }


    if (msg) {
      msg.textContent = "🔥 Attack executed. Check output.";
    }
  });
}