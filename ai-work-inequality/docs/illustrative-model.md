# Physician model v0.1: mechanisms and interpretation

Status: **Legacy v0.1 reference**. Last source revision: 2026-10-03 (`151ef04`); status clarified 2026-10-08.
Preserved synthetic prototype; its 16-provider/192-person accounting and person-level outcomes do not describe the current empirical release.
Current successor: [model-method.md](model-method.md), with [project entrypoint](../README.md).

The implemented browser engine is `web/model.mjs`. It models an illustrative,
synthetic original cohort from 2026 through 2036. It is not calibrated to Korean
physician incomes, hospital counts, demographics, or AI forecasts. Monetary units
are arbitrary constant-purchasing-power units; all prices and income are real.
The source inventory is separate from these assumed numerical coefficients.

## Population and scope

There are 16 provider organizations and 192 original physicians. Eight providers
have eight physicians and eight have sixteen. Both sizes occur in both regions.
Each organization has one owner physician; its other physicians are employees.
Each organization represents a team completing a whole care episode, rather than
an individual physician personally performing every stage. Three team case mixes
have different diagnosis, treatment, and communication time weights:

| Case mix | Diagnosis/prescribing | Treatment/procedure | Communication |
|---|---:|---:|---:|
| Cognitive emphasis | .55 | .25 | .20 |
| Mixed | .40 | .40 | .20 |
| Procedural emphasis | .25 | .60 | .15 |

Skill is independently sampled in [.65,1.35); initial experience in years is sampled
from 0–30. Experience is a fixed baseline comparison label, not a direct seniority
premium. Clinical mix and setting are not real Korean marginal distributions.
The regional demand control supplies an explicit local demand mechanism; absent
that shock, region only separates patient markets. There is no intrinsic regional
skill disadvantage. Group differences may still reflect their synthetic case mix.

The original cohort stays fixed. A physician displaced this year can be retained
again by the same provider in a later year, unless that provider has closed. No
provider entry, migration, cross-provider hiring, retirement, new physician agents,
patient referral network, or individual strategic adaptation is modeled. Within
provider teams the stages are pooled, with an explicit treatment capacity cap.
A more detailed referral model is a future structural alternative, not an
implemented claim.

## Controls and time

All 13 controls alter future paths; every setting with the same seed shares the
same 2026 state. `cognitionRate`, `procedureRate`, and `communicationRate` name
**2036 additional task-automation feasibility shares relative to 2026**, not
absolute current AI ability, benchmark accuracy, or measured growth rates.
The baseline already includes whatever technology existed in 2026. Zero means
no further progress; it does not mean that AI currently has zero capability.

For elapsed fraction `u = (year−2026)/10`, define

```
path = u ^ exp(timing)
additionalCapability_i = endpoint_i × expm1(2 × path) / expm1(2)
```

`timing = −1` front-loads progress, `+1` delays it, and both reach the same endpoint.
This is an assumed finite exponential path, not an extrapolation fitted to AI
benchmark history. Fee, demand, supply, labor share and legal permission paths are
linear in `u`. Timing changes only technological progress and diffusion.

For large providers `costFactor = 1 − .7 × scaleAdvantage`; for small providers it
is 1. With any additional capability available,

```
adoption = min(1, path / (.45 + 1.8 × adoptionCost × costFactor))
```

Otherwise adoption is zero. Adoption is a deterministic diffusion response to cost,
not an investment optimization or random event. The cost difference is an explicit
assumption; with zero scale advantage both sizes use the same cost function.

## Connected care, patients and payment

Let `w_i` be the three case-mix weights and `permission = licensing × u`. Required
physician time per completed episode is

```
humanTime = Σ w_i × [1 − adoption × additionalCapability_i × (.35 + .65 × permission)]
```

Assistance can remove up to 35% of stage time while physician participation
remains required. Full removal also needs full legal permission, complete
adoption, and all three capabilities at their maximum. These are model
assumptions open to later structural sensitivity analysis.

