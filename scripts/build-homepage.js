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
const writePage = (p, html) => fs.writeFileSync(p, fixPunct(html.replace(/\[email(?:&#160;|&nbsp;|\s)protected\]/g, 'office@moaclinic.ro'))
  .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, j, b) => a + j.replace(/([^\s"]) +([.,;:!?])(?=[\s"]|$)/g, '$1$2')
    .replace(/"(name|description|text|headline|alternateName)":"([^"]*)"/g, (mm, k, v) => `"${k}":"${curata(v)}"`) + b)
  // titlul și meta-descrierea trec prin aceeași rescriere a afirmațiilor
  .replace(/(<title>)([^<]*)/, (m, a, v) => a + curata(v))
  .replace(/(<meta name="description" content=")([^"]*)/, (m, a, v) => a + curata(v)));
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
NOU.add('/video/');
NOU.add('/blog/');
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
const priceEm = (p) => (p != null ? `<em><small>de la</small>${lei(p)}</em>` : '<em>→</em>');
const card = (it) => `<a class="mm-card" href="${esc(it.href)}"><b>${esc(it.nume)}</b>${it.sub ? `<span>${esc(it.sub)}</span>` : ''}${priceEm(it.pret)}</a>`;
const feature = (img, title, text, btn, href) => `<aside class="mm-feature">${img ? `<div class="ph"><img src="${esc(img)}" alt="" loading="lazy"></div>` : ''}<h4>${title}</h4><p>${text}</p><a class="btn btn-gold" href="${esc(href)}">${esc(btn)}</a></aside>`;
const topOffer = offers[0];
const minConsult = Math.min(...['consultatie-dermatoestetica-dermatologie', 'consultatie-antiaging', 'consultatie-chirurgie-plastica'].map(minPrice).filter(Boolean));

// panourile desktop
const tabbed = (id, title, groups, feat) => `
  <div class="mm" id="mm-${id}" role="region" aria-label="${esc(title)}">
    <div class="wrap mm-in">
      <div class="mm-side" role="tablist" aria-orientation="vertical"><span class="mm-side-t">${esc(title)}</span>
        ${groups.map((g, i) => `<button class="mm-tab" type="button" role="tab" aria-selected="${i === 0}" data-pane="${id}-${i}"><b>${esc(g.nume)}</b><small>${esc(g.hint)}</small><i>→</i></button>`).join('')}
      </div>
      <div class="mm-main">${groups.map((g, i) => `
        <div class="mm-pane" id="pane-${id}-${i}" ${i ? 'hidden' : ''}>
          <div class="mm-pane-h"><h3>${esc(g.nume)}</h3>${g.href ? `<a href="${esc(g.href)}">Vezi categoria →</a>` : ''}</div>
          <div class="mm-grid">${g.items.map(card).join('')}</div>
        </div>`).join('')}
      </div>
      ${feat}
    </div>
  </div>`;
const simple = (id, m, feat) => `
  <div class="mm" id="mm-${id}" role="region" aria-label="${esc(m.nume)}">
    <div class="wrap mm-in simple">
      <div class="mm-main"><div class="mm-pane-h"><h3>${esc(m.nume)}</h3></div>
        <div class="mm-grid">${m.linkuri.map((l) => card({ nume: l.nume, sub: LINK_HINT[l.nume] || '', pret: null, href: toLive(l.url) || (l.url === '/clinica/recenzii/' ? '#recenzii' : l.url === '/clinica/' ? '#despre' : '#programare') })).join('')}</div>
      </div>
      ${feat}
    </div>
  </div>`;
const PANELS = {
  'Ce te supără?': (i) => tabbed(i, 'Alege zona', zoneData, feature('/wp-content/uploads/2024/08/karelys-ruiz-PqyzuzFiQfY-unsplash-768x511.jpg', 'Nu știi de unde să începi?', `Programează o consultație: medicul te ascultă și îți propune un plan potrivit. De la ${lei(minConsult)}.`, 'Programează consultația', '#programare')),
  'Tratamente': (i) => tabbed(i, 'Categorii', catData, topOffer ? feature('/wp-content/uploads/2024/08/look-studio-HtXyytr9304-unsplash-768x512.jpg', 'Oferta lunii', `${esc(offerLabel(topOffer.nume))}: <b>${lei(topOffer.pret)}</b> în loc de ${lei(topOffer.pretInitial)}.`, 'Rezervă oferta', '#programare') : ''),
  'Longevitate': (i, m) => simple(i, m, feature('/wp-content/uploads/2024/10/Dr.-Adrian-Stanescu-768x1060.jpeg', 'Global Antiaging', 'Programul coordonat de Dr. Adrian Stănescu, medic primar gerontolog, format la școala Ana Aslan.', 'Programează-te', '#programare')),
  'Prețuri': (i, m) => simple(i, m, feature(null, 'Ofertele lunii', offers.map((o) => `${esc(offerLabel(o.nume))} · <b>${lei(o.pret)}</b>`).join('<br>'), 'Toate ofertele', '/nou/preturi/#oferte')),
  'Despre MOA': (i, m) => simple(i, m, feature('/wp-content/uploads/2024/10/Clinica-moa-768x949.jpeg', 'Te așteptăm', 'Str. Ștefan Mihăileanu 35, București<br>0743 056 605 · office@moaclinic.ro', 'Vezi pe hartă', D.contact.googleMaps[0])),
};
const panelsHtml = M.map((m, i) => (PANELS[m.nume] ? PANELS[m.nume](i, m) : '')).join('');

// meniul mobil: ecrane pe niveluri
const mrowLink = (it) => `<a class="mrow" href="${esc(it.href)}"><span><b>${esc(it.nume)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span>${it.pret != null ? `<em>de la ${lei(it.pret)}</em>` : '<span class="chev">→</span>'}</a>`;
const mrowGo = (label, sub, screen) => `<button class="mrow" type="button" data-go="${screen}"><span><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><span class="chev">›</span></button>`;
const screens = [];
screens.push(`<div class="mscreen on" data-screen="root">${M.map((m, i) => (m.tip === 'link' ? mrowLink({ nume: m.url === '/medici/' ? 'Echipa' : m.nume, href: m.url === '/medici/' ? '#echipa' : toLive(m.url) || '#' }) : mrowGo(m.nume, m.nota ? '' : '', `m${i}`))).join('')}
  ${mrowLink({ nume: '0743 056 605', sub: 'Sună pentru programare', href: 'tel:+40743056605' })}</div>`);
M.forEach((m, i) => {
  if (m.nume === 'Ce te supără?') {
    screens.push(`<div class="mscreen" data-screen="m${i}"><h3>${esc(m.nume)}</h3>${zoneData.map((z, j) => mrowGo(z.nume, z.hint, `z${j}`)).join('')}</div>`);
    zoneData.forEach((z, j) => screens.push(`<div class="mscreen" data-screen="z${j}"><h3>${esc(z.nume)}</h3>${z.items.map(mrowLink).join('')}</div>`));
  } else if (m.nume === 'Tratamente') {
    screens.push(`<div class="mscreen" data-screen="m${i}"><h3>${esc(m.nume)}</h3>${catData.map((c, j) => mrowGo(c.nume, c.hint, `c${j}`)).join('')}</div>`);
    catData.forEach((c, j) => screens.push(`<div class="mscreen" data-screen="c${j}"><h3>${esc(c.nume)}</h3>${c.items.map(mrowLink).join('')}</div>`));
  } else if (m.linkuri) {
    screens.push(`<div class="mscreen" data-screen="m${i}"><h3>${esc(m.nume)}</h3>${m.linkuri.map((l) => mrowLink({ nume: l.nume, sub: LINK_HINT[l.nume] || '', href: toLive(l.url) || '#programare' })).join('')}</div>`);
  }
});
const mobileNav = `
<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Meniu" aria-hidden="true">
  <div class="mnav-top"><button class="mnav-back" type="button" id="mback" hidden>‹ Înapoi</button><img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA Clinic" id="mlogo"><button class="mnav-x" type="button" id="mclose">Închide ✕</button></div>
  <div class="mnav-body">${screens.join('')}</div>
  <div class="mnav-foot"><a class="btn btn-line" href="tel:+40743056605">Sună</a><a class="btn btn-gold" href="#programare" data-mclose>Programează-te</a></div>
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
<script type="application/ld+json">${JSON.stringify(ORG_SCHEMA)}</script>
</head>
<body>

<div class="topbar"><div class="wrap">
  <span class="tb-left">Str. Ștefan Mihăileanu 35, București</span>
  <span class="tb-right"><a href="tel:+40743056605">0743 056 605</a><a href="https://wa.me/40743056605?text=${encodeURIComponent('Bună ziua! Aș dori o programare la MOA Clinic.')}" data-track="whatsapp">WhatsApp</a><a href="mailto:office@moaclinic.ro">office@moaclinic.ro</a></span>
</div></div>

<header class="site" id="hdr">
  <div class="wrap hd">
    <a class="logo" href="/nou/" aria-label="MOA Clinic – acasă"><img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA Clinic"></a>
    <nav class="nav" aria-label="Meniu principal"><ul>
      ${M.map((m, i) => `<li>${m.tip === 'link' ? `<a class="nav-btn" href="${esc(m.url === '/medici/' ? '#echipa' : toLive(m.url) || '#')}">${esc(m.url === '/medici/' ? 'Echipa' : m.nume)}</a>` : `<button class="nav-btn" type="button" aria-expanded="false" aria-controls="mm-${i}" data-mm="${i}">${esc(m.nume)} ${chev}</button>`}</li>`).join('')}
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
      <a class="doc-chip" href="/nou/medici/adrian-stanescu/"><img src="/wp-content/uploads/2024/09/image00005-682x1024.jpeg" alt="" width="48" height="48" loading="lazy"><span><b>Dr. Adrian Stănescu</b>medic primar gerontolog · fondator</span></a>
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
          <img src="${esc(s.src)}" alt="${esc(s.alt)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>`).join('')}</div>
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

