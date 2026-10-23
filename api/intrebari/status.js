// Validarea întrebărilor frecvente din panou, pe Vercel: GET = data/intrebari-status.json; PUT = o întrebare, commit.
const { readJson, commit, body, send, fail, now } = require('../_lib/gh');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') return send(res, 200, await readJson('data/intrebari-status.json', {}));
    if (req.method !== 'PUT') return send(res, 405, { error: 'metodă nepermisă' });
    const { id, status, intrebare, raspuns, nota } = body(req);
    if (!id || !['propusă', 'validată', 'respinsă'].includes(status)) return send(res, 400, { error: 'id + status' });
    const st = await readJson('data/intrebari-status.json', {});
    st[id] = { status, intrebare: intrebare || '', raspuns: raspuns || '', nota: nota || '', verificat_la: now() };
    await commit({ 'data/intrebari-status.json': st }, `Panou: întrebare ${status}`);
    return send(res, 200, { ok: true });
  } catch (e) { return fail(res, e); }
};
