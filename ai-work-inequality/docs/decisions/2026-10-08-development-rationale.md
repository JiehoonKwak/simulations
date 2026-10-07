# Development decisions and corrective lessons

Recorded: 2026-10-08, from decisions and feedback through 2026-10-03.
Status: historical rationale; [current method](../model-method.md), [interface](../storyboard.md), and [project README](../../README.md) govern present behavior.

## Lab scope and language

On September 30 the user explicitly corrected the repository's economy-only description to a personal simulation lab and requested project-local organization while preserving the work in preparation. A later request to rewrite docs in Korean was immediately corrected by the user to English, including AGENTS and README. The English rule is the final decision. Translation review also corrected accounting “imports” to “revenue”: preserve the economic meaning, equations, sources and unresolved choices when rewriting.

## Motion must show work, not merely move a camera

The user rejected the first analytical explorer's text density and preferred the hospital-city prototype to people/scenario dashboards. Three architectural variants were accepted, followed by a request to establish a visually coherent experience before expanding empirical data. Browser-side JavaScript was used so controls could recalculate immediately and the experience could travel as standalone HTML; the early Python-engine proposal did not remain the implementation choice.

The first integrated 42-second tour passed functional navigation checks, but the user found it static and slow. The assistant acknowledged that connecting scenes had left visible clinical activity too weak; missing empirical data was not the cause of that presentation failure. A synthetic path could change substantially while its early frames barely changed. The user then requested one continuous scene with multiple aspects visible together and no viewpoint tabs. The revision used visible care activity from the outset and a 16-second timeline. Functional navigation or an endpoint screenshot alone therefore cannot establish satisfying motion; verify visible action and timing in the actual artifact. Later feedback accepted the improved animation sufficiently to proceed with empirical development.

## Source discovery is not calibration

When asked whether the statistics-based simulation was finished, the assistant clarified that the then-current model was synthetic and official sources had only been researched. The user then authorized empirical completion, minimal English artifact text and meaningful grouping in place of P1–P16. This distinguishes an inventory of sources from values actually used by the engine.

The source audit changed the model, rather than merely decorating v0.1 with statistics. Comparable evidence supported two adjusted remuneration means, not a hospital×role×region joint population or hospital profit shares. The empirical model therefore replaced owner-first dismissal, assumed physician-owner dividends and reserve-based closures with required-work, retained-position and earnings-participation scenarios. Less work does not itself identify job loss. Two-role grouping follows the comparable income evidence; schematic building/actor counts do not supply empirical weights.

## Completion and structural sensitivity

The October 3 correction supersedes historical claims that the active engine was still synthetic or that sensitivity, figures and E2E QA were unfinished. Completion meant a reproducible evidence-anchored **conditional scenario release**, not completed external forecast validation. The user then requested a checkpoint commit and the next research stage through completion; `151ef04` preserves the initial empirical release and `b89be38` preserves earnings-maintenance comparisons.

That follow-up exposed a consequential structural question: surviving task-mix variations cannot validate the earnings-distribution formula. Four matched paths and retained-rights versus growth-only compensation make that dependence inspectable. Endpoint income maintenance also depends on care demand and capacity; increasing gain participation alone may leave a target unreachable. The current report owns the numerical results and finite-design limits.

## Source locators

Archived bank `coding-agent::simulations`, original `documents.jsonl`:

- `conversation:01a0f2c5-0211-7ef3-8a6d-92bf478a0542` (line 3698): lab scope, language correction and translation review.
- `conversation:01a0f2bf-4543-7641-816c-5c89da4b125c` (line 3461): implementation, user motion feedback, source-versus-calibration correction, empirical work and follow-up.
- `initiative-marker-physician-futures-interactive-explorer-1790977116787` (line 2103): source-audit rationale and replacement of unsupported synthetic mechanisms.
- `correction-physician-futures-empirical-v0-2-implementation-and-completion-boundary` (line 3326): dated supersession and limits.
- `gitlog:simulations` (line 3591), confirmed by current Git history: checkpoint/follow-up reasons and separate verification counts.
