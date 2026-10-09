/* ENTITĂȚI: categorii -> grupuri -> entități, cu pagina pe care apare fiecare (/manage/entitati[/categorie[/grup]]). */

// tipurile de articole, în ordinea afișării: [eticheta, slug în URL, clasa etichetei]
// grupuri care descriu entitățile (prețuri, afirmații, cifre, promisiuni), dar nu sunt entități: nu intră în total
const ATRIBUTE = new Set(['lista_preturi', 'fapte', 'valoare', 'cifre']);

const ART_TYPES = [['ghid', 'ghid', ''], ['tratament', 'tratament', 'ok'], ['îngrijire', 'ingrijire', 'warn'], ['comparație', 'comparatie', 'grey'], ['opinii', 'opinii', 'bad']];
const tipLabel = (t) => (t ? t[0].toUpperCase() + t.slice(1) : 'Ghid');
const initials = (n) => n.replace(/^Dr\.\s*/, '').split(/\s+/).map((x) => x[0]).slice(0, 2).join('');
const SPEC_ORDER = ['Gerontologie', 'Chirurgie plastică', 'Dermatovenerologie', 'Estetică facială și corporală', 'Asistență medicală'];
const specId = (s) => 'spec_' + String(s || 'altele').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, '_');
const srvId = (c) => 'srv_' + c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');
const prettyCat = (c) => (c === c.toUpperCase() ? c[0] + c.slice(1).toLowerCase() : c);

