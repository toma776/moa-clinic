// Versiunea structurată a articolului „Riduri pe gât tratament cu botox: ce trebuie să știi”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la botox pentru gât:
// răspunsul scurt → de ce apar ridurile → cum acționează → când se vede și cât ține → dacă i se potrivește (verificare rapidă)
// → riscuri → alternative → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const pP = (sid, re) => (serv[sid]?.preturi || []).find((p) => re.test(p.nume))?.valoare;
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');
  const pNef = pret('nefertiti-lift');
  const pViva = pP('venus-viva', /fracționată gat$/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['de-ce-apar', 'De ce apar ridurile pe gât'],
    ['cum-functioneaza', 'Cum acționează botoxul pe gât'],
    ['rezultate', 'Când se vede și cât ține'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['riscuri', 'Riscuri și contraindicații'],
    ['alternative', 'Alternative la botox'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Doare injectarea cu botox în zona gâtului?', 'Disconfortul este de obicei mic. Se folosesc ace foarte fine, iar senzația seamănă cu niște înțepături scurte. Nu este nevoie de recuperare și îți poți relua activitățile în aceeași zi.'],
    ['Cât durează procedura?', 'De obicei între 10 și 20 de minute, în funcție de zona tratată și de numărul punctelor de injectare.'],
    ['Când se văd rezultatele?', 'Primele schimbări apar, de regulă, în 3–5 zile, iar efectul complet se vede după aproximativ o săptămână. Mușchii se relaxează treptat, nu brusc.'],
    ['Cât ține efectul?', 'Efectul nu este permanent. În medie se menține între 4 și 6 luni, în funcție de organism, de stilul de viață și de cât de activi sunt mușchii. Tratamentul se repetă, de obicei, la 3–6 luni, când recomandă medicul.'],
    ['Ridurile revin mai accentuate după ce trece efectul?', 'Nu. Pe măsură ce efectul dispare, liniile revin treptat la cum erau înainte de tratament.'],
    ['Ce fac dacă am riduri fine sau pielea pare deshidratată?', 'În acest caz, medicul poate recomanda acid hialuronic, care hidratează și umple liniile fine, sau tratamente care stimulează colagenul. Uneori variantele se combină.'],
  ];

  const intrebariCheck = [
    ['Ești însărcinată sau alăptezi?', 'În sarcină și alăptare, botoxul nu este recomandat.'],
    ['Ai o afecțiune neurologică sau musculară diagnosticată?', 'Unele afecțiuni ale nervilor sau mușchilor fac tratamentul nepotrivit; medicul verifică istoricul.'],
    ['Ai o infecție sau o iritație în zona gâtului?', 'Injectarea se amână până când pielea din zonă este vindecată.'],
    ['Ai alergii cunoscute la substanțele folosite?', 'Medicul verifică produsul și istoricul tău de alergii înainte de tratament.'],
    ['Urmezi un tratament care poate influența reacția mușchilor?', 'Unele medicamente pot schimba răspunsul la toxina botulinică; medicul evaluează acest aspect.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile de pe gât apar din <b>pierderea de colagen și elastină</b>, din <b>expunerea la soare</b> și din <b>poziția capului</b> aplecat spre telefon sau laptop.</li>
    <li>Botoxul <b>relaxează mușchii platisma</b>, care formează benzile verticale și pliurile gâtului. Pielea se netezește treptat.</li>
    <li>Procedura durează <b>10–20 de minute</b>, primele schimbări apar în <b>3–5 zile</b>, iar efectul se menține, în medie, <b>4–6 luni</b>.</li>
    <li>Nu se face în <b>sarcină și alăptare</b> sau fără evaluare în afecțiuni neurologice ori musculare, infecții locale și alergii.</li>
    <li>Pentru riduri fine sau piele deshidratată există și <b>alternative</b>: acid hialuronic, radiofrecvență sau laser. Medicul îți spune ce se potrivește.</li>
  </ul>
</section>

<h2 id="de-ce-apar">De ce apar ridurile pe gât</h2>
<p class="ar-first">Primele riduri le observi, de obicei, pe față: în jurul ochilor, pe frunte. Cu timpul începi să le vezi și pe gât, unde devin deranjante. Mulți oameni încep atunci, în jurul vârstei de 35–40 de ani, să caute ceva mai mult decât o cremă. Înainte de orice decizie, merită să știi de ce apar, cum acționează toxina botulinică și ce alte variante ai.</p>
<p>Gâtul îmbătrânește adesea mai repede decât fața, poate și pentru că nu primește aceeași atenție. Pielea de aici este <b>mai subțire și mai sensibilă</b> și reacționează repede la factorii externi și la stilul de viață.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Mai puțin colagen și elastină</b><p>Cu vârsta, corpul produce tot mai puțin din cele două elemente care țin pielea fermă și elastică. Pielea se subțiază, iar liniile fine devin, în timp, riduri vizibile.</p></div>
  <div class="rx-card"><i>02</i><b>Soarele</b><p>Gâtul este des uitat când aplici protecție solară. Radiațiile UV afectează colagenul și contribuie la riduri, pete și pierderea fermității. Efectul se acumulează în timp.</p></div>
  <div class="rx-card"><i>03</i><b>Poziția capului</b><p>Privitul în jos, ore întregi, spre telefon sau laptop creează pliuri repetitive. În timp, ele se „fixează” în piele, ca linii cunoscute și ca „tech neck”.</p></div>
</div>

<h2 id="cum-functioneaza">Cum acționează botoxul pe ridurile de pe gât</h2>
<p>Botoxul este o formă purificată de toxină botulinică. Injectată în cantități mici, <b>relaxează mușchii</b> responsabili de riduri. Pe gât, problema nu ține doar de piele, ci și de <b>mușchii platisma</b>, mușchii superficiali ai gâtului, care în timp formează benzi verticale sau pliuri. Când acești mușchi se relaxează, pielea devine mai netedă, iar liniile se estompează treptat, în câteva zile.</p>
<div class="rx-two">
  <div><h3>Unde se injectează</h3><ul><li>în benzile verticale ale gâtului (platisma)</li><li>în zona mandibulei, pentru un efect mai armonios</li></ul><p>Tratamentul se personalizează: fiecare structură musculară este diferită, așa că nu există un tipar identic pentru toți.</p></div>
  <div><h3>Cum decurge</h3><ul><li>durează, de obicei, 10–20 de minute</li><li>se folosesc ace foarte fine, senzația seamănă cu niște înțepături scurte</li><li>nu e nevoie de recuperare; îți reiei activitățile în aceeași zi</li></ul></div>
</div>

<h2 id="rezultate">Când se vede rezultatul și cât ține</h2>
<p>Nu pleci din clinică cu diferența vizibilă. Mușchii se relaxează treptat, așa că schimbarea este progresivă, nu bruscă.</p>
<div class="rx-cards">
  <div class="rx-card"><i>3–5 zile</i><b>Primele schimbări</b><p>Pielea începe să arate mai netedă pe măsură ce mușchii se relaxează.</p></div>
  <div class="rx-card"><i>~1 săpt.</i><b>Efectul complet</b><p>Rezultatul se vede în întregime după aproximativ o săptămână.</p></div>
  <div class="rx-card"><i>4–6 luni</i><b>Cât se menține</b><p>În medie, în funcție de organism, stil de viață și cât de activi sunt mușchii. Tratamentul se repetă, de obicei, la 3–6 luni.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Efectul nu este permanent, dar este predictibil: știi la ce să te aștepți și poți decide dacă vrei să îl menții. La unele persoane durează mai puțin, la altele mai mult. Unii observă că, după câteva ședințe, intervalul dintre tratamente poate crește. Când efectul trece, ridurile revin treptat la cum erau, nu mai accentuate. Dacă urmărești și tonifierea conturului feței și a gâtului, medicul poate discuta tehnica ${link('nefertiti-lift', 'Nefertiti Lift')}.</p></aside>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă neapărat că tratamentul e exclus, ci că decizia se ia după un consult, în care medicul îți verifică istoricul și tratamentele.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile frecvente.</b><p>Pasul următor este evaluarea cu medicul: îți examinează gâtul, vede ce tip de riduri ai și stabilește dacă botoxul, altă variantă sau o combinație ți se potrivește.</p><a class="btn btn-gold" href="#programare" data-srv="Toxină botulinică (Botox)">Programează-te pentru evaluare</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="riscuri">Riscuri și contraindicații</h2>
<p>În general, tratamentul este bine tolerat, mai ales când îl face un medic cu experiență. Reacțiile, când apar, sunt de obicei ușoare și trecătoare.</p>
<div class="rx-two">
  <div><h3>Reacții posibile</h3><ul><li>ușoară roșeață în zona injectată</li><li>mici vânătăi</li><li>sensibilitate sau senzație de tensiune</li><li>un disconfort discret în primele ore</li></ul><p>De obicei dispar în 1–2 zile. Mai rar pot apărea o asimetrie temporară, senzația de mușchi mai „rigizi” sau un efect mai slab ori mai intens decât te așteptai, care se poate ajusta ulterior.</p></div>
  <div><h3>Când nu se recomandă</h3><ul><li>sarcină sau alăptare</li><li>anumite afecțiuni neurologice sau musculare</li><li>infecții sau iritații în zona de tratat</li><li>alergii cunoscute la substanțele folosite</li><li>tratamente care pot influența reacția mușchilor (evaluate de medic)</li></ul></div>
</div>
<div class="rx-alert"><b>De ce contează cine injectează:</b> zona gâtului este delicată, iar doza și punctele de injectare trebuie adaptate precis. Reacțiile serioase sunt rare și apar, de regulă, când procedura nu este făcută corect. Dacă o reacție nu trece în câteva zile, anunță medicul.</div>

<h2 id="alternative">Alternative la botox pentru ridurile de pe gât</h2>
<p>Botoxul nu este singura opțiune. În funcție de tipul ridurilor și de ce urmărești, alte variante pot funcționa singure sau în combinație.</p>
<div class="rx-compare">
  <div class="rx-col rx-col-on"><small>Toxină botulinică</small><b>Relaxează mușchii</b><dl><dt>Potrivit pentru</dt><dd>benzi verticale și pliuri formate de mușchii platisma</dd><dt>Când se vede</dt><dd>în 3–5 zile, complet după o săptămână</dd><dt>Cât ține</dt><dd>în medie 4–6 luni</dd></dl>${id('injectare-botox') ? `<a class="link-u" href="${esc(live('injectare-botox'))}">Despre toxina botulinică →</a>` : ''}</div>
  <div class="rx-col"><small>Acid hialuronic</small><b>Acționează în piele</b><dl><dt>Potrivit pentru</dt><dd>riduri fine, piele deshidratată</dd><dt>Ce face</dt><dd>hidratează, umple liniile fine, îmbunătățește textura și elasticitatea</dd><dt>Expresivitatea</dt><dd>nu este afectată</dd></dl>${id('injectari-acid-hialuronic') ? `<a class="link-u" href="${esc(live('injectari-acid-hialuronic'))}">Despre acidul hialuronic →</a>` : ''}</div>
  <div class="rx-col"><small>Laser sau radiofrecvență</small><b>Stimulează colagenul</b><dl><dt>Potrivit pentru</dt><dd>calitatea pielii, fermitate, dacă nu vrei injectări</dd><dt>Când se vede</dt><dd>progresiv, după mai multe ședințe</dd><dt>Combinare</dt><dd>poate completa un tratament deja început</dd></dl>${id('venus-viva') ? `<a class="link-u" href="${esc(live('venus-viva'))}">Despre radiofrecvența Venus Viva →</a>` : ''}</div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Îngrijirea de zi cu zi a gâtului</span>
  <ul class="rx-chips"><li>protecție solară și pe gât</li><li>hidratare și ingrediente pentru elasticitate</li><li>evită să ții capul aplecat mult timp</li><li>include gâtul în rutina zilnică</li></ul>
</div>
<p>Orice tratament alegi, consecvența contează: micile obiceiuri, repetate în timp, se văd.</p>

<h2 id="la-moa">Tratamentul cu botox pentru gât la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul îți examinează gâtul, vede dacă ridurile țin de mușchi, de piele sau de amândouă și îți verifică istoricul și tratamentele.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul</b><p>Stabilește punctele de injectare și doza potrivite structurii tale musculare sau îți recomandă o alternativă.</p>${pNef ? `<em>Nefertiti Lift · ${lei(pNef)}</em>` : ''}</li>
  <li><b>Injectarea</b><p>Durează 10–20 de minute, cu ace foarte fine. Îți reiei activitățile în aceeași zi.</p></li>
  <li><b>Reevaluarea</b><p>Efectul se urmărește în zilele următoare; o eventuală ajustare se discută cu medicul. Repetarea se face, de obicei, la 3–6 luni.</p></li>
</ol>
<p class="rx-links">Citește și ${link('injectare-botox', 'pagina despre toxina botulinică')}, <a href="/nou/recomandari-dupa-botox/">recomandările după botox</a>${pViva ? `, ${link('venus-viva', `radiofrecvența Venus Viva pentru gât (${lei(pViva)})`)}` : `, ${link('venus-viva', 'radiofrecvența Venus Viva')}`} și ghidul despre <a href="/nou/riduri/">riduri și metode de estompare</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Ridurile de pe gât apar adesea mai repede decât te aștepți și sunt greu de estompat doar cu produse aplicate acasă. Nu trebuie să alegi primul tratament despre care auzi: contează să înțelegi cum funcționează fiecare variantă și ce ți se potrivește. Primul pas este o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu înainte de botox pentru gât
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
    lede: 'De ce apar ridurile pe gât, cum acționează botoxul asupra mușchilor platisma, când se vede efectul și cât ține. Cu o verificare rapidă a contraindicațiilor și alternativele de discutat cu medicul.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
