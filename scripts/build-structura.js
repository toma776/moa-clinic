// Propunere de structură a site-ului și de meniu, construită pe user journey-ul unui pacient de clinică estetică / antiaging.
// Pleacă de la entitățile reale (servicii, prețuri, articole, video, întrebări, medici) și le așază pe probleme, tratamente
// și etapele journey-ului. Scrie data/structura.json + redirecturile de la URL-urile actuale.
// Rulare: npm run structura
const fs = require('fs');
const path = require('path');
const { ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const serv = Object.fromEntries(D.servicii.map((s) => [s.id, s]));
const art = Object.fromEntries(D.articole.map((a) => [a.id, a]));
const warn = [];
const path_ = (u) => new URL(u, ORIGIN).pathname;

// ---------- tratamente: categorie nouă, slug nou, din ce serviciu actual vin ----------
const TRATAMENTE = [
  { id: 'injectabile', nume: 'Tratamente injectabile', desc: 'Riduri, volum, buze, hidratare – fără bisturiu, cu revenire rapidă.', items: [
    ['botox', 'Toxină botulinică (Botox)', 'injectare-botox'],
    ['acid-hialuronic', 'Acid hialuronic', 'injectari-acid-hialuronic'],
    ['augmentare-buze', 'Augmentare buze', 'augmentare-buze'],
    ['sculptra', 'Sculptra', 'sculptra'],
    ['harmonyca', 'HArmonyCa', 'harmonyca'],
    ['skinbooster', 'Skinbooster Restylane', 'skinbooster-vital'],
    ['polinucleotide', 'Polinucleotide (Rejuran)', 'polinucleotide'],
    ['jalupro-cearcane', 'Jalupro Young Eye', 'jalupro-young-eye'],
    ['nefertiti-lift', 'Nefertiti Lift', 'nefertiti-lift'],
    ['mezoterapie', 'Mezoterapie', 'mezoterapie'],
    ['prp', 'PRP – terapia vampir', 'prp-scalp'],
    ['botox-hiperhidroza', 'Botox pentru transpirație', 'hiperhidroza-axilara'],
    ['augmentare-peniana', 'Augmentare peniană', 'marirea-penisului-acid-hialuronic'],
  ] },
  { id: 'aparatura', nume: 'Tratamente cu aparatură', desc: 'Laser, radiofrecvență și microneedling, cu aparate de ultimă generație.', hub: 'laser-terapie', items: [
    ['epilare-definitiva', 'Epilare definitivă Splendor X', 'epilare-definitiva-bucuresti'],
    ['laser-vascular', 'Laser vascular', 'laser-vascular'],
    ['venus-viva', 'Venus Viva – radiofrecvență fracționată', 'venus-viva'],
    ['venus-legacy', 'Venus Legacy – lifting & remodelare', 'venus-legacy'],
    ['dermalinfusion', 'Dermalinfusion', 'dermalinfusion'],
    ['microneedling', 'Microneedling Dermapen 4', 'microneedeling'],
  ] },
  { id: 'chirurgie-dermatologie', nume: 'Chirurgie & dermatologie', desc: 'Intervenții mici, cu anestezie locală, și dermatologie medicală.', items: [
    ['blefaroplastie', 'Blefaroplastie', 'blefaroplastie'],
    ['lip-lift', 'Lip lift', 'lip-lifting'],
    ['indepartare-alunite', 'Îndepărtare alunițe (nevi)', 'nevi-pigmentari'],
    ['eliminare-papiloame', 'Eliminare papiloame', 'eliminare-papiloame'],
  ] },
  { id: 'regenerare', nume: 'Medicină regenerativă', desc: 'Terapii care lucrează din interior: energie, imunitate, detox, echilibru.', items: [
    ['terapii-iv', 'Terapii intravenoase (perfuzii)', null, 'tratamente-regenerative-perfuzabile'],
    ['nad', 'Terapia NAD+', 'terapia-nad'],
    ['glutation', 'Perfuzii cu glutation', 'glutation'],
    ['autohemoterapie', 'Autohemoterapie majoră cu ozon', 'autohemoterapia'],
    ['sauna-ozon', 'Saună cu ozon', 'sauna-cu-ozon'],
    ['vielight', 'Fotobiomodulare Vielight', 'fotobiomodulare-vielight'],
    ['tms', 'Stimulare magnetică transcraniană (TMS)', 'tms-stimulare-magnetica-transcraniana'],
  ] },
  { id: 'teste', nume: 'Teste genetice longevity', desc: 'Ce spun genele tale despre piele, nutriție și îmbătrânire.', hub: null, items: [
    ['dna-skin', 'DNA Skin', 'skin-care-dna'],
    ['nutrigenetica', 'Nutrigenetică și epigenetică', 'nutrigenetica-epigenetica'],
  ] },
  { id: 'cosmetica', nume: 'Tratamente faciale cosmetice', desc: 'Curățare, hidratare, peeling și tratamente profesionale pentru ten.', items: [
    ['tratamente-faciale', 'Tratamente faciale profesionale', null, 'tratamente-cosmetologice'],
    ['peeling', 'Peeling medical', null],
  ] },
];
const CONSULTATII = [
  ['antiaging', 'Consultație antiaging (cu vârsta biologică)', 'consultatie-antiaging'],
  ['dermatologie', 'Consultație dermatologie & dermatoestetică', 'consultatie-dermatoestetica-dermatologie'],
  ['chirurgie-plastica', 'Consultație chirurgie plastică', 'consultatie-chirurgie-plastica'],
  ['nutritie', 'Consultație nutriție antiaging / nutrigenomică', 'consultatie-nutritie-antiaging-nutrigenomica'],
];
const tratUrl = {};
for (const c of TRATAMENTE) for (const [slug, , sid] of c.items) if (sid) tratUrl[sid] = `/tratamente/${c.id}/${slug}/`;
for (const [slug, , sid] of CONSULTATII) tratUrl[sid] = `/consultatii/${slug}/`;

// ---------- probleme (de unde pornește pacientul), pe zone ----------
const PROBLEME = [
  { zona: 'Față', items: [
    ['riduri-de-expresie', 'Riduri de expresie', ['injectare-botox', 'nefertiti-lift'], ['riduri-de-expresie', 'riduri-frunte', 'riduri-intre-sprancene', 'riduri-laba-gastei', 'bunny-lines', 'riduri-pe-gat-tratament-cu-botox', 'unde-se-pune-botox', 'efecte-botox', 'cea-mai-buna-toxina-botulinica']],
    ['riduri-profunde-volum', 'Riduri profunde & pierdere de volum', ['injectari-acid-hialuronic', 'sculptra', 'harmonyca', 'skinbooster-vital'], ['tratament-riduri-profunde', 'riduri-marioneta', 'riduri-in-jurul-gurii', 'ridurile-fumatorului', 'riduri', 'hialuronidaza', 'de-ce-nu-imi-tine-acidul-hialuronic-2']],
    ['buze', 'Buze subțiri sau asimetrice', ['augmentare-buze', 'lip-lifting'], ['buze-uscate', 'forme-de-buze-cu-acid-hialuronic', 'prima-injectare-cu-acid-hialuronic-in-buze', 'russian-lips-vs-butterfly-lips', 'acid-in-buze-exagerat', 'acid-hialuronic-in-buze-cat-dureaza']],
    ['cearcane-pungi', 'Cearcăne & pungi sub ochi', ['jalupro-young-eye', 'polinucleotide', 'blefaroplastie'], ['cearcane', 'tratament-cearcane', 'pungi-sub-ochi', 'ptoza-palpebrala']],
    ['ten-pori-textura', 'Ten tern, pori dilatați, textură', ['dermalinfusion', 'venus-viva', 'microneedeling', 'mezoterapie', 'polinucleotide'], ['pori-dilatati', 'recuperare-dupa-dermapen']],
  ] },
  { zona: 'Corp', items: [
    ['par-nedorit', 'Păr nedorit', ['epilare-definitiva-bucuresti'], ['epilare-definitiva-pareri', 'epilat-interfesier-ce-inseamna']],
    ['tonifiere-celulita', 'Piele lăsată & celulită', ['venus-legacy'], ['cele-mai-eficiente-metode-de-combinare-a-tratamentelor-venus-legacy-si-detoxifierii-intravenoase-pentru-un-corp-perfect']],
    ['vergeturi-cicatrici', 'Vergeturi & cicatrici', ['venus-viva', 'microneedeling'], ['vergeturi-pe-sani-2']],
    ['vase-vizibile', 'Vase de sânge vizibile', ['laser-vascular'], ['alunite-rosii']],
    ['transpiratie', 'Transpirație excesivă', ['hiperhidroza-axilara'], []],
  ] },
  { zona: 'Păr & piele', items: [
    ['caderea-parului', 'Căderea părului', ['prp-scalp', 'mezoterapie', 'microneedeling'], ['ce-inseamna-prp', 'terapia-vampir-pareri']],
    ['alunite-leziuni', 'Alunițe, papiloame, leziuni', ['nevi-pigmentari', 'eliminare-papiloame', 'consultatie-dermatoestetica-dermatologie'], []],
  ] },
  { zona: 'Sănătate & longevitate', items: [
    ['oboseala-energie', 'Oboseală & lipsă de energie', ['terapia-nad', 'glutation', 'autohemoterapia'], ['nad-perfuzabil', 'terapii-intravenoase', 'adevarul-despre-glutation', 'glutation-beneficii-si-contraindicatii-ce-este', 'cum-sa-ti-imbunatatesti-sanatatea-si-bunastarea-cu-un-tratament-regenerativ-perfuzabil-cu-glutation', 'nadh-cheia-catre-rezolvarea-problemei-de-infertilitate']],
    ['burnout-anxietate', 'Burnout, anxietate, depresie', ['tms-stimulare-magnetica-transcraniana', 'fotobiomodulare-vielight'], ['tratament-burnout-tms']],
    ['imbatranire-interioara', 'Îmbătrânire din interior', ['consultatie-antiaging', 'skin-care-dna', 'nutrigenetica-epigenetica', 'sauna-cu-ozon'], ['beneficiile-uimitoare-ale-saunei-cu-ozon-pentru-antiaging-ul-intern', 'tot-ce-trebuie-sa-stii-despre-consultarea-nutrigenomica-descopera-secretele-genetice-ale-sanatatii-tale']],
  ] },
];

// ---------- conținutul fiecărei pagini noi, din entități ----------
const minPrice = (sid) => { const v = (serv[sid]?.preturi || []).map((p) => p.valoare).filter((x) => x != null); return v.length ? Math.min(...v) : null; };
const contentOf = (sid) => {
  const s = serv[sid];
  if (!s) return null;
  return {
    pret_de_la: minPrice(sid),
    preturi: s.preturi.length,
    video: (s.video || []).length,
    intrebari: D.intrebari.filter((q) => q.pagini.includes(path_(s.url))).length,
    medici: s.medici || [],
    tehnologii: [...s.tehnologii, ...s.produse],
    cuvinte: s.cuvinte,
  };
};
const used = new Set();
const node = (nume, url, tip, extra = {}) => ({ nume, url, tip, ...extra });

const arbore = [];
arbore.push(node('Acasă', '/', 'acasa', { etapa: 'constientizare', vechi: ['/'] }));

const probleme = node('Probleme', '/probleme/', 'hub', { etapa: 'constientizare', copii: [] });
for (const z of PROBLEME) {
  const zn = node(z.zona, null, 'grup', { copii: [] });
  for (const [slug, nume, sids, aids] of z.items) {
    sids.forEach((s) => { if (!serv[s]) warn.push(`problema ${slug}: serviciu ${s} inexistent`); });
    aids.forEach((a) => { if (!art[a]) warn.push(`problema ${slug}: articol ${a} inexistent`); else used.add(a); });
    zn.copii.push(node(nume, `/probleme/${slug}/`, 'problema', {
      etapa: 'constientizare',
      vechi: [],
      tratamente: sids.filter((s) => serv[s]).map((s) => ({ nume: serv[s].nume, url: tratUrl[s] || null, pret_de_la: minPrice(s) })),
      ghiduri: aids.filter((a) => art[a]).map((a) => ({ titlu: art[a].titlu, url: `/ghiduri/${a}/` })),
      intrebari: D.intrebari.filter((q) => sids.some((s) => q.legaturi.servicii.includes(s))).length,
    }));
  }
  probleme.copii.push(zn);
}
arbore.push(probleme);

const tratamente = node('Tratamente', '/tratamente/', 'hub', { etapa: 'explorare', copii: [] });
for (const c of TRATAMENTE) {
  const cn = node(c.nume, `/tratamente/${c.id}/`, 'categorie', { etapa: 'explorare', desc: c.desc, vechi: [], copii: [] });
  if (c.hub && serv[c.hub]) cn.vechi.push(path_(serv[c.hub].url));
  for (const [slug, nume, sid, hub] of c.items) {
    const s = sid && serv[sid];
    if (sid && !s) warn.push(`tratament ${slug}: serviciu ${sid} inexistent`);
    cn.copii.push(node(nume, `/tratamente/${c.id}/${slug}/`, 'tratament', {
      etapa: 'explorare',
      vechi: [s && path_(s.url), hub && `/${hub}/`].filter(Boolean),
      continut: s ? contentOf(sid) : null,
      nou: !s && !hub,
    }));
  }
  tratamente.copii.push(cn);
}
arbore.push(tratamente);

arbore.push(node('Longevitate · Global Antiaging', '/longevitate/', 'hub', {
  etapa: 'explorare',
  desc: 'Pagina conceptului MOA: ce înseamnă Global Antiaging, vârsta biologică, cum arată un program, ce terapii include.',
  vechi: ['/terapii-regenerative/', '/teste-genetice-longevity/', '/ozonoterapie/', '/tratamente-regenerative-perfuzabile/'],
  copii: [node('Programul Global Antiaging', '/longevitate/program/', 'pagina', { nou: true }), node('Vârsta biologică', '/longevitate/varsta-biologica/', 'pagina', { nou: true })],
}));

arbore.push(node('Consultații', '/consultatii/', 'hub', {
  etapa: 'decizie', vechi: ['/consultatii/'],
  copii: CONSULTATII.map(([slug, nume, sid]) => node(nume, `/consultatii/${slug}/`, 'consultatie', { etapa: 'decizie', vechi: serv[sid] ? [path_(serv[sid].url)] : [], continut: contentOf(sid) })),
}));
arbore.push(node('Prețuri', '/preturi/', 'pagina', { etapa: 'decizie', vechi: ['/preturi/'], desc: `${D.preturi.reduce((n, c) => n + c.servicii.length, 0)} prețuri în ${D.preturi.length} categorii, cu link spre fiecare tratament` }));
arbore.push(node('Oferte & abonamente', '/oferte/', 'pagina', { etapa: 'decizie', vechi: ['/abonamente/'], desc: `${D.oferte.length} oferte active` }));
arbore.push(node('Medici', '/medici/', 'hub', {
  etapa: 'incredere', vechi: ['/echipa/'],
  copii: D.echipa.filter((p) => p.tip === 'Medic').map((p) => node(p.nume, `/medici/${p.id}/`, 'medic', { etapa: 'incredere', vechi: p.profil ? [path_(p.profil)] : [], desc: p.rol, nou: !p.profil })),
}));
arbore.push(node('Clinica', '/clinica/', 'hub', {
  etapa: 'incredere', vechi: [], desc: 'Conceptul, fondatorul, spațiul, aparatura.',
  copii: [
    node('Tehnologie', '/clinica/tehnologie/', 'pagina', { etapa: 'incredere', nou: true, desc: D.tehnologii.map((t) => t.nume).join(', ') }),
    node('Recenzii & rezultate', '/clinica/recenzii/', 'pagina', { etapa: 'incredere', nou: true, desc: `${D.reputatie.trustindex?.recenzii || ''} recenzii Google + rezultate înainte/după (de produs)` }),
  ],
}));
const rest = D.articole.filter((a) => !used.has(a.id));
arbore.push(node('Ghiduri', '/ghiduri/', 'hub', {
  etapa: 'constientizare', vechi: ['/blog/', '/category/blog/'], desc: `${D.articole.length} articole: ${D.articole.length - rest.length} legate de pagini de probleme, ${rest.length} doar în ghiduri`,
  copii: [node('Întrebări frecvente', '/intrebari-frecvente/', 'pagina', { etapa: 'decizie', nou: true, desc: `${D.intrebari.length} întrebări din conținut, de validat în Entități` })],
}));
arbore.push(node('Programare', '/programare/', 'pagina', { etapa: 'programare', nou: true, desc: 'Formular scurt (nume, telefon, ce te interesează), WhatsApp, telefon, ce urmează după trimitere' }));
arbore.push(node('Pregătirea vizitei', '/vizita/', 'pagina', { etapa: 'programare', nou: true, desc: 'Cum ajungi, parcare, ce aduci, ce durează prima consultație' }));
arbore.push(node('Contact', '/contact/', 'pagina', { etapa: 'programare', vechi: ['/contact/'] }));
arbore.push(node('Documente legale', '/documente-legale/', 'pagina', { etapa: 'dupa', vechi: ['/documente-legale-clinica-moa/'] }));

// ---------- meniu ----------
const zonaLinks = (z) => z.items.map(([slug, nume]) => ({ nume, url: `/probleme/${slug}/` }));
const meniu = {
  principal: [
    { nume: 'Ce te supără?', url: '/probleme/', etapa: 'constientizare', tip: 'mega', nota: 'Intrarea principală: pacientul pornește de la o problemă, nu de la numele unui produs.',
      coloane: PROBLEME.map((z) => ({ titlu: z.zona, linkuri: zonaLinks(z) })) },
    { nume: 'Tratamente', url: '/tratamente/', etapa: 'explorare', tip: 'mega', nota: 'Pentru cine știe deja ce vrea (Botox, Sculptra, epilare). Fiecare link duce direct la pagina tratamentului.',
      coloane: TRATAMENTE.filter((c) => c.id !== 'teste').map((c) => ({ titlu: c.nume, url: `/tratamente/${c.id}/`, linkuri: c.items.slice(0, 8).map(([slug, nume]) => ({ nume, url: `/tratamente/${c.id}/${slug}/` })) })) },
    { nume: 'Longevitate', url: '/longevitate/', etapa: 'explorare', tip: 'dropdown', nota: 'Diferențiatorul MOA (Global Antiaging) primește loc propriu în meniu.',
      linkuri: [{ nume: 'Ce este Global Antiaging', url: '/longevitate/' }, { nume: 'Consultația antiaging', url: '/consultatii/antiaging/' }, { nume: 'Vârsta biologică', url: '/longevitate/varsta-biologica/' }, { nume: 'Teste genetice', url: '/tratamente/teste/' }, { nume: 'Terapii intravenoase', url: '/tratamente/regenerare/terapii-iv/' }, { nume: 'TMS pentru burnout', url: '/tratamente/regenerare/tms/' }] },
    { nume: 'Prețuri', url: '/preturi/', etapa: 'decizie', tip: 'dropdown', linkuri: [{ nume: 'Toate prețurile', url: '/preturi/' }, { nume: 'Ofertele lunii', url: '/oferte/' }, { nume: 'Consultații', url: '/consultatii/' }] },
    { nume: 'Medici', url: '/medici/', etapa: 'incredere', tip: 'link' },
    { nume: 'Despre MOA', url: '/clinica/', etapa: 'incredere', tip: 'dropdown', linkuri: [{ nume: 'Clinica și conceptul', url: '/clinica/' }, { nume: 'Tehnologie', url: '/clinica/tehnologie/' }, { nume: 'Recenzii & rezultate', url: '/clinica/recenzii/' }, { nume: 'Ghiduri', url: '/ghiduri/' }, { nume: 'Întrebări frecvente', url: '/intrebari-frecvente/' }, { nume: 'Contact', url: '/contact/' }] },
  ],
  cta: { text: 'Programează-te', url: '/programare/', nota: 'Un singur buton principal, același text peste tot (azi sunt 3 variante).' },
  utilitar: [{ nume: '0743 056 605', url: 'tel:+40743056605' }, { nume: 'WhatsApp', url: 'https://wa.me/40743056605' }, { nume: 'Str. Ștefan Mihăileanu 35', url: D.contact.googleMaps[0] }],
  mobil: ['Bara de jos fixă pe mobil: Sună · WhatsApp · Programează-te', 'Meniul mobil deschide întâi „Ce te supără?” și „Tratamente”, ca acordeoane'],
  footer: [
    { titlu: 'Tratamente', linkuri: TRATAMENTE.map((c) => ({ nume: c.nume, url: `/tratamente/${c.id}/` })) },
    { titlu: 'Pacienți', linkuri: [{ nume: 'Programare', url: '/programare/' }, { nume: 'Pregătirea vizitei', url: '/vizita/' }, { nume: 'Prețuri', url: '/preturi/' }, { nume: 'Oferte', url: '/oferte/' }, { nume: 'Întrebări frecvente', url: '/intrebari-frecvente/' }] },
    { titlu: 'MOA', linkuri: [{ nume: 'Clinica', url: '/clinica/' }, { nume: 'Medici', url: '/medici/' }, { nume: 'Ghiduri', url: '/ghiduri/' }, { nume: 'Contact', url: '/contact/' }] },
    { titlu: 'Legal', linkuri: [{ nume: 'Documente legale', url: '/documente-legale/' }, { nume: 'ANPC / SAL / SOL', url: 'https://anpc.ro/ce-este-sal/' }] },
  ],
};

// ---------- etapele journey-ului ----------
const etape = [
  { id: 'constientizare', nume: 'Conștientizare', intrebare: '„Am riduri / cearcăne / sunt mereu obosit. Ce pot face?”', canal: 'Google (căutări pe probleme), Instagram, recomandări',
    pagini: ['Pagini de probleme', 'Ghiduri', 'Acasă'], continut: ['problema explicată simplu', 'cauze', 'ce opțiuni există, de la blând la intens', 'întrebări frecvente'], cta: 'Vezi tratamentele potrivite', metrica: 'trafic organic pe probleme, timp pe pagină' },
  { id: 'explorare', nume: 'Explorare', intrebare: '„Ce tratament mi se potrivește? Cum funcționează, doare, cât ține?”', canal: 'pagini de tratament, video',
    pagini: ['Pagini de tratament', 'Categorii de tratamente', 'Longevitate'], continut: ['pentru cine e / nu e', 'cum decurge (video)', 'rezultate și durată', 'riscuri și recuperare', 'tratamente asociate'], cta: 'Vezi prețul · Întreabă medicul', metrica: 'vizionări video, click pe preț' },
  { id: 'incredere', nume: 'Încredere', intrebare: '„Cine mă tratează? E sigur? Ce spun alții?”', canal: 'medici, recenzii, tehnologie',
    pagini: ['Medici', 'Recenzii & rezultate', 'Tehnologie', 'Clinica'], continut: ['medicul care face procedura, cu specializarea', 'recenzii Google reale', 'înainte / după', 'aparatura și certificările (FDA)'], cta: 'Cunoaște medicul · Programează-te', metrica: 'vizite pe profilul medicului înainte de programare' },
  { id: 'decizie', nume: 'Decizie', intrebare: '„Cât costă? Merită? Încep cu o consultație?”', canal: 'prețuri, oferte, consultații',
    pagini: ['Prețuri', 'Oferte', 'Consultații', 'Întrebări frecvente'], continut: ['preț clar „de la”', 'ce include', 'pachete și oferte cu termen', 'consultația ca prim pas, cu prețul ei'], cta: 'Programează consultația', metrica: 'rata de click pe „Programează-te”' },
  { id: 'programare', nume: 'Programare & vizită', intrebare: '„Cum mă programez repede? Unde vin, ce aduc?”', canal: 'formular, telefon, WhatsApp',
    pagini: ['Programare', 'Pregătirea vizitei', 'Contact'], continut: ['formular în 3 câmpuri', 'WhatsApp / telefon', 'ce se întâmplă după', 'hartă, parcare, program unic'], cta: 'Trimite cererea · Sună · WhatsApp', metrica: 'lead-uri (panoul Leads), rata de completare' },
  { id: 'dupa', nume: 'După tratament & revenire', intrebare: '„Ce fac după? Când revin? Pot lăsa o recenzie?”', canal: 'email / WhatsApp după vizită, ghiduri de îngrijire',
    pagini: ['Ghiduri de îngrijire', 'Oferte & abonamente', 'Recenzii'], continut: ['îngrijire după procedură', 'când revii (ex. Botox la 4–6 luni)', 'abonamente / pachete', 'cerere de recenzie'], cta: 'Reprogramează-te · Lasă o recenzie', metrica: 'pacienți care revin, recenzii noi' },
];

// ---------- șabloane de pagină (ordinea blocurilor urmează journey-ul) ----------
const sabloane = {
  tratament: [
    ['Hero', 'ce rezolvă tratamentul + „de la X lei” + Programează-te', 'explorare'],
    ['Pentru cine e (și pentru cine nu)', 'problemele rezolvate, cu link spre paginile de probleme', 'explorare'],
    ['Cum funcționează', 'pașii ședinței + video-ul existent (vezi Media › Video)', 'explorare'],
    ['Rezultate & durată', 'când se văd, cât țin, câte ședințe', 'explorare'],
    ['Siguranță & recuperare', 'riscuri, contraindicații, ce faci după (link spre ghidul de îngrijire)', 'incredere'],
    ['Medicul care îl face', 'card cu medicul + specializarea', 'incredere'],
    ['Prețuri', 'rândurile din /preturi/ pentru acest tratament + oferta activă', 'decizie'],
    ['Întrebări frecvente', 'validate în Entități, cu schema FAQPage', 'decizie'],
    ['Recenzii', 'recenzii care menționează tratamentul sau medicul', 'incredere'],
    ['Tratamente asociate', 'combinații frecvente (ex. Botox + acid hialuronic)', 'explorare'],
    ['Programare', 'formular scurt / WhatsApp, pe aceeași pagină', 'programare'],
  ],
  problema: [
    ['Hero', 'problema în cuvintele pacientului + „Vezi soluțiile”', 'constientizare'],
    ['De ce apare', 'cauze, pe scurt', 'constientizare'],
    ['Soluțiile MOA', 'cardurile tratamentelor potrivite, de la blând la intens, cu „de la X lei”', 'explorare'],
    ['Cum alegi', 'tabel comparativ: durată, rezultat, recuperare, preț', 'decizie'],
    ['Ghiduri', 'articolele despre problemă', 'constientizare'],
    ['Întrebări frecvente', '', 'decizie'],
    ['Consultație', '„Nu știi ce ți se potrivește? Începe cu o consultație”', 'decizie'],
  ],
  medic: [
    ['Prezentare', 'foto, specializare, grad, ce face în clinică', 'incredere'],
    ['Tratamentele pe care le face', 'linkuri spre paginile de tratament', 'explorare'],
    ['Formare & experiență', '', 'incredere'],
    ['Recenzii care îl menționează', '', 'incredere'],
    ['Programare la medic', '', 'programare'],
  ],
  acasa: [
    ['Hero', 'Global Antiaging în 1 frază + Programează-te + Ce te supără?', 'constientizare'],
    ['Ce te supără?', 'cele mai căutate 8 probleme, ca intrări rapide', 'constientizare'],
    ['Tratamente populare', 'Botox, acid hialuronic, epilare, Sculptra, Venus Viva…', 'explorare'],
    ['Longevitate', 'conceptul și programul', 'explorare'],
    ['Medici', 'echipa, cu specializările', 'incredere'],
    ['Recenzii', `${D.reputatie.trustindex?.recenzii || ''} recenzii Google`, 'incredere'],
    ['Ofertele lunii', '', 'decizie'],
    ['Programare + contact', 'formular, hartă, program unic', 'programare'],
  ],
};

// ---------- redirecturi 301 de la URL-urile actuale ----------
const redirecturi = [];
const addR = (vechi, nou, motiv) => { if (vechi && nou && vechi !== nou && !redirecturi.some((r) => r.vechi === vechi)) redirecturi.push({ vechi, nou, motiv }); };
(function walk(nodes) {
  for (const n of nodes) {
    for (const v of n.vechi || []) addR(v, n.url, n.tip);
    if (n.copii) walk(n.copii);
  }
})(arbore);
for (const c of D.categoriiServicii) if (c.url) {
  const p = path_(c.url);
  const m = { '/proceduri-minim-invazive/': '/tratamente/injectabile/', '/proceduri-microchirurgicale/': '/tratamente/chirurgie-dermatologie/', '/rejuvenare-faciala/': '/probleme/riduri-profunde-volum/', '/tratamente-corporale/': '/tratamente/aparatura/', '/teste-genetice-longevity/': '/tratamente/teste/', '/ozonoterapie/': '/tratamente/regenerare/', '/tratamente-regenerative-perfuzabile/': '/tratamente/regenerare/terapii-iv/' }[p];
  if (m) addR(p, m, 'categorie veche');
}
for (const a of D.articole) addR(path_(a.url), `/ghiduri/${a.id}/`, 'articol');
addR('/terapii-regenerative/', '/longevitate/', 'pagină concept');
for (const p of ['/echipa/dr-adrian-stanescu/', '/author/dr-adrian-stanescu/', '/author/moaclinic/']) addR(p, '/medici/adrian-stanescu/', 'profil medic');
for (const p of ['/sitemap/', '/confirmare/']) addR(p, p === '/sitemap/' ? '/' : '/programare/', 'pagină tehnică');
// URL-urile vechi care fac deja redirect: direct spre destinația finală, fără lanțuri
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'pages.json'), 'utf8'));
for (const l of pages.linkuri.filter((x) => x.status >= 300 && x.status < 400 && x.redirect)) {
  const final = redirecturi.find((r) => r.vechi === path_(l.redirect));
  if (final) addR(l.path, final.nou, 'redirect vechi, fără lanț');
}
const acoperite = new Set(redirecturi.map((r) => r.vechi));
const neacoperite = pages.pages.filter((p) => !acoperite.has(p.path) && !['/', '/preturi/', '/contact/', '/consultatii/'].includes(p.path)).map((p) => p.path);

