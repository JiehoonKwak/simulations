# Scope decisions and design history

## Agreed scope and pre-implementation questions (2026-10-01)

The first case focuses on physicians, licensed professionals who also perform knowledge work. The central question is **which physicians survive changes in the medical market, and who loses economic standing or leaves clinical practice**. Implementation was authorized after this discussion on 2026-10-01. The working explorer and its explicit illustrative rules are documented in [model-method.md](model-method.md).

The user's directions are:

- Center the analysis on polarization among physicians. Explore differences by hospital setting, region, individual ability, and experience, without deciding in advance which group will win.
- Treat diagnosis and prescribing together with procedures, surgery, and treatment as connected parts of care. Do not choose knowledge work or surgery alone as representative of all physicians.
- Leave room for AI capabilities to develop. Include futures in which AI can substitute beyond knowledge work, including communication, empathy, and physical procedures; do not permanently reserve any capability for humans.
- Licensing and the scope of permitted medical practice, physician supply, and reimbursement may change. Distinguish what is technically possible, what institutions permit, and what medical providers actually adopt.
- Include scenarios in which the general population's ability to pay declines. How to connect this to medical demand and insurance finances is undecided.
- Track declines in real income, employment, and clinical autonomy separately. Show practice closure and departure from clinical work as distinct outcomes rather than merging them into one survival label. The user accepted these outcome dimensions; exact measures and thresholds remain open.
- Use a ten-year horizon, **2026–2036**, including the path to the endpoint. Rapid, potentially exponential AI development is the user's reason for treating ten years as a sufficiently distant horizon. Capability-specific growth rates and functional forms have not been chosen.
- Exclude individual adaptation-strategy experiments and career advice. The purpose is to simulate the future distribution of physician outcomes, not recommend which investment, relocation, or work change an individual should choose. Aggregate adoption, hiring, and other market-response rules still need to be specified; this exclusion does not by itself freeze the market.
- Use hospital/region and ownership/employment as the main comparison axes, crossed with ability, experience, and clinical work. The user accepted this framing while explicitly requesting exploration of diverse possibilities. It does not select a preferred future or guarantee advantages for any group.

The following are proposals for discussion, not agreed rules:

- Represent judgment, communication, and procedural ability as capabilities that can develop at different rates within one patient pathway. Stages may connect through referrals; this does not mean every physician must perform every stage directly.
- Compare fast AI-development paths with delayed or stalled paths. Do not assign arrival dates or probabilities to those paths without evidence.
- Compare outcome distributions across clinical, institutional, regional, and experience groups. Group definitions, patient allocation, payment rules, and quantitative measures remain to be developed; the horizon and exclusion of individual strategy experiments are settled above.
- Distinguish patient out-of-pocket spending from insurer payments. No rule has been adopted that a decline in household purchasing power reduces demand for every type of care by the same proportion.

The general-industry design below remains a reference candidate. Its demand, wage, task, and worker-transition rules have not been adopted for the physician case and must be reconsidered against the agreed clinical and institutional scope. In particular, the proposal to exclude firm closures and entry must change if the model is to examine practice closures or new physicians entering the market. The later user instruction to build an adjustable, animated simulation superseded this earlier implementation checkpoint.

### Candidate combinations for broad exploration

The rows below are discussion sketches, not simulated results or a mutually
exclusive scenario list. Mix their conditions and examine which conclusions
change when one condition changes. Include stable or narrowing disparities as
possible outcomes alongside widening disparities.

| Conditions to explore | Question about physician outcomes |
|---|---|
| Capable, inexpensive AI available to small and large providers; physician participation still required | Does the return to individual expertise change, and can smaller or regional providers retain patients? |
| Advanced procedural automation with high equipment and integration costs | Do provider scale and ownership create advantages, and do employed physicians share the gains? |
| Broad technical capability combined with fewer mandatory physician tasks | How much physician labor remains demanded, and how do income, employment, and autonomy diverge? |
| Rapid productivity growth with falling reimbursement | Can care volume rise while physician income falls, and which providers remain viable? |
| Declining household purchasing power, with insurer funding stable or declining separately | Which care segments contract, and how do differences in payer mix affect providers? |
| Technically comparable automated care, with varying patient preference and willingness to pay for human care | Does a human-care premium persist, and how is it distributed across physicians? |

