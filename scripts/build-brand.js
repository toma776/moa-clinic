// Construiește mini brand book-ul MOA (data/brand.json) din site: culori și fonturi din CSS, logo-uri, CTA-uri,
// adresare și vocabular numărate în toate paginile, plus observațiile curatoriate.
// Nu suprascrie un brand.json existent (editat din panou) decât cu --force.
// Rulare: npm run brand  [-- --force]
const fs = require('fs');
const path = require('path');
const { ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'brand.json');
if (fs.existsSync(OUT) && !process.argv.includes('--force')) {
  console.log('data/brand.json există deja (posibil editat din panou). Folosește --force ca să-l regenerezi.');
  process.exit(0);
}
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const SRC = fs.readdirSync(path.join(ROOT, 'source', 'site')).map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'source', 'site', f), 'utf8')));
const html = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8');
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const all = norm(SRC.map((s) => s.text).join(' '));
const count = (re) => (all.match(re) || []).length;
const U = (p) => ORIGIN + p;

// CSS: culori și fonturi folosite de temă
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
const colorCount = (hex) => (css.match(new RegExp(hex.replace('#', '#?'), 'gi')) || []).length;

// CTA-uri: apariții și pagini
const cta = {};
for (const s of SRC) for (const t of s.cta.map((c) => c.replace(/&rarr;/g, '→'))) {
  cta[t] ||= { aparitii: 0, pagini: new Set() };
  cta[t].aparitii++;
  cta[t].pagini.add(s.path);
}
const ctaNote = (t) => (/^programeaza/.test(t) ? 'literă mică, fără diacritice' : /programeaza-te!/i.test(t) ? 'fără diacritice, cu „!”' : /continue reading/i.test(t) ? 'în engleză' : '');

const tu = count(/\b(tine|tie|tau|ta|tale|iti|te)\b/g);
const dvs = count(/\b(dumneavoastra|dvs)\b/g);
const VOCAB = ['regenerare', 'antiaging', 'longevitate', 'personalizat', 'natural', 'siguranta', 'premium', 'rezultate', 'tratament', 'clinica', 'colagen', 'hidratare', 'reintinerire', 'expertiza'];

