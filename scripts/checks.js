// Reguli de verificare pentru observațiile SEO: rulează pe site-ul live și spun dacă problema mai apare.
// Tipuri: text_absent, text_present, regex_absent, regex_present, meta {camp, op, valoare}, not_in_sitemap, all, any, manual.
const { ORIGIN, UA, decodeEntities, decodeCfEmail } = require('./lib');

// Cloudflare ascunde emailurile în HTML: le decodăm ca să poată fi căutate ca text.
const revealEmails = (h) => h
  .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">[^<]*<\/span>/g, (_, hex) => decodeCfEmail(hex))
  .replace(/\/cdn-cgi\/l\/email-protection#([0-9a-f]+)/g, (_, hex) => 'mailto:' + decodeCfEmail(hex));

const cache = new Map();
async function page(url) {
  if (cache.has(url)) return cache.get(url);
  const p = fetch(url + (url.includes('?') ? '&' : '?') + 'nocache=' + Date.now(), { headers: { 'User-Agent': UA, 'Cache-Control': 'no-cache' } })
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status} pe ${url}`))))
    .then(revealEmails);
  cache.set(url, p);
  setTimeout(() => cache.delete(url), 30000);
  return p;
}
const short = (u) => (u || '').replace(ORIGIN, '') || '/';

async function run(c) {
  switch (c.tip) {
    case 'text_absent':
    case 'text_present': {
      const has = (await page(c.url)).includes(c.text);
      const ok = c.tip === 'text_absent' ? !has : has;
      return { ok, detalii: [`„${c.text}” ${has ? 'apare' : 'nu apare'} pe ${short(c.url)}`] };
    }
    case 'regex_absent':
    case 'regex_present': {
      const m = (await page(c.url)).match(new RegExp(c.regex));
      const ok = c.tip === 'regex_absent' ? !m : !!m;
      return { ok, detalii: [m ? `găsit pe ${short(c.url)}: ${m[0].slice(0, 120)}` : `nimic de forma /${c.regex}/ pe ${short(c.url)}`] };
    }
    case 'meta': {
      const h = await page(c.url);
      const v = c.camp === 'title'
        ? decodeEntities((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim()
        : decodeEntities((h.match(/<meta[^>]+name="description"[^>]*content="([^"]*)"/) || [])[1] || '');
      const ok = c.op === 'exists' ? !!v : c.op === 'max' ? v.length <= c.valoare : v.length >= c.valoare;
      return { ok, detalii: [`${c.camp} pe ${short(c.url)}: ${v ? `${v.length} caractere – „${v.slice(0, 90)}”` : 'lipsă'}`] };
    }
    case 'not_in_sitemap': {
      const idx = await page(ORIGIN + '/sitemap_index.xml');
      const maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const all = (await Promise.all(maps.map(page))).join('\n');
      const has = all.includes(`<loc>${c.url}</loc>`);
      return { ok: !has, detalii: [`${short(c.url)} ${has ? 'e încă' : 'nu mai e'} în sitemap`] };
    }
    case 'all':
    case 'any': {
      const r = await Promise.all(c.checks.map(run));
      return { ok: c.tip === 'all' ? r.every((x) => x.ok) : r.some((x) => x.ok), detalii: r.flatMap((x) => x.detalii) };
    }
    case 'manual':
      throw new Error('Regula e manuală: se confirmă din panou');
    default:
      throw new Error('Tip de regulă necunoscut: ' + c.tip);
  }
}

module.exports = { run };
