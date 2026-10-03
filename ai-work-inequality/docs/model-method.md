# Physician futures v0.2: empirical anchors and conditional mechanisms

The current engine is `web/empirical-model.mjs`, used by the English continuous
film. It asks how additional AI deployment, care demand, capacity and distribution
rules change physician work and remuneration over a 2026–2036 scenario horizon.
It is a deterministic partial-equilibrium scenario model. The baseline earnings
means are empirical; future responses are explicit assumptions, not fitted
employment or income forecasts.

The earlier 16-provider, 192-person engine remains in `web/model.mjs` for the
historical prototypes. Its rules are documented in [illustrative-model.md](illustrative-model.md).
It is not the empirical engine.

## Target and observation process

The two modeled groups are practice proprietors (개원의) and salaried physicians
(봉직의). The target outcomes are:

- Required physician work relative to the original work budget.
- Positions retained in the original modeled practice, under a specified
  adjustment rule; this is not national employment or unemployment.
- Remuneration per original group member, including reduced/zero earnings in
  that practice, and the proprietor/salaried mean ratio.
- A weighted average of within-role care indices, not a national visit count.

The income source is the NHIS 2022 physician workforce workbook, Sheet 15's 2020
national row: CV7, CW7 and CX7. It records administrative monthly remuneration
annualized by multiplying by 12. Eligibility is full-time work (at least 40 hours
per week), with interns/residents excluded. Proprietor remuneration is business
income of the workplace excluding rental income; employee remuneration is labor
income of the workplace including tax and social contributions. These means use
records with valid remuneration. Both tails are winsorized at the 1st/99th percentiles.
The cutoff population is not documented in the retrieved excerpt.

| Observed anchor                | 2020 annualized nominal KRW |
| ------------------------------ | --------------------------: |
| Practice proprietor mean       |         294,282,306.4032603 |
| Salaried physician mean        |        185,390,558.43601876 |
| Overall mean in the same table |        230,699,494.09856516 |

The observed role-mean ratio is 1.587364. No within-role distribution is fitted.
All absolute currency values shown in the interface are these 2020 anchors.
The 2026 starting index carries their relative structure forward as a persistence
assumption; it is not an observed 2026 income estimate or an inflation-adjusted
2026 salary. Future displays use real indices.

The September 29, 2026 MOHW release reports a 2023 overall mean of KRW 285,182,871.
The retrieved attachments do not provide matched role means or eligible role
counts; detailed tables were announced for later release. This newer value is
recorded as context, without replacing or rescaling the verified role anchors.

### Reconstructed weights and incompatible margins

The same-table mixture is reconstructed as

```text
w_proprietor = (overall_mean − salaried_mean) / (proprietor_mean − salaried_mean)
             = 0.41609154512036045
w_salaried   = 1 − w_proprietor
```

This reproduces the overall mean exactly but does not verify the eligibility
counts or aggregation code. It assumes the three means describe one common
population partitioned exhaustively into the two roles. The source includes
public-health/military physicians in the remuneration notes but classifies them
as `other` in a separate all-worker headcount table. The weights are therefore
**reconstructed modeling weights**, not observed national workforce shares.
Sensitivity uses proprietor weights 0.35, 0.41609 and 0.50. Role mean ratios do not
need those weights.

The 2024 NHIS/HIRA tables separately report 109,274 physicians, including 54,989
clinic physicians. Their provider/region/qualification margins are context;
they do not calibrate the income sample's role proportions. Inpatient days,
outpatient visit-days, insurer payments and provider income are kept distinct.
The 2023–2024 training-category disruption is not extrapolated as a routine
supply trend or attributed to AI. The HIRA corrigendum was not acquired, so its
applicability remains unverified; the acquired NHIS files and exact hashes are
identified in [workforce-data.md](workforce-data.md).

[Income definitions, source cells and mismatched tables](income-data.md) and
[workforce extraction](workforce-data.md) own the full data provenance.

