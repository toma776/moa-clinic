// Homepage nou (propunere premium), generat din datele reale MOA: entitati.json + structura.json + fotografiile din site/.
// Scrie nou/index.html (servit la /nou/). Linkurile duc la paginile actuale de pe moaclinic.ro, până există site-ul nou.
// Rulare: npm run homepage
const fs = require('fs');
const path = require('path');
const { ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'structura.json'), 'utf8'));
// titlurile articolelor de pe site-ul vechi sunt scrise adesea fără diacritice: le corectez pe cuvinte (cu păstrarea majusculelor)
const DIACR = {
  si: 'și', in: 'în', sa: 'să', stii: 'știi', dupa: 'după', inseamna: 'înseamnă', intre: 'între', inainte: 'înainte', pana: 'până', imi: 'îmi', tine: 'ține',
  'ti-a': 'ți-a', poti: 'poți', cat: 'cât', dureaza: 'durează', contraindicatii: 'contraindicații', cearcane: 'cearcăne', palpebrala: 'palpebrală',
  operatie: 'operație', cazute: 'căzute', solutie: 'soluție', solutii: 'soluții', moderna: 'modernă', fumatorului: 'fumătorului', dilatati: 'dilatați',
  recomandari: 'recomandări', ingrijire: 'îngrijire', corecta: 'corectă', informatii: 'informații', pareri: 'păreri', sprancene: 'sprâncene',
  definitiva: 'definitivă', clienti: 'clienți', marioneta: 'marionetă', alunite: 'alunițe', rosii: 'roșii', adevarul: 'adevărul', expertilor: 'experților',
  gastei: 'gâștei', buna: 'bună', toxina: 'toxină', botulinica: 'botulinică', procedura: 'procedură',
};
const diacritice = (t) => String(t)
  .replace(/[A-Za-zĂÂÎȘȚăâîșț]+(?:-[a-z]+)?/g, (w) => { const r = DIACR[w.toLowerCase()]; if (!r) return w; return w === w.toUpperCase() && w.length > 1 ? r.toUpperCase() : w[0] === w[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r; })
  .replace(/\s+([?!:])/g, '$1');
for (const a of D.articole) a.titlu = diacritice(a.titlu);
// A8: entitatea clinicii, definită o singură dată (homepage); toate paginile trimit la ea prin @id #organization.
// Un singur nume de brand, aceeași cifră de recenzii ca pe pagină, o singură adresă pentru profilul fondatorului.
// Programul de lucru lipsește intenționat: pe site-ul actual apare în două variante (L–D 09–17 și L–V 09–19) – de confirmat cu clinica.
const ORG_SCHEMA = (() => {
  const nR = D.reputatie?.trustindex?.recenzii;
  return {
    '@context': 'https://schema.org', '@type': 'MedicalClinic', '@id': `${ORIGIN}/#organization`,
    name: 'MOA Clinic', alternateName: 'MOA Regenerative by Oxxygene', url: ORIGIN + '/',
    logo: ORIGIN + '/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg',
    telephone: '+40743056605', email: 'office@moaclinic.ro',
    address: { '@type': 'PostalAddress', streetAddress: 'Str. Ștefan Mihăileanu 35', addressLocality: 'București', addressCountry: 'RO' },
    geo: { '@type': 'GeoCoordinates', latitude: 44.43, longitude: 26.11 },
    hasMap: 'https://maps.app.goo.gl/RHMvPm3KMHYY7BEG6',
    medicalSpecialty: ['PlasticSurgery', 'Dermatology', 'Geriatric'],
    priceRange: '150–8.000 lei',
    founder: { '@type': 'Person', '@id': `${ORIGIN}/medici/adrian-stanescu/#medic`, name: 'Dr. Adrian Stănescu', jobTitle: 'Medic primar geriatrie și gerontologie', url: `${ORIGIN}/medici/adrian-stanescu/` },
    parentOrganization: { '@type': 'Organization', name: 'Oxxygene', url: 'https://oxxygene.ro/' },
    sameAs: ['https://www.instagram.com/moaclinic', 'https://www.facebook.com/MoaClinicByOxxygene/'],
    ...(nR ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: String(nR), bestRating: '5' } } : {}),
  };
})();
const HOME = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// punctuația din textele preluate de pe site-ul vechi: fără spațiu înainte de . , ; : ! ? (inclusiv „<a>Botox </a> .”)
// și cu spațiu după ele când lipsește („naturale.De asemenea”, „empatie,si”). Doar în textul paginii – nu în etichete,
// atribute, <script> sau <style>; adresele (moaclinic.ro, www., e-mail) și „Nd:YAG” rămân neatinse.
// afirmațiile riscante (Decizia CMR 20/2025) se rescriu în textul paginii, în afara recenziilor (<q>…</q> = citatele pacienților)
const { curata } = require('./afirmatii');
const fixPunct = (html) => {
  const tok = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/);
  let inQ = false;
  const INL = /^<\/?(a|em|b|strong|i|span|small|s)\b/i;
  const isText = (i) => i % 2 === 0;
  for (let i = 0; i < tok.length; i += 2) {
    if (i > 0) { if (/^<q\b/i.test(tok[i - 1])) inQ = true; else if (/^<\/q>/i.test(tok[i - 1])) inQ = false; }
    let t = tok[i];
    if (!t) continue;
    if (!inQ) t = curata(t);
    t = t.replace(/(\S)[ \t\n]+([.,;:!?])(?=[\s"”)»]|$)/g, '$1$2');
    t = t.replace(/([a-zăâîșțA-ZĂÂÎȘȚ]{2,})([,;:!?])(?=[A-ZĂÂÎȘȚ]?[a-zăâîșț]{2,})/g, '$1$2 ');
    t = t.replace(/([a-zăâîșț]{2,})\.(?=[A-ZĂÂÎȘȚ][a-zăâîșț]+)/g, '$1. ');
    t = t.replace(/([a-zăâîșț]{2,})\((?=[a-zăâîșț]{2,})/g, '$1 (').replace(/\)([,;])(?=[a-zăâîșțA-ZĂÂÎȘȚ]{2,})/g, ')$1 ');
    // textul care începe cu „ .” după un link sau un cuvânt evidențiat: spațiul trece înaintea etichetei
    if (/^[ \t\n]+[.,;:!?](?=[\s"”)»]|$)/.test(t)) {
      let j = i - 1; while (j > 0 && INL.test(tok[j]) && !tok[j - 1]) j -= 2;
      if (j > 0 && INL.test(tok[j])) t = t.replace(/^[ \t\n]+/, '');
    }
    // textul dintr-un link care se termină cu spațiu, urmat de punctuație după link
    if (/[ \t\n]+$/.test(t) && INL.test(tok[i + 1] || '') && /^[.,;:!?](?=[\s"”)»]|$)/.test(tok[i + 2] || '')) t = t.replace(/[ \t\n]+$/, '');
    tok[i] = t;
  }
  return tok.join('');
};
// „[email protected]” = adresa ascunsă de Cloudflare pe site-ul vechi, copiată ca atare în texte
// datele structurate (ld+json) primesc aceeași corectură de spațiu înainte de punctuație
const { perfHead } = require('./perf');
const writePage = (p, html) => fs.writeFileSync(p, perfHead(fixPunct(html.replace(/\[email(?:&#160;|&nbsp;|\s)protected\]/g, 'office@moaclinic.ro'))
  .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, j, b) => a + j.replace(/([^\s"]) +([.,;:!?])(?=[\s"]|$)/g, '$1$2')
    .replace(/"(name|description|text|headline|alternateName)":"([^"]*)"/g, (mm, k, v) => `"${k}":"${curata(v)}"`) + b)
  // titlul și meta-descrierea trec prin aceeași rescriere a afirmațiilor
  .replace(/(<title>)([^<]*)/, (m, a, v) => a + curata(v))
  .replace(/(<meta name="description" content=")([^"]*)/, (m, a, v) => a + curata(v))));
const lei = (n) => `${Number(n).toLocaleString('ro-RO')} lei`;
const serv = Object.fromEntries(D.servicii.map((s) => [s.id, s]));
const minPrice = (id) => { const v = (serv[id]?.preturi || []).map((p) => p.valoare).filter((x) => x != null); return v.length ? Math.min(...v) : null; };
// paginile de tratament noi (/nou/tratamente/…), generate pentru tratamentele cu conținut în data/tratamente.json (npm run tratamente)
const TRD = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tratamente.json'), 'utf8')).tratamente; } catch { return {}; } })();
// diacriticele lipsă din textele vechi („si”, „dupa”, „pasi”, „pret” …) – scripts/diacritice.js, învățate din textele corecte ale site-ului
{
  const ART = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'articole.json'), 'utf8')).articole; } catch { return {}; } })();
  const { corecteaza } = require('./diacritice')([TRD, ART]);
  for (const id of Object.keys(TRD)) corecteaza(TRD[id]);
  // și: titlurile/rezumatele articolelor, denumirile prețurilor și ale ofertelor, profilul medicului și recenziile
  for (const x of D.articole) { x.titlu = corecteaza(x.titlu); x.rezumat = corecteaza(x.rezumat || ''); }
  for (const sv of D.servicii) for (const p of sv.preturi || []) p.nume = corecteaza(p.nume);
  for (const c of D.preturi || []) for (const p of c.servicii || []) if (p && typeof p === 'object') { if (p.nume) p.nume = corecteaza(p.nume); if (p.detalii) p.detalii = corecteaza(p.detalii); }
  for (const o of D.oferte || []) { if (o.nume) o.nume = corecteaza(o.nume); if (o.detalii) o.detalii = corecteaza(o.detalii); }
  for (const p of D.echipa) if (p.profil_detaliat) corecteaza(p.profil_detaliat);
  for (const r of D.dovezi?.testimoniale || []) r.citat = corecteaza(r.citat);
}
const autolink = require('./autolink');
const trNode = new Map(); // id serviciu → { nod, cat }
for (const cat of S.arbore.find((n) => n.url === '/tratamente/').copii) for (const n of cat.copii || []) {
  const s = D.servicii.find((x) => n.vechi?.[0] && x.url === ORIGIN + n.vechi[0]);
  if (s && TRD[s.id]) trNode.set(s.id, { nod: n, cat });
}
// consultațiile folosesc același șablon (variantă), plus pagina-hub /consultatii/
const consHub = S.arbore.find((n) => n.url === '/consultatii/');
for (const n of consHub?.copii || []) {
  const s = D.servicii.find((x) => n.vechi?.[0] && x.url === ORIGIN + n.vechi[0]);
  if (s && TRD[s.id]) trNode.set(s.id, { nod: n, cat: consHub, consult: true });
}
// imaginile principale noi (Unsplash), una pe pagină, fără dubluri: entitati/media/imagini/ + credite.json (autor, sursă, pagina)
// poziția decupajului pentru fotografiile orizontale, ca fața să rămână în cadru
const HERO_POS = { 'jalupro-cearcane': '30% 50%', 'polinucleotide': '35% 50%', 'venus-legacy': '30% 50%' };
const HERO_NOU = (() => {
  const out = {};
  try {
    const cr = JSON.parse(fs.readFileSync(path.join(ROOT, 'entitati', 'media', 'imagini', 'credite.json'), 'utf8'));
    for (const [file, c] of Object.entries(cr)) {
      const tail = c.pagina.replace(/^consultatii\//, '');
      const hit = [...trNode].find(([, l]) => l.nod.url.replace(/\/$/, '').endsWith('/' + tail) && !!l.consult === c.pagina.startsWith('consultatii/'));
      if (hit) out[hit[0]] = { src: '/entitati/media/imagini/' + file, autor: c.autor, pos: HERO_POS[c.pagina.split('/').pop()] };
      else console.warn('  ! imagine fără pagină:', c.pagina);
    }
  } catch (e) { console.warn('  ! entitati/media/imagini/credite.json:', e.message); }
  return out;
})();
const NOU = new Set([...trNode.values()].map((x) => x.nod.url)); // URL-urile noi care există deja ca pagini
if (consHub) NOU.add(consHub.url);
NOU.add('/preturi/');
NOU.add('/medici/');
NOU.add('/video/');
NOU.add('/blog/');
// wishlist: eticheta discretă care pune un tratament / un rând de preț în lista pacientei (nou/wishlist.js)
const wlBtn = (n, p, u, ico) => `<button type="button" class="wl-add${ico ? ' wl-ico' : ''}" data-wl="${esc(JSON.stringify({ n, p: p ?? null, u: u || '' }))}" aria-pressed="false" aria-label="Adaugă pe wishlist: ${esc(n)}"><i aria-hidden="true">+</i><span>${ico ? 'Wishlist' : 'Adaugă pe wishlist'}</span></button>`;
const live = (id) => (trNode.has(id) ? '/nou' + trNode.get(id).nod.url : serv[id]?.url || ORIGIN);
// tratamentul (pagina nouă) despre care e un articol: întâi după cuvintele-cheie din titlu, apoi după entitățile articolului
// (fără cele care apar pe aproape toate articolele – NAD, antioxidanți, numele medicilor – decât dacă nu există altceva)
const ART_KW = [
  [/glutation/, 'Perfuzii cu glutation'], [/\bnadh?\b/, 'Terapia NAD'], [/intravenoas|\biv\b/, 'Terapii intravenoase'], [/saun/, 'Saună cu ozon'],
  [/\btms\b|burnout/, 'Stimulare magnetică'], [/nutrigen/, 'Nutrigenetică'], [/botox|toxin/, 'Toxină botulinică'], [/buze|lips/, 'Augmentare buze'],
  [/hialuronic|hialuronidaz/, 'Acid hialuronic'], [/jalupro/, 'Jalupro'], [/polinucleotid|rejuran/, 'Polinucleotide'], [/mezoterap/, 'Mezoterapie'],
  [/\bprp\b|vampir/, 'PRP'], [/epila/, 'Epilare'], [/aluni/, 'Îndepărtare alunițe'], [/pori dilata|dermalinfusion/, 'Dermalinfusion'],
  [/dermapen|microneedling|vergeturi/, 'Microneedling'], [/pleoap|ptoz|blefaro/, 'Blefaroplastie'], [/venus legacy/, 'Venus Legacy'], [/venus viva/, 'Venus Viva'],
];
const artTr = (a) => {
  const nz = (x) => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const tr = [...trNode].filter(([, l]) => !l.consult);
  const t = nz(a.titlu);
  for (const [re, pre] of ART_KW) {
    if (!re.test(t)) continue;
    const hit = tr.find(([, l]) => nz(l.nod.nume).startsWith(nz(pre)));
    if (hit) return { sid: hit[0], l: hit[1] };
  }
  const ents = a.entitati || [];
  for (const pass of [ents.filter((e) => !/^(terapia nad|terapii antioxidante|dr\.)/i.test(e)), ents]) {
    for (const e of pass) {
      const ne = nz(e);
      for (const [sid, l] of tr) { const nn = nz(l.nod.nume); if (nn.includes(ne) || ne.includes(nn.replace(/\s*\(.*\)$/, ''))) return { sid, l }; }
    }
  }
  return null;
};
// articolele care au deja pagină nouă (/nou/<slug-ul actual>/); restul trimit încă la site-ul actual
// toate articolele cu conținut extras (npm run articole → data/articole.json) au pagină nouă, la slug-ul de pe site-ul actual
const ART_PAGINI = (() => {
  let AD = {}; try { AD = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'articole.json'), 'utf8')).articole; } catch {}
  const REZERVAT = new Set(['tratamente', 'consultatii', 'preturi', 'blog', 'video', 'medici', 'media', 'longevitate']);
  return D.articole.filter((a) => AD[a.id]?.blocuri?.length && !REZERVAT.has(new URL(a.url).pathname.split('/').filter(Boolean).pop())).map((a) => a.id);
})();
const artLink = (a) => (ART_PAGINI.includes(a.id) ? '/nou/' + new URL(a.url).pathname.split('/').filter(Boolean).pop() + '/' : a.url);
// logo-urile oficiale ale mărcilor (nou/media/brands/, descărcate de pe site-urile producătorilor; originalele în src/),
// afișate monocrom din CSS; înălțimea e potrivită pe logo, ca toate să aibă aceeași greutate vizuală. HArmonyCa nu are logo public.
const BRANDS = [
  { n: 'Restylane', f: 'restylane.svg', h: 30 }, { n: 'Juvéderm', f: 'juvederm.svg', h: 24 }, { n: 'Stylage', f: 'stylage.png', h: 19 },
  { n: 'Sculptra', f: 'sculptra.svg', h: 40 }, { n: 'Profhilo', f: 'profhilo.png', h: 21 }, { n: 'Rejuran', f: 'rejuran.svg', h: 27 },
  { n: 'Splendor X', f: 'splendorx.png', h: 17 }, { n: 'Venus', f: 'venus.svg', h: 26 },
];
const catSlug = (c) => String(c.url || c.nume).split('/').filter(Boolean).pop();

// URL nou -> pagina nouă dacă e generată, altfel URL-ul actual (din arborele structurii), ca linkurile să meargă pe site-ul de azi
const newToOld = new Map();
(function walk(ns) { for (const n of ns) { if (n.url && n.vechi?.[0]) newToOld.set(n.url, ORIGIN + n.vechi[0]); if (n.copii) walk(n.copii); } })(S.arbore);
const toLive = (u) => (NOU.has(u) ? '/nou' + u : newToOld.get(u) || null);
const newName = new Map();
(function walk(ns) { for (const n of ns) { if (n.url) newName.set(n.url, n.nume); if (n.copii) walk(n.copii); } })(S.arbore);
const cleanName = (t) => (t.url && newName.get(t.url)) || t.nume.replace(/s+(în|in) Bucure[sș]ti$/i, '');

// fotografiile medicilor, din secțiunea de echipă a homepage-ului actual
const photos = {};
{
  const i = HOME.indexOf('Echipa medical');
  const seg = HOME.slice(i, HOME.indexOf('Date de Contact', i));
  for (const m of seg.matchAll(/data-src="([^"]+)"[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/g)) {
    const name = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!/placeholder/.test(m[1])) photos[name] = m[1];
  }
}
const thumb = (src, w) => {
  const local = src.startsWith('/wp-content/') ? path.join(ROOT, 'site', src) : path.join(ROOT, src);
  if (!fs.existsSync(local)) return src;
  const name = path.basename(src).replace(/\.\w+$/, '') + '-w' + w + '.jpg';
  const out = path.join(ROOT, 'nou', 'media', 'r', name);
  if (!fs.existsSync(out)) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    try { require('child_process').execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', local, '-vf', `scale='min(${w},iw)':-2`, '-q:v', '4', out]); } catch { return src; }
  }
  return '/nou/media/r/' + name;
};
const resized = (src) => {
  // varianta de ~768px, dacă există local
  const dir = path.join(ROOT, 'site', path.dirname(src));
  const base = path.basename(src).replace(/-scaled(\.\w+)$/, '$1').replace(/\.\w+$/, '');
  const f = fs.existsSync(dir) && fs.readdirSync(dir).find((x) => x.startsWith(base + '-768x'));
  return f ? path.posix.join(path.posix.dirname(src), f) : src;
};
// varianta cea mai mare disponibilă local (coperțile de 300px de pe site-ul vechi ar ieși neclare)
const biggest = (src) => {
  const dir = path.join(ROOT, 'site', path.dirname(src)); if (!fs.existsSync(dir)) return src;
  const base = path.basename(src).replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/\.\w+$/, ''), ext = path.extname(src);
  const sizeRe = /-(\d+)x\d+(?=\.\w+$)/;
  const opts = fs.readdirSync(dir).filter((x) => x.endsWith(ext) && x.replace(sizeRe, '') === base + ext);
  const w = (x) => +((x.match(sizeRe) || [])[1] || 9999);
  const pick = opts.filter((x) => w(x) >= 700 && w(x) <= 1600).sort((a, b) => w(a) - w(b))[0] || opts.sort((a, b) => w(b) - w(a))[0];
  return pick ? path.posix.join(path.posix.dirname(src), pick) : src;
};
// toată echipa (grupul Echipa din entități): fondatorul primul, apoi medicii primari, specialiști, rezidenți, estetică, asistență
const RANK = { 'Medic primar': 0, 'Medic specialist': 1, 'Medic rezident': 2 };
const grupOf = (p) => (p.tip === 'Medic' ? 'medici' : p.tip === 'Asistent medical' ? 'asistenta' : 'estetica');
const team = D.echipa.map((p) => ({ ...p, grup: grupOf(p) })).sort((a, b) =>
  (b.nume.includes('Stănescu') - a.nume.includes('Stănescu')) ||
  (['medici', 'estetica', 'asistenta'].indexOf(a.grup) - ['medici', 'estetica', 'asistenta'].indexOf(b.grup)) ||
  ((RANK[a.grad] ?? 9) - (RANK[b.grad] ?? 9)) || (!!photos[b.nume] - !!photos[a.nume]));
const TEAM_GROUPS = [{ id: 'toti', nume: 'Toată echipa' }, { id: 'medici', nume: 'Medici' }, { id: 'estetica', nume: 'Estetică' }, { id: 'asistenta', nume: 'Asistență medicală' }];
const doctors = team.filter((p) => photos[p.nume]);

// problemele, din structură
const concernZones = S.arbore.find((n) => n.url === '/probleme/').copii;

// tratamentele-semnătură (cu fotografii existente pe site)
const SIG = [
  { id: 'injectare-botox', wide: true, cat: 'Injectabile', titlu: 'Riduri de expresie, estompate natural', text: 'Toxină botulinică dozată de medic pentru frunte, zona dintre sprâncene și ochi – expresia rămâne a ta.', img: '/wp-content/uploads/2024/08/sam-moghadam-khamseh-l9VjM-Pp7-M-unsplash-1-1536x1024.jpg' },
  { id: 'augmentare-buze', cat: 'Injectabile', titlu: 'Buze conturate, proporționate', text: 'Acid hialuronic Stylage, Restylane sau Juvéderm, în cantitatea potrivită pentru fața ta.', img: '/wp-content/uploads/2024/08/karelys-ruiz-PqyzuzFiQfY-unsplash-1024x681.jpg' },
  { id: 'epilare-definitiva-bucuresti', cat: 'Aparatură', titlu: 'Epilare definitivă Splendor X', text: 'Două lungimi de undă (Alexandrite + Nd:YAG) emise simultan, pentru toate tipurile de piele.', img: '/wp-content/uploads/2024/08/farhad-ibrahimzade-quaIM4h-u5E-unsplash-819x1024.jpg' },
  { id: 'venus-viva', cat: 'Aparatură', titlu: 'Ten refăcut cu Venus Viva', text: 'Radiofrecvență fracționată pentru textură, pori și cicatrici – fără perioadă lungă de recuperare.', img: '/wp-content/uploads/2024/08/look-studio-HtXyytr9304-unsplash-1536x1024.jpg' },
  { id: 'sculptra', cat: 'Biostimulare', titlu: 'Sculptra: volum care se construiește în timp', text: 'Stimulează colagenul propriu pentru un lifting treptat, natural, care durează.', img: '/wp-content/uploads/2024/09/17-768x768.jpg' },
];

// citatul real al fondatorului, din pagina lui de profil (data/profiluri.json → echipa.profil_detaliat)
const FOUNDER_QUOTE = D.echipa.find((p) => /Stănescu/.test(p.nume))?.profil_detaliat?.citat || null;

// lista de servicii pentru formulare (pagina + panoul de jos de pe mobil)
const SRV_OPTIONS = '<option value="">Nu știu încă – vreau o consultație</option>' + S.arbore.find((n) => n.url === '/tratamente/').copii.map((c) => `<optgroup label="${esc(c.nume)}">${c.copii.filter((t) => t.continut).map((t) => `<option>${esc(t.nume)}</option>`).join('')}</optgroup>`).join('') + `<optgroup label="Consultații">${S.arbore.find((n) => n.url === '/consultatii/').copii.map((c) => `<option>${esc(c.nume)}</option>`).join('')}</optgroup>`;
// video: versiunile comprimate pentru mobil + cadrele de previzualizare (npm run video → data/video-media.json)
const VM = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'video-media.json'), 'utf8')).video; } catch { return {}; } })();
const vSrc = (v) => VM[v.id]?.mobil || v.url;
const vPoster = (v) => VM[v.id]?.poster || '';

// slider-ul din hero: aceleași imagini ca în hero-ul site-ului actual, în ordinea unei vizite
const HERO_SLIDES = [
  { src: '/wp-content/uploads/2024/10/clinica-moa-1-948x1024.jpeg', eticheta: 'Recepția', alt: 'Recepția clinicii MOA, cu logo-ul MOA Regenerative by Oxxygene' },
  { src: '/wp-content/uploads/2024/10/Clinica-moa-1243x1536.jpeg', eticheta: 'Holul', alt: 'Holul clinicii MOA, cu scara și zona de așteptare' },
  { src: '/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-09-at-13.59.19-768x1024.jpeg', eticheta: 'Salonul de așteptare', alt: 'Salonul de așteptare al clinicii MOA' },
  { src: '/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-09-at-13.59.20-2-768x1024.jpeg', eticheta: 'Cabinetul de consultații', alt: 'Cabinetul de consultații și proceduri injectabile' },
  { src: '/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-09-at-13.59.51-768x1024.jpeg', eticheta: 'Cabinetul de tratamente cu aparatură', alt: 'Cabinet de tratamente cu aparatură de radiofrecvență' },
  { src: '/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-09-at-13.59.51-1-768x1024.jpeg', eticheta: 'Splendor X', alt: 'Laserul Splendor X pentru epilare definitivă' },
];
for (const s of HERO_SLIDES) if (!fs.existsSync(path.join(ROOT, 'site', s.src))) console.warn('  ! lipsește local:', s.src);
// prima imagine are și o variantă mică pentru telefon (LCP mai rapid)
if (!HERO_SLIDES[0].mobil) HERO_SLIDES[0].mobil = thumb(HERO_SLIDES[0].src, 760);

// video din cabinet (verticale, încărcate doar la click)
// titlurile video-urilor: din titlul secțiunii în care stau pe site-ul actual, curățate (fără „?”, fără majuscule, fără mențiuni repetate)
const V_TITLU = {
  'whatsapp-video-2024-11-27-at-15-27-24-mp4': 'Cum decurge o ședință de Dermalinfusion',
  'adobe-express-d147583d89c54d68abb2b8dcf8c8a2da-1-mp4': 'Cum funcționează fotobiomodularea',
  'v24044gl0000d306aavog65i7m7prvjg-mp4': 'Cum începi terapia Vielight · partea 1',
  'v24044gl0000d37ehsvog65jo034up00-mp4': 'Cum începi terapia Vielight · partea 2',
  'whatsapp-video-2024-11-21-at-12-00-38-mp4': 'Splendor X: Alexandrite și Nd:YAG',
  'acidbuze-video-2-mp4': 'Augmentarea buzelor: ce înseamnă și cui i se adresează',
  'micronedling-cu-dermapen-1-1-mp4': 'Beneficiile microneedling cu Dermapen 4',
  'dermapen-cum-decurge-o-sedinta-mp4': 'Cum decurge microneedling cu Dermapen 4',
  'whatsapp-video-2024-11-21-at-16-07-16-27dfce4a-mp4': 'Testarea nutrigenetică: când se recomandă',
};
const vTitle = (v) => V_TITLU[v.id] || String(v.pagini[0]?.sectiune || v.titlu).replace(/\?$/, '').replace(/\s+la Clinica MOA$/i, '').replace(/sedinta/gi, 'ședință').replace(/Autohemoterapie/g, 'autohemoterapie');
const vDur = (v) => { const d = VM[v.id]?.durata_s; return d ? (d >= 60 ? `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')} min` : `${d} s`) : ''; };
const VID_ALL = D.video.filter((v) => !v.fundal);
const VID = ['dermalinfusion', 'epilare-definitiva-bucuresti', 'sculptra', 'nutrigenetica-epigenetica']
  .map((sid) => D.video.find((v) => v.pagini.some((p) => p.serviciu === sid)))
  .filter(Boolean);

