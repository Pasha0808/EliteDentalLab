/* ==========================================================================
   Elite Dental Lab — tracking.js
   Case tracking page: requires login, lists the signed-in office's cases
   (the backend's row-level security guarantees offices only ever receive
   their own rows), with a client-side filter and status timelines.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const session = await window.EDL_API.getSession();
  document.getElementById("locked-panel").hidden = !!session;
  document.getElementById("tracking-panel").hidden = !session;
  if (!session) return;

  const isAdmin = session.role === "admin";
  document.getElementById("office-name").textContent =
    isAdmin ? "Elite Dental Lab — all offices" : (session.office_name || "");

  const results = document.getElementById("results");
  const emptyEl = document.getElementById("track-empty");
  const noMatchEl = document.getElementById("track-nomatch");
  const filterInput = document.getElementById("filter-input");
  const STATUSES = window.EDL_DB.statuses;

  let cases = [];
  try {
    cases = await window.EDL_API.listMyCases();
  } catch (err) {
    emptyEl.hidden = false;
    return;
  }

  function statusBadge(status) {
    const idx = STATUSES.indexOf(status);
    const cls = ["st-received", "st-design", "st-production", "st-quality", "st-shipped"][idx] || "st-received";
    return `<span class="status-badge ${cls}">${window.edlT("status." + status)}</span>`;
  }

  function timeline(status) {
    const current = STATUSES.indexOf(status);
    return `<ol class="status-timeline">` + STATUSES.map((s, i) => `
      <li class="${i < current ? "done" : ""} ${i === current ? "current" : ""}">
        <span class="dot"></span>
        <span class="label">${window.edlT("status." + s)}</span>
      </li>`).join("") + `</ol>`;
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"]/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }

  function caseCard(c) {
    return `
    <article class="case-card">
      <header class="case-card-head">
        <div>
          <h3>${esc(c.case_number)} · ${esc(c.restoration)}</h3>
          <p class="case-doctor">${esc(c.tooth || "")}${c.doctor ? " · " + esc(c.doctor) : ""}${isAdmin && c.office_name ? " · " + esc(c.office_name) : ""}</p>
        </div>
        ${statusBadge(c.status)}
      </header>
      ${timeline(c.status)}
      <dl class="case-meta">
        <div><dt>${window.edlT("track.caseId")}</dt><dd>${esc(c.case_number)}</dd></div>
        <div><dt>${window.edlT("track.tooth")}</dt><dd>${esc(c.tooth || "—")}</dd></div>
        <div><dt>${window.edlT("track.received")}</dt><dd>${esc(c.received)}</dd></div>
        <div><dt>${window.edlT("track.due")}</dt><dd>${esc(c.due || "—")}</dd></div>
        ${c.notes ? `<div class="case-notes"><dt>${window.edlT("track.notes")}</dt><dd>${esc(c.notes)}</dd></div>` : ""}
      </dl>
    </article>`;
  }

  function render() {
    const q = filterInput.value.trim().toLowerCase();
    emptyEl.hidden = true;
    noMatchEl.hidden = true;

    if (!cases.length) {
      results.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    const shown = !q ? cases : cases.filter(c =>
      [c.case_number, c.tooth, c.doctor, c.restoration, c.office_name, c.status]
        .some(v => (v || "").toLowerCase().includes(q))
    );

    if (!shown.length) {
      results.innerHTML = "";
      noMatchEl.hidden = false;
      return;
    }
    results.innerHTML = shown.map(caseCard).join("");
  }

  filterInput.addEventListener("input", render);
  document.getElementById("btn-en").addEventListener("click", render);
  document.getElementById("btn-es").addEventListener("click", render);
  render();
});
