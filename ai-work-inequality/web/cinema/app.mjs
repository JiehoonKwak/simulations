import {
  simulate,
  PARAMS,
  DEFAULT_PARAMS,
  PRESETS,
  VERSION,
} from "../empirical-model.mjs";
import { scenarioEnvelope } from "../sensitivity.mjs";
import { drawContinuous } from "./continuous.mjs";

const $ = (selector) => document.querySelector(selector);
const canvas = $("#scene"),
  ctx = canvas.getContext("2d");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  time: 0,
  motion: 0,
  playing: !reduced.matches,
  speed: 1,
  loop: true,
  ending: 0,
  provider: "P1",
  hover: null,
};
let params = { ...DEFAULT_PARAMS },
  run = simulate(params),
  reference = simulate(DEFAULT_PARAMS);
let width = 0,
  height = 0,
  dpr = 1,
  last = null,
  hits = [],
  dirty = true,
  uiKey = "";
let envelopeCache = null;
function envelopeForRun() {
  const varyEconomy = $("#preset").value !== "hold";
  const key = `${run.signature}:${varyEconomy}`;
  if (envelopeCache?.key !== key)
    envelopeCache = {
      key,
      value: scenarioEnvelope(run.params, { varyEconomy }),
    };
  return envelopeCache.value;
}
const clamp = (n, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, n));
const currentFrame = () => run.frames[Math.floor(state.time)];
const fmt = (n, d = 1) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      })
    : "—";
