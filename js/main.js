/* ==========================================================================
   Elite Dental Lab — main.js
   Home-page-only behavior: service tabs and the contact form.
   Shared behavior (nav, language, view toggle) lives in js/site.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Service tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  // Contact form → opens the user's email app (no backend yet)
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = e.target;
      const subject = encodeURIComponent("Website inquiry from " + f.name.value);
      const body = encodeURIComponent(
        `Name: ${f.name.value}\nPractice: ${f.practice.value}\nEmail: ${f.email.value}\n\n${f.message.value}`
      );
      window.location.href = `mailto:elitedentallabmd@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
