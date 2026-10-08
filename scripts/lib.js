// Utilitare comune pentru scripturile de extracție.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MoaClinicLocal/1.0';
const ORIGIN = 'https://moaclinic.ro';

async function get(url, { binary = false } = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

const ENTITIES = {
  '&nbsp;': ' ', '&#160;': ' ', '&amp;': '&', '&quot;': '"', '&#039;': "'", '&#8211;': '–',
  '&#8212;': '—', '&#8217;': '’', '&#8216;': '‘', '&#8220;': '“', '&#8221;': '”', '&lt;': '<', '&gt;': '>',
};

function decodeEntities(s) {
  return s
    .replace(/&[#a-z0-9]+;/gi, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
}

// HTML -> text pe o singură linie, curățat.
function text(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
}

// Cloudflare email obfuscation: primul byte e cheia XOR.
function decodeCfEmail(hex) {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = '';
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return out;
}

module.exports = { UA, ORIGIN, get, text, decodeEntities, decodeCfEmail };
