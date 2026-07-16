/* ==========================================================================
   Elite Dental Lab — api.js
   Single data layer for the portal. Uses Supabase when js/config.js is
   filled in; otherwise falls back to the local demo database (js/db.js)
   so the whole flow can be tried before the backend is connected.

   Pages that use this must load (in order):
     config.js → db.js → [supabase-js CDN] → api.js
   ========================================================================== */

(function () {
  const READY = window.EDL_BACKEND_READY;
  const sb = READY ? window.supabase.createClient(window.EDL_CONFIG.SUPABASE_URL, window.EDL_CONFIG.SUPABASE_ANON_KEY) : null;

  /* The header (js/site.js) reads a synchronous session snapshot from
     localStorage("edl-session"): { name, role, office_id, office_name } */
  function cacheSession(s) {
    if (s) localStorage.setItem("edl-session", JSON.stringify(s));
    else localStorage.removeItem("edl-session");
  }

  /* ---------------- Demo-mode storage overlay ----------------
     Admin edits in demo mode persist to localStorage so the flow
     can be tested end-to-end without a backend. */
  function demoCases() {
    try {
      const saved = JSON.parse(localStorage.getItem("edl-demo-cases"));
      if (Array.isArray(saved)) return saved;
    } catch (e) { /* fall through */ }
    return window.EDL_DB.cases.slice();
  }
  function saveDemoCases(list) {
    localStorage.setItem("edl-demo-cases", JSON.stringify(list));
  }

  /* ================= DEMO implementation ================= */

  const demo = {
    ready: false,

    async getSession() {
      try { return JSON.parse(localStorage.getItem("edl-session")); }
      catch (e) { return null; }
    },

    async login(identifier, password) {
      const id = identifier.trim().toLowerCase();
      const user = (window.EDL_DB.users || []).find(
        u => (u.username.toLowerCase() === id || (u.email || "").toLowerCase() === id) && u.password === password
      );
      if (!user) throw new Error("bad_credentials");
      const office = (window.EDL_DB.offices || []).find(o => o.id === user.office_id);
      const session = {
        name: user.name,
        role: user.role || "office",
        office_id: user.office_id || null,
        office_name: office ? office.name : null
      };
      cacheSession(session);
      return session;
    },

    async logout() { cacheSession(null); },

    async register() { throw new Error("backend_required"); },

    async listMyCases() {
      const s = await this.getSession();
      if (!s) throw new Error("not_logged_in");
      const all = demoCases();
      const offices = window.EDL_DB.offices || [];
      const scoped = s.role === "admin" ? all : all.filter(c => c.office_id === s.office_id);
      return scoped
        .map(c => ({ ...c, office_name: (offices.find(o => o.id === c.office_id) || {}).name || "" }))
        .sort((a, b) => (b.received || "").localeCompare(a.received || ""));
    },

    async addCase(data) {
      const list = demoCases();
      if (list.some(c => c.case_number === data.case_number)) throw new Error("duplicate_case_number");
      list.push({ id: "demo-" + Date.now(), ...data });
      saveDemoCases(list);
    },

    async updateCaseStatus(id, status) {
      const list = demoCases();
      const c = list.find(x => x.id === id);
      if (c) { c.status = status; saveDemoCases(list); }
    },

    async listOffices() { return (window.EDL_DB.offices || []).slice(); },
    async createOffice() { throw new Error("backend_required"); },
    async generateCode() { throw new Error("backend_required"); },
    async listCodes() { return []; }
  };

  /* ================= SUPABASE implementation ================= */

  async function fetchProfile(userId) {
    const { data, error } = await sb
      .from("profiles")
      .select("role, office_id, display_name, offices(name)")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  const real = {
    ready: true,

    async getSession() {
      const { data } = await sb.auth.getSession();
      if (!data.session) { cacheSession(null); return null; }
      try { return JSON.parse(localStorage.getItem("edl-session")); }
      catch (e) { return null; }
    },

    async login(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error("bad_credentials");

      let profile = await fetchProfile(data.user.id);

      // First login after email-confirmation flow: redeem a stored code
      const pending = localStorage.getItem("edl-pending-code");
      if (!profile && pending) {
        const { error: rerr } = await sb.rpc("redeem_registration_code", { p_code: pending });
        if (!rerr) {
          localStorage.removeItem("edl-pending-code");
          profile = await fetchProfile(data.user.id);
        }
      }

      const session = {
        name: (profile && profile.display_name) || data.user.email,
        role: (profile && profile.role) || "office",
        office_id: profile ? profile.office_id : null,
        office_name: profile && profile.offices ? profile.offices.name : null
      };
      cacheSession(session);
      return session;
    },

    async logout() {
      await sb.auth.signOut();
      cacheSession(null);
    },

    async register(code, email, password, displayName) {
      const { data: valid, error: verr } = await sb.rpc("check_registration_code", { p_code: code });
      if (verr) throw verr;
      if (!valid) throw new Error("invalid_code");

      const { data, error } = await sb.auth.signUp({ email: email.trim(), password });
      if (error) throw error;

      if (data.session) {
        // Signed in immediately (email confirmation disabled) — link to office now
        const { error: rerr } = await sb.rpc("redeem_registration_code", {
          p_code: code, p_display_name: displayName || null
        });
        if (rerr) throw new Error("invalid_code");
        const profile = await fetchProfile(data.user.id);
        cacheSession({
          name: (profile && profile.display_name) || email,
          role: "office",
          office_id: profile ? profile.office_id : null,
          office_name: profile && profile.offices ? profile.offices.name : null
        });
        return { confirmed: true };
      }

      // Email confirmation required — redeem on first login instead
      localStorage.setItem("edl-pending-code", code.trim().toUpperCase());
      return { confirmed: false };
    },

    async listMyCases() {
      const { data, error } = await sb
        .from("cases")
        .select("*, offices(name)")
        .order("received", { ascending: false });
      if (error) throw error;
      return data.map(c => ({ ...c, office_name: c.offices ? c.offices.name : "" }));
    },

    async addCase(data) {
      const { error } = await sb.from("cases").insert(data);
      if (error) {
        if ((error.message || "").includes("duplicate")) throw new Error("duplicate_case_number");
        throw error;
      }
    },

    async updateCaseStatus(id, status) {
      const { error } = await sb.from("cases").update({ status }).eq("id", id);
      if (error) throw error;
    },

    async listOffices() {
      const { data, error } = await sb.from("offices").select("*").order("name");
      if (error) throw error;
      return data;
    },

    async createOffice(name) {
      const { data, error } = await sb.from("offices").insert({ name }).select().single();
      if (error) throw error;
      return data;
    },

    async generateCode(officeId) {
      const code = Array.from({ length: 8 }, () =>
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
      ).join("");
      const { error } = await sb.from("registration_codes").insert({ code, office_id: officeId });
      if (error) throw error;
      return code;
    },

    async listCodes() {
      const { data, error } = await sb
        .from("registration_codes")
        .select("code, created_at, used_at, offices(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  };

  window.EDL_API = READY ? real : demo;
})();
