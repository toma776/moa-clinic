// Versiunea structurată a articolului „Buze uscate – soluții rapide”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva cu buzele uscate sau crăpate:
// răspunsul scurt → de ce se usucă → semne și ce le agravează → ce balsam alegi → remedii → când mergi la medic (verificare rapidă) → prevenție → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const derm = [...trNode.entries()].find(([, l]) => l.consult && /dermatolog/i.test(l.nod.nume));
  const dermPret = derm ? pret(derm[0]) : null;
  const dermNume = derm ? derm[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const pBuze = pret('augmentare-buze');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['de-ce', 'De ce se usucă buzele'],
    ['semne', 'Semne și ce le agravează'],
    ['balsam', 'Ce balsam alegi'],
    ['remedii', 'Exfoliere și remedii de acasă'],
    ['medic', 'Când mergi la medic'],
    ['prevenire', 'Prevenție zilnică'],
    ['la-moa', 'Consultul la MOA, pas cu pas'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De ce nu se hidratează buzele singure?', 'Pielea buzelor este mult mai subțire decât în restul feței și nu are glande sebacee. De aceea, buzele nu se pot „unge” singure și reacționează primele la frig, vânt, aer uscat sau soare.'],
    ['Lingerea buzelor ajută?', 'Nu. Pare că ajută pe moment, dar lingerea repetată le usucă și mai tare.'],
    ['Ce ingrediente caut într-un balsam de buze?', 'Academia Americană de Dermatologie recomandă balsamuri cu ulei de ricin, unt de shea, dimeticonă, ulei de semințe de cânepă sau ulei mineral, și evitarea celor cu arome, parfum, camfor, mentol, eucalipt, acid salicilic, lanolină sau fenol.'],
    ['Cât de des exfoliez buzele?', 'Rar și blând, cu produse create special pentru buze. Exfolierea îndepărtează celulele moarte și ajută produsele hidratante să acționeze mai bine.'],
    ['Buzele uscate apar și la copii?', 'Da, mai ales când pielea este expusă la frig, vânt sau deshidratare. Obiceiurile de prevenție sunt valabile și pentru copii.'],
    ['Acidul hialuronic ajută la buzele uscate?', 'Hidratarea buzelor cu acid hialuronic poate fi o opțiune pentru buzele uscate și crăpate, dar doar după consultul unui medic dermatolog, care analizează cauza și stabilește un plan potrivit.'],
  ];

  const intrebariCheck = [
    ['Buzele rămân uscate și crăpate deși le îngrijești constant?', 'Uscăciunea care nu răspunde la îngrijire poate avea o cauză internă: deficit de vitamine, inflamație, medicamente sau boli autoimune.'],
    ['Buzele îți sângerează?', 'Sângerarea apare în formele severe și merită văzută de medic.'],
    ['Sunt dureroase sau inflamate?', 'Inflamația buzelor (cheilita) poate deveni dureroasă dacă nu este tratată.'],
    ['Ai răni pe buze care nu se vindecă?', 'Rănile care nu se închid trebuie evaluate de un medic dermatolog.'],
    ['Uscăciunea vine împreună cu alte simptome?', 'Uneori buzele sunt doar „mesagerul” unei afecțiuni care are nevoie de atenție medicală.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Buzele <b>nu au glande sebacee</b> și au pielea mai subțire, așa că se usucă repede la frig, vânt, soare sau aer uscat.</li>
    <li>Cauzele sunt <b>externe</b> (vreme, deshidratare, produse iritante, lingerea buzelor, fumat, alcool) sau <b>interne</b> (deficit de vitamine, inflamație, medicamente, boli autoimune).</li>
    <li>Alege un <b>balsam fără parfum, hipoalergenic</b>, și oprește-l dacă simți usturime sau arsură.</li>
    <li>De cele mai multe ori, problema se rezolvă în <b>câteva zile sau săptămâni</b> cu îngrijire corectă.</li>
    <li>Mergi la <b>medicul dermatolog</b> dacă buzele sângerează, dor, au răni care nu se vindecă sau rămân crăpate deși le îngrijești.</li>
  </ul>
</section>

<h2 id="de-ce">De ce se usucă buzele</h2>
<p class="ar-first">Buzele „te strâng”, ustură sau se crapă exact când ai nevoie de ele moi și îngrijite: dimineața, înainte de ruj, sau iarna, când frigul pare să le ia orice urmă de hidratare. Îți spui că trece cu un balsam. De cele mai multe ori chiar trece. Dar dacă revine constant, merită să afli de ce.</p>
<p>Buzele sunt una dintre zonele sensibile ale corpului. Pielea lor este mult mai subțire decât în restul feței și nu conține glande sebacee, deci nu se pot „unge” singure. Problema este frecventă, la femei și la bărbați. Netratate, buzele uscate se pot crăpa, inflama și pot dezvolta o <b>cheilită</b>, o inflamație care poate deveni dureroasă.</p>
<div class="rx-two">
  <div><h3>Cauze externe</h3><ul><li>soarele, frigul și vântul</li><li>aerul foarte uscat, mai ales iarna</li><li>deshidratarea</li><li>produsele de îngrijire iritante</li><li>lingerea frecventă a buzelor</li><li>fumatul și alcoolul</li></ul></div>
  <div><h3>Cauze medicale</h3><ul><li>deficitul de vitamine</li><li>inflamația din organism</li><li>anumite medicamente</li><li>bolile autoimune</li></ul></div>
</div>
<p>Dacă buzele sunt uscate în orice sezon, indiferent de produsele folosite, nu ignora semnalul și adresează-te unui medic dermatolog.</p>

<h2 id="semne">Semne și ce le agravează</h2>
<div class="rx-why">
  <span class="rx-why-h">Semne că buzele au nevoie de mai multă grijă</span>
  <ul class="rx-chips rx-chips-neg"><li>aspect solzos</li><li>uscăciune care nu trece</li><li>durere sau usturime</li><li>fisuri sau răni</li><li>mâncărime</li><li>cruste</li><li>roșeață</li><li>sângerare, în cazurile severe</li></ul>
</div>
<p>Uneori, fără să ne dăm seama, chiar noi înrăutățim situația:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Produse nepotrivite</b><p>Balsamurile și rujurile cu ingrediente iritante pot întreține uscăciunea.</p></div>
  <div class="rx-card"><i>02</i><b>Mâncarea picantă sau sărată</b><p>Consumată des, poate irita buzele deja uscate.</p></div>
  <div class="rx-card"><i>03</i><b>Lingerea buzelor</b><p>Pare că ajută, dar le usucă și mai tare. Intenția e bună, efectul e opus.</p></div>
</div>

<h2 id="balsam">Ce balsam alegi</h2>
<p>Un balsam potrivit ajută atât la hidratare, cât și la simptomele ușoare. Nu orice balsam este însă indicat: caută produse <b>fără parfum, hipoalergenice, pentru piele sensibilă</b>. Dacă după aplicare simți usturime, arsură sau furnicături, oprește-l: produsul nu ți se potrivește.</p>
<div class="rx-two">
  <div><h3>Caută pe etichetă</h3><ul class="rx-chips"><li>ulei de ricin</li><li>unt de shea</li><li>dimeticonă</li><li>ulei de semințe de cânepă</li><li>ulei mineral</li></ul></div>
  <div><h3>Evită</h3><ul class="rx-chips rx-chips-neg"><li>arome</li><li>parfum</li><li>camfor</li><li>mentol</li><li>eucalipt</li><li>acid salicilic</li><li>lanolină</li><li>fenol</li></ul></div>
</div>
<p><small>Lista urmează recomandările Academiei Americane de Dermatologie.</small></p>

<h2 id="remedii">Exfoliere și remedii de acasă</h2>
<p>Tratamentul depinde de cauză, așa că nu aplica soluții la întâmplare.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Exfoliere blândă și rară</b><p>Îndepărtează celulele moarte și ajută produsele hidratante să acționeze. Folosește produse create pentru buze.</p></div>
  <div class="rx-card"><i>02</i><b>Aloe vera</b><p>Calmantă și antiinflamatoare, poate ajuta la refacerea și hidratarea buzelor. O dată pe zi este suficient.</p></div>
  <div class="rx-card"><i>03</i><b>Miere și ulei de cocos</b><p>Mierea hidratează și ajută la vindecare. Uleiul de cocos, aplicat delicat, susține refacerea pielii.</p></div>
</div>
<aside class="rx-note"><b>Când îngrijirea de acasă nu ajunge</b><p>Pentru buzele uscate și crăpate care nu răspund la îngrijirea obișnuită, hidratarea cu acid hialuronic poate fi o opțiune, dar numai după consultul unui medic dermatolog. Medicul analizează întâi cauza și stabilește apoi, împreună cu tine, un plan personalizat.</p></aside>

<h2 id="medic">Când mergi la medic? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e momentul pentru un consult dermatologic.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>E momentul pentru un consult dermatologic.</b><p>Ai răspuns „da” la cel puțin o întrebare. Medicul caută cauza reală a uscăciunii și îți recomandă un tratament potrivit, mai ales dacă îngrijirea obișnuită nu a ajutat.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(dermNume)}">Programează consultul${dermPret ? ` · ${lei(dermPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Îngrijirea de acasă e un bun început.</b><p>Alege un balsam potrivit, hidratează-te și evită iritanții. Dacă în câteva săptămâni buzele nu își revin, programează un consult dermatologic.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(dermNume)}">Programează un consult</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="prevenire">Prevenție zilnică</h2>
<p>Buzele au nevoie de grijă zi de zi, la fel ca restul corpului. Gesturile de mai jos sunt valabile și pentru adulți, și pentru copii.</p>
<div class="rx-two">
  <div><h3>Ce faci</h3><ul><li>bea cel puțin 2 litri de apă pe zi</li><li>folosește un umidificator în casă, mai ales iarna</li><li>alege produse testate dermatologic, pentru piele sensibilă</li><li>poartă o pălărie cu bor lat la soare</li><li>mănâncă echilibrat, cu suficiente vitamine</li><li>dacă porți ruj, alege unul de calitate; cele cu acid hialuronic pot ajuta la hidratare</li></ul></div>
  <div><h3>Ce eviți</h3><ul><li>să îți umezești buzele constant</li><li>produsele cu alcool, mentol sau parfum intens</li><li>ingredientele agresive</li><li>rujurile de slabă calitate</li><li>produsele care promit „efect instant”, care pot ascunde iritații</li></ul></div>
</div>

<h2 id="la-moa">Consultul la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul dermatologic</b><p>Medicul specialist analizează buzele, istoricul și obiceiurile tale și caută cauza uscăciunii.</p>${dermPret ? `<em>${esc(dermNume)} · ${lei(dermPret)}</em>` : ''}</li>
  <li><b>Planul personalizat</b><p>Stabilești împreună cu medicul ce urmează: o rutină de îngrijire, investigații sau, dacă e cazul, un tratament.</p></li>
  <li><b>Tratamentul, dacă e nevoie</b><p>Când îngrijirea obișnuită nu ajunge, medicul poate recomanda hidratarea cu acid hialuronic, într-un proces controlat.</p>${pBuze ? `<em>Acid hialuronic pentru buze · de la ${lei(pBuze)}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește cu tine evoluția și ajustează recomandările.</p></li>
</ol>
<p class="rx-links">Dacă te gândești la volum sau formă, citește întâi despre ${link('augmentare-buze', 'augmentarea buzelor')}, <a href="/nou/prima-injectare-cu-acid-hialuronic-in-buze/">prima injectare cu acid hialuronic în buze</a> și <a href="/nou/acid-in-buze-exagerat/">ce înseamnă un rezultat exagerat</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Buzele uscate pot reflecta stilul de viață, hidratarea, vremea sau un dezechilibru intern. Cu o rutină corectă și produse potrivite, de obicei se ameliorează. Când uscăciunea persistă, doare sau vine cu alte simptome, consultul medical te ajută să afli cauza.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(dermNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu
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
    lede: 'De ce se usucă buzele, ce le agravează, ce balsam alegi și ce poți face acasă. Cu o verificare rapidă care îți arată când e momentul pentru un consult dermatologic.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
