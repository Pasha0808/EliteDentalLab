/* ==========================================================================
   Elite Dental Lab — site.js
   Shared chrome for every page: utility bar, header with dropdown nav,
   footer, language switcher, desktop/mobile view toggle, auth state.

   Each page sets  window.EDL_BASE  ("" at root, "../" in subfolders)
   before loading this script, and provides mount points:
     <div id="edl-utility"></div>  (before .page)
     <div id="edl-header"></div>   (inside .page, before <main>)
     <div id="edl-footer"></div>   (inside .page, after <main>)
   ========================================================================== */

(function () {
  const B = window.EDL_BASE || "";

  /* ---------------- Templates ---------------- */

  const utilityHTML = `
  <a class="skip-link" href="#edl-main" data-i18n="util.skip">Skip to main content</a>
  <div class="utility-bar">
    <div class="utility-inner">
      <div class="switch-group" role="group" aria-label="View mode">
        <span class="switch-label" data-i18n="util.view">View:</span>
        <button class="switch-btn" id="btn-desktop" data-i18n="util.desktop">Desktop</button>
        <button class="switch-btn" id="btn-mobile" data-i18n="util.mobile">Mobile</button>
      </div>
      <a class="utility-phone" href="tel:4106677773">&#9742; 410-667-7773</a>
      <div class="lang-dropdown" id="lang-dropdown">
        <button class="lang-current" id="lang-current" aria-haspopup="listbox"></button>
        <div class="lang-menu">
          <button type="button" data-lang="en"><span class="lang-flag">🇺🇸</span> English</button>
          <button type="button" data-lang="es"><span class="lang-flag">🇪🇸</span> Español</button>
          <button type="button" data-lang="de"><span class="lang-flag">🇩🇪</span> Deutsch</button>
        </div>
      </div>
    </div>
  </div>`;

  const logoIMG = `<img class="logo-img" src="${B}assets/img/logo.png" alt="Elite Dental Lab logo">`;

  const headerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="${B}index.html">
        ${logoIMG}
        <span class="logo-text">Elite <em>Dental Lab</em></span>
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Main navigation">
        <a href="${B}index.html" data-i18n="nav.home">Home</a>
        <div class="nav-item has-dropdown">
          <button class="nav-drop-btn" type="button" aria-haspopup="true">
            <span data-i18n="nav.ourServices">Our Services</span><span class="caret">▾</span>
          </button>
          <div class="dropdown">
            <a href="${B}services/crowns-bridges.html" data-i18n="nav.svcCrowns">Bridges &amp; Crowns and Veneers</a>
            <a href="${B}services/implants.html" data-i18n="nav.svcImplants">Implant Restorations</a>
            <a href="${B}services/zirconia-hybrid-dentures.html" data-i18n="nav.svcHybrid">Zirconia Hybrid Dentures</a>
            <a href="${B}services/dentures.html" data-i18n="nav.svcDentures">Dentures</a>
            <a href="${B}services/bite-guards-trays.html" data-i18n="nav.svcGuards">Bite Guards &amp; Trays</a>
          </div>
        </div>
        <a href="${B}pricing.html" data-i18n="nav.pricing">Pricing</a>
        <div class="nav-item has-dropdown">
          <button class="nav-drop-btn" type="button" aria-haspopup="true">
            <span data-i18n="nav.learning">Learning</span><span class="caret">▾</span>
          </button>
          <div class="dropdown">
            <a href="${B}learning/articles.html" data-i18n="nav.articles">Articles</a>
            <a href="${B}learning/guides.html" data-i18n="nav.guides">Guides</a>
          </div>
        </div>
        <a href="${B}index.html#contact" data-i18n="nav.contact">Contact</a>
        <a href="${B}about.html" data-i18n="nav.about">About Us</a>
        <a class="nav-auth-link" id="nav-auth-link" href="${B}login.html" data-i18n="nav.login">Log In</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn-track" href="${B}case-tracking.html" data-i18n="nav.tracking">Case Tracking</a>
        <span id="auth-area"></span>
        <button class="nav-toggle" id="nav-toggle" aria-label="Open menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const footerHTML = `
  <section class="footer-cta">
    <div class="container footer-cta-inner">
      <h2 data-i18n="fcta.title">Ready to send your first case?</h2>
      <p data-i18n="fcta.sub">Experience the difference of a lab that treats every restoration like it's going in their own mouth.</p>
      <a class="btn btn-light btn-lg" href="${B}index.html#send" data-i18n="fcta.btn">Send Us a Case</a>
    </div>
  </section>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col footer-brand">
        <a class="logo logo-light" href="${B}index.html">
          ${logoIMG}
          <span class="logo-text">Elite <em>Dental Lab</em></span>
        </a>
        <p data-i18n="footer.tagline">Quality dental lab work, made with the best digital solutions — in Cockeysville, Maryland since day one.</p>
        <a class="social-link" href="https://www.facebook.com/YourEliteDentalLab/" target="_blank" rel="noopener">Facebook</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.company">Company</h4>
        <a href="${B}about.html" data-i18n="nav.about">About Us</a>
        <a href="${B}pricing.html" data-i18n="nav.pricing">Pricing</a>
        <a href="${B}case-tracking.html" data-i18n="nav.tracking">Case Tracking</a>
        <a href="${B}index.html#contact" data-i18n="nav.contact">Contact</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.services">Services</h4>
        <a href="${B}services/crowns-bridges.html" data-i18n="nav.svcCrowns">Bridges &amp; Crowns and Veneers</a>
        <a href="${B}services/implants.html" data-i18n="nav.svcImplants">Implant Restorations</a>
        <a href="${B}services/zirconia-hybrid-dentures.html" data-i18n="nav.svcHybrid">Zirconia Hybrid Dentures</a>
        <a href="${B}services/dentures.html" data-i18n="nav.svcDentures">Dentures</a>
        <a href="${B}services/bite-guards-trays.html" data-i18n="nav.svcGuards">Bite Guards &amp; Trays</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.contact">Contact</h4>
        <a href="tel:4106677773">410-667-7773</a>
        <a href="mailto:elitedentallabmd@gmail.com">elitedentallabmd@gmail.com</a>
        <span>3 Hillside Ave,<br>Cockeysville, MD 21030</span>
      </div>
    </div>
    <div class="container footer-bottom">
      <span data-i18n="footer.rights">© 2026 Elite Dental Lab. All rights reserved.</span>
      <span data-i18n="footer.usa">All final products proudly made in the USA 🇺🇸</span>
    </div>
  </footer>`;

  /* ---------------- Render ---------------- */

  const mountU = document.getElementById("edl-utility");
  const mountH = document.getElementById("edl-header");
  const mountF = document.getElementById("edl-footer");
  if (mountU) mountU.outerHTML = utilityHTML;
  const mainEl = document.querySelector("main");
  if (mainEl) mainEl.id = "edl-main";
  if (mountH) mountH.outerHTML = headerHTML;
  if (mountF) mountF.outerHTML = footerHTML;

  /* ---------------- Auth state in header ---------------- */

  function renderAuth() {
    const area = document.getElementById("auth-area");
    if (!area) return;
    const session = window.EDL_AUTH ? window.EDL_AUTH.getSession() : null;
    if (session) {
      const adminLink = session.role === "admin"
        ? `<a class="btn btn-ghost btn-sm" href="${B}admin.html">Admin</a>` : "";
      area.innerHTML = `
        ${adminLink}
        <span class="user-chip" title="${session.office_name || ""}">👤 ${session.name}</span>
        <a class="logout-link" href="#" id="logout-link" data-i18n="nav.logout">Log out</a>`;
      const navAuth = document.getElementById("nav-auth-link");
      if (navAuth) {
        navAuth.textContent = window.edlT ? window.edlT("nav.logout") : "Log out";
        navAuth.setAttribute("data-i18n", "nav.logout");
        navAuth.href = B + "login.html?logout=1";
      }
      document.getElementById("logout-link").addEventListener("click", e => {
        e.preventDefault();
        window.EDL_AUTH.clearLocal();
        // login.js finishes the real sign-out (Supabase client lives there)
        window.location.href = B + "login.html?logout=1";
      });
    } else {
      area.innerHTML = `<a class="btn btn-ghost btn-sm" href="${B}login.html" data-i18n="nav.login">Log In</a>`;
    }
  }
  renderAuth();

  /* ---------------- View toggle (auto / forced) ---------------- */

  const MOBILE_BREAKPOINT = 920;
  const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  function applyView() {
    const forced = localStorage.getItem("edl-view");
    const root = document.documentElement;
    root.classList.remove("m", "forced-mobile", "forced-desktop");

    let effectiveMobile;
    if (forced === "mobile") {
      effectiveMobile = true;
      root.classList.add("m");
      if (window.innerWidth > 500) root.classList.add("forced-mobile");
    } else if (forced === "desktop") {
      effectiveMobile = false;
      if (mq.matches) root.classList.add("forced-desktop");
    } else {
      effectiveMobile = mq.matches;
      if (effectiveMobile) root.classList.add("m");
    }

    document.getElementById("btn-desktop")?.classList.toggle("active", !effectiveMobile);
    document.getElementById("btn-mobile")?.classList.toggle("active", effectiveMobile);
  }

  applyView();
  mq.addEventListener("change", applyView);
  window.addEventListener("resize", applyView);
  document.getElementById("btn-desktop").addEventListener("click", () => {
    localStorage.setItem("edl-view", "desktop");
    applyView();
  });
  document.getElementById("btn-mobile").addEventListener("click", () => {
    localStorage.setItem("edl-view", "mobile");
    applyView();
  });

  /* ---------------- Language ---------------- */

  window.edlApplyLanguage(window.EDL_LANG);
  const langDrop = document.getElementById("lang-dropdown");
  document.getElementById("lang-current").addEventListener("click", e => {
    e.stopPropagation();
    langDrop.classList.toggle("open");
  });
  langDrop.querySelectorAll(".lang-menu button").forEach(btn => {
    btn.addEventListener("click", () => {
      window.edlApplyLanguage(btn.dataset.lang);
      langDrop.classList.remove("open");
    });
  });
  document.addEventListener("click", () => langDrop.classList.remove("open"));

  /* ---------------- Dropdown menus ---------------- */

  document.querySelectorAll(".has-dropdown .nav-drop-btn").forEach(btn => {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const item = btn.parentElement;
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".has-dropdown.open").forEach(i => {
        i.classList.remove("open");
        i.querySelector(".nav-drop-btn")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".has-dropdown.open").forEach(i => i.classList.remove("open"));
  });

  /* ---------------- Mobile nav menu ---------------- */

  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle.addEventListener("click", e => {
    e.stopPropagation();
    mainNav.classList.toggle("open");
  });
  mainNav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => mainNav.classList.remove("open"))
  );

  /* ---------------- Photo carousels ---------------- */

  document.querySelectorAll("[data-carousel]").forEach(car => {
    const track = car.querySelector(".carousel-track");
    const slides = track.children.length;
    if (slides < 2) return;
    let index = 0;

    // Preload every slide so switching photos never shows a blank frame
    track.querySelectorAll('img[loading="lazy"]').forEach(img => (img.loading = "eager"));

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Photo " + (i + 1));
      dot.addEventListener("click", () => go(i));
      dotsWrap.appendChild(dot);
    }
    car.appendChild(dotsWrap);

    function go(i) {
      index = (i + slides) % slides;
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll("button").forEach((d, j) =>
        d.classList.toggle("active", j === index)
      );
    }

    car.querySelector(".car-prev").addEventListener("click", () => go(index - 1));
    car.querySelector(".car-next").addEventListener("click", () => go(index + 1));
    go(0);
  });

  /* ---------------- Active page highlight ---------------- */

  const here = location.pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll(".main-nav a, .dropdown a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href || href.includes("#")) return;
    if (here.endsWith("/" + href.replace(B, "")) || here.endsWith(href)) {
      a.classList.add("current");
      const item = a.closest(".has-dropdown");
      if (item) item.querySelector(".nav-drop-btn").classList.add("current");
    }
  });
})();
