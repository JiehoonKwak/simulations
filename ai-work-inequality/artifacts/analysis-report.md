# Physician futures: empirical scenario results

Model physicians-0.2.0. Generated reproducibly by `node scripts/analyze-empirical.mjs`.

The observed anchors are 2020 adjusted annual remuneration: practice proprietors KRW 294.3 million and salaried physicians KRW 185.4 million. Their ratio is 1.587. The 2026 starting index carries this relative structure forward as an assumption.

## Matched comparisons and earnings maintenance

The primary question is which conditions preserve each role's mean real remuneration in its original practice at 2036 (own 2026 index = 100). These thresholds do not guarantee earnings at every intervening year. All four paths share the same hypothetical technology, payment rate, AI cost, capacity and deployment: only purchased-care demand, staffing response and gain participation change in sequence. The common endpoint requires 0.73 physician-work units per care unit, a chosen broad-workflow scenario, not a measured Korean whole-day effect.

| Matched path | Proprietor earnings | Salaried earnings | Work | Positions retained | Care |
|---|---:|---:|---:|---:|---:|
| Less work, same care | 98.2 | 98.2 | 73.0 | 100.0% | 100.0 |
| More care, same positions | 118.2 | 118.2 | 91.3 | 100.0% | 125.0 |
| Fewer positions, shared gains | 114.1 | 114.1 | 91.3 | 91.3% | 125.0 |
| Fewer positions, unequal gains | 114.1 | 95.6 | 91.3 | 91.3% | 125.0 |

Flat demand leaves no additional payment value while the assumed AI cost remains. Expanding care raises earnings when positions are retained and gains participate in remuneration. Staffing adjustment reduces the original-group income base; lowering only salaried participation then changes its earnings without changing care, technology or workload. The contrast isolates an imposed distribution rule, not an estimated causal ownership effect.

### Conditions that can be acted on in the simulator

Each threshold changes one input, holding the other inputs fixed. Minimum demand includes staffing adjustment along the demand path and respects both physician-time and other-care capacity. Minimum participation holds current demand and retained positions fixed. Not reachable means no allowed value of that input preserves the original-group mean under the remaining conditions.

| Path | Group | Minimum demand growth | Minimum participation | Alternative-rule minimum demand | Alternative-rule minimum participation |
|---|---|---:|---:|---:|---:|
| Less work, same care | Practice proprietors | 2.25% | Not reachable | 2.25% | Not reachable |
| Less work, same care | Salaried physicians | 2.25% | Not reachable | 2.25% | Not reachable |
| More care, same positions | Practice proprietors | 2.25% | 7.20% | 2.25% | 7.20% |
| More care, same positions | Salaried physicians | 2.25% | 7.20% | 2.25% | 7.20% |
| Fewer positions, shared gains | Practice proprietors | 12.24% | 34.26% | 20.12% | 46.25% |
| Fewer positions, shared gains | Salaried physicians | 12.24% | 34.26% | 20.12% | 46.25% |
| Fewer positions, unequal gains | Practice proprietors | 12.24% | 34.26% | 20.12% | 46.25% |
| Fewer positions, unequal gains | Salaried physicians | 30.29% | 34.26% | 31.25% | 46.25% |

The retained-rights rule shares positive payment value above retained baseline compensation. The paired growth-only rule shares only payment growth above the original compensation baseline. The alternative preserves the estimand, loss branch, cost and zero-position limit but excludes redistribution of departed positions' baseline claims. Neither rule is fitted to Korean compensation contracts. A result surviving task-mix variation alone is not automatically robust to this rule change.

### What follows from the equations

For retained share r, payment value R and cost C, maintenance requires R >= 1 + C. Under the central rule, maximum earnings at R=1 are max(0, 1-(1-r)^2-C); position reduction or a positive cost therefore prevents maintenance at unchanged payment value. With all positions retained, unchanged real payment and positive participation c, minimum care is 1+C/c, provided demand and care capacity can reach it. Baseline role means and reconstructed population weights cancel from these own-role index thresholds. These are mathematical implications of the stated model, not additional observations.

### Structural and economic sensitivity

Each matched path is checked under 54 alternatives: three task mixes, two earnings rules, three real-payment offsets (-10/0/+10 percentage points), and three AI cost assumptions (0/2/5% of baseline remuneration at full deployment). The following ranges describe this finite design only; no probabilities are assigned.

| Path | Group | Earnings range | Maintained in every tested alternative | Demand threshold range when reachable | Unreachable demand cases |
|---|---|---:|---|---:|---:|
| Less work, same care | Practice proprietors | 85.5–108.0 | No | -9.1–17.4% | 0/54 |
| Less work, same care | Salaried physicians | 85.5–108.0 | No | -9.1–17.4% | 0/54 |
| More care, same positions | Practice proprietors | 105.5–130.0 | Yes | -9.1–17.4% | 0/54 |
| More care, same positions | Salaried physicians | 105.5–130.0 | Yes | -9.1–17.4% | 0/54 |
| Fewer positions, shared gains | Practice proprietors | 90.3–129.0 | No | 1.5–31.9% | 0/54 |
| Fewer positions, shared gains | Salaried physicians | 90.3–129.0 | No | 1.5–31.9% | 0/54 |
| Fewer positions, unequal gains | Practice proprietors | 90.3–129.0 | No | 1.5–31.9% | 0/54 |
| Fewer positions, unequal gains | Salaried physicians | 83.8–105.7 | No | 18.7–39.5% | 6/54 |

