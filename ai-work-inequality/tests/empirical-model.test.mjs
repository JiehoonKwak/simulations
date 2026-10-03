import test from "node:test";
import assert from "node:assert/strict";
import {
  simulate,
  PRESETS,
  PARAMS,
  betweenGini,
  earningsFactor,
} from "../web/empirical-model.mjs";

const near = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const hold = PRESETS.find((preset) => preset.id === "hold").params;
const equalTasks = { taskShares: [0.25, 0.25, 0.25, 0.25] };
const deployed = { ...hold, adoptionProprietor: 1, adoptionSalaried: 1 };
const end = (params, structure) => simulate(params, structure).frames.at(-1);
const groupOutcomes = (frame) => frame.groups.map((group) => ({
  id: group.id,
  income: group.income,
  incomeIndex: group.incomeIndex,
  ownIncomeIndex: group.ownIncomeIndex,
  retainedShare: group.retainedShare,
  requiredWorkIndex: group.requiredWorkIndex,
  careIndex: group.careIndex,
  humanTime: group.humanTime,
  aiCostShare: group.aiCostShare,
}));

test("calibration reproduces NHIS Sheet 15 CV7, CW7 and CX7 without using drawing slots as weights", () => {
  const run = simulate(hold);
  const first = run.frames[0];
  const [proprietor, salaried] = first.groups;
  near(proprietor.income, 294282306.4032603, 1e-6);
  near(salaried.income, 185390558.43601876, 1e-6);
  near(proprietor.weight, 0.41609154512036045);
  near(salaried.weight, 0.5839084548796396);
  near(proprietor.weight * proprietor.income + salaried.weight * salaried.income,
    230699494.09856516, 1e-6);
  near(run.baseline.normalizationMean, 230699494.09856516, 1e-6);
  near(first.metrics.incomeIndex, 100);
  near(first.metrics.incomeRatio, 1.5873640431630816);
  near(first.metrics.betweenGini, 0.11467849428250225);
  assert.equal(run.baseline.income.year, 2020);
  assert.equal(first.year, 2026);
  const reweighted = simulate(hold, { proprietorWeight: 0.25 });
  near(reweighted.baseline.normalizationMean, 212613495.42782915, 1e-6);
  near(reweighted.frames[0].metrics.incomeIndex, 100);
  assert.deepEqual(reweighted.frames[0].groups.map((g) => g.income),
    first.groups.map((g) => g.income));
});

test("future assumptions share one 2026 baseline and no-change holds every outcome through 2036", () => {
  const reference = simulate(hold);
  assert.deepEqual(reference.frames.map((f) => f.year),
    [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036]);
  for (const preset of PRESETS) {
    const start = simulate(preset.params).frames[0];
    assert.deepEqual(start.metrics, reference.frames[0].metrics);
    assert.deepEqual(groupOutcomes(start), groupOutcomes(reference.frames[0]));
  }
  for (const frame of reference.frames) {
    assert.deepEqual(frame.metrics, reference.frames[0].metrics);
    assert.deepEqual(groupOutcomes(frame), groupOutcomes(reference.frames[0]));
  }
  const early = simulate({ timing: -1 });
  const late = simulate({ timing: 1 });
  assert.ok(early.frames[5].groups[0].adoption > late.frames[5].groups[0].adoption);
  assert.deepEqual(groupOutcomes(early.frames.at(-1)), groupOutcomes(late.frames.at(-1)));
});

