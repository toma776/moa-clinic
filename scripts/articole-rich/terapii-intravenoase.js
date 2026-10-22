// Versiunea structurată a articolului „Terapii intravenoase: beneficii și tipuri de tratamente IV”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la o perfuzie cu vitamine:
// răspunsul scurt → cum funcționează → oral sau IV → ce conține → ce tipuri există (file) → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const glut = serv.glutation?.preturi || [];
  const pG = (re) => glut.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație antiaging (cu vârsta biologică)';
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este terapia intravenoasă'],
    ['oral-iv', 'Oral sau intravenos?'],
    ['cand', 'Când se recomandă'],
    ['beneficii', 'Ce poate susține'],
    ['continut', 'Ce conține o perfuzie'],
    ['tipuri', 'Tipuri de terapii IV'],
    ['la-moa', 'Terapia IV la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce este, pe scurt, o terapie intravenoasă?', 'Este o perfuzie cu vitamine, minerale și antioxidanți, administrată direct în sânge. Nutrienții nu mai trec prin stomac și intestine, așa că organismul îi poate folosi mai repede.'],
    ['Este terapia IV mai bună decât vitaminele luate oral?', 'Diferența principală este calea de administrare. Pe cale orală, nutrienții se absorb mai lent și parțial; în perfuzie ajung direct în sânge și nu apar disconforturile digestive pe care le dau uneori capsulele. Care variantă ți se potrivește stabilește medicul.'],
    ['Cui i se poate recomanda?', 'De obicei se discută în perioade de oboseală prelungită și lipsă de energie, în recuperarea după o intervenție chirurgicală, după boală sau efort intens ori când ai nevoie de susținerea imunității sau de hidratare.'],
    ['Pot alege singur(ă) tipul de perfuzie?', 'Poți spune ce urmărești, dar compoziția se stabilește după consult. Medicul ține cont de starea ta, de analize și de tratamentele pe care le iei deja.'],
    ['Terapia IV tratează o boală?', 'Nu. Terapiile intravenoase pot susține starea de bine, dar nu sunt soluții universale și nu înlocuiesc tratamentul pentru afecțiuni grave sau persistente.'],
  ];

  const tipuri = [
    ['Energie și imunitate', 'Un mix de vitamine și minerale pentru perioadele stresante sau de suprasolicitare. Conține vitamina C, care susține imunitatea, și glutation, cu rol antiinflamator.'],
    ['Piele, păr, unghii', 'Gândit pentru susținerea pielii, a părului și a unghiilor, cu accent pe hidratare și luminozitatea tenului.'],
    ['Stare generală de bine', 'O combinație mai complexă, pentru susținerea metabolismului și a rezistenței la stres.'],
    ['Antiaging și refacere', 'Susține regenerarea celulară și protecția față de radicalii liberi; se folosește și pentru refacerea după nopți solicitante.'],
    ['Fier și vitamina C', 'Pentru susținerea în deficitul de fier și a sistemului imunitar, prin vitamina C.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Terapia intravenoasă este o perfuzie cu <b>vitamine, minerale și antioxidanți</b>, administrată direct în sânge.</li>
    <li>Nutrienții <b>nu mai trec prin digestie</b>, așa că organismul îi poate folosi mai repede, iar disconforturile digestive ale capsulelor nu apar.</li>
    <li>Se discută de obicei la <b>oboseală prelungită</b>, în <b>recuperare</b> după o intervenție, boală sau efort și când ai nevoie de <b>imunitate sau hidratare</b>.</li>
    <li>Există mai multe tipuri de formule: energie și imunitate, piele și păr, stare de bine, antiaging, fier și vitamina C.</li>
    <li>La MOA, <b>medicul stabilește compoziția după consult</b>. Terapia IV nu înlocuiește tratamentul unei boli.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este terapia intravenoasă și cum funcționează</h2>
<p class="ar-first">Iei vitamine zilnic, dar te-ai întrebat dacă organismul le absoarbe cu adevărat? Există o cale prin care nutrienții ajung direct în sânge, fără să treacă prin digestie: terapia intravenoasă.</p>
<p>Este un „cocktail” de vitamine, minerale și substanțe de care organismul are nevoie, administrat în perfuzie. Vitaminele, mineralele și antioxidanții ajung în fluxul sanguin, de unde celulele le pot folosi imediat.</p>

<h2 id="oral-iv">Vitamine pe cale orală sau intravenos?</h2>
<p>Diferența ține de drumul pe care îl parcurg nutrienții până în sânge.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Pe cale orală</small><b>Capsule și comprimate</b><dl><dt>Drumul</dt><dd>prin stomac și intestine</dd><dt>Absorbția</dt><dd>mai lentă și parțială</dd><dt>Disconfort posibil</dt><dd>dureri de stomac, reflux, balonare</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Intravenos</small><b>Perfuzie, direct în sânge</b><dl><dt>Drumul</dt><dd>fără trecere prin digestie</dd><dt>Absorbția</dt><dd>directă, nutrienții pot fi folosiți imediat</dd><dt>Supraveghere</dt><dd>după consult, în clinică</dd></dl></div>
</div>

<h2 id="cand">Când se recomandă terapia intravenoasă</h2>
<p>Terapia IV se poate discuta cu medicul mai ales în situații ca acestea:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Oboseală prelungită</b><p>Simți oboseală constantă și lipsă de energie, chiar și după odihnă.</p></div>
  <div class="rx-card"><i>02</i><b>Recuperare</b><p>Te refaci după o intervenție chirurgicală, după boală sau după o perioadă de efort intens.</p></div>
  <div class="rx-card"><i>03</i><b>Imunitate și hidratare</b><p>Ai nevoie de susținere pentru imunitate sau de hidratare.</p></div>
</div>

<h2 id="beneficii">Ce poate susține o terapie IV</h2>
<p>Beneficiile vin din modul de administrare: nutrienții ajung rapid în sânge, iar organismul îi poate folosi imediat.</p>
<ul class="rx-chips"><li>imunitatea și energia</li><li>eliminarea toxinelor</li><li>pielea, părul și unghiile</li><li>refacerea după efort sau boală</li><li>protecția față de stresul oxidativ</li></ul>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Terapiile intravenoase pot susține starea de bine, dar nu sunt soluții universale și nu tratează afecțiuni grave sau persistente. Cât de mult simți diferența depinde de la o persoană la alta. De aceea, la MOA, perfuzia se decide după evaluare.</p></aside>
<div class="rx-alert"><b>Nu ignora simptomele frecvente.</b> Dacă ai des oboseală accentuată, amețeli, dureri recurente sau alte semne care îți afectează viața de zi cu zi, mergi întâi la medic pentru o evaluare completă. Doar un specialist poate stabili dacă terapia IV ți se potrivește și în ce condiții.</div>

<h2 id="continut">Ce conține o perfuzie: vitamine, minerale și antioxidanți</h2>
<div class="rx-two">
  <div><h3>Vitamine</h3><ul><li><b>Vitamina C</b>: susține imunitatea și luminozitatea tenului</li><li><b>Vitaminele B</b>: susțin energia, metabolismul și sănătatea mentală</li><li><b>Vitamina D</b>: importantă pentru oase și pentru imunitate</li></ul></div>
  <div><h3>Minerale și antioxidanți</h3><ul><li><b>Fier, zinc, magneziu</b>: ajută la reglarea metabolismului, la producția de energie și la imunitate</li><li><b>Glutation, seleniu</b>: protejează celulele de stresul oxidativ și sprijină regenerarea</li><li><b>Oligoelemente</b>: necesare pentru funcționarea enzimelor și pentru prevenirea deficiențelor</li></ul></div>
</div>

<h2 id="tipuri">Tipuri de terapii intravenoase</h2>
<p>Formulele diferă după ce urmărești. Alege mai jos o direcție ca să vezi la ce se folosește; compoziția exactă o stabilește medicul.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    ${tipuri.map(([t], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}">${esc(t)}</button>`).join('\n    ')}
  </div>
  ${tipuri.map(([, d], i) => `<div class="rx-panel" data-panel="${i}"${i ? ' hidden' : ''}><p>${esc(d)}</p></div>`).join('\n  ')}
</div>

<h2 id="la-moa">Terapia intravenoasă la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul medical</b><p>Medicul te întreabă ce urmărești, verifică istoricul, tratamentele și, dacă e nevoie, analizele. Stabilește dacă o perfuzie ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Alegerea formulei</b><p>Compoziția se personalizează după nevoile tale: energie, imunitate, piele, refacere.</p></li>
  <li><b>Perfuzia</b><p>Se face în clinică, pe fotoliu, sub supravegherea asistentei.</p>${pG(/therapy/i) ? `<em>Glutation Therapy · ${lei(pG(/therapy/i))}</em>` : ''}${pret('terapia-nad') ? `<em>MOA Longevity Boost (cu NAD+) · ${lei(pret('terapia-nad'))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>După una sau mai multe ședințe, discuți cu medicul ce s-a schimbat și dacă are sens să continui.</p></li>
</ol>
<p class="rx-links">Află mai multe despre ${link('glutation', 'perfuziile cu glutation')}, ${link('terapia-nad', 'terapia NAD+')} și ${link('autohemoterapia', 'autohemoterapia cu ozon')}, sau despre <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Terapia intravenoasă poate fi un sprijin pentru energie, imunitate și refacere, când e aleasă după o evaluare medicală. Primul pas este o discuție cu medicul despre ce urmărești.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru tipurile de terapii intravenoase
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
    lede: 'Cum funcționează o perfuzie cu vitamine, prin ce diferă de suplimentele orale, ce conține și ce tipuri există. Plus pașii terapiei intravenoase la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 6,
  };
};
