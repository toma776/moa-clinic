/* Editorul de entități: orice grup din data/entitati.json (în afară de prețuri, oferte și metadate), pe categoriile din panou.
   Listele: căutare, adaugă / duplică / șterge / mută; fiecare câmp cu controlul lui (text, număr, da/nu, listă pe rânduri, JSON).
   Salvarea: PUT /api/entitati-editari { valori } – local scrie și regenerează site-ul, pe Vercel face un commit (vezi api/). */
(() => {
  const ED_KEYS = {
    brand: ['brand', 'contact', 'reputatie', 'social', 'afilieri', 'concepte', 'evidentiatePeHomepage'],
    echipa: ['echipa'],
    servicii: ['servicii', 'categoriiServicii'],
    tehnologii: ['tehnologii', 'produse', 'produseProprii'],
    blog: ['articole', 'criterii_tip_articol'],
    glosar: ['glosar'],
    dovezi: ['dovezi.testimoniale', 'dovezi.cifre'], // subgrupuri: câte o listă, salvate în grupul părinte
    intrebari: ['intrebari'],
    media: ['media', 'video'],
    seo: ['observatii', 'inconsistente', 'legal', 'pagini_legale_utile', 'schemaOrg', 'schema_existenta', 'continut'],
  };
  const LABEL = {
    brand: 'Identitate', contact: 'Contact', reputatie: 'Reputație', social: 'Rețele sociale', afilieri: 'Afilieri', concepte: 'Concepte',
    evidentiatePeHomepage: 'Pe homepage', echipa: 'Echipa', servicii: 'Servicii', categoriiServicii: 'Categorii de servicii', tehnologii: 'Tehnologii',
    produse: 'Produse', produseProprii: 'Produse proprii', articole: 'Articole', criterii_tip_articol: 'Tipuri de articol', glosar: 'Glosar',
    dovezi: 'Dovezi', intrebari: 'Întrebări', media: 'Imagini', video: 'Video', observatii: 'Observații SEO', inconsistente: 'Inconsistențe',
    legal: 'Date legale', 'dovezi.testimoniale': 'Testimoniale', 'dovezi.cifre': 'Cifre și afirmații', pagini_legale_utile: 'Pagini legale', schemaOrg: 'Schema.org', schema_existenta: 'Schema existentă', continut: 'Conținut (crawl)',
  };
  const human = (k) => LABEL[k] || String(k).replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
  const titleOf = (it, i) => (it && typeof it === 'object' ? it.nume || it.titlu || it.intrebare || it.persoana || it.retea || it.text || it.descriere || it.categorie || it.id || Object.values(it).find((x) => typeof x === 'string' && x.trim()) : it) || `#${i + 1}`;
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const blank = (x) => (Array.isArray(x) ? [] : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, blank(v)])) : typeof x === 'number' ? null : typeof x === 'boolean' ? false : x === null ? null : '');
  const getAt = (o, p) => p.reduce((a, k) => a[k], o);
  const setAt = (o, p, v) => { getAt(o, p.slice(0, -1))[p.at(-1)] = v; };
  const isPrimList = (v) => Array.isArray(v) && v.every((x) => x === null || ['string', 'number'].includes(typeof x));
  const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);

  let draft = null, orig = null, keys = [], cur = 0, sel = 0, q = '', bad = new Set();
  const dlg = () => $('#entDlg'), form = () => $('#entForm');
  const dirtyKeys = () => keys.filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(orig[k]));

  // un câmp: tipul lui decide controlul; adâncimea limitează formularele imbricate (mai adânc → JSON)
  function field(v, p, label, depth) {
    const dp = esc(JSON.stringify(p)), lab = `<span class="be-l">${esc(label)}</span>`;
    if (typeof v === 'boolean') return `<label class="be-f be-check"><input type="checkbox" data-p="${dp}" data-t="bool"${v ? ' checked' : ''}>${lab}</label>`;
    if (typeof v === 'number') return `<label class="be-f">${lab}<input type="number" step="any" data-p="${dp}" data-t="num" value="${esc(v)}"></label>`;
    if (v === null) return `<label class="be-f">${lab}<input data-p="${dp}" data-t="null" placeholder="(gol)"></label>`;
    if (typeof v === 'string') {
      const long = v.length > 90 || v.includes('\n');
      return `<label class="be-f${long ? ' ee-wide' : ''}">${lab}${long ? `<textarea data-p="${dp}" rows="${Math.min(12, Math.max(3, Math.ceil(v.length / 90)))}">${esc(v)}</textarea>` : `<input data-p="${dp}" value="${esc(v)}">`}</label>`;
    }
    if (isPrimList(v)) return `<label class="be-f ee-wide">${lab}<textarea data-p="${dp}" data-t="lines" rows="${Math.min(10, Math.max(2, v.length + 1))}" placeholder="câte unul pe rând">${esc(v.join('\n'))}</textarea><small class="muted">câte unul pe rând</small></label>`;
    if (isPlain(v) && depth < 2) return `<fieldset class="be-obj ee-wide"><legend>${esc(label)}</legend><div class="ee-fields">${Object.entries(v).map(([k, x]) => field(x, [...p, k], human(k), depth + 1)).join('')}</div></fieldset>`;
    return `<label class="be-f ee-wide">${lab}<textarea class="ee-json" data-p="${dp}" data-t="json" rows="${Math.min(14, Math.max(4, JSON.stringify(v, null, 2).split('\n').length))}" spellcheck="false">${esc(JSON.stringify(v, null, 2))}</textarea><small class="muted">structură JSON</small></label>`;
  }
  const fields = (obj, p) => (isPlain(obj) ? `<div class="ee-fields">${Object.entries(obj).map(([k, v]) => field(v, [...p, k], human(k), 0)).join('')}</div>` : field(obj, p, 'Valoare', 0));

  function paint() {
    const k = keys[cur], v = draft[k], dirty = dirtyKeys();
    const tabs = keys.length > 1 ? `<div class="ee-tabs" role="tablist">${keys.map((x, i) => `<button type="button" role="tab" data-tab="${i}" aria-selected="${i === cur}">${esc(human(x))}${Array.isArray(draft[x]) ? ` <span>${draft[x].length}</span>` : ''}${dirty.includes(x) ? ' <i>•</i>' : ''}</button>`).join('')}</div>` : '';
    let body;
    if (Array.isArray(v) && v.length && v.every((x) => isPlain(x) || typeof x === 'string')) {
      sel = Math.min(sel, v.length - 1);
      const list = v.map((it, i) => [it, i]).filter(([it]) => !q || JSON.stringify(it).toLowerCase().includes(q));
      const it = v[sel];
      body = `<div class="ee-split">
        <div class="ee-list"><input type="search" id="ee-q" placeholder="Caută în ${esc(human(k).toLowerCase())}…" value="${esc(q)}">
          <div class="ee-items">${list.map(([x, i]) => `<button type="button" data-sel="${i}" class="${i === sel ? 'on' : ''}">${esc(cut(String(titleOf(x, i)), 70))}</button>`).join('') || '<p class="muted small">Nimic găsit.</p>'}</div>
          <button type="button" id="ee-add" class="ee-addbtn">+ Adaugă</button></div>
        <div class="ee-item"><div class="ee-item-h"><b>${esc(cut(String(titleOf(it, sel)), 90))}</b><span class="be-ctrl">
            <button type="button" data-act="up" title="Mută mai sus"${sel ? '' : ' disabled'}>↑</button><button type="button" data-act="down" title="Mută mai jos"${sel < v.length - 1 ? '' : ' disabled'}>↓</button>
            <button type="button" data-act="dup">Duplică</button><button type="button" data-act="del" class="ee-del">Șterge</button></span></div>
          ${typeof it === 'string' ? field(it, [k, sel], 'Text', 0) : fields(it, [k, sel])}</div></div>`;
    } else if (Array.isArray(v) && !v.length) {
      body = `<p class="muted">Lista e goală.</p><button type="button" id="ee-add" class="ee-addbtn">+ Adaugă</button>`;
    } else body = `<div class="ee-one">${fields(v, [k])}</div>`;
    form().innerHTML = `<div class="ee-head"><h2>Editează: ${esc(cat)}</h2><p class="small muted">Modificările se aplică pe site după salvare${/^(localhost|127\.)/.test(location.hostname) ? ' (site-ul se regenerează pe loc)' : ' (commit în GitHub, publicare în ~1–2 minute)'}.</p>${tabs}</div>
      <div class="ee-body">${body}</div>
      <div class="actions be-actions"><span class="err" id="ee-err">${bad.size ? 'Corectează câmpurile JSON marcate.' : ''}</span><button type="button" id="ee-cancel">Renunță</button><button type="submit" class="primary" id="ee-save"${dirty.length && !bad.size ? '' : ' disabled'}>Salvează${dirty.length ? ` (${dirty.map(human).join(', ')})` : ''}</button></div>`;
    $('#ee-cancel').onclick = close;
    const qi = $('#ee-q'); if (qi) qi.oninput = () => { q = qi.value.trim().toLowerCase(); paint(); const n = $('#ee-q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
  }

  function close() {
    if (dirtyKeys().length && !confirm('Ai modificări nesalvate. Le renunți?')) return;
    dlg().close();
  }

  let cat = '';
  window.entEditBtn = (catId) => (ED_KEYS[catId] ? `<button type="button" class="primary ee-open" data-ent-edit="${esc(catId)}">Editează datele</button>` : '');
  window.openEntityEditor = (catId, title) => {
    const D = store.entitati; if (!D || !ED_KEYS[catId]) return;
    const at = (k) => k.split('.').reduce((a, x) => (a == null ? a : a[x]), D);
    keys = ED_KEYS[catId].filter((k) => at(k) !== undefined);
    orig = Object.fromEntries(keys.map((k) => [k, clone(at(k))]));
    draft = clone(orig); cur = 0; sel = 0; q = ''; bad = new Set(); cat = title || catId;
    paint();
    dlg().showModal();
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ent-edit]'); if (!b) return;
    e.preventDefault();
    openEntityEditor(b.dataset.entEdit, $('#view h1')?.textContent.trim());
  });

  document.addEventListener('DOMContentLoaded', () => {
    const f = form(); if (!f) return;
    dlg().addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    f.addEventListener('input', (e) => {
      const el = e.target; if (!el.dataset.p) return;
      const p = JSON.parse(el.dataset.p), t = el.dataset.t;
      if (t === 'json') {
        try { setAt(draft, p, JSON.parse(el.value)); bad.delete(el.dataset.p); el.classList.remove('ee-bad'); } catch { bad.add(el.dataset.p); el.classList.add('ee-bad'); }
      } else if (t === 'lines') {
        const was = getAt(draft, p), nums = was.length && was.every((x) => typeof x === 'number');
        setAt(draft, p, el.value.split('\n').map((s) => s.trim()).filter(Boolean).map((s) => (nums && !Number.isNaN(+s) ? +s : s)));
      } else setAt(draft, p, t === 'num' ? (el.value === '' ? null : Number(el.value)) : t === 'bool' ? el.checked : t === 'null' ? (el.value === '' ? null : el.value) : el.value);
      // doar starea butoanelor, fără să redesenăm formularul (cursorul rămâne pe loc)
      const dirty = dirtyKeys(), sv = $('#ee-save');
      sv.disabled = !dirty.length || !!bad.size;
      sv.textContent = 'Salvează' + (dirty.length ? ` (${dirty.map(human).join(', ')})` : '');
      $('#ee-err').textContent = bad.size ? 'Corectează câmpurile JSON marcate.' : '';
    });
    f.addEventListener('click', (e) => {
      const t = e.target.closest('button'); if (!t || t.type === 'submit') return;
      const k = keys[cur], v = draft[k];
      if (t.dataset.tab != null) { cur = +t.dataset.tab; sel = 0; q = ''; }
      else if (t.dataset.sel != null) sel = +t.dataset.sel;
      else if (t.id === 'ee-add') {
        const proto = v.length ? blank(v[0]) : typeof (orig[k] || [])[0] === 'string' ? '' : {};
        if (isPlain(proto) && 'id' in proto) proto.id = 'nou-' + Math.random().toString(36).slice(2, 8);
        if (isPlain(proto) && 'nume' in proto) proto.nume = 'Element nou';
        v.push(proto); sel = v.length - 1; q = '';
      } else if (t.dataset.act === 'dup') { const c = clone(v[sel]); if (isPlain(c) && c.id) c.id += '-copie'; v.splice(sel + 1, 0, c); sel++; }
      else if (t.dataset.act === 'del') { if (!confirm(`Ștergi „${titleOf(v[sel], sel)}”?`)) return; v.splice(sel, 1); sel = Math.max(0, sel - 1); }
      else if (t.dataset.act === 'up' || t.dataset.act === 'down') { const j = sel + (t.dataset.act === 'up' ? -1 : 1); [v[sel], v[j]] = [v[j], v[sel]]; sel = j; }
      else return;
      e.preventDefault();
      paint();
    });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dirty = dirtyKeys(); if (!dirty.length || bad.size) return;
      const sv = $('#ee-save'); sv.disabled = true; sv.textContent = 'Se salvează…';
      try {
        // „grup.subgrup” se salvează în grupul părinte, întreg
        const valori = {};
        for (const k of dirty) {
          const [top, ...rest] = k.split('.');
          if (!rest.length) { valori[top] = draft[k]; continue; }
          valori[top] = valori[top] || clone(store.entitati[top]);
          setAt(valori[top], rest, draft[k]);
        }
        const r = await api.send('/api/entitati-editari', 'PUT', { valori });
        Object.assign(store.entitati, valori);
        dirty.forEach((k) => { orig[k] = clone(draft[k]); });
        dlg().close();
        toast(r.publicare ? `Salvat · site-ul se publică ${r.publicare}` : r.build === 'ok' ? 'Salvat · site regenerat' : 'Salvat, dar regenerarea site-ului a eșuat');
        routes.entitati();
      } catch (err) { $('#ee-err').textContent = 'Nu s-a putut salva: ' + err.message; sv.disabled = false; sv.textContent = 'Salvează'; }
    });
  });
})();
