export function showMessage(messageBox, text, color) {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.style.color = color;
}