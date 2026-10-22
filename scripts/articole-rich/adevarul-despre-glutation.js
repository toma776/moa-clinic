// Versiunea structurată a articolului „Adevărul despre glutation: ce nu ți-a spus nimeni până acum”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vrea o părere echilibrată despre glutation:
// răspunsul scurt → ce este → de ce contează → ce spun cercetările (cu limitele lor) → cum îl susții natural → ce formă alegi
// → riscuri → dacă i se potrivește (verificare rapidă) → la MOA → întrebări.
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
    ['ce-este', 'Ce este glutationul'],
    ['de-ce-conteaza', 'De ce contează'],
    ['cercetari', 'Ce spun cercetările'],
    ['natural', 'Cum îl susții natural'],
    ['forme', 'Oral, lipozomal sau perfuzie?'],
    ['riscuri', 'Riscuri și contraindicații'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['la-moa', 'Perfuzia cu glutation la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Glutationul este un „elixir” anti-îmbătrânire?', 'Nu. Glutationul are un rol real în protecția celulelor, dar efectul nu este imediat și diferă de la o persoană la alta. Susținerea nivelului lui poate ajuta, alături de somn, mișcare și alimentație echilibrată, iar așteptările trebuie să fie realiste.'],
    ['Glutationul oral se absoarbe?', 'În forma obișnuită, de tablete sau capsule, o mare parte se degradează în stomac și intestine înainte să ajungă în sânge. Forma lipozomală este protejată de un înveliș lipidic, iar perfuzia ajunge direct în sânge.'],
    ['Pot lua glutation dacă fac chimioterapie?', 'Doar după discuția cu medicul oncolog. Glutationul poate reduce eficiența chimioterapiei, de aceea orice suplimentare se discută întâi cu medicul.'],
    ['Este sigur în sarcină?', 'Nu există informații sigure despre glutation în sarcină și alăptare, așa că, de regulă, se evită în aceste perioade.'],
    ['Ce efecte adverse poate avea?', 'Suplimentele pot da balonare, crampe, gaze sau diaree, de obicei trecătoare. Rar, au fost raportate reacții alergice: erupții, mâncărimi sau dificultăți de respirație, mai ales la persoanele predispuse la astm.'],
    ['Pot crește glutationul fără suplimente?', 'Da, poți susține producția lui: legume precum avocado, sparanghel, broccoli și spanac, alimente cu seleniu, vitamine B și zinc, mișcare moderată și 7–8 ore de somn.'],
  ];

  const intrebariCheck = [
    ['Ești însărcinată sau alăptezi?', 'Nu există informații sigure despre glutation în sarcină și alăptare.'],
    ['Urmezi un tratament oncologic, de exemplu chimioterapie?', 'Glutationul poate reduce eficiența chimioterapiei. Decizia se ia doar cu medicul oncolog.'],
    ['Iei anticoagulante?', 'Orice suplimentare se discută întâi cu medicul care ți-a prescris tratamentul.'],
    ['Ai astm sau ai avut reacții alergice la suplimente?', 'Reacțiile alergice, deși rare, apar mai ales la persoanele sensibile sau predispuse la astm.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Glutationul este un antioxidant <b>prezent în fiecare celulă</b>, format din trei aminoacizi. Producția lui naturală <b>scade odată cu vârsta</b>.</li>
    <li>Ajută la <b>neutralizarea radicalilor liberi</b>, la detoxifierea ficatului și la funcționarea sistemului imunitar.</li>
    <li>Cercetările au raportat efecte în unele afecțiuni, dar <b>nu este un „elixir”</b>: așteptările trebuie să fie realiste.</li>
    <li>Îl poți susține prin <b>alimentație, mișcare și somn</b>. Ca supliment, contează forma: oral, lipozomal sau perfuzie.</li>
    <li>Se discută cu medicul dacă ești <b>însărcinată, faci chimioterapie sau iei anticoagulante</b>.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este glutationul și cum funcționează</h2>
<p class="ar-first">Glutationul apare tot mai des în discuțiile despre longevitate, uneori cu promisiuni mari. Înainte să alegi un supliment sau o perfuzie, merită să știi ce face de fapt, ce arată cercetările și unde sunt limitele.</p>
<p>Glutationul este o moleculă mică, formată din trei aminoacizi: <b>glutamat, cisteină și glicină</b>. Se află în concentrații mari în citoplasmă și în mitocondrii și funcționează ca un scut intern al celulelor: repară proteine, susține detoxifierea și ajută celulele să funcționeze corect, chiar în condiții de stres.</p>
<p>Corpul produce în mod natural radicali liberi, din metabolism și din expunerea la mediu. Dacă se acumulează, pot deteriora celulele, ADN-ul și lipidele. Glutationul îi neutralizează, împreună cu enzime speciale.</p>

<h2 id="de-ce-conteaza">De ce este considerat un antioxidant esențial</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Este peste tot</b><p>Se găsește în fiecare celulă, inclusiv în mitocondrii și în creier, în concentrații importante pentru protecția celulară.</p></div>
  <div class="rx-card"><i>02</i><b>Susține detoxifierea</b><p>Combate stresul oxidativ și ajută ficatul să proceseze toxine, medicamente sau poluanți.</p></div>
  <div class="rx-card"><i>03</i><b>Ajută imunitatea</b><p>Contribuie la funcționarea celulelor T și a macrofagelor și participă la repararea ADN-ului.</p></div>
</div>
<p>Pe măsură ce înaintezi în vârstă, producția naturală scade. Studiile au arătat o legătură între nivelurile reduse de glutation și bolile cronice sau slăbirea funcției celulare.</p>

<h2 id="cercetari">Ce spun cercetările</h2>
<p>Pe lângă rolul general de antioxidant, cercetările au urmărit glutationul și în câteva afecțiuni anume:</p>
<div class="rx-two">
  <div><h3>Metabolism și ficat</h3><ul><li><b>Rezistența la insulină:</b> cercetările sugerează că glutationul poate îmbunătăți sensibilitatea la insulină.</li><li><b>Ficatul:</b> nivelurile adecvate ajută la refacerea celulelor hepatice și pot reduce inflamația din bolile hepatice cronice.</li><li><b>Psoriazisul:</b> studii clinice arată că poate încetini creșterea excesivă a celulelor pielii și reduce inflamația.</li></ul></div>
  <div><h3>Circulație și sistem nervos</h3><ul><li><b>Boala arterială periferică:</b> într-un studiu clinic, pacienții au mers fără durere pe distanțe mai lungi după câteva perfuzii.</li><li><b>Boala Parkinson:</b> la unii pacienți s-a raportat diminuarea tremorului și a rigidității după glutation intravenos, sub supraveghere medicală.</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rolul glutationului în organism este bine documentat. Rezultatele din afecțiunile de mai sus provin însă din studii pe pacienți cu acele boli, sub supraveghere medicală, și nu se pot generaliza. Glutationul nu înlocuiește tratamentul acestor afecțiuni. Cât de mult schimbă energia sau aspectul pielii diferă de la o persoană la alta.</p></aside>

<h2 id="natural">Cum îți susții natural nivelul de glutation</h2>
<div class="rx-why">
  <span class="rx-why-h">Alimente care conțin glutation sau îi susțin producția</span>
  <ul class="rx-chips"><li>avocado</li><li>sparanghel</li><li>broccoli</li><li>spanac</li><li>nuci braziliene</li><li>pește</li><li>carne</li><li>ouă</li></ul>
</div>
<div class="rx-two">
  <div><h3>Nutrienți și stil de viață</h3><ul><li><b>Seleniul</b> ajută enzimele care regenerează glutationul</li><li><b>vitaminele B și zincul</b> participă la formarea aminoacizilor necesari</li><li><b>mișcarea moderată</b> (mers alert, alergare ușoară, yoga) poate crește nivelul natural</li><li><b>7–8 ore de somn</b> susțin regenerarea celulară</li></ul></div>
  <div><h3>De reținut</h3><p>Glutationul din alimente nu se absoarbe complet, dar consumul frecvent al acestor legume a fost asociat cu un stres oxidativ mai scăzut. Respectă dozele la suplimente: seleniul poate fi toxic peste 400 µg pe zi.</p></div>
</div>

<h2 id="forme">Oral, lipozomal sau perfuzie?</h2>
<p>Diferența principală dintre forme este cât glutation ajunge efectiv în sânge și în celule.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Tablete sau capsule</small><b>Ușor de luat</b><dl><dt>Absorbție</dt><dd>o mare parte se degradează în digestie</dd><dt>De reținut</dt><dd>N-acetilcisteina (NAC) este un precursor din care corpul își produce glutation</dd></dl></div>
  <div class="rx-col"><small>Lipozomal</small><b>Protejat de un înveliș lipidic</b><dl><dt>Absorbție</dt><dd>îmbunătățită față de forma orală obișnuită</dd><dt>De reținut</dt><dd>alege produse din surse verificate</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Perfuzie</small><b>Direct în sânge</b><dl><dt>Absorbție</dt><dd>fără pierderi în digestie, efect rapid</dd><dt>De reținut</dt><dd>efectul în sânge e de scurtă durată; se face sub supraveghere medicală</dd></dl>${id('glutation') ? `<a class="link-u" href="${esc(live('glutation'))}">Despre perfuziile cu glutation →</a>` : ''}</div>
</div>

<h2 id="riscuri">Riscuri și contraindicații</h2>
<div class="rx-two">
  <div><h3>Reacții posibile</h3><ul><li>balonare, crampe, gaze sau diaree, de obicei trecătoare</li><li>greață, la perfuzie</li><li>rar, reacții alergice: erupții, mâncărimi</li></ul></div>
  <div><h3>Se discută întâi cu medicul</h3><ul><li>sarcină sau alăptare</li><li>chimioterapie sau alt tratament oncologic</li><li>tratament cu anticoagulante</li><li>astm sau alergii cunoscute</li></ul></div>
</div>
<div class="rx-alert"><b>Oprește suplimentul și cere ajutor medical dacă apar</b> dificultăți de respirație, erupții extinse sau mâncărimi puternice.</div>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>4 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă că glutationul e exclus, ci că decizia se ia după un consult, în care medicul îți verifică istoricul și tratamentele.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile frecvente.</b><p>Dacă te gândești la o perfuzie, medicul stabilește doza și frecvența la o scurtă evaluare înainte de prima ședință.</p><a class="btn btn-gold" href="#programare" data-srv="Perfuzii cu glutation">Programează-te pentru perfuzie</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="la-moa">Perfuzia cu glutation la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul medical</b><p>Medicul îți verifică istoricul, tratamentele și motivele pentru care vrei glutation și stabilește dacă perfuzia are sens pentru tine.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Doza și frecvența</b><p>Se personalizează pentru tine, nu după o schemă fixă.</p></li>
  <li><b>Perfuzia</b><p>Se face în clinică, sub supraveghere medicală.</p>${pG(/therapy/i) ? `<em>Glutation Therapy · ${lei(pG(/therapy/i))}</em>` : ''}${pG(/detox/i) ? `<em>Glutation Detox Boost · ${lei(pG(/detox/i))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>După câteva ședințe, discuți cu medicul ce s-a schimbat și dacă merită continuat.</p></li>
</ol>
<p class="rx-links">Citește și <a href="/nou/glutation-beneficii-si-contraindicatii-ce-este/">ghidul despre beneficiile și contraindicațiile glutationului</a> sau despre <a href="/nou/terapii-intravenoase/">terapiile intravenoase</a>. Glutationul poate face parte și dintr-un plan mai larg, alături de ${link('terapia-nad', 'terapia NAD+')}, sau din <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Glutationul are un rol real în protecția celulelor, dar nu este un „elixir”. O abordare echilibrată, cu somn bun, mișcare și alimentație bogată în nutrienți, rămâne baza. Înainte de orice protocol nou, discută cu un medic.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu înainte de glutation
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
    lede: 'Ce face glutationul în organism, ce au arătat cercetările și unde sunt limitele lor, cum îl susții natural și ce formă de administrare are sens. Cu o verificare rapidă a situațiilor în care discuți întâi cu medicul.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
