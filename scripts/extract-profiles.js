// Profilurile echipei: citește pagina de profil a fiecărui om din echipă (URL-ul „Vezi profilul” / pagina de autor)
// și o structurează: rezumat, expertiză, biografie, formare, cărți, afilieri, distincții, funcții, supraspecializări,
// citat, programe, cifre. Paginile de autor nu sunt în sitemap, deci crawl-ul obișnuit nu le citește.
// Scrie data/profiluri.json (îl folosește enrich-entities.js). Rulare: npm run profiles
const fs = require('fs');
const path = require('path');
const { ORIGIN, UA, text, decodeEntities } = require('./lib');

const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// titlul secțiunii -> cheia din profil
const KEYS = [
  ['expertiza', /domenii de expertiza/],
  ['formare', /formare internationala|programe de preventie/],
  ['carti', /autor de literatura/],
  ['viziune', /viziunea/],
  ['afilieri', /afilieri/],
  ['distinctii', /distinctii/],
  ['functii', /functii si parcurs/],
  ['supraspecializari', /supraspecializari/],
  ['interes', /domenii principale de interes/],
  ['competente', /competente complementare/],
  ['parcurs', /^parcurs profesional/],
  ['rol_moa', /rolul sau/],
  ['citat', /filosofia/],
  ['programe', /programe disponibile/],
  ['specializari', /specializari si competente/],
];

// html -> rânduri de text, câte unul pe element de bloc
const lines = (html) => decodeEntities(html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/g, '')
  .replace(/<(br|p|li|div|h[1-6]|tr)\b[^>]*>/g, '\n')
  .replace(/<[^>]+>/g, ' '))
  .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter((l) => l.length > 2);

