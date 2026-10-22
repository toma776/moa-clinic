// Versiunea structurată a articolului „Tratament burnout TMS”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva epuizat, care se întreabă dacă e burnout și ce poate face:
// răspunsul scurt → ce este (vs. stres) → de ce apare → te regăsești? (verificare rapidă) → ce este TMS → cum diferă de alte variante
// → cum decurge o ședință → la MOA → după tratament → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025); fără „aprobat FDA” (lipsește indicația exactă).
// Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const SID = 'tms-stimulare-magnetica-transcraniana';
  const srvNume = 'Stimulare magnetică transcraniană (TMS)';
  const pP = (re) => (serv[SID]?.preturi || []).find((p) => re.test(p.nume))?.valoare;
  const pConsult = pP(/^Consulta/i);
  const pSedinta = pP(/^Ședință/i);
  const pProgram = pP(/burnout/i);
  const pConsolidare = pP(/consolidare/i);
  const dr = team.find((p) => p.nume.includes('Stănescu'));
  const drLink = dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'Dr. Adrian Stănescu';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este burnout-ul'],
    ['cauze', 'De ce apare'],
    ['te-regasesti', 'Te regăsești? Verificare rapidă'],
    ['tms', 'Ce este TMS'],
    ['diferente', 'TMS, medicație, terapie'],
    ['sedinta', 'Cum decurge o ședință'],
    ['la-moa', 'Programul TMS la MOA'],
    ['dupa', 'După tratament'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Care este diferența dintre stres și burnout?', 'Stresul apare, de obicei, pe termen scurt și îți permite să continui ce faci, chiar cu disconfort. Burnout-ul durează mult, seamănă cu un stres cronic și vine cu demotivare și senzația că lucrurile nu se vor schimba.'],
    ['Ședința de TMS doare?', 'Ești treaz pe tot parcursul ședinței, așezat într-un fotoliu. Simți niște bătăi ușoare în scalp și auzi un sunet ca un „clic”. Nu sunt necesare ace sau anestezie.'],
    ['Pot conduce sau merge la muncă după ședință?', 'Da. De obicei poți conduce și te poți întoarce la muncă imediat după ședință, fără perioadă de recuperare.'],
    ['Câte ședințe sunt necesare?', 'Numărul și frecvența ședințelor se stabilesc după evaluarea medicală, în funcție de istoric și diagnostic. Cura durează, de obicei, 4–6 săptămâni.'],
    ['TMS înlocuiește psihoterapia?', 'Nu. TMS se poate combina cu psihoterapia, iar unii pacienți observă că, după TMS, pot lucra mai bine în terapie.'],
    ['Cine nu poate face TMS?', 'TMS poate avea contraindicații, de exemplu implanturi metalice intracraniene sau, în unele cazuri, un stimulator cardiac. Înainte de tratament, evaluarea medicală este obligatorie.'],
  ];

  const intrebariCheck = [
    ['Te simți epuizat(ă) aproape tot timpul, de mai multe săptămâni, orice ai face?', 'Burnout-ul este o epuizare care persistă mult timp și se simte la nivel mental, fizic și emoțional.'],
    ['Ai „ceață mentală”: îți vine greu să te concentrezi sau să iei decizii?', 'Ceața mentală este unul dintre semnele frecvente ale burnout-ului.'],
    ['Te-ai îndepărtat de job, de familie sau de prieteni?', 'Deconectarea de oamenii și lucrurile din jur apare des în burnout.'],
    ['Reacționezi impulsiv la situații care înainte ți se păreau normale?', 'Iritabilitatea, la muncă și acasă, este un semn de suprasolicitare.'],
    ['Ți-ai pierdut interesul pentru lucruri care îți plăceau sau dormi prost?', 'Pierderea interesului și problemele de somn merită discutate cu un medic.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Burnout-ul este o <b>epuizare prelungită</b>, mentală, fizică și emoțională. Organizația Mondială a Sănătății îl descrie ca <b>fenomen ocupațional</b>.</li>
    <li>Spre deosebire de stres, <b>durează mult</b> și vine cu demotivare. Netratat, poate duce la depresie.</li>
    <li>Ajută <b>sprijinul celor apropiați, psihoterapia</b> și, după evaluare medicală, <b>stimularea magnetică transcraniană (TMS)</b>.</li>
    <li>TMS folosește impulsuri magnetice asupra zonelor creierului implicate în starea de spirit și motivație. Este <b>neinvazivă</b>: fără ace, anestezie sau recuperare.</li>
    <li>La MOA, programul pornește de la o <b>consultație TMS</b>${pConsult ? ` (${lei(pConsult)})` : ''}, cu ${drLink}, coordonatorul departamentului TMS.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este burnout-ul</h2>
<p class="ar-first">Te simți abătut(ă), iritat(ă), presat(ă) de termene tot mai strânse și de tot mai multe sarcini. Simți că așteptările celorlalți cresc și că nu mai ești apreciat(ă). Crezi că e doar stres, dar starea durează de prea mult timp ca să fie doar atât. Poate fi epuizare fizică și mentală, ceea ce în termeni medicali se numește burnout, și care nu trece doar sperând că va trece.</p>
<p>Organizația Mondială a Sănătății recunoaște burnout-ul ca <b>fenomen ocupațional</b> și îl descrie ca sindrom: un ansamblu de simptome legate de o cauză anume. Este acel sentiment de epuizare pe care îl simți constant, orice ai face.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Stres</small><b>Pe termen scurt</b><dl><dt>Cât durează</dt><dd>de obicei, puțin</dd><dt>Ce poți face</dt><dd>continui activitatea, chiar cu disconfort și presiune</dd><dt>Motivația</dt><dd>rămâne</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Burnout</small><b>Stres cronic, pe termen lung</b><dl><dt>Cât durează</dt><dd>mult, fără să treacă de la sine</dd><dt>Ce poți face</dt><dd>activitățile obișnuite devin greu de dus</dd><dt>Motivația</dt><dd>dispare, cu senzația că nimic nu se va schimba</dd></dl></div>
</div>
<p>Mulți oameni trec prin astfel de perioade și își revin cu sprijinul familiei și cu ajutor de specialitate.</p>

<h2 id="cauze">De ce apare burnout-ul</h2>
<p>Când presiunea, așteptările și termenele îți definesc viața o perioadă lungă, poți ajunge la epuizare. Cele mai frecvente cauze:</p>
<div class="rx-why">
  <span class="rx-why-h">Ce întreține starea de stres continuu</span>
  <ul class="rx-chips rx-chips-neg"><li>grijile legate de bani</li><li>problemele de la locul de muncă</li><li>izolarea socială</li><li>o stare de sănătate precară</li><li>insomniile</li><li>conflictele nerezolvate cu cei apropiați</li></ul>
</div>
<p>Grijile pot duce la alcool, fumat și alte obiceiuri care afectează sănătatea. Burnout-ul nu rămâne la birou: se simte și acasă, și cu prietenii. Oamenii devin iritabili, își pierd interesul pentru ce le plăcea, dorm prost și riscă să dezvolte depresie. De aceea merită să te oprești, să iei o pauză și să ceri sprijin.</p>

<h2 id="te-regasesti">Te regăsești? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă merită să discuți cu un medic.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Merită o evaluare medicală.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă neapărat că ai burnout, dar semnele care durează nu trebuie ignorate. La evaluare, medicul discută cu tine simptomele, istoricul și opțiunile, inclusiv dacă TMS ți se potrivește.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(srvNume)}">Programează evaluarea${pConsult ? ` · ${lei(pConsult)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai semnele frecvente ale burnout-ului.</b><p>Dacă totuși te simți copleșit(ă) sau starea ta se schimbă, nu aștepta să treacă de la sine: vorbește cu cei apropiați și cu un medic.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(srvNume)}">Programează o discuție cu medicul</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>
<div class="rx-alert"><b>Dacă ai gânduri de a-ți face rău,</b> nu aștepta o programare: sună imediat la 112 sau mergi la cea mai apropiată unitate de primiri urgențe.</div>

<h2 id="tms">Ce este stimularea magnetică transcraniană (TMS)</h2>
<p>TMS este o procedură medicală care folosește <b>impulsuri magnetice</b> pentru a stimula zonele creierului implicate în starea de bine și motivație. Activitatea cerebrală este „reglată” din exterior, fără operație și fără perioadă de recuperare. O poți privi ca pe un antrenament asistat pentru circuitele creierului, care folosește magnetismul în locul substanțelor chimice.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Neinvazivă</b><p>Nu implică operații, ace sau anestezie. Ești treaz(ă) tot timpul.</p></div>
  <div class="rx-card"><i>02</i><b>Țintită</b><p>Stimulează direct zona implicată în reglarea stării de spirit și în funcțiile executive, cum sunt concentrarea și deciziile.</p></div>
  <div class="rx-card"><i>03</i><b>Combinabilă</b><p>Se poate face alături de alte tratamente, precum psihoterapia.</p></div>
</div>

<h2 id="diferente">TMS, medicație și psihoterapie: cum diferă</h2>
<div class="rx-compare">
  <div class="rx-col"><small>Medicație</small><b>Acționează în tot corpul</b><dl><dt>Cum ajunge</dt><dd>prin stomac, ficat și sânge, apoi la creier</dd><dt>Ce poate apărea</dt><dd>efecte secundare precum greață sau somnolență; uneori apatie în primele săptămâni</dd><dt>Durata</dt><dd>adesea luni sau ani</dd></dl></div>
  <div class="rx-col"><small>Psihoterapie</small><b>Lucrează cu gândurile și emoțiile</b><dl><dt>Ce face</dt><dd>te ajută să procesezi schimbările psihologice</dd><dt>Durata</dt><dd>adesea luni</dd><dt>Combinare</dt><dd>se poate face împreună cu TMS</dd></dl></div>
  <div class="rx-col rx-col-on"><small>TMS</small><b>Acționează local</b><dl><dt>Cum ajunge</dt><dd>impulsuri magnetice asupra unei zone anume a creierului</dd><dt>Ce simți</dt><dd>bătăi ușoare în scalp, un sunet de „clic”</dd><dt>Durata</dt><dd>o cură, de obicei 4–6 săptămâni</dd></dl>${id(SID) ? `<a class="link-u" href="${esc(live(SID))}">Despre TMS la MOA →</a>` : ''}</div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Pacienții descriu adesea o gândire mai clară și o stare de calm, fără să fie sedați. Scopul TMS este ca circuitele implicate în reglarea emoțiilor să funcționeze mai bine pe cont propriu. Rezultatele diferă însă de la o persoană la alta, iar TMS nu este potrivită pentru toată lumea. Limitele se discută cu fiecare pacient, iar alegerea între variante, sau combinarea lor, se face împreună cu medicul.</p></aside>

<h2 id="sedinta">Cum decurge o ședință de TMS</h2>
<p>După evaluarea medicală și includerea TMS în planul de tratament, se stabilește numărul de ședințe. O ședință arată așa:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Pregătirea și poziționarea</b><p>Te așezi într-un fotoliu, treaz(ă). Specialistul plasează pe cap o bobină magnetică de mărimea unei palme, după măsurători precise, deasupra zonei de stimulat.</p></div>
  <div class="rx-card"><i>02</i><b>Calibrarea și stimularea</b><p>Câteva impulsuri reglează intensitatea potrivită pentru tine; simți bătăi ușoare în scalp. Apoi aparatul emite serii ritmice de impulsuri, cu un sunet ca un „clic”.</p></div>
  <div class="rx-card"><i>03</i><b>Finalizarea</b><p>La final, bobina se îndepărtează și poți pleca. De obicei poți conduce și te poți întoarce la muncă imediat.</p></div>
</div>
<div class="rx-two">
  <div><h3>Ce poți observa în timpul curei</h3><ul><li>senzația că ai din nou control asupra gândurilor</li><li>un somn mai odihnitor</li><li>mai puțină iritabilitate</li><li>concentrarea care revine treptat</li></ul><p>Recuperarea este graduală, nu peste noapte, și diferă de la o persoană la alta.</p></div>
  <div><h3>Când nu se face fără acord medical</h3><ul><li>implanturi metalice intracraniene</li><li>stimulator cardiac, în unele cazuri</li></ul><p>Înainte de tratament, evaluarea medicală amănunțită este obligatorie.</p></div>
</div>

<h2 id="la-moa">Programul TMS pentru burnout la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultația TMS</b><p>Discuți cu ${drLink}, coordonatorul departamentului TMS, acreditat TMS Europe și membru Brainstimulation Academy. Medicul evaluează simptomele, istoricul și contraindicațiile.</p>${pConsult ? `<em>Consultație TMS · ${lei(pConsult)}</em>` : ''}</li>
  <li><b>Planul</b><p>Durata și frecvența ședințelor se stabilesc după evaluare, în funcție de istoric și diagnostic. TMS face parte dintr-un protocol adaptat fiecărui pacient.</p>${pProgram ? `<em>Program TMS Burnout: 10 ședințe + EKG · ${lei(pProgram)}</em>` : ''}</li>
  <li><b>Ședințele</b><p>Fiecare ședință durează 20–30 de minute, în funcție de program, și îți reiei apoi activitatea.</p>${pSedinta ? `<em>Ședință TMS · ${lei(pSedinta)}</em>` : ''}</li>
  <li><b>Reevaluarea și consolidarea</b><p>Medicul urmărește evoluția și discută cu tine dacă sunt utile ședințe de consolidare.</p>${pConsolidare ? `<em>Consolidare TMS · ${lei(pConsolidare)}</em>` : ''}</li>
</ol>
<p class="rx-links">Află mai multe pe ${link(SID, 'pagina despre stimularea magnetică transcraniană')}, despre ${drLink} sau vezi <a href="/nou/consultatii/">toate consultațiile</a> și <a href="/nou/longevitate/program/">programul Global Antiaging</a>.</p>

<h2 id="dupa">După tratament: cum previi revenirea burnout-ului</h2>
<p>TMS poate ajuta creierul, dar stilul de viață rămâne în grija ta. Câteva obiceiuri care contează:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Nu recupera muncind mai mult</b><p>Când energia revine, apare tentația de a recupera timpul pierdut. Învață să spui „nu” fără vinovăție.</p></div>
  <div class="rx-card"><i>02</i><b>Recunoaște semnele timpurii</b><p>Nu ignora primele nopți nedormite sau cinismul care revine. Cu cât le observi mai devreme, cu atât e mai ușor.</p></div>
  <div class="rx-card"><i>03</i><b>Pauze și somn</b><p>Fă pauze reale, de exemplu 10 minute la fiecare 50 de minute de lucru, și nu sta pe ecrane până noaptea târziu.</p></div>
</div>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Burnout-ul este un semnal că sistemul tău este suprasolicitat, nu o slăbiciune. Există pași concreți: sprijinul celor apropiați, psihoterapia și, după evaluare, TMS. Primul pas este o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(srvNume)}">Programează evaluarea</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu a semnelor de burnout
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
    lede: 'Ce este burnout-ul, cum se deosebește de stres și de ce apare. Vezi ce este stimularea magnetică transcraniană, cum decurge o ședință și cum arată programul TMS pentru burnout la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 9,
  };
};
