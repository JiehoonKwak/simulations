"""Switchboard #75: bounded browser cloud acceptance, standard library only."""
import argparse
import hashlib
import json
from pathlib import Path

INPUT_DIR = Path('ai-work-inequality/data/continuity-20261011/completed')
PREVIOUS = Path('ai-work-inequality/data/switchboard-cloud-20261011/codex/json-acceptance.json')
OUTPUT = Path('ai-work-inequality/data/switchboard-cloud-browser-20261011/json-acceptance.json')
PINNED = {
    'm1-continuation.json': '08af1ace47f7fe38b58f17c31b5d26544390045b4c6a3af8b76b0314779f809e',
    'result.json': 'c0ea7ba9588dc887271a34518a18c4be5ca9d1817a56d951ff1c5ba565c81047',
}


def numbers(value):
    if isinstance(value, bool):
        return []
    if isinstance(value, (int, float)):
        return [value]
    if isinstance(value, dict):
        return [n for key in sorted(value) for n in numbers(value[key])]
    if isinstance(value, list):
        return [n for item in value for n in numbers(item)]
    return []


def summarize(root):
    paths = sorted((root / INPUT_DIR).rglob('*.json'))
    if {p.relative_to(root / INPUT_DIR).as_posix() for p in paths} != set(PINNED):
        raise SystemExit('unexpected input selection')
    inputs, values = [], []
    for path in paths:
        raw = path.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        if digest != PINNED[path.name]:
            raise SystemExit(f'input checksum mismatch: {path.name}')
        found = numbers(json.loads(raw))
        values.extend(found)
        inputs.append({'path': path.relative_to(root).as_posix(), 'sha256': digest,
                       'numeric_count': len(found), 'numeric_sum': sum(found)})
    summary = {'provider': 'codex', 'inputs': inputs, 'numeric_count': len(values),
               'numeric_sum': sum(values), 'numeric_values': sorted(values)}
    prior_raw = (root / PREVIOUS).read_bytes()
    expected = dict(summary, claude_result={
        'path': 'ai-work-inequality/data/switchboard-cloud-20261011/claude/json-acceptance.json',
        'sha256': '9642b54c88d80ef85b70cbc195f339b9d7b0e2985ea1de36b6186df72270236b'})
    if json.loads(prior_raw) != expected:
        raise SystemExit('Codex result does not match original inputs')
    summary['provider'] = 'codex-browser'
    summary['codex_result'] = {'path': PREVIOUS.as_posix(),
                               'sha256': hashlib.sha256(prior_raw).hexdigest()}
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data-root', type=Path, required=True)
    parser.add_argument('--check', action='store_true', help='read-only byte comparison')
    args = parser.parse_args()
    root = args.data_root.resolve()
    raw = (json.dumps(summarize(root), indent=2, sort_keys=True, allow_nan=False) + '\n').encode()
    output = root / OUTPUT
    if args.check:
        if output.read_bytes() != raw:
            raise SystemExit('browser result mismatch')
        print(f'ok: {output}')
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(raw)
        print(f'wrote {output}')


if __name__ == '__main__':
    main()
