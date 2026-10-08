// Extrage toate entitățile brandului MOA Clinic de pe moaclinic.ro într-un JSON structurat.
// Surse: homepage (conținut + schema.org JSON-LD + meniu), /preturi/, /echipa/, /abonamente/, sitemap-uri.
// Rulare: npm run extract  ->  data/entitati.json
const fs = require('fs');
const path = require('path');
const { ORIGIN, UA, get, text, decodeCfEmail } = require('./lib');

const OUT = path.join(__dirname, '..', 'data', 'entitati.json');

// ---------- Helpers ----------
const slug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const uniqBy = (arr, key) => [...new Map(arr.map((x) => [key(x), x])).values()];
const abs = (u) => (u.startsWith('/') ? ORIGIN + u : u);
const norm = (u) => abs(u).replace(/^https?:\/\/(www\.)?moaclinic\.ro/, ORIGIN).replace(/\/?$/, '/');

function parsePrice(raw) {
  const t = raw.replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const nums = [...t.matchAll(/(\d[\d.]*)(?:,\d+)?\s*(LEI|RON)/gi)].map((m) => +m[1].replace(/\./g, ''));
  if (!nums.length) return { text: t };
  const p = { valoare: nums[0], moneda: 'RON', text: t };
  const old = t.match(/de la\s*(\d+)/i);
  if (old) p.pretInitial = +old[1];
  if (/pre[tț] ini[tț]ial/i.test(t)) return { pretInitial: nums[0], moneda: 'RON', text: t };
  const pachet = t.match(/pachet\s*([^–-]*)/i);
  p.tip = pachet ? `pachet ${pachet[1].trim().toLowerCase()}` : /[sș]edin[tț]/i.test(t) ? 'ședință' : 'preț';
  return p;
}

function jsonLd(html) {
  return [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

// ---------- Homepage ----------
function parseMenu(html) {
  const start = html.indexOf('<div id="main-menu"');
  const seg = html.slice(start, html.indexOf('</div>', html.indexOf('</ul>', start) + 1) + 6);
  const tokens = seg.match(/<li[^>]*>|<\/li>|<a [^>]*href="[^"]*"[^>]*>[\s\S]*?<\/a>/g) || [];
  const root = { children: [] };
  const stack = [root];
  for (const t of tokens) {
    if (t.startsWith('<li')) {
      const node = { children: [] };
      stack.at(-1).children.push(node);
      stack.push(node);
    } else if (t === '</li>') stack.pop();
    else {
      const node = stack.at(-1);
      if (node.nume) continue;
      node.nume = text(t);
      const href = t.match(/href="([^"]*)"/)[1];
      if (href !== '#' && !href.startsWith('#')) node.url = norm(href);
    }
  }
  const clean = (n) => ({
    nume: n.nume,
    ...(n.url && { url: n.url }),
    ...(n.children.length && { copii: n.children.filter((c) => c.nume).map(clean) }),
  });
  return root.children.filter((c) => c.nume && c.nume !== 'Programează-te').map(clean);
}

function parseHomeAccordions(html) {
  const out = [];
  const re = /<a id="accordion-\d+-label" class="accordion-title[^"]*" href="#accordion-item-([^"]+)"[\s\S]*?<span>([\s\S]*?)<\/span>/g;
  let m;
  while ((m = re.exec(html))) {
    const startContent = re.lastIndex;
    const ends = [html.indexOf('class="accordion-title', startContent), html.indexOf('<h2', startContent)].filter((i) => i > 0);
    const chunk = html.slice(startContent, Math.min(...ends));
    const h2s = [...html.slice(0, m.index).matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
    const ps = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)(?=<\/p>|<\/h3>|<style)/g)].map((x) => text(x[1])).filter(Boolean);
    const link = chunk.match(/href="(https:\/\/moaclinic\.ro\/[^"]+)"/);
    out.push({
      id: m[1],
      nume: text(m[2]),
      sectiune: h2s.length ? text(h2s.at(-1)[1]) : null,
      descriere: ps.join(' ').slice(0, 900),
      url: link ? link[1] : null,
      ...(!link && /Vezi detalii/.test(chunk) && { butonFaraLink: true }),
    });
  }
  return out;
}

