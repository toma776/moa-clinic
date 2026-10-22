// Versiunea structurată a articolului „De ce nu îmi ține acidul hialuronic”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva dezamăgit că efectul fillerului a trecut repede:
// răspunsul scurt → cauzele legate de tratament → factorii personali → cum prelungești efectul → îngrijirea după injectare (listă bifabilă)
// → când suni medicul → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const srvNume = 'Acid hialuronic';
  const pAH = pret('injectari-acid-hialuronic');
  const pBuze = pret('augmentare-buze');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['de-ce', 'De ce dispare efectul'],
    ['cauze', 'Cauze legate de tratament'],
    ['factori', 'Factori care țin de tine'],
    ['prelungire', 'Cum prelungești efectul'],
    ['dupa', 'Îngrijirea după injectare'],
    ['la-moa', 'Acidul hialuronic la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De ce migrează acidul hialuronic?', 'Migrarea poate apărea când injectarea este prea superficială, prea agresivă sau într-o zonă nepotrivită pentru produs. Zonele cu multă mișcare, cum sunt buzele, sunt mai predispuse. Masajul, căldura și efortul intens în primele zile pot crește și ele riscul, înainte ca produsul să se așeze.'],
    ['Cât de des se fac retușurile?', 'O intervenție mică la 6–12 luni ajută la menținerea volumului și previne pierderea bruscă a acestuia. Medicul stabilește momentul și cantitatea, în funcție de zonă și de cum a evoluat rezultatul.'],
    ['Este normal să am umflături sau noduli mici după injectare?', 'În primele 3–14 zile, umflăturile și nodulii mici sunt frecvenți și trec de obicei de la sine. Gheața aplicată ușor și hidratarea ajută. Masajul se face doar dacă ți-l recomandă medicul.'],
    ['Pot zbura cu avionul după acid hialuronic?', 'Ideal este să amâni zborul cu 3–7 zile. În primele 48 de ore, schimbarea presiunii din cabină poate accentua umflăturile și vânătăile.'],
    ['Fumatul influențează cât ține fillerul?', 'Da. Fumatul afectează circulația locală și poate grăbi degradarea acidului hialuronic, iar alcoolul deshidratează pielea. Ambele pot scurta durata rezultatului.'],
    ['Contează unde se păstrează produsul?', 'Da. Fillerele trebuie păstrate conform recomandărilor producătorului, de regulă la 2–8 °C. Un produs depozitat greșit se poate degrada și poate dura mai puțin.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Cât ține acidul hialuronic depinde de <b>produs, zona injectată, tehnică și doză</b>, dar și de organismul și stilul tău de viață.</li>
    <li>Zonele cu multă mișcare, cum sunt <b>buzele</b>, pot absorbi produsul mai repede.</li>
    <li>Fumatul, alcoolul, soarele, <b>deshidratarea</b>, stresul și schimbările hormonale pot scurta durata rezultatului.</li>
    <li>Primele zile contează: <b>fără atingere, căldură și efort intens</b>, cu capul ridicat noaptea și fără zboruri.</li>
    <li>Un <b>retuș la 6–12 luni</b> ajută la menținerea volumului, fără exagerări.</li>
  </ul>
</section>

<h2 id="de-ce">De ce dispare efectul mai repede</h2>
<p class="ar-first">Ai investit într-un tratament cu acid hialuronic și, după o vreme, ai observat că volumul s-a estompat sau că produsul pare să se fi mutat. Nu ești singura persoană căreia i se întâmplă, iar de cele mai multe ori există o explicație.</p>
<p>Durata și stabilitatea rezultatului depind de mai mulți factori: tipul de filler, zona injectată, felul în care lucrează pielea și chiar stilul tău de viață. Unii țin de tratament, alții de tine. Pe cei din a doua categorie îi poți influența.</p>

<h2 id="cauze">Cauze legate de tratament</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Produsul</b><p>Un acid hialuronic slab reticulat sau din loturi necontrolate poate fi absorbit mai repede. Contează de unde provine fillerul.</p></div>
  <div class="rx-card"><i>02</i><b>Tehnica de injectare</b><p>O injectare prea superficială, prea agresivă sau într-o zonă nepotrivită produsului poate duce la migrare sau absorbție mai rapidă.</p></div>
  <div class="rx-card"><i>03</i><b>Doza</b><p>O cantitate prea mică nu oferă volum de susținere. Fiecare zonă cere o cantitate anume: obrajii, de exemplu, mai mult decât conturul buzelor.</p></div>
</div>
<aside class="rx-note"><b>Și depozitarea contează</b><p>Fillerele trebuie păstrate conform recomandărilor, de regulă la temperaturi între 2 și 8 °C. Un produs păstrat greșit se poate degrada și poate dura mai puțin. E în regulă să întrebi ce produs ți se injectează.</p></aside>

<h2 id="factori">Factori care țin de tine</h2>
<p>Același tratament poate dura diferit de la o persoană la alta. Factorii cei mai frecvenți:</p>
<ul class="rx-chips rx-chips-neg"><li>metabolism rapid</li><li>hidratare scăzută</li><li>efort fizic intens</li><li>stres cronic</li><li>somn puțin</li><li>fumatul</li><li>alcoolul</li><li>expunerea la soare și solar</li></ul>
<div class="rx-two">
  <div><h3>Variațiile hormonale</h3><p>Sarcina, menopauza sau contraceptivele pot influența elasticitatea pielii și retenția de apă. Organismul poate metaboliza aceeași cantitate de acid hialuronic diferit în diferite etape hormonale.</p></div>
  <div><h3>Afecțiunile medicale</h3><p>În cazul unor dezechilibre medicale, cum ar fi un nivel scăzut de globule albe (leucopenie), efectul se poate estompa mai repede. Spune-i medicului istoricul tău înainte de tratament.</p></div>
</div>

<h2 id="prelungire">Cum prelungești efectul</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Hidratarea și alimentația</b><p>Bea apă constant. O alimentație cu fructe, legume, pește și nuci susține elasticitatea pielii.</p></div>
  <div class="rx-card"><i>02</i><b>Protecția solară</b><p>Razele UV grăbesc degradarea acidului hialuronic. Folosește zilnic SPF 30+, evită solarul și poartă pălărie.</p></div>
  <div class="rx-card"><i>03</i><b>Retușurile</b><p>O intervenție mică la 6–12 luni menține volumul și previne pierderea bruscă a acestuia.</p></div>
</div>
<p>Pentru îngrijirea zilnică după tratament sunt potrivite cremele hidratante blânde, serurile cu acid hialuronic și produsele fără parfum sau iritanți, plus SPF-ul recomandat de medic.</p>

<h2 id="dupa">Îngrijirea în primele zile după injectare</h2>
<p>Bifează pe rând ce ai făcut. Lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>
  <li><label><input type="checkbox"> Compresă rece, înfășurată într-un prosop, 10–15 minute, la intervale, în primele 24 de ore</label></li>
  <li><label><input type="checkbox"> Fără atingere, frecare, masaj sau machiaj pe zonă în primele 6–12 ore</label></li>
  <li><label><input type="checkbox"> Somn cu capul ridicat pe 2–3 perne în primele 2–3 nopți</label></li>
  <li><label><input type="checkbox"> Fără efort intens, saună, masaj facial sau căldură în primele 1–2 zile</label></li>
  <li><label><input type="checkbox"> Fără zboruri cu avionul 3–7 zile, dacă se poate</label></li>
  <li><label><input type="checkbox"> SPF zilnic pe zona tratată</label></li>
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>
<p>În primele 3–14 zile, umflăturile și nodulii mici sunt frecvenți și trec de obicei de la sine. Gheața aplicată ușor și hidratarea ajută, iar un gel cu arnică poate fi de folos. Masajul se face doar sub îndrumarea medicului.</p>
<div class="rx-alert"><b>Contactează medicul dacă observi</b> zone dure care nu trec, disconfort neobișnuit, roșeață intensă sau semne de infecție. Intervenția rapidă poate preveni complicațiile.</div>

<h2 id="la-moa">Acidul hialuronic la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Evaluarea</b><p>Medicul discută cu tine ce îți dorești, îți verifică istoricul și stabilește zona, produsul și cantitatea potrivite.</p></li>
  <li><b>Injectarea</b><p>Produsul se alege pentru zona tratată, iar tehnica și doza se adaptează feței tale.</p>${pAH ? `<em>Acid hialuronic · de la ${lei(pAH)}</em>` : ''}${pBuze ? `<em>Augmentare buze · de la ${lei(pBuze)}</em>` : ''}</li>
  <li><b>Primele zile</b><p>Primești recomandările de îngrijire de mai sus și știi pe cine să suni dacă apare ceva neobișnuit.</p></li>
  <li><b>Reevaluarea și retușul</b><p>Medicul urmărește cum a evoluat rezultatul și îți spune când are sens un retuș, de obicei la 6–12 luni.</p></li>
</ol>
<p class="rx-links">Află mai multe despre ${link('injectari-acid-hialuronic', 'tratamentele cu acid hialuronic')} și ${link('augmentare-buze', 'augmentarea buzelor')}, citește <a href="/nou/acid-hialuronic-in-buze-cat-dureaza/">cât durează acidul hialuronic în buze</a> sau despre <a href="/nou/hialuronidaza/">hialuronidază</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Cât ține acidul hialuronic depinde atât de tratament, cât și de tine. Cu un produs potrivit zonei, o tehnică atentă și îngrijire corectă în primele zile, rezultatul are condiții să se așeze și să arate natural.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srvNume)}">Programează o evaluare</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de îngrijire după injectare, bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-acid-hialuronic-dupa', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'De ce efectul acidului hialuronic poate trece mai repede decât te așteptai, ce factori țin de tratament și ce țin de tine. Cu o listă de îngrijire pentru primele zile, pe care o poți bifa.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
