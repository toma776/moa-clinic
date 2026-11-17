// Ultimul pas pe fiecare pagină /nou/ (din writePage): ce cere lista de pre-lansare pentru <head>.
// – canonical pe domeniul final (moaclinic.ro, fără prefixul /nou), dacă pagina nu are deja unul;
// – <title>, meta description, og:* și twitter:* fără diacritice (doar meta-urile; textul paginii rămâne cu diacritice);
// – Open Graph + Twitter card, cu imaginea principală a paginii;
// – entitatea clinicii (#organization) pe paginile care trimit la ea, dar nu o definesc;
// – <link rel="alternate" type="text/markdown"> spre versiunea .md a paginii (scripts/seo-files.js);
// – referințele la jpg/png trec pe varianta .webp, acolo unde există (scripts/webp.js).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://moaclinic.ro';
const DIAC = { ă: 'a', â: 'a', î: 'i', ș: 's', ş: 's', ț: 't', ţ: 't', Ă: 'A', Â: 'A', Î: 'I', Ș: 'S', Ş: 'S', Ț: 'T', Ţ: 'T' };
const fara = (s) => s.replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, (c) => DIAC[c]);
const attr = (s) => s.replace(/"/g, '&quot;');

// /nou/x/y/index.html → /x/y/  (adresa de pe domeniul final)
const finalPath = (file) => {
  const rel = path.relative(path.join(ROOT, 'nou'), path.dirname(file)).split(path.sep).filter(Boolean).join('/');
  return rel ? `/${rel}/` : '/';
};
// adresele din pagină: /nou/... devine /... pe domeniul final
const finalUrl = (u) => ORIGIN + (u.startsWith('/nou/') ? u.slice(4) : u);

const localFile = (u) => (u.startsWith('/wp-content/') ? path.join(ROOT, 'site', u) : path.join(ROOT, u));
const webpCache = new Map();
const webp = (u) => {
  if (!/\.(jpe?g|png)$/i.test(u) || !u.startsWith('/')) return u;
  if (!webpCache.has(u)) { const w = u.replace(/\.(jpe?g|png)$/i, '.webp'); webpCache.set(u, fs.existsSync(localFile(decodeURI(w))) ? w : u); }
  return webpCache.get(u);
};

// descrierea: maximum 160 de caractere, tăiată la un cuvânt întreg
const scurt = (d, max = 160) => (d.length <= max ? d : d.slice(0, max - 1).replace(/[\s,;:–-]+\S*$/, '') + '…');

function seo(html, file, org) {
  // 1. imaginile: jpg/png → webp (src, data-src, srcset, og, JSON-LD)
  html = html.replace(/(\/(?:wp-content|entitati|nou\/media)\/[^"'\s)]+?\.(?:jpe?g|png))(?=["'\s),?])/gi, (m) => webp(m));

  const headEnd = html.indexOf('</head>');
  let head = html.slice(0, headEnd);
  const body = html.slice(headEnd);
  const fp = finalPath(file);

  // 2. canonical
  if (!/rel="canonical"/.test(head)) head = head.replace(/(<\/title>)/, `$1\n<link rel="canonical" href="${ORIGIN}${fp}">`);
  const canon = (head.match(/rel="canonical" href="([^"]+)"/) || [])[1];

  // 3. title + description fără diacritice, descrierea scurtată la 160
  head = head.replace(/<title>([^<]*)<\/title>/, (m, t) => `<title>${fara(t)}</title>`);
  head = head.replace(/(<meta name="description" content=")([^"]*)(")/, (m, a, d, b) => a + attr(scurt(fara(d.replace(/&quot;/g, '"')))) + b);
  const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1] || 'MOA Clinic';
  const desc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';

  // 4. Open Graph + Twitter: imaginea principală (prima imagine raster din <main>), altfel fotografia clinicii
  if (!/property="og:title"/.test(head)) {
    const main = body.slice(body.indexOf('<main'));
    // fără miniaturi (…-w96.webp, …-150x150.jpg) și fără logo-uri: pentru distribuire trebuie o imagine mare
    const mica = (u) => /-w([1-5]?\d{1,2})\.\w+$|-(\d{2,3})x\d{2,3}\.\w+$|\/brands\//.test(u) && !/-(?:[6-9]\d\d|\d{4})x\d+\./.test(u);
    const img = [...main.matchAll(/<img[^>]+?(?:data-src|src)="(\/[^"?]+\.(?:webp|jpe?g|png|avif))/gi)].map((m) => m[1]).find((u) => !mica(u)) || webp('/wp-content/uploads/2024/10/Clinica-moa-1243x1536.jpeg');
    const isArt = /"@type":"BlogPosting"/.test(html);
    head += [
      `<meta property="og:type" content="${isArt ? 'article' : 'website'}">`,
      `<meta property="og:site_name" content="MOA Clinic">`,
      `<meta property="og:locale" content="ro_RO">`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:description" content="${desc}">`,
      `<meta property="og:url" content="${canon || ORIGIN + fp}">`,
      `<meta property="og:image" content="${finalUrl(img)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${title}">`,
      `<meta name="twitter:description" content="${desc}">`,
      `<meta name="twitter:image" content="${finalUrl(img)}">`,
    ].join('\n') + '\n';
  }

  // 5. entitatea clinicii pe fiecare pagină (o singură definiție cu @id stabil, la care trimit celelalte noduri)
  if (org && !html.includes(`"@id":"${org['@id']}","name"`) && !html.includes(`"@type":"MedicalClinic","@id":"${org['@id']}"`)) {
    head += `<script type="application/ld+json">${JSON.stringify(org)}</script>\n`;
  }

  // 6. versiunea Markdown a paginii
  if (!/type="text\/markdown"/.test(head)) head += `<link rel="alternate" type="text/markdown" href="/nou${fp === '/' ? '/' : fp}index.md">\n`;

  return head + body;
}

module.exports = { seo, fara, finalPath, finalUrl, ORIGIN };
