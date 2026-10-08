# Personal Simulation Lab state

## Scope and owners

This is a personal simulation lab across topics. The user corrected an economy-only framing on 2026-09-30; each independent simulation owns its code, research, inputs and artifacts in a top-level project folder. Documentation and research use English, following the user's correction of an accidental Korean rewrite request. [AGENTS.md](AGENTS.md) owns repository rules; project READMEs own project status and entrypoints.

## Physician futures

[AI, work, and inequality](ai-work-inequality/README.md) is the current project: an evidence-anchored exploration of Korean physician work and earnings over 2026–2036, without individual career-strategy recommendations or a predetermined winning group.

Current source uses `web/empirical-model.mjs` (`physicians-0.2.0`) through the continuous English film. The project README and [model method](ai-work-inequality/docs/model-method.md) own the implemented equations and run instructions; [storyboard](ai-work-inequality/docs/storyboard.md) owns accepted presentation behavior. The early general-industry design and synthetic v0.1 remain historical references, not current physician-model requirements.

The [source map](ai-work-inequality/docs/baseline-sources.md) separates verified 2020 role remuneration anchors, newer overall-income context, and separate workforce/utilization context. Reconstructed earnings weights are not observed workforce shares. Future deployment, task mix, staffing and gain participation remain scenario assumptions. Available aggregate evidence does not identify within-role distributions, national layoffs or hospital closure forecasts.

The [analysis report](ai-work-inequality/artifacts/analysis-report.md) exposes four matched paths and own-role endpoint earnings-maintenance conditions, including unreachable targets and an alternative compensation rule. Its finite sensitivity results are conditional on the tested design; they are not forecast confidence intervals. Productivity gains alone do not determine earnings: demand, other care capacity, staffing and participation rules shape the result. Robustness to task mix alone cannot validate the chosen distribution rule.

## Recorded verification and open boundaries

The 2026-10-03 release record at commit `b89be38` reports 37 tests, 13,972 deterministic runs, figure checks, browser controls and export replay. [Verification.md](ai-work-inequality/artifacts/verification.md) owns those dated observations; they establish implementation/reproduction at that checkpoint, not external national forecast accuracy or a fresh runtime check. Direct `file:` browser execution remained untested; portable HTML was tested through HTTP.

Missing matched 2023 role means and eligible earnings counts, the separate HIRA corrigendum's applicability, national task shares, and observed compensation contracts remain consequential evidence gaps. See the source and method owners before revising anchors or identifying stronger conclusions.

## Cross-Mac continuation

Prepared on 2026-10-08 at `~/DevHub/sideprojects/simulations` on both M3 Max
and M1 Pro. Both paths use the existing `ctx` workspace identity
`simulations-e7381072`; M1's Codex app also has a local `simulations` project.
GitHub carries tracked source and artifacts. Ignored `ai-work-inequality/data/raw/`
was copied directly over SSH and checksum-matched; each Mac owns its own `.venv`.
M1 passed `uv sync --locked`, all 37 tests and `npm run build`; its built film
rendered and its playback and evidence/results controls worked through an SSH
tunnel. No real conversation has been handed off yet. When ready, finish the
source turn and run `ctx handoff push --to m1pro --harness codex --session ID`
from this repository on M3. The first receipt and resumed conversation still need
to be checked at that time.

No newer research target is selected here after the earnings-maintenance release. Choose the next question from these gaps and the existing scenario conclusions; read the [development rationale](ai-work-inequality/docs/decisions/2026-10-08-development-rationale.md) before changing the accepted visual direction or reviving older assumptions. Use the project's [verification workflow](ai-work-inequality/.agents/skills/verify-physician-futures/SKILL.md) for substantive future changes.
