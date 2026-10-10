# Personal Simulation Lab state

Updated: 2026-10-10 11:27:11 (Asia/Seoul)

## Current goal

Explore Korean physician work and earnings over 2026–2036 through conditional
scenarios in [Physician futures](ai-work-inequality/README.md), within a simulation
lab whose topic scope is broader than economics ([lab overview](README.md)).

## Active work

- No newer research target is selected after the [earnings-maintenance release](ai-work-inequality/artifacts/analysis-report.md).
- Cross-Mac readiness is recorded; the first real conversation handoff and resumed session remain unchecked ([continuation owner](docs/cross-mac-continuation.md)).

## Decisions in force

- Keep simulations self-contained in top-level folders and write documentation/research in English — [repository rules](AGENTS.md).
- Exclude individual career advice and a predetermined winning group — [project scope](ai-work-inequality/README.md).
- Use the empirical physician model; earlier designs and synthetic v0.1 are historical references — [current method](ai-work-inequality/docs/model-method.md).
- Keep role remuneration anchors, reconstructed weights and workforce context distinct — [source map](ai-work-inequality/docs/baseline-sources.md).
- Treat future mechanisms and earnings participation as scenario assumptions, with finite sensitivity rather than forecast intervals — [method](ai-work-inequality/docs/model-method.md).
- Keep the accepted continuous English film and meaningful role grouping — [interface owner](ai-work-inequality/docs/storyboard.md).
- Verify substantive future changes at the relevant model and interface boundaries — [verification workflow](ai-work-inequality/.agents/skills/verify-physician-futures/SKILL.md).

## Open questions and blockers

- Matched 2023 role means and eligible earnings counts remain missing ([income data](ai-work-inequality/docs/income-data.md)).
- The separate HIRA corrigendum's applicability remains unverified ([workforce data](ai-work-inequality/docs/workforce-data.md)).
- National task shares and observed compensation contracts remain unidentified ([model limits](ai-work-inequality/docs/model-method.md)).
- Direct `file:` browser execution remains untested; recorded checks used HTTP ([dated verification](ai-work-inequality/artifacts/verification.md)).

## Next step

1. Select the next research question from the evidence gaps and [scenario conclusions](ai-work-inequality/artifacts/analysis-report.md); consult the [development rationale](ai-work-inequality/docs/decisions/2026-10-08-development-rationale.md) before changing accepted visual direction or reviving earlier assumptions.
2. When continuing on M1, follow the [handoff procedure](docs/cross-mac-continuation.md#handoff-and-open-check) and check the first receipt and resumed conversation.
