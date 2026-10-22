// Versiunea structurată a articolului „Acid hialuronic în buze – cât durează?”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vrea să știe cât ține rezultatul:
// răspunsul scurt → cât durează în medie → de ce diferă → cum prelungești efectul (listă bifabilă) → retuș → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const buze = serv['augmentare-buze']?.preturi || [];
  const pB = (re) => buze.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['cat-dureaza', 'Cât durează în medie'],
    ['factori', 'De ce diferă de la o persoană la alta'],
    ['prelungire', 'Cum prelungești efectul'],
    ['retus', 'Când se face retușul'],
    ['la-moa', 'Acidul hialuronic în buze la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cât ține acidul hialuronic în buze?', 'În medie, între 6 și 12 luni. La unele persoane volumul rămâne vizibil și peste un an, altele simt nevoia unui retuș după 5–6 luni. Fiecare organism metabolizează acidul hialuronic în ritmul său.'],
    ['De ce mie îmi ține mai puțin decât altcuiva?', 'Contează metabolismul, sportul intens, tipul de produs folosit, tehnica de injectare și obiceiurile zilnice: fumatul, soarele, deshidratarea și lipsa îngrijirii buzelor pot grăbi resorbția.'],
    ['Pot face ceva ca efectul să dureze mai mult?', 'Da, câteva obiceiuri ajută: hidratarea, balsamul de buze cu SPF, renunțarea la fumat, evitarea atingerilor și a masajului zonei și respectarea indicațiilor medicului după procedură.'],
    ['Este efectul permanent?', 'Nu. Acidul hialuronic este o substanță biodegradabilă, pe care corpul o metabolizează treptat. De aceea, pentru a păstra volumul, se discută ședințe de întreținere.'],
    ['La cât timp se face retușul?', 'Uneori, o mică retușare după 6–8 luni poate menține rezultatul, fără să exagerezi cu volumul. Momentul îl stabilește medicul, după cum arată buzele tale.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>În medie, efectul acidului hialuronic în buze durează <b>între 6 și 12 luni</b>.</li>
    <li>Acidul hialuronic este <b>biodegradabil</b>: corpul îl metabolizează treptat, în ritmul său.</li>
    <li>Durata depinde de <b>metabolism, produs, tehnica de injectare și obiceiurile tale</b>.</li>
    <li>Hidratarea, protecția solară și renunțarea la fumat pot ajuta ca rezultatul să se mențină <b>mai mult timp</b>.</li>
    <li>La MOA, tipul de produs și ritmul de întreținere se stabilesc <b>la consult</b>${pret('augmentare-buze') ? `; mărirea buzelor pornește de la ${lei(pret('augmentare-buze'))}` : ''}.</li>
  </ul>
</section>

<h2 id="cat-dureaza">Cât durează în medie acidul hialuronic în buze</h2>
<p class="ar-first">Când te gândești la buze mai pline și conturate natural, apare inevitabil întrebarea: cât ține, de fapt, rezultatul? Merită să știi asta înainte de procedură, ca să iei decizia în cunoștință de cauză, fără așteptări nerealiste.</p>
<p>În medie, efectul acidului hialuronic în buze durează <b>între 6 și 12 luni</b>. La unele persoane volumul rămâne vizibil chiar și peste un an, în timp ce altele simt nevoia unui retuș după 5–6 luni. Este normal: fiecare corp procesează acidul hialuronic în ritmul său, așa că rezultatul nu e standard, ci personal.</p>

<h2 id="factori">De ce diferă durata de la o persoană la alta</h2>
<p>Acidul hialuronic este o substanță biodegradabilă, metabolizată treptat de corp. Cât de repede se întâmplă asta depinde de câțiva factori:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Metabolismul tău</b><p>Dacă ești o persoană activă, faci sport regulat sau ai un metabolism rapid, substanța se poate resorbi mai repede.</p></div>
  <div class="rx-card"><i>02</i><b>Tipul de acid hialuronic</b><p>Formulele mai dense, reticulate, durează de obicei mai mult. Formulele mai fluide dau un rezultat natural, dar mai scurt.</p></div>
  <div class="rx-card"><i>03</i><b>Tehnica medicului</b><p>O injectare corectă, cu distribuție uniformă și adaptată formei buzelor, contribuie la un rezultat armonios și poate ajuta la menținerea lui.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Obiceiuri care pot grăbi resorbția</span>
  <ul class="rx-chips rx-chips-neg"><li>fumatul</li><li>expunerea excesivă la soare</li><li>deshidratarea</li><li>lipsa îngrijirii buzelor</li><li>atingerile și masajul frecvent al zonei</li></ul>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Intervalul de 6–12 luni este o medie, nu o promisiune. Nimeni nu poate spune dinainte exact cât va ține la tine. De aceea, medicul urmărește cum evoluează buzele și stabilește întreținerea după ce vede cum răspunde organismul tău.</p></aside>

<h2 id="prelungire">Cum prelungești efectul injectării în buze</h2>
<p>Rezultatul nu ține doar de seringă, ci și de ce faci după. Bifează ce ai inclus deja în rutina ta; lista rămâne salvată în browser.</p>
<ul class="rx-todo" data-todo>
  <li><label><input type="checkbox"> Bea suficientă apă în fiecare zi</label></li>
  <li><label><input type="checkbox"> Folosește un balsam de buze hrănitor</label></li>
  <li><label><input type="checkbox"> Alege un balsam cu SPF, și în afara verii</label></li>
  <li><label><input type="checkbox"> Evită fumatul</label></li>
  <li><label><input type="checkbox"> Nu atinge și nu masa des zona injectată</label></li>
  <li><label><input type="checkbox"> Evită tratamentele agresive în zonă câteva zile după procedură</label></li>
  <li><label><input type="checkbox"> Urmează exact indicațiile primite de la medic</label></li>
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="retus">Când se face retușul</h2>
<p>Reinjectarea periodică nu înseamnă să exagerezi, ci să întreții volumul obținut într-un mod natural. Uneori, o mică retușare după <b>6–8 luni</b> poate menține rezultatul, fără un aspect artificial. Momentul potrivit îl stabilește medicul, după cum arată buzele tale, nu după un calendar fix.</p>

<h2 id="la-moa">Acidul hialuronic în buze la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul discută cu tine ce îți dorești, îți evaluează buzele și alege tipul de acid hialuronic potrivit.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Injectarea</b><p>Se face după un plan personalizat, cu distribuție uniformă și adaptată formei buzelor tale.</p>${pB(/stylage/i) ? `<em>1 mL Stylage · ${lei(pB(/stylage/i))}</em>` : ''}${pB(/restylane/i) ? `<em>1 mL Restylane / Juvéderm · ${lei(pB(/restylane/i))}</em>` : ''}</li>
  <li><b>Îngrijirea de după</b><p>Pleci acasă cu sfaturi clare de îngrijire, care te ajută să păstrezi rezultatul.</p></li>
  <li><b>Monitorizarea</b><p>Medicul urmărește cum evoluează volumul și îți spune când are sens o ședință de întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre ${link('augmentare-buze', 'mărirea buzelor la MOA')}, <a href="/nou/de-ce-nu-imi-tine-acidul-hialuronic-2/">de ce nu ține uneori acidul hialuronic</a>, <a href="/nou/prima-injectare-cu-acid-hialuronic-in-buze/">prima injectare în buze</a> și <a href="/nou/russian-lips-vs-butterfly-lips/">tehnica Russian Lips</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Cât ține acidul hialuronic în buze depinde de produs, de tehnică și de tine. Cu o alegere atentă și puțină grijă după procedură, rezultatul se poate menține frumos în timp.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Augmentare buze">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de îngrijire bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-acid-hialuronic-buze-ingrijire', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Cât durează în medie efectul acidului hialuronic în buze, de ce diferă de la o persoană la alta și ce poți face ca rezultatul să se mențină mai mult. Cu o listă de îngrijire pe care o poți bifa.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 5,
  };
};
