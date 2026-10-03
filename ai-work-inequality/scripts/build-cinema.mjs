import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const names = [
  "empirical-model.mjs",
  "sensitivity.mjs",
  "cinema/continuous.mjs",
];
const [template, style, source, ...modules] = await Promise.all(
  ["cinema.html", "cinema/style.css", "cinema/app.mjs", ...names].map((name) =>
    readFile(resolve(project, "web", name), "utf8"),
  ),
);
let app = source;
const baseline = await readFile(resolve(project, "web/baseline.mjs"), "utf8");
const baselineURL = `data:text/javascript;base64,${Buffer.from(baseline).toString("base64")}`;
modules[0] = modules[0].replace(
  '"./baseline.mjs"',
  JSON.stringify(baselineURL),
);
const engineURL = `data:text/javascript;base64,${Buffer.from(modules[0]).toString("base64")}`;
modules[1] = modules[1].replace(
  '"./empirical-model.mjs"',
  JSON.stringify(engineURL),
);
for (const [i, name] of names.entries()) {
  const local = name.startsWith("cinema/")
    ? `./${name.split("/").at(-1)}`
    : `../${name}`;
  if (!app.includes(`from '${local}'`) && !app.includes(`from "${local}"`))
    throw new Error(`Missing import: ${local}`);
  const url = `data:text/javascript;base64,${Buffer.from(modules[i]).toString("base64")}`;
  app = app
    .replace(`'${local}'`, JSON.stringify(url))
    .replace(`"${local}"`, JSON.stringify(url));
}
const html = template
  .replace(
    /<link\b[^>]*href="\.\/cinema\/style.css"[^>]*>/,
    () => `<style>${style}</style>`,
  )
  .replace(
    /<script\b[^>]*src="\.\/cinema\/app.mjs"[^>]*>\s*<\/script>/,
    () =>
      `<script type="module">${app.replace(/<\/script/gi, "<\\/script")}</script>`,
  )
  .replace('href="./cinema.html"', 'href="#"');
if (/src="\.\/cinema|href="\.\/cinema/.test(html))
  throw new Error("Unembedded entrypoint");
const output = resolve(project, "artifacts/physician-futures-film.html");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(
  `Built ${output} (${Buffer.byteLength(html).toLocaleString()} bytes)`,
);
