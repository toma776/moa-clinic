// Versiunea structurată a articolului „Pori dilatați – cauze și soluții pentru un ten neted”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care își vede porii în oglindă:
// răspunsul scurt → ce sunt → de ce se văd (pe tip de ten, factori externi) → ce ajută acasă → tratamente → rutina bifabilă → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt porii dilatați'],
    ['cauze', 'De ce devin vizibili'],
    ['acasa', 'Ce ajută acasă'],
    ['tratamente', 'Tratamente în clinică'],
    ['rutina', 'Rutina ta, de bifat'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Pot face porii să dispară complet?', 'Nu, și nici nu e de dorit. Porii au un rol important: prin ei ajunge sebumul la suprafață, ca să protejeze și să hidrateze pielea. Dimensiunea lor ține în mare parte de genetică, dar aspectul lor poate fi îmbunătățit când sunt curați, iar pielea din jur este fermă.'],
    ['Se deschid și se închid porii cu apă caldă sau rece?', 'Porii nu au mușchi, deci nu se deschid și nu se închid ca o ușă. Aburul înmoaie dopurile de sebum și ușurează curățarea, iar clătirea cu apă rece calmează pielea.'],
    ['Am tenul uscat. De ce îmi văd porii?', 'La tenul uscat, porii devin vizibili din lipsă de elasticitate: pielea deshidratată devine rigidă, iar deschiderile par mai proeminente. Hidratarea este, în acest caz, la fel de importantă ca și curățarea.'],
    ['Cât de des să mă exfoliez?', 'De 1–2 ori pe săptămână este suficient. Exfolierea excesivă poate afecta bariera pielii, care răspunde producând și mai mult sebum.'],
    ['Pot folosi retinol dacă sunt însărcinată?', 'Nu. Retinolul este contraindicat în sarcină și alăptare. Medicul îți poate recomanda alternative mai blânde.'],
    ['Ce tratament în clinică ajută la porii dilatați?', 'Depinde de cauză. Microneedlingul cu Dermapen lucrează asupra texturii și fermității pielii, Dermalinfusion asupra curățării și excesului de sebum, iar peelingurile enzimatice asupra exfolierii blânde. Medicul alege după evaluarea tenului.'],
  ];

  const rutina = [
    'Curăț fața dimineața și seara, cu apă călduță și mișcări blânde',
    'Folosesc produse marcate „non-comedogenic” sau „oil-free”',
    'Îmi demachiez fața în fiecare seară, înainte de culcare',
    'Aplic zilnic cremă cu protecție solară',
    'Mă exfoliez de 1–2 ori pe săptămână, nu mai des',
    'Schimb des fața de pernă',
    'Spăl pensulele și burețeii de machiaj în fiecare săptămână',
    'Beau apă pe parcursul zilei și dorm 7–9 ore',
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Porii nu pot și nici nu trebuie să dispară: prin ei <b>ajunge sebumul la suprafață</b>, ca să protejeze pielea. Le poți însă <b>rafina aspectul</b>.</li>
    <li>Devin vizibili din cauza <b>sebumului în exces, geneticii, vârstei</b> și a stilului de viață, iar poluarea, machiajul nepotrivit și soarele îi accentuează.</li>
    <li>Acasă contează <b>curățarea de două ori pe zi, produsele non-comedogenice, exfolierea moderată și protecția solară</b>.</li>
    <li>În clinică, <b>microneedlingul cu Dermapen, Dermalinfusion și peelingurile enzimatice</b> lucrează asupra texturii și a sebumului.</li>
    <li>Tratamentul potrivit se alege <b>după evaluarea tenului</b>, pentru că fiecare tip de piele are alte motive pentru porii vizibili.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt porii dilatați</h2>
<p class="ar-first">Te-ai privit vreodată în oglindă, sub o lumină puternică, și ai simțit că porii sunt singurul lucru pe care îl vezi? Nu ești singur(ă). Porii dilatați sunt una dintre cele mai comune griji estetice, la femei și la bărbați, indiferent dacă tenul este gras, mixt sau chiar uscat.</p>
<p>Porii sunt mici canale între interiorul și exteriorul pielii. Prin ei, sebumul natural ajunge la suprafață ca să protejeze și să hidrateze tenul. Problema apare când devin prea vizibili. Scopul nu este să îi „ștergi”, ci să rafinezi textura pielii și să îi menții <b>curați și elastici</b>.</p>
<div class="rx-why">
  <span class="rx-why-h">Cum recunoști porii dilatați</span>
  <ul class="rx-chips"><li>aspect de „coajă de portocală”</li><li>pielea nu mai pare fină la atingere</li><li>luciu în zona T (frunte, nas, bărbie)</li></ul>
</div>

<h2 id="cauze">De ce devin vizibili</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Sebumul în exces</b><p>Când glandele sebacee produc prea mult, sebumul se amestecă cu celulele moarte și impuritățile și formează un „dop”, care forțează porul să se extindă.</p></div>
  <div class="rx-card"><i>02</i><b>Genetica și vârsta</b><p>Dimensiunea porilor se moștenește. Cu vârsta, scade producția de colagen și elastină, pereții porilor slăbesc și par mai largi și mai alungiți.</p></div>
  <div class="rx-card"><i>03</i><b>Stilul de viață</b><p>Zahărul în exces poate întreține procese inflamatorii care afectează colagenul. Somnul puțin și hidratarea insuficientă lasă tenul tern, iar porii se văd mai ușor.</p></div>
</div>
<div class="rx-compare">
  <div class="rx-col"><small>Ten gras și mixt</small><b>Glande sebacee foarte active</b><dl><dt>De ce se văd porii</dt><dd>transportă constant mult sebum și se blochează mai repede, mai ales în zona T</dd><dt>Ce ajută</dt><dd>curățare corectă, produse non-comedogenice</dd></dl></div>
  <div class="rx-col"><small>Ten uscat</small><b>Lipsă de elasticitate</b><dl><dt>De ce se văd porii</dt><dd>pielea deshidratată devine rigidă, iar deschiderile par mai proeminente</dd><dt>Ce ajută</dt><dd>hidratare, curățare blândă</dd></dl></div>
  <div class="rx-col"><small>Ten sensibil</small><b>Inflamație frecventă</b><dl><dt>De ce se văd porii</dt><dd>țesutul din jur se umflă ușor, iar porii par mai adânci decât sunt</dd><dt>Ce ajută</dt><dd>produse blânde, fără agresiune</dd></dl></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Ce îi accentuează din exterior</span>
  <ul class="rx-chips rx-chips-neg"><li>poluarea și praful</li><li>machiajul dens sau nedemachiat</li><li>căldura și umiditatea</li><li>tonicele cu alcool și scrubul abraziv</li><li>razele UVA</li></ul>
</div>

<h2 id="acasa">Ce ajută acasă</h2>
<p>Dimensiunea genetică a porilor nu se schimbă, dar aspectul lor da: când sunt curați, iar pielea din jur e fermă, par mai mici.</p>
<div class="rx-two">
  <div><h3>Ingrediente utile</h3><ul><li><b>Produse „oil-free”, „non-comedogenic”</b>, care nu înfundă porii. Este și recomandarea Asociației Americane de Dermatologie.</li><li><b>Retinolul</b> susține regenerarea celulară și rafinarea texturii. Dacă îți irită pielea, aplică-l la 30–60 de minute după spălare. Nu se folosește în sarcină și alăptare.</li><li><b>Acidul salicilic (BHA)</b> se dizolvă în sebum, desface „dopurile” din pori și calmează roșeața.</li></ul></div>
  <div><h3>Obiceiuri</h3><ul><li>Curățare de două ori pe zi, cu apă călduță și vârful degetelor, fără frecare.</li><li>Exfoliere de 1–2 ori pe săptămână; mai des poate crește producția de sebum.</li><li>Protecție solară zilnic: soarele degradează colagenul care ține porii „strânși”.</li><li>O dată pe săptămână, 5 minute de abur cald (nu fierbinte), apoi clătire cu apă rece.</li><li>Somn de 7–9 ore, mai puțin zahăr rafinat și alimente ultraprocesate, mai multe legume verzi, fructe de pădure și nuci.</li></ul></div>
</div>

<h2 id="tratamente">Tratamente în clinică</h2>
<p>Când rutina de acasă nu mai este suficientă, procedurile din clinică pot lucra acolo unde produsele cosmetice nu ajung: asupra texturii, a sebumului și a regenerării pielii.</p>
<div class="rx-compare">
  <div class="rx-col rx-col-on"><small>Microneedling Dermapen</small><b>Textură și fermitate</b><dl><dt>Ce face</dt><dd>microneedling controlat, care stimulează regenerarea pielii și producția de colagen</dd><dt>Pentru</dt><dd>textură neuniformă, piele mai puțin fermă</dd></dl>${id('microneedeling') ? `<a class="link-u" href="${esc(live('microneedeling'))}">Despre microneedling${pret('microneedeling') ? ` · de la ${lei(pret('microneedeling'))}` : ''} →</a>` : ''}</div>
  <div class="rx-col rx-col-on"><small>Dermalinfusion</small><b>Curățare și sebum</b><dl><dt>Ce face</dt><dd>exfoliază, extrage sebumul în exces și decongestionează porii</dd><dt>Pentru</dt><dd>pori încărcați, ten gras sau mixt</dd></dl>${id('dermalinfusion') ? `<a class="link-u" href="${esc(live('dermalinfusion'))}">Despre Dermalinfusion${pret('dermalinfusion') ? ` · de la ${lei(pret('dermalinfusion'))}` : ''} →</a>` : ''}</div>
  <div class="rx-col"><small>Peeling enzimatic</small><b>Exfoliere blândă</b><dl><dt>Ce face</dt><dd>îndepărtează celulele moarte și reduce încărcarea porilor, fără să agreseze pielea</dd><dt>Pentru</dt><dd>inclusiv pielea sensibilă</dd></dl></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Niciun tratament nu schimbă dimensiunea genetică a porilor. Procedurile pot face însă pielea mai fermă, mai curată și mai uniformă, iar porii pot deveni mai discreți. Cât de mult diferă de la un ten la altul, iar rezultatele se mențin mai bine cu o rutină constantă acasă.</p></aside>

<h2 id="rutina">Rutina ta, de bifat</h2>
<p>Bifează ce faci deja. Lista rămâne salvată în browserul tău, ca să vezi ce mai ai de schimbat.</p>
<ul class="rx-todo" data-todo>
${rutina.map((r) => `  <li><label><input type="checkbox"> ${esc(r)}</label></li>`).join('\n')}
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="la-moa">Tratamentul porilor dilatați la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Evaluarea tenului</b><p>Medicul identifică tipul de ten și motivele pentru care porii sunt vizibili: sebum, deshidratare, pierderea fermității sau inflamație.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Alegerea procedurii</b><p>În funcție de cauză, medicul recomandă microneedling, Dermalinfusion, un peeling enzimatic sau o combinație.</p>${pret('dermalinfusion') ? `<em>Dermalinfusion · de la ${lei(pret('dermalinfusion'))}</em>` : ''}${pret('microneedeling') ? `<em>Microneedling Dermapen · de la ${lei(pret('microneedeling'))}</em>` : ''}</li>
  <li><b>Îngrijirea acasă</b><p>Primești recomandări pentru rutina zilnică, adaptate tipului tău de ten.</p></li>
  <li><b>Reevaluarea</b><p>La control, medicul vede cum a răspuns pielea și dacă merită continuat sau ajustat planul.</p></li>
</ol>
<p class="rx-links">Citește și <a href="/nou/recuperare-dupa-dermapen/">ce faci în zilele de după Dermapen</a> sau vezi ${link('microneedeling', 'microneedlingul cu Dermapen')}, ${link('dermalinfusion', 'tratamentul Dermalinfusion')} și ${link('consultatie-dermatoestetica-dermatologie', 'consultația de dermatoestetică')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Porii dilatați nu pot fi șterși, dar aspectul lor se poate îmbunătăți prin echilibru: o rutină constantă acasă, un stil de viață sănătos și, când e nevoie, tratamente alese de medic pentru tenul tău.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: rutina de îngrijire bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-pori-dilatati-rutina', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'De ce devin porii vizibili, cum diferă lucrurile de la un tip de ten la altul și ce poți face acasă și în clinică. Cu o rutină de bifat și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
