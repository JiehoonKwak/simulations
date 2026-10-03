import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import {
  simulate,
  PRESETS,
  PARAMS,
  BASELINE,
  VERSION,
  DEFAULT_STRUCTURE,
} from "../web/empirical-model.mjs";
import {
  scenarioEnvelope,
  TASK_PROFILES,
  SENSITIVITY_DESIGN,
} from "../web/sensitivity.mjs";
import { COMPARISONS } from "../web/comparisons.mjs";
import {
  earningsConditions,
  EARNINGS_RULES,
} from "../web/earnings-conditions.mjs";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(project, "artifacts");
await mkdir(output, { recursive: true });
const summaries = [];
const trajectories = [];
let totalRuns = 0,
  maximumResidual = 0;
for (const preset of PRESETS) {
  const result = simulate(preset.params);
  const envelope = scenarioEnvelope(preset.params, {
    varyEconomy: preset.id !== "hold",
  });
  totalRuns += 1 + envelope.runCount;
  maximumResidual = Math.max(
    maximumResidual,
    result.checks.maxResidual,
    envelope.maximumResidual,
  );
  summaries.push({
    id: preset.id,
    label: preset.label,
    description: preset.description,
    params: result.params,
    structure: result.structure,
    signature: result.signature,
    endpoint: {
      year: 2036,
      metrics: result.frames.at(-1).metrics,
      groups: result.frames.at(-1).groups,
    },
    envelope,
  });
  for (const frame of result.frames)
    for (const group of frame.groups)
      trajectories.push({
        scenario: preset.id,
        year: frame.year,
        group: group.id,
        earnings: group.ownIncomeIndex,
        work: group.requiredWorkIndex,
        positions: group.retainedShare * 100,
        care: group.careIndex,
        incomeRatio: frame.metrics.incomeRatio,
      });
}
const grid = [];
const technology = {
  ...PRESETS.find((p) => p.id === "concentrated").params,
  captureProprietor: 0.8,
};
for (const staffing of [0, 0.5, 1])
  for (let demand = -40; demand <= 60; demand += 2)
    for (let participation = 0; participation <= 20; participation++) {
      const points = TASK_PROFILES.map((profile) => {
        const result = simulate(
          {
            ...technology,
            demandChange: demand,
            capacityGrowth: 60,
            staffingResponse: staffing,
            captureSalaried: participation / 20,
          },
          { taskShares: profile.shares },
        );
        maximumResidual = Math.max(maximumResidual, result.checks.maxResidual);
        totalRuns++;
        return result.frames.at(-1);
      });
      const changes = points.map(
        (p) =>
          (p.metrics.incomeRatio /
            (BASELINE.income.proprietor / BASELINE.income.salaried) -
            1) *
          100,
      );
      grid.push({
        staffing,
        demand,
        salariedParticipation: participation / 20,
        gapChangeMin: Math.min(...changes),
        gapChangeMax: Math.max(...changes),
        gapChange: changes[1],
        robustDirection:
          Math.min(...changes) > 1e-8
            ? "widens"
            : Math.max(...changes) < -1e-8
              ? "narrows"
              : "mixed-or-unchanged",
        salariedEarnings: points[1].groups[1].ownIncomeIndex,
        proprietorEarnings: points[1].groups[0].ownIncomeIndex,
      });
    }
const oneAtATime = [];
for (const p of PARAMS)
  for (let i = 0; i <= 10; i++) {
    const value = p.min + ((p.max - p.min) * i) / 10;
    const result = simulate({ ...PRESETS[0].params, [p.key]: value });
    totalRuns++;
    oneAtATime.push({
      parameter: p.key,
      value,
      ...result.frames.at(-1).metrics,
    });
    maximumResidual = Math.max(maximumResidual, result.checks.maxResidual);
  }
const trial = BASELINE.evidence.find((s) => s.id === "lukac-2025");
const transported = [];
for (const arm of trial.effects)
  for (const noteTimeEffect of [arm.ci95[0], arm.estimate, arm.ci95[1]])
    for (const documentationShare of [0.2, 0.35, 0.5]) {
      const structure = {
        taskShares: [documentationShare, 0.25, 0.25, 0.5 - documentationShare],
      };
      const params = {
        ...PRESETS.find((p) => p.id === "hold").params,
        documentationSavings: -noteTimeEffect / 100,
        adoptionProprietor: 1,
        adoptionSalaried: 1,
      };
      const result = simulate(params, structure);
      totalRuns++;
      transported.push({
        arm: arm.arm,
        noteTimeEffect,
        documentationShare,
        requiredWorkIndex: result.frames.at(-1).metrics.workIndex,
        careIndex: result.frames.at(-1).metrics.volumeIndex,
        params,
        structure,
      });
    }
