# Feature map

- [Empirical scenarios](empirical.md): official-source extraction, group earnings,
  explicit future assumptions, finite sensitivity ranges, figures and replay.
- [Cinematic exploration](cinema.md): an English streetscape with two physician
  groups, continuous motion, sparse controls, source disclosure and results.
- [Legacy interactive exploration](exploration.md): the preserved v0.1 model's
  physician identities, paired comparisons and accounting. Not current behavior.

Legacy motion candidates: open `/prototypes.html` or the built `/motion.html`, switch all
three views, inspect playback and scrub to2036. Confirm people/city show118
clinically active physicians for the default seed42, while the dual fully automated
side has no clinical workers but retains ownership income. These checks target the
current illustrative model, not empirical plausibility. Inspect390px and desktop
layouts and keep the gallery separate from the full analytical explorer.

Architectural round two: `/prototypes-2.html` and built `/motion-2.html` hold
options4–6 (neighborhood, cutaway, street). Watch live camera progression after
loading and after replay, not only range changes. Street uses the first RAF
callback to initialize timing. Inspect mobile cutaway captions above its roof;
check street camera shortcuts preserve time. Build with `npm run build:motion -- 2`.
