// Versiunea structurată a articolului „Consultația nutrigenomică”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva curios ce află din ADN despre alimentație și stil de viață:
// răspunsul scurt → ce este nutrigenomica → cum decurge testul → ce poate arăta → ce știm și ce nu → pregătire (listă bifabilă) → la MOA → întrebări.
// Rezultatele genetice sunt prezentate ca predispoziții interpretate de medic, nu ca diagnostic. Fără superlative și fără rezultate promise (Decizia CMR 20/2025).
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const nutriNume = trNode.get('consultatie-nutritie-antiaging-nutrigenomica')?.nod?.nume || 'Consultație nutriție antiaging / nutrigenomică';
  const nutriPret = id('consultatie-nutritie-antiaging-nutrigenomica') ? pret('consultatie-nutritie-antiaging-nutrigenomica') : null;
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este nutrigenomica'],
    ['cum-functioneaza', 'Cum decurge testul'],
    ['rezultate', 'Ce poate arăta'],
    ['beneficii', 'La ce te ajută'],
    ['pregatire', 'Cum te pregătești'],
    ['la-moa', 'Consultația la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cum se recoltează ADN-ul?', 'Printr-un test simplu de salivă. Proba este trimisă apoi la un laborator specializat, unde se analizează variațiile genetice.'],
    ['Ce analizează testul?', 'Gene asociate cu metabolismul, cu absorbția nutrienților și cu răspunsul organismului la anumite substanțe. Rezultatele sunt interpretate de medicul specialist în nutrigenomică.'],
    ['Primesc doar recomandări despre alimentație?', 'Nu. Pe lângă alimentație, consultația poate oferi recomandări despre tipul de exerciții fizice și despre stilul de viață, în funcție de genotipul tău.'],
    ['Testul îmi pune un diagnostic?', 'Nu. Testul arată variații genetice care pot influența felul în care organismul răspunde la alimente și la stilul de viață. Medicul le interpretează împreună cu istoricul tău și, la nevoie, cu alte analize.'],
    ['Cum mă pregătesc?', 'Gândește-te la obiectivele tale, adună informații despre istoricul familial și notează orice preocupare legată de sănătate și alimentație. Înainte de consultație, poți fi rugat(ă) să completezi un chestionar despre dietă și istoricul medical.'],
  ];

  const pregatire = [
    'Mi-am notat obiectivele (energie, greutate, digestie, performanță sportivă etc.)',
    'Am adunat informații despre bolile din familie',
    'Am notat ce mănânc într-o zi obișnuită',
    'Am făcut lista suplimentelor și medicamentelor pe care le iau',
    'Am notat preocupările legate de sănătate și alimentație',
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li><b>Nutrigenomica</b> studiază legătura dintre alimentație, gene și sănătate.</li>
    <li>Testul se face dintr-o <b>probă de salivă</b>, analizată într-un laborator specializat.</li>
    <li>Rezultatele pot arăta cum metabolizezi carbohidrații, dacă ai o <b>sensibilitate la gluten</b> sau <b>nevoi specifice de vitamine și minerale</b>.</li>
    <li>Pe baza lor, medicul îți face <b>recomandări personalizate</b> despre alimentație, suplimente, exerciții fizice și stil de viață.</li>
    <li>La MOA, consultația nutrigenomică face parte din <b>evaluarea de antiaging intern</b>.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este nutrigenomica</h2>
<p class="ar-first">Poate ai încercat mai multe diete și niciuna nu a funcționat cum te așteptai, sau te întrebi de ce aceleași alimente îți fac bine ție, iar altora nu. O parte din răspuns poate fi în ADN-ul tău.</p>
<p>Nutrigenomica este domeniul care studiază legătura dintre <b>alimentație, genom și sănătate</b>. O consultație nutrigenomică îți arată cum pot influența genele tale metabolismul și asimilarea nutrienților și cum anumite alimente sau suplimente pot influența, la rândul lor, expresia genelor. Scopul este să îți personalizezi dieta și stilul de viață pe baza unor informații despre tine.</p>

<h2 id="cum-functioneaza">Cum decurge testul nutrigenomic</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Proba de salivă</b><p>ADN-ul se obține printr-un test simplu de salivă, fără ace.</p></div>
  <div class="rx-card"><i>02</i><b>Analiza în laborator</b><p>Proba este trimisă la un laborator specializat, unde se analizează gene asociate cu metabolismul, absorbția nutrienților și răspunsul la anumite substanțe.</p></div>
  <div class="rx-card"><i>03</i><b>Interpretarea medicului</b><p>Medicul specialist în nutrigenomică interpretează rezultatele și îți face recomandări personalizate.</p></div>
</div>

<h2 id="rezultate">Ce poate arăta consultația nutrigenomică</h2>
<p>Câteva exemple de informații pe care le poți afla:</p>
<div class="rx-two">
  <div><h3>Despre alimentație</h3><ul><li><b>sensibilitatea la gluten</b>: dacă ar fi bine să eviți alimentele cu gluten</li><li><b>metabolismul carbohidraților</b>: cum îi procesează organismul tău și ce tip de carbohidrați ți se potrivește, cu eliberare lentă sau rapidă</li><li><b>nevoile de vitamine și minerale</b>: dacă ai nevoi specifice și dacă ar fi utile anumite suplimente</li><li><b>proporția macronutrienților</b> potrivită pentru tine</li></ul></div>
  <div><h3>Despre mișcare și stil de viață</h3><ul><li>cum răspunde organismul tău la diferite tipuri de exerciții fizice</li><li>recomandări specifice pentru performanță și rezultate la sală</li><li>ajustări de stil de viață în funcție de genotip</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Genele arată predispoziții, nu un destin și nici un diagnostic. Felul în care trăiești, ce mănânci și cât te miști contează la fel de mult. De aceea, rezultatele testului se interpretează de medic împreună cu istoricul tău și, la nevoie, cu alte analize, iar recomandările se ajustează în timp.</p></aside>

<h2 id="beneficii">La ce te ajută consultația nutrigenomică</h2>
<ul class="rx-chips"><li>dietă personalizată</li><li>prevenirea deficiențelor nutriționale</li><li>digestie mai bună</li><li>absorbția nutrienților esențiali</li><li>exerciții potrivite genotipului</li></ul>
<p>Înțelegând cum influențează genele tale metabolismul și răspunsul la nutriție, poți face alegeri mai potrivite pentru sănătatea ta, în loc să încerci la întâmplare.</p>

<h2 id="pregatire">Cum te pregătești pentru consultație</h2>
<p>Cu cât vii mai pregătit(ă), cu atât discuția cu medicul e mai utilă. Bifează ce ai făcut deja; lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>${pregatire.map((o) => `
  <li><label><input type="checkbox"> ${esc(o)}</label></li>`).join('')}
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="la-moa">Consultația nutrigenomică la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Chestionarul și discuția inițială</b><p>Completezi un chestionar despre dietă și istoricul medical și discuți cu medicul obiectivele tale.</p>${nutriPret ? `<em>${esc(nutriNume)} · de la ${lei(nutriPret)}</em>` : ''}</li>
  <li><b>Recoltarea probei</b><p>Se recoltează o probă de salivă, care pleacă la laboratorul specializat.</p></li>
  <li><b>Interpretarea rezultatelor</b><p>Medicul specialist în nutrigenomică îți explică rezultatele, pe înțelesul tău.</p></li>
  <li><b>Planul personalizat</b><p>Primești recomandări despre alimente, proporția macronutrienților, vitamine și minerale, exerciții fizice și stil de viață.</p></li>
</ol>
<p class="rx-links">Află mai multe despre ${link('nutrigenetica-epigenetica', 'testele de nutrigenetică și epigenetică')}, ${link('consultatie-nutritie-antiaging-nutrigenomica', 'consultația de nutriție antiaging')} sau despre <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Consultația nutrigenomică îți oferă informații despre cum răspunde organismul tău la alimentație și la stilul de viață, ca să faci alegeri potrivite pentru tine. Primul pas este o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(nutriNume)}">Programează o consultație</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de pregătire bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-nutrigenomica-pregatire', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce este nutrigenomica, cum decurge testul din salivă și ce poți afla despre alimentație, vitamine și mișcare pe baza ADN-ului tău. Cu o listă de pregătire și pașii consultației la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 6,
  };
};
