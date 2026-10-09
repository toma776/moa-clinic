// Crawl pentru toate URL-urile din sitemap-urile moaclinic.ro.
// Scrie data/pages.json (SEO per pagină) și source/site/<slug>.json (textul, titlurile, întrebările, imaginile, linkurile fiecărei pagini).
// Rulare: npm run crawl
const fs = require('fs');
const path = require('path');
const { ORIGIN, UA, get, text, decodeEntities, decodeCfEmail } = require('./lib');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'pages.json');
const SRC = path.join(ROOT, 'source', 'site');
const CONC = 6;

const SITEMAPS = [['page', 'Pagina'], ['post', 'Articol'], ['category', 'Categorie']];
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`, 'i')) || [])[1];
const metaName = (h, n) => decodeEntities((h.match(new RegExp(`<meta[^>]+name="${n}"[^>]*content="([^"]*)"`, 'i')) || [])[1] || '');
const metaProp = (h, n) => decodeEntities((h.match(new RegExp(`<meta[^>]+property="${n}"[^>]*content="([^"]*)"`, 'i')) || [])[1] || '');
const slugOf = (p) => (p.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home');

async function sitemap(name) {
  const xml = await get(`${ORIGIN}/${name}-sitemap.xml`);
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((u) => ({
    url: u[1].match(/<loc>([^<]+)/)[1],
    lastmod: ((u[1].match(/<lastmod>([^<]+)/) || [])[1] || '').slice(0, 10) || null,
  }));
}

// Conținutul principal: <main>, fără blocul de contact repetat în subsolul fiecărei pagini.
function mainHtml(html) {
  let m = html.slice(Math.max(0, html.indexOf('<main')), html.indexOf('</main>') > 0 ? html.indexOf('</main>') : undefined);
  const cut = m.search(/<h2[^>]*>\s*Contact\s*<\/h2>|Date de Contact/);
  if (cut > 0) m = m.slice(0, cut);
  return m
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/g, '')
    .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">[^<]*<\/span>/g, (_, hex) => decodeCfEmail(hex));
}

// Întrebări din conținut: un titlu care se termină cu „?” + primele paragrafe de după el.
function questions(m) {
  const out = [];
  const re = /<h([2-4])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[1-4][\s>]|$)/g;
  let x;
  while ((x = re.exec(m))) {
    const q = text(x[2]);
    if (!/\?\s*$/.test(q) || q.length < 8) continue;
    const paras = [...x[3].matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)].map((p) => text(p[2])).filter((t) => t.length > 20);
    const a = paras.join(' ').slice(0, 600);
    if (a) out.push({ q, a });
  }
  return out;
}

// tipurile schema.org de pe pagină + blocurile Service (nume, url), ca să vedem ce servicii declară fiecare pagină
function schemaInfo(html) {
  const types = new Set();
  const services = [];
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const walk = (o, top) => {
        if (Array.isArray(o)) return o.forEach((x) => walk(x, top));
        if (o && typeof o === 'object') {
          const t = [].concat(o['@type'] || []);
          t.forEach((x) => types.add(x));
          if (top && t.includes('Service')) services.push({ nume: o.name || o.hasOfferCatalog?.name || '', url: o.url || null });
          Object.values(o).forEach((x) => walk(x, false));
        }
      };
      const j = JSON.parse(m[1]);
      walk(j['@graph'] || j, true);
    } catch {
      types.add('JSON-LD invalid');
    }
  }
  return { types: [...types], services };
}

