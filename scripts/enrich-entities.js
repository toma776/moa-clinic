// Îmbogățește data/entitati.json cu tot ce vine din crawl (source/site/*.json + data/pages.json):
// pe ce pagini apare fiecare entitate, servicii cu detalii, articole pe tipuri, glosar, întrebări frecvente,
// dovezi, media, date legale și observații SEO cu reguli de verificare.
// Rulare: npm run enrich   (după npm run crawl și npm run extract)
const fs = require('fs');
const path = require('path');
const { ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data', 'entitati.json');
const D = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const PAGES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'pages.json'), 'utf8'));
const SRC = fs.readdirSync(path.join(ROOT, 'source', 'site')).map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'source', 'site', f), 'utf8')));

// ---------- helpers ----------
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const reOf = (alias) => new RegExp(`(^|[^a-z0-9])${esc(norm(alias))}`);
const byPath = new Map(SRC.map((s) => [s.path, s]));
const corpusOf = (s) => norm(`${s.title} ${s.h1} ${s.text}`);
const CORPUS = SRC.map((s) => ({ s, t: corpusOf(s) }));
const pagesWith = (aliases) => CORPUS.filter(({ t }) => aliases.some((a) => reOf(a).test(t))).map(({ s }) => s.url);
const mentions = (text, list) => list.filter((e) => e.alias.some((a) => reOf(a).test(norm(text)))).map((e) => e.key);
const uniq = (a) => [...new Set(a)];
const home = byPath.get('/');

// ---------- aliasuri ----------
const SERVICE_ALIAS = {
  'consultatie-antiaging': ['consultatie antiaging', 'consultatia antiaging', 'consultatie anti-aging'],
  'consultatie-chirurgie-plastica': ['consultatie chirurgie plastica', 'consultatie de chirurgie plastica'],
  'consultatie-dermatoestetica-dermatologie': ['consultatie dermatoestetica', 'consultatie dermatologie', 'consultatie estetica'],
  'consultatie-nutritie-antiaging-nutrigenomica': ['nutrigenomic', 'nutritie antiaging'],
  'fotobiomodulare-vielight': ['vielight', 'fotobiomodulare'],
  'tms-stimulare-magnetica-transcraniana': ['stimulare magnetica transcraniana', 'tms'],
  'eliminare-papiloame': ['papiloam', 'papilom'],
  'nevi-pigmentari': ['nevi pigmentari', 'nev pigmentar', 'alunite', 'alunita'],
  blefaroplastie: ['blefaroplasti'],
  'injectari-acid-hialuronic': ['injectari cu acid hialuronic', 'injectari acid hialuronic', 'injectare cu acid hialuronic', 'umplere riduri', 'filler'],
  'jalupro-young-eye': ['jalupro'],
  'augmentare-buze': ['augmentare buze', 'augmentarea buzelor', 'acid hialuronic in buze', 'volum buze', 'contur buze'],
  mezoterapie: ['mezoterapie'],
  'prp-scalp': ['prp', 'terapia vampir', 'terapie vampir'],
  microneedeling: ['microneedling', 'dermapen'],
  'injectare-botox': ['botox', 'toxina botulinica'],
  'skinbooster-vital': ['skinbooster', 'skin booster'],
  sculptra: ['sculptra'],
  harmonyca: ['harmonyca'],
  'nefertiti-lift': ['nefertiti'],
  'hiperhidroza-axilara': ['hiperhidroz', 'transpiratie excesiva'],
  'marirea-penisului-acid-hialuronic': ['augmentare peniana', 'marirea penisului', 'augmentare penis'],
  polinucleotide: ['polinucleotide', 'rejuran'],
  'venus-viva': ['venus viva'],
  'lip-lifting': ['lip lift'],
  dermalinfusion: ['dermalinfusion'],
  autohemoterapia: ['autohemoterapi'],
  'sauna-cu-ozon': ['sauna cu ozon'],
  glutation: ['glutation'],
  'terapia-nad': ['nad+', 'terapia nad', 'nadh'],
  'epilare-definitiva-bucuresti': ['epilare definitiv', 'epilare laser', 'epilat'],
  'laser-vascular': ['laser vascular'],
  'venus-legacy': ['venus legacy'],
  'skin-care-dna': ['dna skin', 'skin care dna'],
  'nutrigenetica-epigenetica': ['nutrigenetic', 'epigenetic'],
};
const lastSeg = (u) => new URL(u).pathname.split('/').filter(Boolean).pop() || '';

