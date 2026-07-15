/* ==========================================================================
   Elite Dental Lab — tracking.js
   Case tracking page: requires login, then searches the demo database by
   doctor and/or patient name and renders each case with a status timeline.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const session = window.EDL_AUTH.getSession();
  document.getElementById("locked-panel").hidden = !!session;
  document.getElementById("tracking-panel").hidden = !session;
  if (!session) return;

  const form = document.getElementById("track-form");
  const results = document.getElementById("results");
  const hint = document.getElementById("track-hint");
  const noResults = document.getElementById("no-results");
  const STATUSES = window.EDL_DB.statuses;

  function statusBadge(status) {
    const idx = STATUSES.indexOf(status);
    const cls = ["st-received", "st-design", "st-production", "st-quality", "st-shipped"][idx] || "st-received";
    return `<span class="status-badge ${cls}" data-i18n="status.${status}">${window.edlT("status." + status)}</span>`;
  }

  function timeline(status) {
    const current = STATUSES.indexOf(status);
    return `<ol class="status-timeline">` + STATUSES.map((s, i) => `
      <li class="${i < current ? "done" : ""} ${i === current ? "current" : ""}">
        <span class="dot"></span>
        <span class="label" data-i18n="status.${s}">${window.edlT("status." + s)}</span>
      </li>`).join("") + `</ol>`;
  }

  function caseCard(c) {
    return `
    <article class="case-card">
      <header class="case-card-head">
        <div>
          <h3>${c.patient}</h3>
          <p class="case-doctor">${c.doctor}</p>
        </div>
        ${statusBadge(c.status)}
      </header>
      ${timeline(c.status)}
      <dl class="case-meta">
        <div><dt data-i18n="track.caseId">Case ID</dt><dd>${c.id}</dd></div>
        <div><dt data-i18n="track.type">Restoration</dt><dd>${c.type}</dd></div>
        <div><dt data-i18n="track.received">Received</dt><dd>${c.received}</dd></div>
        <div><dt data-i18n="track.due">Expected completion</dt><dd>${c.due}</dd></div>
        ${c.notes ? `<div class="case-notes"><dt data-i18n="track.notes">Notes</dt><dd>${c.notes}</dd></div>` : ""}
      </dl>
    </article>`;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const doctor = form.doctor.value.trim().toLowerCase();
    const patient = form.patient.value.trim().toLowerCase();
    hint.hidden = true;
    noResults.hidden = true;
    results.innerHTML = "";

    if (!doctor && !patient) {
      hint.hidden = false;
      return;
    }

    const matches = window.EDL_DB.cases.filter(c => {
      const okDoctor = !doctor || c.doctor.toLowerCase().includes(doctor);
      const okPatient = !patient || c.patient.toLowerCase().includes(patient);
      return okDoctor && okPatient;
    });

    if (!matches.length) {
      noResults.hidden = false;
      return;
    }
    results.innerHTML = matches.map(caseCard).join("");
    window.edlApplyLanguage(window.EDL_LANG); // translate injected labels
  });
});
