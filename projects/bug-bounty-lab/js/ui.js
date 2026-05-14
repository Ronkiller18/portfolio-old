const navItems =
    document.querySelectorAll(".nav-item");

const tabSections =
    document.querySelectorAll(".tab-section");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const targetTab =
            item.dataset.tab;

        // Remove active states
        navItems.forEach(btn => {
            btn.classList.remove("active");
        });

        // Hide all sections
        tabSections.forEach(section => {
            section.classList.add("hidden");
        });

        // Activate button
        item.classList.add("active");

        // Show target section
        const targetSection =
            document.getElementById(targetTab);

        if (targetSection) {
            targetSection.classList.remove("hidden");
        }
    });
});