// ---------- servicii (din meniu) ----------
const servicii = [];
for (const cat of D.categoriiServicii) {
  const leaves = cat.copii?.length ? cat.copii : [cat];
  for (const s of leaves) {
    if (!s.url || servicii.some((x) => x.url === s.url)) continue;
    const id = lastSeg(s.url);
    const alias = SERVICE_ALIAS[id] || [norm(s.nume).replace(/\s+[–-].*$/, '').trim()];
    servicii.push({ id, nume: s.nume.replace(/\s+–\s+.*$/, ''), categorie: cat.nume, url: s.url, alias });
  }
}
const echipaAlias = D.echipa.map((p) => {
  const n = p.nume.replace(/^Dr\.\s*/, '');
  const parts = n.split(/\s+/);
  const alias = [n];
  const last = parts.at(-1);
  if (last.length > 5 && !/^matei$/i.test(last)) alias.push(last);
  if (/Amolioaie/.test(n)) alias.push('amolioaiei');
  return { key: p.nume, alias };
});
const techAlias = D.tehnologii.map((t) => ({ key: t.nume, alias: { 'Splendor X': ['splendor'], 'Venus Viva': ['venus viva'], 'Venus Legacy': ['venus legacy'], Dermalinfusion: ['dermalinfusion'], 'Dermapen 4': ['dermapen'], Vielight: ['vielight'], TMS: ['stimulare magnetica transcraniana', 'tms'], 'Sauna cu ozon': ['sauna cu ozon'] }[t.nume] || [t.nume] }));
const prodAlias = D.produse.map((p) => ({ key: p.nume, alias: { 'Juvéderm': ['juvederm'], 'Profhilo Structura': ['profhilo'], NCTF: ['nctf', 'nctc'], 'PRX Plus': ['prx'] }[p.nume] || [p.nume] }));
const concAlias = (D.concepte || []).map((c) => ({ key: c.nume, alias: { 'Global Antiaging': ['global antiaging'], 'Medicină regenerativă': ['medicina regenerativa', 'terapii regenerative', 'terapiile regenerative'], 'Antiaging intern': ['antiaging intern'], Longevitate: ['longevit'], 'Vârstă biologică': ['varsta biologica', 'varstei biologice'], 'Terapii antioxidante': ['antioxidant'], Ozonoterapie: ['ozonoterapi'], 'Nutrigenomică & epigenetică': ['nutrigenomic', 'epigenetic'], Dermatoestetică: ['dermatoestetic'], Gerontologie: ['gerontolog'] }[c.nume] || [c.nume] }));
const servAlias = servicii.map((s) => ({ key: s.id, alias: s.alias }));

// pe ce pagini apare fiecare entitate
for (const p of D.echipa) p.surse = pagesWith(echipaAlias.find((x) => x.key === p.nume).alias);
for (const t of D.tehnologii) t.surse = pagesWith(techAlias.find((x) => x.key === t.nume).alias);
for (const t of D.produse) t.surse = pagesWith(prodAlias.find((x) => x.key === t.nume).alias);
for (const c of D.concepte || []) c.surse = pagesWith(concAlias.find((x) => x.key === c.nume).alias);

// prețurile fiecărui serviciu
const priceItems = D.preturi.flatMap((c) => c.servicii.map((s) => ({ ...s, categorie: c.categorie })));
const SPEC_SERV = {
  Gerontologie: ['Consultații', 'Ozonoterapie', 'Tratamente regenerative perfuzabile', 'STIMULARE MAGNETICĂ TRANSCRANIANĂ', 'TERAPIA VIELIGHT', 'TESTE GENETICE LONGEVITY'],
  'Chirurgie plastică': ['Proceduri microchirurgicale', 'Proceduri minim-invazive'],
  Dermatovenerologie: ['Proceduri minim-invazive', 'Proceduri microchirurgicale', 'Rejuvenare facială'],
  'Estetică facială și corporală': ['Tratamente cosmetologice', 'Tratamente corporale', 'Rejuvenare facială'],
};
for (const s of servicii) {
  const page = byPath.get(new URL(s.url).pathname);
  const pg = PAGES.pages.find((p) => p.url === s.url);
  const txt = page ? `${page.title} ${page.text}` : '';
  Object.assign(s, {
    h1: page?.h1 || null,
    descriere: page?.description || null,
    cuvinte: pg?.cuvinte ?? null,
    status: pg?.status ?? null,
    intrebari: page?.intrebari.length || 0,
    tehnologii: mentions(txt, techAlias),
    produse: mentions(txt, prodAlias),
    concepte: mentions(txt, concAlias),
    echipa: mentions(txt, echipaAlias),
    preturi: priceItems
      .filter((i) => s.alias.some((a) => reOf(a).test(norm(`${i.categorie} ${i.subgrup || ''} ${i.nume}`))))
      .map((i) => ({ nume: i.nume, categorie: i.categorie, valoare: i.preturi[0]?.valoare ?? null })),
    surse: pagesWith(s.alias),
  });
  s.medici = D.echipa.filter((p) => p.tip === 'Medic' && (SPEC_SERV[p.specialitate] || []).includes(s.categorie)).map((p) => p.nume);
  delete s.alias;
}
for (const t of D.tehnologii) t.servicii = servicii.filter((s) => s.tehnologii.includes(t.nume)).map((s) => s.id);
for (const t of D.produse) t.servicii = servicii.filter((s) => s.produse.includes(t.nume)).map((s) => s.id);
for (const p of D.echipa) p.servicii = servicii.filter((s) => s.echipa.includes(p.nume)).map((s) => s.id);
D.servicii = servicii;

