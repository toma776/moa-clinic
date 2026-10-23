// Prețurile din panou, pe Vercel: GET = data/preturi.json; PUT = curăță lista, o aplică în entități și le salvează pe amândouă într-un commit.
// Paginile se regenerează la build-ul Vercel declanșat de commit (aceeași logică ca PUT /api/preturi din server.js).
const PRT = require('../scripts/preturi');
const { readJson, commit, body, send, fail } = require('./_lib/gh');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') return send(res, 200, await readJson('data/preturi.json', null));
    if (req.method !== 'PUT') return send(res, 405, { error: 'metodă nepermisă' });
    const b = body(req);
    if (!Array.isArray(b.categorii)) return send(res, 400, { error: 'aștept { categorii: [...] }' });
    const P = PRT.normalize(b);
    const D = await readJson('data/entitati.json', null);
    const files = { 'data/preturi.json': P };
    if (D) files['data/entitati.json'] = PRT.apply(D, P);
    const n = PRT.offersOf(P).length;
    await commit(files, `Panou: lista de prețuri actualizată (${n} oferte)`);
    return send(res, 200, { ok: true, preturi: P, oferte: n, build: 'ok', publicare: 'în ~2 minute' });
  } catch (e) { return fail(res, e); }
};
