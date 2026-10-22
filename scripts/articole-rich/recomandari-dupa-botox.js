// Versiunea structurată a articolului „Recomandări după botox pentru îngrijire corectă”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care tocmai și-a făcut (sau urmează să-și facă) botox:
// răspunsul scurt → cum acționează → ce faci în primele ore și zile (listă bifabilă) → pe termen lung → când suni medicul → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const pBotox = pret('injectare-botox');
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['cum-actioneaza', 'Cum acționează botoxul'],
    ['de-ce', 'De ce contează îngrijirea de după'],
    ['primele-ore', 'Primele ore și zile'],
    ['lista', 'Lista de după botox'],
    ['termen-lung', 'Pe termen lung'],
    ['medic', 'Când suni medicul'],
    ['la-moa', 'Botoxul la MOA, pas cu pas'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Când pot face sport după botox?', 'Este indicat să eviți efortul fizic intens, inclusiv antrenamentele de forță, alergarea și sauna, timp de cel puțin 48 de ore. Efortul crește ritmul cardiac și tensiunea și poate favoriza deplasarea substanței din zonele tratate.'],
    ['Cât timp stau în poziție verticală după injectare?', 'În primele 4 ore după procedură este recomandat să rămâi în poziție verticală și să eviți aplecarea capului.'],
    ['Pot folosi retinol sau acizi exfolianți după botox?', 'Este bine să le eviți temporar, în primele 24–48 de ore, la fel ca vitamina C în concentrații mari și tratamentele cosmetice intensive. În ziua tratamentului sunt potrivite produsele blânde de curățare și cremele hidratante simple.'],
    ['Când se vede efectul?', 'Efectul se instalează progresiv. De obicei devine vizibil în primele 7–14 zile după tratament.'],
    ['Cât durează efectul și când revin?', 'De regulă, în 4–6 luni simți că efectul a scăzut. Momentul următoarei ședințe nu se stabilește după un calendar fix, ci în funcție de răspunsul tău, de zona tratată și de ce îți dorești, la evaluarea cu medicul.'],
    ['Este normal să am roșeață după injectare?', 'Da. O ușoară roșeață, mici umflături sau sensibilitate în punctele de injectare pot apărea în primele ore și dispar de obicei de la sine. Dacă persistă sau se accentuează, anunță medicul.'],
  ];

  const lista = [
    ['Primele 4 ore', ['Rămâi în poziție verticală', 'Nu apleca capul', 'Nu masa, nu freca și nu apăsa zonele injectate']],
    ['Primele 24–48 de ore', ['Fără sport, antrenamente de forță sau alergare', 'Fără saună', 'Folosește doar produse blânde de curățare și o cremă hidratantă simplă', 'Amână retinolul, acizii exfolianți și vitamina C în concentrații mari', 'Amână tratamentele cosmetice intensive']],
    ['În zilele următoare', ['Urmărește cum se instalează efectul (7–14 zile)', 'Aplică zilnic protecție solară', 'Hidratează-te și hidratează-ți pielea']],
  ];
  let n = 0;

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Rezultatul după botox depinde și de <b>cum te îngrijești în primele ore și zile</b>, nu doar de injectare.</li>
    <li>În primele <b>4 ore</b>: stai în poziție verticală, nu apleca capul și nu atinge, nu masa zonele tratate.</li>
    <li>Cel puțin <b>48 de ore</b>: fără sport intens și fără saună. În primele <b>24–48 de ore</b>: fără retinol, acizi exfolianți sau vitamina C concentrată.</li>
    <li>Efectul apare treptat, de obicei în <b>7–14 zile</b>, și scade, de regulă, în <b>4–6 luni</b>.</li>
    <li>Sună medicul dacă observi <b>asimetrii care persistă, durere, inflamație prelungită</b> sau lipsa efectului după perioada normală.</li>
  </ul>
</section>

<h2 id="cum-actioneaza">Cum acționează botoxul</h2>
<p class="ar-first">Ai făcut pasul spre un aspect mai odihnit și mai neted, iar acum te întrebi ce ai voie să faci în orele următoare. Întrebarea e bună: din experiența clinică, una dintre cauzele frecvente ale rezultatelor sub așteptări este ignorarea recomandărilor de după procedură sau sfaturile luate din surse neavizate.</p>
<p>Botoxul (toxina botulinică) relaxează temporar mușchii care formează ridurile de expresie. Injectat în doze precise, blochează semnalele nervoase către acești mușchi și reduce contracțiile repetate care, în timp, lasă linii pe frunte, între sprâncene sau în jurul ochilor.</p>
<p>Efectul nu apare imediat. Se instalează progresiv, pe măsură ce substanța se fixează în mușchi. Când procedura este făcută corect, fața arată mai netedă și mai odihnită, fără să își piardă expresivitatea.</p>

<h2 id="de-ce">De ce contează îngrijirea de după</h2>
<p>În primele ore și zile, substanța trebuie să rămână exact în zonele tratate, ca să acționeze uniform. Unele gesturi aparent inofensive pot influența felul în care se distribuie botoxul și, implicit, rezultatul.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Un efect previzibil</b><p>Substanța rămâne în mușchii vizați și acționează uniform.</p></div>
  <div class="rx-card"><i>02</i><b>Mai puține reacții nedorite</b><p>Reacțiile vizibile sunt rare și apar, de cele mai multe ori, când recomandările nu sunt respectate.</p></div>
  <div class="rx-card"><i>03</i><b>Un rezultat care se menține</b><p>Îngrijirea de după face parte din tratament, nu este un pas opțional.</p></div>