// ---------- articole pe tipuri ----------
D.criterii_tip_articol = {
  ghid: 'Explică o problemă sau un concept: ce este, ce înseamnă, unde se face, cum alegi.',
  tratament: 'Pornește de la o problemă concretă (riduri, cearcăne, burnout) și prezintă soluțiile clinicii.',
  îngrijire: 'Ce faci înainte și după o procedură: recomandări, ce nu e permis, recuperare, cât durează efectul.',
  comparație: 'Pune față în față variante: produse, tehnici, forme, „cea mai bună”.',
  opinii: 'Păreri, mituri și adevăruri, efecte și exagerări despre o procedură.',
};
const ART_RULES = [
  ['comparație', /\bvs\b|diferen|cea mai buna|forme de/, 'titlul compară variante'],
  ['îngrijire', /\bdupa\b|recomandari|ce nu e permis|recuperare|cat dureaza|de ce nu/, 'titlul vorbește despre ce urmează după procedură'],
  ['opinii', /pareri|adevarul|exagerat|\befecte\b/, 'titlul cere păreri sau demontează mituri'],
  ['tratament', /tratament|riduri|cearcane|pungi|ptoza|buze uscate|vergeturi|alunite|pori|bunny|infertil|burnout|fumatorului/, 'titlul pornește de la o problemă de rezolvat'],
];
const allEntities = [...servAlias.map((x) => ({ ...x, label: servicii.find((s) => s.id === x.key).nume })), ...techAlias, ...prodAlias, ...concAlias, ...echipaAlias];
D.articole = SRC.filter((s) => s.tip === 'Articol').map((s) => {
  const t = norm(s.h1 || s.title);
  const rule = ART_RULES.find(([, re]) => re.test(t));
  const ents = uniq(allEntities.filter((e) => e.alias.some((a) => reOf(a).test(norm(s.text)))).map((e) => e.label || e.key));
  const pg = PAGES.pages.find((p) => p.url === s.url);
  return {
    id: lastSeg(s.url),
    titlu: s.h1 || s.title.replace(/\s*[|-]\s*Moa.*$/i, ''),
    url: s.url,
    data: s.publicat,
    modificat: s.modificat,
    rezumat: s.description,
    autor: s.autor,
    tip: rule ? rule[0] : 'ghid',
    motiv_tip: rule ? rule[2] : 'conținut explicativ, fără o problemă sau o comparație în titlu',
    entitati: ents,
    cuvinte: pg?.cuvinte ?? null,
  };
}).sort((a, b) => (b.data || '').localeCompare(a.data || ''));

