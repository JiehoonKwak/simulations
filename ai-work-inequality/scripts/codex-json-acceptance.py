"""Switchboard #74: verify Claude continuity and summarize pinned inputs."""
import argparse
import hashlib
import json
from pathlib import Path
import runpy

BASE = runpy.run_path(str(Path(__file__).with_name('cloud-json-acceptance.py')))
PINNED = {
    'm1-continuation.json': '08af1ace47f7fe38b58f17c31b5d26544390045b4c6a3af8b76b0314779f809e',
    'result.json': 'c0ea7ba9588dc887271a34518a18c4be5ca9d1817a56d951ff1c5ba565c81047',
}


def summarize(root):
    inputs = sorted((root / BASE['INPUT_DIR']).rglob('*.json'))
    if {p.relative_to(root / BASE['INPUT_DIR']).as_posix() for p in inputs} != set(PINNED):
        raise SystemExit('unexpected input selection')
    for path in inputs:
        if hashlib.sha256(path.read_bytes()).hexdigest() != PINNED[path.name]:
            raise SystemExit(f'input checksum mismatch: {path.name}')
    prior_path = Path(BASE['OUTPUT_DIR']) / 'claude' / BASE['OUTPUT_NAME']
    prior_raw = (root / prior_path).read_bytes()
    if json.loads(prior_raw) != BASE['summarize'](root, 'claude'):
        raise SystemExit('Claude result does not match original inputs')
    result = BASE['summarize'](root, 'codex')
    result['claude_result'] = {
        'path': prior_path.as_posix(),
        'sha256': hashlib.sha256(prior_raw).hexdigest(),
    }
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data-root', type=Path, required=True)
    parser.add_argument('--check', action='store_true', help='read-only verification')
    args = parser.parse_args()
    root = args.data_root.resolve()
    text = json.dumps(summarize(root), indent=2, sort_keys=True, allow_nan=False) + '\n'
    output = root / BASE['OUTPUT_DIR'] / 'codex' / BASE['OUTPUT_NAME']
    if args.check:
        if output.read_bytes() != text.encode('utf-8'):
            raise SystemExit('Codex result mismatch')
        print(f'ok: {output}')
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text, encoding='utf-8')
        print(f'wrote {output}')


if __name__ == '__main__':
    main()
