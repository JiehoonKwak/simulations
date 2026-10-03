import test from "node:test";
import assert from "node:assert/strict";
import {
  simulate,
  PRESETS,
  PARAMS,
  DEFAULT_PARAMS,
  careCapacity,
  settleAccounts,
  gini,
} from "../web/model.mjs";
const near = (actual, expected, tol = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < tol, `${actual} != ${expected}`);
const end = (params) => simulate(params).frames.at(-1);
const hold = PRESETS.find((p) => p.id === "hold").params;

test("hand-worked connected care: faster diagnosis alone cannot exceed treatment capacity", () => {
  near(careCapacity({ hours: 40, humanTime: 1, treatmentCapacity: 30 }), 30);
  near(careCapacity({ hours: 40, humanTime: 0.5, treatmentCapacity: 30 }), 30);
  near(careCapacity({ hours: 40, humanTime: 0.5, treatmentCapacity: 60 }), 60);
  near(
    careCapacity({
      hours: 0,
      humanTime: 0,
      treatmentCapacity: 60,
      facilityCapacity: 50,
    }),
    50,
  );
});
test("hand-worked payment, retention, financed loss and insolvency", () => {
  const a = settleAccounts({
    revenue: 100,
    nonLaborCost: 40,
    wageFraction: 0.5,
    reserve: 10,
  });
  assert.deepEqual(a, {
    solvent: true,
    wages: 30,
    profit: 30,
    dividends: 24,
    endReserve: 16,
    operatingSurplus: 60,
  });
  const loss = settleAccounts({
    revenue: 20,
    nonLaborCost: 25,
    wageFraction: 0.5,
    reserve: 10,
    minimumWages: 2,
  });
  assert.equal(loss.dividends, 0);
  assert.equal(loss.profit, -7);
  assert.equal(loss.endReserve, 3);
  const breakEven = settleAccounts({
    revenue: 20,
    nonLaborCost: 25,
    wageFraction: 0.5,
    reserve: 7,
    minimumWages: 2,
  });
  assert.equal(breakEven.solvent, true);
  near(breakEven.endReserve, 0);
  near(breakEven.wages, 2);
  assert.equal(
    settleAccounts({
      revenue: 20,
      nonLaborCost: 25,
      wageFraction: 0.5,
      reserve: 6,
      minimumWages: 2,
    }).solvent,
    false,
  );
});
test("common initial population and accounts across all future assumption bundles", () => {
  const first = simulate().frames[0];
  for (const preset of PRESETS)
    assert.deepEqual(simulate(preset.params).frames[0], first);
  for (const p of PARAMS)
    for (const value of [p.min, p.max])
      assert.deepEqual(simulate({ [p.key]: value }).frames[0], first);
  near(first.metrics.incomeIndex, 100);
  near(first.metrics.volumeIndex, 100);
  assert.equal(first.metrics.employmentRate, 1);
  assert.equal(new Set(first.physicians.map((d) => d.id)).size, 192);
});
test("no-change counterfactual retains incomes, employment, care and inequality", () => {
  const run = simulate(hold);
  for (const frame of run.frames) {
    assert.deepEqual(frame.metrics, run.frames[0].metrics);
    assert.deepEqual(frame.physicians, run.frames[0].physicians);
  }
});
test("deterministic seeded outputs independent of intervening scenario runs", () => {
  const a = simulate({}, 19);
  simulate(PRESETS[3].params, 99);
  assert.deepEqual(simulate({}, 19), a);
  assert.notEqual(simulate({}, 20).signature, a.signature);
});
test("invalid inputs fail before output generation", () => {
  for (const input of [null, [], 0, "{}"])
    assert.throws(() => simulate(input), /Parameters must be an object/);
  for (const value of [NaN, Infinity, -Infinity, "0.5", null, undefined])
    assert.throws(
      () => simulate({ licensing: value }),
      /Invalid parameter: licensing/,
    );
  for (const p of PARAMS)
    for (const value of [p.min - p.step, p.max + p.step])
      assert.throws(
        () => simulate({ [p.key]: value }),
        new RegExp(`Invalid parameter: ${p.key}`),
      );
  assert.throws(() => simulate({ bogus: 1 }), /Unknown parameter/);
  for (const seed of [-1, 1.1, NaN, Infinity, null, "42", 4294967296])
    assert.throws(() => simulate({}, seed), /Seed/);
});
test("independent accounting, income counterparties, capacities and population bounds", () => {
  for (const seed of [0, 1, 42])
    for (const preset of PRESETS) {
      const run = simulate(preset.params, seed);
      assert.equal(run.checks.passed, true);
      for (const f of run.frames) {
        assert.equal(f.physicians.length, 192);
        for (const p of f.providers) {
          const team = f.physicians.filter((d) => d.providerId === p.id);
          near(p.revenue - p.nonLaborCost - p.wages, p.profit);
          near(p.beginReserve + p.profit - p.dividends, p.reserve);
          near(
            team.reduce((s, d) => s + d.income, 0),
            p.wages + p.dividends,
          );
          assert.ok(p.reserve >= -1e-8);
          assert.ok(p.volume <= p.capacity + 1e-8);
          assert.ok(p.volume * p.humanTime <= p.headcount * 10 + 1e-8);
          assert.equal(team.filter((d) => d.employed).length, p.headcount);
          for (const d of team) {
            assert.ok(d.income >= 0);
            assert.ok(d.autonomy >= 0 && d.autonomy <= 1);
            if (!d.employed) assert.equal(d.laborIncome, 0);
          }
        }
      }
    }
});
test("all three stages can substitute completely without ghost employment or lost wages", () => {
  const f = end(PRESETS.find((p) => p.id === "permission").params);
  assert.equal(f.metrics.employmentRate, 0);
  assert.equal(f.metrics.autonomy, 0);
  assert.ok(f.metrics.volumeIndex > 0);
  for (const d of f.physicians) assert.equal(d.laborIncome, 0);
  assert.ok(
    f.physicians.some((d) => d.role === "owner" && d.ownershipIncome > 0),
  );
});
test("treatment bottleneck and payer demand are independent mechanisms", () => {
  const params = {
    ...hold,
    cognitionRate: 1,
    communicationRate: 1,
    licensing: 1,
    householdChange: 60,
    insuranceChange: 60,
  };
  const limited = end(params),
    expanded = end({ ...params, procedureRate: 1 });
  assert.ok(limited.metrics.unmetRate > 0.3);
  assert.ok(expanded.metrics.volumeIndex > limited.metrics.volumeIndex + 20);
  const low = end({ ...hold, householdChange: -40, insuranceChange: -40 });
  near(low.metrics.volumeIndex, 60);
  assert.ok(low.metrics.incomeIndex < end(hold).metrics.incomeIndex);
});
test("external labor competition changes distribution, not patient demand or cohort size", () => {
  const a = end(hold),
    b = end({ ...hold, supplyChange: 80 });
  near(a.metrics.volumeIndex, b.metrics.volumeIndex);
  assert.equal(a.physicians.length, b.physicians.length);
  assert.ok(
    b.physicians.find((d) => d.role === "employee").income <
      a.physicians.find((d) => d.role === "employee").income,
  );
});
test("reservation pay protects each retained physician when the payroll floor binds", () => {
  const run = simulate({
    ...hold,
    feeChange: -40,
    wageShare: 0.2,
    supplyChange: 80,
  });
  const final = run.frames.at(-1);
  assert.equal(final.metrics.employmentRate, 1);
  for (const p of final.providers)
    near(p.wages, p.headcount * 0.8);
  for (const frame of run.frames)
    for (const d of frame.physicians)
      if (d.employed)
        assert.ok(
          d.laborIncome >= 0.8 - 1e-8,
          `${frame.year} ${d.id}: retained physician received ${d.laborIncome}`,
        );
});
test("future timing changes intermediate capabilities but shares endpoint capabilities", () => {
  const early = simulate({ timing: -1 }),
    late = simulate({ timing: 1 });
  assert.ok(
    early.frames[5].drivers.cognition > late.frames[5].drivers.cognition,
  );
  near(early.frames[10].drivers.cognition, late.frames[10].drivers.cognition);
});
test("costs can alter adoption; severe contraction closes providers permanently", () => {
  const low = end({ adoptionCost: 0 }),
    high = end({ adoptionCost: 1 });
  assert.ok(low.drivers.adoption > high.drivers.adoption);
  const run = simulate({
    ...hold,
    cognitionRate: 1,
    procedureRate: 1,
    communicationRate: 1,
    adoptionCost: 1,
    scaleAdvantage: 0,
    feeChange: -60,
    householdChange: -60,
    insuranceChange: -60,
    wageShare: 0.9,
    timing: -1,
  });
  assert.ok(run.frames.at(-1).metrics.closedRate > 0);
  const closed = new Set();
  for (const f of run.frames)
    for (const p of f.providers) {
      if (closed.has(p.id)) assert.equal(p.closed, true);
      if (p.closed) {
        closed.add(p.id);
        assert.equal(p.volume, 0);
        assert.equal(p.revenue, 0);
        assert.equal(p.headcount, 0);
        for (const field of ["wages", "dividends", "profit", "nonLaborCost"])
          assert.equal(p[field], 0, `closed ${p.id} must not pay ${field}`);
        near(p.reserve, p.beginReserve);
        for (const d of f.physicians.filter((d) => d.providerId === p.id)) {
          assert.equal(d.employed, false);
          assert.equal(d.income, 0);
          assert.equal(d.autonomy, 0);
        }
      }
    }
});
test("income distribution reference values and original lower-half membership", () => {
  near(gini([1, 1, 1, 1]), 0);
  near(gini([0, 0, 0, 4]), 0.75);
  assert.equal(gini([0, 0]), null);
  const run = simulate(),
    ids = new Set(
      [...run.frames[0].physicians]
        .sort((a, b) => a.income - b.income)
        .slice(0, 96)
        .map((d) => d.id),
    );
  for (const f of run.frames)
    near(
      f.metrics.lowerHalfIncomeIndex,
      f.physicians
        .filter((d) => ids.has(d.id))
        .reduce((s, d) => s + d.incomeIndex, 0) / 96,
    );
});

test("symmetric regional demand scenarios affect local care without changing metropolitan demand", () => {
  const lower = end({ ...hold, regionalDemandChange: -40 }),
    higher = end({ ...hold, regionalDemandChange: 40 });
  const regionalVolume = (f) =>
    f.providers
      .filter((p) => p.region === "regional")
      .reduce((s, p) => s + p.volume, 0);
  const metroVolume = (f) =>
    f.providers
      .filter((p) => p.region === "metro")
      .reduce((s, p) => s + p.volume, 0);
  assert.ok(regionalVolume(higher) > regionalVolume(lower));
  near(metroVolume(higher), metroVolume(lower));
});

test("all-zero income has undefined top share rather than a zero concentration claim", () => {
  const final = end({...hold,cognitionRate:1,procedureRate:1,communicationRate:1,adoptionCost:1,scaleAdvantage:0,feeChange:-60,householdChange:-60,insuranceChange:-60,wageShare:.9,timing:-1});
  assert.equal(final.metrics.closedRate, 1);
  assert.equal(final.metrics.incomeIndex, 0);
  assert.equal(final.metrics.gini, null);
  assert.equal(final.metrics.topShare, null);
});
