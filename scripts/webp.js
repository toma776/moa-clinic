// Imaginile raster (jpg, jpeg, png) folosite de paginile /nou/ primesc o variantă WebP de maximum 200 KB, lângă original.
// Generatorul (scripts/seo.js) trece referințele pe .webp acolo unde varianta există. AVIF și SVG rămân cum sunt.
// Originalele rămân pe loc: aceleași fișiere le folosește și copia site-ului vechi (/vechi), care nu se schimbă.
// Rulează local, după build: node scripts/webp.js, apoi încă un build. Fișierele .webp se comit.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MAX = 200 * 1024;

const local = (u) => {
  u = decodeURI(u.split(/[?#]/)[0]);
  if (u.startsWith('/wp-content/')) return path.join(ROOT, 'site', u);
  if (u.startsWith('/')) return path.join(ROOT, u);
  return null;
};

const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory() && !/^(media|fonts)$/.test(f.name)) walk(p); else if (f.name === 'index.html') pages.push(p); } })(path.join(ROOT, 'nou'));

const refs = new Set();
const RX = /(?:src|data-src|href|content)="(\/[^"?]+\.(?:jpe?g|png))(?:\?[^"]*)?"|srcset="([^"]+)"|url\((\/[^)]+\.(?:jpe?g|png))\)/gi;
for (const p of pages) for (const m of fs.readFileSync(p, 'utf8').matchAll(RX)) {
  if (m[1]) refs.add(m[1]);
  if (m[3]) refs.add(m[3]);
  if (m[2]) m[2].split(',').map((x) => x.trim().split(/\s+/)[0]).filter((x) => /\.(jpe?g|png)$/i.test(x)).forEach((x) => refs.add(x));
}
for (const m of fs.readFileSync(path.join(ROOT, 'nou', 'style.css'), 'utf8').matchAll(/url\(["']?(\/[^)"']+\.(?:jpe?g|png))/gi)) refs.add(m[1]);

const enc = (src, dst, q, w) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', src, '-vf', `scale='min(${w},iw)':-2`, '-c:v', 'libwebp', '-quality', String(q), '-compression_level', '6', dst]);

let n = 0, before = 0, after = 0;
const mari = [];
for (const u of refs) {
  const src = local(u);
  if (!src || !fs.existsSync(src)) continue;
  const dst = src.replace(/\.(jpe?g|png)$/i, '.webp');
  if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) { before += fs.statSync(src).size; after += fs.statSync(dst).size; continue; }
  let ok = false;
  for (const w of [2000, 1600, 1200]) {
    for (const q of [82, 76, 70, 64, 58]) {
      try { enc(src, dst, q, w); } catch (e) { console.warn('  ! ffmpeg:', u, e.message.split('\n')[0]); break; }
      if (fs.statSync(dst).size <= MAX) { ok = true; break; }
    }
    if (ok) break;
  }
  if (!fs.existsSync(dst)) continue;
  if (!ok) mari.push(`${Math.round(fs.statSync(dst).size / 1024)} KB ${u}`);
  n++; before += fs.statSync(src).size; after += fs.statSync(dst).size;
}
console.log(`WebP: ${refs.size} imagini raster referite · ${n} convertite acum · ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
if (mari.length) console.log('Peste 200 KB și după micșorare:\n' + mari.join('\n'));