<section class="trust" aria-label="De ce MOA">
  <div class="wrap">
    <div class="t"><b>Medic primar gerontolog</b><span>coordonator medical, școala Ana Aslan</span></div>
    <div class="t"><b>Injectabile făcute de medici</b><span>numiți pe pagina fiecărui tratament</span></div>
    <div class="t"><b>Grupul medical Oxxygene</b><span>clinică și spital privat, Otopeni</span></div>
    <div class="t"><b>Prețuri publice</b><span>${D.preturi.reduce((n, c) => n + c.servicii.length, 0)} de prețuri pe site, înainte de programare</span></div>
  </div>
</section>

<section class="sec concerns" id="ce-te-supara">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow">Ce te supără?</span><h2 style="margin-top:22px">Pornește de la <em>tine</em>, nu de la un tratament.</h2></div>
      <p class="lede">Spune-ne ce ai observat. Îți arătăm opțiunile potrivite, de la cele mai blânde la cele mai intense – iar medicul alege împreună cu tine.</p>
    </div>
    <div class="tabs rv" role="tablist">${concernZones.map((z, i) => `<button role="tab" type="button" aria-selected="${i === 0}" data-tab="${i}">${esc(z.nume)}</button>`).join('')}</div>
    ${concernZones.map((z, i) => `<div class="c-panel" data-panel="${i}" ${i ? 'hidden' : ''}><div class="c-grid">${z.copii.map((c, j) => {
      const tr = c.tratamente.slice(0, 4);
      const prices = c.tratamente.map((t) => t.pret_de_la).filter((x) => x != null);
      const first = c.tratamente.find((t) => t.url);
      return `<a class="c-card" href="${esc((first && toLive(first.url)) || '#programare')}">
        <span class="n">${String(j + 1).padStart(2, '0')}</span>
        <h3>${esc(c.nume)}</h3>
        <ul>${tr.map((t) => `<li>${esc(cleanName(t))}</li>`).join('')}</ul>
        <span class="from">${prices.length ? `<span>de la</span><b>${lei(Math.min(...prices))}</b>` : '<span>Începe cu o consultație</span><b>→</b>'}</span>
      </a>`; }).join('')}</div></div>`).join('')}
  </div>