// oferte: cele mai mari reduceri din „Ofertele lunii”
const offers = [...new Set(D.oferte.map((o) => o.grup))].map((g) => D.oferte.filter((o) => o.grup === g && o.pret && o.pretInitial).sort((a, b) => b.discountProcent - a.discountProcent)[0]).filter(Boolean).slice(0, 3);
const offSrv = (o) => `Ofertă: ${offerLabel(o.nume)} – ${lei(o.pret)}`;
// eticheta grupului de oferte, curățată: „Oferte Epilare Definitiva SplendorX” → „Epilare definitivă Splendor X”
const offerGroup = (g) => String(g).replace(/^Oferte\s+/i, '').replace(/Definitiva/i, 'definitivă').replace(/SplendorX/i, 'Splendor X');
// numele ofertelor din lista clinicii: cuvintele scrise integral cu majuscule devin litere mici (fără acronime), diacriticele lipsă se completează
const OFF_ACR = /^(NAD\+?|PRP|TMS|DNA|IV)$/;
const OFF_DIACR = { toxina: 'toxină', botulinica: 'botulinică', fiola: 'fiolă', superioara: 'superioară', sedinta: 'ședință', sedinte: 'ședințe', penis: 'peniană', therapy: 'therapy' };
const offerLabel = (x) => {
  if (!x) return '';
  let t = String(x).split(/(\s+)/).map((w) => (/[A-ZĂÂÎȘȚ]{2,}/.test(w) && w === w.toUpperCase() && !OFF_ACR.test(w) ? w.toLowerCase() : w)).join('');
  t = t.replace(/\b([a-zăâîșț]+)\b/gi, (w) => { const k = w.toLowerCase(); if (!OFF_DIACR[k]) return w; const r = OFF_DIACR[k]; return w[0] === w[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r; });
  t = t.replace(/\bml\b/gi, 'mL').replace(/\s*\|\s*/g, ' · ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const reviews = D.dovezi.testimoniale.filter((r) => r.citat.length > 40).slice(0, 4);
const nReviews = D.reputatie.trustindex?.recenzii || '';
const legal = D.legal.firme;

const icon = {
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  doc: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  seal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="10" r="6"/><path d="M9 15l-2 7 5-3 5 3-2-7"/></svg>',
  spark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>',
};

// meniul, din structură (cu destinațiile actuale)
const M = S.meniu.principal;
const chev = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1.5 3.5L5 7l3.5-3.5"/></svg>';
const catNodes = S.arbore.find((n) => n.url === '/tratamente/').copii;
const ZONE_HINT = { 'Față': 'Riduri, volum, buze, cearcăne, ten', 'Corp': 'Epilare, tonifiere, vergeturi, transpirație', 'Păr & piele': 'Căderea părului, alunițe, leziuni', 'Sănătate & longevitate': 'Energie, burnout, antiaging din interior' };
const LINK_HINT = {
  'Ce este Global Antiaging': 'Conceptul MOA, explicat simplu', 'Consultația antiaging': `Cu medicul gerontolog${minPrice('consultatie-antiaging') ? ` · de la ${lei(minPrice('consultatie-antiaging'))}` : ''}`,
  'Vârsta biologică': 'Cât de tânăr e, de fapt, organismul tău', 'Teste genetice': 'DNA Skin, nutrigenetică și epigenetică',
  'Terapii intravenoase': 'NAD+, glutation, vitamine', 'TMS pentru burnout': 'Stimulare magnetică transcraniană',
  'Toate prețurile': `${D.preturi.reduce((n, c) => n + c.servicii.length, 0)} servicii, pe categorii`, 'Ofertele lunii': `${D.oferte.length} oferte active`,
  'Consultații': `Primul pas · de la ${lei(Math.min(...['consultatie-dermatoestetica-dermatologie', 'consultatie-antiaging', 'consultatie-chirurgie-plastica'].map(minPrice).filter(Boolean)))}`,
  'Clinica și conceptul': 'Povestea MOA și fondatorul ei', 'Tehnologie': 'Splendor X, Venus Viva, Venus Legacy, Dermapen 4',
  'Recenzii & rezultate': `${nReviews} recenzii Google · Excelent`, 'Blog': `${D.articole.length} articole despre tratamente`,
  'Întrebări frecvente': 'Răspunsuri scurte, înainte să vii', 'Contact': 'Str. Ștefan Mihăileanu 35, București',
};
const zoneData = concernZones.map((z) => ({
  nume: z.nume,
  hint: ZONE_HINT[z.nume] || z.copii.map((c) => c.nume).slice(0, 3).join(', '),
  items: z.copii.map((c) => {
    const prices = c.tratamente.map((t) => t.pret_de_la).filter((x) => x != null);
    const first = c.tratamente.find((t) => t.url);
    return { nume: c.nume, sub: c.tratamente.slice(0, 3).map(cleanName).join(' · '), pret: prices.length ? Math.min(...prices) : null, href: (first && toLive(first.url)) || '#programare' };
  }),
}));
const catData = catNodes.map((c) => ({
  nume: c.nume,
  hint: c.desc || '',
  href: toLive(c.url) || (c.copii.find((t) => toLive(t.url)) ? toLive(c.copii.find((t) => toLive(t.url)).url) : '#'),
  items: c.copii.map((t) => ({ nume: t.nume, sub: (t.continut?.tehnologii || []).filter((x) => !t.nume.toLowerCase().includes(x.toLowerCase().split(' ')[0])).slice(0, 2).join(' · '), pret: t.continut?.pret_de_la ?? null, href: toLive(t.url) || '#programare' })),
}));
// ---------- mega meniul (desktop): liste editoriale, căutare instant, „cerut des”, card cu imagine, bandă de încredere ----------
const mmNorm = (x) => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const POP = new Set(SIG.map((s) => live(s.id)));
const minConsult = Math.min(...['consultatie-dermatoestetica-dermatologie', 'consultatie-antiaging', 'consultatie-chirurgie-plastica'].map(minPrice).filter(Boolean));
const topOffer = offers[0];
const mmRow = (it, cat, num) => `<a class="mm-row" href="${esc(it.href)}" data-q="${esc(mmNorm(`${it.nume} ${it.sub || ''} ${cat || ''}`))}"${cat ? ` data-cat="${esc(cat)}"` : ''}>${num ? `<span class="mm-num">${String(num).padStart(2, '0')}</span>` : ''}<span class="mm-row-t"><b>${esc(it.nume)}${POP.has(it.href) ? ' <i class="mm-pop">Cerut des</i>' : ''}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span>${it.pret != null ? `<em><small>de la</small>${lei(it.pret)}</em>` : '<em class="mm-go" aria-hidden="true">→</em>'}</a>`;
const mmFeat = (img, eyebrow, title, text, btn, href) => `<aside class="mm-feat">
        <a class="mm-feat-card${img ? '' : ' mm-feat-dark'}" href="${esc(href)}">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ''}<span class="mm-feat-in"><small>${eyebrow}</small><b>${title}</b><span>${text}</span><i>${esc(btn)} →</i></span></a>
        <div class="mm-quick">
          <a href="#programare" data-srv=""><span><b>Programează o consultație</b><small>de la ${lei(minConsult)} · medicul îți face planul</small></span><i>→</i></a>
          <a href="tel:+40743056605" data-track="telefon"><span><b>0743 056 605</b><small>sau scrie-ne pe WhatsApp</small></span><i>→</i></a>
        </div>
      </aside>`;
const mmFoot = `<div class="mm-foot"><div class="wrap"><span>Proceduri făcute de medici</span><span>Prețuri publice, înainte de programare</span><span><b>★ 5.0</b> din ${esc(nReviews)} recenzii Google</span><a href="/nou/preturi/">Toate cele ${D.preturi.reduce((n, c) => n + c.servicii.length, 0)} de prețuri →</a></div></div>`;
const searchIco = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';

const tabbed = (id, title, groups, feat, ph) => `
  <div class="mm" id="mm-${id}" role="region" aria-label="${esc(title)}">
    <div class="wrap mm-in">
      <div class="mm-side">
        <label class="mm-search">${searchIco}<input type="search" placeholder="${esc(ph)}" aria-label="${esc(ph)}" autocomplete="off"></label>
        <span class="mm-side-t">${esc(title)}</span>
        <div role="tablist" aria-orientation="vertical">${groups.map((g, i) => `<button class="mm-tab" type="button" role="tab" aria-selected="${i === 0}" data-pane="${id}-${i}"><b>${esc(g.nume)}</b><span class="mm-n">${g.items.length}</span></button>`).join('')}</div>
      </div>
      <div class="mm-main">${groups.map((g, i) => `
        <div class="mm-pane" id="pane-${id}-${i}" ${i ? 'hidden' : ''}>
          <div class="mm-pane-h"><div><h3>${esc(g.nume)}</h3>${g.hint ? `<p>${esc(g.hint)}</p>` : ''}</div>${g.href ? `<a href="${esc(g.href)}">Vezi categoria →</a>` : ''}</div>
          <div class="mm-list">${g.items.map((it) => mmRow(it, g.nume)).join('')}</div>
        </div>`).join('')}
        <div class="mm-results" hidden><div class="mm-pane-h"><div><h3>Rezultate</h3><p class="mm-rcount"></p></div></div><div class="mm-list"></div><p class="mm-none" hidden>Nu am găsit nimic. <a href="#programare">Întreabă-ne direct →</a></p></div>
      </div>
      ${feat}
    </div>
    ${mmFoot}
  </div>`;
const INTRO = {
  'Longevitate': ['Global Antiaging', 'Medicina longevității: îți măsurăm vârsta biologică, apoi medicul gerontolog îți face un plan regenerativ.', 'Vezi programul', '/nou/longevitate/program/'],
  'Prețuri': ['Prețuri transparente', `Toate cele ${D.preturi.reduce((n, c) => n + c.servicii.length, 0)} de prețuri ale clinicii sunt publice, înainte de programare.`, 'Toate prețurile', '/nou/preturi/'],
  'Despre MOA': ['MOA Clinic', 'Estetică medicală, chirurgie și medicină regenerativă, sub același acoperiș, în centrul Bucureștiului.', 'Echipa medicală', '/nou/medici/'],
};
const simple = (id, m, feat) => {
  const [t, p, lt, lh] = INTRO[m.nume] || [m.nume, '', '', ''];
  return `
  <div class="mm" id="mm-${id}" role="region" aria-label="${esc(m.nume)}">
    <div class="wrap mm-in simple">
      <div class="mm-intro"><span class="mm-side-t">${esc(m.nume)}</span><h3>${esc(t)}</h3>${p ? `<p>${esc(p)}</p>` : ''}${lt ? `<a class="link-u" href="${esc(lh)}">${esc(lt)} →</a>` : ''}</div>
      <div class="mm-main"><div class="mm-list mm-list-num">${m.linkuri.map((l, i) => mmRow({ nume: l.nume, sub: LINK_HINT[l.nume] || '', pret: null, href: toLive(l.url) || (l.url === '/clinica/recenzii/' ? '#recenzii' : l.url === '/clinica/' ? '#despre' : '#programare') }, '', i + 1)).join('')}</div></div>
      ${feat}
    </div>
    ${mmFoot}
  </div>`;
};
const PANELS = {
  'Ce te supără?': (i) => tabbed(i, 'Alege zona', zoneData, mmFeat(thumb('/wp-content/uploads/2024/08/karelys-ruiz-PqyzuzFiQfY-unsplash-1024x681.jpg', 640), 'Echipa MOA', 'Medici care te ascultă', 'Gerontologi, dermatologi și chirurgi plastici, sub același acoperiș. Știi mereu cine te tratează.', 'Cunoaște echipa', '/nou/medici/'), 'Ex.: riduri, buze, cearcăne…'),
  'Tratamente': (i) => tabbed(i, 'Categorii', catData, topOffer ? mmFeat(thumb('/wp-content/uploads/2024/08/look-studio-HtXyytr9304-unsplash-1536x1024.jpg', 640), `Oferta lunii · −${topOffer.discountProcent}%`, esc(offerLabel(topOffer.nume)), `<s>${lei(topOffer.pretInitial)}</s> <b>${lei(topOffer.pret)}</b>`, 'Rezervă oferta', '#programare') : '', 'Caută: Botox, Sculptra, PRP…'),
  'Longevitate': (i, m) => simple(i, m, mmFeat(thumb('/wp-content/uploads/2024/10/Dr.-Adrian-Stanescu-768x1060.jpeg', 640), 'Coordonator medical', 'Dr. Adrian Stănescu', 'Medic primar geriatrie-gerontologie, format la școala Ana Aslan.', 'Vezi profilul', '/nou/medici/adrian-stanescu/')),
  'Prețuri': (i, m) => simple(i, m, mmFeat(null, 'Ofertele lunii', 'Pentru luna aceasta', offers.map((o) => `<span class="mm-off"><span>${esc(offerLabel(o.nume))}</span><b>${lei(o.pret)}</b></span>`).join(''), `Toate cele ${D.oferte.length} oferte`, '/nou/preturi/#oferte')),
  'Despre MOA': (i, m) => simple(i, m, mmFeat(thumb('/wp-content/uploads/2024/10/Clinica-moa-768x949.jpeg', 640), 'Te așteptăm', 'Str. Ștefan Mihăileanu 35', 'București · 0743 056 605', 'Vezi pe hartă', D.contact.googleMaps[0])),
};
const panelsHtml = M.map((m, i) => (PANELS[m.nume] ? PANELS[m.nume](i, m) : '')).join('');

// meniul mobil: ecrane pe niveluri
const mrowLink = (it) => `<a class="mrow" href="${esc(it.href)}" data-q="${esc(mmNorm(`${it.nume} ${it.sub || ''}`))}"><span><b>${esc(it.nume)}${POP.has(it.href) ? ' <i class="mm-pop">Cerut des</i>' : ''}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span>${it.pret != null ? `<em><small>de la</small>${lei(it.pret)}</em>` : '<span class="chev">→</span>'}</a>`;
const mrowGo = (label, sub, screen, n) => `<button class="mrow" type="button" data-go="${screen}"><span><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>${n ? `<span class="ms-n">${n}</span>` : ''}<span class="chev">›</span></button>`;
// meniul mobil premium: căutare, secțiunile mari cu descriere, „cerute des” cu imagini, contact și recenzii
const MS_HINT = {
  'Ce te supără?': 'Pornește de la ce ai observat', 'Tratamente': `${catData.reduce((n, c) => n + c.items.length, 0)} de tratamente, pe categorii`,
  'Longevitate': 'Global Antiaging și terapii regenerative', 'Prețuri': `${D.preturi.reduce((n, c) => n + c.servicii.length, 0)} de prețuri publice · ofertele lunii`,
  'Medici': 'Medici primari și specialiști', 'Despre MOA': 'Clinica, tehnologie, recenzii, blog',
};
const msCta = `<a class="ms-cta" href="#programare" data-mclose><span><small>Nu știi ce ți se potrivește?</small><b>Programează o consultație</b><em>de la ${lei(minConsult)} · medicul îți face planul</em></span><i>→</i></a>`;
const msHead = (eyebrow, title) => `<div class="ms-head"><span class="ms-eye">${esc(eyebrow)}</span><h3>${esc(title)}</h3></div>`;
const screens = [];
screens.push(`<div class="mscreen on" data-screen="root">
  <label class="ms-search">${searchIco}<input type="search" placeholder="Caută un tratament sau o zonă" aria-label="Caută un tratament sau o zonă" autocomplete="off"></label>
  <div class="ms-results" hidden><span class="ms-eye ms-rcount"></span><div class="ms-rlist"></div><p class="ms-none" hidden>Nu am găsit nimic. <a href="#programare" data-mclose>Întreabă-ne direct →</a></p></div>
  <div class="ms-home">
    <nav class="ms-main" aria-label="Secțiuni">${M.map((m, i) => {
      const nume = m.url === '/medici/' ? 'Echipa' : m.nume;
      const inner = `<span class="ms-i">${String(i + 1).padStart(2, '0')}</span><span class="ms-t"><b>${esc(nume)}</b><small>${esc(MS_HINT[m.nume] || '')}</small></span>`;
      return m.tip === 'link' ? `<a class="ms-big" href="${esc(m.url === '/medici/' ? '/nou/medici/' : toLive(m.url) || '#')}">${inner}<span class="chev">→</span></a>` : `<button class="ms-big" type="button" data-go="m${i}">${inner}<span class="chev">›</span></button>`;
    }).join('')}</nav>
    <section class="ms-pop" aria-label="Tratamente cerute des"><span class="ms-eye">Cerute des</span>
      <div class="ms-rail">${SIG.map((s) => `<a href="${esc(live(s.id))}"><span class="ph"><img data-src="${esc(thumb(s.img, 400))}" alt=""></span><b>${esc((trNode.get(s.id)?.nod.nume || '').replace(/\s*[–(].*$/, ''))}</b>${minPrice(s.id) ? `<em>de la ${lei(minPrice(s.id))}</em>` : ''}</a>`).join('')}</div>
    </section>
    <section class="ms-contact">
      <div class="ms-rating"><b>5.0</b><span><i>★★★★★</i><small>${esc(nReviews)} de recenzii Google · Excelent</small></span></div>
      <a href="https://wa.me/40743056605?text=${encodeURIComponent('Bună ziua! Aș dori o programare la MOA Clinic.')}" data-track="whatsapp"><small>WhatsApp</small><b>Scrie-ne discret</b></a>
      <a href="${esc(D.contact.googleMaps[0])}" target="_blank" rel="noopener"><small>Adresă</small><b>Str. Ștefan Mihăileanu 35, București</b></a>
    </section>
  </div>
</div>`);
M.forEach((m, i) => {
  if (m.nume === 'Ce te supără?') {
    screens.push(`<div class="mscreen" data-screen="m${i}">${msHead('Alege zona', m.nume)}${zoneData.map((z, j) => mrowGo(z.nume, z.hint, `z${j}`, z.items.length)).join('')}${msCta}</div>`);
    zoneData.forEach((z, j) => screens.push(`<div class="mscreen" data-screen="z${j}">${msHead(m.nume, z.nume)}${z.items.map(mrowLink).join('')}${msCta}</div>`));
  } else if (m.nume === 'Tratamente') {
    screens.push(`<div class="mscreen" data-screen="m${i}">${msHead('Categorii', m.nume)}${catData.map((c, j) => mrowGo(c.nume, c.hint, `c${j}`, c.items.length)).join('')}${msCta}</div>`);
    catData.forEach((c, j) => screens.push(`<div class="mscreen" data-screen="c${j}">${msHead(m.nume, c.nume)}${c.items.map(mrowLink).join('')}${msCta}</div>`));
  } else if (m.linkuri) {
    screens.push(`<div class="mscreen" data-screen="m${i}">${msHead(INTRO[m.nume]?.[0] || m.nume, m.nume)}${INTRO[m.nume] ? `<p class="ms-intro">${esc(INTRO[m.nume][1])}</p>` : ''}${m.linkuri.map((l) => mrowLink({ nume: l.nume, sub: LINK_HINT[l.nume] || '', href: toLive(l.url) || '#programare' })).join('')}${msCta}</div>`);
  }
});
const mobileNav = `
<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Meniu" aria-hidden="true">
  <div class="mnav-top"><button class="mnav-back" type="button" id="mback" hidden>‹ Înapoi</button><img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA Clinic" id="mlogo"><button class="mnav-x" type="button" id="mclose">Închide ✕</button></div>
  <div class="mnav-body">${screens.join('')}</div>
  <div class="mnav-foot"><a class="btn btn-line" href="tel:+40743056605" data-track="telefon">Sună</a><a class="btn btn-gold" href="#programare" data-mclose>Programare</a></div>
</div>`;

const html = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MOA Clinic · Estetică medicală, chirurgie și longevitate în București</title>
<meta name="description" content="Estetică medicală, chirurgie plastică și medicină regenerativă, coordonate de un medic primar geriatrie-gerontologie. Proceduri făcute de medici, în Str. Ștefan Mihăileanu 35, București.">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
${HERO_SLIDES[0].mobil ? `<link rel="preload" as="image" href="${esc(HERO_SLIDES[0].mobil)}" media="(max-width: 760px)" fetchpriority="high">
<link rel="preload" as="image" href="${esc(HERO_SLIDES[0].src)}" media="(min-width: 761px)" fetchpriority="high">` : `<link rel="preload" as="image" href="${esc(HERO_SLIDES[0].src)}" fetchpriority="high">`}
<script type="application/ld+json">${JSON.stringify(ORG_SCHEMA)}</script>
</head>
<body class="hp">

<div class="topbar"><div class="wrap">
  <span class="tb-left">Str. Ștefan Mihăileanu 35, București</span>
  <span class="tb-right"><a href="tel:+40743056605">0743 056 605</a><a href="https://wa.me/40743056605?text=${encodeURIComponent('Bună ziua! Aș dori o programare la MOA Clinic.')}" data-track="whatsapp">WhatsApp</a><a href="mailto:office@moaclinic.ro">office@moaclinic.ro</a></span>
</div></div>

<header class="site" id="hdr">
  <div class="wrap hd">
    <a class="logo" href="/nou/" aria-label="MOA Clinic – acasă"><img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA Clinic"></a>
    <nav class="nav" aria-label="Meniu principal"><ul>
      ${M.map((m, i) => `<li>${m.tip === 'link' ? `<a class="nav-btn" href="${esc(m.url === '/medici/' ? '/nou/medici/' : toLive(m.url) || '#')}">${esc(m.url === '/medici/' ? 'Echipa' : m.nume)}</a>` : `<button class="nav-btn" type="button" aria-expanded="false" aria-controls="mm-${i}" data-mm="${i}">${esc(m.nume)} ${chev}</button>`}</li>`).join('')}
    </ul></nav>
    <a class="btn btn-gold" href="#programare">Programează-te</a>
    <button class="burger" id="burger" aria-label="Deschide meniul" aria-expanded="false" aria-controls="mnav"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
  </div>
  ${panelsHtml}
</header>
<div class="mm-scrim" id="scrim"></div>
${mobileNav}

<main>
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <div class="hero-top">
      <span class="eyebrow">MOA Regenerative by Oxxygene · București</span>
      <h1>Frumusețea vine din interior. <em>Și se desăvârșește aici.</em></h1>
      <a class="doc-chip" href="/nou/medici/adrian-stanescu/"><img src="${thumb('/wp-content/uploads/2024/09/image00005-682x1024.jpeg', 96)}" alt="" width="48" height="48" loading="lazy"><span><b>Dr. Adrian Stănescu</b>medic primar gerontolog · fondator</span></a>
      <div class="hero-cta">
        <a class="btn btn-gold arrow" href="#programare">Programează o consultație</a>
        <a class="btn btn-line" href="#ce-te-supara">Ce te supără?</a>
      </div>
      </div>
      <p class="lede">Estetică medicală, chirurgie plastică și <a class="lede-link" href="/nou/longevitate/program/">medicină regenerativă (Global Antiaging)</a>, coordonate de <a class="lede-link" href="/nou/medici/adrian-stanescu/">Dr. Adrian Stănescu</a>, medic primar geriatrie-gerontologie, format la școala Ana Aslan.</p>
      <div class="hero-proof">
        <div><b>${D.echipa.filter((p) => p.tip === 'Medic').length} medici</b>primari, specialiști și rezidenți</div>
        <div><b>${D.servicii.length} tratamente</b>estetice, chirurgicale și regenerative</div>
        <div><b>3 specialități</b>gerontologie, dermatologie, chirurgie plastică</div>
      </div>
    </div>
    <div class="hero-media">
      <div class="frame hs" id="hs" role="region" aria-roledescription="carusel" aria-label="Clinica MOA, în imagini">
        <div class="hs-track">${HERO_SLIDES.map((s, i) => `<figure class="hs-slide ${i ? '' : 'on'}" data-label="${esc(s.eticheta)}" role="group" aria-roledescription="imagine" aria-label="${i + 1} din ${HERO_SLIDES.length}: ${esc(s.eticheta)}" ${i ? 'aria-hidden="true"' : ''}>
          ${s.mobil ? `<picture><source media="(max-width: 760px)" srcset="${esc(s.mobil)}">` : ''}<img ${i ? `data-src="${esc(s.src)}"` : `src="${esc(s.src)}"`} alt="${esc(s.alt)}" ${i ? 'decoding="async"' : 'fetchpriority="high"'}>${s.mobil ? '</picture>' : ''}</figure>`).join('')}</div>
        <div class="hs-bar">
          <span class="hs-label" aria-live="polite">${esc(HERO_SLIDES[0].eticheta)}</span>
          <span class="hs-count"><b>01</b> / ${String(HERO_SLIDES.length).padStart(2, '0')}</span>
          <button class="hs-nav" type="button" data-hs="-1" aria-label="Imaginea anterioară">‹</button><button class="hs-nav" type="button" data-hs="1" aria-label="Imaginea următoare">›</button>
        </div>
        <div class="hs-dots">${HERO_SLIDES.map((s, i) => `<button type="button" class="${i ? '' : 'on'}" data-hsi="${i}" aria-label="Arată: ${esc(s.eticheta)}"></button>`).join('')}</div>
      </div>
      <div class="hero-badge2"><b>Global Antiaging</b>estetică, chirurgie și regenerare, într-un singur loc</div>
    </div>
  </div>
</section>

<section class="hp-strip" aria-label="De ce MOA">
  <div class="wrap">
    <div><b>Medic primar gerontolog</b><span>coordonator medical, școala Ana Aslan</span></div>
    <div><b>Injectabile făcute de medici</b><span>numiți pe pagina fiecărui tratament</span></div>
    <div><b>Grupul medical Oxxygene</b><span>clinică și spital privat, Otopeni</span></div>
    <div><b>5.0 pe Google</b><span>din ${esc(nReviews)} de recenzii verificate</span></div>
  </div>
</section>

<section class="hp-sec" id="ce-te-supara">
  <div class="wrap">
    <div class="hp-head rv">
      <div><span class="eyebrow">Ce te supără?</span><h2>Pornește de la <em>tine</em>, nu de la un tratament.</h2></div>
      <div class="hp-head-side"><p>Alege zona. Îți arătăm opțiunile, iar medicul stabilește împreună cu tine planul potrivit.</p><a class="link-u" href="/nou/preturi/#estimator">Estimează costul pe siluetă →</a></div>
    </div>
    <div class="hp-tabs rv" role="tablist">${concernZones.map((z, i) => `<button role="tab" type="button" aria-selected="${i === 0}" data-tab="${i}">${esc(z.nume)}</button>`).join('')}</div>
    ${concernZones.map((z, i) => `<div class="hp-rail hp-concerns" data-panel="${i}" ${i ? 'hidden' : ''}>${z.copii.map((c, j) => {
      const tr = c.tratamente.slice(0, 3);
      const prices = c.tratamente.map((t) => t.pret_de_la).filter((x) => x != null);
      const first = c.tratamente.find((t) => t.url);
      return `<a class="hp-cc" href="${esc((first && toLive(first.url)) || '#programare')}">
        <span class="n">${String(j + 1).padStart(2, '0')}</span>
        <h3>${esc(c.nume)}</h3>
        <p>${tr.map((t) => esc(cleanName(t))).join(' · ')}</p>
        <span class="from">${prices.length ? `de la <b>${lei(Math.min(...prices))}</b>` : 'începe cu o consultație'}<i>→</i></span>
      </a>`; }).join('')}</div>`).join('')}
  </div>
</section>

<section class="hp-sec hp-cream">
  <div class="wrap">
    <div class="hp-head rv">
      <div><span class="eyebrow">Tratamente-semnătură</span><h2>Rafinament, <em>nu transformare.</em></h2></div>
      <div class="hp-head-side"><p>Cele mai cerute tratamente ale clinicii, cu produse originale și doze potrivite fiecărui chip.</p><a class="link-u" href="/nou/preturi/">Toate tratamentele și prețurile →</a></div>
    </div>
    <div class="hp-rail hp-sig">${SIG.map((s) => `
      <a class="hp-sg rv" href="${esc(live(s.id))}">
        <img src="${esc(thumb(s.img, 760))}" alt="${esc(s.titlu)}" loading="lazy">
        <div class="in"><span class="cat">${esc(s.cat)}</span><h3>${esc(s.titlu)}</h3><p>${esc(s.text)}</p>
          <span class="meta"><span>Detalii →</span>${minPrice(s.id) ? `<span>de la <b>${lei(minPrice(s.id))}</b></span>` : ''}</span></div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="hp-ga">
  <div class="wrap hp-ga-grid">
    <div class="hp-ga-img rv"><img src="/wp-content/uploads/2024/09/image00005-682x1024.jpeg" alt="Dr. Adrian Stănescu, fondatorul MOA Clinic" loading="lazy"></div>
    <div class="hp-ga-copy rv">
      <span class="eyebrow light">Global Antiaging</span>
      <h2>Un concept în care vârsta <em>nu mai contează.</em></h2>
      ${FOUNDER_QUOTE ? `<blockquote>„${esc(FOUNDER_QUOTE)}”<cite>Dr. Adrian Stănescu · medic primar gerontolog, fondator</cite></blockquote>` : ''}
      <p>MOA unește estetica medicală cu medicina regenerativă: îți măsurăm vârsta biologică, apoi lucrăm deodată la cum arăți și la cum te simți.</p>
      <div class="hp-pillars">
        <a href="#ce-te-supara"><b>Estetică</b><span>injectabile, laser, radiofrecvență</span></a>
        <a href="${esc(live('blefaroplastie'))}"><b>Chirurgie</b><span>blefaroplastie, lip lift, dermatochirurgie</span></a>
        <a href="/nou/longevitate/program/"><b>Regenerare</b><span>terapii IV, ozon, NAD+, TMS</span></a>
      </div>
      <a class="btn btn-ghost arrow" href="/nou/longevitate/program/">Programul de longevitate</a>
    </div>
  </div>
  <div class="wrap hp-safe">
    <div class="rv"><span class="ico">${icon.doc}</span><span><b>Evaluare medicală</b>istoric, piele, așteptări, contraindicații</span></div>
    <div class="rv"><span class="ico">${icon.shield}</span><span><b>Făcut de medici</b>primari și specialiști, nu operatori</span></div>
    <div class="rv"><span class="ico">${icon.seal}</span><span><b>Produse originale</b>mărci pe care le vezi în lista de prețuri</span></div>
    <div class="rv"><span class="ico">${icon.spark}</span><span><b>Doze potrivite</b>rezultate naturale, construite treptat</span></div>
  </div>
  <div class="wrap brands" aria-label="Mărci folosite">${BRANDS.map((b) => `<img src="/nou/media/brands/${b.f}?v=2" alt="${b.n}" style="--h:${b.h}px" loading="lazy">`).join('')}</div>
</section>

<section class="hp-sec" id="echipa">
  <div class="wrap">
    <div class="hp-head rv">
      <div><span class="eyebrow">Echipa MOA</span><h2>Mâini <em>sigure.</em></h2></div>
      <div class="hp-head-side"><p>Gerontologi, dermatologi și chirurgi plastici, alături de specialiști în estetică și asistente. Știi mereu cine te tratează.</p><a class="link-u" href="/nou/medici/">Toată echipa →</a><div class="hp-arrows"><button type="button" data-rail="-1" aria-label="Înapoi">‹</button><button type="button" data-rail="1" aria-label="Înainte">›</button></div></div>
    </div>
    <div class="hp-rail hp-team">${team.map((p) => `
      <article class="doc${p.profil_detaliat ? ' has-profile' : ''}">${p.profil_detaliat ? `<a class="doc-link" href="/nou/medici/${esc(p.id)}/" aria-label="Profilul ${esc(p.nume)}"></a>` : ''}<div class="ph">${photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="${esc(p.nume)}" loading="lazy">` : `<div class="mono" role="img" aria-label="${esc(p.nume)} – fotografie în curând"><span>${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span></div>`}</div>
        <span class="tag">${esc(p.specialitate)}</span><h3>${esc(p.nume)}</h3><span>${esc(p.rol)}</span>${p.profil_detaliat ? '<span class="doc-more">Vezi profilul →</span>' : ''}</article>`).join('')}
    </div>
  </div>
</section>

<section class="hp-sec hp-cream inroom">
  <div class="wrap">
    <div class="hp-head rv">
      <div><span class="eyebrow">În cabinet</span><h2>Vezi cum decurge <em>o ședință.</em></h2></div>
      <div class="hp-head-side"><p>Înainte să vii, știi ce se întâmplă, cât durează și cum te simți.</p><a class="link-u" href="/nou/video/">Toate cele ${VID_ALL.length} video-uri →</a></div>
    </div>
    <div class="hp-rail hp-vid">${VID.map((v) => {
      const p = v.pagini[0];
      return `<div class="v-card"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` data-poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește video"><span>▶</span></button></div>
        <h3>${esc(vTitle(v))}</h3><p>${p.serviciu ? `<a href="${esc(live(p.serviciu))}">${esc(trNode.get(p.serviciu)?.nod.nume || serv[p.serviciu]?.nume || '')}</a>` : ''}${vDur(v) ? ` · ${vDur(v)}` : ''}</p></div>`; }).join('')}
    </div>
  </div>
</section>

<section class="hp-sec" id="recenzii">
  <div class="wrap hp-rev">
    <div class="hp-score rv"><span class="eyebrow">Recenzii Google</span><b>5.0</b><span class="stars">★★★★★</span><p>Din ${esc(nReviews)} de recenzii verificate, calificativ „Excelent”.</p></div>
    <div class="hp-rail hp-quotes">${reviews.map((r) => `<figure class="hp-q"><q>${esc(r.citat)}</q><figcaption><b>${esc(r.persoana)}</b> · Google</figcaption></figure>`).join('')}</div>
  </div>
</section>

<section class="hp-visit" id="despre">
  <img src="/wp-content/uploads/2024/10/Clinica-moa-1243x1536.jpeg" alt="Interiorul clinicii MOA" loading="lazy">
  <div class="wrap hp-visit-grid">
    <div class="rv">
      <span class="eyebrow light">Clinica</span>
      <h2>Te așteptăm <em>acasă la MOA.</em></h2>
      <p>Un spațiu luminos și liniștit, gândit ca să te simți în largul tău de la prima vizită.</p>
      <dl><dt>Adresă</dt><dd>Str. Ștefan Mihăileanu 35, București</dd><dt>Telefon</dt><dd><a href="tel:+40743056605">0743 056 605</a></dd><dt>Email</dt><dd><a href="mailto:office@moaclinic.ro">office@moaclinic.ro</a></dd></dl>
      <a class="btn btn-ghost arrow" href="${esc(D.contact.googleMaps[0])}" target="_blank" rel="noopener">Vezi pe hartă</a>
    </div>
    <div class="hp-offbox rv">
      <div class="hp-offbox-h"><span class="eyebrow light">Ofertele lunii</span><a href="/nou/preturi/#oferte">Toate cele ${D.oferte.length} →</a></div>
      ${offers.map((o) => `<a class="hp-of" href="#programare" data-srv="${esc(offSrv(o))}"><span class="g">${esc(o.grup === 'OFERTELE LUNII' ? 'Oferta lunii' : offerGroup(o.grup))}</span><b>${esc(offerLabel(o.nume))}</b><span class="p"><b>${lei(o.pret)}</b><s>${lei(o.pretInitial)}</s><i>−${o.discountProcent}%</i></span></a>`).join('')}
    </div>
  </div>
</section>

<section class="sec book" id="programare">
  <div class="wrap grid">
    <div class="rv">
      <span class="eyebrow light">Programare</span>
      <h2 style="margin-top:22px">Primul pas e <em style="color:var(--gold-soft)">o discuție.</em></h2>
      <p class="lede">Lasă-ne numele și telefonul. Te sunăm noi, ca să găsim împreună ora potrivită și tratamentul potrivit.</p>
      <ol class="steps">
        <li><span><b>Ne lași datele</b>Durează sub un minut.</span></li>
        <li><span><b>Te sunăm</b>Confirmăm ora și răspundem la întrebări.</span></li>
        <li><span><b>Consultația</b>Medicul îți face un plan, fără nicio obligație.</span></li>
      </ol>
      <div class="direct"><a class="btn" href="tel:+40743056605" data-track="telefon">Sună: 0743 056 605</a><a class="btn" href="https://wa.me/40743056605?text=${encodeURIComponent('Bună ziua! Aș dori o programare la MOA Clinic.')}" data-track="whatsapp">WhatsApp</a></div>
      <p class="direct-note">Preferi discreția? Pe WhatsApp îți răspunde direct recepția clinicii.</p>
    </div>
    <form class="booking rv" id="booking" novalidate>
      <h3>Cere o programare</h3>
      <div class="row2">
        <div class="field"><label for="f-nume">Nume</label><input id="f-nume" name="nume" autocomplete="name" required></div>
        <div class="field"><label for="f-tel">Telefon</label><input id="f-tel" name="telefon" type="tel" inputmode="tel" autocomplete="tel" required></div>
      </div>
      <div class="field"><label for="f-email">Email (opțional)</label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email"></div>
      <div class="field"><label for="f-srv">Ce te interesează?</label>
        <select id="f-srv" name="serviciu">${SRV_OPTIONS}</select></div>
      <div class="field"><label for="f-msg">Mesaj (opțional)</label><textarea id="f-msg" name="mesaj" rows="2"></textarea></div>
      <label class="consent"><input type="checkbox" name="acord" required><span>Sunt de acord să fiu contactat(ă) de MOA Clinic pentru programare, conform <a href="${esc(ORIGIN)}/documente-legale-clinica-moa/" style="text-decoration:underline">politicii de confidențialitate</a>.</span></label>
      <button class="btn btn-gold arrow" type="submit" style="justify-self:start">Trimite cererea</button>
      <p class="form-msg" id="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
</main>

<footer>
  <div class="wrap ft-head">
    <div class="brand"><img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA Clinic"><p>Estetică medicală, chirurgie plastică și medicină regenerativă, coordonate de un medic primar geriatrie-gerontologie.</p></div>
    <dl class="ft-contact">
      <div><dt>Adresă</dt><dd><a href="https://maps.app.goo.gl/RHMvPm3KMHYY7BEG6" target="_blank" rel="noopener">Str. Ștefan Mihăileanu 35, București</a></dd></div>
      <div><dt>Telefon</dt><dd><a href="tel:+40743056605" data-track="telefon">0743 056 605</a> · <a href="https://wa.me/40743056605?text=${encodeURIComponent('Bună ziua! Aș dori o programare la MOA Clinic.')}" data-track="whatsapp">WhatsApp</a></dd></div>
      <div><dt>Email</dt><dd><a href="mailto:office@moaclinic.ro">office@moaclinic.ro</a></dd></div>
    </dl>
    <div class="ft-social"><a href="https://www.instagram.com/moaclinic" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg></a><a href="https://www.facebook.com/MoaClinicByOxxygene/" target="_blank" rel="noopener" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8a0 0 0 0 1 0 0z"/></svg></a></div>
  </div>
  <div class="wrap top">
    ${S.meniu.footer.map((f) => `<div><h4>${esc(f.titlu)}</h4><ul>${f.linkuri.map((l) => `<li><a href="${esc(/^https?:/.test(l.url) ? l.url : toLive(l.url) || '#')}">${esc(l.nume)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="wrap legal">
    <span>© ${new Date().getFullYear()} MOA Clinic · ${legal.map((f) => esc(f.nume) + (f.cui ? ` (CUI ${esc(f.cui)})` : '')).join(' · ')}</span>
    <span>MOA Regenerative by Oxxygene · parte a grupului medical Oxxygene</span>
  </div>
</footer>

<nav class="mbar" aria-label="Acțiuni rapide"><a href="tel:+40743056605" data-track="telefon">Sună</a><a href="https://wa.me/40743056605?text=${encodeURIComponent('Bună ziua! Aș dori o programare la MOA Clinic.')}" data-track="whatsapp">WhatsApp</a><a href="#programare">Programează-te</a></nav>

<div class="sheet" id="sheet" hidden>
  <div class="sheet-bg" data-close></div>
  <form class="sheet-in booking" id="sheet-form" role="dialog" aria-modal="true" aria-labelledby="sheet-t" novalidate>
    <span class="sheet-grip" aria-hidden="true"></span>
    <button class="sheet-x" type="button" data-close aria-label="Închide">✕</button>
    <h3 id="sheet-t">Cere o programare</h3>
    <p class="sheet-sub">Lasă numele și telefonul. Te sunăm noi pentru confirmare.</p>
    <div class="field"><label for="s-nume">Nume</label><input id="s-nume" name="nume" autocomplete="name" required></div>
    <div class="field"><label for="s-tel">Telefon</label><input id="s-tel" name="telefon" type="tel" inputmode="tel" autocomplete="tel" required></div>
    <div class="field"><label for="s-srv">Ce te interesează?</label><select id="s-srv" name="serviciu">${SRV_OPTIONS}</select></div>
    <label class="consent"><input type="checkbox" name="acord" required><span>Sunt de acord să fiu contactat(ă) pentru programare, conform <a href="${esc(ORIGIN)}/documente-legale-clinica-moa/" style="text-decoration:underline">politicii de confidențialitate</a>.</span></label>
    <button class="btn btn-gold arrow" type="submit">Trimite cererea</button>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>
</div>
<script src="/nou/wishlist.js?v=2" defer></script>
<script src="/nou/progres.js?v=1" defer></script>

<script>
(() => {
  const hdr = document.getElementById('hdr'), scrim = document.getElementById('scrim');
  const desk = () => matchMedia('(min-width:1101px)').matches;

  // mega-meniu desktop: hover cu mică întârziere, click, Esc, click în afară
  const btns = [...document.querySelectorAll('[data-mm]')];
  let openId = null, tOpen, tClose;
  const setOpen = (id) => {
    openId = id;
    btns.forEach((b) => b.setAttribute('aria-expanded', b.dataset.mm === id));
    document.querySelectorAll('.mm').forEach((p) => p.classList.toggle('open', p.id === 'mm-' + id));
    scrim.classList.toggle('on', id != null);
  };
  btns.forEach((b) => {
    b.addEventListener('click', (e) => { e.stopPropagation(); setOpen(openId === b.dataset.mm ? null : b.dataset.mm); });
    b.addEventListener('mouseenter', () => { if (!desk()) return; clearTimeout(tClose); clearTimeout(tOpen); tOpen = setTimeout(() => setOpen(b.dataset.mm), openId ? 0 : 110); });
    b.addEventListener('mouseleave', () => clearTimeout(tOpen));
  });
  hdr.addEventListener('mouseleave', () => { if (desk()) tClose = setTimeout(() => setOpen(null), 220); });
  hdr.addEventListener('mouseenter', () => clearTimeout(tClose));
  scrim.addEventListener('click', () => setOpen(null));
  document.addEventListener('click', (e) => { if (!e.target.closest('.mm')) setOpen(null); });
  document.querySelectorAll('.mm a').forEach((a) => a.addEventListener('click', () => setOpen(null)));
  // în panou: zona / categoria se schimbă la hover, focus sau click
  document.querySelectorAll('.mm-tab').forEach((t) => {
    const show = (e) => {
      const mmEl = t.closest('.mm'), inp = mmEl.querySelector('.mm-search input');
      if (inp && inp.value.trim()) { if (e?.type === 'mouseenter') return; inp.value = ''; mmEl.querySelector('.mm-results').hidden = true; }
      const side = t.closest('.mm-side');
      side.querySelectorAll('.mm-tab').forEach((x) => x.setAttribute('aria-selected', x === t));
      t.closest('.mm-in').querySelectorAll('.mm-pane').forEach((p) => (p.hidden = p.id !== 'pane-' + t.dataset.pane));
    };
    t.addEventListener('mouseenter', show); t.addEventListener('focus', show); t.addEventListener('click', show);
  });
  // căutarea din mega meniu: caută în toate categoriile panoului (fără diacritice), Enter deschide primul rezultat
  const nz = (x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  document.querySelectorAll('.mm-search input').forEach((inp) => {
    const mmEl = inp.closest('.mm'), res = mmEl.querySelector('.mm-results'), list = res.querySelector('.mm-list'), none = res.querySelector('.mm-none'), cnt = res.querySelector('.mm-rcount');
    const panes = [...mmEl.querySelectorAll('.mm-pane')], rows = [...mmEl.querySelectorAll('.mm-pane .mm-row')];
    const run = () => {
      const words = nz(inp.value.trim()).split(/\\s+/).filter(Boolean);
      if (!words.length) { res.hidden = true; const cur = mmEl.querySelector('.mm-tab[aria-selected="true"]'); panes.forEach((p) => (p.hidden = p.id !== 'pane-' + cur.dataset.pane)); return; }
      const seen = new Set();
      const hits = rows.filter((r) => words.every((w) => r.dataset.q.includes(w))).filter((r) => { const k = r.getAttribute('href') + '|' + r.querySelector('b').textContent; return !seen.has(k) && seen.add(k); });
      list.innerHTML = '';
      hits.slice(0, 14).forEach((r) => { const c = r.cloneNode(true); const sm = document.createElement('small'); sm.className = 'mm-cat'; sm.textContent = r.dataset.cat || ''; c.querySelector('.mm-row-t').appendChild(sm); c.addEventListener('click', () => setOpen(null)); list.appendChild(c); });
      panes.forEach((p) => (p.hidden = true)); res.hidden = false; none.hidden = hits.length > 0;
      cnt.textContent = hits.length ? hits.length + (hits.length === 1 ? ' tratament' : ' tratamente') + ' pentru „' + inp.value.trim() + '”' : '';
    };
    inp.addEventListener('input', run);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const a = list.querySelector('a'); if (a && !res.hidden) { e.preventDefault(); location.href = a.href; } } });
  });

  // meniu mobil: ecrane pe niveluri, cu „Înapoi”
  const mnav = document.getElementById('mnav'), back = document.getElementById('mback'), mlogo = document.getElementById('mlogo');
  const stack = ['root'];
  const show = (dir) => {
    const cur = stack.at(-1);
    mnav.querySelectorAll('.mscreen').forEach((s) => {
      const i = stack.indexOf(s.dataset.screen);
      s.classList.toggle('on', s.dataset.screen === cur);
      s.classList.toggle('left', i > -1 && s.dataset.screen !== cur);
    });
    back.hidden = stack.length < 2;
  };
  const mOpen = (o) => {
    mnav.classList.toggle('open', o); mnav.setAttribute('aria-hidden', !o);
    if (o) mnav.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
    document.getElementById('burger').setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
    if (!o) { stack.length = 1; show(); }
  };
  document.getElementById('burger').addEventListener('click', () => mOpen(true));
  document.getElementById('mclose').addEventListener('click', () => mOpen(false));
  back.addEventListener('click', () => { stack.pop(); show(); });
  mnav.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { stack.push(b.dataset.go); show(); }));
  mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => mOpen(false)));
  const msIn = mnav.querySelector('.ms-search input');
  if (msIn) {
    const msRes = mnav.querySelector('.ms-results'), msList = msRes.querySelector('.ms-rlist'), msNone = msRes.querySelector('.ms-none'), msCnt = msRes.querySelector('.ms-rcount'), msHome = mnav.querySelector('.ms-home');
    const msRows = [...mnav.querySelectorAll('.mscreen[data-screen^="z"] a.mrow, .mscreen[data-screen^="c"] a.mrow')];
    const nzm = (x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    msIn.addEventListener('input', () => {
      const words = nzm(msIn.value.trim()).split(/\\s+/).filter(Boolean);
      msRes.hidden = !words.length; msHome.hidden = !!words.length;
      if (!words.length) return;
      const seen = new Set();
      const hits = msRows.filter((r) => words.every((w) => r.dataset.q.includes(w))).filter((r) => { const k = r.getAttribute('href') + '|' + r.querySelector('b').textContent; return !seen.has(k) && seen.add(k); });
      msList.innerHTML = '';
      hits.slice(0, 20).forEach((r) => { const c = r.cloneNode(true); c.addEventListener('click', () => mOpen(false)); msList.appendChild(c); });
      msNone.hidden = hits.length > 0;
      msCnt.textContent = hits.length ? hits.length + (hits.length === 1 ? ' rezultat' : ' rezultate') : '';
    });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setOpen(null); mOpen(false); } });

  // slider-ul din hero: fade, 5 s, pauză la hover / focus, swipe, săgeți de la tastatură
  const hs = document.getElementById('hs');
  if (hs) {
    const slides = [...hs.querySelectorAll('.hs-slide')], dots = [...hs.querySelectorAll('[data-hsi]')];
    const label = hs.querySelector('.hs-label'), count = hs.querySelector('.hs-count b');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = 0, timer;
    const goTo = (n) => {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle('on', i === cur); s.setAttribute('aria-hidden', i !== cur); });
      load(cur); load(cur + 1);
      dots.forEach((d, i) => d.classList.toggle('on', i === cur));
      label.textContent = slides[cur].dataset.label;
      count.textContent = String(cur + 1).padStart(2, '0');
    };
    const play = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => goTo(cur + 1), 5000); };
    const stop = () => clearInterval(timer);
    hs.querySelectorAll('[data-hs]').forEach((b) => b.addEventListener('click', () => { goTo(cur + Number(b.dataset.hs)); play(); }));
    dots.forEach((d) => d.addEventListener('click', () => { goTo(Number(d.dataset.hsi)); play(); }));
    hs.addEventListener('mouseenter', stop); hs.addEventListener('mouseleave', play);
    hs.addEventListener('focusin', stop); hs.addEventListener('focusout', play);
    hs.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') goTo(cur - 1); if (e.key === 'ArrowRight') goTo(cur + 1); });
    let x0 = null;
    hs.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    hs.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1)); x0 = null; play(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
    // preîncarcă următoarea imagine
    // imaginile ascunse se descarcă abia după încărcarea paginii (nu concurează cu prima imagine)
    function load(n) { const im = slides[(n + slides.length) % slides.length].querySelector('img'); if (im.dataset.src && !im.src) im.src = im.dataset.src; }
    const pre2 = () => setTimeout(() => load(1), 1500);
    if (document.readyState === 'complete') pre2(); else addEventListener('load', pre2);
    play();
  }

  // echipa: filtru pe grupuri
  const tf = [...document.querySelectorAll('[data-team]')];
  tf.forEach((b) => b.addEventListener('click', () => {
    tf.forEach((x) => x.setAttribute('aria-selected', x === b));
    document.querySelectorAll('.doc[data-grup]').forEach((d) => (d.hidden = b.dataset.team !== 'toti' && d.dataset.grup !== b.dataset.team));
  }));

  // șine orizontale: săgeți (derulează cu o „pagină”)
  document.querySelectorAll('[data-rail]').forEach((b) => b.addEventListener('click', () => {
    const r = b.closest('.hp-sec')?.querySelector('.hp-rail:not([hidden])');
    if (r) r.scrollBy({ left: Number(b.dataset.rail) * r.clientWidth * 0.8, behavior: 'smooth' });
  }));

  // „Ce te supără?” pe zone
  const tabs = [...document.querySelectorAll('[data-tab]')];
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-selected', x === t));
    document.querySelectorAll('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== t.dataset.tab));
  }));

  // posterele video: abia când se apropie de ecran
  const vio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.poster = e.target.dataset.poster; vio.unobserve(e.target); } }), { rootMargin: '400px' });
  document.querySelectorAll('video[data-poster]').forEach((v) => vio.observe(v));

  // video: se încarcă doar la click
  document.querySelectorAll('.v-card').forEach((c) => c.querySelector('.play').addEventListener('click', () => { const v = c.querySelector('video'); c.classList.add('playing'); v.controls = true; v.play(); }));
  document.addEventListener('play', (e) => { document.querySelectorAll('.v-card video').forEach((o) => { if (o !== e.target) o.pause(); }); }, true);

  // apariție la scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));
  // ?static: totul vizibil de la început (capturi de ecran, audit)
  if (location.search.includes('static')) document.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));

  // măsurare: fiecare acțiune importantă ajunge în dataLayer (GTM / GA4 o preiau când se adaugă codul de măsurare)
  window.dataLayer = window.dataLayer || [];
  const track = (event, extra = {}) => window.dataLayer.push({ event, pagina: location.pathname, ...extra });
  // sursa vizitei (UTM, referrer, prima pagină), păstrată pe durata sesiunii și trimisă cu lead-ul
  const SRC_KEY = 'moa-sursa';
  let sursaVizita = null;
  try {
    const q = new URLSearchParams(location.search);
    const utm = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].filter((k) => q.get(k)).map((k) => [k, q.get(k)]));
    sursaVizita = JSON.parse(sessionStorage.getItem(SRC_KEY) || 'null');
    if (!sursaVizita || Object.keys(utm).length) { sursaVizita = { ...utm, referrer: document.referrer && !document.referrer.includes(location.host) ? document.referrer : '', intrare: location.pathname }; sessionStorage.setItem(SRC_KEY, JSON.stringify(sursaVizita)); }
  } catch {}
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a, button'); if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('tel:')) track('click_telefon');
    else if (href.includes('wa.me/')) track('click_whatsapp');
    else if (href === '#programare' || a.dataset.srv) track('click_programare', { serviciu: a.dataset.srv || '' });
    if (a.closest('.tr-offer, .tr-offer-row, .o-card, .hp-of, .pr-off, .pr-orow, .ps-card')) track('click_oferta', { oferta: a.dataset.srv || a.textContent.trim().slice(0, 80) });
  }, true);
  // formulare -> lead în panou (POST /api/leads): formularul din pagină și cel din panoul de jos (mobil)
  const telOk = (t) => t.replace(/[\\s.()-]/g, '').replace(/^[+]?40/, '0').match(/^0[0-9]{9}$/);
  document.querySelectorAll('form.booking').forEach((f) => {
    const msg = f.querySelector('.form-msg');
    const say = (cls, t) => { msg.className = 'form-msg ' + cls; msg.textContent = t; };
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      if (!(d.nume || '').trim()) { say('err', 'Completează numele.'); f.nume.focus(); return; }
      if (!telOk(d.telefon || '')) { say('err', 'Numărul de telefon pare incomplet (ex. 0743 056 605).'); f.telefon.focus(); return; }
      if (!d.acord) { say('err', 'Bifează acordul pentru a putea fi contactat(ă).'); return; }
      const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
      try {
        const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nume: d.nume.trim(), telefon: d.telefon.trim(), email: (d.email || '').trim() || undefined, serviciu: d.serviciu || undefined, mesaj: (d.mesaj || '').trim() || undefined, sursa: 'Formular site', pagina: location.pathname, origine: sursaVizita || undefined }) });
        if (!r.ok) throw new Error();
        track('lead_trimis', { serviciu: d.serviciu || '' });
        f.reset(); say('ok', 'Mulțumim! Te sunăm în curând pentru confirmare.');
      } catch { say('err', 'Nu am putut trimite cererea. Sună-ne la 0743 056 605.'); }
      btn.disabled = false;
    });
  });

  // mobil: „Programează-te” deschide formularul ca panou de jos, cu serviciul precompletat din context
  const sheet = document.getElementById('sheet'), sf = document.getElementById('sheet-form');
  const mobile = () => matchMedia('(max-width:760px)').matches;
  let lastFocus = null;
  const openSheet = (srv) => {
    lastFocus = document.activeElement;
    const sel = sf.serviciu;
    if (srv) { if (![...sel.options].some((o) => o.text === srv)) sel.add(new Option(srv, srv), 1); sel.value = [...sel.options].find((o) => o.text === srv).value; }
    sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add('open'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => sf.nume.focus({ preventScroll: true }), 320);
  };
  const closeSheet = () => { sheet.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => (sheet.hidden = true), 300); lastFocus?.focus?.({ preventScroll: true }); };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#programare"]');
    if (!a) return;
    if (mobile()) { e.preventDefault(); openSheet(a.dataset.srv || ''); return; }
    // desktop: formularul din pagină primește serviciul / oferta (adăugată în listă dacă lipsește)
    const sel = document.getElementById('f-srv');
    if (a.dataset.srv && sel) {
      if (![...sel.options].some((o) => o.text === a.dataset.srv)) sel.add(new Option(a.dataset.srv, a.dataset.srv), 1);
      sel.value = [...sel.options].find((o) => o.text === a.dataset.srv).value;
      sel.classList.add('flash'); setTimeout(() => sel.classList.remove('flash'), 1600);
    }
  });
  sheet.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  // header: se ascunde la scroll în jos, reapare la scroll în sus
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY, menuOpen = !!document.querySelector('.mm.open');
    // starea se schimbă doar la o mișcare clară; pașii mici (scroll lent, finalul unui scroll animat) o păstrează
    if (y < 240 || y < lastY - 6) hdr.classList.remove('hide');
    else if (!menuOpen && y > lastY + 6) hdr.classList.add('hide');
    lastY = y;
    hdH();
  }, { passive: true });
  // înălțimea vizibilă a header-ului (0 când e ascuns), pentru elementele lipite sub el (ex. cuprinsul paginilor de tratament)
  function hdH() { document.documentElement.style.setProperty('--hd-h', (hdr.classList.contains('hide') ? 0 : hdr.offsetHeight) + 'px'); }
  hdH(); addEventListener('resize', hdH);

  // eticheta „Propunere de homepage” se poate ascunde
  document.getElementById('proto-x')?.addEventListener('click', () => document.getElementById('proto').remove());
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.join(ROOT, 'nou'), { recursive: true });
writePage(path.join(ROOT, 'nou', 'index.html'), html);
console.log(`Gata: nou/index.html · ${team.length} oameni în echipă (${doctors.length} cu fotografie) · ${concernZones.reduce((n, z) => n + z.copii.length, 0)} probleme · ${SIG.length} tratamente-semnătură · ${VID.length} video · ${offers.length} oferte · ${reviews.length} recenzii`);

// ---------- paginile de profil ale echipei (/nou/medici/<id>/), din profilurile extrase ----------
// Refolosesc header-ul, footer-ul, programarea și scriptul homepage-ului; linkurile-ancoră duc înapoi pe homepage.
const sliceBetween = (a, b) => html.slice(html.indexOf(a), html.indexOf(b, html.indexOf(a)));
const toHome = (s) => s.replace(/href="#(ce-te-supara|echipa|recenzii|despre)"/g, 'href="/nou/#$1"');
const TOP = toHome(sliceBetween('<div class="topbar">', '<main>'));
const BOOK = sliceBetween('<section class="sec book" id="programare">', '</main>');
const BOTTOM = toHome(html.slice(html.indexOf('</main>')));
const fmtPer = (x) => String(x || '').replace(/^din\s+/i, '').replace(/\s*până în prezent/, ' – prezent');
const cutTxt = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };
const prettyName = (s) => (s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s).replace(/\s+(în|in) Bucure[sș]ti$/i, '');

for (const p of team.filter((x) => x.profil_detaliat)) {
  const pr = p.profil_detaliat;
  const photo = pr.imagine && fs.existsSync(path.join(ROOT, 'site', pr.imagine)) ? pr.imagine : photos[p.nume] ? resized(photos[p.nume]) : null;
  // serviciile din specialitatea lui; consultațiile doar dacă țin de specialitate (antiaging / nutriție la gerontologie)
  const CONSULT_SPEC = { Gerontologie: /antiaging|nutritie/, 'Chirurgie plastică': /chirurgie/, Dermatovenerologie: /dermato/ };
  const servP = D.servicii.filter((s) => ((s.medici || []).includes(p.nume) || (p.servicii || []).includes(s.id)) && (s.categorie !== 'Consultații' || (CONSULT_SPEC[p.specialitate] || /./).test(s.id)));
  const last = p.nume.replace(/^Dr\.\s*/, '').split(' ').pop();
  const allArts = D.articole.filter((a) => a.autor && a.autor.includes(last));
  const arts = allArts.slice(0, 6);
  // cronologie: funcții + supraspecializări, după anul de început (cel mai recent primul)
  const year = (s) => +((String(s).match(/\d{4}/) || [0])[0]);
  const timeline = [
    ...pr.functii.map((f) => ({ per: fmtPer(f.perioada), text: f.text.replace(/\s*\(\d{4}\s*[–-]\s*\d{4}\)/, '').replace(/\s+din \d{4}( până în prezent)?$/, '').replace(/\s*[–-]\s*\d{4},/, ','), tip: 'Funcție' })),
    ...pr.supraspecializari.map((x) => ({ per: x.an, text: x.text, tip: 'Formare' })),
  ].sort((a, b) => year(b.per) - year(a.per));
  const pageUrl = `${ORIGIN}/medici/${p.id}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', '@id': pageUrl + '#webpage', url: pageUrl, name: `${p.nume} – ${p.rol} | MOA Clinic`, mainEntity: { '@id': pageUrl + '#person' }, inLanguage: 'ro-RO' },
      {
        '@type': ['Person', 'Physician'], '@id': pageUrl + '#person', name: p.nume, jobTitle: p.rol, url: pageUrl,
        ...(photo ? { image: ORIGIN + photo } : {}), description: pr.rezumat,
        medicalSpecialty: 'Geriatric', worksFor: { '@id': `${ORIGIN}/#organization` },
        alumniOf: (pr.parcurs || []).filter((l) => /Absolvent/.test(l)).map((l) => ({ '@type': 'CollegeOrUniversity', name: l.replace(/^Absolvent al\s*/, '') })),
        memberOf: pr.membru_in.map((n) => ({ '@type': 'Organization', name: n.replace(/^Societății/, 'Societatea') })),
        award: pr.distinctii.map((d) => `${d.titlu}${d.an ? ` (${d.an})` : ''}`),
        knowsAbout: pr.expertiza,
        sameAs: [pr.url],
      },
      ...pr.carti.map((c) => ({ '@type': 'Book', name: c.titlu, author: { '@id': pageUrl + '#person' }, ...(c.editura && !/www\./.test(c.editura) ? { publisher: { '@type': 'Organization', name: `Editura ${c.editura}` } } : {}), ...(c.an ? { datePublished: String(c.an) } : {}) })),
    ],
  };
  const list = (a, cls = '') => `<ul class="pf-list ${cls}">${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.nume)} – ${esc(p.rol)} | MOA Clinic</title>
<meta name="description" content="${esc(cutTxt(pr.rezumat || p.rol, 158))}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><a href="/nou/medici/">Echipa</a><span>›</span><span aria-current="page">${esc(p.nume)}</span></nav>

<section class="pf-hero">
  <div class="wrap pf-grid">
    <div class="pf-copy">
      <span class="eyebrow">${p.nume.includes('Stănescu') ? 'Fondator MOA · ' : ''}${esc(p.rol)}</span>
      <h1>${esc(p.nume)}</h1>
      <p class="lede">${esc(pr.rezumat || '')}</p>
      ${pr.citat ? `<blockquote class="pf-hq">„${esc(pr.citat)}”</blockquote>` : ''}
      <div class="pf-facts">${pr.cifre.map((c) => `<div><b>${esc(c.valoare)}</b><span>${esc(c.eticheta)}</span></div>`).join('')}</div>
      <div class="hero-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(p.specialitate === 'Gerontologie' ? 'Consultație antiaging (cu vârsta biologică)' : p.specialitate === 'Chirurgie plastică' ? 'Consultație chirurgie plastică' : p.specialitate === 'Dermatovenerologie' ? 'Consultație dermatologie & dermatoestetică' : '')}">Programează o consultație</a>${allArts.length ? `<a class="btn btn-line" href="#articole">${allArts.length} articole</a>` : ''}</div>
    </div>
    ${photo ? `<div class="pf-photo"><div class="frame"><img src="${esc(photo)}" alt="${esc(p.nume)}" fetchpriority="high"></div></div>` : ''}
  </div>
</section>

${(() => {
  // „Despre”: o singură secțiune cu file (Povestea · Expertiză · Parcurs · Recunoaștere), în loc de patru secțiuni lungi
  const ps = [...pr.biografie, ...(pr.formare || []), ...(pr.viziune || []).slice(0, 3)];
  const tabs = [];
  if (ps.length) tabs.push(['povestea', 'Povestea', `<div class="pf-prose pf-story">${ps.slice(0, 3).map((t) => `<p>${esc(t)}</p>`).join('')}${ps.length > 3 ? `<details class="tr-read"><summary>Citește toată povestea</summary>${ps.slice(3).map((t) => `<p>${esc(t)}</p>`).join('')}</details>` : ''}</div>`]);
  const exp = [['Domenii de expertiză', pr.expertiza], ['Rolul în MOA', pr.rol_moa || []], ['Programe coordonate', pr.programe || []]].filter(([, l]) => l.length);
  if (exp.length) tabs.push(['expertiza', 'Expertiză', `<div class="pf-cols">${exp.map(([h, l]) => `<div><h3 class="pf-col-h">${esc(h)}</h3>${list(l)}</div>`).join('')}</div>`]);
  if (timeline.length) tabs.push(['parcurs', `Parcurs · ${timeline.length}`, `<ol class="pf-tl2">${timeline.map((t, i) => `<li${i >= 6 ? ' class="pf-more"' : ''}><span class="pf-per2">${esc(t.per || '')}</span><small>${esc(t.tip)}</small><p>${esc(t.text)}</p></li>`).join('')}</ol>${timeline.length > 6 ? `<button type="button" class="pf-tl-all" onclick="this.parentElement.classList.add('open');this.remove()">Vezi tot parcursul (${timeline.length}) +</button>` : ''}`]);
  const rec = [];
  if (pr.carti.length) rec.push(`<div><h3 class="pf-col-h">Cărți</h3>${pr.carti.map((c) => `<div class="pf-book"><b>${esc(c.titlu)}</b><span>${esc([c.editura && !/www\./.test(c.editura) ? 'Editura ' + c.editura : c.editura ? 'carte digitală · ' + c.editura : '', c.an].filter(Boolean).join(' · '))}</span></div>`).join('')}</div>`);
  if (pr.membru_in.length) rec.push(`<div><h3 class="pf-col-h">Membru în</h3>${list(pr.membru_in.map((n) => n.replace(/^Societății/, 'Societatea')))}${(pr.activitate || []).filter((l) => !/pacienți/.test(l)).map((l) => `<p class="pf-note">${esc(l)}</p>`).join('')}</div>`);
  if (pr.distinctii.length) rec.push(`<div><h3 class="pf-col-h">Distincții</h3>${pr.distinctii.map((d) => `<div class="pf-award"><span>${esc(d.an || '')}</span><p>${esc(d.titlu)}</p></div>`).join('')}</div>`);
  if (rec.length) tabs.push(['recunoastere', 'Recunoaștere', `<div class="pf-cols">${rec.join('')}</div>`]);
  if (!tabs.length) return '';
  return `<section class="sec" id="despre-medic">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Despre</span><h2 style="margin-top:18px">${p.nume.includes('Stănescu') ? 'Fondatorul <em>MOA</em>' : 'Despre <em>medic</em>'}</h2></div>
      <div class="team-filter pf-tabs" role="tablist">${tabs.map(([id, n], i) => `<button type="button" role="tab" class="${i ? '' : 'on'}" aria-selected="${!i}" data-pf="${id}">${esc(n)}</button>`).join('')}</div></div>
    ${tabs.map(([id, , html], i) => `<div class="pf-panel" role="tabpanel" data-pf="${id}"${i ? ' hidden' : ''}>${html}</div>`).join('')}
  </div>
</section>
<script>
document.querySelectorAll('.pf-tabs button').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.pf-tabs button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
  document.querySelectorAll('.pf-panel').forEach((p) => { p.hidden = p.dataset.pf !== b.dataset.pf; });
}));
</script>`;
})()}

${arts.length ? `<section class="sec alt" id="articole">
  <div class="wrap pf-arts">
    <div><span class="eyebrow">Articole</span><h2 class="pf-h2">Articolele <em>sale</em></h2><p class="cs-sub">${allArts.length} articole pe blogul clinicii.</p>
      <a class="link-u" href="${esc(pr.url)}">Toate cele ${allArts.length} de articole →</a></div>
    <ul class="tr-arts">${arts.slice(0, 3).map((a) => `<li><a href="${esc(artLink(a))}"><small>${esc(a.tip)}</small><span>${esc(a.titlu)}</span></a></li>`).join('')}</ul>
  </div>
</section>` : ''}

${BOOK}${BOTTOM}`;
  const dir = path.join(ROOT, 'nou', 'medici', p.id);
  fs.mkdirSync(dir, { recursive: true });
  writePage(path.join(dir, 'index.html'), page);
  console.log(`Profil: nou/medici/${p.id}/ · ${timeline.length} repere · ${pr.carti.length} cărți · ${servP.length} servicii · ${allArts.length} articole`);
}

// ---------- paginile de tratament (/nou/tratamente/<categorie>/<tratament>/), din data/tratamente.json ----------
// Ordinea secțiunilor urmează șablonul „tratament” din Structură: ce rezolvă → pentru cine → cum acționează → cum decurge →
// rezultate → siguranță & recuperare → medicii → prețuri → întrebări → recenzii → asociate → articole → programare.
// Se generează toate tratamentele din structură care au conținut extras (trNode, definit sus); restul linkurilor duc la paginile actuale.
const TR_PAGINI = [...trNode.keys()];
const trHref = live;
const sentences = (s) => String(s).match(/[^.!?]+[.!?]+/g) || [s];
const SALES = /ai ajuns în locul potrivit|vrei să afli|programează-te acum/i;
const norm = (x) => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// curățenie pe textele vechi: paragrafele „• …” consecutive devin listă, rândurile de tip „Full Body 950 Lei (Preț Inițial 2000 Lei)”
// devin tabel, iar paragrafele/subtitlurile repetate în aceeași secțiune (copiate de două ori pe pagina veche) apar o singură dată
const PRICE_LINE = /^(.{3,110}?)\s*(\d[\d.]*)\s*(?:lei|ron)\b\s*(?:\(?\s*\(?\s*(.*?)\)?\s*)?$/i;
function tidyBlocks(bl) {
  const seen = new Set(), out = [];
  for (const b of bl) {
    const key = (b.t === 'p' || b.t === 'h3') ? b.t + ':' + b.x : null;
    if (key && b.x.length > 3 && seen.has(key)) continue;
    if (key) seen.add(key);
    const last = out[out.length - 1];
    if (b.t === 'p' && /^[•·▪●-]\s+/.test(b.x)) {
      const item = b.x.replace(/^[•·▪●-]\s+/, '');
      if (last && last.t === 'ul' && last._bul) last.items.push(item); else out.push({ t: 'ul', items: [item], _bul: true });
      continue;
    }
    const pm = b.t === 'p' && b.x.length < 150 && b.x.replace(/\s*Programeaz\S*\s*$/i, '').match(PRICE_LINE);
    if (pm) {
      const extra = (pm[3] || '').replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
      const init = extra.match(/pre[țt]\s*ini[țt]ial\s*(\d[\d.]*)/i);
      const row = { n: pm[1].replace(/[\s(–-]+$/, '').trim(), v: +pm[2].replace(/\./g, ''), init: init ? +init[1].replace(/\./g, '') : null, extra: extra.replace(/pre[țt]\s*ini[țt]ial\s*\d[\d.]*\s*(lei|ron)?/i, '').trim() };
      if (last && last.t === 'ptabel') last.rows.push(row); else out.push({ t: 'ptabel', rows: [row] });
      continue;
    }
    out.push(b);
  }
  // un singur rând de preț rămâne paragraf
  return out.map((b) => (b.t === 'ptabel' && b.rows.length < 3 ? b.rows.map((r) => ({ t: 'p', x: `${r.n} ${r.v} lei${r.extra ? ' (' + r.extra + ')' : ''}` })) : [b])).flat();
}
function trBlocks(bl) {
  return tidyBlocks(bl).map((b) => {
    if (b.t === 'ptabel') return `<table class="tr-prices tr-ptab">${b.rows.map((r) => `<tr><td>${esc(r.n)}${r.extra ? `<small class="tr-psub">${esc(r.extra)}</small>` : ''}</td><td>${r.init ? `<s>${lei(r.init)}</s> ` : ''}${lei(r.v)}</td></tr>`).join('')}</table>`;
    if (b.t === 'p') return `<p>${esc(b.x)}</p>`;
    if (b.t === 'h3') return `<h4>${esc(b.x)}</h4>`;
    if (b.t === 'ul') return `<ul class="pf-list">${b.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    if (b.t === 'pasi') return `<ol class="tr-steps">${b.items.map((x) => `<li><b>${esc(x.titlu)}</b>${x.text ? `<p>${esc(x.text)}</p>` : ''}</li>`).join('')}</ol>`;
    if (b.t === 'tabel') return `<table class="tr-table">${b.rows.map((r) => `<tr><td>${esc(r)}</td></tr>`).join('')}</table>`;
    return '';
  }).join('');
}
// „Fruntea – pentru netezirea…” → card cu titlu + descriere
// fundalurile secțiunilor, alternate: ivoriu / crem; secțiunile închise (siguranță, programare) despart singure
function alternateBg(html) {
  let prev = 'ivory';
  return html.replace(/<section class="(sec(?: [^"]*)?)"([^>]*)>/g, (m, cls, rest) => {
    rest = rest.replace(/\s*style="background:var\(--cream\)"/, '');
    if (/\b(safety|book)\b/.test(cls)) { prev = 'dark'; return `<section class="${cls}"${rest}>`; }
    const bg = prev === 'cream' ? 'ivory' : 'cream';
    prev = bg;
    return `<section class="${cls}${bg === 'cream' ? ' alt' : ''}"${rest}>`;
  });
}
const zoneCards = (items) => items.map((x) => { const [z, ...d] = x.split(/\s+[–-]\s+/); return { t: z.trim(), d: d.join(' – ').replace(/^pentru\s+/i, '').replace(/\.$/, '') }; });

for (const id of TR_PAGINI) {
  const t = TRD[id], s = serv[id], loc = trNode.get(id);
  if (!t || !s || !loc) { console.warn('  ! tratament fără date/structură:', id); continue; }
  const { nod, cat, consult } = loc;
  const sec = (rol) => t.sectiuni.filter((x) => x.rol === rol);
  const paras = (rol) => sec(rol).flatMap((x) => x.blocuri.filter((b) => b.t === 'p').map((b) => b.x));
  const lists = (rol) => sec(rol).flatMap((x) => x.blocuri.filter((b) => b.t === 'ul').flatMap((b) => b.items));
  const flat = (b) => b.x || (b.items || []).map((i) => (i.titlu ? i.titlu + ' ' + i.text : i)).join(' ');
  const allText = [...t.sectiuni.flatMap((x) => x.blocuri.map(flat)), ...t.faq.flatMap((f) => f.blocuri.map(flat))].join(' ');

  // Regula șablonului: niciun conținut de pe pagina veche nu se pierde. Fiecare bloc ajunge în secțiunea lui dedicată,
  // în „Citește mai mult” al ei, sau (dacă nu se potrivește nicăieri) într-o secțiune simplă cu titlul original.
  const B = (rol) => sec(rol).flatMap((x) => x.blocuri);
  const P = (x) => ({ t: 'p', x });
  const colon = (b) => b.t === 'p' && /:$/.test(b.x) && b.x.length < 90; // „Principalele beneficii includ:” – doar introduce lista
  const promisiune = sentences(paras('intro').join(' ')).find((x) => /MOA/.test(x))?.trim();
  const introP = paras('intro').filter((p) => !SALES.test(p) && !(promisiune && p.includes(promisiune) && p.length < promisiune.length + 40));
  // ce rezolvă, în 1–2 fraze: din „ce este”, altfel din intro (fără formulele de vânzare)
  const ceEste = paras('ce-este').length ? paras('ce-este') : introP;
  const firstP = t.sectiuni.filter((x) => x.rol !== 'pret').flatMap((x) => x.blocuri).find((b) => b.t === 'p' && b.x.length > 60 && !SALES.test(b.x) && !/:$/.test(b.x))?.x;
  const cleanDesc = String(s.descriere || '').split(/\s*✓\s*/)[0].replace(/\s*(Rezerv[aă] acum|Programeaz[aă]-te acum)[^.]*\.?$/i, '').trim();
  const faqLede = t.faq.flatMap((q) => q.blocuri).find((b) => b.t === 'p' && b.x.length > 60)?.x;
  const ledeFull = ceEste[0] || firstP || faqLede || cleanDesc || '';
  const ledeShort = (() => { if (ledeFull.length <= 300) return ledeFull; let out = ''; for (const x of sentences(ledeFull)) { if ((out + x).length > 280 && out) break; out += x; } return out.trim() || ledeFull; })();
  const lede = ledeShort;
  const ledeRest = ledeFull.slice(ledeShort.length).trim();
  const notLede = (b) => !(b.t === 'p' && b.x === ledeFull);
  // „cum acționează”: restul textului din „ce este” (+ intro, dacă există „ce este”) + beneficiile care nu sunt listă
  const benList = lists('beneficii'), benBl = B('beneficii'), benH3 = [];
  benBl.forEach((b, i) => { if (b.t === 'h3') benH3.push(b.x.replace(/:$/, '') + (benBl[i + 1]?.t === 'p' ? ' – ' + benBl[i + 1].x : '')); });
  const CAUTION = /\bnu (se|sunt|este|trebuie|e)\b|contraindic|evitat|acordul|pot (produce|influența|constitui)|prealabil|însărcinate|alăpt/i;
  const benAll = benList.length ? benList : benH3;
  const benefits = benAll.filter((x) => !CAUTION.test(x)), cautions = benAll.filter((x) => CAUTION.test(x));
  const benRest = benBl.filter((b, i) => !colon(b) && (benList.length ? b.t !== 'ul' : b.t !== 'h3' && !(b.t === 'p' && benBl[i - 1]?.t === 'h3')));
  const howBl = [
    ...(ledeRest ? [P(ledeRest)] : []),
    ...ceEste.slice(1).map(P),
    ...B('ce-este').filter((b) => b.t !== 'p'),
    ...B('intro').filter((b) => b.t !== 'p'), // listele din introducere (ex. „când se recomandă” la nutrigenetică)
    ...(paras('ce-este').length ? introP.map(P) : []),
    ...benRest,
  ].filter((b) => !colon(b));
  // „pentru cine”: zonele (sau lista de indicații) devin carduri; primul paragraf e textul de deschidere, restul la „Citește mai mult”
  const zoneItems = lists('zone');
  const whoItems = zoneItems.length ? zoneItems : lists('indicatii');
  const notIntro = (p) => !(/:$/.test(p) && p.length < 90); // „Este indicată atunci când:” doar introduce o listă
  const whoLede = paras('indicatii').find(notIntro) || paras('zone').find(notIntro) || '';
  let whoUlUsed = false;
  const whoMore = [...B('indicatii'), ...B('zone')].filter((b) => {
    if (b.t === 'p') return b.x !== whoLede && !colon(b);
    if (b.t === 'ul' && !whoUlUsed && b.items.every((x) => whoItems.includes(x))) { whoUlUsed = true; return false; }
    return true;
  });
  const whoCards = whoItems.length && whoItems.every((x) => x.split(/\s+[–-]\s+/)[0].length <= 48);
  // repere rapide, doar dacă apar în textul paginii
  const mRez = allText.match(/(?:vizibile|apar|observ\w*)[^.]{0,40}?în (\d+\s*[–-]\s*\d+ zile)/i);
  const mDur = allText.match(/(?:persistă|durează|țin\w*|rezistă)[^.]{0,30}?(?:între )?(\d+)\s*(?:și|[–-])\s*(\d+) luni/i);
  const fara = /nu necesită (?:timp de |perioadă de )?recuperare|fără (?:timp de |perioadă de )?recuperare/i.test(allText);
  const pret = minPrice(id);
  const kw = [...new Set(norm(`${nod.nume} ${t.h1}`.toLowerCase()).split(/[^a-z]+/).filter((w) => w.length >= 5 && !/^(trata|injec|bucur|terap|consu|proce|facia)/.test(w)).map((w) => w.slice(0, 5)))];
  const kwRe = new RegExp(kw.join('|') || '^$', 'i');
  const offer = consult ? null : D.oferte.find((o) => o.pret && o.pretInitial && kwRe.test(norm(o.nume)));
  // numele ofertei, cu diacritice: numele tratamentului + ce precizează oferta (ex. „3 zone”)
  const offerZone = offer && offer.nume.match(/\d+\s*zon\w*/i);
  // textul cu care oferta ajunge în formular (și în lead): „Oferta lunii: Toxină botulinică · 3 zone – 1.099 lei”
  const offerName = offer && (offerZone ? `${nod.nume.replace(/\s*\(.*\)$/, '')} · ${offerZone[0].toLowerCase()}` : offerLabel(offer.nume));
  const offerSrv = offer ? `Oferta lunii: ${offerName} – ${lei(offer.pret)}` : '';
  const facts = [
    pret && { v: lei(pret), l: consult ? 'consultația' : 'de la, pe zonă' },
    consult && s.specialitate && { v: s.specialitate, l: 'medic specialist sau primar' },
    mRez && { v: mRez[1].replace(/\s*[–-]\s*/, '–'), l: 'până la primele efecte' },
    mDur && { v: `${mDur[1]}–${mDur[2]} luni`, l: 'cât durează efectul' },
    fara && { v: 'Fără', l: 'timp de recuperare' },
  ].filter(Boolean);

  // pașii: din lista numerotată; altfel din subtitluri (H3 + textul de sub ele); altfel din listă („Titlu: text”)
  const pasiBl = B('pasi');
  let steps = pasiBl.filter((b) => b.t === 'pasi').flatMap((b) => b.items);
  if (!steps.length && pasiBl.filter((b) => b.t === 'h3').length >= 2) {
    pasiBl.forEach((b, i) => { if (b.t !== 'h3') return; const txt = []; for (let j = i + 1; j < pasiBl.length && pasiBl[j].t !== 'h3'; j++) txt.push(flat(pasiBl[j])); steps.push({ titlu: b.x.replace(/:$/, ''), text: txt.join(' ') }); });
  }
  // dintr-o listă: „Titlu – text”, „Titlu: text” sau „Titlu. Text” (titlu scurt); o listă de fraze întregi rămâne listă
  const splitStep = (x) => { const m = x.match(/^(.{3,60}?)(?:\s+[–-]\s+|:\s+|\.\s+)(.+)$/); return m ? { titlu: m[1].replace(/\s+/g, ' ').trim(), text: cap(m[2].trim()) } : x.length <= 60 ? { titlu: x, text: '' } : null; };
  if (!steps.length) {
    const ul = pasiBl.find((b) => b.t === 'ul' && b.items.length >= 2 && b.items.filter((x) => splitStep(x)).length >= Math.ceil(b.items.length * 0.5));
    if (ul) steps = ul.items.map((x) => splitStep(x) || { titlu: '', text: x });
  }
  const firstStruct = pasiBl.findIndex((b) => b.t !== 'p');
  const stepsLede = (firstStruct > 0 ? pasiBl.slice(0, firstStruct) : pasiBl.slice(0, 1)).find((b) => b.t === 'p' && !colon(b))?.x || '';
  // paragrafele din „cum decurge” care nu au intrat în pași (durata ședinței, recuperarea…) se afișează sub pași
  const stepTxt = steps.map((x) => x.titlu + ' ' + x.text).join(' ');
  const stepsAfter = steps.length ? pasiBl.filter((b) => b.t === 'p' && !colon(b) && b.x !== stepsLede && !stepTxt.includes(b.x)) : [];
  // medicii: după specialitate (asocierea din pagina veche nu e de încredere – widget-ul de recenzii numește aceeași doctoriță peste tot)
  const medici = (s.medici || []).map((n) => team.find((p) => p.nume === n)).filter(Boolean);
  const arts = D.articole.map((a) => ({ a, sc: (kwRe.test(norm(a.titlu)) ? 2 : 0) + ((a.entitati || []).some((e) => kwRe.test(norm(e))) ? 1 : 0) })).filter((x) => x.sc).sort((x, y) => y.sc - x.sc).map((x) => x.a);
  const revs = D.dovezi.testimoniale.filter((r) => medici.some((m) => r.medic === m.nume) || kwRe.test(norm(r.citat)));
  const rev = [...new Set([...revs, ...D.dovezi.testimoniale])].filter((r) => r.citat.length > 25).slice(0, 12);
  const asoc = t.linkuri_tratamente.map((x) => serv[x]).filter(Boolean);
  const showGal = t.galerie.length >= 6;
  // secțiuni simple, cu titlul original: cele neclasificate + pașii fără structură + rezultatele fără galerie
  const info = [...sec('info'), ...(steps.length ? [] : sec('pasi')), ...(showGal ? [] : sec('rezultate'))].map((x) => ({ ...x, blocuri: x.blocuri.filter(notLede) })).filter((x) => trBlocks(x.blocuri).trim());
  const hasPrices = consult && s.preturi.length <= 1 ? false : s.preturi.length > 0 || sec('pret').some((x) => trBlocks(x.blocuri).trim());
  // siguranța pe coloane: fiecare „Titlu:” din text devine o coloană; „după tratament” = doar lista de reguli
  const safeCols = [], safeLead = [];
  for (const x of sec('siguranta')) {
    let cur = null;
    for (const b of x.blocuri) {
      if (b.t === 'p' && /:$/.test(b.x) && b.x.length < 60) { cur = { titlu: cap(b.x.replace(/:$/, '')), blocuri: [] }; safeCols.push(cur); }
      else if (cur) cur.blocuri.push(b); else safeLead.push(b);
    }
  }
  if (!safeCols.length && safeLead.length) safeCols.push({ titlu: 'Efecte și contraindicații', blocuri: safeLead.splice(0) });
  const dupaBl = sec('dupa').flatMap((x) => x.blocuri);
  const firstUl = dupaBl.findIndex((b) => b.t === 'ul');
  const dupaRules = firstUl >= 0 ? dupaBl.filter((b, i) => i >= firstUl && !(b.t === 'p' && /^respect/i.test(b.x))) : dupaBl;
  if (dupaRules.length) safeCols.push({ titlu: 'După tratament', blocuri: dupaRules });
  if (cautions.length) safeCols.push({ titlu: 'De reținut', blocuri: [{ t: 'ul', items: cautions }] });
  const safeIntro = safeLead.find((b) => b.t === 'p')?.x || '';
  const pageUrl = ORIGIN + nod.url;
  const tel = String(D.contact?.telefon || '0743056605').replace(/^\+?40/, '0').replace(/\s/g, '').replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
  const crumbs = consult ? [['Acasă', '/nou/', ORIGIN + '/'], ['Consultații', '/nou/consultatii/', ORIGIN + cat.url], [nod.nume, null, pageUrl]] : [['Acasă', '/nou/', ORIGIN + '/'], ['Tratamente', '/nou/#tratamente', ORIGIN + '/tratamente/'], [cat.nume, toLive(cat.url) || '/nou/#tratamente', ORIGIN + cat.url], [nod.nume, null, pageUrl]];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'MedicalWebPage', '@id': pageUrl + '#webpage', url: pageUrl, name: `${nod.nume} în București | MOA Clinic`, about: { '@id': pageUrl + '#procedura' }, inLanguage: 'ro-RO' },
      { '@type': 'MedicalProcedure', '@id': pageUrl + '#procedura', name: nod.nume, alternateName: t.h1, description: lede, ...(consult ? { procedureType: 'https://schema.org/NoninvasiveProcedure', medicalSpecialty: s.specialitate } : { procedureType: 'https://schema.org/NoninvasiveProcedure' }),
        ...(steps.length ? { howPerformed: steps.map((x) => x.titlu + (x.text ? ': ' + x.text : '')).join(' ') } : {}),
        ...(lists('dupa').length ? { followup: lists('dupa').join(' ') } : {}),
        ...(pret ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'RON', lowPrice: pret, highPrice: Math.max(...s.preturi.map((p) => p.valoare).filter(Boolean)), offerCount: s.preturi.length, seller: { '@id': `${ORIGIN}/#organization` } } } : {}) },
      { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, , u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: u })) },
      ...(t.faq.length ? [{ '@type': 'FAQPage', mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.blocuri.map(flat).join(' ') } })) }] : []),
    ],
  };
  // A2: pe injectabile, medicii care fac procedura, numiți (doar medici; ordinea: primar → specialist → rezident)
  const GRAD = { 'Medic primar': 0, 'Medic specialist': 1, 'Medic rezident': 2 };
  const docsInj = cat.url === '/tratamente/injectabile/' ? medici.filter((p) => p.tip === 'Medic').sort((a, b) => (GRAD[a.grad] ?? 9) - (GRAD[b.grad] ?? 9)) : [];
  // „medici primari și specialiști în chirurgie plastică și dermatologie”
  const docsSum = (() => { const g = [...new Set(docsInj.map((p) => p.grad).filter(Boolean))].map((x) => ({ 'Medic primar': 'primari', 'Medic specialist': 'specialiști', 'Medic rezident': 'rezidenți' })[x]).filter(Boolean); const sp = [...new Set(docsInj.map((p) => ({ 'Chirurgie plastică': 'chirurgie plastică', 'Dermatovenerologie': 'dermatologie', 'Gerontologie': 'gerontologie' })[p.specialitate] || p.specialitate.toLowerCase()))]; return `medici ${g.length > 1 ? g.slice(0, -1).join(', ') + ' și ' + g.slice(-1) : g[0] || ''} în ${sp.length > 1 ? sp.slice(0, -1).join(', ') + ' și ' + sp.slice(-1) : sp[0]}`; })();
  const docsBlock = docsInj.length ? `<div class="tr-docs"><span class="tr-docs-ph">${docsInj.slice(0, 4).map((p) => (photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="" loading="lazy">` : `<i>${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</i>`)).join('')}</span><span><b>Efectuată exclusiv de medici</b>${docsInj.map((p) => esc(p.nume)).join(', ')}<small>${esc(docsSum)}</small></span></div>` : '';
  const titleHtml = /\(([^)]+)\)$/.test(nod.nume) ? `${esc(nod.nume.replace(/\s*\([^)]+\)$/, ''))} <em>${esc(nod.nume.match(/\(([^)]+)\)$/)[1])}</em>` : esc(nod.nume);
  const book = BOOK.split(`<option>${nod.nume}</option>`).join(`<option selected>${nod.nume}</option>`);
  const urmeaza = consult ? [...trNode.entries()].filter(([x, l]) => !l.consult && (serv[x].medici || []).some((n) => (s.medici || []).includes(n))).map(([x]) => serv[x]).slice(0, 9) : [];
  const tVids = VID_ALL.filter((v) => v.pagini.some((p) => p.serviciu === id));
  const vidCards = tVids.map((v) => `<div class="v-card vp-card${VM[v.id]?.orientare === 'orizontal' ? ' wide' : ''}"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` data-poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește: ${esc(vTitle(v))}"><span>▶</span></button>${vDur(v) ? `<i class="vp-dur">${vDur(v)}</i>` : ''}</div><h3>${esc(vTitle(v))}</h3></div>`).join('');
  const vidBlock = tVids.length ? `<div class="tr-videos"><div class="tr-vh"><span class="eyebrow">Video din cabinet</span><a class="link-u" href="/nou/video/">Toate video-urile →</a></div><div class="vp-grid tr-vgrid">${vidCards}</div></div>` : '';
  const toc = [
    (whoItems.length || whoLede || whoMore.length) && ['#pentru-cine', 'Pentru cine'], steps.length && ['#cum-decurge', 'Cum decurge'], tVids.length && !steps.length && ['#video', 'Video'], showGal && ['#rezultate', 'Rezultate'],
    safeCols.length && ['#siguranta', 'Siguranță'], info.length && ['#pe-larg', 'Pe larg'], consult && (medici.length || urmeaza.length) && ['#medici', medici.length ? 'Cu cine' : 'Ce urmează'], hasPrices && ['#preturi', 'Prețuri'], t.faq.length && ['#intrebari', 'Întrebări'],
  ].filter(Boolean);
  const docCard = (p) => `<article class="doc rv${p.profil_detaliat ? ' has-profile' : ''}">${p.profil_detaliat ? `<a class="doc-link" href="/nou/medici/${esc(p.id)}/" aria-label="Profilul ${esc(p.nume)}"></a>` : ''}<div class="ph">${photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="${esc(p.nume)}" loading="lazy">` : `<div class="mono" role="img" aria-label="${esc(p.nume)} – fotografie în curând"><span>${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span><small>fotografie în curând</small></div>`}</div>
        <span class="tag">${esc(p.specialitate)}</span><h3>${esc(p.nume)}</h3><span>${esc(p.rol)}</span>${p.profil_detaliat ? '<span class="doc-more">Vezi profilul →</span>' : ''}</article>`;

  let page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(nod.nume)} în București${pret ? ` – de la ${pret} lei` : ''} | MOA Clinic</title>
<meta name="description" content="${esc(cutTxt(lede, 158))}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main class="tr-page tp">
<nav class="wrap crumbs" aria-label="Breadcrumb">${crumbs.map(([n, h]) => (h ? `<a href="${esc(h)}">${esc(n)}</a><span>›</span>` : `<span aria-current="page">${esc(n)}</span>`)).join('')}</nav>

<section class="pf-hero tr-hero">
  <div class="wrap pf-grid">
    <div class="pf-copy">
      <span class="eyebrow">${esc(cat.nume)}</span>
      <h1>${titleHtml}</h1>
      <p class="lede">${esc(lede)}</p>
      ${facts.length ? `<div class="pf-facts tr-facts">${facts.map((f) => `<div><b>${esc(f.v)}</b><span>${esc(f.l)}</span></div>`).join('')}</div>` : ''}
      <div class="hero-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(nod.nume)}">Programează-te</a><a class="btn btn-line" href="#preturi">Vezi prețurile</a></div>
      ${wlBtn(nod.nume.replace(/\s*\(.*\)$/, ''), minPrice(id), live(id))}
      <a class="tr-wa" href="https://wa.me/40743056605?text=${encodeURIComponent(`Bună ziua! Aș dori informații despre ${nod.nume.replace(/\s*\(.*\)$/, '')}.`)}" data-track="whatsapp">Sau scrie-ne discret pe WhatsApp →</a>
      ${docsBlock}
    </div>
    ${t.hero || HERO_NOU[id] ? `<div class="pf-photo tr-photo"><div class="frame"><img src="${esc(HERO_NOU[id]?.src || resized(t.hero))}" alt="${esc(nod.nume)} la MOA Clinic" fetchpriority="high"${HERO_NOU[id]?.pos ? ` style="object-position:${HERO_NOU[id].pos}"` : ''}></div>${offer ? `<a class="tr-offer" href="#programare" data-srv="${esc(offerSrv)}" aria-label="Programează-te cu oferta lunii: ${esc(offerName)}, ${lei(offer.pret)}"><small>Oferta lunii · -${offer.discountProcent}%</small><b>${esc(offerName)}</b><span><s>${lei(offer.pretInitial)}</s> ${lei(offer.pret)}</span><i>Programează-te →</i></a>` : ''}</div>` : ''}
  </div>
</section>

${toc.length >= 3 ? `<nav class="tr-toc" aria-label="Pe această pagină"><div class="wrap">${toc.map(([h, n]) => `<a href="${h}">${n}</a>`).join('')}<a class="tr-toc-cta" href="#programare" data-srv="${esc(nod.nume)}">Programează-te</a></div></nav>` : ''}

${whoItems.length || whoLede || whoMore.length ? `<section class="sec" id="pentru-cine">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Pentru cine</span><h2 style="margin-top:18px">${zoneItems.length ? 'Unde <em>acționează</em>' : 'Când este <em>recomandat</em>'}</h2></div>${whoLede ? `<p class="lede">${esc(whoLede)}</p>` : ''}</div>
    ${whoCards ? `<div class="tr-zones">${zoneCards(whoItems).map((z, i) => `<div class="tr-zone"><span>${String(i + 1).padStart(2, '0')}</span><b>${esc(cap(z.t.replace(/[;.]$/, '')))}</b>${z.d ? `<p>${esc(cap(z.d.replace(/[;.]$/, '')))}</p>` : ''}</div>`).join('')}</div>` : whoItems.length ? `<ul class="tr-checks tr-who">${whoItems.map((x) => `<li>${esc(cap(x.replace(/[;.]$/, '')))}</li>`).join('')}</ul>` : ''}
    ${whoMore.length ? `<details class="tr-read tr-read-wide"><summary>Citește mai mult</summary><div class="pf-prose${trBlocks(whoMore).replace(/<[^>]+>/g, '').length > 260 ? ' tr-cols' : ''}">${trBlocks(whoMore)}</div></details>` : ''}
  </div>
