import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [template, style, model, app] = await Promise.all(
  ['index.html', 'style.css', 'model.mjs', 'app.mjs']
    .map(name => readFile(resolve(project, 'web', name), 'utf8')),
);
const modelUrl = `data:text/javascript;base64,${Buffer.from(model).toString('base64')}`;
const embeddedApp = app.replace(/(['"])\.\/model\.mjs\1/g, JSON.stringify(modelUrl));
if (embeddedApp === app) throw new Error('Expected a local model import in app.mjs.');
const html = template
  .replace(/<link\b[^>]*href=["']\.\/style\.css["'][^>]*>/,
    () => `<style>${style}</style>`)
  .replace(/<script\b[^>]*src=["']\.\/app\.mjs["'][^>]*>\s*<\/script>/,
    () => `<script type="module">${embeddedApp.replace(/<\/script/gi, '<\\/script')}</script>`);
if (html === template || /(?:href|src)=["']\.\/(?:style\.css|app\.mjs)["']/.test(html)) {
  throw new Error('The HTML entrypoints could not be embedded.');
}
const output = resolve(project, 'artifacts/physician-futures.html');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Built ${output} (${Buffer.byteLength(html).toLocaleString()} bytes)`);
