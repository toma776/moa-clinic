// Homepage nou (propunere premium), generat din datele reale MOA: entitati.json + structura.json + fotografiile din site/.
// Scrie nou/index.html (servit la /nou/). Linkurile duc la paginile actuale de pe moaclinic.ro, până există site-ul nou.
// Rulare: npm run homepage
const fs = require('fs');
const path = require('path');
const { ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'structura.json'), 'utf8'));
const HOME = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const lei = (n) => `${Number(n).toLocaleString('ro-RO')} lei`;
const serv = Object.fromEntries(D.servicii.map((s) => [s.id, s]));
const minPrice = (id) => { const v = (serv[id]?.preturi || []).map((p) => p.valoare).filter((x) => x != null); return v.length ? Math.min(...v) : null; };
const live = (id) => serv[id]?.url || ORIGIN;

// URL nou -> URL actual (din arborele structurii), ca linkurile să meargă pe site-ul de azi
const newToOld = new Map();
(function walk(ns) { for (const n of ns) { if (n.url && n.vechi?.[0]) newToOld.set(n.url, ORIGIN + n.vechi[0]); if (n.copii) walk(n.copii); } })(S.arbore);
const toLive = (u) => newToOld.get(u) || null;
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
  { id: 'sculptra', wide: true, cat: 'Biostimulare', titlu: 'Sculptra: volum care se construiește în timp', text: 'Stimulează colagenul propriu pentru un lifting treptat, natural, care durează.', img: '/wp-content/uploads/2024/09/17-768x768.jpg' },
];

// citatul real al fondatorului, din pagina lui de profil (data/profiluri.json → echipa.profil_detaliat)
const FOUNDER_QUOTE = D.echipa.find((p) => /Stănescu/.test(p.nume))?.profil_detaliat?.citat || null;

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
const VID = ['dermalinfusion', 'epilare-definitiva-bucuresti', 'nutrigenetica-epigenetica']
  .map((sid) => D.video.find((v) => v.pagini.some((p) => p.serviciu === sid)))
  .filter(Boolean);

// oferte: cele mai mari reduceri din „Ofertele lunii”
const offers = D.oferte.filter((o) => o.pret && o.pretInitial).sort((a, b) => b.discountProcent - a.discountProcent).slice(0, 3);
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
  href: toLive(c.url) || (c.copii.find((t) => t.vechi?.[0]) ? ORIGIN + c.copii.find((t) => t.vechi?.[0]).vechi[0] : '#'),
  items: c.copii.map((t) => ({ nume: t.nume, sub: (t.continut?.tehnologii || []).filter((x) => !t.nume.toLowerCase().includes(x.toLowerCase().split(' ')[0])).slice(0, 2).join(' · '), pret: t.continut?.pret_de_la ?? null, href: t.vechi?.[0] ? ORIGIN + t.vechi[0] : '#programare' })),
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
  'Tratamente': (i) => tabbed(i, 'Categorii', catData, topOffer ? feature('/wp-content/uploads/2024/08/look-studio-HtXyytr9304-unsplash-768x512.jpg', 'Oferta lunii', `${esc(topOffer.nume.charAt(0) + topOffer.nume.slice(1).toLowerCase())}: <b>${lei(topOffer.pret)}</b> în loc de ${lei(topOffer.pretInitial)}.`, 'Rezervă oferta', '#programare') : ''),
  'Longevitate': (i, m) => simple(i, m, feature('/wp-content/uploads/2024/10/Dr.-Adrian-Stanescu-768x1060.jpeg', 'Global Antiaging', 'Programul coordonat de Dr. Adrian Stănescu, medic primar gerontolog, format la școala Ana Aslan.', 'Programează-te', '#programare')),
  'Prețuri': (i, m) => simple(i, m, feature(null, 'Ofertele lunii', offers.map((o) => `${esc(o.nume.charAt(0) + o.nume.slice(1).toLowerCase())} · <b>${lei(o.pret)}</b>`).join('<br>'), 'Toate ofertele', ORIGIN + '/abonamente/')),
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
<meta name="description" content="Prima clinică Global Antiaging din România: tratamente estetice, chirurgie și medicină regenerativă, făcute de medici, în Str. Ștefan Mihăileanu 35, București.">
<link rel="icon" href="/wp-content/uploads/2024/09/cropped-Instagram-logo-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/nou/style.css">
</head>
<body>