</section>` : ''}

${howBl.length || benefits.length ? `<section class="sec">
  <div class="wrap ${benefits.length ? 'pf-two tr-how' : 'tr-split'}">
    <div class="rv"><span class="eyebrow">${consult ? 'Despre consultație' : 'Cum acționează'}</span><h2 class="pf-h2">${esc(((h) => (h.length > 38 ? (consult ? ((x) => (x.length <= 38 ? x : 'Despre consultație'))(h.split(' și ')[0]) : 'Ce este și cum acționează') : h))((sec('ce-este')[0]?.titlu || (consult ? 'Despre consultație' : benefits.length && !howBl.length ? 'De ce să alegi acest tratament' : 'Ce este și cum acționează')).replace(/\?$/, '')))}</h2>
      ${howBl.length ? `<div class="pf-prose">${trBlocks(howBl.slice(0, 1))}${howBl.length > 1 ? `<button class="tr-more-btn" type="button" aria-expanded="false" aria-controls="tr-more-${esc(id)}">Citește mai mult</button>` : ''}</div>` : ''}</div>
    ${benefits.length ? `<aside class="pf-side rv"><h3>Beneficii</h3><ul class="tr-checks">${benefits.map((x) => `<li>${esc(cap(x.replace(/[;.]$/, '')))}</li>`).join('')}</ul></aside>` : ''}
  </div>
  ${howBl.length > 1 ? `<div class="wrap tr-more-txt pf-prose${trBlocks(howBl.slice(1)).replace(/<[^>]+>/g, '').length > 260 ? ' tr-cols' : ''}" id="tr-more-${esc(id)}" hidden>${trBlocks(howBl.slice(1))}</div>` : ''}
