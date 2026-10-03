# Empirical scenarios and research outputs

Use docs/model-method.md for equations and identification, docs/baseline-sources.md
for calibration boundaries, and the data-specific owners for exact source cells.

## Source and calculation checks

- When extraction changes, run `npm run extract`. It checks raw-source hashes and
  reconciles published cells and margins. Original downloads are ignored; missing
  files must be recovered from the documented official URLs, not silently replaced.
- `npm test` checks meaningful boundary contracts in both current and legacy
  engines. The current model must reproduce its observed adjusted role means and
  common 2026 baseline, distinguish required work from retained positions, keep
  compensation continuous near zero retention, and reject invalid structures.
- `npm run build` regenerates the browser anchor and portable film. Confirm the
  current processed-input hashes agree with its generated provenance.
- `npm run analyze` regenerates the report and CSVs. Reconcile central presets,
  finite-design sensitivity, threshold grids and trial transport. Inspect both
  directions of effects; trial ITT effects must not be multiplied by utilization
  a second time. Preserve null ratios and undefined counts when a denominator is zero.

For earnings-maintenance changes, replay the returned participation/demand
threshold through the model at own-role earnings 100; a slightly smaller input
should miss the target. Check both roles, capacity-limited and zero-participation
cases, and the growth-only compensation rule. Endpoint maintenance is not an
all-years guarantee. Reconcile all four matched comparisons and the 54-alternative
design (3 task mixes × 2 rules × 3 payment offsets × 3 costs). Baseline means and weights
cancel from this own-role target; task-mix robustness alone cannot validate a
chosen compensation rule. Preserve null/unreachable intervals in figures.

## Interpretation and figures

The role share is reconstructed from same-table means under an aggregation
assumption, not an observed eligible headcount. Workforce totals are context only.
Vary role weights, task mixes and oversight floors; report economic/parameter
alternatives without calling their extrema confidence intervals. No individual
income tails, national Gini, or causal ownership effect are identified here.

Run `npm run figures` after analysis/plot changes. Inspect figures at their declared
physical size and grayscale proofs, not only large raster previews. Confirm PDF,
SVG and PNG outputs, source/report/script/output hashes, captions and figure data
match the current engine. Keep decoding labels on the figure and explanatory prose
in captions. Do not infer publication acceptance from successful rendering.

The main figures are matched-comparisons and earnings-maintenance; the earlier
role-earnings and role-gap-thresholds outputs are supplemental. Maintenance panels
must distinguish capacity, staffing response, compensation rule and unreachable
regions. Check the current report and helper hashes as well as plotted values.

Finally exercise the [actual film](cinema.md), including UI export replay. Record
source reconciliation, calculation checks, observed UI results and remaining
identification limits separately. Stop when those boundaries are established;
repeat unaffected ensembles only if a new failure or concern warrants it.
