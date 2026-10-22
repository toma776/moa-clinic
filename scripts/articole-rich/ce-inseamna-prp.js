// Versiunea structurată a articolului „Ce înseamnă PRP și beneficiile tratamentului”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care aude prima dată de PRP:
// răspunsul scurt → ce este → cum se obține → la ce se folosește (file) → beneficii și efecte secundare → pașii la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const prp = serv['prp-scalp']?.preturi || [];
  const pP = (re) => prp.find((p) => re.test(p.nume))?.valoare;
  const srv = 'PRP – terapia vampir';
  const pFata = pP(/vampir/i);
  const pScalp = pP(/^PRP SCALP, 1 eprubet[ăa]$/i);
  const pMicro = pP(/microneedling/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce înseamnă PRP'],
    ['cum-se-obtine', 'Cum se obține plasma'],
    ['utilizari', 'La ce se folosește'],
    ['beneficii', 'Beneficii și efecte secundare'],
    ['la-moa', 'Terapia PRP la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De ce se numește PRP „terapia vampir”?', 'Pentru că presupune recoltarea unei cantități mici din propriul tău sânge, care este procesat și apoi reinjectat în zona tratată.'],
    ['Cât durează o ședință PRP?', 'Procedura durează aproximativ 30–45 de minute. Nu este nevoie de internare.'],
    ['Doare procedura?', 'Disconfortul este redus prin anestezic local: cremă anestezică pe zonele mai întinse fără păr sau spray anestezic pe zonele mai mici. Injectarea se face cu microace foarte fine.'],
    ['Ce efecte secundare pot apărea?', 'Sunt rare și, de obicei, ușoare: o mică sângerare locală, durere ușoară, inflamație temporară. Riscul de infecție este redus când procedura se face în condiții sterile.'],
    ['Se poate combina PRP cu alte tratamente?', 'Da. Pentru căderea părului poate fi asociat cu microneedling sau mezoterapie, iar pentru piele poate completa tratamentele de rejuvenare. Combinația se stabilește la consult.'],
    ['Cât costă terapia PRP?', 'Prețul depinde de zona tratată, de complexitate și de numărul de ședințe recomandat. Medicul îți spune după evaluare ce plan ți se potrivește.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>PRP înseamnă <b>plasmă bogată în trombocite</b>, obținută din propriul tău sânge.</li>
    <li>Trombocitele conțin <b>factori de creștere</b>, care susțin regenerarea celulară și refacerea țesuturilor.</li>
    <li>Se folosește pentru <b>căderea părului, calitatea pielii</b>, cicatrici, cearcăne și în unele afecțiuni ginecologice.</li>
    <li>O ședință durează <b>aproximativ 30–45 de minute</b> și nu necesită internare. Efectele secundare sunt, de obicei, ușoare.</li>
    <li>La MOA, terapia PRP face parte dintr-un <b>plan personalizat</b>, stabilit după consult${pret('prp-scalp') ? `, de la ${lei(pret('prp-scalp'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce înseamnă PRP</h2>
<p class="ar-first">Te confrunți cu căderea părului sau simți că pielea și-a pierdut din vitalitate? Poate ai auzit atunci de PRP, din engleză Platelet-Rich Plasma, adică plasmă bogată în trombocite. Este un tratament minim invaziv, care folosește resursele propriului tău organism pentru a susține regenerarea.</p>
<p>Gândește-te la PRP ca la un impuls natural de vindecare: medicul extrage din sângele tău elementele care ajută la refacerea țesuturilor și le duce exact acolo unde e nevoie. Terapia este cunoscută și ca <b>„terapia vampir”</b>, pentru că presupune recoltarea și reinjectarea unei cantități mici de sânge.</p>
<div class="rx-two">
  <div><h3>Plasma</h3><p>Partea lichidă a sângelui, mediul în care se află trombocitele.</p></div>
  <div><h3>Trombocitele</h3><p>Celule cu rol esențial în vindecare. Conțin factori de creștere, care:</p><ul class="rx-chips"><li>stimulează regenerarea celulară</li><li>reduc inflamația</li><li>susțin refacerea țesuturilor</li></ul></div>
</div>

<h2 id="cum-se-obtine">Cum se obține plasma și cum decurge procedura</h2>
<p>Tot procesul are loc în condiții sterile, cu echipamente medicale dedicate. Pentru că se folosește sângele tău, riscul de reacții adverse sau de respingere este redus, spre deosebire de situațiile în care se folosește sânge de la un donator.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Recoltarea</b><p>Se recoltează din braț o cantitate mică de sânge, mai puțin decât la analizele obișnuite.</p></div>
  <div class="rx-card"><i>02</i><b>Centrifugarea</b><p>Sângele este procesat într-o centrifugă medicală, care separă plasma bogată în trombocite.</p></div>
  <div class="rx-card"><i>03</i><b>Injectarea</b><p>După anestezia locală (cremă sau spray), plasma se injectează cu microace foarte fine în zona vizată.</p></div>
</div>

<h2 id="utilizari">La ce se folosește PRP</h2>
<p>PRP nu este folosit doar în estetică. Datorită efectului regenerativ, are aplicații medicale și estetice. Alege o filă ca să vezi ce poate face în fiecare caz.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Păr</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Piele</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Alte utilizări</button>
  </div>
  <div class="rx-panel" data-panel="0"><p>Injectată în scalp, plasma poate acționa ca un „restart” pentru foliculii slăbiți. Poate:</p><ul class="rx-chips"><li>îmbunătăți circulația sanguină</li><li>hrăni rădăcina firului de păr</li><li>stimula creșterea de fire noi</li><li>întări firele existente</li></ul><p>Cercetările au arătat rezultate bune în alopecia androgenetică, la bărbați și la femei, ca tratament de sine stătător sau alături de tratamentele clasice ori de transplantul de păr. Sunt încă necesare studii pentru protocoale standard.</p></div>
  <div class="rx-panel" data-panel="1" hidden><p>Folosit pe față sau pe alte zone ale corpului, PRP poate:</p><ul class="rx-chips"><li>susține elasticitatea pielii</li><li>estompa liniile fine</li><li>uniformiza nuanța tenului</li><li>atenua cicatricile post-acnee</li></ul><p>Pielea devine treptat mai luminoasă și mai fermă. Poate completa alte tratamente de rejuvenare, de exemplu ${link('microneedeling', 'microneedlingul cu Dermapen')}.</p></div>
  <div class="rx-panel" data-panel="2" hidden><p>Terapia mai este folosită și pentru:</p><ul class="rx-chips"><li>cicatrici</li><li>ameliorarea cearcănelor</li><li>anumite afecțiuni ginecologice</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>PRP este considerat o opțiune promițătoare, mai ales pentru căderea părului, dar protocoalele standard sunt încă în studiu, iar răspunsul diferă de la o persoană la alta. De aceea, la MOA tratamentul se personalizează: zona, numărul de ședințe și eventualele combinații se stabilesc la consult.</p></aside>

<h2 id="beneficii">Beneficii și efecte secundare</h2>
<p>Ca orice procedură medicală, PRP are atât avantaje, cât și posibile efecte secundare.</p>
<div class="rx-two">
  <div><h3>Avantaje</h3><ul><li>nu necesită internare</li><li>folosește sângele tău</li><li>risc redus de reacții adverse</li><li>timp scurt de recuperare</li></ul></div>
  <div><h3>Efecte secundare posibile</h3><ul><li>sângerare locală</li><li>durere ușoară</li><li>inflamație temporară</li><li>risc redus de infecție</li></ul><p>Sunt rare și, de obicei, ușoare.</p></div>
</div>
<div class="rx-alert"><b>Pentru siguranța ta:</b> spune-i medicului istoricul tău medical complet și respectă indicațiile primite după procedură. Dacă durerea sau inflamația se accentuează în zilele următoare în loc să scadă, sună la clinică.</div>

<h2 id="la-moa">Terapia PRP la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul îți ascultă motivele, verifică istoricul medical și stabilește dacă PRP ți se potrivește, singur sau în combinație cu alte tratamente.</p></li>
  <li><b>Recoltarea și procesarea</b><p>Se recoltează o cantitate mică de sânge, procesată în centrifugă în condiții sterile.</p></li>
  <li><b>Procedura</b><p>După anestezia locală, plasma se injectează cu microace fine. Procedura durează aproximativ 30–45 de minute.</p>${pFata ? `<em>PRP față, gât, decolteu sau mâini · ${lei(pFata)}</em>` : ''}${pScalp ? `<em>PRP scalp, 1 eprubetă · ${lei(pScalp)}</em>` : ''}${pMicro ? `<em>PRP + microneedling Dermapen · ${lei(pMicro)}</em>` : ''}</li>
  <li><b>După și reevaluarea</b><p>Primești recomandări pentru zilele următoare. La control, medicul discută cu tine rezultatul și numărul de ședințe potrivit.</p></li>
</ol>
<p class="rx-links">Vezi pagina despre ${link('prp-scalp', 'terapia PRP')}, citește <a href="/nou/terapia-vampir-pareri/">părerile despre terapia vampir</a> sau află mai multe despre ${link('mezoterapie', 'mezoterapie')} și ${link('microneedeling', 'microneedling')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>PRP ajută organismul să își folosească propriile resurse pentru regenerare, fie că e vorba de păr, de piele sau de alte indicații. Are sens atunci când este recomandat corect și făcut de medic, iar primul pas este un consult.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srv)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu utilizările PRP
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
    lede: 'Ce înseamnă PRP, cum se obține plasma bogată în trombocite și la ce se folosește, de la căderea părului la calitatea pielii. Cu beneficiile, efectele secundare și pașii terapiei la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 6,
  };
};
