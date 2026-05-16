// ===========================================================
// Unsafe XSS Demo
// ===========================================================

let comments = [];

function addComment() {

    const input =
        document.getElementById("commentInput").value;

    comments.push(input);

    displayComments();
}

function displayComments() {

    const container =
        document.getElementById("comments");

    let html = "";

    comments.forEach(comment => {

        html += `<p>${comment}</p>`;
    });

    // 🚨 Vulnerable
    container.innerHTML = html;
}

// ===========================================================
// Safe XSS Demo
// ===========================================================

let safeComments = [];

function addSafeComment() {

    const input =
        document.getElementById("safeInput").value;

    safeComments.push(input);

    displaySafeComments();
}

function displaySafeComments() {

    const container =
        document.getElementById("safeComments");

    container.innerHTML = "";

    safeComments.forEach(comment => {

        const p = document.createElement("p");

        // ✅ Safe
        p.textContent = comment;

        container.appendChild(p);
    });
}

// ===========================================================
// Payload UI
// ===========================================================

const selector =
    document.getElementById("payloadSelector");

const runBtn =
    document.getElementById("runXSSBtn");

const clearBtn =
    document.getElementById("clearOutputBtn");

const input =
    document.getElementById("commentInput");

const msg =
    document.getElementById("xssMessage");

const explain =
    document.getElementById("xssExplanation");

const attackStatus =
    document.getElementById("attackStatus");

// ===========================================================
// Payload Selection
// ===========================================================

if (selector) {

    selector.addEventListener("change", () => {

        const selectedPayload =
            payloadLibrary[selector.value];

        if (!selectedPayload) {

            input.value = "";

            explain.textContent = "";

            msg.textContent = "";

            if (attackStatus) {
                attackStatus.textContent = "⚪ Idle";
            }

            return;
        }

        // Auto load payload
        input.value =
            selectedPayload.payload;

        // Update explanation
        explain.textContent =
            selectedPayload.description;

        // Update message
        msg.textContent =
            `✅ ${selectedPayload.name} loaded`;

        // Reset status
        if (attackStatus) {
            attackStatus.textContent = "⚪ Ready";
        }
    });
}

// ===========================================================
// Run Attack
// ===========================================================

if (runBtn) {

    runBtn.addEventListener("click", () => {

        const value =
            input.value.trim();

        // Empty validation
        if (!value) {

            if (attackStatus) {
                attackStatus.textContent = "⚪ Idle";
            }

            if (msg) {
                msg.textContent =
                    "⚠️ No payload loaded";
            }

            return;
        }

        addComment();

        if (attackStatus) {
            attackStatus.textContent =
                "🟢 Executed";
        }

        if (msg) {
            msg.textContent =
                "🔥 Attack executed. Check output.";
        }
    });
}

// ===========================================================
// Clear Output
// ===========================================================

if (clearBtn) {

    clearBtn.addEventListener("click", () => {

        // Clear input + reset state
        if (input) {

            input.value = "";

            comments = [];
        }

        // Clear rendered output
        const commentsContainer =
            document.getElementById("comments");

        if (commentsContainer) {
            commentsContainer.innerHTML = "";
        }

        // Reset messages
        if (msg) {
            msg.textContent = "";
        }

        if (explain) {
            explain.textContent = "";
        }

        // Reset dropdown
        if (selector) {
            selector.value = "";
        }

        // Reset status
        if (attackStatus) {
            attackStatus.textContent = "⚪ Ready";
        }
    });
}