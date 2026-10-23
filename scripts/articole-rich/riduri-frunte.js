// Versiunea structurată a articolului „Riduri pe frunte? Secretele experților anti-aging”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva deranjat de liniile de pe frunte:
// răspunsul scurt → de ce apar → ce poți face acasă → ce produse ajută → tratamentele din clinică → rutina de prevenție (listă bifabilă) → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const botox = serv['injectare-botox']?.preturi || [];
  const pB = (re) => botox.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const p1 = pB(/1 zon/i);
  const p3 = pB(/3 zone.*femei/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['de-ce-apar', 'De ce apar ridurile pe frunte'],
    ['acasa', 'Remedii naturale'],
    ['ingrijire', 'Ce produse ajută'],
    ['tratamente', 'Tratamente în clinică'],
    ['preventie', 'Rutina de prevenție'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De la ce vârstă apar ridurile pe frunte?', 'Adesea încep să se contureze în jurul vârstei de 25–30 de ani, când ritmul vieții devine mai intens, somnul mai scurt, iar îngrijirea pielii trece pe planul doi. Momentul diferă de la o persoană la alta.'],
    ['Toxina botulinică este singura variantă pentru frunte?', 'Nu. Pentru liniile fine și textura pielii există și tratamente cu aparatură sau injectări cu rol de hidratare. Toxina botulinică acționează asupra mușchilor care încrețesc fruntea, așa că este folosită des pentru ridurile de expresie. Medicul stabilește ce se potrivește în cazul tău.'],
    ['În cât timp se vede efectul toxinei botulinice?', 'De obicei în 3–7 zile, iar efectul se menține câteva luni. Ulterior, medicul discută cu tine dacă și când are sens o nouă ședință.'],
    ['Remediile naturale chiar ajută?', 'Pot îmbunătăți hidratarea și textura pielii și pot încetini apariția liniilor fine, dacă le folosești constant. Nu înlocuiesc tratamentele din clinică atunci când ridurile sunt deja bine conturate.'],
    ['Am nevoie de protecție solară și iarna?', 'Da. Razele UV afectează colagenul tot anul, așa că o cremă cu SPF 30+ aplicată dimineața face parte din rutina de bază, indiferent de anotimp.'],
    ['Cât costă tratamentul ridurilor de pe frunte la MOA?', `Depinde de zonele tratate și de recomandarea medicului.${p1 ? ` Corecția ridurilor de expresie pe o zonă (frunte, ochi sau între sprâncene) pornește de la ${lei(p1)}.` : ''} Prețurile complete sunt pe pagina de prețuri.`],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile pe frunte <b>nu țin doar de vârstă</b>: încep adesea în jurul vârstei de 25–30 de ani și reflectă stilul de viață.</li>
    <li>Principalele cauze sunt <b>expresiile repetate, soarele, stresul și somnul puțin</b>, fumatul, zahărul în exces și deshidratarea.</li>
    <li>Acasă poți susține pielea cu <b>hidratare, protecție solară zilnică</b>, seruri cu retinol sau vitamina C și remedii blânde, aplicate constant.</li>
    <li>Când liniile sunt deja bine conturate, medicul poate recomanda <b>toxina botulinică</b> sau alte tratamente din clinică, potrivite tenului tău.</li>
    <li>La MOA, tratamentul începe cu <b>o analiză a pielii</b> și o discuție despre ce îți dorești${p1 ? `; corecția pe o zonă pornește de la ${lei(p1)}` : ''}.</li>
  </ul>
</section>

<h2 id="de-ce-apar">De ce apar ridurile pe frunte</h2>
<p class="ar-first">Fruntea spune multe despre tine. Acolo se adună, fără să-ți dai seama, gândurile, tensiunile și expresiile de zi cu zi: mirarea, îngrijorarea, concentrarea, chiar și încruntatul în lumina puternică. De aceea, ridurile de aici apar uneori înaintea altor semne ale trecerii timpului.</p>
<p>Nu apar peste noapte și nu sunt doar o chestiune de genetică. Sunt rezultatul mai multor factori care se adună în timp. Le poți privi ca pe un semnal pe care îl poți asculta și gestiona, nu ca pe un motiv de panică.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Expresiile repetate</b><p>Când ridici sprâncenele sau te încrunți, pielea se pliază odată cu mușchii. Cu anii, își pierde capacitatea de a reveni netedă și liniile rămân vizibile și în repaus: orizontale pe frunte, verticale între sprâncene.</p></div>
  <div class="rx-card"><i>02</i><b>Soarele și razele UV</b><p>Razele UV degradează colagenul și favorizează radicalii liberi. Fruntea este mereu expusă, așa că fără protecție solară apar mai ușor riduri, pete și uscăciune.</p></div>
  <div class="rx-card"><i>03</i><b>Stresul și somnul puțin</b><p>Cortizolul reduce producția de colagen și încetinește refacerea pielii, care are loc mai ales noaptea. Oboseala te face să încrunți fruntea mai des, fără să-ți dai seama.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Alți factori care accentuează ridurile</span>
  <ul class="rx-chips rx-chips-neg"><li>fumatul</li><li>zahărul în exces</li><li>alimentația săracă în vitamine</li><li>apa puțină</li><li>aerul condiționat și vântul</li><li>produsele cosmetice agresive</li></ul>
</div>
<p>Fumatul reduce fluxul de sânge către piele și degradează colagenul și elastina. Zahărul în exces se leagă de colagen și îl rigidizează, un proces numit glicare. Iar pielea deshidratată face ca liniile fine să pară mai adânci decât sunt.</p>

<h2 id="acasa">Remedii naturale pentru riduri pe frunte</h2>
<p>Nu dau rezultate peste noapte, dar aplicate constant pot îmbunătăți textura pielii, pot reduce aspectul liniilor fine și pot încetini formarea ridurilor. Testează orice remediu întâi pe o zonă mică de piele.</p>
<div class="rx-two">
  <div><h3>Măști și comprese</h3><ul><li><b>Ulei de cocos și miere</b>: câte o linguriță din fiecare, 15–20 de minute, de 2–3 ori pe săptămână. Dacă ai ten acneic sau gras, uleiul de cocos poate bloca porii.</li><li><b>Comprese cu ceai verde sau mușețel</b>: ceaiul răcit, pe o dischetă de bumbac, 10–15 minute, de 2–3 ori pe săptămână. Ceaiul verde are antioxidanți, mușețelul calmează pielea sensibilă.</li></ul></div>
  <div><h3>Masaj și exfoliere</h3><ul><li><b>Masaj facial</b>: 2 picături de ulei esențial (lavandă, tămâie sau trandafir) într-o linguriță de ulei de jojoba, migdale dulci sau argan, cu mișcări circulare 5–10 minute, seara. Nu aplica uleiurile esențiale nediluate.</li><li><b>Exfoliere blândă</b>: o lingură de zahăr brun cu o linguriță de ulei de măsline, 1–2 minute de masaj, o dată pe săptămână. Pentru piele sensibilă, folosește ovăz fin măcinat.</li></ul></div>
</div>

<h2 id="ingrijire">Ce produse și obiceiuri ajută</h2>
<p>Pentru ridurile deja vizibile, rutina de acasă se poate sprijini pe câteva ingrediente cu efect documentat și pe protecția solară.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Retinol și vitamina C</b><p>Retinolul susține producția de colagen și reînnoirea celulară; se introduce treptat, seara. Vitamina C, antioxidant, se aplică dimineața, sub SPF. Nu le folosi împreună decât dacă produsul este formulat așa.</p></div>
  <div class="rx-card"><i>02</i><b>Acid hialuronic și peptide</b><p>Acidul hialuronic reține apa în piele, iar peptidele încurajează regenerarea. O cremă cu ambele, folosită zilnic, ajută pielea să arate mai hidratată și mai fermă.</p></div>
  <div class="rx-card"><i>03</i><b>SPF 30+ în fiecare zi</b><p>Indiferent de anotimp. Dacă stai mult afară, alege SPF 50 și reaplică la 2–3 ore. Fără protecție solară, efectul celorlalte produse se reduce.</p></div>
</div>
<p>Poți încerca și <b>exerciții faciale</b>: așază arătătoarele puțin deasupra sprâncenelor, trage ușor pielea în sus și încearcă în același timp să cobori sprâncenele, opunând rezistență. Repetă de 10 ori. Ajută la relaxarea tensiunii din frunte.</p>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Remediile naturale și produsele de îngrijire susțin pielea și pot încetini apariția ridurilor. Când liniile sunt deja adânci, ele rareori sunt suficiente singure. Cât de mult se estompează un rid depinde de tipul de piele, de vârstă și de obiceiuri, de aceea tratamentul se alege după evaluare.</p></aside>

<h2 id="tratamente">Tratamente în clinică pentru ridurile de pe frunte</h2>
<p>Când vrei un efect mai vizibil sau ridurile sunt bine conturate, medicul îți poate recomanda un tratament potrivit tenului și obiectivelor tale. La MOA, opțiunile se discută la consult.</p>
<div class="rx-compare">
  <div class="rx-col rx-col-on"><small>Toxină botulinică</small><b>Pentru ridurile de expresie</b><dl><dt>Cum acționează</dt><dd>relaxează mușchii care încrețesc fruntea</dd><dt>Când se vede</dt><dd>de obicei în 3–7 zile, efect de câteva luni</dd><dt>Potrivit pentru</dt><dd>liniile orizontale și cele dintre sprâncene</dd></dl>${id('injectare-botox') ? `<a class="link-u" href="${esc(live('injectare-botox'))}">Despre toxina botulinică →</a>` : ''}</div>
  <div class="rx-col"><small>Venus Viva</small><b>Radiofrecvență fracționată</b><dl><dt>Cum acționează</dt><dd>energie de radiofrecvență aplicată fracționat pe piele</dd><dt>Când se vede</dt><dd>după câteva sesiuni</dd><dt>Potrivit pentru</dt><dd>riduri fine, fermitate, textură</dd></dl>${id('venus-viva') ? `<a class="link-u" href="${esc(live('venus-viva'))}">Despre Venus Viva →</a>` : ''}</div>
  <div class="rx-col"><small>Skinbooster</small><b>Hidratare în profunzime</b><dl><dt>Cum acționează</dt><dd>susține acidul hialuronic și colagenul din piele</dd><dt>Când se vede</dt><dd>treptat</dd><dt>Potrivit pentru</dt><dd>piele deshidratată, linii fine</dd></dl>${id('skinbooster-vital') ? `<a class="link-u" href="${esc(live('skinbooster-vital'))}">Despre skinbooster →</a>` : ''}</div>
</div>
<p>Pentru alte nevoi ale tenului, medicul poate discuta și despre ${link('dermalinfusion', 'Dermalinfusion')}, ${link('microneedeling', 'microneedling')} sau ${link('prp-scalp', 'PRP')}. Indiferent de tratament, alege un medic și spune-i deschis ce îți dorești.</p>

<h2 id="preventie">Rutina de prevenție, de bifat</h2>
<p>Ridurile se construiesc lent, din obiceiuri de zi cu zi. Asta înseamnă că ai control real asupra multora dintre cauze. Bifează ce faci deja; lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>
  <li><label><input type="checkbox"> Curăț blând fața, dimineața și seara</label></li>
  <li><label><input type="checkbox"> Aplic dimineața cremă cu SPF 30+, și iarna</label></li>
  <li><label><input type="checkbox"> Folosesc seara o cremă sau un ser hidratant</label></li>
  <li><label><input type="checkbox"> Beau 6–8 pahare de apă pe zi</label></li>
  <li><label><input type="checkbox"> Port ochelari de soare ca să nu mă încrunt în lumină</label></li>
  <li><label><input type="checkbox"> Mănânc fructe de pădure, legume verzi, pește gras, semințe și nuci</label></li>
  <li><label><input type="checkbox"> Limitez zahărul și renunț la fumat</label></li>
  <li><label><input type="checkbox"> Dorm suficient</label></li>
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="la-moa">Tratamentul ridurilor de pe frunte la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul și analiza pielii</b><p>Medicul analizează fruntea, tipul de piele și ridurile, ascultă ce îți dorești și stabilește dacă un tratament ți se potrivește și care.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Tratamentul</b><p>Pentru ridurile de expresie, medicul injectează toxina botulinică în zonele stabilite la consult.</p>${p1 ? `<em>Corecție riduri de expresie, 1 zonă · ${lei(p1)}</em>` : ''}${p3 ? `<em>Tratament complet, 3 zone · de la ${lei(p3)}</em>` : ''}</li>
  <li><b>După tratament</b><p>Primești recomandări clare pentru primele ore și zile. Efectul apare treptat, de obicei în 3–7 zile.</p></li>
  <li><b>Reevaluarea</b><p>Medicul urmărește rezultatul și discută cu tine dacă și când are sens o nouă ședință sau un tratament complementar.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-intre-sprancene/">ridurile dintre sprâncene</a>, <a href="/nou/riduri-laba-gastei/">ridurile laba gâștei</a> și <a href="/nou/recomandari-dupa-botox/">recomandările după toxina botulinică</a>, sau vezi ${link('injectare-botox', 'pagina tratamentului cu toxină botulinică')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Să ai grijă de piele nu înseamnă să fugi de riduri, ci să le înțelegi. Obiceiurile bune, repetate zilnic, contează mult, iar când vrei mai mult, primul pas este o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: rutina de prevenție bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-riduri-frunte-rutina', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'De ce apar ridurile pe frunte, ce poți face acasă, ce produse ajută și când are sens un tratament în clinică. Cu o rutină de prevenție de bifat și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
