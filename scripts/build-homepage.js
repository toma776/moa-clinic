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
// paginile de tratament noi (/nou/tratamente/…), generate pentru tratamentele cu conținut în data/tratamente.json (npm run tratamente)
const TRD = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tratamente.json'), 'utf8')).tratamente; } catch { return {}; } })();
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
const NOU = new Set([...trNode.values()].map((x) => x.nod.url)); // URL-urile noi care există deja ca pagini
if (consHub) NOU.add(consHub.url);
NOU.add('/preturi/');
NOU.add('/video/');
const live = (id) => (trNode.has(id) ? '/nou' + trNode.get(id).nod.url : serv[id]?.url || ORIGIN);

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
      <div class="hero-top">
      <span class="eyebrow">MOA Regenerative by Oxxygene · București</span>
      <h1>Frumusețea vine din interior. <em>Și se desăvârșește aici.</em></h1>
      <a class="doc-chip" href="/nou/medici/adrian-stanescu/"><img src="/wp-content/uploads/2024/09/image00005-682x1024.jpeg" alt="" width="48" height="48" loading="lazy"><span><b>Dr. Adrian Stănescu</b>medic primar gerontolog · fondator</span></a>
      <div class="hero-cta">
        <a class="btn btn-gold arrow" href="#programare">Programează o consultație</a>
        <a class="btn btn-line" href="#ce-te-supara">Ce te supără?</a>
      </div>
      </div>
      <p class="lede">Prima clinică Global Antiaging din România: estetică medicală, chirurgie și regenerare celulară, sub coordonarea <a class="lede-link" href="/nou/medici/adrian-stanescu/">Dr. Adrian Stănescu</a>, medic primar gerontolog format la școala Ana Aslan.</p>
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
          <span class="meta"><span>${esc(trNode.get(s.id)?.nod.nume || serv[s.id]?.nume || '')}</span>${minPrice(s.id) ? `<span>de la <b>${lei(minPrice(s.id))}</b></span>` : ''}</span></div>
      </a>`).join('')}
    <p class="swipe-hint" aria-hidden="true">Glisează pentru mai multe →</p>
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
      <div class="direct"><a class="btn" href="tel:+40743056605">Sună: 0743 056 605</a><a class="btn" href="https://wa.me/40743056605">WhatsApp</a></div>
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
        const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nume: d.nume.trim(), telefon: d.telefon.trim(), email: (d.email || '').trim() || undefined, serviciu: d.serviciu || undefined, mesaj: (d.mesaj || '').trim() || undefined, sursa: 'Formular site' }) });
        if (!r.ok) throw new Error();
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
    <ul class="tr-arts">${arts.slice(0, 3).map((a) => `<li><a href="${esc(a.url)}"><small>${esc(a.tip)}</small><span>${esc(a.titlu)}</span></a></li>`).join('')}</ul>
  </div>
</section>` : ''}

