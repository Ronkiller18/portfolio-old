export function initializeActivityPanel() {

    const button =
        document.getElementById(
            "historyToggleBtn"
        );

    const wrapper =
        document.getElementById(
            "historyWrapper"
        );

    button.addEventListener(
        "click",
        () => {

            wrapper.classList.toggle(
                "collapsed"
            );

            button.textContent =
                wrapper.classList.contains(
                    "collapsed"
                )
                    ? "►"
                    : "▼";
        }
    );
}