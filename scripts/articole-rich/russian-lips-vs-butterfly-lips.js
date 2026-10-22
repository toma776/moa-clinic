// Versiunea structurată a articolului „Russian lips: tot ce trebuie să știi înainte de procedură”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la o mărire de buze:
// răspunsul scurt → ce este tehnica → cum decurge → Russian sau Butterfly (comparație + avantaje în file) → după procedură → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const buze = serv['augmentare-buze']?.preturi || [];
  const pB = (re) => buze.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este tehnica Russian Lips'],
    ['procedura', 'Cum decurge procedura'],
    ['russian-sau-butterfly', 'Russian sau Butterfly Lips?'],
    ['avantaje', 'Avantaje și dezavantaje'],
    ['dupa', 'După procedură'],
    ['greseli', 'Greșeli de evitat'],
    ['la-moa', 'Mărirea buzelor la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Doare injectarea Russian Lips?', 'Înainte de injectare se aplică o cremă anestezică. Majoritatea pacientelor descriu o înțepătură ușoară și o senzație de presiune. După procedură, buzele pot fi ușor umflate sau sensibile 24–48 de ore.'],
    ['Cât durează procedura?', 'Aproximativ 30–45 de minute. Durează ceva mai mult decât o augmentare clasică, pentru că acidul hialuronic se injectează în mai multe puncte, în porțiuni mici.'],
    ['Care e diferența dintre Russian Lips și Butterfly Lips?', 'Russian Lips urmărește ridicarea verticală și volumul central, cu o formă de inimă și arcul lui Cupidon accentuat. Butterfly Lips distribuie volumul mai uniform, mai plat, cu accent pe simetria conturului. Medicul te ajută să alegi după proporțiile feței tale.'],
    ['Cât ține efectul?', 'Acidul hialuronic nu este permanent. Efectul se menține câteva luni și depinde de metabolism, stil de viață, produsul folosit și de cât de bine respecți indicațiile de după procedură. Pentru întreținere se discută, de obicei, o ședință la 6–9 luni.'],
    ['Când se poate face un retuș?', 'La aproximativ 2 săptămâni după procedură, când umflătura a trecut și volumul s-a stabilizat. Atunci medicul vede clar dacă e nevoie de o mică ajustare.'],
    ['Este potrivită tehnica dacă e prima mea injectare?', 'Poate fi, pentru că pune accent pe conturare și ridicare, nu pe volum mult. Decizia se ia la consult, după ce medicul îți evaluează buzele și ce îți dorești.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Russian Lips este o tehnică de mărire a buzelor cu acid hialuronic injectat <b>vertical</b>, pentru <b>ridicare și volum central</b>, cu o formă asemănătoare unei inimi.</li>
    <li>Butterfly Lips distribuie volumul <b>mai uniform și mai plat</b>, cu accent pe <b>simetria conturului</b>.</li>
    <li>Procedura se face cu <b>cremă anestezică</b> și durează aproximativ <b>30–45 de minute</b>. Umflătura ușoară trece, de obicei, în 24–48 de ore.</li>
    <li>Efectul <b>nu este permanent</b>: ține câteva luni, iar retușul, dacă e nevoie, se face la aproximativ 2 săptămâni.</li>
    <li>La MOA, alegerea tehnicii se face <b>la consult, după proporțiile feței tale</b>${pret('augmentare-buze') ? `; mărirea buzelor pornește de la ${lei(pret('augmentare-buze'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este tehnica Russian Lips</h2>
<p class="ar-first">Te gândești să-ți redefinești buzele, dar gândul la ace sau la un rezultat exagerat te ține pe loc. Este o temere pe care o au multe dintre pacientele care vin la noi. Frica de ace este normală, iar procedura se face cu anestezie locală, așa că disconfortul este, de obicei, mic.</p>
<p>Russian Lips pune accent pe <b>simetrie, ridicare verticală și volum central</b>. Spre deosebire de augmentarea clasică, acidul hialuronic este injectat vertical, nu orizontal, din interiorul buzei către margine, pentru un efect de ridicare.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Arcul lui Cupidon</b><p>Este pus în valoare, iar buza superioară se proiectează ușor în sus.</p></div>
  <div class="rx-card"><i>02</i><b>Formă de inimă</b><p>Volumul se concentrează în centru, iar buzele capătă o formă asemănătoare unei inimi.</p></div>
  <div class="rx-card"><i>03</i><b>Colțurile gurii</b><p>Se evită volumul în colțuri, ceea ce ajută la evitarea aspectului de „rață”.</p></div>
</div>
<div class="rx-two">
  <div><h3>Augmentarea clasică</h3><ul><li>adaugă volum pe toată lungimea buzei</li><li>uneori poate duce la un aspect disproporționat</li></ul></div>
  <div><h3>Russian Lips</h3><ul><li>proiecție delicată, nu o bombare a buzelor</li><li>accentuează forma naturală, nu o schimbă</li><li>cere mai multă precizie și timp</li></ul></div>
</div>
<p>Tehnica pornește de la principiul „mai puțin înseamnă mai mult”. Poate fi potrivită pentru buze subțiri sau înguste, pentru corectarea unor asimetrii, pentru buzele mature și pentru cine e la prima injectare cu acid hialuronic. Poate estompa ușor și liniile fine din jurul gurii.</p>

<h2 id="procedura">Cum decurge procedura Russian Lips</h2>
<div class="rx-two">
  <div><h3>Cu 2–3 zile înainte</h3><ul><li>evită alcoolul, antiinflamatoarele și suplimentele</li><li>hidratează-te bine</li><li>nu te expune excesiv la soare</li></ul></div>
  <div><h3>În ziua procedurii</h3><ul><li>nu aplica machiaj pe buze</li><li>spune-i medicului despre istoricul medical, afecțiuni și tratamente</li></ul></div>
</div>
<p>Medicul aplică întâi o cremă anestezică. Apoi, cu un ac fin, injectează acidul hialuronic vertical, în porțiuni mici, din interiorul buzei spre margini, insistând pe buza superioară. Volumul crește, dar aspectul rămâne plat, fără ca buzele să fie „împinse” în față.</p>
<p>Procedura durează aproximativ <b>30–45 de minute</b>, mai mult decât alte tehnici, pentru că sunt mai multe puncte de injectare. Se folosesc produse pe bază de acid hialuronic (de exemplu Restylane, Juvéderm sau Stylage), cu densități diferite în funcție de efectul urmărit.</p>

<h2 id="russian-sau-butterfly">Russian Lips sau Butterfly Lips?</h2>
<p>Depinde de ce îți dorești și de proporțiile feței. Pe scurt, Russian Lips se concentrează pe volum și ridicare, iar Butterfly Lips pe simetrie.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Russian Lips</small><b>Ridicare și volum central</b><dl><dt>Aspect</dt><dd>formă de inimă, ridicare verticală</dd><dt>Pentru cine</dt><dd>dacă vrei volum mai vizibil și o formă de inimă</dd><dt>Ședința</dt><dd>mai lungă, mai multe puncte de injectare</dd></dl></div>
  <div class="rx-col"><small>Butterfly Lips</small><b>Volum uniform, contur simetric</b><dl><dt>Aspect</dt><dd>volum distribuit uniform, mai plat, contur delicat</dd><dt>Pentru cine</dt><dd>dacă vrei un contur simetric și un rezultat discret</dd><dt>Ședința</dt><dd>de obicei mai puține înțepături</dd></dl></div>
</div>

<h2 id="avantaje">Avantaje și dezavantaje</h2>
<p>Alege tehnica pentru a vedea ce câștigi și la ce să te aștepți.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Russian Lips</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Butterfly Lips</button>
  </div>
  <div class="rx-panel" data-panel="0"><div class="rx-two">
    <div><h3>Avantaje</h3><ul><li>contur bine definit, cu volum discret și arcul lui Cupidon pus în valoare</li><li>ridicarea buzelor poate da un aspect mai odihnit</li><li>se poate lucra în detaliu pe centrul buzei sau pe margini</li></ul></div>
    <div><h3>Dezavantaje</h3><ul><li>ședință mai lungă, cu mai multe puncte de injectare</li><li>poate exista disconfort, chiar cu anestezie</li><li>cost, de obicei, mai ridicat decât o umplere clasică</li><li>rezultatul depinde mult de experiența medicului</li></ul></div>
  </div></div>
  <div class="rx-panel" data-panel="1" hidden><div class="rx-two">
    <div><h3>Avantaje</h3><ul><li>volum distribuit pe buza superioară și inferioară, aspect uniform</li><li>rezultat discret, mai puțin dramatic</li><li>de obicei, mai puține înțepături</li><li>umflătură mai mică și refacere mai rapidă</li></ul></div>
    <div><h3>Dezavantaje</h3><ul><li>nu oferă aceeași proiecție pe verticală, rezultatul e mai plat</li><li>poate fi nevoie de retuș mai des pentru un efect mai vizibil</li><li>nu e alegerea potrivită pentru un aspect foarte definit</li></ul></div>
  </div></div>
</div>

<h2 id="dupa">Ce trebuie să știi după procedură</h2>
<p>În primele 48 de ore, buzele pot fi ușor umflate, iar în jurul zonei pot apărea mici vânătăi, care se estompează de la sine în câteva zile.</p>
<div class="rx-why">
  <span class="rx-why-h">În primele zile, evită</span>
  <ul class="rx-chips rx-chips-neg"><li>alcoolul (48 de ore)</li><li>fumatul (48 de ore)</li><li>machiajul pe buze și în jurul lor</li><li>sauna și solarul</li><li>băile fierbinți</li></ul>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Acidul hialuronic nu este permanent. Efectul se menține câteva luni, dar cât anume diferă de la o persoană la alta: contează metabolismul, stilul de viață, produsul folosit și îngrijirea de după. Sportul intens, un metabolism rapid sau fumatul pot grăbi resorbția. Retușul, dacă e nevoie, se face la aproximativ 2 săptămâni, iar întreținerea se discută, de obicei, la 6–9 luni.</p></aside>

<h2 id="greseli">Greșeli frecvente de evitat</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Alegerea după preț</b><p>Lipsa de experiență poate duce la o injectare incorectă, la un rezultat nemulțumitor și chiar la complicații. Contează pregătirea și experiența medicului.</p></div>
  <div class="rx-card"><i>02</i><b>Prea mult volum</b><p>Mai mult nu înseamnă mai frumos. Buzele arată bine când se potrivesc chipului, nu când ies forțat în evidență.</p></div>
  <div class="rx-card"><i>03</i><b>Așteptări nerealiste</b><p>Acidul hialuronic îmbunătățește volumul și conturul, dar nu schimbă complet forma sau simetria naturală a buzelor. Iar ignorarea indicațiilor de după poate compromite rezultatul.</p></div>
</div>

<h2 id="la-moa">Mărirea buzelor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul îți evaluează buzele și proporțiile feței, discută ce îți dorești și îți spune dacă Russian Lips, Butterfly Lips sau altă abordare ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Crema anestezică, apoi injectarea în porțiuni mici, în aproximativ 30–45 de minute.</p>${pB(/stylage/i) ? `<em>1 mL Stylage · ${lei(pB(/stylage/i))}</em>` : ''}${pB(/restylane/i) ? `<em>1 mL Restylane / Juvéderm · ${lei(pB(/restylane/i))}</em>` : ''}</li>
  <li><b>Primele zile</b><p>Pleci acasă cu recomandările de îngrijire. Umflătura și eventualele vânătăi trec, de obicei, în câteva zile.</p></li>
  <li><b>Reevaluarea</b><p>La aproximativ 2 săptămâni, medicul verifică rezultatul și face, dacă e nevoie, o mică ajustare.</p></li>
</ol>
<p class="rx-links">Citește și despre ${link('augmentare-buze', 'mărirea buzelor la MOA')}, <a href="/nou/forme-de-buze-cu-acid-hialuronic/">formele de buze cu acid hialuronic</a>, <a href="/nou/prima-injectare-cu-acid-hialuronic-in-buze/">prima injectare în buze</a> și <a href="/nou/acid-hialuronic-in-buze-cat-dureaza/">cât durează acidul hialuronic în buze</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Russian Lips și Butterfly Lips nu sunt rețete fixe, ci două feluri de a pune în valoare buzele tale. Alegerea potrivită pornește de la chipul tău și de la o discuție sinceră cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Augmentare buze">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu avantajele și dezavantajele fiecărei tehnici
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
    lede: 'Ce este tehnica Russian Lips, cum decurge procedura și prin ce diferă de Butterfly Lips. Cu avantajele și dezavantajele fiecăreia și ce să știi după injectare.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