function parseTeam(html, sursa) {
  const startIdx = Math.max(html.indexOf('Echipa medical'), html.indexOf('Echipa Moa Clinic'));
  const seg = html.slice(startIdx, html.indexOf('Date de Contact', startIdx));
  const out = [];
  const re = /<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4|<h2|$)/g;
  let m;
  while ((m = re.exec(seg))) {
    const nume = text(m[1]);
    if (!nume || /contact|follow/i.test(nume)) continue;
    const rest = m[2];
    const rolMatch = [...rest.matchAll(/<(?:p|div)[^>]*class="text[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].map((x) => text(x[1]));
    let rol = rolMatch.find((r) => r && !/vezi profilul/i.test(r)) || text(rest).replace(/Vezi profilul.*/i, '').trim();
    rol = rol.replace(/\s*Vezi profilul.*$/i, '').trim();
    const profil = rest.match(/href="([^"]+)"[^>]*>[\s\S]{0,200}?Vezi profilul/i);
    out.push({ nume, rol, ...(profil && { profil: norm(profil[1]) }), sursa });
  }
  return out;
}

function classifyPerson(p) {
  const r = p.rol.toLowerCase();
  const grad = /primar/.test(r) ? 'Medic primar' : /specialist/.test(r) ? 'Medic specialist' : /rezident/.test(r) ? 'Medic rezident' : null;
  const specialitate = /gerontolog/.test(r) ? 'Gerontologie'
    : /chirurgie plastic/.test(r) ? 'Chirurgie plastică'
    : /dermato/.test(r) ? 'Dermatovenerologie'
    : /asistent/.test(r) ? 'Asistență medicală'
    : /estetic/.test(r) ? 'Estetică facială și corporală' : null;
  const tip = /^dr\./i.test(p.nume) ? 'Medic' : /asistent/.test(r) ? 'Asistent medical' : 'Specialist estetică';
  return { tip, grad, specialitate };
}

// ---------- Prețuri ----------
function parsePrices(html) {
  const cats = [];
  const parts = html.split(/<div[^>]*class="accordions-head[^"]*"[^>]*main-text="/).slice(1);
  for (const part of parts) {
    const categorie = text(part.slice(0, part.indexOf('"')));
    const content = part.slice(part.indexOf('accordion-content'));
    const items = [];
    let subgrup = null;
    for (const row of content.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
      const cells = [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => text(c[1]));
      const filled = cells.filter(Boolean);
      if (!filled.length) continue;
      if (filled.length === 1) {
        subgrup = filled[0];
        continue;
      }
      // Unele celule conțin mai multe prețuri pe linii separate (ex. cicatrici: zonă mică/medie/mare).
      const raw = cells.slice(1).filter(Boolean).flatMap((c) => c.split(/(?<=ȘEDINȚĂ)\s+(?=\d)/));
      const preturi = raw.map(parsePrice).filter(Boolean);
      const init = preturi.find((p) => p.pretInitial && p.valoare == null);
      const finale = preturi.filter((p) => p.valoare != null);
      if (init && finale[0]) finale[0].pretInitial = init.pretInitial;
      items.push({ nume: cells[0], ...(subgrup && { subgrup }), preturi: finale.length ? finale : preturi });
    }
    if (items.length) cats.push({ categorie, servicii: items });
  }
  return cats;
}

function parseOffers(html) {
  const main = html.slice(html.indexOf('<h1'), html.indexOf('Date de Contact'));
  const out = [];
  let grup = null;
  const re = /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)(?=<h2|<h3|$)/g;
  let m;
  while ((m = re.exec(main))) {
    const title = text(m[2]);
    if (m[1] === 'h2') {
      grup = title;
      continue;
    }
    const body = text(m[3]);
    const pret = body.match(/(\d+)\s*RON/);
    const init = body.match(/\(\s*(\d+)\s*RON\s*PRET INITIAL/i);
    out.push({
      grup,
      nume: title,
      detalii: body.replace(/\d+\s*RON.*$/i, '').replace(/\*.*$/, '').trim() || null,
      pret: pret ? +pret[1] : null,
      pretInitial: init ? +init[1] : null,
      discountProcent: pret && init ? Math.round((1 - pret[1] / init[1]) * 100) : null,
      moneda: 'RON',
    });
  }
  return out;
}

