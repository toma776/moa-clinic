// Versiunea structurată a articolului „Riduri între sprâncene: cauze și tratamente”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva deranjat de ridurile de încruntare:
// răspunsul scurt → ce sunt → dinamice sau statice (verificare rapidă) → de ce apar → tratamente → ingrediente → prevenție → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => (id(sid) ? minPrice(sid) : null);
  const botox = serv['injectare-botox']?.preturi || [];
  const pBotox1 = botox.find((p) => /1 zon/i.test(p.nume) && !/ cu to/i.test(p.nume))?.valoare;
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');
  const botoxNume = 'Toxină botulinică (Botox)';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt ridurile glabelare'],
    ['tip', 'Dinamice sau statice? Verificare rapidă'],
    ['cauze', 'De ce apar'],
    ['tratamente', 'Tratamente'],
    ['ingrediente', 'Ingrediente active'],
    ['preventie', 'Cum le previi'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ridurile glabelare și ridurile de încruntare sunt același lucru?', 'Da. Sunt aceleași linii, formate în glabelă, zona dintre sprâncene, deasupra nasului. Diferența ține de momentul în care se văd: doar când te încrunți (dinamice) sau și în repaus (statice).'],
    ['Cât durează efectul toxinei botulinice între sprâncene?', 'Rezultatele apar, de obicei, în câteva zile, iar efectul se poate menține până la aproximativ 6 luni. Durata diferă de la o persoană la alta.'],
    ['Când se folosește acidul hialuronic în loc de toxina botulinică?', 'Acidul hialuronic se ia în calcul când ridurile sunt vizibile și cu fața relaxată. Redă volum și hidratare zonei adâncite, iar efectul poate dura până la aproximativ un an. Medicul decide la consult, uneori combinând tratamentele.'],
    ['Pot apărea riduri între sprâncene și la o vârstă tânără?', 'Da, mai ales dacă există predispoziție genetică sau un stil de viață care solicită pielea: încruntare frecventă, fumat, stres, hidratare insuficientă.'],
    ['Există variante fără injecții?', 'Da. Radiofrecvența stimulează colagenul fără ace, iar peelingul chimic ajută pielea să se regenereze. Retinolul, vitaminele C și E și acidul hialuronic din îngrijirea zilnică susțin pielea pe termen lung.'],
    ['Cum previn ridurile de încruntare?', 'Hidratează-te, dormi suficient, folosește SPF zilnic, relaxează-ți fruntea și sprâncenele și redu fumatul și stresul.'],
  ];

  const intrebariCheck = [
    ['Se văd liniile dintre sprâncene și atunci când fața ta este relaxată?', 'Liniile vizibile în repaus sunt riduri statice: aceleași riduri de încruntare, adâncite în timp.'],
    ['Ești întrebat(ă) „De ce te încrunți?” deși nu te încrunți?', 'De obicei înseamnă că liniile rămân vizibile și când mușchii sunt relaxați.'],
    ['Rămân urme între sprâncene după ce îți relaxezi fruntea, în fața oglinzii?', 'Urmele care rămân după relaxare arată că ridurile s-au adâncit.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile dintre sprâncene se mai numesc <b>riduri glabelare</b> sau <b>riduri de încruntare</b> și pot da impresia că ești mereu supărat(ă) sau obosit(ă).</li>
    <li>Pot fi <b>dinamice</b> (doar când te încrunți) sau <b>statice</b> (vizibile și în repaus). Tipul contează pentru alegerea tratamentului.</li>
    <li>Apar din <b>contracții musculare repetate</b>, pierderea de colagen și elastină, genetică, soare, fumat și stres. Pot apărea și la persoane tinere.</li>
    <li>Opțiunile includ <b>toxina botulinică</b> (efect de până la aproximativ 6 luni), <b>acidul hialuronic</b> (până la aproximativ un an), microneedling cu PRP, radiofrecvență și peeling chimic.</li>
    <li>Prevenția înseamnă <b>SPF zilnic, hidratare, somn</b> și mai puțin fumat și stres.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile dintre sprâncene</h2>
<p class="ar-first">Ți s-a întâmplat să fii întrebat(ă) „De ce te încrunți?” deși nu o faceai? Liniile dintre sprâncene pot da impresia că ești mereu furios(ă), supărat(ă) sau obosit(ă). Vestea bună este că există soluții minim invazive, care nu îți întrerup rutina zilnică.</p>
<p>Ridurile glabelare și ridurile de încruntare nu sunt tipuri diferite de riduri. Se formează în aceeași zonă, <b>glabela</b>, adică partea dintre sprâncene, deasupra nasului. Chiar dacă le asociem cu vârsta, pot apărea și la persoanele tinere, mai ales dacă există predispoziție genetică.</p>
<div class="rx-two">
  <div><h3>Riduri dinamice</h3><p>Apar doar atunci când te încrunți sau îți exprimi emoțiile.</p></div>
  <div><h3>Riduri statice</h3><p>Sunt aceleași linii, adâncite în timp, care rămân vizibile și când mușchii feței sunt relaxați.</p></div>
</div>

<h2 id="tip">Dinamice sau statice? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>3 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți dă doar o idee despre tipul ridurilor, pe care medicul îl confirmă la consult.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Ridurile tale par să fie vizibile și în repaus.</b><p>Pentru ridurile statice, medicul poate lua în calcul, pe lângă toxina botulinică, acidul hialuronic sau tratamente care stimulează colagenul. Combinația potrivită se stabilește la consult.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Ridurile tale par să fie dinamice.</b><p>Apar mai ales când te încrunți. În acest caz se discută de obicei toxina botulinică, care relaxează mușchii responsabili și poate preveni adâncirea liniilor. Medicul confirmă la consult.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(botoxNume)}">Programează-te pentru toxina botulinică</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="cauze">De ce apar ridurile între sprâncene</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Contracțiile musculare</b><p>Încruntarea repetată dă naștere ridurilor glabelare. Hidratarea insuficientă, fumatul și stresul le pot grăbi.</p></div>
  <div class="rx-card"><i>02</i><b>Mai puțin colagen și elastină</b><p>Sunt „scheletul” pielii. Când organismul produce mai puțin din ele, liniile fine devin treptat riduri vizibile.</p></div>
  <div class="rx-card"><i>03</i><b>Genetica și stilul de viață</b><p>O piele elastică se poate moșteni, dar soarele, fumatul și poluarea pot accelera apariția ridurilor.</p></div>
</div>

<h2 id="tratamente">Tratamente pentru ridurile dintre sprâncene</h2>
<p>Scopul este ca liniile să se atenueze, iar fața să își păstreze expresivitatea naturală. Iată cum diferă opțiunile:</p>
<div class="rx-compare">
  <div class="rx-col rx-col-on"><small>Toxină botulinică</small><b>Relaxează mușchii</b><dl><dt>Cum acționează</dt><dd>blochează semnalele care fac mușchii să se contracte frecvent</dd><dt>Potrivită pentru</dt><dd>riduri dinamice, prevenirea adâncirii lor</dd><dt>Efect</dt><dd>în câteva zile; până la aproximativ 6 luni</dd></dl>${id('injectare-botox') ? `<a class="link-u" href="${esc(live('injectare-botox'))}">Despre toxina botulinică →</a>` : ''}</div>
  <div class="rx-col"><small>Acid hialuronic</small><b>Umple zona adâncită</b><dl><dt>Cum acționează</dt><dd>atrage și reține apa, redă volum și hidratare</dd><dt>Potrivit pentru</dt><dd>riduri vizibile și în repaus</dd><dt>Efect</dt><dd>vizibil imediat; până la aproximativ un an</dd></dl>${id('injectari-acid-hialuronic') ? `<a class="link-u" href="${esc(live('injectari-acid-hialuronic'))}">Despre acidul hialuronic →</a>` : ''}</div>
  <div class="rx-col"><small>Microneedling cu PRP și radiofrecvență</small><b>Stimulează colagenul</b><dl><dt>Cum acționează</dt><dd>microcanale controlate și plasmă bogată în trombocite, respectiv căldură în straturile profunde ale pielii</dd><dt>Potrivite pentru</dt><dd>riduri fine, piele mai puțin fermă</dd><dt>Efect</dt><dd>treptat, pe măsură ce se formează colagen</dd></dl></div>
</div>
<p><b>Peelingul chimic</b> este o altă opțiune: îndepărtează stratul superficial al pielii și stimulează formarea unuia nou, mai uniform. Specialistul alege acizii potriviți tipului de piele (glicolic, lactic sau salicilic), iar ridurile fine dintre sprâncene devin mai puțin vizibile. Pentru microneedling și radiofrecvență vezi ${link('microneedeling', 'microneedling-ul cu Dermapen')}, ${link('prp-scalp', 'terapia PRP')} și ${link('venus-viva', 'radiofrecvența Venus Viva')}.</p>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Efectul tratamentelor este temporar, iar durata lui diferă de la o persoană la alta, în funcție de particularitățile pielii, stilul de viață și planul stabilit. Tratamentul se alege după tipul tău de piele și cât de adânci sunt ridurile.</p></aside>

<h2 id="ingrediente">Ingrediente active pentru îngrijirea zilnică</h2>
<p>Pielea se întreține zi de zi, prin alegeri mici, dar consecvente. Iată ce ingrediente susțin zona dintre sprâncene:</p>
<ul>
  <li><b>Retinol și alți derivați ai vitaminei A:</b> stimulează reînnoirea celulară și estompează ridurile fine. La început pielea poate reacționa, așa că folosește-l corect, cu îndrumarea specialistului.</li>
  <li><b>Vitaminele C și E:</b> un duo antioxidant care ajută la protejarea colagenului de stresul zilnic, poluare și razele UV.</li>
  <li><b>Coenzima Q10 și colagenul vegetal:</b> susțin metabolismul pielii, fermitatea și elasticitatea.</li>
  <li><b>Acidul hialuronic:</b> reține apa și oferă hidratare intensă, în seruri, creme sau tratamente injectabile.</li>
  <li><b>Uleiuri esențiale și extracte naturale</b> (lavandă, trandafir, mușețel): calmează și hrănesc pielea, în combinație cu alte ingrediente.</li>
</ul>

<h2 id="preventie">Cum previi ridurile între sprâncene</h2>
<ul class="rx-chips"><li>apă suficientă și creme hidratante</li><li>somn odihnitor</li><li>SPF zilnic, în orice anotimp</li><li>masaj facial și relaxarea frunții</li><li>renunțarea la fumat</li><li>mai puțin stres</li><li>produse alese după nevoile pielii</li></ul>
<p>Învață să îți relaxezi fruntea și sprâncenele, iar produsele de îngrijire alege-le după nevoile reale ale pielii, nu după trenduri. Specialiștii te pot ghida spre o rutină potrivită tipului tău de ten și vârstei.</p>

<h2 id="la-moa">Tratamentul ridurilor dintre sprâncene la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul evaluează tipul ridurilor (dinamice sau statice) și tipul pielii și îți recomandă tratamentul potrivit.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Procedura</b><p>Tratamentul ales se face în clinică, în câteva zeci de minute, fără să îți întrerupă rutina zilnică.</p>${id('injectare-botox') && pBotox1 ? `<em>Toxină botulinică, 1 zonă · ${lei(pBotox1)}</em>` : ''}${pret('injectari-acid-hialuronic') ? `<em>Acid hialuronic · de la ${lei(pret('injectari-acid-hialuronic'))}</em>` : ''}</li>
  <li><b>După procedură</b><p>Primești recomandările de îngrijire pentru primele zile.</p></li>
  <li><b>Reevaluarea</b><p>Medicul verifică rezultatul și discută cu tine când are sens repetarea tratamentului.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-in-jurul-gurii/">ridurile din jurul gurii</a>, <a href="/nou/riduri-frunte/">ridurile de pe frunte</a> și <a href="/nou/recomandari-dupa-botox/">recomandările după botox</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Ridurile de încruntare spun povestea grijilor și a momentelor trăite intens, dar nu trebuie să îți definească chipul. Cu un tratament potrivit și o rutină corectă de îngrijire, pielea poate arăta mai odihnită.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă riduri dinamice sau statice, cu da/nu
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
    lede: 'Ce sunt ridurile glabelare, cum îți dai seama dacă sunt dinamice sau statice și ce tratamente, ingrediente și obiceiuri ajută. Cu o verificare rapidă a tipului de riduri.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
