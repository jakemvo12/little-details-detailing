// Local dev server for Little Details — http://localhost:3000
// Start: export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && node serve.mjs

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000;
const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null;
  }
  const filePath = normalize(join(ROOT, pathname));
  // Block path traversal outside the project root
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) return null;

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      const indexPath = join(filePath, 'index.html');
      await stat(indexPath);
      return indexPath;
    }
    return filePath;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const filePath = await resolveFile(req.url);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  try {
    const body = await readFile(filePath);
    const type = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Little Details dev server running at http://localhost:${PORT}`);
});
