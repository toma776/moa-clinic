// Versiunea structurată a articolului „Riduri marionetă: cauze și tratamente”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vede linii coborând din colțurile gurii:
// răspunsul scurt → ce sunt și de ce diferă → cauze → opțiunile de tratament → ce se potrivește în funcție de stadiu (file) → la MOA → întrebări.
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
    ['ce-sunt', 'Ce sunt ridurile marionetă'],
    ['cauze', 'De ce apar'],
    ['tratamente', 'Opțiunile de tratament'],
    ['stadiu', 'Ce se potrivește, pe stadii'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce sunt ridurile marionetă?', 'Sunt liniile verticale care pleacă din colțurile gurii și coboară spre bărbie. Seamănă cu liniile de articulare ale păpușilor marionetă, de unde și numele, și pot da feței o expresie tristă sau obosită.'],
    ['La ce vârstă apar?', 'De obicei după 35–40 de ani, la femei și la bărbați. Pot apărea și mai devreme, în funcție de genetică, stil de viață și de cum a fost îngrijită pielea.'],
    ['Dispar cu creme sau dacă îmi schimb obiceiurile?', 'De obicei nu. Ridurile marionetă țin de pierderea volumului, a fermității și de schimbarea poziției țesuturilor, nu doar de suprafața pielii. Îngrijirea zilnică poate încetini procesul, dar pentru estompare e nevoie de un tratament ales la consult.'],
    ['Acidul hialuronic va face fața să arate umflată?', 'Scopul nu este umplerea excesivă, ci echilibrul. Cantitatea și locul injectării se stabilesc după evaluarea feței, astfel încât rezultatul să arate odihnit, nu „injectat”. La bărbați, tehnica urmărește conturul mandibulei fără a feminiza chipul.'],
    ['Pot combina mai multe tratamente?', 'Da, de multe ori o combinație dă un rezultat mai echilibrat: de exemplu acid hialuronic cu botox sau cu un biostimulator. Medicul decide ordinea și dozele după stadiul ridurilor.'],
  ];

  const stadii = [
    ['Fine, abia vizibile', 'Pielea are încă elasticitate, dar are nevoie de sprijin. Intervenția nu trebuie să fie agresivă sau centrată pe volum.', [
      [link('mezoterapie', 'Mezoterapie'), 'nutrienți direct în derm, pentru hidratare și fermitate'],
      [link('skinbooster-vital', 'Skinbooster Vital'), 'îmbunătățește textura și tonusul, fără să schimbe volumul'],
      [`${link('microneedeling', 'Microneedling')} sau ${link('venus-viva', 'Venus Viva')}`, 'stimulează colagenul treptat'],
    ]],
    ['Moderate, vizibile în repaus', 'Pielea începe să piardă volum, iar expresia poate părea încordată sau tristă. Tratamentul combină corectarea cu revitalizarea.', [
      [link('injectari-acid-hialuronic', 'Acid hialuronic'), 'redă volumul și netezește liniile'],
      [link('injectare-botox', 'Botox'), 'relaxează mușchii care trag colțurile gurii în jos'],
      [`${link('polinucleotide', 'Polinucleotide')} sau ${link('sculptra', 'Sculptra')}`, 'susțin regenerarea pielii'],
      [link('dermalinfusion', 'Dermalinfusion'), 'întreținere, pentru o piele hidratată și luminoasă'],
    ]],
    ['Adânci, cu piele lăsată', 'E nevoie de o abordare pe mai multe niveluri, pentru refacerea structurii feței, nu doar de o corecție punctuală.', [
      [link('sculptra', 'Sculptra'), 'biostimulare și colagen nou'],
      [link('harmonyca', 'HArmonyCa'), 'susținere fermă și volum controlat'],
      [link('nefertiti-lift', 'Nefertiti Lift'), 'redefinirea conturului mandibulei'],
      ['Filler și botox combinate', 'pentru o corecție completă, dar naturală; mezoterapia sau Venus Viva pot susține rezultatul'],
    ]],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile marionetă sunt <b>liniile care coboară din colțurile gurii spre bărbie</b> și pot da feței o expresie tristă sau severă.</li>
    <li>Apar de obicei <b>după 35–40 de ani</b>, la femei și la bărbați.</li>
    <li>Nu vin doar din mimică: sunt rezultatul <b>pierderii volumului, a fermității și a coborârii țesuturilor</b>, de aceea cremele obișnuite nu le estompează.</li>
    <li>Opțiunile sunt minim invazive: <b>acid hialuronic, botox, biostimulatori</b> și tratamente pentru calitatea pielii, adesea combinate.</li>
    <li>Ce ți se potrivește depinde de <b>stadiul ridurilor</b> și se stabilește la consult.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile marionetă și de ce sunt diferite</h2>
<p class="ar-first">La început poate nici nu le-ai băgat în seamă. Ai crezut că sunt urme ale unei zile grele. Apoi ai văzut cum se conturează tot mai clar liniile care coboară din colțurile gurii, desenând pe chip o expresie pe care n-ai simțit-o niciodată ca fiind a ta.</p>
<p>Specialiștii le numesc riduri marionetă pentru că seamănă cu liniile de articulare ale păpușilor. Spre deosebire de liniile fine din jurul ochilor sau de ridurile dinamice de pe frunte, ele <b>schimbă conturul feței și simetria zâmbetului</b>.</p>
<p>Sunt adesea confundate cu simpla lăsare a pielii, dar sunt o combinație între piele, mușchi și structura profundă a feței. Această complexitate le face mai greu de tratat, nu imposibil. Dacă vrei imaginea de ansamblu, citește și articolul despre <a href="/nou/riduri/">riduri și metodele de estompare</a>.</p>

<h2 id="cauze">De ce apar ridurile marionetă</h2>
<p>Nu există o singură explicație. Mai mulți factori acționează în același timp, uneori pe nesimțite.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Pierderea volumului</b><p>Grăsimea care susține obrajii și maxilarul se retrage sau coboară, iar oasele feței își modifică volumul. Fără acest sprijin, pielea începe să se plieze.</p></div>
  <div class="rx-card"><i>02</i><b>Mai puțin colagen</b><p>O piele subțiată și deshidratată, cu colagen și elastină reduse, nu mai revine la forma inițială și formează cute permanente.</p></div>
  <div class="rx-card"><i>03</i><b>Mimica</b><p>Zâmbetul, încruntarea și mușchii care trag colțurile gurii în jos nu sunt cauza principală, dar pot grăbi procesul pe o piele slăbită.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Ce accelerează procesul</span>
  <ul class="rx-chips rx-chips-neg"><li>fumatul</li><li>stresul cronic</li><li>alimentația dezechilibrată</li><li>lipsa odihnei</li><li>soarele fără protecție</li></ul>
</div>
<p>De aceea, un tratament pentru ridurile marionetă nu corectează doar linia de la suprafață, ci ține cont de cauză.</p>

<h2 id="tratamente">Opțiunile de tratament</h2>
<p>Odată formate, aceste linii nu dispar de la sine. Opțiunile folosite sunt minim invazive și se adaptează severității, structurii feței și calității pielii.</p>
<div class="rx-two">
  <div><h3>Pentru volum și susținere</h3><ul>
    <li>${link('injectari-acid-hialuronic', '<b>Acid hialuronic</b>')}: redă volumul pierdut și susține pielea, cu accent pe echilibru, nu pe umplere</li>
    <li>${link('harmonyca', '<b>HArmonyCa</b>')}: acid hialuronic cu hidroxiapatită de calciu, pentru volum și un ușor efect de lifting</li>
    <li>${link('sculptra', '<b>Sculptra</b>')}: biostimulator care determină pielea să-și refacă propriul colagen; acționează lent, în profunzime</li>
  </ul></div>
  <div><h3>Pentru mușchi și contur</h3><ul>
    <li>${link('injectare-botox', '<b>Toxina botulinică</b>')}: relaxează mușchii care trag colțurile gurii în jos, când expresia pare încordată, iar pielea nu s-a lăsat mult</li>
    <li>${link('nefertiti-lift', '<b>Nefertiti Lift</b>')}: relaxează mușchii care trag în jos conturul inferior al feței, pentru o linie a mandibulei mai definită</li>
  </ul></div>
</div>
<div class="rx-two">
  <div><h3>Pentru calitatea pielii</h3><ul>
    <li>${link('skinbooster-vital', '<b>Skinbooster Vital</b>')}: acid hialuronic foarte fluid, care nu umple, ci îmbunătățește hidratarea și elasticitatea</li>
    <li>${link('polinucleotide', '<b>Polinucleotide</b>')} și ${link('mezoterapie', '<b>mezoterapie</b>')}: susțin regenerarea, elasticitatea și hidratarea, mai ales la început</li>
  </ul></div>
  <div><h3>Pentru textură și tonus</h3><ul>
    <li>${link('microneedeling', '<b>Microneedling</b>')}: micro-canale care stimulează colagenul</li>
    <li>${link('venus-viva', '<b>Venus Viva</b>')}: radiofrecvență fracționată, pentru tonifiere și netezire</li>
    <li>${link('dermalinfusion', '<b>Dermalinfusion</b>')}: curăță, exfoliază și infuzează seruri în piele</li>
  </ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Tratamentele pentru calitatea pielii nu au efect de umplere; ajută la întreținere sau în fazele de început. Rezultatul fillerelor e vizibil imediat, al biostimulatorilor apare treptat. Cât de mult se estompează liniile diferă de la o persoană la alta, de aceea planul se face după evaluare.</p></aside>

<h2 id="stadiu">Ce tratament se potrivește, în funcție de stadiu</h2>
<p>Alege stadiul care seamănă cu ce vezi în oglindă. Sunt direcții generale; fiecare ten este diferit, iar recomandarea finală o face medicul.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    ${stadii.map(([t], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}">${esc(t)}</button>`).join('\n    ')}
  </div>
  ${stadii.map(([, d, l], i) => `<div class="rx-panel" data-panel="${i}"${i ? ' hidden' : ''}><p>${esc(d)}</p><ul>${l.map(([n, x]) => `<li><b>${n}</b>: ${esc(x)}</li>`).join('')}</ul></div>`).join('\n  ')}
</div>

<h2 id="la-moa">Tratamentul ridurilor marionetă la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul analizează anatomia feței, tonusul pielii, stadiul ridurilor și ce îți dorești. Se decide dacă un tratament e suficient sau dacă e nevoie de o combinație.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Tratamentul ales se face în clinică, dozat astfel încât rezultatul să arate proaspăt și echilibrat.</p>${pret('injectari-acid-hialuronic') ? `<em>Acid hialuronic · de la ${lei(pret('injectari-acid-hialuronic'))}</em>` : ''}${pret('nefertiti-lift') ? `<em>Nefertiti Lift · ${lei(pret('nefertiti-lift'))}</em>` : ''}${pret('sculptra') ? `<em>Sculptra, o fiolă · ${lei(pret('sculptra'))}</em>` : ''}</li>
  <li><b>După</b><p>Primești recomandările de îngrijire pentru zilele următoare.</p></li>
  <li><b>Reevaluarea</b><p>Medicul urmărește rezultatul și propune, dacă e cazul, tratamente de întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>, <a href="/nou/riduri-in-jurul-gurii/">ridurile din jurul gurii</a> și <a href="/nou/tratament-riduri-profunde/">tratamentul ridurilor profunde</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Ridurile marionetă nu îți definesc personalitatea, dar pot schimba felul în care te simți. Nu e nici prea devreme, nici prea târziu să le discuți cu un medic care te ascultă și îți evaluează corect fața.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu opțiunile de tratament în funcție de stadiul ridurilor
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
    lede: 'De ce apar liniile care coboară din colțurile gurii, prin ce diferă de alte riduri și ce tratamente se potrivesc în funcție de stadiu, cu pașii de la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