function entitySections(D) {
  const B = D.brand, S = {};
  const add = (id, title, count, html) => (S[id] = { id, title, count, html });
  const servById = Object.fromEntries(D.servicii.map((s) => [s.id, s]));
  const kvRow = (k, v) => (v ? `<dt>${esc(k)}</dt><dd data-s>${v}</dd>` : '');

  // ---- MOA Clinic ----
  add('identitate', 'Identitate', null, `<div class="card"><dl class="kv">
    ${kvRow('Nume brand', `<b>${esc(B.nume)}</b>`)}
    ${kvRow('Variante nume', tags(B.variante, ''))}
    ${kvRow('Firme (documente legale)', (D.legal?.firme || []).map((f) => `<b>${esc(f.nume)}</b>${f.cui ? ` · CUI ${esc(f.cui)}` : ''}${f.registru ? ` · ${esc(f.registru)}` : ''}<div class="muted small">${esc(f.adresa)}</div>`).join(''))}
    ${kvRow('Brand părinte', `<b>${esc(B.brandParinte.nume)}</b> <span class="muted small">— ${esc(B.brandParinte.relatie)}</span>`)}
    ${kvRow('Tip entitate', tags(B.tip, '') + ' <span class="tag ok">schema propusă: MedicalClinic</span>')}
    ${kvRow('Poziționare', esc(B.pozitionare))}
    ${kvRow('Slogan', `<em>${esc(B.slogan)}</em>`)}
    ${kvRow('Concept', esc(B.concept))}
    ${kvRow('Fondator', `<b>${esc(B.fondator.nume)}</b> · ${esc(B.fondator.rol)}`)}
    ${kvRow('Specialități', tags(B.specialitatiMedicale, ''))}
    ${kvRow('Meta title', esc(B.titluSEO))}
    ${kvRow('Meta description', esc(B.descriere))}
    ${kvRow('Site publicat / modificat', `${esc((B.dataPublicareSite || '').slice(0, 10))} / ${esc((B.ultimaModificareHomepage || '').slice(0, 10))}`)}
  </dl></div>`);

  const fapte = B.fapte_site || [];
  const teme = [...new Set(fapte.map((f) => f.tema))];
  add('fapte', 'Ce spune site-ul despre MOA', fapte.length, `<div class="tbl"><table>
    <thead><tr><th>Afirmație</th><th>Pagini</th></tr></thead><tbody>
    ${teme.map((t) => `<tr class="row-group"><td colspan="2">${esc(t)}</td></tr>` + fapte.filter((f) => f.tema === t).map((f) => `<tr data-s><td>${esc(f.fapt)}</td><td class="small" style="min-width:180px">${src(f.surse)}</td></tr>`).join('')).join('')}
    </tbody></table></div>`);

  add('valoare', 'Propunerea de valoare', (B.propunere_valoare || []).length, `<div class="card"><ul class="clean">${(B.propunere_valoare || []).map((v) => `<li data-s>${esc(v)}</li>`).join('')}</ul></div>`);

  const C = D.contact;
  add('contact', 'Contact & profile', null, `<div class="card"><dl class="kv">
    ${kvRow('Adresă', `${esc(C.adresa.streetAddress)}, ${esc(C.adresa.addressLocality)} ${link(C.googleMaps[0], 'Google Maps')}`)}
    ${kvRow('Telefon', C.telefon.map((t) => `<a href="tel:${esc(t)}">${esc(t)}</a>`).join(', '))}
    ${kvRow('Email', C.email.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(', '))}
    ${kvRow('Coordonate', C.geo ? `${C.geo.latitude}, ${C.geo.longitude} <span class="tag warn">2 zecimale</span>` : '')}
    ${kvRow('Program (Rank Math)', esc(C.program['Rank Math'].join('; ')) + ' <span class="tag bad">conflict</span>')}
    ${kvRow('Program (schema custom)', esc(C.program.custom.map((s) => `${s.dayOfWeek.join(', ')} ${s.opens}–${s.closes}`).join('; ')) + ' <span class="tag bad">conflict</span>')}
    ${kvRow('Social', D.social.map((s) => link(s.url, `${s.retea} · ${shortUrl(s.url).replace(/^https:\/\/(www\.)?/, '')}`)).join('<br>'))}
    ${kvRow('Recenzii', D.reputatie.trustindex ? `${D.reputatie.trustindex.recenzii} Google (Trustindex) · schema: ${D.reputatie.rating?.ratingValue} / ${D.reputatie.rating?.reviewCount}` : '')}
    ${kvRow('Logo', B.logo.map((u) => link(u, u.split('/').pop())).join(' · '))}
  </dl></div>`);

  add('concepte', 'Concepte de brand', (D.concepte || []).length, `<div class="grid">${(D.concepte || []).slice().sort((a, b) => b.mentiuni - a.mentiuni).map((c) => `
    <div class="card" data-s><h3>${esc(c.nume)}</h3><p>${esc(c.tip)}</p><p>${tags([`${c.mentiuni} mențiuni pe homepage + prețuri`], '')}</p>${src(c.surse)}</div>`).join('')}</div>`);


  add('relatii', 'Graf de relații', null, `<div class="card tree">
    <details open><summary><b>${esc(B.nume)}</b> <span class="muted">— MedicalClinic, ${esc(D.contact.adresa.addressLocality)}</span></summary>
      <details><summary>parte din → <b>${esc(B.brandParinte.nume)}</b></summary><div class="muted small">${esc(B.brandParinte.relatie)}</div></details>
      <details><summary>operată de → <b>Firme</b> (${(D.legal?.firme || []).length})</summary>${(D.legal?.firme || []).map((f) => `<div>${esc(f.nume)} <span class="muted small">${esc(f.adresa)}</span></div>`).join('')}</details>
      <details open><summary>condusă de → <b>${esc(B.fondator.nume)}</b></summary><div class="muted small">${esc(B.fondator.rol)}</div></details>
      <details><summary>angajează → <b>Echipa</b> (${D.echipa.length})</summary>${SPEC_ORDER.map((s) => { const P = D.echipa.filter((p) => p.specialitate === s); return P.length ? `<details><summary>${esc(s)} · ${P.length}</summary>${P.map((p) => `<div>${esc(p.nume)} <span class="muted small">${esc(p.rol)}</span></div>`).join('')}</details>` : ''; }).join('')}</details>
      <details><summary>oferă → <b>Servicii</b> (${D.servicii.length})</summary>${[...new Set(D.servicii.map((s) => s.categorie))].map((c) => `<details><summary>${esc(c)}</summary>${D.servicii.filter((s) => s.categorie === c).map((s) => `<div>${esc(s.nume)}${s.tehnologii.length || s.produse.length ? ` <span class="muted small">cu ${esc([...s.tehnologii, ...s.produse].join(', '))}</span>` : ''}</div>`).join('')}</details>`).join('')}</details>
      <details><summary>folosește → <b>Tehnologii</b> (${D.tehnologii.length}) și <b>mărci</b> (${D.produse.length})</summary>${[...D.tehnologii, ...D.produse].map((t) => `<div>${esc(t.nume)}${t.producator ? ` <span class="muted small">${esc(t.producator)}</span>` : ''}</div>`).join('')}</details>
      <details><summary>localizată în → <b>${esc(D.contact.adresa.streetAddress)}, ${esc(D.contact.adresa.addressLocality)}</b></summary><div>${esc(D.contact.geo?.latitude)}, ${esc(D.contact.geo?.longitude)}</div></details>
      <details><summary>sameAs → <b>Profile</b> (${D.social.length})</summary>${D.social.map((s) => `<div>${link(s.url, s.retea + ' · ' + shortUrl(s.url))}</div>`).join('')}</details>
      <details><summary>recomandată de → <b>Pacienți</b> (${D.dovezi.testimoniale.length})</summary>${D.dovezi.testimoniale.map((t) => `<div>${esc(t.persoana)}${t.medic ? ` → ${esc(t.medic)}` : ''}</div>`).join('')}</details>
    </details></div>`);

  // ---- Echipa: pe specialități ----
  const personCard = (p) => {
    const servPage = (p.servicii || []).map((id) => servById[id]?.nume).filter(Boolean);
    const servSpec = D.servicii.filter((s) => (s.medici || []).includes(p.nume)).map((s) => s.categorie);
    return `<div class="card" data-s><div class="person"><span class="avatar">${esc(initials(p.nume))}</span><div>
      <h3>${esc(p.nume)}</h3><p>${esc(p.rol)}</p>
      <p>${tags([p.tip, p.grad].filter(Boolean), '')}${teamPageTag(p)}</p>
      ${servPage.length ? `<p class="small">Menționat(ă) pe: ${tags(servPage.map(prettyCat), '')}</p>` : ''}
      ${servSpec.length ? `<p class="small">După specialitate: ${tags([...new Set(servSpec)].map(prettyCat))}</p>` : ''}
      ${p.profil ? `<p class="small">${link(p.profil, 'profil')}</p>` : ''}
      ${profileBlock(p.profil_detaliat)}
      ${src(p.surse)}</div></div></div>`;
  };
  // profilul complet (din pagina de profil / autor), dacă există
  const profileBlock = (pr) => {
    if (!pr) return '<p class="small muted">Fără profil detaliat pe site.</p>';
    const ul = (a) => `<ul class="clean small">${a.map((x) => `<li>${esc(typeof x === 'string' ? x : x.text || x.titlu)}${x.an || x.perioada ? ` <span class="muted">${esc(x.an || x.perioada)}</span>` : ''}${x.editura ? ` <span class="muted">· ${esc(x.editura)}</span>` : ''}</li>`).join('')}</ul>`;
    const part = (t, a) => (a?.length ? `<h4 class="bh4">${esc(t)} <span class="muted">${a.length}</span></h4>${ul(a)}` : '');
    return `<details class="src" style="margin-top:10px"><summary style="display:inline">profil complet: ${pr.cifre.map((c) => `${c.valoare} ${c.eticheta}`).join(' · ')}</summary>
      <div style="margin-top:6px">
        ${pr.citat ? `<p class="bquote small">„${esc(pr.citat)}”</p>` : ''}
        ${pr.rezumat ? `<p class="small">${esc(pr.rezumat)}</p>` : ''}
        ${part('Expertiză', pr.expertiza)}${part('Cărți', pr.carti)}${part('Funcții', pr.functii)}${part('Supraspecializări', pr.supraspecializari)}
        ${part('Membru în', pr.membru_in)}${part('Distincții', pr.distinctii)}${part('Programe coordonate', pr.programe)}${part('Rol în MOA', pr.rol_moa)}
        <p class="small muted">Sursa: ${link(pr.url)}</p>
      </div></details>`;
  };
  for (const s of [...SPEC_ORDER, ...new Set(D.echipa.map((p) => p.specialitate).filter((x) => !SPEC_ORDER.includes(x)))]) {
    const P = D.echipa.filter((p) => p.specialitate === s);
    if (P.length) add(specId(s), s, P.length, `<div class="grid">${P.map(personCard).join('')}</div>`);
  }

  // ---- Servicii: pe categoriile din meniu ----
  const servDetail = (s) => {
    const prices = s.preturi.filter((p) => p.valoare != null).map((p) => p.valoare);
    return `<details class="item" data-s>
      <summary><span class="name">${esc(prettyCat(s.nume))}</span><span>${prices.length ? `<span class="tag">de la ${lei(Math.min(...prices))}</span>` : '<span class="tag warn">fără preț</span>'}${s.intrebari ? `<span class="tag grey">${s.intrebari} întrebări</span>` : ''}${s.cuvinte ? `<span class="tag ${s.cuvinte < 250 ? 'warn' : 'grey'}">${s.cuvinte} cuvinte</span>` : ''}</span></summary>
      <div class="item-body">
        ${s.h1 ? `<p><b>H1:</b> ${esc(s.h1)}</p>` : ''}
        ${s.descriere ? `<p class="muted">${esc(s.descriere)}</p>` : ''}
        ${s.tehnologii.length || s.produse.length ? `<h4>Tehnologii și produse menționate</h4>${tags(s.tehnologii, '')}${tags(s.produse)}` : ''}
        ${s.concepte.length ? `<h4>Concepte</h4>${tags(s.concepte, 'warn')}` : ''}
        ${s.medici?.length ? `<h4>Medici (după specialitate)</h4>${tags(s.medici, 'ok')}` : ''}
        ${s.echipa.length ? `<h4>Oameni menționați pe pagină</h4>${tags(s.echipa)}` : ''}
        ${s.preturi.length ? `<h4>Prețuri din /preturi/</h4><div class="tbl"><table><tbody>${s.preturi.map((p) => `<tr><td>${esc(p.nume)}<div class="muted small">${esc(prettyCat(p.categorie))}</div></td><td class="num">${lei(p.valoare)}</td></tr>`).join('')}</tbody></table></div>` : ''}
        <h4>Linkuri</h4><p class="small">${link(s.url, 'pagina serviciului')}</p>
        ${src(s.surse)}
      </div></details>`;
  };
  for (const c of [...new Set(D.servicii.map((s) => s.categorie))]) {
    const L = D.servicii.filter((s) => s.categorie === c);
    add(srvId(c), prettyCat(c), L.length, L.map(servDetail).join(''));
  }

  // ---- Tehnologii & produse ----
  const prodCard = (t) => `<div class="card" data-s><h3>${esc(t.nume)}</h3><p>${esc(t.tip)}</p>
    <p>${t.producator ? `<span class="tag">${esc(t.producator)}</span>` : ''}${t.sursaProducator ? '<span class="tag warn">producător de verificat</span>' : ''}</p>
    ${t.servicii?.length ? `<p class="small">Pe paginile: ${tags(t.servicii.map((id) => servById[id]?.nume || id), '')}</p>` : ''}
    ${t.descriere ? `<p class="small">${esc(cut(t.descriere, 220))}</p>` : ''}
    ${src(t.surse)}</div>`;
  add('tehnologii', 'Tehnologii & aparatură', D.tehnologii.length, `<div class="grid">${D.tehnologii.map(prodCard).join('')}</div>`);
  add('produse', 'Mărci folosite', D.produse.length, `<p class="lead">Producătorii nu apar pe site: sunt cunoaștere generală, de confirmat cu clinica.</p><div class="grid">${D.produse.slice().sort((a, b) => (b.surse?.length || 0) - (a.surse?.length || 0)).map(prodCard).join('')}</div>`);
  add('proprii', 'Produse proprii MOA', D.produseProprii.length, `<div class="tbl"><table><thead><tr><th>Produs</th><th>Tip</th><th class="num">Preț</th></tr></thead><tbody>
    ${D.produseProprii.map((p) => `<tr data-s><td><b>${esc(p.nume)}</b></td><td class="small">${esc(p.tip)}</td><td class="num">${lei(p.pret)}</td></tr>`).join('')}</tbody></table></div>`);

  // ---- Prețuri & oferte ----
  const nPrice = D.preturi.reduce((n, c) => n + c.servicii.length, 0);
  const priceCell = (P) => P.map((x) => (x.valoare != null ? `<div>${lei(x.valoare)}${x.pretInitial ? ` <s class="muted small">${lei(x.pretInitial)}</s>` : ''} <span class="tag grey">${esc(x.tip)}</span></div>` : `<div>${esc(x.text)}</div>`)).join('');
  add('lista_preturi', 'Lista de prețuri', nPrice, D.preturi.map((c) => {
    const v = c.servicii.map((s) => s.preturi[0]?.valoare).filter((x) => x != null);
    return `<details class="item" data-s-group><summary><span class="name">${esc(prettyCat(c.categorie))}</span><span><span class="tag grey">${c.servicii.length} servicii</span>${v.length ? `<span class="tag">${lei(Math.min(...v))} – ${lei(Math.max(...v))}</span>` : ''}</span></summary>
      <div class="item-body" style="padding-top:12px"><div class="tbl"><table><thead><tr><th>Serviciu</th><th>Subgrup</th><th class="num">Preț</th></tr></thead><tbody>
      ${c.servicii.map((s) => `<tr data-s><td>${esc(s.nume)}</td><td class="small muted">${esc(s.subgrup || '')}</td><td class="num">${priceCell(s.preturi)}</td></tr>`).join('')}
      </tbody></table></div></div></details>`;
  }).join(''));
  add('oferte', 'Ofertele lunii & abonamente', D.oferte.length, `<div class="tbl"><table><thead><tr><th>Ofertă</th><th>Grup</th><th class="num">Preț</th><th class="num">Inițial</th><th class="num">Reducere</th></tr></thead><tbody>
    ${D.oferte.map((o) => `<tr data-s><td><b>${esc(o.nume)}</b></td><td class="small muted">${esc(o.grup)}</td><td class="num">${lei(o.pret)}</td><td class="num muted">${lei(o.pretInitial)}</td><td class="num">${o.discountProcent != null ? `<span class="tag ok">-${o.discountProcent}%</span>` : '—'}</td></tr>`).join('')}
    </tbody></table></div>`);

  // ---- Blog: un grup pe tip ----
  const crit = D.criterii_tip_articol || {};
  for (const [tip, slug, cls] of ART_TYPES) {
    const L = D.articole.filter((a) => a.tip === tip);
    add(`art_${slug}`, tipLabel(tip), L.length, `
      ${crit[tip] ? `<div class="crit"><span class="tag ${cls}">${esc(tipLabel(tip))}</span> ${esc(crit[tip])}</div>` : ''}
      ${L.length ? `<div class="tbl"><table><thead><tr><th>Dată</th><th>${esc(tipLabel(tip))}</th><th>Entități menționate</th></tr></thead><tbody>
      ${L.map((a) => `<tr data-s>
        <td class="small" style="white-space:nowrap">${esc(a.data || '—')}</td>
        <td>${link(a.url, a.titlu)}${a.rezumat ? `<div class="muted small">${esc(a.rezumat)}</div>` : ''}<div class="motiv">De ce „${esc(tipLabel(a.tip))}”: ${esc(a.motiv_tip)}</div>
          <div class="small">${a.autor ? `<span class="tag ok">${esc(a.autor)}</span>` : '<span class="tag warn">fără autor</span>'}${a.cuvinte ? `<span class="tag grey">${a.cuvinte} cuvinte</span>` : ''}</div></td>
        <td style="min-width:200px">${tags(a.entitati.slice(0, 10), '')}${a.entitati.length > 10 ? `<span class="muted small">+${a.entitati.length - 10}</span>` : ''}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="card muted">Niciun articol cu acest tip.</div>'}`);
  }

  // ---- Glosar ----
  const G = D.glosar || [];
  add('glosar', 'Glosar', G.length, `<div class="tbl"><table><thead><tr><th>Termen</th><th>Definiție (de pe site)</th><th>Găsit pe</th></tr></thead><tbody>
    ${[...new Set(G.map((g) => g.categorie))].map((c) => `<tr class="row-group"><td colspan="3">${esc(c)}</td></tr>` + G.filter((g) => g.categorie === c).map((g) => `<tr data-s>
      <td><b>${esc(g.nume)}</b>${g.articole.length ? `<div class="muted small">${plural(g.articole.length, 'articol', 'articole')}</div>` : ''}</td>
      <td class="small">${g.definitie ? `${esc(g.definitie)} <span class="muted">— ${link(g.sursa_definitie)}</span>` : '<span class="tag warn">fără definiție pe site</span>'}</td>
      <td style="min-width:150px">${src(g.surse)}</td></tr>`).join('')).join('')}
    </tbody></table></div>`);

  // ---- Dovezi ----
  add('testimoniale', 'Recenzii pacienți', D.dovezi.testimoniale.length, `<div class="tbl"><table><thead><tr><th>Pacient</th><th>Recenzie</th><th>Medic menționat</th></tr></thead><tbody>
    ${D.dovezi.testimoniale.map((t) => `<tr data-s><td><b>${esc(t.persoana)}</b><div class="muted small">${esc(t.platforma)}</div></td><td>${esc(t.citat)}</td><td>${t.medic ? `<span class="tag">${esc(t.medic)}</span>` : '<span class="muted">—</span>'}</td></tr>`).join('')}
    </tbody></table></div>`);
  add('cifre', 'Cifre și afirmații', D.dovezi.cifre.length, `<div class="tbl"><table><thead><tr><th>Valoare</th><th>Ce înseamnă</th><th>Sursa</th></tr></thead><tbody>
    ${D.dovezi.cifre.map((c) => `<tr data-s><td><b style="font-size:16px">${esc(c.valoare)}</b><div>${c.tip === 'afirmație' ? '<span class="tag warn">afirmație</span>' : '<span class="tag ok">cifră</span>'}</div></td><td>${esc(c.eticheta)}</td><td class="small">${c.surse.length ? src(c.surse) : '<span class="tag bad">negăsit</span>'}</td></tr>`).join('')}
    </tbody></table></div>`);

  // ---- Întrebări frecvente ----
  const Q = D.intrebari || [];
  const qLinks = (q) => [
    ...(q.legaturi.servicii || []).map((id) => `<span class="tag">${esc(servById[id]?.nume || id)}</span>`),
    ...(q.legaturi.glosar || []).map((n) => `<span class="tag warn">${esc(n)}</span>`),
    ...(q.legaturi.echipa || []).map((n) => `<span class="tag ok">${esc(n)}</span>`),
  ].join('');
  add('intrebari', 'Întrebări frecvente', Q.length, `<p class="lead">Extrase din titlurile-întrebare de pe paginile site-ului, cu răspunsul de sub ele. Doar cele <b>validate</b> sunt gata de folosit (FAQPage, pagini noi). Legături: <span class="tag">serviciu</span><span class="tag warn">termen din glosar</span><span class="tag ok">medic</span></p>
    ${qFilter(Q)}
    ${[...new Set(Q.map((q) => q.tema))].map((t) => `<h3 class="q-tema" data-q-tema>${esc(prettyCat(t))} <span class="muted small">${Q.filter((q) => q.tema === t).length}</span></h3>` + Q.filter((q) => q.tema === t).map((q) => `
      <details class="item" data-s data-q="${esc(q.id)}" data-qst="${esc(q.status)}">
        <summary><span class="name">${esc(q.intrebare)}</span><span>${qStatusTag(q.status)}</span></summary>
        <div class="item-body">
          ${qValidateForm(q)}
          <p style="margin-top:12px">${esc(q.raspuns)}</p>
          <p class="small">${qLinks(q) || '<span class="muted">fără legături</span>'}</p>
          ${src(q.surse)}
        </div></details>`).join('')).join('')}`);

  // ---- Media ----
  const M = D.media || [];
  add('media', 'Imagini', M.length, `<p class="lead">Fișierele folosite pe homepage, cu textul alternativ și paginile pe care mai apar. ${M.filter((m) => !m.alt).length} din ${M.length} nu au alt.</p>
    <div class="media-grid">${M.map((m) => `<div class="card media-card" data-s>
      <a href="${esc(SITE + m.fisier)}" target="_blank" rel="noopener"><img src="${esc(m.fisier)}" alt="${esc(m.alt)}" loading="lazy"></a>
      <h3 style="overflow-wrap:anywhere">${esc(cut(m.titlu, 60))}</h3>
      <dl class="kv small"><dt>Alt</dt><dd>${m.alt ? esc(m.alt) : '<span class="tag bad">lipsă</span>'}</dd><dt>Fișier</dt><dd>${m.kb != null ? `${m.kb} KB` : '—'}${m.dimensiuni ? ` · ${esc(m.dimensiuni)}` : ''}</dd>
        <dt>Folosită pe</dt><dd>${m.folosita.map((p) => `<code>${esc(p)}</code>`).join(' ')}</dd></dl></div>`).join('')}</div>`);

  const V = D.video || [];
  add('video', 'Video', V.length, `<p class="lead">${V.filter((v) => !v.fundal).length} în conținut, ${V.filter((v) => v.fundal).length} de fundal · ${V.reduce((n, v) => n + (v.mb || 0), 0).toFixed(0)} MB în total${V.some((v) => v.mobil) ? ` · versiunile pentru mobil: <b>${V.reduce((n, v) => n + (v.mobil?.mobil_mb || 0), 0).toFixed(1)} MB</b> (${V.filter((v) => v.mobil).length} video, cu cadru de previzualizare)` : ''}.</p>
    <div class="toolbar"><span class="grow"></span><button class="sm" id="csvVideo">Export CSV (video → pagină → secțiune)</button></div>
    <div class="media-grid">${V.map((v) => `<div class="card media-card" data-s>
      <video src="${esc(v.mobil?.mobil || v.url)}" controls preload="none" playsinline style="width:100%;aspect-ratio:${v.orientare === 'vertical' ? '9 / 16' : '16 / 9'};max-height:340px;background:#1f2020;border-radius:8px;margin-bottom:10px;display:block"${v.mobil?.poster || v.poster ? ` poster="${esc(v.mobil?.poster || v.poster)}"` : ''}></video>
      <h3>${esc(v.titlu)}</h3>
      <p>${v.fundal ? '<span class="tag">fundal hero</span>' : ''}${v.orientare ? `<span class="tag grey">${esc(v.orientare)}</span>` : ''}${v.mb != null ? `<span class="tag ${v.mb > 20 ? 'warn' : 'grey'}">${v.mb} MB</span>` : ''}${v.dimensiuni ? `<span class="tag grey">${esc(v.dimensiuni)}</span>` : ''}</p>
      <h4 class="bh4">Unde trebuie pus</h4>
      <ul class="clean small">${v.pagini.map((p) => `<li>${link(p.url, p.path)}${p.sectiune ? ` › <b>${esc(p.sectiune)}</b>` : ' › începutul paginii'}${p.serviciu ? ` <span class="tag">${esc(prettyCat(servById[p.serviciu]?.nume || p.serviciu))}</span>` : ''}</li>`).join('')}</ul>
      <dl class="kv small" style="margin-top:8px"><dt>Fișier</dt><dd>${link(v.url, v.fisier.split('/').pop())}</dd>${v.mobil ? `<dt>Mobil</dt><dd>${link(v.mobil.mobil, v.mobil.mobil.split('/').pop())} · ${v.mobil.mobil_mb} MB · ${esc(v.mobil.dimensiuni)} · ${v.mobil.durata_s} s</dd><dt>Poster</dt><dd>${link(v.mobil.poster, v.mobil.poster.split('/').pop())} · ${v.mobil.poster_kb} KB</dd>` : ''}</dl>
      ${v.probleme.length ? `<p>${tags(v.probleme, 'warn')}</p>` : ''}
    </div>`).join('')}</div>`);

  // ---- Audit SEO ----
  add('schema', 'Schema JSON-LD', null, `
    <div class="card" style="margin-bottom:12px"><b>Existentă pe homepage:</b> ${tags(D.schema_existenta, '')}
      <p>Două blocuri descriu aceeași clinică cu date diferite (program, rating, logo, tip). Mai jos: un singur bloc <code>MedicalClinic</code> generat din entități, de validat înainte de implementare.</p></div>
    <div class="toolbar"><span class="grow"></span><button class="cp-schema">Copiază JSON-LD</button></div>
    <pre>${esc(JSON.stringify(buildSchema(D), null, 2))}</pre>`);
  add('legale', 'Date legale & pagini utile', (D.pagini_legale_utile || []).length, `<div class="grid2">
    <div class="card"><h3>Firmele din documentele legale</h3>${(D.legal?.firme || []).map((f) => `<dl class="kv small" style="margin-top:10px">${kvRow('Firmă', `<b>${esc(f.nume)}</b>`)}${kvRow('Adresă', esc(f.adresa))}${kvRow('CUI', f.cui ? esc(f.cui) : '<span class="tag warn">lipsă</span>')}${kvRow('Registru', f.registru ? esc(f.registru) : '<span class="tag warn">lipsă</span>')}${kvRow('Email', esc(f.email || ''))}</dl>`).join('')}
      ${D.legal?.domeniu_mentionat ? `<p>Domeniu menționat în termeni: <span class="tag bad">${esc(D.legal.domeniu_mentionat)}</span></p>` : ''}<p>${link(D.legal?.sursa, 'documente legale')}</p></div>
    <div class="card"><h3>Pagini utile</h3><ul class="clean">${(D.pagini_legale_utile || []).map((p) => `<li data-s>${link(p.url, p.nume)} <span class="muted small">${esc(shortUrl(p.url))}</span></li>`).join('')}</ul></div></div>`);

  return S;
}
// semnalează persoanele care lipsesc de pe /echipa/ sau de pe homepage
function teamPageTag(p) {
  const s = p.surse || [];
  const onTeam = s.some((u) => /\/echipa\/$/.test(u)), onHome = s.some((u) => /moaclinic\.ro\/$/.test(u));
  return onTeam && onHome ? '<span class="tag ok">homepage + /echipa/</span>' : !onTeam ? '<span class="tag bad">lipsește de pe /echipa/</span>' : '<span class="tag warn">lipsește de pe homepage</span>';
}

// descrierea fiecărui grup (cardurile de pe nivelul 2)
function groupMeta(D) {
  const n = (s) => D.servicii.filter((x) => x.categorie === s).map((x) => x.nume);
  const meta = {
    identitate: 'Numele brandului, firmele, brandul părinte, poziționarea, fondatorul și meta-datele homepage-ului.',
    fapte: 'Cele mai relevante afirmații despre MOA de pe tot site-ul, grupate pe teme, fiecare cu paginile unde apare.',
    valoare: 'Promisiunile brandului adunate într-un singur loc.',
    contact: 'Adresă, telefon, emailuri, program, profile sociale, recenzii și logo-uri.',
    concepte: 'Temele cu care se asociază brandul (Global Antiaging, regenerare, longevitate…), cu paginile unde apar.',
    relatii: 'Cum se leagă clinica de firme, fondator, echipă, servicii, tehnologii și profile.',
    tehnologii: 'Aparatele clinicii, cu producătorul și paginile de servicii pe care apar.',
    produse: 'Mărcile terțe (fillere, toxine, cosmetice) menționate pe site.',
    proprii: 'Terapiile intravenoase cu nume de brand MOA.',
    lista_preturi: 'Toate prețurile de pe /preturi/, pe categorii, cu reducerile.',
    oferte: 'Ofertele lunii și abonamentele, cu prețul inițial și reducerea.',
    glosar: 'Termenii medicali pe care pacienții îi caută, cu definiția găsită pe site și paginile unde apar.',
    testimoniale: 'Recenziile Google afișate pe homepage, cu medicul menționat.',
    cifre: 'Cifrele și afirmațiile de tip „prima”, „singurul”, „aprobat FDA”, fiecare cu pagina-sursă.',
    intrebari: 'Întrebările din conținutul site-ului, cu răspuns, legate de servicii, glosar și medici. Se validează înainte de folosire.',
    media: 'Imaginile homepage-ului: fișier, text alternativ, unde mai apar.',
    video: 'Video-urile de pe tot site-ul, cu pagina și secțiunea în care apar: unde trebuie puse pe site-ul nou.',
    observatii: 'Problemele de entity SEO găsite pe site, cu verificare pe site-ul live la rezolvare.',
    schema: 'Schema JSON-LD existentă și propunerea MedicalClinic generată din entități.',
    legale: 'Firmele care operează clinica (CUI, registru, adrese) și paginile legale/utile.',
  };
  for (const s of SPEC_ORDER) meta[specId(s)] = `${s}: ${D.echipa.filter((p) => p.specialitate === s).map((p) => p.nume).join(', ')}.`;
  for (const c of new Set(D.servicii.map((s) => s.categorie))) meta[srvId(c)] = n(c).join(' · ');
  for (const [t, slug] of ART_TYPES) meta[`art_${slug}`] = (D.criterii_tip_articol || {})[t] || '';
  return meta;
}

function entityCategories(D) {
  const specs = [...SPEC_ORDER, ...new Set(D.echipa.map((p) => p.specialitate))].filter((s, i, a) => a.indexOf(s) === i && D.echipa.some((p) => p.specialitate === s));
  return [
    { id: 'brand', icon: 'brand', title: 'MOA Clinic', desc: 'Cine este MOA: identitate, ce spune site-ul despre clinică, propunerea de valoare, contactul și conceptele.',
      sections: ['identitate', 'fapte', 'valoare', 'contact', 'concepte', 'relatii'] },
    { id: 'echipa', icon: 'echipa', title: 'Echipa', desc: 'Medicii și specialiștii clinicii, pe specialități, cu paginile pe care apar și serviciile de care se leagă.',
      sections: specs.map(specId) },
    { id: 'servicii', icon: 'servicii', title: 'Servicii', desc: 'Toate serviciile din meniu, pe categorii: pagina, tehnologiile și produsele folosite, medicii, prețurile.',
      sections: [...new Set(D.servicii.map((s) => s.categorie))].map(srvId) },
    { id: 'tehnologii', icon: 'tehnologii', title: 'Tehnologii & produse', desc: 'Aparatura clinicii, mărcile folosite și produsele proprii MOA.',
      sections: ['tehnologii', 'produse', 'proprii'] },
    { id: 'preturi', icon: 'preturi', title: 'Prețuri & oferte', desc: 'Lista de prețuri pe categorii și ofertele lunii.',
      sections: ['lista_preturi', 'oferte'] },
    { id: 'blog', icon: 'blog', title: 'Blog', desc: 'Articolele din blog, pe tipuri: ghiduri, tratamente, îngrijire, comparații și opinii.',
      sections: ART_TYPES.map(([, slug]) => `art_${slug}`) },
    { id: 'glosar', icon: 'glosar', title: 'Glosar', desc: 'Termenii medicali pe care pacienții îi caută, cu definiția de pe site, pe categorii.',
      sections: ['glosar'] },
    { id: 'dovezi', icon: 'dovezi', title: 'Dovezi', desc: 'Recenziile pacienților și cifrele/afirmațiile folosite pe site.',
      sections: ['testimoniale', 'cifre'] },
    { id: 'intrebari', icon: 'intrebari', title: 'Întrebări frecvente', desc: 'Întrebările din conținutul site-ului, cu răspunsuri și legături. Se validează înainte de folosire.',
      sections: ['intrebari'] },
    { id: 'media', icon: 'media', title: 'Media', desc: 'Imaginile homepage-ului și video-urile de pe tot site-ul, cu paginile unde apar.',
      sections: ['media', 'video'] },
    { id: 'seo', icon: 'seo', title: 'Audit SEO', audit: true, desc: 'Nu sunt entități: schema JSON-LD propusă și datele legale.',
      sections: ['schema', 'legale'] },
  ];
}

routes.entitati = function renderEntitati() {
  const D = store.entitati;
  if (!D) { $('#view').innerHTML = '<div class="card empty"><b>Lipsește data/entitati.json</b>Rulează <code>npm run sync</code>.</div>'; return; }
  const S = entitySections(D), CATS = entityCategories(D), G = groupMeta(D);
  const [catId, grpId] = location.pathname.replace(/^\/manage\/entitati\/?/, '').split('/');
  const cat = CATS.find((c) => c.id === catId);
  const grp = !cat ? null : cat.sections.includes(grpId) ? grpId : cat.sections.length === 1 ? cat.sections[0] : null;
  const total = (c) => (c.audit ? 0 : c.sections.filter((id) => S[id]?.count != null && !ATRIBUTE.has(id)).reduce((n, id) => n + S[id].count, 0));
  const sectionHtml = (s) => `<section id="${s.id}"><h2>${esc(s.title)}${s.count != null ? `<span class="n">${s.count}</span>` : ''}</h2>${s.html}</section>`;
  const open = (path) => { history.pushState({}, '', '/manage/entitati' + (path ? '/' + path : '')); routes.entitati(); window.scrollTo(0, 0); };

  if (!cat) {
    $('#view').innerHTML = `
      <div class="head">
        <div><div class="crumb">manage › entități · sursa: ${link(D.meta.sursa, "moaclinic.ro")} (${esc(D.meta.extras_la)}) · ${D.meta.pagini} pagini citite</div><h1>Entitățile brandului</h1><div class="crumb" style="margin-top:4px">${entityTotal(D)} entități · aceleași noduri ca în Sinapse. Grupurile estompate (prețuri, afirmații, cifre, propunerea de valoare) sunt atribute și nu intră în total.</div></div>
        <input type="search" id="q" placeholder="Caută în toate entitățile…" aria-label="Caută în entități">
        <button id="exp">Export JSON</button>
      </div>
      <div class="cats" id="cats">${CATS.map((c) => `
        <a class="cat ${c.audit ? 'audit' : ''}" href="/manage/entitati/${c.id}" data-cat="${c.id}">
          <div class="cat-top"><span class="cat-ico">${icon(c.icon)}</span>${c.audit ? '' : `<span class="cat-total">${total(c)}</span>`}</div>
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.desc)}</p>
          <div class="cat-subs">${c.sections.map((id) => `<span${ATRIBUTE.has(id) ? ' class="attr" title="Atribute, nu entități: nu intră în total"' : ''}>${esc(S[id].title)}${S[id].count != null ? ` <b>${S[id].count}</b>` : ''}</span>`).join('')}</div>
          <span class="cat-open">Deschide →</span>
        </a>`).join('')}
      </div>
      <div id="results" class="hidden">${CATS.map((c) => `
        <div class="res-cat">
          <div class="res-head"><span class="cat-ico sm">${icon(c.icon)}</span><a href="/manage/entitati/${c.id}" data-cat="${c.id}">${esc(c.title)} →</a></div>
          ${c.sections.map((id) => sectionHtml(S[id])).join('')}
        </div>`).join('')}
        <div class="card empty hidden" id="noRes"><b>Niciun rezultat</b>Încearcă alt termen.</div>
      </div>`;
    $('#exp').onclick = () => download('moa-entitati.json', JSON.stringify(D, null, 2), 'application/json');
    $('#q').addEventListener('input', (e) => searchAll(e.target.value.trim().toLowerCase()));
  } else if (!grp) {
    $('#view').innerHTML = `
      <div class="head"><div>
        <div class="crumb"><a href="/manage/entitati" data-cat="">← Toate categoriile</a> · manage › entități › ${esc(cat.title)}</div>
        <h1><span class="cat-ico">${icon(cat.icon)}</span>${esc(cat.title)}</h1></div></div>
      <p class="lead">${esc(cat.desc)}</p>
      <div class="pills">${CATS.map((c) => `<a href="/manage/entitati/${c.id}" data-cat="${c.id}" class="${c.id === cat.id ? 'on' : ''}">${esc(c.title)}${total(c) ? ` · ${total(c)}` : ''}</a>`).join('')}</div>
      <div class="cats">${cat.sections.map((id) => { const s = S[id]; return `
        <a class="cat" href="/manage/entitati/${cat.id}/${id}" data-cat="${cat.id}/${id}">
          <div class="cat-top"><span class="cat-ico">${icon(cat.icon)}</span>${s.count != null ? `<span class="cat-total">${s.count}</span>` : ''}</div>
          <h3>${esc(s.title)}</h3><p>${esc(cut(G[id] || '', 220))}</p><span class="cat-open">Deschide →</span>
        </a>`; }).join('')}</div>`;
  } else {
    const s = S[grp];
    const multi = cat.sections.length > 1;
    $('#view').innerHTML = `
      <div class="head"><div>
        <div class="crumb">${multi ? `<a href="/manage/entitati/${cat.id}" data-cat="${cat.id}">← ${esc(cat.title)}</a> · <a href="/manage/entitati" data-cat="">entități</a> › ${esc(cat.title)} › ${esc(s.title)}` : `<a href="/manage/entitati" data-cat="">← Toate categoriile</a> · entități › ${esc(cat.title)}`}</div>
        <h1><span class="cat-ico">${icon(cat.icon)}</span>${esc(s.title)}${s.count != null ? ` <span class="muted" style="font-weight:400;font-size:16px">${s.count}</span>` : ''}</h1></div>
        <input type="search" id="qg" placeholder="Filtrează…" aria-label="Filtrează">
      </div>
      ${G[grp] && !/^srv_|^spec_/.test(grp) ? `<p class="lead">${esc(G[grp])}</p>` : ''}
      ${multi ? `<div class="pills">${cat.sections.map((id) => `<a href="/manage/entitati/${cat.id}/${id}" data-cat="${cat.id}/${id}" class="${id === grp ? 'on' : ''}">${esc(S[id].title)}${S[id].count != null ? ` · ${S[id].count}` : ''}</a>`).join('')}</div>` : ''}
      <section id="${s.id}">${s.html}</section>`;
    $('#qg').addEventListener('input', (e) => filterIn($('#view section'), e.target.value.trim().toLowerCase()));
  }

  $$('#view [data-cat]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); open(a.dataset.cat); }));
  bindObs();
  const cv = $('#csvVideo');
  if (cv) cv.onclick = () => download('moa-video.csv', csv((D.video || []).flatMap((v) => v.pagini.map((p) => ({ v, p }))), [
    ['Video', (r) => r.v.titlu], ['Fisier', (r) => r.v.url], ['MB', (r) => r.v.mb], ['Mobil', (r) => r.v.mobil?.mobil || ''], ['MB mobil', (r) => r.v.mobil?.mobil_mb ?? ''], ['Poster', (r) => r.v.mobil?.poster || ''], ['Orientare', (r) => r.v.orientare], ['Fundal', (r) => (r.v.fundal ? 'da' : '')],
    ['Pagina', (r) => r.p.url], ['Sectiune (titlul de deasupra)', (r) => r.p.sectiune || 'începutul paginii'], ['Ordine pe pagina', (r) => r.p.ordine], ['Probleme', (r) => r.v.probleme.join(', ')]]), 'text/csv;charset=utf-8');
  $$('#view .cp-schema').forEach((b) => (b.onclick = () => { navigator.clipboard.writeText(`<script type="application/ld+json">\n${JSON.stringify(buildSchema(D), null, 2)}\n<\/script>`); toast('JSON-LD copiat'); }));
};

// filtrare într-un container: elementele [data-s], grupurile [data-s-group] și titlurile de temă
function filterIn(box, q) {
  $$('[data-s]', box).forEach((el) => el.classList.toggle('hidden', !!q && !el.textContent.toLowerCase().includes(q)));
  $$('[data-s-group]', box).forEach((g) => {
    const any = $$('[data-s]', g).some((i) => !i.classList.contains('hidden'));
    g.classList.toggle('hidden', !!q && !any);
    if (q && any) g.open = true;
  });
  $$('tr.row-group', box).forEach((r) => { let n = r.nextElementSibling, any = false; while (n && !n.classList.contains('row-group')) { any ||= !n.classList.contains('hidden'); n = n.nextElementSibling; } r.classList.toggle('hidden', !!q && !any); });
  $$('[data-q-tema]', box).forEach((h) => { let n = h.nextElementSibling, any = false; while (n && n.matches('details')) { any ||= !n.classList.contains('hidden'); n = n.nextElementSibling; } h.classList.toggle('hidden', !!q && !any); });
}
function searchAll(q) {
  $('#cats').classList.toggle('hidden', !!q);
  $('#results').classList.toggle('hidden', !q);
  if (!q) return;
  let any = false;
  $$('#results .res-cat').forEach((b) => {
    let vis = false;
    $$('section', b).forEach((sec) => {
      filterIn(sec, q);
      const items = $$('[data-s]', sec);
      const show = items.length ? items.some((i) => !i.classList.contains('hidden')) : sec.textContent.toLowerCase().includes(q);
      sec.classList.toggle('hidden', !show);
      vis ||= show;
    });
    b.classList.toggle('hidden', !vis);
    any ||= vis;
  });
  $('#noRes').classList.toggle('hidden', any);
}

// schema MedicalClinic propusă, generată din entități
function buildSchema(D) {
  const B = D.brand, C = D.contact;
  return {
    '@context': 'https://schema.org', '@type': 'MedicalClinic', '@id': SITE + '/#organization',
    name: B.nume, alternateName: B.variante.filter((v) => v !== B.nume), legalName: (D.legal?.firme || []).map((f) => f.nume),
    url: SITE + '/', logo: B.logo[0], slogan: B.slogan, description: B.descriere,
    telephone: '+40743056605', email: 'office@moaclinic.ro',
    address: { '@type': 'PostalAddress', streetAddress: C.adresa.streetAddress, addressLocality: C.adresa.addressLocality, addressRegion: 'Sector 2', addressCountry: 'RO' },
    geo: { '@type': 'GeoCoordinates', latitude: 'DE COMPLETAT (6 zecimale)', longitude: 'DE COMPLETAT (6 zecimale)' },
    openingHoursSpecification: 'DE CONFIRMAT CU CLINICA (azi: două programe diferite)',
    founder: { '@type': 'Person', name: B.fondator.nume, jobTitle: B.fondator.rol },
    parentOrganization: { '@type': 'Organization', name: B.brandParinte.nume },
    medicalSpecialty: B.specialitatiMedicale,
    aggregateRating: D.reputatie.trustindex ? { '@type': 'AggregateRating', ratingValue: D.reputatie.rating?.ratingValue || '5.0', reviewCount: String(D.reputatie.trustindex.recenzii) } : undefined,
    sameAs: [...new Set(D.social.map((s) => s.url.replace(/\/?$/, '/')))],
    employee: D.echipa.filter((p) => p.tip === 'Medic').map((p) => ({ '@type': 'Physician', name: p.nume, jobTitle: p.rol, ...(p.profil ? { url: p.profil } : {}) })),
    knowsAbout: (D.glosar || []).map((g) => g.nume),
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Servicii MOA Clinic', itemListElement: D.servicii.map((s) => {
      const v = s.preturi.map((p) => p.valoare).filter((x) => x != null);
      return { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: s.nume, url: s.url }, ...(v.length ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: Math.min(...v), priceCurrency: 'RON' } } : {}) };
    }) },
  };
}

