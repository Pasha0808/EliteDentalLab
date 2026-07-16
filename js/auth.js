/* ==========================================================================
   Elite Dental Lab — auth.js
   Synchronous session snapshot for the shared header (js/site.js).
   The snapshot is written by js/api.js on login/logout. Real authentication
   lives in Supabase (or the demo db until the backend is connected).
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

  /* Clears the local snapshot; the login page finishes the real sign-out. */
  clearLocal() {
    localStorage.removeItem("edl-session");
  }
};
