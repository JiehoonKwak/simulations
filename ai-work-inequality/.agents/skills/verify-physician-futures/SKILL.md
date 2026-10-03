---
name: verify-physician-futures
description: Verify the empirical physician scenario model, source extraction, sensitivity outputs, figures, and continuous interactive film at their observable boundaries.
---

# Verify Physician Futures

Read the project README and docs/model-method.md from the project root. The current
v0.2 model anchors relative earnings to official 2020 group means. Future paths are
conditional scenarios; reproducibility does not establish forecast accuracy.

## Launch and diagnose

For scene-only changes, use the [cinematic workflow](features/cinema.md): build
with `npm run build:cinema`, start `npm run dev`, and inspect `/film.html`.
Do not rerun unchanged numerical ensembles merely for a visual edit. Use the
[empirical workflow](features/empirical.md) when source inputs, model semantics,
sensitivity analysis, figures, or their callers change.

From `ai-work-inequality`, run `npm test`, `npm run build`, and `npm run analyze`
for numerical changes; regenerate figures with `npm run figures` when their inputs
change. Run `npm run dev` and open http://127.0.0.1:8765/film.html to verify the
portable build. On failure inspect browser console and server output before editing.

## Drive and judge

Follow the feature workflow relevant to the change. Check the real interface,
not only engine return values. Use the browser controls supported by the current
session; read-only DOM inspection may compare plotted values with model state.
Preserve screenshots and concise observations in artifacts/verification.md.

The [legacy analytical explorer](features/exploration.md) and its
`node scripts/evaluate.mjs` checks apply only to the preserved v0.1 prototype.
Do not use its headcounts, provider accounting, or national-distribution labels to
validate the current two-role empirical simulator.

## Cleanup

Reset temporary viewport overrides and leave the delivered app at a useful start.
Stop only servers started for disposable testing; keep the delivery server running
when the user is about to use it. Do not delete user configuration downloads.
Regenerate the standalone HTML after final code changes. Revisit this skill when
semantics or controls change; use maintain-verification-skill for that work.
