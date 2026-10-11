# Legacy motion galleries (v0.1)

Two preserved galleries of visual candidates built on the synthetic v0.1 model.
The user chose their direction for the current film; these checks target the
illustrative model, not empirical plausibility.

## Sub-features

- Round one: people, city and dual views.
- Round two: neighborhood, cutaway and street viewpoints (options 4–6).
- Playback, scrubbing to 2036, view switching; portable srcdoc builds.

## How to get to it (user POV)

`npm run dev`, then `/prototypes.html` (round one) or `/prototypes-2.html` (round
two). Portable builds: `npm run build:motion` → `/motion.html`,
`npm run build:motion -- 2` → `/motion-2.html`.

## Driving it with browser controls

1. Round one: switch all three views, inspect playback and scrub to 2036. For the
   default seed 42, people and city show 118 clinically active physicians (74
   exited); the dual fully automated side has no clinical workers but keeps
   ownership income.
2. Round two: watch live camera progression after loading and after replay, not
   only range changes. Inspect mobile cutaway captions above its roof; street
   camera shortcuts preserve time.
3. Inspect 390 px and desktop layouts; keep each gallery separate from the full
   analytical explorer.

## Gotchas

- Views render in a same-origin srcdoc iframe `#stage`; script it through
  `document.querySelector('#stage').contentDocument`.
- Counts such as "118" are drawn on canvas, not in DOM text; read them from a
  screenshot.
- Street uses the first requestAnimationFrame callback to initialize timing; a
  negative frame index at start is the known clock-origin regression.
