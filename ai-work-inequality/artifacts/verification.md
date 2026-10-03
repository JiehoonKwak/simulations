# Verification — 2026-10-01

## Established

- Final model: 16/16 Node tests passed, including previously failing per-person
  minimum pay and undefined zero-income concentration regressions.
- Final evaluation: 728 scenario/seed/boundary runs; maximum accounting/capacity
  residual 5.684341886080802e-14. See ensemble-report.json.
- Browser: playback advanced from 2026; paused at 2031 and stayed there across
  subsequent observations. Timeline endpoint and restart worked.
- Default versus accessible pinned comparison changed income/employment and listed
  the five changed assumptions; 100-seed paired results completed visibly.
- Direct cognition slider change at 2036 changed employment from 61.5% to 82.3%.
- Full automation showed zero clinical employment with positive owner income;
  hollow income dots remained above zero. Physician D1 selection showed a stable
  personal path and baseline experience label. Fee sensitivity table changed
  income monotonically at the displayed endpoints.
- Desktop screenshot shows the full distribution including zero income. A 390px
  viewport had document width 390 with readable stacked content. Override reset.
- Final standalone HTML served at /standalone.html executed with no console
  warnings/errors. It embeds CSS, app, and model without external dependencies.
- Scripts syntax checks and git diff whitespace checks passed.

## Unexercised boundaries

Direct file:// navigation is blocked by the browser tool's URL policy; no bypass
was attempted. The standalone artifact was verified through localhost instead.
Configuration download was clicked but the browser download-event waiter timed
out, so downloaded-file contents and import roundtrip are not claimed as verified.
No calibration against Korean microdata was performed.

## Artifacts

- physician-futures.html: final self-contained explorer
- explorer-preview.jpg: final desktop distribution at 2036
- ensemble-report.json: reproducible model checks and synthetic paired summaries

The delivery server remains at http://127.0.0.1:8765. This record demonstrates the
main route in the project verification skill; it does not certify unexercised
export/import or empirical validity.

## Motion prototype follow-up

Three views reuse the unchanged model in a separate gallery. Browser checks on
2026-10-01 established autoplay progression, endpoint scrubbing, view switching,
and pause stability (dual view stayed at2029.6). People and city endpoint labels
both reported118 working and74 exited physicians; the automated side of the dual
view reported0% working with positive average income, preserving owner income.
All three were inspected at1280×720 and390×844; viewport override reset. The
portable srcdoc gallery executed through /motion.html. Screenshots are
motion-people.jpg, motion-city.jpg, motion-duel.jpg. Source modules passed syntax
checks. Browser inspection logged two MutationObserver exceptions without a
source URL during iframe loading; prototype sources contain no MutationObserver,
and all three views rendered and controls worked. Direct file:// remains untested
through this tool. These are visual candidates awaiting user preference, not an
approved redesign or a calibration result.


## Architectural motion round two — 2026-10-02

The user favored round-one option2 and requested three more. The second gallery
preserves the first and bundles neighborhood, cutaway, and street viewpoints.
Desktop1280x720 and narrow390x844 browser inspections covered all three. Removed
occluded provider labels in the neighborhood; moved the cutaway canvas down on
narrow screens to clear its provider caption. Viewport reset after inspection.
Default neighborhood/street endpoint follows118 clinically active physicians;
automation cutaway P2 endpoint follows0 of16 and100% adoption. Timeline and scenario
controls worked in the served portable srcdoc gallery. Street camera starts near
P1–P5 and reachesP12–P16 at the desktop endpoint. Module extraction syntax checks,
build script checks, and whitespace checks passed. The unchanged model was reused.
The portable artifact is motion-prototypes-2.html; preview screenshots are
motion-neighborhood.jpg, motion-cutaway.jpg, and motion-street.jpg. Previous2 link
resolves to the preserved first gallery in both source and HTTP portable previews.

Street autoplay initially exposed a clock-origin boundary: initializing the prior
frame time with performance.now could exceed the first requestAnimationFrame
callback timestamp and produce a negative frame index. Resetting prior time to0
on start lets the first animation callback establish the clock. Rebuilt the
portable gallery and rechecked live progression after this fix.

## Integrated cinematic experience — 2026-10-02

User authorization prioritizes visual beauty and animation/video feel, integrating
the accepted architectural scenes before expanded empirical modeling. The new
portable build is physician-futures-film.html, served at /film.html; the source
entry is /cinema.html. Model and numerical calibration remain unchanged.

