"use strict";
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) e.append(c instanceof Node ? c : String(c));
  return e;
};
const S = { scenario: "peak", city: "All", basis: "expected", stock: 60, crews: 40, surge: 1, ward: null, plan: null, sim: null, asg: {}, tab: "sms", texts: {} };
const q = () => `scenario=${S.scenario}&basis=${S.basis}&stock=${S.stock}&crews=${S.crews}&surge=${S.surge}`;
const f1 = (x) => Number(x).toFixed(1), f2 = (x) => Number(x).toFixed(2);
async function api(path, opt) {
  const r = await fetch(path, opt);
  if (!r.ok) throw new Error((await r.text()).slice(0, 200));
  return r.json();
}
let timer;
const later = (fn) => { clearTimeout(timer); timer = setTimeout(fn, 150); };
const rows = () => S.plan.wards.filter((r) => S.city === "All" || r.city === S.city);
const bin = (r) => (r.priority <= 0 ? 0 : r.rank <= 6 ? 5 : r.rank <= 15 ? 4 : r.rank <= 27 ? 3 : r.rank <= 40 ? 2 : r.rank <= 52 ? 1 : 0);

function table(el, heads, body, onRow) {
  el.replaceChildren(h("thead", {}, h("tr", {}, heads.map(([t, n]) => h("th", { class: n ? "n" : "" }, t)))));
  const tb = h("tbody");
  for (const { cells, cls, id } of body) {
    const tr = h("tr", { class: cls || "", tabindex: onRow ? "0" : null });
    cells.forEach((c, i) => tr.append(c instanceof Node ? h("td", { class: heads[i][1] ? "n" : "" }, c) : h("td", { class: heads[i][1] ? "n" : "" }, c)));
    if (onRow) { tr.addEventListener("click", () => onRow(id)); tr.addEventListener("keydown", (e) => { if (e.key === "Enter") onRow(id); }); }
    tb.append(tr);
  }
  el.append(tb);
}

function renderHeat() {
  const box = $("#heat");
  box.replaceChildren();
  for (const c of S.plan.cities.filter((c) => S.city === "All" || c.city === S.city)) {
    const ws = S.plan.wards.filter((r) => r.city === c.city).sort((a, b) => a.ward_id.localeCompare(b.ward_id));
    const tiles = h("div", { class: "tiles" }, ws.map((r) => h("button", {
      class: `tile t${bin(r)}${r.deficit ? " def" : ""}${r.ward_id === S.ward ? " sel" : ""}`,
      title: `${r.ward_id}: ${r.cases} cases/wk, priority rank ${r.rank}${r.deficit ? ", CRITICAL DEFICIT" : ""}`,
      "aria-label": `${r.ward_id}, priority rank ${r.rank}${r.deficit ? ", critical deficit" : ""}`,
      onclick: () => pick(r.ward_id) }, r.ward_id.slice(-2))));
    box.append(h("div", { class: "hrow" }, h("span", {}, c.city, h("small", {}, `${c.wards} wards`)), tiles));
  }
  const t = S.plan.totals, p = S.plan.params;
  $("#totals").replaceChildren(
    h("span", {}, "Saline ", h("b", {}, `${t.saline.allocated} of ${t.saline.required}`)),
    h("span", {}, "Kits ", h("b", {}, `${t.kits.allocated} of ${t.kits.required}`)),
    h("span", {}, "Crews ", h("b", {}, `${t.crews.allocated} of ${t.crews.required}`)),
    h("span", { class: S.plan.deficit_wards ? "bad" : "ok" }, `${S.plan.deficit_wards} wards in ${S.plan.deficit_wards ? "CRITICAL DEFICIT" : "deficit: none"}`),
    h("span", { class: S.plan.unmet_beds ? "bad" : "" }, `Unmet bed demand: ${S.plan.unmet_beds}`));
}

