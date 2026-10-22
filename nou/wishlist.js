// Wishlist MOA: un „coș” fără plată. Pacienta adaugă tratamente / rânduri de preț de pe orice pagină,
// lista rămâne în browser (localStorage) și se trimite o singură dată, cu nume și telefon, ca lead în panou (POST /api/leads).
(() => {
  const KEY = 'moa-wishlist';
  const lei = (n) => n == null ? '' : new Intl.NumberFormat('ro-RO').format(n) + ' lei';
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const load = () => { try { const x = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(x) ? x : []; } catch { return []; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} };
  let list = load(), sent = false;
  const has = (n) => list.some((x) => x.n === n);
  window.dataLayer = window.dataLayer || [];
  const track = (event, extra = {}) => window.dataLayer.push({ event, pagina: location.pathname, ...extra });

  // ---- interfața: butonul plutitor + panoul ----
  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'wl-fab'; fab.hidden = true;
  fab.setAttribute('aria-haspopup', 'dialog');
  document.body.appendChild(fab);

  const wrap = document.createElement('div');
  wrap.className = 'wl'; wrap.hidden = true;
  wrap.innerHTML = `<div class="wl-bg" data-wl-close></div>
  <div class="wl-in" role="dialog" aria-modal="true" aria-labelledby="wl-t">
    <div class="wl-head"><div><span class="wl-eye">Wishlist</span><h3 id="wl-t">Tratamentele tale</h3></div><button type="button" class="wl-x" data-wl-close aria-label="Închide">✕</button></div>
    <p class="wl-sub">Adaugă tot ce îți dorești, apoi trimite lista o singură dată. Te sunăm noi și programăm fiecare tratament, în ordinea potrivită.</p>
    <ul class="wl-list"></ul>
    <div class="wl-total"></div>
    <form class="wl-form" novalidate>
      <div class="row2">
        <div class="field"><label for="wl-nume">Nume</label><input id="wl-nume" name="nume" autocomplete="name" required></div>
        <div class="field"><label for="wl-tel">Telefon</label><input id="wl-tel" name="telefon" type="tel" inputmode="tel" autocomplete="tel" required></div>
      </div>
      <div class="field"><label for="wl-msg">Mesaj (opțional)</label><textarea id="wl-msg" name="mesaj" rows="2" placeholder="Ex.: prefer dimineața, aș vrea totul în aceeași zi"></textarea></div>
      <label class="consent"><input type="checkbox" name="acord" required><span>Sunt de acord să fiu contactat(ă) de MOA Clinic pentru programare, conform <a href="https://moaclinic.ro/documente-legale-clinica-moa/" style="text-decoration:underline">politicii de confidențialitate</a>.</span></label>
      <button class="btn btn-gold arrow" type="submit">Trimite wishlistul</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
    <div class="wl-empty"><p>Lista e goală.</p><p class="wl-sub">Pe paginile de tratament și în lista de prețuri găsești eticheta <b>+ Adaugă pe wishlist</b>.</p><a class="link-u" href="/nou/preturi/">Vezi prețurile →</a></div>
  </div>`;
  document.body.appendChild(wrap);
  const ul = wrap.querySelector('.wl-list'), tot = wrap.querySelector('.wl-total'), form = wrap.querySelector('.wl-form'), msg = form.querySelector('.form-msg');

  const render = () => {
    const n = list.length;
    fab.hidden = wrap.classList.contains('open');
    fab.classList.toggle('zero', n === 0);
    fab.innerHTML = `<span class="wl-fab-i" aria-hidden="true">♡</span><span>Wishlist</span><b>${n}</b>`;
    fab.setAttribute('aria-label', `Deschide wishlistul (${n} ${n === 1 ? 'tratament' : 'tratamente'})`);
    ul.innerHTML = list.map((x, i) => `<li><span class="wl-n">${x.u ? `<a href="${esc(x.u)}">${esc(x.n)}</a>` : esc(x.n)}</span><span class="wl-p">${x.p != null ? lei(x.p) : 'la consultație'}</span><button type="button" class="wl-rm" data-i="${i}" aria-label="Elimină ${esc(x.n)}">✕</button></li>`).join('');
    const sum = list.reduce((s, x) => s + (x.p || 0), 0);
    tot.innerHTML = n ? `<span>${n} ${n === 1 ? 'tratament' : 'tratamente'}</span><span>Total orientativ <b>${lei(sum)}</b></span>` : '';
    wrap.classList.toggle('is-empty', n === 0);
    wrap.querySelector('.wl-empty p').textContent = sent && !n ? 'Mulțumim! Am primit lista. Te sunăm în curând ca să programăm fiecare tratament.' : 'Lista e goală.';
    if (n) sent = false;
    document.querySelectorAll('.wl-add').forEach((b) => {
      let d; try { d = JSON.parse(b.dataset.wl); } catch { return; }
      const on = has(d.n);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      const sp = b.querySelector('span'), ic = b.querySelector('i');
      if (sp) sp.textContent = on ? 'Pe wishlist' : b.classList.contains('wl-ico') ? 'Wishlist' : 'Adaugă pe wishlist';
      if (ic) ic.textContent = on ? '✓' : '+';
    });
  };

  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    wrap.hidden = false; void wrap.offsetWidth; wrap.classList.add('open');
    document.body.style.overflow = 'hidden';
    fab.hidden = true;
    setTimeout(() => (list.length ? form.nume : wrap.querySelector('.wl-x')).focus({ preventScroll: true }), 320);
  };
  const close = () => {
    wrap.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(() => { wrap.hidden = true; render(); }, 300);
    lastFocus?.focus?.({ preventScroll: true });
  };
  fab.addEventListener('click', open);
  wrap.querySelectorAll('[data-wl-close]').forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !wrap.hidden) close(); });

  // adaugă / scoate (al doilea click pe aceeași etichetă o scoate din listă)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.wl-add'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    let d; try { d = JSON.parse(b.dataset.wl); } catch { return; }
    if (has(d.n)) list = list.filter((x) => x.n !== d.n);
    else { list.push({ n: d.n, p: d.p ?? null, u: d.u || '' }); track('wishlist_adauga', { tratament: d.n }); fab.classList.remove('pop'); void fab.offsetWidth; fab.classList.add('pop'); }
    save(); render();
  });
  ul.addEventListener('click', (e) => {
    const r = e.target.closest('.wl-rm'); if (!r) return;
    list.splice(Number(r.dataset.i), 1); save(); render();
    if (!list.length) wrap.querySelector('.wl-x').focus();
  });
  // aceeași listă în toate filele deschise
  addEventListener('storage', (e) => { if (e.key === KEY) { list = load(); render(); } });

  // trimiterea: un singur lead, cu toate tratamentele
  const say = (cls, t) => { msg.className = 'form-msg ' + cls; msg.textContent = t; };
  const telOk = (t) => t.replace(/[\s.()-]/g, '').replace(/^[+]?40/, '0').match(/^0[0-9]{9}$/);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (!list.length) { say('err', 'Lista e goală.'); return; }
    if (!(d.nume || '').trim()) { say('err', 'Completează numele.'); form.nume.focus(); return; }
    if (!telOk(d.telefon || '')) { say('err', 'Numărul de telefon pare incomplet (ex. 0743 056 605).'); form.telefon.focus(); return; }
    if (!d.acord) { say('err', 'Bifează acordul pentru a putea fi contactat(ă).'); return; }
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    let origine; try { origine = JSON.parse(sessionStorage.getItem('moa-sursa') || 'null') || undefined; } catch {}
    const sum = list.reduce((s, x) => s + (x.p || 0), 0);
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        nume: d.nume.trim(), telefon: d.telefon.trim(), mesaj: (d.mesaj || '').trim() || undefined,
        serviciu: `Wishlist: ${list.length} ${list.length === 1 ? 'tratament' : 'tratamente'}`,
        tratamente: list.map((x) => ({ nume: x.n, pret: x.p, pagina: x.u })), valoare: sum || undefined,
        sursa: 'Wishlist site', pagina: location.pathname, origine,
      }) });
      if (!r.ok) throw new Error();
      track('wishlist_trimis', { tratamente: list.length, valoare: sum });
      list = []; sent = true; save(); form.reset(); render();
      say('ok', 'Mulțumim! Te sunăm în curând ca să programăm fiecare tratament.');
    } catch { say('err', 'Nu am putut trimite lista. Sună-ne la 0743 056 605.'); }
    btn.disabled = false;
  });

  render();
})();
