// Versiunea structurată a articolului „Riduri de expresie: cauze, prevenție și tratamente”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care își vede primele linii în oglindă:
// răspunsul scurt → ce sunt (dinamice vs statice) → pe zone (file) → cauze → rutina de acasă → tratamente la MOA → întrebări.
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
    ['ce-sunt', 'Ce sunt ridurile de expresie'],
    ['zone', 'Pe zone: frunte, ochi, gură'],
    ['cauze', 'Ce le cauzează'],
    ['acasa', 'Prevenția de acasă'],
    ['tratamente', 'Tratamente profesionale'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['La ce vârstă apar ridurile de expresie?', 'Pot apărea chiar de la 25–30 de ani, mai ales dacă ai o mimică activă, te încrunți des, ridici frecvent sprâncenele, dormi pe o parte sau nu folosești protecție solară. Nu e un semn de îmbătrânire prematură, ci o reacție firească a pielii la obiceiurile faciale.'],
    ['Care e diferența dintre ridurile dinamice și cele statice?', 'Ridurile dinamice apar doar când mușchii se contractă și dispar când fața se relaxează. Pe măsură ce pielea pierde colagen și elasticitate, ele se fixează și rămân vizibile și în repaus: devin statice.'],
    ['Pot scăpa de riduri doar cu creme?', 'În fazele de început, hidratarea, protecția solară și cremele cu retinol sau peptide pot face liniile mai puțin vizibile și pot încetini adâncirea lor. Când cutele sunt mai adânci, cremele rămân un sprijin, iar medicul îți poate recomanda un tratament profesional.'],
    ['Botoxul îmi va bloca expresia?', 'Scopul este relaxarea mușchilor care formează ridurile, nu blocarea mimicii. Doza și punctele de injectare se stabilesc la consult, astfel încât fața să rămână expresivă.'],
    ['Ce tratament mi se potrivește?', 'Depinde de zonă și de tipul ridului: botoxul relaxează mușchii implicați în mimică, acidul hialuronic umple liniile adânci, iar mezoterapia, polinucleotidele sau Sculptra susțin regenerarea pielii. Planul se face la consult, după evaluarea feței.'],
  ];

  const zone = [
    ['Frunte', 'Ridurile orizontale apar când ridici sprâncenele, iar cele verticale dintre sprâncene (numite „riduri 11” sau „linii de leu”) apar din încruntare. Se pot forma devreme, la persoanele cu mimică activă.', `În fazele incipiente ajută hidratarea și cremele cu retinol sau peptide. Când cutele sunt adânci, ${link('injectare-botox', 'toxina botulinică')} poate relaxa mușchii responsabili, fără să blocheze expresivitatea.`],
    ['Ochi', '„Laba gâștei” apare când zâmbești, râzi sau strângi ochii din cauza luminii. Pielea de aici e subțire, se deshidratează ușor și își pierde repede elasticitatea.', `Îngrijirea începe devreme, cu cremă pentru conturul ochilor și protecție solară zilnică. Pentru liniile persistente, medicul poate recomanda ${link('microneedeling', 'microneedling')}, ${link('polinucleotide', 'polinucleotide')} sau botox aplicat precis.`],
    ['Gură', 'Liniile verticale de deasupra buzei superioare apar din vorbit, râs, mestecat sau folosirea paiului, nu doar la fumători. Tot aici se formează cutele nazolabiale, legate și de pierderea volumului din obraji.', `${link('injectari-acid-hialuronic', 'Acidul hialuronic')}, ${link('skinbooster-vital', 'skinboosterul')} sau ${link('mezoterapie', 'mezoterapia')} pot reda hidratarea și suplețea zonei, fără să schimbe forma buzelor.`],
    ['Zâmbet și încruntare', 'Pot da impresia unui chip obosit, tensionat sau trist, chiar când te simți bine. Ridurile de încruntare se accentuează cu stresul; cele de la zâmbet marchează zonele laterale ale gurii.', 'De obicei se combină: botox pentru mușchii implicați în încruntare, acid hialuronic pentru liniile adânci și mezoterapie sau polinucleotide pentru regenerarea pielii.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile de expresie apar din <b>contracția repetată a mușchilor feței</b>, pe o piele care, în timp, își pierde colagenul și elasticitatea.</li>
    <li>La început sunt <b>dinamice</b> (se văd doar la mișcare), apoi pot deveni <b>statice</b>, vizibile și în repaus.</li>
    <li>Apar mai ales pe <b>frunte, în jurul ochilor și al gurii</b>, uneori de la 25–30 de ani.</li>
    <li>Le accentuează <b>soarele, fumatul, stresul, somnul puțin</b> și alimentația dezechilibrată.</li>
    <li>Prevenția începe acasă (curățare, hidratare, SPF); pentru liniile fixate, medicul poate recomanda <b>botox, acid hialuronic sau tratamente de regenerare</b>.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile de expresie</h2>
<p class="ar-first">Poate ai observat deja în oglindă câteva linii fine care nu mai dispar la fel de ușor ca înainte. Apar dimineața, în jurul ochilor, sau se adâncesc seara, când fața e obosită. Sunt urmele expresiilor repetate: zâmbete, încruntări, surprindere, concentrare.</p>
<p>De fiecare dată când zâmbești sau ridici sprâncenele, mușchii feței se contractă în același fel, iar pielea, atașată de ei, urmează mișcarea. Când pielea e elastică și hidratată, revine imediat. În timp, fibrele de colagen și elastină se degradează și liniile rămân vizibile chiar și cu fața relaxată.</p>
<div class="rx-compare">
  <div class="rx-col"><small>La început</small><b>Riduri dinamice</b><dl><dt>Când se văd</dt><dd>doar în timpul mimicii</dd><dt>Pielea</dt><dd>încă elastică, revine</dd><dt>Ce ajută</dt><dd>prevenția și îngrijirea zilnică</dd></dl></div>
  <div class="rx-col rx-col-on"><small>În timp</small><b>Riduri statice</b><dl><dt>Când se văd</dt><dd>și cu fața relaxată</dd><dt>Pielea</dt><dd>a pierdut colagen și elasticitate</dd><dt>Ce ajută</dt><dd>tratamente stabilite la consult</dd></dl></div>
</div>
<p>Spre deosebire de ridurile date de gravitație (pe gât sau pe linia maxilarului), ridurile de expresie vin direct din mimică și se instalează unde musculatura lucrează mai mult.</p>

<h2 id="zone">Ridurile de expresie pe zone</h2>
<p>Fiecare zonă a feței reacționează diferit. Alege zona care te interesează ca să vezi cum apar ridurile acolo și ce se poate face.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    ${zone.map(([t], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}">${esc(t)}</button>`).join('\n    ')}
  </div>
  ${zone.map(([, d, t], i) => `<div class="rx-panel" data-panel="${i}"${i ? ' hidden' : ''}><p>${esc(d)}</p><p><b>Ce poate ajuta:</b> ${t}</p></div>`).join('\n  ')}
</div>
<p>Liniile care coboară din colțurile gurii spre bărbie au alte cauze; despre ele găsești detalii în articolul despre <a href="/nou/riduri-marioneta/">ridurile marionetă</a>.</p>

<h2 id="cauze">Ce cauzează ridurile de expresie</h2>
<p>Vârsta este doar unul dintre motive. Ridurile apar din combinația dintre mimică, structura pielii, genetică și stil de viață.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Mimica repetată</b><p>Mușchii se contractă mereu în aceleași locuri, iar pielea se pliază la fel de des. Relaxarea lor poate preveni adâncirea liniilor.</p></div>
  <div class="rx-card"><i>02</i><b>Pierderea colagenului</b><p>După 25 de ani, producția de colagen și elastină scade constant. Pielea devine mai subțire și nu mai revine la forma inițială după fiecare expresie.</p></div>
  <div class="rx-card"><i>03</i><b>Genetica și stilul de viață</b><p>Genele influențează densitatea pielii și regenerarea. Somnul puțin, stresul și apa prea puțină încetinesc refacerea; un stil de viață echilibrat poate întârzia ridurile.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Ce le accentuează</span>
  <ul class="rx-chips rx-chips-neg"><li>soarele fără protecție</li><li>fumatul</li><li>stresul cronic</li><li>lipsa somnului</li><li>poluarea</li><li>alimentația săracă în antioxidanți</li><li>somnul pe o parte</li></ul>
</div>
<p>Razele UV distrug colagenul și elastina din straturile profunde; fumatul reduce oxigenarea pielii, iar strângerea repetată a buzelor favorizează liniile verticale din jurul gurii.</p>

<h2 id="acasa">Prevenția începe acasă</h2>
<p>Nicio procedură nu înlocuiește o rutină constantă. Nu ai nevoie de schimbări radicale, ci de consecvență.</p>
<div class="rx-two">
  <div><h3>Dimineața</h3><ul><li>curățare blândă, potrivită tipului de ten</li><li>tonic fără alcool</li><li>ser cu acid hialuronic, niacinamidă sau peptide</li><li>cremă hidratantă (fluidă pentru ten gras, mai bogată pentru ten uscat)</li><li><b>SPF 30–50</b>, pasul de care nu te lipsești</li></ul></div>
  <div><h3>Seara și săptămânal</h3><ul><li>curățare, apoi produse cu retinol sau bakuchiol, introduse treptat</li><li>exfoliere blândă (AHA pentru ten uscat, BHA pentru ten mixt sau gras), de 1–2 ori pe săptămână</li><li>masaj facial cu mișcări ușoare, ascendente, fără să tragi de piele</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Cremele cu retinol, peptide și antioxidanți pot face liniile fine mai puțin vizibile și pot încetini apariția altora, dar au nevoie de aplicare constantă și nu șterg ridurile deja fixate. Pentru acestea, tratamentele profesionale pot ajuta, iar rezultatul diferă de la o persoană la alta.</p></aside>

<h2 id="tratamente">Tratamente profesionale pentru ridurile de expresie</h2>
<p>Medicina estetică de azi urmărește un aspect relaxat și echilibrat, care păstrează trăsăturile tale. Tratamentele se aleg după zonă și după tipul ridului:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Relaxarea mușchilor</b><p>${link('injectare-botox', 'Toxina botulinică')} relaxează mușchii care formează ridurile de pe frunte, dintre sprâncene și din jurul ochilor.</p></div>
  <div class="rx-card"><i>02</i><b>Umplere și hidratare</b><p>${link('injectari-acid-hialuronic', 'Acidul hialuronic')} umple liniile adânci; ${link('skinbooster-vital', 'Skinbooster Vital')} hidratează pielea din interior; ${link('harmonyca', 'HArmonyCa')} adaugă susținere și fermitate.</p></div>
  <div class="rx-card"><i>03</i><b>Regenerare</b><p>${link('sculptra', 'Sculptra')}, ${link('polinucleotide', 'polinucleotidele')}, ${link('mezoterapie', 'mezoterapia')}, ${link('microneedeling', 'microneedlingul')}, ${link('dermalinfusion', 'Dermalinfusion')} și ${link('venus-viva', 'Venus Viva')} stimulează colagenul și îmbunătățesc textura pielii.</p></div>
</div>

<h2 id="la-moa">Tratamentul ridurilor de expresie la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul îți evaluează fața în repaus și în mișcare, tipul de piele și ce te deranjează. Nu există o formulă universală, ci un plan făcut pentru tine.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Se face tratamentul ales: relaxarea mușchilor, umplerea liniilor sau o procedură de regenerare, uneori combinate.</p>${pret('injectare-botox') ? `<em>Botox, o zonă · de la ${lei(pret('injectare-botox'))}</em>` : ''}${pret('injectari-acid-hialuronic') ? `<em>Acid hialuronic · de la ${lei(pret('injectari-acid-hialuronic'))}</em>` : ''}</li>
  <li><b>După</b><p>Primești recomandările de îngrijire pentru zilele următoare și continui rutina de acasă, cu protecție solară.</p></li>
  <li><b>Reevaluarea</b><p>Medicul verifică rezultatul și stabilește dacă e nevoie de ajustări sau de întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-frunte/">ridurile de pe frunte</a>, <a href="/nou/riduri-laba-gastei/">laba gâștei</a>, <a href="/nou/riduri-in-jurul-gurii/">ridurile din jurul gurii</a> sau <a href="/nou/recomandari-dupa-botox/">ce faci după botox</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Ridurile de expresie spun povestea emoțiilor tale, dar nu trebuie acceptate pasiv. Echilibrul dintre o rutină constantă acasă și tratamentele potrivite, alese la consult, poate reda feței un aspect relaxat și natural.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru ridurile de expresie pe zone
(() => {
  document.querySelectorAll('[data-tabs]').forEach((t) => {
    const bs = [...t.querySelectorAll('[role=tab]')], ps = [...t.querySelectorAll('[data-panel]')];
    bs.forEach((b) => b.addEventListener('click', () => { bs.forEach((x) => x.setAttribute('aria-selected', x === b)); ps.forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.tab)); }));
  });
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Cum se formează ridurile de expresie, cum arată pe frunte, în jurul ochilor și al gurii, ce le accentuează și ce poți face, de la rutina de acasă până la tratamentele de la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
