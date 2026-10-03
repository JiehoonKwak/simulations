import { PARAMS, DEFAULT_PARAMS, PRESETS, simulate } from "./model.mjs";
const $ = (id) => document.getElementById(id);
const COLORS = [
  "#00877d",
  "#d46b4d",
  "#3e7eab",
  "#9a729c",
  "#a48638",
  "#627b87",
];
const state = {
  params: { ...DEFAULT_PARAMS },
  seed: 42,
  index: 0,
  dimension: "setting",
  result: null,
  reference: null,
  selected: null,
  playing: false,
  timer: null,
  sweepCache: null,
};
const fmt = (x, d = 1) =>
  Number.isFinite(x)
    ? x.toLocaleString("ko-KR", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      })
    : "—";
const pct = (x) => (Number.isFinite(x) ? `${fmt(x * 100)}%` : "—");
const paramValue = (p, v) =>
  `${fmt(v, p.step < 1 ? (p.step < 0.1 ? 2 : 1) : 0)}${p.unit ? ` ${p.unit}` : ""}`;
const escapeHTML = (x) =>
  String(x).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function notice(text) {
  $("notice").textContent = text;
  $("notice").classList.add("show");
  clearTimeout(notice.timer);
  notice.timer = setTimeout(() => $("notice").classList.remove("show"), 3200);
}
function fail(error) {
  pause();
  $("error").hidden = false;
  $("error").textContent = `계산을 표시할 수 없습니다: ${error.message}`;
}
function checked(params, seed) {
  const result = simulate(params, seed);
  if (!result.checks.passed)
    throw new Error("모형의 검증 조건을 통과하지 못했습니다.");
  return result;
}
function run() {
  clearPaired();
  try {
    state.result = checked(state.params, state.seed);
    state.sweepCache = null;
    $("error").hidden = true;
    render();
    renderSweep();
  } catch (e) {
    fail(e);
  }
}
function createControls() {
  $("preset").innerHTML =
    '<option value="custom">직접 조절</option>' +
    PRESETS.map(
      (p) =>
        `<option value="${escapeHTML(p.id)}">${escapeHTML(p.label)}</option>`,
    ).join("");
  const groups = [...new Set(PARAMS.map((p) => p.group))];
  $("parameters").innerHTML = groups
    .map(
      (group) =>
        `<section class="parameter-group"><h3>${escapeHTML(group)}</h3>${PARAMS.filter(
          (p) => p.group === group,
        )
          .map(
            (p) =>
              `<div class="parameter"><div class="parameter-line"><label for="param-${p.key}">${escapeHTML(p.label)}</label><output id="out-${p.key}" for="param-${p.key}"></output></div><input id="param-${p.key}" type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${state.params[p.key]}" aria-describedby="desc-${p.key}"><p class="small" id="desc-${p.key}">${escapeHTML(p.description)}</p></div>`,
          )
          .join("")}</section>`,
    )
    .join("");
  $("sweep-param").innerHTML = PARAMS.map(
    (p) => `<option value="${p.key}">${escapeHTML(p.label)}</option>`,
  ).join("");
  for (const p of PARAMS)
    $(`param-${p.key}`).addEventListener("input", (e) => {
      pause();
      state.params[p.key] = Number(e.target.value);
      $("preset").value = "custom";
      $("preset-description").textContent = "각 조건을 직접 조절하고 있습니다.";
      syncControls();
      run();
    });
  syncControls();
}
function syncControls() {
  for (const p of PARAMS) {
    $(`param-${p.key}`).value = state.params[p.key];
    $(`out-${p.key}`).textContent = paramValue(p, state.params[p.key]);
  }
  $("seed").value = state.seed;
}
const frame = () => state.result.frames[state.index];
const groupsOf = (f) => f.groups.filter((g) => g.dimension === state.dimension);
function personGroup(p, groups) {
  if (state.dimension === "role")
    return groups.findIndex((g) => g.key === p.role);
  if (state.dimension === "clinical")
    return groups.findIndex((g) => g.key === p.clinical);
  if (state.dimension === "setting")
    return groups.findIndex(
      (g) =>
        g.key === `${p.region}-${p.size}` ||
        g.key === `${p.size}-${p.region}` ||
        g.key === `${p.region}_${p.size}` ||
        (g.key.includes(p.region) && g.key.includes(p.size)),
    );
  return groups.findIndex(
    (g) =>
      g.key === (p.experience >= 10 ? "experienced" : "early") ||
      g.key === (p.experience >= 10 ? "senior" : "junior"),
  );
}
function stableHash(s) {
  let h = 2166136261;
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
function incomeMax() {
  let max = 150;
  for (const r of [state.result, state.reference].filter(Boolean))
    for (const f of r.frames)
      for (const p of f.physicians) max = Math.max(max, p.incomeIndex);
  return Math.ceil(max / 100) * 100;
}
function render() {
  const f = frame();
  $("year").textContent = f.year;
  $("timeline").value = state.index;
  $("timeline").setAttribute("aria-valuetext", `${f.year}년`);
  $("previous").disabled = state.index === 0;
  $("next").disabled = state.index === 10;
  const ref = state.reference?.frames[state.index];
  $("distribution-summary").innerHTML =
    `<span>초기 하위 50% 소득 <strong>${fmt(f.metrics.lowerHalfIncomeIndex)}</strong></span><span>상위 10% 소득 점유율 <strong>${pct(f.metrics.topShare)}</strong></span><span>소득 없는 의사 <strong>${pct(f.physicians.filter((p) => p.incomeIndex <= 0).length / f.physicians.length)}</strong></span><span>소득 Gini <strong>${fmt(f.metrics.gini, 3)}</strong></span>`;
  const specs = [
    ["평균 실질소득", "incomeIndex", "", "출발 집단 전체 · 2026년 평균 100"],
    ["고용 유지율", "employmentRate", "%", "출발 의사 집단 중 진료 중인 비율"],
    ["집단 임상 자율성", "autonomy", "%", "출발 집단 평균 · 진료 이탈은 0"],
    ["의료기관 폐업률", "closedRate", "%", "가상 의료기관 기준"],
  ];
  $("kpis").innerHTML = specs
    .map(([label, key, unit, note]) => {
      const v = f.metrics[key] * (unit ? 100 : 1),
        r = ref?.metrics[key] * (unit ? 100 : 1);
      return `<div><div class="kpi-label">${label}</div><div class="kpi-value">${fmt(v)}<small>${unit}</small></div><div class="kpi-note">${ref ? `고정 조건 대비 ${v - r >= 0 ? "+" : ""}${fmt(v - r)}${unit ? "%p" : ""}` : note}</div></div>`;
    })
    .join("");
  $("verification").textContent =
    `계산 검증 통과 · seed ${state.seed} · ${state.result.version} · ${state.result.signature}`;
  const groups = groupsOf(f);
  $("legend").innerHTML = groups
    .map(
      (g, i) =>
        `<span class="legend-item"><i style="background:${COLORS[i % COLORS.length]}"></i>${escapeHTML(g.label)}</span>`,
    )
    .join("");
  $("live-drivers").textContent =
    `판단 추가 자동화 ${pct(f.drivers.cognition)} · 처치 ${pct(f.drivers.procedure)} · 보급 ${pct(f.drivers.adoption)} · 수가 ${fmt(f.drivers.fee, 2)}×`;
  renderDistribution(groups);
  renderTrajectories(groups);
  renderDrivers();
  renderPerson();
  renderComparison();
}
let currentStructure = "";
function renderDistribution(groups) {
  const svg = $("distribution-chart"),
    f = frame(),
    max = incomeMax(),
    left = 58,
    right = 875,
    top = 20,
    bottom = 182,
    zero = 212;
  const x = (i) => left + ((i + 0.5) * (right - left)) / groups.length,
    y = (v) => bottom - (v / max) * (bottom - top);
  const structure = `${state.dimension}/${state.seed}/${max}/${groups.map((g) => g.key).join(",")}`;
  if (currentStructure !== structure) {
    currentStructure = structure;
    let content = "";
    for (let tick = 0; tick <= 4; tick++) {
      let val = (max * tick) / 4,
        yy = y(val);
      content += `<line x1="${left}" y1="${yy}" x2="${right}" y2="${yy}" class="axis-line"/><text x="${left - 12}" y="${yy + 4}" text-anchor="end">${fmt(val, 0)}</text>`;
    }
    content += `<text x="${left}" y="13">실질소득 지수</text><rect x="${left}" y="198" width="${right - left}" height="28" rx="4" fill="#eaf0f1"/><text x="${left - 10}" y="216" text-anchor="end">무소득</text>`;
    groups.forEach((g, i) => {
      content += `<text x="${x(i)}" y="240" text-anchor="middle">${escapeHTML(g.label)}</text>`;
    });
    content += '<g id="reference-dots"></g><g id="physician-dots"></g>';
    svg.innerHTML = content;
    for (const p of f.physicians) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.id = `dot-${p.id}`;
      circle.classList.add("dot");
      circle.setAttribute("r", "3.5");
      circle.setAttribute("tabindex", "0");
      circle.setAttribute("role", "button");
      circle.addEventListener("click", () => {
        state.selected = p.id;
        renderPerson();
        renderDistribution(groupsOf(frame()));
      });
      circle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          state.selected = p.id;
          renderPerson();
          renderDistribution(groupsOf(frame()));
        }
      });
      $("physician-dots").append(circle);
    }
  }
  const groupOf = (p) => {
    let i = personGroup(p, groups);
    if (i < 0 && state.dimension === "experience") {
      const years = p.experience;
      i =
        groups.length === 2
          ? years >= 15
            ? 1
            : 0
          : Math.min(groups.length - 1, Math.floor(years / 10));
    }
    return Math.max(0, i);
  };
  const coords = (p) => {
    const i = groupOf(p);
    return {
      i,
      cx:
        x(i) +
        ((((stableHash(p.id) % 1000) / 1000 - 0.5) * (right - left)) /
          groups.length) *
          0.72,
      cy:
        p.incomeIndex > 0
          ? y(p.incomeIndex)
          : zero + ((stableHash(`${p.id}exit`) % 9) - 4),
    };
  };
  for (const p of f.physicians) {
    const d = $(`dot-${p.id}`),
      { i, cx, cy } = coords(p);
    d.setAttribute("cx", cx);
    d.setAttribute("cy", cy);
    d.setAttribute("fill", p.employed ? COLORS[i % COLORS.length] : "#f6f8f8");
    d.setAttribute("r", state.selected === p.id ? "6" : "3.5");
    d.style.stroke =
      state.selected === p.id
        ? "#142c38"
        : p.employed
          ? "white"
          : COLORS[i % COLORS.length];
    d.style.strokeWidth = p.employed ? ".5" : "1.3";
    d.setAttribute(
      "aria-label",
      `의사 ${p.id}, 소득 ${fmt(p.incomeIndex)}, ${p.employed ? "진료 중" : "진료 이탈"}`,
    );
    d.innerHTML = `<title>의사 ${escapeHTML(p.id)} · 소득 ${fmt(p.incomeIndex)} · 자율성 ${pct(p.autonomy)}</title>`;
  }
  if (state.reference) {
    $("reference-dots").innerHTML = state.reference.frames[
      state.index
    ].physicians
      .map((p) => {
        const { cx, cy } = coords(p);
        return `<circle cx="${cx}" cy="${cy}" r="3.6" fill="none" stroke="#aebdc2" stroke-width=".8" opacity=".65"/>`;
      })
      .join("");
  } else $("reference-dots").innerHTML = "";
}
function renderTrajectories(groups) {
  const W = 900,
    H = 240,
    L = 58,
    R = 875,
    T = 18,
    B = 208;
  let max = 150;
  for (const result of [state.result, state.reference].filter(Boolean))
    for (const f of result.frames)
      for (const g of groupsOf(f)) max = Math.max(max, g.incomeIndex);
  max = Math.ceil(max / 50) * 50;
  const x = (i) => L + (i * (R - L)) / 10,
    y = (v) => B - (v / max) * (B - T);
  let s = "";
  for (let j = 0; j <= 3; j++) {
    const v = (max * j) / 3;
    s += `<line x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}" class="axis-line"/><text x="${L - 12}" y="${y(v) + 4}" text-anchor="end">${fmt(v, 0)}</text>`;
  }
  for (let i = 0; i <= 10; i += 2)
    s += `<text x="${x(i)}" y="232" text-anchor="middle">${2026 + i}</text>`;
  for (const [ri, result] of [state.result, state.reference].entries()) {
    if (!result) continue;
    groups.forEach((g, i) => {
      const vals = result.frames.map(
        (f) => groupsOf(f).find((x) => x.key === g.key)?.incomeIndex ?? 0,
      );
      s += `<path d="${vals.map((v, j) => `${j ? "L" : "M"}${x(j)},${y(v)}`).join(" ")}" fill="none" stroke="${COLORS[i % COLORS.length]}" stroke-width="${ri ? 1.5 : 2.5}" ${ri ? 'stroke-dasharray="5 5" opacity=".45"' : ""}/>`;
      if (!ri)
        s += `<circle cx="${x(state.index)}" cy="${y(vals[state.index])}" r="4" fill="${COLORS[i % COLORS.length]}"/>`;
    });
  }
  s += `<line x1="${x(state.index)}" x2="${x(state.index)}" y1="${T}" y2="${B}" stroke="#1f4858" stroke-dasharray="3 5" opacity=".4"/>`;
  $("trajectory-chart").innerHTML = s;
}
function renderDrivers() {
  const d = frame().drivers;
  const spec = [
    ["판단 추가 자동화", "cognition", 1],
    ["처치 추가 자동화", "procedure", 1],
    ["소통 추가 자동화", "communication", 1],
    ["실제 AI 보급", "adoption", 1],
    ["수가", "fee", 2],
    ["의료 수요", "demand", 2],
    ["외부 의사 공급 압력", "supply", 2],
    ["출발 집단 자율성", "autonomy", 1],
  ];
  $("drivers").innerHTML = spec
    .map(
      ([label, key, scale]) =>
        `<div><div class="driver-label"><span>${label}</span><span class="driver-value">${scale === 1 ? pct(d[key]) : `${fmt(d[key], 2)}×`}</span></div><div class="driver-track"><div class="driver-fill" style="width:${Math.max(0, Math.min(100, (d[key] / scale) * 100))}%"></div></div></div>`,
    )
    .join("");
}
function renderPerson() {
  const el = $("person");
  if (state.selected === null) {
    el.hidden = true;
    return;
  }
  const p = frame().physicians.find((p) => p.id === state.selected);
  if (!p) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  const selectedFrames = state.result.frames.filter((_, i) => i % 2 === 0);
  el.innerHTML = `<div class="person-title"><strong>의사 ${escapeHTML(p.id)} · ${p.role === "owner" ? "소유 의사" : "봉직의"} · ${p.region === "metro" ? "수도권" : "지역"} · 2026년 경력 ${fmt(p.experience, 0)}년</strong><button id="close-person" class="text-button" aria-label="개인 경로 닫기">닫기</button></div><p>${frame().year}년: ${p.employed ? "진료 중" : "진료 이탈"} · 소득 ${fmt(p.incomeIndex)} · 자율성 ${pct(p.autonomy)}</p><table><thead><tr><th>개인 경로</th>${selectedFrames.map((f) => `<th>${f.year}</th>`).join("")}</tr></thead><tbody>${[
    ["소득", "incomeIndex"],
    ["자율성", "autonomy"],
    ["진료", "employed"],
  ]
    .map(
      ([label, key]) =>
        `<tr><td>${label}</td>${selectedFrames
          .map((f) => {
            const v = f.physicians.find((q) => q.id === p.id)[key];
            return `<td>${key === "employed" ? (v ? "유지" : "이탈") : key === "autonomy" ? pct(v) : fmt(v)}</td>`;
          })
          .join("")}</tr>`,
    )
    .join("")}</tbody></table>`;
  $("close-person").onclick = () => {
    state.selected = null;
    renderPerson();
    renderDistribution(groupsOf(frame()));
  };
}
function renderComparison() {
  const ref = state.reference;
  $("paired-run").disabled = !ref;
  $("unpin").hidden = !ref;
  $("pin").textContent = ref ? "현재 조건으로 다시 고정" : "현재 조건 고정";
  if (!ref) {
    $("comparison-description").textContent =
      "지금의 조건을 고정한 뒤, 왼쪽에서 가정을 바꿔보세요.";
    return;
  }
  const diffs = PARAMS.filter((p) => ref.params[p.key] !== state.params[p.key]);
  $("comparison-description").textContent = diffs.length
    ? diffs
        .map(
          (p) =>
            `${p.label}: ${paramValue(p, ref.params[p.key])} → ${paramValue(p, state.params[p.key])}`,
        )
        .join(" · ")
    : "현재 조건과 같습니다. 회색 빈 점과 점선은 고정 조건입니다.";
}
function renderSweep() {
  if (!state.result) return;
  const p = PARAMS.find((p) => p.key === $("sweep-param").value);
  let values = [
    p.min,
    p.min + (p.max - p.min) * 0.25,
    state.params[p.key],
    p.min + (p.max - p.min) * 0.75,
    p.max,
  ].map((v) =>
    Number((Math.round((v - p.min) / p.step) * p.step + p.min).toFixed(8)),
  );
  values = [...new Set(values)].sort((a, b) => a - b);
  try {
    const rows = values.map((v) => ({
      v,
      result: checked({ ...state.params, [p.key]: v }, state.seed).frames.at(-1)
        .metrics,
    }));
    state.sweepCache = { parameter: p.key, rows };
    const max = Math.max(...rows.map((r) => r.result.incomeIndex));
    $("sweep-results").innerHTML =
      `<table><thead><tr><th>${escapeHTML(p.label)}</th><th>평균 소득</th><th>고용 유지율</th><th>초기 하위 50% 소득</th></tr></thead><tbody>${rows.map((r) => `<tr class="${Math.abs(r.v - state.params[p.key]) < 1e-7 ? "current-row" : ""}"><td>${paramValue(p, r.v)}${Math.abs(r.v - state.params[p.key]) < 1e-7 ? " · 현재" : ""}</td><td><span class="sensitivity-bar" style="--w:${(r.result.incomeIndex / max) * 95}px"></span>${fmt(r.result.incomeIndex)}</td><td>${pct(r.result.employmentRate)}</td><td>${fmt(r.result.lowerHalfIncomeIndex)}</td></tr>`).join("")}</tbody></table>`;
  } catch (e) {
    fail(e);
  }
}
function pause() {
  state.playing = false;
  clearTimeout(state.timer);
  $("play").textContent = "▶ 재생";
  $("play").setAttribute("aria-pressed", "false");
}
function tick() {
  if (!state.playing) return;
  if (state.index === 10) {
    pause();
    return;
  }
  state.index++;
  render();
  state.timer = setTimeout(tick, Number($("speed").value));
}
function download(name, data) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
function config() {
  return {
    schema: "physician-futures-config-v1",
    seed: state.seed,
    params: { ...state.params },
  };
}
function restore(data) {
  if (
    !data ||
    data.schema !== "physician-futures-config-v1" ||
    !Number.isInteger(data.seed) ||
    data.seed < 0 ||
    data.seed > 4294967295 ||
    !data.params
  )
    throw new Error("지원하는 설정 JSON이 아닙니다.");
  const params = {};
  for (const p of PARAMS) {
    const value = data.params[p.key];
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < p.min ||
      value > p.max
    )
      throw new Error(`${p.label} 값이 허용 범위를 벗어났습니다.`);
    params[p.key] = value;
  }
  const result = checked(params, data.seed);
  pause();
  state.params = params;
  state.seed = data.seed;
  state.result = result;
  state.reference = null;
  state.index = 0;
  state.selected = null;
  currentStructure = "";
  syncControls();
  $("preset").value = "custom";
  $("preset-description").textContent = "저장한 설정을 불러왔습니다.";
  $("error").hidden = true;
  render();
  renderSweep();
  notice("설정을 복원했습니다.");
}
createControls();
$("preset-description").textContent =
  "조건을 바꾸고 같은 집단의 10년을 비교하세요.";
