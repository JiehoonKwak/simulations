import test from "node:test";
import assert from "node:assert/strict";
import { simulate, PRESETS } from "../web/empirical-model.mjs";
import {
  conditionalEarnings,
  earningsConditions,
} from "../web/earnings-conditions.mjs";
import { COMPARISONS } from "../web/comparisons.mjs";

const near = (actual, expected, tolerance = 1e-8) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${actual} != ${expected}`,
  );
const hold = PRESETS.find((preset) => preset.id === "hold").params;
const procedureOnly = { taskShares: [0, 0, 1, 0] };
const productive = {
  ...hold,
  procedureSavings: 0.2,
  adoptionProprietor: 1,
  adoptionSalaried: 1,
  capacityGrowth: 30,
  aiCost: 5,
  captureProprietor: 0.5,
  captureSalaried: 0.5,
};

test("hand-calculated participation threshold targets each original role member's own baseline", () => {
  const run = simulate(
    {
      ...productive,
      procedureSavings: 1 / 3,
      demandChange: 20,
      staffingResponse: 1,
      aiCost: 2,
      captureProprietor: 0.8,
      captureSalaried: 0.8,
    },
    procedureOnly,
  );
  const conditions = earningsConditions(run);
  assert.equal(conditions.targetIndex, 100);
  assert.equal(conditions.year, 2036);
  assert.equal(conditions.signature, run.signature);
  for (const group of conditions.groups) {
    near(group.retainedShare, 0.8);
    near(group.paymentValue, 1.2);
    near(group.earningsIndex, 103.6);
    assert.equal(group.minimumParticipation.status, "reachable");
    near(group.minimumParticipation.value, 0.6875);
    near(group.minimumParticipation.maximumEarningsIndex, 110);
  }
  for (const group of earningsConditions(run, { rule: "growth-only" }).groups) {
    near(group.earningsIndex, 90.8);
    assert.equal(group.minimumParticipation.status, "not-reachable");
    assert.equal(group.minimumParticipation.value, null);
    near(group.minimumParticipation.maximumEarningsIndex, 94);
  }
});

test("minimum demand includes the feedback from care volume to retained positions", () => {
  for (const [staffingResponse, rule, expectedDemandGrowth] of [
    [0, "retained-rights", 10],
    [1, "retained-rights", 17.45445176142346],
    [1, "growth-only", 19.55824957813168],
  ]) {
    const run = simulate({ ...productive, staffingResponse }, procedureOnly);
    for (const group of earningsConditions(run, { rule }).groups) {
      assert.equal(group.minimumDemandGrowth.status, "reachable");
      near(group.minimumDemandGrowth.value, expectedDemandGrowth);
      near(group.minimumDemandGrowth.maximumCareIndex, 125);
    }
  }
});

test("reported default-rule thresholds replay at own-role income 100 and a smaller value misses the target", () => {
  const params = {
    ...PRESETS.find((preset) => preset.id === "shared").params,
    staffingResponse: 1,
    adoptionSalaried: 0.7,
  };
  const run = simulate(params);
  const condition = earningsConditions(run);
  for (const group of condition.groups) {
    const participationKey =
      group.id === "proprietor" ? "captureProprietor" : "captureSalaried";
    const scenarios = [
      [participationKey, group.minimumParticipation],
      ["demandChange", group.minimumDemandGrowth],
    ];
    for (const [parameter, threshold] of scenarios) {
      assert.equal(threshold.status, "reachable");
      const atThreshold = simulate({ ...params, [parameter]: threshold.value });
      const belowThreshold = simulate({
        ...params,
        [parameter]: threshold.value - 1e-4,
      });
      near(
        atThreshold.frames.at(-1).groups.find((g) => g.id === group.id)
          .ownIncomeIndex,
        100,
      );
      assert.ok(
        belowThreshold.frames.at(-1).groups.find((g) => g.id === group.id)
          .ownIncomeIndex <
          100 - 1e-6,
      );
    }
  }
});

test("unreachable thresholds distinguish limited capacity, no participation and a required share above one", () => {
  const capacityLimited = earningsConditions(
    simulate({ ...productive, capacityGrowth: 5 }, procedureOnly),
  );
  for (const group of capacityLimited.groups) {
    assert.equal(group.minimumDemandGrowth.status, "not-reachable");
    assert.equal(group.minimumDemandGrowth.value, null);
    near(group.minimumDemandGrowth.maximumCareIndex, 105);
    near(group.minimumDemandGrowth.maximumEarningsIndex, 97.5);
    assert.deepEqual(group.minimumDemandGrowth.limitingConstraints, [
      "other-care capacity",
    ]);
  }
  const noParticipation = earningsConditions(
    simulate(
      {
        ...productive,
        demandChange: 10,
        captureProprietor: 0,
        captureSalaried: 0,
      },
      procedureOnly,
    ),
  );
  for (const group of noParticipation.groups) {
    assert.equal(group.minimumDemandGrowth.status, "not-reachable");
    near(group.minimumDemandGrowth.maximumEarningsIndex, 95);
    assert.equal(group.minimumParticipation.status, "reachable");
    near(group.minimumParticipation.value, 0.5);
  }
  const lostPositions = earningsConditions(
    simulate(
      {
        ...productive,
        staffingResponse: 1,
        aiCost: 0,
      },
      procedureOnly,
    ),
  );
  for (const group of lostPositions.groups) {
    assert.equal(group.minimumParticipation.status, "not-reachable");
    assert.equal(group.minimumParticipation.value, null);
    near(group.minimumParticipation.maximumEarningsIndex, 96);
  }
});

test("no-cost control and zero-human-work cases preserve exact maintenance and exit boundaries", () => {
  const unchanged = simulate(hold);
  const noHumanWork = { ...productive, procedureSavings: 1, licensing: 1 };
  for (const rule of ["retained-rights", "growth-only"]) {
    for (const group of earningsConditions(unchanged, { rule }).groups) {
      near(group.earningsIndex, 100);
      assert.equal(group.minimumParticipation.status, "reachable");
      near(group.minimumParticipation.value, 0);
      assert.equal(group.minimumDemandGrowth.status, "reachable");
      near(group.minimumDemandGrowth.value, 0);
    }
    const keep = earningsConditions(simulate(noHumanWork, procedureOnly), {
      rule,
    });
    const exit = earningsConditions(
      simulate({ ...noHumanWork, staffingResponse: 1 }, procedureOnly),
      { rule },
    );
    for (const group of keep.groups) {
      near(group.humanTime, 0);
      near(group.retainedShare, 1);
      assert.equal(group.minimumDemandGrowth.status, "reachable");
      near(group.minimumDemandGrowth.value, 10);
      assert.ok(
        !group.minimumDemandGrowth.limitingConstraints.includes(
          "physician-time capacity",
        ),
      );
    }
    for (const group of exit.groups) {
      near(group.earningsIndex, 0);
      assert.equal(group.minimumParticipation.status, "not-reachable");
      assert.equal(group.minimumDemandGrowth.status, "not-reachable");
      assert.equal(group.minimumDemandGrowth.value, null);
      near(group.minimumDemandGrowth.maximumEarningsIndex, 0);
    }
  }
});

test("growth-only surplus preserves the original-member estimand but can reverse maintenance", () => {
  const reversal = {
    retained: 0.8,
    paymentValue: 1.2,
    gainShare: 0.8,
    aiCost: 0.02,
  };
  near(conditionalEarnings(reversal), 1.036);
  near(conditionalEarnings(reversal, "growth-only"), 0.908);
  for (const input of [
    reversal,
    { retained: 1, paymentValue: 0.8, gainShare: 0.7, aiCost: 0.1 },
    { retained: 1, paymentValue: 1.4, gainShare: 0.5, aiCost: 0.05 },
    { retained: 0, paymentValue: 2, gainShare: 1, aiCost: 0 },
  ]) {
    const current = conditionalEarnings(input);
    const alternative = conditionalEarnings(input, "growth-only");
    assert.ok(alternative <= current);
    if (input.retained === 1) near(alternative, current);
    if (input.retained === 0) near(alternative, 0);
  }
});

test("adjacent illustrated comparisons isolate demand, staffing and then salaried participation", () => {
  const differences = COMPARISONS.slice(1).map((current, index) =>
    Object.keys(current.params).filter(
      (key) => current.params[key] !== COMPARISONS[index].params[key],
    ),
  );
  assert.deepEqual(differences, [
    ["demandChange"],
    ["staffingResponse"],
    ["captureSalaried"],
  ]);
  const shared = simulate(COMPARISONS[2].params).frames.at(-1);
  const unequal = simulate(COMPARISONS[3].params).frames.at(-1);
  near(shared.metrics.workIndex, unequal.metrics.workIndex);
  near(shared.metrics.volumeIndex, unequal.metrics.volumeIndex);
  near(shared.metrics.employmentRate, unequal.metrics.employmentRate);
  near(shared.groups[0].ownIncomeIndex, unequal.groups[0].ownIncomeIndex);
  assert.ok(shared.groups[1].ownIncomeIndex > unequal.groups[1].ownIncomeIndex);
});

test("unknown earnings rules are rejected before generating threshold claims", () => {
  assert.throws(
    () =>
      conditionalEarnings(
        { retained: 1, paymentValue: 1, gainShare: 0.5, aiCost: 0 },
        "unknown",
      ),
    /Unknown earnings rule/,
  );
  assert.throws(
    () => earningsConditions(simulate(hold), { rule: "unknown" }),
    /Unknown earnings rule/,
  );
});
