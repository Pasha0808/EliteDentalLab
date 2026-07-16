/* ==========================================================================
   Elite Dental Lab — login.js
   Sign-in page. Delegates to EDL_API (Supabase, or demo until connected).
   Also completes sign-out when arriving via ?logout=1 from the header.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "case-tracking.html";
  const safeNext = /^[\w\-/]+\.html$/.test(next) ? next : "case-tracking.html";

  if (params.get("logout")) {
    await window.EDL_API.logout();
    history.replaceState(null, "", "login.html");
  }

  // Hide the demo-accounts note once the real backend is connected
  if (window.EDL_API.ready) {
    const note = document.getElementById("demo-note");
    if (note) note.hidden = true;
  }

  const loginCard = document.getElementById("login-card");
  const loggedinCard = document.getElementById("loggedin-card");
  const session = await window.EDL_API.getSession();

  if (session) {
    loginCard.hidden = true;
    loggedinCard.hidden = false;
    document.getElementById("whoami").textContent = session.name;
    return;
  }

  document.getElementById("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target;
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await window.EDL_API.login(f.email.value, f.password.value);
      window.location.href = safeNext;
    } catch (err) {
      document.getElementById("login-error").hidden = false;
      btn.disabled = false;
    }
  });
});
