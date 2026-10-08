/* BRAND: mini brand book MOA din data/brand.json, editabil pe secțiuni (PUT /api/brand). */
const BRAND_SECTIONS = [
  ['esenta', 'Esența brandului', 'Nume, poziționare, promisiune, valori, public', '<path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16.6 6.5 19.5l1-6.3L3 8.9 9 8z"/>'],
  ['logo', 'Logo', 'Variante, culori, probleme', '<path d="M4 4h16v16H4zM8 16V8l4 5 4-5v8"/>'],
  ['culori', 'Culori', 'Paleta din CSS-ul site-ului, cu contrast', '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>'],
  ['tipografie', 'Tipografie', 'Fonturi, greutăți, scară de mărimi', '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>'],
  ['ui', 'Elemente UI', 'Butoane, iconițe, componente', '<path d="M3 5h18v6H3zM3 15h8v4H3zM15 15h6v4h-6z"/>'],
  ['imagini', 'Imagini', 'Stiluri foto, reguli, probleme', '<path d="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01"/>'],
  ['voce', 'Voce & ton', 'Adresare, ton, fraze, vocabular, CTA', '<path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z"/>'],
  ['naming', 'Numele brandului', 'Forma corectă și variantele găsite', '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>'],
  ['contact', 'Date de contact & legale', 'Firme, CUI, canale, program', '<path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/>'],
  ['parteneri', 'Mărci asociate', 'Brandul părinte și producătorii', '<path d="M8 11l3 3 6-6M3 12l4-4 3 1 3-3 4 1 4 4-7 7-3-1-3 3z"/>'],
  ['inconsecvente', 'Inconsecvențe de brand', 'Ce nu e unitar azi', '<path d="M12 3l10 18H2zM12 10v5M12 18h.01"/>'],
];
const bIcon = (p) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const hexRgb = (h) => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const lum = (h) => { const [r, g, b] = hexRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const aa = (r) => (r >= 7 ? '<span class="tag ok">AAA</span>' : r >= 4.5 ? '<span class="tag ok">AA</span>' : r >= 3 ? '<span class="tag warn">AA text mare</span>' : '<span class="tag bad">sub AA</span>');
const FOUND = '<span class="tag grey">găsit pe site</span>', RECO = '<span class="tag">recomandare</span>';
const loadCss = (id, href) => { if (!document.getElementById(id)) document.head.appendChild(Object.assign(document.createElement('link'), { id, rel: 'stylesheet', href })); };

routes.brand = async function renderBrand() {
  if (!store.brand) {
    $('#view').innerHTML = '<div class="empty">Se încarcă…</div>';
    store.brand = await api.get('/api/brand');
    if (!store.brand) { $('#view').innerHTML = '<div class="card empty"><b>Lipsește data/brand.json</b>Rulează <code>npm run brand</code>.</div>'; return; }
  }
  const B = store.brand, E = B.esenta, L = B.logo, T = B.tipografie, U = B.ui, I = B.imagini, V = B.voce, N = B.naming, C = B.contact;
  loadCss('gf-brand', 'https://fonts.googleapis.com/css2?' + T.fonturi.filter((f) => f.google).map((f) => 'family=' + f.google).join('&') + '&display=swap');
  const sec = (id, body) => { const s = BRAND_SECTIONS.find((x) => x[0] === id); return `<section id="b-${id}" class="bsec"><h2><span class="cat-ico sm">${bIcon(s[3])}</span>${esc(s[1])}<button class="sm edit" data-bedit="${id}">✎ Editează</button></h2>${body}</section>`; };
  const ul = (a) => `<ul class="clean">${(a || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const lvl = (n) => `<span class="lvl ${n}">${esc(n)}</span>`;

  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage › brand · ${esc(B.meta.sursa)} · ${esc(B.meta.extras_la)}</div><h1>Brand book MOA Clinic</h1></div>
      <button data-bedit="esenta">✎ Editează esența</button><button id="bExp">Export JSON</button></div>
    <div class="bhero">
      <img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA">
      <div><div class="bhero-tag">${esc(E.tagline)}</div><div class="bhero-pos">${esc(E.pozitionare_recomandata)}</div>
      <div class="muted small" style="margin-top:8px">${esc(B.meta.nota)}</div></div>
    </div>
    <nav class="bnav" aria-label="Secțiuni brand book">${BRAND_SECTIONS.map(([id, t, d, ic]) => `<a href="#b-${id}" data-bjump><span class="cat-ico sm">${bIcon(ic)}</span><span><b>${esc(t)}</b><small>${esc(d)}</small></span></a>`).join('')}</nav>

    ${sec('esenta', `<div class="grid2">
      <div class="card"><dl class="kv">
        <dt>Nume</dt><dd><b>${esc(E.nume)}</b></dd>
        <dt>Firme</dt><dd>${esc(E.denumire_legala)}</dd>
        <dt>Categorie</dt><dd>${esc(E.categorie)}</dd>
        <dt>Tagline</dt><dd><b>${esc(E.tagline)}</b><div class="muted small">${esc(E.tagline_nota)}</div></dd>
        <dt>Oameni</dt><dd>${E.oameni.map((o) => `${esc(o.nume)} <span class="muted">— ${esc(o.rol)}</span>`).join('<br>')}</dd>
      </dl></div>
      <div class="card"><h3>Poziționare ${RECO}</h3><p class="bquote">${esc(E.pozitionare_recomandata)}</p>
        <h4 class="bh4">Variante găsite ${FOUND}</h4><ul class="clean small">${E.pozitionare_variante.map((v) => `<li>„${esc(v.text)}” <span class="muted">— ${esc(v.unde)}</span></li>`).join('')}</ul></div>
    </div>
    <div class="grid2" style="margin-top:12px">
      <div class="card"><h3>Promisiunea brandului</h3>${ul(E.promisiune)}</div>
      <div class="card"><h3>Valori (deduse din ce spune site-ul)</h3>${E.valori.map((v) => `<div class="bval"><b>${esc(v.nume)}</b><span>${esc(v.dovada)}</span></div>`).join('')}</div>
    </div>
    <div class="grid2" style="margin-top:12px">
      <div class="card"><h3>Dovezi și cifre ${FOUND}</h3>${ul(E.dovezi)}</div>
      <div class="card"><h3>Public</h3>${tags(E.public, '')}<h4 class="bh4">Vechime ${FOUND}</h4>${ul(E.vechime.gasit)}<p class="small muted">${esc(E.vechime.fapt)}</p></div>
    </div>`)}

    ${sec('logo', `<p>${esc(L.descriere)}</p>
      <div class="blogos">${L.variante.map((v) => `<div class="card"><div class="blogo-img ${v.fundal === 'închis' ? 'dark' : ''}"><img src="${esc(shortUrl(v.url))}" alt="${esc(v.nume)}"></div>
        <b>${esc(v.nume)}</b><div class="small muted">${esc(v.dimensiuni)} · fundal ${esc(v.fundal)}</div><div class="small">${esc(v.folosit)}</div>${link(v.url, 'deschide fișierul ↗')}</div>`).join('')}</div>
      <div class="grid2" style="margin-top:12px">
        <div class="card"><h3>Culorile logo-ului</h3>${L.culori.map((h) => `<div class="bsw-inline"><span style="background:${esc(h)}"></span><code>${esc(h)}</code></div>`).join('')}</div>
        <div class="card"><h3>Probleme ${FOUND}</h3>${ul(L.probleme)}</div>
      </div>`)}

    ${sec('culori', `${B.culori.map((g) => `<h4 class="bh4">${esc(g.grup)}</h4><div class="bswatches">${g.culori.map((c) => {
        const cw = contrast(c.hex, '#ffffff'), ck = contrast(c.hex, '#000000'), txt = cw >= ck ? '#fff' : '#000';
        return `<button type="button" class="bsw" data-copy="${esc(c.hex)}" title="Copiază ${esc(c.hex)}">
          <div class="bsw-color" style="background:${esc(c.hex)};color:${txt}"><b>${esc(c.hex.toUpperCase())}</b><span>rgb(${hexRgb(c.hex).join(', ')})</span></div>
          <div class="bsw-body"><b>${esc(c.nume)}</b><div class="small">${esc(c.rol)}</div><div class="small muted">${esc(c.gasit)}</div>
            <div class="small" style="margin-top:4px">pe alb ${cw.toFixed(1)}:1 ${aa(cw)}</div></div></button>`; }).join('')}</div>`).join('')}
      <p class="small muted">Click pe o culoare copiază codul HEX. Contrastul e calculat după WCAG 2.1 (AA = 4,5:1 pentru text normal).</p>`)}

    ${sec('tipografie', `${fontPicker(T)}
      <div class="grid2">${T.fonturi.map((f) => `<div class="card">
        <div class="bfont" style="font-family:'${esc(f.nume)}',${esc(f.fallback)};font-weight:${f.tip === 'titluri' ? 600 : 400}">Aa Ăă Îî Șș Țț</div>
        <h3>${esc(f.nume)} ${f.set === 'Recomandare' ? RECO : FOUND}${T.site && (T.site.titluri === f.nume || T.site.text === f.nume) ? ' <span class="tag ok">folosit acum</span>' : ''}</h3>
        <dl class="kv small"><dt>Pentru</dt><dd>${f.tip === 'titluri' ? 'Titluri' : 'Text'}</dd><dt>Greutăți</dt><dd>${esc(f.greutati)}</dd><dt>Rol</dt><dd>${esc(f.rol)}</dd><dt>Fallback</dt><dd>${esc(f.fallback)}</dd><dt>Sursă</dt><dd>${esc(f.sursa)}</dd></dl></div>`).join('')}</div>
      <div class="card" style="margin-top:12px"><h3>Scara de mărimi</h3><p class="small muted">Bază: ${esc(T.baza)}</p>
        ${T.scara.map((s) => `<div class="bscale"><span class="bscale-l">${esc(s.nivel)}<small>${s.rem}rem · ${s.px}px</small></span>
          <span style="font-family:'${esc(T.site?.titluri || 'Montserrat')}',sans-serif;font-weight:${s.nivel.startsWith('H') ? 600 : 400};font-size:${Math.min(s.px, 40)}px;line-height:1.2">Frumusețea vine din interior</span></div>`).join('')}
        <p class="small muted">${esc(T.nota)}</p></div>`)}

    ${sec('ui', `<div class="card"><h3>Butoane ${FOUND}</h3><p class="small muted">${esc(U.stil_butoane)}</p>
        <div class="bbtns">${U.butoane.map((b) => `<div><button type="button" class="bbtn" style="background:${esc(b.bg)};color:${esc(b.text)}" data-hover="${esc(b.hover)}" data-bg="${esc(b.bg)}" data-fg="${esc(b.text)}">${esc(b.exemplu)}</button>
          <div class="small"><b>${esc(b.nume)}</b> · ${esc(b.bg)} → hover ${esc(b.hover)}</div><div class="small" style="color:#6f675c">${esc(b.folosit)}</div></div>`).join('')}</div></div>
      <div class="grid2" style="margin-top:12px">
        <div class="card"><h3>Iconițe ${FOUND}</h3><p class="small muted">${esc(U.iconite.set)}</p>${U.iconite.folosite.map((i) => `<code style="margin:2px">${esc(i)}</code>`).join(' ')}</div>
        <div class="card"><h3>Componente ${FOUND}</h3>${ul(U.componente)}</div>
      </div>`)}

    ${sec('imagini', `${I.stiluri.map((s) => `<div class="card" style="margin-bottom:12px"><h3>${esc(s.nume)}</h3><p>${esc(s.descriere)}</p>
        <div class="bimgs">${s.exemple.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(shortUrl(u))}" alt="" loading="lazy" style="${/\.svg$/.test(u) ? 'object-fit:contain;padding:18px' : ''}"></a>`).join('')}</div></div>`).join('')}
      <div class="grid2"><div class="card"><h3>Reguli găsite ${FOUND}</h3>${ul(I.reguli_gasite)}</div><div class="card"><h3>Probleme</h3>${ul(I.probleme)}</div></div>`)}

    ${sec('voce', `<div class="grid2">
        <div class="card"><h3>Adresare</h3><p>${esc(V.adresare.gasit)} ${FOUND}</p><p><b>${esc(V.adresare.recomandare)}</b> ${RECO}</p><h4 class="bh4">Ton</h4>${ul(V.ton)}</div>
        <div class="card"><h3>Fraze semnătură ${FOUND}</h3>${V.fraze_semnatura.map((f) => `<p class="bquote small">„${esc(f)}”</p>`).join('')}<h4 class="bh4">Vocabular (apariții pe site)</h4>${tags(V.vocabular)}</div>
      </div>
      <div class="card" style="margin-top:12px"><h3>Butoane și îndemnuri (CTA)</h3>
        <div class="tbl"><table><thead><tr><th>Text găsit</th><th class="num">Apariții</th><th class="num">Pagini</th><th>Notă</th></tr></thead><tbody>
        ${V.cta.map((c) => `<tr><td><b>${esc(c.text)}</b></td><td class="num">${c.aparitii}</td><td class="num">${c.pagini}</td><td>${c.nota ? `<span class="tag warn">${esc(c.nota)}</span>` : '<span class="muted">—</span>'}</td></tr>`).join('')}
        </tbody></table></div>
        <p style="margin-top:10px">Set unificat ${RECO}: ${tags(V.cta_recomandat, 'ok')}</p></div>`)}

    ${sec('naming', `<div class="grid2">
        <div class="card"><h3>Forma corectă</h3><p class="bname">${esc(N.corect)}</p><p class="small">Firme: ${esc(N.legal)}</p><h4 class="bh4">Reguli ${RECO}</h4>${ul(N.reguli)}</div>
        <div class="card"><h3>Variante găsite ${FOUND}</h3>${tags(N.variante_gasite, 'warn')}</div>
      </div>`)}

    ${sec('contact', `<div class="grid2">
        <div class="card"><h3>Date legale</h3><dl class="kv">${C.legal.map((x) => `<dt>${esc(x.camp)}</dt><dd>${esc(x.valoare)}</dd>`).join('')}</dl></div>
        <div class="card"><h3>Canale pe rol</h3><div class="tbl"><table><tbody>${C.canale.map((x) => `<tr><td><b>${esc(x.rol)}</b></td><td>${esc(x.telefon)}</td><td>${esc(x.email)}</td></tr>`).join('')}</tbody></table></div>
          <dl class="kv small" style="margin-top:10px"><dt>Program</dt><dd>${esc(C.program)}</dd><dt>Răspuns</dt><dd>${esc(C.raspuns)}</dd><dt>Social</dt><dd>${C.social.map((s) => link(s.url, s.retea)).join(', ')}</dd></dl></div>
      </div>`)}

    ${sec('parteneri', `<p class="small muted">${esc(B.parteneri.nota)}</p>
      <div class="bpartners">${B.parteneri.logo.map((p) => `<div class="card bpartner">${p.url ? `<img src="${esc(shortUrl(p.url))}" alt="" style="width:54px;height:54px;object-fit:contain">` : `<span class="mono">${esc(initials(p.nume))}</span>`}<b>${esc(p.nume)}</b>${p.nota ? `<span class="small muted">${esc(p.nota)}</span>` : ''}</div>`).join('')}</div>`)}

    ${sec('inconsecvente', `<div class="card" style="padding:0">${B.inconsecvente.map((o) => `<div class="obs">${lvl(o.nivel)}<div>${esc(o.text)}</div></div>`).join('') || '<div class="empty">Nicio inconsecvență.</div>'}</div>`)}`;

  $$('[data-bedit]').forEach((b) => (b.onclick = () => openBrandEditor(b.dataset.bedit)));
  $$('[data-bjump]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); $(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); }));
  $$('[data-copy]').forEach((el) => (el.onclick = () => { navigator.clipboard.writeText(el.dataset.copy); toast(`Copiat ${el.dataset.copy}`); }));
  $$('.bbtn').forEach((b) => {
    b.onmouseenter = () => { b.style.background = b.dataset.hover; b.style.color = '#fff'; };
    b.onmouseleave = () => { b.style.background = b.dataset.bg; b.style.color = b.dataset.fg; };
  });
  $('#bExp').onclick = () => download('moa-brand.json', JSON.stringify(B, null, 2), 'application/json');
  bindFontPicker(T);
};

/* ---------- fonturile site-ului (titluri + text), cu previzualizare ---------- */
function fontPicker(T) {
  const opts = (rol, ales) => T.fonturi.map((f) => `<option value="${esc(f.nume)}" ${f.nume === ales ? 'selected' : ''}>${esc(f.nume)}${f.tip !== rol ? ` (gândit pentru ${f.tip})` : ''}${f.set === 'Recomandare' ? ' · recomandare' : ''}</option>`).join('');
  return `<div class="card fp" id="fontPick">
    <h3>Fonturile site-ului</h3>
    <p class="small muted">Alege fontul pentru titluri și pe cel pentru text, vezi cum arată, apoi salvează alegerea în brand book (<code>data/brand.json</code>).</p>
    <div class="fp-row">
      <label class="be-f"><span class="be-l">Titluri</span><select name="titluri">${opts('titluri', T.site?.titluri)}</select></label>
      <label class="be-f"><span class="be-l">Text</span><select name="text">${opts('text', T.site?.text)}</select></label>
    </div>
    <div class="fp-demo"><div class="fp-h">Frumusețea vine din interior și se desăvârșește la exterior</div>
      <p class="fp-p">MOA Regenerative by Oxxygene este prima clinică Global Antiaging din România: estetică, chirurgie și regenerare celulară, sub coordonarea Dr. Adrian Stănescu. Ăă Îî Șș Țț 0123456789</p></div>
    <div class="actions"><button type="button" class="primary" data-fsave>Salvează fonturile</button></div>
  </div>`;
}
function bindFontPicker(T) {
  const fp = $('#fontPick'); if (!fp) return;
  const sel = (n) => $(`[name=${n}]`, fp).value;
  const prev = () => {
    $('.fp-h', fp).style.fontFamily = `'${sel('titluri')}', Georgia, serif`;
    $('.fp-p', fp).style.fontFamily = `'${sel('text')}', system-ui, sans-serif`;
    $('[data-fsave]', fp).disabled = sel('titluri') === T.site?.titluri && sel('text') === T.site?.text;
  };
  fp.onchange = prev; prev();
  $('[data-fsave]', fp).onclick = async () => {
    const next = structuredClone(store.brand);
    next.tipografie.site = { ...(next.tipografie.site || {}), titluri: sel('titluri'), text: sel('text') };
    try { await api.send('/api/brand', 'PUT', next); store.brand = next; toast('Fonturi salvate în brand book'); routes.brand(); }
    catch { toast('Nu s-a putut salva'); }
  };
}

/* ---------- editor generat din structura secțiunii ---------- */
const BRAND_LABELS = {
  nume: 'Nume', denumire_legala: 'Firme', categorie: 'Categorie', tagline: 'Tagline', tagline_nota: 'Notă tagline', pozitionare_recomandata: 'Poziționare recomandată',
  pozitionare_variante: 'Variante de poziționare găsite', promisiune: 'Promisiune', valori: 'Valori', dovada: 'Dovadă', dovezi: 'Dovezi și cifre', public: 'Public',
  oameni: 'Oameni', rol: 'Rol', vechime: 'Vechime', gasit: 'Găsit pe site', fapt: 'Fapt', descriere: 'Descriere', variante: 'Variante', culori: 'Culori',
  probleme: 'Probleme', dimensiuni: 'Dimensiuni', fundal: 'Fundal', folosit: 'Unde e folosit', url: 'URL', grup: 'Grup', hex: 'Culoare (HEX)', fonturi: 'Fonturi',
  greutati: 'Greutăți', fallback: 'Fallback', sursa: 'Sursă', baza: 'Bază', scara: 'Scara de mărimi', nivel: 'Nivel', nota: 'Notă', butoane: 'Butoane',
  stil_butoane: 'Stilul butoanelor', bg: 'Fundal', text: 'Text', hover: 'Hover', exemplu: 'Exemplu', iconite: 'Iconițe', set: 'Set', folosite: 'Folosite',
  componente: 'Componente', stiluri: 'Stiluri', exemple: 'Exemple (URL-uri)', reguli_gasite: 'Reguli găsite', adresare: 'Adresare', recomandare: 'Recomandare',
  ton: 'Ton', fraze_semnatura: 'Fraze semnătură', vocabular: 'Vocabular', cta: 'CTA-uri', aparitii: 'Apariții', pagini: 'Pagini', cta_recomandat: 'Set CTA recomandat',
  corect: 'Forma corectă', legal: 'Date legale', variante_gasite: 'Variante găsite', reguli: 'Reguli', camp: 'Câmp', valoare: 'Valoare', canale: 'Canale pe rol',
  telefon: 'Telefon', email: 'Email', program: 'Program', raspuns: 'Timp de răspuns', social: 'Rețele sociale', retea: 'Rețea', logo: 'Logo-uri', unde: 'Unde',
  tip: 'Pentru (titluri / text)', google: 'Cod Google Fonts', site: 'Fonturile site-ului', titluri: 'Titluri', rem: 'rem', px: 'px', gasit_: 'Găsit',
};
const bLabel = (k) => BRAND_LABELS[k] || String(k).replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
const isHex = (v) => typeof v === 'string' && /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v.trim());
const isImg = (v) => typeof v === 'string' && /^(https?:\/\/|\/)\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$/i.test(v.trim());
const blank = (v) => (Array.isArray(v) ? [] : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])) : typeof v === 'number' ? 0 : typeof v === 'boolean' ? false : '');
const getAt = (o, p) => p.reduce((x, k) => x?.[k], o);
const itemTitle = (x, i) => (x && typeof x === 'object' ? x.nume || x.grup || x.text || x.camp || x.rol || x.retea || x.nivel || `#${i + 1}` : `#${i + 1}`);
const pAttr = (p) => esc(JSON.stringify(p));