## What clinical research contributes

Twelve selected primary studies are recorded in
`data/processed/ai-evidence.json`. They inform the mechanisms and plausibility
checks, not fitted Korean 2036 coefficients:

- Ambient documentation randomized trials show task-specific improvements and
  a near-null arm. Their intention-to-treat effects must not be multiplied by
  observed encounter use a second time.
- Diagnostic/management experiments include no net time improvement and more
  time spent alongside better quality. Negative net time savings are allowed.
- Pre-consultation AI and multicenter documentation work show why task savings,
  realized throughput and the entire patient journey are different outcomes.
- Mammography reading and ex-vivo surgical autonomy establish bounded task
  precedents, not whole-episode physician replacement or a licensing date.
- Two Korean ED studies support a narrow note-drafting benefit, but share a site
  and system lineage. A virtual-EHR experiment and a small voluntary deployment
  with recalled times do not identify whole-day savings, visits or earnings.
- Korean consultation-time and fee-policy studies constrain interpretation:
  allocated/ideal times are not measured task shares, and a changed Saturday
  visit/billing share is not a whole-week demand or physician-wage elasticity.

Current intervention effects compare contemporary workflows. The future controls
here concern _additional_ change relative to the 2026 scenario baseline, which
already contains existing technology. Directly applying a trial estimate as an
additional 2036 effect would require a transport/adoption assumption. The
analysis includes a separate labeled trial-transport exercise, not a forecast CI.

## Work, deployment and connected capacity

Within each role, a baseline care unit requires one normalized physician-work
unit. A work budget is divided into four components:

| Component              | Central assumed share | Documentation-heavy | Hands-on-heavy |
| ---------------------- | --------------------: | ------------------: | -------------: |
| Documentation          |                   .35 |                 .50 |            .20 |
| Reasoning and planning |                   .25 |                 .20 |            .20 |
| Hands-on treatment     |                   .20 |                 .10 |            .40 |
| Patient interaction    |                   .20 |                 .20 |            .20 |

These are scenario compositions, not measured Korean time-use shares or a
specialty distribution. They sum to one. The two roles share the composition in
any one run; role-specific skill or clinical case mix is not invented.

For `u = (year − 2026) / 10`, the additional deployment path is

```text
path(u) = expm1(2 × u ^ exp(timing)) / expm1(2)
a_g(u)  = deployment_endpoint_g × path(u)
```

This is a chosen smooth path, not a fitted technological growth law. A negative
timing parameter moves deployment earlier while retaining the endpoint.
The four `s_i` parameters represent net task-time savings at full additional
deployment, after review/setup burden. Documentation, reasoning and interaction
may have negative savings. Clinical quality itself is not modeled as a time gain.

```text
h_g(u) = max(oversight_floor × [1 − licensing × u],
             sum_i task_share_i × [1 − a_g(u) × s_i])
D(u)   = 1 + demand_change × u / 100
K(u)   = 1 + other_capacity_growth × u / 100
q_g(u) = min(D(u), K(u), 1 / h_g(u))
W_g(u) = q_g(u) × h_g(u)
```

When `h=0`, the physician-time capacity is unbounded but demand and other care
capacity still bind. `K` represents non-physician staff, equipment and facilities;
it is an explicit scenario bottleneck. The oversight floor (central .20;
sensitivity 0/.20/.40) is an assumed minimum physician-time requirement, not a
statement of current Korean law. Licensing relaxation acts only on this floor.

Purchased care differs from medical need. A care shortfall means purchased care
not completed within modeled capacity, not an estimate of unmet clinical need.
No patient-market redistribution, referral network or provider quality sorting
is inferred from unobserved skill. Each role's care unit is normalized locally;
weighted aggregate indices do not add inpatient days to outpatient visits.

## Workload versus retained positions

Let `delta` be staffing response, from 0 (all original positions retained) to 1
(full adjustment to required work):

