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
// CSS-ul primului ecran (pus direct în pagină): regulile fără clase (elemente, :root) și cele ale componentelor
// vizibile sus sau ascunse până la o acțiune (header, meniuri, hero-uri, butoane, bara de jos, panouri, .rv).
// Restul foii de stil se încarcă în paralel, fără să blocheze afișarea.
function blocks(css) {
  const out = []; let i = 0;
  while (i < css.length) {
    let j = i, depth = 0, q = null;
    for (; j < css.length; j++) {
      const c = css[j];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { j++; break; } }
      else if (c === ';' && depth === 0) { j++; break; }
    }
    out.push(css.slice(i, j)); i = j;
  }
  return out.filter((b) => b.trim());
}
const CRIT = /\.(topbar|site|hd|logo|nav|nav-btn|btn|burger|mm|mnav|mscreen|mrow|scrim|hero|hs|doc-chip|lede|eyebrow|wrap|frame|pf-|tr-hero|tr-photo|tr-offer|tr-facts|tr-docs|tr-wa|tr-toc|crumbs|ar-hero|ar-head|ar-meta|ar-cover|bl-hero|pr-hero|cs-hero|lg-|rx-trust|rv|mbar|sheet|wl|to-top|link-u|swipe-hint|sr-only|skip|arrow|hp-strip|ar-|sec|alt|tr-split|tr-how|pr-|bl-|vp-|cs-|lg-|sr|team-filter|tabs|v-card|vb|play)/;
function critical(css) {
  return blocks(css).map((b) => {
    if (/^@(font-face|keyframes|-webkit-keyframes|charset|import)/.test(b)) return b;
    if (/^@(media|supports)/.test(b)) {
      const k = b.indexOf('{');
      const inner = critical(b.slice(k + 1, -1));
      return inner ? b.slice(0, k + 1) + inner + '}' : '';
    }
    if (b.startsWith('@')) return '';
    const sel = b.slice(0, b.indexOf('{'));
    return !/[.#]/.test(sel.replace(/\([^)]*\)/g, '')) || CRIT.test(sel) ? b : '';
  }).join('');
}
const crit = critical(min);
const fontCss = fs.readFileSync(path.join(NOU, 'fonts', 'fonts.css'), 'utf8');
const FONT_HEAD = `<link rel="preload" href="/nou/fonts/CormorantGaramond-3-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/nou/fonts/Montserrat-5-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>${minCss(fontCss)}</style>`;

// înlocuiește în <head>: legăturile Google Fonts → fonturile locale; style.css → style.min.css?v=
const perfHead = (html) => html
  .replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*/g, '')
  .replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet">/g, FONT_HEAD)
  .replace(/<link rel="stylesheet" href="\/nou\/style\.css">/g, `<style id="crit">${crit}</style>\n<link rel="preload" href="/nou/style.min.css?v=${v}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/nou/style.min.css?v=${v}"></noscript>`);

module.exports = { perfHead, minCss, cssVersion: v, cssBytes: [css.length, min.length, crit.length] };
