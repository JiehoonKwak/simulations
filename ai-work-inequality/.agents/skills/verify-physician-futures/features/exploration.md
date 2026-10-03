# Interactive exploration

## Sub-features

Live parameters; playback/scrubbing; group and individual views; fixed reference;
100-population comparison; sensitivity sweep; configuration and standalone export.

## User entry

Open the localhost URL after `npm run dev`, or the built
`artifacts/physician-futures.html` directly. No account or network data is required.

## Drive with browser controls

1. Use `#reset`; the timeline starts at 2026 and all settings share this baseline.
   Click `#play`, observe a later year, click again, and verify the year remains
   unchanged during another independent interaction/observation. Scrub `#timeline`
   to its endpoint. Do not infer animation correctness from an engine test.
2. Click `#pin`; select `accessible` in `#preset`. The reference stays fixed while
   current income/employment and the list of changed assumptions update. Change
   `#param-cognitionRate` with arrow keys and observe endpoint employment change.
3. Click `#paired-run`; inspect `#paired-results` for seed 0–99, paired differences,
   and explicit distinction from forecast confidence. Change `#sweep-param` and
   inspect `#sweep-results` for correctly labeled one-parameter endpoints.
4. Select `permission`, then 2036. Clinical employment may be zero while owner
   income remains positive. Check hollow dots above zero, individual income
   paths, and group trajectories. Switch `#dimension` to experience;
   grouping uses baseline experience and must not imply a seniority mechanism.
5. Save config with `#export-config`, change a setting, and restore through
   `#import-config`. Same seed/parameters must reproduce the signature. Restore
   excludes reference and selected year. Reject malformed config without replacing
   the current simulation. Browser download/chooser support can vary; record an
   unexercised route explicitly rather than treating source inspection as E2E.
6. At desktop size inspect the whole income distribution, including zero income.
   At width 390 inspect readability and horizontal overflow, then reset viewport.
   Check the standalone build separately and inspect browser errors.

## Gotchas

- All income uses the original cohort's 2026 overall mean, including group curves.
- Minimum retained labor pay must hold per physician, not merely in aggregate.
- Exit is not zero income; owners can receive dividends without clinical work.
- Group autonomy counts clinical exits as zero. It is not conditional autonomy
  among remaining clinicians. Its label must make this denominator visible.
- Zero total income makes both Gini and top income share undefined, displayed as —.
- Supply pressure changes pay allocation, not population size. Experience is a
  baseline grouping. Regional demand has an explicit separate control.
- Synthetic seeds vary skills/ownership assignment, not all structural uncertainty.
- The current chart and the old general-industry design are not interchangeable.
