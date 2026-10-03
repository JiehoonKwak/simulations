# Physician futures: empirical scenario results

Model physicians-0.2.0. Generated reproducibly by `node scripts/analyze-empirical.mjs`.

The observed anchors are 2020 adjusted annual remuneration: practice proprietors KRW 294.3 million and salaried physicians KRW 185.4 million. Their ratio is 1.587. The 2026 starting index carries this relative structure forward as an assumption.

## Central scenarios at 2036

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

11,070 deterministic runs; maximum work/capacity residual 5.551115123125783e-17. Observed means are reproduced at the reference baseline, and source extraction separately reconciles source cells, totals and SHA-256 hashes. This establishes reproducibility and internal consistency, not out-of-sample forecast accuracy.

- [Source definitions and method](../docs/model-method.md)
- [Income extraction](../docs/income-data.md)
- [Workforce extraction](../docs/workforce-data.md)
- [Full numerical report](scenario-report.json)
- [Scenario trajectories](scenario-trajectories.csv)
- [Threshold grid](threshold-grid.csv)
