// Versiunea structurată a articolului „Riduri în jurul gurii: cauze și tratamente”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care își observă ridurile periorale:
// răspunsul scurt → ce sunt → de ce apar → ce obiceiuri le adâncesc (verificare rapidă) → prevenție → tratamente → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => (id(sid) ? minPrice(sid) : null);
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt ridurile periorale'],
    ['cauze', 'De ce apar'],
    ['obiceiuri', 'Obiceiuri care le adâncesc'],
    ['preventie', 'Cum le previi'],
    ['tratamente', 'Tratamente în clinică'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De ce apar ridurile deasupra buzei superioare?', 'Liniile verticale de deasupra buzei apar des la fumători: țuguierea repetată a buzelor și fumul afectează circulația și oxigenarea pielii. Același gest repetat apare și când bei constant cu paiul.'],
    ['De la ce vârstă ar trebui să folosesc o cremă antirid?', 'După 25–30 de ani, pielea începe să producă mai puțin colagen, așa că este un moment potrivit pentru o cremă adaptată vârstei și tipului de ten, cu ingrediente ca acidul hialuronic, retinolul, peptidele sau vitamina C.'],
    ['Ce tratament se potrivește pentru ridurile din jurul gurii?', 'Depinde de tipul ridurilor. Acidul hialuronic redă volum și hidratare, skinboosterul și mezoterapia îmbunătățesc textura, Sculptra și HArmonyCa stimulează colagenul, iar toxina botulinică se folosește pentru ridurile dinamice. Medicul alege la consult.'],
    ['Pot preveni ridurile periorale?', 'Nu poți opri procesul natural, dar îl poți încetini: renunță la fumat, folosește zilnic SPF 30+, hidratează-te, evită paiul și fii atent(ă) la gesturi precum strânsul buzelor.'],
    ['Remediile naturale ajută?', 'Uleiurile vegetale (de măsline, ricin sau argan), aplicate cu un masaj ușor, hrănesc pielea. Efectul lor apare treptat și depinde de consecvență.'],
    ['Cât de repede se văd rezultatele tratamentelor?', 'Diferă de la un tratament la altul: acidul hialuronic are un efect vizibil imediat, în timp ce Sculptra acționează progresiv. Rezultatele variază de la o persoană la alta.'],
  ];

  const intrebariCheck = [
    ['Fumezi?', 'Țuguierea buzelor și fumul afectează circulația și oxigenarea pielii și pot grăbi ridurile de deasupra buzei.'],
    ['Bei des cu paiul?', 'Buzele se mișcă repetitiv în aceeași poziție, cu un efect asemănător fumatului.'],
    ['Ieși la soare fără cremă cu SPF?', 'Razele UV degradează colagenul și elastina, chiar și în zilele înnorate sau iarna.'],
    ['Bei, de obicei, mai puțin de 2 litri de apă pe zi?', 'Pielea deshidratată își pierde elasticitatea, iar ridurile devin mai vizibile.'],
    ['Dormi mereu pe aceeași parte?', 'Presiunea constantă pe față poate contribui, în timp, la formarea ridurilor.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile din jurul gurii (periorale) apar când pielea <b>pierde colagen și elastină</b>, dar și din cauza <b>expresiilor repetate</b> și a geneticii.</li>
    <li>Câteva obiceiuri le pot adânci fără să-ți dai seama: <b>fumatul, paiul, soarele fără protecție, deshidratarea</b> și poziția în somn.</li>
    <li>Prevenția înseamnă <b>SPF 30+ zilnic</b>, hidratare, renunțarea la fumat, masaj facial și o cremă antirid potrivită după 25–30 de ani.</li>
    <li>Pentru ridurile deja formate, opțiunile includ <b>acid hialuronic, mezoterapie, skinbooster, Sculptra, HArmonyCa</b> și <b>toxina botulinică</b> pentru ridurile dinamice.</li>
    <li>Tratamentul se alege <b>la consult</b>, după tipul ridurilor și nevoile pielii tale.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile din jurul gurii</h2>
<p class="ar-first">Într-o dimineață, în fața oglinzii, observi câteva linii în jurul gurii. Se întâmplă, la un moment dat, fiecăruia dintre noi. Ridurile sunt urme fine ale emoțiilor și ale anilor trăiți, dar odată ce apar, e firesc să vrei să le estompezi sau măcar să le încetinești evoluția.</p>
<p>Ridurile periorale sunt liniile fine din jurul gurii, în colțuri sau deasupra buzei superioare, care în timp devin mai vizibile și mai adânci. Apar atunci când pielea își pierde fermitatea, colagenul și elastina. Nu doar vârsta stă în spatele lor, ci și gesturi mici, repetate zilnic.</p>

<h2 id="cauze">De ce apar ridurile periorale</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Mai puțin colagen și elastină</b><p>Cu anii, producția scade. Pielea reține mai greu apa, devine mai uscată și mai fragilă, iar liniile fine apar treptat.</p></div>
  <div class="rx-card"><i>02</i><b>Expresiile repetate</b><p>Zâmbetul, râsul, strânsul buzelor solicită mușchii din jurul gurii. Strânsul buzelor și fumatul forțează în mod special această zonă.</p></div>
  <div class="rx-card"><i>03</i><b>Genetica</b><p>Dacă mama sau bunica ta au avut devreme riduri, e posibil să fii predispus(ă). Genele nu decid însă totul: îngrijirea și obiceiurile pot încetini procesul.</p></div>
</div>
<p>La fel ca în jurul gurii, mișcările repetate ale mușchilor lasă urme și în alte zone ale feței. Află mai multe în articolul despre <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>.</p>

<h2 id="obiceiuri">Ce obiceiuri îți pot adânci ridurile</h2>
<p>Ridurile nu apar „peste noapte”, ci treptat, din gesturi aparent inofensive. Verifică rapid care dintre ele fac parte din ziua ta.</p>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar ce obiceiuri merită schimbate.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Ai cel puțin un obicei care poate accentua ridurile.</b><p>Primul pas este să renunți la obiceiurile care le adâncesc. Dacă ridurile sunt deja vizibile, la consult medicul îți spune ce tratament se potrivește tipului tău de riduri și de piele.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Obiceiurile tale protejează deja pielea.</b><p>Păstrează rutina: SPF zilnic, hidratare și o cremă potrivită vârstei. Dacă ai totuși riduri care te deranjează, ele pot ține de colagen, de expresii sau de genetică, iar medicul îți poate recomanda un tratament.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează o evaluare</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>
<p>Nu e nevoie să renunți la zâmbet sau să-ți „controlezi” emoțiile. E suficient să observi gesturi ca încruntarea sau strânsul buzelor și să relaxezi mușchii feței atunci când poți.</p>

<h2 id="preventie">Cum previi ridurile din jurul gurii</h2>
<p>Nu putem opri îmbătrânirea, dar o putem încetini. Secretul ține de obiceiuri zilnice și de puțină disciplină:</p>
<ul>
  <li><b>Renunță la fumat.</b> Fumatul reduce oxigenarea pielii, afectează colagenul și lasă urme vizibile în jurul buzelor.</li>
  <li><b>Aplică zilnic SPF 30+.</b> Dimineața, indiferent de anotimp, chiar și când cerul este înnorat.</li>
  <li><b>Hidratează-te din interior și din exterior.</b> Bea cel puțin 2 litri de apă pe zi și folosește o cremă sau un ser potrivit tipului tău de ten.</li>
  <li><b>Fă un masaj facial seara.</b> Câteva minute, cu mișcări blânde și circulare, după curățare și cremă. Poți adăuga exerciții simple pentru buze.</li>
  <li><b>Alege o cremă antirid potrivită.</b> După 25–30 de ani, caută acid hialuronic, retinol, peptide sau vitamina C.</li>
</ul>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Uleiurile vegetale (de măsline, ricin sau argan) și rutina de îngrijire pot ajuta, dar efectul lor apare treptat și depinde de consecvență. Pentru o schimbare vizibilă într-un timp mai scurt se discută tratamentele din clinică. Rezultatele pot varia în funcție de particularitățile fiecărei persoane.</p></aside>

<h2 id="tratamente">Tratamente pentru ridurile deja vizibile</h2>
<p>Fiecare procedură se adaptează nevoilor pielii, pentru un rezultat natural. Iată cum se împart opțiunile:</p>
<div class="rx-two">
  <div><h3>Redau volum și hidratare</h3><ul><li>${link('injectari-acid-hialuronic', '<b>Acid hialuronic</b>')}: atrage și reține apa, redă volum zonelor afectate de riduri; efectul se vede imediat.</li><li>${link('mezoterapie', '<b>Mezoterapie</b>')}: microinjectări cu acid hialuronic și vitamine, pentru o piele mai elastică și mai luminoasă.</li><li>${link('skinbooster-vital', '<b>Skinbooster Vital</b>')}: hidratare intensă și textură mai fină, fără volum suplimentar.</li></ul></div>
  <div><h3>Stimulează colagenul sau relaxează mușchii</h3><ul><li>${link('sculptra', '<b>Sculptra</b>')}: stimulează producția de colagen; rezultatele apar progresiv.</li><li>${link('harmonyca', '<b>HArmonyCa</b>')}: acid hialuronic combinat cu hidroxiapatită de calciu, care hidratează și stimulează colagenul.</li><li>${link('injectare-botox', '<b>Toxină botulinică</b>')}: pentru ridurile dinamice, cele care apar prin mișcarea mușchilor.</li></ul></div>
</div>

<h2 id="la-moa">Tratamentul ridurilor periorale la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul evaluează tipul ridurilor (dinamice sau vizibile în repaus), calitatea pielii și obiceiurile tale.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul personalizat</b><p>Se alege tratamentul potrivit sau o combinație, în funcție de nevoile pielii tale.</p></li>
  <li><b>Procedura</b><p>Tratamentul se face în clinică, adaptat tipului de ten.</p>${pret('injectari-acid-hialuronic') ? `<em>Acid hialuronic · de la ${lei(pret('injectari-acid-hialuronic'))}</em>` : ''}${pret('mezoterapie') ? `<em>Mezoterapie · de la ${lei(pret('mezoterapie'))}</em>` : ''}${pret('skinbooster-vital') ? `<em>Skinbooster Vital · de la ${lei(pret('skinbooster-vital'))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește rezultatul și îți spune ce poți face, acasă și în clinică, pentru a-l menține.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/ridurile-fumatorului/">ridurile fumătorului</a>, <a href="/nou/riduri-marioneta/">ridurile marionetă</a> sau <a href="/nou/riduri-intre-sprancene/">ridurile dintre sprâncene</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Ridurile din jurul gurii sunt un semn al trăirilor tale, nu un capăt de lume. Dacă vrei să le estompezi, poți începe cu obiceiurile zilnice și poți discuta cu medicul despre tratamentul care ți se potrivește.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă a obiceiurilor, cu da/nu
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
    lede: 'De ce apar ridurile din jurul gurii, ce obiceiuri zilnice le adâncesc, cum le previi și ce tratamente se folosesc când sunt deja vizibile. Cu o verificare rapidă a obiceiurilor tale.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
