// Versiunea structurată a articolului „Combinarea tratamentelor Venus Legacy cu detoxifierea intravenoasă”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva interesat de remodelare corporală:
// răspunsul scurt → ce face Venus Legacy → ce face detoxifierea intravenoasă → de ce se combină → la ce să te aștepți → obiceiuri în timpul tratamentelor (listă bifabilă) → la MOA → întrebări.
// Formulări fără superlative, fără rezultate promise și fără comparații cu alte clinici (Decizia CMR 20/2025).
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const glut = serv.glutation?.preturi || [];
  const pDetox = glut.find((p) => /detox/i.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație antiaging (cu vârsta biologică)';
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['venus-legacy', 'Ce face Venus Legacy'],
    ['detox-iv', 'Ce face detoxifierea intravenoasă'],
    ['impreuna', 'De ce se combină'],
    ['asteptari', 'La ce să te aștepți'],
    ['obiceiuri', 'Obiceiuri în timpul tratamentelor'],
    ['la-moa', 'Planul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Pe ce zone se poate face Venus Legacy?', 'Pe față, gât și decolteu, dar și pe corp: abdomen, coapse, brațe, fese, zona lombară sau gambe. Medicul stabilește zonele în funcție de ce vrei să îmbunătățești.'],
    ['De câte ședințe este nevoie?', 'De obicei este nevoie de mai multe ședințe, iar uneori de ședințe de întreținere. Numărul de ședințe Venus Legacy și de perfuzii îl stabilește medicul după evaluare.'],
    ['De ce se combină cu perfuziile?', 'Venus Legacy lucrează asupra pielii și a țesutului adipos, iar detoxifierea intravenoasă aduce nutrienți și antioxidanți direct în sânge și susține eliminarea substanțelor rezultate din descompunerea grăsimii. Ideea este ca cele două să lucreze împreună, în același plan.'],
    ['Rezultatele sunt la fel pentru toată lumea?', 'Nu. Rezultatele variază în funcție de tipul și starea pielii, de cantitatea de țesut adipos și de obiectivele fiecăruia. De aceea medicul discută cu tine, de la început, așteptări realiste.'],
    ['Cât costă?', `Costul depinde de zonele tratate, de numărul de ședințe și de perfuziile recomandate.${pret('venus-legacy') ? ` O ședință Venus Legacy pornește de la ${lei(pret('venus-legacy'))}.` : ''} Planul complet ți-l prezintă medicul după consult.`],
  ];

  const obiceiuri = [
    'Mănânc variat: fructe și legume proaspete, proteine slabe, grăsimi sănătoase, carbohidrați complecși',
    'Beau suficientă apă în fiecare zi',
    'Evit alimentele procesate și zahărul rafinat',
    'Fac mișcare regulat, o activitate care îmi place',
    'Dorm suficient, după un program regulat',
    'Evit fumatul și consumul excesiv de alcool',
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li><b>Venus Legacy</b> folosește radiofrecvența și pulsatografia magnetică pentru a stimula colagenul și elastina, cu efect asupra <b>fermității pielii, celulitei și conturului</b>.</li>
    <li><b>Detoxifierea intravenoasă</b> aduce vitamine, minerale și antioxidanți direct în sânge și susține eliminarea toxinelor.</li>
    <li>La MOA, cele două se pot <b>combina într-un singur plan</b>, coordonat de un medic de antiaging intern.</li>
    <li>Rezultatele <b>variază de la o persoană la alta</b> și cer de obicei mai multe ședințe, uneori și întreținere.</li>
    <li>Alimentația, hidratarea, somnul și mișcarea <b>contează</b> pe toată durata tratamentelor.</li>
  </ul>
</section>

<h2 id="venus-legacy">Ce face Venus Legacy</h2>
<p class="ar-first">Poate ai slăbit, dar pielea nu s-a strâns la fel, sau celulita nu cedează oricât de atent mănânci. Pentru astfel de situații, la MOA, tratamentele cu Venus Legacy se pot combina cu terapiile intravenoase, ca să lucreze atât în exterior, cât și din interior.</p>
<p>Venus Legacy folosește două tehnologii: <b>radiofrecvența</b>, care încălzește țesuturile adânci ale pielii și stimulează producția de colagen și elastină, și <b>pulsatografia magnetică</b>, care susține circulația sângelui și drenajul limfatic. Țesutul se încălzește la temperaturi diferite, în funcție de ce se tratează: pielea sau țesutul adipos.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Celulita</b><p>Prin circulație și drenaj limfatic mai bune, pielea poate arăta mai netedă și mai uniformă.</p></div>
  <div class="rx-card"><i>02</i><b>Fermitatea și conturul</b><p>Colagenul și elastina stimulate dau pielii un aspect mai ferm, pe abdomen, coapse, brațe sau fese.</p></div>
  <div class="rx-card"><i>03</i><b>Cicatrici, vergeturi, depuneri</b><p>Poate îmbunătăți textura pielii și aspectul cicatricilor și vergeturilor și poate reduce depunerile de țesut adipos.</p></div>
</div>
${id('venus-legacy') ? `<p><a class="link-u" href="${esc(live('venus-legacy'))}">Despre tratamentul Venus Legacy →</a></p>` : ''}

<h2 id="detox-iv">Ce face detoxifierea intravenoasă</h2>
<p>Detoxifierea intravenoasă înseamnă administrarea în perfuzie a unui amestec de <b>vitamine, minerale și antioxidanți</b>, molecule folosite de peste 10 ani în tratarea problemelor legate de înaintarea în vârstă. Ajung direct în sânge, așa că sunt absorbite rapid, fără să treacă prin digestie.</p>
<ul class="rx-chips"><li>susține eliminarea toxinelor</li><li>susține sistemul imunitar</li><li>asimilare directă a nutrienților</li><li>susține sănătatea pielii</li></ul>
<p>Despre tipurile de perfuzii poți citi în articolul despre <a href="/nou/terapii-intravenoase/">terapiile intravenoase</a>.</p>

<h2 id="impreuna">De ce se combină cele două</h2>
<div class="rx-compare">
  <div class="rx-col"><small>Venus Legacy</small><b>Din exterior</b><dl><dt>Cum lucrează</dt><dd>radiofrecvență și pulsatografie magnetică</dd><dt>Asupra a ce</dt><dd>piele, celulită, țesut adipos</dd><dt>Ce urmărește</dt><dd>fermitate și contur</dd></dl></div>
  <div class="rx-col"><small>Detoxifiere intravenoasă</small><b>Din interior</b><dl><dt>Cum lucrează</dt><dd>perfuzie cu vitamine, minerale, antioxidanți</dd><dt>Asupra a ce</dt><dd>organismul în ansamblu</dd><dt>Ce urmărește</dt><dd>nutriție celulară și eliminarea toxinelor</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Împreună, la MOA</small><b>Un singur plan</b><dl><dt>Cum lucrează</dt><dd>ședințe planificate de medic</dd><dt>De ce</dt><dd>când țesutul adipos se descompune (lipoliză), se eliberează substanțe pe care organismul trebuie să le elimine; perfuzia susține acest proces</dd><dt>Cine coordonează</dt><dd>medicul de antiaging intern</dd></dl></div>
</div>

<h2 id="asteptari">La ce să te aștepți</h2>
<p>Combinația se planifică ca o <b>serie de ședințe</b> Venus Legacy și de perfuzii, în funcție de nevoile și obiectivele tale: întinerirea pielii, reducerea unei părți din țesutul adipos sau ambele. Costurile și programul variază după starea de sănătate, cantitatea de țesut adipos și factorii toxici la care ai fost expus(ă) în timp.</p>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rezultatele variază de la o persoană la alta, în funcție de tipul și starea pielii și de obiectivele fiecăruia. Unele schimbări se pot vedea după primele ședințe, altele cer mai mult timp, iar menținerea lor poate cere ședințe periodice. De aceea, înainte de a începe, medicul verifică dacă ești un candidat potrivit și discută cu tine așteptări realiste.</p></aside>

<h2 id="obiceiuri">Obiceiuri în timpul tratamentelor</h2>
<p>Tratamentele lucrează mai bine când și stilul de viață le susține. Bifează ce faci deja; lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>${obiceiuri.map((o) => `
  <li><label><input type="checkbox"> ${esc(o)}</label></li>`).join('')}
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="la-moa">Planul la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul de antiaging</b><p>Medicul îți ascultă obiectivele, îți evaluează starea de sănătate și stabilește dacă combinația ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul personalizat</b><p>Stabilești cu medicul zonele tratate, numărul de ședințe Venus Legacy și perfuziile potrivite.</p></li>
  <li><b>Ședințele</b><p>Ședințele Venus Legacy și perfuziile se programează după plan, cu pauzele recomandate între ele.</p>${pret('venus-legacy') ? `<em>Venus Legacy · de la ${lei(pret('venus-legacy'))} / ședință</em>` : ''}${pDetox ? `<em>Glutation Detox Boost · ${lei(pDetox)}</em>` : ''}</li>
  <li><b>Reevaluarea și întreținerea</b><p>La final, medicul discută cu tine ce s-a schimbat și dacă sunt utile ședințe de întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre ${link('venus-legacy', 'Venus Legacy')}, ${link('glutation', 'perfuziile cu glutation')} sau <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Venus Legacy lucrează asupra pielii și a conturului, iar detoxifierea intravenoasă susține organismul din interior. Împreună, într-un plan stabilit de medic și cu obiceiuri sănătoase, pot contribui la schimbarea pe care o urmărești.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de obiceiuri bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-venus-legacy-detox-obiceiuri', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce face Venus Legacy, ce face detoxifierea intravenoasă și de ce le combinăm la MOA. Cu o listă de obiceiuri utile în timpul tratamentelor și pașii planului personalizat.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
