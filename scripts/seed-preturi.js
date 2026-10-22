// O singură dată: creează data/preturi.json (lista editabilă din panou) din prețurile extrase de pe site (data/entitati.json).
// Prețurile cu preț tăiat devin oferte (procentul calculat), iar ofertele lunii de pe site-ul vechi sunt puse pe rândul lor din listă
// (sau adăugate ca rând nou, când nu există). Rândurile păstrează legătura cu serviciile (paginile de tratament).
// node scripts/seed-preturi.js [--force]   (fără --force nu suprascrie un data/preturi.json existent)
const fs = require('fs');
const path = require('path');
const PR = require('./preturi');

if (fs.existsSync(PR.FILE) && !process.argv.includes('--force')) { console.log('data/preturi.json există deja (folosește --force ca să-l refaci).'); process.exit(0); }
const D = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'entitati.json'), 'utf8'));
const id = () => Math.random().toString(36).slice(2, 10);
const links = new Map();
for (const s of D.servicii) for (const p of s.preturi || []) { const k = `${p.categorie}|${p.nume}`; links.set(k, [...(links.get(k) || []), s.id]); }

const P = { categorii: D.preturi.map((c) => ({
  categorie: c.categorie,
  servicii: c.servicii.map((r) => ({
    id: id(), nume: r.nume, ...(r.subgrup ? { subgrup: r.subgrup } : {}), servicii: links.get(`${c.categorie}|${r.nume}`) || [],
    preturi: (r.preturi || []).map((p) => (p.valoare == null ? { tip: p.tip || 'preț', valoare: null, text: p.text }
      : p.pretInitial ? { tip: p.tip || 'preț', valoare: p.pretInitial, oferta: true, pretOferta: p.valoare } : { tip: p.tip || 'preț', valoare: p.valoare })),
  })),
})) };

// ofertele lunii de pe site-ul vechi care nu apar tăiate în listă: [categoria, rândul, preț normal, preț ofertă]
const row = (cat, re) => P.categorii.find((c) => c.categorie === cat)?.servicii.find((r) => re.test(r.nume));
const MUTA = [
  ['REJUVENARE FACIALĂ', /^Sculptra, o fiolă/, 3000, 2500],
  ['REJUVENARE FACIALĂ', /^Rejuran față\/gât\/decolteu \(1 mL\)/, 1600, 1500],
  ['MICRO CHIRURGIE SI CHIRURGIE PLASTICĂ', /^Blefaroplastie superioară/, 7000, 5000],
  ['TRATAMENTE COSMETOLOGICE', /^Tratament DERMALINFUSION Facial$/, 600, 399],
  ['INJECTĂRI ACID HIALURONIC', /^Augmentare peniană – 10 mL/, 4000, 3500],
  ['TERAPII INTRAVENOASE', /^GLUTATION THERAPY$/, 300, 220],
  ['TERAPII INTRAVENOASE', /^MOA LONGEVITY BOOST/, 900, 600],
];
for (const [cat, re, v, po] of MUTA) {
  const r = row(cat, re);
  if (!r) { console.warn('  ! nu găsesc', cat, re); continue; }
  const p = r.preturi.find((x) => x.valoare != null);
  Object.assign(p, { valoare: v, oferta: true, pretOferta: po });
}
// pachetul din ofertele lunii, care nu există în listă
const cos = P.categorii.find((c) => c.categorie === 'TRATAMENTE COSMETOLOGICE');
cos.servicii.unshift({ id: id(), nume: 'Pachet Dermalinfusion + Venus Legacy (facial)', servicii: ['dermalinfusion', 'venus-legacy'].filter((s) => D.servicii.some((x) => x.id === s)), preturi: [{ tip: 'ședință', valoare: 900, oferta: true, pretOferta: 499 }] });

const out = PR.normalize(P);
PR.save(out);
const off = PR.offersOf(out);
console.log(`data/preturi.json: ${out.categorii.length} categorii · ${out.categorii.reduce((n, c) => n + c.servicii.length, 0)} rânduri · ${off.length} oferte`);
for (const o of off) console.log(`  −${o.discountProcent}%  ${o.pret} (din ${o.pretInitial})  ${o.grup} › ${o.nume}`);
