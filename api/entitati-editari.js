// Entitățile editate în panou, pe Vercel: PUT { valori: { grup: valoare } } → entitati.json + entitati-editari.json într-un commit
// (aceeași logică ca PUT /api/entitati-editari din server.js); paginile se regenerează la build-ul Vercel.
const ED = require('../scripts/editari');
const { readJson, commit, body, send, fail } = require('./_lib/gh');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') return send(res, 200, await readJson('data/entitati-editari.json', { grupuri: {} }));
    if (req.method !== 'PUT') return send(res, 405, { error: 'metodă nepermisă' });
    const { valori } = body(req);
    if (!valori || typeof valori !== 'object') return send(res, 400, { error: 'aștept { valori: { grup: valoare } }' });
    const [D, E, P] = await Promise.all([readJson('data/entitati.json', null), readJson('data/entitati-editari.json', { grupuri: {} }), readJson('data/preturi.json', null)]);
    if (!D) return send(res, 503, { error: 'nu am putut citi data/entitati.json din GitHub' });
    E.grupuri = E.grupuri || {};
    const grupuri = ED.merge(D, E, valori, P);
    if (!grupuri.length) return send(res, 400, { error: 'niciun grup editabil' });
    await commit({ 'data/entitati.json': D, 'data/entitati-editari.json': E }, `Panou: entități actualizate (${grupuri.join(', ')})`);
    return send(res, 200, { ok: true, grupuri, build: 'ok', publicare: 'în ~1–2 minute' });
  } catch (e) { return fail(res, e); }
};
