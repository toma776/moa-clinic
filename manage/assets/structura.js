/* STRUCTURĂ: propunerea de arhitectură a site-ului și de meniu, pe user journey (data/structura.json). */
const STAGE_COLORS = { constientizare: '#5b8db8', explorare: '#8a6c40', incredere: '#3c8a63', decizie: '#b9822a', programare: '#b4372a', dupa: '#7a5aa6' };
const stageTag = (S, id) => { const e = S.etape.find((x) => x.id === id); return e ? `<span class="tag" style="background:${STAGE_COLORS[id]}1f;color:${STAGE_COLORS[id]}">${esc(e.nume)}</span>` : ''; };
const strUI = { mega: 0, sablon: 'tratament', q: '', open: new Set(['/probleme/', '/tratamente/']) };

routes.structura = async function renderStructura() {
  if (!store.structura) {
    $('#view').innerHTML = '<div class="empty">Se încarcă…</div>';
    store.structura = await api.get('/api/structura');
    if (!store.structura) { $('#view').innerHTML = '<div class="card empty"><b>Lipsește data/structura.json</b>Rulează <code>npm run structura</code>.</div>'; return; }
  }
  const S = store.structura, M = S.meniu, st = S.statistici;
  const top = M.principal[strUI.mega];

  const treeRow = (n, depth) => {
    const has = n.copii?.length, open = has && (strUI.open.has(n.url || n.nume) || !!strUI.q);
    const c = n.continut;
    const info = [
      c?.pret_de_la != null ? `<span class="tag">de la ${lei(c.pret_de_la)}</span>` : '',
      c?.video ? `<span class="tag grey">${plural(c.video, 'video', 'video')}</span>` : '',
      c?.intrebari ? `<span class="tag grey">${c.intrebari} întrebări</span>` : '',
      n.tratamente ? `<span class="tag grey">${plural(n.tratamente.length, 'tratament', 'tratamente')}</span>` : '',
      n.ghiduri?.length ? `<span class="tag grey">${plural(n.ghiduri.length, 'ghid', 'ghiduri')}</span>` : '',
      n.nou ? '<span class="tag warn">de creat</span>' : '',
    ].join('');
    const match = !strUI.q || JSON.stringify(n).toLowerCase().includes(strUI.q);
    if (!match) return '';
    return `<tr>
      <td style="padding-left:${10 + depth * 22}px">${has ? `<button class="caret" data-stog="${esc(n.url || n.nume)}" aria-label="${open ? 'Restrânge' : 'Extinde'}">${open ? '▾' : '▸'}</button>` : '<span class="caret-sp"></span>'}
        <b${n.tip === 'grup' ? ' class="muted"' : ''}>${esc(n.nume)}</b>${n.desc ? `<div class="ttitle">${esc(cut(n.desc, 140))}</div>` : ''}
        ${n.tratamente ? `<div class="ttitle">${n.tratamente.map((t) => esc(t.nume) + (t.pret_de_la != null ? ` (${lei(t.pret_de_la)})` : '')).join(' · ')}</div>` : ''}</td>
      <td class="small">${n.url ? `<code>${esc(n.url)}</code>` : ''}</td>
      <td>${n.etapa ? stageTag(S, n.etapa) : ''}</td>
      <td class="small">${(n.vechi || []).map((v) => link(SITE + v, v)).join('<br>') || '<span class="muted">—</span>'}</td>
      <td>${info}</td>
    </tr>` + (open ? n.copii.map((k) => treeRow(k, depth + 1)).join('') : '');
  };

  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage › structură · propunere generată din entități la ${esc(S.meta.generat)}</div><h1>Structura site-ului & meniul</h1></div>
      <button id="strCsv">Redirecturi CSV</button><button id="strExp">Export JSON</button></div>
    <p class="lead">${esc(S.meta.nota)}</p>
    <div class="kpis">
      <div class="kpi"><b>${st.pagini_noi}</b><span>pagini în structură</span></div>
      <div class="kpi"><b>${st.probleme}</b><span>pagini de probleme</span></div>
      <div class="kpi"><b>${st.tratamente}</b><span>pagini de tratament</span></div>
      <div class="kpi"><b>${st.de_creat}</b><span>pagini de creat</span></div>
      <div class="kpi"><b>${st.redirecturi}</b><span>redirecturi 301</span></div>
      <div class="kpi"><b>${st.articole_legate}</b><span>articole legate de probleme</span></div>
    </div>

    <section><h2>Principii</h2><div class="card"><ol class="clean" style="padding-left:20px">${S.principii.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></div></section>

    <section><h2>User journey <span class="n">6 etape · fiecare pagină are o etapă și un CTA</span></h2>
      <div class="journey">${S.etape.map((e, i) => `<div class="card jstep" style="--st:${STAGE_COLORS[e.id]}">
        <div class="jnum">${i + 1}</div><h3>${esc(e.nume)}</h3><p class="jq">${esc(e.intrebare)}</p>
        <h4 class="bh4">Pagini</h4>${tags(e.pagini, '')}
        <h4 class="bh4">Conținut</h4><ul class="clean small">${e.continut.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        <h4 class="bh4">CTA</h4><p class="small"><b>${esc(e.cta)}</b></p>
        <h4 class="bh4">Măsori</h4><p class="small">${esc(e.metrica)}</p></div>`).join('')}</div></section>

    <section><h2>Meniul propus <span class="n">click pe un element ca să vezi ce deschide</span></h2>
      <div class="menu-mock">
        <div class="mm-util">${M.utilitar.map((u) => `<span>${esc(u.nume)}</span>`).join('')}</div>
        <div class="mm-bar">
          <img src="/wp-content/uploads/2024/09/Logo-moa-alb-complet.svg" alt="MOA" class="mm-logo">
          <nav>${M.principal.map((m, i) => `<button type="button" class="mm-item ${i === strUI.mega ? 'on' : ''}" data-mega="${i}">${esc(m.nume)}${m.tip !== 'link' ? ' ▾' : ''}</button>`).join('')}</nav>
          <span class="mm-cta">${esc(M.cta.text)}</span>
        </div>
        <div class="mm-panel">
          ${top.coloane ? `<div class="mm-cols">${top.coloane.map((c) => `<div><b>${esc(c.titlu)}</b>${c.linkuri.map((l) => `<a>${esc(l.nume)}</a>`).join('')}</div>`).join('')}</div>`
            : top.linkuri ? `<div class="mm-cols"><div>${top.linkuri.map((l) => `<a>${esc(l.nume)}</a>`).join('')}</div></div>` : `<p class="small" style="margin:0">Link direct spre <code>${esc(top.url)}</code></p>`}
        </div>
      </div>
      <div class="grid2" style="margin-top:12px">
        <div class="card"><h3>${esc(top.nume)} ${stageTag(S, top.etapa)}</h3><p>${esc(top.nota || '')}</p><p class="small">URL: <code>${esc(top.url)}</code></p></div>
        <div class="card"><h3>CTA & mobil</h3><p>${esc(M.cta.nota)}</p><ul class="clean small">${M.mobil.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>
      </div>
      <h4 class="bh4">Footer</h4>
      <div class="grid">${M.footer.map((f) => `<div class="card"><h3>${esc(f.titlu)}</h3><ul class="clean small">${f.linkuri.map((l) => `<li>${esc(l.nume)}</li>`).join('')}</ul></div>`).join('')}</div>
    </section>

    <section><h2>Arborele site-ului <span class="n">URL nou · etapa din journey · URL-urile actuale care se mută aici</span></h2>
      <div class="toolbar"><input type="search" id="strQ" placeholder="Caută pagină, tratament, URL vechi…" value="${esc(strUI.q)}" aria-label="Caută în arbore"><button class="sm" id="strAll">Extinde tot</button><button class="sm" id="strNone">Restrânge tot</button></div>
      <div class="tbl"><table><thead><tr><th>Pagină</th><th>URL nou</th><th>Etapă</th><th>URL actual</th><th>Conținut existent</th></tr></thead>
        <tbody>${S.arbore.map((n) => treeRow(n, 0)).join('')}</tbody></table></div>
    </section>

    <section><h2>Șabloane de pagină <span class="n">ordinea blocurilor urmează journey-ul</span></h2>
      <div class="pills">${Object.keys(S.sabloane).map((k) => `<a href="#" data-sablon="${k}" class="${k === strUI.sablon ? 'on' : ''}">${esc({ tratament: 'Tratament', problema: 'Problemă', medic: 'Medic', acasa: 'Acasă' }[k] || k)}</a>`).join('')}</div>
      <div class="card" style="padding:0">${S.sabloane[strUI.sablon].map(([b, d, et], i) => `<div class="h-check" style="border-left:4px solid ${STAGE_COLORS[et]}"><span class="tag grey">${i + 1}</span><b>${esc(b)}</b><span class="muted small">${esc(d)}</span><span class="grow"></span>${stageTag(S, et)}</div>`).join('')}</div>
    </section>

    <section><h2>Redirecturi 301 <span class="n">${S.redirecturi.length} · fiecare URL actual are o destinație</span></h2>
      <details class="item"><summary><span class="name">Vezi toate redirecturile</span><span class="tag grey">${S.redirecturi.length}</span></summary>
        <div class="item-body" style="padding-top:12px"><div class="tbl"><table><thead><tr><th>URL actual</th><th>URL nou</th><th>Tip</th></tr></thead><tbody>
        ${S.redirecturi.map((r) => `<tr><td class="small">${link(SITE + r.vechi, r.vechi)}</td><td class="small"><code>${esc(r.nou)}</code></td><td><span class="tag grey">${esc(r.motiv)}</span></td></tr>`).join('')}
        </tbody></table></div></div></details>
      ${S.avertismente?.length ? `<p class="small">${tags(S.avertismente, 'warn')}</p>` : ''}
    </section>`;

  $$('[data-mega]').forEach((b) => (b.onclick = () => { strUI.mega = +b.dataset.mega; const y = scrollY; routes.structura(); scrollTo(0, y); }));
  $$('[data-sablon]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); strUI.sablon = a.dataset.sablon; const y = scrollY; routes.structura(); scrollTo(0, y); }));
  $$('[data-stog]').forEach((b) => (b.onclick = () => { const k = b.dataset.stog; strUI.open.has(k) ? strUI.open.delete(k) : strUI.open.add(k); const y = scrollY; routes.structura(); scrollTo(0, y); }));
  const all = []; (function walk(ns) { ns.forEach((n) => { if (n.copii?.length) { all.push(n.url || n.nume); walk(n.copii); } }); })(S.arbore);
  $('#strAll').onclick = () => { all.forEach((k) => strUI.open.add(k)); const y = scrollY; routes.structura(); scrollTo(0, y); };
  $('#strNone').onclick = () => { strUI.open.clear(); const y = scrollY; routes.structura(); scrollTo(0, y); };
  $('#strQ').oninput = (e) => { strUI.q = e.target.value.trim().toLowerCase(); const pos = e.target.selectionStart, y = scrollY; routes.structura(); scrollTo(0, y); const i = $('#strQ'); i.focus(); i.setSelectionRange(pos, pos); };
  $('#strExp').onclick = () => download('moa-structura.json', JSON.stringify(S, null, 2), 'application/json');
  $('#strCsv').onclick = () => download('moa-redirecturi.csv', csv(S.redirecturi, [['URL actual', (r) => SITE + r.vechi], ['URL nou', (r) => SITE + r.nou], ['Tip', (r) => r.motiv]]), 'text/csv;charset=utf-8');
};
