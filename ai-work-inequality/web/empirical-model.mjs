/** Empirical earnings anchors + conditional task/workforce scenarios.
 * No fitted future probabilities, person-level microdata, or closure predictions.
 * See docs/model-method.md for units, identification, equations and limitations.
 */
import { BASELINE } from "./baseline.mjs";
export { BASELINE };
export const VERSION = "physicians-0.2.0";

export const PARAMS = [
  [
    "documentationSavings",
    "Documentation time",
    "Workflow",
    -0.3,
    0.95,
    0.05,
    0.2,
    "",
    "Net time saved in documentation at full additional deployment; negative values add review work.",
  ],
  [
    "reasoningSavings",
    "Reasoning time",
    "Workflow",
    -0.5,
    0.95,
    0.05,
    0,
    "",
    "Net time saved in diagnosis and planning; quality improvement alone need not save time.",
  ],
  [
    "procedureSavings",
    "Hands-on time",
    "Workflow",
    0,
    1,
    0.05,
    0,
    "",
    "Additional net physician time saved in physical treatment; includes setup and supervision.",
  ],
  [
    "interactionSavings",
    "Patient interaction time",
    "Workflow",
    -0.3,
    0.95,
    0.05,
    0,
    "",
    "Net physician time saved in patient interaction, excluding documentation.",
  ],
  [
    "adoptionProprietor",
    "Proprietor deployment",
    "Deployment",
    0,
    1,
    0.05,
    0.7,
    "",
    "Share of remaining workflow exposed to the additional time effects by 2036.",
  ],
  [
    "adoptionSalaried",
    "Salaried deployment",
    "Deployment",
    0,
    1,
    0.05,
    0.7,
    "",
    "Share of remaining workflow exposed to the additional time effects by 2036.",
  ],
  [
    "timing",
    "Later / earlier deployment",
    "Deployment",
    -1,
    1,
    0.1,
    0,
    "",
    "Negative values bring deployment forward; positive values delay it. Endpoints are unchanged.",
  ],
  [
    "licensing",
    "Oversight relaxation",
    "Deployment",
    0,
    1,
    0.05,
    0,
    "",
    "Relax the assumed minimum physician-time requirement. This is a future institutional scenario.",
  ],
  [
    "demandChange",
    "Purchased care",
    "Economy",
    -60,
    100,
    5,
    10,
    "%",
    "Change in purchased care by 2036. This is not a projection of medical need.",
  ],
  [
    "capacityGrowth",
    "Other care capacity",
    "Economy",
    0,
    100,
    5,
    20,
    "%",
    "Growth in non-physician staff, equipment and facility capacity by 2036.",
  ],
  [
    "feeChange",
    "Real payment per care unit",
    "Economy",
    -60,
    50,
    5,
    0,
    "%",
    "Change in real payment per comparable within-group care unit.",
  ],
  [
    "aiCost",
    "AI cost / baseline earnings",
    "Economy",
    0,
    30,
    1,
    2,
    "%",
    "Annual cost exposure at full deployment, as a share of baseline group earnings.",
  ],
  [
    "staffingResponse",
    "Convert spare work to fewer positions",
    "Distribution",
    0,
    1,
    0.05,
    0,
    "",
    "0 keeps original positions and reduces workload; 1 adjusts positions to required work.",
  ],
  [
    "captureProprietor",
    "Proprietor gain participation",
    "Distribution",
    0,
    1,
    0.05,
    0.5,
    "",
    "Participation in positive care-payment value above retained baseline compensation. Departing positions do not transfer all their claims to survivors.",
  ],
  [
    "captureSalaried",
    "Salaried gain participation",
    "Distribution",
    0,
    1,
    0.05,
    0.5,
    "",
    "Participation in positive care-payment value above retained baseline compensation. Departing positions do not transfer all their claims to survivors.",
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
const advanced = {
  documentationSavings: 0.5,
  reasoningSavings: 0.3,
  procedureSavings: 0.15,
  interactionSavings: 0.1,
  adoptionProprietor: 0.9,
  adoptionSalaried: 0.9,
};
export const PRESETS = [
  {
    id: "reference",
    label: "Assistive care",
    description:
      "Modest documentation savings; demand grows; positions remain.",
    params: { ...DEFAULT_PARAMS },
  },
  {
    id: "hold",
    label: "No additional change",
    description:
      "The same baseline with no additional technology or economic change.",
    params: {
      ...DEFAULT_PARAMS,
      documentationSavings: 0,
      demandChange: 0,
      capacityGrowth: 0,
      aiCost: 0,
      adoptionProprietor: 0,
      adoptionSalaried: 0,
    },
  },
  {
    id: "shared",
    label: "Shared productivity",
    description: "Broader workflow gains, more care, and unchanged positions.",
    params: {
      ...DEFAULT_PARAMS,
      ...advanced,
      demandChange: 25,
      capacityGrowth: 40,
      captureProprietor: 0.8,
      captureSalaried: 0.8,
    },
  },
  {
    id: "concentrated",
    label: "Unequal gain sharing",
    description:
      "Equal technical progress, different gain shares, and full staffing adjustment.",
    params: {
      ...DEFAULT_PARAMS,
      ...advanced,
      demandChange: 0,
      staffingResponse: 1,
      captureProprietor: 1,
      captureSalaried: 0.15,
    },
  },
  {
    id: "demand",
    label: "Payment and demand squeeze",
    description:
      "Lower real payments and purchased care with partial position adjustment.",
    params: {
      ...DEFAULT_PARAMS,
      ...advanced,
      demandChange: -20,
      feeChange: -20,
      staffingResponse: 0.7,
    },
  },
  {
    id: "automation",
    label: "High automation",
    description:
      "Speculative broad automation with relaxed oversight and high deployment.",
    params: {
      ...DEFAULT_PARAMS,
      documentationSavings: 0.9,
      reasoningSavings: 0.9,
      procedureSavings: 0.9,
      interactionSavings: 0.9,
      adoptionProprietor: 0.95,
      adoptionSalaried: 0.95,
      licensing: 1,
      staffingResponse: 1,
      demandChange: 20,
      capacityGrowth: 50,
      captureProprietor: 0.8,
      captureSalaried: 0.3,
    },
  },
];

export const DEFAULT_STRUCTURE = Object.freeze({
  taskShares: Object.freeze([0.35, 0.25, 0.2, 0.2]),
  oversightFloor: 0.2,
  proprietorWeight: BASELINE.income.proprietorWeight,
});
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

/** Weighted point-mass Gini: a between-group lower bound under valid weights. */
export function betweenGini(groups) {
  if (
    !Array.isArray(groups) ||
    groups.some(
      (g) =>
        !Number.isFinite(g.weight) ||
        g.weight < 0 ||
        !Number.isFinite(g.income) ||
        g.income < 0,
    )
  )
    throw new RangeError(
      "Gini requires nonnegative finite weights and incomes",
    );
  const totalWeight = sum(groups.map((g) => g.weight));
  const total = sum(groups.map((g) => g.weight * g.income));
  if (!total || !totalWeight) return null;
  let differences = 0;
  for (const a of groups)
    for (const b of groups)
      differences += a.weight * b.weight * Math.abs(a.income - b.income);
  return differences / (2 * totalWeight * total);
}

/** Normalized compensation envelope, not a provider revenue/cost ledger.
 * All adverse payment effects transmit; positive value above retained baseline
 * compensation transmits through retained positions' original participation
 * shares. Departing positions' claims do not accumulate in the final survivor.
 * At zero retained positions modeled practice earnings end. Outside earnings,
 * liquidation and passive returns after exit are outside the estimand.
 */
export function earningsFactor({ retained, paymentValue, gainShare, aiCost }) {
  if (retained <= 0) return 0;
  const excess = paymentValue - retained;
  return Math.max(
    0,
    retained +
      Math.min(0, excess) +
      retained * gainShare * Math.max(0, excess) -
      aiCost,
  );
}

function signature(value) {
  let hash = 2166136261;
  for (const char of JSON.stringify(value))
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function validate(input, options) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new TypeError("Parameters must be an object");
  for (const key of Object.keys(input))
    if (!PARAMS.some((p) => p.key === key))
      throw new RangeError(`Unknown parameter: ${key}`);
  const params = { ...DEFAULT_PARAMS, ...input };
  for (const p of PARAMS)
    if (
      !Number.isFinite(params[p.key]) ||
      typeof params[p.key] !== "number" ||
      params[p.key] < p.min ||
      params[p.key] > p.max
    )
      throw new RangeError(`Invalid parameter: ${p.key}`);
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new TypeError("Structure must be an object");
  for (const key of Object.keys(options))
    if (!Object.hasOwn(DEFAULT_STRUCTURE, key))
      throw new RangeError(`Unknown structure: ${key}`);
  const structure = { ...DEFAULT_STRUCTURE, ...options };
  const shares = structure.taskShares;
  if (
    !Array.isArray(shares) ||
    shares.length !== 4 ||
    Array.from(shares).some(
      (x) => typeof x !== "number" || !Number.isFinite(x) || x < 0,
    ) ||
    Math.abs(sum(shares) - 1) > 1e-10
  )
    throw new RangeError("Four nonnegative task shares must sum to one");
  for (const key of ["oversightFloor", "proprietorWeight"])
    if (
      typeof structure[key] !== "number" ||
      !Number.isFinite(structure[key]) ||
      structure[key] < 0 ||
      structure[key] > 1
    )
      throw new RangeError(`Invalid structure: ${key}`);
  structure.taskShares = [...shares];
  return { params, structure };
}

export function simulate(input = {}, options = {}) {
  const { params, structure } = validate(input, options);
  const descriptors = [
    {
      id: "proprietor",
      providerId: "P1",
      label: "Practice proprietors",
      size: "small",
      slots: 8,
      weight: structure.proprietorWeight,
      baselineIncomeKRW: BASELINE.income.proprietor,
      adoption: params.adoptionProprietor,
      capture: params.captureProprietor,
    },
    {
      id: "salaried",
      providerId: "P2",
      label: "Salaried physicians",
      size: "large",
      slots: 16,
      weight: 1 - structure.proprietorWeight,
      baselineIncomeKRW: BASELINE.income.salaried,
      adoption: params.adoptionSalaried,
      capture: params.captureSalaried,
    },
  ];
  const baselineMean = sum(
    descriptors.map((g) => g.weight * g.baselineIncomeKRW),
  );
  const frames = [];
  let maxResidual = 0;
  for (let t = 0; t <= 10; t++) {
    const u = t / 10;
    const path =
      Math.expm1(2 * Math.pow(u, Math.exp(params.timing))) / Math.expm1(2);
    const demand = 1 + (params.demandChange / 100) * u;
    const fee = 1 + (params.feeChange / 100) * u;
    const otherCapacity = 1 + (params.capacityGrowth / 100) * u;
    const minimumTime = structure.oversightFloor * (1 - params.licensing * u);
    const savings = [
      params.documentationSavings,
      params.reasoningSavings,
      params.procedureSavings,
      params.interactionSavings,
    ];
    const groups = descriptors.map((g) => {
      const adoption = g.adoption * path;
      const humanTime = Math.max(
        minimumTime,
        sum(
          structure.taskShares.map((w, i) => w * (1 - adoption * savings[i])),
        ),
      );
      const care = Math.min(
        demand,
        otherCapacity,
        humanTime > 0 ? 1 / humanTime : Infinity,
      );
      const requiredWork = care * humanTime;
      const retained =
        1 - params.staffingResponse * Math.max(0, 1 - requiredWork);
      const cost = (params.aiCost / 100) * adoption;
      const earnings = earningsFactor({
        retained,
        paymentValue: care * fee,
        gainShare: g.capture,
        aiCost: cost,
      });
      const income = g.baselineIncomeKRW * earnings;
      const residual = Math.max(
        0,
        requiredWork - retained,
        care - otherCapacity,
        care - demand,
        requiredWork - 1,
      );
      maxResidual = Math.max(maxResidual, residual);
      return {
        ...g,
        adoption,
        humanTime,
        requiredWorkIndex: requiredWork * 100,
        retainedShare: retained,
        careIndex: care * 100,
        earningsPoolIndex: earnings * 100,
        ownIncomeIndex: earnings * 100,
        incomeIndex: (income / baselineMean) * 100,
        income,
        aiCostShare: cost,
        incomePerRetainedIndex: retained ? (earnings / retained) * 100 : null,
        spareWorkShare: Math.max(0, retained - requiredWork),
        unfilledPurchasedCare: Math.max(0, demand - care),
      };
    });
    const totalIncome = sum(groups.map((g) => g.weight * g.income));
    for (const g of groups)
      g.incomeShare = totalIncome ? (g.weight * g.income) / totalIncome : null;
    const weighted = (key) => sum(groups.map((g) => g.weight * g[key]));
    const metrics = {
      incomeIndex: (totalIncome / baselineMean) * 100,
      employmentRate: weighted("retainedShare"),
      workIndex: weighted("requiredWorkIndex"),
      volumeIndex: weighted("careIndex"),
      betweenGini: betweenGini(groups),
      incomeRatio:
        groups[1].income > 0 ? groups[0].income / groups[1].income : null,
      unmetRate: demand ? weighted("unfilledPurchasedCare") / demand : 0,
    };
    const providers = groups.map((g) => ({
      id: g.providerId,
      label: g.label,
      groupId: g.id,
      size: g.size,
      region: "national",
      closed: false,
      volume: g.careIndex / 100,
      adoption: g.adoption,
      headcount: g.slots * g.retainedShare,
      requiredWorkIndex: g.requiredWorkIndex,
      retainedShare: g.retainedShare,
      incomeIndex: g.incomeIndex,
      careIndex: g.careIndex,
    }));
    const physicians = groups.flatMap((g) =>
      Array.from({ length: g.slots }, (_, i) => {
        const presence = clamp(g.retainedShare * g.slots - i);
        return {
          id: `${g.providerId}-slot-${i + 1}`,
          providerId: g.providerId,
          groupId: g.id,
          role: g.id,
          employed: presence > 0,
          active: presence > 0,
          presence,
          incomeIndex: g.incomeIndex,
          income: g.income,
        };
      }),
    );
    frames.push({
      year: 2026 + t,
      groups,
      metrics,
      providers,
      physicians,
      drivers: {
        adoption: weighted("adoption"),
        fee,
        demand,
        otherCapacity,
        path,
      },
      audit: { maxResidual },
    });
  }
  if (!Number.isFinite(maxResidual) || maxResidual > 1e-8)
    throw new Error(`Work/capacity inconsistency: ${maxResidual}`);
  return {
    version: VERSION,
    params,
    structure,
    baseline: { ...BASELINE, normalizationMean: baselineMean },
    frames,
    signature: signature({
      version: VERSION,
      baseline: BASELINE.income,
      params,
      structure,
    }),
    checks: { passed: true, maxResidual },
  };
}
