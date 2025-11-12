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

      // Update URL hash without jumping around
      if (history.replaceState) {
        history.replaceState(null, "", "#" + target);
      } else {
        window.location.hash = target;
      }

      // Scroll to top for better continuity
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Activate section based on URL hash on load
  const initialHash = window.location.hash.replace("#", "");
  const validIds = Array.from(sections).map((s) => s.id);
  const initialSection = validIds.includes(initialHash) ? initialHash : "intro";
  activateSection(initialSection);

  // --- Edit mode functionality: make ALL visible text editable ---

  const editToggle = document.getElementById("edit-toggle");

  if (editToggle) {
    // Tags that typically contain text we want to be editable
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

        // Only consider elements whose tag is in our whitelist
        if (!editableTags.includes(el.tagName)) continue;

        // Skip elements that are hidden
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;

        // Skip elements that don't actually contain text
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
});
