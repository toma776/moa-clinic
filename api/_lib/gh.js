// Panoul de pe Vercel salvează în repo: citește ultima versiune a unui fișier din GitHub și scrie modificările ca un commit pe main.
// Vercel publică singur commitul (și regenerează paginile, vezi buildCommand în vercel.json).
// Variabile în Vercel: GITHUB_TOKEN (fine-grained, Contents: read & write pe repo); opțional GITHUB_REPO, GITHUB_BRANCH.
const fs = require('fs');
const path = require('path');

const REPO = process.env.GITHUB_REPO || 'toma776/moa-clinic';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN = process.env.GITHUB_TOKEN || '';

const gh = async (url, opt = {}) => {
  const r = await fetch('https://api.github.com/repos/' + REPO + url, {
    ...opt,
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {}), ...(opt.headers || {}) },
  });
  if (!r.ok) { const e = new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`); e.status = r.status; throw e; }
  return r;
};

// ultima versiune din repo; dacă GitHub nu răspunde, copia din deploy
async function readJson(rel, fallback) {
  try {
    const r = await gh(`/contents/${rel}?ref=${BRANCH}&t=${Date.now()}`, { headers: { Accept: 'application/vnd.github.raw+json' } });
    return JSON.parse(await r.text());
  } catch {
    try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), 'utf8')); } catch { return fallback; }
  }
}

// mai multe fișiere într-un singur commit; dacă main s-a mișcat între timp, reîncearcă o dată
async function commit(files, message) {
  if (!TOKEN) { const e = new Error('Salvarea online nu e activă: lipsește GITHUB_TOKEN în Vercel (Settings › Environment Variables).'); e.status = 503; throw e; }
  for (let i = 0; ; i++) {
    const head = await (await gh(`/git/ref/heads/${BRANCH}`)).json();
    const base = await (await gh(`/git/commits/${head.object.sha}`)).json();
    const tree = await (await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: base.tree.sha, tree: Object.entries(files).map(([p, c]) => ({ path: p, mode: '100644', type: 'blob', content: typeof c === 'string' ? c : JSON.stringify(c, null, 2) })) }) })).json();
    const c = await (await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [head.object.sha] }) })).json();
    try {
      await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha }) });
      return c.sha;
    } catch (e) { if (i || e.status !== 422) throw e; }
  }
}

const body = (req) => (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {});
const send = (res, code, data) => res.status(code).setHeader('Cache-Control', 'no-store').json(data);
const fail = (res, e) => send(res, e.status === 503 ? 503 : 500, { error: e.message });
const now = () => new Date().toISOString().slice(0, 19);

module.exports = { readJson, commit, body, send, fail, now };