```text
r_g(u) = 1 − delta × max(0, 1 − W_g(u))
spare_work_g = r_g − W_g
```

Thus `W <= r <= 1`. The same technical savings and care output can produce
shorter workload in retained positions or fewer original positions. No invented
person is selected for dismissal and no owner-first retention rule is imposed.
The model does not identify whether adjustment occurs through layoffs,
vacancies, retirement, reduced hours, or redeployment. Entry, hiring elsewhere,
pensions and outside earnings are beyond this original-practice estimand.
Required work is an index, not a measured clinical FTE count.

## Earnings participation: an explicit scenario envelope

No retrieved source reconciles provider revenue, costs and physician
remuneration by role, so the engine does not manufacture hospital balance sheets
or dividends to a sole physician owner. It uses a bounded normalized earnings
rule to examine distribution assumptions.

Let `R = q × (1 + real_payment_change × u / 100)` be a normalized care-payment
value proxy, `c_g` the gain-participation parameter, and
`C_g = ai_cost / 100 × a_g` the cost exposure relative to baseline remuneration:

```text
E_g = max(0, min(r_g, R_g)
             + r_g × c_g × max(0, R_g − r_g)
             − C_g)
mean_remuneration_g = observed_2020_mean_g × E_g
```

`E` is remuneration per original member relative to that role's baseline.
The formula is not an estimated elasticity or a literal revenue ledger. Adverse
payment effects transmit fully; participation applies to positive payment value
above retained baseline compensation. Retained original positions retain their
original proportional participation rights. Departing positions' claims do not
all accumulate in the last survivor. This gives a continuous zero-position
limit and bounds per-retained-position compensation rather than creating a
singularity near complete automation.

Gain participation can include compensation redistribution after staffing
adjustment; it is not exclusively newly created productivity. Equal participation
is the default for both roles. Contrasting scenarios impose different values to
show their consequences; the model does not discover a causal ownership premium.
The scalar cost exposure is not an observed vendor price. After complete exit,
modeled earnings in the original practice end; passive capital returns,
liquidation proceeds and earnings elsewhere are not estimated. The source cannot
separate a proprietor's clinical wage from business returns.

### Own-role earnings maintenance

`web/earnings-conditions.mjs` asks which single-input changes reach `E=1` at
2036, holding the remaining scenario inputs fixed. This is an endpoint condition,
not a guarantee for every intervening year. For fixed care and retained share,
write `B=min(r,R)` and `A=r×max(0,R−r)`. Minimum gain participation is

```text
c_min = (1 + C − B) / A
```

If `B−C >= 1`, no positive participation is needed. Otherwise `A=0` or a required
share above one makes maintenance unreachable through participation alone.
Minimum demand is solved over the interface's −60% to +100% growth range,
recomputing care and retained positions at each candidate. Both physician-time
and other-care capacity still bind. Unreachable results retain a null threshold
and the maximum attainable earnings; they are not plotted at an arbitrary ceiling.

The rule implies `E <= max(0,R−C)`, so maintenance requires `R >= 1+C`.
At `R=1`, its maximum is `max(0,1−(1−r)^2−C)`: a positive cost or position
reduction prevents preservation of original-group earnings. With all positions
retained, unchanged real payment and positive participation, minimum care is
`1+C/c`, if capacity permits. Observed role means and population weights cancel
from these own-role index thresholds.

The analysis also evaluates a **growth-only** rule:

```text
E_growth = max(0, min(r,R) + r×c×max(0,R−1) − C)
```

It preserves the original-member estimand, payment-loss branch, cost and
zero-position limit, but shares only payment growth above the original baseline.
The two rules coincide when all positions remain; growth-only earnings cannot
exceed retained-rights earnings. Neither rule is estimated from Korean contracts.
The interface uses retained-rights; the report and figures expose both rules.

### Four matched comparisons

