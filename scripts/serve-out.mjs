import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';

const root = resolve(process.env.OUT_DIR || join(process.cwd(), 'out'));
const port = Number(process.env.PORT || 3000);

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const server = createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let path = resolve(root, '.' + urlPath);
    if (path !== root && !path.startsWith(root + '/')) {
      res.writeHead(404);
      res.end();
      return;
    }
    if (existsSync(path) && statSync(path).isDirectory()) {
      path = join(path, 'index.html');
    }
    // Next.js static export: extensionless routes map to <route>.html
    if (!existsSync(path) && !extname(path)) {
      const htmlPath = path + '.html';
      if (existsSync(htmlPath)) path = htmlPath;
    }
    if (!existsSync(path)) {
      // SPA fallback for unknown routes
      path = join(root, 'index.html');
    }
    res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(readFileSync(path));
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving ${root} on :${port}`);
});