The demand-threshold curves additionally cross two other-capacity ceilings (+20/+40%), three staffing responses and three task mixes with both compensation rules. Unattainable points remain null rather than being plotted at an artificial maximum. Existing full-range one-at-a-time results depend on the chosen parameter ranges: a zero staffing effect in the assistive reference reflects no workload slack; endpoint timing is invariant by construction. They are not empirical rankings of importance.

### Evidence that changes interpretation

The verified Korean ED studies support a selected note-drafting benefit, including physician review. One uses a virtual EHR with preloaded drafts; the other is a small voluntary implementation with recalled writing times. They share an institutional/system lineage and do not establish whole-day time savings, completed visits or wage response. Korean rheumatology survey times are allocated or perceived ideal times, not measured task fractions. Korean fee-policy evidence distinguishes redistributed Saturday visits and billings from total demand or physician remuneration. Consequently, task shares, output conversion, staffing and gain participation remain sensitivity axes rather than silently fitted coefficients. See [the primary-source evidence ledger](../docs/evidence.md).

The September 29, 2026 official release provides a 2023 overall remuneration mean but no retrieved matched role means or eligible role counts. It is recorded as newer context while the verified 2020 role anchors remain. The newly retrieved full report corrects valid-remuneration eligibility in the source documentation; no calibrated numerical anchor changed.

- [Matched trajectory data](comparison-trajectories.csv)
- [Earnings-maintenance curves](earnings-maintenance-curves.csv)
- [Full results, parameters, alternative rules and source hashes](scenario-report.json)

## Additional scenarios at 2036

All indices use each group's own 2026 baseline = 100. Retained positions concern the original modeled practice, not nationwide employment.

| Scenario | Proprietor earnings | Salaried earnings | Clinical work | Positions retained | Care index | Role earnings ratio |
|---|---:|---:|---:|---:|---:|---:|
| Assistive care | 101.2 | 101.2 | 100.0 | 100.0% | 105.2 | 1.587 |
| No additional change | 100.0 | 100.0 | 100.0 | 100.0% | 100.0 | 1.587 |
| Shared productivity | 118.2 | 118.2 | 91.3 | 100.0% | 125.0 | 1.587 |
| Unequal gain sharing | 90.9 | 74.2 | 73.0 | 73.0% | 100.0 | 1.946 |
| Payment and demand squeeze | 62.2 | 62.2 | 58.4 | 70.9% | 80.0 | 1.587 |
| High automation | 29.8 | 20.9 | 17.4 | 17.4% | 120.0 | 2.267 |

Equal deployment and gain participation preserve the starting role-income ratio. A larger gap in the unequal-sharing scenario follows from its distributional assumptions; it is not an estimated causal benefit of proprietorship. Time savings can raise care, reduce workload, or reduce positions depending on demand, other capacity and staffing response.

## Sensitivity design

Three task mixes × three oversight floors × three reconstructed role weights × payment offsets of −10/0/+10 percentage points × demand offsets of −10/0/+10 percentage points: 243 alternatives per active scenario. The no-change control varies only structure (27 runs), keeping technology/economic change at zero. Ranges are extrema, not confidence intervals. Task-specific effects, participation, and staffing response are also examined individually over their complete interface ranges.

The threshold grid fixes the broad-workflow technology scenario and proprietor gain participation at 0.8, then varies salaried participation, demand growth and staffing response. Its three task mixes show which gap directions depend on task composition. Grid counts have no probabilistic interpretation.

## Trial transport check

The Nabla and DAX randomized-trial note-time effects and their confidence endpoints are applied once, without multiplying their ITT effect by observed utilization again. Documentation shares of 20%, 35%, and 50% are explicit transport assumptions. The resulting work/care effects are not direct Korean observations or forecast intervals. The negative/near-null arm prevents a uniformly optimistic interpretation of documentation AI.

## Data and interpretation

Role weights are reconstructed from same-table means; eligible counts and aggregation code were not obtained. The 2024 NHIS/HIRA workforce tables provide separate institution context and are not used as earnings weights. Neither within-role income tails nor individual layoffs are observed. The model therefore reports role means/ratios and conditional two-point dispersion, not a national physician Gini, top-decile share, or person-level forecast.

The compensation envelope is a scenario rule, not a fitted behavioral elasticity or a provider balance sheet. Participation rights shrink with retained original positions; passive returns after clinical exit and earnings elsewhere are excluded. No probability is assigned to automation endpoints, licensing changes, or future staffing decisions.

## Verification and files

13,972 deterministic runs; maximum work/capacity residual 5.551115123125783e-17. Observed means are reproduced at the reference baseline, and source extraction separately reconciles source cells, totals and SHA-256 hashes. This establishes reproducibility and internal consistency, not out-of-sample forecast accuracy.

- [Source definitions and method](../docs/model-method.md)
- [Income extraction](../docs/income-data.md)
- [Workforce extraction](../docs/workforce-data.md)
- [Full numerical report](scenario-report.json)
- [Scenario trajectories](scenario-trajectories.csv)
- [Threshold grid](threshold-grid.csv)
