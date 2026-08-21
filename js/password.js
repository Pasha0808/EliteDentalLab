/* ==========================================================================
   Elite Dental Lab — password.js
   Show/hide toggle and password-strength rules shared by the login and
   registration pages.

   POLICY NOTE
   These rules mirror what Supabase enforces server-side (Authentication →
   Sign In / Providers → Email): at least 12 characters containing lower
   case, upper case, a digit and a symbol. They must stay in step — if the
   form accepted something the server rejects, people would see every rule
   tick green and then get an error on submit.

   Two extra checks run here only, because the server cannot make them:
   common/site-related passwords, and passwords containing the account's
   own name or email.
   ========================================================================== */

(function () {
  const MIN_LENGTH = 12;
  const MAX_LENGTH = 128;

  /* Passwords that appear at the top of every breach list, plus obvious
     guesses for this particular site. */
  const COMMON = [
    "password", "passw0rd", "password1", "password123", "123456", "12345678",
    "123456789", "1234567890", "qwerty", "qwerty123", "abc123", "letmein",
    "welcome", "monkey", "dragon", "iloveyou", "admin", "admin123",
    "login", "master", "sunshine", "princess", "football", "baseball",
    "trustno1", "changeme", "secret", "summer", "winter", "spring",
    "elitedental", "dentallab", "elitedentallab", "dentist", "dental123",
    "tooth", "crown123", "denture"
  ];

  function analyse(pw, context) {
    context = context || {};
    const lower = pw.toLowerCase();

    const has = {
      lowercase: /[a-z]/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw)
    };
    const variety = Object.values(has).filter(Boolean).length;

    // Anything derived from the account's own details is trivially guessable
    const personal = [];
    if (context.email) {
      const local = String(context.email).split("@")[0].toLowerCase();
      if (local.length >= 4 && lower.includes(local)) personal.push("email");
    }
    if (context.name) {
      String(context.name).toLowerCase().split(/\s+/).forEach(word => {
        if (word.length >= 4 && lower.includes(word)) personal.push("name");
      });
    }

    const isCommon = COMMON.some(c => lower === c || (c.length >= 6 && lower.includes(c)));
    const repeated = /^(.)\1+$/.test(pw) || /^(..)\1+$/.test(pw);
    const sequential = /(abcdef|bcdefg|123456|234567|345678|456789|qwerty|asdfgh)/.test(lower);

    const rules = {
      length:   pw.length >= MIN_LENGTH,
      variety:  variety === 4,          // server requires all four classes
      notCommon: !isCommon && !repeated && !sequential,
      notPersonal: personal.length === 0
    };

    const ok = pw.length <= MAX_LENGTH && Object.values(rules).every(Boolean);

    // Rough strength score, only used to colour the meter
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= MIN_LENGTH) score++;
    if (pw.length >= 16) score++;
    if (variety >= 3) score++;
    if (variety === 4) score++;
    if (!rules.notCommon || !rules.notPersonal) score = Math.min(score, 1);

    return { ok, rules, has, score: Math.min(score, 5), personal, length: pw.length };
  }

  /* ---------- Show / hide toggle ---------- */

  function attachReveal(input) {
    if (!input || input.dataset.revealAttached) return;
    input.dataset.revealAttached = "1";

    const wrap = document.createElement("div");
    wrap.className = "pw-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pw-reveal";
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", window.edlT ? window.edlT("pw.show") : "Show password");
    btn.textContent = "Show";
    wrap.appendChild(btn);

    function syncLabel() {
      const shown = input.type === "text";
      const key = shown ? "pw.hide" : "pw.show";
      const fallback = shown ? "Hide" : "Show";
      btn.textContent = window.edlT ? window.edlT(key) : fallback;
      btn.setAttribute("aria-pressed", String(shown));
      btn.setAttribute("aria-label", btn.textContent);
    }
    syncLabel();

    btn.addEventListener("click", () => {
      input.type = input.type === "text" ? "password" : "text";
      syncLabel();
      input.focus();
    });

    // Keep the label correct when the visitor switches language
    document.addEventListener("edl:lang", syncLabel);
  }

  /* ---------- Live strength feedback ---------- */

  function attachStrength(input, getContext) {
    if (!input || input.dataset.strengthAttached) return;
    input.dataset.strengthAttached = "1";

    const box = document.createElement("div");
    box.className = "pw-strength";
    box.innerHTML = `
      <div class="pw-meter" aria-hidden="true"><span></span></div>
      <ul class="pw-rules">
        <li data-rule="length"></li>
        <li data-rule="variety"></li>
        <li data-rule="notCommon"></li>
        <li data-rule="notPersonal"></li>
      </ul>`;
    (input.closest(".pw-wrap") || input).insertAdjacentElement("afterend", box);

    const labels = () => ({
      length: (window.edlT ? window.edlT("pw.ruleLength") : "At least 12 characters"),
      variety: (window.edlT ? window.edlT("pw.ruleVariety") : "Contains upper case, lower case, a number and a symbol"),
      notCommon: (window.edlT ? window.edlT("pw.ruleCommon") : "Not a common or easily guessed password"),
      notPersonal: (window.edlT ? window.edlT("pw.rulePersonal") : "Does not contain your name or email")
    });

    function render() {
      const result = analyse(input.value, getContext ? getContext() : {});
      const text = labels();
      box.querySelectorAll("[data-rule]").forEach(li => {
        const key = li.dataset.rule;
        const passed = result.rules[key];
        li.className = input.value ? (passed ? "met" : "unmet") : "";
        li.textContent = (input.value ? (passed ? "✓ " : "• ") : "• ") + text[key];
      });
      const bar = box.querySelector(".pw-meter span");
      bar.style.width = (result.score / 5 * 100) + "%";
      bar.className = result.score <= 2 ? "weak" : result.score <= 3 ? "fair" : result.score <= 4 ? "good" : "strong";
      input.setCustomValidity(
        !input.value || result.ok ? "" :
        (window.edlT ? window.edlT("pw.tooWeak") : "Please choose a stronger password.")
      );
    }

    input.addEventListener("input", render);
    document.addEventListener("edl:lang", render);
    render();
  }

  window.EDL_PW = { analyse, attachReveal, attachStrength, MIN_LENGTH };
})();
