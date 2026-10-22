// Versiunea structurată a articolului „Ridurile fumătorului – soluții de tratament”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva deranjat de liniile de deasupra buzei:
// răspunsul scurt → de ce apar → ce opțiuni are (file cu tratamentele) → cum le previne → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const pN = (sid, re) => (serv[sid]?.preturi || []).find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const nctf = pN('mezoterapie', /NCTF/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt ridurile fumătorului'],
    ['cauze', 'De ce apar'],
    ['optiuni', 'Ce opțiuni de tratament ai'],
    ['prevenire', 'Cum le previi'],
    ['dupa', 'Îngrijirea după tratament'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Apar ridurile fumătorului doar la cei care fumează?', 'Nu. Fumatul le favorizează, dar liniile verticale de deasupra buzei apar și din mișcările repetitive ale buzelor, expunerea la soare, deshidratare, genetică și înaintarea în vârstă. Le au și persoanele care vorbesc mult prin natura profesiei sau muzicienii care cântă la instrumente de suflat.'],
    ['Pot scăpa de ele doar cu remedii naturale?', 'Îngrijirea acasă poate ajuta doar în stadiile incipiente, când liniile sunt foarte fine. Ridurile mai adânci pot fi diminuate prin tratamente făcute de medic, stabilite după consult.'],
    ['Dispar complet după tratament?', 'Nu. Ridurile nu dispar, dar pot fi atenuate vizibil, iar pielea poate arăta mai netedă. Rezultatul diferă de la o persoană la alta și depinde de tipul de piele, de profunzimea liniilor și de stilul de viață.'],
    ['Câte ședințe de skinbooster sunt necesare?', 'De regulă se discută un protocol de 2–3 ședințe, în funcție de cât de deshidratată este pielea și de calitatea ei. Efectul se menține, de obicei, câteva luni.'],
    ['Ce faci după un tratament injectabil?', 'Urmezi recomandările primite de la medic: eviți soarele puternic și antrenamentele intense câteva zile și aplici doar cremele prescrise.'],
    ['Merită să renunț la fumat dacă am deja riduri?', 'Da. Nu este niciodată prea târziu. Substanțele din tutun accelerează pierderea colagenului, iar renunțarea ajută pielea să își păstreze mai bine rezultatele tratamentelor.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>„Ridurile fumătorului”, numite și <b>„coduri de bare”</b>, sunt liniile verticale fine de deasupra buzei superioare.</li>
    <li>Nu apar doar din fumat: contează și <b>mișcările repetitive ale buzelor, soarele, deshidratarea, genetica și vârsta</b>.</li>
    <li>Nu dispar complet, dar pot fi <b>atenuate</b> prin tratamente precum toxina botulinică, skinboosterele sau mezoterapia, alese după consult.</li>
    <li>Renunțarea la fumat, <b>protecția solară și hidratarea</b> ajută pielea să își păstreze rezultatele.</li>
    <li>La MOA, planul începe cu <b>o evaluare a pielii</b>; uneori se recomandă o combinație de tratamente, nu unul singur.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile fumătorului</h2>
<p class="ar-first">Acele linii verticale fine de deasupra buzei superioare pot schimba felul în care îți vezi zâmbetul, indiferent dacă ai fumat vreodată sau nu. Deși numele sugerează o singură cauză, ele sunt rezultatul mai multor factori, iar unul dintre ei ține de mișcările mici, repetate zilnic, care în timp își lasă amprenta pe piele.</p>
<p>Ca să fim sinceri de la început: timpul nu poate fi oprit, iar ridurile nu vor dispărea. Folosind metodele potrivite, le poți însă <b>diminua vizibil</b>, iar pielea din jurul buzelor poate arăta mai netedă.</p>

<h2 id="cauze">De ce apar</h2>
<p>Pielea din jurul gurii este foarte subțire. Când structura ei de susținere, colagenul și elastina, slăbește, se încrețește mai ușor sub presiunea mișcărilor repetitive, cum sunt gestul de a fuma sau de a bea cu paiul.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Fumatul</b><p>La fiecare țigară, mușchii din jurul buzelor se contractă. În plus, substanțele din tutun accelerează descompunerea colagenului și elastinei, iar pielea devine ternă și se marchează mai repede.</p></div>
  <div class="rx-card"><i>02</i><b>Soarele și deshidratarea</b><p>Expunerea îndelungată la soare afectează colagenul. Când celulele nu au destulă apă, pielea își pierde densitatea, devine rigidă și nu mai revine ușor la forma inițială după ce zâmbești sau vorbești.</p></div>
  <div class="rx-card"><i>03</i><b>Mișcarea, genetica, vârsta</b><p>Liniile apar și la cei care vorbesc mult prin natura profesiei, la muzicienii care cântă la instrumente de suflat sau la persoanele cu pielea subțire. Unii oameni sunt predispuși genetic, iar vârsta contează la toată lumea.</p></div>
</div>
<p>Dacă te deranjează și liniile dintre sprâncene, care pot da impresia de încruntare, găsești detalii în articolul despre <a href="/nou/riduri-intre-sprancene/">ridurile dintre sprâncene</a>.</p>

<h2 id="optiuni">Ce opțiuni de tratament ai</h2>
<p>Remediile naturale ajută doar când liniile sunt foarte fine. Pentru ridurile mai adânci există tratamente făcute de medic, care acționează diferit: unele relaxează mușchiul, altele îmbunătățesc calitatea pielii. Alege o filă ca să vezi pe scurt ce face fiecare.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Toxina botulinică</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Skinboostere</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Mezoterapie NCTF</button>
    <button type="button" role="tab" aria-selected="false" data-tab="3">Dermalinfusion</button>
    <button type="button" role="tab" aria-selected="false" data-tab="4">Perfuzie cu glutation</button>
  </div>
  <div class="rx-panel" data-panel="0"><p>Toxina botulinică blochează semnalele nervoase către anumiți mușchi faciali, îi relaxează și reduce contracțiile care marchează pielea. Efectul este temporar. Procedura este minim invazivă și, de obicei, nu necesită timp de recuperare.</p><ul class="rx-chips"><li>frunte</li><li>între sprâncene</li><li>„laba gâștei”</li><li>colțurile gurii</li></ul><p>${link('injectare-botox', 'Despre tratamentul cu toxină botulinică')}${pret('injectare-botox') ? ` · de la ${lei(pret('injectare-botox'))}` : ''}</p></div>
  <div class="rx-panel" data-panel="1" hidden><p>Potrivite când liniile nu sunt foarte adânci, dar pielea din jurul buzelor și-a pierdut hidratarea și elasticitatea. Spre deosebire de fillerele clasice, nu adaugă volum, ci lucrează asupra calității pielii:</p><ul class="rx-chips"><li>hidratează dermul</li><li>susțin colagenul și elastina</li><li>îmbunătățesc textura</li><li>nu schimbă forma buzelor</li></ul><p>De regulă se recomandă 2–3 ședințe, iar efectul se menține, de obicei, câteva luni. ${link('skinbooster-vital', 'Despre Skinbooster Restylane')}${pret('skinbooster-vital') ? ` · de la ${lei(pret('skinbooster-vital'))}` : ''}</p></div>
  <div class="rx-panel" data-panel="2" hidden><p>Nu „umple” ridurile, ci îmbunătățește calitatea pielii. Soluția NCTF conține acid hialuronic nereticulat, vitamine, aminoacizi, minerale și antioxidanți. În zona din jurul gurii se recomandă mai ales:</p><ul class="rx-chips"><li>pentru pielea subțire, ternă sau deshidratată</li><li>ca întreținere după toxina botulinică sau skinboostere</li></ul><p>${link('mezoterapie', 'Despre mezoterapie')}${nctf ? ` · ${lei(nctf)}` : ''}</p></div>
  <div class="rx-panel" data-panel="3" hidden><p>Un tratament non-invaziv care face trei lucruri deodată: exfoliază, curăță porii de impurități și sebum în exces și infuzează seruri active. Este folosit pentru curățarea și hidratarea pielii și ca pregătire înaintea procedurilor injectabile.</p><p>${link('dermalinfusion', 'Despre Dermalinfusion')}${pret('dermalinfusion') ? ` · de la ${lei(pret('dermalinfusion'))}` : ''}</p></div>
  <div class="rx-panel" data-panel="4" hidden><p>Glutationul este un antioxidant pe care corpul îl produce singur, dar ale cărui rezerve scad cu vârsta, poluarea și stresul. Administrat în perfuzie, ajunge direct în sânge, fără să treacă prin digestie, și poate susține luminozitatea pielii. Nu se recomandă în sarcină, alăptare, alergii la componente sau boli respiratorii, renale ori hepatice severe.</p><p>${link('glutation', 'Despre perfuziile cu glutation')}${pret('glutation') ? ` · de la ${lei(pret('glutation'))}` : ''}</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Fiecare tratament acționează asupra unei cauze diferite, iar rezultatul depinde de tipul de piele, de cât de adânci sunt liniile și de stilul de viață. De multe ori soluția este o combinație stabilită după consult, nu un singur produs. Pentru șanțurile dintre nas și gură sau pentru volumul pomeților, medicul poate discuta și ${link('injectari-acid-hialuronic', 'fillerele cu acid hialuronic')}.</p></aside>

<h2 id="prevenire">Cum le previi</h2>
<p>Medicina estetică îți dă un punct de pornire, dar alegerile de zi cu zi influențează cât de repede îmbătrânește pielea și cât țin rezultatele.</p>
<div class="rx-two">
  <div><h3>Ce ajută</h3><ul><li><b>Renunțarea la fumat</b>, sau să nu începi. Nu este niciodată prea târziu, pielea se poate regenera dacă îi dai ocazia.</li><li><b>Hidratarea</b>: ține o sticlă de apă la îndemână și bea puțin, des, pe parcursul zilei.</li><li><b>Protecția solară</b>: razele UV descompun colagenul mai repede decât trecerea timpului.</li><li><b>Alimentația</b>: fructe de pădure, legume cu frunze verzi, nuci și pește, surse de antioxidanți și Omega-3.</li></ul></div>
  <div><h3>Ce accelerează ridurile</h3><ul class="rx-chips rx-chips-neg"><li>fumatul</li><li>soarele fără protecție</li><li>deshidratarea</li><li>băutul des cu paiul</li></ul></div>
</div>

<h2 id="dupa">Îngrijirea după tratament</h2>
<p>Tratamentul este doar începutul; felul în care îți îngrijești pielea acasă contează la fel de mult. Fiecare ten reacționează diferit, așa că instrucțiunile medicului au prioritate.</p>
<ul>
  <li>Evită soarele puternic și antrenamentele intense câteva zile.</li>
  <li>Aplică doar cremele prescrise: sunt alese ca să calmeze pielea și să susțină efectul tratamentului.</li>
  <li>Recuperarea poate varia de la câteva ore la câteva zile, în funcție de tratament. Medicul îți spune din timp la ce să te aștepți.</li>
</ul>

<h2 id="la-moa">Tratamentul ridurilor din jurul buzelor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul evaluează textura pielii și profunzimea ridurilor, îți explică beneficiile și posibilele efecte adverse și stabilește ce ți se potrivește: un tratament sau o combinație.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Pregătirea</b><p>Zona se curăță și se dezinfectează. Pentru procedurile injectabile se aplică un anestezic, lăsat să acționeze.</p></li>
  <li><b>Procedura</b><p>Pentru toxina botulinică se injectează cantități mici, cu un ac fin, în zonele stabilite. Skinboosterele se administrează cu ace foarte fine sau cu canulă.</p>${pret('injectare-botox') ? `<em>Toxină botulinică · de la ${lei(pret('injectare-botox'))}</em>` : ''}${pret('skinbooster-vital') ? `<em>Skinbooster · de la ${lei(pret('skinbooster-vital'))}</em>` : ''}</li>
  <li><b>După și reevaluarea</b><p>Primești recomandări de îngrijire pentru acasă. La control, medicul vede cum a răspuns pielea și dacă e nevoie de o nouă ședință sau de un tratament de întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre ${link('injectare-botox', 'tratamentul cu toxină botulinică')}, <a href="/nou/riduri-in-jurul-gurii/">ridurile din jurul gurii</a> și <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>, sau vezi ${link('consultatie-dermatoestetica-dermatologie', 'consultația de dermatoestetică')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Liniile din jurul buzelor sunt doar un detaliu din povestea chipului tău. Cu un plan potrivit pielii tale și cu câteva obiceiuri bune, pot deveni mult mai discrete. Primul pas este o evaluare făcută de medic.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu opțiunile de tratament
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
    lede: 'De ce apar liniile verticale de deasupra buzei, ce tratamente le pot atenua și ce poți face acasă ca să le previi. Cu opțiunile explicate pe scurt și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
