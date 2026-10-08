// Descarcă homepage-ul moaclinic.ro + toate resursele lui (CSS, JS, imagini, fonturi)
// în site/, păstrând căile originale, și rescrie URL-urile ca să fie servite local.
// Rulare: npm run mirror
const fs = require('fs');
const path = require('path');
const { ORIGIN, get, decodeCfEmail } = require('./lib');

const SITE_DIR = path.join(__dirname, '..', 'site');
const ASSET_RE = /(?:https?:)?(?:\\?\/\\?\/)(?:www\.)?moaclinic\.ro((?:\\?\/)(?:wp-content|wp-includes)(?:\\?\/)[^"'\s)<>,]+)/g;
const ROOT_ASSET_RE = /["'(\s]((?:\/)(?:wp-content|wp-includes)\/[^"'\s)<>,]+)/g;

const queue = new Map(); // cale locală -> URL absolut
const done = new Set();

function cleanPath(p) {
  return decodeURI(p.replace(/\\\//g, '/').split(/[?#]/)[0]);
}

function enqueue(p) {
  const local = cleanPath(p);
  if (!/\.[a-z0-9]{2,5}$/i.test(local)) return; // doar fișiere
  if (!queue.has(local) && !done.has(local)) queue.set(local, ORIGIN + encodeURI(local));
}

function collect(content) {
  for (const m of content.matchAll(ASSET_RE)) enqueue(m[1]);
  for (const m of content.matchAll(ROOT_ASSET_RE)) enqueue(m[1]);
}

// url(...) din CSS, relative la fișierul CSS.
function collectCss(css, cssPath) {
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const ref = m[1].trim();
    if (ref.startsWith('data:') || ref.startsWith('#')) continue;
    if (/^(https?:)?\/\//.test(ref)) {
      const u = new URL(ref, ORIGIN);
      if (/(^|\.)moaclinic\.ro$/.test(u.hostname)) enqueue(u.pathname);
      continue;
    }
    enqueue(path.posix.join(path.posix.dirname(cssPath), ref));
  }
  collect(css);
}

async function worker() {
  while (queue.size) {
    const [local, url] = queue.entries().next().value;
    queue.delete(local);
    done.add(local);
    const dest = path.join(SITE_DIR, local);
    try {
      let buf;
      if (fs.existsSync(dest)) buf = fs.readFileSync(dest);
      else {
        buf = await get(url, { binary: true });
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, buf);
      }
      if (local.endsWith('.css')) collectCss(buf.toString('utf8'), local);
    } catch (e) {
      console.warn('  ! ', e.message);
    }
  }
}

async function main() {
  console.log('Descarc homepage...');
  let html = await get(ORIGIN + '/');
  collect(html);

  // Decodează emailurile ascunse de Cloudflare (altfel apar ca "[email protected]").
  html = html
    .replace(/<a([^>]*?)href="\/cdn-cgi\/l\/email-protection#([0-9a-f]+)"/g, (_, a, hex) => `<a${a}href="mailto:${decodeCfEmail(hex)}"`)
    .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">[^<]*<\/span>/g, (_, hex) => decodeCfEmail(hex))
    .replace(/<script[^>]*cdn-cgi\/scripts\/[^>]*email-decode[^>]*><\/script>/g, '');

  // Rescrie URL-urile absolute ale resurselor în căi locale.
  html = html
    .replace(/https?:\\\/\\\/(?:www\.)?moaclinic\.ro\\\/(wp-content|wp-includes)\\\//g, '\\/$1\\/')
    .replace(/(?:https?:)?\/\/(?:www\.)?moaclinic\.ro\/(wp-content|wp-includes)\//g, '/$1/');

  fs.mkdirSync(SITE_DIR, { recursive: true });
  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), html);

  console.log(`Descarc resursele (${queue.size} inițial)...`);
  await Promise.all(Array.from({ length: 8 }, worker));

  // Rescrie și în CSS-urile descărcate URL-urile absolute.
  for (const local of done) {
    if (!local.endsWith('.css')) continue;
    const f = path.join(SITE_DIR, local);
    if (!fs.existsSync(f)) continue;
    const css = fs.readFileSync(f, 'utf8');
    const out = css.replace(/(?:https?:)?\/\/(?:www\.)?moaclinic\.ro\/(wp-content|wp-includes)\//g, '/$1/');
    if (out !== css) fs.writeFileSync(f, out);
  }
  console.log(`Gata: site/index.html + ${done.size} resurse.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
