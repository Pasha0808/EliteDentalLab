/* ==========================================================================
   Elite Dental Lab — auth.js
   Demo session handling on top of the demo database (js/db.js).
   Sessions are stored in localStorage until a real backend is connected.
   ========================================================================== */

window.EDL_AUTH = {
  getSession() {
    try {
      return JSON.parse(localStorage.getItem("edl-session"));
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  login(username, password) {
    const user = (window.EDL_DB?.users || []).find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!user) return null;
    const session = { username: user.username, name: user.name, practice: user.practice };
    localStorage.setItem("edl-session", JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem("edl-session");
  }
};