// ---------- Sitemap ----------
async function sitemap(name) {
  const xml = await get(`${ORIGIN}/${name}-sitemap.xml`);
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((u) => ({
    url: u[1].match(/<loc>([^<]+)/)[1],
    lastmod: (u[1].match(/<lastmod>([^<]+)/) || [])[1] || null,
  }));
}

async function checkStatus(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual', headers: { 'User-Agent': UA } });
    return { status: res.status, ...(res.headers.get('location') && { redirect: res.headers.get('location') }) };
  } catch (e) {
    return { status: 0, eroare: e.message };
  }
}

// ---------- Cunoaștere curatoriată ----------
// Producătorii sunt cunoaștere generală (neafirmată pe site), marcată ca atare.
const PRODUSE = [
  { nume: 'Stylage', tip: 'Filler acid hialuronic', producator: 'Vivacy', alias: ['stylage'] },
  { nume: 'Restylane', tip: 'Filler / skinbooster acid hialuronic', producator: 'Galderma', alias: ['restylane'] },
  { nume: 'Juvéderm', tip: 'Filler acid hialuronic', producator: 'Allergan Aesthetics (AbbVie)', alias: ['juvederm', 'juvéderm'] },
  { nume: 'Jalupro', tip: 'Biorevitalizant (aminoacizi + acid hialuronic)', producator: 'Professional Derma', alias: ['jalupro'] },
  { nume: 'Sculptra', tip: 'Biostimulator (acid poli-L-lactic)', producator: 'Galderma', alias: ['sculptra'] },
  { nume: 'HArmonyCa', tip: 'Filler hibrid (acid hialuronic + hidroxiapatită de calciu)', producator: 'Allergan Aesthetics (menționat pe site)', alias: ['harmonyca'] },
  { nume: 'Profhilo Structura', tip: 'Biostimulator acid hialuronic', producator: 'IBSA', alias: ['profhilo'] },
  { nume: 'Rejuran', tip: 'Polinucleotide (ADN de somon)', producator: 'PharmaResearch', alias: ['rejuran'] },
  { nume: 'Azzalure', tip: 'Toxină botulinică', producator: 'Galderma', alias: ['azzalure'] },
  { nume: 'Vistabel', tip: 'Toxină botulinică', producator: 'Allergan Aesthetics (AbbVie)', alias: ['vistabel'] },
  { nume: 'NCTF', tip: 'Cocktail mezoterapie', producator: 'Filorga', alias: ['nctf', 'nctc'] },
  { nume: 'PRX Plus', tip: 'Peeling medical', producator: null, alias: ['prx'] },
  { nume: 'KLAPP', tip: 'Cosmetice profesionale (ASA Peel, Caviar Power, Diamond Glow)', producator: 'KLAPP Cosmetics', alias: ['klapp'] },
  { nume: 'Bruno Vassari', tip: 'Cosmetice profesionale (Oily Control)', producator: 'Bruno Vassari', alias: ['bruno vassari'] },
  { nume: 'Gerovital', tip: 'Terapie Gerovital (Ana Aslan)', producator: null, alias: ['gerovital'] },
];
const TEHNOLOGII = [
  { nume: 'Splendor X', tip: 'Laser Alexandrite 755 nm + Nd:YAG 1064 nm (tehnologia Blend X)', producator: 'Lumenis', alias: ['splendor'] },
  { nume: 'Venus Viva', tip: 'Radiofrecvență fracționată (NanoFractional RF)', producator: 'Venus Concept', alias: ['venus viva'] },
  { nume: 'Venus Legacy', tip: 'Radiofrecvență multipolară + PEMF (corporal & facial)', producator: 'Venus Concept', alias: ['venus legacy'] },
  { nume: 'Dermalinfusion', tip: 'Exfoliere + extracție + infuzare simultană', producator: 'Envy Medical', alias: ['dermalinfusion'] },
  { nume: 'Dermapen 4', tip: 'Microneedling', producator: 'Dermapen World', alias: ['dermapen'] },
  { nume: 'Vielight', tip: 'Fotobiomodulare (near-infrared)', producator: 'Vielight Inc.', alias: ['vielight'] },
  { nume: 'TMS', tip: 'Stimulare magnetică transcraniană (aprobat FDA – depresie, burnout, anxietate)', producator: null, alias: ['tms', 'transcranian'] },
  { nume: 'Sauna cu ozon', tip: 'Ozonoterapie – căldură umedă la ~40°C', producator: null, alias: ['sauna cu ozon', 'saună cu ozon'] },
];
const CONCEPTE = [
  { nume: 'Global Antiaging', tip: 'Conceptul central al brandului – „vârsta nu va mai avea nicio importanță”', producator: null, alias: ['global antiaging'] },
  { nume: 'Medicină regenerativă', tip: 'Activarea resurselor proprii de regenerare ale organismului', producator: null, alias: ['regenerativ', 'regenerare'] },
  { nume: 'Antiaging intern', tip: 'Încetinirea îmbătrânirii celulare, din interior', producator: null, alias: ['antiaging intern'] },
  { nume: 'Longevitate', tip: 'Sirtuine („moleculele longevității”), teste genetice longevity', producator: null, alias: ['longevit'] },
  { nume: 'Vârstă biologică', tip: 'Determinată în consultația antiaging', producator: null, alias: ['vârst biologic', 'vârsta biologic', 'vârstei biologice', 'vârstă biologică'] },
  { nume: 'Terapii antioxidante', tip: 'Reducerea radicalilor liberi (ROS), capacitate totală antioxidantă', producator: null, alias: ['antioxidant'] },
  { nume: 'Ozonoterapie', tip: 'Autohemoterapie majoră, saună cu ozon, insuflații', producator: null, alias: ['ozon'] },
  { nume: 'Nutrigenomică & epigenetică', tip: 'Nutriție antiaging pe baza profilului genetic', producator: null, alias: ['nutrigen', 'epigenetic'] },
  { nume: 'Dermatoestetică', tip: 'Estetică medicală realizată de medic dermatolog', producator: null, alias: ['dermatoestetic'] },
  { nume: 'Gerontologie', tip: 'Școala Ana Aslan – specialitatea fondatorului', producator: null, alias: ['gerontolog'] },
];

