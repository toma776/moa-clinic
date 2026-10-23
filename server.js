// Server local fără dependențe.
//   /                         -> site-ul nou (nou/index.html); /vechi/ -> copia homepage-ului vechi (site/index.html)
//   /manage[/...]             -> panoul de administrare (manage/index.html): dashboard, brand, entități, legături, leads, pages, site health
//   GET  /api/entitati        -> data/entitati.json
//   GET  /api/pages           -> data/pages.json (generat de npm run crawl)
//   GET  /api/brand           -> data/brand.json        PUT -> salvează brand book-ul editat în panou
//   GET  /api/site-health     -> data/site-health.json  POST /api/site-health/ruleaza -> crawl nou + analiză
//   GET  /api/leads           -> data/leads.json        PUT -> înlocuiește lista · POST -> adaugă un lead · PATCH /api/leads/<id> -> completează
//   GET  /api/preturi         -> data/preturi.json      PUT -> salvează lista editată în panou, actualizează entitățile (prețuri, oferte) și regenerează site-ul nou
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
  '/api/intrebari/status': 'intrebari-status.json', '/api/structura': 'structura.json', '/api/observatii/status': 'observatii-status.json', '/api/leads': 'leads.json',
  '/api/preturi': 'preturi.json',
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

// Salvările din panoul local pleacă singure în GitHub (și de acolo pe Vercel): commit doar cu fișierele de date atinse,
// pull --rebase, push. Paginile le regenerează build-ul Vercel. Oprit cu MOA_AUTOPUSH=0. Lead-urile nu trec niciodată pe aici.
const AUTOPUSH = process.env.MOA_AUTOPUSH !== '0';
const git = (args) => new Promise((ok, err) => execFile('git', args, { cwd: ROOT, timeout: 90e3 }, (e, out, stderr) => (e ? err(new Error((stderr || e.message).trim())) : ok(out))));
let gitQueue = Promise.resolve();
function publish(files, message) {
  const job = gitQueue.then(async () => {
    if (!AUTOPUSH) return 'dezactivat';
    files = files.map((f) => 'data/' + f);
    if (!(await git(['status', '--porcelain', '--', ...files])).trim()) return 'nimic nou';
    await git(['add', '--', ...files]);
    await git(['commit', '-q', '-m', message, '--', ...files]);
    try { await git(['pull', '-q', '--rebase', '--autostash']); } catch (e) {
      await git(['rebase', '--abort']).catch(() => {});
      throw new Error('nu am putut aduce ultimele modificări din GitHub (conflict?). Commitul e local; rulează git pull. ' + e.message);
    }
    await git(['push', '-q']);
    return 'trimis';
  });
  gitQueue = job.catch(() => {});
  return job.catch((e) => { console.error('  ! git:', e.message); return 'eroare: ' + e.message.slice(0, 300); });
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
    return sendJson(res, 200, { ok: true, git: await publish(['brand.json'], 'Panou local: brand book actualizat') });
  }

  if (url === '/api/preturi' && m === 'PUT') {
    const PRT = require('./scripts/preturi');
    const b = await body(req);
    if (!Array.isArray(b.categorii)) return sendJson(res, 400, { error: 'aștept { categorii: [...] }' });
    const P = PRT.normalize(b);
    PRT.save(P);
    const D = readJson('entitati.json', null);
    if (D) writeJson('entitati.json', PRT.apply(D, P));
    let build = 'ok';
    try { await run('build-homepage.js'); } catch (e) { build = e.message.slice(0, 400); }
    const oferte = PRT.offersOf(P).length;
    const gitSt = await publish(['preturi.json', 'entitati.json'], `Panou local: lista de prețuri actualizată (${oferte} oferte)`);
    return sendJson(res, 200, { ok: true, preturi: P, oferte, build, git: gitSt });
  }

  if (url === '/api/entitati-editari' && m === 'PUT') {
    const ED = require('./scripts/editari');
    const { valori } = await body(req);
    if (!valori || typeof valori !== 'object') return sendJson(res, 400, { error: 'aștept { valori: { grup: valoare } }' });
    const D = readJson('entitati.json', null);
    if (!D) return sendJson(res, 404, { error: 'lipsește entitati.json' });
    const E = ED.load();
    const grupuri = ED.merge(D, E, valori, require('./scripts/preturi').load());
    ED.save(E);
    writeJson('entitati.json', D);
    let build = 'ok';
    try { await run('build-homepage.js'); } catch (e) { build = e.message.slice(0, 400); }
    const gitSt = await publish(['entitati.json', 'entitati-editari.json'], `Panou local: entități actualizate (${grupuri.join(', ')})`);
    return sendJson(res, 200, { ok: true, grupuri, build, git: gitSt });
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
    return sendJson(res, 200, { ok: true, git: await publish(['intrebari-status.json'], `Panou local: întrebare ${status}`) });
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
          out.git = await publish(['observatii-status.json'], `Panou local: observație rezolvată (${obs.id})`);
        }
        return sendJson(res, 200, out);
      } catch (e) {
        return sendJson(res, 200, { rezultat: 'eroare', eroare: e.message });
      }
    }
    if (act === 'confirma') {
      st[obs.id] = { status: 'rezolvat', metoda: 'confirmat manual', verificat_la: now(), nota: b.nota || '' };
      writeJson('observatii-status.json', st);
      return sendJson(res, 200, { ok: true, git: await publish(['observatii-status.json'], `Panou local: observație confirmată (${obs.id})`) });
    }
    if (act === 'redeschide') {
      delete st[obs.id];
      writeJson('observatii-status.json', st);
      return sendJson(res, 200, { ok: true, git: await publish(['observatii-status.json'], `Panou local: observație redeschisă (${obs.id})`) });
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
  try {
    // o adresă cu „%” invalid nu mai oprește serverul (decodeURIComponent aruncă URIError)
    let url;
    try { url = decodeURIComponent(req.url.split(/[?#]/)[0]); } catch { res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('400 – adresă invalidă'); }
    if (url.startsWith('/api/')) return await api(req, res, url);
    if (url === '/nou') { res.writeHead(301, { Location: '/nou/' }); return res.end(); }
    if (url.startsWith('/nou/')) {
      const f = safe(path.join(ROOT, 'nou'), url.slice('/nou/'.length) || 'index.html');
      return sendFile(res, f && fs.existsSync(f) && fs.statSync(f).isDirectory() ? path.join(f, 'index.html') : f || '');
    }
    // imaginile noi (Unsplash) ale paginilor: entitati/media/imagini/
    if (url.startsWith('/entitati/media/')) return sendFile(res, safe(path.join(ROOT, 'entitati', 'media'), url.slice('/entitati/media/'.length)) || '');
    if (url.startsWith('/manage/assets/')) return sendFile(res, safe(path.join(ROOT, 'manage', 'assets'), url.slice('/manage/assets/'.length)) || '');
    if (url === '/manage' || url.startsWith('/manage/')) return sendFile(res, path.join(ROOT, 'manage', 'index.html'));
    // „/” deschide site-ul nou; copia site-ului vechi rămâne la /vechi/
    if (url === '/') return sendFile(res, path.join(ROOT, 'nou', 'index.html'));
    if (url === '/vechi' || url === '/vechi/') return sendFile(res, path.join(ROOT, 'site', 'index.html'));
    const site = path.join(ROOT, 'site');
    const file = safe(site, url);
    sendFile(res, file && fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file || '');
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}).listen(PORT, () => {
  // orice eroare neprevăzută se scrie în consolă, fără să oprească serverul
  process.on('uncaughtException', (e) => console.error('Eroare neprinsă:', e));
  process.on('unhandledRejection', (e) => console.error('Promisiune respinsă:', e));
  console.log(`MOA Clinic local:  http://localhost:${PORT}/`);
  console.log(`Panou:             http://localhost:${PORT}/manage`);
});