`web/comparisons.mjs` provides four primary paths with common hypothetical
technology (2036 human time per care unit 0.73), deployment, payment, AI cost and
other capacity. They change demand, then staffing, then salaried participation:

| Path                           | Demand growth | Staffing response | Proprietor / salaried participation |
| ------------------------------ | ------------: | ----------------: | ----------------------------------: |
| Less work, same care           |            0% |                 0 |                           80% / 80% |
| More care, same positions      |           25% |                 0 |                           80% / 80% |
| Fewer positions, shared gains  |           25% |                 1 |                           80% / 80% |
| Fewer positions, unequal gains |           25% |                 1 |                           80% / 20% |

All use +40% other capacity, unchanged real payment and 2% AI cost at full
additional deployment (90% realized deployment gives a 1.8% endpoint cost).
These contrasts isolate imposed mechanisms; their labels do not predict which
future will occur. The earlier six presets remain additional explorations.

## Metrics and depiction

- Main work/care indices are weighted averages of within-role indices. All
  groups start at 100. The main earnings index divides weighted remuneration by
  that run's weighted initial mean; group charts rebase each role to 100.
- The role earnings ratio compares remuneration per original member. If salaried
  remuneration is zero, the finite ratio is undefined, not zero.
- Two-point Gini uses the role means and reconstructed weights. It is a
  between-role dispersion measure; its lower-bound interpretation requires a
  compatible nonnegative eligible earnings population. It is not an observed
  individual or national physician Gini. Top-decile share and individual
  lower-half trajectories were removed from the empirical presentation.
- Eight/sixteen drawing slots are illustrative positions in two schematic work
  settings. Fractional opacity follows retained-position share; activity follows
  work per retained position. The glyph counts are not population weights,
  provider counts, or sampled physicians. Patients depict care flow, not a queue
  or estimated waiting times. The buildings do not assert that all proprietors
  work in clinics or all salaried physicians in large hospitals.

## Sensitivity and verification

`web/sensitivity.mjs` and `scripts/analyze-empirical.mjs` define one shared design:
three task compositions × three oversight floors × three role weights ×
−10/0/+10 percentage-point offsets in real payment × the same offsets in
purchased care. This is 243 alternatives per active scenario. UI parameter bounds
clip offsets at extreme controls. The no-change preset varies only structure,
keeping all technology/economic change at zero. Envelopes are full finite-design
ranges, not probabilities or confidence intervals.

The analysis also varies every interface parameter individually, maps demand ×
salaried participation under three staffing responses, and tests task-composition
robustness of gap direction. A separate trial-transport exercise applies each
ambient-scribe study arm's estimate and CI endpoints once under assumed
20/35/50% documentation shares. Study uncertainty and future scenario uncertainty
are not pooled.

Earnings-maintenance analysis crosses three task mixes, both earnings rules,
real-payment offsets of −10/0/+10 percentage points and AI cost assumptions of
0/2/5%: 54 alternatives per matched path. Role weights and currency anchors are
omitted because they cancel from the target. These finite alternatives have no
empirical probability interpretation. Threshold curves additionally cross two
other-capacity limits (+20/+40%) and staffing responses 0/.5/1. Gap-direction
robustness under task shares alone is weak evidence: with common technology and
costs, its direction is already set by the chosen role participation difference.

Source scripts verify original SHA-256 hashes, source cells and aggregate
reconciliations. Model tests check observed mean reproduction, common baseline,
no-change paths, independent work/capacity and earnings examples, staffing/care
separation, invalid inputs, near-zero behavior and exported configuration replay.
The runtime rejects a work/capacity inconsistency above `1e-8`. Tests and
sensitivity establish implementation consistency, not external forecast validity.

The supported scientific conclusion is conditional: whether gains become more
care, less work, fewer positions or unequal remuneration depends on demand,
capacity, staffing and participation assumptions. Future adoption, wages,
within-role polarization and national employment remain unidentified by these
aggregate inputs.
