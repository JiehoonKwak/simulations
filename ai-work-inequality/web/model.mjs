/** Illustrative complete-care model; see ../docs/model-method.md. No empirical forecast. */
export const VERSION = "physicians-0.1.0";
export const PARAMS = [
  [
    "cognitionRate",
    "판단 추가 자동화",
    "AI 발전",
    0,
    1,
    0.05,
    0.8,
    "",
    "2036년 진단·처방 업무의 2026년 대비 추가 자동화 가능 비율. 현재 AI 성능 점수가 아닙니다.",
  ],
  [
    "procedureRate",
    "처치 추가 자동화",
    "AI 발전",
    0,
    1,
    0.05,
    0.5,
    "",
    "2036년 치료·수술 업무의 2026년 대비 추가 자동화 가능 비율. 판단과 별도로 움직입니다.",
  ],
  [
    "communicationRate",
    "소통 추가 자동화",
    "AI 발전",
    0,
    1,
    0.05,
    0.6,
    "",
    "2036년 환자 소통 업무의 2026년 대비 추가 자동화 가능 비율.",
  ],
  [
    "timing",
    "발전 시점",
    "AI 발전",
    -1,
    1,
    0.1,
    0,
    "",
    "음수는 초기에 빠른 보급, 양수는 후기에 빠른 보급. 2036년 능력은 같습니다.",
  ],
  [
    "adoptionCost",
    "AI 도입·운영 비용",
    "도입과 분배",
    0,
    1,
    0.05,
    0.3,
    "",
    "초기 의사 1명당 연간 비용 부담. 높은 비용은 도입률도 낮춥니다.",
  ],
  [
    "scaleAdvantage",
    "규모에 따른 비용 차이",
    "도입과 분배",
    0,
    1,
    0.05,
    0.4,
    "",
    "대형 기관의 AI 비용 절감 정도. 0이면 규모별 비용이 같습니다.",
  ],
  [
    "wageShare",
    "의사 노동의 배분 몫",
    "도입과 분배",
    0.2,
    0.9,
    0.05,
    0.65,
    "",
    "양의 영업잉여 중 의사 노동에 배분하는 목표 비율. 나머지는 소유와 유보이익.",
  ],
  [
    "licensing",
    "무의사 의료행위 허용",
    "제도와 수요",
    0,
    1,
    0.05,
    0.5,
    "",
    "2036년 의사 직접 수행 의무 완화 정도. AI 능력·도입과 함께 작동.",
  ],
  [
    "feeChange",
    "실질 수가 변화",
    "제도와 수요",
    -60,
    40,
    5,
    -10,
    "%",
    "2036년 완료 진료 1건당 실질 지급액의 2026년 대비 변화.",
  ],
  [
    "householdChange",
    "환자 지출여력 변화",
    "제도와 수요",
    -60,
    60,
    5,
    -10,
    "%",
    "본인부담으로 구매할 수 있는 진료량의 변화. 보험 지원분과 별개.",
  ],
  [
    "insuranceChange",
    "보험 지원 진료량 변화",
    "제도와 수요",
    -60,
    60,
    5,
    10,
    "%",
    "보험이 지원하는 진료량의 변화. 보험 예산액이나 인구 전망이 아닙니다.",
  ],
  [
    "regionalDemandChange",
    "비수도권 구매 진료량 변화",
    "제도와 수요",
    -40,
    40,
    5,
    0,
    "%",
    "비수도권 진료 수요의 추가 변화 가정. 양수는 증가, 음수는 감소이며 수도권은 직접 바꾸지 않습니다.",
  ],
  [
    "supplyChange",
    "외부 의사 공급 압력",
    "제도와 수요",
    -30,
    80,
    5,
    15,
    "%",
    "원래 의사 집단 밖의 노동 경쟁. 보수 배분을 바꾸며 신규 의사를 생성하지 않습니다.",
  ],
].map(([key, label, group, min, max, step, value, unit, description]) =>
  Object.freeze({
    key,
    label,
    group,
    min,
    max,
    step,
    default: value,
    unit,
    description,
  }),
);
export const DEFAULT_PARAMS = Object.freeze(
  Object.fromEntries(PARAMS.map((p) => [p.key, p.default])),
);
export const PRESETS = [
  {
    id: "reference",
    label: "기준 가정",
    description: "능력 발전, 중간 비용과 부분적 제도 변화",
    params: { ...DEFAULT_PARAMS },
  },
  {
    id: "hold",
    label: "2026년 조건 유지",
    description: "추가 AI 발전과 경제·제도 변화를 모두 멈춘 대조군",
    params: {
      ...DEFAULT_PARAMS,
      cognitionRate: 0,
      procedureRate: 0,
      communicationRate: 0,
      feeChange: 0,
      householdChange: 0,
      insuranceChange: 0,
      supplyChange: 0,
      licensing: 0,
    },
  },
  {
    id: "accessible",
    label: "저비용 보급 · 수행 의무 유지",
    description: "모든 규모에서 싼 AI, 의사 직접 수행 의무 유지",
    params: {
      ...DEFAULT_PARAMS,
      adoptionCost: 0.05,
      scaleAdvantage: 0,
      licensing: 0,
      feeChange: 0,
      supplyChange: 0,
    },
  },
  {
    id: "equipment",
    label: "처치 발전 · 규모별 비용 차이",
    description: "처치 자동화와 높은 장비 비용, 큰 규모의 비용 절감",
    params: {
      ...DEFAULT_PARAMS,
      procedureRate: 1,
      adoptionCost: 0.8,
      scaleAdvantage: 1,
      licensing: 0.8,
    },
  },
  {
    id: "demand",
    label: "수가 · 구매 진료량 감소",
    description: "환자와 보험의 지원 진료량, 실질 수가가 함께 감소",
    params: {
      ...DEFAULT_PARAMS,
      feeChange: -45,
      householdChange: -45,
      insuranceChange: -35,
    },
  },
  {
    id: "permission",
    label: "광범위 자동화 허용",
    description: "세 능력의 빠른 발전, 낮은 도입비와 수행 의무 완화",
    params: {
      ...DEFAULT_PARAMS,
      cognitionRate: 1,
      procedureRate: 1,
      communicationRate: 1,
      adoptionCost: 0.1,
      licensing: 1,
      timing: -0.7,
    },
  },
];
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => (a.length ? sum(a) / a.length : 0);
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function gini(values) {
  const a = [...values].sort((a, b) => a - b),
    total = sum(a);
  return total
    ? sum(a.map((v, i) => (2 * i - a.length + 1) * v)) / (a.length * total)
    : null;
}
/** Annual complete-care capacity: every episode must pass all three stages. */
export function careCapacity({
  hours,
  humanTime,
  treatmentCapacity,
  facilityCapacity = Infinity,
}) {
  return Math.min(
    humanTime > 0 ? hours / humanTime : Infinity,
    treatmentCapacity,
    facilityCapacity,
  );
}
/** All monetary flows use one real unit; no negative dividends or hidden financing. */
export function settleAccounts({
  revenue,
  nonLaborCost,
  wageFraction,
  reserve,
  minimumWages = 0,
}) {
  const operatingSurplus = revenue - nonLaborCost;
  if (operatingSurplus + reserve - minimumWages < -1e-9)
    return { solvent: false };
  const wages = Math.max(
    minimumWages,
    Math.max(0, operatingSurplus) * clamp(wageFraction),
  );
  const profit = operatingSurplus - wages,
    dividends = Math.max(0, profit) * 0.8;
  const endReserve = reserve + profit - dividends;
  return {
    solvent: true,
    wages,
    profit,
    dividends,
    endReserve,
    operatingSurplus,
  };
}
function population(seed) {
  const random = rng(seed),
    providers = [],
    physicians = [];
  for (let j = 0; j < 16; j++) {
    const n = j % 2 ? 16 : 8,
      region = j % 4 < 2 ? "metro" : "regional",
      size = n === 16 ? "large" : "small";
    const clinical = ["cognitive", "mixed", "procedural"][j % 3];
    const team = [];
    for (let k = 0; k < n; k++) {
      const person = {
        id: `D${physicians.length + 1}`,
        providerId: `P${j + 1}`,
        region,
        size,
        role: k === 0 ? "owner" : "employee",
        clinical,
        skill: 0.65 + 0.7 * random(),
        experience: Math.floor(random() * 31),
      };
      team.push(person);
      physicians.push(person);
    }
    providers.push({
      id: `P${j + 1}`,
      region,
      size,
      clinical,
      team,
      n,
      baseVolume: n * 9.8,
      quality: mean(team.map((d) => d.skill)),
      reserve: n * 3,
      closed: false,
    });
  }
  return { providers, physicians };
}
function groupResults(people) {
  const groups = [];
  const labels = {
    metro: "수도권",
    regional: "비수도권",
    large: "대형",
    small: "소형",
    owner: "소유 의사",
    employee: "봉직 의사",
    cognitive: "판단 비중 높음",
    mixed: "혼합 진료",
    procedural: "처치 비중 높음",
    junior: "경험 10년 미만",
    senior: "경험 10년 이상",
  };
  for (const dimension of ["setting", "role", "clinical", "experience"]) {
    const buckets = new Map();
    for (const d of people) {
      const key =
        dimension === "setting"
          ? `${d.region}-${d.size}`
          : dimension === "experience"
            ? d.experience < 10
              ? "junior"
              : "senior"
            : d[dimension];
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(d);
    }
    for (const [key, members] of buckets)
      groups.push({
        dimension,
        key,
        label:
          dimension === "setting"
            ? key
                .split("-")
                .map((x) => labels[x])
                .join(" · ")
            : labels[key],
        incomeIndex: mean(members.map((d) => d.incomeIndex)),
        employmentRate: mean(members.map((d) => +d.employed)),
        autonomy: mean(members.map((d) => d.autonomy)),
        count: members.length,
      });
  }
  return groups;
}
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++)
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0");
}
export function simulate(input = {}, seed = 42) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new TypeError("Parameters must be an object");
  for (const key of Object.keys(input))
    if (!PARAMS.some((p) => p.key === key))
      throw new RangeError(`Unknown parameter: ${key}`);
  const params = { ...DEFAULT_PARAMS, ...input };
  for (const p of PARAMS)
    if (
      typeof params[p.key] !== "number" ||
      !Number.isFinite(params[p.key]) ||
      params[p.key] < p.min ||
      params[p.key] > p.max
    )
      throw new RangeError(`Invalid parameter: ${p.key}`);
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295)
    throw new RangeError("Seed must be an unsigned 32-bit integer");
  const { providers, physicians } = population(seed),
    frames = [],
    years = Array.from({ length: 11 }, (_, i) => 2026 + i);
  const baseVolume = sum(providers.map((p) => p.baseVolume));
  let initialMean = 0,
    initialLowerIds,
    maximumResidual = 0;
  for (let t = 0; t <= 10; t++) {
    const u = t / 10,
      path = Math.pow(u, Math.exp(params.timing));
    const capability = (rate) => (rate * Math.expm1(2 * path)) / Math.expm1(2);
    const cognition = capability(params.cognitionRate),
      procedure = capability(params.procedureRate),
      communication = capability(params.communicationRate);
    const fee = 1 + (params.feeChange / 100) * u,
      supply = 1 + (params.supplyChange / 100) * u,
      permission = params.licensing * u;
    const futureWageFraction = (0.65 + (params.wageShare - 0.65) * u) / supply;
    const states = providers.map((p) => {
      const costFactor =
        p.size === "large" ? 1 - 0.7 * params.scaleAdvantage : 1;
      const available = Math.max(cognition, procedure, communication);
      const adoption =
        available > 0
          ? clamp(path / (0.45 + params.adoptionCost * costFactor * 1.8))
          : 0;
      const weights =
        p.clinical === "cognitive"
          ? [0.55, 0.25, 0.2]
          : p.clinical === "procedural"
            ? [0.25, 0.6, 0.15]
            : [0.4, 0.4, 0.2];
      const capabilities = [cognition, procedure, communication];
      const times = weights.map(
        (w, i) =>
          w * (1 - adoption * capabilities[i] * (0.35 + 0.65 * permission)),
      );
      const humanTime = sum(times),
        autonomy = 1 - adoption * cognition * permission;
      const capacity = careCapacity({
        hours: p.n * 10,
        humanTime,
        treatmentCapacity: p.n * 10 * (1 + 2 * adoption * procedure),
        facilityCapacity: p.n * 30,
      });
      const insuranceShare =
        p.clinical === "procedural" ? 0.8 : p.clinical === "mixed" ? 0.7 : 0.6;
      const demandFactor =
        insuranceShare * (1 + (params.insuranceChange / 100) * u) +
        (1 - insuranceShare) * (1 + (params.householdChange / 100) * u);
      const qualityNow = p.quality + (1.4 - p.quality) * adoption * cognition;
      return {
        p,
        adoption,
        costFactor,
        humanTime,
        autonomy,
        capacity,
        demandFactor,
        weight: (p.baseVolume * qualityNow) / p.quality,
      };
    });
    const regionDemand = {};
    const regionWeight = {};
    for (const region of ["metro", "regional"]) {
      regionDemand[region] = sum(
        states
          .filter((s) => s.p.region === region)
          .map(
            (s) =>
              s.p.baseVolume *
              s.demandFactor *
              (region === "regional"
                ? 1 + (params.regionalDemandChange / 100) * u
                : 1),
          ),
      );
      regionWeight[region] = sum(
        states
          .filter((s) => s.p.region === region && !s.p.closed)
          .map((s) => s.weight),
      );
    }
    const current = [],
      providerRows = [];
    let maxResidual = 0,
      capacityViolation = 0;
    for (const s of states) {
      const p = s.p,
        beginReserve = p.reserve;
      let volume = p.closed
        ? 0
        : Math.min(
            s.capacity,
            regionWeight[p.region]
              ? (regionDemand[p.region] * s.weight) / regionWeight[p.region]
              : 0,
          );
      let revenue = volume * fee;
      let aiCost = p.closed
        ? 0
        : p.n *
          s.adoption *
          params.adoptionCost *
          s.costFactor *
          (0.7 + 1.8 * procedure);
      let fixedCost = p.closed ? 0 : p.n * 2,
        variableCost = volume * 0.2;
      let needed =
        p.closed || volume === 0
          ? 0
          : Math.min(
              p.n,
              Math.ceil(Math.max(0, (volume * s.humanTime) / 10 - 1e-10)),
            );
      let ledger = settleAccounts({
        revenue,
        nonLaborCost: aiCost + fixedCost + variableCost,
        wageFraction: needed ? futureWageFraction : 0,
        reserve: p.reserve,
        minimumWages: needed * 0.8,
      });
      if (!ledger.solvent) {
        p.closed = true;
        needed = volume = revenue = aiCost = fixedCost = variableCost = 0;
        ledger = settleAccounts({
          revenue: 0,
          nonLaborCost: 0,
          wageFraction: 0,
          reserve: p.reserve,
        });
      }
      p.reserve = ledger.endReserve;
      const ranked = [
        p.team[0],
        ...p.team
          .slice(1)
          .sort((a, b) => b.skill - a.skill || a.id.localeCompare(b.id)),
      ];
      const retained = new Set(ranked.slice(0, needed).map((d) => d.id));
      const wageWeights = p.team.map((d) =>
        retained.has(d.id)
          ? 1 + (d.skill - 1) * (1 - s.adoption * cognition) * 0.5
          : 0,
      );
      const totalWeight = sum(wageWeights);
      let wagesReceived = 0,
        dividendsReceived = 0;
      p.team.forEach((d, i) => {
        const employed = retained.has(d.id),
          laborIncome = employed
            ? 0.8 +
              ((ledger.wages - needed * 0.8) * wageWeights[i]) / totalWeight
            : 0;
        const ownershipIncome = d.role === "owner" ? ledger.dividends : 0;
        wagesReceived += laborIncome;
        dividendsReceived += ownershipIncome;
        current.push({
          ...d,
          income: laborIncome + ownershipIncome,
          laborIncome,
          ownershipIncome,
          incomeIndex: 0,
          employed,
          active: employed,
          autonomy: employed ? s.autonomy : 0,
        });
      });
      const nonLaborCost = aiCost + fixedCost + variableCost;
      maxResidual = Math.max(
        maxResidual,
        Math.abs(revenue - nonLaborCost - ledger.wages - ledger.profit),
        Math.abs(p.reserve - beginReserve - ledger.profit + ledger.dividends),
        Math.abs(wagesReceived - ledger.wages),
        Math.abs(dividendsReceived - ledger.dividends),
      );
      capacityViolation = Math.max(
        capacityViolation,
        volume - s.capacity,
        volume * s.humanTime - needed * 10,
      );
      providerRows.push({
        id: p.id,
        region: p.region,
        size: p.size,
        closed: p.closed,
        revenue,
        profit: ledger.profit,
        volume,
        adoption: p.closed ? 0 : s.adoption,
        headcount: needed,
        wages: ledger.wages,
        dividends: ledger.dividends,
        aiCost,
        fixedCost,
        variableCost,
        nonLaborCost,
        beginReserve,
        reserve: p.reserve,
        capacity: s.capacity,
        humanTime: s.humanTime,
      });
    }
    current.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
    if (t === 0) {
      initialMean = mean(current.map((d) => d.income));
      initialLowerIds = new Set(
        [...current]
          .sort((a, b) => a.income - b.income)
          .slice(0, current.length / 2)
          .map((d) => d.id),
      );
    }
    current.forEach((d) => (d.incomeIndex = (d.income / initialMean) * 100));
    const incomes = current.map((d) => d.income),
      totalIncome = sum(incomes),
      totalVolume = sum(providerRows.map((p) => p.volume)),
      demand = sum(Object.values(regionDemand));
    const metrics = {
      incomeIndex: mean(current.map((d) => d.incomeIndex)),
      employmentRate: mean(current.map((d) => +d.employed)),
      autonomy: mean(current.map((d) => d.autonomy)),
      closedRate: mean(providerRows.map((p) => +p.closed)),
      gini: gini(incomes),
      topShare: totalIncome
        ? sum(
            [...incomes]
              .sort((a, b) => b - a)
              .slice(0, Math.ceil(current.length * 0.1)),
          ) / totalIncome
        : null,
      volumeIndex: (totalVolume / baseVolume) * 100,
      unmetRate: demand ? clamp(1 - totalVolume / demand) : 0,
      lowerHalfIncomeIndex: mean(
        current
          .filter((d) => initialLowerIds.has(d.id))
          .map((d) => d.incomeIndex),
      ),
    };
    const drivers = {
      cognition,
      procedure,
      communication,
      adoption: mean(providerRows.map((p) => p.adoption)),
      fee,
      demand: demand / baseVolume,
      supply,
      autonomy: metrics.autonomy,
    };
    maximumResidual = Math.max(maximumResidual, maxResidual, capacityViolation);
    frames.push({
      year: years[t],
      drivers,
      metrics,
      physicians: current,
      providers: providerRows,
      groups: groupResults(current),
      audit: { maxResidual, capacityViolation },
    });
  }
  const passed = maximumResidual < 1e-7;
  if (!passed)
    throw new Error(
      `Model accounting or capacity validation failed: ${maximumResidual}`,
    );
  return {
    version: VERSION,
    seed,
    params,
    years,
    frames,
    signature: hash(JSON.stringify({ version: VERSION, seed, params, frames })),
    checks: { passed, maxResidual: maximumResidual },
    initialPhysicians: frames[0].physicians,
  };
}
