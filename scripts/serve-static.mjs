#!/usr/bin/env node
// Minimal static server that behaves like GitHub Pages, for testing the static build locally:
// folders → index.html (with a redirect to the trailing-slash URL), /x → x.html, otherwise 404.html (status 404).
//   node scripts/serve-static.mjs [dir=out] [port=3201]
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'out');
const port = Number(process.argv[3] || 3201);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;
const isDir = async (p) => (await stat(p).catch(() => null))?.isDirectory() ?? false;

function send(res, file, status = 200) {
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const rel = decodeURIComponent(url.pathname);
  const target = path.join(root, rel);
  if (!target.startsWith(root)) return res.writeHead(400).end();

  if (await isFile(target)) return send(res, target);
  if (await isDir(target)) {
    if (!rel.endsWith('/')) return res.writeHead(301, { Location: `${rel}/${url.search}` }).end();
    if (await isFile(path.join(target, 'index.html'))) return send(res, path.join(target, 'index.html'));
  }
  if (await isFile(`${target}.html`)) return send(res, `${target}.html`);
  return send(res, path.join(root, '404.html'), 404);
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
