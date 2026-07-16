/* ==========================================================================
   Elite Dental Lab — config.js
   Supabase connection settings.

   Once the Supabase project exists, fill these two values in
   (Project Settings → API). The "anon public" key is SAFE to publish —
   it only grants access that the database's Row Level Security allows.
   Never put the "service_role" key here.

   While these are empty, the portal runs in DEMO mode (js/db.js).
   ========================================================================== */

window.EDL_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: ""
};

window.EDL_BACKEND_READY = !!(window.EDL_CONFIG.SUPABASE_URL && window.EDL_CONFIG.SUPABASE_ANON_KEY);
