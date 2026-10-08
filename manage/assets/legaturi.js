/* LEGĂTURI: graful entităților. Noduri = entitățile din data/entitati.json; legături = relațiile găsite pe site
   (serviciu -> tehnologii/produse/concepte/oameni de pe pagina lui, articol -> entitățile menționate, termen -> articole,
   întrebare -> servicii/termeni/medici, recenzie -> medic, ofertă -> serviciu). Fiecare tip e un „lob” legat de MOA, în centru. */
const GRAPH_CATS = {
  moa: ['MOA Clinic', '#d8b98a', 'brand'],
  servicii: ['Servicii', '#e7a85c', 'servicii'],
  echipa: ['Echipa', '#7fc8a9', 'echipa'],
  tehnologii: ['Tehnologii', '#8fb4e3', 'tehnologii'],
  produse: ['Mărci', '#b9a3e3', 'tehnologii'],
  concepte: ['Concepte', '#f2d07a', 'brand'],
  blog: ['Blog', '#e8919f', 'blog'],
  glosar: ['Glosar', '#9fd38a', 'glosar'],
  intrebari: ['Întrebări', '#ffd6a5', 'intrebari'],
  dovezi: ['Recenzii', '#ff8f7a', 'dovezi'],
  oferte: ['Oferte', '#c9b79c', 'preturi'],
};
const loadScript = (id, url) => new Promise((ok, err) => {
  if (document.getElementById(id)) return ok();
  const s = Object.assign(document.createElement('script'), { id, src: url, onload: ok, onerror: err });
  document.head.appendChild(s);
});
const normTxt = (v) => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function graphData(D) {
  const nodes = new Map(), links = [];
  const node = (id, nume, cat, extra = {}) => { if (!nodes.has(id)) nodes.set(id, { id, nume, cat, ...extra }); return id; };
  const rel = (a, b, tip = 'rel') => { if (a && b && a !== b && nodes.has(a) && nodes.has(b) && !links.some((l) => (l.source === a && l.target === b) || (l.source === b && l.target === a))) links.push({ source: a, target: b, tip }); };

  node('moa', 'MOA Clinic', 'moa', { centru: true });
  for (const [c, [t]] of Object.entries(GRAPH_CATS)) if (c !== 'moa') { node('lob:' + c, t, c, { lob: true }); rel('moa', 'lob:' + c, 'lob'); }
  const byName = new Map();
  const add = (id, nume, cat, extra) => { node(id, nume, cat, extra); rel('lob:' + cat, id, 'lob'); byName.set(normTxt(nume), id); return id; };

  for (const s of D.servicii) add('s:' + s.id, s.nume, 'servicii', { important: true });
  for (const p of D.echipa) add('p:' + normTxt(p.nume), p.nume, 'echipa', { important: p.tip === 'Medic' });
  for (const t of D.tehnologii) add('t:' + normTxt(t.nume), t.nume, 'tehnologii', { important: true });
  for (const t of D.produse) add('m:' + normTxt(t.nume), t.nume, 'produse');
  for (const c of D.concepte || []) add('c:' + normTxt(c.nume), c.nume, 'concepte', { important: true });
  const find = (name) => byName.get(normTxt(name));

  // serviciu -> ce apare pe pagina lui
  for (const s of D.servicii) {
    for (const x of [...s.tehnologii, ...s.produse, ...s.concepte, ...s.echipa]) rel('s:' + s.id, find(x));
    for (const m of s.medici || []) rel('s:' + s.id, find(m), 'spec');
  }
  // articole -> entitățile menționate
  const artByUrl = new Map();
  D.articole.forEach((a, i) => { const id = add('a:' + i, a.titlu, 'blog', { tip: a.tip }); artByUrl.set(a.url, id); for (const e of a.entitati) rel(id, find(e)); });
  // glosar -> articolele în care apare
  for (const g of D.glosar || []) { const id = add('g:' + normTxt(g.nume), g.nume, 'glosar'); for (const u of g.articole) rel(id, artByUrl.get(u)); }
  // întrebări -> servicii, termeni, medici
  for (const q of D.intrebari || []) {
    const id = add('q:' + q.id, q.intrebare, 'intrebari', { status: q.status });
    for (const s of q.legaturi.servicii || []) rel(id, 's:' + s);
    for (const g of q.legaturi.glosar || []) rel(id, find(g));
    for (const p of q.legaturi.echipa || []) rel(id, find(p));
  }
  // recenzii -> medic
  D.dovezi.testimoniale.forEach((t, i) => { const id = add('r:' + i, t.persoana, 'dovezi'); rel(id, find(t.medic)); });
  // oferte -> serviciul din nume
  D.oferte.forEach((o, i) => {
    const id = add('o:' + i, o.nume, 'oferte');
    const n = normTxt(o.nume);
    const GENERIC = /^(tratament|tratamente|consultatie|proceduri|injectare|injectari|terapia|terapie|acid|hialuronic|facial|faciala|definitiva|bucuresti)$/;
    for (const s of D.servicii) {
      const words = normTxt(s.nume).split(/[^a-z0-9]+/).filter((w) => w.length >= 5 && !GENERIC.test(w));
      if (words.some((w) => n.includes(w))) rel(id, 's:' + s.id);
    }
    for (const t of D.tehnologii) if (n.includes(normTxt(t.nume))) rel(id, find(t.nume));
  });

  const deg = new Map();
  for (const l of links) if (l.tip !== 'lob') for (const k of [l.source, l.target]) deg.set(k, (deg.get(k) || 0) + 1);
  for (const n of nodes.values()) n.deg = deg.get(n.id) || 0;
  return { nodes: [...nodes.values()], links };
}

