# Simulation Lab documentary review

## Docs pass 2026-10-10: memory index

Scope: `clean docs` on project memory (`STATE.md`, `AGENTS.md`, `README.md`,
`docs/` and adjacent guides) under the 2026-10-10 contract in the shared global
`AGENTS.md` (Project Memory): `STATE.md` is an index near 60 lines; reasons,
corrections and verified results live in topic owners. Reviewed and applied in
commit `21df8c4`; `STATE.md` is now 36 lines. Method: one Codex `gpt-6.1-sol`
agent per project, reviewed by Claude for docs-only scope, link/anchor validity
and retention of removed identifiers. Receipt: [review.md](review.md#d-20261010-memory-index).

Open after this pass:

5. **Preserved and remaining:** Existing human-authored first-person prose and recorded user directions were kept unchanged. Research selection, direct `file:` execution and the first real handoff remain open. Audit records stayed unchanged because `.agents/` is read-only.

All 37 checked relative links and anchors resolve; whitespace checks passed. Only documentation changed. No builds, tests, commits or Git-state changes were performed.

Reopen when `STATE.md` grows well past 60 lines, gains dated narration, or a
fact appears there without a topic owner. Earlier sections below record prior
passes.

Independent docs-only review passed all 11 questions; parent comparison accepted the retained reasons, corrections and explicit unknowns. Scoped delivery is recorded in the private receipt.

Date: 2026-10-08. Status: approved retention and owner routing applied; [review](review.md).

Root STATE routes to the project README and current method/source/interface/verification owners. Historical model-design and synthetic v0.1 documents now expose their status before earlier instructions. A dated development-rationale record preserves user corrections and failure lessons with original locators.

Keep the lab's topic scope, evidence-anchored v0.2, legacy prototypes, source provenance, raw-data boundary and scientific interpretation limits. The prior inventory (`markdown-inventory.json`, local prior-audit input) and Hindsight dispositions describe the earlier audit, not current semantic review or fresh runtime verification. Full source review and detailed covered/new comparisons are in the private receipt.

Reinspect after a new research question, evidence revision, model/compensation change, visual feedback, or source-ownership correction. Do not use historical prototype outcomes or check counts to validate the current release.
