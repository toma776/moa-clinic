// Versiunea structurată a articolului „Riduri și metode de estompare”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vrea să înțeleagă ce poate face cu ridurile:
// răspunsul scurt → ce sunt → cauze → tipuri (file) → zone → tratamente → ghid de combinare → la MOA → întrebări.
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
    ['ce-sunt', 'Ce sunt ridurile'],
    ['cauze', 'De ce apar'],
    ['tipuri', 'Tipuri de riduri'],
    ['zone', 'Frunte, ochi, gură'],
    ['tratamente', 'Tratamente pentru riduri'],
    ['combinare', 'Ce alegi, pe scurt'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De la ce vârstă apar ridurile?', 'Procesul începe lent, de la 25–30 de ani, când scade nivelul de colagen, elastină și acid hialuronic din piele. Devine vizibil de obicei în jurul vârstei de 35–40 de ani, mai ales dacă pielea nu e îngrijită corespunzător.'],
    ['Cremele antirid șterg ridurile?', 'Nu pe cele adânci. Cremele cu retinol, peptide, antioxidanți sau acid hialuronic pot preveni accentuarea ridurilor și pot menține pielea hidratată și elastică. Pentru ridurile deja instalate, ele sunt un sprijin, nu soluția în sine.'],
    ['Cât durează efectul botoxului?', 'Efectul apare în câteva zile și durează de regulă câteva luni, cu posibilitatea de retușuri la recomandarea medicului. Botoxul relaxează mușchii, dar nu redă volumul și nu corectează pielea lăsată.'],
    ['Care e diferența dintre acidul hialuronic și Sculptra?', 'Acidul hialuronic umple și netezește, cu efect imediat. Sculptra este un biostimulator pe bază de acid polilactic: stimulează pielea să își refacă treptat propriul colagen.'],
    ['Pot preveni ridurile de compresie?', 'Da, în mare parte prin obiceiuri: o față de pernă din mătase, alternarea poziției de somn și hidratarea constantă a pielii pot preveni agravarea lor.'],
    ['Am nevoie de operație?', 'Nu neapărat. Există tratamente minim invazive, cu recuperare scurtă, care pot îmbunătăți aspectul pielii fără bisturiu. Ce ți se potrivește stabilește medicul la consult.'],
  ];

  const tipuri = [
    ['De expresie', 'Apar unde mimica e intensă: în jurul ochilor, între sprâncene, pe frunte, la colțurile gurii. La început dispar când fața se relaxează, apoi rămân vizibile și în repaus.', `Tratamentele care relaxează musculatura, precum ${link('injectare-botox', 'toxina botulinică')}, pot avea și rol de prevenție.`],
    ['Gravitaționale', 'Apar odată cu pierderea fermității și a volumului din structurile profunde. Le recunoști după aspectul de „lăsare”: colțurile gurii coborâte, ovalul feței mai puțin definit, piele care atârnă ușor pe obraji, mandibulă și gât.', `Răspund la tratamente de volumizare și redensificare: ${link('sculptra', 'Sculptra')}, ${link('harmonyca', 'HArmonyCa')} sau ${link('injectari-acid-hialuronic', 'acid hialuronic')} injectat strategic.`],
    ['Elastice', 'Apar pe pielea subțire, expusă ani la rând la soare, noxe sau deshidratare: obraji, jurul gurii, gât, decolteu. Arată ca niște linii fine care „șifonează” pielea.', `Ajută tratamentele care reactivează colagenul și hidratează în profunzime: ${link('skinbooster-vital', 'Skinbooster Vital')}, ${link('mezoterapie', 'mezoterapie')} sau ${link('polinucleotide', 'polinucleotide')}.`],
    ['De compresie', 'Se formează din poziția în somn, mai ales dacă dormi mereu pe aceeași parte sau cu fața în pernă. Pliurile de dimineață ajung, în timp, să nu mai dispară. Apar pe obraji, tâmple și piept.', 'Contează obiceiurile: față de pernă din mătase, alternarea poziției de somn și hidratarea constantă.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile apar când pielea pierde <b>colagen, elastină și acid hialuronic</b>, adică fermitatea și capacitatea de a reveni la forma inițială.</li>
    <li>Cauzele sunt mai multe: <b>vârsta, soarele, mimica, fumatul, poluarea, somnul puțin, deshidratarea</b> și pierderea volumului feței.</li>
    <li>Nu toate ridurile sunt la fel: <b>de expresie, gravitaționale, elastice, de compresie</b>. Tipul contează la alegerea tratamentului.</li>
    <li>Cremele pot <b>preveni accentuarea</b>, dar nu șterg ridurile adânci.</li>
    <li>Tratamentele minim invazive (botox, acid hialuronic, biostimulatori, microneedling, mezoterapie) se aleg și se combină <b>la consult</b>, după tipul și adâncimea ridurilor.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile</h2>
<p class="ar-first">Ai momente în care te uiți în oglindă și simți că chipul tău nu mai spune aceeași poveste? Obrajii nu mai sunt la fel de fermi, în jurul ochilor au apărut linii care nu dispar după un somn bun, iar cei din jur te întreabă dacă ești obosit(ă), deși tu te simți bine.</p>
<p>Ridurile nu apar peste noapte. Din punct de vedere dermatologic, sunt pliuri, linii sau adâncituri care apar pe măsură ce pielea își pierde elasticitatea și densitatea. Structura internă a pielii, formată din colagen, elastină și acid hialuronic natural, se degradează, iar pielea devine mai subțire, mai fragilă și nu mai revine la forma inițială după ce este întinsă.</p>
<p>La început apar ca linii fine, aproape invizibile în lumină slabă, apoi se adâncesc și se instalează în zone precum colțul ochilor, fruntea, conturul gurii și gâtul.</p>

<h2 id="cauze">De ce apar ridurile</h2>
<p>Unii oameni au linii vizibile de la 30 de ani, alții au pielea netedă și la 45. Diferența nu ține doar de genetică, ci și de cum a fost tratată pielea în timp.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Vârsta</b><p>Scade nivelul de colagen, elastină și acid hialuronic. Procesul începe de la 25–30 de ani și devine vizibil în jurul vârstei de 35–40.</p></div>
  <div class="rx-card"><i>02</i><b>Soarele</b><p>Razele UV degradează colagenul și subțiază pielea, mai ales pe frunte, obraji, gât și mâini.</p></div>
  <div class="rx-card"><i>03</i><b>Mimica</b><p>Zâmbetul, încruntarea, strânsul ochilor lasă urme care la început dispar în câteva secunde, apoi rămân.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Alți factori care accentuează ridurile</span>
  <ul class="rx-chips rx-chips-neg"><li>fumatul</li><li>poluarea</li><li>lipsa somnului</li><li>stilul de viață dezordonat</li><li>deshidratarea</li><li>produsele agresive</li><li>pierderea volumului feței</li></ul>
</div>
<p>Fumatul reduce oxigenarea pielii și favorizează liniile verticale din jurul gurii. Poluarea întreține o inflamație cronică. Somnul puțin lasă pielea fără timp de reparare. Iar odată cu vârsta scade volumul din obraji, tâmple și linia maxilarului, iar contururile devin mai puțin definite.</p>

<h2 id="tipuri">Tipuri de riduri</h2>
<p>Liniile de pe chip au forme, adâncimi și cauze diferite. Alege un tip ca să vezi cum îl recunoști și ce îl ajută.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    ${tipuri.map(([t], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}">${esc(t)}</button>`).join('\n    ')}
  </div>
  ${tipuri.map(([, d, t], i) => `<div class="rx-panel" data-panel="${i}"${i ? ' hidden' : ''}><p>${esc(d)}</p><p><b>Ce poate ajuta:</b> ${t}</p></div>`).join('\n  ')}
</div>

<h2 id="zone">Ridurile de pe frunte, din jurul ochilor și al gurii</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Fruntea</b><p>Linii orizontale, din ridicarea sprâncenelor, și verticale („11”), din încruntare. Botoxul poate relaxa zona fără să blocheze expresia; în cazurile avansate se poate completa cu acid hialuronic. Detalii în articolul despre <a href="/nou/riduri-frunte/">ridurile de pe frunte</a>.</p></div>
  <div class="rx-card"><i>02</i><b>Ochii</b><p>„Laba gâștei” apare în colțul extern al ochilor, pe o piele foarte subțire. Ajută hidratarea, produsele cu peptide, retinol sau vitamina C și, la nevoie, microneedlingul fin sau mezoterapia perioculară.</p></div>
  <div class="rx-card"><i>03</i><b>Gura</b><p>Liniile verticale de deasupra buzei apar și la nefumători: din mimică sau din folosirea paiului. Acidul hialuronic, polinucleotidele sau skinboosterele pot reda suplețea. Vezi și <a href="/nou/riduri-in-jurul-gurii/">ridurile din jurul gurii</a>.</p></div>
</div>

<h2 id="tratamente">Tratamente pentru riduri</h2>
<p>Tratamentul se alege după ce știi ce tip de riduri ai, cât de adânci sunt și ce zone vrei să îmbunătățești. O schemă bună combină îngrijirea zilnică cu proceduri minim invazive.</p>
<div class="rx-two">
  <div><h3>Creme și ingrediente active</h3><ul><li><b>retinol / retinoizi</b> (seara), pentru stimularea colagenului</li><li><b>peptide</b>, pentru reparare</li><li><b>vitaminele C și E</b>, antioxidanți</li><li><b>acizi blânzi</b> (AHA, PHA) în concentrații mici</li><li><b>acid hialuronic</b>, pentru hidratarea stratului superficial</li></ul></div>
  <div><h3>Peeling chimic și dermabraziune</h3><ul><li>peelingul aplică substanțe active (acid glicolic, TCA) care îndepărtează controlat stratul superficial</li><li>dermabraziunea „șlefuiește” mecanic epiderma; e utilă pentru riduri fine și cicatrici superficiale</li><li>ambele cer o perioadă de refacere și protecție solară strictă și nu se potrivesc pielii foarte subțiri fără precauții</li></ul></div>
</div>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Relaxarea mușchilor</b><p>${link('injectare-botox', 'Toxina botulinică')} blochează semnalul nervos care contractă mușchiul, iar pielea de deasupra se netezește. Potrivită pentru frunte, între sprâncene și colțul ochilor. Nefertiti Lift folosește același principiu pe mușchiul gâtului, pentru conturul mandibulei.</p></div>
  <div class="rx-card"><i>02</i><b>Volum și hidratare</b><p>${link('injectari-acid-hialuronic', 'Acidul hialuronic')} netezește ridurile și conturează trăsăturile. ${link('skinbooster-vital', 'Skinbooster Vital')} redă elasticitatea. ${link('harmonyca', 'HArmonyCa')} oferă volum și stimulează colagenul.</p></div>
  <div class="rx-card"><i>03</i><b>Regenerare</b><p>${link('microneedeling', 'Microneedlingul cu Dermapen 4')}, ${link('mezoterapie', 'mezoterapia')}, ${link('polinucleotide', 'polinucleotidele')} și ${link('sculptra', 'Sculptra')} stimulează pielea să producă colagen și să se refacă din interior.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Botoxul nu reface volumul și nu corectează pielea lăsată, iar fillerele nu relaxează mușchii. De aceea, de multe ori se combină. Cât de vizibil e rezultatul și cât durează diferă de la o persoană la alta; nu există un tratament unic care să funcționeze la fel pentru toată lumea.</p></aside>

<h2 id="combinare">Ce alegi, pe scurt</h2>
<div class="rx-compare">
  <div class="rx-col"><small>Riduri fine</small><b>Calitatea pielii</b><dl><dt>Acasă</dt><dd>creme cu ingrediente active, SPF</dd><dt>În clinică</dt><dd>microneedling, mezoterapie, Skinbooster Vital</dd></dl></div>
  <div class="rx-col"><small>Riduri de expresie</small><b>Relaxarea mușchilor</b><dl><dt>În clinică</dt><dd>toxina botulinică</dd><dt>Zone delicate</dt><dd>microneedling, mezoterapie cu polinucleotide</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Riduri persistente</small><b>Volum și structură</b><dl><dt>Fillere</dt><dd>acid hialuronic, HArmonyCa</dd><dt>Biostimulatori</dt><dd>Sculptra</dd></dl></div>
</div>

<h2 id="la-moa">Tratamentul ridurilor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul stabilește ce tip de riduri ai, cât de adânci sunt și ce zone te deranjează, apoi îți propune un plan.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Tratamentul sau combinația aleasă, cu recuperare scurtă și fără bisturiu.</p>${pret('injectare-botox') ? `<em>Botox · de la ${lei(pret('injectare-botox'))}</em>` : ''}${pret('injectari-acid-hialuronic') ? `<em>Acid hialuronic · de la ${lei(pret('injectari-acid-hialuronic'))}</em>` : ''}${pret('microneedeling') ? `<em>Microneedling Dermapen · de la ${lei(pret('microneedeling'))}</em>` : ''}</li>
  <li><b>După</b><p>Protecție solară, rutina de îngrijire potrivită și recomandările specifice procedurii.</p></li>
  <li><b>Reevaluarea</b><p>Medicul verifică rezultatul și propune, la nevoie, retușuri sau tratamente de întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>, <a href="/nou/riduri-marioneta/">ridurile marionetă</a>, <a href="/nou/riduri-laba-gastei/">laba gâștei</a> sau vezi <a href="/nou/preturi/">lista de prețuri</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Nu există un tratament-minune pentru riduri, ci un plan gândit pentru tine, care ține cont de cauză, nu doar de linia de la suprafață. Poți începe cu pași mici, cu o rutină corectă acasă, sau cu o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru tipurile de riduri
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
    lede: 'Ce sunt ridurile, de ce apar, cum recunoști tipul lor și ce tratamente se potrivesc fiecăruia, de la creme până la procedurile minim invazive de la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