Also compare different paths to the same 2036 capability: early versus late
availability, cheap versus costly diffusion, and earlier versus later institutional
change. Do not silently treat all combinations as equally probable or independently
vary constraints that are mechanically linked. Quantitative ranges and consistent
transition rules remain to be developed from evidence and explicit assumptions.

### Next exploration checkpoint

Intent-level clarification is sufficiently developed to examine a concrete
model structure. Remaining work concerns mechanisms and evidence rather than
choosing one preferred future:

- Connect patient need, the diagnosis-to-treatment pathway, capacity constraints,
  provider choice/referral, and completed care. Allow different staff or providers
  to deliver different stages; increased diagnostic throughput must not create
  treatment capacity automatically.
- Trace payments and costs through institutions to employed and owner physicians.
  Separate provider revenue, physician labor income, and ownership income. Define
  hiring, closure, clinical exit, and a meaningful clinical-autonomy measure.
- Identify usable Korean baseline sources by setting, region, specialty, and
  employment/ownership, including payer mix and household-demand context. Keep
  observed marginals distinct from assumed joint distributions and correlations.
- Compare plausible AI-development and diffusion paths, institutional timing,
  physician supply, reimbursement, and demand rules. Preserve possible widening,
  stable, and narrowing gaps, including group ranking reversals.
- Use a small hand-worked care-and-payment example to expose consequences of
  alternative rules. Check capacity and accounts, distinguish revenue from income,
  and explain which mechanism produces each outcome before animation or scale-up.

The recommended next review artifact is a care-and-payment diagram, a bounded
baseline/source inventory, and a few contrasting worked examples. These should
make any remaining domain judgment concrete enough for useful clarification.
This records the earlier exploration checkpoint. The current implementation uses a dependency-free JavaScript engine so parameter changes and animation run directly in a standalone browser artifact; the earlier Python suggestion below is historical.

## Question and scope — earlier general-industry candidate

**Under the same improvement in AI capability, which people gain or lose real income as adoption gaps, demand for new tasks, transition delays, and ownership distributions interact?**

The goal is to compare mechanisms under stated conditions. Firm-size differences and labor-market mobility in Korea motivate the work, but this is not a model calibrated to predict the Korean economy.

The recommended v0 scope is partial equilibrium in one hypothetical industry. The proposed illustrative defaults are 200 people, 10 firms, and 40 periods. A period does not correspond to a month or a year. Check whether results persist when firm count, population size, and period count change. Do not interpret the model as representing Korea's overall GDP, unemployment rate, or welfare level.

## Minimum state and mechanisms

| Unit | State | Purpose of update rules |
|---|---|---|
| Person | Fixed ID, task skills, firm/non-employed/training status, remaining training time, cash, firm ownership share | Track the same person's path even when income rankings change. |
| Firm | Fixed ID, technology adoption state, output/price/orders, task-specific vacancies, cash, profit | Measure firm concentration by sales share; do not guarantee that initially large firms win. |
| Task | Existing automatable tasks, complementary tasks, new human tasks | The share that can be automated is not a layoff probability. |
| External sector | Purchase spending, AI service revenue, ledger of funds provided to firms | Make exogenous demand and external AI costs visible in the partial-equilibrium model. |
| Government | Revenue, transfers, balance | Taxes and transfers default to 0. Redistribution is a separate later experiment. |

Firm-level AI adoption is determined by firm-specific probabilities and costs, while realized technology is the same. Compare a scenario with different adoption probabilities by firm size against one with equal probabilities. Adoption is possible only when the firm can afford it. Initial diffusion speed is an exogenous assumption; the first version excludes feedback in which profits further accelerate diffusion.

