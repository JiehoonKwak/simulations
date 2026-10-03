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
const round = (x) => (x === null ? "undefined" : x.toFixed(1));
let md = `# Physician futures: empirical scenario results\n\nModel ${VERSION}. Generated reproducibly by \`node scripts/analyze-empirical.mjs\`.\n\nThe observed anchors are 2020 adjusted annual remuneration: practice proprietors KRW ${(BASELINE.income.proprietor / 1e6).toFixed(1)} million and salaried physicians KRW ${(BASELINE.income.salaried / 1e6).toFixed(1)} million. Their ratio is ${(BASELINE.income.proprietor / BASELINE.income.salaried).toFixed(3)}. The 2026 starting index carries this relative structure forward as an assumption.\n\n## Central scenarios at 2036\n\nAll indices use each group's own 2026 baseline = 100. Retained positions concern the original modeled practice, not nationwide employment.\n\n| Scenario | Proprietor earnings | Salaried earnings | Clinical work | Positions retained | Care index | Role earnings ratio |\n|---|---:|---:|---:|---:|---:|---:|\n`;
for (const s of summaries)
  md += `| ${s.label} | ${round(s.endpoint.groups[0].ownIncomeIndex)} | ${round(s.endpoint.groups[1].ownIncomeIndex)} | ${round(s.endpoint.metrics.workIndex)} | ${round(100 * s.endpoint.metrics.employmentRate)}% | ${round(s.endpoint.metrics.volumeIndex)} | ${s.endpoint.metrics.incomeRatio?.toFixed(3) ?? "undefined"} |\n`;
md += `\nEqual deployment and gain participation preserve the starting role-income ratio. A larger gap in the unequal-sharing scenario follows from its distributional assumptions; it is not an estimated causal benefit of proprietorship. Time savings can raise care, reduce workload, or reduce positions depending on demand, other capacity and staffing response.\n\n## Sensitivity design\n\nThree task mixes × three oversight floors × three reconstructed role weights × payment offsets of −10/0/+10 percentage points × demand offsets of −10/0/+10 percentage points: 243 alternatives per active scenario. The no-change control varies only structure (27 runs), keeping technology/economic change at zero. Ranges are extrema, not confidence intervals. Task-specific effects, participation, and staffing response are also examined individually over their complete interface ranges.\n\nThe threshold grid fixes the broad-workflow technology scenario and proprietor gain participation at 0.8, then varies salaried participation, demand growth and staffing response. Its three task mixes show which gap directions depend on task composition. Grid counts have no probabilistic interpretation.\n\n## Trial transport check\n\nThe Nabla and DAX randomized-trial note-time effects and their confidence endpoints are applied once, without multiplying their ITT effect by observed utilization again. Documentation shares of 20%, 35%, and 50% are explicit transport assumptions. The resulting work/care effects are not direct Korean observations or forecast intervals. The negative/near-null arm prevents a uniformly optimistic interpretation of documentation AI.\n\n## Data and interpretation\n\nRole weights are reconstructed from same-table means; eligible counts and aggregation code were not obtained. The 2024 NHIS/HIRA workforce tables provide separate institution context and are not used as earnings weights. Neither within-role income tails nor individual layoffs are observed. The model therefore reports role means/ratios and conditional two-point dispersion, not a national physician Gini, top-decile share, or person-level forecast.\n\nThe compensation envelope is a scenario rule, not a fitted behavioral elasticity or a provider balance sheet. Participation rights shrink with retained original positions; passive returns after clinical exit and earnings elsewhere are excluded. No probability is assigned to automation endpoints, licensing changes, or future staffing decisions.\n\n## Verification and files\n\n${totalRuns.toLocaleString("en-US")} deterministic runs; maximum work/capacity residual ${maximumResidual}. Observed means are reproduced at the reference baseline, and source extraction separately reconciles source cells, totals and SHA-256 hashes. This establishes reproducibility and internal consistency, not out-of-sample forecast accuracy.\n\n- [Source definitions and method](../docs/model-method.md)\n- [Income extraction](../docs/income-data.md)\n- [Workforce extraction](../docs/workforce-data.md)\n- [Full numerical report](scenario-report.json)\n- [Scenario trajectories](scenario-trajectories.csv)\n- [Threshold grid](threshold-grid.csv)\n`;
await writeFile(resolve(output, "analysis-report.md"), md);
console.log(
  `Analyzed ${totalRuns} runs; maximum work/capacity residual ${maximumResidual}.`,
);
