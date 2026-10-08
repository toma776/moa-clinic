// Server local fără dependențe.
//   /                         -> copia homepage-ului (site/index.html)
//   /manage[/...]             -> panoul de administrare (manage/index.html): dashboard, brand, entități, legături, leads, pages, site health
//   GET  /api/entitati        -> data/entitati.json
//   GET  /api/pages           -> data/pages.json (generat de npm run crawl)
//   GET  /api/brand           -> data/brand.json        PUT -> salvează brand book-ul editat în panou
//   GET  /api/site-health     -> data/site-health.json  POST /api/site-health/ruleaza -> crawl nou + analiză
//   GET  /api/leads           -> data/leads.json        PUT -> înlocuiește lista · POST -> adaugă un lead · PATCH /api/leads/<id> -> completează
//   GET  /api/intrebari/status                          PUT {id, status, intrebare?, raspuns?, nota?} -> validarea unei întrebări
//   GET  /api/observatii/status
//   POST /api/observatii/verifica   {id, salveaza} -> rulează regula pe site-ul live; dacă trece și salveaza=true, o marchează rezolvată
//   POST /api/observatii/confirma   {id, nota}     -> confirmare manuală (regulile de tip „manual”)
//   POST /api/observatii/redeschide {id}
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const checks = require('./scripts/checks');

const PORT = process.env.PORT || 3100;
const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
};
const JSON_FILES = {
  '/api/entitati': 'entitati.json', '/api/pages': 'pages.json', '/api/brand': 'brand.json', '/api/site-health': 'site-health.json',
  '/api/intrebari/status': 'intrebari-status.json', '/api/observatii/status': 'observatii-status.json', '/api/leads': 'leads.json',
};

const readJson = (f, def) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch { return def; } };
const writeJson = (f, v) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(v, null, 2));
const now = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19); };

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': TYPES['.json'], 'Cache-Control': 'no-store' });
  res.end(typeof obj === 'string' ? obj : JSON.stringify(obj));
}
function sendFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 – ' + path.relative(ROOT, file || ''));
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}
function body(req) {
  return new Promise((ok, err) => {
    let b = '';
    req.on('data', (c) => { b += c; if (b.length > 5e6) req.destroy(); });
    req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch (e) { err(e); } });
  });
}
function run(script) {
  return new Promise((ok, err) => execFile(process.execPath, [path.join(ROOT, 'scripts', script)], { cwd: ROOT, timeout: 10 * 60e3 }, (e, out, stderr) => (e ? err(new Error(stderr || e.message)) : ok(out))));
}
// Previne ieșirea din directorul permis (../).
function safe(base, rel) {
  const p = path.normalize(path.join(base, rel));
  return p.startsWith(base) ? p : null;
}

