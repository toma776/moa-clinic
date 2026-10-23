/* PREȚURI & OFERTE (Entități › Prețuri & oferte): lista de prețuri editabilă (data/preturi.json).
   Un preț marcat „Ofertă”, cu procent de discount, apare automat în Ofertele lunii de pe site, indiferent de categorie.
   Salvarea scrie lista și actualizează entitățile: local regenerează site-ul pe loc, pe Vercel face un commit și site-ul se publică după build. */
(() => {
  const TIPURI = ['preț', 'ședință', 'pachet 3 ședințe', 'pachet 4 ședințe', 'pachet 5+1 gratuit', 'pachet 2 ședințe'];
  const prettyCat = (c) => (c && c === c.toUpperCase() ? c[0] + c.slice(1).toLowerCase() : c || '');
  const uid = () => Math.random().toString(36).slice(2, 10);
  const numOr = (x) => (x === '' || x == null || Number.isNaN(+x) ? null : +x);
  const offPrice = (v, d) => Math.round(v * (1 - d / 100));
  const offPct = (v, f) => Math.round((1 - f / v) * 100);
  let P = null, saved = '', root = null, mode = 'lista_preturi', q = '', onlyOff = false;
  const open = new Set();

  const isDirty = () => JSON.stringify(P) !== saved;
  const offers = () => P.categorii.flatMap((c, ci) => c.servicii.flatMap((r, ri) => r.preturi.map((p, pi) => ({ c, r, p, ci, ri, pi })))).filter(({ p }) => p.oferta && p.valoare);
  const nOff = (c) => c.servicii.reduce((n, r) => n + r.preturi.filter((p) => p.oferta).length, 0);
  const servName = (id) => (store.entitati?.servicii || []).find((s) => s.id === id)?.nume || id;

  const status = () => {
    const el = $('#pe-status', root); if (!el) return;
    const d = isDirty();
    el.textContent = d ? 'Modificări nesalvate' : 'Totul e salvat';
    el.className = 'pe-status' + (d ? ' dirty' : '');
    $('#pe-save', root).disabled = !d;
    $('#pe-undo', root).disabled = !d;
    $('#pe-noff', root).textContent = offers().length;
  };

  const priceLine = (p, ci, ri, pi) => `<div class="pe-p${p.oferta ? ' off' : ''}" data-ci="${ci}" data-ri="${ri}" data-pi="${pi}">
      <input class="pe-tip" list="pe-tipuri" value="${esc(p.tip || '')}" data-f="tip" aria-label="Tip preț" placeholder="tip">
      ${p.valoare == null && p.text != null && p.text !== ''
        ? `<input class="pe-txt" value="${esc(p.text)}" data-f="text" aria-label="Preț (text)"><button class="sm" data-act="tonum" title="Transformă în preț numeric">lei</button>`
        : `<span class="pe-lei"><input type="number" min="0" step="1" value="${p.valoare ?? ''}" data-f="valoare" aria-label="Preț normal, lei" placeholder="preț"><i>lei</i></span>
      <label class="pe-chk"><input type="checkbox" data-f="oferta"${p.oferta ? ' checked' : ''}${p.valoare ? '' : ' disabled'}> Ofertă</label>
      ${p.oferta ? `<span class="pe-lei pe-pct"><input type="number" min="1" max="95" step="1" value="${p.discountProcent ?? ''}" data-f="discountProcent" aria-label="Discount, procente"><i>%</i></span>
      <span class="pe-arrow">→</span><span class="pe-lei pe-fin"><input type="number" min="0" step="1" value="${p.pretOferta ?? ''}" data-f="pretOferta" aria-label="Preț cu discount, lei"><i>lei</i></span>` : ''}`}
      <button class="sm danger pe-x" data-act="delp" title="Șterge prețul" aria-label="Șterge prețul">✕</button>
    </div>`;

  const rowHtml = (r, ci, ri) => `<div class="pe-row" data-ci="${ci}" data-ri="${ri}" data-s="${esc((r.nume + ' ' + (r.subgrup || '')).toLowerCase())}">
      <div class="pe-name">
        <input value="${esc(r.nume)}" data-rf="nume" aria-label="Denumirea serviciului" placeholder="Denumirea serviciului">
        <div class="pe-meta"><input value="${esc(r.subgrup || '')}" data-rf="subgrup" placeholder="subgrup (opțional)" aria-label="Subgrup">
          <span class="pe-links">${(r.servicii || []).map((s) => `<span class="tag" title="Pagina de tratament legată">${esc(cut(servName(s), 34))}<button class="pe-unlink" data-act="unlink" data-s="${esc(s)}" aria-label="Scoate legătura">×</button></span>`).join('')}
          <select data-act="link" aria-label="Leagă de un tratament"><option value="">+ tratament</option>${(store.entitati?.servicii || []).filter((s) => !(r.servicii || []).includes(s.id)).map((s) => `<option value="${esc(s.id)}">${esc(cut(prettyCat(s.nume), 50))}</option>`).join('')}</select></span></div>
      </div>
      <div class="pe-ps">${r.preturi.map((p, pi) => priceLine(p, ci, ri, pi)).join('')}<button class="sm pe-addp" data-act="addp">+ preț</button></div>
      <button class="sm danger pe-delr" data-act="delr" title="Șterge serviciul" aria-label="Șterge serviciul ${esc(r.nume)}">Șterge</button>
    </div>`;

  const match = (r) => (!q || (r.nume + ' ' + (r.subgrup || '')).toLowerCase().includes(q)) && (!onlyOff || r.preturi.some((p) => p.oferta));

  function renderList() {
    const body = P.categorii.map((c, ci) => {
      const rows = c.servicii.map((r, ri) => (match(r) ? rowHtml(r, ci, ri) : '')).join('');
      if ((q || onlyOff) && !rows) return '';
      const no = nOff(c);
      return `<details class="pe-cat" data-ci="${ci}"${open.has(ci) || q || onlyOff ? ' open' : ''}>
        <summary><span class="name">${esc(prettyCat(c.categorie))}</span><span><span class="tag grey">${c.servicii.length} servicii</span>${no ? `<span class="tag ok">${no} ${no === 1 ? 'ofertă' : 'oferte'}</span>` : ''}</span></summary>
        <div class="pe-rows">${rows}</div>
        <div class="pe-catfoot"><button class="sm" data-act="addr">+ Adaugă serviciu</button><input class="pe-catname" value="${esc(c.categorie)}" data-cf="categorie" aria-label="Numele categoriei" title="Numele categoriei (cum apare în listă)">${c.servicii.length ? '' : '<button class="sm danger" data-act="delc">Șterge categoria</button>'}</div>
      </details>`;
    }).join('');
    return `${body || '<div class="card empty"><b>Niciun preț găsit</b>Încearcă alt termen.</div>'}
      ${q || onlyOff ? '' : '<button class="pe-addc" data-act="addc">+ Categorie nouă</button>'}`;
  }

  function renderOffers() {
    const L = offers().sort((a, b) => (b.p.discountProcent || 0) - (a.p.discountProcent || 0));
    if (!L.length) return '<div class="card empty"><b>Nicio ofertă activă</b>Bifează „Ofertă” la un preț din Lista de prețuri și pune procentul de discount.</div>';
    return `<div class="tbl"><table><thead><tr><th>Ofertă</th><th>Categorie</th><th class="num">Preț normal</th><th class="num">Discount</th><th class="num">Preț ofertă</th><th></th></tr></thead><tbody>
      ${L.map(({ c, r, p, ci, ri, pi }) => `<tr data-s><td><b>${esc(r.nume)}</b>${r.preturi.length > 1 ? `<div class="muted small">${esc(p.tip)}</div>` : ''}</td><td class="small muted">${esc(prettyCat(c.categorie))}</td>
        <td class="num">${lei(p.valoare)}</td>
        <td class="num"><span class="pe-lei pe-pct pe-p" data-ci="${ci}" data-ri="${ri}" data-pi="${pi}"><input type="number" min="1" max="95" value="${p.discountProcent ?? ''}" data-f="discountProcent" aria-label="Discount"><i>%</i></span></td>
        <td class="num"><b>${lei(p.pretOferta)}</b></td>
        <td class="num"><span class="pe-p" data-ci="${ci}" data-ri="${ri}" data-pi="${pi}"><button class="sm" data-act="unoff">Scoate din oferte</button></span></td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function render() {
    const keepY = scrollY;
    root.innerHTML = `
      <div class="pe-bar">
        <input type="search" id="pe-q" placeholder="Caută un serviciu…" value="${esc(q)}" aria-label="Caută în prețuri">
        ${mode === 'lista_preturi' ? `<button id="pe-only" class="${onlyOff ? 'on' : ''}" aria-pressed="${onlyOff}">Doar ofertele</button><button id="pe-all">Deschide toate</button>` : ''}
        <span class="pe-noff"><b id="pe-noff">0</b> oferte active pe site</span>
        <span class="pe-sp"></span>
        <span id="pe-status" class="pe-status"></span>
        <button id="pe-undo">Renunță</button><button id="pe-save" class="primary">Salvează și regenerează site-ul</button>
      </div>
      ${mode === 'lista_preturi' ? `<p class="pe-help">Bifează <b>Ofertă</b> la un preț și scrie procentul de discount (sau direct prețul redus): prețul apare tăiat în listă și intră automat în <b>Ofertele lunii</b> pe site – pagina de prețuri, homepage și pagina tratamentului legat. Debifezi și oferta dispare.</p>` : '<p class="pe-help">Ofertele se adună automat din toate prețurile marcate „Ofertă”, din orice categorie. Aici poți schimba procentul sau scoate o ofertă; restul se editează în Lista de prețuri.</p>'}
      <datalist id="pe-tipuri">${TIPURI.map((t) => `<option value="${esc(t)}">`).join('')}</datalist>
      <div id="pe-body">${mode === 'lista_preturi' ? renderList() : renderOffers()}</div>`;
    status();
    scrollTo(0, keepY);
  }

  const at = (el) => { const b = el.closest('[data-ci]'); const ci = +b.dataset.ci, ri = b.dataset.ri != null ? +b.dataset.ri : null, pi = b.dataset.pi != null ? +b.dataset.pi : null; const c = P.categorii[ci], r = ri != null ? c.servicii[ri] : null; return { ci, ri, pi, c, r, p: r && pi != null ? r.preturi[pi] : null, box: b }; };

  function onInput(e) {
    const t = e.target;
    if (t.id === 'pe-q') { q = t.value.trim().toLowerCase(); const pos = t.selectionStart; render(); const n = $('#pe-q', root); n.focus(); n.setSelectionRange(pos, pos); return; }
    if (t.dataset.rf) { const { r } = at(t); r[t.dataset.rf] = t.value; if (!t.value && t.dataset.rf === 'subgrup') delete r.subgrup; return status(); }
    if (t.dataset.cf) { const { c } = at(t); c.categorie = t.value; return status(); }
    const f = t.dataset.f; if (!f || f === 'oferta') return;
    const { p, box } = at(t);
    if (f === 'tip' || f === 'text') p[f] = t.value;
    else p[f] = numOr(t.value);
    // procentul și prețul redus se țin unul pe altul
    if (p.oferta && p.valoare) {
      const fin = $('[data-f="pretOferta"]', box), pct = $('[data-f="discountProcent"]', box);
      if (f === 'discountProcent' || f === 'valoare') { if (p.discountProcent) { p.pretOferta = offPrice(p.valoare, p.discountProcent); if (fin) fin.value = p.pretOferta; } }
      if (f === 'pretOferta' && p.pretOferta) { p.discountProcent = offPct(p.valoare, p.pretOferta); if (pct) pct.value = p.discountProcent; }
    }
    const chk = $('[data-f="oferta"]', box); if (chk) chk.disabled = !p.valoare;
    status();
  }

  function onChange(e) {
    const t = e.target;
    if (t.dataset.f === 'oferta') {
      const { p } = at(t);
      p.oferta = t.checked;
      if (p.oferta) { p.discountProcent = p.discountProcent || 10; p.pretOferta = offPrice(p.valoare, p.discountProcent); } else { delete p.discountProcent; delete p.pretOferta; delete p.oferta; }
      render(); return;
    }
    if (mode === 'oferte' && t.dataset.f) return render();
    if (t.dataset.act === 'link' && t.value) { const { r } = at(t); r.servicii = [...(r.servicii || []), t.value]; render(); }
  }

  function onClick(e) {
    const b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    if (b.id === 'pe-save') return saveAll();
    if (b.id === 'pe-undo') { if (confirm('Renunți la modificările nesalvate?')) { P = JSON.parse(saved); render(); } return; }
    if (b.id === 'pe-only') { onlyOff = !onlyOff; return render(); }
    if (b.id === 'pe-all') { const all = $$('.pe-cat', root); const o = all.some((d) => !d.open); all.forEach((d) => { d.open = o; o ? open.add(+d.dataset.ci) : open.delete(+d.dataset.ci); }); return; }
    const act = b.dataset.act; if (!act) return;
    if (act === 'addc') { const n = prompt('Numele categoriei noi (cum apare în listă):'); if (n && n.trim()) { P.categorii.push({ categorie: n.trim(), servicii: [] }); open.add(P.categorii.length - 1); render(); } return; }
    const { ci, ri, pi, c, r } = at(b);
    if (act === 'addr') { c.servicii.push({ id: uid(), nume: '', servicii: [], preturi: [{ tip: 'ședință', valoare: null }] }); open.add(ci); render(); const rows = $$(`.pe-cat[data-ci="${ci}"] .pe-row`, root); $('input', rows[rows.length - 1])?.focus(); return; }
    if (act === 'delc') { P.categorii.splice(ci, 1); open.clear(); return render(); }
    if (act === 'delr') { if (confirm(`Ștergi „${r.nume || 'serviciul nou'}” din lista de prețuri?`)) { c.servicii.splice(ri, 1); render(); } return; }
    if (act === 'addp') { r.preturi.push({ tip: r.preturi.length ? 'pachet 3 ședințe' : 'ședință', valoare: null }); return render(); }
    if (act === 'delp') { r.preturi.splice(pi, 1); return render(); }
    if (act === 'tonum') { const p = r.preturi[pi]; p.valoare = numOr(String(p.text).replace(/\D+/g, '')) ; delete p.text; return render(); }
    if (act === 'unoff') { const p = r.preturi[pi]; delete p.oferta; delete p.discountProcent; delete p.pretOferta; return render(); }
    if (act === 'unlink') { r.servicii = (r.servicii || []).filter((s) => s !== b.dataset.s); return render(); }
  }

  async function saveAll() {
    // prețurile fără valoare și serviciile fără nume nu se salvează: avertizează înainte
    const empty = P.categorii.flatMap((c) => c.servicii.filter((r) => !r.nume.trim() || !r.preturi.some((p) => p.valoare || p.text)).map((r) => r.nume || '(fără nume)'));
    if (empty.length && !confirm(`${empty.length} servicii n-au nume sau preț și nu vor fi salvate:\n${empty.slice(0, 8).join('\n')}\n\nContinui?`)) return;
    const btn = $('#pe-save', root); btn.disabled = true; btn.textContent = 'Se salvează…';
    try {
      const r = await api.send('/api/preturi', 'PUT', P);
      P = r.preturi; saved = JSON.stringify(P);
      store.entitati = await api.get('/api/entitati') || store.entitati;
      render();
      toast(r.publicare ? `Salvat · ${r.oferte} oferte · site-ul se publică ${r.publicare}` : r.build === 'ok' ? `Salvat · ${r.oferte} oferte pe site · site regenerat` : 'Salvat, dar regenerarea site-ului a eșuat');
      if (r.build !== 'ok') console.error(r.build);
    } catch (err) { toast('Nu s-a putut salva: ' + err.message); btn.disabled = false; btn.textContent = 'Salvează și regenerează site-ul'; }
  }

  addEventListener('beforeunload', (e) => { if (P && root?.isConnected && isDirty()) { e.preventDefault(); e.returnValue = ''; } });

  window.mountPreturi = async (el, m) => {
    mode = m; root = el; root.classList.add('pe');
    root.innerHTML = '<div class="card empty">Se încarcă lista de prețuri…</div>';
    if (!P || !isDirty()) {
      const data = await api.get('/api/preturi');
      if (!data) { root.innerHTML = '<div class="card empty"><b>Lipsește data/preturi.json</b>Rulează <code>node scripts/seed-preturi.js</code>.</div>'; return; }
      P = data; saved = JSON.stringify(P);
    }
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('toggle', (e) => { if (e.target.matches?.('.pe-cat')) (e.target.open ? open.add : open.delete).call(open, +e.target.dataset.ci); }, true);
    render();
  };
})();
