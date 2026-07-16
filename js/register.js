/* ==========================================================================
   Elite Dental Lab — register.js
   Invitation-only account creation: a valid registration code (issued by
   the lab admin) is required and permanently links the account to one office.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const errEl = document.getElementById("register-error");
  const okEl = document.getElementById("register-success");

  // Demo mode: registration needs the real backend
  if (!window.EDL_API.ready) {
    document.getElementById("backend-note").hidden = false;
    form.querySelectorAll("input, button").forEach(el => (el.disabled = true));
    return;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    errEl.hidden = true;
    okEl.hidden = true;

    const f = e.target;
    if (f.password.value !== f.password2.value) {
      errEl.textContent = window.edlT("reg.mismatch");
      errEl.hidden = false;
      return;
    }

    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const result = await window.EDL_API.register(
        f.code.value, f.email.value, f.password.value, f.displayName.value
      );
      if (result.confirmed) {
        okEl.textContent = window.edlT("reg.success");
        okEl.hidden = false;
        setTimeout(() => (window.location.href = "case-tracking.html"), 1200);
      } else {
        okEl.textContent = window.edlT("reg.confirmEmail");
        okEl.hidden = false;
        form.reset();
        btn.disabled = false;
      }
    } catch (err) {
      const msg = (err && err.message) || "";
      errEl.textContent = msg.includes("invalid_code")
        ? window.edlT("reg.badCode")
        : (msg && !msg.includes("reg.") ? msg : window.edlT("reg.error"));
      errEl.hidden = false;
      btn.disabled = false;
    }
  });
});