</section>` : ''}

${tVids.length && !steps.length ? `<section class="sec" id="video">
  <div class="wrap${tVids.length <= 2 ? ' tr-vsolo' : ''}">
    <div class="sec-head${tVids.length <= 2 ? '' : ' split'} rv"><div><span class="eyebrow">În cabinet</span><h2 style="margin-top:18px">Vezi cum <em>decurge</em></h2></div><p class="lede">${tVids.length === 1 ? 'Un video scurt' : `${tVids.length} video-uri scurte`} din cabinetul MOA: aparatul, procedura și ce simți în timpul ședinței.</p>${tVids.length <= 2 ? '<a class="link-u" href="/nou/video/" style="justify-self:start">Toate video-urile →</a>' : ''}</div>
    <div class="vp-grid tr-vgrid">${vidCards}</div>
  </div>
</section>` : ''}



${steps.length ? `<section class="sec" id="cum-decurge">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Pas cu pas</span><h2 style="margin-top:18px">Cum decurge <em>${consult ? 'consultația' : 'o ședință'}</em></h2></div>${stepsLede ? `<p class="lede">${esc(stepsLede)}</p>` : ''}</div>
    <ol class="tr-steps">${steps.map((x) => `<li>${x.titlu ? `<b>${esc(cap(x.titlu.replace(/[;.]$/, '')))}</b>` : ''}${x.text ? `<p>${esc(x.text)}</p>` : ''}</li>`).join('')}</ol>
    ${vidBlock}
    ${stepsAfter.length ? `<div class="pf-prose tr-after">${trBlocks(stepsAfter)}</div>` : ''}
  </div>
