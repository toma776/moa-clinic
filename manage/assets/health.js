/* SITE HEALTH: starea moaclinic.ro din data/site-health.json – 5 arii cu scor 0–100 și formula afișată. */
const H_AREAS = [
  ['tehnic', 'SEO tehnic', '% pagini fără probleme de title, description, H1, canonical, alt, linkuri cu redirect'],
  ['schema', 'Date structurate', '% pagini cu JSON-LD valid și tipul potrivit (serviciile marcate ca Article contează)'],
  ['continut', 'Conținut', '100 − 30 × % articole fără autor − 25 × % articole învechite − 25 × % servicii fără preț − 20 × % pagini subțiri'],
  ['brand', 'Consecvența brandului', '% pagini fără formulări care contrazic brand book-ul (nume, domeniu, telefon, CTA)'],
  ['performanta', 'Performanță', '% pagini care răspund rapid (< 1,2 s în crawl) și au HTML sub 250 KB'],
];
const H_COD = {
  'fara-title': 'Fără title', 'title-lung': 'Title lung (> 65 caractere)', 'title-scurt': 'Title scurt (< 25)', 'title-duplicat': 'Title duplicat',
  'fara-description': 'Fără meta description', 'description-lung': 'Meta description lungă (> 165)', 'description-scurt': 'Meta description scurtă (< 70)', 'description-duplicat': 'Meta description duplicată',
  'fara-h1': 'Fără H1', 'mai-multe-h1': 'Mai multe H1', 'fara-canonical': 'Fără canonical', 'canonical-diferit': 'Canonical spre altă pagină', lang: 'Limba paginii nu e ro-RO',
  viewport: 'Fără meta viewport', 'fara-og': 'Fără Open Graph', 'img-alt': 'Imagini fără text alternativ', 'link-redirect': 'Linkuri interne care fac redirect',
  'fara-jsonld': 'Fără date structurate', 'jsonld-invalid': 'JSON-LD invalid', 'fara-breadcrumb': 'Fără BreadcrumbList', 'serviciu-fara-schema': 'Pagină de serviciu fără MedicalProcedure/Service',
  'fara-faq': 'Întrebări în conținut fără FAQPage', 'fara-org': 'Homepage fără MedicalClinic', 'schema-straina': 'Blocuri Service ale altor pagini (schema globală)',
  'continut-subtire': 'Conținut subțire (< 250 cuvinte)', 'fara-autor': 'Articol fără autor',
  nume: '„Moa Clinica” în loc de „MOA Clinic”', 'nume-majuscule': '„Moa” în loc de „MOA”', 'nume-incomplet': '„MOA Regenerative” fără „by Oxxygene”', domeniu: 'Domeniu greșit (www.moa.ro)',
  telefon: 'Alt telefon decât 0743 056 605', email: 'Email Gmail în loc de @moaclinic.ro', typo: 'Typo „Simulare magnetică”', cta: 'CTA fără diacritice („Programeaza-te!”)',
  lent: 'Răspuns lent', 'html-mare': 'HTML mare (> 250 KB)',
};
const H_W = { grav: 1, optim: 0.5, info: 0 };
const lvlOf = (s) => (s >= 80 ? 'ok' : s >= 50 ? 'warn' : 'bad');
const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

function healthData() {
  const H = store.health;
  if (!H?.pagini) return null;
  const ok = H.pagini.filter((p) => p.status === 200);
  // scorul unei arii: o pagină cu o problemă gravă = 0, cu una de optimizat = 0,5; info nu scade
  const score = (arie, extra = 0) => {
    const w = ok.reduce((s, p) => s + Math.min(1, p.probleme.filter((x) => x.arie === arie).reduce((t, x) => t + (H_W[x.nivel] ?? 0.5), 0)), 0);
    return clamp(100 * (1 - (w + extra) / Math.max(1, ok.length + extra)));
  };
  const B = H.blog || {}, pct = (a, b) => (b ? a / b : 0);
  const subtiri = ok.filter((p) => p.probleme.some((x) => x.cod === 'continut-subtire')).length;
  const nServ = store.entitati?.servicii?.length || 0;
  const A = {
    tehnic: score('tehnic', H.lipsa.length),
    schema: score('schema'),
    continut: clamp(100 - 30 * pct(B.fara_autor?.length, B.total) - 25 * pct(B.invechite?.length, B.total) - 25 * pct(H.servicii_fara_pret?.length, nServ) - 20 * pct(subtiri, ok.length)),
    brand: score('brand'),
    performanta: score('performanta'),
  };
  return { A, total: clamp(Object.values(A).reduce((s, v) => s + v, 0) / H_AREAS.length), ok };
}