Browser observations at 1280x720 and 390x844:

- All three scenes are composed without clipping the hospital/room content or
  colliding with headings and transport. Both 8-person P15 and 16-person P2
  interiors fit the narrow screen. Viewport override was reset afterward.
- Clicking neighborhood P2 opened its street, then its facade opened the
  interior while retaining time 2028. A room click selected D9 and opened its
  information. The provider selector changed P2 to P15 while retaining 2036.
- The default automatic tour reached 2036/P2/interior and stopped. A separate
  playback observation crossed from neighborhood at time 3.26 into street at
  5.76. Manual scene tabs leave automatic touring. Pause held time during scene
  navigation and inspection; replay and the wordmark restarted the clock.
- At 2036, permission/P2 showed 0/16 clinical workers, 100% adoption, an operating
  provider, and D9 ownership income (income index 1283, 100% ownership income).
  Default P2 showed 10/16. Default P15 showed 6/8; setting licensing to zero
  immediately changed it to 7/8 without changing year or provider.
- Settings and information drawers work on mobile; sticky headers preserve close
  controls while scrolling. Doctor button replacement retains keyboard focus.
- Reduced-motion emulation started paused at 2026 and switched views immediately;
  explicit playback advanced the timeline. Temporary media emulation was reset.
- Browser error/warning logs were empty. The actual portable build was exercised
  via HTTP; direct file URL access remains untested by this browser tool.

Visual QA found a previous-scene strip remaining at the end of a paused
crossfade. Opaque full-size scene buffers and clipping to the art area fixed it;
the final interior frame is clean. Review also aligned the street rooftop
indicator with the shared brightness encoding. Screenshots: film-neighborhood.jpg,
film-street.jpg, and film-interior.jpg. Existing prototype galleries are preserved.
Final standalone build, source syntax/format checks, and the existing 16 numerical
regression tests passed. No new implementation-mirroring unit tests were added;
the added interaction and compositional contracts were exercised in the browser.

Subsequent user review rejected the motion quality as insufficiently dynamic.
The checks above establish functional behavior and layout, not satisfaction of
the animation/video experience. Current acceptance remains open; see the
storyboard's user-review section for the observed cause and next direction.


## Continuous film revision — 2026-10-02

Replaced the three-view tour with one fixed streetscape showing a small clinic
and large hospital interior simultaneously. The user explicitly requested no
tabs, multiple aspects in one scene, and faster progression. Old prototypes
remain; `/film.html` and the standalone film use the continuous renderer.

- At 1280x720, two initial frames retained 2026 and the same clinical headcount.
  Their observed motion/time values were 0.133s/0.083 and 1.017s/0.636. Patients
  moved visibly through the street, corridors, and lifts by more than their body
  width; workstation figures also moved. Saved flow-first-frame.jpg and
  flow-second-frame.jpg.
- Pause froze data-time at 9.936 and data-motion at 15.898. Two independently
  captured screenshots 500ms apart were byte-identical.
- At 390x844, both hospitals, their signs, readouts, and transport were visible.
  A room click selected D9/P2. Selecting P4 retained 2035 and displayed P3+P4.
- At 2x with repeat disabled, restart reached 2036 and stopped within the
  8.355-second observation interval. Motion 16.020 and time 10 confirmed the
  shorter horizon. The same clock coefficient gives 16 seconds at 1x.
- At 2036, permission/P1+P2 showed 0/24 clinical physicians, 109% care volume,
  and -23% mean income change. Patients remained while physicians disappeared.
  Demand/P3+P4 showed 9/24 physicians, 59% care volume, -94% income change,
  and visibly reduced patient flow.
- Source review checked all eight small/large same-region pairs, hit ownership,
  closure handling, repeat/pause/speed boundaries, and portable embedding.
  Patient-pool headroom was added after finding saturation at baseline; increased
  volume can now increase visible flow as well as decrease it.
- Reduced-motion emulation started paused. Media and viewport overrides were
  reset, and the final delivery tab was reloaded into default looping playback.
  Browser warning/error logs were empty. Syntax, formatting, and portable-build
  checks passed. No model rules changed; direct file URL execution is untested.

These observations verify faster visible activity and the requested single-scene
structure. Aesthetic acceptance remains open for the user's review.