// ---------- glosar ----------
const GLOSAR = [
  ['Acid hialuronic', 'Proceduri injectabile', ['acid hialuronic', 'acidul hialuronic']],
  ['Toxină botulinică', 'Proceduri injectabile', ['toxina botulinica', 'botox']],
  ['Hialuronidază', 'Proceduri injectabile', ['hialuronidaz']],
  ['Skinbooster', 'Proceduri injectabile', ['skinbooster', 'skin booster']],
  ['Biostimulator', 'Proceduri injectabile', ['biostimula']],
  ['Polinucleotide', 'Proceduri injectabile', ['polinucleotide']],
  ['Exozomi', 'Proceduri injectabile', ['exozomi', 'exosomi']],
  ['Mezoterapie', 'Proceduri injectabile', ['mezoterapia', 'mezoterapie']],
  ['PRP (plasmă bogată în trombocite)', 'Proceduri injectabile', ['prp', 'plasma bogata']],
  ['Microneedling', 'Tehnologii', ['microneedling']],
  ['Radiofrecvență fracționată', 'Tehnologii', ['radiofrecventa fractionata', 'radiofrecventa']],
  ['Laser Alexandrite', 'Tehnologii', ['alexandrit']],
  ['Laser Nd:YAG', 'Tehnologii', ['nd:yag', 'nd yag']],
  ['Fotobiomodulare', 'Tehnologii', ['fotobiomodulare']],
  ['Stimulare magnetică transcraniană', 'Tehnologii', ['stimularea magnetica transcraniana', 'stimulare magnetica transcraniana']],
  ['Ozonoterapie', 'Terapii regenerative', ['ozonoterapia', 'ozonoterapie']],
  ['Autohemoterapie majoră', 'Terapii regenerative', ['autohemoterapia', 'autohemoterapie']],
  ['Glutation', 'Terapii regenerative', ['glutationul', 'glutation']],
  ['NAD+', 'Terapii regenerative', ['nad+', 'nad ']],
  ['Radicali liberi', 'Antiaging', ['radicalii liberi', 'radicali liberi']],
  ['Sirtuine', 'Antiaging', ['sirtuin']],
  ['Vârstă biologică', 'Antiaging', ['varsta biologica']],
  ['Nutrigenomică', 'Antiaging', ['nutrigenomica']],
  ['Epigenetică', 'Antiaging', ['epigenetica']],
  ['Blefaroplastie', 'Chirurgie & dermatologie', ['blefaroplastia', 'blefaroplastie']],
  ['Papilom', 'Chirurgie & dermatologie', ['papiloamele', 'papiloam', 'papilom']],
  ['Nev pigmentar', 'Chirurgie & dermatologie', ['nevii pigmentari', 'nev pigmentar', 'nevi pigmentari']],
  ['Hiperhidroză', 'Chirurgie & dermatologie', ['hiperhidroza']],
  ['Dermatoscopie', 'Chirurgie & dermatologie', ['dermatoscopi']],
];
const sentences = SRC.flatMap((s) => s.text.split(/(?<=[.!?])\s+/).map((t) => ({ t, s })));
D.glosar = GLOSAR.map(([nume, categorie, alias]) => {
  const defRe = (strict) => alias.map((a) => new RegExp(`${strict ? '^\\W*' : '(^|[^a-z0-9])'}${esc(norm(a))}[^.]{0,60}?\\b(este|reprezinta|sunt|se refera|inseamna)\\b`));
  const pick = (strict) => sentences
    .filter(({ t }) => t.length > 40 && t.length < 360 && !/\?/.test(t) && defRe(strict).some((re) => re.test(norm(t))))
    .sort((a, b) => (b.s.tip === 'Pagina') - (a.s.tip === 'Pagina') || a.t.length - b.t.length)[0];
  const def = pick(true) || pick(false);
  const surse = pagesWith(alias);
  return {
    nume,
    categorie,
    definitie: def ? def.t : null,
    sursa_definitie: def ? def.s.url : null,
    surse,
    articole: surse.filter((u) => D.articole.some((a) => a.url === u)),
  };
}).filter((g) => g.surse.length);

// ---------- întrebări frecvente (din titlurile-întrebare din conținut) ----------
const temaOf = (s) => (s.tip === 'Articol' ? 'Blog' : servicii.find((x) => x.url === s.url)?.categorie || 'General');
const qSeen = new Map();
for (const s of SRC) {
  for (const q of s.intrebari) {
    const k = norm(q.q).replace(/[^a-z0-9 ]/g, '').trim();
    if (qSeen.has(k)) {
      qSeen.get(k).pagini.push(s.path);
      continue;
    }
    qSeen.set(k, { q, s, pagini: [s.path] });
  }
}
D.intrebari = [...qSeen.values()].map(({ q, s, pagini }) => ({
  id: slug(q.q).slice(0, 60),
  tema: temaOf(s),
  status: 'propusă',
  intrebare: q.q,
  raspuns: q.a.length > 420 ? q.a.slice(0, 417).replace(/\s+\S*$/, '') + '…' : q.a,
  pagini: uniq(pagini),
  surse: uniq(pagini).map((p) => ORIGIN + p),
  legaturi: {
    servicii: mentions(`${q.q} ${q.a}`, servAlias),
    glosar: GLOSAR.filter(([, , al]) => al.some((a) => reOf(a).test(norm(`${q.q} ${q.a}`)))).map(([n]) => n),
    echipa: mentions(q.a, echipaAlias),
  },
})).sort((a, b) => a.tema.localeCompare(b.tema));

