// Versiunea structurată a articolului „Epilare definitivă: păreri reale de la clienți”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care încă se gândește la epilarea cu laser:
// răspunsul scurt → de ce aleg oamenii laserul → ce au observat clienții → laser vs IPL → greșeli și riscuri → verificare rapidă → la MOA.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const ep = serv['epilare-definitiva-bucuresti']?.preturi || [];
  const pE = (re) => ep.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const srv = 'Epilare definitivă Splendor X';
  const pMin = pret('epilare-definitiva-bucuresti');
  const pPachet = pE(/^OFERT. Axil. \+ Inghinal/i);
  const pFull = pE(/Full Body/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['de-ce', 'De ce aleg oamenii laserul'],
    ['ce-am-invatat', 'Ce au observat clienții'],
    ['laser-ipl', 'Laser sau IPL?'],
    ['zone', 'Față, inghinal, mustață'],
    ['greseli', 'Riscuri și greșeli de evitat'],
    ['pregatit', 'Ești pregătit(ă)? Verificare rapidă'],
    ['merita', 'Când merită și când nu'],
    ['la-moa', 'Epilarea la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Dispare părul complet după prima ședință?', 'Nu. Rezultatul se construiește treptat: după câteva ședințe părul se rărește, firele devin mai subțiri și mai deschise, iar în unele zone nu mai cresc. Hormonii și genetica pot influența rezultatul.'],
    ['Doare epilarea cu laser?', 'Mulți clienți spun că senzația a fost mai suportabilă decât se așteptau, inclusiv în zona inghinală. Aparatul are răcire integrată. Pielea poate fi mai sensibilă în perioada menstruală, așa că, pe cât posibil, evită programarea în acele zile.'],
    ['Câte ședințe sunt necesare?', 'Depinde de zonă, de tipul de piele și de păr. Axilele și zona inghinală răspund de obicei mai repede; fața și zonele cu fire fine cer mai multă răbdare. Specialistul estimează numărul de ședințe la prima discuție.'],
    ['Ce efecte pot apărea după ședință?', 'Cele mai frecvente sunt roșeața, o ușoară umflare locală și senzația de căldură. De obicei trec în câteva ore sau zile și pot fi calmate cu gel de aloe vera sau creme calmante.'],
    ['Pot folosi ceara sau penseta între ședințe?', 'Nu. Smulgerea firelor între ședințe, cu ceară, pensetă sau epilator, afectează eficiența laserului. Respectă indicațiile primite în clinică.'],
    ['Funcționează pe păr blond sau alb?', 'Firele foarte deschise, blond foarte deschis sau albe, conțin prea puțină melanină ca să fie recunoscute de laser. În aceste cazuri, specialistul îți poate recomanda alte soluții.'],
  ];

  const intrebariCheck = [
    ['Ai stat la soare sau la solar în ultimele zile?', 'Pielea expusă recent poate reacționa cu pete roșii după ședință. Spune-i specialistului; s-ar putea să fie nevoie să amâni.'],
    ['Iei antibiotice sau alte tratamente care cresc sensibilitatea la lumină?', 'Tratamentele fotosensibilizante se discută cu medicul înainte de ședință.'],
    ['Ești însărcinată sau alăptezi?', 'Specialiștii recomandă să aștepți: schimbările hormonale pot influența rezultatul.'],
    ['Ai leziuni active pe piele sau o afecțiune dermatologică în zona de tratat?', 'În aceste situații, decizia se ia după un sfat medical.'],
    ['Ședința ar cădea în perioada menstruală?', 'Pielea poate fi mai sensibilă atunci. Pe cât posibil, alege o altă zi.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Cei mai mulți clienți au ajuns la laser după <b>ani de ceară, lamă și creme</b>: durere, iritații, fire crescute sub piele.</li>
    <li>Rezultatul vine <b>treptat</b>: după câteva ședințe părul se rărește și devine mai fin; hormonii și genetica pot influența cât de mult.</li>
    <li><b>Axilele și zona inghinală</b> răspund de obicei mai repede, <b>fața și firele fine</b> cer mai multă răbdare.</li>
    <li>Cele mai multe nemulțumiri vin din <b>nerespectarea regulilor</b>: soare fără protecție, smulgerea firelor între ședințe, pauze prea lungi.</li>
    <li>La MOA se lucrează cu laserul <b>Splendor X</b>, după o discuție despre istoricul tău medical, ten și păr${pMin ? `; o ședință pornește de la ${lei(pMin)}` : ''}.</li>
  </ul>
</section>

<h2 id="de-ce">De ce aleg oamenii epilarea cu laser</h2>
<p class="ar-first">Te gândești la epilarea definitivă, dar încă nu ești convins(ă)? Mulți dintre cei care au ajuns la MOA au trecut prin aceleași îndoieli. Au întrebat prietene, au citit forumuri și, în cele din urmă, au decis să încerce. Am adunat aici ce ne-au povestit, cu bune și mai puțin bune, ca să poți lua o decizie informată.</p>
<p>Dorința de a scăpa de părul nedorit nu ține de gen. Femeile vor picioare netede și libertatea de a purta orice ținută; bărbații caută o soluție de durată pentru spate, piept sau gât, unde bărbieritul zilnic provoacă iritații.</p>
<div class="rx-why">
  <span class="rx-why-h">Ce i-a nemulțumit la metodele clasice</span>
  <ul class="rx-chips rx-chips-neg"><li>durerea de la ceară</li><li>părul care crește repede la loc</li><li>iritațiile de la lamă</li><li>foliculita</li><li>firele crescute sub piele</li><li>cremele depilatoare fără efect</li><li>costurile lunare</li></ul>
</div>
<p>Dincolo de partea fizică, mulți au vorbit despre confortul psihologic: să poți merge la plajă, la piscină sau la un eveniment fără grija că „n-ai fost la epilat”. Înainte de prima ședință, întrebările lor au fost aceleași: „Cât de tare doare?”, „Este sigur pentru pielea mea sensibilă?”, „Chiar va ține rezultatul?”.</p>

<h2 id="ce-am-invatat">Ce au observat clienții noștri într-un an</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Nu e totul de la prima ședință</b><p>Laserul nu face minuni peste noapte, dar diferența se vede de obicei după câteva ședințe: părul se rărește, firele devin mai subțiri și mai deschise, iar în unele zone nu mai cresc.</p></div>
  <div class="rx-card"><i>02</i><b>Zonele nu răspund la fel</b><p>Axilele și zona inghinală, cu fire groase și pigmentate, răspund mai repede. Fața și zonele cu fire fine au nevoie de mai multă răbdare.</p></div>
  <div class="rx-card"><i>03</i><b>Disciplina contează</b><p>Cei care au respectat regulile între ședințe și intervalele recomandate au văzut rezultatele mai repede decât cei care au amânat ședințele.</p></div>
</div>
<p>Câteva păreri, în cuvintele clienților:</p>
<ul>
  <li>„După patru ședințe, părul din zona axilei aproape că nu mai crește. Ce mai apare e foarte fin și rar.” – Carmen</li>
  <li>„La axile am văzut diferența după a doua ședință. La mustață e mai greu, dar după câteva ședințe firele nu mai sunt la fel de vizibile.” – o clientă</li>
  <li>„Rezultatele sunt vizibile dacă faci ceea ce îți spune specialistul.” – Cosmina</li>
</ul>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Laserul reduce vizibil pilozitatea la mulți oameni, dar rezultatul nu este identic pentru toată lumea: hormonii, genetica, culoarea firului și respectarea regulilor între ședințe contează. De aceea, numărul de ședințe se estimează individual și se ajustează pe parcurs.</p></aside>

<h2 id="laser-ipl">Epilare cu laser sau IPL?</h2>
<p>Mulți clienți au încercat întâi IPL și au spus că „nu a funcționat la mine”. Diferența ține de tipul de lumină folosit.</p>
<div class="rx-compare">
  <div class="rx-col"><small>IPL</small><b>Lumină intens pulsată</b><dl><dt>Lumina</dt><dd>spectru larg, mai puțin precis</dd><dt>Ședințe</dt><dd>de obicei mai multe</dd><dt>Preț</dt><dd>mai accesibil, rezultate mai lente</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Laser medical</small><b>Splendor X la MOA</b><dl><dt>Lumina</dt><dd>lungimi de undă concentrate, care acționează pe folicul</dd><dt>Tehnologie</dt><dd>combină Alexandrite (fire fine, deschise) și Nd:YAG (fire groase, închise)</dd><dt>Confort</dt><dd>răcire integrată</dd></dl>${id('epilare-definitiva-bucuresti') ? `<a class="link-u" href="${esc(live('epilare-definitiva-bucuresti'))}">Despre epilarea cu Splendor X →</a>` : ''}</div>
</div>

<h2 id="zone">Față, inghinal, mustață: ce au povestit clienții</h2>
<div class="rx-two">
  <div><h3>Fața și mustața</h3><ul><li>femeile vin mai ales pentru mustață și bărbie, bărbații pentru gât, unde bărbieritul dă iritații</li><li>după câteva ședințe, firele cresc mai rar, iar pielea are mai puține iritații</li><li>cere mai multă răbdare decât alte zone</li></ul></div>
  <div><h3>Zona inghinală</h3><ul><li>una dintre cele mai cerute zone</li><li>mulți spun că durerea a fost mai mică decât se așteptau</li><li>firele care cresc după ședințe sunt mai subțiri, iar iritațiile de la lamă sau ceară se reduc</li></ul></div>
</div>

<h2 id="greseli">Riscuri și greșeli de evitat</h2>
<p>Efectele care apar după ședință sunt de obicei ușoare: <b>roșeață, o ușoară umflare locală și senzație de căldură</b>. În majoritatea cazurilor trec în câteva ore sau zile și pot fi calmate cu gel de aloe vera sau creme calmante.</p>
<div class="rx-two">
  <div><h3>Greșeli frecvente între ședințe</h3><ul><li>expunerea la soare fără protecție</li><li>smulgerea firelor cu ceară, pensetă sau epilator</li><li>nerespectarea intervalului dintre ședințe</li><li>produse iritante aplicate pe piele</li></ul></div>
  <div><h3>Contraindicații ignorate uneori</h3><ul><li>tratamente fotosensibilizante (inclusiv unele antibiotice)</li><li>expunere recentă la soare sau solar</li><li>anumite afecțiuni dermatologice</li><li>sarcina și alăptarea</li></ul></div>
</div>
<div class="rx-alert"><b>Spune-i specialistului înainte de ședință</b> dacă ai stat recent la soare, iei medicamente noi sau ai leziuni pe piele în zona de tratat. Un client care a venit direct de la plajă a avut pete roșii pe spate câteva zile.</div>

<h2 id="pregatit">Ești pregătit(ă) pentru ședință? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu specialistul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu specialistul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă că epilarea e exclusă, ci că momentul ședinței sau setările se stabilesc după ce specialistul îți vede pielea și istoricul.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează o consultație${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile frecvente.</b><p>La prima vizită, specialistul discută cu tine istoricul medical, analizează tenul, firul de păr și eventualele tatuaje, apoi stabilește numărul de ședințe.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(srv)}">Programează-te pentru epilare</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="merita">Când merită și când nu</h2>
<div class="rx-two">
  <div><h3>Merită, spun clienții, dacă</h3><ul><li>vrei pielea netedă zilnic, fără epilarea săptămânală</li><li>ai piele sensibilă și lama sau ceara îți dau iritații</li><li>ai des fire crescute sub piele sau foliculită</li><li>vrei să economisești timp și costurile lunare ale metodelor clasice</li><li>ești dispus(ă) să urmezi protocolul recomandat</li></ul></div>
  <div><h3>Se amână sau nu e potrivită dacă</h3><ul><li>urmezi tratamente fotosensibilizante</li><li>ai leziuni active pe piele sau afecțiuni dermatologice grave</li><li>ai fire foarte deschise (blond foarte deschis) sau albe, pe care laserul nu le recunoaște</li></ul></div>
</div>
<p><b>Cât costă?</b> Prețul depinde de zonă: o ședință poate părea mai scumpă decât ceara, dar mulți clienți au observat că, adunate, sumele cheltuite ani la rând pe ceară și produse erau mai mari. Pentru mai multe zone există pachete${pPachet ? ` (de exemplu axilă, inghinal integral, linie bikini și interfesier, ${lei(pPachet)})` : ''}. Lista completă e pe <a href="/nou/preturi/">pagina de prețuri</a>.</p>

<h2 id="la-moa">Epilarea cu laser la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Discuția inițială</b><p>Specialistul te întreabă despre istoricul medical, analizează tipul de ten, firul de păr, eventualele tatuaje și experiențele anterioare.</p></li>
  <li><b>Planul</b><p>Se stabilesc zonele, numărul estimat de ședințe și regulile de respectat înainte și după.</p>${pMin ? `<em>Epilare Splendor X · de la ${lei(pMin)} / zonă</em>` : ''}${pFull ? `<em>Full Body, 6 zone la alegere · de la ${lei(pFull)}</em>` : ''}</li>
  <li><b>Ședința</b><p>Laserul acționează asupra foliculului, cu răcire integrată pentru confort.</p></li>
  <li><b>Între ședințe și reevaluarea</b><p>Protecție solară, fără smulgerea firelor, intervalele respectate. La fiecare ședință se urmărește cum răspunde zona.</p></li>
</ol>
<p class="rx-links">Citește și <a href="/nou/epilat-interfesier-ce-inseamna/">ce înseamnă epilatul interfesier</a>, vezi ${link('epilare-definitiva-bucuresti', 'pagina epilării cu Splendor X')} sau ${link('consultatie-dermatoestetica-dermatologie', 'consultația de dermatologie')}, dacă ai o afecțiune a pielii.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Experiențele clienților arată că rezultatele nu sunt identice pentru toată lumea și cer răbdare. Când decizia e luată informat și indicațiile sunt respectate, epilarea cu laser poate aduce mai mult confort în viața de zi cu zi.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srv)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu înainte de ședința de epilare
(() => {
  const c = document.querySelector('[data-check]');
  if (c) {
    const qs = [...c.querySelectorAll('[data-q]')], bar = c.querySelector('.rx-check-prog i'), reset = c.querySelector('.rx-reset');
    let yes = false;
    const show = (i) => { qs.forEach((q, k) => (q.hidden = k !== i)); bar.style.width = (i / qs.length) * 100 + '%'; };
    const end = () => { qs.forEach((q) => (q.hidden = true)); bar.style.width = '100%'; c.querySelector('[data-res="' + (yes ? 'da' : 'nu') + '"]').hidden = false; reset.hidden = false; };
    qs.forEach((q, i) => q.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.a === 'da') { yes = true; q.querySelector('.rx-why2').hidden = false; q.querySelector('.rx-ans').hidden = true; setTimeout(() => (i + 1 < qs.length ? show(i + 1) : end()), 1400); }
      else (i + 1 < qs.length ? show(i + 1) : end());
    })));
    reset.addEventListener('click', () => { yes = false; c.querySelectorAll('[data-res]').forEach((r) => (r.hidden = true)); qs.forEach((q) => { q.querySelector('.rx-why2').hidden = true; q.querySelector('.rx-ans').hidden = false; }); reset.hidden = true; show(0); });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce ne-au povestit clienții despre epilarea cu laser: de ce au ales-o, ce au observat după câteva ședințe, ce greșeli să eviți și când merită. Cu o verificare rapidă înainte de ședință.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
