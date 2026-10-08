/* LEADS: cereri de programare / contact, salvate în data/leads.json (nu se urcă pe GitHub). */
const LEAD_STATUS = [
  ['nou', 'Nou', ''], ['contactat', 'Contactat', 'grey'], ['programat', 'Programat', 'warn'],
  ['venit', 'Venit în clinică', 'ok'], ['pierdut', 'Pierdut', 'bad'],
];
const LEAD_SURSE = ['Formular site', 'Telefon', 'WhatsApp', 'Instagram', 'Facebook', 'Recomandare', 'Altul'];
const statusLabel = (id) => (LEAD_STATUS.find((s) => s[0] === id) || [id, id])[1];
const leadUI = { q: '', status: '', serviciu: '' };

routes.leads = function renderLeads() {
  const L = store.leads, E = store.entitati;
  const servicii = (E?.servicii || []).map((s) => s.nume);
  const rows = L.filter((l) =>
    (!leadUI.status || l.status === leadUI.status) &&
    (!leadUI.serviciu || l.serviciu === leadUI.serviciu) &&
    (!leadUI.q || [l.nume, l.email, l.telefon, l.mesaj, l.note, l.serviciu, l.medic].join(' ').toLowerCase().includes(leadUI.q)))
    .sort((a, b) => (b.creat || '').localeCompare(a.creat || ''));
  const valoare = L.filter((l) => l.status === 'venit').reduce((s, l) => s + (Number(l.valoare) || 0), 0);

  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage › leads · data/leads.json (local, nu se publică)</div><h1>Leads</h1></div>
      <button id="csvL" ${L.length ? '' : 'disabled'}>Export CSV</button><button class="primary" id="addL">+ Lead nou</button></div>
    <div class="kpis">
      <div class="kpi click ${!leadUI.status ? 'on' : ''}" data-st=""><b>${L.length}</b><span>Toate</span></div>
      ${LEAD_STATUS.map(([id, lab]) => `<div class="kpi click ${leadUI.status === id ? 'on' : ''}" data-st="${id}"><b>${L.filter((l) => l.status === id).length}</b><span>${esc(lab)}</span></div>`).join('')}
      <div class="kpi"><b>${lei(valoare)}</b><span>valoare (veniți în clinică)</span></div>
    </div>
    <div class="toolbar">
      <input type="search" id="qL" placeholder="Caută nume, email, telefon…" value="${esc(leadUI.q)}" aria-label="Caută lead">
      <select id="srvL" aria-label="Serviciu"><option value="">Toate serviciile</option>${servicii.map((s) => `<option ${leadUI.serviciu === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
      <span class="grow"></span><span class="muted small">${rows.length} din ${L.length}</span>
    </div>
    ${L.length === 0 ? `<div class="card empty"><b>Niciun lead încă</b>
        Adaugă manual cu „+ Lead nou” sau trimite din formularul site-ului un <code>POST /api/leads</code> cu JSON:<br><br>
        <code>{"nume":"…","telefon":"…","email":"…","serviciu":"Sculptra","mesaj":"…"}</code></div>`
    : `<div class="tbl"><table>
      <thead><tr><th>Data</th><th>Nume</th><th>Contact</th><th>Interes</th><th>Sursă</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows.map((l) => `<tr>
        <td class="small muted">${esc(fmtDate(l.creat))}</td>
        <td><b>${esc(l.nume)}</b>${l.mesaj ? `<div class="muted small">${esc(cut(l.mesaj, 90))}</div>` : ''}${l.note ? `<details class="calif"><summary>Note</summary><div class="small">${esc(l.note)}</div></details>` : ''}</td>
        <td class="small">${l.telefon ? `<a href="tel:${esc(l.telefon.replace(/\s/g, ''))}">${esc(l.telefon)}</a>` : ''}${l.email && l.telefon ? '<br>' : ''}${l.email ? `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : ''}</td>
        <td class="small">${esc(l.serviciu || '—')}${l.medic ? `<div class="muted">${esc(l.medic)}</div>` : ''}${l.valoare ? `<div class="muted">${lei(l.valoare)}</div>` : ''}</td>
        <td class="small">${esc(l.sursa || '—')}</td>
        <td><select class="stSel" data-id="${esc(l.id)}" aria-label="Status">${LEAD_STATUS.map(([id, lab]) => `<option value="${id}" ${l.status === id ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select></td>
        <td style="white-space:nowrap"><button class="sm" data-edit="${esc(l.id)}">Editează</button> <button class="sm danger" data-del="${esc(l.id)}">Șterge</button></td>
      </tr>`).join('') || '<tr><td colspan="7" class="empty">Niciun rezultat pentru filtrele alese.</td></tr>'}</tbody></table></div>`}`;

  $$('.kpi[data-st]').forEach((k) => (k.onclick = () => { leadUI.status = k.dataset.st; routes.leads(); }));
  $('#qL').oninput = (e) => { leadUI.q = e.target.value.trim().toLowerCase(); const pos = e.target.selectionStart; routes.leads(); const i = $('#qL'); i.focus(); i.setSelectionRange(pos, pos); };
  $('#srvL').onchange = (e) => { leadUI.serviciu = e.target.value; routes.leads(); };
  $('#addL').onclick = () => openLead();
  $('#csvL').onclick = () => download('moa-leads.csv', csv(L, [
    ['Data', (l) => l.creat], ['Nume', (l) => l.nume], ['Telefon', (l) => l.telefon], ['Email', (l) => l.email], ['Serviciu', (l) => l.serviciu],
    ['Medic', (l) => l.medic], ['Valoare RON', (l) => l.valoare], ['Sursa', (l) => l.sursa], ['Status', (l) => statusLabel(l.status)], ['Mesaj', (l) => l.mesaj], ['Note', (l) => l.note]]), 'text/csv;charset=utf-8');
  $$('.stSel').forEach((s) => (s.onchange = async () => { const l = L.find((x) => x.id === s.dataset.id); l.status = s.value; l.actualizat = nowLocal(); await saveLeads('Status actualizat'); routes.leads(); }));
  $$('[data-edit]').forEach((b) => (b.onclick = () => openLead(L.find((x) => x.id === b.dataset.edit))));
  $$('[data-del]').forEach((b) => (b.onclick = async () => {
    const l = L.find((x) => x.id === b.dataset.del);
    if (!confirm(`Ștergi lead-ul „${l.nume}”? Acțiunea nu poate fi anulată.`)) return;
    store.leads = L.filter((x) => x.id !== l.id); await saveLeads('Lead șters'); routes.leads();
  }));
};

async function saveLeads(msg) {
  try { await api.send('/api/leads', 'PUT', store.leads); updateCounts(); if (msg) toast(msg); }
  catch (e) { alert('Nu s-a putut salva: ' + e.message); }
}

function openLead(lead) {
  const E = store.entitati, isNew = !lead;
  const l = lead || { status: 'nou', sursa: 'Telefon' };
  const opt = (arr, val) => '<option value=""></option>' + arr.map((v) => `<option ${v === val ? 'selected' : ''}>${esc(v)}</option>`).join('');
  const f = $('#leadForm');
  f.innerHTML = `
    <h2>${isNew ? 'Lead nou' : 'Editează lead'}</h2>
    <div class="fgrid">
      <label class="full">Nume *<input name="nume" required value="${esc(l.nume)}"></label>
      <label>Telefon<input name="telefon" value="${esc(l.telefon)}"></label>
      <label>Email<input name="email" type="email" value="${esc(l.email)}"></label>
      <label>Serviciu de interes<select name="serviciu">${opt((E?.servicii || []).map((s) => s.nume), l.serviciu)}</select></label>
      <label>Medic preferat<select name="medic">${opt((E?.echipa || []).filter((p) => p.tip === 'Medic').map((p) => p.nume), l.medic)}</select></label>
      <label>Valoare estimată (lei)<input name="valoare" type="number" min="0" step="1" value="${esc(l.valoare)}"></label>
      <label>Sursă<select name="sursa">${LEAD_SURSE.map((s) => `<option ${s === l.sursa ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label>Status<select name="status">${LEAD_STATUS.map(([id, lab]) => `<option value="${id}" ${l.status === id ? 'selected' : ''}>${lab}</option>`).join('')}</select></label>
      <label class="full">Mesaj pacient<textarea name="mesaj" rows="3">${esc(l.mesaj)}</textarea></label>
      <label class="full">Note interne<textarea name="note" rows="3">${esc(l.note)}</textarea></label>
    </div>
    <div class="err" id="leadErr"></div>
    <div class="actions"><button type="button" id="cancelL">Renunță</button><button type="submit" class="primary">${isNew ? 'Adaugă' : 'Salvează'}</button></div>`;
  $('#cancelL').onclick = () => $('#leadDlg').close();
  f.onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    Object.keys(d).forEach((k) => { d[k] = d[k].trim(); if (!d[k]) delete d[k]; });
    if (!d.email && !d.telefon) { $('#leadErr').textContent = 'Completează cel puțin telefonul sau emailul.'; return; }
    const now = nowLocal();
    if (isNew) store.leads.push({ id: crypto.randomUUID().replace(/-/g, '').slice(0, 12), creat: now, ...d });
    else { Object.keys(lead).forEach((k) => { if (!['id', 'creat'].includes(k)) delete lead[k]; }); Object.assign(lead, d, { actualizat: now }); }
    $('#leadDlg').close();
    await saveLeads(isNew ? 'Lead adăugat' : 'Lead salvat');
    routes.leads();
  };
  $('#leadDlg').showModal();
}
