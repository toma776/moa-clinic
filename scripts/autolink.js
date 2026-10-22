// Legături automate din textul articolelor către paginile de tratament: prima mențiune a fiecărui tratament devine link.
// Nu se atinge textul din titluri, linkuri, butoane, rezumatul întrebărilor (summary) sau etichete; maximum MAX legături pe articol.
const REGULI = [
  ['glutation', /perfuzi(?:a|ile|i|e) cu glutation|glutationul? (?:intravenos|perfuzabil)|Glutation (?:Therapy|Detox)/i],
  ['terapia-nad', /\b(?:terapia |perfuzi(?:a|i|e) cu )?NAD\+?(?=\W)/],
  ['injectare-botox', /toxin(?:a|ă) botulinic(?:a|ă)|\bbotox(?:ul|ului)?\b/i],
  ['augmentare-buze', /augmentare(?:a)? buzelor|mărire(?:a)? buzelor|acid hialuronic (?:în|in|pentru) buze/i],
  ['injectari-acid-hialuronic', /acid(?:ul|ului)? hialuronic/i],
  ['sculptra', /\bSculptra\b/i],
  ['harmonyca', /\bHArmonyCa\b/i],
  ['skinbooster-vital', /skin ?booster/i],
  ['polinucleotide', /polinucleotid\w*|\bRejuran\b/i],
  ['jalupro-young-eye', /\bJalupro\b/i],
  ['nefertiti-lift', /Nefertiti Lift/i],
  ['mezoterapie', /mezoterapi\w*/i],
  ['prp-scalp', /\bPRP\b|terapia vampir/i],
  ['microneedeling', /\bDermapen\b|microneedling/i],
  ['dermalinfusion', /\bDermalinfusion\b/i],
  ['venus-legacy', /Venus Legacy/i],
  ['venus-viva', /Venus Viva/i],
  ['epilare-definitiva-bucuresti', /epilare(?:a)? definitiv(?:ă|a)|Splendor X/i],
  ['laser-vascular', /laser(?:ul)? vascular/i],
  ['blefaroplastie', /blefaroplasti\w*/i],
  ['lip-lifting', /\blip ?lift\w*/i],
  ['nevi-pigmentari', /îndepărtare(?:a)? alunițelor|excizia alunițelor/i],
  ['eliminare-papiloame', /papiloam\w*/i],
  ['autohemoterapia', /autohemoterapi\w*|ozonoterapi\w*/i],
  ['sauna-cu-ozon', /saun(?:a|ă) cu ozon/i],
  ['fotobiomodulare-vielight', /\bVielight\b|fotobiomodulare/i],
  ['tms-stimulare-magnetica-transcraniana', /\bTMS\b|stimulare(?:a)? magnetică transcraniană/i],
  ['nutrigenetica-epigenetica', /nutrigenetic\w*|nutrigenomic\w*/i],
  ['skin-care-dna', /\bDNA Skin\b/i],
  ['hiperhidroza-axilara', /hiperhidroz\w*/i],
];
const SKIP = /^(a|h1|h2|h3|h4|summary|button|small|label|figcaption|title|script|style|i|b|em)$/i;
const nz = (x) => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// etichetele de preț din pași (<em>…</em> în ol.rx-steps) devin linkuri către pagina tratamentului/consultației
const sidDin = (txt, { has, nume }) => {
  for (const [sid, re] of REGULI) if (has(sid) && re.test(txt)) return sid;
  const t = nz(txt);
  let best = null;
  for (const [sid, n] of nume) {
    const k = nz(n).replace(/\s*\(.*\)$/, '').split(/ [–&\/] /)[0].trim();
    if (k.length > 4 && t.includes(k) && (!best || k.length > best[1])) best = [sid, k.length];
  }
  if (!best && /consulta/.test(t)) for (const [sid, n] of nume) if (/consulta/.test(nz(n)) && /dermato/.test(t) === /dermato/.test(nz(n)) && /antiaging/.test(t) === /antiaging/.test(nz(n)) && /chirurgie/.test(t) === /chirurgie/.test(nz(n))) return sid;
  return best?.[0];
};
const pretLinks = (html, o) => html.replace(/<ol class="rx-steps">[\s\S]*?<\/ol>/g, (ol) => ol.replace(/<li>([\s\S]*?)<\/li>/g, (li, inner) => {
  const fallback = sidDin(inner.replace(/<em>[\s\S]*?<\/em>/g, '').replace(/<[^>]+>/g, ' '), o) || o.rel;
  let last = null;
  return '<li>' + inner.replace(/<em>([\s\S]*?)<\/em>/g, (m, x) => {
    if (/<a /.test(x)) return m;
    const sid = sidDin(x.replace(/<[^>]+>/g, ''), o) || last || fallback;
    if (!sid) return m;
    last = sid;
    return `<em><a href="${o.live(sid)}">${x}</a></em>`;
  }) + '</li>';
}));
module.exports = (html, o) => {
  const { live, has, exclude = [], max = 10 } = o;
  const used = new Set(exclude);
  // tratamentele deja legate în text nu se mai leagă a doua oară
  for (const m of html.matchAll(/href="([^"]+)"/g)) for (const [sid] of o.nume) if (m[1] === live(sid)) used.add(sid);
  html = pretLinks(html, o);
  let n = 0;
  const tok = html.split(/(<[^>]+>)/);
  const stack = [];
  for (let i = 0; i < tok.length; i++) {
    const t = tok[i];
    if (t.startsWith('<')) {
      const m = t.match(/^<(\/?)([a-z0-9]+)/i);
      if (m && !/\/>$/.test(t) && !/^(br|img|input|hr|source|meta|link)$/i.test(m[2])) { if (m[1]) { const k = stack.lastIndexOf(m[2].toLowerCase()); if (k >= 0) stack.length = k; } else stack.push(m[2].toLowerCase()); }
      continue;
    }
    if (!t.trim() || n >= max || stack.some((s) => SKIP.test(s))) continue;
    let out = t;
    for (const [sid, re] of REGULI) {
      if (n >= max || used.has(sid) || !has(sid)) continue;
      const m = out.match(re);
      if (!m) continue;
      // nu în interiorul unui link deja creat în același fragment
      const before = out.slice(0, m.index);
      if ((before.match(/<a /g) || []).length > (before.match(/<\/a>/g) || []).length) continue;
      out = before + `<a class="ar-tlink" href="${live(sid)}">${m[0]}</a>` + out.slice(m.index + m[0].length);
      used.add(sid); n++;
    }
    tok[i] = out;
  }
  return tok.join('');
};
