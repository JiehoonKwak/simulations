import { simulate, DEFAULT_STRUCTURE, PARAMS } from "./empirical-model.mjs";

export const TASK_PROFILES = [
  { id: "documentation-heavy", shares: [0.5, 0.2, 0.1, 0.2] },
  { id: "balanced", shares: [...DEFAULT_STRUCTURE.taskShares] },
  { id: "hands-on-heavy", shares: [0.2, 0.2, 0.4, 0.2] },
];
export const SENSITIVITY_DESIGN = Object.freeze({
  taskProfiles: TASK_PROFILES,
  oversightFloors: [0, 0.2, 0.4],
  proprietorWeights: [0.35, DEFAULT_STRUCTURE.proprietorWeight, 0.5],
  feeOffsets: [-10, 0, 10],
  demandOffsets: [-10, 0, 10],
  interpretation:
    "Full range over a declared factorial grid; not a confidence interval or forecast probability.",
});
const bounds = (values) => ({
  min: Math.min(...values),
  max: Math.max(...values),
});
const validBounds = (values) => {
  const valid = values.filter(Number.isFinite);
  return valid.length
    ? { ...bounds(valid), undefinedCount: values.length - valid.length }
    : { min: null, max: null, undefinedCount: values.length };
};
const bounded = (key, value) => {
  const p = PARAMS.find((p) => p.key === key);
  return Math.max(p.min, Math.min(p.max, value));
};

export function scenarioEnvelope(params, { varyEconomy = true } = {}) {
  const runs = [];
  let maximumResidual = 0;
  for (const profile of TASK_PROFILES)
    for (const floor of SENSITIVITY_DESIGN.oversightFloors)
      for (const weight of SENSITIVITY_DESIGN.proprietorWeights)
        for (const fee of varyEconomy ? SENSITIVITY_DESIGN.feeOffsets : [0])
          for (const demand of varyEconomy
            ? SENSITIVITY_DESIGN.demandOffsets
            : [0]) {
            const result = simulate(
              {
                ...params,
                feeChange: bounded("feeChange", params.feeChange + fee),
                demandChange: bounded(
                  "demandChange",
                  params.demandChange + demand,
                ),
              },
              {
                taskShares: profile.shares,
                oversightFloor: floor,
                proprietorWeight: weight,
              },
            );
            maximumResidual = Math.max(
              maximumResidual,
              result.checks.maxResidual,
            );
            runs.push(
              result.frames.map((frame) => ({
                year: frame.year,
                metrics: frame.metrics,
                groups: frame.groups.map((g) => ({
                  id: g.id,
                  earnings: g.ownIncomeIndex,
                  work: g.requiredWorkIndex,
                  positions: g.retainedShare * 100,
                  care: g.careIndex,
                })),
              })),
            );
          }
  const frames = runs[0].map((first, t) => ({
    year: first.year,
    metrics: Object.fromEntries(
      Object.keys(first.metrics).map((key) => [
        key,
        validBounds(runs.map((run) => run[t].metrics[key])),
      ]),
    ),
    groups: first.groups.map((group, g) => ({
      id: group.id,
      ...Object.fromEntries(
        ["earnings", "work", "positions", "care"].map((key) => [
          key,
          bounds(runs.map((run) => run[t].groups[g][key])),
        ]),
      ),
    })),
  }));
  return {
    design: SENSITIVITY_DESIGN,
    varyEconomy,
    runCount: runs.length,
    maximumResidual,
    frames,
  };
}
