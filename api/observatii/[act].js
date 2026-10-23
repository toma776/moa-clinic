// Observațiile SEO din panou, pe Vercel: GET /api/observatii/status; POST verifica | confirma | redeschide (ca în server.js).
const checks = require('../../scripts/checks');
const { readJson, commit, body, send, fail, now } = require('../_lib/gh');
const ST = 'data/observatii-status.json';

module.exports = async (req, res) => {
  try {
    const act = req.query.act;
    if (req.method === 'GET' && act === 'status') return send(res, 200, await readJson(ST, {}));
    if (req.method !== 'POST') return send(res, 405, { error: 'metodă nepermisă' });
    const b = body(req);
    const obs = ((await readJson('data/entitati.json', {})).observatii || []).find((o) => o.id === b.id);
    if (!obs) return send(res, 404, { error: 'observație inexistentă' });
    const st = await readJson(ST, {});
    if (act === 'verifica') {
      let r;
      try { r = await checks.run(obs.check || { tip: 'manual' }); } catch (e) { return send(res, 200, { rezultat: 'eroare', eroare: e.message }); }
      const out = { rezultat: r.ok ? 'rezolvat' : 'deschis', detalii: r.detalii, verificat_la: now(), salvat: false };
      if (r.ok && b.salveaza) {
        st[obs.id] = { status: 'rezolvat', metoda: 'verificat pe site', verificat_la: out.verificat_la, detalii: r.detalii };
        await commit({ [ST]: st }, `Panou: observație rezolvată (${obs.id})`);
        out.salvat = true;
      }
      return send(res, 200, out);
    }
    if (act === 'confirma') st[obs.id] = { status: 'rezolvat', metoda: 'confirmat manual', verificat_la: now(), nota: b.nota || '' };
    else if (act === 'redeschide') delete st[obs.id];
    else return send(res, 404, { error: 'rută necunoscută' });
    await commit({ [ST]: st }, `Panou: observație ${act === 'confirma' ? 'confirmată' : 'redeschisă'} (${obs.id})`);
    return send(res, 200, { ok: true });
  } catch (e) { return fail(res, e); }
};