function mentions(list, corpus) {
  const low = corpus.toLowerCase();
  return list.map((p) => {
    const count = p.alias.reduce((n, a) => n + (low.split(a).length - 1), 0);
    const { alias, ...rest } = p;
    return { ...rest, mentiuni: count, sursaProducator: rest.producator ? 'cunoaștere generală – de verificat' : null };
  }).filter((p) => p.mentiuni > 0);
}

// ---------- Main ----------
async function main() {
  console.log('Descarc paginile sursă...');
  const [home, preturiHtml, echipaHtml, ofertaHtml, pages, posts] = await Promise.all([
    get(ORIGIN + '/'),
    get(ORIGIN + '/preturi/'),
    get(ORIGIN + '/echipa/'),
    get(ORIGIN + '/abonamente/'),
    sitemap('page'),
    sitemap('post'),
  ]);

  const ld = jsonLd(home);
  const graph = ld.flatMap((x) => x['@graph'] || [x]);
  const rmOrg = graph.find((x) => [].concat(x['@type']).includes('Organization'));
  const customClinic = graph.find((x) => x['@type'] === 'MedicalClinic');
  const webpage = graph.find((x) => x['@type'] === 'WebPage');
  const author = graph.find((x) => x['@type'] === 'Person');
  const serviceSchemas = graph.filter((x) => x['@type'] === 'Service');

  const emails = [...new Set([...home.matchAll(/(?:email-protection#|data-cfemail=")([0-9a-f]{10,})/g)].map((m) => decodeCfEmail(m[1])))];
  const telefoane = [...new Set([...home.matchAll(/href="tel:([^"]+)"/g)].map((m) => m[1]))];
  const maps = [...new Set([...home.matchAll(/href="(https:\/\/maps\.app\.goo\.gl\/[^"]+)"/g)].map((m) => m[1]))];
  const social = [...new Set([...home.matchAll(/href="(https:\/\/(?:www\.)?(?:facebook|instagram|tiktok|youtube|linkedin)\.com\/[^"]+)"/g)].map((m) => m[1]))];
  const trust = text(home).match(/Pe baza a (\d+) de recenzii/);
  const reviewSamples = [...home.matchAll(/ti-name[^>]*>([^<]+)<[\s\S]*?ti-review-content[^>]*>([\s\S]*?)<\/div>/g)]
    .map((m) => ({ autor: text(m[1]), text: text(m[2]) })).slice(0, 12);

  // Echipa: homepage vs /echipa/
  const teamHome = parseTeam(home, 'homepage');
  const teamPage = parseTeam(echipaHtml, '/echipa/');
  const keyName = (n) => slug(n).replace(/^dr-/, '');
  const teamMap = new Map();
  for (const p of [...teamHome, ...teamPage]) {
    const k = keyName(p.nume);
    const ex = teamMap.get(k);
    if (ex) {
      ex.surse.push(p.sursa);
      if (p.profil) ex.profil = p.profil;
    } else teamMap.set(k, { id: k, nume: p.nume, rol: p.rol, ...(p.profil && { profil: p.profil }), surse: [p.sursa] });
  }
  const echipa = [...teamMap.values()].map((p) => ({ ...p, ...classifyPerson(p) }));

  const accordions = parseHomeAccordions(home);
  const meniu = parseMenu(home);
  const preturi = parsePrices(preturiHtml);
  const oferte = parseOffers(ofertaHtml);

  // Status HTTP pentru toate linkurile interne din homepage (redirecturi / 404).
  const internal = [...new Set([...home.matchAll(/href="((?:https?:\/\/(?:www\.)?moaclinic\.ro)?\/[^"#]*)"/g)]
    .map((m) => m[1].trim())
    .filter((u) => !/wp-content|wp-includes|wp-json|xmlrpc|cdn-cgi|\.(css|js|xml|png|jpe?g|svg|webp)(\?|$)/.test(u))
    .map(abs))];
  console.log(`Verific ${internal.length} linkuri interne...`);
  const linkuri = [];
  for (let i = 0; i < internal.length; i += 8) {
    const batch = internal.slice(i, i + 8);
    const res = await Promise.all(batch.map(checkStatus));
    batch.forEach((url, j) => linkuri.push({ url, ...res[j] }));
  }

  const corpus = text(home) + ' ' + text(preturiHtml);

  // ---------- Categorii de servicii: meniu + prețuri + schema ----------
  const servicii = meniu.find((m) => m.nume === 'Servicii')?.copii || [];

  // ---------- Inconsistențe detectate ----------
  const inconsistente = [];
  const add = (severitate, zona, descriere, valori) => inconsistente.push({ severitate, zona, descriere, valori });

  const rmHours = rmOrg?.openingHours?.join('; ');
  const csHours = customClinic?.openingHoursSpecification?.map((s) => `${s.dayOfWeek.join(',')} ${s.opens}-${s.closes}`).join('; ');
  if (rmHours && csHours && rmHours !== csHours)
    add('mare', 'Program', 'Două blocuri schema.org declară programe diferite.', { 'Rank Math (Organization)': rmHours, 'Schema custom (MedicalClinic)': csHours });

  if (trust && customClinic?.aggregateRating && +trust[1] !== +customClinic.aggregateRating.reviewCount)
    add('medie', 'Recenzii', 'Numărul de recenzii din schema nu corespunde cu widgetul Trustindex/Google.', {
      'schema aggregateRating.reviewCount': customClinic.aggregateRating.reviewCount,
      'Trustindex (homepage)': trust[1],
    });

  const fb = social.filter((s) => s.includes('facebook'));
  if (fb.length > 1) add('medie', 'Social', 'Pe homepage apar mai multe URL-uri Facebook diferite.', { facebook: fb });

  const nameVariants = [...new Set([rmOrg?.name, customClinic?.name, ...serviceSchemas.map((s) => s.provider?.name), 'MOA by Oxxygene', 'MOA Clinic'].filter(Boolean))];
  add('medie', 'Nume brand', 'Brandul apare sub mai multe denumiri în schema și conținut.', { variante: nameVariants });

  const providerTypes = [...new Set(serviceSchemas.map((s) => s.provider?.['@type']).filter(Boolean))];
  add('mică', 'Schema', 'Tipul entității furnizor diferă între blocurile Service (și nu e legat prin @id de organizația principală).', {
    tipuri: [...new Set([...[].concat(rmOrg?.['@type'] || []), customClinic?.['@type'], ...providerTypes])],
    url: [...new Set(serviceSchemas.map((s) => s.provider?.url).filter(Boolean).concat(rmOrg?.url || []))],
  });

  if (rmOrg?.telephone && /[‑]/.test(rmOrg.telephone))
    add('mică', 'Telefon', 'Telefonul din schema conține cratime non-breaking (U+2011) în loc de format E.164.', { schema: rmOrg.telephone, recomandat: '+40743056605' });

  if (rmOrg?.description && !/^Alege/.test(rmOrg.description))
    add('mică', 'Schema', 'Descrierea organizației din schema Rank Math e trunchiată.', { descriere: rmOrg.description.slice(0, 40) + '…' });

  if (rmOrg?.logo?.url && customClinic?.logo && rmOrg.logo.url !== customClinic.logo)
    add('mică', 'Logo', 'Logo diferit în cele două blocuri schema.', { 'Rank Math': rmOrg.logo.url, custom: customClinic.logo });

  const onlyHome = echipa.filter((p) => p.surse.length === 1 && p.surse[0] === 'homepage').map((p) => p.nume);
  const onlyPage = echipa.filter((p) => p.surse.length === 1 && p.surse[0] === '/echipa/').map((p) => p.nume);
  if (onlyHome.length || onlyPage.length)
    add('mare', 'Echipă', 'Echipa afișată pe homepage diferă de pagina /echipa/.', { 'doar pe homepage': onlyHome, 'doar pe /echipa/': onlyPage });

  const authorUrls = [...new Set([author?.url, ...teamHome.map((p) => p.profil), ...pages.filter((p) => p.url.includes('/echipa/dr-')).map((p) => p.url)].filter(Boolean))];
  if (authorUrls.length > 1) add('medie', 'Dr. Adrian Stănescu', 'Persoana are mai multe URL-uri de profil (autor schema vs link „Vezi profilul” vs pagina din echipă).', { url: authorUrls });

  // Prețuri schema vs /preturi/
  const flatPrices = preturi.flatMap((c) => c.servicii.map((s) => ({ ...s, categorie: c.categorie })));
  const priceIdx = (needle, sub) => flatPrices.find((s) => s.nume.toLowerCase().includes(needle) && (!sub || (s.subgrup || '').toLowerCase().includes(sub)));
  const PAIRS = [
    ['Corecție riduri de expresie - 1 zonă', () => priceIdx('1 zonă: frunte')],
    ['Corecție riduri de expresie - 2 zone', () => priceIdx('tratament 2 zone')],
    ['Corecție riduri de expresie - 3 zone', () => priceIdx('3 zone- femei')],
    ['Contur buze / volum buze – 1 ml Stylage', () => priceIdx('1 ml stylage', 'buze')],
    ['Umplere riduri fine sau nazogeniene', () => priceIdx('1 ml stylage', 'fine')],
    ['Umplere riduri profunde / pometi / contur facial', () => priceIdx('1 ml stylage', 'profunde')],
    ['Tratament cearcane cu acid hialuronic Jalupro', () => priceIdx('cearcănelor')],
  ];
  const schemaOffers = serviceSchemas.flatMap((s) => (s.offers || []).map((o) => ({ ...o, serviciu: s.name })));
  const diffs = [];
  for (const [name, find] of PAIRS) {
    const o = schemaOffers.find((x) => x.name === name);
    const p = find();
    if (o && p && p.preturi[0]?.valoare && +o.price !== p.preturi[0].valoare)
      diffs.push({ oferta: name, schema: +o.price, preturi: p.preturi[0].valoare });
  }
  if (diffs.length) add('mare', 'Prețuri', 'Prețurile din schema Service (homepage) nu corespund cu /preturi/.', { diferente: diffs });

  const broken = linkuri.filter((l) => l.status >= 400 || l.status === 0);
  const redirects = linkuri.filter((l) => l.status >= 300 && l.status < 400);
  if (broken.length) add('mare', 'Linkuri', 'Linkuri interne din homepage care întorc eroare.', { linkuri: broken.map((l) => `${l.status} ${l.url}`) });
  if (redirects.length) add('medie', 'Linkuri', 'Linkuri interne din homepage care trec printr-un redirect.', { linkuri: redirects.map((l) => `${l.url} → ${l.redirect}`) });

  const deadButtons = accordions.filter((a) => a.butonFaraLink).map((a) => a.nume);
  if (deadButtons.length) add('medie', 'Conținut', 'Butoane „Vezi detalii” fără link pe homepage.', { sectiuni: deadButtons });

  if (/Simulare magnetica/i.test(home)) add('mică', 'Conținut', 'Typo în footer: „Simulare magnetica Transcraniana” (corect: Stimulare).', {});
  if (webpage && graph.some((x) => x['@type'] === 'Article' && x.isPartOf?.['@id'] === webpage['@id']))
    add('mică', 'Schema', 'Homepage-ul e marcat ca Article (Rank Math) – nepotrivit pentru o pagină de brand.', {});
  if (customClinic?.geo && String(customClinic.geo.latitude).length < 6)
    add('mică', 'Locație', 'Coordonatele geo din schema au precizie redusă (2 zecimale ≈ 1 km).', { geo: customClinic.geo });

  // ---------- Asamblare ----------
  const data = {
    meta: {
      generat: new Date().toISOString(),
      sursa: ORIGIN,
      paginiAnalizate: [ORIGIN + '/', ORIGIN + '/preturi/', ORIGIN + '/echipa/', ORIGIN + '/abonamente/', 'page-sitemap.xml', 'post-sitemap.xml'],
    },
    brand: {
      nume: rmOrg?.name,
      numeScurt: 'MOA Clinic',
      variante: nameVariants,
      brandParinte: { nume: 'Oxxygene', relatie: 'MOA Regenerative este „by Oxxygene” – textul menționează „clinicile Oxxygene” și „Terapii intravenoase by Oxxygene”.' },
      tip: [].concat(rmOrg?.['@type'] || [], customClinic?.['@type'] || []).filter((v, i, a) => a.indexOf(v) === i),
      slogan: 'Frumusețea vine din interior și se desăvârșește la exterior',
      descriere: customClinic?.description || webpage?.name,
      pozitionare: 'Prima clinică Global Antiaging din România – estetică, chirurgie și regenerare celulară, București.',
      fondator: { nume: 'Dr. Adrian Stănescu', rol: 'Medic primar gerontolog, director medical, coordonator departament TMS' },
      concept: 'Global Antiaging – „un concept în care vârsta nu va mai avea nicio importanță”',
      specialitatiMedicale: customClinic?.medicalSpecialty || [],
      url: ORIGIN,
      logo: [rmOrg?.logo?.url, customClinic?.logo].filter(Boolean),
      titluSEO: webpage?.name,
      dataPublicareSite: webpage?.datePublished,
      ultimaModificareHomepage: webpage?.dateModified,
    },
    contact: {
      telefon: telefoane,
      email: emails,
      adresa: customClinic?.address || rmOrg?.address,
      geo: customClinic?.geo,
      googleMaps: maps,
      program: { 'Rank Math': rmOrg?.openingHours || [], custom: customClinic?.openingHoursSpecification || [] },
      paginaContact: ORIGIN + '/contact/',
      programareOnline: 'Formular #programare (pe fiecare pagină)',
    },
    social: social.map((u) => ({ retea: u.includes('facebook') ? 'Facebook' : u.includes('instagram') ? 'Instagram' : 'Altă rețea', url: u })),
    reputatie: {
      rating: customClinic?.aggregateRating,
      trustindex: trust ? { platforma: 'Google (prin Trustindex)', calificativ: 'EXCELENT', recenzii: +trust[1], insignaVerificata: true } : null,
      exempleRecenzii: reviewSamples,
    },
    afilieri: [
      { nume: 'Oxxygene', tip: 'Rețea de clinici / brand părinte' },
      { nume: 'Institutul Național de Geriatrie și Gerontologie „Ana Aslan”', tip: 'Formarea fondatorului (Academia de gerontologie a prof. Ana Aslan)' },
      { nume: 'Trustindex', tip: 'Verificare recenzii Google' },
      { nume: 'ANPC / SAL / SOL (UE)', tip: 'Linkuri legale protecția consumatorului' },
      { nume: 'FDA', tip: 'Aprobări menționate: Sculptra, programe TMS' },
    ],
    echipa,
    categoriiServicii: servicii,
    tehnologii: mentions(TEHNOLOGII, corpus).map((t) => {
      const acc = accordions.find((a) => a.nume.toLowerCase() === t.nume.toLowerCase());
      return { ...t, ...(acc && { descriere: acc.descriere, url: acc.url }) };
    }),
    produse: mentions(PRODUSE, corpus),
    concepte: mentions(CONCEPTE, corpus).map(({ producator, sursaProducator, ...c }) => c),
    evidentiatePeHomepage: accordions,
    produseProprii: (preturi.find((c) => /INTRAVENOASE/i.test(c.categorie))?.servicii || [])
      .filter((s) => /MOA|BY MOA|APHRODITE/i.test(s.nume))
      .map((s) => ({ nume: s.nume, tip: 'Terapie intravenoasă cu nume de brand', pret: s.preturi[0]?.valoare })),
    preturi,
    oferte,
    schemaOrg: {
      blocuri: ld.length,
      tipuri: [...new Set(graph.map((x) => [].concat(x['@type']).join('+')))],
      servicii: serviceSchemas.map((s) => ({ nume: s.name || s.hasOfferCatalog?.name, url: s.url || null, oferte: (s.offers || s.hasOfferCatalog?.itemListElement || []).length })),
      raw: ld,
    },
    continut: {
      pagini: pages,
      articoleBlog: posts.map((p) => ({ ...p, titlu: decodeURIComponent(p.url.replace(ORIGIN, '').replace(/\//g, '')).replace(/-\d+$/, '').replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) })),
      linkuriHomepage: linkuri,
    },
    inconsistente: inconsistente.sort((a, b) => ['mare', 'medie', 'mică'].indexOf(a.severitate) - ['mare', 'medie', 'mică'].indexOf(b.severitate)),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  const n = (x) => (Array.isArray(x) ? x.length : 0);
  console.log(`Gata: ${path.relative(process.cwd(), OUT)}`);
  console.log(`  echipă ${n(echipa)} · categorii servicii ${n(servicii)} · tehnologii ${n(data.tehnologii)} · produse ${n(data.produse)}`);
  console.log(`  categorii prețuri ${n(preturi)} (${flatPrices.length} servicii) · oferte ${n(oferte)} · pagini ${n(pages)} · articole ${n(posts)}`);
  console.log(`  inconsistențe ${n(inconsistente)} · linkuri verificate ${n(linkuri)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
