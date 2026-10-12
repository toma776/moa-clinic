// Conținutul articolelor de blog de pe site-ul actual, structurat pentru pagina nouă de articol:
// blocuri în ordine (h2, h3, p, listă, imagine, tabel, citat), fără caseta autorului și fără formulare.
// Imaginile se descarcă local în site/wp-content/… Scrie data/articole.json. Rulare: npm run articole [-- --only <id>]
const fs = require('fs');
const path = require('path');
const { get, decodeEntities, ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const OUT = path.join(ROOT, 'data', 'articole.json');
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const T = (s) => decodeEntities(String(s).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function parse(html) {
  let h = html.slice(html.indexOf('entry-content'));
  const stop = ['cap-author-box', 'class="blog-share', 'id="comments"', '</article>'].map((m) => h.indexOf(m)).filter((i) => i > 0);
  h = h.slice(h.indexOf('>') + 1, Math.min(...stop, h.length)).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/g, '');
  const marks = [...h.matchAll(/<(h[2-4]|p|li|img|tr|blockquote)\b([^>]*)>/g)];
  const raw = [];
  marks.forEach((m, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].index : h.length;
    const seg = h.slice(m.index + m[0].length, end);
    if (m[1] === 'img') {
      const src = (m[2].match(/data-src="([^"]+)"/) || m[2].match(/\ssrc="(https?:[^"]+)"/) || [])[1];
      if (src && !/data:image|\.svg$/.test(src)) raw.push({ t: 'img', src, alt: decodeEntities((m[2].match(/alt="([^"]*)"/) || [])[1] || '') });
      return;
    }
    const x = T(seg.split(/<(?:div|table|section|ul|ol)\b/)[0]);
    if (!x) return;
    const ord = /<ol\b[^>]*>\s*(<li|$)/.test(h.slice(Math.max(0, m.index - 80), m.index + 3));
    raw.push({ t: m[1] === 'tr' ? 'tr' : m[1], x, ord });
  });
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    const b = raw[i];
    if (b.t === 'li') { const items = [], ord = b.ord; while (raw[i]?.t === 'li') items.push(raw[i++].x.replace(/;$/, '')); i--; out.push({ t: ord ? 'ol' : 'ul', items }); continue; }
    if (b.t === 'tr') { const rows = []; while (raw[i]?.t === 'tr') rows.push(raw[i++].x); i--; out.push({ t: 'tabel', rows }); continue; }
    if (b.t === 'img') { if (out[out.length - 1]?.src !== b.src) out.push(b); continue; }
    out.push({ t: b.t === 'blockquote' ? 'citat' : b.t, x: b.x });
  }
  // footer-ul site-ului vechi (Contact, Telefon, Mail) nu face parte din articol
  const cut = out.findIndex((b) => b.t === 'h2' && /^(contact|date de contact)$/i.test(b.x));
  return cut >= 0 ? out.slice(0, cut) : out;
}

async function localImg(src) {
  if (!src.startsWith(ORIGIN + '/wp-content/')) return src;
  const rel = src.slice(ORIGIN.length);
  const f = path.join(ROOT, 'site', rel);
  if (!fs.existsSync(f)) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, await get(src, { binary: true })); }
  return rel;
}

(async () => {
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { articole: {} };
  const out = { generat: new Date().toISOString().slice(0, 10), articole: only ? prev.articole : {} };
  for (const a of D.articole.filter((x) => !only || only.includes(x.id))) {
    try {
      const blocuri = parse(await get(a.url));
      for (const b of blocuri) if (b.t === 'img') b.src = await localImg(b.src);
      out.articole[a.id] = { url: a.url, blocuri };
      console.log(`  ✓ ${a.id}: ${blocuri.length} blocuri (${['h2', 'h3', 'p', 'ul', 'ol', 'img', 'tabel'].map((t) => `${t} ${blocuri.filter((b) => b.t === t).length}`).join(', ')})`);
    } catch (e) { console.log(`  ! ${a.id}: ${e.message}`); }
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`Gata: ${Object.keys(out.articole).length} articole → data/articole.json`);
})();
