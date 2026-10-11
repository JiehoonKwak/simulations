# Continuous empirical film

One English streetscape where practice proprietors and salaried physicians share
a 2026–2036 timeline; assumptions, results, sources and an exact export live in
two drawers. Engine: `web/empirical-model.mjs`; legacy provider/individual
checks do not apply.

## Sub-features

- Continuous scene: both schematic work settings and patient/staff motion visible.
- Playback: 16 s default with endpoint hold and loop, 2× (8 s), pause, scrub.
- Assumptions: four matched comparisons, earlier presets, sliders, reset.
- Results: per-role earnings, sensitivity ranges, retention, clinical work, 2036
  earnings break-even (minimum demand growth and gain participation).
- Source disclosure and the scenario/results download.
- Narrow layout and reduced motion; portable HTML over HTTP and `file:`.

## How to get to it (user POV)

`npm run build`, `npm run dev`, open <http://127.0.0.1:8765/film.html> (the
portable build). `/` and `/cinema.html` serve the source modules. The user may
also open `artifacts/physician-futures-film.html` directly. Clicking either
building or *Evidence & results* opens results; *Assumptions* opens the controls.

## Driving it with agent-browser

Serve on a disposable port (SKILL.md). Controls are in `../scripts/`.

1. **Scene.** Confirm one continuous scene with both settings; controls name the
   two groups, with no P1–P16 picker or viewpoint tabs. Text is English and
   sparse. Two screenshots ~0.5 s apart while playing must differ, including
   within one model year.
2. **Playback.** `film-clock.js` on load shows `playing:"true"` and advancing
   time. Click `#play` to pause: time/motion freeze and two later screenshots are
   byte-identical. Select `#speed` 2, toggle `#loop` off, click `#restart`;
   after ~9.5 s expect time 10.000, motion ≈16, playing false. Loop/Play are
   buttons with `aria-pressed`, not checkboxes. Scrubbing pauses and resets the
   action phase reproducibly.
3. **Comparisons.** For each of *Less work, same care*, *More care, same
   positions*, *Fewer positions, shared gains*, *Fewer positions, unequal gains*:
   open Assumptions, `select '#preset' "<label>"`, close, `film-end-year.js`, open
   Evidence & results, `film-results.js`. Compare with `simulate()` and
   `earningsConditions()` for the same preset. Released 2036 values:
   own-role earnings 98.2/98.2, 118.2/118.2, 114.1/114.1, 114.1/95.6; break-even
   2.25% demand with participation Not reachable, 7.20% participation, 12.24% /
   34.26%, and salaried demand 30.29%. *Unequal gain sharing* shows 90.9 (72–114)
   and 74.2 (62–89) with salaried demand Not reachable. Preset changes keep the
   current year; clicking a group opens results without changing year or
   assumptions.
4. **Custom and export.** In *Fewer positions, unequal gains* set
   `#param-captureSalaried` to 0.3: scenario becomes Custom, salaried earnings
   98.7, demand threshold 26.49%, signature `bf080999`. Download with
   `download '#export-results'` and run `replay-export.mjs`; also export one named
   preset (for example *No additional change*, 27 structural runs). Reset returns
   the first comparison and keeps the year.
5. **Layout.** At 390×844 `film-layout.js` must show document width 390 and drawer
   client = scroll width with each drawer open; both buildings, signs, readouts and
   transport fit; source disclosures readable; close controls sticky.
6. **Reduced motion.** `set media light reduced-motion`, reload: startup paused at
   time 0; explicit Play advances. Reset media and viewport afterwards.
7. **Portable file.** Open `file://…/artifacts/physician-futures-film.html`: the
   clock advances, results render, and an export replays. Check `agent-browser
   errors` and console warnings on every route.

## Gotchas

- Retention is a share of original modeled positions, not a national headcount
  or an inference from the 8/16 actor slots. Patient flow is illustrative, not a
  count or queue; judge its visible response to both more and less modeled care.
- Default, reset and reference use *Less work, same care*. Break-even conditions
  target 2036 even when the scene shows an earlier year.
- Sensitivity ranges are extrema of a finite design, not confidence intervals;
  the economy dimension is not varied for *No additional change*.
- Workforce context must not be described as role weights. Observed earnings must
  say 2020; the 2026 index is an assumed relative baseline.
- Results drawer content renders only while open; read it after opening.
- A completed click or a browser download-event timeout does not establish the
  file outcome; replay the actual file.
- `file:` execution has been exercised only in headless Chromium.
- Successful clicks cannot establish motion quality; aesthetic acceptance stays
  open for user feedback (`docs/storyboard.md`).