</section>

<section class="sec signature">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow">Tratamente-semnătură</span><h2 style="margin-top:22px">Rafinament, <em>nu transformare.</em></h2></div>
      <p class="lede">Cele mai cerute tratamente ale clinicii, făcute cu produse originale și aparatură medicală de ultimă generație.</p>
    </div>
    <div class="sig-grid">${SIG.map((s) => `
      <a class="sig ${s.wide ? 'wide' : ''} rv" href="${esc(live(s.id))}">
        <img src="${esc(s.img)}" alt="${esc(s.titlu)}" loading="lazy">
        <div class="in"><span class="cat">${esc(s.cat)}</span><h3>${esc(s.titlu)}</h3><p>${esc(s.text)}</p>
          <span class="meta"><span>${esc(trNode.get(s.id)?.nod.nume || serv[s.id]?.nume || '')}</span>${minPrice(s.id) ? `<span>de la <b>${lei(minPrice(s.id))}</b></span>` : ''}</span></div>
      </a>`).join('')}
    <p class="swipe-hint" aria-hidden="true">Glisează pentru mai multe →</p>
    </div>
  </div>
</section>

<section class="sec philosophy">
  <div class="wrap grid">
    <div class="ph-img rv"><img src="/wp-content/uploads/2024/09/image00005-682x1024.jpeg" alt="Dr. Adrian Stănescu, fondatorul MOA Clinic" loading="lazy"></div>
    <div class="rv">
      <span class="eyebrow">Global Antiaging</span>
      <h2 style="font-size:clamp(38px,4.6vw,58px);margin-top:22px">Un concept în care vârsta <em style="color:var(--gold)">nu mai contează.</em></h2>
      ${FOUNDER_QUOTE ? `<blockquote class="quote">„${esc(FOUNDER_QUOTE)}”<cite>Dr. Adrian Stănescu · medic primar gerontolog, fondator</cite></blockquote>` : ''}
      <p class="lede">MOA unește estetica medicală cu medicina regenerativă: îți măsurăm vârsta biologică, apoi lucrăm deodată la cum arăți și la cum te simți.</p>
      <div class="pillars">
        <div><b>Estetică</b><span>injectabile, laser, radiofrecvență</span></div>
        <div><b>Chirurgie</b><span>blefaroplastie, lip lift, dermatochirurgie</span></div>
        <div><b>Regenerare</b><span>terapii IV, ozon, NAD+, TMS</span></div>
      </div>
      <a class="link-u" href="/nou/longevitate/program/">Descoperă programul de longevitate</a>
    </div>
  </div>