</section>` : ''}

${showGal ? `<section class="sec tr-results" id="rezultate">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Rezultate reale</span><h2 style="margin-top:18px">Înainte și după, <em>la MOA</em></h2></div><div class="tr-prose">${paras('rezultate').filter((p) => !/alte proceduri|poti descoperi|poți descoperi/i.test(p)).slice(0, 1).map((p) => `<p>${esc(p)}</p>`).join('')}<p class="tr-note">Fotografii de la pacienți MOA. Rezultatele diferă de la o persoană la alta.</p></div></div>
    <div class="tr-gallery" tabindex="0" role="region" aria-label="Galerie înainte și după">${t.galerie.map((g, i) => `<figure><img src="${esc(g.src)}" alt="${esc(g.alt || `${nod.nume}: înainte și după, pacient ${i + 1}`)}" loading="lazy" width="819" height="1024"></figure>`).join('')}</div>
    <p class="tr-hint" aria-hidden="true">Glisează pentru mai multe →</p>
  </div>
</section>` : ''}

${safeCols.length ? `<section class="sec safety" id="siguranta">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow light">Siguranță & recuperare</span><h2 style="margin-top:18px">Ce să știi <em>înainte și după</em></h2></div>${safeIntro ? `<p class="lede">${esc(safeIntro)}</p>` : ''}</div>
    <div class="tr-safe">${safeCols.map((c) => `<details class="tr-safe-col" open><summary><h3>${esc(c.titlu)}</h3></summary><div class="tr-dark">${trBlocks(c.blocuri)}</div></details>`).join('')}</div>
  </div>
</section>` : ''}

${info.length ? `<section class="sec" id="pe-larg">
  <div class="wrap tr-larg">
    <div class="sec-head rv"><span class="eyebrow">Pe larg</span><h2>Tot ce trebuie <em>să știi</em></h2></div>
    <div class="tr-faq tr-acc">${info.map((x) => `<details><summary>${esc(x.titlu)}</summary><div class="pf-prose${trBlocks(x.blocuri).replace(/<[^>]+>/g, '').length > 260 ? ' tr-cols' : ''}">${trBlocks(x.blocuri)}</div></details>`).join('')}</div>
  </div>
</section>` : ''}

${consult && (medici.length || urmeaza.length) ? `<section class="sec" id="medici">
  <div class="wrap cs-two">
    ${medici.length ? `<div class="cs-who"><span class="eyebrow">Cu cine</span><h2 class="pf-h2">Medicii care fac <em>consultația</em></h2><p class="cs-sub">${esc(s.specialitate || '')}${medici.length > 1 ? ` · ${medici.length} medici. Alegi medicul la programare sau îți recomandăm noi.` : '.'}</p>
      <ul class="cs-doclist">${medici.map((p) => `<li>${p.profil_detaliat ? `<a href="/nou/medici/${esc(p.id)}/">` : '<div>'}${photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="" loading="lazy">` : `<span class="cs-ini">${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span>`}<span><b>${esc(p.nume)}</b><small>${esc(p.rol)}${p.profil_detaliat ? ' · vezi profilul →' : ''}</small></span>${p.profil_detaliat ? '</a>' : '</div>'}</li>`).join('')}</ul></div>` : ''}
    ${urmeaza.length ? `<div class="cs-next" id="ce-urmeaza"><span class="eyebrow">După consultație</span><h2 class="pf-h2">Ce poate <em>urma</em></h2><p class="cs-sub">Tratamentele din aceeași specialitate. Medicul îți spune la consultație dacă și ce ți se potrivește.</p>
      <div class="cs-nextgrid">${urmeaza.map((x) => `<a class="mm-card" href="${esc(live(x.id))}"><b>${esc(prettyName(trNode.get(x.id).nod.nume))}</b><span>${esc(trNode.get(x.id).cat.nume)}</span>${minPrice(x.id) ? `<em><small>de la</small>${lei(minPrice(x.id))}</em>` : '<em>→</em>'}</a>`).join('')}</div></div>` : ''}
  </div>
</section>` : ''}

${hasPrices ? `<section class="sec" id="preturi" style="background:var(--cream)">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Prețuri</span><h2 style="margin-top:18px">Cât <em>costă</em></h2></div><p class="lede">Din lista oficială de prețuri MOA.${consult ? '' : ' Zonele și doza le stabilește medicul la consultație.'}</p></div>
    ${offer ? `<a class="tr-offer-row" href="#programare" data-srv="${esc(offerSrv)}"><span class="off">-${offer.discountProcent}% · oferta lunii</span><b>${esc(offerName)}</b><span><s>${lei(offer.pretInitial)}</s> <em>${lei(offer.pret)}</em></span><i>Programează-te →</i></a>` : ''}
    ${(() => {
      if (!s.preturi.length) return sec('pret').map((x) => trBlocks(x.blocuri)).join('');
      const rows = [...s.preturi].sort((a, b) => (a.valoare ?? 1e9) - (b.valoare ?? 1e9)).map((p) => `<tr><td>${esc(p.nume)}${p.subgrup ? `<small class="tr-psub">${esc(cap(p.subgrup.toLowerCase()))}</small>` : ''}</td><td>${p.valoare != null ? lei(p.valoare) : 'la consultație'}</td><td class="wl-td">${wlBtn(`${nod.nume.replace(/\s*\(.*\)$/, '')} · ${p.nume}`, p.valoare, live(id), true)}</td></tr>`);
      const N = 5;
      return `<table class="tr-prices">${rows.slice(0, N).join('')}</table>${rows.length > N ? `<details class="tr-allprices"><summary>Vezi toate cele ${rows.length} prețuri</summary><table class="tr-prices">${rows.slice(N).join('')}</table></details>` : ''}`;
    })()}
  </div>
</section>` : ''}

${t.faq.length ? `<section class="sec" id="intrebari">
  <div class="wrap pf-two">
    <div class="rv"><span class="eyebrow">Întrebări frecvente</span><h2 class="pf-h2">Ce ne întreabă <em>pacienții</em></h2><p class="lede" style="margin-top:14px">Nu găsești răspunsul? Sună-ne la <a class="lede-link" href="tel:${esc(String(tel).replace(/\s/g, ''))}">${esc(tel)}</a> sau scrie-ne pe WhatsApp.</p></div>
    ${(() => { const q = (f) => `<details><summary>${esc(f.q)}</summary><div>${trBlocks(f.blocuri)}</div></details>`; const N = 3; return `<div class="tr-faq">${t.faq.slice(0, N).map(q).join('')}${t.faq.length > N ? `<details class="tr-faq-more"><summary>Vezi încă ${t.faq.length - N} ${t.faq.length - N === 1 ? 'întrebare' : 'întrebări'}</summary><div class="tr-faq">${t.faq.slice(N).map(q).join('')}</div></details>` : ''}</div>`; })()}
  </div>
</section>` : ''}

${rev.length ? `<section class="sec reviews tr-reviews">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Recenzii Google</span><h2 style="margin-top:18px">Ce spun <em>pacienții</em></h2></div><p class="lede">★★★★★ 5.0 din ${esc(nReviews)} de recenzii verificate pe Google.</p></div>
    <div class="r-grid tr-rev-row" tabindex="0" role="region" aria-label="Recenzii">${rev.map((r) => `<figure class="r-card" style="margin:0"><q>${esc(r.citat)}</q><figcaption class="who"><b>${esc(r.persoana)}</b> · Google</figcaption></figure>`).join('')}</div>
  </div>
</section>` : ''}