</div>
<aside class="rx-note"><b>Ce e normal în primele ore</b><p>Botoxul este, în general, bine tolerat. Pot apărea o ușoară roșeață, mici umflături sau sensibilitate în punctele de injectare, de regulă în primele ore. Acestea trec de obicei de la sine, fără alte intervenții.</p></aside>

<h2 id="primele-ore">Ce faci în primele ore și zile</h2>
<div class="rx-two">
  <div><h3>Ce poți face</h3><ul><li>stai în poziție verticală în primele 4 ore</li><li>folosește produse blânde de curățare</li><li>aplică o cremă hidratantă fără ingrediente active puternice</li><li>păstrează rutina cât mai simplă în ziua tratamentului</li></ul></div>
  <div><h3>Ce eviți</h3><ul><li>efortul fizic intens și sauna, cel puțin 48 de ore</li><li>aplecarea capului în primele 4 ore</li><li>masarea, frecarea sau apăsarea zonelor tratate</li><li>retinolul, acizii exfolianți, vitamina C concentrată și tratamentele cosmetice intensive, 24–48 de ore</li></ul></div>
</div>
<p>De ce efortul contează: activitățile care cresc ritmul cardiac și tensiunea arterială pot favoriza deplasarea substanței din zonele tratate. Iar produsele cu ingrediente active pot irita pielea tocmai în perioada în care botoxul se fixează.</p>

<h2 id="lista">Lista ta de după botox</h2>
<p>Bifează pe măsură ce treci prin fiecare etapă. Lista rămâne salvată în browserul tău.</p>
<ul class="rx-todo" data-todo>
${lista.map(([etapa, items]) => items.map((t) => `  <li><label><input type="checkbox" data-i="${n++}"> <b>${esc(etapa)}:</b> ${esc(t)}</label></li>`).join('\n')).join('\n')}
</ul>
<button type="button" class="rx-print" onclick="window.print()">Tipărește lista</button>

<h2 id="termen-lung">Recomandări pe termen lung</h2>
<p>După ce efectul se stabilizează, îngrijirea continuă. Rezultatul se menține prin monitorizare, obiceiuri zilnice și o comunicare bună cu medicul.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Urmărește rezultatul</b><p>Efectul devine vizibil în primele 7–14 zile. Observă cum se instalează și notează ce simți.</p></div>
  <div class="rx-card"><i>02</i><b>Revino când efectul scade</b><p>De regulă după 4–6 luni. Întreținerea se stabilește după răspunsul tău, zona tratată și obiective, ca să eviți supracorecțiile.</p></div>
  <div class="rx-card"><i>03</i><b>Hidratare și protecție solară</b><p>Hidratarea, din interior și cu produse potrivite, susține pielea. Protecția solară zilnică contează, pentru că expunerea la UV accelerează îmbătrânirea pielii.</p></div>
</div>

<h2 id="medic">Când suni medicul</h2>
<div class="rx-alert"><b>Contactează medicul dacă observi:</b> asimetrii care persistă, disconfort accentuat, durere, inflamație care nu trece sau lipsa efectului după perioada normală de instalare. O evaluare făcută din timp permite ajustări și previne complicațiile.</div>

<h2 id="la-moa">Botoxul la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul îți evaluează fața, mușchii implicați și ce îți dorești, apoi stabilește zonele și doza.</p></li>
  <li><b>Injectarea</b><p>Procedura este făcută de medic, în doze precise, în zonele stabilite.</p>${pBotox ? `<em>Toxină botulinică · de la ${lei(pBotox)} / zonă</em>` : ''}</li>
  <li><b>Recomandările de după</b><p>Primești indicații personalizate pentru primele ore și zile, ca cele din lista de mai sus.</p></li>
  <li><b>Reevaluarea</b><p>Revii când simți că efectul a scăzut, de regulă după 4–6 luni, iar medicul stabilește împreună cu tine pasul următor.</p></li>
</ol>
<p class="rx-links">Citește și: <a href="/nou/ce-nu-e-permis-dupa-injectarea-cu-botox/">ce nu e permis după injectarea cu botox</a>, <a href="/nou/unde-se-pune-botox/">unde se pune botox</a> sau ${link('injectare-botox', 'pagina tratamentului cu toxină botulinică')}${dr ? `. Articol scris de <a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : ''}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Botoxul nu este doar o injectare, ci un proces: evaluare, îngrijire atentă în primele zile și monitorizare în timp. Cu recomandările respectate și o comunicare deschisă cu medicul, rezultatul are șanse mai mari să arate natural și echilibrat.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Toxină botulinică (Botox)">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: lista de după botox, bifabilă (păstrată în browser)
(() => {
  const todo = document.querySelector('[data-todo]');
  if (todo) {
    const K = 'moa-recomandari-dupa-botox-lista', boxes = [...todo.querySelectorAll('input')];
    try { const s = JSON.parse(localStorage.getItem(K) || '[]'); boxes.forEach((b, i) => (b.checked = !!s[i])); } catch {}
    todo.addEventListener('change', () => { try { localStorage.setItem(K, JSON.stringify(boxes.map((b) => b.checked))); } catch {} });
  }
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce faci și ce eviți în primele ore și zile după botox, când apare efectul și când e bine să suni medicul. Cu o listă pe care o poți bifa pas cu pas.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 6,
  };
};
