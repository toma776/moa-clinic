// Versiunea structurată a articolului „Riduri laba gâștei? Secretele experților anti-aging”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care își vede liniile din colțul ochilor când zâmbește:
// răspunsul scurt → ce sunt și de ce apar → ce le grăbește (verificare rapidă) → cum le previi → tratamente → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const botox = serv['injectare-botox']?.preturi || [];
  const pB = (re) => botox.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const p1 = pB(/1 zon/i);
  const pAH = pret('injectari-acid-hialuronic');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt și de ce apar'],
    ['factori', 'Ce le grăbește? Verificare rapidă'],
    ['preventie', 'Cum le previi și le încetinești'],
    ['tratamente', 'Tratamente în clinică'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['De ce apar ridurile laba gâștei și la persoane tinere?', 'Pielea din jurul ochilor este mult mai subțire decât în alte zone ale feței. Zâmbetul, strânsul ochilor în soare, somnul puțin și lipsa protecției solare se văd aici mai repede, chiar și la vârste tinere.'],
    ['Pot preveni ridurile laba gâștei?', 'Nu le poți opri complet, dar le poți încetini: protecție solară zilnică, ochelari de soare, o cremă pentru conturul ochilor, demachiere blândă, somn suficient și renunțarea la fumat.'],
    ['Ce tratament se folosește pentru laba gâștei?', 'Pentru liniile care apar la zâmbet, medicul poate recomanda toxina botulinică, care relaxează mușchii din jurul ochilor. Pentru liniile fine și hidratare se poate folosi acidul hialuronic. Alegerea se face la consult.'],
    ['Fața va rămâne expresivă după tratament?', 'Scopul este un rezultat natural, care păstrează expresivitatea feței. Medicul stabilește doza și zonele tratate în funcție de mimica ta.'],
    ['Cât costă tratamentul la MOA?', `Depinde de zonele tratate și de recomandarea medicului.${p1 ? ` Corecția ridurilor de expresie pe o zonă (de exemplu zona ochilor) pornește de la ${lei(p1)}.` : ''} Prețurile complete sunt pe pagina de prețuri.`],
  ];

  const intrebariCheck = [
    ['Dormi de obicei mai puțin decât ai nevoie?', 'Pielea se reface în timpul nopții; zona ochilor arată prima oboseala.'],
    ['Ieși des la soare fără cremă cu SPF sau fără ochelari de soare?', 'Razele UV degradează colagenul și elastina, iar strânsul ochilor în lumină adâncește liniile.'],
    ['Fumezi?', 'Fumatul reduce oxigenarea pielii și grăbește îmbătrânirea ei.'],
    ['Îți freci des ochii sau te demachiezi energic?', 'Micile traumatisme zilnice slăbesc elasticitatea pielii fine din jurul ochilor.'],
    ['Bei puțină apă sau nu folosești o cremă pentru conturul ochilor?', 'Pielea deshidratată devine uscată și fragilă, iar liniile fine se văd mai ușor.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ridurile laba gâștei sunt liniile fine din <b>colțul ochilor</b>, vizibile mai ales când zâmbești. Sunt printre primele semne ale pierderii elasticității pielii.</li>
    <li>Apar din cauza <b>scăderii colagenului și elastinei</b>, a mișcărilor repetate ale mușchilor din jurul ochilor, a soarelui, deshidratării și oboselii.</li>
    <li>Pielea de aici este <b>mult mai subțire</b> decât în restul feței, așa că obiceiurile zilnice se văd repede.</li>
    <li>Le poți <b>încetini</b> cu SPF, ochelari de soare, hidratare, demachiere blândă și somn suficient.</li>
    <li>În clinică, medicul poate recomanda <b>toxina botulinică</b> sau <b>acidul hialuronic</b>, după un consult${p1 ? `; corecția pe o zonă pornește de la ${lei(p1)}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt ridurile laba gâștei și de ce apar</h2>
<p class="ar-first">Le recunoști ușor: liniile fine care se formează în colțurile ochilor când zâmbești sau râzi. La început par simpatice, semne ale emoțiilor tale. Cu timpul însă devin tot mai vizibile și ajung să se vadă și când fața este relaxată.</p>
<p>Apar chiar și la persoane tinere, mai ales dacă pielea este subțire sau des expusă la soare. Nu poți opri timpul, dar poți încetini efectele lui, iar cu cât înțelegi mai devreme de unde vin aceste linii, cu atât alegi mai ușor ce să faci.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Colagen și elastină mai puține</b><p>Odată cu vârsta, pielea își pierde din fermitate și revine mai greu la forma netedă după fiecare zâmbet.</p></div>
  <div class="rx-card"><i>02</i><b>Mișcări repetate</b><p>Zâmbetul, strânsul ochilor în soare sau plânsul frecvent pliază aceeași zonă de nenumărate ori, iar liniile se fixează în timp.</p></div>
  <div class="rx-card"><i>03</i><b>Pielea foarte subțire</b><p>Zona din jurul ochilor este mult mai fină decât restul feței, așa că deshidratarea, soarele și oboseala se văd aici primele.</p></div>
</div>

<h2 id="factori">Ce le grăbește? Verificare rapidă</h2>
<p>Ridurile din jurul ochilor nu sunt doar o consecință a vârstei, ci și a obiceiurilor de zi cu zi. Vezi care dintre ele te privesc.</p>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar ce obiceiuri pot grăbi apariția ridurilor la tine.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Unele obiceiuri pot grăbi ridurile din jurul ochilor.</b><p>Vestea bună este că le poți schimba: începe cu recomandările de mai jos. Dacă liniile sunt deja vizibile, la consult medicul îți spune ce tratament ar avea sens.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Ai deja obiceiuri care protejează zona ochilor.</b><p>Continuă așa. Dacă liniile de la zâmbet se văd totuși și te deranjează, medicul poate discuta cu tine un tratament cu toxină botulinică sau acid hialuronic.</p><a class="btn btn-gold" href="#programare" data-srv="Toxină botulinică (Botox)">Programează-te pentru tratament</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="preventie">Cum previi și încetinești ridurile laba gâștei</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Protecție de soare, zilnic</b><p>Cremă cu SPF în fiecare zi, și iarna sau când e înnorat, plus ochelari de soare, ca să nu strângi ochii în lumină.</p></div>
  <div class="rx-card"><i>02</i><b>Hidratare, din interior și din exterior</b><p>Apă suficientă și o cremă pentru conturul ochilor, cu textură ușoară, aplicată zilnic, ajută pielea să rămână elastică.</p></div>
  <div class="rx-card"><i>03</i><b>Gesturi blânde</b><p>Demachiază-te cu produse delicate, fără să freci ochii. Micile traumatisme zilnice lasă urme în timp.</p></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Obiceiuri de evitat</span>
  <ul class="rx-chips rx-chips-neg"><li>fumatul</li><li>alcoolul în exces</li><li>somnul insuficient</li><li>machiajul agresiv</li><li>frecatul ochilor</li></ul>
</div>

<h2 id="tratamente">Tratamente în clinică pentru ridurile laba gâștei</h2>
<p>Când liniile sunt deja vizibile și te deranjează, nu trebuie să aștepți să devină adânci. Medicul îți poate recomanda un tratament minim invaziv, potrivit tenului și obiectivului tău.</p>
<div class="rx-compare">
  <div class="rx-col rx-col-on"><small>Toxină botulinică</small><b>Pentru liniile de la zâmbet</b><dl><dt>Cum acționează</dt><dd>relaxează mușchii care formează ridurile din colțul ochilor</dd><dt>Potrivit pentru</dt><dd>ridurile de expresie</dd><dt>Ce păstrează</dt><dd>un aspect natural, stabilit la consult</dd></dl>${id('injectare-botox') ? `<a class="link-u" href="${esc(live('injectare-botox'))}">Despre toxina botulinică →</a>` : ''}</div>
  <div class="rx-col"><small>Acid hialuronic</small><b>Pentru hidratare și linii fine</b><dl><dt>Cum acționează</dt><dd>hidratează în profunzime și umple ridurile fine</dd><dt>Potrivit pentru</dt><dd>piele deshidratată, linii fine</dd><dt>Ce păstrează</dt><dd>expresivitatea feței</dd></dl>${id('injectari-acid-hialuronic') ? `<a class="link-u" href="${esc(live('injectari-acid-hialuronic'))}">Despre acidul hialuronic →</a>` : ''}</div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Îngrijirea zilnică poate încetini apariția ridurilor, dar nu le oprește. Tratamentele din clinică pot face liniile mai puțin vizibile, iar cât de mult și pentru cât timp diferă de la o persoană la alta. De aceea, totul începe cu o evaluare.</p></aside>

<h2 id="la-moa">Tratamentul ridurilor laba gâștei la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul analizează zona ochilor, tenul și mimica, ascultă ce îți dorești și îți recomandă tratamentul potrivit.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Tratamentul</b><p>Toxina botulinică sau acidul hialuronic se injectează în zonele stabilite la consult, cu accent pe un rezultat natural.</p>${p1 ? `<em>Corecție riduri de expresie, 1 zonă · ${lei(p1)}</em>` : ''}${pAH ? `<em>Acid hialuronic · de la ${lei(pAH)}</em>` : ''}</li>
  <li><b>După tratament</b><p>Primești recomandări clare pentru primele ore și zile, pe care le continui cu îngrijirea zilnică a zonei ochilor.</p></li>
  <li><b>Reevaluarea</b><p>Medicul urmărește rezultatul și discută cu tine dacă și când are sens o nouă ședință.</p></li>
</ol>
<p class="rx-links">Citește și despre <a href="/nou/riduri-frunte/">ridurile de pe frunte</a>, <a href="/nou/ridurile-fumatorului/">ridurile fumătorului</a> și <a href="/nou/recomandari-dupa-botox/">recomandările după toxina botulinică</a>, sau vezi ${link('injectare-botox', 'pagina tratamentului cu toxină botulinică')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Nu trebuie să aștepți ca ridurile laba gâștei să devină adânci. Cu puțină grijă zilnică și cu un sfat medical la momentul potrivit, poți păstra o privire odihnită mai mult timp.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu a obiceiurilor care grăbesc ridurile
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
    lede: 'Ce sunt ridurile laba gâștei, ce obiceiuri le grăbesc, cum le încetinești și ce tratamente pot ajuta. Cu o verificare rapidă și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 5,
  };
};
