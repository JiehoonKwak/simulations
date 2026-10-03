import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const model = await readFile(resolve(root, 'web/model.mjs'), 'utf8');
const url = `data:text/javascript;base64,${Buffer.from(model).toString('base64')}`;
const roundTwo = process.argv[2] === '2';
const names = roundTwo ? ['neighborhood', 'cutaway', 'street'] : ['people', 'city', 'duel'];
const views = {};
for (const name of names) {
  const source = await readFile(resolve(root, `web/prototypes/${name}.html`), 'utf8');
  views[name] = source.replace(/(['"])\.\.\/model\.mjs\1/g, () => JSON.stringify(url));
  if (views[name] === source) throw new Error(`Missing model import: ${name}`);
}
let gallery = await readFile(resolve(root, roundTwo ? 'web/prototypes-2.html' : 'web/prototypes.html'), 'utf8');
gallery = gallery.replace(/src="\.\/prototypes\/[a-z]+\.html"/, '');
gallery = gallery.replace('<script>', `<script>\nconst embeddedViews=${JSON.stringify(views).replace(/</g, '\\u003c')};`);
gallery = gallery.replace('stage.src=`./prototypes/${selected.dataset.view}.html`', 'stage.srcdoc=embeddedViews[selected.dataset.view]');
gallery = gallery.replace('if(location.hash)show(location.hash.slice(1));', `show(location.hash.slice(1)||'${names[0]}');`);
gallery = gallery.replace('<a href="./index.html" target="_blank">기존 분석 화면 ↗</a>', '<span style="font-size:12px;color:#61767f">Motion studies</span>');
await mkdir(resolve(root, 'artifacts'), {recursive:true});
gallery = gallery.replace('href="./prototypes.html#city"', 'href="motion-prototypes.html#city"');
const output = roundTwo ? 'motion-prototypes-2.html' : 'motion-prototypes.html';
await writeFile(resolve(root, 'artifacts', output), gallery);
console.log(`Built artifacts/${output}`);
