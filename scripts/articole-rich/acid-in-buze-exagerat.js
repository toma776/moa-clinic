// Versiunea structurată a articolului „Acid în buze exagerat – ce trebuie să știi”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva nemulțumit de buzele injectate (sau care vrea să evite asta):
// răspunsul scurt → cum arată și de ce apare → riscurile → aștepți sau intervii (verificare rapidă) → soluții → ce întrebi înainte → întrebări.
// Fără comparații cu alte clinici, fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const derm = [...trNode.entries()].find(([, l]) => l.consult && /dermatolog/i.test(l.nod.nume));
  const dermPret = derm ? pret(derm[0]) : null;
  const dermNume = derm ? derm[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const pBuze = pret('augmentare-buze');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-inseamna', 'Ce înseamnă buze exagerate'],
    ['de-ce', 'De ce apare exagerarea'],
    ['riscuri', 'Riscurile de care se vorbește puțin'],
    ['astepti', 'Aștepți sau intervii?'],
    ['solutii', 'Ce poți face'],
    ['inainte', 'Ce întrebi înainte de injectare'],
    ['la-moa', 'Evaluarea la MOA, pas cu pas'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Se poate repara un rezultat exagerat?', 'De cele mai multe ori, da. În funcție de situație, medicul poate recomanda dizolvarea acidului cu hialuronidază, o corecție fină cu cantități mici sau o combinație a celor două, după o evaluare atentă.'],
    ['Ce este hialuronidaza?', 'Este enzima care dizolvă acidul hialuronic. Se folosește când acidul a migrat, buzele sunt prea mari, există noduli sau forma nu arată natural. Efectul se vede de obicei din primele minute după injectare.'],
    ['Trebuie dizolvat tot acidul?', 'Nu întotdeauna. Unele asimetrii pot fi ajustate cu tehnici precise și cantități mici de acid hialuronic. Medicul decide dacă e potrivită corecția, dizolvarea sau ambele.'],
    ['Cât aștept după injectare până judec rezultatul?', 'Buzele au nevoie de câteva zile ca inflamația să scadă și forma să se așeze. Nu aștepta însă dacă buzele cresc în loc să se dezumfle, dacă ai durere persistentă, proeminențe dure sau semne de migrare.'],
    ['Ce sunt nodulii după acid hialuronic?', 'Sunt mici „biluțe” sub piele, care apar când acidul nu e distribuit uniform sau s-a pus prea mult într-un singur punct. În majoritatea cazurilor se pot corecta, dacă sunt evaluați corect.'],
    ['Ce semne pot indica o infecție?', 'Durerea accentuată, roșeața intensă, secrețiile sau căldura locală. Infecțiile sunt rare, dar necesită evaluare medicală imediată.'],
  ];

  const intrebariCheck = [
    ['Buzele devin tot mai mari în loc să se dezumfle?', 'Umflătura normală scade în câteva zile. Dacă volumul crește, e nevoie de evaluare.'],
    ['Ai durere care nu trece?', 'Durerea persistentă nu face parte din evoluția obișnuită și trebuie văzută de medic.'],
    ['Simți proeminențe dure sau „biluțe” sub piele?', 'Pot fi noduli sau acumulări de produs, care se corectează mai ușor când sunt evaluați din timp.'],
    ['Observi volum deasupra buzei sau spre colțuri?', 'Poate fi un semn de migrare a acidului din buze.'],
    ['Forma nu seamănă deloc cu ce ai discutat cu medicul?', 'Un rezultat departe de planul inițial merită o evaluare, nu doar așteptare.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>„Buze exagerate” nu înseamnă doar buze mari, ci buze care și-au <b>pierdut armonia cu restul feței</b>.</li>
    <li>De obicei nu acidul hialuronic este problema, ci <b>cantitatea, tehnica, produsul ales</b> sau lipsa unei analize a proporțiilor.</li>
    <li>Riscurile de urmărit: <b>noduli, granuloame, migrarea acidului</b> și, rar, infecții.</li>
    <li>Buzele au nevoie de <b>câteva zile</b> ca să se așeze. Nu aștepta dacă volumul crește, doare sau apar zone dure.</li>
    <li>Există soluții: <b>dizolvarea cu hialuronidază, corecția fină</b> sau o combinație, decise după evaluare.</li>
  </ul>
</section>

<h2 id="ce-inseamna">Ce înseamnă buze exagerate</h2>
<p class="ar-first">Te uiți în oglindă și buzele par să fi trecut printr-un filtru de Instagram. Uneori nu e un filtru, ci prea mult acid hialuronic. Dorința de volum e firească. Problema apare când rezultatul trece de limita naturalului și începe să îți schimbe expresiile, proporțiile și felul în care te recunoști.</p>
<p>Buzele bine lucrate nu atrag atenția în mod deranjant: arată echilibrate. Când volumul devine prea evident, contururile se rigidizează și expresiile nu mai par firești, apare efectul „supradimensionat”.</p>
<div class="rx-two">
  <div><h3>Un rezultat armonios</h3><ul><li>completează fața, nu o domină</li><li>buzele par hidratate și naturale</li><li>expresiile rămân ale tale</li><li>în oglindă vezi întâi privirea, nu buzele</li></ul></div>
  <div><h3>Semne de suprainjectare</h3><ul><li>volum vizibil exagerat față de trăsăturile feței</li><li>buza superioară „cade” peste cea inferioară sau e mult proiectată înainte</li><li>contururi încordate, ca în tensiune</li><li>aspect de „duck lips” sau buze întoarse spre exterior</li><li>pielea din jur pare întinsă, iar expresiile se schimbă</li></ul></div>
</div>
<p>Un semn simplu: când oamenii te întreabă „ai făcut ceva?” cu nedumerire, nu cu admirație, probabil s-a trecut de limita potrivită.</p>

<h2 id="de-ce">De ce apare exagerarea</h2>
<p>Exagerarea nu apare dintr-o dată. Este, de obicei, efectul cumulat al mai multor decizii:</p>
<div class="rx-why">
  <span class="rx-why-h">Cauze frecvente</span>
  <ul class="rx-chips rx-chips-neg"><li>prea mult produs într-o ședință</li><li>proporțiile feței ignorate</li><li>tehnică nepotrivită</li><li>„încă puțin” la fiecare ședință</li><li>acid prea dens pentru buze</li><li>produs de calitate slabă</li></ul>
</div>
<p>Același produs poate da rezultate diferite în funcție de cum și unde este injectat: în locuri nepotrivite, în doze prea mari, prea des sau fără să se țină cont de anatomia buzelor tale.</p>

<h2 id="riscuri">Riscurile de care se vorbește puțin</h2>
<p>Când buzele sunt injectate corect, riscurile sunt mici. Ele cresc când se exagerează sau când procedura nu e făcută de un medic cu experiență. Unele efecte apar abia în timp. Merită să le cunoști, nu ca să te sperii, ci ca să iei decizii mai bune.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Noduli</b><p>„Biluțe” sub piele, când acidul nu e distribuit uniform sau s-a pus prea mult într-un punct. Se pot simți la atingere sau când vorbești. De obicei se corectează, dacă sunt evaluați corect.</p></div>
  <div class="rx-card"><i>02</i><b>Granuloame</b><p>Reacții mai rare, în care organismul tratează acidul ca pe un corp străin. Zona se întărește, devine sensibilă sau rămâne roșie. Nu trec de la sine și cer evaluare medicală.</p></div>
  <div class="rx-card"><i>03</i><b>Migrarea acidului</b><p>Produsul se deplasează deasupra buzei sau spre colțuri: contur umflat ciudat, volum unde nu trebuie, efectul de „mustăcioară umflată”. Apare de obicei din tehnică greșită sau cantitate prea mare.</p></div>
</div>
<div class="rx-alert"><b>Mergi la medic fără să aștepți dacă ai:</b> durere accentuată, roșeață intensă, secreții sau căldură locală în zona injectată. Infecțiile sunt rare, dar pot apărea când nu se respectă igiena sau zona e traumatizată după procedură. Tot rar pot apărea și alergii la ingredientele produsului.</div>

<h2 id="astepti">Aștepți sau intervii? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e momentul pentru o evaluare.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Nu amâna evaluarea.</b><p>Ai răspuns „da” la cel puțin o întrebare. Medicul verifică unde s-a acumulat acidul, dacă a migrat și ce soluție ți se potrivește: dizolvare, corecție fină sau o pauză.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(dermNume)}">Programează evaluarea${dermPret ? ` · ${lei(dermPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Poți lăsa buzele să se așeze.</b><p>Imperfecțiunile din primele zile nu înseamnă un rezultat final nereușit. Dacă după ce inflamația scade forma tot nu te reprezintă, o evaluare îți arată ce opțiuni ai.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(dermNume)}">Programează un consult</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="solutii">Ce poți face dacă ai buze exagerate</h2>
<p>Dacă rezultatul nu te reprezintă, nu ești blocată cu el. Important este să nu amâni evaluarea și să o faci la un medic cu experiență.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Dizolvare</small><b>Hialuronidaza</b><dl><dt>Când</dt><dd>acid migrat, buze prea mari, noduli, formă nenaturală</dd><dt>Ce face</dt><dd>enzima dizolvă acidul hialuronic</dd><dt>Când se vede</dt><dd>de obicei din primele minute</dd></dl><a class="link-u" href="/nou/hialuronidaza/">Despre hialuronidază →</a></div>
  <div class="rx-col"><small>Corecție fină</small><b>Cantități mici, tehnică precisă</b><dl><dt>Când</dt><dd>asimetrii care se pot echilibra fără dizolvare</dd><dt>Ce face</dt><dd>restabilește echilibrul formei</dd><dt>Cine decide</dt><dd>medicul, după evaluare</dd></dl></div>
  <div class="rx-col rx-col-on"><small>La MOA</small><b>Întâi evaluarea</b><dl><dt>Ce se verifică</dt><dd>cât acid ai, unde s-a acumulat, dacă a migrat</dd><dt>Ce urmează</dt><dd>dizolvare, corecție fină, o combinație sau o pauză</dd><dt>Scopul</dt><dd>o formă care îți păstrează expresiile</dd></dl></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Dizolvarea poate părea un pas mare, dar uneori este calea de a reveni la o bază corectă, pe care se poate lucra apoi cu măsură. Cât de mult se poate corecta și în câte ședințe depinde de situația ta și se stabilește doar după evaluare.</p></aside>

<h2 id="inainte">Ce întrebi înainte de injectare</h2>
<p>Orice procedură estetică ar trebui să vină cu explicații complete: ce se poate face, ce nu, ce riscuri există și cum arată un rezultat realist. Fără aceste informații, deciziile devin superficiale și așteptările, nerealiste. Înainte de injectare, întreabă:</p>
<ul class="rx-chips"><li>ce tip de acid se folosește</li><li>cât volum se potrivește buzelor tale</li><li>ce riscuri apar dacă se exagerează</li><li>cum arată un rezultat natural, față de unul disproporționat</li><li>cine face injectarea și ce pregătire medicală are</li></ul>
<p>Rețelele sociale au creat standarde greu de atins și greu de întreținut. Pozele filtrate și tendințele care se schimbă repede te pot face să crezi că ai nevoie de mai mult volum decât ți se potrivește. Injectarea buzelor pare simplă, dar cere cunoașterea anatomiei, iar o persoană fără pregătire medicală nu poate interveni corect dacă apare o reacție adversă.</p>

<h2 id="la-moa">Evaluarea la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Evaluarea</b><p>Medicul analizează cât acid hialuronic ai în buze, unde s-a acumulat, dacă a migrat și cum arată proporțiile feței tale.</p>${dermPret ? `<em>${esc(dermNume)} · ${lei(dermPret)}</em>` : ''}</li>
  <li><b>Decizia</b><p>Împreună stabiliți ce se potrivește: dizolvarea, o corecție fină, o combinație sau o pauză.</p></li>
  <li><b>Corecția</b><p>Se face în clinică, de medic. Dacă după dizolvare vrei din nou volum, se lucrează cu măsură, pe o bază corectă.</p>${pBuze ? `<em>Augmentare buze · de la ${lei(pBuze)}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul verifică rezultatul după ce buzele s-au așezat și discută cu tine dacă mai e nevoie de ceva.</p></li>
</ol>
<p class="rx-links">Citește și: <a href="/nou/prima-injectare-cu-acid-hialuronic-in-buze/">prima injectare cu acid hialuronic în buze</a>, <a href="/nou/forme-de-buze-cu-acid-hialuronic/">forme de buze cu acid hialuronic</a> sau vezi pagina despre ${link('augmentare-buze', 'augmentarea buzelor')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Buzele exagerate nu sunt un capăt de drum și nici un motiv să te simți stânjenită. Se întâmplă mai des decât crezi și există soluții pentru a reveni la un aspect natural. Important este să nu ignori semnele și să ceri o evaluare la timp.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(dermNume)}">Programează o evaluare</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
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
    lede: 'Cum arată buzele suprainjectate, de ce apare exagerarea, ce riscuri există și ce soluții ai. Cu o verificare rapidă care îți arată dacă poți aștepta sau e momentul pentru o evaluare.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