${BOOK}${BOTTOM}`;
  const dir = path.join(ROOT, 'nou', 'medici', p.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
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
function trBlocks(bl) {
  return bl.map((b) => {
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
  const benefits = benList.length ? benList : benH3;
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
  const titleHtml = /\(([^)]+)\)$/.test(nod.nume) ? `${esc(nod.nume.replace(/\s*\([^)]+\)$/, ''))} <em>${esc(nod.nume.match(/\(([^)]+)\)$/)[1])}</em>` : esc(nod.nume);
  const book = BOOK.split(`<option>${nod.nume}</option>`).join(`<option selected>${nod.nume}</option>`);
  const urmeaza = consult ? [...trNode.entries()].filter(([x, l]) => !l.consult && (serv[x].medici || []).some((n) => (s.medici || []).includes(n))).map(([x]) => serv[x]).slice(0, 9) : [];
  const tVids = VID_ALL.filter((v) => v.pagini.some((p) => p.serviciu === id));
  const vidCards = tVids.map((v) => `<div class="v-card vp-card${VM[v.id]?.orientare === 'orizontal' ? ' wide' : ''}"><div class="vb"><video src="${esc(vSrc(v))}" preload="none" playsinline${vPoster(v) ? ` poster="${esc(vPoster(v))}"` : ''}></video><button class="play" type="button" aria-label="Pornește: ${esc(vTitle(v))}"><span>▶</span></button>${vDur(v) ? `<i class="vp-dur">${vDur(v)}</i>` : ''}</div><h3>${esc(vTitle(v))}</h3></div>`).join('');
  const vidBlock = tVids.length ? `<div class="tr-videos"><div class="tr-vh"><span class="eyebrow">Video din cabinet</span><a class="link-u" href="/nou/video/">Toate video-urile →</a></div><div class="vp-grid tr-vgrid">${vidCards}</div></div>` : '';
  const toc = [
    (whoItems.length || whoLede || whoMore.length) && ['#pentru-cine', 'Pentru cine'], steps.length && ['#cum-decurge', 'Cum decurge'], tVids.length && !steps.length && ['#video', 'Video'], showGal && ['#rezultate', 'Rezultate'],
    (sec('siguranta').length || sec('dupa').length) && ['#siguranta', 'Siguranță'], info.length && ['#pe-larg', 'Pe larg'], consult && (medici.length || urmeaza.length) && ['#medici', medici.length ? 'Cu cine' : 'Ce urmează'], hasPrices && ['#preturi', 'Prețuri'], t.faq.length && ['#intrebari', 'Întrebări'],
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
${TOP}<main>
<nav class="wrap crumbs" aria-label="Breadcrumb">${crumbs.map(([n, h]) => (h ? `<a href="${esc(h)}">${esc(n)}</a><span>›</span>` : `<span aria-current="page">${esc(n)}</span>`)).join('')}</nav>

<section class="pf-hero tr-hero">
  <div class="wrap pf-grid">
    <div class="pf-copy">
      <span class="eyebrow">${esc(cat.nume)}</span>
      <h1>${titleHtml}</h1>
      <p class="lede">${esc(lede)}</p>
      ${facts.length ? `<div class="pf-facts tr-facts">${facts.map((f) => `<div><b>${esc(f.v)}</b><span>${esc(f.l)}</span></div>`).join('')}</div>` : ''}
      <div class="hero-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(nod.nume)}">Programează-te</a><a class="btn btn-line" href="#preturi">Vezi prețurile</a></div>
    </div>
    ${t.hero ? `<div class="pf-photo tr-photo"><div class="frame"><img src="${esc(resized(t.hero))}" alt="${esc(nod.nume)} la MOA Clinic" fetchpriority="high"></div>${offer ? `<a class="tr-offer" href="#programare" data-srv="${esc(offerSrv)}" aria-label="Programează-te cu oferta lunii: ${esc(offerName)}, ${lei(offer.pret)}"><small>Oferta lunii · -${offer.discountProcent}%</small><b>${esc(offerName)}</b><span><s>${lei(offer.pretInitial)}</s> ${lei(offer.pret)}</span><i>Programează-te →</i></a>` : ''}</div>` : ''}
  </div>
</section>

${toc.length >= 3 ? `<nav class="tr-toc" aria-label="Pe această pagină"><div class="wrap">${toc.map(([h, n]) => `<a href="${h}">${n}</a>`).join('')}</div></nav>` : ''}

${whoItems.length || whoLede || whoMore.length ? `<section class="sec" id="pentru-cine">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">Pentru cine</span><h2 style="margin-top:18px">${zoneItems.length ? 'Unde <em>acționează</em>' : 'Când este <em>recomandat</em>'}</h2></div>${whoLede ? `<p class="lede">${esc(whoLede)}</p>` : ''}</div>
    ${whoCards ? `<div class="tr-zones">${zoneCards(whoItems).map((z, i) => `<div class="tr-zone"><span>${String(i + 1).padStart(2, '0')}</span><b>${esc(cap(z.t.replace(/[;.]$/, '')))}</b>${z.d ? `<p>${esc(cap(z.d.replace(/[;.]$/, '')))}</p>` : ''}</div>`).join('')}</div>` : whoItems.length ? `<ul class="tr-checks tr-who">${whoItems.map((x) => `<li>${esc(cap(x.replace(/[;.]$/, '')))}</li>`).join('')}</ul>` : ''}
    ${whoMore.length ? `<details class="tr-read tr-read-wide"><summary>Citește mai mult</summary><div class="pf-prose">${trBlocks(whoMore)}</div></details>` : ''}
  </div>