test("hand-worked task savings remain bounded by physician time, purchased care and other capacity", () => {
  const highDemand = { ...deployed, demandChange: 100, capacityGrowth: 100 };
  for (const savings of [{ reasoningSavings: 0.8 }, { procedureSavings: 0.8 }]) {
    const frame = end({ ...highDemand, ...savings }, equalTasks);
    for (const group of frame.groups) {
      near(group.humanTime, 0.8);
      near(group.careIndex, 125);
      near(group.requiredWorkIndex, 100);
    }
    near(frame.metrics.unmetRate, 0.375);
  }
  const both = { ...highDemand, reasoningSavings: 0.8, procedureSavings: 0.8 };
  near(end(both, equalTasks).metrics.volumeIndex, 1000 / 6);
  const demandLimited = end({ ...both, demandChange: 10 }, equalTasks);
  near(demandLimited.metrics.volumeIndex, 110);
  near(demandLimited.metrics.workIndex, 66);
  near(demandLimited.metrics.unmetRate, 0);
  const capacityLimited = end({ ...both, capacityGrowth: 0 }, equalTasks);
  near(capacityLimited.metrics.volumeIndex, 100);
  near(capacityLimited.metrics.workIndex, 60);
  near(capacityLimited.metrics.unmetRate, 0.5);
});

test("negative net task savings add review work and reduce feasible care", () => {
  const baseline = end(deployed, equalTasks);
  const burden = end({ ...deployed, reasoningSavings: -0.4 }, equalTasks);
  for (const group of burden.groups) {
    near(group.humanTime, 1.1);
    near(group.careIndex, 1000 / 11);
    near(group.requiredWorkIndex, 100);
    near(group.retainedShare, 1);
  }
  assert.ok(burden.metrics.incomeIndex < baseline.metrics.incomeIndex);
  near(burden.metrics.unmetRate, 1 / 11);
});

test("spare work need not remove positions, and staffing response does not change care or required time", () => {
  const params = {
    ...deployed,
    documentationSavings: 0.8,
    captureProprietor: 0,
    captureSalaried: 0,
  };
  const keep = end({ ...params, staffingResponse: 0 }, equalTasks);
  const adjust = end({ ...params, staffingResponse: 1 }, equalTasks);
  for (let i = 0; i < keep.groups.length; i++) {
    const a = keep.groups[i];
    const b = adjust.groups[i];
    near(a.careIndex, 100);
    near(b.careIndex, a.careIndex);
    near(a.humanTime, 0.8);
    near(b.humanTime, a.humanTime);
    near(a.requiredWorkIndex, 80);
    near(b.requiredWorkIndex, a.requiredWorkIndex);
    near(a.retainedShare, 1);
    near(b.retainedShare, 0.8);
    near(a.spareWorkShare, 0.2);
    near(b.spareWorkShare, 0);
    near(a.earningsPoolIndex, 100);
    near(b.earningsPoolIndex, 80);
    near(a.incomePerRetainedIndex, 100);
    near(b.incomePerRetainedIndex, 100);
  }
});

test("gain sharing changes compensation while leaving care, staffing and deployment unchanged", () => {
  const params = {
    ...deployed,
    documentationSavings: 0.8,
    reasoningSavings: 0.8,
    demandChange: 50,
    capacityGrowth: 100,
    aiCost: 10,
  };
  const low = end({ ...params, captureProprietor: 0, captureSalaried: 0 }, equalTasks);
  const high = end({ ...params, captureProprietor: 1, captureSalaried: 1 }, equalTasks);
  for (let i = 0; i < low.groups.length; i++) {
    const a = low.groups[i];
    const b = high.groups[i];
    near(a.earningsPoolIndex, 90);
    near(b.earningsPoolIndex, 140);
    for (const key of ["careIndex", "humanTime", "requiredWorkIndex", "retainedShare", "adoption"])
      near(a[key], b[key]);
  }
  const unequal = end({ ...params, captureProprietor: 1, captureSalaried: 0 }, equalTasks);
  near(unequal.metrics.incomeRatio, 1.5873640431630816 * 14 / 9);
  near(unequal.metrics.volumeIndex, 150);
});

