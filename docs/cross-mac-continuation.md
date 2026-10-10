# Cross-Mac continuation

Updated: 2026-10-10 11:27:11 (Asia/Seoul)

## Recorded setup

The 2026-10-08 readiness record identifies the repository on M3 Max and M1 Pro
with the shared `ctx` workspace identity `simulations-e7381072`. M1's Codex app
also has a local `simulations` project. GitHub carries tracked source and artifacts;
each Mac owns its own `.venv`.

Ignored `ai-work-inequality/data/raw/` was copied directly over SSH and
checksum-matched. These private inputs remain outside Git; source acquisition
instructions belong to the [income](../ai-work-inequality/docs/income-data.md)
and [workforce](../ai-work-inequality/docs/workforce-data.md) owners.

Readiness checks recorded on 2026-10-08 covered locked dependency sync, model
tests, the build, and playback and evidence/results controls in the built film
through an SSH tunnel on M1. Detailed run results and the then-used host location
remain in Git history for `STATE.md`. These are recorded observations, not a
fresh check of either Mac.

## Handoff and open check

The procedure uses the external `ctx` tool and the `m1pro` SSH destination.
No real conversation handoff has been recorded. When ready, finish the source
turn and run this from the repository on M3, replacing `ID` with the source
session identifier:

```sh
ctx handoff push --to m1pro --harness codex --session ID
```

The first receipt and resumed conversation on M1 still need to be checked.
