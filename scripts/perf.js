// Performanță pentru paginile /nou/: fonturi găzduite local (fără CSS extern care blochează afișarea),
// foaia de stil minificată și versionată (style.min.css?v=<hash>), fonturile principale preîncărcate.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const NOU = path.join(__dirname, '..', 'nou');

// minificare sigură: fără comentarii și spații inutile, dar cu textul dintre ghilimele neatins
function minCss(css) {
  let out = '', i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '"' || c === "'") { const j = css.indexOf(c, i + 1); out += css.slice(i, j + 1); i = j + 1; continue; }
    if (c === '/' && css[i + 1] === '*') { i = css.indexOf('*/', i + 2) + 2; continue; }
    if (/\s/.test(c)) {
      while (i < css.length && /\s/.test(css[i])) i++;
      const prev = out.slice(-1), next = css[i];
      if (prev && next && !/[{};:,>(]/.test(prev) && !/[{};,>)!]/.test(next)) out += ' ';
      continue;
    }
    out += c; i++;
  }
  return out.replace(/;}/g, '}');
}

const css = fs.readFileSync(path.join(NOU, 'style.css'), 'utf8');
const min = minCss(css);
fs.writeFileSync(path.join(NOU, 'style.min.css'), min);
const v = crypto.createHash('md5').update(min).digest('hex').slice(0, 8);
const fontCss = fs.readFileSync(path.join(NOU, 'fonts', 'fonts.css'), 'utf8');
const FONT_HEAD = `<link rel="preload" href="/nou/fonts/CormorantGaramond-3-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/nou/fonts/Montserrat-5-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>${minCss(fontCss)}</style>`;

// înlocuiește în <head>: legăturile Google Fonts → fonturile locale; style.css → style.min.css?v=
const perfHead = (html) => html
  .replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*/g, '')
  .replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet">/g, FONT_HEAD)
  .replace(/<link rel="stylesheet" href="\/nou\/style\.css">/g, `<link rel="stylesheet" href="/nou/style.min.css?v=${v}">`);

module.exports = { perfHead, minCss, cssVersion: v, cssBytes: [css.length, min.length] };
