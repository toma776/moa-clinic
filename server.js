// Server local fără dependențe.
//   /                   -> copia homepage-ului (site/index.html)
//   /manage/entitati    -> panoul de entități ale brandului
//   /api/entitati       -> data/entitati.json
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3100;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
};

function send(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 – ' + path.relative(ROOT, file));
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}

// Previne ieșirea din directorul permis (../).
function safe(base, rel) {
  const p = path.normalize(path.join(base, rel));
  return p.startsWith(base) ? p : null;
}

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split(/[?#]/)[0]);

  if (url === '/manage' || url === '/manage/') {
    res.writeHead(302, { Location: '/manage/entitati' });
    return res.end();
  }
  if (url === '/manage/entitati' || url === '/manage/entitati/') return send(res, path.join(ROOT, 'manage', 'entitati.html'));
  if (url.startsWith('/manage/')) return send(res, safe(path.join(ROOT, 'manage'), url.slice('/manage/'.length)) || '');
  if (url === '/api/entitati') return send(res, path.join(ROOT, 'data', 'entitati.json'));

  const site = path.join(ROOT, 'site');
  const file = safe(site, url === '/' ? 'index.html' : url);
  send(res, file && fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file || '');
}).listen(PORT, () => {
  console.log(`MOA Clinic local:  http://localhost:${PORT}/`);
  console.log(`Entități brand:    http://localhost:${PORT}/manage/entitati`);
});