A candidate equation for the human task time required per 1 unit of output is:

`h = r × (1 − a × s) + c / (1 + a × b) + n`

- r, c: initial human time by task, with r+c=1.
- a: adoption state (0 or 1); s: share of existing tasks automated; b: efficiency gain in complementary tasks.
- n: human task time required for new goods or services. This is separate from the automation effect.
- Total labor time required is actual output × h. Actual production is constrained after hiring and staffing by skill.
- AI service and adoption costs need not be 0. The model does not force productivity or profit to rise.

Both substitution in existing tasks and complementarity in existing tasks can reduce labor time per unit. Complementarity does not necessarily increase employment. The question is whether additional orders from lower prices and demand for new tasks offset that reduction.

Attach new tasks only to new orders backed by demand and willingness to pay. Do not create jobs by merely adding n to existing orders.

## Demand and wage rules to settle before implementation

The recommended first experiment is partial equilibrium with industry orders from external customers and firm-level price competition.

1. Firms use information from the previous period to set prices and target output.
2. Total target orders respond to a price index through elasticity ε. For example: Q*=Q0×(P/P0)^(-ε). Allocate orders across firms using price and existing customer shares. Give orders for new goods a separate exogenous path and record their payment as spending in the external sector.
3. Firms recruit workers for the tasks they need. If workers lack the required skills, they can fill vacancies only after training. When hiring fails, cap sales at producible output and record unfilled orders.
4. Settle revenue and cash using actual sales. Also settle wages, service costs, taxes, and dividends.
5. Use this period's results to determine hiring and adoption in the next period.

Demand elasticity is not an observed value. Compare illustrative grids such as ε=0, 1, and 2. Price rules and customer inertia directly affect concentration, so keep them as sensitivity dimensions. Do not describe increased spending by external customers as if it came from greater purchasing power among domestic households.

For the first wage rule, begin with a common base wage by skill. Compare a second rule in which wages adjust to labor shortages and surpluses. A model with fixed base wages cannot establish whether wages rise. Do not add bargaining power, minimum wages, and seniority pay all at once.

A firm's residual profit is what remains after actual costs. Ownership weights sum to 1 for each firm. Pay dividends only from positive profit and available cash; do not pay dividends by erasing losses. Handle cash shortages through explicit financing or reduced production, never hidden unlimited credit. Firm closure and entry are excluded from v0, which limits concentration results to a fixed set of firms.

## Comparison design

Clone initial person, firm, ownership, and task states across scenarios using the same seed. Fix random draws by (seed, period, entity ID, event type) so branching does not misalign the order of random draws across scenarios.

| Comparison | Assumption varied | Hold fixed |
|---|---|---|
| 0 Control | No AI adoption | Initial state, external order shocks, base wages |
| A Diffusion | Small-firm adoption delay: none / large | AI capability, new demand, transition delay, ownership |
| B Reallocation | Training delay: 0 / 2 / 8 periods; new-task orders: absent / present | Adoption path, technology, initial ownership |
| C Distribution | Concentrated / dispersed ownership, same total ownership | Accounting comparison with production and employment paths fixed first |

0/A/B/C are neutral labels. Do not build an automatic classifier that labels outcomes winner-takes-all after observing them. The ownership experiment deliberately changes initial conditions, so distinguish it onscreen from comparisons with identical initial conditions. If production is unchanged when only dividend ownership changes and purchasing-power feedback is excluded, that is a feature of the model structure, not an empirical discovery.

Compare one dimension at a time first, then use a small factorial design to examine interactions. Do not compare only a bundle of favorable assumptions called “optimistic” with a bundle of unfavorable assumptions called “pessimistic.”

## Outcomes and definitions of inequality

