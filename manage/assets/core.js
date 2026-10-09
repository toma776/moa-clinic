/* Nucleul panoului: utilitare, date, rutare, iconițe, dashboard. */
const SITE = 'https://moaclinic.ro';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const shortUrl = (u) => String(u || '').replace(/^https?:\/\/(www\.)?moaclinic\.ro/, '') || '/';
const link = (u, t) => (u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t ?? shortUrl(u))}</a>` : '<span class="muted">—</span>');
const lei = (n) => (n == null || n === '' ? '—' : `${Number(n).toLocaleString('ro-RO')} lei`);
const tags = (list, cls = 'grey') => [].concat(list || []).filter(Boolean).map((t) => `<span class="tag ${cls}">${esc(t)}</span>`).join('');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const cut = (s, n = 60) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const nowLocal = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const fmtDate = (s) => (s ? new Date(s).toLocaleString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2200); };
const download = (name, text, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); };
const csv = (rows, cols) => '﻿' + [cols.map((c) => c[0]).join(';'), ...rows.map((r) => cols.map((c) => `"${String(c[1](r) ?? '').replace(/"/g, '""')}"`).join(';'))].join('\n');
// lista de pagini pe care apare o entitate
const src = (list) => {
  const L = [...new Set([].concat(list || []).filter(Boolean))];
  if (!L.length) return '';
  return `<details class="src"><summary>${plural(L.length, 'pagină', 'pagini')}</summary>${L.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(shortUrl(u))}</a>`).join('')}</details>`;
};

const api = {
  get: (u) => fetch(u, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  send: (u, method, body) => fetch(u, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body, null, 2) })
    .then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }),
};

const store = { entitati: null, pages: null, leads: [], brand: null, health: null, qStatus: {}, obsStatus: {} };

/* ---------- iconițe (stroke 24×24) ---------- */
const ICON = {
  brand: '<path d="M4 20V8l8-5 8 5v12M4 20h16M9 20v-6h6v6M9 10h.01M15 10h.01"/>',
  echipa: '<path d="M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 10a3 3 0 100-6 3 3 0 000 6zM21 19v-1a4 4 0 00-3-3.9M15.5 4.1a3 3 0 010 5.8"/>',
  servicii: '<path d="M18 3l3 3-9.5 9.5-4 1 1-4zM14 7l3 3M4 21h7"/>',
  tehnologii: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20h8M12 16v4M8 10h.01M12 10h4"/>',
  preturi: '<path d="M20 12l-8 8-9-9V3h8zM7.5 7.5h.01"/>',
  blog: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9zM14 3v6h6M8 13h8M8 17h5"/>',
  glosar: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5zM4 19.5A2.5 2.5 0 006.5 22H20v-5M9 7h7M9 11h5"/>',
  dovezi: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  intrebari: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01"/>',
  media: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-9 8"/>',
  seo: '<path d="M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5M8 11h6M11 8v6"/>',
};
const icon = (id, size = 20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[id] || ICON.brand}</svg>`;

/* ---------- rutare ---------- */
const routes = {};
function routeFromPath() {
  const seg = location.pathname.replace(/^\/manage\/?/, '').split('/')[0];
  return routes[seg] ? seg : 'dashboard';
}
function go(route) {
  $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === route));
  routes[route]();
  window.scrollTo(0, 0);
}
function navigate(path) {
  history.pushState({}, '', path);
  go(routeFromPath());
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-route], a[data-go]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  navigate(a.dataset.go ? '/manage/' + a.dataset.go : a.getAttribute('href'));
});
window.addEventListener('popstate', () => go(routeFromPath()));

// numărul total de entități: suma grupurilor din toate categoriile (fără Audit SEO)
function entityTotal(E) {
  const S = entitySections(E);
  return entityCategories(E).filter((c) => !c.audit).flatMap((c) => c.sections).reduce((n, id) => n + (S[id]?.count || 0), 0);
}

