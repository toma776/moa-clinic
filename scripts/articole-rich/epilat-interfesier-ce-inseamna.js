// Versiunea structurată a articolului „Epilat interfesier – ce înseamnă?”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la epilarea zonei interfesiere:
// răspunsul scurt → ce înseamnă → ce metode există → cum decurge ședința → pregătirea (listă bifabilă) → după ședință → când amâni → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const srvNume = 'Epilare definitivă Splendor X';
  const ep = serv['epilare-definitiva-bucuresti']?.preturi || [];
  const oferta = ep.find((p) => /interfesier/i.test(p.nume));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-inseamna', 'Ce înseamnă epilat interfesier'],
    ['metode', 'Metodele de epilare'],
    ['sedinta', 'Cum decurge ședința cu laser'],
    ['pregatire', 'Cum te pregătești'],
    ['dupa', 'După ședință'],
    ['cand-amani', 'Când amâni epilarea'],
    ['la-moa', 'Epilarea interfesieră la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce înseamnă epilat interfesier?', 'Înseamnă îndepărtarea părului dintre fese, pe linia chilotului tanga. Este o zonă sensibilă, iar mulți oameni aleg epilarea aici mai ales pentru confort și igienă.'],
    ['Doare epilarea interfesieră cu laser?', 'De obicei se tolerează bine. În timpul ședinței, un jet de aer rece răcește pielea și face procedura mai confortabilă, iar zona fiind mică, ședința e scurtă.'],
    ['Când se vede diferența?', 'Părul devine treptat mai rar și mai fin, de obicei chiar după primele ședințe. Numărul de ședințe se stabilește în funcție de piele și de păr.'],
    ['Pot să mă rad între ședințe?', 'Da, doar cu lama, cu 24–48 de ore înaintea următoarei ședințe, conform recomandării clinicii. Între ședințe nu smulge părul: evită penseta, epilatorul și ceara.'],
    ['Este normală roșeața după ședință?', 'Da. O roșeață ușoară, senzația de căldură sau furnicăturile trec de obicei în 24–48 de ore. Dacă roșeața, durerea sau umflătura persistă peste 72 de ore sau apar secreții ori febră, cere sfatul unui specialist.'],
    ['Există o vârstă minimă?', 'Da. Procedura se face doar persoanelor care au împlinit 18 ani.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Epilatul interfesier înseamnă <b>îndepărtarea părului dintre fese</b>, pe linia chilotului tanga. Îl aleg femei și bărbați, mai ales pentru confort.</li>
    <li>Ceara, lama și crema depilatoare au <b>efect de câteva zile până la 2–3 săptămâni</b> și pot irita o zonă deja sensibilă.</li>
    <li>Epilarea cu laser are <b>rezultate de lungă durată</b>; părul devine treptat mai rar și mai fin.</li>
    <li>Înainte de ședință: <b>fără ceară sau cremă depilatoare 4–6 săptămâni</b>, fără plajă sau solar 7–10 zile.</li>
    <li>Procedura se face <b>doar după 18 ani</b> și se amână în sarcină, cu infecții locale sau cu unele medicamente.</li>
  </ul>
</section>

<h2 id="ce-inseamna">Ce înseamnă epilat interfesier</h2>
<p class="ar-first">Poate ai văzut termenul „interfesier” pe o listă de prețuri și te-ai întrebat la ce zonă se referă. Este vorba despre șanțul dintre fese, o zonă mică, dar sensibilă, unde părul nedorit poate crea disconfort atât femeilor, cât și bărbaților.</p>
<p>Așa cum epilarea axilelor înseamnă îndepărtarea părului de sub brațe pentru confort și igienă, epilarea interfesieră aplică aceeași idee unei zone intime. Pentru că metodele obișnuite irită ușor pielea de aici, mulți oameni aleg epilarea cu laser.</p>

<h2 id="metode">Metodele de epilare interfesieră</h2>
<p>Fiecare metodă are avantaje și dezavantaje. Diferența principală este cât durează efectul și cât de mult irită pielea.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Ceară</small><b>Din rădăcină</b><dl><dt>Cât durează</dt><dd>aproximativ 2–3 săptămâni</dd><dt>Confort</dt><dd>dureroasă</dd><dt>Ce poate apărea</dt><dd>iritații sau foliculită</dd></dl></div>
  <div class="rx-col"><small>Lamă sau cremă depilatoare</small><b>La suprafață</b><dl><dt>Cât durează</dt><dd>lama 2–3 zile, crema aproximativ o săptămână</dd><dt>Confort</dt><dd>nedureroase</dd><dt>Ce poate apărea</dt><dd>lama irită des pielea; crema poate da reacții alergice</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Laser</small><b>Rezultate de lungă durată</b><dl><dt>Cât durează</dt><dd>părul devine treptat mai rar și mai fin</dd><dt>Confort</dt><dd>cu răcire cu aer rece</dd><dt>Ce poate apărea</dt><dd>roșeață ușoară, care trece de obicei în 24–48 h</dd></dl>${id('epilare-definitiva-bucuresti') ? `<a class="link-u" href="${esc(live('epilare-definitiva-bucuresti'))}">Despre epilarea cu laser Splendor X →</a>` : ''}</div>
</div>
<aside class="rx-note"><b>Despre laserul Splendor X</b><p>La MOA, epilarea se face cu sistemul Splendor X, care combină două lungimi de undă: Alexandrite (755 nm) și Nd:YAG (1064 nm). Parametrii se ajustează după nuanța pielii, culoarea și densitatea părului. Numărul de ședințe și rezultatul diferă de la o persoană la alta.</p></aside>

<h2 id="sedinta">Cum decurge ședința cu laser</h2>
<p>Ședința este scurtă, pentru că zona este mică. Specialistul are grijă să te simți cât mai relaxat(ă) pe tot parcursul ei.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Poziționarea</b><p>Îți scoți lenjeria intimă, te întinzi pe burtă și îți separi fesele, ca zona să fie accesibilă.</p></div>
  <div class="rx-card"><i>02</i><b>Tratamentul</b><p>Specialistul ține într-o mână aparatul, iar în cealaltă jetul de aer rece, care face procedura mai confortabilă.</p></div>
  <div class="rx-card"><i>03</i><b>Rezultatul</b><p>Părul devine treptat mai rar și mai fin, de obicei chiar după primele ședințe.</p></div>
</div>

<h2 id="pregatire">Cum te pregătești pentru ședință</h2>
<p>Bifează pe rând ce ai pregătit. Lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>
  <li><label><input type="checkbox"> Au trecut 4–6 săptămâni de când ai folosit ceară sau cremă depilatoare</label></li>
  <li><label><input type="checkbox"> Au trecut 7–10 zile de la plajă sau solar</label></li>
  <li><label><input type="checkbox"> Dacă e nevoie, te-ai ras doar cu lama, cu 24–48 de ore înainte</label></li>
  <li><label><input type="checkbox"> Nu ai aplicat deodorant pe zona tratată</label></li>
  <li><label><input type="checkbox"> Ai notat medicamentele pe care le iei, ca să le spui medicului</label></li>
  <li><label><input type="checkbox"> Igiena zonei este făcută în ziua ședinței</label></li>
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="dupa">După ședință</h2>
<p>Zona interfesieră este mai sensibilă decât alte zone și expusă frecării, așa că îngrijirea de după ședință contează.</p>
<div class="rx-two">
  <div><h3>În primele zile</h3><ul><li>primele 6 ore: fără dușuri fierbinți, creme, parfum sau deodorant cu alcool</li><li>primele 24 de ore: fără saună, masaj sau antrenament</li><li>lenjerie lejeră, din bumbac, cel puțin 48 de ore</li><li>fără exfoliere 48–72 de ore</li><li>prima săptămână: protejează zona dacă stai mult la soare</li></ul></div>
  <div><h3>Dacă apare iritație</h3><ul><li>compresă rece 5–10 minute, imediat după tratament</li><li>gel calmant, de exemplu cu aloe vera, sau produsul recomandat de clinică</li><li>spălare zilnică cu apă călduță și un gel intim blând</li><li>cremă hipoalergenică, fără parfum, seara, 5–7 zile</li><li>fără soare sau solar 1–2 săptămâni; apoi SPF 50, dacă zona e expusă</li></ul></div>
</div>
<div class="rx-alert"><b>Cere sfatul unui specialist dacă</b> roșeața, durerea sau umflătura persistă peste 72 de ore, ori dacă apar secreții sau febră.</div>

<h2 id="cand-amani">Când amâni epilarea interfesieră</h2>
<ul class="rx-chips rx-chips-neg"><li>infecții sau răni în zonă</li><li>herpes, eczemă, dermatită</li><li>foliculită severă</li><li>bronz proaspăt sau arsuri solare</li><li>peeling sau microdermabraziune în ultimele 2–4 săptămâni</li><li>sarcină sau alăptare</li></ul>
<p>Discută întâi cu medicul dacă iei medicamente care cresc sensibilitatea la lumină (unele antibiotice, isotretinoin în ultimele 6–12 luni), dacă ai tulburări de coagulare sau o boală autoimună activă, ori dacă ești alergic(ă) la produsele recomandate după tratament.</p>

<h2 id="la-moa">Epilarea interfesieră la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Discuția inițială</b><p>Vorbim despre istoricul tău medical: afecțiuni, medicamente, expunere la soare. Pe baza lor se stabilesc parametrii și planul de ședințe.</p></li>
  <li><b>Ședința</b><p>Specialistul instruit pentru lucrul cu laserul tratează zona cu Splendor X, cu răcire cu aer rece.</p>${oferta ? `<em>${esc(oferta.nume.replace(/^OFERTĂ\s*/i, 'Ofertă: '))} · ${lei(oferta.valoare)}</em>` : ''}</li>
  <li><b>Îngrijirea de după</b><p>Primești recomandările pentru primele zile și pentru perioada dintre ședințe.</p></li>
  <li><b>Ședințele următoare</b><p>Se programează la intervalele recomandate, iar specialistul urmărește cum răspunde părul și ajustează parametrii.</p></li>
</ol>
<p class="rx-links">Vezi mai multe despre ${link('epilare-definitiva-bucuresti', 'epilarea cu laser Splendor X')}, citește <a href="/nou/epilare-definitiva-pareri/">părerile despre epilarea cu laser</a> sau consultă <a href="/nou/preturi/">lista de prețuri</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Epilarea interfesieră cu laser te poate scuti de iritațiile și firele crescute sub piele pe care le lasă metodele temporare. Primul pas este o discuție despre pielea ta și despre ce tratamente urmezi.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srvNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de pregătire bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-epilat-interfesier-pregatire', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce înseamnă epilatul interfesier, cum se compară metodele de epilare și cum decurge o ședință cu laser. Cu o listă de pregătire pe care o poți bifa și recomandările pentru după ședință.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
