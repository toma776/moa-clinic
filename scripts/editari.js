// Editările din panou peste entități: data/entitati-editari.json ține, pentru fiecare grup editat (echipa, servicii, glosar …),
// valoarea lui completă. Grupurile editate devin sursa de adevăr: extract/enrich (npm run sync) le reaplică după ce regenerează
// data/entitati.json, ca editările să nu se piardă. Prețurile și ofertele au editorul lor (data/preturi.json) și au prioritate.
const fs = require('fs');
const path = require('path');
const PRT = require('./preturi');

const FILE = path.join(__dirname, '..', 'data', 'entitati-editari.json');
// grupuri care nu se editează aici: metadatele crawl-ului și ce derivă din lista de prețuri
const BLOCATE = new Set(['meta', 'preturi', 'oferte']);

const load = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { grupuri: {} }; } };
const save = (E) => fs.writeFileSync(FILE, JSON.stringify(E, null, 2));

// pune valorile noi în editări și în entități; P = lista de prețuri (reaplicată la final, ca prețurile să rămână cele din editorul lor)
function merge(D, E, valori, P) {
  const schimbate = [];
  for (const [k, v] of Object.entries(valori || {})) {
    if (BLOCATE.has(k) || v === undefined) continue;
    E.grupuri[k] = v;
    D[k] = v;
    schimbate.push(k);
  }
  E.actualizat = new Date().toISOString().slice(0, 19);
  if (P) PRT.apply(D, P);
  return schimbate;
}

// la regenerarea entităților: reaplică toate grupurile editate
function apply(D, E = load()) {
  for (const [k, v] of Object.entries(E.grupuri || {})) if (!BLOCATE.has(k)) D[k] = v;
  return D;
}

module.exports = { FILE, BLOCATE, load, save, merge, apply };
