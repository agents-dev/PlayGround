import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
const port = Number(process.env.PORT || 3000);
const root = process.cwd();
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  let rel = u.pathname === '/' ? 'index.html' : normalize(u.pathname).replace(/^[/\\]+/, '');
  const file = join(root, rel);
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': `${types[extname(file)] || 'application/octet-stream'}; charset=utf-8` });
  createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`kkrieger-96k listening on ${port}`));