function bField(v, path, key) {
  const p = pAttr(path), lab = key != null && typeof key !== 'number' ? `<span class="be-l">${esc(bLabel(key))}</span>` : '';
  if (Array.isArray(v)) {
    const simple = v.every((x) => typeof x !== 'object' || x === null);
    const items = v.map((x, i) => {
      const ip = pAttr([...path, i]);
      const ctrl = `<span class="be-ctrl"><button type="button" class="sm" data-mv="-1" data-p="${ip}" title="Mută în sus" ${i ? '' : 'disabled'}>↑</button><button type="button" class="sm" data-mv="1" data-p="${ip}" title="Mută în jos" ${i < v.length - 1 ? '' : 'disabled'}>↓</button><button type="button" class="sm danger" data-del data-p="${ip}" title="Șterge">✕</button></span>`;
      return simple ? `<div class="be-row">${bField(x, [...path, i], i)}${ctrl}</div>`
        : `<details class="be-item"${v.length <= 3 ? ' open' : ''}><summary><span>${esc(itemTitle(x, i))}</span>${ctrl}</summary><div class="be-body">${bField(x, [...path, i], i)}</div></details>`;
    }).join('');
    return `<fieldset class="be-arr">${lab ? `<legend>${lab} <span class="muted small">${v.length}</span></legend>` : ''}${items}<button type="button" class="sm" data-add data-p="${p}">+ Adaugă</button></fieldset>`;
  }
  if (v && typeof v === 'object') {
    const inner = Object.entries(v).map(([k, x]) => bField(x, [...path, k], k)).join('');
    return lab ? `<fieldset class="be-obj"><legend>${lab}</legend>${inner}</fieldset>` : inner;
  }
  if (typeof v === 'boolean') return `<label class="be-f be-check"><input type="checkbox" data-p="${p}" data-t="bool" ${v ? 'checked' : ''}>${lab}</label>`;
  if (typeof v === 'number') return `<label class="be-f">${lab}<input type="number" step="any" data-p="${p}" data-t="num" value="${v}"></label>`;
  const s = v ?? '';
  if (isHex(s) || ['hex', 'bg', 'hover'].includes(key)) return `<label class="be-f">${lab}<span class="be-color"><input type="color" data-sync value="${isHex(s) && s.length === 7 ? s : '#ffffff'}" aria-label="Alege culoarea"><input data-p="${p}" data-t="color" value="${esc(s)}" placeholder="#000000"></span></label>`;
  if (isImg(s)) return `<label class="be-f">${lab}<span class="be-img"><img src="${esc(shortUrl(s))}" alt=""><input data-p="${p}" value="${esc(s)}"></span></label>`;
  return s.length > 70 || /\n/.test(s)
    ? `<label class="be-f">${lab}<textarea data-p="${p}" rows="${Math.min(8, Math.ceil(s.length / 80) + 1)}">${esc(s)}</textarea></label>`
    : `<label class="be-f">${lab}<input data-p="${p}" value="${esc(s)}"></label>`;
}