</section>` : ''}

${howBl.length || benefits.length ? `<section class="sec">
  <div class="wrap ${benefits.length ? 'pf-two tr-how' : 'tr-split'}">
    <div class="rv"><span class="eyebrow">${consult ? 'Despre consultație' : 'Cum acționează'}</span><h2 class="pf-h2">${esc(((h) => (h.length > 38 ? (consult ? ((x) => (x.length <= 38 ? x : 'Despre consultație'))(h.split(' și ')[0]) : 'Ce este și cum acționează') : h))((sec('ce-este')[0]?.titlu || (consult ? 'Despre consultație' : benefits.length && !howBl.length ? 'De ce să alegi acest tratament' : 'Ce este și cum acționează')).replace(/\?$/, '')))}</h2>
      ${howBl.length ? `<div class="pf-prose">${trBlocks(howBl.slice(0, 1))}${howBl.length > 1 ? `<details class="tr-read"><summary>Citește mai mult</summary>${trBlocks(howBl.slice(1))}</details>` : ''}</div>` : ''}</div>
    ${benefits.length ? `<aside class="pf-side rv"><h3>Beneficii</h3><ul class="tr-checks">${benefits.map((x) => `<li>${esc(cap(x.replace(/[;.]$/, '')))}</li>`).join('')}</ul></aside>` : ''}
  </div>
</section>` : ''}

${tVids.length && !steps.length ? `<section class="sec" id="video">
  <div class="wrap">
    <div class="sec-head split rv"><div><span class="eyebrow">În cabinet</span><h2 style="margin-top:18px">Vezi cum <em>decurge</em></h2></div><p class="lede">${tVids.length === 1 ? 'Un video scurt' : `${tVids.length} video-uri scurte`} din cabinetul MOA.</p></div>
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
    <div class="tr-safe">${safeCols.map((c) => `<div class="tr-safe-col"><h3>${esc(c.titlu)}</h3><div class="tr-dark">${trBlocks(c.blocuri)}</div></div>`).join('')}</div>
  </div>
</section>` : ''}

${info.length ? `<section class="sec" id="pe-larg">
  <div class="wrap tr-larg">
    <div class="sec-head rv"><span class="eyebrow">Pe larg</span><h2>Tot ce trebuie <em>să știi</em></h2></div>
    <div class="tr-faq tr-acc">${info.map((x, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(x.titlu)}</summary><div class="pf-prose">${trBlocks(x.blocuri)}</div></details>`).join('')}</div>
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
    <ul class="tr-arts">${arts.slice(0, 3).map((a) => `<li><a href="${esc(a.url)}"><small>${esc(a.tip)}</small><span>${esc(a.titlu)}</span></a></li>`).join('')}</ul></div>` : ''}
  </div>
</section>` : ''}

${book}
<script>
// cuprinsul: la click, ținta ajunge exact sub cuprins (în jos header-ul se ascunde, în sus reapare); secțiunea curentă e marcată
(() => {
  const toc = document.querySelector('.tr-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a')], secs = links.map((a) => document.querySelector(a.getAttribute('href')));
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
  fs.writeFileSync(path.join(dir, 'index.html'), page);
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
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  console.log(`Hub: nou/consultatii/ · ${cons.length} consultații`);
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
  fs.writeFileSync(path.join(ROOT, 'nou', 'preturi', 'index.html'), page);
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
  fs.writeFileSync(path.join(ROOT, 'nou', 'video', 'index.html'), page);
  console.log(`Video: nou/video/ · ${vids.length} video-uri · ${cats.length} categorii · ${Math.round(totalS / 60)} min`);
}