<div class="topbar"><div class="wrap">
  <span class="tb-left">Str. Ștefan Mihăileanu 35, București</span>
  <span class="tb-right"><a href="tel:+40743056605">0743 056 605</a><a href="https://wa.me/40743056605">WhatsApp</a><a href="mailto:office@moaclinic.ro">office@moaclinic.ro</a></span>
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
      <span class="eyebrow">MOA Regenerative by Oxxygene · București</span>
      <h1>Frumusețea vine din interior. <em>Și se desăvârșește aici.</em></h1>
      <p class="lede">Prima clinică Global Antiaging din România: estetică medicală, chirurgie și regenerare celulară, sub coordonarea <a class="lede-link" href="/nou/medici/adrian-stanescu/">Dr. Adrian Stănescu</a>, medic primar gerontolog format la școala Ana Aslan.</p>
      <div class="hero-cta">
        <a class="btn btn-gold arrow" href="#programare">Programează o consultație</a>
        <a class="btn btn-line" href="#ce-te-supara">Ce te supără?</a>
      </div>
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
    <div class="t"><b>Consultație medicală</b><span>înainte de orice procedură</span></div>
    <div class="t"><b>Medici, nu operatori</b><span>injectabilele sunt făcute de medic</span></div>
    <div class="t"><b>Aparatură de top</b><span>Splendor X · Venus · Dermapen 4</span></div>
    <div class="t"><b>Rezultate naturale</b><span>planuri personalizate, fără exces</span></div>
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
        <img src="${esc(s.img)}" alt="" loading="lazy">
        <div class="in"><span class="cat">${esc(s.cat)}</span><h3>${esc(s.titlu)}</h3><p>${esc(s.text)}</p>
          <span class="meta"><span>${esc(serv[s.id]?.nume || '')}</span>${minPrice(s.id) ? `<span>de la <b>${lei(minPrice(s.id))}</b></span>` : ''}</span></div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="sec philosophy">
  <div class="wrap grid">
    <div class="ph-img rv"><img src="/wp-content/uploads/2024/10/Dr.-Adrian-Stanescu-768x1060.jpeg" alt="Dr. Adrian Stănescu, fondatorul MOA Clinic" loading="lazy"></div>
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
      <a class="link-u" href="${esc(ORIGIN)}/terapii-regenerative/">Descoperă programul de longevitate</a>
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
    <div class="brands rv" aria-label="Mărci folosite">${['Restylane', 'Juvéderm', 'Stylage', 'Sculptra', 'HArmonyCa', 'Profhilo', 'Rejuran', 'Splendor X', 'Venus'].map((b) => `<span>${b}</span>`).join('')}</div>
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
    </div>
  </div>
</section>

<section class="sec inroom">
  <div class="wrap">
    <div class="sec-head split rv">
      <div><span class="eyebrow">În cabinet</span><h2 style="margin-top:22px">Vezi cum decurge <em>o ședință.</em></h2></div>
      <p class="lede">Fără surprize: înainte să vii, știi exact ce se întâmplă, cât durează și cum te simți.</p>
    </div>
    <div class="v-grid">${VID.map((v) => {
      const p = v.pagini[0];
      return `<div class="v-card rv"><div class="vb"><video src="${esc(v.url)}" preload="none" playsinline controls></video><button class="play" type="button" aria-label="Pornește video"><span>▶</span></button></div>
        <h3>${esc(p.sectiune || v.titlu)}</h3><p>${esc(serv[p.serviciu]?.nume || '')}</p></div>`; }).join('')}
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
      <a class="link-u" href="${esc(ORIGIN)}/abonamente/" style="justify-self:start">Toate ofertele</a>
    </div>
    <div class="o-grid">${offers.map((o) => `
      <div class="o-card rv"><span class="off">−${o.discountProcent}%</span><span class="eyebrow">${esc(o.grup === 'OFERTELE LUNII' ? 'Ofertă' : o.grup)}</span>
        <h3>${esc(o.nume.charAt(0) + o.nume.slice(1).toLowerCase())}</h3>
        <div class="price"><b>${lei(o.pret)}</b><s>${lei(o.pretInitial)}</s></div>
        <a class="link-u" href="#programare" style="justify-self:start;margin-top:10px">Rezervă</a></div>`).join('')}
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
      <div class="direct"><a class="btn" href="tel:+40743056605">Sună: 0743 056 605</a><a class="btn" href="https://wa.me/40743056605">WhatsApp</a></div>
    </div>
    <form class="booking rv" id="booking" novalidate>
      <h3>Cere o programare</h3>
      <div class="row2">
        <div class="field"><label for="f-nume">Nume</label><input id="f-nume" name="nume" autocomplete="name" required></div>
        <div class="field"><label for="f-tel">Telefon</label><input id="f-tel" name="telefon" type="tel" autocomplete="tel" required></div>
      </div>
      <div class="field"><label for="f-email">Email (opțional)</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
      <div class="field"><label for="f-srv">Ce te interesează?</label>
        <select id="f-srv" name="serviciu"><option value="">Nu știu încă – vreau o consultație</option>${S.arbore.find((n) => n.url === '/tratamente/').copii.map((c) => `<optgroup label="${esc(c.nume)}">${c.copii.filter((t) => t.continut).map((t) => `<option>${esc(t.nume)}</option>`).join('')}</optgroup>`).join('')}</select></div>
      <div class="field"><label for="f-msg">Mesaj (opțional)</label><textarea id="f-msg" name="mesaj" rows="2"></textarea></div>
      <label class="consent"><input type="checkbox" name="acord" required><span>Sunt de acord să fiu contactat(ă) de MOA Clinic pentru programare, conform <a href="${esc(ORIGIN)}/documente-legale-clinica-moa/" style="text-decoration:underline">politicii de confidențialitate</a>.</span></label>
      <button class="btn btn-gold arrow" type="submit" style="justify-self:start">Trimite cererea</button>
      <p class="form-msg" id="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
