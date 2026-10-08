/* Pornire: încarcă toate datele, aplică statusurile salvate, deschide ruta din URL. */
Promise.all([
  api.get('/api/entitati'), api.get('/api/leads'), api.get('/api/pages'), api.get('/api/site-health'),
  api.get('/api/observatii/status'), api.get('/api/intrebari/status'),
]).then(([e, l, p, h, os, qs]) => {
  Object.assign(store, { entitati: e, leads: Array.isArray(l) ? l : [], pages: p, health: h, obsStatus: os || {}, qStatus: qs || {} });
  applyQStatus();
  updateCounts();
  go(routeFromPath());
});