routes.health = function renderHealth() {
  const H = store.health, data = healthData();
  const runBtn = '<button class="primary" id="hRun">Rulează analiza acum</button>';
  if (!data) {
    $('#view').innerHTML = `<div class="head"><div><div class="crumb">manage › site health</div><h1>Site health</h1></div>${runBtn}</div><div class="card empty"><b>Nicio analiză încă</b>Apasă „Rulează analiza acum” (crawl + analiză, ~1 minut).</div>`;
    return bindHealthRun();
  }
  const { A, total, ok } = data;
  const ring = (s, size = 88) => { const r = size / 2 - 7, c = 2 * Math.PI * r; return `<svg class="h-ring ${lvlOf(s)}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="scor ${s}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - s / 100)}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="50%" dy=".35em" text-anchor="middle">${s}</text></svg>`; };
  const pg = (p) => link(SITE + p, p);
  const issuesOf = (arie) => {
    const g = {};
    ok.forEach((p) => p.probleme.filter((x) => x.arie === arie).forEach((x) => (g[x.cod] ||= { nivel: x.nivel, list: [] }).list.push({ p, x })));
    return Object.entries(g).sort((a, b) => H_W[b[1].nivel] - H_W[a[1].nivel] || b[1].list.length - a[1].list.length);
  };
  const issueTable = (arie) => {
    const rows = issuesOf(arie);
    return rows.length ? `<div class="tbl"><table><thead><tr><th>Problemă</th><th>Gravitate</th><th class="num">Pagini</th></tr></thead><tbody>
      ${rows.map(([cod, g]) => `<tr><td><b>${esc(H_COD[cod] || cod)}</b><details class="h-det"><summary class="small">vezi paginile</summary><ul class="clean small h-pages">${g.list.map(({ p, x }) => `<li>${pg(p.path)} <span class="muted">— ${esc(x.mesaj)}</span></li>`).join('')}</ul></details></td>
        <td>${g.nivel === 'grav' ? '<span class="tag bad">gravă</span>' : g.nivel === 'optim' ? '<span class="tag warn">de optimizat</span>' : '<span class="tag grey">info</span>'}</td><td class="num">${new Set(g.list.map((i) => i.p.path)).size}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="card"><span class="tag ok">fără probleme</span></div>';
  };
  const B = H.blog || {};
  const avgMs = Math.round(ok.reduce((s, p) => s + p.ms, 0) / Math.max(1, ok.length)), avgKb = Math.round((ok.reduce((s, p) => s + p.kb, 0) / Math.max(1, ok.length)) * 10) / 10;
  const n = (arie) => ok.filter((p) => p.probleme.some((x) => x.arie === arie && x.nivel !== 'info')).length;
  const summary = { tehnic: `${n('tehnic')} pagini cu probleme · ${H.redirecturi.length} linkuri cu redirect`, schema: `${n('schema')} din ${ok.length} pagini`, continut: `${B.fara_autor?.length ?? 0} articole fără autor · ${H.servicii_fara_pret?.length ?? 0} servicii fără preț`, brand: `${n('brand')} din ${ok.length} pagini`, performanta: `${avgMs} ms în medie · ${avgKb} KB HTML` };
  const area = ([id, t, f]) => `<a class="h-area" href="#h-${id}" data-hjump="${id}">${ring(A[id], 64)}<div><b>${esc(t)}</b><span>${esc(summary[id])}</span><small>${esc(f)}</small></div></a>`;
  const sec = (id, t, body) => `<section id="h-${id}"><h2>${esc(t)} <span class="h-score ${lvlOf(A[id])}">${A[id]}</span></h2>${body}</section>`;

  $('#view').innerHTML = `
    <div class="head"><div><div class="crumb">manage › site health · ${link(H.site, "moaclinic.ro")} · crawl ${esc(H.crawl_la)} · analizat ${esc(H.generat_la)} · ${ok.length} pagini</div><h1>Site health</h1></div>${runBtn}</div>
    <div class="h-top card">
      <div class="h-total">${ring(total, 120)}<div><b>Scor general</b><span class="muted small">media celor 5 arii</span></div></div>
      <div class="h-areas">${H_AREAS.map(area).join('')}</div>
    </div>
    <section id="h-baza"><h2>Verificări de bază <span class="n">${H.lansare.filter((l) => l.ok).length} / ${H.lansare.length}</span></h2>
      <div class="card" style="padding:0">${H.lansare.map((l) => `<div class="h-check"><span class="tag ${l.ok ? 'ok' : 'warn'}">${l.ok ? '✓' : '!'}</span><b>${esc(l.mesaj)}</b><span class="muted small">${esc(l.detaliu)}</span></div>`).join('')}</div></section>
    <section id="h-linkuri"><h2>Linkuri interne rupte sau cu redirect <span class="n">${H.lipsa.length} rupte · ${H.redirecturi.length} redirect</span></h2>
      ${H.lipsa.length || H.redirecturi.length ? `<div class="tbl"><table><thead><tr><th>Link</th><th>Spre</th><th>Legat din</th></tr></thead><tbody>
        ${[...H.lipsa.map((l) => ({ ...l, bad: true })), ...H.redirecturi].map((l) => `<tr><td><b>${esc(l.path)}</b> ${l.bad ? `<span class="tag bad">${l.status}</span>` : /trashed/.test(l.path) ? '<span class="tag bad">pagină aruncată la coș</span>' : '<span class="tag warn">301</span>'}</td><td class="small">${l.spre ? esc(shortUrl(l.spre)) : '—'}</td><td class="small">${l.din.map(pg).join(', ')}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="card"><span class="tag ok">niciunul</span></div>'}</section>
    ${sec('tehnic', 'SEO tehnic', issueTable('tehnic'))}
    ${sec('schema', 'Date structurate', `${issueTable('schema')}
      <details class="h-det" style="margin-top:8px"><summary>Tipurile de date structurate pe fiecare pagină</summary>
        <div class="tbl"><table><tbody>${ok.map((p) => `<tr><td class="small">${pg(p.path)}</td><td>${tags(p.schema)}</td></tr>`).join('')}</tbody></table></div></details>`)}
    ${sec('continut', 'Conținut', `<div class="grid2" style="margin-bottom:12px">
        <div class="card"><h3>Articole fără autor <span class="muted">${B.fara_autor?.length ?? 0} din ${B.total ?? 0}</span></h3><p>Doar câteva articole au „Conținut oferit de: Dr. …”. Pentru un site medical (YMYL), autorul medic contează.</p>
          <details class="h-det"><summary class="small">vezi articolele</summary><ul class="clean small h-pages">${(B.fara_autor || []).map((a) => `<li><span class="muted">${esc(a.data || '')}</span> ${pg(a.path)}</li>`).join('')}</ul></details></div>
        <div class="card"><h3>Articole învechite <span class="muted">${B.invechite?.length ?? 0}</span></h3><p>Nemodificate de peste 12 luni.</p>
          <details class="h-det"><summary class="small">vezi articolele</summary><ul class="clean small h-pages">${(B.invechite || []).map((a) => `<li><span class="muted">${esc(a.data)}</span> ${pg(a.path)}</li>`).join('') || '<li>niciunul</li>'}</ul></details></div>
        <div class="card"><h3>Servicii fără preț pe /preturi/ <span class="muted">${H.servicii_fara_pret?.length ?? 0}</span></h3><p>Servicii din meniu pentru care nu am găsit niciun rând în lista de prețuri.</p>
          <ul class="clean small">${(H.servicii_fara_pret || []).map((s) => `<li>${link(s.url, s.nume)}</li>`).join('')}</ul></div>
      </div>${issueTable('continut')}`)}
    ${sec('brand', 'Consecvența brandului', `<p class="lead">Formulări care contrazic brand book-ul, găsite în conținutul paginilor (fără meniu și footer; CTA-urile includ și butoanele).</p>${issueTable('brand')}`)}
    ${sec('performanta', 'Performanță', `<p class="lead">Măsurat în timpul crawl-ului (6 cereri în paralel, de pe calculatorul local). Cele mai lente: ${ok.slice().sort((a, b) => b.ms - a.ms).slice(0, 3).map((p) => `${pg(p.path)} (${p.ms} ms)`).join(', ')}.</p>${issueTable('performanta')}`)}`;

  $$('[data-hjump]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); $('#h-' + a.dataset.hjump).scrollIntoView({ behavior: 'smooth' }); }));
  bindHealthRun();
};
function bindHealthRun() {
  const b = $('#hRun'); if (!b) return;
  b.onclick = async () => {
    b.disabled = true; b.textContent = 'Se citește site-ul… (~1 minut)';
    try {
      store.health = await api.send('/api/site-health/ruleaza', 'POST', {});
      store.pages = await api.get('/api/pages');
      toast('Analiză actualizată'); updateCounts(); routes.health();
    } catch (e) { toast('Analiza a eșuat: ' + e.message.slice(0, 120)); b.disabled = false; b.textContent = 'Rulează analiza acum'; }
  };
}