${asoc.length || arts.length ? `<section class="sec" style="background:var(--cream)">
  <div class="wrap tr-related">
    ${asoc.length ? `<div><span class="eyebrow">Se combină cu</span><h2 class="pf-h2">Tratamente <em>asociate</em></h2>
    <div class="tr-asoc">${asoc.map((x) => `<a class="mm-card" href="${esc(trHref(x.id))}"><b>${esc(prettyName(trNode.get(x.id)?.nod.nume || x.nume))}</b><span>${esc(trNode.get(x.id)?.cat.nume || prettyName(x.categorie))}</span>${minPrice(x.id) ? `<em><small>de la</small>${lei(minPrice(x.id))}</em>` : '<em>→</em>'}</a>`).join('')}</div></div>` : ''}
    ${arts.length ? `<div><span class="eyebrow">Din blog</span><h2 class="pf-h2">Citește despre <em>${esc(consult ? nod.nume.replace(/^Consultație\s*/i, '').replace(/\s*\(.*\)$/, '') : (nod.nume.match(/\(([^)]+)\)$/) || [, nod.nume])[1])}</em></h2>
    <ul class="tr-arts">${arts.slice(0, 3).map((a) => `<li><a href="${esc(artLink(a))}"><small>${esc(a.tip)}</small><span>${esc(a.titlu)}</span></a></li>`).join('')}</ul></div>` : ''}
  </div>
</section>` : ''}

${book}
<script>
// pe mobil, coloanele de la „Siguranță” se pliază: prima rămâne deschisă
if (matchMedia('(max-width: 760px)').matches) document.querySelectorAll('.tr-safe-col').forEach((d, i) => { if (i) d.open = false; });
// „Citește mai mult” din „Cum acționează”: textul se deschide pe toată lățimea, sub ambele coloane
document.querySelectorAll('.tr-more-btn').forEach((b) => b.addEventListener('click', () => {
  const box = document.getElementById(b.getAttribute('aria-controls')); if (!box) return;
  box.hidden = false; b.setAttribute('aria-expanded', 'true'); b.hidden = true;
}));
// cuprinsul: la click, ținta ajunge exact sub cuprins (în jos header-ul se ascunde, în sus reapare); secțiunea curentă e marcată
(() => {
  const toc = document.querySelector('.tr-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a:not(.tr-toc-cta)')], secs = links.map((a) => document.querySelector(a.getAttribute('href')));
  const hdr = document.querySelector('header.site');
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('a'); if (!a) return;
    const el = document.querySelector(a.getAttribute('href')); if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + scrollY;
    const down = y > scrollY;
    const off = toc.offsetHeight + (down ? 0 : hdr.offsetHeight) - 1;
    if (down) hdr.classList.add('hide');
    scrollTo({ top: y - off, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });
  let cur = -1;
  const spy = () => {
    const line = toc.getBoundingClientRect().bottom + 24;
    let i = -1; secs.forEach((s, k) => { if (s && s.getBoundingClientRect().top <= line) i = k; });
    if (i === cur) return; cur = i;
    links.forEach((l, k) => l.classList.toggle('on', k === i));
    if (i >= 0) { const l = links[i], w = toc.firstElementChild; w.scrollTo({ left: l.offsetLeft - (w.clientWidth - l.offsetWidth) / 2, behavior: 'smooth' }); }
  };
  addEventListener('scroll', spy, { passive: true }); spy();
})();
</script>
${BOTTOM}`;
  const dir = path.join(ROOT, 'nou', ...nod.url.split('/').filter(Boolean));
  page = alternateBg(page);
  fs.mkdirSync(dir, { recursive: true });
  writePage(path.join(dir, 'index.html'), page);
  console.log(`${consult ? 'Consultație' : 'Tratament'}: nou${nod.url} · ${facts.length} repere · ${whoItems.length} pentru cine · ${steps.length} pași · ${tVids.length} video · ${t.galerie.length} înainte/după · ${medici.length} medici · ${s.preturi.length} prețuri · ${t.faq.length} întrebări · ${rev.length} recenzii · ${asoc.length} asociate · ${arts.length} articole`);
}

// ---------- pagina-hub /nou/consultatii/: cele patru consultații, cu medicul, prețul și ce urmează ----------
if (consHub) {
  const cons = [...trNode.entries()].filter(([, l]) => l.consult).map(([id, l]) => {
    const s = serv[id], t = TRD[id];
    const ce = t.sectiuni.filter((x) => x.rol === 'ce-este' || x.rol === 'intro').flatMap((x) => x.blocuri.filter((b) => b.t === 'p').map((b) => b.x)).filter((p) => !SALES.test(p));
    const med = (s.medici || []).map((n) => team.find((p) => p.nume === n)).filter(Boolean);
    return { id, s, nod: l.nod, desc: cutTxt(ce[0] || s.descriere || '', 190), med, pret: minPrice(id) };
  });
  const pageUrl = ORIGIN + consHub.url;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': pageUrl + '#webpage', url: pageUrl, name: 'Consultații | MOA Clinic', inLanguage: 'ro-RO', hasPart: cons.map((c) => ({ '@type': 'MedicalWebPage', name: c.nod.nume, url: ORIGIN + c.nod.url })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Consultații', item: pageUrl }] },
    ],
  };
  const rev = D.dovezi.testimoniale.filter((r) => r.citat.length > 25).slice(0, 12);
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Consultații în București${minConsult ? ` – de la ${minConsult} lei` : ''} | MOA Clinic</title>
<meta name="description" content="${esc(`Consultații la MOA Clinic: ${cons.map((c) => c.nod.nume.replace(/^Consultație\s*/i, '').replace(/\s*\(.*\)$/, '')).join(', ')}. Cu medicul specialității${minConsult ? `, de la ${minConsult} lei` : ''}.`)}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><span aria-current="page">Consultații</span></nav>

<section class="sec cs-hero">
  <div class="wrap">
    <div class="sec-head split"><div><span class="eyebrow">Consultații</span><h1 style="margin-top:18px">Primul pas e <em>o consultație.</em></h1></div>
      <p class="lede">Fiecare consultație se face cu medicul specialității. Afli ce ți se potrivește înainte de orice tratament${minConsult ? `, de la ${lei(minConsult)}` : ''}.</p></div>
    <div class="cs-grid">${cons.map((c) => `<article class="cs-card">
      <span class="eyebrow">${esc(c.s.specialitate || '')}</span>
      <h2><a href="/nou${esc(c.nod.url)}">${esc(c.nod.nume.replace(/^Consultație\s*/i, (m) => m).replace(/\s*\(([^)]+)\)$/, ''))}</a></h2>
      ${/\(([^)]+)\)$/.test(c.nod.nume) ? `<small class="cs-incl">Include ${esc(c.nod.nume.match(/\(([^)]+)\)$/)[1].replace(/^cu\s+/i, ''))}</small>` : ''}
      <p>${esc(c.desc)}</p>
      ${c.med.length ? `<div class="cs-docs">${c.med.slice(0, 4).map((p) => (photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="" title="${esc(p.nume)}" loading="lazy">` : `<span title="${esc(p.nume)}">${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span>`)).join('')}<i>${c.med.length === 1 ? esc(c.med[0].nume) : `${c.med.length} medici`}</i></div>` : ''}
      <div class="cs-foot"><b>${c.pret ? `${lei(c.pret)}` : 'Preț la programare'}</b><span><a class="link-u" href="/nou${esc(c.nod.url)}">Detalii</a><a class="btn btn-gold" href="#programare" data-srv="${esc(c.nod.nume)}">Programează-te</a></span></div>
    </article>`).join('')}</div>
  </div>
</section>

<section class="sec" style="background:var(--cream)">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Cum alegi</span><h2 style="margin-top:18px">Nu știi cu care <em>să începi?</em></h2></div><p class="lede">Lasă-ne numărul și te sunăm noi, ca să alegem împreună consultația potrivită.</p></div>
    <table class="tr-prices cs-table">${cons.map((c) => `<tr><td><b>${esc(c.nod.nume)}</b><span>${esc(c.s.specialitate || '')}${c.med.length ? ` · ${c.med.length === 1 ? esc(c.med[0].nume) : `${c.med.length} medici`}` : ''}</span></td><td>${c.pret ? lei(c.pret) : '—'}</td></tr>`).join('')}</table>
  </div>
</section>

${rev.length ? `<section class="sec reviews tr-reviews">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Recenzii Google</span><h2 style="margin-top:18px">Ce spun <em>pacienții</em></h2></div><p class="lede">★★★★★ 5.0 din ${esc(nReviews)} de recenzii verificate pe Google.</p></div>
    <div class="r-grid tr-rev-row" tabindex="0" role="region" aria-label="Recenzii">${rev.map((r) => `<figure class="r-card" style="margin:0"><q>${esc(r.citat)}</q><figcaption class="who"><b>${esc(r.persoana)}</b> · Google</figcaption></figure>`).join('')}</div>
  </div>
</section>` : ''}

${BOOK}${BOTTOM}`;
  const dir = path.join(ROOT, 'nou', 'consultatii');
  fs.mkdirSync(dir, { recursive: true });
  writePage(path.join(dir, 'index.html'), page);
  console.log(`Hub: nou/consultatii/ · ${cons.length} consultații`);
}

// ---------- hub-ul de longevitate /nou/longevitate/program/: parcursul evaluare → plan → terapii → reevaluare, condus de gerontolog ----------
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025); terapiile trimit la paginile lor, cu prețul de la.
{
  const consId = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume))?.[0];
  const consNod = consId && trNode.get(consId).nod;
  const consPret = consId ? minPrice(consId) : null;
  const consMax = consId ? Math.max(...(serv[consId].preturi || []).map((p) => p.valoare).filter(Boolean)) : null;
  const ger = team.filter((p) => p.specialitate === 'Gerontologie');
  const fond = team.find((p) => p.nume.includes('Stănescu'));
  const ORD = ['terapia-nad', 'glutation', 'autohemoterapia', 'sauna-cu-ozon', 'fotobiomodulare-vielight', 'tms-stimulare-magnetica-transcraniana', 'nutrigenetica-epigenetica', 'skin-care-dna'];
  const ROL = { 'terapia-nad': 'Energie celulară', glutation: 'Antioxidant', autohemoterapia: 'Ozonoterapie', 'sauna-cu-ozon': 'Ozonoterapie', 'fotobiomodulare-vielight': 'Creier și somn', 'tms-stimulare-magnetica-transcraniana': 'Stres și burnout', 'nutrigenetica-epigenetica': 'Test genetic', 'skin-care-dna': 'Test genetic' };
  const ter = [...trNode.entries()].filter(([, l]) => !l.consult && /\/tratamente\/(regenerare|teste)\//.test(l.nod.url))
    .sort((a, b) => ((ORD.indexOf(a[0]) + 1) || 99) - ((ORD.indexOf(b[0]) + 1) || 99));
  const pageUrl = ORIGIN + '/longevitate/program/';
  const pasi = [
    { t: 'Evaluare', d: 'Consultație cu medicul gerontolog: istoric, analize, stil de viață și estimarea vârstei biologice, ca punct de plecare.', p: consPret ? (consMax && consMax !== consPret ? lei(consPret) + ' – ' + lei(consMax) : lei(consPret)) : '' },
    { t: 'Plan', d: 'Primești un plan scris: ce merită făcut, în ce ordine și ce nu e cazul. Planul poate include doar recomandări de stil de viață.' },
    { t: 'Terapii', d: 'Dacă sunt indicate: perfuzii, ozonoterapie, fotobiomodulare, TMS sau estetică regenerativă, cu doze și durate stabilite de medic.' },
    { t: 'Reevaluare', d: 'La 6–12 luni refacem evaluarea și ajustăm planul în funcție de ce s-a schimbat.' },
  ];
  const faq = [
    ['Ce este vârsta biologică?', 'Este o estimare statistică a felului în care îmbătrânește organismul, calculată din analize și măsurători. Nu este un diagnostic, ci un reper pe care îl folosim ca să comparăm evoluția în timp.'],
    ['Am nevoie de perfuzii ca să încep?', 'Nu. Programul începe întotdeauna cu evaluarea. Multe planuri pornesc doar cu schimbări de alimentație, somn și mișcare; terapiile se adaugă numai dacă medicul le consideră potrivite.'],
    ['Cine nu ar trebui să facă aceste terapii?', 'Există contraindicații (de exemplu sarcina, anumite boli cardiace, renale sau tratamente în curs). De aceea fiecare terapie se face după consult, într-o unitate medicală, și nu la cerere.'],
    ['Ce rezultate pot aștepta?', 'Depinde de punctul de plecare. Pentru unele terapii dovezile științifice sunt încă limitate, iar medicul îți spune deschis ce se știe și ce nu. Urmărim schimbările măsurabile la reevaluare, nu promisiuni.'],
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'MedicalWebPage', '@id': pageUrl + '#webpage', url: pageUrl, name: 'Programul Global Antiaging | MOA Clinic', inLanguage: 'ro-RO', ...(fond ? { reviewedBy: { '@id': ORIGIN + '/medici/adrian-stanescu/#medic' } } : {}), publisher: { '@id': ORIGIN + '/#organization' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Longevitate', item: ORIGIN + '/longevitate/' }, { '@type': 'ListItem', position: 3, name: 'Programul Global Antiaging', item: pageUrl }] },
      { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
  const srv = consNod ? consNod.nume : '';
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Longevitate medicală în București – Programul Global Antiaging | MOA Clinic</title>
<meta name="description" content="Programul Global Antiaging MOA: evaluare cu medic gerontolog și estimarea vârstei biologice, plan personal, terapii regenerative și reevaluare la 6–12 luni${consPret ? `. Consultația de la ${consPret} lei` : ''}.">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main class="tr-page lg-page">
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><span>Longevitate</span><span>›</span><span aria-current="page">Programul Global Antiaging</span></nav>

<section class="pf-hero tr-hero">
  <div class="wrap pf-grid">
    <div class="pf-copy">
      <span class="eyebrow">Longevitate medicală · Global Antiaging</span>
      <h1>Longevitate, <em>cu metodă medicală.</em></h1>
      <p class="lede">Un program care începe cu o evaluare, nu cu o perfuzie. Coordonat de ${fond ? `<a class="lede-link" href="/nou/medici/${esc(fond.id)}/">${esc(fond.nume)}</a>` : 'medicul gerontolog'}, medic primar geriatrie-gerontologie format la școala Ana Aslan, cu o echipă de ${ger.length} medici gerontologi.</p>
      <div class="pf-facts tr-facts">
        <div><b>${ger.length} gerontologi</b><span>medici primari și specialiști</span></div>
        <div><b>${consPret ? lei(consPret) : '—'}</b><span>consultația, cu vârsta biologică</span></div>
        <div><b>6–12 luni</b><span>până la reevaluare</span></div>
      </div>
      <div class="hero-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srv)}">Programează evaluarea</a><a class="btn btn-line" href="#parcurs">Cum funcționează</a></div>
    </div>
    <div class="pf-photo tr-photo"><div class="frame"><img src="/wp-content/uploads/2024/09/image00005-682x1024.jpeg" alt="${esc(fond ? fond.nume : 'Medic gerontolog')}, coordonatorul programului" fetchpriority="high"></div></div>
  </div>
</section>

<section class="sec" id="parcurs">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Parcursul</span><h2 style="margin-top:18px">Patru pași, <em>în această ordine.</em></h2></div><p class="lede">Fiecare pas are un medic, un document și un preț cunoscut dinainte. Poți să te oprești după evaluare.</p></div>
    <ol class="tr-steps lg-steps">${pasi.map((x) => `<li><b>${esc(x.t)}</b><p>${esc(x.d)}</p>${x.p ? `<em class="lg-pret">${esc(x.p)}</em>` : ''}</li>`).join('')}</ol>
  </div>
</section>

<section class="sec" id="terapii">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Terapiile din plan</span><h2 style="margin-top:18px">Doar dacă <em>sunt indicate.</em></h2></div><p class="lede">Terapiile de mai jos se fac numai după evaluare, în clinică, sub supravegherea medicului. Pe pagina fiecăreia găsești pentru cine este, pentru cine nu și prețul.</p></div>
    <div class="cs-nextgrid lg-grid">${ter.map(([id, l]) => `<a class="mm-card" href="${esc(live(id))}"><small class="lg-rol">${esc(ROL[id] || 'Regenerare')}</small><b>${esc(prettyName(l.nod.nume))}</b><span>${esc(l.cat.nume)}</span>${minPrice(id) ? `<em><small>de la</small>${lei(minPrice(id))}</em>` : '<em><small>preț</small>la consultație</em>'}</a>`).join('')}</div>
  </div>
</section>

<section class="sec" id="rigoare">
  <div class="wrap pf-two lg-rig">
    <div class="rv"><span class="eyebrow">Cum lucrăm</span><h2 class="pf-h2">Ce știm <em>și ce nu.</em></h2>
      <div class="pf-prose lg-prose" style="margin-top:18px"><p>Longevitatea a devenit un subiect la modă, iar odată cu el au apărut promisiuni greu de susținut. Noi pornim de la ce se poate măsura: analize, evaluarea vârstei biologice, tensiune, compoziție corporală, somn, stres.</p><p>Pentru unele terapii, cum sunt perfuziile cu NAD+, dovezile la oameni sunt încă limitate. Ți-o spunem dinainte, îți explicăm de ce le recomandăm sau nu și urmărim la reevaluare ce s-a schimbat efectiv.</p></div></div>
    <aside class="pf-side rv"><h3>De fiecare dată</h3><ul class="tr-checks"><li>Consult medical înainte de orice terapie</li><li>Criterii de excludere verificate la fiecare pacient</li><li>Doza și durata stabilite de medic, trecute în plan</li><li>Terapiile se fac în clinică, nu la domiciliu</li><li>Reevaluare la 6–12 luni, cu aceleași măsurători</li></ul></aside>
  </div>
</section>

${ger.length ? `<section class="sec" id="medici">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Echipa</span><h2 style="margin-top:18px">Medicii <em>programului</em></h2></div><p class="lede">Medici primari și specialiști în geriatrie și gerontologie, din grupul medical Oxxygene (clinică și spital privat, Otopeni).</p></div>
    <ul class="cs-doclist lg-docs">${ger.map((p) => `<li>${p.profil_detaliat ? `<a href="/nou/medici/${esc(p.id)}/">` : '<div>'}${photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="" loading="lazy">` : `<span class="cs-ini">${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span>`}<span><b>${esc(p.nume)}</b><small>${esc(p.rol)}${p.profil_detaliat ? ' · vezi profilul →' : ''}</small></span>${p.profil_detaliat ? '</a>' : '</div>'}</li>`).join('')}</ul>
  </div>
</section>` : ''}

<section class="sec" id="intrebari">
  <div class="wrap pf-two">
    <div class="rv"><span class="eyebrow">Întrebări frecvente</span><h2 class="pf-h2">Înainte <em>să începi</em></h2><p class="lede" style="margin-top:14px">Nu găsești răspunsul? Sună-ne la <a class="lede-link" href="tel:+40743056605">0743 056 605</a>.</p></div>
    <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
  </div>
</section>

${srv ? BOOK.split(`<option>${srv}</option>`).join(`<option selected>${srv}</option>`) : BOOK}${BOTTOM}`;
  const dir = path.join(ROOT, 'nou', 'longevitate', 'program');
  fs.mkdirSync(dir, { recursive: true });
  writePage(path.join(dir, 'index.html'), alternateBg(page));
  console.log(`Longevitate: nou/longevitate/program/ · ${ter.length} terapii · ${ger.length} gerontologi`);
}

// ---------- pagina echipei /nou/medici/: fondatorul, apoi oamenii pe specialități, cu consultația și tratamentele fiecărei specialități ----------
{
  const ini = (p) => p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
  const founder = team.find((p) => p.nume.includes('Stănescu'));
  const fpr = founder?.profil_detaliat;
  const fPhoto = fpr?.imagine && fs.existsSync(path.join(ROOT, 'site', fpr.imagine)) ? fpr.imagine : founder && photos[founder.nume] ? resized(photos[founder.nume]) : null;
  const consName = (u) => newName.get(u) || '';
  const trLinks = (us) => us.map((u) => [toLive(u), newName.get(u)]).filter(([h, n]) => h && h.startsWith('/nou') && n).map(([h, n]) => ({ h, n: prettyName(n) }));
  const TM = [
    { id: 'gerontologie', nume: 'Gerontologie & longevitate', spec: ['Gerontologie'], text: 'Evaluează cum îmbătrânește organismul tău și construiesc planul de prevenție: vârsta biologică, terapii regenerative, nutriție.', cons: ['consultatie-antiaging', '/consultatii/antiaging/'], tr: ['/tratamente/regenerare/nad/', '/tratamente/regenerare/glutation/', '/tratamente/regenerare/tms/', '/tratamente/regenerare/sauna-ozon/'] },
    { id: 'chirurgie-plastica', nume: 'Chirurgie plastică', spec: ['Chirurgie plastică'], text: 'Intervențiile chirurgicale ale clinicii, după o consultație în care discutați așteptările, riscurile și recuperarea.', cons: ['consultatie-chirurgie-plastica', '/consultatii/chirurgie-plastica/'], tr: ['/tratamente/chirurgie-dermatologie/blefaroplastie/', '/tratamente/chirurgie-dermatologie/lip-lift/', '/tratamente/chirurgie-dermatologie/indepartare-alunite/'] },
    { id: 'dermatologie', nume: 'Dermatologie & dermatoestetică', spec: ['Dermatovenerologie'], text: 'Sănătatea și aspectul pielii: consultul dermatologic, leziunile și tratamentele dermatoestetice.', cons: ['consultatie-dermatoestetica-dermatologie', '/consultatii/dermatologie/'], tr: ['/tratamente/injectabile/botox/', '/tratamente/injectabile/acid-hialuronic/', '/tratamente/chirurgie-dermatologie/eliminare-papiloame/'] },
    { id: 'estetica', nume: 'Estetică facială și corporală', spec: ['Estetică facială și corporală'], text: 'Tratamentele cu aparatură pentru ten și corp, după protocoalele clinicii.', tr: ['/tratamente/aparatura/venus-legacy/', '/tratamente/aparatura/venus-viva/', '/tratamente/aparatura/dermalinfusion/', '/tratamente/aparatura/epilare-definitiva/'] },
    { id: 'asistenta', nume: 'Asistență medicală', spec: ['Asistență medicală'], text: 'Te primesc, te pregătesc pentru procedură și sunt alături de tine la fiecare vizită.', tr: [] },
  ].map((g) => ({ ...g, oameni: team.filter((p) => p !== founder && g.spec.includes(p.specialitate)), links: trLinks(g.tr) })).filter((g) => g.oameni.length);
  const card = (p, g) => {
    const srv = g.cons ? `${consName(g.cons[1])} – ${p.nume}` : `Programare – ${p.nume}`;
    return `<article class="tm-card${p.profil_detaliat ? ' has-profile' : ''}">
        <div class="tm-ph">${photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="${esc(p.nume)}" loading="lazy">` : `<div class="tm-mono" role="img" aria-label="${esc(p.nume)} – fotografie în curând"><span>${esc(ini(p))}</span><small>fotografie în curând</small></div>`}${p.grad ? `<span class="tm-grad">${esc(p.grad.replace(/^Medic\s+/, ''))}</span>` : ''}</div>
        <h3>${p.profil_detaliat ? `<a href="/nou/medici/${esc(p.id)}/">${esc(p.nume)}</a>` : esc(p.nume)}</h3>
        <p>${esc(p.rol)}</p>
        <div class="tm-acts">${p.profil_detaliat ? `<a class="link-u" href="/nou/medici/${esc(p.id)}/">Profilul</a>` : ''}<a class="tm-book" href="#programare" data-srv="${esc(srv)}" aria-label="Programează-te la ${esc(p.nume)}">Programează-te <i aria-hidden="true">→</i></a></div>
      </article>`;
  };
  const grpHtml = TM.map((g, i) => {
    const pret = g.cons ? minPrice(g.cons[0]) : null;
    const consHref = g.cons ? toLive(g.cons[1]) : null;
    return `<section class="tm-grp" id="${g.id}">
    <div class="wrap tm-grp-in">
      <div class="tm-grp-h">
        <span class="tm-num">${String(i + 1).padStart(2, '0')}</span>
        <h2>${esc(g.nume)}</h2>
        <p>${esc(g.text)}</p>
        ${g.links.length ? `<ul class="tm-tr">${g.links.map((l) => `<li><a href="${esc(l.h)}">${esc(l.n)}</a></li>`).join('')}</ul>` : ''}
        ${consHref ? `<a class="tm-cons" href="${esc(consHref)}"><span><small>Începe cu</small><b>${esc(consName(g.cons[1]))}</b></span>${pret ? `<em>de la ${lei(pret)}</em>` : ''}<i aria-hidden="true">→</i></a>` : ''}
      </div>
      <div class="tm-cards">${g.oameni.map((p) => card(p, g)).join('')}</div>
    </div>
  </section>`;
  }).join('');
  const nMed = team.filter((p) => p.tip === 'Medic').length;
  const nPrim = team.filter((p) => p.grad === 'Medic primar').length;
  const nSpec = new Set(team.filter((p) => p.tip === 'Medic').map((p) => p.specialitate)).size;
  const portrait = (p) => { const m = resized(photos[p.nume]).match(/-(d+)x(d+).w+$/); return !m || +m[2] >= +m[1] * 1.3; };
  const collage = team.filter((p) => photos[p.nume] && p !== founder && p.tip === 'Medic' && portrait(p)).slice(0, 3);
  const rev = D.dovezi.testimoniale.find((r) => r.medic && team.some((p) => p.nume === r.medic));
  const revDoc = rev && team.find((p) => p.nume === rev.medic);
  const pageUrl = ORIGIN + '/medici/';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': pageUrl + '#webpage', url: pageUrl, name: 'Echipa MOA Clinic', inLanguage: 'ro-RO', mainEntity: { '@id': pageUrl + '#echipa' } },
      { '@type': 'ItemList', '@id': pageUrl + '#echipa', name: 'Echipa medicală MOA Clinic', itemListElement: team.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': p.tip === 'Medic' ? ['Person', 'Physician'] : 'Person', name: p.nume, jobTitle: p.rol, ...(photos[p.nume] ? { image: ORIGIN + resized(photos[p.nume]) } : {}), ...(p.profil_detaliat ? { url: `${ORIGIN}/medici/${p.id}/` } : {}), worksFor: { '@id': `${ORIGIN}/#organization` } } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Echipa', item: pageUrl }] },
    ],
  };
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Echipa MOA Clinic – medici gerontologi, dermatologi și chirurgi plastici | MOA Clinic</title>
<meta name="description" content="${esc(`Echipa MOA Clinic: ${nMed} medici (gerontologie, chirurgie plastică, dermatologie), specialiști în estetică și asistente, coordonați de Dr. Adrian Stănescu. Află cine te tratează și programează-te direct.`)}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><span aria-current="page">Echipa</span></nav>

<section class="tm-hero">
  <div class="wrap tm-hero-in">
    <div class="tm-hero-t">
      <span class="eyebrow">Echipa MOA</span>
      <h1>Oamenii care <em>te tratează</em></h1>
      <p class="lede">Medici gerontologi, dermatologi și chirurgi plastici, alături de specialiști în estetică și asistente, sub același acoperiș. Știi dinainte cine te consultă și ce face la MOA.</p>
      <dl class="tm-facts"><div><dt>${nMed}</dt><dd>medici</dd></div><div><dt>${nPrim}</dt><dd>medici primari</dd></div><div><dt>${nSpec}</dt><dd>specialități medicale</dd></div><div><dt>★ 5.0</dt><dd>${esc(nReviews)} recenzii Google</dd></div></dl>
    </div>
    <div class="tm-collage" aria-hidden="true">${collage.map((p) => `<img src="${esc(resized(photos[p.nume]))}" alt="" loading="lazy">`).join('')}</div>
  </div>