function openBrandEditor(key) {
  const title = (BRAND_SECTIONS.find((s) => s[0] === key) || [, key])[1];
  const draft = { [key]: structuredClone(store.brand[key]) };
  const f = $('#brandForm'), dlg = $('#brandDlg');
  const paint = () => {
    const y = dlg.scrollTop;
    f.innerHTML = `<h2>Editează: ${esc(title)}</h2>
      <p class="small muted" style="margin:-8px 0 14px">Se salvează în <code>data/brand.json</code>.</p>
      <div class="be">${bField(draft[key], [key], null)}</div>
      <div class="err" id="brandErr"></div>
      <div class="actions be-actions"><button type="button" id="brandCancel">Renunță</button><button type="submit" class="primary">Salvează</button></div>`;
    dlg.scrollTop = y;
    $('#brandCancel').onclick = () => dlg.close();
  };
  f.oninput = (e) => {
    const el = e.target;
    if (el.hasAttribute('data-sync')) { const t = el.parentElement.querySelector('[data-p]'); t.value = el.value; t.dispatchEvent(new Event('input', { bubbles: true })); return; }
    if (!el.dataset.p) return;
    const path = JSON.parse(el.dataset.p), parent = getAt(draft, path.slice(0, -1));
    parent[path.at(-1)] = el.dataset.t === 'num' ? Number(el.value) : el.dataset.t === 'bool' ? el.checked : el.value;
    const pick = el.parentElement.querySelector('input[type=color]');
    if (pick && isHex(el.value) && el.value.length === 7) pick.value = el.value;
    const img = el.parentElement.querySelector('img'); if (img) img.src = shortUrl(el.value);
  };
  f.onclick = (e) => {
    const b = e.target.closest('button[data-p]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const path = JSON.parse(b.dataset.p);
    if (b.hasAttribute('data-add')) { const arr = getAt(draft, path); arr.push(arr.length ? blank(arr[0]) : ''); }
    else {
      const arr = getAt(draft, path.slice(0, -1)), i = path.at(-1);
      if (b.hasAttribute('data-del')) { if (!confirm(`Ștergi „${itemTitle(arr[i], i)}”?`)) return; arr.splice(i, 1); }
      else { const j = i + Number(b.dataset.mv); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    }
    paint();
  };
  f.onsubmit = async (e) => {
    e.preventDefault();
    const bad = $$('[data-t=color]', f).find((el) => el.value && !isHex(el.value));
    if (bad) { $('#brandErr').textContent = `Culoare invalidă: „${bad.value}”. Folosește formatul #RRGGBB.`; bad.focus(); return; }
    const next = { ...store.brand, [key]: draft[key] };
    try { await api.send('/api/brand', 'PUT', next); store.brand = next; dlg.close(); toast('Brand salvat'); routes.brand(); }
    catch { $('#brandErr').textContent = 'Nu s-a putut salva.'; }
  };
  paint();
  dlg.showModal();
}
