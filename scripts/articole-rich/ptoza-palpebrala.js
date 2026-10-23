// Versiunea structurată a articolului „Ptoza palpebrală: cauze, tratament și operație pleoape căzute”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care are o pleoapă căzută:
// răspunsul scurt → ce este → când e nevoie de medic (verificare rapidă) → cauze → diagnostic → tratament fără operație
// → remedii → operația → recuperare → copii și adulți → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const pP = (sid, re) => (serv[sid]?.preturi || []).find((p) => re.test(p.nume))?.valoare;
  const consultNume = 'Consultație chirurgie plastică';
  const consultPret = pret('consultatie-chirurgie-plastica');
  const pBlefSup = pP('blefaroplastie', /superioar/i);

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este ptoza palpebrală'],
    ['semne', 'Când mergi la medic'],
    ['cauze', 'De ce cade pleoapa'],
    ['diagnostic', 'Cum se pune diagnosticul'],
    ['fara-operatie', 'Tratament fără operație'],
    ['operatia', 'Operația: când și cum'],
    ['la-moa', 'Corecția la MOA'],
    ['copii-adulti', 'La copii și la adulți'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ptoza palpebrală trece de la sine?', 'De obicei, nu. O ptoză neevaluată și netratată tinde să se agraveze lent. De aceea merită un consult, chiar dacă la început pare doar un detaliu estetic.'],
    ['Care e diferența dintre „pleoape căzute” și ptoza palpebrală?', '„Pleoapele căzute” descrie ce vezi în oglindă. „Ptoza palpebrală” este diagnosticul medical, cu grade de severitate și tratamente stabilite după cauză.'],
    ['Pot corecta ptoza cu creme sau exerciții?', 'Cremele pot hidrata și îmbunătăți textura pielii, dar nu ridică o pleoapă căzută din cauza unui mușchi slăbit sau a excesului de piele. Exercițiile pot ajuta în formele ușoare. Dacă ptoza afectează vederea sau se agravează, e nevoie de evaluare medicală.'],
    ['Botoxul poate fi o soluție?', 'În anumite forme de ptoză, în special când există un dezechilibru muscular, injecțiile cu toxină botulinică pot fi o opțiune. Efectul este temporar și se repetă. Medicul stabilește dacă ți se potrivește.'],
    ['Cât durează recuperarea după operație?', 'Umflătura și vânătăile sunt mai intense în prima săptămână, apoi scad treptat. În primele 1–2 săptămâni se recomandă să eviți ecranele, cititul și activitățile care solicită ochii.'],
    ['Rezultatul operației ține toată viața?', 'Rezultatele sunt, în general, de durată, dar nu eterne: procesul natural de îmbătrânire continuă.'],
  ];

  const intrebariCheck = [
    ['Pleoapa s-a lăsat brusc, fără o cauză evidentă?', 'O ptoză apărută brusc are nevoie de evaluare medicală imediată, ca să fie excluse cauzele serioase.'],
    ['Ai durere în ochi, vedere dublă sau încețoșată ori pupile de mărimi diferite?', 'Aceste semne, alături de pleoapa căzută, cer un consult fără amânare.'],
    ['Ai amorțeală la nivelul feței sau dificultăți de vorbire?', 'Sunt simptome neurologice: mergi imediat la medic, nu aștepta o programare obișnuită.'],
    ['Este vorba despre un copil?', 'La copii, pleoapa căzută poate afecta dezvoltarea vederii. Consultul oftalmologic trebuie făcut cât mai devreme.'],
    ['Pleoapa îți acoperă o parte din câmpul vizual?', 'Când ptoza afectează vederea, evaluarea stabilește dacă operația este indicată.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Ptoza palpebrală înseamnă <b>lăsarea uneia sau a ambelor pleoape superioare</b>, de obicei prin slăbirea mușchiului levator, care ridică pleoapa.</li>
    <li>Poate fi <b>congenitală</b> (de la naștere), legată de <b>vârstă</b>, de <b>afecțiuni neurologice</b>, de <b>traumatisme</b> sau de operații anterioare.</li>
    <li>O pleoapă care <b>cade brusc</b> sau apare cu durere, vedere dublă ori simptome neurologice cere <b>evaluare medicală imediată</b>.</li>
    <li>În formele ușoare și stabile se poate începe cu tratament conservator; când pleoapa afectează vederea, se discută <b>operația</b>.</li>
    <li>La MOA, primul pas este un <b>consult de chirurgie plastică</b>${consultPret ? `, de la ${lei(consultPret)}` : ''}, completat la nevoie de avizul oftalmologului.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este ptoza palpebrală</h2>
<p class="ar-first">Sunt dimineți în care pleoapele par mai grele, parcă trase în jos. De multe ori e doar oboseala. Uneori însă e vorba de o afecțiune care are un nume medical: ptoza palpebrală. Pleoapa protejează ochiul, reglează lumina care intră și dă expresivitate privirii, așa că, atunci când nu mai funcționează cum trebuie, efectele se simt și fizic, și estetic.</p>
<p>Ptoza se manifestă prin lăsarea uneia sau a ambelor pleoape superioare, cauzată de afectarea <b>mușchiului levator</b>, responsabil cu ridicarea pleoapei. Afecțiunea este mai frecventă decât s-ar crede: aproximativ 2% din populație se confruntă cu ea.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Forme ușoare</small><b>Pleoapa coboară discret</b><dl><dt>Ce afectează</dt><dd>mai degrabă aspectul decât vederea</dd><dt>Ce simți</dt><dd>privire obosită, uneori asimetrie</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Forme severe</small><b>Pleoapa acoperă pupila</b><dl><dt>Ce afectează</dt><dd>câmpul vizual, parțial sau complet</dd><dt>Ce simți</dt><dd>oboseală oculară, tensiune, uneori dureri de cap</dd></dl></div>
</div>
<p>Ptoza poate să nu doară deloc și totuși să afecteze viața de zi cu zi. Efortul constant de a ține ochii deschiși obosește. Corpul compensează: unii înclină capul pe spate ca să vadă mai bine, alții ridică mereu sprâncenele, solicitând mușchii frunții. Când pleoapa coboară peste marginea irisului, imaginea devine incompletă și, în timp, poate apărea vederea dublă sau în ceață.</p>

<h2 id="semne">Când trebuie să mergi la medic? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar cât de repede e bine să ajungi la medic.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Nu amâna evaluarea.</b><p>Ai răspuns „da” la cel puțin o întrebare. Dacă pleoapa a căzut brusc sau ai simptome neurologice (amorțeală, dificultăți de vorbire), mergi imediat la medic. La un copil, programează cât mai devreme un consult oftalmologic. Dacă ptoza îți afectează vederea, consultul de chirurgie plastică, împreună cu cel oftalmologic, stabilește ce opțiuni ai.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul de chirurgie plastică</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai semne de alarmă dintre cele frecvente.</b><p>Dacă pleoapa căzută te deranjează estetic sau funcțional, un consult te ajută să afli ce o cauzează și ce opțiuni ai, de la tratament conservator la operație.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează un consult${consultPret ? ` · de la ${lei(consultPret)}` : ''}</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>
<div class="rx-alert"><b>Mergi imediat la medic dacă</b> o pleoapă se lasă brusc, fără o cauză evidentă, sau dacă apare împreună cu durere oculară, vedere dublă, pupile de mărimi diferite, amorțeală facială ori dificultăți de vorbire. Aceste semne nu înseamnă neapărat ceva grav, dar trebuie excluse cauzele serioase.</div>

<h2 id="cauze">De ce cade pleoapa</h2>
<p>Înțelegerea cauzei este primul pas spre tratamentul potrivit.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Congenitală</b><p>Unii copii se nasc cu o pleoapă căzută, de obicei din cauza dezvoltării incomplete a mușchiului levator. Riscul principal este ambliopia („ochiul leneș”), de aceea diagnosticul timpuriu contează.</p></div>
  <div class="rx-card"><i>02</i><b>Legată de vârstă</b><p>Cea mai frecventă cauză. Mușchii pleoapelor slăbesc, pielea își pierde elasticitatea, iar țesuturile care susțin pleoapa cedează treptat. Este ptoza dobândită.</p></div>
  <div class="rx-card"><i>03</i><b>Neurologică sau traumatică</b><p>Uneori pleoapa căzută este un simptom: poate apărea în accidentul vascular cerebral, tumori, sindromul Horner sau miastenia gravis. O lovitură sau o operație anterioară în zona ochilor pot afecta și ele mușchiul levator.</p></div>
</div>

<h2 id="diagnostic">Cum se pune diagnosticul</h2>
<p>Diagnosticul nu se pune după o fotografie, ci printr-un examen clinic atent, făcut de un medic care știe ce să caute.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Examenul clinic</b><p>Medicul te întreabă când ai observat primele schimbări și cum au evoluat. Apoi evaluează poziția și simetria pleoapelor, mișcarea mușchiului, poziția pupilelor și reflexele oculare.</p></div>
  <div class="rx-card"><i>02</i><b>Vederea</b><p>Oftalmologul verifică dacă ptoza a afectat câmpul vizual sau acuitatea vizuală. Testele pot include și funcția mușchilor oculari sau teste care diferențiază tipurile de ptoză.</p></div>
  <div class="rx-card"><i>03</i><b>Investigații, la nevoie</b><p>Când ptoza apare brusc, vine cu alte simptome sau examinarea ridică semne de întrebare, medicul poate recomanda CT sau RMN, ca tratamentul să se adreseze cauzei reale.</p></div>
</div>

<h2 id="fara-operatie">Tratament pentru pleoape căzute fără operație</h2>
<p>Tratamentul pornește întotdeauna de la cauză. Dacă ptoza vine dintr-o altă afecțiune, tratarea acesteia poate ameliora și poziția pleoapei.</p>
<div class="rx-two">
  <div><h3>Opțiuni medicale</h3><ul><li><b>Medicamente</b> pentru boala de bază, când ptoza este cauzată de o afecțiune; pot îmbunătăți tonusul mușchiului.</li><li><b>Toxina botulinică</b>, în anumite forme cu dezechilibru muscular. Efectul este temporar și se repetă; poate fi o variantă pentru cine nu vrea sau nu poate fi operat.</li><li><b>Exerciții</b> de ridicare și coborâre controlată, strângere și relaxare, rotații ale ochilor, utile în formele ușoare.</li></ul></div>
  <div><h3>Remedii de acasă: ce pot și ce nu</h3><ul><li>pliculețe reci de mușețel sau ceai, 10–15 minute pe ochii închiși, pot reduce temporar umflătura</li><li>feliile reci de castravete hidratează și reduc umflăturile</li><li>cremele pot hidrata și îmbunătăți textura</li></ul><p>Niciunul nu ridică o pleoapă căzută din cauza unui mușchi slăbit sau a excesului de piele. Pot face zona să pară mai odihnită, nu tratează cauza.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Tratamentul conservator este suficient atunci când ptoza este ușoară, stabilă și nu afectează vederea sau nu produce disconfort important. Poate fi și o etapă temporară, până la momentul potrivit pentru operație sau până se stabilizează o afecțiune de fond. Dacă ptoza afectează vederea, provoacă disconfort sau se agravează, remediile doar amână momentul în care ceri ajutor.</p></aside>

<h2 id="operatia">Operația pentru pleoape căzute: când și cum</h2>
<p>Operația este recomandată când:</p>
<ul class="rx-chips"><li>pleoapa blochează câmpul vizual</li><li>apar oboseală oculară sau dureri de cap</li><li>asimetria este marcată și te afectează</li><li>tratamentul conservator nu a ajutat suficient</li></ul>
<p>Corecția urmărește readucerea pleoapei în poziția corectă, prin <b>repararea mușchiului levator</b>. Chirurgul face o incizie discretă în pliul natural al pleoapei superioare, unde cicatricea devine puțin vizibilă după vindecare, consolidează sau repoziționează mușchiul și, dacă e cazul, îndepărtează excesul de piele sau grăsime. Tehnica se alege după cauză, gradul de afectare și cât mai funcționează mușchiul levator; nu este o decizie standard.</p>
<div class="rx-two">
  <div><h3>Riscuri posibile</h3><ul><li>asimetrie reziduală</li><li>infecție</li><li>sângerare</li><li>dificultate temporară de a închide complet ochiul</li><li>rar, modificări ale vederii</li></ul></div>
  <div><h3>Ce poate aduce</h3><ul><li>câmp vizual eliberat</li><li>mai puțină oboseală oculară</li><li>o simetrie mai bună a feței</li></ul><p>Decizia nu se ia în grabă: discuți cu medicul despre așteptări, riscuri, starea de sănătate și medicamentele pe care le iei.</p></div>
</div>

<h2 id="la-moa">Corecția pleoapei căzute la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul de chirurgie plastică</b><p>Medicul îți ascultă istoricul, examinează pleoapele și stabilește dacă operația este potrivită sau dacă se începe cu alt tratament.</p>${consultPret ? `<em>Consultație chirurgie plastică · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Avizul oftalmologic și pregătirea</b><p>Evaluarea vederii completează indicația de operație. Pregătirea începe cu câteva săptămâni înainte, după recomandările personalizate ale medicului.</p></li>
  <li><b>Intervenția</b><p>Incizia se face în pliul natural al pleoapei, mușchiul levator este corectat, apoi se suturează. Pielea pleoapei este foarte fină, așa că precizia și experiența chirurgului contează.</p>${pBlefSup ? `<em>Blefaroplastie superioară · ${lei(pBlefSup)}; costul corecției ptozei se stabilește la consult</em>` : ''}</li>
  <li><b>Recuperarea</b><p>Umflătura și vânătăile sunt mai intense în prima săptămână, apoi scad treptat. Dormi cu capul ușor ridicat, aplici comprese în primele zile, cureți zona cu unguentul prescris, porți ochelari de soare și eviți ecranele și cititul 1–2 săptămâni. Rezultatele sunt, în general, de durată, dar nu eterne: îmbătrânirea naturală continuă.</p></li>
</ol>

<h2 id="copii-adulti">Ptoza la copii și la adulți</h2>
<div class="rx-two">
  <div><h3>La copii</h3><p>Ptoza nu este niciodată doar o problemă estetică. Primii ani de viață sunt perioada în care se dezvoltă vederea, iar o pleoapă care acoperă pupila o poate afecta dacă nu e tratată la timp. Pot apărea ambliopie, strabism sau poziții compensatorii ale capului. Copiii nu pot spune mereu ce simt, așa că depistarea timpurie revine părinților și medicilor.</p></div>
  <div><h3>La adulți</h3><p>Decizia depinde de cauză, de gradul de afectare, de simptome și de ce îți dorești. Unii trăiesc ani de zile cu o ptoză ușoară; alții ajung la medic când pleoapa le limitează câmpul vizual. Netratată, ptoza tinde să se agraveze lent și poate îngreuna condusul, cititul sau coborâtul scărilor.</p></div>
</div>
<p>Dacă ai fost diagnosticat(ă) cu ptoză și urmezi un tratament conservator, controalele periodice arată dacă planul rămâne potrivit, pentru că schimbările lente trec adesea neobservate.</p>
<p class="rx-links">Citește mai mult despre ${link('blefaroplastie', 'blefaroplastia la MOA')}, despre ${link('consultatie-chirurgie-plastica', 'consultația de chirurgie plastică')} sau despre <a href="/nou/pungi-sub-ochi/">pungile sub ochi</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Pleoapa căzută nu este doar un detaliu: poate fi un semnal al corpului, o sursă de disconfort sau o piedică pentru vedere. Contează să alegi tratamentul potrivit situației tale, iar asta se poate stabili doar printr-un consult în care medicul îți examinează ochii.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu a semnelor care cer un consult
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
    lede: 'Ce este ptoza palpebrală, de ce cade pleoapa și ce semne cer un consult fără amânare. Vezi cum se pune diagnosticul, ce se poate face fără operație și cum decurg operația și recuperarea.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 10,
  };
};
