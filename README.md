# Personal Simulation Lab

My personal lab for exploring questions through small, reproducible simulations
across topics. Each project keeps its own research, model design, code, and
artifacts together.

## Projects

| Project | Focus | Status |
| --- | --- | --- |
| [AI, work, and inequality](ai-work-inequality/) | AI adoption, work, and income distribution in the Korean context; physicians as the first case | Evidence-anchored physician scenarios (2026–2036), continuous animation and sensitivity figures |

## Organization

Each simulation lives in its own top-level folder. Start with its README for
current decisions, open questions, and available run instructions. Add project-local
folders such as `docs/`, `researches/`, `scripts/`, and `artifacts/` as needed.
The [unfinished work](STATE.md) lists current work, next steps and blockers;
each project's README and topic docs own current behavior and decisions.
Repository-wide agent guidance lives in [AGENTS.md](AGENTS.md).
Documentation and research are maintained in English.

## Data continuity

[`.ctxdata.json`](.ctxdata.json) declares retained empirical inputs and extraction
provenance under `ai-work-inequality/data`, including provenance not yet owned by
Git. Private original inputs stay outside Git. Cloud access is enabled; data
authority is NAS-v1, without peer-v2 enrollment. The
[cross-Mac continuation guide](docs/cross-mac-continuation.md) owns conversation
handoff instructions.

## Publication and rights

Only original code, documentation, and generated visualizations are intended for
publication. Personal notes, credentials, restricted inputs, paper PDFs, and
third-party source tables or figures are excluded. Keep source links and original
summaries; verify redistribution terms before adding external data.

A repository license has not yet been selected.
