/* PAGES: toate URL-urile din sitemap (data/pages.json), ca arbore după structura URL-urilor sau ca listă. */
const pageUI = { q: '', tip: '', sectiune: '', problema: '', doarProbleme: false, sort: 'path', dir: 1, open: null, view: 'arbore', exp: new Set(['/']) };
const issueKey = (i) => i.replace(/\s*\(\d+\)$/, '').replace(/^\d+ x /, 'Mai multe ').replace(/ → .*$/, '');

routes.pages = function renderPages() {
  const P = store.pages;
  if (!P) { $('#view').innerHTML = '<div class="head"><div><div class="crumb">manage › pages</div><h1>Pages</h1></div></div><div class="card empty"><b>Nu există încă date despre pagini</b>Rulează <code>npm run crawl</code> și reîncarcă.</div>'; return; }
  const all = P.pages;
  const tipuri = [...new Set(all.map((p) => p.tip))].sort();
  const sectiuni = Object.entries(all.reduce((m, p) => ((m[p.sectiune] = (m[p.sectiune] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  const probleme = Object.entries(all.reduce((m, p) => (p.probleme.forEach((i) => (m[issueKey(i)] = (m[issueKey(i)] || 0) + 1)), m), {})).sort((a, b) => b[1] - a[1]);

  const rows = all.filter((p) =>
    (!pageUI.tip || p.tip === pageUI.tip) && (!pageUI.sectiune || p.sectiune === pageUI.sectiune) &&
    (!pageUI.problema || p.probleme.some((i) => issueKey(i) === pageUI.problema)) && (!pageUI.doarProbleme || p.probleme.length) &&
    (!pageUI.q || [p.path, p.title, p.h1, p.description].join(' ').toLowerCase().includes(pageUI.q)));
  const val = { path: (p) => p.path, title: (p) => p.title || '', tip: (p) => p.tip, cuvinte: (p) => p.cuvinte || 0, lastmod: (p) => p.lastmod || '', status: (p) => p.status, probleme: (p) => p.probleme.length, ms: (p) => p.ms };
  rows.sort((a, b) => { const x = val[pageUI.sort](a), y = val[pageUI.sort](b); return (x > y ? 1 : x < y ? -1 : 0) * pageUI.dir; });

  const th = (k, lab, cls = '') => `<th class="sort ${cls}" data-sort="${k}">${lab}${pageUI.sort === k ? (pageUI.dir > 0 ? ' ↑' : ' ↓') : ''}</th>`;
  const lenTag = (s, min, max) => (!s ? '<span class="tag bad">lipsă</span>' : `<span class="tag ${s.length > max || s.length < min ? 'warn' : 'ok'}">${s.length}</span>`);
  const issueTags = (p) => p.probleme.map((i) => `<span class="tag ${/HTTP|noindex|Fara|duplicat/.test(i) ? 'bad' : 'warn'}">${esc(i)}</span>`).join('') || '<span class="muted small">—</span>';
  const detail = (p, cols) => (pageUI.open === p.url ? `<tr class="row-detail"><td colspan="${cols}"><dl class="kv">
    <dt>URL</dt><dd>${link(p.url, p.url)}</dd><dt>Title</dt><dd>${esc(p.title || '—')}</dd><dt>Meta description</dt><dd>${esc(p.description || '—')}</dd>
    <dt>H1</dt><dd>${esc(p.h1 || '—')}${p.h1_count > 1 ? ` <span class="muted">(+${p.h1_count - 1})</span>` : ''}</dd><dt>Canonical</dt><dd>${esc(p.canonical || '—')}</dd>
    <dt>Robots</dt><dd>${esc(p.robots || '—')}</dd><dt>Schema</dt><dd>${tags(p.schema)}</dd>
    <dt>Cuvinte · imagini</dt><dd>${p.cuvinte ?? '—'} cuvinte · ${p.imagini ?? 0} imagini (${p.img_fara_alt ?? 0} fără alt)</dd>
    <dt>Publicat · modificat</dt><dd>${esc(p.publicat || '—')} · ${esc(p.modificat || p.lastmod || '—')}${p.autor ? ` · ${esc(p.autor)}` : ''}</dd>
    <dt>Răspuns · HTML</dt><dd>${p.ms} ms · ${p.kb} KB</dd><dt>Secțiune / sitemap</dt><dd>${esc(p.sectiune)} · ${esc(p.sitemap)}</dd>
  </dl></td></tr>` : '');

  // arbore după structura URL-urilor
  const filtering = rows.length !== all.length, visible = new Set(rows.map((p) => p.path));
  const root = { name: '', path: '/', kids: new Map(), page: null };
  for (const p of all) {
    let node = root, acc = '/';
    for (const s of p.path.split('/').filter(Boolean)) { acc += s + '/'; if (!node.kids.has(s)) node.kids.set(s, { name: s, path: acc, kids: new Map(), page: null }); node = node.kids.get(s); }
    if (p.path === '/') root.page = p; else node.page = p;
  }
  const agg = (n) => { n.tot = n.page ? 1 : 0; n.iss = n.page?.probleme.length ? 1 : 0; n.vis = !!(n.page && visible.has(n.page.path)); for (const k of n.kids.values()) { agg(k); n.tot += k.tot; n.iss += k.iss; n.vis ||= k.vis; } };
  agg(root);
  const folders = []; (function collect(n) { if (n.kids.size) folders.push(n.path); n.kids.forEach(collect); })(root);
  const kids = (n) => [...n.kids.values()].sort((a, b) => (b.kids.size > 0) - (a.kids.size > 0) || a.name.localeCompare(b.name));
  const treeRows = (n, depth) => {
    if (!n.vis && n !== root) return '';
    const p = n.page, open = filtering || pageUI.exp.has(n.path), has = n.kids.size > 0;
    const label = n === root ? 'moaclinic.ro' : n.name;
    return `<tr class="tnode ${p ? 'pr' : 'virt'}" ${p ? `data-url="${esc(p.url)}" style="cursor:pointer"` : ''}>
      <td class="tcell" style="padding-left:${10 + depth * 20}px">
        ${has ? `<button class="caret" data-tog="${esc(n.path)}" aria-label="${open ? 'Restrânge' : 'Extinde'}">${open ? '▾' : '▸'}</button>` : '<span class="caret-sp"></span>'}
        <span class="tname">${has ? '📁' : '📄'} ${p ? link(p.url, label) : `<span class="muted">${esc(label)}</span>`}</span>
        ${has ? `<span class="tcount">${plural(n.tot, 'pagină', 'pagini')}${n.iss ? ` · <b>${n.iss}</b> cu probleme` : ''}</span>` : ''}
        ${p?.title ? `<div class="ttitle">${esc(p.title)}</div>` : !p ? '<div class="ttitle">fără pagină proprie în sitemap</div>' : ''}
      </td>
      <td>${p ? `<span class="tag grey">${esc(p.tip)}</span>` : ''}</td>
      <td>${p ? `<span class="tag ${p.status === 200 ? 'ok' : 'bad'}">${p.status}</span>` : ''}</td>
      <td>${p ? lenTag(p.description, 70, 160) : ''}</td>
      <td>${p ? `<span class="tag ${p.h1_count === 1 ? 'ok' : p.h1_count ? 'warn' : 'bad'}">${p.h1_count ?? '—'}</span>` : ''}</td>
      <td>${p ? issueTags(p) : ''}</td>
    </tr>${p ? detail(p, 6) : ''}` + (has && open ? kids(n).map((k) => treeRows(k, depth + 1)).join('') : '');
  };

  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage › pages · crawl ${esc(P.crawled_at)} din sitemap-urile ${link(P.site, "moaclinic.ro")} · ${Math.round(P.durata_ms / 1000)} s</div><h1>Pages</h1></div><button id="csvP">Export CSV</button></div>
    <div class="kpis">
      <div class="kpi"><b>${all.length}</b><span>URL-uri în sitemap</span></div>
      ${[['Pagina', 'Pagini'], ['Articol', 'Articole'], ['Categorie', 'Categorii']].map(([t, lab]) => `<div class="kpi click ${pageUI.tip === t ? 'on' : ''}" data-tip="${t}"><b>${all.filter((p) => p.tip === t).length}</b><span>${lab}</span></div>`).join('')}
      <div class="kpi click ${pageUI.doarProbleme ? 'on' : ''}" id="kIss"><b>${all.filter((p) => p.probleme.length).length}</b><span>cu probleme SEO</span></div>
      <div class="kpi"><b>${all.filter((p) => p.status !== 200).length}</b><span>status ≠ 200</span></div>
      <div class="kpi"><b>${(P.linkuri || []).filter((l) => l.status !== 200).length}</b><span>linkuri interne cu redirect/eroare</span></div>
    </div>
    <div class="toolbar">
      <input type="search" id="qP" placeholder="Caută URL, title, H1…" value="${esc(pageUI.q)}" aria-label="Caută pagină">
      <select id="tipP" aria-label="Tip"><option value="">Toate tipurile</option>${tipuri.map((t) => `<option ${pageUI.tip === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
      <select id="secP" aria-label="Secțiune"><option value="">Toate secțiunile</option>${sectiuni.map(([s, n]) => `<option value="${esc(s)}" ${pageUI.sectiune === s ? 'selected' : ''}>${esc(s)} (${n})</option>`).join('')}</select>
      <select id="issP" aria-label="Problemă"><option value="">Orice problemă</option>${probleme.map(([s, n]) => `<option value="${esc(s)}" ${pageUI.problema === s ? 'selected' : ''}>${esc(s)} (${n})</option>`).join('')}</select>
      <span class="grow"></span><span class="muted small">${rows.length} din ${all.length}</span>
    </div>
    <div class="toolbar">
      <div class="seg"><button class="sm ${pageUI.view === 'arbore' ? 'on' : ''}" data-view="arbore">Arbore</button><button class="sm ${pageUI.view === 'lista' ? 'on' : ''}" data-view="lista">Listă</button></div>
      ${pageUI.view === 'arbore' && !filtering ? '<button class="sm" id="expAll">Extinde tot</button><button class="sm" id="colAll">Restrânge tot</button>' : ''}
      ${pageUI.view === 'arbore' && filtering ? '<span class="muted small">Filtru activ: sunt afișate paginile găsite, cu dosarele lor deschise.</span>' : ''}
    </div>
    ${pageUI.view === 'arbore'
      ? `<div class="tbl"><table><thead><tr><th>Structură</th><th>Tip</th><th>HTTP</th><th>Desc.</th><th>H1</th><th>Probleme</th></tr></thead><tbody>${root.vis ? treeRows(root, 0) : '<tr><td colspan="6" class="empty">Niciun rezultat.</td></tr>'}</tbody></table></div>`
      : `<div class="tbl"><table><thead><tr>${th('path', 'URL')}${th('tip', 'Tip')}${th('title', 'Title')}<th>Desc.</th><th>H1</th>${th('cuvinte', 'Cuvinte', 'num')}${th('ms', 'ms', 'num')}${th('lastmod', 'Modificat')}${th('status', 'HTTP')}${th('probleme', 'Probleme')}</tr></thead>
        <tbody>${rows.map((p) => `<tr class="pr" data-url="${esc(p.url)}" style="cursor:pointer">
          <td class="small">${link(p.url, p.path)}</td><td><span class="tag grey">${esc(p.tip)}</span></td>
          <td class="small">${esc(p.title || '—')} ${lenTag(p.title, 25, 65)}</td><td>${lenTag(p.description, 70, 165)}</td>
          <td><span class="tag ${p.h1_count === 1 ? 'ok' : p.h1_count ? 'warn' : 'bad'}">${p.h1_count ?? '—'}</span></td>
          <td class="num small">${p.cuvinte ?? '—'}</td><td class="num small">${p.ms}</td><td class="small muted">${esc(p.lastmod || '—')}</td>
          <td><span class="tag ${p.status === 200 ? 'ok' : 'bad'}">${p.status}</span></td><td>${issueTags(p)}</td>
        </tr>${detail(p, 10)}`).join('') || '<tr><td colspan="10" class="empty">Niciun rezultat.</td></tr>'}</tbody></table></div>`}`;

  const keepFocus = (id, fn) => (e) => { const pos = e.target.selectionStart; fn(e); routes.pages(); const i = $(id); i.focus(); i.setSelectionRange(pos, pos); };
  $('#qP').oninput = keepFocus('#qP', (e) => (pageUI.q = e.target.value.trim().toLowerCase()));
  $('#tipP').onchange = (e) => { pageUI.tip = e.target.value; routes.pages(); };
  $('#secP').onchange = (e) => { pageUI.sectiune = e.target.value; routes.pages(); };
  $('#issP').onchange = (e) => { pageUI.problema = e.target.value; routes.pages(); };
  $$('.kpi[data-tip]').forEach((k) => (k.onclick = () => { pageUI.tip = pageUI.tip === k.dataset.tip ? '' : k.dataset.tip; routes.pages(); }));
  $('#kIss').onclick = () => { pageUI.doarProbleme = !pageUI.doarProbleme; routes.pages(); };
  $$('th[data-sort]').forEach((t) => (t.onclick = () => { if (pageUI.sort === t.dataset.sort) pageUI.dir *= -1; else { pageUI.sort = t.dataset.sort; pageUI.dir = 1; } routes.pages(); }));
  $$('[data-view]').forEach((b) => (b.onclick = () => { pageUI.view = b.dataset.view; routes.pages(); }));
  $$('[data-tog]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); const k = b.dataset.tog; pageUI.exp.has(k) ? pageUI.exp.delete(k) : pageUI.exp.add(k); const y = window.scrollY; routes.pages(); window.scrollTo(0, y); }));
  if ($('#expAll')) $('#expAll').onclick = () => { folders.forEach((p) => pageUI.exp.add(p)); routes.pages(); };
  if ($('#colAll')) $('#colAll').onclick = () => { pageUI.exp = new Set(['/']); routes.pages(); };
  $$('tr.pr').forEach((r) => (r.onclick = (e) => { if (e.target.closest('a,button')) return; pageUI.open = pageUI.open === r.dataset.url ? null : r.dataset.url; const y = window.scrollY; routes.pages(); window.scrollTo(0, y); }));
  $('#csvP').onclick = () => download('moa-pages.csv', csv(rows, [
    ['URL', (p) => p.url], ['Tip', (p) => p.tip], ['Sectiune', (p) => p.sectiune], ['HTTP', (p) => p.status], ['Title', (p) => p.title], ['Title len', (p) => p.title?.length],
    ['Description', (p) => p.description], ['Desc len', (p) => p.description?.length], ['H1', (p) => p.h1], ['H1 count', (p) => p.h1_count], ['Canonical', (p) => p.canonical],
    ['Cuvinte', (p) => p.cuvinte], ['ms', (p) => p.ms], ['KB', (p) => p.kb], ['Lastmod', (p) => p.lastmod], ['Probleme', (p) => p.probleme.join(', ')]]), 'text/csv;charset=utf-8');
};