$("preset").onchange = (e) => {
  const p = PRESETS.find((p) => p.id === e.target.value);
  if (!p) return;
  pause();
  state.params = { ...DEFAULT_PARAMS, ...p.params };
  $("preset-description").textContent = p.description;
  syncControls();
  run();
};
$("seed").onchange = (e) => {
  const seed = Number(e.target.value);
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) {
    e.target.value = state.seed;
    notice("seed는 0–4294967295 사이 정수입니다.");
    return;
  }
  pause();
  state.seed = seed;
  state.reference = null;
  state.selected = null;
  currentStructure = "";
  run();
  notice("새 집단으로 계산했습니다. 고정 비교를 해제했습니다.");
};
$("reset").onclick = () => {
  pause();
  state.params = { ...DEFAULT_PARAMS };
  state.seed = 42;
  state.index = 0;
  state.reference = null;
  state.selected = null;
  state.dimension = "setting";
  $("dimension").value = "setting";
  $("preset").value = "custom";
  $("preset-description").textContent = "기본 가정으로 돌아왔습니다.";
  currentStructure = "";
  syncControls();
  run();
};
$("play").onclick = () => {
  if (state.playing) {
    pause();
    return;
  }
  if (state.index === 10) {
    state.index = 0;
    render();
  }
  state.playing = true;
  $("play").textContent = "Ⅱ 일시정지";
  $("play").setAttribute("aria-pressed", "true");
  state.timer = setTimeout(tick, Number($("speed").value));
};
$("timeline").oninput = (e) => {
  pause();
  state.index = Number(e.target.value);
  render();
};
$("previous").onclick = () => {
  pause();
  state.index = Math.max(0, state.index - 1);
  render();
};
$("next").onclick = () => {
  pause();
  state.index = Math.min(10, state.index + 1);
  render();
};
$("restart").onclick = () => {
  pause();
  state.index = 0;
  render();
};
$("dimension").onchange = (e) => {
  state.dimension = e.target.value;
  render();
};
$("sweep-param").onchange = renderSweep;
$("pin").onclick = () => {
  clearPaired();
  state.reference = state.result;
  currentStructure = "";
  render();
  notice("현재 조건을 고정했습니다. 가정을 바꿔 비교하세요.");
};
$("unpin").onclick = () => {
  clearPaired();
  state.reference = null;
  currentStructure = "";
  render();
};
$("export-config").onclick = () =>
  download("physician-futures-config.json", config());