</section>

<section class="sec safety">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow light">Siguranța ta</span><h2 style="margin-top:22px">Înaintea oricărui rezultat, <em>siguranța.</em></h2></div>
      <p class="lede">Un tratament de prima clasă începe cu o evaluare medicală corectă și se termină cu un rezultat care arată ca tine.</p>
    </div>
    <div class="s-grid">
      <div class="s-item rv"><span class="ico">${icon.doc}</span><h3>Evaluare medicală</h3><p>Fiecare plan pornește de la o consultație cu medicul: istoric, piele, așteptări, contraindicații.</p></div>
      <div class="s-item rv"><span class="ico">${icon.shield}</span><h3>Făcut de medici</h3><p>Procedurile injectabile și chirurgicale sunt făcute de medici primari și specialiști, nu de operatori.</p></div>
      <div class="s-item rv"><span class="ico">${icon.seal}</span><h3>Produse originale</h3><p>Lucrăm cu mărci recunoscute internațional, pe care le vezi și în lista de prețuri.</p></div>
      <div class="s-item rv"><span class="ico">${icon.spark}</span><h3>Doze potrivite</h3><p>Rezultate naturale, construite treptat. Mai puțin, dar exact unde trebuie.</p></div>
    </div>
    <div class="brands rv" aria-label="Mărci folosite">${BRANDS.map((b) => `<img src="/nou/media/brands/${b.f}?v=2" alt="${b.n}" style="--h:${b.h}px" loading="lazy">`).join('')}</div>
  </div>
</section>

