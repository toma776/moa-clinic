// Randează data/entitati.json ca panou de administrare.
const $ = (s, el = document) => el.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const short = (u) => esc(String(u).replace(/^https?:\/\/(www\.)?moaclinic\.ro/, '') || '/');
const link = (u, label) => (u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${label ?? short(u)}</a>` : '—');
const lei = (n) => (n == null ? '—' : `${Number(n).toLocaleString('ro-RO')} lei`);
const tag = (t, c = '') => (t ? `<span class="tag ${c}">${esc(t)}</span>` : '');
const SEV = { mare: 'red', medie: 'amber', mică: 'blue' };

function section(id, title, hint, body) {
  return `<section class="block" id="${id}" data-section><header><h2>${title}</h2>${hint ? `<span class="hint">${hint}</span>` : ''}</header>${body}</section>`;
}
const kv = (rows) =>
  `<dl class="kv">${rows.filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && !v.length)).map(([k, v]) => `<dt>${esc(k)}</dt><dd class="item">${Array.isArray(v) ? v.join('<br>') : v}</dd>`).join('')}</dl>`;

function renderValue(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return `<ul>${v.map((x) => `<li>${typeof x === 'object' ? renderObj(x) : esc(x)}</li>`).join('')}</ul>`;
  if (typeof v === 'object') return renderObj(v);
  return esc(v);
}
const renderObj = (o) => Object.entries(o).filter(([k]) => k !== '@type').map(([k, v]) => `<b>${esc(k)}:</b> ${renderValue(v)}`).join(' · ');

function menuTree(nodes) {
  return `<ul class="tree">${nodes
    .map((n) => `<li class="item"><strong>${esc(n.nume)}</strong>${n.url ? `<span class="url">${link(n.url)}</span>` : ''}${n.copii ? menuTree(n.copii) : ''}</li>`)
    .join('')}</ul>`;
}

function render(d) {
  const b = d.brand;
  const c = d.contact;
  const nServPret = d.preturi.reduce((n, x) => n + x.servicii.length, 0);
  const issuesBig = d.inconsistente.filter((i) => i.severitate === 'mare').length;
  const countServicesMenu = (nodes) => nodes.reduce((n, x) => n + 1 + (x.copii ? countServicesMenu(x.copii) : 0), 0);
  const days = { Monday: 'Lu', Tuesday: 'Ma', Wednesday: 'Mi', Thursday: 'Jo', Friday: 'Vi', Saturday: 'Sâ', Sunday: 'Du' };

  const sections = [
    ['Brand', [
      ['prezentare', 'Prezentare', null],
      ['contact', 'Contact & NAP', null],
      ['reputatie', 'Social & reputație', d.social.length],
      ['afilieri', 'Afilieri', d.afilieri.length],
    ]],
    ['Oameni', [['echipa', 'Echipa', d.echipa.length]]],
    ['Ofertă', [
      ['servicii', 'Servicii (meniu)', countServicesMenu(d.categoriiServicii)],
      ['homepage', 'Evidențiate pe homepage', d.evidentiatePeHomepage.length],
      ['tehnologii', 'Tehnologii & aparatură', d.tehnologii.length],
      ['produse', 'Produse & mărci', d.produse.length],
      ['concepte', 'Concepte', (d.concepte || []).length],
      ['proprii', 'Produse proprii MOA', d.produseProprii.length],
      ['preturi', 'Prețuri', nServPret],
      ['oferte', 'Oferte & abonamente', d.oferte.length],
    ]],
    ['Web', [
      ['schema', 'Schema.org', d.schemaOrg.blocuri],
      ['pagini', 'Pagini', d.continut.pagini.length],
      ['blog', 'Articole blog', d.continut.articoleBlog.length],
      ['linkuri', 'Linkuri homepage', d.continut.linkuriHomepage.length],
    ]],
    ['Audit', [['inconsistente', 'Inconsistențe', d.inconsistente.length, issuesBig > 0]]],
  ];
  $('#nav').innerHTML = sections
    .map(([g, items]) => `<div class="group">${g}</div>` + items.map(([id, label, n, alert]) => `<a href="#${id}" data-nav="${id}">${label}${n != null ? `<span class="count ${alert ? 'alert' : ''}">${n}</span>` : ''}</a>`).join(''))
    .join('');

  $('#meta').textContent = `${b.nume} · extras din ${d.meta.sursa} la ${new Date(d.meta.generat).toLocaleString('ro-RO')}`;

  const kpis = [
    [d.echipa.length, 'membri echipă'],
    [d.categoriiServicii.length, 'categorii de servicii'],
    [nServPret, 'servicii cu preț'],
    [d.tehnologii.length, 'tehnologii'],
    [d.produse.length, 'produse & mărci'],
    [d.oferte.length, 'oferte active'],
    [d.inconsistente.length, `inconsistențe (${issuesBig} majore)`, issuesBig > 0],
  ];

  const html = [];
  html.push(`<div class="kpis">${kpis.map(([v, l, a]) => `<div class="panel kpi ${a ? 'alert' : ''}"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}</div>`);

  html.push(section('prezentare', 'Prezentare brand', 'Organizație', `<div class="panel pad">${kv([
    ['Nume oficial', `<strong>${esc(b.nume)}</strong>`],
    ['Nume scurt', esc(b.numeScurt)],
    ['Variante folosite', b.variante.map((v) => tag(v)).join(' ')],
    ['Brand părinte', `<strong>${esc(b.brandParinte.nume)}</strong> — <span class="hint">${esc(b.brandParinte.relatie)}</span>`],
    ['Tip entitate', b.tip.map((t) => tag(t, 'gold')).join(' ')],
    ['Poziționare', esc(b.pozitionare)],
    ['Descriere', esc(b.descriere)],
    ['Slogan', `<em>${esc(b.slogan)}</em>`],
    ['Concept', esc(b.concept)],
    ['Fondator', `<strong>${esc(b.fondator.nume)}</strong> — ${esc(b.fondator.rol)}`],
    ['Specialități medicale', b.specialitatiMedicale.map((s) => tag(s, 'blue')).join(' ')],
    ['Website', link(b.url, esc(b.url))],
    ['Logo', b.logo.map((u) => link(u, esc(u.split('/').pop()))).join(' · ')],
    ['Title SEO homepage', esc(b.titluSEO)],
    ['Site publicat / ultima modificare', `${esc(b.dataPublicareSite?.slice(0, 10))} / ${esc(b.ultimaModificareHomepage?.slice(0, 10))}`],
  ])}</div>`));

  const hoursRM = c.program['Rank Math'].map((h) => esc(h.replace(/Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday/, 'Lu–Du')));
  const hoursCustom = c.program.custom.map((s) => `${s.dayOfWeek.map((x) => days[x]).join(', ')} ${s.opens}–${s.closes}`);
  html.push(section('contact', 'Contact & NAP', 'Name · Address · Phone', `<div class="panel pad">${kv([
    ['Adresă', `${esc(c.adresa.streetAddress)}, ${esc(c.adresa.addressLocality)}, ${esc(c.adresa.addressCountry)}`],
    ['Telefon', c.telefon.map((t) => `<a href="tel:${esc(t)}">${esc(t)}</a>`)],
    ['Email', c.email.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`)],
    ['Google Maps', c.googleMaps.map((u) => link(u, esc(u)))],
    ['Coordonate', c.geo ? `${c.geo.latitude}, ${c.geo.longitude} ${tag('precizie redusă', 'amber')}` : null],
    ['Program (schema Rank Math)', hoursRM.map((h) => `${h} ${tag('conflict', 'red')}`)],
    ['Program (schema custom)', hoursCustom.map((h) => `${h} ${tag('conflict', 'red')}`)],
    ['Pagină contact', link(c.paginaContact)],
    ['Programare', esc(c.programareOnline)],
  ])}</div>`));

  const r = d.reputatie;
  html.push(section('reputatie', 'Social & reputație', null, `<div class="grid">
    ${d.social.map((s) => `<div class="panel card item"><h3>${esc(s.retea)}</h3><div class="role">${link(s.url, esc(s.url.replace(/^https:\/\/(www\.)?/, '')))}</div></div>`).join('')}
    ${r.trustindex ? `<div class="panel card item"><h3>Recenzii Google</h3><div class="role">${esc(r.trustindex.calificativ)} · ${r.trustindex.recenzii} recenzii (Trustindex)</div><div class="row">${tag('insignă verificată', 'green')}</div></div>` : ''}
    ${r.rating ? `<div class="panel card item"><h3>Rating în schema</h3><div class="role">${esc(r.rating.ratingValue)} / 5 · ${esc(r.rating.reviewCount)} recenzii</div><div class="row">${tag('diferă de Trustindex', 'amber')}</div></div>` : ''}
  </div>
  ${r.exempleRecenzii.length ? `<div class="panel" style="margin-top:10px"><div class="table-wrap"><table><thead><tr><th>Autor</th><th>Recenzie (homepage)</th></tr></thead><tbody>${r.exempleRecenzii.map((x) => `<tr class="item"><td>${esc(x.autor)}</td><td>${esc(x.text)}</td></tr>`).join('')}</tbody></table></div></div>` : ''}`));

  html.push(section('afilieri', 'Afilieri & entități asociate', null, `<div class="grid">${d.afilieri.map((a) => `<div class="panel card item"><h3>${esc(a.nume)}</h3><div class="role">${esc(a.tip)}</div></div>`).join('')}</div>`));

  const bySpec = {};
  d.echipa.forEach((p) => (bySpec[p.specialitate || 'Altele'] ??= []).push(p));
  html.push(section('echipa', 'Echipa', `${d.echipa.length} persoane · grupate pe specialitate`, Object.entries(bySpec).map(([spec, people]) => `
    <h3 style="margin:14px 0 8px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">${esc(spec)} · ${people.length}</h3>
    <div class="grid">${people.map((p) => `<div class="panel card item">
      <h3>${esc(p.nume)}</h3><div class="role">${esc(p.rol)}</div>
      <div class="row">${tag(p.tip, 'gold')}${tag(p.grad)}${p.surse.length < 2 ? tag('doar pe ' + p.surse[0], 'red') : tag('homepage + /echipa/', 'green')}</div>
      ${p.profil ? `<p>Profil: ${link(p.profil)}</p>` : ''}
    </div>`).join('')}</div>`).join('')));

  html.push(section('servicii', 'Servicii', 'Arborele din meniul site-ului', `<div class="panel pad">${menuTree(d.categoriiServicii)}</div>`));

  html.push(section('homepage', 'Evidențiate pe homepage', 'Acordeoanele din homepage, pe secțiuni', `<div class="grid">${d.evidentiatePeHomepage.map((a) => `<div class="panel card item">
    <h3>${esc(a.nume)}</h3><div class="role">${esc(a.sectiune)}</div><p>${esc(a.descriere.slice(0, 220))}${a.descriere.length > 220 ? '…' : ''}</p>
    <div class="row">${a.url ? link(a.url) : tag(a.butonFaraLink ? 'buton fără link' : 'fără link', 'red')}</div></div>`).join('')}</div>`));

  const prodCard = (t) => `<div class="panel card item"><h3>${esc(t.nume)}</h3><div class="role">${esc(t.tip)}</div>
    <div class="row">${t.producator ? tag(t.producator, 'gold') : ''}${tag(t.mentiuni + ' mențiuni')}${t.sursaProducator ? tag('producător de verificat', 'amber') : ''}</div>
    ${t.descriere ? `<p>${esc(t.descriere.slice(0, 200))}…</p>` : ''}${t.url ? `<p>${link(t.url)}</p>` : ''}</div>`;
  html.push(section('tehnologii', 'Tehnologii & aparatură', 'Mențiuni numărate pe homepage + /preturi/', `<div class="grid">${d.tehnologii.map(prodCard).join('')}</div>`));
  html.push(section('produse', 'Produse & mărci folosite', 'Producătorul e cunoaștere generală – nu apare pe site', `<div class="grid">${d.produse.sort((a, b) => b.mentiuni - a.mentiuni).map(prodCard).join('')}</div>`));

  html.push(section('concepte', 'Concepte de brand', 'Teme recurente în conținut · mențiuni pe homepage + /preturi/', `<div class="grid">${(d.concepte || []).sort((a, b) => b.mentiuni - a.mentiuni).map((t) => `<div class="panel card item"><h3>${esc(t.nume)}</h3><div class="role">${esc(t.tip)}</div><div class="row">${tag(t.mentiuni + ' mențiuni', 'gold')}</div></div>`).join('')}</div>`));

  html.push(section('proprii', 'Produse proprii MOA', 'Terapii intravenoase cu nume de brand', `<div class="panel"><div class="table-wrap"><table><thead><tr><th>Nume</th><th>Tip</th><th style="text-align:right">Preț</th></tr></thead><tbody>${d.produseProprii.map((p) => `<tr class="item"><td><strong>${esc(p.nume)}</strong></td><td>${esc(p.tip)}</td><td class="num">${lei(p.pret)}</td></tr>`).join('')}</tbody></table></div></div>`));

  const priceCell = (p) => p.map((x) => (x.valoare != null ? `<div>${lei(x.valoare)}${x.pretInitial ? `<span class="old">${lei(x.pretInitial)}</span>` : ''} <span class="tag">${esc(x.tip)}</span></div>` : `<div>${esc(x.text)}</div>`)).join('');
  html.push(section('preturi', 'Prețuri', `${d.preturi.length} categorii · ${nServPret} servicii · sursa /preturi/`, d.preturi.map((cat, i) => {
    const vals = cat.servicii.map((s) => s.preturi[0]?.valoare).filter((v) => v != null);
    const range = vals.length ? `${lei(Math.min(...vals))} – ${lei(Math.max(...vals))}` : '';
    return `<details class="acc panel" ${i === 0 ? 'open' : ''} data-group><summary><span class="t">${esc(cat.categorie)}</span><span class="meta">${cat.servicii.length} servicii · ${range}</span></summary>
      <div class="body table-wrap"><table><thead><tr><th>Serviciu</th><th>Subgrup</th><th style="text-align:right">Preț</th></tr></thead><tbody>
      ${cat.servicii.map((s) => `<tr class="item"><td>${esc(s.nume)}</td><td class="sub">${esc(s.subgrup || '')}</td><td class="num">${priceCell(s.preturi)}</td></tr>`).join('')}
      </tbody></table></div></details>`;
  }).join('')));

  html.push(section('oferte', 'Oferte & abonamente', 'sursa /abonamente/', `<div class="panel"><div class="table-wrap"><table><thead><tr><th>Ofertă</th><th>Grup</th><th style="text-align:right">Preț</th><th style="text-align:right">Inițial</th><th style="text-align:right">Reducere</th></tr></thead><tbody>
    ${d.oferte.map((o) => `<tr class="item"><td><strong>${esc(o.nume)}</strong>${o.detalii ? `<div class="sub">${esc(o.detalii)}</div>` : ''}</td><td class="sub">${esc(o.grup)}</td><td class="num">${lei(o.pret)}</td><td class="num">${lei(o.pretInitial)}</td><td class="num">${o.discountProcent != null ? tag('-' + o.discountProcent + '%', 'green') : '—'}</td></tr>`).join('')}
  </tbody></table></div></div>`));

  const s = d.schemaOrg;
  html.push(section('schema', 'Schema.org (JSON-LD)', `${s.blocuri} blocuri pe homepage`, `
    <div class="panel pad" style="margin-bottom:10px">${kv([
      ['Tipuri declarate', s.tipuri.map((t) => tag(t, 'gold')).join(' ')],
      ['Servicii marcate', s.servicii.map((x) => `${esc(x.nume)} ${tag(x.oferte + ' oferte')} ${x.url ? link(x.url) : ''}`)],
    ])}</div>
    <details class="acc panel"><summary><span class="t">JSON-LD brut</span><span class="meta">${s.blocuri} blocuri</span></summary><pre class="json">${esc(JSON.stringify(s.raw, null, 2))}</pre></details>`));

  const pagesTable = (rows, title) => `<div class="panel"><div class="table-wrap"><table><thead><tr><th>${title}</th><th>URL</th><th>Ultima modificare</th></tr></thead><tbody>${rows.map((p) => `<tr class="item"><td>${esc(p.titlu || short(p.url))}</td><td>${link(p.url)}</td><td class="sub">${esc((p.lastmod || '').slice(0, 10))}</td></tr>`).join('')}</tbody></table></div></div>`;
  html.push(section('pagini', 'Pagini', 'page-sitemap.xml', `<details class="acc panel" data-group><summary><span class="t">Toate paginile</span><span class="meta">${d.continut.pagini.length}</span></summary><div class="body">${pagesTable(d.continut.pagini, 'Pagină')}</div></details>`));
  html.push(section('blog', 'Articole blog', 'post-sitemap.xml · titlu derivat din URL', `<details class="acc panel" data-group><summary><span class="t">Toate articolele</span><span class="meta">${d.continut.articoleBlog.length}</span></summary><div class="body">${pagesTable(d.continut.articoleBlog, 'Articol')}</div></details>`));

  const lk = d.continut.linkuriHomepage;
  const st = (l) => (l.status >= 400 || !l.status ? tag(l.status || 'eroare', 'red') : l.status >= 300 ? tag(l.status, 'amber') : tag(l.status, 'green'));
  html.push(section('linkuri', 'Linkuri interne din homepage', `${lk.filter((l) => l.status >= 300).length} cu redirect / eroare`, `<details class="acc panel" data-group><summary><span class="t">Status HTTP</span><span class="meta">${lk.length} linkuri</span></summary><div class="body table-wrap"><table><thead><tr><th>Status</th><th>URL</th><th>Redirect către</th></tr></thead><tbody>
    ${[...lk].sort((a, b) => b.status - a.status).map((l) => `<tr class="item"><td>${st(l)}</td><td>${link(l.url)}</td><td class="sub">${l.redirect ? link(l.redirect) : ''}</td></tr>`).join('')}
  </tbody></table></div></details>`));

  html.push(section('inconsistente', 'Inconsistențe de entitate', 'Detectate automat la extracție', `<div class="panel">${d.inconsistente.map((i) => `<div class="issue item">
    <div>${tag(i.severitate, SEV[i.severitate])}</div><div class="zona">${esc(i.zona)}</div>
    <div>${esc(i.descriere)}${Object.keys(i.valori || {}).length ? `<div class="vals">${Object.entries(i.valori).map(([k, v]) => `<div><b>${esc(k)}:</b> ${renderValue(v)}</div>`).join('')}</div>` : ''}</div>
  </div>`).join('')}</div>`));

  html.push(`<div class="empty hidden" id="empty">Niciun rezultat pentru căutare.</div>`);
  $('#app').innerHTML = html.join('');
}

// ---------- Entități pe categorii (sertarul din stânga) ----------
const ACCENTS = {
  gold: '--accent:var(--gold);--accent-soft:var(--gold-soft)',
  blue: '--accent:var(--blue);--accent-soft:var(--blue-soft)',
  green: '--accent:var(--green);--accent-soft:var(--green-soft)',
  amber: '--accent:var(--amber);--accent-soft:var(--amber-soft)',
};
const e = (nume, sub, target, match) => ({ nume, sub, target, match: match || nume });

function entityCategories(d) {
  const b = d.brand;
  const c = d.contact;
  const groupBy = (arr, key) => arr.reduce((m, x) => ((m[key(x) || 'Altele'] ??= []).push(x), m), {});

  const team = groupBy(d.echipa, (p) => p.specialitate);
  const specialitati = [...new Set([...b.specialitatiMedicale, ...d.echipa.map((p) => p.specialitate).filter((s) => s && !/asisten/i.test(s))])];
  const oferte = groupBy(d.oferte, (o) => o.grup);
  const reviews = d.reputatie.trustindex;

  return [
    {
      id: 'organizatie', nume: 'Organizație', schema: 'MedicalClinic · Organization', ico: '🏛', accent: 'gold',
      desc: 'Entitatea principală și brandul părinte',
      grupuri: [
        { entitati: [e(b.nume, b.tip.join(' + '), 'prezentare'), e(b.brandParinte.nume, 'brand părinte', 'prezentare', 'Brand părinte')] },
        { titlu: 'Denumiri folosite', entitati: b.variante.filter((v) => v !== b.nume).map((v) => e(v, 'variantă', 'prezentare', 'Variante folosite')) },
      ],
    },
    {
      id: 'locatie', nume: 'Locație', schema: 'Place · PostalAddress', ico: '📍', accent: 'blue',
      desc: 'Unde se află clinica',
      grupuri: [{
        entitati: [
          e(`${c.adresa.streetAddress}, ${c.adresa.addressLocality}`, 'adresă', 'contact', c.adresa.streetAddress),
          e(c.adresa.addressLocality, 'oraș / zonă deservită', 'contact', c.adresa.streetAddress),
          ...(c.geo ? [e(`${c.geo.latitude}, ${c.geo.longitude}`, 'coordonate', 'contact', 'Coordonate')] : []),
          ...c.googleMaps.map((u) => e('Google Maps', 'pin', 'contact', 'Google Maps')),
        ],
      }],
    },
    {
      id: 'persoane', nume: 'Persoane', schema: 'Person · Physician', ico: '👤', accent: 'green',
      desc: 'Echipa medicală, grupată pe specialitate',
      grupuri: Object.entries(team).map(([spec, people]) => ({
        titlu: spec,
        entitati: people.map((p) => e(p.nume, p.grad ? p.grad.replace('Medic ', '') : p.rol, 'echipa')),
      })),
    },
    {
      id: 'specialitati', nume: 'Specialități medicale', schema: 'MedicalSpecialty', ico: '🩺', accent: 'blue',
      desc: 'Din schema.org și din echipă',
      grupuri: [{ entitati: specialitati.map((s) => e(s, b.specialitatiMedicale.includes(s) ? 'schema' : 'echipă', b.specialitatiMedicale.includes(s) ? 'prezentare' : 'echipa', b.specialitatiMedicale.includes(s) ? 'Specialități medicale' : s)) }],
    },
    {
      id: 'servicii', nume: 'Servicii & proceduri', schema: 'MedicalProcedure · Service', ico: '💉', accent: 'gold',
      desc: 'Din meniul site-ului, pe categorii',
      grupuri: d.categoriiServicii.map((cat) => ({
        titlu: cat.nume,
        entitati: (cat.copii?.length ? cat.copii : [cat]).map((s) => e(s.nume, null, 'servicii')),
      })),
    },
    {
      id: 'tehnologii', nume: 'Tehnologii & aparatură', schema: 'MedicalDevice', ico: '⚙️', accent: 'blue',
      desc: 'Echipamente folosite în clinică',
      grupuri: [{ entitati: d.tehnologii.map((t) => e(t.nume, t.producator, 'tehnologii')) }],
    },
    {
      id: 'produse', nume: 'Produse & mărci', schema: 'Product · Brand', ico: '🧴', accent: 'green',
      desc: 'Mărci terțe menționate',
      grupuri: [{ entitati: [...d.produse].sort((a, b) => b.mentiuni - a.mentiuni).map((p) => e(p.nume, p.producator, 'produse')) }],
    },
    {
      id: 'proprii', nume: 'Produse proprii MOA', schema: 'Product (brand MOA)', ico: '✦', accent: 'gold',
      desc: 'Terapii intravenoase cu nume de brand',
      grupuri: [{ entitati: d.produseProprii.map((p) => e(p.nume, lei(p.pret), 'proprii')) }],
    },
    {
      id: 'concepte', nume: 'Concepte', schema: 'DefinedTerm', ico: '💡', accent: 'amber',
      desc: 'Temele cu care se asociază brandul',
      grupuri: [{ entitati: [...(d.concepte || [])].sort((a, b) => b.mentiuni - a.mentiuni).map((t) => e(t.nume, `${t.mentiuni}×`, 'concepte')) }],
    },
    {
      id: 'oferte', nume: 'Oferte', schema: 'Offer', ico: '🏷', accent: 'amber',
      desc: 'Ofertele lunii și abonamente',
      grupuri: Object.entries(oferte).map(([g, list]) => ({ titlu: g, entitati: list.map((o) => e(o.nume, lei(o.pret), 'oferte')) })),
    },
    {
      id: 'catalog', nume: 'Catalog de prețuri', schema: 'OfferCatalog', ico: '📋', accent: 'gold',
      desc: 'Categoriile din /preturi/',
      grupuri: [{ entitati: d.preturi.map((p) => e(p.categorie, `${p.servicii.length} servicii`, 'preturi')) }],
    },
    {
      id: 'afilieri', nume: 'Afilieri & instituții', schema: 'Organization', ico: '🤝', accent: 'blue',
      desc: 'Entități externe asociate brandului',
      grupuri: [{ entitati: d.afilieri.map((a) => e(a.nume, a.tip.split(/[(–]/)[0].trim(), 'afilieri')) }],
    },
    {
      id: 'canale', nume: 'Canale digitale', schema: 'WebSite · SocialProfile', ico: '🌐', accent: 'green',
      desc: 'Prezența online a brandului',
      grupuri: [{
        entitati: [
          e(b.url.replace(/^https?:\/\//, ''), 'website', 'prezentare', 'Website'),
          ...d.social.map((s) => e(s.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), s.retea, 'reputatie', s.url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''))),
          ...(reviews ? [e('Google Reviews', `${reviews.recenzii} recenzii`, 'reputatie', 'Recenzii Google')] : []),
        ],
      }],
    },
  ].map((cat) => ({ ...cat, grupuri: cat.grupuri.filter((g) => g.entitati.length) })).filter((cat) => cat.grupuri.length);
}

function renderDrawer(d) {
  const cats = entityCategories(d);
  const total = cats.reduce((n, c) => n + c.grupuri.reduce((m, g) => m + g.entitati.length, 0), 0);
  $('#entities-count').textContent = total;
  $('#drawer-sub').textContent = `${total} entități în ${cats.length} categorii · click pe o entitate ca să sari la ea`;
  $('#cats').innerHTML = cats.map((c) => {
    const n = c.grupuri.reduce((m, g) => m + g.entitati.length, 0);
    return `<div class="cat" style="${ACCENTS[c.accent]}" data-cat="${c.id}">
      <div class="cat-head" role="button" tabindex="0" aria-expanded="true">
        <span class="cat-ico" aria-hidden="true">${c.ico}</span>
        <div><h3>${esc(c.nume)} <span class="n">${n}</span></h3><div class="schema">${esc(c.schema)}</div><div class="desc">${esc(c.desc)}</div></div>
        <span class="chev" aria-hidden="true">▾</span>
      </div>
      <div class="cat-body">${c.grupuri.map((g) => `<div class="cat-group">${g.titlu ? `<div class="cat-group-t">${esc(g.titlu)}</div>` : ''}<div class="chips">${g.entitati
        .map((x) => `<button type="button" class="chip" data-target="${x.target}" data-match="${esc(x.match)}">${esc(x.nume)}${x.sub ? ` <small>${esc(x.sub)}</small>` : ''}</button>`)
        .join('')}</div></div>`).join('')}</div>
    </div>`;
  }).join('');
}

function setDrawer(open) {
  const drawer = $('#drawer');
  const scrim = $('#scrim');
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  $('#open-entities').setAttribute('aria-expanded', String(open));
  if (open) {
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add('on'));
    setTimeout(() => $('#dq').focus(), 50);
  } else {
    scrim.classList.remove('on');
    setTimeout(() => (scrim.hidden = true), 200);
  }
}

function filterDrawer(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('#cats .cat').forEach((cat) => {
    const catMatch = !!q && cat.querySelector('.cat-head').textContent.toLowerCase().includes(q);
    let any = false;
    cat.querySelectorAll('.cat-group').forEach((g) => {
      let gAny = false;
      g.querySelectorAll('.chip').forEach((ch) => {
        const show = !q || catMatch || ch.textContent.toLowerCase().includes(q);
        ch.classList.toggle('hidden', !show);
        gAny ||= show;
      });
      g.classList.toggle('hidden', !gAny);
      any ||= gAny;
    });
    cat.classList.toggle('hidden', !any);
    if (q && any) cat.classList.remove('collapsed');
  });
}

// Sare la entitate în panoul principal și o evidențiază.
function jumpTo(target, match) {
  setDrawer(false);
  const q = $('#q');
  if (q.value) {
    q.value = '';
    search('');
  }
  const sec = document.getElementById(target);
  if (!sec) return;
  const m = match.toLowerCase();
  const el = [...sec.querySelectorAll('.item, details > summary, dt')].find((x) => x.textContent.toLowerCase().includes(m)) || sec;
  const det = el.closest('details');
  if (det) det.open = true;
  const row = el.matches('dt') ? el.nextElementSibling : el;
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  row.classList.remove('flash');
  void row.offsetWidth;
  row.classList.add('flash');
}

function initDrawer() {
  $('#open-entities').addEventListener('click', () => setDrawer(!$('#drawer').classList.contains('open')));
  $('#close-entities').addEventListener('click', () => setDrawer(false));
  $('#scrim').addEventListener('click', () => setDrawer(false));
  $('#dq').addEventListener('input', (ev) => filterDrawer(ev.target.value));
  $('#cats').addEventListener('click', (ev) => {
    const chip = ev.target.closest('.chip');
    if (chip) return jumpTo(chip.dataset.target, chip.dataset.match);
    const head = ev.target.closest('.cat-head');
    if (head) {
      const cat = head.parentElement;
      cat.classList.toggle('collapsed');
      head.setAttribute('aria-expanded', String(!cat.classList.contains('collapsed')));
    }
  });
  $('#cats').addEventListener('keydown', (ev) => {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('.cat-head')) {
      ev.preventDefault();
      ev.target.click();
    }
  });
}

// ---------- Căutare ----------
function search(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('.item').forEach((el) => el.classList.toggle('hidden', !!q && !el.textContent.toLowerCase().includes(q)));
  document.querySelectorAll('details[data-group]').forEach((det) => {
    const any = det.querySelector('.item:not(.hidden)');
    det.classList.toggle('hidden', !!q && !any);
    if (q && any) det.open = true;
  });
  let visible = 0;
  document.querySelectorAll('[data-section]').forEach((sec) => {
    const items = sec.querySelectorAll('.item');
    const show = !q || [...items].some((i) => !i.classList.contains('hidden'));
    sec.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  $('.kpis')?.classList.toggle('hidden', !!q);
  $('#empty').classList.toggle('hidden', !q || visible > 0);
}

// ---------- Navigare activă ----------
function spy() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === e.target.id));
    });
  }, { rootMargin: '-90px 0px -70% 0px' });
  document.querySelectorAll('[data-section]').forEach((s) => obs.observe(s));
}

fetch('/api/entitati')
  .then((r) => {
    if (!r.ok) throw new Error('Lipsește data/entitati.json – rulează: npm run extract');
    return r.json();
  })
  .then((d) => {
    render(d);
    renderDrawer(d);
    initDrawer();
    spy();
    const q = $('#q');
    q.addEventListener('input', () => search(q.value));
    document.addEventListener('keydown', (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        q.focus();
      }
      if ((e.key === 'e' || e.key === 'E') && !typing && !e.ctrlKey && !e.metaKey) setDrawer(!$('#drawer').classList.contains('open'));
      if (e.key === 'Escape') {
        if ($('#drawer').classList.contains('open')) return setDrawer(false);
        q.value = '';
        search('');
      }
    });
  })
  .catch((e) => {
    $('#app').innerHTML = `<div class="panel empty">${esc(e.message)}</div>`;
    $('#meta').textContent = 'Eroare la încărcare';
  });
