import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const web = resolve(project, "web");
const port = Number(process.env.PORT ?? 8765);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const artifact = {
      "/standalone.html": "physician-futures.html",
      "/film.html": "physician-futures-film.html",
      "/motion.html": "motion-prototypes.html",
      "/motion-2.html": "motion-prototypes-2.html",
      "/motion-prototypes.html": "motion-prototypes.html",
    }[pathname];
    const target = artifact
      ? resolve(project, "artifacts", artifact)
      : resolve(
          web,
          `.${pathname === "/" ? "/cinema.html" : pathname === "/explorer.html" ? "/index.html" : pathname}`,
        );
    if (!artifact && !target.startsWith(web + sep)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(target);
    response.writeHead(200, {
      "Content-Type": types[extname(target)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    const status =
      error instanceof URIError
        ? 400
        : ["ENOENT", "EISDIR", "ENOTDIR"].includes(error.code)
          ? 404
          : 500;
    response.writeHead(status);
    response.end(status === 404 ? "Not found" : "Unable to serve this request");
    if (status === 500) console.error(error);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Physician Futures: http://127.0.0.1:${port}`);
});
