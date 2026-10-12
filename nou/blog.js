// Blog: filtru pe tip, căutare (fără diacritice) și „Încarcă mai multe”.
// Etichetele din paginile de articol deschid blogul filtrat: ?tip=ghid, ?cat=<categorie de tratamente>, ?tr=<tratament>.
(() => {
  const cards = [...document.querySelectorAll('.bl-card')];
  const chips = [...document.querySelectorAll('.bl-filter button')];
  const q = document.getElementById('bl-q');
  const more = document.getElementById('bl-more');
  const empty = document.getElementById('bl-empty');
  const count = document.getElementById('bl-count');
  const active = document.getElementById('bl-active');
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const text = new Map(cards.map((c) => [c, norm(c.textContent)]));
  const PAGE = 9;
  const url = new URLSearchParams(location.search);
  let tip = url.get('tip') || '', limit = PAGE;
  // filtrul pe temă (categorie sau tratament) vine doar din adresă. Venit dintr-o etichetă, articolul „cel mai nou” nu mai stă în față, ci intră în listă
  const cat = url.get('cat'), tr = url.get('tr');
  const fromTag = !!(tip || cat || tr);
  if (fromTag) document.querySelector('.bl-feat').hidden = true;
  const inTema = (c) => (!cat || c.dataset.cat === cat) && (!tr || c.dataset.tr === tr);
  if (cat || tr) {
    const ref = cards.find((c) => (tr ? c.dataset.tr === tr : c.dataset.cat === cat));
    if (ref) {
      active.querySelector('span').textContent = `Articole despre: ${tr ? ref.dataset.tema : ref.dataset.catNume}`;
      active.hidden = false;
    }
  }
  if (!chips.some((b) => b.dataset.tip === tip)) tip = '';
  chips.forEach((x) => x.classList.toggle('on', x.dataset.tip === tip));
  const render = () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    const match = cards.filter((c) => (fromTag ? inTema(c) : !('feat' in c.dataset)) && (!tip || c.dataset.tip === tip) && words.every((w) => text.get(c).includes(w)));
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
