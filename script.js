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
});