Each original physician provides 10 abstract units of annual work capacity.
Completed care is limited by all of the following:

- Human time: `originalHeadcount × 10 / humanTime`.
- Treatment capacity: `originalHeadcount × 10 × (1 + 2 × adoption × proceduralCapability)`.
- Facility capacity: `originalHeadcount × 30`.
- This provider's allocated purchased care.

Even complete diagnostic automation cannot remove the treatment constraint. Every
completed episode requires all three stages. At zero human time the human-time
constraint is unbounded, but treatment and facility limits still apply.

Baseline purchased care is `originalHeadcount × 9.8`. An illustrative insurance
share is .6 for cognitive, .7 for mixed, and .8 for procedural case mix. Purchased
care scales by the weighted household and insurance supported-volume multipliers.
`insuranceChange` is **supported care quantity**, not an insurance budget: when
fees change, insurer spending can also change. Neither household nor insurance
inputs are a general-equilibrium income or tax-finance model.

`regionalDemandChange` multiplies non-metropolitan purchased care by
`1 + regionalDemandChange/100 × u`, independently of the metropolitan market.
Positive and negative shocks are equally available. This is an additional assumed
local demand change, not a redistribution of a fixed national patient count.

Within each region, demand is allocated to open providers using weight

```
baseVolume × currentQuality / initialQuality
currentQuality = initialQuality + (1.4 − initialQuality) × adoption × cognition
```

AI closes an assumed clinical-quality gap toward a common frontier. This rule can
help initially less skilled providers; it is not evidence that patients choose
providers this way. Relative weights sum to each region's purchased demand.
Capacity-limited unmet cases are not redistributed in the same year. Providers
closed before a year are excluded from that year's allocation; a provider that
closes during the current solvency check contributes unmet care this year.
There is no claim that the allocation is an efficient market equilibrium.

Revenue equals completed care times the common real fee multiplier. Unmet rate
means the fraction of **purchased/requested care** that was not completed. It does
not include unmet clinical need from inability to pay; a demand contraction can
lower volume without increasing this unmet-rate measure.

## Labor, ownership and solvency

Required headcount is the ceiling of `volume × humanTime / 10`, capped at the
original headcount. The owner is retained first when any clinical work remains;
employees are retained in skill order. Owner-first retention is a structural
staffing assumption, not a discovered benefit of ownership. No employee minimum
retention rate is imposed. There is no doctor required after complete automation.

Annual nonlabor costs are:

```
fixedCost = originalHeadcount × 2
variableCost = completedCare × .2
aiCost = originalHeadcount × adoption × adoptionCost × costFactor × (.7 + 1.8 × procedure)
```

Fixed facilities remain sized to the original provider even after clinical layoffs.
AI cost includes an annualized equipment/operating burden, not a separate capital
asset purchased with hidden financing. All payments to non-physician staff,
facilities, supplies and AI vendors are aggregated external-sector costs.

Starting cash reserves equal three units per original physician. For each year:

```
operatingSurplus = revenue − nonlaborCosts
laborFraction = clamp([.65 + (wageShare − .65) × u] / supplyMultiplier, 0, 1)
wages = max(requiredHeadcount × .8, max(0, operatingSurplus) × laborFraction)
profit = operatingSurplus − wages
dividends = .8 × max(0, profit)
endReserve = startReserve + profit − dividends
```

With zero required headcount, wages are zero. The .8 minimum annual pay per retained
physician is a synthetic reservation-pay assumption, not Korea's minimum wage.
Each retained physician first receives the .8 reservation-pay floor. The remaining
payroll is allocated across retained doctors using skill weights; the skill premium
shrinks as diagnostic automation advances. This preserves the individual floor even
when the aggregate minimum payroll binds. The sole owner receives all dividends
in addition to any clinical wage. Retained profits belong to the provider and are
not counted as current personal income. A nonworking owner can still receive
ownership income. Thus `employed=false` does **not** imply zero total owner income;
displaced employees have zero modeled income. No pensions, benefits, investment
returns or income from other employment are modeled.