test("compensation transmits payment losses, shares gains, deducts costs and ends at zero positions", () => {
  near(earningsFactor({ retained: 0.6, paymentValue: 0.9, gainShare: 0.5, aiCost: 0.1 }), 0.59);
  for (const gainShare of [0, 0.5, 1])
    near(earningsFactor({ retained: 0.6, paymentValue: 0.4, gainShare, aiCost: 0.1 }), 0.3);
  near(earningsFactor({ retained: 0.6, paymentValue: 0.1, gainShare: 1, aiCost: 0.3 }), 0);
  near(earningsFactor({ retained: 0.1, paymentValue: 1.5, gainShare: 1, aiCost: 0 }), 0.24);
  near(earningsFactor({ retained: 0, paymentValue: 1.5, gainShare: 1, aiCost: 0 }), 0);
  for (const retained of [1e-3, 1e-6, 1e-12, 1e-16]) {
    const earnings = earningsFactor({ retained, paymentValue: 1.5, gainShare: 1, aiCost: 0 });
    assert.ok(earnings > 0);
    assert.ok(earnings / retained <= 2.5 + 1e-12);
  }
});

test("zero earnings leave inequality undefined, including when positions remain", () => {
  const unpaid = end({ ...deployed, demandChange: -60, feeChange: -60, aiCost: 30 });
  near(unpaid.metrics.employmentRate, 1);
  near(unpaid.metrics.volumeIndex, 40);
  const noPositions = end({ ...deployed, procedureSavings: 1, licensing: 1, staffingResponse: 1 },
    { taskShares: [0, 0, 1, 0] });
  near(noPositions.metrics.employmentRate, 0);
  near(noPositions.metrics.volumeIndex, 100);
  for (const frame of [unpaid, noPositions]) {
    near(frame.metrics.incomeIndex, 0);
    assert.equal(frame.metrics.betweenGini, null);
    assert.equal(frame.metrics.incomeRatio, null);
    for (const group of frame.groups) {
      near(group.income, 0);
      assert.equal(group.incomeShare, null);
    }
  }
  for (const group of noPositions.groups)
    assert.equal(group.incomePerRetainedIndex, null);
});

test("between-group Gini matches independent weighted examples and is invariant to units and group order", () => {
  near(betweenGini([{ weight: 0.25, income: 10 }, { weight: 0.75, income: 30 }]), 0.15);
  near(betweenGini([{ weight: 3, income: 300 }, { weight: 1, income: 100 }]), 0.15);
  near(betweenGini([{ weight: 0.25, income: 0 }, { weight: 0.75, income: 4 }]), 0.25);
  near(betweenGini([0, 0, 0, 4].map((income) => ({ weight: 1, income }))), 0.75);
  near(betweenGini([{ weight: 1, income: 10 }, { weight: 3, income: 10 }]), 0);
  near(betweenGini([{ weight: 0, income: 999 }, { weight: 1, income: 10 }]), 0);
  assert.equal(betweenGini([{ weight: 1, income: 0 }]), null);
  assert.equal(betweenGini([]), null);
  for (const invalid of [
    [{ weight: -1, income: 10 }, { weight: 2, income: 20 }],
    [{ weight: 1, income: -1 }],
    [{ weight: NaN, income: 10 }],
    [{ weight: 1, income: Infinity }],
  ])
    assert.throws(() => betweenGini(invalid), /Gini requires nonnegative finite weights and incomes/);
});

test("saved configuration reproduces the run after callers change their original task-share array", () => {
  const taskShares = [0.25, 0.25, 0.25, 0.25];
  const run = simulate({}, { taskShares });
  taskShares[0] = 0.4;
  taskShares[1] = 0.1;
  assert.deepEqual(run.structure.taskShares, [0.25, 0.25, 0.25, 0.25]);
  const replay = simulate(run.params, run.structure);
  assert.equal(replay.signature, run.signature);
  assert.deepEqual(replay.frames, run.frames);
});