</section>

<nav class="tr-toc tm-toc" aria-label="Specialități"><div class="wrap">${founder ? '<a href="#fondator">Fondator</a>' : ''}${TM.map((g) => `<a href="#${g.id}">${esc(g.nume.split(' & ')[0])}<span>${g.oameni.length}</span></a>`).join('')}<a class="tr-toc-cta" href="#programare">Programează-te</a></div></nav>

${founder ? `<section class="tm-founder" id="fondator">
  <div class="wrap tm-founder-in">
    <div class="tm-founder-ph">${fPhoto ? `<img src="${esc(fPhoto)}" alt="${esc(founder.nume)}" loading="lazy">` : ''}</div>
    <div class="tm-founder-t">
      <span class="eyebrow">Fondator · medic coordonator</span>
      <h2>${esc(founder.nume)}</h2>
      <p class="tm-role">${esc(founder.rol)}</p>
      ${FOUNDER_QUOTE ? `<blockquote>„${esc(FOUNDER_QUOTE.replace(/^[„"“]|[”"]$/g, ''))}”</blockquote>` : ''}
      ${fpr?.rezumat ? `<p>${esc(fpr.rezumat)}</p>` : ''}
      <div class="tm-founder-a">${fpr ? `<a class="btn btn-line" href="/nou/medici/${esc(founder.id)}/">Profilul complet</a>` : ''}<a class="btn btn-gold arrow" href="#programare" data-srv="${esc(`${consName('/consultatii/antiaging/')} – ${founder.nume}`)}">Programează o consultație</a></div>
    </div>
  </div>
</section>` : ''}

${grpHtml}

<section class="tm-how">
  <div class="wrap">
    <div class="tm-how-h"><span class="eyebrow">Cum lucrăm</span><h2>Aceeași echipă, <em>de la consultație la control.</em></h2></div>
    <ol class="tm-how-l">
      <li><b>Proceduri făcute de medici</b><span>Injectabilele și intervențiile le face medicul, nu un operator. Știi numele lui înainte să vii.</span></li>
      <li><b>Planul, la consultație</b><span>Medicul îți propune zonele, doza și numărul de ședințe. Prețurile sunt publice, înainte de programare.</span></li>
      <li><b>Specialități sub același acoperiș</b><span>Gerontologul, dermatologul și chirurgul plastic lucrează împreună când planul tău o cere.</span></li>
    </ol>
    ${rev ? `<figure class="tm-rev"><span class="tm-stars" aria-label="5 stele">★★★★★</span><blockquote>„${esc(cutTxt(rev.citat, 240))}”</blockquote><figcaption><b>${esc(rev.persoana)}</b> despre ${revDoc?.profil_detaliat ? `<a href="/nou/medici/${esc(revDoc.id)}/">${esc(rev.medic)}</a>` : esc(rev.medic)} · ${esc(String(rev.platforma).replace(/\s*\(.*\)/, ''))}</figcaption></figure>` : ''}
  </div>
</section>

${BOOK}
<script>
// cuprinsul specialităților: secțiunea curentă
(() => {
  const toc = document.querySelector('.tm-toc'); if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#"]:not(.tr-toc-cta)')];
  let cur = -1;
  const spy = () => {
    const line = toc.getBoundingClientRect().bottom + 40;
    let i = -1;
    links.forEach((l, k) => { const s = document.querySelector(l.getAttribute('href')); if (s && s.getBoundingClientRect().top <= line) i = k; });
    if (i === cur) return; cur = i;
    links.forEach((l, k) => l.classList.toggle('on', k === i));
    if (i >= 0) { const l = links[i], w = toc.firstElementChild; w.scrollTo({ left: l.offsetLeft - (w.clientWidth - l.offsetWidth) / 2, behavior: 'smooth' }); }
  };
  addEventListener('scroll', spy, { passive: true }); spy();
})();
</script>
${BOTTOM}`;
  fs.mkdirSync(path.join(ROOT, 'nou', 'medici'), { recursive: true });
  writePage(path.join(ROOT, 'nou', 'medici', 'index.html'), page);
  console.log(`Echipa: nou/medici/ · ${team.length} oameni · ${TM.length} specialități · ${collage.length} în colaj`);
}

// ---------- pagina de prețuri /nou/preturi/: lista oficială, pe categorii în ordinea drumului pacientului ----------
{
  const PR_GRUPURI = [
    ['Consultații', [['CONSULTAȚII', 'Consultații']]],
    ['Injectabile', [['INJECTĂRI TOXINĂ BOTULINICĂ', 'Toxină botulinică (Botox)'], ['INJECTĂRI ACID HIALURONIC', 'Acid hialuronic'], ['REJUVENARE FACIALĂ', 'Rejuvenare facială'], ['TRATAMENT REVITALIZARE PĂR', 'Revitalizare păr']]],
    ['Aparatură', [['TRATAMENTE ESTETICE VENUS VIVA', 'Venus Viva'], ['LIFTING FACIAL NON INVAZIV VENUS LEGACY', 'Venus Legacy – lifting facial'], ['TRATAMENTE CORPORALE VENUS LEGACY', 'Venus Legacy – corp'], ['EPILARE DEFINITIVA CU SPLENDOR X FEMEI', 'Epilare Splendor X – femei'], ['EPILARE DEFINITIVA CU SPLENDOR X BARBATI', 'Epilare Splendor X – bărbați']]],
    ['Cosmetică & dermatologie', [['TRATAMENTE COSMETOLOGICE', 'Tratamente cosmetologice'], ['PEELING', 'Peeling'], ['DERMATOLOGIE', 'Dermatologie']]],
    ['Chirurgie', [['MICRO CHIRURGIE SI CHIRURGIE PLASTICĂ', 'Microchirurgie și chirurgie plastică'], ['ANALIZĂ ANATOMIE PATOLOGICĂ', 'Analize de anatomie patologică']]],
    ['Regenerare', [['TERAPII INTRAVENOASE', 'Terapii intravenoase'], ['OZONOTERAPIE', 'Ozonoterapie'], ['TMS – Stimulare Magnetică Transcraniană', 'TMS – stimulare magnetică transcraniană'], ['TERAPIA VIELIGHT', 'Terapia Vielight']]],
  ];
  const slugPr = (x) => norm(x).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // fiecare rând de preț → serviciul (și pagina nouă) căruia îi aparține
  const rowServ = new Map();
  for (const sv of D.servicii) for (const p of sv.preturi || []) rowServ.set(`${p.categorie}|${p.nume}`, sv.id);
  const known = new Set(PR_GRUPURI.flatMap(([, cs]) => cs.map(([c]) => c)));
  const extra = D.preturi.filter((c) => !known.has(c.categorie)).map((c) => [c.categorie, cap(c.categorie.toLowerCase())]);
  if (extra.length) PR_GRUPURI.push(['Altele', extra]);
  const catOf = new Map(D.preturi.map((c) => [c.categorie, c]));
  const priceCell = (p, multi) => `<span class="pr-p">${p.tip && p.tip !== 'preț' && (multi || p.tip !== 'ședință') ? `<small>${esc(cap(p.tip))}</small>` : ''}${p.valoare != null ? `<b>${lei(p.valoare)}</b>` : `<b>${esc(p.text)}</b>`}${p.pretInitial ? `<s>${lei(p.pretInitial)}</s>` : ''}</span>`;
  let nRows = 0;
  const cats = [];
  PR_GRUPURI.forEach(([grup, cs]) => cs.filter(([c]) => catOf.has(c)).forEach(([c, nume]) => {
    const cat = catOf.get(c);
    const ids = cat.servicii.map((x) => rowServ.get(`${c}|${x.nume}`)).filter(Boolean);
    const top = ids.sort((a, b) => ids.filter((x) => x === b).length - ids.filter((x) => x === a).length)[0];
    const topHref = top && live(top).startsWith('/nou') ? live(top) : null;
    let lastSub = null;
    const rows = cat.servicii.map((x) => {
      nRows++;
      const id = rowServ.get(`${c}|${x.nume}`);
      const href = id && live(id).startsWith('/nou') && id !== top ? live(id) : null;
      const sub = x.subgrup && x.subgrup !== lastSub ? `<h3 class="pr-sub">${esc(cap(x.subgrup.toLowerCase()))}</h3>` : '';
      lastSub = x.subgrup || lastSub;
      return `${sub}<div class="pr-row"><span class="pr-n">${href ? `<a href="${esc(href)}">${esc(x.nume)}</a>` : esc(x.nume)}</span><span class="pr-ps">${(x.preturi || []).map((p) => priceCell(p, x.preturi.length > 1)).join('')}</span>${wlBtn(x.nume, (x.preturi || []).find((q) => q.valoare != null)?.valoare, href || topHref || '/nou/preturi/', true)}</div>`;
    }).join('');
    const vals = cat.servicii.flatMap((x) => (x.preturi || []).map((p) => p.valoare)).filter((v) => v != null);
    const link = c === 'CONSULTAȚII' && consHub ? ['/nou/consultatii/', 'Toate consultațiile'] : topHref ? [topHref, 'Despre tratament'] : null;
    cats.push({ grup, nume, id: slugPr(nume), n: cat.servicii.length, min: vals.length ? Math.min(...vals) : null, rows, link });
  }));
  // fiecare categorie = un rând de acordeon: titlul, câte prețuri are și de la cât pornește
  const chev = '<i class="pr-chev" aria-hidden="true"></i>';
  const catHtml = cats.map((k) => `<details class="pr-cat" id="${k.id}" data-nume="${esc(k.nume)} ${esc(k.grup)}">
      <summary><small>${esc(k.grup)}</small><h2>${esc(k.nume)}</h2><span class="pr-meta"><span>${k.n} ${k.n === 1 ? 'preț' : 'prețuri'}</span>${k.min != null ? `<span>de la <b>${lei(k.min)}</b></span>` : ''}</span>${chev}</summary>
      <div class="pr-body"><div class="pr-rows">${k.rows}</div>${k.link ? `<a class="link-u pr-more" href="${esc(k.link[0])}">${k.link[1]} →</a>` : ''}</div>
    </details>`).join('');
  const offGroups = [...new Set(D.oferte.map((o) => o.grup))];
  const offName = (o) => offerLabel(o.nume);
  const maxDisc = Math.max(0, ...D.oferte.map((o) => o.discountProcent || 0));
  // ---------- vitrina ofertelor: câte un tab pentru fiecare grup (ofertele lunii, terapii intravenoase, epilare), carduri pe șină ----------
  const offTab = (g) => (g === 'OFERTELE LUNII' ? ['Ofertele lunii', 'Estetică și chirurgie'] : /intraven|perfuz/i.test(g) ? ['Terapii intravenoase', 'Perfuzii, by Oxxygene'] : /epilare|splendor/i.test(g) ? ['Epilare definitivă', 'Splendor X'] : [offerGroup(g), 'Oferte']);
  const offCard = (o) => `<article class="ps-card"><div class="ps-top">${o.detalii ? `<small>${esc(offerLabel(o.detalii))}</small>` : '<small>Ofertă</small>'}${o.discountProcent ? `<span class="ps-disc">−${o.discountProcent}%</span>` : ''}</div><h3>${esc(offName(o))}</h3><div class="ps-foot"><span class="ps-price">${o.pretInitial ? `<s>${lei(o.pretInitial)}</s>` : ''}<b>${lei(o.pret)}</b></span><span class="ps-act">${wlBtn(`Ofertă: ${offName(o)}`, o.pret, '/nou/preturi/#oferte', true)}<a class="ps-cta" href="#programare" data-srv="${esc(`Ofertă: ${offName(o)} – ${lei(o.pret)}`)}">Rezervă</a></span></div></article>`;
  const spotHtml = D.oferte.length ? `<div class="ps" id="oferte">
  <div class="wrap">
    <div class="ps-head">
      <div><span class="eyebrow light">Pentru luna aceasta</span><h2>Ofertele <em>lunii</em></h2><p>${D.oferte.length} oferte${maxDisc ? `, cu până la −${maxDisc}%` : ''}. Alege una și te sunăm noi pentru programare.</p></div>
      <div class="ps-arrows"><button type="button" data-ps-rail="-1" aria-label="Înapoi">‹</button><button type="button" data-ps-rail="1" aria-label="Înainte">›</button></div>
    </div>
    <div class="ps-tabs" role="tablist" aria-label="Grupuri de oferte">${offGroups.map((g, i) => {
      const os = D.oferte.filter((o) => o.grup === g), [t, sub] = offTab(g), d = Math.max(0, ...os.map((o) => o.discountProcent || 0));
      return `<button type="button" role="tab" id="ps-t${i}" aria-controls="ps-p${i}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><b>${esc(t)}</b><small>${esc(sub)} · ${os.length} ${os.length === 1 ? 'ofertă' : 'oferte'}${d ? ` · până la −${d}%` : ''}</small></button>`;
    }).join('')}</div>
    ${offGroups.map((g, i) => `<div class="ps-panel" id="ps-p${i}" role="tabpanel" aria-labelledby="ps-t${i}"${i ? ' hidden' : ''}><div class="ps-rail">${D.oferte.filter((o) => o.grup === g).map(offCard).join('')}</div></div>`).join('')}
  </div>
</div>` : '';
  const navHtml = `${D.oferte.length ? `<a href="#oferte" class="pr-nav-off">Ofertele lunii<span>${D.oferte.length}</span></a>` : ''}${PR_GRUPURI.map(([g]) => {
    const ks = cats.filter((k) => k.grup === g);
    return ks.length ? `<div class="pr-ng"><small>${esc(g)}</small>${ks.map((k) => `<a href="#${k.id}">${esc(k.nume)}<span>${k.n}</span></a>`).join('')}</div>` : '';
  }).join('')}`;

  // ---------- estimatorul: problemele din „Ce te supără?”, așezate pe o siluetă (față / corp) ----------
  // [vedere, x, y, zonele evidențiate [cx, cy, rx, ry]] în coordonatele desenului (față 300×340, corp 240×520)
  const EST_POS = {
    'caderea-parului': ['f', 150, 50, [[150, 44, 74, 22]]],
    'riduri-de-expresie': ['f', 150, 94, [[150, 96, 54, 18], [88, 142, 9, 15], [212, 142, 9, 15]]],
    'cearcane-pungi': ['f', 118, 160, [[124, 151, 24, 11], [176, 151, 24, 11]]],
    'ten-pori-textura': ['f', 104, 196, [[150, 100, 46, 16], [150, 170, 16, 26], [150, 240, 24, 12], [104, 198, 20, 24]]],
    'riduri-profunde-volum': ['f', 196, 184, [[186, 190, 22, 30], [114, 190, 22, 30]]],
    buze: ['f', 180, 220, [[150, 213, 30, 13]]],
    'burnout-anxietate': ['c', 120, 40, [[120, 42, 30, 32]]],
    'transpiratie': ['c', 160, 136, [[80, 138, 12, 16], [160, 138, 12, 16]]],
    'alunite-leziuni': ['c', 62, 156, [[64, 156, 15, 34]]],
    'oboseala-energie': ['c', 120, 160, [[120, 168, 42, 44]]],
    'imbatranire-interioara': ['c', 120, 228, [[120, 270, 100, 255]]],
    'vergeturi-cicatrici': ['c', 148, 304, [[147, 306, 19, 38], [120, 226, 32, 18]]],
    'tonifiere-celulita': ['c', 93, 290, [[94, 292, 21, 44], [146, 292, 21, 44]]],
    'vase-vizibile': ['c', 96, 424, [[96, 424, 13, 44], [144, 424, 13, 44]]],
    'par-nedorit': ['c', 146, 456, [[96, 444, 15, 64], [144, 444, 15, 64], [80, 138, 10, 14], [160, 138, 10, 14]]],
  };
  const VB = { f: [300, 340], c: [240, 520] };
  const est = concernZones.flatMap((z) => z.copii.map((c) => {
    const id = c.url.split('/').filter(Boolean).pop();
    const [v, x, y, hl] = EST_POS[id] || ['c', 120, 260, []];
    const g = (c.ghiduri || []).find((a) => toLive(a.url));
    return { id, zona: z.nume, nume: c.nume, v, x, y, hl,
      tr: c.tratamente.map((t) => ({ n: cleanName(t), u: (t.url && toLive(t.url)) || '', p: t.pret_de_la ?? null })),
      ghid: g ? { t: D.articole.find((a) => a.url.endsWith(g.url))?.titlu || g.titlu, u: toLive(g.url) } : null };
  }));
  const pct = (n, d) => `${+(n / d * 100).toFixed(2)}%`;
  const hls = (v) => est.filter((c) => c.v === v).map((c) => `<g class="pr-hl" data-c="${c.id}">${c.hl.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#prg-${v})"/>`).join('')}</g>`).join('');
  const hots = (v) => est.filter((c) => c.v === v).map((c) => `<button type="button" class="pr-hot" data-c="${c.id}" style="left:${pct(c.x, VB[v][0])};top:${pct(c.y, VB[v][1])}" aria-pressed="false" aria-label="${esc(c.nume)}"><span class="pr-tip" aria-hidden="true">${esc(c.nume)}</span></button>`).join('');
  const glow = (v) => `<radialGradient id="prg-${v}"><stop offset="0" stop-color="#b8955f" stop-opacity=".62"/><stop offset=".6" stop-color="#b8955f" stop-opacity=".24"/><stop offset="1" stop-color="#b8955f" stop-opacity="0"/></radialGradient>`;
  const HEAD = 'M150 38C196 38 224 72 224 124C224 160 218 190 204 214C190 238 170 254 150 254C130 254 110 238 96 214C82 190 76 160 76 124C76 72 104 38 150 38Z';
  const svgFace = `<svg viewBox="0 0 300 340" aria-hidden="true" focusable="false"><defs>${glow('f')}<linearGradient id="prs-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f6efe4"/></linearGradient></defs>
    <path d="${HEAD}" fill="url(#prs-f)"/>
    <g class="pr-hls">${hls('f')}</g>
    <g class="pr-line">
      <path class="soft" d="M150 22C208 22 240 66 240 128C240 180 242 234 258 290M150 22C92 22 60 66 60 128C60 180 58 234 42 290"/>
      <path d="${HEAD}"/>
      <path d="M84 112C92 66 126 50 150 50C180 50 210 66 216 112"/>
      <path d="M77 132C66 128 62 150 70 166C73 172 78 174 82 172M223 132C234 128 238 150 230 166C227 172 222 174 218 172"/>
      <path d="M106 118C116 110 132 110 140 116M160 116C168 110 184 110 194 118"/>
      <path d="M108 137C116 129 132 129 140 137C132 142 116 142 108 137ZM160 137C168 129 184 129 192 137C184 142 168 142 160 137Z"/>
      <path d="M150 142C148 160 145 174 141 184C146 190 154 190 159 184"/>
      <path d="M128 211C136 205 144 203 150 207C156 203 164 205 172 211C162 223 138 223 128 211ZM128 211C140 214 160 214 172 211"/>
      <path d="M122 246C124 270 122 286 116 296C90 304 52 312 30 340M178 246C176 270 178 286 184 296C210 304 248 312 270 340"/>
    </g></svg>`;
  const HALF = 'M110 84C98 90 80 92 70 98C62 103 59 112 58 126C55 152 52 176 50 200C48 226 44 250 41 272C39 284 38 292 41 298C44 302 49 299 50 292C52 278 56 262 60 248C64 230 68 212 70 196C72 176 76 156 80 136M80 134C84 160 86 180 84 202C82 220 76 238 76 258C76 300 80 350 84 390C86 420 86 460 88 490C88 500 82 506 84 510L104 510C104 500 102 492 102 486C104 450 106 420 106 392C108 350 114 300 120 268M100 97C108 101 114 101 118 100M90 388C94 392 98 392 102 388';
  const svgBody = `<svg viewBox="0 0 240 520" aria-hidden="true" focusable="false"><defs>${glow('c')}</defs>
    <ellipse cx="120" cy="44" rx="21" ry="26" fill="#fff"/>
    <g class="pr-hls">${hls('c')}</g>
    <g class="pr-line">
      <ellipse cx="120" cy="44" rx="21" ry="26"/>
      <path d="M111 69L110 84M129 69L130 84"/>
      <path d="${HALF}"/><path d="${HALF}" transform="matrix(-1 0 0 1 240 0)"/>
      <path class="soft" d="M120 104L120 250"/>
    </g></svg>`;
  const estZones = concernZones.map((z) => `<div class="pr-czg"><small>${esc(z.nume)}</small><div>${z.copii.map((c) => `<button type="button" class="pr-chip" data-c="${c.url.split('/').filter(Boolean).pop()}" aria-pressed="false">${esc(c.nume)}</button>`).join('')}</div></div>`).join('');
  const estHtml = `<section class="pr-panel pr-est" id="estimator" role="tabpanel" aria-labelledby="tab-est" hidden>
  <div class="wrap pr-est-in">
    <div class="pr-est-h"><span class="eyebrow">Estimator</span><h2>Ce te <em>supără</em>?</h2><p>Alege zona pe siluetă, bifează opțiunile și vezi de la cât pornește planul. Medicul îl confirmă la consultație.</p></div>
    <div class="pr-fig">
      <div class="pr-views" role="group" aria-label="Vedere"><button type="button" data-view="f" aria-pressed="true">Față</button><button type="button" data-view="c" aria-pressed="false">Corp</button></div>
      <div class="pr-stage">
        <div class="pr-view" data-view="f">${svgFace}${hots('f')}</div>
        <div class="pr-view" data-view="c" hidden>${svgBody}${hots('c')}</div>
      </div>
      <p class="pr-fig-hint">Atinge un punct sau alege din listă</p>
    </div>
    <div class="pr-est-side">
      <div class="pr-cz" role="group" aria-label="Ce te supără"><p class="pr-cz-t">Toate zonele</p>${estZones}</div>
      <div class="pr-detail" id="est-detail" aria-live="polite"></div>
      <div class="pr-sumbox" id="est-sum">
        <div class="pr-sum-h"><span>Estimarea ta <i id="est-n"></i></span><b id="est-total">—</b></div>
        <p class="pr-sum-empty" id="est-empty">Bifează tratamentele care te interesează. Costul orientativ apare aici.</p>
        <ul class="pr-sum-l" id="est-list"></ul>
        <p class="pr-sum-note">Prețuri de pornire, din lista oficială. Zonele, doza și numărul de ședințe le stabilește medicul la consultație (de la ${lei(minConsult)}).</p>
        <div class="pr-sum-a"><a class="btn btn-gold arrow" href="#programare" id="est-cta" data-srv="">Programează consultația</a><a class="btn btn-line" id="est-wa" href="https://wa.me/40743056605" target="_blank" rel="noopener" data-track="whatsapp">Trimite pe WhatsApp</a></div>
      </div>
    </div>
  </div>
  <script type="application/json" id="est-data">${JSON.stringify(est.map(({ hl, x, y, ...c }) => c)).replace(/</g, '\\u003c')}</script>
</section>`;
  const pageUrl = ORIGIN + '/preturi/';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': pageUrl + '#webpage', url: pageUrl, name: 'Prețuri | MOA Clinic', inLanguage: 'ro-RO', mainEntity: { '@id': pageUrl + '#catalog' } },
      { '@type': 'OfferCatalog', '@id': pageUrl + '#catalog', name: 'Lista de prețuri MOA Clinic', itemListElement: D.preturi.map((c) => ({ '@type': 'OfferCatalog', name: c.categorie, itemListElement: c.servicii.filter((x) => x.preturi?.[0]?.valoare != null).map((x) => ({ '@type': 'Offer', name: x.nume, price: x.preturi[0].valoare, priceCurrency: 'RON', seller: { '@id': `${ORIGIN}/#organization` } })) })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Prețuri', item: pageUrl }] },
    ],
  };
  const ico = {
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none"/></svg>',
    body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.4" r="2.2"/><path d="M6.5 9.6c1.7-1 3.5-1.4 5.5-1.4s3.8.4 5.5 1.4M12 8.2v6.4M9.6 21.5l1.1-6.9h2.6l1.1 6.9M6.5 9.6l-1.2 5.6M17.5 9.6l1.2 5.6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  };
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prețuri MOA Clinic București – lista completă | MOA Clinic</title>
<meta name="description" content="${esc(`Lista de prețuri MOA Clinic: ${nRows} prețuri în ${D.preturi.length} categorii – consultații, toxină botulinică, acid hialuronic, epilare Splendor X, Venus Viva, terapii intravenoase și altele. Plus ofertele lunii și un estimator pe zone.`)}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><span aria-current="page">Prețuri</span></nav>

<section class="pr-hero">
  <div class="wrap">
    <div class="pr-hero-in">
      <div><span class="eyebrow">Prețuri</span><h1>Prețuri <em>la vedere</em></h1>
        <p class="lede">Lista oficială MOA Clinic, înainte de programare. Pentru tratamente, medicul stabilește la consultație zonele, doza și numărul de ședințe.</p></div>
      <dl class="pr-facts"><div><dt>${nRows}</dt><dd>prețuri publice</dd></div>${D.oferte.length ? `<div><dt>${D.oferte.length}</dt><dd>oferte luna asta</dd></div>` : ''}<div><dt>${cats.length}</dt><dd>categorii</dd></div></dl>
    </div>
    <div class="pr-switch" role="tablist" aria-label="Cum vrei să vezi prețurile">
      <button type="button" role="tab" id="tab-lista" aria-controls="lista" aria-selected="true">${ico.list}<span><b>Lista completă</b><small>${nRows} de prețuri în ${cats.length} categorii</small></span></button>
      <button type="button" role="tab" id="tab-est" aria-controls="estimator" aria-selected="false" tabindex="-1">${ico.body}<span><b>Pornește de la ce te supără <i class="pr-new">Nou</i></b><small>alegi zona pe siluetă, vezi opțiunile și costul</small></span></button>
    </div>
  </div>
</section>

<section class="pr-panel" id="lista" role="tabpanel" aria-labelledby="tab-lista">
  ${spotHtml}
  <div class="wrap pr-lay">
    <aside class="pr-side">
      <div class="pr-search"><label for="pr-q" class="sr">Caută în prețuri</label><span class="pr-in">${ico.search}<input id="pr-q" type="search" placeholder="Caută un tratament" autocomplete="off" enterkeyhint="search"><button type="button" id="pr-x" aria-label="Șterge căutarea" hidden>✕</button></span></div>
      <nav class="pr-nav" aria-label="Categorii de prețuri">${navHtml}</nav>
    </aside>
    <div class="pr-main">
      <div class="pr-tools"><span id="pr-count" aria-live="polite">${nRows} prețuri</span><button type="button" class="pr-all" id="pr-all" aria-pressed="false">Deschide toate</button></div>
      ${catHtml}
      <p class="pr-empty" id="pr-empty" hidden>Nu am găsit niciun preț. Încearcă alt cuvânt sau <a class="lede-link" href="#programare">întreabă-ne direct</a>.</p>
      <p class="pr-note">Prețurile sunt în lei, din lista oficială a clinicii. Nu știi ce ți se potrivește? <a class="lede-link" href="#estimator">Pornește de la ce te supără</a>.</p>
    </div>
  </div>
</section>

${estHtml}

${BOOK}
<script src="/nou/preturi.js?v=3" defer></script>
${BOTTOM}`;
  fs.mkdirSync(path.join(ROOT, 'nou', 'preturi'), { recursive: true });
  writePage(path.join(ROOT, 'nou', 'preturi', 'index.html'), page);
  console.log(`Prețuri: nou/preturi/ · ${nRows} prețuri · ${D.preturi.length} categorii · ${D.oferte.length} oferte`);
}

// ---------- pagina /nou/video/: toate video-urile din cabinet, pe categorii de tratament ----------
{
  const vids = VID_ALL.map((v) => {
    const sid = v.pagini.find((p) => p.serviciu)?.serviciu;
    const loc = sid && trNode.get(sid);
    return { v, sid, cat: loc?.cat.nume || 'Altele', nume: loc?.nod.nume || serv[sid]?.nume || '', href: sid ? live(sid) : null };
  });
  const CAT_ORDER = ['Tratamente injectabile', 'Tratamente cu aparatură', 'Chirurgie & dermatologie', 'Medicină regenerativă', 'Teste genetice longevity', 'Altele'];
  const cats = [...new Set(vids.map((x) => x.cat))].sort((a, b) => CAT_ORDER.indexOf(a) - CAT_ORDER.indexOf(b));
  vids.sort((a, b) => cats.indexOf(a.cat) - cats.indexOf(b.cat));
  const totalS = vids.reduce((n, x) => n + (VM[x.v.id]?.durata_s || 0), 0);
  // data publicării: luna din calea fișierului pe site (/wp-content/uploads/AAAA/LL/)
  const upDate = (v) => (String(v.fisier).match(/uploads\/(\d{4})\/(\d{2})\//) || []).slice(1).join('-') || undefined;
  const pageUrl = ORIGIN + '/video/';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': pageUrl + '#webpage', url: pageUrl, name: 'Video din cabinet | MOA Clinic', inLanguage: 'ro-RO' },
      ...vids.map(({ v, nume }) => ({ '@type': 'VideoObject', name: vTitle(v), description: `${vTitle(v)} – ${nume}, la MOA Clinic București.`, thumbnailUrl: ORIGIN + (VM[v.id]?.poster || ''), contentUrl: ORIGIN + (VM[v.id]?.mobil || v.fisier), ...(upDate(v) ? { uploadDate: upDate(v) } : {}), ...(VM[v.id]?.durata_s ? { duration: `PT${VM[v.id].durata_s}S` } : {}) })),
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Video', item: pageUrl }] },
    ],
  };
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Video din cabinet – cum decurg tratamentele | MOA Clinic</title>
<meta name="description" content="${esc(`${vids.length} video-uri scurte din cabinetele MOA Clinic: ${[...new Set(vids.map((x) => x.nume))].slice(0, 6).join(', ')} și altele.`)}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><span aria-current="page">Video</span></nav>

<section class="sec vp-sec">
  <div class="wrap">
    <div class="sec-head split"><div><span class="eyebrow">În cabinet</span><h1 style="margin-top:18px">Vezi cum <em>lucrăm.</em></h1></div>
      <p class="lede">${vids.length} video-uri scurte din cabinetele MOA, ${Math.round(totalS / 60)} minute în total. Înainte să vii, știi cum arată clinica, aparatura și o ședință.</p></div>
    <div class="team-filter vp-filter" role="tablist" aria-label="Filtrează după categorie"><button type="button" class="on" data-vcat="">Toate · ${vids.length}</button>${cats.map((c) => `<button type="button" data-vcat="${esc(c)}">${esc(cap(c.replace(/^Tratamente /, '').replace(/^cu /, '')))} · ${vids.filter((x) => x.cat === c).length}</button>`).join('')}</div>
    <h2 class="sr">Toate video-urile</h2>
    <div class="vp-grid">${vids.map(({ v, cat, nume, href }) => `<div class="v-card vp-card${VM[v.id]?.orientare === 'orizontal' ? ' wide' : ''}" data-vcat="${esc(cat)}"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` data-poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește: ${esc(vTitle(v))}"><span>▶</span></button>${vDur(v) ? `<i class="vp-dur">${vDur(v)}</i>` : ''}</div>
      <small class="vp-cat">${esc(cap(cat.replace(/^Tratamente (cu )?/, '')))}</small><h3>${esc(vTitle(v))}</h3>${nume ? `<p>${href ? `<a href="${esc(href)}">${esc(nume)} →</a>` : esc(nume)}</p>` : ''}</div>`).join('')}</div>
  </div>
