// Fișierele pentru motoarele de căutare și asistenții AI, generate din paginile /nou/ deja construite:
//   nou/sitemap.xml  – toate paginile indexabile, cu adresa canonical (domeniul final) și data modificării
//   nou/robots.txt   – varianta de producție (crawlerele AI permise), cu adresa sitemap-ului
//   nou/llms.txt     – rezumatul clinicii și legăturile spre versiunile .md ale paginilor
//   nou/**/index.md  – conținutul principal al fiecărei pagini, în Markdown (fără meniu, footer, formular)
// Toate adresele sunt pe domeniul final (https://moaclinic.ro, fără /nou): la lansare, /nou/ devine rădăcina site-ului.
// Rulează după build: node scripts/seo-files.js
const fs = require('fs');
const path = require('path');
const { ORIGIN, finalPath, finalUrl } = require('./seo');

const ROOT = path.join(__dirname, '..');
const NOU = path.join(ROOT, 'nou');
const TODAY = new Date().toISOString().slice(0, 10);

const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory() && !/^(media|fonts)$/.test(f.name)) walk(p); else if (f.name === 'index.html') pages.push(p); } })(NOU);

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#160': ' ', '#39': "'", hellip: '…', ndash: '–', mdash: '—', rsaquo: '›', laquo: '«', raquo: '»' };
const dec = (s) => s.replace(/&(#?\w+);/g, (m, e) => (ENT[e] ?? (e[0] === '#' ? String.fromCharCode(e[1] === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : m)));
const abs = (u) => (/^https?:|^mailto:|^tel:/.test(u) ? u : u.startsWith('#') ? null : u.startsWith('/') ? finalUrl(u) : null);

// HTML → Markdown, doar pentru ce apare în <main> (titluri, paragrafe, liste, tabele, linkuri, imagini, întrebări)
function md(html) {
  html = html
    .replace(/<(script|style|svg|form|button|noscript|template|iframe|video)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<section[^>]*\bid="programare"[\s\S]*?<\/section>/i, '')
    .replace(/<nav[^>]*class="[^"]*crumbs[\s\S]*?<\/nav>/i, '')
    .replace(/<([a-z0-9]+)\b[^>]*\bhidden\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => (/^<(section|div|p|span|small|li|a)\b[^>]*\shidden(?=[\s>=])/i.test(m) ? '' : m))
    .replace(/<!--[\s\S]*?-->/g, '');
  const inline = (s) => dec(s
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<img\b[^>]*?alt="([^"]*)"[^>]*?(?:data-src|src)="([^"]+)"[^>]*>/gi, (m, alt, src) => (alt ? `![${alt}](${abs(src) || src})` : ''))
    .replace(/<img\b[^>]*?(?:data-src|src)="([^"]+)"[^>]*?alt="([^"]*)"[^>]*>/gi, (m, src, alt) => (alt ? `![${alt}](${abs(src) || src})` : ''))
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (m, h, t) => { const txt = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); const u = abs(dec(h)); return txt ? (u ? `[${txt}](${u})` : txt) : ''; })
    .replace(/<(b|strong)\b[^>]*>([\s\S]*?)<\/\1>/gi, (m, t, x) => (x.trim() ? `**${x.trim()}**` : ''))
    .replace(/<(i|em)\b[^>]*>([\s\S]*?)<\/\1>/gi, (m, t, x) => (x.trim() ? `*${x.trim()}*` : ''))
    .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();
  const out = [];
  // blocurile, în ordinea din pagină
  const RX = /<(h[1-4])\b[^>]*>([\s\S]*?)<\/\1>|<(p|blockquote|figcaption|address)\b[^>]*>([\s\S]*?)<\/\3>|<(ul|ol)\b[^>]*>([\s\S]*?)<\/\5>|<table\b[^>]*>([\s\S]*?)<\/table>|<summary\b[^>]*>([\s\S]*?)<\/summary>|<dl\b[^>]*>([\s\S]*?)<\/dl>/gi;
  for (const m of html.matchAll(RX)) {
    if (m[1]) { const t = inline(m[2]); if (t) out.push(`${'#'.repeat(+m[1][1])} ${t}`); }
    else if (m[3]) { const t = inline(m[4]); if (t) out.push(m[3] === 'blockquote' ? `> ${t}` : t); }
    else if (m[5]) {
      const items = [...m[6].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((x) => inline(x[1])).filter(Boolean);
      if (items.length) out.push(items.map((t, i) => (m[5] === 'ol' ? `${i + 1}. ` : '- ') + t).join('\n'));
    } else if (m[7]) {
      const rows = [...m[7].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) => [...r[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => inline(c[1]).replace(/\|/g, '/'))).filter((r) => r.length);
      if (rows.length) { const n = Math.max(...rows.map((r) => r.length)); const pad = (r) => [...r, ...Array(n - r.length).fill('')]; out.push([`| ${pad(rows[0]).join(' | ')} |`, `|${' --- |'.repeat(n)}`, ...rows.slice(1).map((r) => `| ${pad(r).join(' | ')} |`)].join('\n')); }
    } else if (m[8]) { const t = inline(m[8]); if (t) out.push(`**${t}**`); }
    else if (m[9]) {
      const pairs = [...m[9].matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)].map((x) => `- **${inline(x[1])}:** ${inline(x[2])}`);
      if (pairs.length) out.push(pairs.join('\n'));
    }
  }
  // fără repetiții consecutive (aceeași frază în două variante de afișare)
  return out.filter((b, i) => b !== out[i - 1]).join('\n\n');
}

