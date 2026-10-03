import { earningsFactor, PARAMS } from "./empirical-model.mjs";

export const EARNINGS_RULES = ["retained-rights", "growth-only"];
const tolerance = 1e-10;

export function conditionalEarnings(
  { retained, paymentValue, gainShare, aiCost },
  rule = "retained-rights",
) {
  if (rule === "retained-rights")
    return earningsFactor({ retained, paymentValue, gainShare, aiCost });
  if (rule !== "growth-only")
    throw new RangeError(`Unknown earnings rule: ${rule}`);
  return Math.max(
    0,
    Math.min(retained, paymentValue) +
      retained * gainShare * Math.max(0, paymentValue - 1) -
      aiCost,
  );
}

export function earningsConditions(run, { rule = "retained-rights" } = {}) {
  if (!EARNINGS_RULES.includes(rule))
    throw new RangeError(`Unknown earnings rule: ${rule}`);
  const frame = run.frames.at(-1);
  const { fee, otherCapacity } = frame.drivers;
  const demandControl = PARAMS.find((p) => p.key === "demandChange");
  const lowerDemand = 1 + demandControl.min / 100;
  const upperDemand = 1 + demandControl.max / 100;
  const groups = frame.groups.map((g) => {
    const R = (g.careIndex / 100) * fee;
    const r = g.retainedShare;
    const C = g.aiCostShare;
    const B = Math.min(r, R);
    const A = r * Math.max(0, R - (rule === "growth-only" ? 1 : r));
    const gap = 1 + C - B;
    const requiredShare = gap <= tolerance ? 0 : A > 0 ? gap / A : null;
    const shareFeasible =
      requiredShare !== null && requiredShare <= 1 + tolerance;
    const fixed = { retained: r, paymentValue: R, aiCost: C };
    const physicianCapacity = g.humanTime > 0 ? 1 / g.humanTime : Infinity;
    const maximumCare = Math.min(otherCapacity, physicianCapacity, upperDemand);
    const earningsAtCare = (care) =>
      conditionalEarnings(
        {
          retained:
            1 -
            run.params.staffingResponse * Math.max(0, 1 - care * g.humanTime),
          paymentValue: care * fee,
          gainShare: g.capture,
          aiCost: C,
        },
        rule,
      );
    const maximumEarnings = earningsAtCare(maximumCare);
    const demandFeasible = maximumEarnings >= 1 - tolerance;
    let minimumDemand = null;
    if (demandFeasible) {
      let lo = Math.min(lowerDemand, maximumCare),
        hi = maximumCare;
      if (earningsAtCare(lo) >= 1 - tolerance) hi = lo;
      else
        for (let i = 0; i < 60; i++) {
          const mid = (lo + hi) / 2;
          if (earningsAtCare(mid) >= 1) hi = mid;
          else lo = mid;
        }
      minimumDemand = Math.max(demandControl.min, (hi - 1) * 100);
    }
    const limitingConstraints = [
      ["other-care capacity", otherCapacity],
      ["physician-time capacity", physicianCapacity],
      ["demand-control range", upperDemand],
    ]
      .filter(([, capacity]) => Math.abs(capacity - maximumCare) < tolerance)
      .map(([name]) => name);
    return {
      id: g.id,
      label: g.label,
      earningsIndex:
        100 * conditionalEarnings({ ...fixed, gainShare: g.capture }, rule),
      humanTime: g.humanTime,
      retainedShare: r,
      careIndex: g.careIndex,
      paymentValue: R,
      aiCostShare: C,
      minimumParticipation: {
        status: shareFeasible ? "reachable" : "not-reachable",
        value: shareFeasible ? Math.max(0, Math.min(1, requiredShare)) : null,
        maximumEarningsIndex:
          100 * conditionalEarnings({ ...fixed, gainShare: 1 }, rule),
      },
      minimumDemandGrowth: {
        status: demandFeasible ? "reachable" : "not-reachable",
        value: minimumDemand,
        maximumEarningsIndex: 100 * maximumEarnings,
        maximumCareIndex: 100 * maximumCare,
        limitingConstraints,
      },
    };
  });
  return {
    year: frame.year,
    targetIndex: 100,
    rule,
    signature: run.signature,
    groups,
    interpretation:
      "One-variable-at-a-time endpoint conditions under the stated earnings rule; original-practice remuneration per original member. Not empirical estimates or guarantees.",
  };
}