function parse(html, url) {
  let m = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const stop = m.search(/<h[23][^>]*>(?:(?!<\/h[23]>)[\s\S])*Artic?l?ole de/);
  if (stop > 0) m = m.slice(0, stop);
  const heads = [...m.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/g)].map((x) => ({ n: +x[1], t: text(x[2]).replace(/:$/, ''), i: x.index, end: x.index + x[0].length })).filter((h) => h.t);
  const h1 = heads.find((h) => h.n === 1);
  const sections = heads.filter((h) => h.n > 1).map((h, k, a) => ({ titlu: h.t, nivel: h.n, linii: lines(m.slice(h.end, a[k + 1] ? a[k + 1].i : undefined)) }));
  const intro = h1 ? lines(m.slice(h1.end, heads.find((h) => h.n > 1)?.i)) : [];
  const S = {};
  for (const s of sections) {
    const key = KEYS.find(([, re]) => re.test(norm(s.titlu)))?.[0];
    if (key) S[key] = (S[key] || []).concat(s.linii);
  }
  // „Domenii de expertiză” conține și primele paragrafe ale biografiei (cele lungi, la persoana I)
  const exp = S.expertiza || [];
  const isBio = (l) => l.length > 160 || (/\.$/.test(l) && l.split(' ').length > 12);
  S.biografie = exp.filter(isBio);
  S.expertiza = exp.filter((l) => !isBio(l));
  // cărți: „Titlu” , Editura X, 2015 – descriere
  S.carti = (S.carti || []).filter((l) => /„/.test(l)).map((l) => {
    const t = (l.match(/„([^”"]+)[”"]/) || [])[1] || l;
    const ed = (l.match(/Editura ([^,]+)/) || [])[1] || (l.match(/(www\.[\w.]+)/) || [])[1] || null;
    return { titlu: t.trim(), editura: ed ? ed.trim() : null, an: +(l.match(/\b(19|20)\d{2}\b/) || [])[0] || null, descriere: (l.split(/\d{4}\s*[–-]\s*/)[1] || '').trim() || null };
  });
  // afilieri: „membru al X, al Y și al Z” -> listă
  const afText = (S.afilieri || []).find((l) => /membru/.test(l)) || '';
  S.membru_in = afText.replace(/^.*?membru al\s*/i, '').replace(/\.$/, '').split(/,\s*al\s*|\s+și al\s+/).map((x) => x.trim()).filter(Boolean);
  S.activitate = (S.afilieri || []).filter((l) => !/membru/.test(l));
  S.distinctii = (S.distinctii || []).filter((l) => l.length > 20 && !/^Cred cu|^Sănătatea|^Sunt Dr/.test(l)).map((l) => ({ titlu: l.replace(/\s*[–-]\s*(\w+\s+)?\d{4}$/, '').trim(), an: +(l.match(/(\d{4})\s*$/) || [])[1] || null }));
  // ce urmează după distincții și nu e distincție: încheierea biografiei
  S.incheiere = (sections.find((s) => /distinctii/.test(norm(s.titlu)))?.linii || []).filter((l) => /^Cred cu|^Sănătatea|^Sunt Dr/.test(l));
  S.functii = (S.functii || []).map((l) => ({ text: l, perioada: (l.match(/(\d{4}\s*[–-]\s*\d{4}|din \d{4}(?: până în prezent)?|\b\d{4}\b)/) || [])[1] || null }));
  S.supraspecializari = (S.supraspecializari || []).map((l) => ({ an: (l.match(/^([\d,\s–-]+)\s*[–-]\s*/) || [])[1]?.trim() || null, text: l.replace(/^[\d,\s–-]+\s*[–-]\s*/, '').trim() }));
  S.citat = (S.citat || []).join(' ').replace(/^[„"]|[”"]$/g, '') || null;
  // cifre din text
  const all = [...intro, ...S.biografie, ...(S.formare || []), ...(S.activitate || [])].join(' ');
  const cifre = [];
  const ani = all.match(/peste (\d+) de ani/);
  if (ani) cifre.push({ valoare: `${ani[1]}+`, eticheta: 'ani de experiență' });
  for (const x of all.matchAll(/peste ([\d.]+) de ([^,;\d]+?)(?=,|;|\.(?!\d)| și am| alături)/g)) if (!/^ani\b/.test(x[2])) cifre.push({ valoare: `${x[1]}+`, eticheta: x[2].trim() });
  if (S.carti.length) cifre.push({ valoare: String(S.carti.length), eticheta: S.carti.length === 1 ? 'carte publicată' : 'cărți publicate' });
  const img = (m.match(/(?:data-src|src)="([^"]+\.(?:jpe?g|png|webp))"/) || [])[1] || null;
  return {
    url,
    nume_afisat: h1?.t || null,
    title: decodeEntities((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim(),
    description: decodeEntities((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '') || null,
    imagine: img ? img.replace(/^https?:\/\/(www\.)?moaclinic\.ro/, '') : null,
    rezumat: intro.join(' ') || null,
    sectiuni: sections.map((s) => s.titlu),
    ...S,
    cifre,
  };
}

async function main() {
  const out = { extras_la: new Date().toISOString().slice(0, 10), profiluri: {} };
  for (const p of D.echipa.filter((x) => x.profil)) {
    const res = await fetch(p.profil, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (!res.ok) { console.warn('  !', res.status, p.profil); continue; }
    const prof = parse(await res.text(), res.url);
    // lanțul de redirecturi către profil (ex. /echipa/dr-… → /dr-… → /author/dr-…)
    prof.redirecturi = [];
    for (const start of [`${ORIGIN}/echipa/${p.id.startsWith('dr-') ? p.id : 'dr-' + p.id}/`]) {
      let u = start;
      for (let i = 0; i < 5; i++) {
        const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'manual' });
        if (r.status < 300 || r.status >= 400) break;
        const next = new URL(r.headers.get('location'), ORIGIN).href;
        prof.redirecturi.push({ din: u.replace(ORIGIN, ''), spre: next.replace(ORIGIN, ''), status: r.status });
        u = next;
      }
    }
    out.profiluri[p.id] = prof;
    console.log(`  ${p.nume}: ${prof.sectiuni.length} secțiuni · ${prof.carti.length} cărți · ${prof.distinctii.length} distincții · ${prof.functii.length} funcții · ${prof.membru_in.length} afilieri`);
  }
  fs.writeFileSync(path.join(ROOT, 'data', 'profiluri.json'), JSON.stringify(out, null, 2));
  console.log(`Gata: data/profiluri.json · ${Object.keys(out.profiluri).length} profiluri`);
}

main().catch((e) => { console.error(e); process.exit(1); });
