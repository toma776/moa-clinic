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

// Butonul WhatsApp din dreapta jos + mesajul precompletat cu pagina de pe care scrie pacienta,
// ca operatorul să știe imediat contextul. Același mesaj îl primesc și celelalte linkuri WhatsApp generice
// (bara de jos de pe telefon, footerul, formularul); cele cu mesaj propriu (estimator, wishlist) rămân neatinse.
(() => {
  const NR = '40743056605', GEN = 'Bună ziua! Aș dori o programare la MOA Clinic.';
  const home = /^\/nou\/?$/.test(location.pathname);
  const name = home ? 'prima pagină' : document.title.split(' | ')[0].split(' – ')[0].replace(/\s+(în|in) Bucure[sș]ti$/i, '').trim();
  const url = location.origin + location.pathname;
  const msg = `Bună ziua! Vă scriu de pe pagina „${name}” (${url}). Aș dori mai multe informații.`;
  const href = `https://wa.me/${NR}?text=${encodeURIComponent(msg)}`;
  document.querySelectorAll(`a[href^="https://wa.me/${NR}"]`).forEach((a) => {
    const t = new URL(a.href).searchParams.get('text');
    if (!t || t === GEN) a.href = href;
  });
  const a = document.createElement('a');
  a.className = 'wa-fab'; a.href = href; a.target = '_blank'; a.rel = 'noopener';
  a.dataset.track = 'whatsapp_flotant';
  a.setAttribute('aria-label', 'Scrie-ne pe WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3zm0 23.8c-2.04 0-4.03-.55-5.77-1.58l-.41-.25-3.97 1.04 1.06-3.86-.27-.4A10.73 10.73 0 0 1 5.24 16c0-5.95 4.85-10.8 10.8-10.8 5.94 0 10.77 4.85 10.77 10.8 0 5.95-4.83 10.8-10.77 10.8zm5.92-8.08c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.21.32-.84 1.06-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.37-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.49-.57.16-.19.21-.32.32-.54.11-.21.06-.4-.02-.57-.08-.16-.73-1.76-1-2.4-.26-.63-.53-.55-.73-.56h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.12 1.32 3.33.16.22 2.28 3.48 5.53 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.92-.78 2.19-1.54.27-.76.27-1.41.19-1.54-.08-.14-.3-.22-.62-.38z"/></svg>';
  document.body.appendChild(a);
})();