<section class="sec" id="echipa">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow">Echipa MOA</span><h2 style="margin-top:22px">Mâini <em>sigure.</em></h2></div>
      <p class="lede">Medici gerontologi, dermatologi și chirurgi plastici, alături de specialiști în estetică și asistente – o singură echipă, sub același acoperiș. Știi mereu cine te tratează.</p>
    </div>
    <div class="team-filter rv" role="tablist" aria-label="Filtrează echipa">${TEAM_GROUPS.map((g, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-team="${g.id}">${esc(g.nume)} <span>${g.id === 'toti' ? team.length : team.filter((p) => p.grup === g.id).length}</span></button>`).join('')}</div>
    <div class="team-grid">${team.map((p) => `
      <article class="doc rv${p.profil_detaliat ? ' has-profile' : ''}" data-grup="${p.grup}">${p.profil_detaliat ? `<a class="doc-link" href="/nou/medici/${esc(p.id)}/" aria-label="Profilul ${esc(p.nume)}"></a>` : ''}<div class="ph">${photos[p.nume] ? `<img src="${esc(resized(photos[p.nume]))}" alt="${esc(p.nume)}" loading="lazy">` : `<div class="mono" role="img" aria-label="${esc(p.nume)} – fotografie în curând"><span>${esc(p.nume.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span><small>fotografie în curând</small></div>`}</div>
        <span class="tag">${esc(p.specialitate)}</span><h3>${esc(p.nume)}</h3><span>${esc(p.rol)}</span>${p.profil_detaliat ? '<span class="doc-more">Vezi profilul →</span>' : ''}</article>`).join('')}
    <p class="swipe-hint" aria-hidden="true">Glisează pentru mai multe →</p>
    </div>
  </div>
</section>

<section class="sec inroom">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow">În cabinet</span><h2 style="margin-top:22px">Vezi cum decurge <em>o ședință.</em></h2></div>
      <div class="inroom-side"><p class="lede">Fără surprize: înainte să vii, știi exact ce se întâmplă, cât durează și cum te simți.</p><a class="link-u" href="/nou/video/">Toate cele ${VID_ALL.length} video-uri →</a></div>
    </div>
    <div class="v-grid">${VID.map((v) => {
      const p = v.pagini[0];
      return `<div class="v-card rv"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește video"><span>▶</span></button></div>
        <h3>${esc(vTitle(v))}</h3><p>${p.serviciu ? `<a href="${esc(live(p.serviciu))}">${esc(trNode.get(p.serviciu)?.nod.nume || serv[p.serviciu]?.nume || '')}</a>` : ''}${vDur(v) ? ` · ${vDur(v)}` : ''}</p></div>`; }).join('')}
    <p class="swipe-hint" aria-hidden="true">Glisează pentru mai multe →</p>
    </div>
  </div>
</section>

<section class="sec reviews" id="recenzii">
  <div class="wrap grid">
    <div class="score rv"><span class="eyebrow">Recenzii Google</span><b>5.0</b><span class="stars">★★★★★</span><p class="lede">Din ${esc(nReviews)} de recenzii verificate, calificativ „Excelent”.</p></div>
    <div class="r-grid">${reviews.map((r) => `<figure class="r-card rv" style="margin:0"><q>${esc(r.citat)}</q><figcaption class="who"><b>${esc(r.persoana)}</b> · Google</figcaption></figure>`).join('')}</div>
  </div>
</section>

<section class="space" id="despre">
  <img src="/wp-content/uploads/2024/10/Clinica-moa-1243x1536.jpeg" alt="Interiorul clinicii MOA" loading="lazy">
  <div class="wrap rv">
    <span class="eyebrow light">Clinica</span>
    <h2>Te așteptăm <em style="color:var(--gold-soft)">acasă la MOA.</em></h2>
    <p>Un spațiu luminos, liniștit, gândit ca tu să te simți în largul tău de la prima vizită.</p>
    <dl><dt>Adresă</dt><dd>Str. Ștefan Mihăileanu 35, București</dd><dt>Telefon</dt><dd><a href="tel:+40743056605">0743 056 605</a></dd><dt>Email</dt><dd><a href="mailto:office@moaclinic.ro">office@moaclinic.ro</a></dd></dl>
    <div><a class="btn btn-ghost arrow" href="${esc(D.contact.googleMaps[0])}" target="_blank" rel="noopener">Vezi pe hartă</a></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow">Ofertele lunii</span><h2 style="margin-top:22px">Pentru <em>luna aceasta.</em></h2></div>
      <a class="link-u" href="/nou/preturi/#oferte" style="justify-self:start">Toate cele ${D.oferte.length} oferte →</a>
    </div>
    <div class="o-grid hp-offers">${offers.map((o) => `
      <a class="o-card rv" href="#programare" data-srv="${esc(offSrv(o))}"><span class="off">−${o.discountProcent}%</span><span class="eyebrow">${esc(o.grup === 'OFERTELE LUNII' ? 'Oferta lunii' : offerGroup(o.grup))}</span>
        <h3>${esc(offerLabel(o.nume))}</h3>${o.detalii ? `<small class="o-det">${esc(offerLabel(o.detalii))}</small>` : ''}
        <div class="price"><b>${lei(o.pret)}</b><s>${lei(o.pretInitial)}</s></div>
        <span class="link-u" style="justify-self:start;margin-top:6px">Programează-te →</span></a>`).join('')}
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
<div class="proto" id="proto">Site nou (propunere) · <a href="/vechi/">vezi site-ul actual</a><button type="button" aria-label="Ascunde eticheta" id="proto-x">✕</button></div>

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
    const show = () => {
      const side = t.closest('.mm-side');
      side.querySelectorAll('.mm-tab').forEach((x) => x.setAttribute('aria-selected', x === t));
      t.closest('.mm-in').querySelectorAll('.mm-pane').forEach((p) => (p.hidden = p.id !== 'pane-' + t.dataset.pane));
    };
    t.addEventListener('mouseenter', show); t.addEventListener('focus', show); t.addEventListener('click', show);
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
    document.getElementById('burger').setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
    if (!o) { stack.length = 1; show(); }
  };
  document.getElementById('burger').addEventListener('click', () => mOpen(true));
  document.getElementById('mclose').addEventListener('click', () => mOpen(false));
  back.addEventListener('click', () => { stack.pop(); show(); });
  mnav.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { stack.push(b.dataset.go); show(); }));
  mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => mOpen(false)));
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
      slides.forEach((s, i) => { s.classList.toggle('on', i === cur); s.setAttribute('aria-hidden', i !== cur); if (i === cur) s.querySelector('img').loading = 'eager'; });
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
    slides.slice(1, 2).forEach((s) => (s.querySelector('img').loading = 'eager'));
    play();
  }

  // echipa: filtru pe grupuri
  const tf = [...document.querySelectorAll('[data-team]')];
  tf.forEach((b) => b.addEventListener('click', () => {
    tf.forEach((x) => x.setAttribute('aria-selected', x === b));
    document.querySelectorAll('.doc[data-grup]').forEach((d) => (d.hidden = b.dataset.team !== 'toti' && d.dataset.grup !== b.dataset.team));
  }));

  // „Ce te supără?” pe zone
  const tabs = [...document.querySelectorAll('[data-tab]')];
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-selected', x === t));
    document.querySelectorAll('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== t.dataset.tab));
  }));

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
    if (a.closest('.tr-offer, .tr-offer-row, .o-card, .pr-off, .pr-orow')) track('click_oferta', { oferta: a.dataset.srv || a.textContent.trim().slice(0, 80) });
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
<nav class="wrap crumbs" aria-label="Breadcrumb"><a href="/nou/">Acasă</a><span>›</span><a href="/nou/#echipa">Echipa</a><span>›</span><span aria-current="page">${esc(p.nume)}</span></nav>

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
  const vidCards = tVids.map((v) => `<div class="v-card vp-card${VM[v.id]?.orientare === 'orizontal' ? ' wide' : ''}"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește: ${esc(vTitle(v))}"><span>▶</span></button>${vDur(v) ? `<i class="vp-dur">${vDur(v)}</i>` : ''}</div><h3>${esc(vTitle(v))}</h3></div>`).join('');
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
${TOP}<main class="tr-page">
<nav class="wrap crumbs" aria-label="Breadcrumb">${crumbs.map(([n, h]) => (h ? `<a href="${esc(h)}">${esc(n)}</a><span>›</span>` : `<span aria-current="page">${esc(n)}</span>`)).join('')}</nav>

<section class="pf-hero tr-hero">
  <div class="wrap pf-grid">
    <div class="pf-copy">
      <span class="eyebrow">${esc(cat.nume)}</span>
      <h1>${titleHtml}</h1>
      <p class="lede">${esc(lede)}</p>
      ${facts.length ? `<div class="pf-facts tr-facts">${facts.map((f) => `<div><b>${esc(f.v)}</b><span>${esc(f.l)}</span></div>`).join('')}</div>` : ''}
      <div class="hero-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(nod.nume)}">Programează-te</a><a class="btn btn-line" href="#preturi">Vezi prețurile</a></div>
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
  ${howBl.length > 1 ? `<div class="wrap tr-more pf-prose${trBlocks(howBl.slice(1)).replace(/<[^>]+>/g, '').length > 260 ? ' tr-cols' : ''}" id="tr-more-${esc(id)}" hidden>${trBlocks(howBl.slice(1))}</div>` : ''}
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
    <div class="tr-faq tr-acc">${info.map((x, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(x.titlu)}</summary><div class="pf-prose${trBlocks(x.blocuri).replace(/<[^>]+>/g, '').length > 260 ? ' tr-cols' : ''}">${trBlocks(x.blocuri)}</div></details>`).join('')}</div>
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
      const rows = [...s.preturi].sort((a, b) => (a.valoare ?? 1e9) - (b.valoare ?? 1e9)).map((p) => `<tr><td>${esc(p.nume)}${p.subgrup ? `<small class="tr-psub">${esc(cap(p.subgrup.toLowerCase()))}</small>` : ''}</td><td>${p.valoare != null ? lei(p.valoare) : 'la consultație'}</td></tr>`);
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
  const priceCell = (p) => `<span class="pr-p">${p.tip && p.tip !== 'preț' ? `<small>${esc(cap(p.tip))}</small>` : ''}${p.valoare != null ? `<b>${lei(p.valoare)}</b>` : `<b>${esc(p.text)}</b>`}${p.pretInitial ? `<s>${lei(p.pretInitial)}</s>` : ''}</span>`;
  let nRows = 0;
  const catHtml = PR_GRUPURI.map(([grup, cs]) => cs.filter(([c]) => catOf.has(c)).map(([c, nume]) => {
    const cat = catOf.get(c);
    const ids = cat.servicii.map((x) => rowServ.get(`${c}|${x.nume}`)).filter(Boolean);
    const top = ids.sort((a, b) => ids.filter((x) => x === b).length - ids.filter((x) => x === a).length)[0];
    const topHref = top && live(top).startsWith('/nou') ? live(top) : null;
    let lastSub = null;
    const rows = cat.servicii.map((x) => {
      nRows++;
      const id = rowServ.get(`${c}|${x.nume}`);
      const href = id && live(id).startsWith('/nou') && id !== top ? live(id) : null;
      const sub = x.subgrup && x.subgrup !== lastSub ? `<h4 class="pr-sub">${esc(cap(x.subgrup.toLowerCase()))}</h4>` : '';
      lastSub = x.subgrup || lastSub;
      return `${sub}<div class="pr-row"><span class="pr-n">${href ? `<a href="${esc(href)}">${esc(x.nume)}</a>` : esc(x.nume)}</span><span class="pr-ps">${(x.preturi || []).map(priceCell).join('')}</span></div>`;
    }).join('');
    return `<section class="pr-cat" id="${slugPr(nume)}" data-nume="${esc(nume)} ${esc(grup)}">
      <div class="pr-cat-h"><div><small>${esc(grup)}</small><h2>${esc(nume)}</h2></div>${c === 'CONSULTAȚII' && consHub ? '<a class="link-u" href="/nou/consultatii/">Toate consultațiile →</a>' : topHref ? `<a class="link-u" href="${esc(topHref)}">Despre tratament →</a>` : ''}</div>
      <div class="pr-rows">${rows}</div>
    </section>`;
  }).join('')).join('');
  const offGroups = [...new Set(D.oferte.map((o) => o.grup))];
  const offName = (o) => offerLabel(o.nume);
  const offHtml = D.oferte.length ? `<section class="sec pr-offers" id="oferte" style="background:var(--cream)">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Oferte</span><h2 style="margin-top:18px">Ofertele <em>lunii</em></h2></div><p class="lede">${D.oferte.length} oferte active. Alege una și te sunăm noi pentru programare.</p></div>
    <div class="pr-olist">${offGroups.map((g) => `<div class="pr-og-block"><h3 class="pr-og">${esc(g === 'OFERTELE LUNII' ? 'Ofertele lunii' : offerGroup(g))}</h3>${D.oferte.filter((o) => o.grup === g).map((o) => `<a class="pr-orow" href="#programare" data-srv="${esc(`Ofertă: ${offName(o)} – ${lei(o.pret)}`)}"><span class="pr-orow-n"><b>${esc(offName(o))}</b>${o.detalii ? `<small>${esc(offerLabel(o.detalii))}</small>` : ''}</span>${o.discountProcent ? `<span class="off">−${o.discountProcent}%</span>` : ''}<span class="pr-off-p">${o.pretInitial ? `<s>${lei(o.pretInitial)}</s>` : ''}<em>${lei(o.pret)}</em></span></a>`).join('')}</div>`).join('')}</div>
  </div>
</section>` : '';
  const pageUrl = ORIGIN + '/preturi/';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': pageUrl + '#webpage', url: pageUrl, name: 'Prețuri | MOA Clinic', inLanguage: 'ro-RO', mainEntity: { '@id': pageUrl + '#catalog' } },
      { '@type': 'OfferCatalog', '@id': pageUrl + '#catalog', name: 'Lista de prețuri MOA Clinic', itemListElement: D.preturi.map((c) => ({ '@type': 'OfferCatalog', name: c.categorie, itemListElement: c.servicii.filter((x) => x.preturi?.[0]?.valoare != null).map((x) => ({ '@type': 'Offer', name: x.nume, price: x.preturi[0].valoare, priceCurrency: 'RON', seller: { '@id': `${ORIGIN}/#organization` } })) })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Acasă', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: 'Prețuri', item: pageUrl }] },
    ],
  };
  const tocCats = PR_GRUPURI.flatMap(([, cs]) => cs.filter(([c]) => catOf.has(c)).map(([, nume]) => nume));
  const page = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prețuri MOA Clinic București – lista completă | MOA Clinic</title>
<meta name="description" content="${esc(`Lista de prețuri MOA Clinic: ${nRows} prețuri în ${D.preturi.length} categorii – consultații, toxină botulinică, acid hialuronic, epilare Splendor X, Venus Viva, terapii intravenoase și altele. Plus ofertele lunii.`)}">
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
    <div class="sec-head split"><div><span class="eyebrow">Prețuri</span><h1 style="margin-top:18px">Lista de <em>prețuri</em></h1></div>
      <p class="lede">${nRows} de prețuri în ${D.preturi.length} categorii, din lista oficială MOA Clinic. Pentru tratamente, medicul stabilește la consultație zonele, doza și numărul de ședințe.</p></div>
    <div class="pr-search"><label for="pr-q" class="sr">Caută în prețuri</label><span class="pr-in"><input id="pr-q" type="search" placeholder="Caută un tratament – ex. botox, epilare, NAD" autocomplete="off"><button type="button" id="pr-x" aria-label="Șterge căutarea">✕</button></span><span id="pr-count" aria-live="polite">${nRows} prețuri</span></div>
  </div>
</section>

<nav class="tr-toc" aria-label="Categorii de prețuri"><div class="wrap">${D.oferte.length ? '<a href="#oferte">Oferte</a>' : ''}${tocCats.map((n) => `<a href="#${slugPr(n)}">${esc(n)}</a>`).join('')}</div></nav>

${offHtml}

<section class="sec pr-list">
  <div class="wrap">
    ${catHtml}
    <p class="pr-empty" id="pr-empty" hidden>Nu am găsit niciun preț. Încearcă alt cuvânt sau <a class="lede-link" href="#programare">întreabă-ne direct</a>.</p>
    <p class="pr-note">Prețurile sunt în lei, din lista oficială a clinicii.</p>
  </div>
</section>

${BOOK}
<script src="/nou/preturi.js" defer></script>
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
    <div class="vp-grid">${vids.map(({ v, cat, nume, href }) => `<div class="v-card vp-card${VM[v.id]?.orientare === 'orizontal' ? ' wide' : ''}" data-vcat="${esc(cat)}"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește: ${esc(vTitle(v))}"><span>▶</span></button>${vDur(v) ? `<i class="vp-dur">${vDur(v)}</i>` : ''}</div>
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
    const h2s = blocks.filter((b) => b.t === 'h2').map((b) => ({ x: b.x, id: slugH(b.x) }));
    const minute = Math.max(2, Math.round((a.cuvinte || 0) / 200));
    const autor = team.find((p) => p.nume === a.autor);
    const pr = autor?.profil_detaliat;
    const rel = artTr(a);
    const relCard = rel ? `<a class="ar-rel" href="${esc(live(rel.sid))}"><small>Tratamentul despre care citești</small><b>${esc(rel.l.nod.nume)}</b><span>${esc(rel.l.cat.nume)}</span>${minPrice(rel.sid) ? `<em>de la ${lei(minPrice(rel.sid))}</em>` : ''}<i>Vezi tratamentul →</i></a>` : '';
    const body = blocks.map((b, i) => {
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
    if (relCard && firstH2 > 0) body.splice(firstH2, 0, `<div class="ar-rel-inline">${relCard}</div>`);
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
    ${rezArt(a, blocks) === rez(a).replace(/\s*[-–]\s*\.$/, '.').trim() ? `<p class="lede">${esc(rezArt(a, blocks))}</p>` : ''}
    <div class="bl-author ar-author">${autor && photos[autor.nume] ? `<img src="${esc(resized(photos[autor.nume]))}" alt="">` : ''}<span><b>${autor?.profil_detaliat ? `<a href="/nou/medici/${esc(autor.id)}/">${esc(a.autor)}</a>` : esc(a.autor)}</b><span class="bl-meta">${esc(autor?.rol || '')}${autor?.rol ? '<i>·</i>' : ''}${esc(dataRo(a.data))}<i>·</i>${minute} min de citit</span></span></div>
  </div>
  ${heroImg ? `<div class="wrap"><figure class="ar-hero"><img src="${esc(heroImg.src)}" alt="${esc(heroImg.alt || a.titlu)}" fetchpriority="high"></figure></div>` : ''}
</header>

<section class="ar-main">
  <div class="wrap ar-grid">
    <article class="ar-body">
      ${tocHtml ? `<details class="ar-toc-m ar-m"><summary><small>Cuprins</small><span>${h2s.length} secțiuni</span></summary><nav aria-label="Cuprins">${tocHtml}</nav></details>` : ''}
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
  };
  addEventListener('scroll', on, { passive: true }); on();
  // pe mobil cuprinsul se închide după alegerea unei secțiuni
  const m = document.querySelector('.ar-toc-m');
  if (m) m.addEventListener('click', (e) => { if (e.target.closest('a')) m.open = false; });
})();
</script>
${BOTTOM}`;
    const dir = path.join(ROOT, 'nou', slug);
    fs.mkdirSync(dir, { recursive: true });
    writePage(path.join(dir, 'index.html'), page);
    console.log(`Articol: nou/${slug}/ · ${blocks.length} blocuri · ${h2s.length} secțiuni · tratament: ${rel ? rel.l.nod.nume : '–'} · ${related.length} înrudite`);
  }
}
