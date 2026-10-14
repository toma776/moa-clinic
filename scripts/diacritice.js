// Diacriticele lipsă din textele preluate de pe site-ul vechi („si”, „dupa”, „pasi”, „pret”, „siguranta” …).
// Dicționarul se învață din textele site-ului care sunt scrise corect (formele cu diacritice și cât de des apar),
// iar cuvintele cu două forme corecte se decid după context:
//  – substantive: „ședința” (articulat) / „o ședință”, „1 ședință”;
//  – verbe: „a ajuta”, „poți completa”, „nu consuma” (infinitiv) / „ajută”, „costă”;
//  – „aceasta” (pronume: „Aceasta poate…”) / „această” (+ substantiv: „această procedură”);
//  – „a doua zi”, „Ochii par mai mari”, „ca”, „va”, „da”, „sau”, „tine” rămân neatinse.
// Folosire: const { corecteaza } = require('./diacritice')(textele site-ului); corecteaza(obiect sau text).
module.exports = (corpus) => {
  const DI = /[ăâîșțşţ]/i;
  const strip = (w) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const nrm = (w) => w.replace(/ş/g, 'ș').replace(/ţ/g, 'ț').replace(/Ş/g, 'Ș').replace(/Ţ/g, 'Ț');
  const caseLike = (src, r) => (src === src.toUpperCase() && src.length > 1 ? r.toUpperCase() : src[0] === src[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r);
  const L = 'A-Za-zĂÂÎȘȚăâîșțŞŢşţ';
  const W = new RegExp(`[${L}]+(?:-[a-zăâîșț]+)?`, 'g');

  // cuvinte care nu apar scrise corect nicăieri pe site, deci nu pot fi învățate de acolo
  const MANUAL = {
    dureaza: 'durează', facut: 'făcut', injectari: 'injectări', adreseaza: 'adresează', vad: 'văd', ingrijesc: 'îngrijesc', slaba: 'slabă',
    vizeaza: 'vizează', viseaza: 'vizează', expusa: 'expusă', distructia: 'distrucția', inovatie: 'inovație', opreste: 'oprește', asculta: 'ascultă',
    clienti: 'clienți', macar: 'măcar', creasca: 'crească', pregatiti: 'pregătiți', avizata: 'avizată', mentenanta: 'mentenanța',
    menstruatiei: 'menstruației', sustinuta: 'susținută', corectie: 'corecție', retinut: 'reținut', esuturilor: 'țesuturilor', ombilicala: 'ombilicală',
    garantia: 'garanția', initial: 'inițial', axilara: 'axilară', desfasoara: 'desfășoară', lucreaza: 'lucrează', realizeaza: 'realizează',
    functioneaza: 'funcționează', interna: 'internă', bratelor: 'brațelor', mainilor: 'mâinilor', gat: 'gât',
  };
  // substantive feminine: rămân articulate (-a), cu excepția contextelor care cer forma nearticulată (-ă)
  const NOUN = new Set('toxina procedura perioada metoda sauna oboseala crema masca elastina medicina estetica genetica clinica zona durata textura structura baza forma plasma boala igiena rutina analiza lumina cauza sarcina sinteza varianta doza expertiza etapa apa gama vizita pauza celulita regula componenta problema molecula coaja luna sala buza axila hiperhidroza nutrigenetica epigenetica nutrigenomica tehnica noua ultima alta sedinta zi buna'.split(' '));
  const NEART = new Set(['o', 'fiecare', 'orice', 'nicio', 'altă', 'alta', 'singură', 'singura', 'oricare', 'unei', 'nouă', 'noua', 'această', 'prima', 'ultima', 'ultimă', 'aceeași', 'aceeasi']);
  // verbe: infinitiv (-a) după aceste cuvinte, altfel persoana a 3-a (-ă)
  const VERB = new Set('ajuta aplica necesita evita recomanda observa implica exista costa consta afla combina elimina asigura reda discuta identifica determina verifica modifica schimba consuma dezvolta solicita sta bucura descopera completa continua scurta respecta creste sustine mentin vad asculta'.split(' '));
  const INF = new Set(['a', 'poate', 'pot', 'putea', 'vor', 'va', 'vei', 'voi', 'vom', 'veți', 'veti', 'poți', 'poti', 'puteți', 'puteti', 'pentru', 'de', 'fi', 'să', 'sa', 'nu']);
  const CLITIC = new Set(['se', 'te', 'vă', 'va', 'le', 'li', 'îl', 'il', 'îi', 'ii', 'ne', 'mă', 'ma', 'o']);
  const NEATINS = new Set(['ca', 'va', 'da', 'sau', 'tine', 'par', 'sta', 'mari', 'luna', 'sala', 'apa']);

  // învățarea din textele scrise corect (șirurile care au deja diacritice)
  const strs = [];
  const walk = (o) => { if (typeof o === 'string') strs.push(o); else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
  walk(corpus);
  const good = {}, dupaAceasta = new Set();
  for (const s of strs) {
    if (!DI.test(s)) continue;
    for (const w of s.match(W) || []) { const f = nrm(w).toLowerCase(), k = strip(w); (good[k] = good[k] || {})[f] = (good[k][f] || 0) + 1; }
    for (const m of s.matchAll(/[Aa]ceastă ([a-zăâîșț]+)/g)) dupaAceasta.add(strip(m[1]));
  }
  const sigur = {}, ambig = {}, ratio = {};
  for (const [k, g] of Object.entries(good)) {
    const forms = Object.entries(g).filter(([f]) => f !== k).sort((a, b) => b[1] - a[1]);
    if (!forms.length) continue;
    const plain = g[k] || 0; ratio[k] = forms[0][1] / Math.max(1, plain);
    if (plain === 0 && !NOUN.has(k) && !VERB.has(k)) sigur[k] = forms[0][0]; else ambig[k] = forms[0][0];
  }

  const text = (s) => {
    const bad = !DI.test(s); // tot șirul e scris fără diacritice
    const parts = s.split(new RegExp(`([${L}]+(?:-[a-zăâîșț]+)?)`));
    const wordAt = (i) => (i >= 1 && i < parts.length ? parts[i].toLowerCase() : '');
    for (let i = 1; i < parts.length; i += 2) {
      const w = parts[i]; if (DI.test(w) || w.length < 2) continue;
      const k = w.toLowerCase(); if (strip(w) !== k) continue;
      const prev = wordAt(i - 2), next = /^\s*$/.test(parts[i + 1] || '') ? wordAt(i + 2) : '';
      let r = null;
      if (k === 'aceasta') r = dupaAceasta.has(next) ? 'această' : null;
      else if (k === 'doua') r = prev === 'a' ? null : 'două';
      else if (k === 'par') r = ['mai', 'să', 'sa', 'a', 'ca', 'că'].includes(next) ? null : 'păr';
      else if (VERB.has(k)) { const inf = INF.has(prev) || (CLITIC.has(prev) && INF.has(wordAt(i - 4))); if (!inf) r = ambig[k] || sigur[k] || MANUAL[k] || null; }
      else if (NOUN.has(k)) {
        const neart = NEART.has(prev) || /\d\s*$/.test(parts[i - 1] || '') || (['pe', 'per'].includes(prev) && !next);
        if (ambig[k]) r = neart && /ă$/.test(ambig[k]) ? ambig[k] : ambig[k].replace(/ă$/, 'a');
      } else if (sigur[k]) r = sigur[k];
      else if (MANUAL[k]) r = MANUAL[k];
      else if (ambig[k]) {
        if (k === 'sa') r = 'să'; else if (k === 'si') r = 'și'; else if (k === 'in') r = 'în'; else if (k === 'cat') r = 'cât';
        else if (bad && k.length >= 5 && /a$/.test(k) && /ă$/.test(ambig[k])) r = ambig[k]; // adjective: definitivă, completă …
        else if (ratio[k] >= 3 && !NEATINS.has(k)) r = ambig[k]; // preț, poți, îți, după, dacă, București …
      }
      if (r && r !== k) parts[i] = caseLike(w, r);
    }
    return parts.join('');
  };
  // obiect întreg: doar textele, nu identificatorii, adresele și căile imaginilor
  const SKIP = new Set(['id', 'url', 'src', 'img', 'hero', 'href', 'slug', 'vechi', 'poster', 'mobil', 'sursa', 'rol', 't', 'imagine', 'redirecturi', 'foto']);
  const corecteaza = (o) => {
    if (typeof o === 'string') return text(o);
    if (Array.isArray(o)) return o.map(corecteaza);
    if (o && typeof o === 'object') { for (const k of Object.keys(o)) if (!SKIP.has(k)) o[k] = corecteaza(o[k]); return o; }
    return o;
  };
  return { corecteaza, text };
};
