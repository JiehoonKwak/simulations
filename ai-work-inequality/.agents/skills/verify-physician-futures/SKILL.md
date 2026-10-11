---
name: verify-physician-futures
description: Verify the Physician futures project (simulations/ai-work-inequality) at its observable boundaries — official-source extraction, the empirical two-role scenario model, sensitivity and earnings-maintenance outputs, figures, and the continuous interactive film including its scenario export. Use after changing any of these or when a reported result looks wrong.
---

# Verify Physician Futures

Read the project README and `docs/model-method.md` first. The current
`physicians-0.2.0` model anchors relative earnings to official 2020 role means.
Future paths are conditional scenarios; reproducibility does not establish
forecast accuracy. All commands run from `ai-work-inequality/`; the
[feature map](features/README.md) holds per-feature recipes.

## Launch and doctor

Read-only doctor: `node --version` (22+), `uv --version`, `git status --short .`,
`ls data/raw/income data/raw/workforce` (ignored, host-local official downloads;
absent on a fresh checkout), and `lsof -iTCP:8765 -sTCP:LISTEN` (the user's
delivery server may already be running there).

Known state in one step: `npm run build && PORT=8799 node scripts/serve.mjs`
for a disposable server that leaves the delivery port alone. `npm run build`
regenerates the portable film from committed processed inputs, so the served
`/film.html` matches the source. Known inputs are the committed
`data/processed/*.json` and the named presets in `web/comparisons.mjs` and
`web/empirical-model.mjs`; *Reset assumptions* returns the film to the first
matched comparison. `npm run extract` needs `data/raw/`; its missing-input errors
name the official download URLs.

Routes on that server: `/film.html` (portable film), `/` or `/cinema.html`
(film source), `/explorer.html` and `/standalone.html` (legacy v0.1), and the
legacy galleries `/prototypes.html`, `/motion.html`, `/prototypes-2.html`,
`/motion-2.html`. On failure read the browser errors and server output before
editing.

## Drive

Follow the feature file for the change: scene-only edits need only the
[film](features/cinema.md); source, model, sensitivity, figure or caller changes
need the [empirical workflow](features/empirical.md) and then the film. Do not
rerun unchanged numerical ensembles for a visual edit.

Drive the real interface, not only engine return values. With agent-browser use
a named session (`AGENT_BROWSER_SESSION=verify-physician-futures`). Controls in
`scripts/` (paths below are relative to this skill directory):

- `agent-browser eval --stdin < scripts/film-clock.js` — time, motion, playing,
  loop, speed and year of the film clock.
- `scripts/film-end-year.js` — scrub to 2036 (`fill` on the range does not land
  on the endpoint); `scripts/film-results.js` — scenario, readouts, per-role
  results, break-even text and signature (open *Evidence & results* first);
  `scripts/film-layout.js` — viewport, document and drawer widths.
- `agent-browser download '#export-results' <scratch>/x.json`, then
  `node .agents/skills/verify-physician-futures/scripts/replay-export.mjs <file>`
  from the project root. It reruns the file's params and structure and prints
  one JSON line naming any failed field (signature, frames, model checks,
  sensitivity, earnings conditions, input hashes, scenario and comparison
  identity); exit 1 on mismatch. Downloading to a scratch path avoids
  `~/Downloads` residue and the download-event timeout seen in earlier runs.

The [legacy explorer](features/exploration.md) and
[legacy motion galleries](features/legacy-motion.md) apply only to the preserved
v0.1 prototypes. Never use their headcounts, provider accounting or
national-distribution labels to validate the current two-role simulator.

## Evidence

Judge each layer against a reference that the layer did not produce:

- **Source anchors:** the official raw cells. `npm run extract` checks pinned
  SHA-256 hashes and reconciles published cells and margins; `docs/income-data.md`
  and `docs/workforce-data.md` own the exact cells.
- **Model arithmetic:** hand-calculated cases in `tests/*.test.mjs` and the
  equations in `docs/model-method.md`. Threshold replay through the same engine
  shows consistency, not correctness; a semantic change needs a new hand-derived
  case.
- **Released numbers:** the user-reviewed values recorded in
  `artifacts/verification.md` and the committed outputs. After `npm run build`
  and `npm run analyze`, an unchanged model must leave `git status` clean.
- **Film and export:** the engine is the reference for what the DOM and the
  downloaded file show (`replay-export.mjs`); motion and aesthetics are judged by
  observation and stay open for user review.

Before trusting a rejection, confirm the forced failure took effect: alter a
copy of an export (one frame value or the scenario label), check the copy
differs, and require `replay-export.mjs` to fail on it. Paused-frame screenshot
identity means something only if two playing frames differ.

Record source reconciliation, calculation checks, observed UI results and
remaining identification limits separately in `artifacts/verification.md`, with
a screenshot when the interface changed.

## Cleanup

Close the agent-browser session, stop only the disposable server, and reset
viewport and media emulation. Restore regenerated files whose only change is
metadata (figure dates and SVG ids, `ensemble-report.json` `generatedAt`) with
`git checkout --`. Keep exports and screenshots used as evidence in a named
scratch or `artifacts/` location. Do not delete the user's own downloads. Leave
a delivery server the user is about to use running at normal speed with Loop
and playback on. Use maintain-verification-skill when semantics or controls
change.