## Empirical scenario release — 2026-10-03

The current film now uses `physicians-0.2.0`, with two earnings roles, an English
interface, official-source anchors and explicit future assumptions. Earlier
sections document superseded v0.1 prototypes; their numerical expectations do not
apply to this release.

### Sources, calculations and figures

- Official NHIS income extraction reproduced 67 checked cells and both pinned
  source hashes. The adjusted 2020 annual means are KRW 294,282,306.4032603 for
  proprietors and KRW 185,390,558.43601876 for salaried physicians. Reconstructed
  weights and their aggregation assumption remain explicit; no eligible role
  headcount or within-role income distribution was obtained.
- Official 2023/2024 workforce extraction reconciled institution and region margins
  and verified its raw-source hashes. The 2024 count is 109,274 institution-reported
  physicians. This is separate context, not an earnings sampling weight. The exact
  acquired NHIS edition is pinned; separate HIRA corrigendum verification remains
  unresolved and is not claimed complete.
- `npm run extract`, `npm test` (29 passed, zero failed), `npm run build`,
  `npm run analyze` and `npm run figures` completed successfully. The analysis
  contains 11,070 deterministic runs with maximum work/capacity residual
  5.551115123125783e-17. Eight primary AI studies are documented with effect units,
  study designs and transport limits; the trial-transport exercise applies ITT
  note-time effects once.
- Six central scenarios and sensitivity envelopes reproduce the saved report.
  Full scenarios vary 243 structural/economic combinations; the no-change control
  varies 27 structural alternatives. Extrema are not confidence intervals.
- Independent read-only review found no remaining actionable defects in current
  equations, endpoints, sensitivity results, report, documentation, portable
  embedding or provenance hashes. Review and regression checks confirmed bounded,
  continuous compensation near zero retention and invalid-input rejection.
- Both figures were inspected at the declared 168 mm width, in color and grayscale.
  PDF/SVG/300 dpi PNG outputs, source/input/script/report/output hashes and proof
  records agree with the final figure manifest. Captions carry methodological
  explanation; figure panels retain decoding labels and quantitative results.

### Actual portable-interface checks

The final self-contained HTML was served at `/film.html` and tested at 1280x720,
390x844 and the normal app-panel viewport. Direct `file:` execution was not tested.

- English group controls replace the P1–P16 selector. Both schematic settings,
  staff/patient movement, readouts and transport remain visible. The drawers fit
  on mobile: document width 390 px and drawer scroll/client widths both 352 px.
- At 2036, Unequal gain sharing showed proprietor earnings 90.9 (range 72–114),
  salaried earnings 74.2 (62–89), required work/retention 73, and earnings ratio
  1.95. These agree with the model and sensitivity helper. High automation showed
  work 17, care 120 and aggregate earnings 26; its per-role results were 29.8 and
  20.9. Scenario changes retained the chosen year.
- The expanded source disclosure showed the adjusted 2020 role means, the assumed
  2026 relative baseline, the separate 2024 workforce count and usable official
  source links. Neither the 8/16 actor slots nor workforce counts were presented
  as observed income weights.
- The UI export produced `physician-scenario-results.json` in Downloads at
  2026-10-02T21:50:41.553Z, signature `35669a3d`. Its 11 annual frames and full
  243-run sensitivity result exactly matched independent reruns of its parameters
  and structure. The browser's download-event observer timed out even though the
  actual file completed; file presence, contents and replay established success.
- At 2x with Loop disabled, restart advanced from 2026 to 2036 and stopped at
  time 10.000, motion 16.033, playing false. The initial observation showed time
  0.448 and motion 0.717. The speed control remained 2x / 8 seconds.
- At normal speed, pausing at 2031 froze time 5.027 and motion 8.043. A later
  screenshot was byte-identical, verifying both the clock and rendered actors
  remained fixed. `empirical-film.jpg` records that normal-viewport frame.
- Reduced-motion emulation loaded paused at 2026; explicit Play advanced the time
  control. Media and viewport overrides were reset. Browser warning/error logs
  were empty. The delivery tab was left at the default 1x speed with Loop and
  playback enabled.

The reusable verification skill and feature map now distinguish this empirical
model from legacy prototypes. These checks establish source reconstruction,
internal consistency, reproducibility, figure rendering and observed UI behavior.
They do not establish out-of-sample national income or employment forecast accuracy.
