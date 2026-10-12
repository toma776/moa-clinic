// Blog: filtru pe tip, căutare (fără diacritice) și „Încarcă mai multe”.
(() => {
  const cards = [...document.querySelectorAll('.bl-card')];
  const chips = [...document.querySelectorAll('.bl-filter button')];
  const q = document.getElementById('bl-q');
  const more = document.getElementById('bl-more');
  const empty = document.getElementById('bl-empty');
  const count = document.getElementById('bl-count');
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const text = new Map(cards.map((c) => [c, norm(c.textContent)]));
  const PAGE = 9;
  let tip = '', limit = PAGE;
  const render = () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    const match = cards.filter((c) => (!tip || c.dataset.tip === tip) && words.every((w) => text.get(c).includes(w)));
    cards.forEach((c) => { c.hidden = true; });
    match.slice(0, limit).forEach((c) => { c.hidden = false; });
    more.hidden = match.length <= limit;
    more.textContent = `Încarcă mai multe (${match.length - limit})`;
    empty.hidden = match.length > 0;
    count.textContent = `${match.length} ${match.length === 1 ? 'articol' : 'articole'}`;
  };
  chips.forEach((b) => b.addEventListener('click', () => {
    chips.forEach((x) => x.classList.toggle('on', x === b));
    tip = b.dataset.tip; limit = PAGE; render();
  }));
  q.addEventListener('input', () => { limit = PAGE; render(); });
  more.addEventListener('click', () => { limit += PAGE; render(); });
  render();
})();