</section>

${BOOK}
<script>
// filtrul pe categorii
(() => {
  const btns = [...document.querySelectorAll('.vp-filter button')], cards = [...document.querySelectorAll('.vp-card')];
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.classList.toggle('on', x === b));
    cards.forEach((c) => { c.hidden = !!b.dataset.vcat && c.dataset.vcat !== b.dataset.vcat; if (c.hidden) c.querySelector('video').pause(); });
  }));
})();
</script>
${BOTTOM}`;
  fs.mkdirSync(path.join(ROOT, 'nou', 'video'), { recursive: true });
  writePage(path.join(ROOT, 'nou', 'video', 'index.html'), page);
  console.log(`Video: nou/video/ · ${vids.length} video-uri · ${cats.length} categorii · ${Math.round(totalS / 60)} min`);
}

// ---------- pagina /nou/blog/: articolele (rămân la URL-urile actuale), cu filtru, căutare și articolul cel mai nou în față ----------
{
  const BM = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog-media.json'), 'utf8')); } catch { return {}; } })();
  const LUNI = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const dataRo = (d) => { const m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${+m[3]} ${LUNI[+m[2] - 1]} ${m[1]}` : ''; };
  const minute = (a) => Math.max(2, Math.round((a.cuvinte || 0) / 200));
  // rezumatul fără îndemnul de la final („… Descoperă informațiile esențiale acum”)
  const rez = (a) => String(a.rezumat || '').replace(/\s*(Descoper[ăa]|Programeaz[ăa]-te|Rezerv[ăa]|Afl[ăa] mai multe)[^.]*\.?$/i, '').trim().replace(/([^.!?])$/, '$1.');
  const TIP = { tratament: 'Tratamente', ghid: 'Ghiduri', 'îngrijire': 'Îngrijire', opinii: 'Opinii', 'comparație': 'Comparații' };
  const arts = [...D.articole].sort((a, b) => String(b.data).localeCompare(String(a.data)));
  const feat = arts.find((a) => BM[a.id]) || arts[0];
  const rest = arts.filter((a) => a !== feat);
  const tips = Object.keys(TIP).filter((t) => arts.some((a) => a.tip === t));
  const autor = (a) => team.find((p) => p.nume === a.autor);
  const cover = (a, cls = '') => (BM[a.id]
    ? `<div class="bl-img ${cls}"><img src="${esc(biggest(BM[a.id].img))}" alt="" loading="lazy" width="${BM[a.id].w || 1020}" height="${BM[a.id].h || 571}"></div>`
    : `<div class="bl-img bl-noimg ${cls}"><span>${esc(TIP[a.tip] || 'Articol')}</span></div>`);
  const meta = (a) => `<span class="bl-meta">${esc(dataRo(a.data))}<i>·</i>${minute(a)} min de citit</span>`;
  // data-cat / data-tr: categoria și tratamentul articolului, pentru etichetele din paginile de articol (/nou/blog/?cat=… / ?tr=…)
  const card = (a) => { const r = artTr(a); return `<a class="bl-card" href="${esc(artLink(a))}" data-tip="${esc(a.tip)}"${r ? ` data-cat="${esc(catSlug(r.l.cat))}" data-tr="${esc(r.sid)}" data-tema="${esc(r.l.nod.nume.replace(/\s*\(.*\)$/, ''))}" data-cat-nume="${esc(r.l.cat.nume.replace(/^Tratamente /, ''))}"` : ''}>${cover(a)}<div class="bl-body"><small>${esc(TIP[a.tip] || a.tip)}</small><h3>${esc(a.titlu)}</h3><p>${esc(cutTxt(rez(a), 150))}</p>${meta(a)}</div></a>`; };
  const pageUrl = ORIGIN + '/blog/';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Blog', '@id': pageUrl + '#blog', url: pageUrl, name: 'Blogul MOA Clinic', inLanguage: 'ro-RO', publisher: { '@id': `${ORIGIN}/#organization` },
        blogPost: arts.map((a) => ({ '@type': 'BlogPosting', headline: a.titlu, url: a.url, datePublished: a.data, ...(a.modificat ? { dateModified: a.modificat } : {}), author: { '@type': 'Person', name: a.autor }, ...(BM[a.id] ? { image: ORIGIN + BM[a.id].img } : {}) })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: pageUrl }] },
    ],
  };
  const fa = autor(feat);
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog – ghiduri despre tratamente, îngrijire și longevitate | MOA Clinic</title>
<meta name="description" content="${esc(`${arts.length} articole despre tratamente estetice, îngrijire și longevitate, scrise de Dr. Adrian Stănescu, medic primar gerontolog, fondatorul MOA Clinic.`)}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><span aria-current="page">Blog</span></nav>

<section class="bl-hero">
  <div class="wrap">
    <div class="sec-head split"><div><span class="eyebrow">Blog</span><h1 style="margin-top:18px">Ce e bine <em>să știi.</em></h1></div>
      <p class="lede">${arts.length} de articole despre tratamente, îngrijire și longevitate, scrise de ${esc(feat.autor)}${fa ? `, ${esc(fa.rol.toLowerCase())}` : ''}.</p></div>
    <a class="bl-feat" href="${esc(artLink(feat))}">
      ${cover(feat, 'bl-feat-img')}
      <div class="bl-feat-body"><span class="eyebrow">Cel mai nou · ${esc(TIP[feat.tip] || feat.tip)}</span><h2>${esc(feat.titlu)}</h2><p>${esc(rez(feat))}</p>
        <div class="bl-author">${fa && photos[fa.nume] ? `<img src="${esc(resized(photos[fa.nume]))}" alt="">` : ''}<span><b>${esc(feat.autor)}</b>${meta(feat)}</span></div>
        <span class="link-u">Citește articolul →</span></div>
    </a>
  </div>
</section>

<section class="sec bl-list" id="articole">
  <div class="wrap">
    <div class="bl-tools">
      <div class="team-filter bl-filter" role="tablist" aria-label="Tipul articolului"><button type="button" class="on" data-tip="">Toate</button>${tips.map((t) => `<button type="button" data-tip="${esc(t)}">${esc(TIP[t])} · ${arts.filter((a) => a.tip === t && a !== feat).length}</button>`).join('')}</div>
      <div class="pr-search bl-search"><span class="pr-in"><label for="bl-q" class="sr">Caută în articole</label><input id="bl-q" type="search" placeholder="Caută un subiect…" autocomplete="off"></span><span id="bl-count" aria-live="polite"></span></div>
    </div>
    <p class="bl-active" id="bl-active" hidden><span></span><a href="/nou/blog/#articole" aria-label="Arată toate articolele">Toate articolele ×</a></p>
    <div class="bl-grid">${[feat, ...rest].map((a, i) => (i ? card(a) : card(a).replace('<a class="bl-card"', '<a class="bl-card" data-feat hidden'))).join('')}</div>
    <p class="pr-empty" id="bl-empty" hidden>Nu am găsit niciun articol. Încearcă alt cuvânt sau <a class="lede-link" href="#programare">întreabă-ne direct</a>.</p>
    <div class="bl-more-row"><button type="button" class="btn btn-line" id="bl-more">Încarcă mai multe</button></div>
  </div>
</section>

${BOOK}
<script src="/nou/blog.js" defer></script>
${BOTTOM}`;
  fs.mkdirSync(path.join(ROOT, 'nou', 'blog'), { recursive: true });
  writePage(path.join(ROOT, 'nou', 'blog', 'index.html'), page);
  console.log(`Blog: nou/blog/ · ${arts.length} articole · ${Object.keys(BM).length} cu imagine · cel mai nou: ${feat.titlu}`);
}

// ---------- pagina de articol (/nou/<slug-ul actual>/), din data/articole.json ----------
// Deocamdată doar articolele din ART_PAGINI (sus). Adresa păstrează slug-ul de pe site-ul actual.
{
  const AD = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'articole.json'), 'utf8')).articole; } catch { return {}; } })();
  // diacriticele lipsă din textele articolelor (aceeași corectură ca la tratamente)
  { const { corecteaza } = require('./diacritice')([TRD, AD]); for (const k of Object.keys(AD)) corecteaza(AD[k].blocuri); }
  const BM = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog-media.json'), 'utf8')); } catch { return {}; } })();
  const LUNI = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const dataRo = (d) => { const m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${+m[3]} ${LUNI[+m[2] - 1]} ${m[1]}` : ''; };
  const TIP = { tratament: 'Tratamente', ghid: 'Ghid', 'îngrijire': 'Îngrijire', opinii: 'Opinii', 'comparație': 'Comparație' };
  const slugH = (x) => norm(x).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const rez = (a) => String(a.rezumat || '').replace(/\s*(Descoper[ăa]|Programeaz[ăa]-te|Rezerv[ăa]|Afl[ăa] mai multe)[^.]*\.?$/i, '').trim().replace(/([^.!?])$/, '$1.');
  // rezumatul de sub titlu: dacă cel de pe site-ul vechi e prea scurt sau trunchiat („Russian lips vs butterfly lips -.”), prima frază din text
  const rezArt = (a, blocks) => { const r = rez(a).replace(/\s*[-–]\s*\.$/, '.').trim(); if (r.replace(/[^\p{L}]/gu, '').length >= 45) return r; const p = blocks.find((b) => b.t === 'p' && b.x.length > 60)?.x || ''; return cutTxt(p, 190); };
  for (const id of ART_PAGINI) {
    const a = D.articole.find((x) => x.id === id), c = AD[id];
    if (!a || !c) { console.warn('  ! articol fără conținut:', id); continue; }
    const slug = new URL(a.url).pathname.split('/').filter(Boolean).pop();
    const blocks = [...c.blocuri];
    const heroImg0 = blocks[0]?.t === 'img' ? blocks.shift() : BM[id] ? { src: BM[id].img } : null;
    // aceeași fotografie (indiferent de mărime: „x-300x199.avif” = „x.avif”) apare o singură dată: coperta nu se repetă în text
    const imgBase = (s) => String(s).split('/').pop().replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/-scaled(?=\.\w+$)/, '');
    const seenImg = new Set(heroImg0 ? [imgBase(heroImg0.src)] : []);
    for (let i = 0; i < blocks.length; i++) if (blocks[i].t === 'img') { const k = imgBase(blocks[i].src); if (seenImg.has(k)) { blocks.splice(i, 1); i--; } else seenImg.add(k); }
    const heroImg = heroImg0 ? { ...heroImg0, src: biggest(heroImg0.src) } : null;
    const nota = blocks.length && /^sursa foto/i.test(blocks[blocks.length - 1].x || '') ? blocks.pop().x : '';
    // versiunea structurată și interactivă a articolului, dacă există (scripts/articole-rich/<id>.js); altfel textul extras
    const richF = path.join(__dirname, 'articole-rich', id + '.js');
    const RX = fs.existsSync(richF) ? require(richF)({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) : null;
    const h2s = RX ? RX.toc : blocks.filter((b) => b.t === 'h2').map((b) => ({ x: b.x, id: slugH(b.x) }));
    const minute = RX?.minute || Math.max(2, Math.round((a.cuvinte || 0) / 200));
    const autor = team.find((p) => p.nume === a.autor);
    const pr = autor?.profil_detaliat;
    const rel = artTr(a);
    const relCard = rel ? `<a class="ar-rel" href="${esc(live(rel.sid))}"><small>Tratamentul despre care citești</small><b>${esc(rel.l.nod.nume)}</b><span>${esc(rel.l.cat.nume)}</span>${minPrice(rel.sid) ? `<em>de la ${lei(minPrice(rel.sid))}</em>` : ''}<i>Vezi tratamentul →</i></a>` : '';
    const linkTr = (h) => autolink(h, { live, has: (sid) => trNode.has(sid), nume: [...trNode].map(([k, v]) => [k, v.nod.nume]), rel: rel?.sid });
    const body = RX ? [linkTr(RX.html)] : blocks.map((b, i) => {
      if (b.t === 'h2') return `<h2 id="${slugH(b.x)}">${esc(b.x)}</h2>`;
      if (b.t === 'h3') return `<h3>${esc(b.x)}</h3>`;
      if (b.t === 'h4') return `<h4>${esc(b.x)}</h4>`;
      if (b.t === 'p' && /^surs[ăa] (foto|imagine|imagini)?:?|^surs[ăa]:/i.test(b.x) && b.x.length < 120) return `<p class="ar-nota ar-src">${esc(b.x)}</p>`; // „Sursă foto: …” = notă discretă, nu paragraf
      if (b.t === 'p') return `<p${i === 0 ? ' class="ar-first"' : ''}>${esc(b.x)}</p>`;
      if (b.t === 'ul' || b.t === 'ol') return `<${b.t}>${b.items.map((x) => `<li>${esc(x)}</li>`).join('')}</${b.t}>`;
      if (b.t === 'img') return `<figure><img src="${esc(b.src)}" alt="${esc(b.alt || '')}" loading="lazy"></figure>`;
      if (b.t === 'citat') return `<blockquote>${esc(b.x)}</blockquote>`;
      if (b.t === 'tabel') return `<table class="tr-prices">${b.rows.map((r) => `<tr><td>${esc(r)}</td></tr>`).join('')}</table>`;
      return '';
    });
    // caseta tratamentului, pe mobil după introducere (înaintea primului H2)
    const firstH2 = blocks.findIndex((b) => b.t === 'h2');
    if (!RX) { const j = linkTr(body.join('<!--§-->')).split('<!--§-->'); body.splice(0, body.length, ...j); }
    if (!RX && relCard && firstH2 > 0) body.splice(firstH2, 0, `<div class="ar-rel-inline">${relCard}</div>`);
    const byDate = (p, q) => q.sc - p.sc || String(q.x.data).localeCompare(String(p.x.data));
    // în coloana laterală: articole despre același tratament / tratamente din aceeași categorie
    const similar = D.articole.filter((x) => x.id !== id).map((x) => {
      const r = artTr(x);
      return { x, r, sc: (r && rel && r.sid === rel.sid ? 4 : 0) + (r && rel && r.l.cat === rel.l.cat ? 2 : 0) + (x.entitati || []).filter((e) => (a.entitati || []).includes(e) && !/^dr\./i.test(e)).length };
    }).filter((s) => s.sc >= 2).sort(byDate).slice(0, 4);
    // jos („Citește și”): alte articole, fără cele deja propuse în lateral
    const related = D.articole.filter((x) => x.id !== id && !similar.some((s) => s.x === x)).map((x) => ({ x, sc: (x.tip === a.tip ? 1 : 0) + (x.entitati || []).filter((e) => (a.entitati || []).includes(e)).length * 2 })).sort(byDate).slice(0, 3).map((r) => r.x);
    // etichete: tipul articolului → categoria de tratamente → tratamentul (fiecare deschide blogul filtrat)
    const tags = [
      { href: `/nou/blog/?tip=${encodeURIComponent(a.tip)}`, x: TIP[a.tip] || a.tip },
      ...(rel ? [
        { href: `/nou/blog/?cat=${catSlug(rel.l.cat)}`, x: cap(rel.l.cat.nume.replace(/^Tratamente /, '')) },
        { href: `/nou/blog/?tr=${encodeURIComponent(rel.sid)}`, x: rel.l.nod.nume.replace(/\s*\(.*\)$/, '') },
      ] : []),
    ];
    const tocHtml = h2s.length >= 3 ? `<ol>${h2s.map((h) => `<li><a href="#${h.id}">${esc(h.x)}</a></li>`).join('')}</ol>` : '';
    const simHtml = similar.length ? `<div class="ar-sim"><small>Articole despre tratamente similare</small>${similar.map((s) => `<a href="${esc(artLink(s.x))}">${BM[s.x.id] ? `<img src="${esc(BM[s.x.id].img)}" alt="" loading="lazy">` : `<span class="ar-sim-ph">${esc((TIP[s.x.tip] || 'A')[0])}</span>`}<span><b>${esc(s.x.titlu)}</b><i>${esc(s.r ? s.r.l.nod.nume.replace(/\s*\(.*\)$/, '') : TIP[s.x.tip])}</i></span></a>`).join('')}</div>` : '';
    const tagsHtml = `<div class="ar-tags"><small>Etichete</small><div>${tags.map((t) => `<a href="${esc(t.href)}">${esc(t.x)}</a>`).join('')}</div></div>`;
    const pageUrl = a.url;
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'BlogPosting', '@id': pageUrl + '#articol', mainEntityOfPage: pageUrl, headline: a.titlu, description: rez(a), datePublished: a.data, ...(a.modificat ? { dateModified: a.modificat } : {}), inLanguage: 'ro-RO',
          ...(heroImg ? { image: ORIGIN + heroImg.src } : {}), wordCount: a.cuvinte || undefined,
          author: { '@type': 'Person', name: a.autor, ...(autor?.profil_detaliat ? { url: `${ORIGIN}/medici/${autor.id}/`, jobTitle: autor.rol } : {}) },
          publisher: { '@id': `${ORIGIN}/#organization` } },
        { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: ORIGIN + '/blog/' }, { '@type': 'ListItem', position: 3, name: a.titlu, item: pageUrl }] },
        ...(RX?.faq ? [{ '@type': 'FAQPage', mainEntity: RX.faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) }] : []),
      ],
    };
    const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.titlu)} | MOA Clinic</title>
<meta name="description" content="${esc(cutTxt(rezArt(a, blocks), 158))}">
<link rel="canonical" href="${esc(pageUrl)}">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${TOP}<main>
<div class="ar-progress" aria-hidden="true"><span></span></div>
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><a href="/nou/blog/">Blog</a><span>›</span><span aria-current="page">${esc(cutTxt(a.titlu, 60))}</span></nav>

<header class="ar-head">
  <div class="wrap ar-narrow">
    <a class="eyebrow ar-tip" href="/nou/blog/?tip=${encodeURIComponent(a.tip)}">${esc(TIP[a.tip] || a.tip)}</a>
    <h1>${esc(a.titlu)}</h1>
    ${RX ? `<p class="lede">${esc(RX.lede)}</p>` : ''}${!RX && rezArt(a, blocks) === rez(a).replace(/\s*[-–]\s*\.$/, '.').trim() ? `<p class="lede">${esc(rezArt(a, blocks))}</p>` : ''}
    <div class="bl-author ar-author">${autor && photos[autor.nume] ? `<img src="${esc(resized(photos[autor.nume]))}" alt="">` : ''}<span><b>${autor?.profil_detaliat ? `<a href="/nou/medici/${esc(autor.id)}/">${esc(a.autor)}</a>` : esc(a.autor)}</b><span class="bl-meta">${esc(autor?.rol || '')}${autor?.rol ? '<i>·</i>' : ''}${esc(dataRo(a.data))}<i>·</i>${minute} min de citit</span></span></div>
    ${RX?.trust ? `<ul class="rx-trust">${RX.trust.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  </div>
  ${heroImg ? `<div class="wrap"><figure class="ar-hero"><img src="${esc(heroImg.src)}" alt="${esc(heroImg.alt || a.titlu)}" fetchpriority="high"></figure></div>` : ''}
</header>

<section class="ar-main">
  <div class="wrap ar-grid">
    <article class="ar-body${RX ? ' rx-body' : ''}">
      ${tocHtml ? `<details class="ar-toc-m ar-m"><summary><small>Cuprins</small><span class="ar-toc-cur">${h2s.length} secțiuni</span></summary><nav aria-label="Cuprins">${tocHtml}</nav></details>` : ''}
      ${body.join('\n      ')}
      ${nota ? `<p class="ar-nota">${esc(nota)}</p>` : ''}
      ${autor ? `<div class="ar-bio">${photos[autor.nume] ? `<img src="${esc(resized(photos[autor.nume]))}" alt="">` : ''}<div><small>Despre autor</small><b>${esc(autor.nume)}</b><p>${esc(cutTxt(pr?.rezumat || autor.rol, 260))}</p>${pr ? `<a class="link-u" href="/nou/medici/${esc(autor.id)}/">Vezi profilul →</a>` : ''}</div></div>` : ''}
      <div class="ar-more-m ar-m">${simHtml}${tagsHtml}</div>
    </article>
    <aside class="ar-side">
      ${tocHtml ? `<nav class="ar-toc" aria-label="Cuprins"><small>Cuprins</small>${tocHtml}</nav>` : ''}
      ${relCard}
      ${simHtml}
      ${tagsHtml}
    </aside>
  </div>
</section>

${related.length ? `<section class="sec alt">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Din blog</span><h2 style="margin-top:18px">Citește <em>și</em></h2></div><a class="link-u" href="/nou/blog/" style="justify-self:start">Toate articolele →</a></div>
    <div class="bl-grid ar-related">${related.map((x) => `<a class="bl-card" href="${esc(artLink(x))}">${BM[x.id] ? `<div class="bl-img"><img src="${esc(BM[x.id].img)}" alt="" loading="lazy"></div>` : `<div class="bl-img bl-noimg"><span>${esc(TIP[x.tip] || 'Articol')}</span></div>`}<div class="bl-body"><small>${esc(TIP[x.tip] || x.tip)}</small><h3>${esc(x.titlu)}</h3><span class="bl-meta">${esc(dataRo(x.data))}<i>·</i>${Math.max(2, Math.round((x.cuvinte || 0) / 200))} min de citit</span></div></a>`).join('')}</div>
  </div>
</section>` : ''}

${BOOK}
<script>
// bara de progres a citirii + secțiunea curentă în cuprins
(() => {
  const bar = document.querySelector('.ar-progress span'), body = document.querySelector('.ar-body');
  const links = [...document.querySelectorAll('.ar-toc a')], heads = links.map((l) => document.getElementById(l.getAttribute('href').slice(1)));
  const on = () => {
    const r = body.getBoundingClientRect(), total = r.height - innerHeight;
    bar.style.width = Math.min(100, Math.max(0, (-r.top / Math.max(1, total)) * 100)) + '%';
    let cur = -1; heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < 160) cur = i; });
    links.forEach((l, i) => l.classList.toggle('on', i === cur));
    const curEl = document.querySelector('.ar-toc-cur'); if (curEl && cur >= 0 && links[cur]) curEl.textContent = links[cur].textContent;
  };
  addEventListener('scroll', on, { passive: true }); on();
  // pe mobil cuprinsul se închide după alegerea unei secțiuni
  const m = document.querySelector('.ar-toc-m');
  if (m) m.addEventListener('click', (e) => { if (e.target.closest('a')) m.open = false; });
})();
${RX?.script || ''}
</script>
${BOTTOM}`;
    const dir = path.join(ROOT, 'nou', slug);
    fs.mkdirSync(dir, { recursive: true });
    writePage(path.join(dir, 'index.html'), page);
    console.log(`Articol: nou/${slug}/ · ${blocks.length} blocuri · ${h2s.length} secțiuni · tratament: ${rel ? rel.l.nod.nume : '–'} · ${related.length} înrudite`);
  }
}
