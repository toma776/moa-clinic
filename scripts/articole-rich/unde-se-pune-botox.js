// Versiunea structurată a articolului „Unde se pune botox – ghid”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vrea să știe ce zone se pot trata:
// răspunsul scurt → cum acționează → zonele feței (file interactive) → zona ochilor → cât durează → utilizări medicale → riscuri → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const srvNume = 'Toxină botulinică (Botox)';
  const bot = serv['injectare-botox']?.preturi || [];
  const pB = (re) => bot.find((p) => re.test(p.nume))?.valoare;
  const p1 = pB(/^Corecție riduri de expresie 1 zonă/i);
  const p2 = pB(/^Corecție riduri de expresie: tratament 2 zone$/i);
  const p3 = pB(/3 zone- femei/i);
  const pHiper = pret('hiperhidroza-axilara');
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['cum-actioneaza', 'Cum acționează botoxul'],
    ['zone', 'Zonele feței, pe rând'],
    ['ochi', 'Botoxul în jurul ochilor'],
    ['cat-dureaza', 'Cât durează efectul'],
    ['medical', 'Utilizări medicale'],
    ['la-moa', 'Botoxul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Unde se poate pune botox pe față?', 'Pe frunte, între sprâncene, pentru ridicarea ușoară a sprâncenelor, la ridurile laterale ale nasului (bunny lines), la laba gâștei, deasupra buzei superioare, pentru zâmbetul gingival, pe bărbie, în mușchiul maseter și pe gât. Medicul stabilește zonele după evaluare.'],
    ['Cât durează efectul botoxului?', 'Efectul este temporar. În zona ochilor durează în medie 3–6 luni, pe bărbie 3–4 luni, iar în mușchiul maseter 4–6 luni. Pentru menținerea lui sunt necesare ședințe regulate.'],
    ['Este nevoie de recuperare după botox?', 'De obicei nu. Este o procedură minim invazivă, după care îți poți relua activitatea. Medicul îți dă recomandările pentru primele ore și zile.'],
    ['Ce riscuri are botoxul în zona ochilor?', 'Pot apărea vânătăi, asimetrie temporară sau ptoză, adică pleoapă căzută. O doză prea mare sau o plasare greșită pot da și un zâmbet nefiresc. De aceea, injectarea în această zonă se face doar de un medic cu experiență.'],
    ['Se poate folosi botoxul pentru transpirație?', 'Da. Injecțiile intradermice reduc transpirația excesivă la axile, iar efectul apare în aproximativ o săptămână și durează în medie cel puțin 6 luni. Se pot trata și palmele, tălpile sau fruntea.'],
    ['Rezultatul arată natural?', 'Poate arăta natural atunci când dozele sunt bine calculate și adaptate expresiei tale. Scopul este ca ridurile să se estompeze, nu ca fața să pară „înghețată”.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Toxina botulinică <b>relaxează temporar mușchii</b> care formează ridurile de expresie. Este o procedură minim invazivă, de obicei fără perioadă de recuperare.</li>
    <li>Pe față se folosește pentru <b>frunte, zona dintre sprâncene, sprâncene, nas, ochi, buze, bărbie, maseter și gât</b>.</li>
    <li>În zona ochilor pielea este subțire, așa că se lucrează cu <b>doze mici, doar de către un medic cu experiență</b>.</li>
    <li>Efectul este <b>temporar</b>: în medie 3–6 luni, în funcție de zonă.</li>
    <li>Are și <b>utilizări medicale</b>: transpirația excesivă, migrenele cronice, bruxismul, blefarospasmul și altele.</li>
  </ul>
</section>

<h2 id="cum-actioneaza">Cum acționează botoxul</h2>
<p class="ar-first">„De ce te încrunți?” Poate ai auzit întrebarea fără să fi fost supărat(ă). Vinovate sunt adesea liniile verticale dintre sprâncene, numite și „11”. Botoxul este una dintre opțiunile pentru ele, dar și pentru multe alte zone ale feței.</p>
<p>Toxina botulinică relaxează mușchii implicați în expresie, iar pielea de deasupra lor se netezește. Rezultatul depinde de doză și de locul injectării. În mâinile unui medic cu experiență, cu doze bine calculate și adaptate nevoilor tale, rezultatul poate fi natural.</p>

<h2 id="zone">Zonele feței, pe rând</h2>
<p>Alege zona care te interesează:</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Fruntea și sprâncenele</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Ochii și nasul</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Gura și bărbia</button>
    <button type="button" role="tab" aria-selected="false" data-tab="3">Gâtul</button>
  </div>
  <div class="rx-panel" data-panel="0">
    <div class="rx-cards">
      <div class="rx-card"><i>01</i><b>Ridurile de pe frunte</b><p>Liniile orizontale, „liniile surpriză”, se accentuează cu vârsta și sunt mai vizibile când ridici sprâncenele. Botoxul le poate diminua.</p></div>
      <div class="rx-card"><i>02</i><b>Ridurile dintre sprâncene</b><p>„11”-le pot da feței un aer supărat. Toxina relaxează mușchii implicați și netezește zona.</p></div>
      <div class="rx-card"><i>03</i><b>Ridicarea sprâncenelor</b><p>Relaxând mușchii din zona sprâncenelor și păstrând activitatea frunții, se obține un efect de „mini-brow lift”.</p></div>
    </div>
    <p>Citește mai mult despre <a href="/nou/riduri-frunte/">ridurile de pe frunte</a> și <a href="/nou/riduri-intre-sprancene/">ridurile dintre sprâncene</a>.</p>
  </div>
  <div class="rx-panel" data-panel="1" hidden>
    <div class="rx-cards">
      <div class="rx-card"><i>01</i><b>Laba gâștei</b><p>Ridurile de la colțul ochilor se tratează frecvent, cu doze mici, pentru că pielea este foarte subțire.</p></div>
      <div class="rx-card"><i>02</i><b>Ridurile nazale</b><p>Liniile de pe lateralele nasului, vizibile când râzi (bunny lines), se pot reduce tot cu doze mici.</p></div>
    </div>
    <p>Citește mai mult despre <a href="/nou/riduri-laba-gastei/">ridurile laba gâștei</a> și despre <a href="/nou/bunny-lines/">bunny lines</a>.</p>
  </div>
  <div class="rx-panel" data-panel="2" hidden>
    <div class="rx-cards">
      <div class="rx-card"><i>01</i><b>Deasupra buzei</b><p>Pentru „codul de bare”, liniile verticale de deasupra buzei, se folosesc doze foarte mici, ca să nu fie afectate vorbirea sau masticația.</p></div>
      <div class="rx-card"><i>02</i><b>Zâmbetul gingival</b><p>Când gingia se vede mult la zâmbet, tot dozele mici pot ajuta.</p></div>
      <div class="rx-card"><i>03</i><b>Bărbia și maseterul</b><p>Aspectul de „coajă de portocală” al bărbiei se netezește prin relaxarea mușchiului mentalis. Injectarea în maseter poate subția vizual partea de jos a feței.</p></div>
    </div>
    <p>Citește mai mult despre <a href="/nou/riduri-in-jurul-gurii/">ridurile din jurul gurii</a>.</p>
  </div>
  <div class="rx-panel" data-panel="3" hidden>
    <p>Benzile verticale și orizontale care apar pe gât odată cu vârsta pot fi diminuate cu botox. În unele cazuri se tratează și decolteul.</p>
    <p>Citește mai mult despre <a href="/nou/riduri-pe-gat-tratament-cu-botox/">ridurile de pe gât și tratamentul cu botox</a>.</p>
  </div>
</div>

<h2 id="ochi">Botoxul în jurul ochilor</h2>
<p>Pielea din jurul ochilor este foarte subțire și sensibilă. Doza, tehnica și poziționarea punctelor de injectare contează mult pentru un rezultat natural, fără rigiditate. Efectul poate fi o reducere a ridurilor fine și un aspect mai odihnit.</p>
<div class="rx-two">
  <div><h3>Ce urmărește medicul</h3><ul><li>doze mici, adaptate zonei</li><li>puncte de injectare plasate precis</li><li>păstrarea expresiei naturale</li></ul></div>
  <div><h3>Riscuri posibile</h3><ul><li>vânătăi</li><li>asimetrie temporară</li><li>ptoză (pleoapă căzută)</li><li>zâmbet nefiresc, la o doză prea mare sau o plasare greșită</li></ul></div>
</div>
<div class="rx-alert"><b>Injectarea în zona ochilor se face doar de un medic cu experiență.</b> Dacă după procedură observi că pleoapa coboară sau apare o asimetrie, anunță medicul care te-a tratat.</div>

<h2 id="cat-dureaza">Cât durează efectul</h2>
<p>Efectul botoxului este temporar, iar pentru menținerea lui sunt necesare ședințe regulate. Durata medie diferă de la zonă la zonă:</p>
<div class="rx-compare">
  <div class="rx-col"><small>Zona ochilor</small><b>3–6 luni</b><dl><dt>Ce trebuie știut</dt><dd>doze mici, pielea e subțire</dd></dl></div>
  <div class="rx-col"><small>Bărbia</small><b>3–4 luni</b><dl><dt>Când apare efectul</dt><dd>în 3–7 zile, stabil la ~2 săptămâni</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Maseterul</small><b>4–6 luni</b><dl><dt>Când apare efectul</dt><dd>în 3–7 zile, stabil la ~2 săptămâni</dd></dl></div>
</div>

<h2 id="medical">Utilizări medicale ale botoxului</h2>
<p>Toxina botulinică se folosește și în scop terapeutic, de către medicul specialist potrivit fiecărei afecțiuni.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Transpirația excesivă</b><p>Injecțiile intradermice la axile reduc transpirația în aproximativ o săptămână, cu efect mediu de cel puțin 6 luni. Se pot trata și palmele, tălpile sau fruntea.</p></div>
  <div class="rx-card"><i>02</i><b>Migrenele cronice</b><p>Se injectează în puncte stabilite pe scalp și gât, pentru a reduce frecvența și intensitatea migrenelor.</p></div>
  <div class="rx-card"><i>03</i><b>Strabismul și blefarospasmul</b><p>Se tratează doar de medicul oftalmolog, după evaluare completă. Efectul se menține de obicei 2–4 luni în strabism și 3–4 luni în blefarospasm.</p></div>
</div>
<p>Alte afecțiuni în care se poate folosi: bruxismul, distonia cervicală, spasticitatea musculară după accident vascular cerebral și vezica hiperactivă.</p>
${id('hiperhidroza-axilara') ? `<p>Pentru transpirația excesivă, vezi ${link('hiperhidroza-axilara', 'tratamentul cu botox pentru transpirație')}${pHiper ? ` (de la ${lei(pHiper)})` : ''}.</p>` : ''}

<h2 id="la-moa">Botoxul la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Discuția</b><p>Vorbim despre zonele pe care vrei să le tratezi și despre ce rezultat îți dorești.</p></li>
  <li><b>Evaluarea</b><p>Medicul verifică asimetriile, tonusul pleoapelor și al buzelor și obiceiurile tale: cum vorbești, sportul, bruxismul.</p></li>
  <li><b>Planul și injectarea</b><p>Dozele se stabilesc echilibrat, în funcție de dorințele tale, pentru un rezultat natural. Afli riscurile, efectele adverse și alternativele.</p>${p1 ? `<em>1 zonă (frunte, ochi sau între sprâncene) · ${lei(p1)}</em>` : ''}${p2 ? `<em>2 zone · ${lei(p2)}</em>` : ''}${p3 ? `<em>3 zone, femei · ${lei(p3)}</em>` : ''}</li>
  <li><b>După procedură</b><p>Primești recomandările pentru primele ore și zile, iar efectul se vede treptat, în câteva zile.</p></li>
</ol>
<p class="rx-links">Află mai multe despre ${link('injectare-botox', 'tratamentul cu toxină botulinică')}, citește <a href="/nou/recomandari-dupa-botox/">recomandările după botox</a> și <a href="/nou/efecte-botox/">efectele botoxului</a>${dr ? `, sau vezi profilul lui <a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : ''}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Botoxul se poate folosi pe frunte, sprâncene, în jurul ochilor, la buze, bărbie, gât și decolteu, dar și în scop medical. Un rezultat pe măsura așteptărilor tale pornește de la o evaluare personalizată și de la doze potrivite obiectivului tău.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srvNume)}">Programează o evaluare</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru zonele feței
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
    lede: 'În ce zone ale feței se poate injecta botox, cât durează efectul în fiecare zonă și pentru ce afecțiuni se folosește în scop medical. Cu zonele explicate pe rând și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
