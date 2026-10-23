// Butonul din dreapta jos: inelul arată cât ai parcurs din pagină; un click te duce înapoi sus.
(() => {
  const R = 20, C = 2 * Math.PI * R;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'to-top'; b.setAttribute('aria-label', 'Înapoi sus');
  b.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="tt-bg" cx="24" cy="24" r="${R}"/><circle class="tt-bar" cx="24" cy="24" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><span aria-hidden="true">↑</span>`;
  document.body.appendChild(b);
  const bar = b.querySelector('.tt-bar');
  let tick = false;
  const upd = () => {
    tick = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    bar.style.strokeDashoffset = C * (1 - p);
    b.classList.toggle('on', scrollY > innerHeight * 2.5);
    b.setAttribute('aria-label', `Înapoi sus (ai parcurs ${Math.round(p * 100)}% din pagină)`);
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener('resize', upd);
  b.addEventListener('click', () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  upd();
})();
