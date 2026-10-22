// Lista de prețuri editabilă din panou (data/preturi.json) – sursa unică pentru prețuri și oferte.
//   categorii[] → servicii[] (rândurile listei) → preturi[] (ședință, pachet, …)
//   un preț: { tip, valoare (prețul normal), oferta (bool), discountProcent, pretOferta } sau { tip, valoare: null, text }
// apply(D, P) rescrie în entități: D.preturi (formatul listei de pe site), prețurile fiecărui serviciu (rândurile legate prin `servicii`)
// și D.oferte = toate prețurile marcate ofertă, cu discount, din orice categorie.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'preturi.json');

// categoriile listei, pe grupurile din drumul pacientului: [grup, [[categoria din listă, numele afișat]]]
const PR_GRUPURI = [
  ['Consultații', [['CONSULTAȚII', 'Consultații']]],
  ['Injectabile', [['INJECTĂRI TOXINĂ BOTULINICĂ', 'Toxină botulinică (Botox)'], ['INJECTĂRI ACID HIALURONIC', 'Acid hialuronic'], ['REJUVENARE FACIALĂ', 'Rejuvenare facială'], ['TRATAMENT REVITALIZARE PĂR', 'Revitalizare păr']]],
  ['Aparatură', [['TRATAMENTE ESTETICE VENUS VIVA', 'Venus Viva'], ['LIFTING FACIAL NON INVAZIV VENUS LEGACY', 'Venus Legacy – lifting facial'], ['TRATAMENTE CORPORALE VENUS LEGACY', 'Venus Legacy – corp'], ['EPILARE DEFINITIVA CU SPLENDOR X FEMEI', 'Epilare Splendor X – femei'], ['EPILARE DEFINITIVA CU SPLENDOR X BARBATI', 'Epilare Splendor X – bărbați']]],
  ['Cosmetică & dermatologie', [['TRATAMENTE COSMETOLOGICE', 'Tratamente cosmetologice'], ['PEELING', 'Peeling'], ['DERMATOLOGIE', 'Dermatologie']]],
  ['Chirurgie', [['MICRO CHIRURGIE SI CHIRURGIE PLASTICĂ', 'Microchirurgie și chirurgie plastică'], ['ANALIZĂ ANATOMIE PATOLOGICĂ', 'Analize de anatomie patologică']]],
  ['Regenerare', [['TERAPII INTRAVENOASE', 'Terapii intravenoase'], ['OZONOTERAPIE', 'Ozonoterapie'], ['TMS – Stimulare Magnetică Transcraniană', 'TMS – stimulare magnetică transcraniană'], ['TERAPIA VIELIGHT', 'Terapia Vielight']]],
];
const CAT_INFO = new Map(PR_GRUPURI.flatMap(([g, cs]) => cs.map(([c, n]) => [c, { grup: g, nume: n }])));
const cap = (s) => (s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s);
const catInfo = (c) => CAT_INFO.get(c) || { grup: 'Altele', nume: cap(c) };

const load = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return null; } };
const save = (P) => fs.writeFileSync(FILE, JSON.stringify(P, null, 2));
const num = (x) => (x === '' || x == null || Number.isNaN(+x) ? null : +x);

// curăță ce vine din panou: numere, oferta coerentă (procentul și prețul de ofertă se țin unul pe altul)
function normalize(P) {
  const out = { actualizat: new Date().toISOString().slice(0, 19), categorii: [] };
  for (const c of P.categorii || []) {
    const cat = { categorie: String(c.categorie || '').trim(), servicii: [] };
    if (!cat.categorie) continue;
    for (const r of c.servicii || []) {
      const nume = String(r.nume || '').trim();
      if (!nume) continue;
      const row = { id: r.id || Math.random().toString(36).slice(2, 10), nume };
      if (r.subgrup) row.subgrup = String(r.subgrup).trim();
      if (r.detalii) row.detalii = String(r.detalii).trim();
      row.servicii = [...new Set((r.servicii || []).filter(Boolean))];
      row.preturi = (r.preturi || []).map((p) => {
        const v = num(p.valoare), tip = String(p.tip || 'preț').trim() || 'preț';
        if (v == null) return p.text ? { tip, valoare: null, text: String(p.text) } : null;
        const x = { tip, valoare: v };
        let d = num(p.discountProcent), po = num(p.pretOferta);
        if (p.oferta && (d || po)) {
          if (po == null || po >= v) po = Math.round(v * (1 - d / 100));
          d = Math.round((1 - po / v) * 100);
          if (d > 0 && d < 100) Object.assign(x, { oferta: true, discountProcent: d, pretOferta: po });
        }
        return x;
      }).filter(Boolean);
      cat.servicii.push(row);
    }
    out.categorii.push(cat);
  }
  return out;
}

// un preț în formatul listei de pe site: valoarea afișată + prețul tăiat când e ofertă
const toList = (p) => (p.valoare == null
  ? { valoare: null, moneda: 'RON', text: p.text, tip: p.tip }
  : p.oferta ? { valoare: p.pretOferta, moneda: 'RON', pretInitial: p.valoare, tip: p.tip } : { valoare: p.valoare, moneda: 'RON', tip: p.tip });

// ofertele: fiecare preț marcat ofertă, cu discount; numele = rândul (+ tipul, dacă rândul are mai multe prețuri)
function offersOf(P) {
  const out = [];
  P.categorii.forEach((c) => c.servicii.forEach((r) => r.preturi.forEach((p) => {
    if (!p.oferta || !p.discountProcent || p.pretOferta == null) return;
    const info = catInfo(c.categorie);
    const multi = r.preturi.length > 1 || /pachet/i.test(p.tip);
    out.push({
      grup: info.grup, categorie: c.categorie, nume: (multi ? `${r.nume} · ${p.tip}` : r.nume).replace(/^OFERT[ĂA]\s+/i, ''), detalii: r.detalii || info.nume,
      pret: p.pretOferta, pretInitial: p.valoare, discountProcent: p.discountProcent, moneda: 'RON', servicii: r.servicii || [], rand: r.id,
    });
  })));
  const order = PR_GRUPURI.map(([g]) => g).concat('Altele');
  return out.sort((a, b) => order.indexOf(a.grup) - order.indexOf(b.grup) || b.discountProcent - a.discountProcent);
}

function apply(D, P) {
  if (!P) return D;
  D.preturi = P.categorii.map((c) => ({ categorie: c.categorie, servicii: c.servicii.map((r) => ({ nume: r.nume, ...(r.subgrup ? { subgrup: r.subgrup } : {}), preturi: r.preturi.map(toList) })) }));
  for (const s of D.servicii || []) {
    s.preturi = P.categorii.flatMap((c) => c.servicii.filter((r) => (r.servicii || []).includes(s.id)).map((r) => {
      const first = r.preturi.map(toList).find((p) => p.valoare != null);
      return { nume: r.nume, categorie: c.categorie, ...(r.subgrup ? { subgrup: r.subgrup } : {}), valoare: first ? first.valoare : null };
    }));
  }
  D.oferte = offersOf(P);
  const iv = P.categorii.find((c) => /INTRAVENOASE/i.test(c.categorie));
  for (const x of D.produseProprii || []) {
    const r = iv?.servicii.find((y) => y.nume === x.nume);
    if (r) x.pret = toList(r.preturi.find((p) => p.valoare != null) || {}).valoare ?? x.pret;
  }
  return D;
}

module.exports = { FILE, PR_GRUPURI, catInfo, load, save, normalize, apply, offersOf, toList };