function renderAlloc() {
  const ratio = (a, r) => `${a} / ${r}`;
  table(
    $("#alloc"),
    [["Rank", 1], ["Ward"], ["Cases/wk", 1], ["Priority", 1], ["Saline", 1], ["Kits", 1], ["Crews", 1], ["Status"]],
    rows().map((r) => ({
      id: r.ward_id,
      cls: r.ward_id === S.ward ? "sel" : "",
      cells: [
        r.rank,
        r.ward_id,
        r.cases,
        f2(r.priority),
        ratio(r.saline_alloc, r.saline_req),
        ratio(r.kits_alloc, r.kits_req),
        ratio(r.crews_alloc, r.crews_req),
        r.deficit
          ? h(
              "span",
              { class: "badge" },
              `CRITICAL DEFICIT: short ${[
                ["saline", r.saline_short],
                ["kits", r.kits_short],
                ["crews", r.crews_short],
              ]
                .filter((x) => x[1] > 0)
                .map((x) => `${x[0]} ${x[1]}`)
                .join(", ")}`
            )
          : h("span", { class: "badge ok" }, "100% FULFILLED"),
      ],
    })),
    pick
  );
}
function renderBeds() {
  const m = S.plan.manifest.filter((x) => S.city === "All" || x.city === S.city);
  if (!m.length) $("#xfer").replaceChildren(h("caption", { class: "sub", style: "padding:10px;text-align:left" }, S.plan.unmet_beds ? "No ward has spare beds to receive transfers." : "No transfers needed at this load. Raise the surge to test overflow."));
  else table($("#xfer"), [["From ward"], ["To ward"], ["City"], ["Patients", 1]], m.map((x) => ({ cells: [x.from, x.to, x.city, x.patients] })));
  table($("#cityTbl"), [["City"], ["Demand", 1], ["Capacity", 1], ["Utilization", 1], ["Routed", 1], ["Unmet", 1]],
    S.plan.cities.filter((c) => S.city === "All" || c.city === S.city).map((c) => ({ cells: [c.city, c.demand, c.capacity, `${f1(c.utilization_pct)}%`, c.routed, c.unmet] })));
}

function renderBoard() {
  const dep = Object.fromEntries((S.sim.deployment || []).map((d) => [d.ward_id, d]));
  const t = S.sim.totals;
  $("#simTotals").replaceChildren(...(t.crews ? [
    h("span", {}, "Crews deployed ", h("b", {}, t.crews)), h("span", {}, "Cases prevented, weeks 2 to 4 ", h("b", {}, f1(t.cases_prevented))),
    h("span", {}, "Beds freed ", h("b", {}, f1(t.beds_freed))), h("span", {}, "Saline saved ", h("b", {}, f1(t.saline_saved))),
    h("span", {}, "ROI ", h("b", {}, `${f2(t.roi)} cases per crew`))] : [h("span", { class: "sub" }, "No crews deployed. Choose crews per ward below, or auto-assign.")]));
  table($("#board"), [["ROI rank", 1], ["Ward"], ["City"], ["Best crews", 1], ["Cases prevented", 1], ["Beds freed", 1], ["Saline saved", 1], ["ROI", 1], ["Engine"], ["Deploy"]],
    S.sim.leaderboard.filter((x) => S.city === "All" || x.city === S.city).map((x) => ({ cls: dep[x.ward_id] ? "dep" : "",
      cells: [x.rank, x.ward_id, x.city, x.best_crews, f2(x.cases_prevented), f2(x.beds_freed), f2(x.saline_saved), f2(x.roi), x.engine,
        h("select", { "aria-label": `Crews for ${x.ward_id}`, onchange: (e) => { S.asg[x.ward_id] = +e.target.value; } },
          [0, 1, 2, 3].map((k) => h("option", { value: k, selected: (S.asg[x.ward_id] || 0) === k }, k)))] })));
}

async function loadBoard(body) {
  S.sim = await api("/api/vector-simulate", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: S.scenario, basis: S.basis, surge: S.surge, assignments: {}, auto_crews: null, ...body }) });
  renderBoard();
}

async function loadDispatch() {
  if (!S.ward) return;
  const d = await api(`/api/dispatch/${S.ward}?${q()}`);
  S.texts = { sms: d.sms, wa: d.whatsapp, doc: d.commissioner_html };
  $("#smsTxt").textContent = d.sms;
  $("#smsLen").textContent = `${d.sms_length} of 160 characters`;
  $("#waTxt").textContent = d.whatsapp;
  $("#docFrame").srcdoc = d.commissioner_html;
}

function pick(id) { S.ward = id; $("#wardSel").value = id; renderHeat(); renderAlloc(); loadDispatch(); }

async function refresh() {
  S.plan = await api(`/api/operations?${q()}`);
  const vis = rows();
  if (!vis.find((r) => r.ward_id === S.ward)) S.ward = vis[0].ward_id;
  $("#wardSel").replaceChildren(...vis.slice().sort((a, b) => a.ward_id.localeCompare(b.ward_id)).map((r) => h("option", { value: r.ward_id }, r.ward_id)));
  $("#wardSel").value = S.ward;
  renderHeat(); renderAlloc(); renderBeds();
  await loadDispatch();
}
async function reloadAll() { S.asg = {}; await refresh(); await loadBoard({}); }

