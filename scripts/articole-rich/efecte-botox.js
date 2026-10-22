// Versiunea structurată a articolului „Efecte botox: ghidul complet explicat de medici specialiști”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care cântărește un tratament cu botox:
// răspunsul scurt → cum acționează → ce vezi și când → efecte pe termen lung → efecte adverse → contraindicații (verificare rapidă) → mituri → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Cifrele nereferențiate din intro-ul vechi nu au fost preluate.
// Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const btx = serv['injectare-botox']?.preturi || [];
  const pB = (re) => btx.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['cum-actioneaza', 'Ce este și cum acționează'],
    ['rezultate', 'Ce vezi și când'],
    ['termen-lung', 'Efecte pe termen lung'],
    ['efecte-adverse', 'Efecte adverse posibile'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['mituri', 'Mituri despre botox'],
    ['la-moa', 'Botoxul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cât durează efectul botoxului?', 'De regulă între 3 și 6 luni, în funcție de zona tratată, de doză și de felul în care reacționează organismul tău. Pentru a-l menține, tratamentul se poate repeta, dar nu mai devreme de 3 luni.'],
    ['Când apar rezultatele?', 'Primele efecte apar de obicei în prima săptămână, iar rezultatul final se instalează în 10–14 zile.'],
    ['Botoxul îmi blochează expresiile?', 'Când este făcut corect, nu. Atenuează mișcările exagerate ale mușchilor, dar poți în continuare să zâmbești, să te miri sau să te încrunți. Rigiditatea poate apărea când dozele sunt prea mari sau injecțiile prea dese.'],
    ['Dacă renunț, ridurile se agravează?', 'Nu. Mușchii revin treptat la activitatea normală, iar pielea revine la starea ei de dinainte. Ridurile pot părea mai vizibile doar pentru că te-ai obișnuit cu un aspect mai neted.'],
    ['Pot face botox și bărbații?', 'Da. Tot mai mulți bărbați aleg tratamentul, iar doza și punctele de injectare se adaptează musculaturii mai puternice și expresiilor specifice.'],
    ['Poate deveni botoxul mai puțin eficient în timp?', 'În cazuri rare, corpul poate produce anticorpi, mai ales la doze mari sau injecții foarte dese. Un interval de cel puțin 3–4 luni între ședințe ajută la reducerea acestui risc.'],
  ];

  const intrebariCheck = [
    ['Ai o alergie cunoscută la toxina botulinică sau la componentele produsului?', 'Alergia la produs este o contraindicație a tratamentului.'],
    ['Ai o afecțiune neuromusculară, de exemplu miastenia gravis sau scleroză laterală amiotrofică?', 'Afecțiunile neuromusculare sunt contraindicații; medicul trebuie să știe de ele.'],
    ['Ești însărcinată sau alăptezi?', 'Tratamentul cu toxină botulinică nu se face în sarcină și alăptare.'],
    ['Ai o infecție sau o inflamație activă în zona care ar urma să fie tratată?', 'Injectarea se amână până când zona se vindecă.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Botoxul este toxină botulinică de tip A, folosită în doze mici pentru a <b>relaxa temporar mușchii</b> care formează ridurile de expresie.</li>
    <li>Primele efecte apar de obicei <b>în prima săptămână</b>, rezultatul final în <b>10–14 zile</b>, iar efectul durează <b>3–6 luni</b>.</li>
    <li>Reacțiile frecvente sunt <b>ușoare și trecătoare</b>: roșeață, mici vânătăi, o ușoară umflare. Rar pot apărea asimetrii sau căderea temporară a pleoapei.</li>
    <li><b>Nu se face</b> în sarcină și alăptare, în caz de alergie la produs, afecțiuni neuromusculare sau infecție activă în zonă.</li>
    <li>La MOA, tratamentul începe cu <b>o evaluare medicală</b>${pret('injectare-botox') ? `; corecția ridurilor de expresie pornește de la ${lei(pret('injectare-botox'))}` : ''}.</li>
  </ul>
</section>

<h2 id="cum-actioneaza">Ce este botoxul și cum acționează</h2>
<p class="ar-first">Dacă te gândești la botox, probabil te interesează două lucruri: ce poate face pentru tine și ce riscuri are. Merită să le cunoști pe amândouă, pentru că o decizie bună se ia cu toate informațiile pe masă, nu doar cu promisiunile.</p>
<p>Botoxul este o substanță obținută din toxina botulinică de tip A, produsă de bacteria <b>Clostridium botulinum</b>. În doze controlate și sub supraveghere medicală, este folosit de peste două decenii în medicina estetică. În dermatologie se folosește și pentru transpirația excesivă.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Blochează acetilcolina</b><p>Toxina oprește temporar eliberarea acetilcolinei, substanța prin care nervii le transmit mușchilor să se contracte.</p></div>
  <div class="rx-card"><i>02</i><b>Mușchiul se relaxează</b><p>Fără semnal, mușchiul tratat nu se mai încordează, iar pielea de deasupra devine mai netedă.</p></div>
  <div class="rx-card"><i>03</i><b>Funcția revine</b><p>Efectul nu este permanent. După câteva luni, mușchii își recapătă complet funcția.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Pentru ce se folosește în estetică</span>
  <ul class="rx-chips"><li>ridurile de expresie</li><li>benzile verticale ale gâtului</li><li>conturul bărbiei</li><li>zâmbetul gingival</li><li>transpirația excesivă</li></ul>
</div>

<h2 id="rezultate">Ce vezi și când</h2>
<p>Schimbările apar treptat. Primele efecte se văd, de obicei, în prima săptămână, iar rezultatul final se instalează în 10–14 zile.</p>
<div class="rx-two">
  <div><h3>Imediat după injectare</h3><ul><li>o ușoară roșeață</li><li>mici vânătăi</li><li>o umflare discretă la locul înțepăturii</li></ul><p>Trec, de cele mai multe ori, de la sine în câteva ore sau zile.</p></div>
  <div><h3>În primele două săptămâni</h3><ul><li>mușchii tratați se relaxează treptat</li><li>ridurile dinamice, cele care apar când râzi sau te încrunți, se netezesc</li><li>fața poate arăta mai odihnită</li></ul></div>
</div>
<p>Efectul durează, de regulă, <b>între 3 și 6 luni</b>, în funcție de zona tratată, de doză și de felul în care reacționează corpul tău. Tratamentul se poate repeta, dar nu mai devreme de 3 luni.</p>

<h2 id="termen-lung">Efecte pe termen lung</h2>
<p>Folosită regulat și corect, toxina botulinică poate relaxa treptat mușchii hiperactivi, ceea ce poate încetini formarea ridurilor noi. Acționează local, acolo unde este injectată. Expresiile rămân: poți zâmbi, te poți mira sau întrista, doar că fața arată mai relaxată.</p>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Dozele prea mari sau injecțiile prea dese pot da un aspect rigid. În cazuri rare, mai ales la doze mari, injecții foarte dese sau utilizări medicale intense, corpul poate produce anticorpi, iar tratamentul devine mai puțin eficient. Riscul se reduce cu un interval de cel puțin 3–4 luni între ședințe, cu rotirea zonelor tratate și, uneori, cu alegerea altei formule de toxină botulinică.</p></aside>

<h2 id="efecte-adverse">Efecte adverse posibile</h2>
<p>Botoxul este o procedură minim invazivă, dar nu lipsită de riscuri. Administrat incorect, poate da un aspect „înghețat” sau poate migra spre mușchi nedoriți.</p>
<div class="rx-two">
  <div><h3>Frecvente, ușoare</h3><ul><li>disconfort sau durere ușoară la locul injectării</li><li>roșeață sau umflare discretă</li><li>vânătăi minore</li><li>senzație de tensiune sau „greutate”</li></ul><p>Dispar, de obicei, în câteva ore până la câteva zile.</p></div>
  <div><h3>Rare</h3><ul><li>asimetrie facială</li><li>căderea temporară a pleoapei superioare (ptoză)</li><li>slăbiciune musculară ușoară în zona injectată</li></ul><p>Sunt reversibile și trec de obicei în câteva săptămâni, dar se urmăresc de medic.</p></div>
</div>
<div class="rx-alert"><b>Contactează medicul dacă observi:</b> căderea pleoapei sau a sprâncenei care durează mai mult de câteva zile, dificultăți la vorbire, mestecat sau înghițire, slăbiciune musculară în zone care nu au fost tratate, erupții, umflături sau dificultăți de respirație.</div>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>4 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Unele dintre aceste situații sunt contraindicații, altele doar amână tratamentul. Medicul îți evaluează istoricul la consult și îți spune ce opțiuni ai.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre contraindicațiile frecvente.</b><p>Înainte de injectare, medicul face oricum o evaluare: discută cu tine zonele de tratat, ce medicamente iei și ce rezultat urmărești.</p><a class="btn btn-gold" href="#programare" data-srv="Toxină botulinică (Botox)">Programează-te pentru botox</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="mituri">Mituri despre botox</h2>
<h3>„Botoxul este doar pentru femei”</h3>
<p>Tot mai mulți bărbați aleg tratamentul, pentru riduri sau pentru un aspect mai odihnit. Doza și punctele de injectare se adaptează musculaturii mai puternice și expresiilor specifice, pentru un rezultat natural.</p>
<h3>„Rezultatele sunt permanente”</h3>
<p>Efectele sunt temporare și durează, în general, 3–6 luni. Apoi mușchii își reiau treptat activitatea, iar ridurile pot reveni dacă tratamentul nu se repetă.</p>
<h3>„Îți blochează complet expresiile”</h3>
<p>Aplicat corect, nu. Zâmbetul, surpriza sau tristețea rămân vizibile. Problemele apar când dozele sunt prea mari sau injecțiile sunt făcute greșit.</p>
<h3>„Dacă te oprești, ridurile se agravează”</h3>
<p>Nu. Pielea revine la starea ei de dinainte, iar ridurile se formează în ritmul natural. Pot părea mai vizibile doar pentru că te-ai obișnuit cu un aspect mai neted.</p>

<h2 id="la-moa">Botoxul la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Evaluarea medicală</b><p>Medicul îți verifică istoricul și contraindicațiile, discută așteptările tale și îți răspunde la întrebări.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Injectarea</b><p>Doza și punctele de injectare se stabilesc după anatomia feței tale.</p>${pB(/1 zonă/i) ? `<em>1 zonă · ${lei(pB(/1 zonă/i))}</em>` : ''}${pB(/2 zone/i) ? `<em>2 zone · ${lei(pB(/2 zone/i))}</em>` : ''}${pB(/3 zone.*femei/i) ? `<em>3 zone, femei · ${lei(pB(/3 zone.*femei/i))}</em>` : ''}${pB(/3 zone.*bărbați/i) ? `<em>3 zone, bărbați · ${lei(pB(/3 zone.*bărbați/i))}</em>` : ''}</li>
  <li><b>Primele zile</b><p>Urmezi recomandările de după procedură; roșeața și eventualele vânătăi trec, de obicei, repede.</p></li>
  <li><b>Reevaluarea</b><p>După 10–14 zile, când efectul s-a instalat, medicul verifică rezultatul și, dacă e nevoie, propune o ajustare.</p></li>
</ol>
<p class="rx-links">Citește și ${link('injectare-botox', 'despre tratamentul cu toxină botulinică la MOA')}, ${link('hiperhidroza-axilara', 'botoxul pentru transpirație')}, <a href="/nou/ce-nu-e-permis-dupa-injectarea-cu-botox/">ce nu e permis după botox</a> și <a href="/nou/riduri-de-expresie/">ridurile de expresie</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Botoxul poate netezi ridurile de expresie, dar nu este potrivit pentru oricine și are riscuri de care trebuie să ții cont. O decizie bună pornește de la o evaluare individuală și o discuție deschisă cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă a contraindicațiilor, cu da/nu
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
    lede: 'Cum acționează botoxul, ce rezultate vezi și când, ce efecte adverse pot apărea și cine nu ar trebui să-l facă. Cu o verificare rapidă a contraindicațiilor și miturile frecvente, explicate.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