routes.legaturi = function renderLegaturi() {
  const D = store.entitati;
  if (!D) { $('#view').innerHTML = '<div class="card empty"><b>Lipsește data/entitati.json</b></div>'; return; }
  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage › legături · din data/entitati.json</div><h1>Legături</h1></div></div>
    <div class="brain" id="brain"></div>`;
  renderGraph(D, $('#brain'), (cat) => navigate('/manage/entitati/' + cat));
};

async function renderGraph(D, el, openCat) {
  el.innerHTML = '<div class="brain-load">Se încarcă graful…</div>';
  try { await loadScript('d3js', 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js'); }
  catch { el.innerHTML = '<div class="brain-load">Nu s-a putut încărca biblioteca grafică (d3, cdnjs).</div>'; return; }
  const { nodes, links } = graphData(D);
  const real = links.filter((l) => l.tip !== 'lob');
  const hidden = new Set();
  el.innerHTML = `
    <div class="brain-head">
      <div><b>Harta entităților MOA</b><div class="brain-sub">${nodes.filter((n) => !n.lob && !n.centru).length} entități · ${real.length} legături între ele. Treci cu mouse-ul peste un nod ca să vezi cu ce se leagă; click pentru detalii.</div></div>
      <div class="brain-tools"><button type="button" class="brain-iso" aria-pressed="false">Arată ce e izolat</button><input type="search" class="brain-q" placeholder="Caută o entitate…" aria-label="Caută în graf"></div>
    </div>
    <div class="brain-legend">${Object.entries(GRAPH_CATS).map(([c, [t, col]]) => `<button type="button" data-gc="${c}" style="--c:${col}"><i></i>${esc(t)}</button>`).join('')}</div>
    <div class="brain-stage"><svg role="img" aria-label="Graful entităților"></svg><div class="brain-tip" hidden></div><div class="brain-info" hidden></div>
      <div class="brain-ctrl"><button type="button" data-z="1.3" title="Mărește">+</button><button type="button" data-z="0.77" title="Micșorează">−</button><button type="button" data-z="0" title="Toată imaginea">⤢</button></div></div>`;
  const stage = $('.brain-stage', el), tip = $('.brain-tip', el), info = $('.brain-info', el);
  const W = stage.clientWidth, H = stage.clientHeight;
  const svg = d3.select($('svg', el)).attr('viewBox', [-W / 2, -H / 2, W, H]);
  const glow = svg.append('defs').append('filter').attr('id', 'gglow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  glow.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'b');
  const fm = glow.append('feMerge'); fm.append('feMergeNode').attr('in', 'b'); fm.append('feMergeNode').attr('in', 'SourceGraphic');
  const root = svg.append('g');
  const zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', (e) => root.attr('transform', e.transform));
  svg.call(zoom);

  const col = (n) => GRAPH_CATS[n.cat][1];
  const rad = (n) => (n.centru ? 24 : n.lob ? 11 : 3 + Math.min(9, Math.sqrt(n.deg) * 1.8) + (n.important ? 2 : 0));
  const cats = Object.keys(GRAPH_CATS).filter((c) => c !== 'moa');
  const ang = Object.fromEntries(cats.map((c, i) => [c, (i / cats.length) * 2 * Math.PI]));
  const R0 = Math.min(W, H) * 0.36;
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d) => d.id).distance((l) => (l.tip === 'lob' ? (l.source.centru ? R0 * 0.8 : 55) : 70)).strength((l) => (l.tip === 'lob' ? (l.source.centru ? 0.9 : 0.25) : l.tip === 'spec' ? 0.02 : 0.07)))
    .force('charge', d3.forceManyBody().strength((n) => (n.centru ? -900 : n.lob ? -380 : -28)))
    .force('collide', d3.forceCollide((n) => rad(n) + 2.5))
    .force('x', d3.forceX((n) => (n.centru ? 0 : Math.cos(ang[n.cat] ?? 0) * (n.lob ? R0 * 0.62 : R0))).strength((n) => (n.centru ? 1 : 0.06)))
    .force('y', d3.forceY((n) => (n.centru ? 0 : Math.sin(ang[n.cat] ?? 0) * (n.lob ? R0 * 0.62 : R0) * 0.8)).strength((n) => (n.centru ? 1 : 0.07)));

  const linkSel = root.append('g').selectAll('line').data(links).join('line').attr('class', (l) => 'b-l ' + (l.tip === 'lob' ? 'lob' : ''));
  const pulses = root.append('g').attr('class', 'b-pulses');
  const nodeSel = root.append('g').selectAll('g').data(nodes).join('g').attr('class', (n) => 'b-n' + (n.lob ? ' lob' : '') + (n.centru ? ' centru' : ''))
    .call(d3.drag().on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; }).on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
  nodeSel.append('circle').attr('r', rad).attr('fill', (n) => (n.lob || n.centru ? '#1a1815' : col(n))).attr('stroke', col).attr('stroke-width', (n) => (n.lob || n.centru ? 2.5 : 0))
    .attr('filter', (n) => (n.centru || n.lob || n.important ? 'url(#gglow)' : null));
  nodeSel.filter((n) => n.lob || n.centru || n.important).append('text').attr('dy', (n) => -rad(n) - 5).attr('text-anchor', 'middle')
    .attr('class', (n) => (n.lob || n.centru ? 'b-t lob' : 'b-t')).text((n) => cut(n.nume, 24));

  const nb = new Map(nodes.map((n) => [n.id, new Set()]));
  for (const l of links) { nb.get(l.source.id).add(l.target.id); nb.get(l.target.id).add(l.source.id); }
  const focus = (n) => {
    const set = n ? new Set([n.id, ...nb.get(n.id)]) : null;
    el.classList.toggle('b-focus', !!n);
    nodeSel.classed('on', (d) => !!set?.has(d.id));
    linkSel.classed('on', (l) => !!n && (l.source.id === n.id || l.target.id === n.id));
  };
  const center = (n, k = 1.6) => svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity.scale(k).translate(-n.x, -n.y));
  const closeInfo = () => { info.hidden = true; delete info.dataset.id; focus(null); };

  nodeSel.on('mouseenter', (e, n) => {
    focus(n);
    const k = [...nb.get(n.id)].filter((id) => !id.startsWith('lob:') && id !== 'moa').length;
    tip.innerHTML = `<b>${esc(n.nume)}</b><span>${esc(GRAPH_CATS[n.cat][0])}${n.lob || n.centru ? '' : ` · ${plural(k, 'legătură', 'legături')}`}</span>`;
    tip.hidden = false;
  }).on('mousemove', (e) => { const r = stage.getBoundingClientRect(); tip.style.left = e.clientX - r.left + 14 + 'px'; tip.style.top = e.clientY - r.top + 10 + 'px'; })
    .on('mouseleave', () => { tip.hidden = true; if (!info.dataset.id) focus(null); })
    .on('click', (e, n) => {
      e.stopPropagation();
      if (n.lob) return openCat(GRAPH_CATS[n.cat][2]);
      if (n.centru) return openCat('brand');
      info.dataset.id = n.id; focus(n);
      const grp = {};
      for (const id of nb.get(n.id)) { const m = nodes.find((x) => x.id === id); if (!m.lob && !m.centru) (grp[m.cat] ||= []).push(m); }
      info.innerHTML = `<button type="button" class="b-x" aria-label="Închide">×</button>
        <div class="b-cat" style="--c:${col(n)}">${esc(GRAPH_CATS[n.cat][0])}</div><h4>${esc(n.nume)}</h4>
        ${Object.keys(grp).length ? Object.entries(grp).map(([c, a]) => `<div class="b-g"><span style="--c:${GRAPH_CATS[c][1]}">${esc(GRAPH_CATS[c][0])} · ${a.length}</span>${a.slice(0, 8).map((m) => `<a href="#" data-gn="${esc(m.id)}">${esc(cut(m.nume, 70))}</a>`).join('')}${a.length > 8 ? `<em>și încă ${a.length - 8}</em>` : ''}</div>`).join('') : '<p class="small">Nicio legătură directă: e legată doar de categoria ei.</p>'}
        <button type="button" class="sm" data-open="${GRAPH_CATS[n.cat][2]}">Deschide ${esc(GRAPH_CATS[n.cat][0])} →</button>`;
      info.hidden = false;
    });
  info.onclick = (e) => {
    if (e.target.closest('.b-x')) return closeInfo();
    const o = e.target.closest('[data-open]'); if (o) return openCat(o.dataset.open);
    const a = e.target.closest('[data-gn]');
    if (a) { e.preventDefault(); const m = nodes.find((x) => x.id === a.dataset.gn); nodeSel.filter((d) => d === m).dispatch('click'); center(m); }
  };
  svg.on('click', closeInfo);

  sim.on('tick', () => {
    linkSel.attr('x1', (l) => l.source.x).attr('y1', (l) => l.source.y).attr('x2', (l) => l.target.x).attr('y2', (l) => l.target.y);
    nodeSel.attr('transform', (n) => `translate(${n.x},${n.y})`);
  });

  // impulsuri de lumină pe legăturile reale
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && real.length) {
    const P = d3.range(26).map(() => ({ l: real[Math.floor(Math.random() * real.length)], t: Math.random(), v: 0.004 + Math.random() * 0.008 }));
    const dots = pulses.selectAll('circle').data(P).join('circle').attr('r', 1.8).attr('opacity', 0.85);
    const step = () => {
      if (!el.isConnected) return;
      for (const p of P) { p.t += p.v; if (p.t >= 1 || hidden.has(p.l.source.cat) || hidden.has(p.l.target.cat)) { p.l = real[Math.floor(Math.random() * real.length)]; p.t = 0; } }
      dots.attr('cx', (p) => p.l.source.x + (p.l.target.x - p.l.source.x) * p.t).attr('cy', (p) => p.l.source.y + (p.l.target.y - p.l.source.y) * p.t).attr('fill', (p) => GRAPH_CATS[p.l.source.cat][1]);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // entitățile fără nicio legătură reală
  const iso = nodes.filter((n) => !n.lob && !n.centru && n.deg === 0);
  const isoBtn = $('.brain-iso', el);
  isoBtn.textContent = `Arată ce e izolat (${iso.length})`;
  isoBtn.onclick = () => {
    const on = isoBtn.getAttribute('aria-pressed') !== 'true';
    isoBtn.setAttribute('aria-pressed', on);
    el.classList.toggle('b-iso', on);
    nodeSel.classed('iso', (n) => iso.includes(n));
    if (!on) return closeInfo();
    focus(null); delete info.dataset.id;
    const grp = {}; for (const n of iso) (grp[n.cat] ||= []).push(n);
    info.innerHTML = `<button type="button" class="b-x" aria-label="Închide">×</button>
      <div class="b-cat" style="--c:#ec8577">De legat</div><h4>${plural(iso.length, 'entitate', 'entități')} fără nicio legătură</h4>
      <p class="small">Sunt legate doar de categoria lor. Pentru Google și pentru asistenții AI, ar trebui legate de servicii, medici sau articole (linkuri interne, mențiuni, schema).</p>
      ${Object.entries(grp).map(([c, a]) => `<div class="b-g"><span style="--c:${GRAPH_CATS[c][1]}">${esc(GRAPH_CATS[c][0])} · ${a.length}</span>${a.map((m) => `<a href="#" data-gn="${esc(m.id)}">${esc(cut(m.nume, 70))}</a>`).join('')}</div>`).join('') || '<p>Toate entitățile au cel puțin o legătură.</p>'}`;
    info.hidden = false;
  };
  $('.brain-legend', el).onclick = (e) => {
    const b = e.target.closest('[data-gc]'); if (!b || b.dataset.gc === 'moa') return;
    const c = b.dataset.gc; hidden.has(c) ? hidden.delete(c) : hidden.add(c); b.classList.toggle('off', hidden.has(c));
    nodeSel.style('display', (n) => (hidden.has(n.cat) ? 'none' : null));
    linkSel.style('display', (l) => (hidden.has(l.source.cat) || hidden.has(l.target.cat) ? 'none' : null));
  };
  $('.brain-q', el).oninput = (e) => {
    const q = normTxt(e.target.value); if (q.length < 2) return focus(null);
    const m = nodes.find((n) => !n.lob && normTxt(n.nume).includes(q)); if (m) { focus(m); center(m); }
  };
  const fit = () => {
    const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const k = Math.min(2, 0.9 * Math.min(W / (x1 - x0 + 40), H / (y1 - y0 + 40)));
    svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity.scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2));
  };
  $('.brain-ctrl', el).onclick = (e) => { const z = e.target.closest('[data-z]'); if (!z) return; const k = Number(z.dataset.z); k ? svg.transition().duration(300).call(zoom.scaleBy, k) : fit(); };
  sim.on('end', fit);
  setTimeout(fit, 2500);
}
