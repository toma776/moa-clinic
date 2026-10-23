// Versiunea structurată a articolului „NADH și infertilitatea”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește un cuplu care caută informații despre NADH și fertilitate:
// răspunsul scurt → ce este NADH → de ce se discută legătura cu fertilitatea → ce arată cercetările și ce nu știm → dacă e bine să discute întâi cu medicul → cum se folosește → la MOA → întrebări.
// NADH este prezentat ca susținere studiată, nu ca tratament al infertilității. Fără superlative și fără rezultate promise (Decizia CMR 20/2025).
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație antiaging (cu vârsta biologică)';
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este NADH'],
    ['fertilitate', 'Legătura cu fertilitatea'],
    ['cercetari', 'Ce arată cercetările'],
    ['potrivit', 'Discută întâi cu medicul? Verificare rapidă'],
    ['utilizare', 'Cum se folosește NADH'],
    ['siguranta', 'Efecte adverse și precauții'],
    ['la-moa', 'Planul personalizat la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['NADH tratează infertilitatea?', 'Nu poate fi considerat un tratament al infertilității. Cercetările sugerează că poate susține energia celulară și calitatea celulelor reproductive, dar cauzele infertilității se evaluează și se tratează de medicul specialist. NADH poate fi, cel mult, o parte dintr-un plan stabilit împreună cu medicii tăi.'],
    ['Este NADH util și pentru bărbați?', 'Da, a fost studiat la ambele sexe. Unele studii au observat o îmbunătățire a mobilității spermatozoizilor după administrarea de NADH, dar rezultatele trebuie confirmate pe grupuri mai mari.'],
    ['Ce doză se folosește?', 'Pentru suplimentele orale, dozele folosite de obicei sunt între 5 și 20 mg pe zi. Doza potrivită pentru tine, mai ales dacă urmezi un tratament de fertilitate sau o procedură FIV, o stabilește medicul.'],
    ['Pot lua NADH dacă sunt însărcinată sau alăptez?', 'Nu fără acordul medicului. În sarcină și alăptare, orice supliment se discută întâi cu medicul care te urmărește.'],
    ['Ce efecte adverse poate avea?', 'NADH este considerat, în general, bine tolerat. Unele persoane pot avea dureri de cap, amețeli sau disconfort gastric.'],
    ['Supliment oral sau perfuzie?', 'Pe cale intravenoasă, absorbția nu mai depinde de digestie. Administrarea se face într-un centru medical, sub coordonarea unui medic gerontolog, care stabilește și dacă o perfuzie are sens în cazul tău.'],
  ];

  const intrebariCheck = [
    ['Ești însărcinată sau alăptezi?', 'Suplimentarea cu NADH nu se face fără acordul medicului în sarcină și alăptare.'],
    ['Ai o boală autoimună diagnosticată?', 'În bolile autoimune se recomandă prudență; medicul evaluează dacă NADH e potrivit.'],
    ['Ai o tulburare metabolică diagnosticată?', 'Și în acest caz, decizia se ia după evaluarea medicului.'],
    ['Urmezi un tratament de fertilitate sau o procedură FIV?', 'Doza și momentul se coordonează cu medicul care te urmărește.'],
    ['Iei medicamente sau alte suplimente?', 'Medicul verifică posibilele interacțiuni înainte de a recomanda NADH.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>NADH este o <b>coenzimă implicată în producția de energie</b> a celulelor, inclusiv a celor implicate în reproducere. Nivelul de NAD scade odată cu vârsta.</li>
    <li>Infertilitatea este diagnosticată la aproape <b>10% dintre cupluri</b> și apare la fel de des la bărbați și la femei.</li>
    <li>Cercetările sugerează că NADH <b>poate susține</b> calitatea ovulelor și a spermatozoizilor, prin energie celulară și efect antioxidant. Datele sunt încă limitate.</li>
    <li>NADH <b>nu înlocuiește</b> evaluarea și tratamentul infertilității. Poate fi o parte dintr-un plan stabilit de medic, alături de un stil de viață sănătos.</li>
    <li>La MOA, administrarea se decide <b>după un consult</b> cu medicul gerontolog${consultPret ? `, de la ${lei(consultPret)}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este NADH și cum funcționează</h2>
<p class="ar-first">Când încercați de mult timp să aveți un copil, e firesc să cauți orice informație care ar putea ajuta. NADH, cunoscut și drept coenzima 1, apare tot mai des în aceste discuții. Merită să știi ce face, ce arată cercetările și unde sunt limitele.</p>
<p>NADH este forma redusă a <b>nicotinamid adenin dinucleotidei (NAD)</b>, o coenzimă prezentă în toate celulele. Participă la reacțiile de oxidare-reducere prin care glucoza și alți nutrienți sunt transformați în <b>ATP</b>, molecula de energie a celulei.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Producția de energie</b><p>În mitocondrii, NADH cedează electroni lanțului de transport al electronilor. Procesul duce la sinteza de ATP, energia de care au nevoie toate celulele, inclusiv cele reproductive.</p></div>
  <div class="rx-card"><i>02</i><b>Protecție antioxidantă</b><p>NADH ajută la protejarea celulelor de stresul oxidativ, care poate afecta funcția reproductivă.</p></div>
  <div class="rx-card"><i>03</i><b>Legătura cu sirtuinele</b><p>NAD este necesar pentru activitatea sirtuinelor, proteine asociate cu longevitatea și cu regenerarea celulară.</p></div>
</div>

<h2 id="fertilitate">De ce se discută legătura cu fertilitatea</h2>
<p>Infertilitatea este diagnosticată în aproape 10% dintre cupluri, la fel de des la bărbați și la femei (Kashanian și Brannigan, 2015; Agarwal și colab., 2015; Rehman și colab., 2018). Cauzele pot fi diverse:</p>
<ul class="rx-chips rx-chips-neg"><li>dezechilibre hormonale</li><li>stres oxidativ</li><li>probleme anatomice</li><li>alimentație deficitară</li><li>fumat</li><li>consum excesiv de alcool</li></ul>
<p>În ultimii ani, cercetările coordonate de profesorul David Sinclair, la Universitatea Harvard, au studiat felul în care NAD crește nivelul sirtuinelor. Aceste proteine sunt necesare pentru regenerarea și multiplicarea celulelor, inclusiv a ovocitelor și a spermatozoizilor. Odată cu vârsta, nivelul de NAD scade, iar acesta este unul dintre motivele pentru care și diviziunea celulară, inclusiv la nivelul ovocitelor, scade.</p>
<p>De aici ideea că NADH ar putea susține fertilitatea pe trei căi: <b>energie celulară</b> pentru celulele reproductive, <b>echilibru hormonal</b> (estrogen, testosteron), prin susținerea metabolismului, și <b>protecție față de stresul oxidativ</b>, care poate afecta materialul genetic al ovulelor și spermatozoizilor. Pentru stresul oxidativ, medicul poate discuta și ${link('autohemoterapia', 'ozonoterapia sistemică')}.</p>

<h2 id="cercetari">Ce arată cercetările despre NADH și fertilitate</h2>
<div class="rx-two">
  <div><h3>La bărbați</h3><ul><li>un studiu pe bărbați cu probleme de fertilitate a observat o creștere a mobilității spermatozoizilor după administrarea de NADH</li><li>efectul antioxidant poate proteja spermatozoizii de deteriorare</li></ul></div>
  <div><h3>La femei</h3><ul><li>unele studii sugerează că NADH poate influența calitatea ovulelor și numărul de ovule mature</li><li>poate susține sănătatea ovarelor și un ciclu mai regulat; se discută și la femeile cu sindromul ovarului polichistic (SOP)</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rolul NADH în producția de energie a celulei este bine cunoscut. Legătura directă cu fertilitatea este însă o direcție de cercetare promițătoare, nu un tratament dovedit: studiile sunt încă puține, iar rezultatele trebuie confirmate. Unii pacienți relatează experiențe bune, dar o experiență individuală nu poate fi generalizată. Cauzele anatomice sau hormonale ale infertilității se evaluează și se tratează de medicul specialist, iar NADH nu înlocuiește acest parcurs.</p></aside>

<h2 id="potrivit">Discută întâi cu medicul? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul înainte de NADH.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă că NADH e exclus, ci că decizia, doza și momentul se stabilesc după un consult, în care medicul îți verifică istoricul și tratamentele.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile frecvente.</b><p>Pasul următor este tot un consult: medicul gerontolog îți evaluează starea de sănătate și stabilește dacă NADH are sens în planul tău și în ce formă.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="utilizare">Cum se folosește NADH pentru susținerea fertilității</h2>
<div class="rx-compare">
  <div class="rx-col"><small>Supliment oral</small><b>Zilnic, în doze mici</b><dl><dt>Doză uzuală</dt><dd>5–20 mg pe zi, stabilită de medic</dd><dt>Absorbție</dt><dd>depinde de digestie și de calitatea suplimentului</dd><dt>Supraveghere</dt><dd>discută cu medicul, mai ales în FIV</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Perfuzie</small><b>Direct în sânge</b><dl><dt>Doză</dt><dd>stabilită de medic după evaluare</dd><dt>Absorbție</dt><dd>directă, fără digestie</dd><dt>Supraveghere</dt><dd>într-un centru medical, coordonat de un gerontolog</dd></dl>${id('terapia-nad') ? `<a class="link-u" href="${esc(live('terapia-nad'))}">Despre terapia NAD+ →</a>` : ''}</div>
</div>
<p>NADH nu acționează singur. Efectul lui depinde și de ce se întâmplă în restul zilei:</p>
<div class="rx-two">
  <div><h3>Stil de viață</h3><ul><li>alimentație echilibrată: fructe și legume proaspete, cereale integrale, proteine slabe</li><li>fără fumat și cu alcool limitat</li><li>exerciții fizice moderate, pentru o greutate sănătoasă și o circulație bună</li><li>gestionarea stresului: yoga, meditație, mișcare regulată</li></ul></div>
  <div><h3>Alte suplimente de discutat cu medicul</h3><ul><li>antioxidanți: vitamina C, vitamina E, coenzima Q10</li><li>acizi grași omega-3, pentru echilibrul hormonal și funcția ovariană</li></ul></div>
</div>

<h2 id="siguranta">Efecte adverse și precauții</h2>
<p>NADH este considerat, în general, bine tolerat. Respectarea dozei stabilite de medic reduce riscul de efecte nedorite.</p>
<div class="rx-two">
  <div><h3>Reacții posibile</h3><ul><li>dureri de cap</li><li>amețeli</li><li>disconfort gastric</li></ul></div>
  <div><h3>Când e nevoie de prudență și acord medical</h3><ul><li>sarcină sau alăptare</li><li>boli autoimune</li><li>tulburări metabolice</li><li>tratament de fertilitate sau FIV în curs</li><li>alte medicamente sau suplimente</li></ul></div>
</div>

<h2 id="la-moa">Planul personalizat la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul cu medicul gerontolog</b><p>Medicul îți ascultă istoricul, obiectivele și tratamentele în curs și discută cu tine ce poate face NADH și ce nu.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Evaluarea</b><p>Dacă e nevoie, medicul recomandă analize, inclusiv evaluări hormonale, care dau informații despre sănătatea reproductivă.</p></li>
  <li><b>Planul</b><p>NADH se integrează într-un plan mai larg: supliment sau perfuzie, alte suplimente, schimbări de stil de viață, în acord cu medicul care îți urmărește fertilitatea.</p>${pret('terapia-nad') ? `<em>Terapia NAD+ · de la ${lei(pret('terapia-nad'))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește cum tolerezi tratamentul și ajustează planul în timp.</p></li>
</ol>
<p class="rx-links">Află mai multe despre ${link('terapia-nad', 'terapia NAD+')}, despre <a href="/nou/nad-perfuzabil/">NAD perfuzabil</a> sau despre <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>NADH este o direcție de cercetare promițătoare pentru susținerea fertilității, nu un tratament în sine. Împreună cu un stil de viață sănătos și cu un plan stabilit de medici, poate face parte din drumul vostru spre a deveni părinți.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu înainte de NADH
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
    lede: 'Ce este NADH, de ce se discută legătura lui cu fertilitatea și ce arată, onest, cercetările de până acum. Cu o verificare rapidă a precauțiilor și pașii unui plan personalizat la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