const summarizeThresholds = (values) => {
  const finite = values.filter(Number.isFinite);
  return {
    min: finite.length ? Math.min(...finite) : null,
    max: finite.length ? Math.max(...finite) : null,
    unreachable: values.length - finite.length,
    variants: values.length,
  };
};
const maintenanceDesign = {
  taskProfiles: TASK_PROFILES,
  earningsRules: EARNINGS_RULES,
  feeOffsets: [-10, 0, 10],
  aiCostPercent: [0, 2, 5],
  target: "Own-role remuneration per original member at 2036 >= 2026 index 100",
  interpretation:
    "54 equally enumerated alternatives per comparison, without probabilities. Task mix and compensation rule vary alongside payment and cost assumptions. Role means and weights cancel from this target.",
};
const comparisons = [];
const comparisonTrajectories = [];
for (const scenario of COMPARISONS) {
  const result = simulate(scenario.params);
  const envelope = scenarioEnvelope(scenario.params);
  totalRuns += 1 + envelope.runCount;
  maximumResidual = Math.max(
    maximumResidual,
    result.checks.maxResidual,
    envelope.maximumResidual,
  );
  const variants = [];
  for (const profile of TASK_PROFILES)
    for (const feeOffset of maintenanceDesign.feeOffsets)
      for (const aiCost of maintenanceDesign.aiCostPercent) {
        const variant = simulate(
          {
            ...scenario.params,
            feeChange: scenario.params.feeChange + feeOffset,
            aiCost,
          },
          { taskShares: profile.shares },
        );
        totalRuns++;
        maximumResidual = Math.max(maximumResidual, variant.checks.maxResidual);
        for (const rule of EARNINGS_RULES)
          variants.push({
            profile: profile.id,
            feeChange: variant.params.feeChange,
            aiCost,
            rule,
            conditions: earningsConditions(variant, { rule }),
          });
      }
  comparisons.push({
    ...scenario,
    signature: result.signature,
    endpoint: result.frames.at(-1),
    envelope,
    conditions: earningsConditions(result),
    alternativeConditions: earningsConditions(result, { rule: "growth-only" }),
    maintenanceSensitivity: {
      design: maintenanceDesign,
      groups: result.frames.at(-1).groups.map((g) => {
        const rows = variants.map((v) =>
          v.conditions.groups.find((row) => row.id === g.id),
        );
        return {
          id: g.id,
          earnings: {
            min: Math.min(...rows.map((r) => r.earningsIndex)),
            max: Math.max(...rows.map((r) => r.earningsIndex)),
          },
          minimumDemandGrowth: summarizeThresholds(
            rows.map((r) => r.minimumDemandGrowth.value),
          ),
          minimumParticipation: summarizeThresholds(
            rows.map((r) => r.minimumParticipation.value),
          ),
          maintainedInEveryVariant: rows.every(
            (r) => r.earningsIndex >= 100 - 1e-8,
          ),
        };
      }),
      variants,
    },
  });
  for (const frame of result.frames)
    for (const group of frame.groups)
      comparisonTrajectories.push({
        scenario: scenario.id,
        year: frame.year,
        group: group.id,
        earnings: group.ownIncomeIndex,
        work: group.requiredWorkIndex,
        positions: group.retainedShare * 100,
        care: group.careIndex,
      });
}
const maintenanceCurves = [];
for (const profile of TASK_PROFILES)
  for (const capacityGrowth of [20, 40])
    for (const staffingResponse of [0, 0.5, 1])
      for (let i = 0; i <= 100; i++) {
        const gainShare = i / 100;
        const result = simulate(
          {
            ...COMPARISONS[3].params,
            capacityGrowth,
            staffingResponse,
            captureSalaried: gainShare,
          },
          { taskShares: profile.shares },
        );
        totalRuns++;
        maximumResidual = Math.max(maximumResidual, result.checks.maxResidual);
        for (const rule of EARNINGS_RULES) {
          const group = earningsConditions(result, { rule }).groups[1];
          maintenanceCurves.push({
            profile: profile.id,
            capacityGrowth,
            staffingResponse,
            gainShare,
            rule,
            minimumDemandGrowth: group.minimumDemandGrowth.value,
            maximumEarningsIndex:
              group.minimumDemandGrowth.maximumEarningsIndex,
            maximumCareIndex: group.minimumDemandGrowth.maximumCareIndex,
            status: group.minimumDemandGrowth.status,
          });
        }
      }