test("extreme valid scenarios conserve normalized work and respect all three care constraints", () => {
  const minimums = Object.fromEntries(PARAMS.map((p) => [p.key, p.min]));
  const maximums = Object.fromEntries(PARAMS.map((p) => [p.key, p.max]));
  const cases = [
    ...PRESETS.map((preset) => [preset.params, {}]),
    [minimums, {}],
    [maximums, {}],
    [{ ...maximums, adoptionProprietor: 0, reasoningSavings: -0.5 }, { proprietorWeight: 0 }],
    [{ ...minimums, adoptionSalaried: 1 }, { proprietorWeight: 1, oversightFloor: 1 }],
    [{ ...maximums, procedureSavings: 1 }, { taskShares: [0, 0, 1, 0], oversightFloor: 0 }],
  ];
  for (const [params, structure] of cases)
    for (const frame of simulate(params, structure).frames) {
      let weightedIncome = 0;
      let weightedRetention = 0;
      let weightedCare = 0;
      let weightedWork = 0;
      for (const group of frame.groups) {
        const care = group.careIndex / 100;
        const work = group.requiredWorkIndex / 100;
        assert.ok(Number.isFinite(group.income) && group.income >= 0);
        assert.ok(group.retainedShare >= 0 && group.retainedShare <= 1);
        assert.ok(care >= 0 && care <= frame.drivers.demand + 1e-10);
        assert.ok(care <= frame.drivers.otherCapacity + 1e-10);
        assert.ok(work <= group.retainedShare + 1e-10);
        near(work, care * group.humanTime);
        near(group.spareWorkShare, group.retainedShare - work);
        weightedIncome += group.weight * group.incomeIndex;
        weightedRetention += group.weight * group.retainedShare;
        weightedCare += group.weight * group.careIndex;
        weightedWork += group.weight * group.requiredWorkIndex;
      }
      near(frame.metrics.incomeIndex, weightedIncome);
      near(frame.metrics.employmentRate, weightedRetention);
      near(frame.metrics.volumeIndex, weightedCare);
      near(frame.metrics.workIndex, weightedWork);
      assert.ok(frame.metrics.betweenGini === null ||
        (frame.metrics.betweenGini >= 0 && frame.metrics.betweenGini <= 1));
      near(frame.audit.maxResidual, 0);
    }
});

test("parameters reject malformed values, unknown controls and values beyond either allowed boundary", () => {
  for (const input of [null, [], 1, "parameters"])
    assert.throws(() => simulate(input), /Parameters must be an object/);
  for (const value of [NaN, Infinity, -Infinity, null, "0.5"])
    assert.throws(() => simulate({ adoptionProprietor: value }), /Invalid parameter: adoptionProprietor/);
  assert.throws(() => simulate({ unknown: 0 }), /Unknown parameter: unknown/);
  for (const parameter of PARAMS)
    for (const value of [parameter.min - 0.01, parameter.max + 0.01])
      assert.throws(() => simulate({ [parameter.key]: value }),
        new RegExp(`Invalid parameter: ${parameter.key}`));
});

test("structural inputs reject invalid task shares, weights and unknown keys including Object prototype names", () => {
  const sparseShares = Array(4);
  sparseShares[0] = 1;
  for (const options of [null, [], 1, "structure"])
    assert.throws(() => simulate({}, options), /Structure must be an object/);
  for (const taskShares of [null, sparseShares, [0.5, 0.5], [0.5, 0.5, 0.5, 0.5], [-0.1, 0.3, 0.4, 0.4],
    [NaN, 0, 0, 1], [Infinity, 0, 0, 1], ["0.25", 0.25, 0.25, 0.25]])
    assert.throws(() => simulate({}, { taskShares }), /Four nonnegative task shares must sum to one/);
  for (const key of ["oversightFloor", "proprietorWeight"])
    for (const value of [-0.01, 1.01, NaN, Infinity, null, "0.5"])
      assert.throws(() => simulate({}, { [key]: value }), new RegExp(`Invalid structure: ${key}`));
  for (const key of ["unknown", "toString", "constructor"])
    assert.throws(() => simulate({}, { [key]: 1 }), new RegExp(`Unknown structure: ${key}`));
});
