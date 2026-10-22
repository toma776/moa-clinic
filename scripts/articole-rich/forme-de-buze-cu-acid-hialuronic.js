// Versiunea structurată a articolului „Forme de buze cu acid hialuronic: ce nu ți-a spus nimeni”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la o augmentare de buze:
// răspunsul scurt → de ce acid hialuronic → ce transmit trăsăturile buzelor → cele 6 forme (file) → cum alegi → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const pBuze = pret('augmentare-buze');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['de-ce', 'De ce acid hialuronic'],
    ['ce-spun', 'Ce transmit buzele'],
    ['forme', 'Cele 6 forme populare'],
    ['cum-alegi', 'Cum alegi forma potrivită'],
    ['la-moa', 'Augmentarea la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce formă de buze mi se potrivește?', 'Depinde de trăsăturile feței, de forma și proporțiile buzelor tale și de ce îți dorești. Medicul analizează chipul la consult, îți explică ce variante au sens și alegeți împreună.'],
    ['Cât durează efectul acidului hialuronic în buze?', 'De obicei între 6 și 12 luni. Durata depinde de organism, de stilul de viață și de cantitatea folosită.'],
    ['Rezultatul este reversibil?', `Da. Efectul se reduce treptat în câteva luni, iar tu decizi dacă îl menții. La nevoie, acidul hialuronic poate fi dizolvat cu o enzimă numită hialuronidază.`],
    ['Pot cere o formă văzută pe rețelele sociale?', 'Poți discuta orice idee cu medicul. O formă care nu se potrivește chipului poate avea însă efectul opus celui dorit, așa că medicul îți va spune sincer dacă se potrivește trăsăturilor tale.'],
    ['Buzele vor arăta naturale?', 'Aspectul rămâne natural atunci când cantitatea de acid hialuronic este potrivită și forma respectă proporțiile feței. Scopul este să îți pună în valoare trăsăturile, nu să le schimbe.'],
    ['Ce trebuie să fac după procedură?', 'Hidratează-te bine și evită expunerea excesivă la soare. Medicul îți dă recomandări clare pentru primele zile.'],
  ];

  const forme = [
    ['Russian Lips', 'Volum în zona centrală a buzelor, cu o curbă delicată, asemănătoare unei inimi.', 'Persoanele cu buze subțiri care vor un plus subtil de volum, fără să-și schimbe trăsăturile.'],
    ['DaVinci Lips', 'Echilibru între buza superioară și cea inferioară, în armonie cu proporțiile feței.', 'Cine vrea un rezultat clasic, care pune în valoare trăsăturile fără să exagereze.'],
    ['Keyhole Lips', 'Un spațiu mic între buza superioară și cea inferioară, pentru un aspect modern.', 'Cine vrea să iasă din tipare și să-și exprime individualitatea.'],
    ['Butterfly Lips', 'Urmărește conturul natural al buzelor, cu un volum moderat și un aspect rafinat.', 'Cine vrea să păstreze naturalețea, dar să accentueze finețea buzelor.'],
    ['În formă de inimă', 'Arcul lui Cupidon bine definit și un contur precis, pentru mai multă expresivitate.', 'Cine își dorește un aspect dulce, dar care se observă.'],
    ['Volum în centru', 'Volum concentrat în mijlocul buzelor, pentru un aspect plin, dar armonios.', 'Cine vrea mai multă senzualitate, fără exagerări.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Acidul hialuronic poate da buzelor <b>volum, contur și simetrie</b>, cu un aspect natural atunci când cantitatea este potrivită.</li>
    <li>Efectul este <b>reversibil</b> și durează de obicei <b>6–12 luni</b>; substanța există deja în organism și este, în general, bine tolerată.</li>
    <li>Cele mai cerute forme sunt <b>Russian, DaVinci, Keyhole, Butterfly, în formă de inimă și cu volum în centru</b>; fiecare pune accentul pe altceva.</li>
    <li>Forma se alege după <b>trăsăturile feței</b>, nu după tendințe; o formă nepotrivită poate avea efectul opus.</li>
    <li>La MOA, totul începe cu <b>o consultație dermato-estetică</b>${pBuze ? `; augmentarea buzelor pornește de la ${lei(pBuze)}` : ''}.</li>
  </ul>
</section>

<h2 id="de-ce">De ce acid hialuronic pentru buze</h2>
<p class="ar-first">Poate buzele tale s-au subțiat în timp, sunt ușor asimetrice sau pur și simplu îți dorești un plus de volum și contur. Oricare ar fi motivul, acidul hialuronic îți poate pune în valoare buzele fără să pierzi ceea ce te face pe tine. Totul ține de cantitate, de experiența medicului și de ce îți dorești cu adevărat.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Aspect natural și reversibil</b><p>Cu o cantitate potrivită, buzele arată natural. Efectul se reduce treptat în câteva luni, iar tu alegi dacă îl menții.</p></div>
  <div class="rx-card"><i>02</i><b>Compatibil cu organismul</b><p>Acidul hialuronic există deja în corp, unde menține hidratarea și elasticitatea pielii, așa că este, în general, bine tolerat.</p></div>
  <div class="rx-card"><i>03</i><b>Întreținere simplă</b><p>Rezultatele durează de obicei 6–12 luni. După procedură, ai grijă la hidratare și evită expunerea excesivă la soare.</p></div>
</div>

<h2 id="ce-spun">Ce transmit trăsăturile buzelor</h2>
<p>Buzele fac parte din expresia feței și influențează felul în care ești percepută. Trei trăsături contează când se discută forma:</p>
<div class="rx-two">
  <div><h3>Simetria</h3><ul><li>buzele simetrice dau impresia de echilibru</li><li>transmit încredere și maturitate</li><li>o simetrie delicată dă un aer sofisticat</li></ul></div>
  <div><h3>Volumul și conturul</h3><ul><li>o buză inferioară mai plină este percepută ca senzuală și caldă</li><li>un arc al lui Cupidon bine definit adaugă eleganță</li><li>un arc conturat armonios face expresiile mai vii</li></ul></div>
</div>

<h2 id="forme">Cele 6 forme populare de buze cu acid hialuronic</h2>
<p>Alege o formă din file ca să vezi pe ce pune accentul și cui i se potrivește de obicei. Decizia finală se ia împreună cu medicul.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    ${forme.map(([n], i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}" data-tab="${i}">${esc(n)}</button>`).join('')}
  </div>
  ${forme.map(([n, ce, cui], i) => `<div class="rx-panel" data-panel="${i}"${i ? ' hidden' : ''}><p><b>${esc(n)}.</b> ${esc(ce)}</p><p><b>Se potrivește de obicei pentru:</b> ${esc(cui)}</p></div>`).join('')}
</div>
<p class="rx-links">Vrei să compari două dintre ele în detaliu? Citește despre <a href="/nou/russian-lips-vs-butterfly-lips/">Russian lips și Butterfly lips</a>.</p>

<h2 id="cum-alegi">Cum alegi forma potrivită pentru fizionomia ta</h2>
<p>Forma pe care o alegi trebuie să te reprezinte și să te facă să te simți bine. Trei lucruri te ajută să decizi:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Analiza trăsăturilor</b><p>Nu toate formele se potrivesc oricui. Așa cum o coafură se alege după forma feței, și forma buzelor se alege după proporțiile chipului.</p></div>
  <div class="rx-card"><i>02</i><b>Consultul cu medicul</b><p>Medicul analizează chipul în detaliu, îți recomandă o formă și îți explică de ce. Tu alegi apoi în funcție de ce îți dorești.</p></div>
  <div class="rx-card"><i>03</i><b>Tendințe fără exagerări</b><p>O formă la modă, dar nepotrivită chipului, poate respinge în loc să atragă. O formă naturală și o cantitate potrivită dau un rezultat armonios.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Fotografiile și denumirile formelor te ajută să-ți clarifici ce îți dorești, dar rezultatul depinde de anatomia buzelor tale. Aceeași tehnică arată diferit pe persoane diferite. De aceea, la consult discuți ce este realist pentru tine, înainte de orice injectare.</p></aside>

<h2 id="la-moa">Augmentarea buzelor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultația dermato-estetică</b><p>O discuție relaxată în care medicul îți ascultă dorințele, analizează buzele și chipul, răspunde la întrebări și îți explică toate etapele.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Alegerea formei</b><p>Stabiliți împreună forma și cantitatea de acid hialuronic, astfel încât rezultatul să se potrivească trăsăturilor tale.</p></li>
  <li><b>Procedura</b><p>Medicul injectează acidul hialuronic după planul stabilit, cu atenție la simetrie și proporții.</p>${pBuze ? `<em>Augmentare buze · de la ${lei(pBuze)}</em>` : ''}</li>
  <li><b>După procedură</b><p>Primești recomandări pentru primele zile, iar la nevoie medicul discută cu tine o ajustare sau momentul următoarei ședințe.</p></li>
</ol>
<p class="rx-links">Înainte de programare, poate te ajută ghidul pentru <a href="/nou/prima-injectare-cu-acid-hialuronic-in-buze/">prima injectare cu acid hialuronic în buze</a>, articolul despre <a href="/nou/acid-hialuronic-in-buze-cat-dureaza/">cât durează efectul</a> sau ${link('augmentare-buze', 'pagina tratamentului de augmentare a buzelor')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Forma potrivită este cea care te pune în valoare și în care te recunoști. Dacă te gândești la o augmentare, primul pas este o discuție cu medicul, în care alegeți împreună ce ți se potrivește.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru cele 6 forme de buze
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
    lede: 'De ce se alege acidul hialuronic pentru buze, ce înseamnă fiecare dintre cele 6 forme populare și cum alegi una potrivită chipului tău. Cu pașii augmentării la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 6,
  };
};
