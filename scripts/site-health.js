// Starea site-ului moaclinic.ro (live), din crawl: 5 arii (SEO tehnic, date structurate, conținut, consecvența brandului,
// performanță), plus verificări de bază (robots, sitemap, HTTPS, redirecturi, GTM…).
// Citește data/pages.json + source/site + data/entitati.json; scrie data/site-health.json.
// Rulare: npm run health   (panoul îl rulează cu „Rulează analiza acum”, după un crawl nou)
const fs = require('fs');
const path = require('path');
const { ORIGIN, UA } = require('./lib');

const ROOT = path.join(__dirname, '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PAGES = read('data/pages.json');
const D = read('data/entitati.json');
const SRC = new Map(fs.readdirSync(path.join(ROOT, 'source', 'site')).map((f) => {
  const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'source', 'site', f), 'utf8'));
  return [s.path, s];
}));
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const monthsAgo = (d) => (d ? (Date.now() - new Date(d)) / (30.44 * 864e5) : Infinity);

async function probe(url, opts = {}) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual', ...opts });
    return { status: r.status, location: r.headers.get('location'), text: opts.method === 'HEAD' ? '' : await r.text() };
  } catch (e) {
    return { status: 0, eroare: e.message, text: '' };
  }
}

async function main() {
  const t0 = Date.now();
  const pagini = PAGES.pages.map((p) => {
    const s = SRC.get(p.path);
    const pr = [];
    const add = (arie, cod, nivel, mesaj) => pr.push({ arie, cod, nivel, mesaj });
    if (p.status === 200) {
      // SEO tehnic
      if (!p.title) add('tehnic', 'fara-title', 'grav', 'lipsește title');
      else if (p.title.length > 65) add('tehnic', 'title-lung', 'optim', `${p.title.length} caractere`);
      else if (p.title.length < 25) add('tehnic', 'title-scurt', 'optim', `${p.title.length} caractere`);
      if (p.probleme.some((x) => /^Title duplicat/.test(x))) add('tehnic', 'title-duplicat', 'grav', p.title);
      if (!p.description) add('tehnic', 'fara-description', 'grav', 'lipsește meta description');
      else if (p.description.length > 165) add('tehnic', 'description-lung', 'optim', `${p.description.length} caractere`);
      else if (p.description.length < 70) add('tehnic', 'description-scurt', 'optim', `${p.description.length} caractere`);
      if (p.probleme.some((x) => /^Description duplicat/.test(x))) add('tehnic', 'description-duplicat', 'optim', p.description.slice(0, 80));
      if (!p.h1_count) add('tehnic', 'fara-h1', 'grav', 'fără H1');
      else if (p.h1_count > 1) add('tehnic', 'mai-multe-h1', 'optim', `${p.h1_count} H1`);
      if (!p.canonical) add('tehnic', 'fara-canonical', 'grav', 'fără canonical');
      else if (p.probleme.includes('Canonical diferit')) add('tehnic', 'canonical-diferit', 'optim', p.canonical);
      if (p.lang !== 'ro-RO') add('tehnic', 'lang', 'optim', p.lang || 'lipsă');
      if (!p.viewport) add('tehnic', 'viewport', 'grav', 'fără meta viewport');
      if (!p.og) add('tehnic', 'fara-og', 'optim', 'fără og:title');
      if (p.img_fara_alt) add('tehnic', 'img-alt', 'optim', `${p.img_fara_alt} din ${p.imagini} imagini`);
      const redirs = PAGES.linkuri.filter((l) => l.status >= 300 && l.status < 400 && l.din.includes(p.path));
      if (redirs.length) add('tehnic', 'link-redirect', 'optim', redirs.map((l) => l.path).join(', '));
      // Date structurate
      const sch = p.schema || [];
      if (!sch.length) add('schema', 'fara-jsonld', 'grav', 'fără JSON-LD');
      if (sch.includes('JSON-LD invalid')) add('schema', 'jsonld-invalid', 'grav', 'un bloc nu se poate citi');
      if (!sch.includes('BreadcrumbList') && p.path !== '/') add('schema', 'fara-breadcrumb', 'optim', 'fără BreadcrumbList');
      const sv = p.schema_servicii || [];
      const same = (u) => u && u.replace(/^https?:\/\/(www\.)?moaclinic\.ro/, '').replace(/\/?$/, '/') === p.path;
      const strangers = sv.filter((x) => !same(x.url));
      if (strangers.length) add('schema', 'schema-straina', 'grav', `${strangers.length} blocuri Service ale altor pagini: ${strangers.map((x) => x.nume).join(', ')}`);
      if (p.tip === 'Pagina' && D.servicii.some((x) => x.url === p.url) && !sv.some((x) => same(x.url))) add('schema', 'serviciu-fara-schema', 'optim', `pagina e marcată ca ${sch.includes('Article') ? 'Article' : sch[0] || '—'}, fără Service propriu`);
      if ((s?.intrebari.length || 0) >= 3 && !sch.includes('FAQPage')) add('schema', 'fara-faq', 'info', `${s.intrebari.length} întrebări în conținut, fără FAQPage`);
      if (p.path === '/' && !sch.includes('MedicalClinic')) add('schema', 'fara-org', 'grav', 'homepage fără MedicalClinic');
      // Conținut
      if (p.cuvinte < 250 && p.tip !== 'Categorie') add('continut', 'continut-subtire', 'optim', `${p.cuvinte} cuvinte`);
      if (p.tip === 'Articol' && !s?.autor) add('continut', 'fara-autor', 'info', 'articol fără autor');
      // Consecvența brandului (doar în conținut, fără meniu/footer)
      const t = s ? s.text : '';
      const nt = norm(t);
      if (/\bmoa clinica\b|\bclinica moa\b/i.test(t)) add('brand', 'nume', 'optim', (t.match(/\b(Moa Clinica|Clinica Moa|Clinica MOA)\b/) || [])[0]);
      if (/\bmoa regenerative\b(?! by)/i.test(t)) add('brand', 'nume-incomplet', 'info', '„MOA Regenerative” fără „by Oxxygene”');
      if (/www\.moa\.ro/.test(t)) add('brand', 'domeniu', 'grav', 'www.moa.ro');
      const phones = [...new Set((t.match(/\b0\d{3}[\s.]?\d{3}[\s.]?\d{3}\b/g) || []).map((x) => x.replace(/\D/g, '')))].filter((x) => x !== '0743056605');
      if (phones.length) add('brand', 'telefon', 'grav', phones.join(', '));
      if (/gmail\.com/.test(t)) add('brand', 'email', 'optim', (t.match(/\S+@gmail\.com/) || [])[0]);
      if (/simulare magnetica/.test(nt)) add('brand', 'typo', 'optim', 'Simulare magnetică');
      if (s?.cta.some((c) => /^programeaza-te!?$/i.test(c))) add('brand', 'cta', 'info', s.cta.filter((c) => /^programeaza-te!?$/i.test(c))[0]);
      // Performanță
      // măsurat din crawl (6 cereri în paralel, de pe calculatorul local)
      if (p.ms > 2500) add('performanta', 'lent', 'grav', `${p.ms} ms`);
      else if (p.ms > 1200) add('performanta', 'lent', 'optim', `${p.ms} ms`);
      if (p.kb > 250) add('performanta', 'html-mare', 'optim', `${p.kb} KB`);
    }
    return { path: p.path, url: p.url, tip: p.tip, status: p.status, ms: p.ms, kb: p.kb, schema: p.schema || [], probleme: pr };
  });

  // pagini lipsă: linkuri interne cu eroare
  const lipsa = PAGES.linkuri.filter((l) => l.status >= 400 || l.status === 0).map((l) => ({ path: l.path, status: l.status, din: l.din }));
  const redirecturi = PAGES.linkuri.filter((l) => l.status >= 300 && l.status < 400).map((l) => ({ path: l.path, spre: l.redirect, din: l.din }));

  // blog
  const art = D.articole || [];
  const blog = {
    total: art.length,
    fara_autor: art.filter((a) => !a.autor).map((a) => ({ path: new URL(a.url).pathname, data: a.data })),
    invechite: art.filter((a) => monthsAgo(a.modificat || a.data) > 12).map((a) => ({ path: new URL(a.url).pathname, data: (a.modificat || a.data || '').slice(0, 10) })),
  };
  const servicii_fara_pret = (D.servicii || []).filter((s) => !s.preturi.length).map((s) => ({ nume: s.nume, url: s.url }));

  // verificări de bază
  const [robots, sm, http, www, home] = await Promise.all([
    probe(ORIGIN + '/robots.txt'),
    probe(ORIGIN + '/sitemap_index.xml'),
    probe('http://moaclinic.ro/', { method: 'HEAD' }),
    probe('https://www.moaclinic.ro/', { method: 'HEAD' }),
    probe(ORIGIN + '/'),
  ]);
  const h = home.text;
  const gtmId = (h.match(/GTM-[A-Z0-9]+/) || [])[0];
  const gtm = gtmId ? await probe(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`) : { text: '' };
  const cookie = /cookieyes/i.test(h) ? 'CookieYes, în HTML' : /cookieyes/i.test(gtm.text) ? `CookieYes, încărcat prin GTM (${gtmId}) – legat de domeniu, nu apare pe localhost` : null;
  const lansare = [
    { ok: robots.status === 200, mesaj: 'robots.txt accesibil', detaliu: `HTTP ${robots.status}` },
    { ok: /sitemap/i.test(robots.text), mesaj: 'robots.txt indică sitemap-ul', detaliu: /sitemap/i.test(robots.text) ? 'da' : 'lipsește linia Sitemap: (Google îl găsește doar dacă e trimis în Search Console)' },
    { ok: sm.status === 200, mesaj: 'Sitemap index (Rank Math)', detaliu: `HTTP ${sm.status} · ${PAGES.pages.length} URL-uri` },
    { ok: PAGES.pages.every((p) => p.status === 200), mesaj: 'Toate URL-urile din sitemap răspund 200', detaliu: PAGES.pages.filter((p) => p.status !== 200).map((p) => `${p.path} → ${p.status}`).join(', ') || 'da' },
    { ok: http.status === 301 && /^https:\/\/moaclinic\.ro\/?$/.test(http.location || ''), mesaj: 'HTTP → HTTPS cu 301', detaliu: `${http.status} → ${http.location}` },
    { ok: www.status === 301 && /^https:\/\/moaclinic\.ro\/?$/.test(www.location || ''), mesaj: 'www → fără www cu 301', detaliu: `${www.status} → ${www.location}` },
    { ok: /<link rel="icon"/.test(h), mesaj: 'Favicon', detaliu: 'cropped-Instagram-logo' },
    { ok: /googletagmanager\.com\/gtm\.js/.test(h), mesaj: 'Google Tag Manager', detaliu: (h.match(/GTM-[A-Z0-9]+/) || ['lipsă'])[0] },
    { ok: !!cookie, mesaj: 'Banner de cookies (GDPR)', detaliu: cookie || 'lipsă' },
    { ok: /MedicalClinic/.test(h), mesaj: 'Schema MedicalClinic pe homepage', detaliu: 'două blocuri, cu date diferite (vezi Entități › Observații)' },
    { ok: lipsa.length === 0, mesaj: 'Fără linkuri interne rupte', detaliu: `${lipsa.length} rupte · ${redirecturi.length} cu redirect` },
    { ok: /anpc\.ro/.test(h), mesaj: 'Linkuri ANPC / SOL în footer', detaliu: 'obligatorii pentru comerț online' },
  ];

  const out = {
    site: ORIGIN,
    generat_la: new Date().toISOString().slice(0, 16).replace('T', ' '),
    crawl_la: PAGES.crawled_at,
    durata_ms: PAGES.durata_ms + (Date.now() - t0),
    pagini,
    lipsa,
    redirecturi,
    blog,
    servicii_fara_pret,
    lansare,
  };
  fs.writeFileSync(path.join(ROOT, 'data', 'site-health.json'), JSON.stringify(out, null, 1));
  const n = (a) => pagini.filter((p) => p.probleme.some((x) => x.arie === a)).length;
  console.log(`Gata: data/site-health.json · tehnic ${n('tehnic')} · schema ${n('schema')} · conținut ${n('continut')} · brand ${n('brand')} · performanță ${n('performanta')} pagini cu probleme · verificări ${lansare.filter((l) => l.ok).length}/${lansare.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
