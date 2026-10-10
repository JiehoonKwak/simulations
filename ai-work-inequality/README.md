# Physician futures

An evidence-anchored exploration of how AI, care demand and distribution rules
could change physician work and earnings in Korea. The current experience is a
continuous English animation comparing **practice proprietors** and **salaried
physicians**, with assumptions, source evidence and sensitivity results in drawers.

The scope excludes individual career-strategy recommendations and does not
presume a winning group.

The empirical anchors are official 2020 adjusted physician remuneration means.
Official 2023/2024 workforce and utilization tables provide separate context.
Twelve primary studies inform mechanisms and a trial-transport check, including
four Korean workflow, consultation-time and fee-policy sources. The September
2026 official release adds a 2023 overall earnings mean as separate context;
matched role means remain anchored to the verified 2020 table.
Future 2026–2036 paths are conditional scenarios, not fitted national forecasts.

## Open and run

```sh
cd ai-work-inequality
npm run dev
```

Open <http://127.0.0.1:8765>. The two work settings remain visible while time
advances; change assumptions, pause/scrub, inspect the earnings range, or download
an exact scenario and its results. Default playback is 16 seconds with a loop.

Four matched paths isolate more care, staffing adjustment and unequal gain
sharing. The results drawer shows the minimum demand growth or gain participation
needed to maintain each role's own baseline earnings at 2036, including conditions
where that target is unreachable. Earlier presets remain available.

```sh
npm test
npm run build
npm run analyze
npm run figures
```

Node.js 22+ runs the dependency-free simulation and build. Python source extraction
and figure generation use `uv` with the committed `pyproject.toml` and `uv.lock`.

- [Portable interactive film](artifacts/physician-futures-film.html), previewed at
  <http://127.0.0.1:8765/film.html>.
- [Numerical findings and interpretation](artifacts/analysis-report.md).
- [Reproducible scenario report](artifacts/scenario-report.json),
  [matched trajectories](artifacts/comparison-trajectories.csv), and
  [earnings-maintenance curves](artifacts/earnings-maintenance-curves.csv).
- Main figures: [matched paths](artifacts/figures/matched-comparisons.pdf) and
  [earnings-maintenance conditions](artifacts/figures/earnings-maintenance.pdf).
- [Figure captions](artifacts/figure-captions.md) and editable figures under
  `artifacts/figures/`.

The portable HTML embeds its model, data anchors, sensitivity calculation,
renderer and styles. It needs no network service to calculate. The local preview
is tested separately from opening a `file:` URL.

## Reproduce the empirical inputs

`npm run extract` regenerates the processed income/workforce JSON after verifying
raw-source SHA-256 hashes. Original official downloads remain local under ignored
`data/raw/`; they are not bundled with the repository. Missing-input errors give
exact official download URLs. Source instructions are in
[income-data.md](docs/income-data.md) and [workforce-data.md](docs/workforce-data.md).
`npm run build` regenerates the browser anchors from these processed files.

## Interpretation

The source supports role means, not an individual income distribution. The
proprietor weight is reconstructed from same-table means and varied in sensitivity;
it is not an observed headcount share. Two-point dispersion is conditional on
those weights. National Gini, top-decile shares and individual layoff predictions
are not estimated.

Required work and retained positions are separate. Time savings may become more
care, less work, or fewer positions. The earnings participation rule is an exposed
scenario assumption; it is not an estimated ownership effect or hospital balance
sheet. Outside earnings and passive returns after exit are outside the modeled
original practice. The animation's physician slots and patient movement are
schematic, not sampled people or a queue model.

The main analysis targets each role's original-member earnings at the endpoint.
It compares two compensation rules and 54 task-mix/payment/cost alternatives per
matched path. Preserving positions while expanding care maintains earnings in
every tested alternative; staffing adjustment is sensitive to the compensation
rule. This finite-design result is conditional on its stated assumptions, without
an assigned probability. See the numerical report for thresholds and boundaries.

## Project owners

- [Current model, units and identification](docs/model-method.md)
- [Source inventory and calibration map](docs/baseline-sources.md)
- [Research evidence](docs/evidence.md)
- [Interface and accepted direction](docs/storyboard.md)
- [Verification workflow](.agents/skills/verify-physician-futures/SKILL.md)

## Earlier prototypes

The earlier synthetic v0.1 analytical explorer remains at `/explorer.html`
(source `/index.html`), with `npm run build:legacy` producing
`artifacts/physician-futures.html`. Its 192-person model and arbitrary accounting
rules are documented in [illustrative-model.md](docs/illustrative-model.md).
It is preserved as an earlier prototype, not the current empirical simulator.

The two galleries remain at `/prototypes.html` and `/prototypes-2.html`, with
portable builds from `npm run build:motion` and `npm run build:motion -- 2`.
The user preferred architectural scenes, then requested one continuous view,
faster visible action, English text and meaningful grouping. The current film
follows that direction.