`SupplyChange` is external physician labor competition: its multiplier changes the
labor fraction only. It does not create extra agents, additional treatment capacity,
or new medical demand. It is neither a forecast of physician headcount nor a full
labor-market clearing model.

If revenue plus existing reserves cannot cover nonlabor costs and minimum payroll,
the provider closes **before** accepting the year's care. Current volume, costs,
wages, profits and dividends then equal zero; residual cash stays on its balance
sheet. There are no severance, debt, liquidation proceeds or reopening flows.
Losses of an operating provider consume explicit reserves; dividends never finance
losses and reserves cannot become negative. Closure and clinical displacement are
separate events.

## Metrics and comparisons

- All physician and group income indices divide by the **whole initial cohort's
  mean annual income**, with 2026 mean = 100. A group need not start at 100.
- `lowerHalfIncomeIndex` follows the same individuals who were in the lowest-income
  half in 2026; it is not the current-year bottom half.
- Employment and clinical-autonomy metrics use the full original cohort denominator.
  Autonomy per retained physician is `1 − adoption × cognition × permission`; it
  is zero for a nonworking physician. The cohort average therefore combines
  employment loss and reduced discretion. It is an assumed authority proxy, not a
  validated clinical autonomy scale.
- Closure rate uses the 16 original providers. Treatment volume uses initial total
  completed care = 100. Gini includes all original physicians and their labor plus
  distributed ownership income; at all-zero income it is undefined (`null`).
- `topShare` is the share received by the current highest-income `ceil(.1 × N)`
  physicians (20 of 192 here). This finite-cohort rounding is used consistently.
  When total income is zero, this share is undefined (`null`), like Gini.
- Presets are bundles of assumptions. They do not establish causality for a single
  changed control. Change one parameter with the seed fixed for paired comparisons.

Initialization alone consumes pseudorandom draws. Future dynamics contain no random
shocks, so scenario branching cannot misalign random draws. A seed changes synthetic
skills/experience, not the future path. Signatures are deterministic checksums, not
cryptographic provenance. Matched seed comparisons examine synthetic population
composition uncertainty only; they are not forecast confidence intervals.

## Independent small examples

**Connected care.** Forty available physician hours with one hour per episode and
30 treatment slots permit 30 complete episodes. Halving physician time alone still
permits 30. Doubling treatment slots as well permits 60, bounded by 80 potential
human-time episodes. This tests a real bottleneck rather than a multiplication of
unconnected task gains.

**Money flows.** With revenue 100, external costs 40, a .5 labor share and reserve
10, wages are 30 and profit is 30. Dividends are 24; ending reserve is 16. Wage and
dividend recipients jointly receive 54, external suppliers 40, and retained cash
increases by 6: all 100 units are accounted for. With revenue 20, costs 25, reserve
10 and minimum payroll 2, wages are 2, profit −7, dividends 0 and ending reserve 3.
With reserve only 6 that same operation is insolvent and does not proceed.

## Verification and extension boundary

Run `node --test tests/model.test.mjs` from this project. Tests cover these independent
examples, shared 2026 states, a no-change counterfactual, deterministic seeds, strict
parameter validation, original-cohort conservation, individual income counterparties,
provider balances, capacity feasibility, full substitution, treatment bottlenecks,
independent payer demand, external labor competition, timing, cost-sensitive adoption,
permanent closure and the fixed initial lower half.

The runtime stops if accounting or capacity residuals exceed `1e-7` real units.
This is sufficient for this small synthetic numerical scale, not a currency-rounding
policy. Output views should only animate runs whose checks pass. The model is open
partial equilibrium: provider cash is reconciled, with household/insurer payments
and nonlabor suppliers external. It does not implement the earlier candidate's
closed-economy, government, wealth or GDP accounting claims.

First extensions should test alternative patient allocation, wage bargaining,
owner staffing and reserve rules before treating any recurring group advantage
as robust. Cross-provider referrals, geographic mobility, entry/retirement and
empirical calibration require separate mechanisms and evidence.