// Video-urile din pagină: <video> găzduite pe site (src / <source>, poster) + embed-uri externe (YouTube, Vimeo, TikTok, Instagram, Facebook).
// Pentru fiecare: titlul secțiunii în care apare (ultimul H1–H4 de dinainte), ca să știm unde trebuie pus la loc.
const EMBED_RE = /(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com|instagram\.com\/(?:p|reel)|facebook\.com\/[^"']*video)/i;
function videos(html) {
  const out = [];
  const headingBefore = (idx) => {
    const hs = [...html.slice(0, idx).matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/g)];
    return hs.length ? text(hs.at(-1)[2]) : null;
  };
  for (const m of html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)) {
    const tag = m[1], inner = m[2];
    const src = attr(tag, 'src') || attr(inner.match(/<source\b[^>]*>/)?.[0] || '', 'src') || attr(inner.match(/<a\b[^>]*>/)?.[0] || '', 'href');
    if (!src) continue;
    out.push({
      sursa: 'site',
      src: decodeEntities(src).split('?')[0].replace(/^https?:\/\/(www\.)?moaclinic\.ro/, ''),
      poster: attr(tag, 'poster') || null,
      latime: +attr(tag, 'width') || null,
      inaltime: +attr(tag, 'height') || null,
      fundal: /video-bg|autoplay/.test(tag) && /muted/.test(tag),
      sectiune: headingBefore(m.index),
    });
  }
  for (const m of html.matchAll(/<iframe\b[^>]*>/g)) {
    const src = attr(m[0], 'data-src') || attr(m[0], 'src') || '';
    if (EMBED_RE.test(src)) out.push({ sursa: 'embed', src: decodeEntities(src), poster: null, latime: +attr(m[0], 'width') || null, inaltime: +attr(m[0], 'height') || null, fundal: false, sectiune: headingBefore(m.index) });
  }
  for (const m of html.matchAll(/<a\b[^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch[^"]+|youtu\.be\/[^"]+|vimeo\.com\/\d+[^"]*))"/g)) {
    out.push({ sursa: 'link', src: decodeEntities(m[1]), poster: null, latime: null, inaltime: null, fundal: false, sectiune: headingBefore(m.index) });
  }
  return out.filter((v, i, a) => a.findIndex((x) => x.src === v.src) === i);
}

async function fetchPage(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
    const html = res.status === 200 ? await res.text() : '';
    return { status: res.status, ms: Date.now() - t0, html, location: res.headers.get('location') };
  } catch (e) {
    return { status: 0, ms: Date.now() - t0, html: '', eroare: e.message };
  }
}

function analyze(entry, r) {
  const { url } = entry;
  const p = {
    url,
    path: new URL(url).pathname,
    tip: entry.tip,
    sectiune: entry.tip === 'Articol' ? 'blog' : new URL(url).pathname.split('/').filter(Boolean)[0] || '(home)',
    sitemap: entry.sitemap,
    lastmod: entry.lastmod,
    status: r.status,
    ms: r.ms,
    kb: Math.round((Buffer.byteLength(r.html) / 1024) * 10) / 10,
    probleme: [],
  };
  if (r.status !== 200) {
    p.probleme.push(`HTTP ${r.status}${r.location ? ' → ' + r.location : ''}`);
    return { page: p, src: null };
  }
  const h = r.html;
  const m = mainHtml(h);
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((x) => text(x[1])).filter(Boolean);
  const imgs = [...m.matchAll(/<img\b[^>]*>/g)]
    .map((x) => ({ src: attr(x[0], 'data-src') || attr(x[0], 'src'), alt: decodeEntities(attr(x[0], 'alt') ?? ''), w: attr(x[0], 'width'), h: attr(x[0], 'height') }))
    .filter((i) => i.src && !i.src.startsWith('data:'));
  const links = [...new Set([...m.matchAll(/<a\b[^>]*href="([^"#]+)"/g)].map((x) => x[1]).filter((u) => /^(https?:\/\/(www\.)?moaclinic\.ro)?\/(?!wp-|cdn-cgi)/.test(u)).map((u) => new URL(u, ORIGIN).pathname))];
  const body = text(m);
  // autorul: caseta „Conținut oferit de” stă sub blocul de contact, deci o căutăm în toată pagina;
  // plus autorul din schema (BlogPosting / Article) și pagina lui de autor din WordPress
  const author = (text(h).match(/Con[tț]inut oferit de:?\s*(Dr\.\s*[^\s]+\s+[^\s.,]+)/i) || [])[1] || null;
  let schemaAuthor = null;
  for (const m of h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      for (const o of j['@graph'] || [j]) if (/BlogPosting|Article/.test([].concat(o['@type']).join()) && o.author) schemaAuthor = { nume: o.author.name || null, url: o.author['@id'] || null };
    } catch {}
  }

  Object.assign(p, {
    title: decodeEntities((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim(),
    description: metaName(h, 'description'),
    h1: h1s[0] || '',
    h1_count: h1s.length,
    canonical: (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '',
    robots: metaName(h, 'robots'),
    lang: (h.match(/<html[^>]*lang="([^"]+)"/) || [])[1] || '',
    viewport: /<meta[^>]+name="viewport"/.test(h),
    og: !!metaProp(h, 'og:title'),
    publicat: metaProp(h, 'article:published_time').slice(0, 10) || null,
    modificat: metaProp(h, 'article:modified_time').slice(0, 10) || null,
    autor: author,
    autor_schema: schemaAuthor,
    cuvinte: body.split(/\s+/).filter(Boolean).length,
    schema: schemaInfo(h).types,
    schema_servicii: schemaInfo(h).services,
    imagini: imgs.length,
    img_fara_alt: imgs.filter((i) => !i.alt.trim()).length,
  });

  const P = p.probleme;
  if (!p.title) P.push('Fara title');
  else if (p.title.length > 65) P.push(`Title lung (${p.title.length})`);
  else if (p.title.length < 25) P.push(`Title scurt (${p.title.length})`);
  if (!p.description) P.push('Fara meta description');
  else if (p.description.length > 165) P.push(`Description lunga (${p.description.length})`);
  else if (p.description.length < 70) P.push(`Description scurta (${p.description.length})`);
  if (!p.h1_count) P.push('Fara H1');
  else if (p.h1_count > 1) P.push(`${p.h1_count} x H1`);
  if (!p.canonical) P.push('Fara canonical');
  else if (p.canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) P.push('Canonical diferit');
  if (/noindex/i.test(p.robots)) P.push('noindex');
  if (p.img_fara_alt) P.push(`Imagini fara alt (${p.img_fara_alt})`);
  if (p.cuvinte < 250 && p.tip !== 'Categorie') P.push(`Continut subtire (${p.cuvinte})`);

  const src = {
    url,
    path: p.path,
    tip: p.tip,
    title: p.title,
    h1: p.h1,
    description: p.description,
    publicat: p.publicat,
    modificat: p.modificat,
    autor: author,
    autor_schema: schemaAuthor,
    titluri: [...m.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/g)].map((x) => ({ n: +x[1], t: text(x[2]) })).filter((x) => x.t),
    intrebari: questions(m),
    imagini: imgs,
    video: videos(h),
    linkuri: links,
    // textele butoanelor (CTA) din toată pagina, inclusiv header/footer
    cta: [...h.matchAll(/<a\b[^>]*class="[^"]*\bbutton\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => text(x[1])).filter((t) => t && t.length < 60),
    text: body,
  };
  return { page: p, src };
}

async function main() {
  const t0 = Date.now();
  const entries = [];
  for (const [name, tip] of SITEMAPS) {
    try {
      for (const u of await sitemap(name)) entries.push({ ...u, tip, sitemap: `${name}-sitemap.xml` });
    } catch (e) {
      console.warn('  ! sitemap', name, e.message);
    }
  }
  console.log(`Crawl: ${entries.length} URL-uri din sitemap...`);
  fs.mkdirSync(SRC, { recursive: true });

  const pages = [];
  const linkMap = new Map(); // path -> pagini din care e legat
  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const e = entries[i++];
      const { page, src } = analyze(e, await fetchPage(e.url));
      pages.push(page);
      if (src) {
        fs.writeFileSync(path.join(SRC, slugOf(page.path) + '.json'), JSON.stringify(src, null, 1));
        for (const l of src.linkuri) (linkMap.get(l) || linkMap.set(l, new Set()).get(l)).add(page.path);
      }
      if (pages.length % 25 === 0) console.log(`  ${pages.length}/${entries.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  // Mărimea fiecărui video găzduit pe site (HEAD), scrisă înapoi în source/site/*.json
  const vidFiles = fs.readdirSync(SRC).map((f) => [f, JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'))]).filter(([, s]) => s.video?.length);
  const sizes = new Map();
  for (const v of new Set(vidFiles.flatMap(([, s]) => s.video.filter((x) => x.sursa === 'site').map((x) => x.src)))) {
    try {
      const r = await fetch(ORIGIN + encodeURI(v), { method: 'HEAD', headers: { 'User-Agent': UA } });
      sizes.set(v, { status: r.status, mb: Math.round((+r.headers.get('content-length') / 1048576) * 10) / 10 || null, tip: r.headers.get('content-type') });
    } catch (e) {
      sizes.set(v, { status: 0 });
    }
  }
  for (const [f, s] of vidFiles) {
    s.video = s.video.map((v) => ({ ...v, ...(sizes.get(v.src) || {}) }));
    fs.writeFileSync(path.join(SRC, f), JSON.stringify(s, null, 1));
  }
  console.log(`Video: ${sizes.size} fișiere pe ${vidFiles.length} pagini`);

  // Duplicate de title / description
  for (const field of ['title', 'description']) {
    const by = {};
    pages.filter((p) => p[field]).forEach((p) => (by[p[field]] ||= []).push(p));
    Object.values(by).filter((g) => g.length > 1).forEach((g) => g.forEach((p) => p.probleme.push(`${field === 'title' ? 'Title' : 'Description'} duplicat (${g.length})`)));
  }

  // Linkuri interne spre pagini care nu sunt în sitemap: verificăm statusul.
  const known = new Set(pages.map((p) => p.path));
  const extra = [...linkMap.keys()].filter((l) => !known.has(l) && !known.has(l + '/'));
  console.log(`Verific ${extra.length} linkuri interne din afara sitemap-ului...`);
  const linkuri_externe_sitemap = [];
  for (let j = 0; j < extra.length; j += CONC) {
    const batch = extra.slice(j, j + CONC);
    const res = await Promise.all(batch.map((l) => fetchPage(ORIGIN + l)));
    batch.forEach((l, k) => linkuri_externe_sitemap.push({ path: l, status: res[k].status, redirect: res[k].location || null, din: [...linkMap.get(l)] }));
  }

  pages.sort((a, b) => a.path.localeCompare(b.path));
  const out = {
    site: ORIGIN,
    crawled_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    durata_ms: Date.now() - t0,
    pages,
    linkuri: linkuri_externe_sitemap.sort((a, b) => b.status - a.status),
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  const bad = linkuri_externe_sitemap.filter((l) => l.status >= 400 || !l.status).length;
  console.log(`Gata: ${pages.length} pagini · ${pages.filter((p) => p.probleme.length).length} cu probleme · ${bad} linkuri rupte · ${Math.round(out.durata_ms / 1000)} s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