// ---------- dovezi ----------
const find = (re) => SRC.filter((s) => re.test(norm(s.text))).map((s) => s.url);
D.dovezi = {
  testimoniale: (D.reputatie?.exempleRecenzii || []).map((r) => ({
    persoana: r.autor,
    citat: r.text,
    medic: mentions(r.text, echipaAlias)[0] || null,
    platforma: 'Google (prin Trustindex)',
    sursa: ORIGIN + '/',
  })),
  cifre: [
    { valoare: String(D.reputatie?.trustindex?.recenzii ?? '—'), eticheta: 'recenzii Google, calificativ „EXCELENT” (widget Trustindex)', tip: 'cifră', surse: find(/pe baza a \d+ de recenzii/) },
    { valoare: D.reputatie?.rating?.ratingValue || '—', eticheta: `rating declarat în schema (${D.reputatie?.rating?.reviewCount} recenzii) – diferă de widget`, tip: 'cifră', surse: [ORIGIN + '/'] },
    { valoare: '25+ ani', eticheta: 'de când Dr. Adrian Stănescu urmărește conceptul MOA („un vis de peste 25 de ani”)', tip: 'cifră', surse: find(/peste 25 de ani/) },
    { valoare: 'Prima', eticheta: 'clinică Global Antiaging din România', tip: 'afirmație', surse: find(/prima clinica global antiaging/) },
    { valoare: '755 + 1064 nm', eticheta: 'Splendor X: „singurul laser din lume” care emite simultan ambele lungimi de undă', tip: 'afirmație', surse: find(/singurul laser din lume/) },
    { valoare: 'FDA', eticheta: 'aprobare menționată pentru Sculptra și pentru programele TMS', tip: 'afirmație', surse: find(/\bfda\b/) },
    { valoare: String(D.echipa.length), eticheta: 'oameni în echipă (homepage + /echipa/)', tip: 'cifră', surse: [ORIGIN + '/', ORIGIN + '/echipa/'] },
  ].map((c) => ({ ...c, verificat: c.surse.length > 0 })),
};

// ---------- media (imaginile homepage-ului) ----------
const imgUse = new Map();
for (const s of SRC) for (const i of s.imagini) {
  const f = i.src.split('?')[0].replace(/^https?:\/\/(www\.)?moaclinic\.ro/, '');
  (imgUse.get(f) || imgUse.set(f, new Set()).get(f)).add(s.path);
}
D.media = uniq((home?.imagini || []).map((i) => i.src.split('?')[0].replace(/^https?:\/\/(www\.)?moaclinic\.ro/, '')))
  .filter((f) => !/\.svg$/.test(f) || /logo/i.test(f))
  .map((f) => {
    const img = home.imagini.find((i) => i.src.includes(f));
    const local = path.join(ROOT, 'site', f);
    return {
      id: slug(path.basename(f)),
      titlu: img.alt || path.basename(f),
      alt: img.alt,
      fisier: f,
      kb: fs.existsSync(local) ? Math.round(fs.statSync(local).size / 1024) : null,
      dimensiuni: img.w && img.h ? `${img.w}×${img.h}` : null,
      folosita: [...(imgUse.get(f) || [])],
    };
  });

// ---------- date legale (din /documente-legale-clinica-moa/) ----------
const legalSrc = byPath.get('/documente-legale-clinica-moa/');
const lt = legalSrc?.text || '';
D.legal = {
  sursa: legalSrc?.url || null,
  firme: [...lt.matchAll(/\d\.\s*([A-Z][\w ]+?SRL)\s+Punct de lucru:\s*([^]+?)(?=(?:CUI|Prin accesarea|\d\.\s*[A-Z][\w ]+?SRL|$))/g)]
    .map((m) => ({ nume: m[1].trim(), adresa: m[2].replace(/\s+/g, ' ').trim() }))
    .filter((f, i, a) => a.findIndex((x) => x.nume === f.nume) === i)
    .map((f) => {
      const after = lt.slice(lt.indexOf(f.nume), lt.indexOf(f.nume) + 400);
      return {
        ...f,
        cui: (after.match(/CUI:\s*(\d+)/) || [])[1] || null,
        registru: (after.match(/(J\d+\/\d+\/[\d.]+)/) || [])[1] || null,
        email: (after.match(/Email:\s*(\S+@\S+?)(?=\s|$)/) || [])[1] || null,
      };
    }),
  domeniu_mentionat: (lt.match(/Site-ul\s+(www\.[\w.-]+)/) || [])[1] || null,
};