/* ---------- observații: rezolvare cu verificare pe site-ul live ---------- */
const obsUI = { nivel: '', rez: {} };
const isResolved = (o) => store.obsStatus?.[o.id]?.status === 'rezolvat';
const openObs = (D) => (D.observatii || []).filter((o) => !isResolved(o));
const isManual = (o) => !o.check || o.check.tip === 'manual';
function describeCheck(c) {
  if (!c) return 'fără regulă — se confirmă manual';
  if (c.descriere) return c.descriere;
  const u = shortUrl(c.url);
  switch (c.tip) {
    case 'text_absent': return `textul „${c.text}” să nu mai apară pe ${u}`;
    case 'text_present': return `textul „${c.text}” să apară pe ${u}`;
    case 'regex_absent': return `nimic de forma /${c.regex}/ pe ${u}`;
    case 'regex_present': return `să existe /${c.regex}/ pe ${u}`;
    case 'meta': return c.op === 'exists' ? `${c.camp} să existe pe ${u}` : `${c.camp} pe ${u}: ${c.op === 'max' ? 'cel mult' : 'cel puțin'} ${c.valoare} caractere`;
    case 'not_in_sitemap': return `${u} să nu mai fie în sitemap`;
    case 'all': return c.checks.map(describeCheck).join(' și ');
    case 'any': return c.checks.map(describeCheck).join(' sau ');
    case 'manual': return 'nu se poate verifica automat — se confirmă manual';
  }
  return c.tip;
}
function obsRow(o) {
  const r = obsUI.rez[o.id];
  const res = !r ? '' : r.rezultat === 'rezolvat'
    ? `<div class="obs-res ok">✓ Verificarea trece${r.salvat ? '' : ' — apasă „Rezolvat” ca s-o închizi'}<span>${r.detalii.map(esc).join('<br>')}</span></div>`
    : r.rezultat === 'deschis' ? `<div class="obs-res bad">✗ Încă nerezolvată (verificat ${esc(r.verificat_la.replace('T', ' '))})<span>${r.detalii.map(esc).join('<br>')}</span></div>`
    : `<div class="obs-res bad">Eroare la verificare: ${esc(r.eroare)}</div>`;
  return `<div class="obs" data-s data-obs="${esc(o.id)}">
    <span class="lvl ${o.nivel}">${esc(o.nivel)}</span>
    <div class="obs-main">
      <div>${esc(o.text)}${o.url ? ` <a class="small" href="${esc(o.url)}" target="_blank" rel="noopener">${esc(shortUrl(o.url))}</a>` : ''}</div>
      <div class="obs-check">${isManual(o) ? '✋' : '⟳'} Verificare: ${esc(describeCheck(o.check))}</div>
      ${res}
      ${isManual(o) ? '<div class="obs-manual hidden"><input placeholder="Ce s-a schimbat? (opțional)" data-obs-nota aria-label="Notă"><button class="sm primary" data-obs-act="confirma">Confirmă</button><button class="sm" data-obs-act="anuleaza">Renunță</button></div>' : ''}
    </div>
    <div class="obs-act"><button class="sm ${isManual(o) ? '' : 'primary'}" data-obs-act="${isManual(o) ? 'manual' : 'verifica'}">${isManual(o) ? 'Confirmă rezolvarea' : 'Rezolvat'}</button></div>
  </div>`;
}
function obsHtml(D) {
  const open = openObs(D), done = (D.observatii || []).filter(isResolved);
  const shown = open.filter((o) => !obsUI.nivel || o.nivel === obsUI.nivel);
  const cnt = (n) => open.filter((o) => o.nivel === n).length;
  return `
    <div class="obs-bar">
      ${[['', 'Toate', open.length], ['critic', 'Critice', cnt('critic')], ['mediu', 'Medii', cnt('mediu')], ['minor', 'Minore', cnt('minor')]].map(([v, l, n]) => `<button class="sm ${obsUI.nivel === v ? 'on' : ''}" data-obs-filter="${v}">${l} · ${n}</button>`).join('')}
      <span class="grow"></span><span class="muted small" id="obsProg"></span><button class="sm" data-obs-all>Verifică toate (${open.filter((o) => !isManual(o)).length})</button>
    </div>
    <div class="card" style="padding:0">${shown.map(obsRow).join('') || '<div class="empty">Nicio observație deschisă.</div>'}</div>
    ${done.length ? `<details class="obs-done"><summary>Rezolvate · ${done.length}</summary><div class="card" style="padding:0">${done.map((o) => { const s = store.obsStatus[o.id]; return `
      <div class="obs" data-obs="${esc(o.id)}"><span class="lvl ${o.nivel}">${esc(o.nivel)}</span>
        <div class="obs-main"><div class="muted"><s>${esc(o.text)}</s></div>
          <div class="obs-check">✓ ${esc(s.metoda)} · ${esc((s.verificat_la || '').replace('T', ' '))}${s.nota ? ` · „${esc(s.nota)}”` : ''}${s.detalii?.length ? `<br>${s.detalii.map(esc).join('<br>')}` : ''}</div></div>
        <div class="obs-act"><button class="sm" data-obs-act="redeschide">Redeschide</button></div>
      </div>`; }).join('')}</div></details>` : ''}`;
}
const obsPost = (path, body) => api.send('/api/observatii/' + path, 'POST', body);
async function reloadObsStatus() { store.obsStatus = (await api.get('/api/observatii/status')) || {}; }
function bindObs() {
  const D = store.entitati;
  const rerender = () => { const y = window.scrollY; routes[routeFromPath()](); window.scrollTo(0, y); updateCounts(); };
  $$('[data-obs-filter]').forEach((b) => (b.onclick = () => { obsUI.nivel = b.dataset.obsFilter; rerender(); }));
  $$('[data-obs-act]').forEach((b) => (b.onclick = async () => {
    const row = b.closest('[data-obs]'), id = row.dataset.obs, act = b.dataset.obsAct;
    if (act === 'manual') { row.querySelector('.obs-manual').classList.remove('hidden'); b.classList.add('hidden'); row.querySelector('[data-obs-nota]').focus(); return; }
    if (act === 'anuleaza') { rerender(); return; }
    b.disabled = true; b.textContent = act === 'verifica' ? 'Se verifică pe site…' : '…';
    try {
      if (act === 'verifica') {
        const r = await obsPost('verifica', { id, salveaza: true });
        obsUI.rez[id] = r;
        if (r.salvat) { await reloadObsStatus(); toast('Verificat pe site: rezolvată ✓'); } else toast(r.rezultat === 'eroare' ? 'Eroare la verificare' : 'Problema apare încă pe site');
      } else if (act === 'confirma') {
        await obsPost('confirma', { id, nota: row.querySelector('[data-obs-nota]').value.trim() });
        await reloadObsStatus(); toast('Marcată ca rezolvată');
      } else if (act === 'redeschide') {
        await obsPost('redeschide', { id }); delete obsUI.rez[id]; await reloadObsStatus(); toast('Observația a fost redeschisă');
      }
    } catch (e) { obsUI.rez[id] = { rezultat: 'eroare', eroare: e.message }; }
    rerender();
  }));
  const all = $('[data-obs-all]');
  if (all) all.onclick = async () => {
    const list = openObs(D).filter((o) => !isManual(o));
    all.disabled = true; let ok = 0;
    for (let i = 0; i < list.length; i++) {
      $('#obsProg').textContent = `${i + 1} / ${list.length}…`;
      try { const r = await obsPost('verifica', { id: list[i].id, salveaza: false }); obsUI.rez[list[i].id] = r; if (r.rezultat === 'rezolvat') ok++; }
      catch (e) { obsUI.rez[list[i].id] = { rezultat: 'eroare', eroare: e.message }; }
    }
    toast(`${ok} din ${list.length} par rezolvate — confirmă-le cu „Rezolvat”`);
    rerender();
  };
}

