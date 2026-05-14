function renderPayloadLibrary() {

    const container = document.getElementById("payloadLibrary");

    if (!container) return;

    let html = "";

    Object.entries(payloadLibrary).forEach(([key, payload]) => {

        html += `
            <div class="payload-card">

                <div class="payload-header">

                    <h3>${payload.name}</h3>

                    <span class="severity-badge ${payload.severity.toLowerCase()}">
                        ${payload.severity}
                    </span>

                </div>

                <p>
                    ${payload.description}
                </p>

                <button
                    class="load-payload-btn"
                    data-payload="${key}"
                >
                    Load Payload
                </button>

            </div>
        `;
    });

    container.innerHTML = html;
}
// unsafe
let comments = [];

function addComment() {
    const input = document.getElementById("commentInput").value;

    comments.push(input);

    displayComments();
}

function displayComments() {
    const container = document.getElementById("comments");

    let html = "";

    comments.forEach(comment => {
        html += `<p>${comment}</p>`;
    });

    // 🚨 Vulnerable
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

const selector = document.getElementById("payloadSelector");
const applyBtn = document.getElementById("applyPayloadBtn");
const runBtn = document.getElementById("runXSSBtn");

const input = document.getElementById("commentInput");

const msg = document.getElementById("xssMessage");
const explain = document.getElementById("xssExplanation");

const attackStatus = document.getElementById("attackStatus");

// Apply payload
if (applyBtn) {

    applyBtn.addEventListener("click", () => {

        const selectedPayload =
            payloadLibrary[selector.value];

        if (selectedPayload) {

            input.value =
                selectedPayload.payload;

            msg.textContent =
                `✅ ${selectedPayload.name} loaded`;

        } else {

            msg.textContent =
                "⚠️ Select a payload first";
        }
    });
}

// Explanation
if (selector) {

    selector.addEventListener("change", () => {

        const selectedPayload =
            payloadLibrary[selector.value];

        if (selectedPayload) {

            explain.textContent =
                selectedPayload.description;

            if (attackStatus) {
                attackStatus.textContent = "⚪ Ready";
            }    

        } else {

            explain.textContent = "";
        }
    });
}

// Run attack
if (runBtn) {

    runBtn.addEventListener("click", () => {

        const value = input.value.trim();

        // Empty input validation
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
//renderpayload
renderPayloadLibrary();
document.addEventListener("click", (e) => {

    if (
        e.target.classList.contains(
            "load-payload-btn"
        )
    ) {

        const key =
            e.target.dataset.payload;

        const payload =
            payloadLibrary[key];

        if (payload && input) {

            input.value = payload.payload;

            if (msg) {
                msg.textContent =
                    `✅ ${payload.name} loaded`;
            }

            if (explain) {
                explain.textContent =
                    payload.description;
            }

            if (attackStatus) {
                attackStatus.textContent =
                    "⚪ Ready";
            }
        }
    }
});