// ---------- ce spune site-ul despre MOA ----------
const TEME = [
  ['Poziționare', /global antiaging|premium|prima clinica|concept/],
  ['Echipă și expertiză', /medic|doctor|dr\.|specialist|echipa|expertiz/],
  ['Tehnologie', /aparatur|tehnologi|laser|splendor|venus|dispozitiv/],
  ['Abordare', /personalizat|natural|holist|siguranta|rezultate/],
  ['Terapii regenerative', /regenerativ|regenerare|longevit|antiaging intern|oxxygene/],
];
const fapte = new Map();
for (const s of SRC) {
  for (const t of s.text.split(/(?<=[.!?])\s+/)) {
    const n = norm(t);
    if (t.length < 70 || t.length > 280 || !/\bmoa\b|clinica noastra|clinicii noastre/.test(n)) continue;
    // fără fragmente de meniu / butoane și fără sfaturi generice
    const words = t.split(/\s+/);
    if (/programeaza|vezi detalii|spre pagina|indiferent ca alegi|iata ce ar trebui|disclaimer|informativ|nu isi asuma/.test(n) || words.filter((w) => /^[A-ZĂÂÎȘȚ]/.test(w)).length / words.length > 0.35) continue;
    const k = n.replace(/[^a-z ]/g, '').slice(0, 90);
    if (!fapte.has(k)) fapte.set(k, { fapt: t, surse: new Set() });
    fapte.get(k).surse.add(s.url);
  }
}
D.brand.fapte_site = [...fapte.values()]
  .map((f) => ({ ...f, surse: [...f.surse], tema: (TEME.find(([, re]) => re.test(norm(f.fapt))) || ['Altele'])[0] }))
  .filter((f) => f.tema !== 'Altele')
  .sort((a, b) => b.surse.length - a.surse.length || a.fapt.length - b.fapt.length)
  .slice(0, 30);
D.brand.propunere_valoare = [
  'Prima clinică Global Antiaging din România: estetică, chirurgie și regenerare celulară într-un singur loc',
  'Concept creat de un medic format la Academia de gerontologie a prof. Ana Aslan',
  'Rezultate estetice naturale, într-un mediu prietenos, cu expertiză profesională internațională',
  'Aparatură de ultimă generație: Splendor X, Venus Viva, Venus Legacy, Dermalinfusion',
  'Tratamente personalizate pentru îngrijirea pielii, alese în consultația cu medicul dermatolog',
  'Terapii regenerative non-invazive pentru antiaging intern, cu teste înainte și după (vârstă biologică)',
];
D.brand.denumiri_legale = D.legal.firme.map((f) => f.nume);

// ---------- observații SEO (cu reguli de verificare pe site-ul live) ----------
const NIVEL = { mare: 'critic', medie: 'mediu', mică: 'minor' };
const H = ORIGIN + '/';
const OBS = [];
const ob = (id, nivel, text, url, check, sursa = 'audit automat') => OBS.push({ id, nivel, text, url, sursa, check });
const inc = (zona) => D.inconsistente.find((i) => i.zona === zona);

if (inc('Program')) ob('program-schema', 'critic', 'Două blocuri schema.org declară programe diferite (Lu–Du 09–17 vs Lu–Vi 09–19). Google poate afișa programul greșit.', H, { tip: 'any', descriere: 'pe homepage să rămână un singur program în schema (dispare Lu–Du 09–17 sau Lu–Vi 09–19)', checks: [{ tip: 'text_absent', url: H, text: 'Saturday,Sunday 09:00-17:00' }, { tip: 'regex_absent', url: H, regex: '"closes"\\s*:\\s*"19:00"' }] });
if (inc('Prețuri')) for (const d of inc('Prețuri').valori.diferente) ob(`pret-${slug(d.oferta)}`, 'critic', `Prețul din schema pentru „${d.oferta}” (${d.schema} lei) diferă de /preturi/ (${d.preturi} lei).`, H, { tip: 'regex_absent', url: H, regex: `"name"\\s*:\\s*"${esc(d.oferta).replace(/"/g, '')}"[\\s\\S]{0,80}?"price"\\s*:\\s*"${d.schema}"`, descriere: `prețul de ${d.schema} lei pentru „${d.oferta}” să nu mai apară în schema de pe homepage` });
const globalServices = {};
for (const p of PAGES.pages) for (const s of p.schema_servicii || []) globalServices[s.nume] = (globalServices[s.nume] || 0) + 1;
const everywhere = Object.entries(globalServices).filter(([, n]) => n >= PAGES.pages.length * 0.8).map(([n]) => n);
if (everywhere.length) {
  const probe = ORIGIN + '/contact/';
  ob('schema-globala', 'critic', `${everywhere.length} blocuri schema Service (${everywhere.join('; ')}) sunt puse pe toate cele ${PAGES.pages.length} pagini, cu prețurile lor. Pagina Sculptra sau /contact/ „declară” astfel prețuri la Botox și TMS. Fiecare bloc trebuie să stea doar pe pagina serviciului lui.`, probe,
    { tip: 'regex_absent', url: probe, regex: '"@type"\\s*:\\s*"Service"', descriere: 'pe /contact/ să nu mai existe niciun bloc schema Service' });
}
if (inc('Echipă')) ob('echipa-diferita', 'critic', `Echipa de pe homepage diferă de /echipa/: doar pe homepage ${inc('Echipă').valori['doar pe homepage'].join(', ')}; doar pe /echipa/ ${inc('Echipă').valori['doar pe /echipa/'].join(', ')}.`, ORIGIN + '/echipa/', { tip: 'manual' });
if (inc('Recenzii')) ob('recenzii-schema', 'mediu', `aggregateRating din schema declară ${inc('Recenzii').valori['schema aggregateRating.reviewCount']} recenzii, widgetul arată ${inc('Recenzii').valori['Trustindex (homepage)']}.`, H, { tip: 'regex_absent', url: H, regex: '"reviewCount"\\s*:\\s*"60"', descriere: 'reviewCount „60” să nu mai apară în schema de pe homepage' });
if (inc('Social')) ob('facebook-dublu', 'mediu', 'Două profiluri Facebook diferite pe homepage (MoaClinicByOxxygene și profile.php?id=61565584852692).', H, { tip: 'text_absent', url: H, text: 'profile.php?id=61565584852692' });
ob('nume-brand', 'mediu', `Brandul apare sub ${inc('Nume brand')?.valori.variante.length || 4} denumiri (${(inc('Nume brand')?.valori.variante || []).join(', ')}). Lipsește alternateName în schema.`, H, { tip: 'regex_present', url: H, regex: '"alternateName"', descriere: 'schema de pe homepage să conțină alternateName' });
ob('autor-urluri', 'mediu', 'Dr. Adrian Stănescu are 3 URL-uri de profil: /author/moaclinic/ (schema), /author/dr-adrian-stanescu/ și /echipa/dr-adrian-stanescu/ (sitemap, face 301).', H, { tip: 'text_absent', url: H, text: '/author/moaclinic/' });
for (const l of D.continut.linkuriHomepage.filter((x) => x.status >= 300 && x.status < 400 && x.url.endsWith('/')))
  ob(`redirect-${slug(new URL(l.url).pathname)}`, 'minor', `Link intern pe homepage spre ${new URL(l.url).pathname}, care face redirect spre ${new URL(l.redirect, ORIGIN).pathname}.`, H, { tip: 'text_absent', url: H, text: `href="${l.url}"` });