const count = (nodes, f) => nodes.reduce((n, x) => n + (f(x) ? 1 : 0) + count(x.copii || [], f), 0);
const out = {
  meta: { generat: new Date().toISOString().slice(0, 10), sursa: 'data/entitati.json', nota: 'Propunere – de discutat. URL-urile noi sunt orientative; redirecturile se aplică la lansarea site-ului nou.' },
  principii: [
    'Pacientul pornește de la o problemă („am cearcăne”), nu de la numele unui produs („Jalupro”): meniul are două intrări paralele – „Ce te supără?” și „Tratamente”.',
    'Categoriile din limbajul clinicii („proceduri minim-invazive”, „microchirurgicale”) devin categorii pe care pacientul le înțelege („injectabile”, „cu aparatură”).',
    'Global Antiaging, diferențiatorul MOA, primește loc propriu în meniu (Longevitate), nu e împrăștiat în 4 categorii.',
    'Încrederea (medici, recenzii, tehnologie) stă la un click din orice pagină de tratament, nu doar în „Despre”.',
    'Un singur CTA principal, același text peste tot: Programează-te. Pe mobil: bară fixă Sună · WhatsApp · Programează-te.',
    'Prețul „de la” apare pe fiecare pagină de tratament și de problemă; lista completă rămâne pe /preturi/.',
    'Fiecare articol de blog se leagă de o problemă și de tratamentele ei, ca să ducă spre programare.',
    'URL-uri ierarhice și scurte (/tratamente/injectabile/botox/), cu redirect 301 de la fiecare URL actual.',
  ],
  etape,
  meniu,
  arbore,
  sabloane,
  redirecturi,
  neacoperite,
  statistici: {
    pagini_noi: count(arbore, (n) => n.url && n.tip !== 'grup'),
    probleme: PROBLEME.reduce((n, z) => n + z.items.length, 0),
    tratamente: TRATAMENTE.reduce((n, c) => n + c.items.length, 0),
    de_creat: count(arbore, (n) => n.nou),
    redirecturi: redirecturi.length,
    articole_legate: D.articole.length - rest.length,
  },
  avertismente: warn,
};
fs.writeFileSync(path.join(ROOT, 'data', 'structura.json'), JSON.stringify(out, null, 2));
console.log(`Gata: data/structura.json · ${out.statistici.pagini_noi} pagini · ${out.statistici.probleme} probleme · ${out.statistici.tratamente} tratamente · ${out.statistici.de_creat} de creat · ${redirecturi.length} redirecturi · ${neacoperite.length} URL-uri fără redirect`);
if (warn.length) console.log('Avertismente:\n  ' + warn.join('\n  '));
if (neacoperite.length) console.log('Fără redirect: ' + neacoperite.join(', '));
