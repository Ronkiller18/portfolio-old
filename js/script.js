document.addEventListener("DOMContentLoaded", () => {

  console.log("JavaScript is working!");

  // =====================
  // 1. VARIABLES
  // =====================
  const name = "Rushikesh";

  let isPreviewOpen = false;
  let fallbackTimeout;
  let lastFocusedElement = null;
  let loaded = false;

  // =====================
  // 2. DOM ELEMENTS
  // =====================
  const button = document.getElementById("helloBtn");
  const message = document.getElementById("message");
  const toggle = document.getElementById("darkModeToggle");

  const detailButtons = document.querySelectorAll(".details-btn");
  const interactiveElements = document.querySelectorAll("button, .cta-btn, .details-btn");

  const nav = document.getElementById("navbar");
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section[id]");
  const progressBar = document.querySelector(".progress-bar");

  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
  );

  // =====================
  // PREVIEW ELEMENTS (Grouped)
  // =====================
  const preview = {
    modal: document.getElementById("previewModal"),
    frame: document.getElementById("previewFrame"),
    closeBtn: document.querySelector(".preview-close"),
    overlay: document.querySelector(".preview-overlay"),
    loader: document.getElementById("previewLoader"),
    fallback: document.getElementById("previewFallback"),
    openLink: document.getElementById("openLiveLink")
  };

  // =====================
  // 3. BUTTONS
  // =====================

  if (button && message) {
    button.addEventListener("click", () => {
      message.textContent = `Hello ${name} 👋`;
    });
  }

  detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project-card");
      const details = card.querySelector(".project-details");
      if (!details) return;

      const isOpen = details.classList.toggle("show");
      btn.textContent = isOpen ? "Hide Details" : "View Details";
    });
  });

  interactiveElements.forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.add("clicked");
      setTimeout(() => el.classList.remove("clicked"), 120);
    });
  });

  // =====================
  // 4. DARK MODE
  // =====================
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      toggle.textContent = document.body.classList.contains("dark")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
    });
  }

  // NAV SCROLL EFFECT
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    });
  }


  //=======================================================
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      const tabs = document.querySelectorAll(".tab-content");

      tabs.forEach(tab => tab.style.display = "none");
      tabButtons.forEach(b => b.classList.remove("active"));

      document.getElementById(tabId).style.display = "block";
      btn.classList.add("active");
    });
  });
  //=========================================================

  // =====================
  // 5. PREVIEW SYSTEM
  // =====================

  document.querySelectorAll(".preview-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      if (isPreviewOpen) return;

      loaded = false;

      const url = btn.dataset.url;
      if (!url) return;

      lastFocusedElement = btn;
      isPreviewOpen = true;

      // Reset UI
      preview.frame.classList.remove("loaded");
      preview.loader.classList.remove("hidden");
      preview.fallback.classList.add("hidden");

      preview.openLink.href = url;

      // Open modal
      preview.modal.classList.add("active");
      document.body.classList.add("no-scroll");
      preview.modal.setAttribute("aria-hidden", "false");

      if (preview.closeBtn) preview.closeBtn.focus();

      // Load iframe
      preview.frame.src = url;

      // Fallback
      clearTimeout(fallbackTimeout);
      fallbackTimeout = setTimeout(() => {
        if (!loaded) {
          preview.loader.classList.add("hidden");
          preview.fallback.classList.remove("hidden");
        }
      }, 3000);

    });
  });

  // FRAME LOAD
  preview.frame.addEventListener("load", () => {
    loaded = true;
    
    setTimeout(() => {
      preview.loader.classList.add("hidden");
      preview.frame.classList.add("loaded");
    }, 150);
  });

  // CLOSE MODAL
  function closeModal() {
    preview.modal.classList.remove("active");
    preview.modal.setAttribute("aria-hidden", "true");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

    setTimeout(() => {
      preview.frame.src = "";
      preview.loader.classList.remove("hidden");
      preview.fallback.classList.add("hidden");

      document.body.classList.remove("no-scroll");
      isPreviewOpen = false;
    }, 200);
  }

  // EVENTS
  if (preview.closeBtn) preview.closeBtn.addEventListener("click", closeModal);
  if (preview.overlay) preview.overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isPreviewOpen) {
      closeModal();
    }
  });

  // =====================
  // 6. SCROLL ENGINE
  // =====================

  let ticking = false;

  function updateOnScroll() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
      progressBar.style.width = (scrollTop / documentHeight) * 100 + "%";
    }

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight;
      if (scrollTop >= sectionTop) {
        currentSection = section.id;
      }
    });

    if ((window.innerHeight + scrollTop) >= document.body.offsetHeight - 5) {
      currentSection = sections[sections.length - 1].id;
    }

    if (!currentSection && sections.length > 0) {
      currentSection = sections[0].id;
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });

    sections.forEach((section) => {
      section.classList.toggle("active-section", section.id === currentSection);
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  // =====================
  // PAGE LOADER
  // =====================

  window.addEventListener("load", () => {
    const loader = document.getElementById("pageLoader");

    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 300);
    }
  });

});

  //=======================================================

  //=========================================================