/* ---------- întrebări frecvente: validare ---------- */
const Q_STATUS = [['propusă', 'Propusă', 'warn'], ['validată', 'Validată', 'ok'], ['respinsă', 'Respinsă', 'bad']];
const qStatusTag = (st) => { const x = Q_STATUS.find((s) => s[0] === st) || Q_STATUS[0]; return `<span class="tag ${x[2]}">${esc(x[1].toLowerCase())}</span>`; };
function applyQStatus() {
  for (const q of store.entitati?.intrebari || []) {
    const v = store.qStatus?.[q.id];
    if (!v) continue;
    q.original ||= { intrebare: q.intrebare, raspuns: q.raspuns };
    Object.assign(q, { status: v.status, intrebare: v.intrebare || q.original.intrebare, raspuns: v.raspuns || q.original.raspuns, validare: v });
  }
}
function qValidateForm(q) {
  const v = q.validare;
  return `<div class="status-box" data-q-form="${esc(q.id)}">
    <button type="button" class="sm ${q.status === 'validată' ? 'on' : ''}" data-q-set="validată">✓ Validează</button>
    <button type="button" class="sm danger ${q.status === 'respinsă' ? 'on' : ''}" data-q-set="respinsă">✕ Respinge</button>
    ${q.status !== 'propusă' ? '<button type="button" class="sm" data-q-set="propusă">↺ Înapoi la propusă</button>' : ''}
    <button type="button" class="sm" data-q-edit>✎ Editează</button>
    <span class="small muted">${v ? `${esc(v.status)} la ${esc(fmtDate(v.verificat_la))}${v.raspuns || v.intrebare ? ' · text editat' : ''}` : 'propusă automat din conținut'}</span>
    <div class="q-edit hidden">
      <label>Întrebarea<input class="q-in-intrebare" value="${esc(q.intrebare)}"></label>
      <label>Răspunsul<textarea class="q-in-raspuns" rows="4">${esc(q.raspuns)}</textarea></label>
      <label>Notă (opțional)<input class="q-in-nota" value="${esc(v?.nota || '')}" placeholder="ex. verificat cu medicul"></label>
      <div class="toolbar" style="margin:0"><button type="button" class="sm primary" data-q-save>Salvează și validează</button><button type="button" class="sm" data-q-save-draft>Salvează ca propusă</button><button type="button" class="sm" data-q-cancel>Renunță</button></div>
    </div>
  </div>`;
}
function qFilter(Q) {
  const n = (st) => Q.filter((q) => q.status === st).length;
  return `<div class="filter q-filter"><span class="small muted">Arată:</span>
    <button type="button" class="sm on" data-qf="">Toate <b>${Q.length}</b></button>
    ${Q_STATUS.map(([id, lab]) => `<button type="button" class="sm" data-qf="${id}">${lab} <b>${n(id)}</b></button>`).join('')}</div>`;
}
async function qSave(id, body, msg) {
  await api.send('/api/intrebari/status', 'PUT', { id, ...body });
  store.qStatus = (await api.get('/api/intrebari/status')) || {};
  applyQStatus();
  const y = window.scrollY, openIds = $$('details[data-q][open]').map((d) => d.dataset.q);
  routes.entitati(); window.scrollTo(0, y);
  openIds.forEach((qid) => document.querySelector(`details[data-q="${CSS.escape(qid)}"]`)?.setAttribute('open', ''));
  toast(msg);
}
document.addEventListener('click', async (e) => {
  const f = e.target.closest('[data-qf]');
  if (f) {
    const box = f.closest('.q-filter').parentElement;
    $$('[data-qf]', box).forEach((b) => b.classList.toggle('on', b === f));
    $$('details[data-q]', box).forEach((d) => (d.hidden = !!f.dataset.qf && d.dataset.qst !== f.dataset.qf));
    $$('[data-q-tema]', box).forEach((h) => { let n = h.nextElementSibling, any = false; while (n && n.matches('details[data-q]')) { any ||= !n.hidden; n = n.nextElementSibling; } h.hidden = !any; });
    return;
  }
  const form = e.target.closest('[data-q-form]');
  if (!form || !e.target.closest('button')) return;
  const id = form.dataset.qForm, q = store.entitati.intrebari.find((x) => x.id === id);
  const edits = () => {
    const orig = q.original || q, i = $('.q-in-intrebare', form).value.trim(), r = $('.q-in-raspuns', form).value.trim();
    return { intrebare: i !== orig.intrebare ? i : '', raspuns: r !== orig.raspuns ? r : '', nota: $('.q-in-nota', form).value.trim() };
  };
  const keep = () => ({ intrebare: q.validare?.intrebare || '', raspuns: q.validare?.raspuns || '', nota: q.validare?.nota || '' });
  try {
    if (e.target.closest('[data-q-set]')) {
      const st = e.target.closest('[data-q-set]').dataset.qSet;
      await qSave(id, { status: st, ...keep() }, st === 'validată' ? 'Întrebare validată' : st === 'respinsă' ? 'Întrebare respinsă' : 'Înapoi la propusă');
    } else if (e.target.closest('[data-q-edit]')) { $('.q-edit', form).classList.toggle('hidden'); $('.q-in-raspuns', form).focus(); }
    else if (e.target.closest('[data-q-cancel]')) $('.q-edit', form).classList.add('hidden');
    else if (e.target.closest('[data-q-save]')) await qSave(id, { status: 'validată', ...edits() }, 'Text salvat și întrebare validată');
    else if (e.target.closest('[data-q-save-draft]')) await qSave(id, { status: 'propusă', ...edits() }, 'Text salvat, întrebarea rămâne propusă');
  } catch { toast('Nu s-a putut salva'); }
});
