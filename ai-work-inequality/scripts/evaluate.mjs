import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_PARAMS, PARAMS, PRESETS, simulate } from '../web/model.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const seeds = Array.from({ length: 100 }, (_, index) => index);
const metrics = ['incomeIndex', 'employmentRate', 'autonomy', 'closedRate', 'gini',
  'topShare', 'volumeIndex', 'unmetRate', 'lowerHalfIncomeIndex'];
function summarize(values) {
  const ordered = values.filter(Number.isFinite).sort((a, b) => a - b);
  const quantile = fraction => {
    if (!ordered.length) return null;
    const position = fraction * (ordered.length - 1);
    const lower = Math.floor(position);
    return ordered[lower] + (ordered[Math.ceil(position)] - ordered[lower]) * (position - lower);
  };
  return { n: ordered.length, p10: quantile(.1), median: quantile(.5), p90: quantile(.9),
    positiveShare: ordered.length ? ordered.filter(value => value > 0).length / ordered.length : null };
}

let runCount = 0;
let maxResidual = 0;
function checkedRun(params, seed) {
  const result = simulate(params, seed);
  if (!result.checks.passed) throw new Error(`Invalid model output for seed ${seed}`);
  maxResidual = Math.max(maxResidual, result.checks.maxResidual);
  runCount += 1;
  return result;
}
const references = seeds.map(seed => checkedRun(DEFAULT_PARAMS, seed));
const presetOutcomes = PRESETS.map(preset => {
  const runs = seeds.map(seed => checkedRun(preset.params, seed));
  const final = runs.map(run => run.frames.at(-1).metrics);
  const pairedDifferences = Object.fromEntries(metrics.map(metric => [metric,
    summarize(final.map((result, index) => {
      const reference = references[index].frames.at(-1).metrics[metric];
      return result[metric] === null || reference === null ? null : result[metric] - reference;
    })),
  ]));
  return { id: preset.id, label: preset.label, params: runs[0].params,
    outcomes: Object.fromEntries(metrics.map(metric => [metric, summarize(final.map(m => m[metric]))])),
    pairedDifferencesVsDefault: pairedDifferences };
});
const boundaryRuns = [];
for (const parameter of PARAMS) {
  for (const value of [parameter.min, parameter.max]) {
    const result = checkedRun({ ...DEFAULT_PARAMS, [parameter.key]: value }, 42);
    boundaryRuns.push({ key: parameter.key, value, signature: result.signature,
      final: result.frames.at(-1).metrics });
  }
}
for (const bound of ['min', 'max']) {
  const params = Object.fromEntries(PARAMS.map(parameter => [parameter.key, parameter[bound]]));
  const result = checkedRun(params, 42);
  boundaryRuns.push({ key: `all-${bound}`, signature: result.signature,
    final: result.frames.at(-1).metrics });
}
const report = {
  version: references[0].version,
  generatedAt: new Date().toISOString(),
  interpretation: 'Illustrative scenario outputs; seed variation is synthetic population variation, not a forecast confidence interval.',
  seeds, runCount, maxResidual, presetOutcomes, boundaryRuns,
};
await mkdir(resolve(project, 'artifacts'), { recursive: true });
await writeFile(resolve(project, 'artifacts/ensemble-report.json'), JSON.stringify(report, null, 2));
console.log(`Checked ${runCount} runs; maximum accounting/capacity residual ${maxResidual}`);
console.table(presetOutcomes.map(preset => ({
  scenario: preset.id,
  incomeMedian: preset.outcomes.incomeIndex.median.toFixed(1),
  employmentMedian: (preset.outcomes.employmentRate.median * 100).toFixed(1) + '%',
  closureMedian: (preset.outcomes.closedRate.median * 100).toFixed(1) + '%',
})));