const meta = (h, re) => dec((h.match(re) || [])[1] || '');
const entries = [];
for (const file of pages) {
  const h = fs.readFileSync(file, 'utf8');
  if (/<meta name="robots" content="noindex/.test(h)) continue;
  const fp = finalPath(file);
  const canon = meta(h, /rel="canonical" href="([^"]+)"/) || ORIGIN + fp;
  const title = meta(h, /<title>([^<]*)<\/title>/);
  const desc = meta(h, /<meta name="description" content="([^"]*)"/);
  const mod = (h.match(/"dateModified":"(\d{4}-\d{2}-\d{2})/) || [])[1] || TODAY;
  const main = (h.match(/<main\b[^>]*>([\s\S]*?)<\/main>/) || [])[1] || '';
  const body = md(main);
  const front = ['---', `title: ${JSON.stringify(title)}`, `description: ${JSON.stringify(desc)}`, `url: ${canon}`, 'lang: ro', `updated: ${mod}`, '---', ''].join('\n');
  fs.writeFileSync(path.join(path.dirname(file), 'index.md'), front + '\n' + body + '\n');
  const isArt = /"@type":"BlogPosting"/.test(h);
  entries.push({ fp, canon, title, desc, mod, isArt, md: canon.replace(/\/?$/, '/') + 'index.md' });
}
entries.sort((a, b) => (a.fp === '/' ? -1 : b.fp === '/' ? 1 : a.fp.localeCompare(b.fp)));

// canonical-ul trebuie să fie chiar adresa paginii (self-canonical) – altfel sitemap-ul și canonical-ul nu se potrivesc
const nepotrivite = entries.filter((e) => e.canon !== ORIGIN + e.fp);
if (nepotrivite.length) console.warn('  ! canonical diferit de adresa paginii:\n' + nepotrivite.map((e) => `    ${e.fp} → ${e.canon}`).join('\n'));

fs.writeFileSync(path.join(NOU, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${e.canon}</loc><lastmod>${e.mod}</lastmod></url>`).join('\n')}
</urlset>
`);

fs.writeFileSync(path.join(NOU, 'robots.txt'), `# MOA Clinic – robots.txt de producție (moaclinic.ro)
User-agent: *
Disallow: /manage/
Disallow: /api/
Disallow: /data/
Disallow: /vechi

# Crawlere AI (GEO) – permise
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`);

// llms.txt: secțiunile, după tipul paginii (adresa)
const grup = (e) => (e.fp === '/' ? 'Acasă'
  : e.isArt ? 'Articole (blog)'
  : e.fp.startsWith('/tratamente/') ? 'Tratamente'
  : e.fp.startsWith('/consultatii/') ? 'Consultații'
  : e.fp.startsWith('/longevitate/') ? 'Longevitate'
  : e.fp.startsWith('/medici/') ? 'Echipa medicală'
  : e.fp.startsWith('/documente-legale/') ? 'Legal'
  : 'Clinica, prețuri și contact');
const ORD = ['Acasă', 'Consultații', 'Tratamente', 'Longevitate', 'Clinica, prețuri și contact', 'Echipa medicală', 'Articole (blog)', 'Legal'];
const linie = (e) => `- [${e.title.split(' | ')[0]}](${e.md}): ${e.desc}`;
fs.writeFileSync(path.join(NOU, 'llms.txt'), `# MOA Clinic

> Clinică de estetică medicală, chirurgie plastică, dermatologie și medicină regenerativă (longevitate) din București, Str. Ștefan Mihăileanu 35, Sector 2, parte a grupului medical Oxxygene. Coordonată de Dr. Adrian Stănescu, medic primar geriatrie și gerontologie. Prețurile tuturor serviciilor sunt publice pe site.

Contact: telefon / WhatsApp +40 743 056 605 · office@moaclinic.ro · ${ORIGIN}/contact/
Fiecare legătură de mai jos duce la versiunea Markdown a paginii (conținutul principal, fără meniu și formulare).

${ORD.map((g) => { const xs = entries.filter((e) => grup(e) === g); return xs.length ? `## ${g}\n\n${xs.map(linie).join('\n')}\n` : ''; }).filter(Boolean).join('\n')}`);

console.log(`SEO: sitemap.xml (${entries.length} adrese) · robots.txt · llms.txt · ${entries.length} fișiere .md`);