- Employment rate: employed people divided by the fixed total population. Show non-employment and training separately. Do not call this Korea's actual unemployment rate.
- Flows of hiring, job changes, and employment exits; total output; output per actual hour worked.
- Separate labor income, dividend income, and income including post-tax transfers.
- Median individual income, mean real income for the bottom 50%, and top 10% income share, with real values calculated using a common consumption-basket price index.
- Report Gini for all people and wage Gini for employed people separately; also report firm-sales HHI=Σshare².
- Do not exclude people with no income. If mean income is 0, label Gini undefined. If an extension allows negative individual income, redefine how standard Gini is interpreted.
- Distinguish changes by initial income group from changes by quantiles recalculated each period. To assess a “K-shaped” path, first examine trajectories of the initial groups.

Household composition, housing assets, pensions, foreign capital, population decline, and distinctions among non-regular workers are excluded. Do not call the distribution of individual dividend income Korea's household wealth inequality. Total output, real income for lower-income groups, and employment stability may move in different directions.

## Verification contract — required after engine implementation

These checks are designed but **no simulation checks have yet been run or passed**.

| Check | Expected relation or failure condition |
|---|---|
| Population and time conservation | Employed + non-employed + training = fixed population. No duplicate membership. Each person's used time ≤ available time. |
| Production feasibility | Sales ≤ production. Time required for each task ≤ time supplied. Productivity and labor time use consistent units. |
| Firm accounts | Profit = sales revenue − wages − AI/adoption and other costs. Do not double-count costs as labor income or output. |
| Cash | Ending firm cash = beginning cash + revenue + explicit financing − costs − taxes − dividends. Apply the same accounting to households, government, and the external sector. |
| Counterparties | Total wages paid = labor income received; dividends paid = receipts allocated by ownership share; AI costs = external-sector revenue. |
| Fiscal accounts | Change in government balance = taxes − transfers − explicit spending. Do not add transfers to production growth. |
| Whole-system ledger | Net cash change across all sectors = explicit external money supply. No unexplained residuals. |
| Value added | Industry sales − purchased intermediate inputs = wages + pre-tax surplus (simplified definition). Do not label sales as GDP. |
| Reproducibility | Same settings, seed, and engine version produce the same state/output hash. Changing scenario display order does not change results. |
| Control | If changes to technology, costs, demand, and training are all 0, the AI label alone does not change results. |
| Limits | Under homogeneous and symmetric conditions, unexplained advantage is a failure. Check seed effects from tie-breaking separately. |
| Small hand-worked example | Compare the ledger for production, wages, profit, taxes, and dividends in 2 firms, 4 people, and 1 period against hand calculations. |
| Invalid inputs | Reject negative costs, probabilities outside their valid range, ownership shares that do not sum to 1, and NaN before execution. |
| Distribution calculations | Equal income for everyone gives Gini=0; uncorrected Gini for [0,0,0,4] is 0.75; shares sum to 1. |

Specify monetary floating-point tolerances in proportion to scale or use integer values in the smallest currency unit. Stop animation generation if ledger validation fails.

### Do not draw conclusions from one seed

Preselect exploratory seeds 0–99 and calculate scenario differences for matched seeds. Show the median paired difference, the 10–90% range, and the fraction retaining the same sign. This is variation across random runs, not a confidence interval for real-world predictions.

Vary demand elasticity, wage rules, ownership distributions, task linkage (fixed proportions/substitutable), firm count, and initial inequality to find where the direction of conclusions reverses. Show random uncertainty separately from uncertainty about model structure. Do not count dozens of periods for the same person as independent observations.

## Two choices before implementation

1. **Scope**: Start with the partial-equilibrium task-and-firm model above, or first build a closed economy that includes household consumption? The former is recommended. The latter captures purchasing-power feedback but requires many more assumptions about saving, credit, and demand accounting.
2. **Focus of the first screen**: Show adoption gaps and reemployment paths first, or focus on capital ownership and distribution? The former is recommended, with ownership as a separate experiment.

Do not implement this simulator before these choices and the demand and wage rules have been reviewed.