const escapeHTML = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function pause() {
  state.playing = false;
  last = null;
  dirty = true;
}
function closeDrawers() {
  for (const id of ["settings", "inspector"]) $(`#${id}`).hidden = true;
  $("#settings-open").setAttribute("aria-expanded", "false");
  $("#inspect").setAttribute("aria-expanded", "false");
}
function openDrawer(id) {
  const hidden = $(`#${id}`).hidden;
  closeDrawers();
  if (hidden) {
    pause();
    $(`#${id}`).hidden = false;
    $(id === "settings" ? "#settings-open" : "#inspect").setAttribute(
      "aria-expanded",
      "true",
    );
    renderInspector();
    $(`#${id} [data-close]`).focus({ preventScroll: true });
  }
}
function selectGroup(provider) {
  state.provider = provider;
  state.hover = null;
  dirty = true;
  uiKey = "";
  if ($("#inspector").hidden) openDrawer("inspector");
  else renderInspector();
}
function renderInspector() {
  if ($("#inspector").hidden) return;
  const f = currentFrame();
  const envelope = envelopeForRun();
  const intervals = envelope.frames[Math.floor(state.time)].groups;
  $("#sensitivity-explanation").textContent = envelope.varyEconomy
    ? "Range across task mix, oversight, inferred weights, and ±10 percentage-point payment/demand changes. Not a confidence interval."
    : "Range across task mix, oversight, and inferred weights. Payment and demand held fixed. Not a confidence interval.";
  $("#results-year").textContent = `${f.year} · current scenario`;
  $("#group-results").innerHTML = f.groups
    .map(
      (g) =>
        `<section class="group-result ${g.id === (state.provider === "P1" ? "proprietor" : "salaried") ? "selected" : ""}"><h3>${escapeHTML(g.label)}</h3><div><span>Real earnings</span><strong>${fmt(g.ownIncomeIndex)} <small>index</small></strong></div><p class="sensitivity-range">Sensitivity ${fmt(intervals.find((r) => r.id === g.id).earnings.min, 0)}–${fmt(intervals.find((r) => r.id === g.id).earnings.max, 0)}</p><div><span>Original positions retained</span><strong>${fmt(g.retainedShare * 100)}%</strong></div><div><span>Required clinical work</span><strong>${fmt(g.requiredWorkIndex)} <small>index</small></strong></div></section>`,
    )
    .join("");
  $("#distribution-results").innerHTML =
    `<div><dt>Proprietor / salaried earnings</dt><dd>${fmt(f.metrics.incomeRatio, 2)}×</dd></div><div><dt>Between-role dispersion</dt><dd>${fmt(f.metrics.betweenGini, 3)}</dd></div>`;
  $("#baseline-results").innerHTML =
    run.frames[0].groups
      .map(
        (g) =>
          `<p class="anchor-row"><span>${escapeHTML(g.label)}</span><strong>₩${fmt(g.baselineIncomeKRW / 1e6, 1)}m</strong></p>`,
      )
      .join("") +
    `<p class="chart-note">Adjusted annual earnings · full-time physicians; residents excluded · 2020</p><p class="muted">${run.baseline.workforce.year} institution-reported physicians: ${fmt(run.baseline.workforce.physicians, 0)}. Context only; not earnings sample weights.</p>`;
  $("#signature").textContent = `${run.signature}`;
  renderChart();
}
function renderChart() {
  const envelope = envelopeForRun();
  const groups = run.frames[0].groups,
    colors = ["#ac765c", "#658b82"];
  const values = [...run.frames, ...reference.frames].flatMap((f) =>
    f.groups.map((g) => g.ownIncomeIndex),
  );
  values.push(
    ...envelope.frames.flatMap((f) => f.groups.map((g) => g.earnings.max)),
  );
  const max = Math.max(125, Math.ceil(Math.max(...values) / 25) * 25),
    L = 32,
    R = 309,
    T = 12,
    B = 124,
    x = (i) => L + (i * (R - L)) / 10,
    y = (value) => B - (value / max) * (B - T);
  let html = "";
  for (const value of [0, max / 2, max])
    html += `<line x1="${L}" x2="${R}" y1="${y(value)}" y2="${y(value)}" stroke="#d7dacf"/><text x="25" y="${y(value) + 3}" text-anchor="end">${fmt(value, 0)}</text>`;
  for (const year of [0, 5, 10])
    html += `<text x="${x(year)}" y="145" text-anchor="middle">${2026 + year}</text>`;
  groups.forEach((g, index) => {
    const bounds = envelope.frames.map(
      (f) => f.groups.find((row) => row.id === g.id).earnings,
    );
    const upper = bounds
      .map((b, i) => `${i ? "L" : "M"}${x(i)},${y(Math.max(0, b.max))}`)
      .join(" ");
    const lower = bounds
      .map((b, i) => [i, b])
      .reverse()
      .map(([i, b]) => `L${x(i)},${y(Math.max(0, b.min))}`)
      .join(" ");
    html += `<path d="${upper} ${lower} Z" fill="${colors[index]}" fill-opacity=".14" stroke="none"/>`;
  });
  for (const [ri, result] of [run, reference].entries())
    groups.forEach((g, index) => {
      html += `<path d="${result.frames.map((f, i) => `${i ? "L" : "M"}${x(i)},${y(f.groups.find((r) => r.id === g.id).ownIncomeIndex)}`).join(" ")}" fill="none" stroke="${colors[index]}" stroke-width="${ri ? 1.3 : 2}" ${ri ? 'stroke-dasharray="4 4" opacity=".55"' : ""}/>`;
    });
  html += `<line x1="${x(state.time)}" x2="${x(state.time)}" y1="${T}" y2="${B}" stroke="#728174" stroke-dasharray="2 4"/>`;
  $("#earnings-chart").innerHTML = html;
}
function updateUI() {
  const f = currentFrame();
  $("#film").dataset.time = state.time.toFixed(3);
  $("#film").dataset.motion = state.motion.toFixed(3);
  $("#play").textContent = state.playing ? "Ⅱ" : "▶";
  $("#play").setAttribute("aria-label", state.playing ? "Pause" : "Play");
  $("#play").setAttribute("aria-pressed", state.playing);
  $("#loop").setAttribute("aria-pressed", state.loop);
  $("#timeline").value = state.time;
  $("#timeline").style.setProperty("--progress", `${state.time * 10}%`);
  $("#timeline").setAttribute("aria-valuetext", `${f.year}`);
  const key = `${f.year}:${run.signature}:${state.provider}`;
  if (key === uiKey) return;
  uiKey = key;
  $("#year").textContent = f.year;
  $("#working").textContent = fmt(f.metrics.workIndex, 0);
  $("#volume").textContent = fmt(f.metrics.volumeIndex, 0);
  $("#income").textContent = fmt(f.metrics.incomeIndex, 0);
  canvas.setAttribute(
    "aria-label",
    `${f.year}. Practice proprietors and salaried physicians in schematic work settings. Clinical work index ${fmt(f.metrics.workIndex, 0)}, care index ${fmt(f.metrics.volumeIndex, 0)}, real earnings ${fmt(f.metrics.incomeIndex, 0)}; 2026 equals 100.`,
  );
  renderInspector();
}
function render() {
  if (!width || !height) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  hits = drawContinuous(ctx, {
    width,
    height,
    time: state.time,
    motion: state.motion,
    frame: currentFrame(),
    next: run.frames[Math.min(10, Math.floor(state.time) + 1)],
    mix: reduced.matches ? 0 : state.time % 1,
    baseline: run.frames[0],
    providerIds: ["P1", "P2"],
    selectedId: state.provider,
    hoverId: state.hover,
    reduced: reduced.matches,
  });
  updateUI();
  dirty = false;
}
function resize() {
  const r = canvas.getBoundingClientRect();
  width = r.width;
  height = r.height;
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  dirty = true;
}
function recompute() {
  try {
    const candidate = simulate(params);
    if (!candidate.checks.passed) throw new Error("Model verification failed");
    run = candidate;
    envelopeCache = null;
    dirty = true;
    uiKey = "";
    $("#error").hidden = true;
    renderInspector();
  } catch (e) {
    pause();
    $("#error").textContent = e.message;
    $("#error").hidden = false;
  }
}
function formatParam(p, value) {
  if (p.unit === "%") return `${fmt(value, Number.isInteger(p.step) ? 0 : 1)}%`;
  if (p.key === "timing") return fmt(value, 1);
  if (!p.unit) return `${fmt(value * 100, p.step < 0.01 ? 1 : 0)}%`;
  return `${fmt(value, p.step >= 1 ? 0 : p.step < 0.1 ? 2 : 1)} ${p.unit}`;
}
function updateParams() {
  for (const p of PARAMS) {
    const input = $(`#param-${p.key}`);
    input.value = params[p.key];
    input.style.setProperty(
      "--progress",
      `${((params[p.key] - p.min) / (p.max - p.min)) * 100}%`,
    );
    $(`#value-${p.key}`).value = formatParam(p, params[p.key]);
  }
}
function initControls() {
  $("#preset").replaceChildren(
    ...PRESETS.map((p) => new Option(p.label, p.id)),
    new Option("Custom assumptions", "custom"),
  );
  const active = PRESETS.find(
    (p) =>
      JSON.stringify({ ...DEFAULT_PARAMS, ...p.params }) ===
      JSON.stringify(params),
  );
  $("#preset").value = active?.id || "custom";
  $("#preset-description").textContent = active?.description || "";
  const primary = [
    "documentationSavings",
    "demandChange",
    "feeChange",
    "staffingResponse",
    "captureSalaried",
  ];
  for (const p of PARAMS) {
    const item = document.createElement("div");
    item.className = "parameter";
    item.innerHTML = `<label for="param-${p.key}">${escapeHTML(p.label)}<output id="value-${p.key}"></output></label><input id="param-${p.key}" type="range" min="${p.min}" max="${p.max}" step="${p.step}" aria-describedby="description-${p.key}"><p id="description-${p.key}">${escapeHTML(p.description)}</p>`;
    $(
      primary.includes(p.key) ? "#parameter-controls" : "#more-controls",
    ).append(item);
    item.querySelector("input").oninput = (e) => {
      params[p.key] = Number(e.target.value);
      $("#preset").value = "custom";
      $("#preset-description").textContent = "";
      pause();
      recompute();
      updateParams();
    };
  }
  updateParams();
}
function restart() {
  closeDrawers();
  state.time = 0;
  state.motion = 0;
  state.ending = 0;
  state.playing = !reduced.matches;
  last = null;
  dirty = true;
}
initControls();
const sourceRows = run.baseline?.sources || [
  {
    title: "MOHW · Health workforce survey",
    url: "https://www.mohw.go.kr/board.es?act=view&bid=0027&cg_code=&list_no=372681&mid=a10503010100&tag=",
  },
];
$("#sources").innerHTML = sourceRows
  .filter((s) => /^https?:\/\//.test(s.url))
  .map(
    (s) =>
      `<li><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener">${escapeHTML(s.title)}${s.year ? " · " + escapeHTML(s.year) : ""}</a></li>`,
  )
  .join("");
$(".wordmark").onclick = (e) => {
  e.preventDefault();
  restart();
};
$("#play").onclick = () => {
  closeDrawers();
  if (state.time >= 10 && !state.playing) {
    state.time = 0;
    state.motion = 0;
    state.ending = 0;
  }
  state.playing = !state.playing;
  last = null;
  dirty = true;
};
$("#restart").onclick = restart;
$("#timeline").oninput = (e) => {
  pause();
  state.time = clamp(Number(e.target.value));
  state.motion = state.time * 1.6;
  state.ending = 0;
  dirty = true;
};
$("#loop").onclick = () => {
  state.loop = !state.loop;
  dirty = true;
};
$("#speed").onchange = (e) => {
  state.speed = Number(e.target.value);
  last = null;
};
$("#settings-open").onclick = () => openDrawer("settings");
$("#inspect").onclick = () => openDrawer("inspector");
for (const b of document.querySelectorAll("[data-group]"))
  b.onclick = () => {
    pause();
    selectGroup(b.dataset.group === "proprietor" ? "P1" : "P2");
  };
for (const b of document.querySelectorAll("[data-close]"))
  b.onclick = () => {
    const settings = b.closest("#settings");
    closeDrawers();
    $(settings ? "#settings-open" : "#inspect").focus({ preventScroll: true });
  };
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawers();
});
$("#preset").onchange = (e) => {
  const p = PRESETS.find((p) => p.id === e.target.value);
  if (!p) return;
  params = { ...DEFAULT_PARAMS, ...p.params };
  $("#preset-description").textContent = p.description || "";
  pause();
  recompute();
  updateParams();
};
$("#reset-conditions").onclick = () => {
  params = { ...DEFAULT_PARAMS };
  pause();
  recompute();
  updateParams();
  const p = PRESETS.find(
    (p) =>
      JSON.stringify({ ...DEFAULT_PARAMS, ...p.params }) ===
      JSON.stringify(params),
  );
  $("#preset").value = p?.id || "custom";
  $("#preset-description").textContent = p?.description || "";
};
$("#export-results").onclick = () => {
  const data = {
    schema: "physician-empirical-scenario-v1",
    modelVersion: VERSION,
    signature: run.signature,
    params: run.params,
    structure: run.structure,
    baselineInputHashes: run.baseline.inputHashes,
    baseline: run.baseline,
    frames: run.frames,
    checks: run.checks,
    sensitivity: envelopeForRun(),
    comparison: {
      params: reference.params,
      structure: reference.structure,
      signature: reference.signature,
      frames: reference.frames,
    },
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "physician-scenario-results.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
};
function hitAt(e) {
  const r = canvas.getBoundingClientRect(),
    x = e.clientX - r.left,
    y = e.clientY - r.top;
  return hits.findLast(
    (h) => x >= h.x && x <= h.x + h.width && y >= h.y && y <= h.y + h.height,
  );
}
canvas.addEventListener("pointermove", (e) => {
  const hit = hitAt(e),
    hover = hit?.id ?? null;
  if (hover !== state.hover) {
    state.hover = hover;
    dirty = true;
  }
  canvas.style.cursor = hit ? "pointer" : "default";
});
canvas.addEventListener("pointerleave", () => {
  state.hover = null;
  dirty = true;
});
canvas.addEventListener("click", (e) => {
  const hit = hitAt(e);
  if (!hit) return;
  pause();
  const provider =
    hit.providerId ??
    (hit.kind === "provider"
      ? hit.id
      : currentFrame().physicians.find((p) => p.id === hit.id)?.providerId);
  if (provider) selectGroup(provider);
});
document.addEventListener("visibilitychange", () => {
  last = null;
});
reduced.addEventListener("change", () => {
  if (reduced.matches) pause();
  dirty = true;
});
new ResizeObserver(resize).observe(canvas);
resize();
function tick(now) {
  const elapsed = last === null ? 0 : clamp(now - last, 0, 80);
  last = now;
  if (!document.hidden) {
    if (state.playing) {
      state.motion += (elapsed * state.speed) / 1000;
      if (state.time < 10)
        state.time = clamp(state.time + (elapsed * state.speed) / 1600);
      else if (state.loop) {
        state.ending += elapsed * state.speed;
        if (state.ending >= 1500) {
          state.time = 0;
          state.motion = 0;
          state.ending = 0;
        }
      } else state.playing = false;
      dirty = true;
    }
    if (dirty) render();
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
