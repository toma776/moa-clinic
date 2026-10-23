// Pagina de prețuri: două moduri (lista completă / estimatorul pe siluetă), căutare, categoriile ca acordeon,
// cuprinsul lateral cu categoria curentă. Estimatorul: problemele din „Ce te supără?”, tratamentele bifate, costul de pornire.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lei = (n) => new Intl.NumberFormat('ro-RO').format(n) + ' lei';
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  const track = (event, extra = {}) => (window.dataLayer = window.dataLayer || []).push({ event, pagina: location.pathname, ...extra });
  const hdr = $('header.site');

  // ---- modurile: Lista completă / Pornește de la ce te supără ----
  const tabs = $$('.pr-switch [role=tab]');
  const show = (id) => tabs.forEach((t) => {
    const on = t.getAttribute('aria-controls') === id;
    t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      const id = t.getAttribute('aria-controls');
      show(id);
      history.replaceState(null, '', id === 'estimator' ? '#estimator' : location.pathname + location.search);
      track('preturi_mod', { mod: id });
    });
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.click(); n.focus();
    });
  });
  const toTabs = () => { const s = $('.pr-switch'); scrollTo({ top: s.getBoundingClientRect().top + scrollY - (hdr?.offsetHeight || 0) - 12, behavior: smooth() }); };

  // ---- lista: căutare ----
  const q = $('#pr-q'), qx = $('#pr-x'), empty = $('#pr-empty'), count = $('#pr-count'), all = $('#pr-all');
  const cats = $$('.pr-cat');
  const navLinks = $$('.pr-nav a');
  const rows = $$('.pr-row, .pr-orow').map((r) => ({ r, t: norm(r.textContent + ' ' + r.closest('.pr-cat').dataset.nume) }));
  const total = $$('.pr-row').length;
  let before = null; // categoriile deschise înainte de căutare, refăcute când se golește căutarea
  const syncAll = () => {
    const open = cats.filter((c) => !c.hidden).every((c) => c.open);
    all.textContent = open ? 'Închide toate' : 'Deschide toate';
    all.setAttribute('aria-pressed', open);
  };
  const filter = () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    if (words.length && !before) before = new Set(cats.filter((c) => c.open));
    let n = 0;
    rows.forEach(({ r, t }) => { const ok = words.every((w) => t.includes(w)); r.hidden = !ok; if (ok && r.classList.contains('pr-row')) n++; });
    cats.forEach((c) => { const any = !!c.querySelector('.pr-row:not([hidden]), .pr-orow:not([hidden])'); c.hidden = !any; if (words.length) c.open = any; });
    $$('.pr-sub').forEach((h) => { let el = h.nextElementSibling, any = false; while (el && !el.classList.contains('pr-sub')) { if (el.classList.contains('pr-row') && !el.hidden) any = true; el = el.nextElementSibling; } h.hidden = !any; });
    $$('.pr-og-block').forEach((b) => { b.hidden = !b.querySelector('.pr-orow:not([hidden])'); });
    navLinks.forEach((l) => { l.hidden = !!document.getElementById(l.hash.slice(1))?.hidden; });
    $$('.pr-ng').forEach((g) => { g.hidden = !g.querySelector('a:not([hidden])'); });
    if (!words.length && before) { cats.forEach((c) => { c.open = before.has(c); }); before = null; }
    empty.hidden = cats.some((c) => !c.hidden);
    count.textContent = words.length ? `${n} din ${total} de servicii` : `${total} de servicii`;
    qx.hidden = !q.value;
    syncAll();
  };
  let tq;
  q?.addEventListener('input', () => { filter(); clearTimeout(tq); tq = setTimeout(() => q.value.trim() && track('preturi_cautare', { termen: q.value.trim() }), 1200); });
  q?.addEventListener('keydown', (e) => { if (e.key === 'Escape' && q.value) { q.value = ''; filter(); } });
  qx?.addEventListener('click', () => { q.value = ''; filter(); q.focus(); });

  // ---- acordeonul ----
  all?.addEventListener('click', () => { const open = all.getAttribute('aria-pressed') !== 'true'; cats.forEach((c) => { if (!c.hidden) c.open = open; }); syncAll(); });
  cats.forEach((c) => c.addEventListener('toggle', syncAll));
  syncAll();
  // salt la o categorie (din cuprins sau dintr-un link #categorie): o deschide și o aduce sub header
  const go = (el) => {
    show('lista');
    el.open = true;
    const y = el.getBoundingClientRect().top + scrollY, down = y > scrollY;
    if (down) hdr?.classList.add('hide');
    const bar = matchMedia('(max-width: 960px)').matches ? $('.pr-search').offsetHeight : 0;
    scrollTo({ top: y - bar - (down ? 0 : hdr?.offsetHeight || 0) - 8, behavior: smooth() });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const h = a.getAttribute('href').slice(1);
    if (h === 'estimator') { e.preventDefault(); show('estimator'); history.replaceState(null, '', '#estimator'); toTabs(); return; }
    const el = h && document.getElementById(h);
    if (!el || !el.classList.contains('pr-cat')) return;
    e.preventDefault(); go(el); history.replaceState(null, '', '#' + h);
  });
  const h0 = location.hash.slice(1);
  if (h0 === 'estimator') show('estimator');
  else if (h0 && document.getElementById(h0)?.classList.contains('pr-cat')) requestAnimationFrame(() => go(document.getElementById(h0)));

  // ---- ofertele lunii: câte un tab pe grup, șina se derulează cu săgețile ----
  const ps = $('.ps');
  if (ps) {
    const pt = $$('.ps-tabs [role=tab]', ps);
    pt.forEach((t, i) => {
      t.addEventListener('click', () => {
        pt.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
        const r = $('.ps-panel:not([hidden]) .ps-rail', ps); if (r) r.scrollLeft = 0;
        track('oferte_tab', { grup: $('b', t).textContent });
      });
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = pt[(i + (e.key === 'ArrowRight' ? 1 : pt.length - 1)) % pt.length];
        n.click(); n.focus();
      });
    });
    $$('[data-ps-rail]', ps).forEach((b) => b.addEventListener('click', () => {
      const r = $('.ps-panel:not([hidden]) .ps-rail', ps);
      if (r) r.scrollBy({ left: Number(b.dataset.psRail) * r.clientWidth * 0.8, behavior: smooth() });
    }));
  }

  // ---- cuprinsul lateral: categoria curentă ----
  let cur = null;
  const spy = () => {
    if ($('#lista').hidden || !navLinks.length) return;
    const line = Math.max(0, hdr?.getBoundingClientRect().bottom || 0) + 90;
    let c = null;
    cats.forEach((k) => { if (!k.hidden && k.getBoundingClientRect().top <= line) c = k; });
    if (c === cur) return; cur = c;
    navLinks.forEach((l) => {
      const on = !!c && l.hash === '#' + c.id;
      l.classList.toggle('on', on);
      if (on) { const nav = l.closest('.pr-nav'); const t = l.offsetTop - nav.offsetTop; if (t < nav.scrollTop || t > nav.scrollTop + nav.clientHeight - 40) nav.scrollTo({ top: t - nav.clientHeight / 2, behavior: smooth() }); }
    });
  };
  addEventListener('scroll', spy, { passive: true }); spy();

  // ---- estimatorul ----
  const est = $('#estimator'), dataEl = $('#est-data');
  if (!est || !dataEl) return;
  const data = JSON.parse(dataEl.textContent);
  const byId = Object.fromEntries(data.map((c) => [c.id, c]));
  const sel = new Map(); // denumire tratament → { n, u, p, c }
  const detail = $('#est-detail'), cta = $('#est-cta'), wa = $('#est-wa');
  let active = null;
  const setView = (v) => {
    $$('.pr-views button', est).forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === v));
    $$('.pr-view', est).forEach((w) => { w.hidden = w.dataset.view !== v; });
  };
  $$('.pr-views button', est).forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));

  const renderDetail = () => {
    const c = byId[active];
    detail.innerHTML = `<small>${esc(c.zona)}</small><h3>${esc(c.nume)}</h3><p>${c.tr.length} ${c.tr.length === 1 ? 'tratament posibil' : 'tratamente posibile'} · bifează ce te interesează</p>
      <ul class="pr-tt-l">${c.tr.map((t, i) => `<li><button type="button" class="pr-tt" data-i="${i}" aria-pressed="${sel.has(t.n)}"><i aria-hidden="true"></i><span>${esc(t.n)}</span><b>${t.p != null ? `<small>de la</small>${lei(t.p)}` : '<small>preț la consultație</small>'}</b></button>${t.u ? `<a href="${esc(t.u)}" aria-label="Detalii despre ${esc(t.n)}">Detalii</a>` : ''}</li>`).join('')}</ul>
      ${c.ghid ? `<a class="pr-ghid link-u" href="${esc(c.ghid.u)}">Ghid: ${esc(c.ghid.t)}</a>` : ''}`;
  };
  const pick = (id, user) => {
    const c = byId[id]; if (!c) return;
    active = id;
    setView(c.v);
    $$('.pr-hot, .pr-chip', est).forEach((b) => b.setAttribute('aria-pressed', b.dataset.c === id));
    $$('.pr-hl', est).forEach((g) => g.classList.toggle('on', g.dataset.c === id));
    renderDetail();
    if (user) { est.classList.add('touched'); track('estimator_zona', { problema: c.nume }); }
  };
  est.addEventListener('click', (e) => {
    const b = e.target.closest('.pr-hot, .pr-chip'); if (!b) return;
    pick(b.dataset.c, true);
    // pe telefon, după un punct de pe siluetă, lista de tratamente intră în ecran
    if (b.classList.contains('pr-hot') && matchMedia('(max-width: 960px)').matches) detail.scrollIntoView({ block: 'nearest', behavior: smooth() });
  });

  const renderSum = () => {
    const items = [...sel.values()];
    const sum = items.reduce((s, t) => s + (t.p || 0), 0);
    $('#est-n').textContent = items.length ? `· ${items.length}` : '';
    $('#est-total').textContent = !items.length ? '—' : sum ? `de la ${lei(sum)}` : 'la consultație';
    $('#est-empty').hidden = items.length > 0;
    $('#est-list').innerHTML = items.map((t) => `<li><span>${esc(t.n)}</span><b>${t.p != null ? lei(t.p) : 'la consultație'}</b><button type="button" class="pr-rm" data-n="${esc(t.n)}" aria-label="Scoate ${esc(t.n)} din estimare">✕</button></li>`).join('');
    const has = new Set(items.map((t) => t.c));
    $$('.pr-hot, .pr-chip', est).forEach((b) => b.classList.toggle('has', has.has(b.dataset.c)));
    $$('.pr-hl', est).forEach((g) => g.classList.toggle('sel', has.has(g.dataset.c)));
    const list = items.map((t) => `${t.n}${t.p != null ? ` (de la ${lei(t.p)})` : ''}`).join('; ');
    cta.dataset.srv = items.length ? `Estimare: ${items.map((t) => t.n).join(', ')}${sum ? ` – de la ${lei(sum)}` : ''}` : '';
    wa.href = 'https://wa.me/40743056605?text=' + encodeURIComponent(items.length
      ? `Bună ziua! Am folosit estimatorul de pe site și mă interesează: ${list}.${sum ? ` Total orientativ: de la ${lei(sum)}.` : ''} Aș dori o consultație.`
      : 'Bună ziua! Aș dori o programare la MOA Clinic.');
  };
  detail.addEventListener('click', (e) => {
    const b = e.target.closest('.pr-tt'); if (!b) return;
    const t = byId[active].tr[b.dataset.i];
    if (sel.has(t.n)) sel.delete(t.n);
    else { sel.set(t.n, { ...t, c: active }); track('estimator_tratament', { tratament: t.n }); }
    b.setAttribute('aria-pressed', sel.has(t.n));
    est.classList.add('touched');
    renderSum();
  });
  $('#est-list').addEventListener('click', (e) => {
    const b = e.target.closest('.pr-rm'); if (!b) return;
    sel.delete(b.dataset.n); renderSum(); renderDetail();
    $('#est-cta').focus({ preventScroll: true });
  });
  // programarea primește și lista detaliată, în câmpul de mesaj
  cta.addEventListener('click', () => {
    const items = [...sel.values()]; if (!items.length) return;
    const msg = 'Din estimator: ' + items.map((t) => `${t.n}${t.p != null ? ` (de la ${lei(t.p)})` : ''}`).join('; ');
    $$('textarea[name="mesaj"]').forEach((m) => { if (!m.value.trim() || m.value.startsWith('Din estimator:')) m.value = msg; });
    track('estimator_programare', { tratamente: items.length });
  });
  pick(data[0].id, false);
  renderSum();
})();
