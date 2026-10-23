// Versiunea structurată a articolului „Tratament riduri profunde”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vede riduri care nu mai dispar:
// răspunsul scurt → ce sunt și de ce apar → fine vs. adânci → opțiunile, alese după cauză (file interactive)
// → îngrijirea de acasă → cum se alege → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consultNume = 'Consultație antiaging (cu vârsta biologică)';
  const consultPret = pret('consultatie-antiaging');
  const dr = team.find((p) => p.nume.includes('Stănescu'));
  const deLa = (sid) => (pret(sid) ? `<em>de la ${lei(pret(sid))}</em>` : '');
  const mai = (sid, txt) => (id(sid) ? `<a class="link-u" href="${esc(live(sid))}">${txt} →</a>` : '');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt ridurile profunde'],
    ['fine-adanci', 'Riduri fine sau adânci'],
    ['optiuni', 'Opțiunile, după cauză'],
    ['ingrijire', 'Îngrijirea de zi cu zi'],
    ['cum-alegi', 'Cum alegi tratamentul'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cremele mai pot ajuta la riduri adânci?', 'Cremele hidratează și susțin pielea, dar ridurile adânci, vizibile și în repaus, de obicei nu dispar doar cu hidratare sau machiaj. Rutina de acasă rămâne importantă pentru a susține rezultatele tratamentelor.'],
    ['Acidul hialuronic sau botoxul?', 'Depinde de cauză. Acidul hialuronic redă volumul pierdut și „umple” ridurile, de exemplu liniile nazolabiale. Botoxul relaxează mușchii care formează ridurile de mimică, cum sunt cele de pe frunte sau dintre sprâncene. Medicul stabilește ce ți se potrivește, uneori o combinație.'],
    ['Când se vede rezultatul?', 'După acidul hialuronic, rezultatul se vede imediat după procedură. Botoxul acționează în câteva zile. Microneedlingul, PRP-ul, laserul și radiofrecvența dau rezultate treptat, după mai multe ședințe.'],
    ['Este suficient un singur tratament?', 'De cele mai multe ori, nu. Pentru ridurile adânci se combină de obicei mai multe proceduri, de exemplu injectări cu terapii de regenerare, alături de o rutină corectă acasă și ședințe periodice de întreținere.'],
    ['Ce pot face acasă ca să previn ridurile adânci?', 'Protecție solară zilnică, inclusiv în zilele înnorate, produse cu retinol și vitamina C introduse treptat, curățare blândă și hidratare potrivită tipului de ten. Contează mai mult consecvența decât numărul produselor.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile profunde sunt <b>vizibile și când fața este relaxată</b> și nu dispar cu hidratare sau machiaj.</li>
    <li>Apar în timp, din <b>scăderea colagenului și a elastinei</b>, soare fără protecție, stres, oboseală și mimică repetată.</li>
    <li>Tratamentul depinde de <b>cauză</b>: volum pierdut (acid hialuronic), mimică (toxină botulinică) sau calitatea pielii (microneedling, PRP, laser, radiofrecvență).</li>
    <li>De cele mai multe ori, rezultatele vin dintr-un <b>plan care combină</b> mai multe proceduri cu o rutină corectă acasă.</li>
    <li>La MOA, planul pornește de la o <b>consultație antiaging</b>${consultPret ? `, ${lei(consultPret)}` : ''}, în care medicul vede ce tip de riduri ai și de ce au apărut.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile profunde</h2>
<p class="ar-first">Ai început să observi că unele riduri nu mai dispar nici când te odihnești, nici când te machiezi. Nu mai sunt doar linii fine, ci pliuri mai adânci, care rămân acolo indiferent de expresie. Cremele hidratează, dar nu le mai netezesc. Aici apare întrebarea firească: ce tratament are sens pentru ele, fără să-ți pierzi naturalețea?</p>
<p>Pe măsură ce pielea își pierde fermitatea, ridurile nu mai sunt doar linii de expresie. Ele se formează treptat, din mai mulți factori care se adună, până când pielea nu mai revine la forma inițială.</p>
<div class="rx-why">
  <span class="rx-why-h">De ce apar ridurile adânci</span>
  <ul class="rx-chips rx-chips-neg"><li>mai puțin colagen și elastină</li><li>pierderea fermității</li><li>soare fără protecție</li><li>stres și oboseală</li><li>stilul de viață</li><li>mimica repetată</li></ul>
</div>
<p>Apar mai des acolo unde pielea este solicitată constant de mimică:</p>
<ul class="rx-chips"><li>între sprâncene</li><li>pe frunte</li><li>liniile nazolabiale</li><li>colțurile gurii</li><li>în jurul ochilor</li></ul>

<h2 id="fine-adanci">Riduri fine sau riduri adânci</h2>
<div class="rx-compare">
  <div class="rx-col"><small>Riduri fine</small><b>Apar primele</b><dl><dt>Când le vezi</dt><dd>mai ales când zâmbești sau te încrunți</dd><dt>Adâncime</dt><dd>mică</dd><dt>Ce ajută</dt><dd>se pot estompa mai ușor cu produse de îngrijire</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Riduri adânci</small><b>Rămân și în repaus</b><dl><dt>Când le vezi</dt><dd>și când fața este relaxată</dd><dt>Adâncime</dt><dd>mai mare</dd><dt>Ce ajută</dt><dd>de obicei, tratamente făcute de medic, nu doar hidratare sau machiaj</dd></dl></div>
</div>

<h2 id="optiuni">Opțiunile de tratament, după cauza ridurilor</h2>
<p>Unele riduri țin mai mult de <b>pierderea volumului</b>, altele de <b>mimică</b>, altele de <b>calitatea pielii</b>. Alege cauza care ți se pare mai aproape de ce vezi în oglindă și vezi ce variante se discută de obicei. Diagnosticul îl pune medicul.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Volum pierdut</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Mimică</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Calitatea pielii</button>
  </div>
  <div class="rx-panel" data-panel="0">
    <h3>Injectări cu acid hialuronic</h3>
    <p>Acidul hialuronic redă volumul pierdut și „umple” ridurile din interior, acolo unde pielea și-a pierdut susținerea. Rezultatul se vede imediat după procedură, fără să afecteze expresivitatea feței.</p>
    <ul class="rx-chips"><li>liniile nazolabiale</li><li>ridurile din jurul gurii</li><li>zonele unde pielea pare „lăsată”</li></ul>
    <p>${deLa('injectari-acid-hialuronic')} ${mai('injectari-acid-hialuronic', 'Despre acidul hialuronic')}</p>
  </div>
  <div class="rx-panel" data-panel="1" hidden>
    <h3>Toxină botulinică</h3>
    <p>Nu umple ridurile, ci relaxează mușchii care le formează. Pielea de deasupra se netezește treptat; efectul apare în câteva zile și dă un aspect mai relaxat.</p>
    <ul class="rx-chips"><li>ridurile de pe frunte</li><li>liniile dintre sprâncene</li><li>ridurile din jurul ochilor</li></ul>
    <p>${deLa('injectare-botox')} ${mai('injectare-botox', 'Despre toxina botulinică')}</p>
  </div>
  <div class="rx-panel" data-panel="2" hidden>
    <h3>Stimularea colagenului și regenerarea pielii</h3>
    <p>Aceste tratamente lucrează la structura pielii, nu doar la suprafață. Rezultatele apar progresiv, după mai multe ședințe, și pot susține rezultatele altor proceduri.</p>
    <ul>
      <li><b>Microneedling</b>: micro-înțepături controlate stimulează pielea să producă mai mult colagen și elastină, pentru textură și fermitate. Se combină adesea cu terapii de regenerare. ${mai('microneedeling', 'Microneedling Dermapen')}</li>
      <li><b>PRP (terapia vampir)</b>: plasma bogată în factori de creștere, obținută din propriul sânge, este reintrodusă în piele pentru a susține producția de colagen și elasticitatea. ${mai('prp-scalp', 'Despre PRP')}</li>
      <li><b>Laser și radiofrecvență</b>: acționează în profunzime și stimulează colagenul; ajută la textură, fermitate și ridurile fine și medii. ${mai('venus-viva', 'Radiofrecvența Venus Viva')}</li>
      <li><b>Peeling chimic</b>: îndepărtează controlat celulele moarte, pentru o textură mai uniformă și o piele mai luminoasă. La ridurile adânci este, de obicei, parte dintr-un plan mai amplu.</li>
    </ul>
  </div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Nu există o soluție care să funcționeze la fel pentru toată lumea. Fiecare tratament acționează asupra unei cauze diferite, iar ridurile adânci au, de cele mai multe ori, mai multe cauze în același timp. De aceea, un singur tratament rareori este suficient, iar planul se ajustează în timp, după cum evoluează pielea.</p></aside>

<h2 id="ingrijire">Îngrijirea de zi cu zi pentru prevenirea ridurilor profunde</h2>
<p>Ce faci zilnic contează la fel de mult ca tratamentele. O rutină simplă, dar constantă, poate încetini apariția ridurilor adânci și susține rezultatele obținute în clinică.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Retinol și vitamina C</b><p>Retinolul susține colagenul și textura pielii. Vitamina C protejează de factorii externi și uniformizează tenul. Introdu-le treptat, ca să eviți iritațiile.</p></div>
  <div class="rx-card"><i>02</i><b>Protecție solară zilnică</b><p>Un produs cu SPF protejează colagenul, previne petele și ajută la menținerea fermității. Și în zilele înnorate.</p></div>
  <div class="rx-card"><i>03</i><b>Hidratare și consecvență</b><p>Curățare blândă, hidratare potrivită tipului de ten și produse active aplicate constant. Contează mai mult consecvența decât numărul produselor.</p></div>
</div>

<h2 id="cum-alegi">Cum alegi tratamentul pentru riduri adânci</h2>
<div class="rx-two">
  <div><h3>Ce contează în alegere</h3><ul><li>tipul de ten (uscat, mixt, sensibil)</li><li>cât de adânci sunt ridurile</li><li>vârsta și ritmul în care pielea pierde fermitatea</li><li>stilul de viață</li></ul></div>
  <div><h3>Ce afli la consultație</h3><ul><li>ce tip de riduri ai</li><li>ce le-a cauzat</li><li>ce tratamente ți se potrivesc</li><li>cum pot fi combinate</li></ul></div>
</div>
<p>Informațiile online te ajută să înțelegi opțiunile, dar decizia vine după o evaluare. Consultația este punctul de plecare pentru un plan făcut pentru tine, nu un set de recomandări generale.</p>

<h2 id="la-moa">Tratamentul ridurilor profunde la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultația antiaging</b><p>Medicul evaluează pielea, tipul și cauzele ridurilor și discută cu tine ce urmărești.</p>${consultPret ? `<em>Consultație antiaging · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul personalizat</b><p>Se aleg procedurile potrivite și ordinea lor, de exemplu injectări și terapii de regenerare, plus rutina de acasă.</p></li>
  <li><b>Tratamentele</b><p>Se fac în clinică, după plan. Unele dau rezultat imediat, altele treptat, după mai multe ședințe.</p>${pret('injectari-acid-hialuronic') ? `<em>Acid hialuronic · de la ${lei(pret('injectari-acid-hialuronic'))}</em>` : ''}${pret('injectare-botox') ? `<em>Toxină botulinică · de la ${lei(pret('injectare-botox'))}</em>` : ''}</li>
  <li><b>Reevaluarea și întreținerea</b><p>Medicul urmărește evoluția pielii și ajustează planul; revii periodic pentru întreținere.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>, <a href="/nou/riduri-marioneta/">ridurile marionetă</a> și <a href="/nou/ce-inseamna-prp/">ce înseamnă PRP</a>, sau vezi <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Ridurile profunde nu apar peste noapte, iar schimbările vin și ele pas cu pas. Nu toate ridurile se tratează la fel: important este să înțelegi ce are nevoie pielea ta acum și să alegi un plan pe termen lung, adaptat ție.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu opțiunile de tratament, după cauza ridurilor
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
    lede: 'Ce sunt ridurile profunde, de ce apar și prin ce diferă de cele fine. Vezi ce tratamente se discută după cauza lor, ce poți face acasă și cum se construiește un plan la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