for (const l of PAGES.linkuri.filter((x) => x.status >= 300 && x.status < 400 && !D.continut.linkuriHomepage.some((h) => new URL(h.url).pathname === x.path)))
  ob(`redirect-${slug(l.path)}`, /trashed/.test(l.path) ? 'mediu' : 'minor', `Link intern spre ${l.path}${/trashed/.test(l.path) ? ' (pagină aruncată la coș în WordPress)' : ''}, redirect spre ${l.redirect ? new URL(l.redirect, ORIGIN).pathname : '?'}. Apare pe ${l.din.length} ${l.din.length === 1 ? 'pagină' : 'pagini'}: ${l.din.slice(0, 3).join(', ')}.`, ORIGIN + l.din[0], { tip: 'text_absent', url: ORIGIN + l.din[0], text: `${l.path}"` });
for (const p of PAGES.pages.filter((x) => x.status >= 300)) ob(`sitemap-${slug(p.path)}`, 'mediu', `${p.path} e în sitemap dar răspunde ${p.status} (${p.probleme[0]}).`, p.url, { tip: 'not_in_sitemap', url: p.url });
if (D.legal.domeniu_mentionat && !/moaclinic/.test(D.legal.domeniu_mentionat)) ob('legal-domeniu', 'critic', `Termenii și condițiile spun că site-ul este „${D.legal.domeniu_mentionat}”, nu moaclinic.ro.`, D.legal.sursa, { tip: 'text_absent', url: D.legal.sursa, text: D.legal.domeniu_mentionat });
const firmaNr25 = D.legal.firme.find((f) => /nr\.\s*25/.test(f.adresa));
if (firmaNr25) ob('legal-adresa', 'critic', `${firmaNr25.nume} are în documentele legale adresa „${firmaNr25.adresa}” – clinica e la nr. 35.`, D.legal.sursa, { tip: 'manual' });
const gmail = D.legal.firme.map((f) => f.email).find((e) => /gmail/.test(e || ''));
if (gmail) ob('legal-email', 'mediu', `Documentele legale folosesc ${gmail} în loc de office@moaclinic.ro.`, D.legal.sursa, { tip: 'text_absent', url: D.legal.sursa, text: gmail });
if (D.legal.firme.some((f) => !f.cui)) ob('legal-cui', 'mediu', `Lipsesc CUI-ul și nr. de registru pentru ${D.legal.firme.filter((f) => !f.cui).map((f) => f.nume).join(', ')}.`, D.legal.sursa, { tip: 'manual' });
if (inc('Telefon')) ob('telefon-schema', 'minor', 'Telefonul din schema conține cratime speciale (U+2011): +40‑743‑056‑605. Formatul corect: +40743056605.', H, { tip: 'text_absent', url: H, text: '+40‑743' });
if (inc('Logo')) ob('logo-schema', 'minor', 'Schema Rank Math folosește ca logo „Instagram-logo.png”, schema custom folosește SVG-ul alb.', H, { tip: 'text_absent', url: H, text: 'Instagram-logo.png","contentUrl' });
ob('descriere-trunchiata', 'minor', 'Descrierea organizației din schema Rank Math începe cu „lege Moa…” (lipsește „A”).', H, { tip: 'text_absent', url: H, text: '"description":"lege Moa' });
ob('homepage-article', 'minor', 'Homepage-ul e marcat ca Article în schema Rank Math.', H, { tip: 'manual' });
ob('geo-precizie', 'minor', 'Coordonatele din schema au 2 zecimale (44.43, 26.11) ≈ 1 km eroare.', H, { tip: 'regex_absent', url: H, regex: '"latitude"\\s*:\\s*44\\.43\\s*,', descriere: 'latitudinea din schema să aibă mai mult de 2 zecimale' });
ob('typo-stimulare', 'minor', 'Footer: „Simulare magnetica Transcraniana” (corect: Stimulare magnetică transcraniană).', H, { tip: 'text_absent', url: H, text: 'Simulare magnetica' });
ob('buton-fara-link', 'mediu', 'Butonul „Vezi detalii” de la „Terapii antioxidante” (homepage) nu are link.', H, { tip: 'manual' });
const ctaVariants = uniq(SRC.flatMap((s) => s.cta).filter((c) => /programe/i.test(c)));
if (ctaVariants.length > 1) ob('cta-variante', 'minor', `CTA-ul de programare apare în ${ctaVariants.length} forme: ${ctaVariants.map((c) => `„${c}”`).join(', ')}.`, H, { tip: 'manual' });
if (SRC.some((s) => s.cta.some((c) => /continue reading/i.test(c)))) ob('cta-engleza', 'minor', 'Butonul „Continue reading →” e în engleză pe pagina categoriei de blog.', ORIGIN + '/category/blog/', { tip: 'text_absent', url: ORIGIN + '/category/blog/', text: 'Continue reading' });
for (const p of PAGES.pages.filter((x) => x.probleme.some((i) => /^Title lung/.test(i)))) ob(`title-${slug(p.path)}`, 'minor', `Title lung (${p.title.length} caractere): „${p.title}”.`, p.url, { tip: 'meta', url: p.url, camp: 'title', op: 'max', valoare: 65 });
for (const p of PAGES.pages.filter((x) => x.probleme.includes('Fara meta description'))) ob(`desc-${slug(p.path)}`, 'mediu', `Pagina ${p.path} nu are meta description.`, p.url, { tip: 'meta', url: p.url, camp: 'description', op: 'exists' });
const noAlt = PAGES.pages.filter((p) => p.img_fara_alt);
if (noAlt.length) ob('imagini-alt', 'mediu', `${noAlt.reduce((n, p) => n + p.img_fara_alt, 0)} imagini fără text alternativ, pe ${noAlt.length} pagini.`, H, { tip: 'manual' });
if (D.echipa.some((p) => /Amolioaie/.test(p.nume))) ob('nume-amolioaie', 'minor', 'Numele „Irina Amolioaie” apare în fișierele imaginilor ca „amolioaiei”.', ORIGIN + '/echipa/', { tip: 'manual' });
D.observatii = OBS;

D.schema_existenta = (D.schemaOrg?.tipuri || []).map((t) => t.replace('+', ' + '));
D.pagini_legale_utile = PAGES.pages
  .filter((p) => /contact|documente-legale|preturi|echipa|abonamente|sitemap|blog/.test(p.path) && p.tip === 'Pagina' && p.path.split('/').filter(Boolean).length === 1)
  .map((p) => ({ nume: (p.h1 || p.title.split('|')[0]).trim(), url: p.url }));

D.meta = { ...D.meta, extras_la: new Date().toISOString().slice(0, 10), pagini: SRC.length, metoda: 'homepage + /preturi/ + /echipa/ + /abonamente/ + toate paginile din sitemap' };
fs.writeFileSync(FILE, JSON.stringify(D, null, 2));
console.log(`Gata: ${servicii.length} servicii · ${D.articole.length} articole · ${D.glosar.length} termeni · ${D.intrebari.length} întrebări · ${D.media.length} imagini · ${D.brand.fapte_site.length} fapte · ${OBS.length} observații · ${D.legal.firme.length} firme`);
