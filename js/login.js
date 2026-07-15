/* ==========================================================================
   Elite Dental Lab — login.js
   Login page: authenticate against the demo database, then redirect to
   ?next=<page> (default: case tracking).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "case-tracking.html";

  const loginCard = document.getElementById("login-card");
  const loggedinCard = document.getElementById("loggedin-card");
  const session = window.EDL_AUTH.getSession();

  if (session) {
    loginCard.hidden = true;
    loggedinCard.hidden = false;
    document.getElementById("whoami").textContent = session.name;
    return;
  }

  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const result = window.EDL_AUTH.login(f.username.value, f.password.value);
    if (result) {
      // Only allow same-site relative redirects
      const safeNext = /^[\w\-/]+\.html$/.test(next) ? next : "case-tracking.html";
      window.location.href = safeNext;
    } else {
      document.getElementById("login-error").hidden = false;
    }
  });
});
