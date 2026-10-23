// Versiunea structurată a articolului „Cearcăne și pungi sub ochi: tratamente”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vrea să scape de cearcăne:
// răspunsul scurt → cearcăne sau pungi → de ce apar → tratamentele din clinică (file interactive) → îngrijirea de acasă
// → machiaj → prevenție → greșeli frecvente → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const pP = (sid, re) => (serv[sid]?.preturi || []).find((p) => re.test(p.nume))?.valoare;
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');
  const pNctf = pP('mezoterapie', /NCTF/i);
  const deLa = (v) => (v ? `<em>de la ${lei(v)}</em>` : '');
  const mai = (sid, txt) => (id(sid) ? `<a class="link-u" href="${esc(live(sid))}">${txt} →</a>` : '');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Cearcăne sau pungi'],
    ['cauze', 'De ce apar'],
    ['tratamente', 'Tratamentele din clinică'],
    ['acasa', 'Îngrijirea de acasă'],
    ['machiaj', 'Cearcănele și machiajul'],
    ['preventie', 'Prevenția'],
    ['greseli', 'Greșeli frecvente'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Care este diferența dintre cearcăne și pungi sub ochi?', 'Cearcănele sunt zone mai închise la culoare sub ochi, fără modificare de volum. Pungile sunt umflături vizibile sub pleoapele inferioare. Poți avea una dintre ele sau pe amândouă, iar abordarea este diferită.'],
    ['Pot scăpa de cearcăne doar cu creme?', 'Cremele nu elimină cearcănele, dar pot îmbunătăți aspectul pielii în timp, de exemplu cele cu vitamina C, pentru luminozitate. Când cauza este genetică sau pierderea de volum, de obicei e nevoie de un tratament făcut de medic.'],
    ['Ce tratament este potrivit pentru mine?', 'Depinde de cauza cearcănelor. Cele cauzate de pierderea de volum nu răspund la același tratament ca cele cauzate de pigmentare sau de pielea subțire. Medicul face această diferențiere la consultație.'],
    ['În cât timp se văd rezultatele îngrijirii de acasă?', 'O rutină constantă, cu somn suficient și hidratare, dă de regulă rezultate după 4–8 săptămâni de aplicare regulată.'],
    ['De ce mi se umflă ochii dimineața?', 'Somnul puțin, excesul de sare și deshidratarea favorizează retenția de lichide. Ridicarea ușoară a pernei poate ajuta. Pungile pot fi legate și de vârstă, alergii, boli renale sau tiroidiene, așa că, dacă persistă, discută cu medicul.'],
    ['PRP-ul elimină cearcănele dintr-o ședință?', 'Nu. PRP-ul poate stimula colagenul și circulația locală, dar îmbunătățirile apar în timp, cu un protocol stabilit de medic.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li><b>Cearcănele</b> sunt zone mai închise la culoare sub ochi; <b>pungile</b> sunt umflături sub pleoapa inferioară. Au cauze diferite și se tratează diferit.</li>
    <li>Cauzele frecvente: <b>pielea care se subțiază cu vârsta</b>, genetica, somnul puțin, soarele, deshidratarea, frecatul ochilor. La pungi contează și vârsta, alergiile, bolile renale sau tiroidiene.</li>
    <li>În clinică se discută <b>polinucleotide, acid hialuronic pentru zona ochilor, PRP și mezoterapie cu NCTF</b>, alese după cauză.</li>
    <li>Acasă ajută <b>somnul de 7–9 ore, hidratarea, mai puțină sare, protecția solară</b> și o rutină simplă, aplicată constant.</li>
    <li>La MOA, primul pas este o <b>consultație</b>${consultPret ? ` (${lei(consultPret)})` : ''}, în care medicul vede de ce apar cearcănele tale.</li>
  </ul>
</section>

<h2 id="ce-sunt">Cearcăne sau pungi sub ochi: care e diferența</h2>
<p class="ar-first">Cearcănele și pungile sub ochi sunt printre cele mai frecvente preocupări estetice, la femei și la bărbați, la orice vârstă. De cele mai multe ori nu sunt o problemă de sănătate în sine, dar pot schimba felul în care te simți. Înainte de soluții, merită să știi cu ce ai de-a face, pentru că nu sunt același lucru.</p>
<div class="rx-two">
  <div><h3>Cearcănele</h3><p>Zone de pigmentare întunecată sau decolorare vizibilă sub ochi, <b>fără modificare de volum</b>.</p></div>
  <div><h3>Pungile sub ochi</h3><p><b>Umflături vizibile</b> sub pleoapele inferioare.</p></div>
</div>
<p>Poți avea una dintre ele sau pe amândouă în același timp. Tocmai de aceea, abordarea trebuie să fie diferită.</p>

<h2 id="cauze">De ce apar cearcănele și pungile</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Cearcănele</b><p>Cu vârsta, pielea din jurul ochilor se subțiază și lasă vasele de sânge mai vizibile. Contează și genetica (pot fi moștenite), somnul insuficient, care face pielea palidă, soarele, deshidratarea și frecatul ochilor, care poate rupe vase mici de sânge.</p></div>
  <div class="rx-card"><i>02</i><b>Pungile</b><p>Principala cauză este vârsta: mușchii din jurul ochilor slăbesc, iar țesutul adipos poate coborî și se adună în pleoapa inferioară. Pot contribui și bolile renale, afecțiunile tiroidiene și alergiile.</p></div>
  <div class="rx-card"><i>03</i><b>Ce le accentuează</b><p>Alcoolul, fumatul și alimentația nesănătoasă. Stilul de viață se poate schimba, cu efecte în timp. Genetica nu se schimbă, dar poate fi gestionată.</p></div>
</div>

<h2 id="tratamente">Tratamentele din clinică pentru cearcăne</h2>
<p>Când îngrijirea de acasă nu ajunge sau cauza este mai profundă, de exemplu genetica sau pierderea de volum, există tratamente minim invazive care pot îmbunătăți aspectul zonei ochilor. Nu sunt soluții miraculoase, iar alegerea depinde de cauză. Apasă pe fiecare tratament ca să vezi pentru ce se folosește.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Polinucleotide</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Acid hialuronic</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">PRP</button>
    <button type="button" role="tab" aria-selected="false" data-tab="3">Mezoterapie NCTF</button>
  </div>
  <div class="rx-panel" data-panel="0">
    <p><b>Pentru piele subțire, „transparentă”.</b> Polinucleotidele sunt molecule derivate din ADN, folosite pentru a stimula regenerarea și a hidrata pielea în profunzime. Injectate sub ochi, pot îmbunătăți calitatea și elasticitatea pielii și pot diminua cearcănele cauzate de subțierea pielii. Sunt bine tolerate și se pot combina cu alte tratamente.</p>
    <p>${deLa(pret('polinucleotide'))} ${mai('polinucleotide', 'Despre polinucleotide')}</p>
  </div>
  <div class="rx-panel" data-panel="1" hidden>
    <p><b>Pentru cearcăne cauzate de pierderea de volum.</b> Un acid hialuronic conceput pentru zona ochilor se plasează în zona de trecere dintre pleoapa inferioară și obraz. Se face sub anestezie locală, în cabinet, iar rezultatele pot dura câteva luni. Anatomia zonei este delicată, așa că tehnica și experiența medicului în zona perioculară contează mult.</p>
    <p>${deLa(pret('jalupro-young-eye'))} ${mai('jalupro-young-eye', 'Despre Jalupro Young Eye')}</p>
  </div>
  <div class="rx-panel" data-panel="2" hidden>
    <p><b>Pentru luminozitate și regenerare.</b> O mostră mică din propriul sânge este prelucrată pentru a concentra factorii de creștere, iar plasma se injectează în zona din jurul ochilor. Poate stimula colagenul, poate îmbunătăți circulația locală și regenerarea pielii. Folosind sângele tău, riscul de reacții adverse este redus. Nu elimină cearcănele dintr-o ședință; îmbunătățirile apar în timp, cu un protocol stabilit de medic.</p>
    <p>${deLa(pret('prp-scalp'))} ${mai('prp-scalp', 'Despre PRP')}</p>
  </div>
  <div class="rx-panel" data-panel="3" hidden>
    <p><b>Pentru cearcăne legate de oboseala cronică.</b> Mezoterapia cu NCTF înseamnă injectarea unui amestec de vitamine, aminoacizi, minerale și acid hialuronic în concentrație mică, direct în pielea de sub ochi. Scopul nu este să umple, ci să hrănească pielea, pentru tonus și luminozitate. Este un tratament blând, cu rezultate de obicei după o serie de ședințe.</p>
    <p>${deLa(pNctf)} ${mai('mezoterapie', 'Despre mezoterapie')}</p>
  </div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Fiecare tratament se adresează altei cauze: cearcănele date de pierderea de volum nu răspund la fel ca cele date de pigmentare sau de pielea subțire. Rezultatele diferă de la o persoană la alta. Pentru pungile sub ochi, în unele cazuri medicul poate discuta și o intervenție chirurgicală, precum ${link('blefaroplastie', 'blefaroplastia')}.</p></aside>

<h2 id="acasa">Îngrijirea de acasă și remediile naturale</h2>
<p>Îngrijirea de acasă nu înlocuiește un tratament când e nevoie de el, dar ajută la menținerea rezultatelor și la prevenirea agravării.</p>
<div class="rx-two">
  <div><h3>Produse și masaj</h3><ul><li>creme cu vitamina C, pentru luminozitate și un ton mai uniform</li><li>masaj delicat al zonei, pentru circulație și mai puțină retenție de lichide</li><li>câteva picături de ulei de migdale seara, aplicate cu degetul inelar, foarte ușor</li><li>tampoane cu apă de trandafiri ținute câteva minute pe pleoape, pentru un aspect mai odihnit</li></ul></div>
  <div><h3>Alimentație și odihnă</h3><ul><li>mai puțină sare, care favorizează retenția de apă</li><li>alimente cu antioxidanți și grăsimi sănătoase: avocado, fructe de pădure, nuci</li><li>hidratare suficientă</li><li>somn și mai puțin stres</li></ul></div>
</div>
<p>Remediile naturale pot ajuta pe termen scurt. Rezultatele unei rutini aplicate regulat apar, de obicei, după <b>4–8 săptămâni</b>, așa că răbdarea face parte din tratament.</p>

<h2 id="machiaj">Cearcănele și machiajul</h2>
<p>Machiajul nu rezolvă problema, dar o poate ascunde până când tratamentele își fac efectul sau în zilele în care vrei să arăți odihnit(ă).</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Pregătește pielea</b><p>Ține câteva minute o pungă cu gheață sau o linguriță rece pe zona ochilor, apoi aplică o cremă de ochi hidratantă. Fără ea, corectorul stă „deasupra” pielii și accentuează liniile fine.</p></div>
  <div class="rx-card"><i>02</i><b>Alege corectorul</b><p>Pentru riduri fine sub ochi, un produs dens, mat și ferm, care nu se încrețește. Pentru piele netedă, o formulă lichidă, hidratantă. Pentru acoperire mai mare, un stick cremos.</p></div>
  <div class="rx-card"><i>03</i><b>Aplică în strat subțire</b><p>Fondul de ten se aplică subțire sub ochi, cu degetul, și se întinde cu un burete umed. Pentru nuanță, testează două tonuri pe linia maxilarului și alege-l pe cel care se integrează natural.</p></div>
</div>

<h2 id="preventie">Prevenția cearcănelor și a pungilor</h2>
<ul class="rx-chips"><li>7–9 ore de somn pe noapte</li><li>perna ușor ridicată</li><li>cel puțin 8 pahare de apă pe zi</li><li>ochelari de soare</li><li>cremă de ochi cu SPF</li><li>demachiant blând</li><li>cremă de ochi dimineața și seara</li></ul>
<p>Pielea din jurul ochilor este printre cele mai subțiri de pe corp și printre primele afectate de soare. O rutină simplă, aplicată consecvent, contează mai mult decât produsele scumpe folosite din când în când.</p>

<h2 id="greseli">Greșeli frecvente în tratarea cearcănelor</h2>
<div class="rx-why">
  <span class="rx-why-h">Ce poate accentua cearcănele</span>
  <ul class="rx-chips rx-chips-neg"><li>machiaj în straturi groase</li><li>cremă aleasă după reclamă, nu după tipul de piele</li><li>formule prea bogate pe piele grasă</li><li>ignorarea cauzelor reale</li><li>tratamente alese la întâmplare</li></ul>
</div>
<p>O cremă de ochi nu poate compensa somnul puțin, sarea în exces, lipsa hidratării sau alergiile netratate. Cearcănele au cauze multiple, așa că tratarea lor înseamnă să privești tabloul complet: hidratare, somn, protecție solară, masaj și, acolo unde e cazul, tratament medical. Un specialist poate face diferența între cauze și îți poate propune un plan progresiv, fără să irosești timp și bani pe ce nu se potrivește situației tale.</p>

<h2 id="la-moa">Tratamentul cearcănelor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultația</b><p>Medicul examinează zona ochilor și stabilește dacă e vorba de cearcăne, pungi sau amândouă și ce le cauzează.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul</b><p>Alege tratamentul potrivit cauzei și îți explică la ce să te aștepți, fără promisiuni exagerate.</p></li>
  <li><b>Tratamentul</b><p>Se face în cabinet, uneori sub anestezie locală. Unele tratamente cer o serie de ședințe.</p>${pret('jalupro-young-eye') ? `<em>Jalupro Young Eye · ${lei(pret('jalupro-young-eye'))}</em>` : ''}${pNctf ? `<em>Mezoterapie NCTF · ${lei(pNctf)}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește rezultatul și îți spune ce îngrijire de acasă îl susține.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/pungi-sub-ochi/">pungile sub ochi</a>, <a href="/nou/tratament-cearcane/">tratamentul cearcănelor</a> și <a href="/nou/ce-inseamna-prp/">ce înseamnă PRP</a>, sau vezi pagina ${link('jalupro-young-eye', 'Jalupro Young Eye')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Cearcănele și pungile sub ochi sunt o problemă reală, dar abordabilă. Cu o înțelegere corectă a cauzelor, o rutină adaptată și, când e nevoie, sprijinul unui medic, aspectul zonei ochilor se poate îmbunătăți. Nu există soluții instantanee, dar există pași care au sens pentru situația ta.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu tratamentele din clinică pentru cearcăne
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
    lede: 'Prin ce diferă cearcănele de pungile sub ochi, de ce apar și ce tratamente se discută în clinică, după cauză. Plus îngrijirea de acasă, machiajul, prevenția și greșelile de evitat.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