const B = {
  meta: {
    sursa: `${ORIGIN}/ (CSS-ul temei, logo-urile, textul celor ${SRC.length} pagini din sitemap)`,
    extras_la: new Date().toISOString().slice(0, 10),
    tema: 'WordPress, tema Flatsome, Rank Math SEO',
    nota: '„Găsit pe site” = ce folosește site-ul azi. „Recomandare” = propunere de aliniere. Toate secțiunile se pot edita din panou.',
  },
  esenta: {
    nume: 'MOA Clinic',
    denumire_legala: D.legal.firme.map((f) => f.nume).join(' · '),
    categorie: 'Clinică de estetică medicală, chirurgie plastică și medicină regenerativă (antiaging)',
    tagline: 'Frumusețea vine din interior și se desăvârșește la exterior',
    tagline_nota: 'Apare ca titlu de secțiune pe homepage. Brandul nu are un slogan declarat în schema (slogan lipsește).',
    pozitionare_recomandata: 'Prima clinică Global Antiaging din România: estetică, chirurgie și regenerare celulară, sub coordonarea unui medic gerontolog din școala Ana Aslan.',
    pozitionare_variante: [
      { text: 'Clinica ta premium pentru estetică din București, chirurgie și regenerare celulară', unde: 'meta description homepage + schema' },
      { text: 'Prima clinică Global Antiaging din România', unde: 'homepage, primul paragraf' },
      { text: 'Un concept în care vârsta nu va mai avea nicio importanță', unde: 'homepage' },
      { text: 'Estetică, Chirurgie si Regenerare Celulara | Bucuresti', unde: 'title homepage (fără diacritice)' },
    ],
    promisiune: D.brand.propunere_valoare,
    valori: [
      { nume: 'Naturalețe', dovada: '„rezultate estetice naturale” (homepage), „punem accent pe naturalețe și siguranță” (pagini de proceduri)' },
      { nume: 'Siguranță', dovada: '„siguranța pacientului este prioritatea absolută” – apare pe paginile de proceduri injectabile' },
      { nume: 'Personalizare', dovada: '„fiecare pacient primește un plan personalizat” – formulă repetată pe paginile de servicii' },
      { nume: 'Inovație', dovada: 'aparatură de ultimă generație, terapii regenerative, „tehnologie revoluționară”' },
    ],
    dovezi: D.dovezi.cifre.filter((c) => c.verificat).map((c) => `${c.valoare} – ${c.eticheta}`),
    public: ['Femei 30+ interesate de estetică facială', 'Bărbați (epilare, augmentare, Botox)', 'Pacienți antiaging / longevitate', 'Persoane cu burnout, depresie, anxietate (TMS)', 'Pacienți dermatologie (nevi, papiloame)', 'București și împrejurimi'],
    oameni: [{ nume: 'Dr. Adrian Stănescu', rol: 'Fondator, medic primar gerontolog, director medical, coordonator departament TMS' }],
    vechime: {
      gasit: ['„un vis de peste 25 de ani” – al fondatorului (homepage)', 'site publicat în ' + (D.brand.dataPublicareSite || '').slice(0, 7), D.legal.firme[0]?.registru ? `înregistrare ${D.legal.firme[0].nume}: ${D.legal.firme[0].registru}` : ''].filter(Boolean),
      fapt: 'Site-ul nu declară un an de înființare a clinicii. Firma Start Clinic Boost SRL e înregistrată în 2022.',
    },
  },
  logo: {
    descriere: 'Monogramă din literele M, O și A suprapuse, cu linii subțiri, aurii (logo-ul de pe fundal deschis) sau albe (header-ul site-ului, pe fundal închis).',
    variante: [
      { nume: 'Logo complet alb (header)', url: U('/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg'), dimensiuni: 'SVG 1492×2434', fundal: 'închis', folosit: 'Header-ul site-ului (alt „Moa Clinica”), schema MedicalClinic custom' },
      { nume: 'Monogramă aurie', url: U('/wp-content/uploads/2024/09/Instagram-logo.png'), dimensiuni: 'PNG 1338×1658', fundal: 'deschis', folosit: 'Logo în schema Rank Math, imagine de profil Instagram' },
      { nume: 'Favicon', url: U('/wp-content/uploads/2024/09/cropped-Instagram-logo-192x192.png'), dimensiuni: 'PNG 32 / 180 / 192 / 270', fundal: 'alb', folosit: 'Iconița din browser și de pe telefon' },
    ],
    culori: ['#947547', '#ffffff'],
    probleme: [
      'Logo-ul din schema Rank Math se numește „Instagram-logo.png” – un fișier de social media folosit ca logo oficial.',
      'Textul alternativ al logo-ului din header e „Moa Clinica”, altă formă a numelui.',
      'Nu există o variantă orizontală a logo-ului (monograma e foarte înaltă: 1492×2434).',
      'Lipsește o variantă aurie în SVG (doar PNG).',
    ],
  },
  culori: [
    { grup: 'Paleta brandului', culori: [
      { nume: 'Auriu MOA', hex: '#947547', rol: 'Culoarea principală: fundaluri de secțiune, hover pe butoane, logo', gasit: `CSS temă · ${colorCount('#947547') + colorCount('rgb\\(148,\\s*117,\\s*71\\)')} folosiri` },
      { nume: 'Bronz închis', hex: '#a98755', rol: 'Rânduri de titlu în tabelele de prețuri', gasit: 'pagina /preturi/' },
      { nume: 'Ocru (hover)', hex: '#bd871f', rol: 'Conturul butoanelor la hover', gasit: `CSS temă · ${colorCount('#bd871f')} folosiri` },
      { nume: 'Crem', hex: '#fff8ee', rol: 'Fundaluri calde de secțiune', gasit: `CSS temă · ${colorCount('#fff8ee')} folosiri` },
    ] },
    { grup: 'Neutre', culori: [
      { nume: 'Antracit', hex: '#1f2020', rol: 'Fundal închis, text principal', gasit: `CSS temă · ${colorCount('#1f2020') + colorCount('rgb\\(31,\\s*32,\\s*32\\)')} folosiri` },
      { nume: 'Alb', hex: '#ffffff', rol: 'Text pe fundal auriu / închis, logo', gasit: 'CSS temă' },
      { nume: 'Negru', hex: '#000000', rol: 'Textul butoanelor', gasit: 'CSS .button' },
    ] },
    { grup: 'Accente de sistem', culori: [
      { nume: 'Roșu „alert”', hex: '#dd3333', rol: 'Clasa „alert” a butonului Programează-te (tema Flatsome)', gasit: `CSS temă · ${colorCount('#dd3333')} folosiri` },
    ] },
  ],
  tipografie: {
    fonturi: [
      { nume: 'Montserrat', set: 'Site actual', tip: 'text', greutati: '400, 500, 600, 700', rol: 'Tot textul: titluri, paragrafe, meniu, butoane', fallback: 'sans-serif', sursa: 'găzduit local (wp-content/fonts/montserrat)', google: 'Montserrat:wght@400;500;600;700' },
      { nume: 'Dancing Script', set: 'Site actual', tip: 'titluri', greutati: '400–700', rol: 'Accente decorative (scris de mână)', fallback: 'cursive', sursa: 'găzduit local (wp-content/fonts/dancing-script)', google: 'Dancing+Script:wght@400;700' },
      { nume: 'Cormorant Garamond', set: 'Recomandare', tip: 'titluri', greutati: '500, 600', rol: 'Serif elegant pentru titluri, în ton cu monograma cu linii subțiri', fallback: 'Georgia, serif', sursa: 'Google Fonts', google: 'Cormorant+Garamond:wght@500;600' },
    ],
    baza: '16 px (tema Flatsome), Montserrat',
    scara: [
      { nivel: 'H1', rem: 2.4, px: 38 },
      { nivel: 'H2', rem: 1.8, px: 29 },
      { nivel: 'H3', rem: 1.4, px: 22 },
      { nivel: 'H4', rem: 1.2, px: 19 },
      { nivel: 'Text', rem: 1, px: 16 },
      { nivel: 'Mic', rem: 0.85, px: 14 },
    ],
    nota: 'Un singur font (Montserrat) face tot; Dancing Script apare rar. O pereche serif + sans ar comunica mai bine „premium”.',
    site: { titluri: 'Montserrat', text: 'Montserrat', nota: 'Fonturile folosite acum pe site.' },
  },
  ui: {
    butoane: [
      { nume: 'Contur (principal)', bg: '#ffffff', text: '#000000', hover: '#947547', exemplu: 'Programează-te', folosit: 'Butonul din header și din fiecare secțiune' },
      { nume: 'Contur pe fundal închis', bg: '#1f2020', text: '#ffffff', hover: '#947547', exemplu: 'Vezi detalii', folosit: 'Acordeoanele de pe homepage' },
      { nume: 'Plin auriu', bg: '#947547', text: '#ffffff', hover: '#bd871f', exemplu: 'Vezi toate ofertele MOA', folosit: 'Secțiunea de oferte' },
    ],
    stil_butoane: 'Formă de pastilă (border-radius 99px), contur de 1px, text 16px greutate 500, padding .5rem 2rem, tranziție 0,5 s.',
    iconite: { set: 'Font Awesome 6 + fl-icons (Flatsome)', folosite: ['fa-phone', 'fa-envelope', 'fa-location-dot', 'fa-facebook', 'fa-instagram', 'fa-whatsapp', 'fa-chevron-right', 'fa-chevron-up'] },
    componente: [
      'Header transparent peste video (Moa-Clinic-hero.mp4), logo alb centrat',
      'Acordeoane „Vezi detalii” pe fundal închis, pentru tehnologii și terapii',
      'Carduri de proceduri cu imagine (4 categorii pe homepage)',
      'Widget de recenzii Google (Trustindex) cu insignă verificată',
      'Buton WhatsApp flotant',
      'Tabele de prețuri în acordeon pe /preturi/',
    ],
  },
  imagini: {
    stiluri: [
      { nume: 'Clinica și echipa', descriere: 'Fotografii reale din clinică și portrete ale medicilor, verticale, lumină caldă.', exemple: D.media.filter((m) => /clinica|whatsapp/i.test(m.fisier)).slice(0, 4).map((m) => U(m.fisier)) },
      { nume: 'Pictograme aurii', descriere: 'Iconițe albe/aurii pentru cele 4 categorii de proceduri.', exemple: ['/1.svg', '/2.svg', '/3.svg'].map((f) => U('/wp-content/uploads/2024/09' + f)) },
    ],
    reguli_gasite: ['Video de fundal în hero', 'Portrete medici în format vertical', 'Imagini încărcate leneș (lazy load) și servite WebP de EWWW'],
    probleme: [
      `${D.media.filter((m) => !m.alt).length} din ${D.media.length} imagini de pe homepage nu au text alternativ.`,
      'Multe fișiere au nume generice („WhatsApp-Image-2024-10-09…”, „image00002”) – nu descriu conținutul.',
      'Portretul Dr. Irina Amolioaie e salvat ca „dr-irina-amolioaiei”.',
    ],
  },
  voce: {
    adresare: {
      gasit: `Predominant „tu” (${tu} apariții de tine/ție/tău/te) față de ${dvs} de „dumneavoastră/dvs.”`,
      recomandare: '„Tu”, cald și liniștitor, peste tot. „Dumneavoastră” doar în documentele legale.',
    },
    ton: [
      'Entuziast, uneori promoțional („tratament revoluționar”, „rezultate uimitoare”)',
      'Liniștitor despre siguranță („siguranța pacientului este prioritatea absolută”)',
      'Educativ pe blog: explică problema, apoi soluția',
      'Medical-științific la terapiile regenerative (sirtuine, radicali liberi, vârstă biologică)',
    ],
    fraze_semnatura: [
      'Frumusețea vine din interior și se desăvârșește la exterior',
      'Un concept în care vârsta nu va mai avea nicio importanță',
      'Te-ai gândit vreodată că secretul longevității ar putea sta, de fapt, în tine?',
      'Rezultate estetice naturale și îngrijire de specialitate',
    ],
    vocabular: VOCAB.map((v) => ({ v, n: count(new RegExp(`\\b${v}`, 'g')) })).sort((a, b) => b.n - a.n).slice(0, 10).map((x) => `${x.v} (${x.n})`),
    cta: Object.entries(cta).sort((a, b) => b[1].aparitii - a[1].aparitii).slice(0, 10).map(([text, v]) => ({ text, aparitii: v.aparitii, pagini: v.pagini.size, nota: ctaNote(text) })),
    cta_recomandat: ['Programează-te', 'Vezi detalii', 'Vezi prețurile', 'Vezi ofertele lunii', 'Citește articolul'],
  },
  naming: {
    corect: 'MOA Clinic',
    legal: D.legal.firme.map((f) => f.nume).join(' · '),
    variante_gasite: D.brand.variante.concat(['Moa Clinica', 'Clinica MOA', 'MOA Regenerative', 'Moa Regenerative by Oxxygene']).filter((v, i, a) => a.indexOf(v) === i),
    reguli: [
      '„MOA Clinic” în text curent; „MOA Regenerative by Oxxygene” doar ca nume complet (prima mențiune, schema, documente)',
      'MOA întotdeauna cu majuscule (e o monogramă)',
      '„by Oxxygene” nu se traduce și nu se scrie „Oxygene”',
    ],
  },
  contact: {
    legal: D.legal.firme.flatMap((f) => [
      { camp: f.nume, valoare: f.adresa },
      ...(f.cui ? [{ camp: 'CUI', valoare: f.cui }] : []),
      ...(f.registru ? [{ camp: 'Registrul Comerțului', valoare: f.registru }] : []),
    ]),
    canale: [
      { rol: 'Programări', telefon: '0743 056 605', email: 'office@moaclinic.ro' },
      { rol: 'Contact general', telefon: '0743 056 605', email: 'contact@moaclinic.ro' },
      { rol: 'Documente legale (GDPR)', telefon: '0743 056 605', email: D.legal.firme.find((f) => f.email)?.email || '—' },
    ],
    program: 'Neclar: schema declară Lu–Du 09:00–17:00 și Lu–Vi 09:00–19:00',
    raspuns: 'Nedeclarat pe site',
    social: D.social.map((s) => ({ retea: s.retea, url: s.url })),
  },
  parteneri: {
    nota: 'Mărcile ale căror produse și aparate apar pe site. Brandul părinte: Oxxygene.',
    logo: [
      { nume: 'Oxxygene', url: U('/wp-content/uploads/2024/09/Instagram-logo.png'), nota: 'brand părinte – fără logo propriu pe site' },
      ...D.tehnologii.filter((t) => t.producator).map((t) => ({ nume: t.nume, url: '', nota: t.producator })),
    ],
  },
  inconsecvente: D.observatii.filter((o) => /nume|logo|cta|legal|telefon|program|facebook|amolioaie/.test(o.id)).map((o) => ({ nivel: o.nivel, text: o.text })),
};

fs.writeFileSync(OUT, JSON.stringify(B, null, 2));
console.log(`Gata: data/brand.json · ${B.culori.reduce((n, g) => n + g.culori.length, 0)} culori · ${B.voce.cta.length} CTA-uri · ${B.inconsecvente.length} inconsecvențe`);
