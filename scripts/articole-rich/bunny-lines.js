// Versiunea structurată a articolului „Bunny lines: ce sunt și cum le poți estompa”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care și-a observat liniile de pe nas:
// răspunsul scurt → ce sunt → de ce apar → ce opțiuni are → după tratament (listă bifabilă) → când apar rezultatele → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => (id(sid) ? minPrice(sid) : null);
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt bunny lines'],
    ['cauze', 'De ce apar'],
    ['tratamente', 'Cum se tratează'],
    ['dupa', 'După tratament'],
    ['rezultate', 'Când apar rezultatele'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce sunt bunny lines?', 'Sunt liniile fine care apar pe părțile laterale ale nasului când zâmbești, te încrunți sau îți strângi nasul. Numele vine de la pliurile pe care le face botul unui iepure când adulmecă.'],
    ['Cât rezistă efectul toxinei botulinice pe bunny lines?', 'Rezultatele devin vizibile, de obicei, în 3–5 zile și se pot menține până la aproximativ 6 luni. Durata diferă de la o persoană la alta.'],
    ['Tratamentul îmi schimbă expresia feței?', 'Scopul este ca liniile să se estompeze, iar expresiile să rămână naturale. Medicul alege doza și punctele de injectare astfel încât fața să își păstreze echilibrul.'],
    ['Pot estompa bunny lines fără injecții?', 'Da, există opțiuni fără injectabile, cum sunt microneedling-ul sau tratamentele cu laser, care stimulează producția de colagen. Exercițiile faciale și masajul pot susține tonusul pielii și pot ajuta la prevenirea ridurilor noi.'],
    ['Pot să mă machiez după tratament?', 'Evită machiajul imediat după procedură, mai ales dacă pielea este ușor roșie sau sensibilă. Urmează indicațiile primite de la medic.'],
    ['Cum pot preveni bunny lines?', 'Protecția solară zilnică, renunțarea la fumat și hidratarea ajută, pentru că soarele, fumatul și deshidratarea pot accelera apariția ridurilor.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Bunny lines sunt <b>liniile fine de pe părțile laterale ale nasului</b>, care apar când zâmbești, te încrunți sau îți strângi nasul.</li>
    <li>Apar din cauza <b>expresiilor repetate</b>, a <b>scăderii colagenului și elastinei</b> și a obiceiurilor: soare fără protecție, fumat, hidratare insuficientă.</li>
    <li>Opțiunile includ <b>toxina botulinică</b>, <b>acidul hialuronic</b>, <b>mezoterapia</b>, <b>microneedling-ul</b> și tratamentele cu laser. Medicul alege după tipul pielii și cât de adânci sunt liniile.</li>
    <li>Cu toxina botulinică, rezultatele apar de obicei în <b>3–5 zile</b> și se pot menține <b>până la aproximativ 6 luni</b>.</li>
    <li>După tratament: <b>nu atinge zona 24–48 de ore</b>, evită sportul intens, căldura și soarele în primele zile.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt bunny lines</h2>
<p class="ar-first">Timpul își lasă urmele pe chip în locuri la care nu te gândești, inclusiv pe nas. Nu îl putem opri, dar putem încerca să întârziem sau să estompăm ridurile care apar odată cu anii. Astăzi vorbim doar despre ridurile de pe nas, numite și „bunny lines” sau riduri de iepuraș.</p>
<p>Sunt liniile fine care se formează pe părțile laterale ale nasului când zâmbești, te încrunți sau îți strângi ușor nasul. Numele vine de la pliurile pe care le face botul unui iepure când adulmecă. Sunt mici, dar <b>pot deveni vizibile și când fața este relaxată</b>, mai ales odată cu trecerea anilor, și pot da chipului un aspect obosit sau tensionat.</p>

<h2 id="cauze">De ce apar ridurile de iepuraș</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Expresiile repetate</b><p>Râsul, zâmbetul sau încrețirea nasului solicită zilnic mușchii din jurul nasului. În timp, mișcarea repetată duce la apariția liniilor, mai ales la persoanele foarte expresive.</p></div>
  <div class="rx-card"><i>02</i><b>Mai puțin colagen și elastină</b><p>Cu anii, pielea devine mai subțire și mai puțin fermă, iar liniile fine se accentuează și rămân vizibile chiar și când nu zâmbești.</p></div>
  <div class="rx-card"><i>03</i><b>Obiceiurile zilnice</b><p>Soarele fără protecție, fumatul și hidratarea insuficientă pot accelera apariția ridurilor. De aceea, prevenția contează la fel de mult ca tratamentul.</p></div>
</div>

<h2 id="tratamente">Cum se tratează ridurile de iepuraș</h2>
<p>Scopul este ca pielea să arate mai netedă, fără ca fața să își piardă expresivitatea. Opțiunile diferă prin felul în care acționează:</p>
<div class="rx-compare">
  <div class="rx-col rx-col-on"><small>Toxină botulinică</small><b>Relaxează mușchii</b><dl><dt>Cum acționează</dt><dd>diminuează contracțiile mușchilor care formează liniile de pe nas</dd><dt>Când se vede efectul</dt><dd>de obicei în 3–5 zile</dd><dt>Cât durează</dt><dd>până la aproximativ 6 luni</dd></dl>${id('injectare-botox') ? `<a class="link-u" href="${esc(live('injectare-botox'))}">Despre injectarea cu toxină botulinică →</a>` : ''}</div>
  <div class="rx-col"><small>Acid hialuronic</small><b>Umple liniile fine</b><dl><dt>Cum acționează</dt><dd>redă volum și netezime zonei, fără să rigidizeze expresiile</dd><dt>Când se vede efectul</dt><dd>aproape imediat; aspectul final, după 1–2 săptămâni</dd><dt>Potrivit pentru</dt><dd>riduri fine vizibile și în repaus</dd></dl>${id('injectari-acid-hialuronic') ? `<a class="link-u" href="${esc(live('injectari-acid-hialuronic'))}">Despre acidul hialuronic →</a>` : ''}</div>
  <div class="rx-col"><small>Mezoterapie și microneedling</small><b>Stimulează regenerarea</b><dl><dt>Cum acționează</dt><dd>hidratează și revitalizează pielea; microneedling-ul activează producția de colagen și elastină</dd><dt>Când se vede efectul</dt><dd>progresiv</dd><dt>Potrivit pentru</dt><dd>linii fine, fără volum suplimentar</dd></dl></div>
</div>
<p><b>Tratamentele cu laser</b> sunt o variantă non-invazivă, care îmbunătățește textura pielii și stimulează colagenul. Se pot combina cu tratamente injectabile. Dacă preferi soluțiile naturale, <b>exercițiile faciale și masajul zilnic</b>, cu mișcări ușoare și o cremă hidratantă, susțin tonusul pielii și pot ajuta la prevenirea ridurilor noi.</p>

<h2 id="dupa">Ce faci după tratament</h2>
<p>După orice tratament estetic (injectabile, mezoterapie, microneedling), pielea este mai sensibilă. Bifează pe rând ce ai de urmărit; lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>
  <li><label><input type="checkbox"> Nu atinge, nu masa și nu freca zona 24–48 de ore</label></li>
  <li><label><input type="checkbox"> Evită machiajul imediat după procedură</label></li>
  <li><label><input type="checkbox"> Evită sportul solicitant și transpirația abundentă 1–2 zile</label></li>
  <li><label><input type="checkbox"> Evită sauna, băile fierbinți, solarul și soarele direct în primele zile</label></li>
  <li><label><input type="checkbox"> Folosește cremă cu SPF 30+ când ieși afară</label></li>
  <li><label><input type="checkbox"> Urmează întocmai indicațiile primite de la medic</label></li>
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>
<div class="rx-alert"><b>Aceste reguli previn iritațiile, infecțiile și deplasarea produsului injectat.</b> Dacă disconfortul nu trece sau ai nelămuriri după procedură, sună la clinică.</div>

<h2 id="rezultate">Când apar rezultatele</h2>
<p>Rezultatele diferă în funcție de tratament și de particularitățile pielii tale:</p>
<ul>
  <li><b>Toxina botulinică:</b> efectul apare de obicei în 3–5 zile.</li>
  <li><b>Acidul hialuronic:</b> efectul este aproape imediat, dar aspectul final se stabilizează după 1–2 săptămâni.</li>
  <li><b>Mezoterapia și microneedling-ul:</b> rezultatele apar progresiv.</li>
</ul>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rezultatele pot varia în funcție de vârstă, tipul de piele și stilul de viață. Bunny lines fac parte din expresivitatea feței; tratamentul urmărește să le estompeze, nu să schimbe felul în care zâmbești.</p></aside>

<h2 id="la-moa">Tratamentul pentru bunny lines la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul evaluează liniile, tipul pielii și structura feței și îți recomandă opțiunea potrivită.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Injectarea cu toxină botulinică durează doar câteva minute și nu necesită recuperare. Celelalte tratamente se adaptează tipului tău de piele.</p>${pret('injectare-botox') ? `<em>Toxină botulinică · de la ${lei(pret('injectare-botox'))}</em>` : ''}</li>
  <li><b>După procedură</b><p>Primești indicațiile de îngrijire și urmezi lista de mai sus în primele zile.</p></li>
  <li><b>Reevaluarea</b><p>Medicul verifică rezultatul și discută cu tine când are sens repetarea tratamentului.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>, <a href="/nou/unde-se-pune-botox/">unde se pune botox</a> și <a href="/nou/recomandari-dupa-botox/">recomandările după botox</a>, sau vezi pagina despre ${link('microneedeling', 'microneedling-ul cu Dermapen')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Bunny lines pot părea un detaliu, dar pentru multe persoane sunt un semn vizibil al trecerii timpului. Tratamentele se adaptează tipului de piele, cu un scop clar: să păstreze frumusețea naturală, nu să o transforme.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de îngrijire după tratament, bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-bunny-lines-dupa', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce sunt ridurile de iepuraș de pe nas, de ce apar, ce opțiuni de tratament ai și cum îngrijești zona după procedură, cu o listă pe care o poți bifa.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 6,
  };
};