$("import-config").onclick = () => $("file-input").click();
$("file-input").onchange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100000) throw new Error("설정 파일이 너무 큽니다.");
    restore(JSON.parse(await file.text()));
  } catch (err) {
    notice(`설정을 불러오지 못했습니다: ${err.message}`);
  } finally {
    e.target.value = "";
  }
};
$("download-results").onclick = () =>
  download("physician-futures-results.json", {
    ...state.result,
    reference: state.reference,
    sensitivity: state.sweepCache,
  });
window.explorer = {
  getState: () => ({
    params: { ...state.params },
    seed: state.seed,
    index: state.index,
    playing: state.playing,
    dimension: state.dimension,
    signature: state.result?.signature,
    reference: !!state.reference,
    sweep: state.sweepCache,
  }),
  getResult: () => state.result,
  exportConfig: config,
  restoreConfig: restore,
};
let pairedToken = 0;
function clearPaired() {
  pairedToken++;
  if ($("paired-results")) $("paired-results").textContent = "";
  if ($("paired-run")) $("paired-run").textContent = "여러 초기집단 확인";
}
$("paired-run").onclick = async () => {
  if (!state.reference) return;
  const token = ++pairedToken,
    params = { ...state.params },
    reference = { ...state.reference.params };
  const differences = [];
  $("paired-run").disabled = true;
  try {
    for (let seed = 0; seed < 100; seed++) {
      if (token !== pairedToken) return;
      const a = checked(params, seed).frames.at(-1).metrics,
        b = checked(reference, seed).frames.at(-1).metrics;
      differences.push({
        income: a.incomeIndex - b.incomeIndex,
        employment: 100 * (a.employmentRate - b.employmentRate),
      });
      if (seed % 5 === 0) {
        $("paired-run").textContent = `초기집단 비교 ${seed + 1}/100`;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    const summary = (key) => {
      const v = differences.map((d) => d[key]).sort((a, b) => a - b);
      const q = (p) => {
        const i = (v.length - 1) * p,
          l = Math.floor(i);
        return v[l] + (v[Math.ceil(i)] - v[l]) * (i - l);
      };
      return {
        median: q(0.5),
        lo: q(0.1),
        hi: q(0.9),
        positive: v.filter((n) => n > 1e-8).length,
      };
    };
    const income = summary("income"),
      employment = summary("employment");
    $("paired-results").innerHTML =
      `<p><strong>2036년 · 현재 조건 − 고정 조건</strong></p><p>평균소득 차이: 중앙값 ${fmt(income.median)} · 10–90% 범위 ${fmt(income.lo)} ~ ${fmt(income.hi)} · 증가한 집단 ${income.positive}/100</p><p>고용 유지율 차이: 중앙값 ${fmt(employment.median)}%p · 10–90% 범위 ${fmt(employment.lo)} ~ ${fmt(employment.hi)}%p · 증가한 집단 ${employment.positive}/100</p><p>seed 0–99의 초기집단 가정에 따른 변동입니다. 현실 예측의 신뢰구간이 아닙니다.</p>`;
  } catch (e) {
    fail(e);
  } finally {
    if (token === pairedToken) {
      $("paired-run").textContent = "여러 초기집단 다시 확인";
      $("paired-run").disabled = !state.reference;
    }
  }
};

run();
