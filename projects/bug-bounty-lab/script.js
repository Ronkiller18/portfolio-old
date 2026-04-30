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

function analyzeRequest() {
    const input = document.getElementById("requestBox").value;

    let result = "";

    if (input.includes("<script>")) {
        result += "⚠️ Possible XSS pattern<br>";
    }

    if (input.includes("redirect=")) {
        result += "⚠️ Possible open redirect parameter<br>";
    }

    document.getElementById("requestOutput").innerHTML = result;
}

//Request edit
function analyzeRequest() {
    const input = document.getElementById("requestBox").value;

    // detection logic comes Day 2
    document.getElementById("requestOutput").innerText = "Analyzing...";
}