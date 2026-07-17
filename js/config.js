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
  SUPABASE_URL: "https://orfujeqbaahthybsiatl.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZnVqZXFiYWFodGh5YnNpYXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNDA2ODgsImV4cCI6MjA5OTgxNjY4OH0.Cbdt6lWfExdLQNP2ZEH6DzWU-bumhNMkYefb5xFButU"
};

window.EDL_BACKEND_READY = !!(window.EDL_CONFIG.SUPABASE_URL && window.EDL_CONFIG.SUPABASE_ANON_KEY);
