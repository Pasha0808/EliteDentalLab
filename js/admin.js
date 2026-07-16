/* ==========================================================================
   Elite Dental Lab — admin.js
   Admin panel (lab staff only): add cases, one-click status updates,
   create offices and issue single-use registration codes.
   English-only internal tool.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const session = await window.EDL_API.getSession();
  const isAdmin = session && session.role === "admin";
  document.getElementById("denied-panel").hidden = isAdmin;
  document.getElementById("admin-panel").hidden = !isAdmin;
  if (!isAdmin) return;

  const STATUSES = window.EDL_DB.statuses;
  const RESTORATIONS = window.EDL_DB.restorations;

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"]/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  }

  /* ---------- Populate selects ---------- */

  const statusSel = document.getElementById("status-select");
  statusSel.innerHTML = STATUSES.map(s => `<option>${s}</option>`).join("");
  document.getElementById("restoration-select").innerHTML =
    RESTORATIONS.map(r => `<option>${r}</option>`).join("");
  document.querySelector("#case-form [name=received]").value =
    new Date().toISOString().slice(0, 10);

  let offices = [];
  async function refreshOffices() {
    offices = await window.EDL_API.listOffices();
    const opts = offices.map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join("");
    document.getElementById("office-select").innerHTML = opts;
    const codeSel = document.getElementById("code-office-select");
    if (codeSel) codeSel.innerHTML = opts;
  }
  await refreshOffices();

  /* ---------- Case list with inline status updates ---------- */

  let cases = [];
  const tbody = document.querySelector("#cases-table tbody");
  const emptyEl = document.getElementById("admin-empty");
  const filterEl = document.getElementById("admin-filter");

  async function refreshCases() {
    cases = await window.EDL_API.listMyCases(); // admin sees all
    renderCases();
  }

  function renderCases() {
    const q = filterEl.value.trim().toLowerCase();
    const shown = !q ? cases : cases.filter(c =>
      [c.case_number, c.office_name, c.doctor, c.tooth, c.restoration, c.status]
        .some(v => (v || "").toLowerCase().includes(q))
    );
    emptyEl.hidden = shown.length > 0;
    tbody.innerHTML = shown.map(c => `
      <tr>
        <td><strong>${esc(c.case_number)}</strong></td>
        <td>${esc(c.office_name)}</td>
        <td>${esc(c.doctor || "—")}</td>
        <td>${esc(c.tooth || "—")}</td>
        <td>${esc(c.restoration || "—")}</td>
        <td>${esc(c.received)}</td>
        <td>${esc(c.due || "—")}</td>
        <td>
          <select class="status-select" data-id="${esc(c.id)}">
            ${STATUSES.map(s => `<option ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </td>
      </tr>`).join("");

    tbody.querySelectorAll(".status-select").forEach(sel => {
      sel.addEventListener("change", async () => {
        await window.EDL_API.updateCaseStatus(sel.dataset.id, sel.value);
        const c = cases.find(x => String(x.id) === sel.dataset.id);
        if (c) c.status = sel.value;
      });
    });
  }

  filterEl.addEventListener("input", renderCases);
  await refreshCases();

  /* ---------- Add case ---------- */

  document.getElementById("case-form").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target;
    const errEl = document.getElementById("case-error");
    const okEl = document.getElementById("case-success");
    errEl.hidden = true;
    okEl.hidden = true;
    try {
      await window.EDL_API.addCase({
        case_number: f.case_number.value.trim(),
        office_id: f.office_id.value,
        doctor: f.doctor.value.trim() || null,
        tooth: f.tooth.value.trim() || null,
        restoration: f.restoration.value,
        received: f.received.value,
        due: f.due.value || null,
        status: f.status.value,
        notes: f.notes.value.trim() || null
      });
      okEl.textContent = `Case ${f.case_number.value.trim()} added.`;
      okEl.hidden = false;
      f.case_number.value = "";
      f.tooth.value = "";
      f.notes.value = "";
      await refreshCases();
    } catch (err) {
      errEl.textContent = (err.message || "").includes("duplicate")
        ? "That case number already exists."
        : "Could not add the case: " + (err.message || "unknown error");
      errEl.hidden = false;
    }
  });

  /* ---------- Offices & registration codes (backend only) ---------- */

  const codesUi = document.getElementById("codes-ui");
  const codesNote = document.getElementById("codes-backend-note");
  if (!window.EDL_API.ready) {
    codesNote.hidden = false;
    return;
  }
  codesUi.hidden = false;

  const codesBody = document.querySelector("#codes-table tbody");
  async function refreshCodes() {
    const codes = await window.EDL_API.listCodes();
    codesBody.innerHTML = codes.map(c => `
      <tr>
        <td><code>${esc(c.code)}</code></td>
        <td>${esc(c.offices ? c.offices.name : "")}</td>
        <td>${esc((c.created_at || "").slice(0, 10))}</td>
        <td>${c.used_at ? "Used " + esc(c.used_at.slice(0, 10)) : "<strong>Unused</strong>"}</td>
      </tr>`).join("");
  }
  await refreshCodes();

  document.getElementById("office-form").addEventListener("submit", async e => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (!name) return;
    await window.EDL_API.createOffice(name);
    e.target.reset();
    await refreshOffices();
  });

  document.getElementById("code-form").addEventListener("submit", async e => {
    e.preventDefault();
    const officeId = e.target.office_id.value;
    if (!officeId) return;
    const code = await window.EDL_API.generateCode(officeId);
    const office = offices.find(o => o.id === officeId);
    const el = document.getElementById("new-code");
    el.innerHTML = `New code for <strong>${esc(office ? office.name : "")}</strong>: <code class="big-code">${esc(code)}</code> — send it to the office, it works once.`;
    el.hidden = false;
    await refreshCodes();
  });
});