function updateCounts() {
  const E = store.entitati;
  $('#n-entitati').textContent = E ? entityTotal(E) : '';
  $('#n-leads').textContent = store.leads.filter((l) => l.status === 'nou').length || store.leads.length || '';
  $('#n-pages').textContent = store.pages ? store.pages.pages.length : '';
  $('#n-health').textContent = healthData()?.total ?? '';
}

/* ---------- DASHBOARD ---------- */
routes.dashboard = function renderDashboard() {
  const E = store.entitati, L = store.leads, P = store.pages, h = healthData();
  const issueKey = (i) => i.replace(/\s*\(\d+\)$/, '').replace(/^\d+ x /, 'Mai multe ').replace(/ → .*$/, '');
  const counts = {};
  P?.pages.forEach((p) => p.probleme.forEach((i) => { const k = issueKey(i); counts[k] = (counts[k] || 0) + 1; }));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = top[0]?.[1] || 1;

  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage</div><h1>Dashboard</h1></div></div>
    ${h ? `<a class="card h-dash" href="/manage/health" data-go="health">
        <div class="h-total"><span class="h-big ${lvlOf(h.total)}">${h.total}</span><div><b>Site health →</b><span class="muted small">moaclinic.ro · analizat la ${esc(store.health.generat_la)}</span></div></div>
        <div class="h-mini">${H_AREAS.map(([id, t]) => `<span><i class="dot ${lvlOf(h.A[id])}"></i>${esc(t)} <b>${h.A[id]}</b></span>`).join('')}</div>
      </a>` : '<a class="card h-dash" href="/manage/health" data-go="health"><b>Site health →</b><span class="muted small">Nicio analiză încă</span></a>'}
    <div class="grid2">
      <div class="card">
        <h3><a href="/manage/entitati" data-go="entitati">Entități →</a></h3>
        ${E ? `<div class="kpis" style="margin:10px 0 0">
          <div class="kpi"><b>${E.servicii.length}</b><span>servicii</span></div>
          <div class="kpi"><b>${E.echipa.length}</b><span>oameni în echipă</span></div>
          <div class="kpi"><b>${E.preturi.reduce((n, c) => n + c.servicii.length, 0)}</b><span>prețuri</span></div>
          <div class="kpi"><b>${E.articole.length}</b><span>articole</span></div>
        </div><p>Extras din ${link(E.meta.sursa, "moaclinic.ro")} la ${esc(E.meta.extras_la)} · ${E.meta.pagini} pagini citite</p>` : '<p>Lipsește data/entitati.json</p>'}
      </div>
      <div class="card">
        <h3><a href="/manage/leads" data-go="leads">Leads →</a></h3>
        <div class="kpis" style="margin:10px 0 0">${LEAD_STATUS.map(([id, lab]) => `<div class="kpi"><b>${L.filter((l) => l.status === id).length}</b><span>${esc(lab)}</span></div>`).join('')}</div>
        <p>${L.length ? `Ultimul lead: ${esc(L.slice().sort((a, b) => (b.creat || '').localeCompare(a.creat || ''))[0].nume)}` : 'Niciun lead încă.'}</p>
      </div>
      <div class="card">
        <h3><a href="/manage/pages" data-go="pages">Pages →</a></h3>
        ${P ? `<div class="kpis" style="margin:10px 0 12px">
          <div class="kpi"><b>${P.pages.length}</b><span>URL-uri</span></div>
          <div class="kpi"><b>${P.pages.filter((p) => p.probleme.length).length}</b><span>cu probleme</span></div>
          <div class="kpi"><b>${P.pages.filter((p) => p.status !== 200).length}</b><span>non-200</span></div>
        </div>
        ${top.map(([k, v]) => `<div class="small" style="margin-bottom:6px">${esc(k)} <span class="muted">· ${v}</span><div class="bar"><i style="width:${(v / max) * 100}%"></i></div></div>`).join('')}
        <p>Crawl: ${esc(P.crawled_at)}</p>` : '<p>Rulează <code>npm run crawl</code> pentru lista de pagini.</p>'}
      </div>
    </div>`;
};