const modelHash = createHash("sha256")
  .update(await readFile(resolve(project, "web/empirical-model.mjs")))
  .digest("hex");
const report = {
  version: VERSION,
  inputHashes: BASELINE.inputHashes,
  modelHash,
  baseline: BASELINE.income,
  interpretation: {
    target:
      "Changes in required clinical work, retained original positions, and remuneration in the original modeled practice, by proprietor/salaried role.",
    timeOrigin:
      "2026 scenario index carrying 2020 relative earnings anchors forward; no observed 2026 income claim.",
    uncertainty:
      "Finite design sensitivity, not predictive or sampling confidence intervals. Trial CIs stay in a separate transport exercise.",
    care: "Weighted average of within-role activity indices, not summed national visits or inpatient days.",
    weights:
      "Reconstructed from same-table means; 0.35/0.4161/0.50 alternatives. Not observed national physician shares.",
    earnings:
      "Participation rights scale with retained original positions. Outside earnings and passive returns after clinical exit are outside the estimand.",
  },
  design: SENSITIVITY_DESIGN,
  scenarios: summaries,
  trajectories,
  thresholdGrid: grid,
  oneAtATime,
  trialTransport: {
    sourceId: trial.id,
    interpretation:
      "Study-arm ITT note-time effects applied once; task share is assumed. Interval endpoints are transported study estimates, not a Korean future CI.",
    rows: transported,
  },
  comparisons,
  comparisonTrajectories,
  maintenanceDesign,
  maintenanceCurves,
  analysisHashes: Object.fromEntries(
    await Promise.all(
      [
        "scripts/analyze-empirical.mjs",
        "web/earnings-conditions.mjs",
        "web/comparisons.mjs",
        "web/sensitivity.mjs",
      ].map(async (name) => [
        name,
        createHash("sha256")
          .update(await readFile(resolve(project, name)))
          .digest("hex"),
      ]),
    ),
  ),
  checks: {
    runs: totalRuns,
    maximumResidual,
    passed: Number.isFinite(maximumResidual) && maximumResidual < 1e-8,
  },
};
await writeFile(
  resolve(output, "scenario-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
const csv = (rows, columns) =>
  [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((key) => JSON.stringify(row[key] ?? "")).join(","),
    ),
  ].join("\n") + "\n";
await writeFile(
  resolve(output, "scenario-trajectories.csv"),
  csv(trajectories, Object.keys(trajectories[0])),
);
await writeFile(
  resolve(output, "threshold-grid.csv"),
  csv(grid, Object.keys(grid[0])),
);
await writeFile(
  resolve(output, "comparison-trajectories.csv"),
  csv(comparisonTrajectories, Object.keys(comparisonTrajectories[0])),
);
await writeFile(
  resolve(output, "earnings-maintenance-curves.csv"),
  csv(maintenanceCurves, Object.keys(maintenanceCurves[0])),
);
const round = (x) => (x === null ? "undefined" : x.toFixed(1));
let md = `# Physician futures: empirical scenario results\n\nModel ${VERSION}. Generated reproducibly by \`node scripts/analyze-empirical.mjs\`.\n\nThe observed anchors are 2020 adjusted annual remuneration: practice proprietors KRW ${(BASELINE.income.proprietor / 1e6).toFixed(1)} million and salaried physicians KRW ${(BASELINE.income.salaried / 1e6).toFixed(1)} million. Their ratio is ${(BASELINE.income.proprietor / BASELINE.income.salaried).toFixed(3)}. The 2026 starting index carries this relative structure forward as an assumption.\n\n## Central scenarios at 2036\n\nAll indices use each group's own 2026 baseline = 100. Retained positions concern the original modeled practice, not nationwide employment.\n\n| Scenario | Proprietor earnings | Salaried earnings | Clinical work | Positions retained | Care index | Role earnings ratio |\n|---|---:|---:|---:|---:|---:|---:|\n`;
for (const s of summaries)
  md += `| ${s.label} | ${round(s.endpoint.groups[0].ownIncomeIndex)} | ${round(s.endpoint.groups[1].ownIncomeIndex)} | ${round(s.endpoint.metrics.workIndex)} | ${round(100 * s.endpoint.metrics.employmentRate)}% | ${round(s.endpoint.metrics.volumeIndex)} | ${s.endpoint.metrics.incomeRatio?.toFixed(3) ?? "undefined"} |\n`;
md += `\nEqual deployment and gain participation preserve the starting role-income ratio. A larger gap in the unequal-sharing scenario follows from its distributional assumptions; it is not an estimated causal benefit of proprietorship. Time savings can raise care, reduce workload, or reduce positions depending on demand, other capacity and staffing response.\n\n## Sensitivity design\n\nThree task mixes × three oversight floors × three reconstructed role weights × payment offsets of −10/0/+10 percentage points × demand offsets of −10/0/+10 percentage points: 243 alternatives per active scenario. The no-change control varies only structure (27 runs), keeping technology/economic change at zero. Ranges are extrema, not confidence intervals. Task-specific effects, participation, and staffing response are also examined individually over their complete interface ranges.\n\nThe threshold grid fixes the broad-workflow technology scenario and proprietor gain participation at 0.8, then varies salaried participation, demand growth and staffing response. Its three task mixes show which gap directions depend on task composition. Grid counts have no probabilistic interpretation.\n\n## Trial transport check\n\nThe Nabla and DAX randomized-trial note-time effects and their confidence endpoints are applied once, without multiplying their ITT effect by observed utilization again. Documentation shares of 20%, 35%, and 50% are explicit transport assumptions. The resulting work/care effects are not direct Korean observations or forecast intervals. The negative/near-null arm prevents a uniformly optimistic interpretation of documentation AI.\n\n## Data and interpretation\n\nRole weights are reconstructed from same-table means; eligible counts and aggregation code were not obtained. The 2024 NHIS/HIRA workforce tables provide separate institution context and are not used as earnings weights. Neither within-role income tails nor individual layoffs are observed. The model therefore reports role means/ratios and conditional two-point dispersion, not a national physician Gini, top-decile share, or person-level forecast.\n\nThe compensation envelope is a scenario rule, not a fitted behavioral elasticity or a provider balance sheet. Participation rights shrink with retained original positions; passive returns after clinical exit and earnings elsewhere are excluded. No probability is assigned to automation endpoints, licensing changes, or future staffing decisions.\n\n## Verification and files\n\n${totalRuns.toLocaleString("en-US")} deterministic runs; maximum work/capacity residual ${maximumResidual}. Observed means are reproduced at the reference baseline, and source extraction separately reconciles source cells, totals and SHA-256 hashes. This establishes reproducibility and internal consistency, not out-of-sample forecast accuracy.\n\n- [Source definitions and method](../docs/model-method.md)\n- [Income extraction](../docs/income-data.md)\n- [Workforce extraction](../docs/workforce-data.md)\n- [Full numerical report](scenario-report.json)\n- [Scenario trajectories](scenario-trajectories.csv)\n- [Threshold grid](threshold-grid.csv)\n`;
const threshold = (condition, scale = 1) =>
  condition.value === null
    ? "Not reachable"
    : `${(condition.value * scale).toFixed(2)}%`;
let findings = `## Matched comparisons and earnings maintenance\n\nThe primary question is which conditions preserve each role's mean real remuneration in its original practice at 2036 (own 2026 index = 100). These thresholds do not guarantee earnings at every intervening year. All four paths share the same hypothetical technology, payment rate, AI cost, capacity and deployment: only purchased-care demand, staffing response and gain participation change in sequence. The common endpoint requires 0.73 physician-work units per care unit, a chosen broad-workflow scenario, not a measured Korean whole-day effect.\n\n| Matched path | Proprietor earnings | Salaried earnings | Work | Positions retained | Care |\n|---|---:|---:|---:|---:|---:|\n`;
for (const s of comparisons)
  findings += `| ${s.label} | ${round(s.endpoint.groups[0].ownIncomeIndex)} | ${round(s.endpoint.groups[1].ownIncomeIndex)} | ${round(s.endpoint.metrics.workIndex)} | ${round(100 * s.endpoint.metrics.employmentRate)}% | ${round(s.endpoint.metrics.volumeIndex)} |\n`;
findings += `\nFlat demand leaves no additional payment value while the assumed AI cost remains. Expanding care raises earnings when positions are retained and gains participate in remuneration. Staffing adjustment reduces the original-group income base; lowering only salaried participation then changes its earnings without changing care, technology or workload. The contrast isolates an imposed distribution rule, not an estimated causal ownership effect.\n\n### Conditions that can be acted on in the simulator\n\nEach threshold changes one input, holding the other inputs fixed. Minimum demand includes staffing adjustment along the demand path and respects both physician-time and other-care capacity. Minimum participation holds current demand and retained positions fixed. Not reachable means no allowed value of that input preserves the original-group mean under the remaining conditions.\n\n| Path | Group | Minimum demand growth | Minimum participation | Alternative-rule minimum demand | Alternative-rule minimum participation |\n|---|---|---:|---:|---:|---:|\n`;
for (const s of comparisons)
  for (const g of s.conditions.groups) {
    const alt = s.alternativeConditions.groups.find((row) => row.id === g.id);
    findings += `| ${s.label} | ${g.label} | ${threshold(g.minimumDemandGrowth)} | ${threshold(g.minimumParticipation, 100)} | ${threshold(alt.minimumDemandGrowth)} | ${threshold(alt.minimumParticipation, 100)} |\n`;
  }
findings += `\nThe retained-rights rule shares positive payment value above retained baseline compensation. The paired growth-only rule shares only payment growth above the original compensation baseline. The alternative preserves the estimand, loss branch, cost and zero-position limit but excludes redistribution of departed positions' baseline claims. Neither rule is fitted to Korean compensation contracts. A result surviving task-mix variation alone is not automatically robust to this rule change.\n\n### What follows from the equations\n\nFor retained share r, payment value R and cost C, maintenance requires R >= 1 + C. Under the central rule, maximum earnings at R=1 are max(0, 1-(1-r)^2-C); position reduction or a positive cost therefore prevents maintenance at unchanged payment value. With all positions retained, unchanged real payment and positive participation c, minimum care is 1+C/c, provided demand and care capacity can reach it. Baseline role means and reconstructed population weights cancel from these own-role index thresholds. These are mathematical implications of the stated model, not additional observations.\n\n### Structural and economic sensitivity\n\nEach matched path is checked under 54 alternatives: three task mixes, two earnings rules, three real-payment offsets (-10/0/+10 percentage points), and three AI cost assumptions (0/2/5% of baseline remuneration at full deployment). The following ranges describe this finite design only; no probabilities are assigned.\n\n| Path | Group | Earnings range | Maintained in every tested alternative | Demand threshold range when reachable | Unreachable demand cases |\n|---|---|---:|---|---:|---:|\n`;
for (const s of comparisons)
  for (const g of s.maintenanceSensitivity.groups) {
    const label = s.endpoint.groups.find((row) => row.id === g.id).label;
    const d = g.minimumDemandGrowth;
    findings += `| ${s.label} | ${label} | ${round(g.earnings.min)}–${round(g.earnings.max)} | ${g.maintainedInEveryVariant ? "Yes" : "No"} | ${d.min === null ? "None" : `${round(d.min)}–${round(d.max)}%`} | ${d.unreachable}/${d.variants} |\n`;
  }
findings += `\nThe demand-threshold curves additionally cross two other-capacity ceilings (+20/+40%), three staffing responses and three task mixes with both compensation rules. Unattainable points remain null rather than being plotted at an artificial maximum. Existing full-range one-at-a-time results depend on the chosen parameter ranges: a zero staffing effect in the assistive reference reflects no workload slack; endpoint timing is invariant by construction. They are not empirical rankings of importance.\n\n### Evidence that changes interpretation\n\nThe verified Korean ED studies support a selected note-drafting benefit, including physician review. One uses a virtual EHR with preloaded drafts; the other is a small voluntary implementation with recalled writing times. They share an institutional/system lineage and do not establish whole-day time savings, completed visits or wage response. Korean rheumatology survey times are allocated or perceived ideal times, not measured task fractions. Korean fee-policy evidence distinguishes redistributed Saturday visits and billings from total demand or physician remuneration. Consequently, task shares, output conversion, staffing and gain participation remain sensitivity axes rather than silently fitted coefficients. See [the primary-source evidence ledger](../docs/evidence.md).\n\nThe September 29, 2026 official release provides a 2023 overall remuneration mean but no retrieved matched role means or eligible role counts. It is recorded as newer context while the verified 2020 role anchors remain. The newly retrieved full report corrects valid-remuneration eligibility in the source documentation; no calibrated numerical anchor changed.\n\n- [Matched trajectory data](comparison-trajectories.csv)\n- [Earnings-maintenance curves](earnings-maintenance-curves.csv)\n- [Full results, parameters, alternative rules and source hashes](scenario-report.json)\n\n`;
md = md.replace(
  "## Central scenarios at 2036",
  `${findings}## Additional scenarios at 2036`,
);
await writeFile(resolve(output, "analysis-report.md"), md);
console.log(
  `Analyzed ${totalRuns} runs; maximum work/capacity residual ${maximumResidual}.`,
);
