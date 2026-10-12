// Imaginea principală a fiecărui articol de blog (prima imagine de conținut din pagină), descărcată local
// în site/wp-content/… (aceeași cale ca pe site). Scrie data/blog-media.json. Rulare: npm run blog-media
const fs = require('fs');
const path = require('path');
const { get, ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const OUT = path.join(ROOT, 'data', 'blog-media.json');

(async () => {
  const out = {};
  for (const a of D.articole) {
    const slug = new URL(a.url).pathname.split('/').filter(Boolean).pop();
    const f = path.join(ROOT, 'source', 'site', slug + '.json');
    if (!fs.existsSync(f)) continue;
    const p = JSON.parse(fs.readFileSync(f, 'utf8'));
    const im = (p.imagini || []).find((i) => /\/wp-content\/uploads\//.test(i.src) && !/\.svg|logo|icon|avatar|gravatar/i.test(i.src) && (+i.w || 0) >= 400);
    if (!im) continue;
    const rel = im.src.startsWith(ORIGIN) ? im.src.slice(ORIGIN.length) : new URL(im.src).pathname;
    const local = path.join(ROOT, 'site', rel);
    try {
      if (!fs.existsSync(local)) { fs.mkdirSync(path.dirname(local), { recursive: true }); fs.writeFileSync(local, await get(im.src, { binary: true })); }
      out[a.id] = { img: rel, w: +im.w || null, h: +im.h || null, alt: im.alt || '' };
    } catch (e) { console.log('  !', a.id, e.message); }
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`Gata: ${Object.keys(out).length}/${D.articole.length} articole cu imagine → data/blog-media.json`);
})();
