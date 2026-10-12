// Conținutul paginilor de tratament de pe site-ul actual, structurat pentru șablonul nou de tratament.
// Pentru fiecare serviciu din data/entitati.json cu pagină pe moaclinic.ro: citește HTML-ul, păstrează doar conținutul
// (fără meniu, recenzii, contact) și îl împarte pe secțiuni (după H2), fiecare cu un rol în șablon:
//   intro, ce-este, beneficii, zone, indicatii, pasi, rezultate, siguranta, dupa, pret, info
// + întrebările frecvente (acordeon), galeria înainte/după, linkurile spre alte tratamente.
// Imaginile de conținut se descarcă în site/wp-content/… (aceeași cale ca pe site, deci servite la fel).
// Scrie data/tratamente.json. Rulare: npm run tratamente  [-- --only injectare-botox]
const fs = require('fs');
const path = require('path');
const { get, decodeEntities, ORIGIN } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const OUT = path.join(ROOT, 'data', 'tratamente.json');
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;

const T = (s) => decodeEntities(String(s).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const clean = (s) => s.replace(/\s*;\s*$/, '').replace(/\s+([,.;:])/g, '$1');

const ROLES = [
  ['faq', /întrebări frecvente|intrebari frecvente/i],
  ['skip', /programea|recenzii|^contact|telefon|mail:|date de contact/i],
  ['pret', /pre[tț]|cost/i],
  ['dupa', /(recomandări|recomandari|îngrijire|ingrijire).*(după|dupa)|după (tratament|procedur|ședin)/i],
  ['siguranta', /efecte (secundare|adverse)|contraindica|riscuri|siguran/i],
  ['pasi', /cum decurge|etapele|cum se (desfășoară|desfasoara|realizează|realizeaza)|ce presupune/i],
  ['rezultate', /rezultat/i],
  ['zone', /\bzone\b|zonele/i],
  ['indicatii', /când este recomandat|cand este recomandat|cui (i se adresează|se adreseaza)|pentru cine|indica[tț]ii|candida[tț]i/i],
  ['beneficii', /beneficii|avantaj/i],
  ['ce-este', /ce este|ce sunt|ce reprezintă|cum (acționează|actioneaza|funcționează|functioneaza)|în ce constă/i],
];
const roleOf = (t, i) => (ROLES.find(([, re]) => re.test(t)) || [i === 0 ? 'intro' : 'info'])[0];

function blocksOf(seg) {
  // marcaje de început de bloc; textul unui bloc ține până la următorul marcaj (HTML-ul vechi închide <p> cu </h3>)
  // „cutiile cu iconiță” (icon-box-text) din tema veche țin text fără <p> – le tratez ca elemente de listă
  const marks = [...seg.matchAll(/<(h[2-4]|p|li|tr|img|div(?=[^>]*icon-box-text))\b([^>]*)>/g)].map((m) => (m[1] === 'div' ? Object.assign(m, { 1: 'li' }) : m));
  const raw = [];
  marks.forEach((m, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].index : seg.length;
    const body = seg.slice(m.index + m[0].length, end).split(/<(?:div|table|section)\b/)[0];
    if (m[1] === 'img') {
      const src = (m[2].match(/data-src="([^"]+)"/) || m[2].match(/\ssrc="(https?:[^"]+)"/) || [])[1];
      if (src && !/\.svg$|data:image/.test(src)) raw.push({ t: 'img', src, alt: decodeEntities((m[2].match(/alt="([^"]*)"/) || [])[1] || '') });
      return;
    }
    const x = T(body);
    if (x) raw.push({ t: m[1] === 'tr' ? 'tr' : m[1].startsWith('h') ? 'h' : m[1], x, ord: /<\/ol>|<ol/.test(seg.slice(Math.max(0, m.index - 40), m.index)) });
  });
  // grupare: li consecutive → listă; (li scurt + p)×n → pași; tr → tabel
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    const b = raw[i];
    if (b.t === 'li' && b.x.length <= 50 && raw[i + 1]?.t === 'p' && raw[i + 2]?.t === 'li') {
      const steps = [];
      while (raw[i]?.t === 'li' && raw[i].x.length <= 50) { steps.push({ titlu: raw[i].x, text: raw[i + 1]?.t === 'p' ? raw[i + 1].x : '' }); i += raw[i + 1]?.t === 'p' ? 2 : 1; }
      i--; out.push({ t: 'pasi', items: steps }); continue;
    }
    if (b.t === 'li') { const items = []; while (raw[i]?.t === 'li') items.push(clean(raw[i++].x)); i--; out.push({ t: 'ul', items }); continue; }
    if (b.t === 'tr') { const rows = []; while (raw[i]?.t === 'tr') rows.push(raw[i++].x); i--; out.push({ t: 'tabel', rows }); continue; }
    out.push(b.t === 'img' ? b : { t: b.t === 'h' ? 'h3' : 'p', x: b.x });
  }
  // iconițele decorative (bife) dintre elementele unei liste o rup în bucăți: le scot și unesc listele alăturate
  const merged = [];
  for (const b of out.filter((x) => !(x.t === 'img' && /check|icon/i.test(x.src)))) {
    const prev = merged[merged.length - 1];
    if (b.t === 'ul' && prev?.t === 'ul') prev.items.push(...b.items); else merged.push(b);
  }
  // liste scrise ca paragrafe: ≥ 2 paragrafe scurte la rând terminate cu „;” (ultimul poate avea „.”) → listă
  const res = [];
  for (let i = 0; i < merged.length; i++) {
    const isItem = (b, last) => b?.t === 'p' && b.x.length <= 220 && (last ? /[;.]$/ : /;$/).test(b.x);
    if (isItem(merged[i]) && isItem(merged[i + 1], true)) {
      const items = [];
      while (isItem(merged[i])) items.push(clean(merged[i++].x));
      if (isItem(merged[i], true)) items.push(clean(merged[i++].x.replace(/\.$/, '')));
      i--; res.push({ t: 'ul', items }); continue;
    }
    res.push(merged[i]);
  }
  return res;
}

function parse(html, s) {
  let h = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  h = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/g, '');
  // linkurile din conținut spre alte tratamente
  const links = new Set();
  for (const m of h.matchAll(/href="(https:\/\/moaclinic\.ro\/[^"#?]+)"/g)) {
    const t = D.servicii.find((x) => x.url === m[1] && x.id !== s.id);
    if (t) links.add(t.id);
  }
  // întrebările frecvente din acordeon
  const faq = [];
  for (const m of h.matchAll(/class="accordion-title[^"]*"[\s\S]*?<span>([\s\S]*?)<\/span>\s*<\/a>\s*<div[^>]*class="accordion-inner"[^>]*>([\s\S]*?)(?=<div[^>]*class="accordion-item"|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/g)) {
    const bl = blocksOf(m[2]).filter((b) => b.t !== 'img');
    // unele răspunsuri sunt text simplu, fără <p>
    faq.push({ q: T(m[1]), blocuri: bl.length ? bl : T(m[2]) ? [{ t: 'p', x: T(m[2]) }] : [] });
  }
  const noAcc = h.replace(/<div class="accordion">[\s\S]*?(?=<h2)/g, '');
  const h1 = T((noAcc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || s.h1 || s.nume);
  const parts = noAcc.split(/(?=<h2\b)/).slice(1);
  const hero = blocksOf(noAcc.slice(0, noAcc.search(/<h2\b/))).find((b) => b.t === 'img');
  const sectiuni = [];
  for (const [i, p] of parts.entries()) {
    const titlu = T((p.match(/<h2[^>]*>([\s\S]*?)(<\/h2>|<\/h3>)/) || [])[1] || '');
    const rol = roleOf(titlu, i);
    if (rol === 'skip' || rol === 'faq' || !titlu) continue;
    const blocuri = blocksOf(p.slice(p.indexOf('>') + 1).replace(/^[\s\S]*?<\/h2>/, ''));
    if (blocuri.length) sectiuni.push({ titlu, rol, blocuri });
  }
  // galeria înainte/după: imaginile cu „before/after/înainte” în alt sau din secțiunea de rezultate
  const galerie = [];
  for (const sct of sectiuni) for (const b of sct.blocuri) if (b.t === 'img' && (/before|after|[iî]nainte|dup[aă]/i.test(b.alt) || sct.rol === 'rezultate')) galerie.push({ src: b.src, alt: b.alt });
  for (const sct of sectiuni) sct.blocuri = sct.blocuri.filter((b) => b.t !== 'img');
  return { id: s.id, url: s.url, h1, hero: hero?.src || null, sectiuni, faq, galerie, linkuri_tratamente: [...links] };
}

// Corecturi pe textul paginilor vechi (greșeli de tastare, paragrafe copiate greșit de pe altă pagină).
// [căutare, înlocuire] se aplică în tot textul tratamentului; [căutare, null] scoate blocul (paragraf / element de listă) care o conține.
// Rămân aplicate la fiecare sincronizare; de semnalat clinicii, ca să le corecteze și pe site-ul actual.
const CORECTURI = {
  microneedeling: [
    ['A plicarea', 'Aplicarea'],
    ['acid h ialuronic', 'acid hialuronic'],
    ['dipozitivului', 'dispozitivului'],
    ['efec tele', 'efectele'],
    ['mai redusă , datorită', 'mai redusă, datorită'],
    ['Ingrijirea pielii', 'Îngrijirea pielii'],
    ['în primele zile este un proces normal', 'în primele zile; este un proces normal'],
    ['Mărirea buzelor cu acid hialuronic este recomandată', null], // paragraf copiat din pagina de augmentare a buzelor
  ],
};
function corecteaza(t) {
  const list = CORECTURI[t.id];
  if (!list) return { t, n: 0 };
  let n = 0;
  const fix = (x) => list.reduce((s, [a, b]) => (b != null && s.includes(a) ? (n++, s.split(a).join(b)) : s), x);
  const drop = (x) => list.some(([a, b]) => b == null && String(x).includes(a));
  const blocks = (bl) => bl.filter((b) => !(b.x && drop(b.x) && ++n)).map((b) => ({
    ...b,
    ...(b.x ? { x: fix(b.x) } : {}),
    ...(b.items ? { items: b.items.filter((i) => !(typeof i === 'string' && drop(i) && ++n)).map((i) => (typeof i === 'string' ? fix(i) : { titlu: fix(i.titlu), text: fix(i.text) })) } : {}),
    ...(b.rows ? { rows: b.rows.map(fix) } : {}),
  }));
  t.sectiuni = t.sectiuni.map((s) => ({ ...s, titlu: fix(s.titlu), blocuri: blocks(s.blocuri) }));
  t.faq = t.faq.map((q) => ({ q: fix(q.q), blocuri: blocks(q.blocuri) }));
  return { t, n };
}

// imaginile se servesc local, din aceeași cale ca pe site
async function localImg(src) {
  if (!src || !src.startsWith(ORIGIN + '/wp-content/')) return src;
  const rel = src.slice(ORIGIN.length);
  const f = path.join(ROOT, 'site', rel);
  if (!fs.existsSync(f)) {
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, await get(src, { binary: true }));
  }
  return rel;
}

(async () => {
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { tratamente: {} };
  const out = { generat: new Date().toISOString().slice(0, 10), tratamente: only ? prev.tratamente : {} };
  const list = D.servicii.filter((s) => s.url?.startsWith(ORIGIN) && s.status === 200 && (!only || only.includes(s.id)));
  for (const s of list) {
    try {
      const { t, n: nFix } = corecteaza(parse(await get(s.url), s));
      if (nFix) console.log(`    corecturi aplicate: ${nFix}`);
      t.hero = await localImg(t.hero);
      for (const g of t.galerie) g.src = await localImg(g.src);
      out.tratamente[s.id] = t;
      const roles = t.sectiuni.map((x) => x.rol).join(', ');
      console.log(`  ✓ ${s.id}: ${t.sectiuni.length} secțiuni (${roles}) · ${t.faq.length} întrebări · ${t.galerie.length} înainte/după · ${t.linkuri_tratamente.length} legături`);
    } catch (e) {
      console.log(`  ! ${s.id}: ${e.message}`);
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`Gata: ${Object.keys(out.tratamente).length} tratamente → data/tratamente.json`);
})();