</main>

<footer>
  <div class="wrap top">
    <div class="brand"><img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA Clinic"><p>Estetică medicală, chirurgie și medicină regenerativă, într-un singur concept: Global Antiaging.</p></div>
    ${S.meniu.footer.map((f) => `<div><h4>${esc(f.titlu)}</h4><ul>${f.linkuri.map((l) => `<li><a href="${esc(/^https?:/.test(l.url) ? l.url : toLive(l.url) || '#')}">${esc(l.nume)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="wrap legal">
    <span>© ${new Date().getFullYear()} MOA Clinic · ${legal.map((f) => esc(f.nume) + (f.cui ? ` (CUI ${esc(f.cui)})` : '')).join(' · ')}</span>
    <span>Str. Ștefan Mihăileanu 35, București · 0743 056 605 · office@moaclinic.ro</span>
  </div>
</footer>

<nav class="mbar" aria-label="Acțiuni rapide"><a href="tel:+40743056605">Sună</a><a href="https://wa.me/40743056605">WhatsApp</a><a href="#programare">Programează-te</a></nav>
<div class="proto">Propunere de homepage · <a href="/">vezi homepage-ul actual</a></div>

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
  document.querySelectorAll('.v-card').forEach((c) => c.querySelector('.play').addEventListener('click', () => { const v = c.querySelector('video'); c.classList.add('playing'); v.play(); }));

  // apariție la scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));

  // formular -> lead în panou (POST /api/leads)
  const f = document.getElementById('booking'), msg = document.getElementById('form-msg');
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    if (!d.nume.trim() || !d.telefon.trim()) { msg.className = 'form-msg err'; msg.textContent = 'Completează numele și telefonul.'; return; }
    if (!d.acord) { msg.className = 'form-msg err'; msg.textContent = 'Bifează acordul pentru a putea fi contactat(ă).'; return; }
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nume: d.nume.trim(), telefon: d.telefon.trim(), email: d.email.trim() || undefined, serviciu: d.serviciu || undefined, mesaj: d.mesaj.trim() || undefined, sursa: 'Formular site' }) });
      if (!r.ok) throw new Error();
      f.reset(); msg.className = 'form-msg ok'; msg.textContent = 'Mulțumim! Te sunăm în curând pentru confirmare.';
    } catch { msg.className = 'form-msg err'; msg.textContent = 'Nu am putut trimite cererea. Sună-ne la 0743 056 605.'; }
    btn.disabled = false;
  });
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.join(ROOT, 'nou'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'nou', 'index.html'), html);
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
      <div class="pf-facts">${pr.cifre.map((c) => `<div><b>${esc(c.valoare)}</b><span>${esc(c.eticheta)}</span></div>`).join('')}</div>
      <div class="hero-cta"><a class="btn btn-gold arrow" href="#programare">Programează o consultație</a>${allArts.length ? `<a class="btn btn-line" href="#articole">${allArts.length} articole</a>` : ''}</div>
    </div>
    ${photo ? `<div class="pf-photo"><div class="frame"><img src="${esc(photo)}" alt="${esc(p.nume)}" fetchpriority="high"></div></div>` : ''}
  </div>
</section>

