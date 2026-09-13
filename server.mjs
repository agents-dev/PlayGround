// Minimal static server for the playable entrypoint. Serves ./index.html on port 3000.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("./", import.meta.url).pathname;
const PORT = Number(process.env.APP_PORT || 3000);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = normalize(join("/", url.pathname));
    if (path === "/") path = "/index.html";
    // Only serve index.html + project static assets; never dotfiles.
    if (path.includes("..") || /(^|\/)\./.test(path)) {
      res.writeHead(403); res.end("forbidden"); return;
    }
    const file = join(ROOT, path);
    await stat(file);
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    // SPA fallback: serve index.html for unknown routes so the app stays playable.
    try {
      const body = await readFile(join(ROOT, "index.html"));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
    } catch {
      res.writeHead(404); res.end("not found");
    }
  }
});

server.listen(PORT, () => console.log(`app-server listening on http://localhost:${PORT} serving index.html`));
