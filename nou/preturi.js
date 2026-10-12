// Pagina de prețuri: căutare în toate prețurile + categoria curentă marcată în cuprins.
(() => {
  const q = document.getElementById('pr-q');
  const cats = [...document.querySelectorAll('.pr-cat')];
  const empty = document.getElementById('pr-empty');
  const count = document.getElementById('pr-count');
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const rows = [...document.querySelectorAll('.pr-row')].map((r) => ({ r, t: norm(r.textContent + ' ' + r.closest('.pr-cat').dataset.nume) }));
  const total = rows.length;
  const filter = () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    let n = 0;
    rows.forEach(({ r, t }) => { const ok = words.every((w) => t.includes(w)); r.hidden = !ok; if (ok) n++; });
    cats.forEach((c) => { c.hidden = !c.querySelector('.pr-row:not([hidden])'); });
    document.querySelectorAll('.pr-sub').forEach((h) => { let el = h.nextElementSibling, any = false; while (el && !el.classList.contains('pr-sub')) { if (el.classList.contains('pr-row') && !el.hidden) any = true; el = el.nextElementSibling; } h.hidden = !any; });
    empty.hidden = n > 0;
    count.textContent = words.length ? `${n} din ${total} prețuri` : `${total} prețuri`;
  };
  q?.addEventListener('input', filter);
  document.getElementById('pr-x')?.addEventListener('click', () => { q.value = ''; filter(); q.focus(); });

  // cuprinsul: categoria curentă, centrată în bara de categorii
  const toc = document.querySelector('.tr-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a')];
  let cur = -1;
  const spy = () => {
    const line = toc.getBoundingClientRect().bottom + 24;
    let i = -1;
    links.forEach((l, k) => { const s = document.querySelector(l.getAttribute('href')); if (s && !s.hidden && s.getBoundingClientRect().top <= line) i = k; });
    if (i === cur) return; cur = i;
    links.forEach((l, k) => l.classList.toggle('on', k === i));
    if (i >= 0) { const l = links[i], w = toc.firstElementChild; w.scrollTo({ left: l.offsetLeft - (w.clientWidth - l.offsetWidth) / 2, behavior: 'smooth' }); }
  };
  addEventListener('scroll', spy, { passive: true }); spy();
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('a'); if (!a) return;
    const el = document.querySelector(a.getAttribute('href')); if (!el) return;
    e.preventDefault();
    const hdr = document.querySelector('header.site');
    const y = el.getBoundingClientRect().top + scrollY, down = y > scrollY;
    if (down) hdr.classList.add('hide');
    scrollTo({ top: y - toc.offsetHeight - (down ? 0 : hdr.offsetHeight) + 1, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
})();
