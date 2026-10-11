# Empirical scenarios and research outputs

The numerical layer behind the film: official-source anchors, the two-role model,
matched comparisons, earnings-maintenance conditions, finite sensitivity, the
analysis report and figures. `docs/model-method.md` owns equations and
identification, `docs/baseline-sources.md` calibration boundaries, and the
data-specific owners the exact source cells.

## Sub-features

- Source extraction: income and workforce anchors from pinned official files.
- Model contracts: observed role means, common 2026 baseline, required work vs
  retained positions, continuous compensation near zero retention.
- Analysis: central presets, four matched comparisons, 54 alternatives per
  comparison (3 task mixes × 2 rules × 3 payment offsets × 3 costs), threshold
  grids, trial transport.
- Earnings maintenance: minimum demand growth and gain participation for each
  role's own 2036 baseline, including Not reachable cases.
- Figures: matched-comparisons and earnings-maintenance (main); role-earnings and
  role-gap-thresholds (supplemental).

## How to get to it (user POV)

`npm run extract` (needs host-local `data/raw/`), `npm test`, `npm run build`,
`npm run analyze`, `npm run figures`. Users read `artifacts/analysis-report.md`,
the CSVs, `artifacts/figures/` and `artifacts/figure-captions.md`.

## Driving it with commands

1. `npm run extract`: hash checks and published-cell/margin reconciliation pass;
   `git status` shows no change to `data/processed/` unless sources changed.
   Missing files are recovered from the documented official URLs, never replaced.
2. `npm test`: all pass (37 at the 2026-10-03 release), including hand-calculated
   thresholds and invalid-structure rejection.
3. `npm run build`: the generated provenance hashes match the current processed
   inputs; the film rebuilds.
4. `npm run analyze`: reports runs and maximum work/capacity residual (13,972 runs,
   5.55e-17 at release). With an unchanged model the report and CSVs are
   byte-identical to the commit. Otherwise reconcile central presets, sensitivity,
   threshold grids and trial transport, inspecting both directions of effects.
5. Earnings-maintenance changes: replay a returned threshold through the model at
   own-role earnings 100; a slightly smaller input must miss. Cover both roles,
   capacity-limited and zero-participation cases, and the growth-only rule.
   Reconcile all four comparisons; adjacent comparisons change only demand, then
   staffing, then salaried participation.
6. `npm run figures`: inspect figures at the declared 168 mm width and the
   grayscale proofs, not only large rasters. PDF/SVG/PNG, source/report/helper/
   script/caption hashes and `manifest.json` match; plotted values match the
   current engine. Maintenance panels distinguish capacity, staffing response,
   compensation rule and unreachable regions.
7. Finish with the [film](cinema.md), including export replay.

## Gotchas

- Trial ITT effects must not be multiplied by utilization a second time. Null
  ratios and undefined counts stay null when a denominator is zero.
- Endpoint maintenance is not an all-years guarantee. Baseline means and weights
  cancel from the own-role target, so task-mix robustness cannot validate a
  chosen compensation rule. Preserve null/unreachable intervals in figures.
- The proprietor share is reconstructed from same-table means, not an observed
  eligible headcount; workforce totals are context only. Report alternatives
  without calling their extrema confidence intervals. No individual income tails,
  national Gini or causal ownership effect are identified.
- Figure regeneration rewrites PDF `CreationDate`, SVG `dc:date` and SVG element
  ids, so `git status` shows changes even when the figures are unchanged. Compare
  PNG hashes or normalize those fields; restore metadata-only diffs.
- Keep decoding labels on figures and explanatory prose in captions. Successful
  rendering is not publication acceptance.
- Stop once these boundaries are established; rerun unaffected ensembles only for
  a new failure or concern.
