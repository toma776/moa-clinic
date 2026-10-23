// Brand book-ul din panou, pe Vercel: GET = data/brand.json; PUT = commit cu noua versiune.
const { readJson, commit, body, send, fail } = require('./_lib/gh');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') return send(res, 200, await readJson('data/brand.json', {}));
    if (req.method !== 'PUT') return send(res, 405, { error: 'metodă nepermisă' });
    await commit({ 'data/brand.json': body(req) }, 'Panou: brand book actualizat');
    return send(res, 200, { ok: true });
  } catch (e) { return fail(res, e); }
};
