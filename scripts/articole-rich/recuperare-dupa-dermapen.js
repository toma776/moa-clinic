// Versiunea structurată a articolului „Recuperare după Dermapen – ce trebuie să știi”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care tocmai a făcut (sau urmează să facă) Dermapen:
// răspunsul scurt → ce e normal → primele ore → ce eviți → cât durează, pe tip de ten → lista bifabilă → pașii la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const pN = (sid, re) => (serv[sid]?.preturi || []).find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const srv = 'Microneedling Dermapen 4';
  const pFata = pN('microneedeling', /^Microneedling Dermapen față$/i);
  const pCocktail = pN('microneedeling', /cocktail.*față$/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-e-normal', 'Ce e normal după Dermapen'],
    ['primele-ore', 'Primele ore'],
    ['ingrijire', 'Hidratare și protecție solară'],
    ['de-evitat', 'Ce eviți'],
    ['cat-dureaza', 'Cât durează recuperarea'],
    ['lista', 'Lista ta pentru recuperare'],
    ['la-moa', 'Dermapen la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cât durează roșeața după Dermapen?', 'Depinde de ten. Orientativ, la tenul normal sau mixt roșeața ușoară trece de regulă în 24–72 de ore, iar la tenul sensibil poate dura 3–4 zile. Tenul gras, acneic sau matur se poate calma ceva mai lent.'],
    ['Când pot să mă machiez?', 'Este recomandat să aștepți cel puțin 24–48 de ore. Reia machiajul treptat, cu produse non-comedogenice și blânde. Medicul îți spune momentul potrivit, în funcție de reacția pielii tale.'],
    ['Când pot merge la muncă?', 'Majoritatea oamenilor își reiau activitățile obișnuite chiar din ziua următoare, cu câteva măsuri de protecție. Sportul intens, soarele și procedurile cosmetice agresive se amână câteva zile.'],
    ['Este normal să mi se cojească pielea?', 'Da. Descuamările fine și senzația de piele uscată sau ușor strânsă sunt normale și arată că pielea se reînnoiește. Nu îndepărta cojile; lasă-le să cadă singure.'],
    ['Când pot folosi din nou retinol sau acizi exfolianți?', 'Evită-le cel puțin 2 săptămâni, la fel ca vitamina C în concentrații ridicate, scrubul și măștile exfoliante. Reia-le doar când pielea s-a refăcut și cu acordul medicului.'],
    ['De ce contează atât protecția solară?', 'După Dermapen, pielea este mult mai vulnerabilă la radiațiile UV. Expunerea necontrolată poate duce la pete pigmentare sau iritații persistente.'],
  ];

  const lista = [
    'Nu îmi spăl fața în primele ore, conform indicațiilor',
    'Nu îmi ating fața cu mâinile nespălate',
    'Aplic doar crema calmantă recomandată de medic',
    'Mă hidratez de mai multe ori pe zi, dacă pielea o cere',
    'Pun zilnic protecție solară recomandată de medic',
    'Evit soarele direct, solarul și plaja 7–10 zile',
    'Fără machiaj cel puțin 24–48 de ore',
    'Fără retinol, acizi exfolianți și scrub cel puțin 2 săptămâni',
    'Tamponez ușor cu prosopul, nu frec',
    'Nu smulg cojile și nu storc coșuri',
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Imediat după Dermapen, <b>roșeața, căldura și senzația de piele strânsă sunt normale</b>: pielea a intrat în procesul de reparare.</li>
    <li>La tenul normal sau mixt, recuperarea durează de regulă <b>24–72 de ore</b>; la tenul sensibil, gras sau matur poate dura câteva zile în plus.</li>
    <li>În primele zile contează <b>hidratarea blândă și protecția solară</b>; soarele direct se evită mai ales <b>7–10 zile</b>.</li>
    <li><b>Fără machiaj 24–48 de ore</b> și fără retinol, acizi sau scrub <b>cel puțin 2 săptămâni</b>.</li>
    <li>Poți reveni la activitățile obișnuite <b>de obicei din ziua următoare</b>. Regenerarea în profunzime continuă săptămâni.</li>
  </ul>
</section>

<h2 id="ce-e-normal">Ce e normal după Dermapen</h2>
<p class="ar-first">Ai făcut Dermapen pentru o piele mai netedă și mai luminoasă, iar imediat după procedură apar întrebările firești: cât ține roșeața, ce senzații sunt normale, când revii la rutina obișnuită. Răspunsurile contează, pentru că felul în care îți îngrijești pielea în primele zile influențează viteza vindecării și rezultatul final.</p>
<p>Tratamentul creează intenționat microleziuni controlate, care pornesc un proces natural de regenerare. În zilele următoare, schimbările de mai jos sunt așteptate:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Imediat după</b><p>Pielea este roșie, ușor inflamată, cu o senzație de căldură sau tensiune.</p></div>
  <div class="rx-card"><i>02</i><b>În zilele următoare</b><p>Roșeața scade treptat. Pielea poate părea uscată sau ușor strânsă și pot apărea descuamări fine, semn că se reînnoiește.</p></div>
  <div class="rx-card"><i>03</i><b>Pe măsură ce se vindecă</b><p>Tenul capătă un aspect mai uniform și mai luminos, iar stimularea colagenului continuă din interior timp de mai multe săptămâni.</p></div>
</div>

<h2 id="primele-ore">Primele ore după procedură</h2>
<p>În primele ore, pielea este mai sensibilă și mai receptivă decât de obicei. Câteva reguli simple te ajută să eviți iritațiile:</p>
<ul>
  <li>nu îți atinge fața cu mâinile neigienizate;</li>
  <li>nu aplica produse cosmetice care nu au fost recomandate de medic;</li>
  <li>nu îți spăla fața în primele ore, conform indicațiilor primite;</li>
  <li>evită efortul fizic intens, sauna și băile fierbinți.</li>
</ul>

<h2 id="ingrijire">Hidratare și protecție solară</h2>
<p>După Dermapen, bariera naturală a pielii este temporar slăbită. O piele hidratată corect se vindecă mai repede, se descuamează mai puțin și își recapătă mai repede aspectul uniform.</p>
<div class="rx-two">
  <div><h3>Hidratarea</h3><ul><li>creme și seruri calmante, cu acid hialuronic, pantenol sau ceramide</li><li>aplicate de mai multe ori pe zi, dacă e nevoie</li><li>fără alcool, parfum, retinol sau acizi exfolianți</li><li>fără exfoliere mecanică sau chimică până la refacerea pielii</li></ul></div>
  <div><h3>Protecția solară</h3><ul><li>fără soare direct, mai ales în primele 7–10 zile</li><li>zilnic, o cremă cu factor de protecție ridicat, recomandată de medic</li><li>pălărie sau accesorii care umbresc fața când ieși</li><li>fără solar și plajă până la vindecarea completă</li></ul></div>
</div>

<h2 id="de-evitat">Ce eviți după tratament</h2>
<p>Chiar dacă disconfortul trece repede, unele obiceiuri aparent banale pot încetini vindecarea sau pot afecta rezultatul.</p>
<div class="rx-why">
  <span class="rx-why-h">Produse de evitat cel puțin 2 săptămâni</span>
  <ul class="rx-chips rx-chips-neg"><li>alcool, parfum, mentol</li><li>retinol</li><li>acizi exfolianți (AHA, BHA)</li><li>vitamina C în concentrații ridicate</li><li>scrub și periaj facial</li><li>măști exfoliante</li></ul>
</div>
<div class="rx-two">
  <div><h3>Fără presiune pe piele</h3><ul><li>fără masaj facial sau tratamente cosmetice în primele zile</li><li>tamponează ușor cu prosopul, nu freca</li><li>evită să dormi cu fața apăsată în pernă</li><li>nu stoarce coșuri și nu îndepărta cojile</li></ul></div>
  <div><h3>Machiajul</h3><ul><li>evită-l cel puțin 24–48 de ore</li><li>fondul de ten, pudra și corectorul pot bloca porii și irita pielea</li><li>reia-l treptat, cu produse non-comedogenice și blânde</li></ul></div>
</div>
<div class="rx-alert"><b>Anunță medicul dacă</b> roșeața, usturimea sau umflătura se accentuează în zilele de după tratament în loc să scadă, sau dacă ai nelămuriri despre cum arată pielea.</div>

<h2 id="cat-dureaza">Cât durează recuperarea</h2>
<p>Durata diferă de la o persoană la alta și depinde de tipul de ten, de sensibilitatea pielii, de profunzimea tratamentului și de cât de atent respecți recomandările. Orientativ:</p>
<div class="rx-compare">
  <div class="rx-col"><small>Ten normal sau mixt</small><b>24–72 de ore</b><dl><dt>La ce să te aștepți</dt><dd>roșeață ușoară, disconfort minim</dd></dl></div>
  <div class="rx-col"><small>Ten sensibil</small><b>3–4 zile</b><dl><dt>La ce să te aștepți</dt><dd>roșeață mai intensă sau ușoară usturime</dd></dl></div>
  <div class="rx-col"><small>Ten gras, acneic sau matur</small><b>câteva zile în plus</b><dl><dt>La ce să te aștepți</dt><dd>calmare mai lentă; la tenul gras, textura și sebumul se pot regla treptat</dd></dl></div>
</div>
<p>Majoritatea oamenilor își reiau activitățile chiar din ziua următoare. Sportul intens, expunerea la soare și procedurile cosmetice agresive se amână câteva zile, după indicațiile medicului.</p>

<h2 id="lista">Lista ta pentru recuperare</h2>
<p>Bifează pe măsură ce le faci. Lista rămâne salvată în browserul tău în zilele de după tratament.</p>
<ul class="rx-todo" data-todo>
${lista.map((r) => `  <li><label><input type="checkbox"> ${esc(r)}</label></li>`).join('\n')}
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="la-moa">Dermapen la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul evaluează tipul de ten și sensibilitatea pielii și stabilește dacă Dermapen ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Microneedling cu Dermapen, simplu sau combinat cu substanțe nutritive, în funcție de ce urmărești.</p>${pFata ? `<em>Microneedling Dermapen față · ${lei(pFata)}</em>` : pret('microneedeling') ? `<em>de la ${lei(pret('microneedeling'))}</em>` : ''}${pCocktail ? `<em>Cu cocktail de substanțe nutritive, față · ${lei(pCocktail)}</em>` : ''}</li>
  <li><b>Protocolul de după</b><p>Primești recomandări adaptate tipului tău de piele: ce aplici, ce eviți și când poți reveni la machiaj și la rutina obișnuită.</p></li>
  <li><b>Reevaluarea</b><p>Medicul urmărește cum a răspuns pielea și discută cu tine dacă e nevoie de alte ședințe.</p></li>
</ol>
<p class="rx-links">Vezi pagina despre ${link('microneedeling', 'microneedlingul cu Dermapen')}, citește despre <a href="/nou/pori-dilatati/">porii dilatați</a> sau află cum se poate combina cu ${link('prp-scalp', 'terapia PRP')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Recuperarea după Dermapen face parte din rezultat. Pielea are nevoie de timp, hidratare și protecție ca să se refacă, iar fiecare ten reacționează în felul lui. Când ai întrebări, medicul te poate îndruma.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srv)}">Programează-te pentru Dermapen</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de recuperare bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-recuperare-dermapen-lista', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce e normal în zilele de după Dermapen, ce eviți și cât durează recuperarea în funcție de tipul de ten. Cu o listă de bifat pentru acasă și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
