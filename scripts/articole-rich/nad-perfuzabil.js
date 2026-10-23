// Versiunea structurată a articolului „NAD perfuzabil – informații și beneficii terapie”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la o perfuzie cu NAD:
// răspunsul scurt → ce este NAD / NADH → ce poate susține → în ce situații se folosește → are sens pentru tine (verificare rapidă) → cum decurge la MOA → întrebări.
// Formulări prudente, fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const nad = serv['terapia-nad']?.preturi || [];
  const pN = (re) => nad.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație antiaging (cu vârsta biologică)';
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este NAD perfuzabil'],
    ['nadh', 'Cum funcționează NADH'],
    ['beneficii', 'Ce poate susține'],
    ['afectiuni', 'În ce situații se folosește'],
    ['potrivit', 'Are sens pentru tine?'],
    ['la-moa', 'Terapia NAD+ la MOA, pas cu pas'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce este NAD?', 'NAD (nicotinamid adenin dinucleotid) este o moleculă pe care corpul o folosește continuu ca să producă energie, să repare celulele și să susțină funcțiile cognitive. Nivelul ei scade cu vârsta, cu stresul, cu alimentația dezechilibrată și în perioadele de suprasolicitare.'],
    ['De ce perfuzie și nu supliment?', 'Prin perfuzie, NAD ajunge direct în sânge, într-o formă pe care organismul o poate folosi imediat. Se evită procesul lung de transformare prin care trece NAD-ul din suplimentele obișnuite.'],
    ['Care e diferența dintre NAD și NADH?', 'NADH este forma activă a moleculei NAD, cea pe care corpul o folosește direct pentru a produce energie în celule.'],
    ['NAD perfuzabil întinerește?', 'Nu este o procedură de întinerire. Poate ajuta organismul să funcționeze mai aproape de perioada în care avea mai multe resurse, dar efectul diferă de la o persoană la alta.'],
    ['Înlocuiește tratamentul pentru o boală cronică?', 'Nu. NAD perfuzabil nu înlocuiește tratamentele clasice. Poate fi folosit doar ca terapie complementară, în cadrul unui plan stabilit de medici.'],
    ['Pot face perfuzia fără consult?', 'La MOA, terapia se recomandă doar după o evaluare medicală, ca să fie potrivită stării tale de sănătate și obiectivelor tale.'],
  ];

  const intrebariCheck = [
    ['Te simți obosit(ă) deși dormi și mănânci echilibrat?', 'NAD este implicat direct în transformarea nutrienților în energie. Medicul verifică la consult și alte cauze posibile ale oboselii.'],
    ['Ai dificultăți de concentrare sau senzația de „ceață mentală”?', 'Atenția și memoria depind de energia produsă în creier. Merită discutat cu medicul ce stă în spatele acestor senzații.'],
    ['Treci printr-o perioadă de stres sau te refaci după epuizare?', 'NAD perfuzabil este folosit și ca suport în perioadele de suprasolicitare și de recuperare după epuizare.'],
    ['Ai o afecțiune cronică pentru care urmezi deja un tratament?', 'NAD nu înlocuiește tratamentul. Medicul stabilește dacă și cum se poate asocia, ca terapie complementară.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>NAD este o moleculă pe care corpul o folosește pentru <b>energie, repararea celulelor și funcțiile cognitive</b>. Nivelul ei scade cu vârsta și cu stresul.</li>
    <li>Prin perfuzie, NAD ajunge <b>direct în sânge</b>, fără transformările prin care trece din suplimente.</li>
    <li>Poate susține <b>energia, claritatea mentală și recuperarea</b>, dar efectul diferă de la o persoană la alta.</li>
    <li>Nu este o soluție miraculoasă și <b>nu înlocuiește tratamentele clasice</b>. În unele afecțiuni este folosit doar ca terapie complementară.</li>
    <li>La MOA, terapia se face <b>după o evaluare medicală</b>${pret('terapia-nad') ? `, de la ${lei(pret('terapia-nad'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este NAD perfuzabil</h2>
<p class="ar-first">Te simți epuizat(ă), deși dormi, mănânci și îți vezi de treabă. Energia nu mai e ce era, indiferent câte suplimente ai încercat. Pentru mulți oameni, problema nu ține de voință, ci de felul în care celulele își produc energia. Aici intră în discuție NAD.</p>
<p>NAD (nicotinamid adenin dinucleotid) este o moleculă pe care corpul o folosește în fiecare secundă: pentru a produce energie, a repara celulele și a susține funcțiile cognitive. Nivelul ei scade odată cu vârsta, cu stresul, cu alimentația dezechilibrată și în perioadele în care organismul este suprasolicitat.</p>
<div class="rx-why">
  <span class="rx-why-h">De ce scade nivelul de NAD</span>
  <ul class="rx-chips rx-chips-neg"><li>vârsta</li><li>stresul</li><li>alimentația dezechilibrată</li><li>perioadele de suprasolicitare</li></ul>
</div>
<p>Terapia cu NAD perfuzabil înseamnă administrarea moleculei direct în sânge, într-o formă pe care organismul o poate folosi imediat. Practic, se sare peste procesul lung de transformare prin care trece NAD-ul din suplimentele obișnuite, iar absorbția este mai rapidă.</p>

<h2 id="nadh">Cum funcționează NADH în organism</h2>
<p>NADH este forma activă a moleculei NAD, versiunea pe care corpul o folosește direct pentru a produce energie. Fără suficient NADH, celulele funcționează mai lent, se regenerează mai greu și nu mai susțin același nivel de energie, claritate mentală sau rezistență fizică.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Energie din nutrienți</b><p>Ajută celulele să transforme nutrienții în energie și susține mitocondriile, „centralele energetice” ale celulei.</p></div>
  <div class="rx-card"><i>02</i><b>Repararea celulelor</b><p>Sprijină procesele prin care celulele se repară și se refac.</p></div>
  <div class="rx-card"><i>03</i><b>Protecție față de stresul oxidativ</b><p>Contribuie la reglarea stresului oxidativ, legat de îmbătrânirea celulelor.</p></div>
</div>

<h2 id="beneficii">Ce poate susține NAD perfuzabil</h2>
<p>Terapia a devenit cunoscută pentru că se adresează unor zone în care mulți simt lipsuri: energie, claritate mentală, stare generală și capacitatea corpului de a se reface.</p>
<div class="rx-two">
  <div><h3>Corp</h3><ul><li><b>energie:</b> mai multă energie peste zi, o senzație mai redusă de oboseală, efort fizic și mental mai ușor</li><li><b>regenerare:</b> celulele se pot repara mai eficient, cu mai puțină inflamație</li><li><b>detoxifiere:</b> susține procesele de detoxifiere ale ficatului și metabolismul intern</li></ul></div>
  <div><h3>Minte</h3><ul><li><b>claritate:</b> mai puțină „ceață mentală”, o concentrare mai bună</li><li><b>creier:</b> susține celulele nervoase, comunicarea dintre neuroni și reduce stresul oxidativ cerebral</li><li><b>recuperare:</b> suport în perioade de suprasolicitare mentală și după epuizare</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rolul NAD în producerea energiei și în repararea celulelor este bine cunoscut. Cât de mult schimbă o serie de perfuzii energia, concentrarea sau starea generală diferă însă de la o persoană la alta. NAD perfuzabil nu este o procedură de întinerire: poate ajuta organismul să funcționeze mai aproape de perioada în care avea mai multe resurse. De aceea, la MOA, terapia se decide după evaluare, iar efectul se urmărește la reevaluare.</p></aside>

<h2 id="afectiuni">În ce situații se folosește</h2>
<p>NAD perfuzabil este folosit în situații în care organismul are nevoie de susținere metabolică, de energie sau de sprijin pentru funcțiile cognitive. <b>Nu înlocuiește tratamentele clasice</b>, ci poate fi o completare a lor, recomandată doar după evaluare.</p>
<div class="rx-two">
  <div><h3>Ca suport general</h3><ul><li><b>oboseala cronică:</b> poate susține funcția mitocondrială și reduce senzația de epuizare</li><li><b>fibromialgia:</b> poate ajuta la reglarea energiei celulare, cu simptome mai puțin intense și o toleranță mai bună la efort</li><li><b>depresia și anxietatea:</b> ca terapie complementară, alături de tratamentul de specialitate</li></ul></div>
  <div><h3>Doar complementar, în planul medicului curant</h3><ul><li><b>boala Parkinson:</b> poate sprijini funcția mitocondrială și reduce stresul oxidativ; nu este un tratament curativ</li><li><b>boala Alzheimer:</b> poate contribui la protecția neuronilor și la susținerea proceselor cognitive</li><li><b>autismul:</b> în unele forme, doar în cadrul unui plan terapeutic complex recomandat de specialiști</li></ul></div>
</div>
<div class="rx-alert"><b>Nu întrerupe și nu modifica</b> tratamentul recomandat de medicul tău curant. Dacă ai o afecțiune cronică, spune-i medicului de la consult ce tratament urmezi, ca să decidă dacă NAD se poate asocia.</div>

<h2 id="potrivit">Are sens pentru tine? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>4 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă merită să discuți despre NAD cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Merită discutat la un consult.</b><p>Ai răspuns „da” la cel puțin o întrebare. Medicul îți evaluează starea de sănătate, analizele și tratamentele, caută și alte cauze posibile și stabilește dacă terapia cu NAD ți se potrivește.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>NAD poate nu e prioritatea ta acum.</b><p>Dacă vrei totuși să afli cum stai și ce te-ar putea ajuta pe termen lung, consultul antiaging include determinarea vârstei biologice și te ajută să alegi pașii potriviți.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul antiaging</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="la-moa">Terapia NAD+ la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul medical</b><p>Medicul îți ascultă motivele, verifică istoricul, tratamentele și, dacă e nevoie, analizele. Stabilește dacă terapia ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul</b><p>Terapia este adaptată stării tale și integrată, dacă e cazul, într-un plan de sănătate mai larg.</p></li>
  <li><b>Perfuzia</b><p>Se face în clinică, sub supraveghere medicală.</p>${pN(/boost/i) ? `<em>MOA Longevity Boost (conține NAD+) · ${lei(pN(/boost/i))}</em>` : pret('terapia-nad') ? `<em>Terapia NAD+ · de la ${lei(pret('terapia-nad'))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul discută cu tine ce s-a schimbat și dacă merită continuat.</p></li>
</ol>
<p class="rx-links">NAD poate face parte dintr-un plan mai larg: ${link('glutation', 'perfuziile cu glutation')}, <a href="/nou/terapii-intravenoase/">alte terapii intravenoase</a> sau <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}. Despre forma activă, citește și <a href="/nou/nadh-cheia-catre-rezolvarea-problemei-de-infertilitate/">articolul despre NADH</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Terapia cu NAD perfuzabil nu este o soluție miraculoasă, dar poate fi un sprijin când corpul are nevoie de mai multă energie, de claritate mentală sau de un impuls în recuperare. Contează să fie recomandată corect și adaptată stării tale, iar primul pas este o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu
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
    lede: 'Ce este NAD, cum funcționează forma activă NADH, ce poate susține o perfuzie și în ce situații se folosește. Cu o verificare rapidă care îți arată dacă merită să discuți despre terapie cu medicul.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