// ---------- API ----------
async function api(req, res, url) {
  const m = req.method;

  if (m === 'GET' && JSON_FILES[url]) {
    const f = path.join(DATA, JSON_FILES[url]);
    if (!fs.existsSync(f)) {
      if (url === '/api/leads') return sendJson(res, 200, []);
      if (url.endsWith('/status')) return sendJson(res, 200, {});
      return sendJson(res, 404, { error: 'lipsește ' + JSON_FILES[url] });
    }
    return sendJson(res, 200, fs.readFileSync(f, 'utf8'));
  }

  if (url === '/api/brand' && m === 'PUT') {
    writeJson('brand.json', await body(req));
    return sendJson(res, 200, { ok: true });
  }

  if (url === '/api/leads' && m === 'PUT') {
    const list = await body(req);
    if (!Array.isArray(list)) return sendJson(res, 400, { error: 'aștept o listă' });
    writeJson('leads.json', list);
    return sendJson(res, 200, { ok: true });
  }
  if (url === '/api/leads' && m === 'POST') {
    const l = await body(req);
    if (!l.nume || !(l.email || l.telefon)) return sendJson(res, 400, { error: 'nume + email sau telefon' });
    const list = readJson('leads.json', []);
    const lead = { id: Math.random().toString(36).slice(2, 14), creat: now(), status: 'nou', sursa: 'Formular site', ...l };
    list.push(lead);
    writeJson('leads.json', list);
    return sendJson(res, 201, lead);
  }
  if (url.startsWith('/api/leads/') && m === 'PATCH') {
    const id = url.slice('/api/leads/'.length);
    const list = readJson('leads.json', []);
    const lead = list.find((x) => x.id === id);
    if (!lead) return sendJson(res, 404, { error: 'lead inexistent' });
    Object.assign(lead, await body(req), { id, actualizat: now() });
    writeJson('leads.json', list);
    return sendJson(res, 200, lead);
  }

  if (url === '/api/intrebari/status' && m === 'PUT') {
    const { id, status, intrebare, raspuns, nota } = await body(req);
    if (!id || !['propusă', 'validată', 'respinsă'].includes(status)) return sendJson(res, 400, { error: 'id + status' });
    const st = readJson('intrebari-status.json', {});
    st[id] = { status, intrebare: intrebare || '', raspuns: raspuns || '', nota: nota || '', verificat_la: now() };
    writeJson('intrebari-status.json', st);
    return sendJson(res, 200, { ok: true });
  }

  if (url.startsWith('/api/observatii/') && m === 'POST') {
    const b = await body(req);
    const obs = (readJson('entitati.json', {}).observatii || []).find((o) => o.id === b.id);
    if (!obs) return sendJson(res, 404, { error: 'observație inexistentă' });
    const st = readJson('observatii-status.json', {});
    const act = url.slice('/api/observatii/'.length);
    if (act === 'verifica') {
      try {
        const r = await checks.run(obs.check || { tip: 'manual' });
        const out = { rezultat: r.ok ? 'rezolvat' : 'deschis', detalii: r.detalii, verificat_la: now(), salvat: false };
        if (r.ok && b.salveaza) {
          st[obs.id] = { status: 'rezolvat', metoda: 'verificat pe site', verificat_la: out.verificat_la, detalii: r.detalii };
          writeJson('observatii-status.json', st);
          out.salvat = true;
        }
        return sendJson(res, 200, out);
      } catch (e) {
        return sendJson(res, 200, { rezultat: 'eroare', eroare: e.message });
      }
    }
    if (act === 'confirma') {
      st[obs.id] = { status: 'rezolvat', metoda: 'confirmat manual', verificat_la: now(), nota: b.nota || '' };
      writeJson('observatii-status.json', st);
      return sendJson(res, 200, { ok: true });
    }
    if (act === 'redeschide') {
      delete st[obs.id];
      writeJson('observatii-status.json', st);
      return sendJson(res, 200, { ok: true });
    }
  }

  if (url === '/api/site-health/ruleaza' && m === 'POST') {
    try {
      await run('crawl-pages.js');
      await run('site-health.js');
      return sendJson(res, 200, fs.readFileSync(path.join(DATA, 'site-health.json'), 'utf8'));
    } catch (e) {
      return sendJson(res, 500, { error: e.message.slice(0, 500) });
    }
  }

  return sendJson(res, 404, { error: 'rută necunoscută' });
}

http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split(/[?#]/)[0]);
  try {
    if (url.startsWith('/api/')) return await api(req, res, url);
    if (url.startsWith('/manage/assets/')) return sendFile(res, safe(path.join(ROOT, 'manage', 'assets'), url.slice('/manage/assets/'.length)) || '');
    if (url === '/manage' || url.startsWith('/manage/')) return sendFile(res, path.join(ROOT, 'manage', 'index.html'));
    const site = path.join(ROOT, 'site');
    const file = safe(site, url === '/' ? 'index.html' : url);
    sendFile(res, file && fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file || '');
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}).listen(PORT, () => {
  console.log(`MOA Clinic local:  http://localhost:${PORT}/`);
  console.log(`Panou:             http://localhost:${PORT}/manage`);
});