${pr.citat ? `<section class="pf-quote"><div class="wrap"><blockquote>„${esc(pr.citat)}”<cite>${esc(p.nume)} · filosofia sa medicală</cite></blockquote></div></section>` : ''}

<section class="sec">
  <div class="wrap pf-two">
    <div class="rv"><span class="eyebrow">În cuvintele lui</span><h2 class="pf-h2">Povestea</h2>
      <div class="pf-prose">${[...pr.biografie, ...(pr.formare || []), ...(pr.viziune || []).slice(0, 3)].map((t) => `<p>${esc(t)}</p>`).join('')}</div></div>
    <aside class="pf-side rv">
      <h3>Domenii de expertiză</h3>${list(pr.expertiza)}
      ${pr.rol_moa?.length ? `<h3>Rolul în MOA</h3>${list(pr.rol_moa)}` : ''}
      ${pr.programe?.length ? `<h3>Programe coordonate</h3>${list(pr.programe)}` : ''}
    </aside>
  </div>
</section>

${servP.length ? `<section class="sec" style="background:var(--cream)">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">La MOA</span><h2 style="margin-top:22px">Tratamente din <em>specialitatea lui</em></h2></div><p class="lede">Serviciile clinicii pe care le coordonează, cu prețul de pornire din lista de prețuri.</p></div>
    <div class="mm-grid pf-serv">${servP.map((s) => `<a class="mm-card" href="${esc(s.url)}"><b>${esc(prettyName(s.nume))}</b><span>${esc(prettyName(s.categorie))}</span>${minPrice(s.id) ? `<em><small>de la</small>${lei(minPrice(s.id))}</em>` : '<em>→</em>'}</a>`).join('')}</div>
  </div>
</section>` : ''}

<section class="sec">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Parcurs</span><h2>Formare și <em>experiență</em></h2></div>
    <ol class="pf-timeline">${timeline.map((t) => `<li class="rv"><span class="pf-per">${esc(t.per || '')}</span><div><small>${esc(t.tip)}</small><p>${esc(t.text)}</p></div></li>`).join('')}</ol>
  </div>
</section>

<section class="sec safety">
  <div class="wrap pf-three">
    ${pr.carti.length ? `<div class="rv"><span class="eyebrow light">Autor</span><h3 class="pf-h3">Cărți</h3>${pr.carti.map((c) => `<div class="pf-book"><b>${esc(c.titlu)}</b><span>${esc([c.editura && !/www\./.test(c.editura) ? 'Editura ' + c.editura : c.editura ? 'carte digitală · ' + c.editura : '', c.an].filter(Boolean).join(' · '))}</span>${c.descriere ? `<p>${esc(c.descriere)}</p>` : ''}</div>`).join('')}</div>` : ''}
    ${pr.membru_in.length ? `<div class="rv"><span class="eyebrow light">Afilieri</span><h3 class="pf-h3">Membru în</h3>${list(pr.membru_in.map((n) => n.replace(/^Societății/, 'Societatea')), 'light')}${(pr.activitate || []).filter((l) => !/pacienți/.test(l)).map((l) => `<p class="pf-note">${esc(l)}</p>`).join('')}</div>` : ''}
    ${pr.distinctii.length ? `<div class="rv"><span class="eyebrow light">Recunoaștere</span><h3 class="pf-h3">Distincții</h3>${pr.distinctii.map((d) => `<div class="pf-award"><span>${esc(d.an || '')}</span><p>${esc(d.titlu)}</p></div>`).join('')}</div>` : ''}
  </div>
</section>

${arts.length ? `<section class="sec" id="articole">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Articole</span><h2 style="margin-top:22px">Scrise de <em>${esc(p.nume)}</em></h2></div><a class="link-u" href="${esc(pr.url)}" style="justify-self:start">Toate cele ${allArts.length} de articole</a></div>
    <div class="o-grid">${arts.map((a) => `<a class="o-card rv" href="${esc(a.url)}"><span class="eyebrow">${esc(a.tip)}</span><h3 style="font-size:24px;max-width:none">${esc(a.titlu)}</h3>${a.rezumat ? `<p style="font-size:14px;color:var(--muted)">${esc(cutTxt(a.rezumat, 140))}</p>` : ''}<span class="link-u" style="justify-self:start">Citește</span></a>`).join('')}</div>
  </div>
</section>` : ''}

${BOOK}${BOTTOM}`;
  const dir = path.join(ROOT, 'nou', 'medici', p.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  console.log(`Profil: nou/medici/${p.id}/ · ${timeline.length} repere · ${pr.carti.length} cărți · ${servP.length} servicii · ${allArts.length} articole`);
}
