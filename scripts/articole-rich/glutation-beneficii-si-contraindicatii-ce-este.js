// Versiunea structurată a articolului „Glutation: ce este, beneficii și contraindicații”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva interesat de o perfuzie cu glutation:
// răspunsul scurt → ce face → ce formă alege → dacă i se potrivește (verificare rapidă) → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const glut = serv.glutation?.preturi || [];
  const pG = (re) => glut.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație antiaging';
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este glutationul'],
    ['ce-face', 'Ce face în organism'],
    ['alimente', 'În ce alimente se găsește'],
    ['forme', 'Supliment sau perfuzie?'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['siguranta', 'Efecte adverse și contraindicații'],
    ['la-moa', 'Perfuzia cu glutation la MOA'],
    ['pregatire', 'Cum te pregătești'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Glutationul albește pielea?', 'Glutationul este asociat cu un ten mai uniform și mai luminos, pentru că intervine în producția de pigment. Nu este un tratament de albire și efectul diferă mult de la o persoană la alta. Pentru pete pigmentare, medicul îți poate recomanda și alte tratamente, potrivite tipului tău de piele.'],
    ['Câte ședințe sunt necesare?', 'Nu există un număr fix. Medicul stabilește frecvența după evaluare, în funcție de motivul pentru care vrei perfuzia, de analize și de cum tolerezi primele ședințe. De obicei se discută o serie de câteva ședințe, apoi o reevaluare.'],
    ['Pot lua glutation dacă iau deja suplimente?', 'Da, de multe ori, dar spune-i medicului ce iei. Antioxidantele luate în exces pot modifica echilibrul natural, iar unele tratamente pot cere ajustări sau monitorizare.'],
    ['Perfuzia doare?', 'Simți doar înțepătura de la montarea branulei. Perfuzia durează aproximativ 30–45 de minute, timp în care stai relaxat(ă) pe fotoliu.'],
    ['Pot merge la muncă după perfuzie?', 'Da. Majoritatea oamenilor își reiau activitatea imediat. Dacă simți amețeală sau greață ușoară, rămâi câteva minute în clinică, până trec.'],
    ['Suplimentele orale sunt la fel de bune?', 'Sunt mai accesibile, dar o parte din glutation se descompune în digestie, așa că efectul poate fi mai lent sau mai slab. Perfuzia evită acest pas. Alegerea se face împreună cu medicul.'],
  ];

  const intrebariCheck = [
    ['Ești însărcinată sau alăptezi?', 'Nu există suficiente date despre siguranța glutationului în sarcină și alăptare.'],
    ['Ai alergii cunoscute la medicamente sau suplimente?', 'Medicul verifică componentele soluției înainte de perfuzie.'],
    ['Ai o boală renală sau hepatică diagnosticată?', 'În afecțiunile severe, administrarea se face doar cu acord medical.'],
    ['Ai astm sau alte probleme respiratorii care nu sunt sub control?', 'Pot crește riscul de reacții; medicul decide dacă e potrivit.'],
    ['Urmezi un tratament oncologic?', 'Orice supliment antioxidant se discută întâi cu medicul oncolog.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Glutationul este un antioxidant pe care <b>organismul îl produce singur</b>, din trei aminoacizi. Nivelul lui scade cu vârsta, stresul, somnul puțin, fumatul și alcoolul.</li>
    <li>Are rol în <b>detoxifierea ficatului, în imunitate și în protecția celulelor</b> față de stresul oxidativ.</li>
    <li>Îl găsești în alimente (avocado, sparanghel, spanac), ca <b>supliment oral</b> sau ca <b>perfuzie</b>, care ajunge direct în sânge.</li>
    <li>Este, în general, bine tolerat. <b>Nu se recomandă</b> în sarcină și alăptare sau fără acord medical în boli renale, hepatice, respiratorii severe ori în tratament oncologic.</li>
    <li>La MOA, perfuzia se face <b>după un consult medical</b>, în clinică, în aproximativ 30–45 de minute${pret('glutation') ? `, de la ${lei(pret('glutation'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este glutationul</h2>
<p class="ar-first">Te simți mai obosit(ă) decât de obicei, pielea nu mai are aceeași luminozitate, iar stresul se vede mai ușor. Probabil ai auzit atunci de glutation, numit adesea „antioxidantul corpului”. Înainte să te întrebi dacă ți se potrivește, merită să știi ce face și când are sens.</p>
<p>Glutationul este o substanță pe care corpul o produce în mod natural, din trei aminoacizi: <b>cisteină, glicină și acid glutamic</b>. Se găsește în aproape toate celulele și participă zilnic la procese pe care nu le vezi, dar de care depinde cum te simți.</p>
<div class="rx-why">
  <span class="rx-why-h">De ce scade nivelul de glutation</span>
  <ul class="rx-chips rx-chips-neg"><li>vârsta</li><li>stresul prelungit</li><li>somnul insuficient</li><li>alimentația dezechilibrată</li><li>alcoolul</li><li>fumatul</li><li>poluarea</li></ul>
</div>

<h2 id="ce-face">Ce face glutationul în organism</h2>
<p>Este unul dintre antioxidanții principali ai corpului: neutralizează radicalii liberi și ajută la refacerea altor antioxidanți, cum sunt vitaminele C și E. Concret, intervine în trei direcții:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Detoxifierea ficatului</b><p>Ajută ficatul să neutralizeze și să elimine substanțele toxice din poluare, alimentație și alte surse, inclusiv unele metale grele.</p></div>
  <div class="rx-card"><i>02</i><b>Imunitatea</b><p>Un nivel bun de glutation ajută celulele sistemului imunitar să răspundă mai eficient la virusuri și bacterii.</p></div>
  <div class="rx-card"><i>03</i><b>Protecția celulelor</b><p>Reduce stresul oxidativ, legat pe termen lung de riduri, pierderea elasticității pielii și oboseala constantă.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rolul glutationului în organism este bine documentat. Cât de mult schimbă o perfuzie aspectul pielii sau nivelul de energie diferă însă de la o persoană la alta, iar studiile pe oameni sunt încă puține. De aceea, la MOA, perfuzia se decide după evaluare, iar efectul se urmărește la reevaluare.</p></aside>

<h2 id="alimente">În ce alimente se găsește glutationul</h2>
<p>Alimentația contează la fel de mult ca orice procedură. Unele alimente conțin glutation, altele ajută corpul să îl producă. Gătirea îndelungată reduce conținutul, așa că, unde se poate, consumă-le crude sau gătite ușor.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Conțin glutation</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Îl ajută să se formeze</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Îl scad</button>
  </div>
  <div class="rx-panel" data-panel="0"><ul class="rx-chips"><li>avocado</li><li>sparanghel</li><li>spanac</li><li>broccoli</li><li>okra</li></ul></div>
  <div class="rx-panel" data-panel="1" hidden><p>Alimentele bogate în vitamina C și în compuși cu sulf:</p><ul class="rx-chips"><li>portocale, lămâi</li><li>ardei gras</li><li>usturoi, ceapă</li><li>varză, conopidă</li></ul></div>
  <div class="rx-panel" data-panel="2" hidden><ul class="rx-chips rx-chips-neg"><li>stresul prelungit</li><li>lipsa somnului</li><li>alcoolul</li><li>fumatul</li><li>poluarea</li><li>alimentația dezechilibrată</li></ul></div>
</div>

<h2 id="forme">Supliment oral sau perfuzie?</h2>
<p>Alegerea depinde de ce urmărești și de recomandarea medicului. Diferența principală este cât glutation ajunge efectiv în sânge.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Alimentație</small><b>Zilnic, pe termen lung</b><dl><dt>Cât ajunge în sânge</dt><dd>variabil, scade prin gătire</dd><dt>Cât de repede</dt><dd>lent</dd><dt>Supraveghere</dt><dd>nu e nevoie</dd></dl></div>
  <div class="rx-col"><small>Supliment oral</small><b>Capsule sau comprimate</b><dl><dt>Cât ajunge în sânge</dt><dd>o parte se descompune în digestie</dd><dt>Cât de repede</dt><dd>efect mai lent</dd><dt>Supraveghere</dt><dd>întreabă medicul dacă iei și alte suplimente</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Perfuzie</small><b>Direct în sânge</b><dl><dt>Cât ajunge în sânge</dt><dd>absorbție directă, fără digestie</dd><dt>Cât de repede</dt><dd>30–45 de minute / ședință</dd><dt>Supraveghere</dt><dd>după consult, în clinică</dd></dl>${id('glutation') ? `<a class="link-u" href="${esc(live('glutation'))}">Despre perfuziile cu glutation →</a>` : ''}</div>
</div>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă că perfuzia e exclusă, ci că decizia se ia după un consult, în care medicul îți verifică istoricul și tratamentele.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile frecvente.</b><p>Pasul următor este tot un consult scurt înainte de prima perfuzie: medicul verifică analizele și stabilește doza și numărul de ședințe.</p><a class="btn btn-gold" href="#programare" data-srv="Perfuzii cu glutation">Programează-te pentru perfuzie</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="siguranta">Efecte adverse și contraindicații</h2>
<p>Administrat corect și sub supraveghere, glutationul este în general bine tolerat. Reacțiile, când apar, sunt de obicei ușoare și trec de la sine.</p>
<div class="rx-two">
  <div><h3>Reacții posibile</h3><ul><li>amețeală ușoară sau disconfort</li><li>greață ușoară</li><li>reacții locale la locul perfuziei</li><li>dureri de cap trecătoare</li></ul></div>
  <div><h3>Când nu se face fără acord medical</h3><ul><li>sarcină sau alăptare</li><li>alergii la componentele soluției</li><li>boli renale sau hepatice severe</li><li>astm sau boli respiratorii necontrolate</li><li>tratament oncologic în curs</li></ul></div>
</div>
<div class="rx-alert"><b>Anunță imediat asistenta sau medicul dacă, în timpul perfuziei, ai:</b> dificultăți de respirație, umflarea feței sau a buzelor, erupție pe piele sau o amețeală puternică.</div>

<h2 id="la-moa">Perfuzia cu glutation la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul medical</b><p>Medicul îți ascultă motivele, verifică istoricul, tratamentele și, dacă e nevoie, analizele. Stabilește dacă perfuzia ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Pregătirea soluției</b><p>Soluția se pregătește în condiții sterile, cu doza stabilită de medic.</p></li>
  <li><b>Perfuzia</b><p>Durează aproximativ 30–45 de minute, pe fotoliu, sub supravegherea asistentei.</p>${pG(/therapy/i) ? `<em>Glutation Therapy · ${lei(pG(/therapy/i))}</em>` : ''}${pG(/detox/i) ? `<em>Glutation Detox Boost · ${lei(pG(/detox/i))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>După o serie de ședințe, medicul discută cu tine ce s-a schimbat și dacă merită continuat.</p></li>
</ol>
<p class="rx-links">Glutationul poate face parte și dintr-un plan mai larg: ${link('terapia-nad', 'terapia NAD+')}, ${link('autohemoterapia', 'ozonoterapia')} sau <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<h2 id="pregatire">Cum te pregătești pentru perfuzie</h2>
<ul class="rx-todo" data-todo>
  <li><label><input type="checkbox"> Bea apă înainte de programare</label></li>
  <li><label><input type="checkbox"> Mănâncă ușor cu câteva ore înainte</label></li>
  <li><label><input type="checkbox"> Notează ce medicamente și suplimente iei</label></li>
  <li><label><input type="checkbox"> Evită alcoolul și fumatul în ziua perfuziei</label></li>
  <li><label><input type="checkbox"> Dormi bine în noaptea dinainte</label></li>
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Glutationul nu este o soluție rapidă care rezolvă totul, dar poate susține organismul când este folosit corect, în contextul potrivit. Dacă te gândești la o perfuzie, primul pas este o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru alimente, verificare rapidă cu da/nu, lista de pregătire bifabilă (păstrată în browser)
(() => {
  document.querySelectorAll('[data-tabs]').forEach((t) => {
    const bs = [...t.querySelectorAll('[role=tab]')], ps = [...t.querySelectorAll('[data-panel]')];
    bs.forEach((b) => b.addEventListener('click', () => { bs.forEach((x) => x.setAttribute('aria-selected', x === b)); ps.forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.tab)); }));
  });
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
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-glutation-pregatire', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce este glutationul, ce face în organism, în ce alimente îl găsești și când are sens o perfuzie. Cu o verificare rapidă a contraindicațiilor și pașii perfuziei la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