function bindRange(id, key, fmt) {
  const el = $(id);
  el.addEventListener("input", () => { S[key] = +el.value; $(id + "O").textContent = fmt(S[key]); later(async () => { await refresh(); if (key === "surge") await loadBoard({}); }); });
}

async function init() {
  const st = await api("/api/status");
  $("#mode").textContent = st.mode;
  $("#mode").title = `Forecast engine: ${st.engine.peak === "ml" ? "serialized models loaded" : "precomputed forecasts"}`;
  $("#lblPeak").textContent = `Peak-season replay (origin ${st.scenarios.peak.as_of}, out-of-sample models)`;
  $("#lblLive").textContent = `Live forecast (origin ${st.scenarios.live.as_of})`;
  const info = () => { const s = st.scenarios[S.scenario]; $("#asof").textContent = `Forecast origin ${s.as_of}. Targets: ${Object.values(s.targets).join(", ")}`; };
  info();
  $("#city").replaceChildren(...["All", ...st.cities].map((c) => h("option", { value: c }, c)));
  $("#city").addEventListener("change", (e) => { S.city = e.target.value; refresh().then(() => loadBoard({})); });
  $("#basis").addEventListener("change", (e) => { S.basis = e.target.value; reloadAll(); });
  document.querySelectorAll("input[name=scenario]").forEach((r) => r.addEventListener("change", (e) => { S.scenario = e.target.value; info(); reloadAll(); }));
  bindRange("#stock", "stock", (v) => `${v}%`);
  bindRange("#crews", "crews", (v) => v);
  bindRange("#surge", "surge", (v) => `${Number(v).toFixed(1)}x`);
  $("#wardSel").addEventListener("change", (e) => pick(e.target.value));
  $("#autoBtn").addEventListener("click", async () => { S.asg = {}; await loadBoard({ auto_crews: +$("#auto").value }); (S.sim.deployment || []).forEach((d) => { S.asg[d.ward_id] = d.crews; }); renderBoard(); });
  $("#selBtn").addEventListener("click", () => loadBoard({ assignments: Object.fromEntries(Object.entries(S.asg).filter(([, k]) => k > 0)) }));
  $("#clrBtn").addEventListener("click", () => { S.asg = {}; loadBoard({}); });
  document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => {
    S.tab = b.dataset.tab;
    document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    ["sms", "wa", "doc"].forEach((t) => { $(`#pane-${t}`).hidden = t !== S.tab; });
  }));
  $("#copyBtn").addEventListener("click", () => navigator.clipboard && navigator.clipboard.writeText(S.texts[S.tab] || ""));
  $("#printBtn").addEventListener("click", () => {
    document.querySelector('.tabs button[data-tab="doc"]').click();
    const w = $("#docFrame").contentWindow; w.focus(); w.print();
  });
  $("#stressBtn").addEventListener("click", async () => {
    const dlg = $("#stress"); $("#stressSum").textContent = "Running with all outbound connections blocked..."; $("#stressList").replaceChildren(); dlg.showModal();
    try {
      const r = await api(`/api/stress-test?scenario=${S.scenario}`);
      const s = r.stress;
      $("#stressSum").textContent = `${r.passed ? "PASS" : "FAIL"}: ${r.checks.filter((c) => c.passed).length} of ${r.checks.length} checks in ${r.elapsed_ms} ms. Worst case: surge ${s.surge}x, stock ${s.stock_pct}%, ${s.crews} crews gives ${s.deficit_wards} wards in CRITICAL DEFICIT and ${s.unmet_beds} unmet bed demand.`;
      $("#stressList").replaceChildren(...r.checks.map((c) => h("li", {}, h("span", { class: c.passed ? "pass" : "fail" }, c.passed ? "PASS" : "FAIL"), h("div", {}, c.check, h("small", {}, c.detail)))));
    } catch (e) { $("#stressSum").textContent = `Stress test failed to run: ${e.message}`; }
  });
  $("#stressClose").addEventListener("click", () => $("#stress").close());
  await reloadAll();
}
init().catch((e) => { document.body.prepend(h("p", { class: "mode", role: "alert" }, `Engine not reachable: ${e.message}. Start it with: uvicorn app:app --host 127.0.0.1 --port 8000`)); });
