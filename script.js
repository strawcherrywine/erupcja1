document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".content-section");

  function activateSection(id) {
    sections.forEach((section) => {
      const isActive = section.id === id;
      section.classList.toggle("is-active", isActive);
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("data-section") === id;
      link.classList.toggle("is-active", isActive);
    });
  }

  // Handle nav clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-section");
      if (!target) return;

      activateSection(target);

      if (history.replaceState) {
        history.replaceState(null, "", "#" + target);
      } else {
        window.location.hash = target;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Activate section based on URL hash on load
  const initialHash = window.location.hash.replace("#", "");
  const validIds = Array.from(sections).map((s) => s.id);
  const initialSection = validIds.includes(initialHash) ? initialHash : "intro";
  activateSection(initialSection);

  // --- Edit mode functionality (all text) ---

  const editToggle = document.getElementById("edit-toggle");

  if (editToggle) {
    const editableTags = [
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "P",
      "SPAN",
      "LI",
      "DT",
      "DD",
      "FIGCAPTION",
      "CAPTION",
      "TH",
      "TD",
      "A",
      "BUTTON",
      "STRONG",
      "EM",
      "SMALL",
      "LABEL"
    ];

    function findEditableNodes() {
      const nodes = [];
      const all = document.body.getElementsByTagName("*");

      for (let i = 0; i < all.length; i++) {
        const el = all[i];

        if (!editableTags.includes(el.tagName)) continue;

        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;

        const text = el.textContent.trim();
        if (!text) continue;

        nodes.push(el);
      }

      return nodes;
    }

    function setEditing(on) {
      document.documentElement.classList.toggle("is-editing", on);
      editToggle.setAttribute("aria-pressed", on ? "true" : "false");

      const editableNodes = findEditableNodes();
      editableNodes.forEach((el) => {
        el.setAttribute("contenteditable", on ? "true" : "false");
        el.classList.toggle("editable", on);
      });
    }

    let isEditing = false;

    editToggle.addEventListener("click", () => {
      isEditing = !isEditing;
      setEditing(isEditing);
    });
  }

  // --- Image lightbox (fullscreen on click) ---

  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".image-lightbox__img") : null;
  const lightboxCaption = lightbox ? lightbox.querySelector(".image-lightbox__caption") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".image-lightbox__close") : null;

  function openLightbox(img) {
    if (!lightbox || !lightboxImg) return;

    const src = img.getAttribute("src");
    const alt = img.getAttribute("alt") || "";

    lightboxImg.src = src;
    lightboxImg.alt = alt;

    if (lightboxCaption) {
      const fig = img.closest("figure");
      const cap = fig ? fig.querySelector("figcaption") : null;
      const captionText = cap ? cap.textContent.trim() : alt;
      lightboxCaption.textContent = captionText;
      lightboxCaption.style.display = captionText ? "block" : "none";
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  if (lightbox) {
    // Open on click – all images inside .figure-card
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.matches(".figure-card img")) {
        // Don’t open while in text-edit mode
        if (document.documentElement.classList.contains("is-editing")) return;

        event.preventDefault();
        openLightbox(target);
      }

      if (target.matches(".figure-card-ola img")) {
        // Don’t open while in text-edit mode
        if (document.documentElement.classList.contains("is-editing")) return;

        event.preventDefault();
        openLightbox(target);
      }
    });

    // Close when clicking dark background
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    // Close with button
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    // Close with Esc
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
});
