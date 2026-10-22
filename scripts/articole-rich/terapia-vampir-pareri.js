// Versiunea structurată a articolului „Terapia vampir: păreri – ghid obiectiv”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care cântărește un tratament PRP:
// răspunsul scurt → ce este → cum se face → ce poate face → rezultate realiste → cui nu i se potrivește (verificare rapidă) → după → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => (id(sid) ? minPrice(sid) : null);
  const prp = serv['prp-scalp']?.preturi || [];
  const pP = (re) => prp.find((p) => re.test(p.nume))?.valoare;
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');
  const prpNume = 'PRP – terapia vampir';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este terapia vampir'],
    ['cum-se-face', 'Cum se face'],
    ['ce-face', 'Ce poate face PRP-ul'],
    ['rezultate', 'Rezultate și cât durează'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['dupa', 'După procedură'],
    ['la-moa', 'Terapia vampir la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De ce se numește terapia vampir?', 'Pentru că folosește propriul tău sânge: din el se obține plasma bogată în trombocite (PRP – Platelet Rich Plasma), care se injectează apoi în piele sau în scalp.'],
    ['Doare terapia vampir?', 'Majoritatea pacienților descriu un disconfort minim, pentru că zona se anesteziază local înainte. Plasma se injectează cu ace foarte fine.'],
    ['Cât durează procedura și când mă pot întoarce la activități?', 'Procedura durează aproximativ 30–45 de minute și nu necesită o perioadă de recuperare. De obicei îți poți relua activitățile imediat.'],
    ['Când se văd rezultatele?', 'Primele semne pot apărea în prima lună, iar majoritatea pacienților observă o îmbunătățire în primele luni de la procedură. Rezultatele diferă de la o persoană la alta, în funcție de stadiul problemei, stilul de viață și îngrijire.'],
    ['Cât țin efectele și trebuie repetată?', 'Efectele pot dura de la câteva luni până la câțiva ani. Uneori procedura se repetă; numărul de ședințe îl stabilește medicul la consult.'],
    ['Cât costă terapia vampir?', 'Prețul depinde de numărul de eprubete folosite, de regulă una sau două, stabilite după nevoile tale. Pachetele cu mai multe ședințe au un tarif redus pe ședință. Prețurile actuale sunt în secțiunea „Terapia vampir la MOA”.'],
  ];

  const intrebariCheck = [
    ['Ai fost diagnosticat(ă) cu cancer de sânge sau cancer de piele?', 'Terapia PRP nu este recomandată în aceste situații.'],
    ['Ai o afecțiune a sângelui?', 'Plasma provine din propriul sânge, așa că afecțiunile sângelui se discută întâi cu medicul.'],
    ['Ai diabet sau o boală de rinichi?', 'Sunt situații în care tratamentul nu este recomandat fără evaluarea medicului.'],
    ['Ai hepatită?', 'Hepatita se numără printre situațiile în care terapia PRP nu este recomandată.'],
    ['Ai o boală psihică diagnosticată?', 'Medicul trebuie să cunoască diagnosticul și tratamentul înainte de a decide.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Terapia vampir înseamnă <b>PRP – plasmă bogată în trombocite</b>, obținută din propriul tău sânge și injectată în piele sau în scalp.</li>
    <li>Se folosește pentru <b>căderea părului, fir subțire, mătreață, dermatită seboreică</b>, dar și pentru <b>riduri, cearcăne, cicatrici post-acneice</b> și piele ternă.</li>
    <li>Procedura durează aproximativ <b>30–45 de minute</b>, cu anestezie locală, și de obicei <b>nu necesită recuperare</b>.</li>
    <li>Primele semne pot apărea în prima lună; <b>rezultatele diferă de la o persoană la alta</b> și uneori procedura se repetă.</li>
    <li><b>Nu este recomandată</b> în cancer de sânge sau de piele, afecțiuni ale sângelui, diabet, boli de rinichi, boli psihice sau hepatită. Decizia se ia la consult${pret('prp-scalp') ? `; la MOA, de la ${lei(pret('prp-scalp'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este terapia vampir</h2>
<p class="ar-first">Dacă auzi prima dată de „terapia vampir”, te poți gândi la legende cu castele întunecate. În realitate, numele vine de la un detaliu simplu: tratamentul folosește propriul tău sânge. Mai exact, plasma bogată în trombocite, pe scurt PRP (Platelet Rich Plasma).</p>
<p>Plasma conține <b>factori de creștere</b> care ajută la reactivarea proceselor naturale de regenerare ale organismului. Injectată în zona care are nevoie, poate susține refacerea pielii sau a scalpului. Terapia se adresează atât femeilor, cât și bărbaților.</p>
<div class="rx-why">
  <span class="rx-why-h">Pentru ce probleme se folosește</span>
  <ul class="rx-chips"><li>cădere excesivă a părului</li><li>fir de păr subțire</li><li>mătreață</li><li>dermatită seboreică</li><li>riduri adânci</li><li>cearcăne pronunțate</li><li>cicatrici post-acneice</li><li>piele ternă, fără elasticitate</li></ul>
</div>

<h2 id="cum-se-face">Cum se face terapia vampir</h2>
<p>Procesul este simplu și are patru etape:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Recoltarea</b><p>Se recoltează o cantitate mică de sânge, de obicei din braț.</p></div>
  <div class="rx-card"><i>02</i><b>Centrifugarea</b><p>Sângele este introdus într-o centrifugă, care separă plasma bogată în trombocite.</p></div>
  <div class="rx-card"><i>03</i><b>Anestezia și injectarea</b><p>Zona se anesteziază local, apoi plasma se injectează cu ace foarte fine acolo unde este nevoie: scalp, riduri, cearcăne, cicatrici.</p></div>
</div>
<p>Majoritatea pacienților raportează un <b>disconfort minim</b>, datorită anestezicului. Procedura durează aproximativ <b>30–45 de minute</b>, nu necesită recuperare și îți poți relua activitățile imediat.</p>

<h2 id="ce-face">Ce poate face PRP-ul în piele și în scalp</h2>
<p>Efectul depinde de zona tratată. Pe scurt, iată la ce se urmărește în fiecare caz:</p>
<div class="rx-two">
  <div><h3>Scalp și păr</h3><ul><li>stimulează circulația la nivelul scalpului și susține regenerarea</li><li>poate reduce căderea excesivă și poate susține creșterea firelor</li><li>se folosește și în mătreață și dermatită seboreică</li></ul></div>
  <div><h3>Piele</h3><ul><li>riduri: ajută pielea să își recapete elasticitatea</li><li>cicatrici post-acneice: susține regenerarea, iar aspectul lor se poate reduce</li><li>cearcăne: le poate atenua și poate reda luminozitatea zonei</li><li>răni: poate grăbi vindecarea</li></ul></div>
</div>

<h2 id="rezultate">Rezultate și cât durează efectele</h2>
<p>Rezultatele terapiei PRP <b>variază de la o persoană la alta</b>, în funcție de stadiul problemei și de alți factori. Primele semne pot fi vizibile în prima lună, iar majoritatea pacienților observă o îmbunătățire a aspectului scalpului sau al pielii în primele luni de la procedură.</p>
<p>La pacienții tratați pentru păr, s-au observat mai multe fire, mai mult volum și densitate, precum și un scalp mai sănătos. Efectele pot dura <b>de la câteva luni până la câțiva ani</b>.</p>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rezultatul depinde și de stilul de viață și de îngrijirea pielii și a părului. Uneori este nevoie ca procedura să fie repetată. Merită făcută atunci când ai o problemă reală pe care PRP o poate îmbunătăți, iar asta se stabilește la consult, unde medicul îți explică realist ce poți obține și ce nu.</p></aside>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Acestea sunt situații în care terapia PRP nu este recomandată sau se decide doar după evaluare. Medicul îți verifică istoricul și îți spune ce variante ai.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre contraindicațiile frecvente.</b><p>Pasul următor este evaluarea dinaintea procedurii: medicul analizează istoricul de sănătate, tipul problemei și factorii care pot influența rezultatul, apoi stabilește numărul de eprubete și de ședințe.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(prpNume)}">Programează-te pentru PRP</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="dupa">Ce faci după procedură</h2>
<p>Ca să eviți efectele adverse și să susții rezultatul, urmează recomandările medicului. În general, acestea sunt:</p>
<div class="rx-two">
  <div><h3>De evitat</h3><ul><li>expunerea excesivă la soare și produsele de styling, în primele zile</li><li>efortul fizic intens, în prima săptămână</li><li>tratamentele chimice pentru păr, în primele săptămâni</li></ul></div>
  <div><h3>De făcut</h3><ul><li>folosește produsele de îngrijire a părului recomandate de medic</li><li>alimentează-te echilibrat</li><li>păstrează o igienă corectă a pielii și a scalpului</li></ul></div>
</div>

<h2 id="la-moa">Terapia vampir la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul analizează istoricul de sănătate, tipul problemei și factorii care pot influența rezultatele. Doar după această discuție se stabilește dacă terapia ți se potrivește.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Recoltarea și pregătirea plasmei</b><p>Se recoltează puțin sânge, iar plasma bogată în trombocite se separă prin centrifugare.</p></li>
  <li><b>Procedura</b><p>După anestezia locală, plasma se injectează în zona stabilită. Durează aproximativ 30–45 de minute. Prețul depinde de numărul de eprubete, de regulă una sau două.</p>${pP(/vampir 1 eprubet/i) ? `<em>PRP față, gât, decolteu sau mâini, 1 eprubetă · ${lei(pP(/vampir 1 eprubet/i))}</em>` : ''}${pP(/scalp, 1 eprubet[ăa]$/i) ? `<em>PRP scalp, 1 eprubetă · ${lei(pP(/scalp, 1 eprubet[ăa]$/i))}</em>` : ''}${pP(/scalp, 2 eprubete/i) ? `<em>PRP scalp, 2 eprubete · ${lei(pP(/scalp, 2 eprubete/i))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește cum a răspuns pielea sau scalpul și discută cu tine dacă este nevoie de repetarea procedurii.</p></li>
</ol>
<p class="rx-links">Află mai multe în ${link('prp-scalp', 'pagina despre PRP – terapia vampir')}, în articolul <a href="/nou/ce-inseamna-prp/">Ce înseamnă PRP</a> sau despre combinația cu ${link('microneedeling', 'microneedling-ul cu Dermapen')}. Pentru cearcăne, citește și <a href="/nou/cearcane/">ghidul despre cearcăne și pungi sub ochi</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Terapia vampir sprijină procesele naturale de regenerare ale corpului și poate ajuta în căderea părului, riduri, cearcăne sau cicatrici. Dacă se potrivește în cazul tău și ce poți aștepta realist afli doar după o evaluare făcută de medic.</p>
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
    lede: 'Ce este terapia vampir (PRP), cum se face, la ce poate ajuta și ce rezultate poți aștepta realist. Cu o verificare rapidă a contraindicațiilor și pașii procedurii la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
