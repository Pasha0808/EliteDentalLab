/* ==========================================================================
   Elite Dental Lab — main.js
   Home-page-only behavior: service tabs, hero video pause control,
   and the contact form (spam-check + mailto).
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

  // Hero video pause/play (508: moving content must be pausable)
  const video = document.getElementById("hero-video");
  const pauseBtn = document.getElementById("hero-pause");
  if (video && pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      const paused = video.paused;
      if (paused) video.play(); else video.pause();
      pauseBtn.textContent = paused ? "⏸" : "▶";
      pauseBtn.setAttribute("aria-pressed", String(!paused));
      pauseBtn.setAttribute("aria-label", paused ? "Pause background video" : "Play background video");
    });
  }

  // Contact form: spam check, then open the user's email app
  const form = document.getElementById("contact-form");
  if (form) {
    // Simple arithmetic captcha, regenerated on each load and language change
    let capA = 2 + Math.floor(Math.random() * 8);
    let capB = 2 + Math.floor(Math.random() * 8);
    function renderCaptcha() {
      const label = document.getElementById("captcha-label");
      if (label) label.textContent = window.edlT("form.captcha").replace("{a}", capA).replace("{b}", capB);
    }
    renderCaptcha();
    document.addEventListener("edl:lang", renderCaptcha);

    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = e.target;
      const err = document.getElementById("captcha-error");

      // Honeypot: bots fill hidden fields — silently ignore them
      if (f.website && f.website.value) return;

      if (parseInt(f.captcha.value.trim(), 10) !== capA + capB) {
        err.hidden = false;
        f.captcha.value = "";
        f.captcha.focus();
        return;
      }
      err.hidden = true;

      const subject = encodeURIComponent("Website inquiry from " + f.name.value);
      const body = encodeURIComponent(
        `Name: ${f.name.value}\nPractice: ${f.practice.value}\nEmail: ${f.email.value}\n\n${f.message.value}`
      );
      window.location.href = `mailto:elitedentallabmd@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
