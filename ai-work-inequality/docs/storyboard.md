# Physician futures interface

The current interface is `web/cinema.html`, driven by `web/empirical-model.mjs`.
It is delivered at `/` and as the portable `/film.html`. It uses English and
keeps the scene visible; conditions, quantitative results and sources live in
optional drawers.

## Accepted direction

The initial analytical display used dense text and individual income dots. The
user preferred the architectural prototype, accepted the neighborhood/interior/
street direction, then requested quicker motion and all aspects in one continuous
scene. They explicitly removed viewpoint tabs. After reviewing that animation,
they authorized empirical development, minimal English artifact text and grouping
instead of the P1–P16 provider selector. These choices govern the current design.

## Main experience

Two schematic work settings compare **Practice proprietors** and **Salaried
physicians**. Both remain visible. There is no institution picker or person-level
story. Internal P1/P2 identifiers never appear as categories. Eight/sixteen
physician glyphs are drawing slots; neither their count nor the building size is
an observed group weight or a claim about clinic/hospital ownership.

- Required physician work, normalized care and real earnings are scenario indices.
  Main indices begin at 100; group income charts use each role's own baseline100.
- Patient routes show entry, care stations, lifts and exit. Flow density follows
  each role's care index. They are illustrative trajectories, not estimated
  waiting times or individual patient simulations.
- Physician presence follows fractional retained-position share. Work activity
  depends on required work per retained position; less work need not remove
  physicians. Equipment brightness encodes additional AI deployment.
- Playback covers2026–2036 in16seconds, holds2036 for1.5seconds, and loops by
  default. 0.5× and2× change both time and action speed. Pause freezes both;
  scrubbing sets a reproducible action phase. Hidden-tab time does not jump.
- Reduced-motion preference starts paused and suppresses incidental movement.
  Explicit playback may still advance annual model states.

## Assumptions and quantitative reading

The assumptions drawer provides four matched comparisons, six additional presets
and 15 controls. The primary paths sequentially change demand, staffing response
and salaried gain participation while preserving the other inputs. The default,
reset and dashed reference use **Less work, same care**. The compact scenario
name also opens this drawer. The
primary controls address documentation, care demand, payment, staffing response
and salaried gain participation. Further task/deployment/capacity/distribution
conditions remain in a disclosure. Changing a control recomputes the same
observed anchors, preserves year and pauses playback.

Clicking a group, building or drawing slot opens group results. Results include
role earnings paths, required work, retained positions, the role earnings ratio
and conditional between-role dispersion. The app does not report an observed
national Gini, individual layoffs or simulated hospital closures.

A collapsed **2036 earnings break-even** section shows each role's minimum demand
growth and gain participation to reach its own original-member earnings index 100.
Each calculation changes one control while holding the others fixed. Demand
thresholds include staffing feedback and capacity limits. **Not reachable** means
the target cannot be reached through that control under the remaining inputs.
The interface uses the retained-rights rule; the report compares growth-only
sharing separately. Thresholds always concern 2036, even when playback shows an
earlier year, and do not promise maintenance throughout the intervening years.

Sensitivity bands and ranges use the same `web/sensitivity.mjs` design as the
research report:243 finite alternatives for active/custom scenarios,27 structural
alternatives for the no-change control. Bands show minima/maxima, not confidence
intervals. The default comparison remains dashed. Method/source disclosures
identify the2020 earnings anchor, reconstructed weights, separate2024 workforce
context and future assumptions. JSON export includes parameters, structure,
source hashes, frames, current/default scenario identities, endpoint earnings
conditions and sensitivity design/results. The source disclosure includes the
new 2026 MOHW release as context and all 12 selected primary-study links.

## Build and visual verification

The standalone builder embeds the baseline, model, sensitivity and earnings-condition
helpers, matched comparisons, renderer
and styles. Direct file opening requires no network calculation service; source
links are optional outbound references. Browser verification must inspect the
exact built HTML at desktop and narrow viewports, not only the source page.

Keep titles and decoding text sparse. Verify real motion, pause, endpoint,
scenario change, shaded ranges, source disclosure and downloaded reproduction.
Save the reviewed screenshots and provenance in `artifacts/verification.md`.
The user has accepted the continuous direction; later aesthetic claims still
require inspecting the current render.

## Historical artifacts

The old analytical explorer remains at `/explorer.html`. Prototype galleries are
`/prototypes.html` and `/prototypes-2.html`. The old three-camera modules remain
unused by the current continuous renderer. These artifacts preserve the design
exploration and synthetic model; they are not current empirical result views.
