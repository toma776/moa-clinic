// Versiunea structurată a articolului „Ce nu e permis după injectarea cu botox”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care tocmai a făcut (sau urmează să facă) botox:
// răspunsul scurt → de ce contează primele ore → ce eviți și cât timp (file pe intervale) → produse și soare → pe termen lung → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
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
    ['de-ce', 'De ce contează primele ore'],
    ['cronologie', 'Ce eviți și cât timp'],
    ['activitati', 'Activități care pot afecta rezultatul'],
    ['produse', 'Produse cosmetice și soare'],
    ['termen-lung', 'Pe termen lung'],
    ['la-moa', 'Botoxul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cât timp nu am voie să mă întind după botox?', 'Ține capul în poziție verticală cel puțin 4 ore după procedură și nu te întinde și nu dormi în primele 4–5 ore. Poți sta pe scaun sau pe fotoliu, dar fără să apleci sau să răsucești capul.'],
    ['Când pot face sport după botox?', 'Evită efortul fizic intens cel puțin 24 de ore. Unii medici recomandă o pauză de 1–2 săptămâni; intervalul potrivit pentru tine îl stabilește medicul la consult.'],
    ['Când mă pot machia?', 'După 24 de ore, cu delicatețe. Ideal, reiei machiajul după două zile, dacă nu ai vânătăi sau disconfort.'],
    ['Pot bea alcool după botox?', 'Evită alcoolul cu cel puțin 24 de ore înainte și după procedură. Alcoolul dilată vasele de sânge și crește riscul de vânătăi în zona tratată.'],
    ['Când merg din nou la saună sau la solar?', 'Sauna și băile de aburi se evită cel puțin 48 de ore (unii medici recomandă o săptămână), iar solarul cel puțin o săptămână.'],
    ['Când văd rezultatul?', 'Primele efecte încep să apară în câteva zile, iar rezultatul final se vede după 7–14 zile. Nu trage concluzii mai devreme.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li><b>Primele ore</b> contează: ține capul vertical cel puțin 4 ore și nu atinge sau masa zona tratată 24 de ore.</li>
    <li>În <b>primele 24 de ore</b> evită efortul fizic intens, alcoolul, machiajul și căldura (duș fierbinte, saună, aburi).</li>
    <li>Sauna se evită <b>cel puțin 48 de ore</b>, iar solarul <b>cel puțin o săptămână</b>.</li>
    <li>Retinolul, exfolianții și produsele agresive se reiau <b>după câteva zile</b>, doar dacă pielea nu mai e iritată.</li>
    <li>Rezultatul final se vede după <b>7–14 zile</b>. La MOA pleci acasă cu o listă clară de recomandări${pret('injectare-botox') ? `; tratamentul pornește de la ${lei(pret('injectare-botox'))}` : ''}.</li>
  </ul>
</section>

<h2 id="de-ce">De ce contează primele ore după botox</h2>
<p class="ar-first">Ai făcut pasul, ai discutat cu medicul și ai ieșit din cabinet mulțumit(ă). Apoi apare întrebarea firească: și acum ce fac, e ceva ce nu am voie? E o întrebare bună, chiar și înainte de programare, pentru că îți arată că îți pasă de rezultat.</p>
<p>Injectarea cu toxină botulinică este o procedură minim invazivă, dar substanța are nevoie de timp să rămână exact acolo unde a fost plasată. Câteva gesturi aparent inofensive, cum ar fi să te întinzi, să îți atingi fața sau să faci sport, pot face ca substanța să migreze sau să se disipeze, iar efectul să fie mai slab decât te așteptai.</p>

<h2 id="cronologie">Ce eviți și cât timp</h2>
<p>Alege intervalul în care te afli ca să vezi ce e de evitat atunci. Medicul îți poate da indicații adaptate ție.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Primele 4–5 ore</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Primele 24 de ore</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">După 48 de ore</button>
    <button type="button" role="tab" aria-selected="false" data-tab="3">Prima săptămână</button>
  </div>
  <div class="rx-panel" data-panel="0"><p>Ține capul în poziție verticală. Poți sta pe scaun sau pe fotoliu, fără să apleci sau să răsucești capul.</p><ul class="rx-chips rx-chips-neg"><li>să te întinzi sau să dormi</li><li>să apleci capul</li><li>dușul fierbinte</li><li>aburii, inclusiv de la gătit</li></ul></div>
  <div class="rx-panel" data-panel="1" hidden><p>Este intervalul în care zona e mai sensibilă. Evită orice crește temperatura corpului sau apasă pe față.</p><ul class="rx-chips rx-chips-neg"><li>atingerea și masajul zonei</li><li>efortul fizic intens</li><li>alcoolul</li><li>machiajul</li><li>sauna și masajul facial</li></ul></div>
  <div class="rx-panel" data-panel="2" hidden><p>Dacă nu ai vânătăi sau disconfort, multe restricții se pot ridica. Primele efecte încep să se vadă, dar rezultatul final apare după 7–14 zile.</p><ul class="rx-chips"><li>machiaj, aplicat cu delicatețe</li><li>rutina obișnuită de îngrijire, fără ingrediente agresive</li></ul></div>
  <div class="rx-panel" data-panel="3" hidden><p>Alege produse blânde și protejează-ți pielea de soare. Dacă apar vânătăi ușoare, poți folosi o cremă calmantă, la recomandarea medicului.</p><ul class="rx-chips rx-chips-neg"><li>solarul (cel puțin o săptămână)</li><li>soarele direct</li><li>retinolul și exfolianții</li><li>produsele cu alcool sau parfum puternic</li><li>tratamentele noi</li></ul></div>
</div>

<h2 id="activitati">Activități care pot afecta rezultatul</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Sportul</b><p>Efortul crește fluxul de sânge, ceea ce poate favoriza vânătăile și poate face ca substanța să se disipeze mai repede. Evită-l cel puțin 24 de ore; unii medici recomandă 1–2 săptămâni.</p></div>
  <div class="rx-card"><i>02</i><b>Masajul și tratamentele faciale</b><p>Orice presiune pe față, de la masaj la un tratament cosmetic, poate muta substanța din locul în care a fost injectată.</p></div>
  <div class="rx-card"><i>03</i><b>Căldura</b><p>Dușul fierbinte se evită în primele 4–5 ore, iar sauna și băile de aburi cel puțin 48 de ore (unii medici recomandă o săptămână).</p></div>
</div>
<div class="rx-two">
  <div><h3>Alcoolul</h3><p>Dilată vasele de sânge și subțiază sângele, crescând riscul de vânătăi. Evită-l cu cel puțin 24 de ore înainte și după procedură.</p></div>
  <div><h3>Medicamente și suplimente</h3><p>Antiinflamatoarele, aspirina și suplimentele cu omega-3, usturoi sau ginkgo biloba pot crește riscul de vânătăi. Spune-i medicului, înainte, ce iei.</p></div>
</div>

<h2 id="produse">Produse cosmetice și soare</h2>
<p>Uneori, ce pare inofensiv poate irita sau sensibiliza pielea în zilele de după injectare. Păstrează rutina simplă: curățare delicată, fără frecare, și hidratare ușoară.</p>
<div class="rx-two">
  <div><h3>Lasă deoparte câteva zile</h3><ul><li>produsele cu alcool sau parfum puternic</li><li>texturile abrazive</li><li>retinolul</li><li>exfolianții chimici (AHA, BHA)</li></ul></div>
  <div><h3>Protejează-ți pielea</h3><ul><li>evită soarele în primele zile</li><li>poartă pălărie dacă ieși din casă</li><li>folosește protecție solară SPF 50 pentru ten sensibil</li><li>fără solar cel puțin o săptămână</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Recomandările de mai sus sunt cele uzuale. Pentru unele intervale, cum sunt sportul sau sauna, medicii recomandă durate diferite. De aceea, regula de bază rămâne să urmezi indicațiile primite în cabinet și să întrebi dacă ceva nu e clar.</p></aside>

<h2 id="termen-lung">Recomandări pe termen lung</h2>
<p>Efectul toxinei botulinice este temporar, dar poate fi păstrat mai bine cu câteva obiceiuri simple: protecție solară zilnică, o rutină de îngrijire coerentă și un stil de viață echilibrat. Nu evalua rezultatul în primele zile; așteaptă 7–14 zile, apoi discută cu medicul dacă e ceva de ajustat.</p>

<h2 id="la-moa">Botoxul la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul discută cu tine zonele de tratat, verifică ce medicamente și suplimente iei și îți explică ce urmează.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Injectarea</b><p>Procedura este rapidă și se face în cabinet.</p>${pB(/1 zonă/i) ? `<em>1 zonă · ${lei(pB(/1 zonă/i))}</em>` : ''}${pB(/2 zone/i) ? `<em>2 zone · ${lei(pB(/2 zone/i))}</em>` : ''}${pB(/3 zone.*femei/i) ? `<em>3 zone, femei · ${lei(pB(/3 zone.*femei/i))}</em>` : ''}</li>
  <li><b>După procedură</b><p>Pleci acasă cu o listă clară de recomandări și cu răspunsuri la întrebările tale.</p></li>
  <li><b>Reevaluarea</b><p>După 7–14 zile, când efectul s-a instalat, medicul verifică rezultatul.</p></li>
</ol>
<p class="rx-links">Citește și ${link('injectare-botox', 'despre tratamentul cu toxină botulinică la MOA')}, <a href="/nou/recomandari-dupa-botox/">recomandările după botox</a>, <a href="/nou/efecte-botox/">efectele botoxului</a> și <a href="/nou/unde-se-pune-botox/">unde se pune botox</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Grija de după tratament contează la fel de mult ca injectarea. Câteva zile de răbdare, fără presiune pe zona tratată și cu produse blânde, ajută ca rezultatul să fie cel pe care l-ai discutat cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Toxină botulinică (Botox)">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu restricțiile pe intervale de timp
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
    lede: 'Ce nu ai voie să faci după injectarea cu botox și cât timp: poziția capului, sportul, alcoolul, machiajul, sauna, soarele și produsele cosmetice, organizate pe intervale.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
