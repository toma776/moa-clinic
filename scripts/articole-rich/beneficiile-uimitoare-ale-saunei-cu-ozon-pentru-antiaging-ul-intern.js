// Versiunea structurată a articolului „Beneficiile saunei cu ozon pentru antiaging-ul intern”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la o sesiune de saună cu ozon:
// răspunsul scurt → ce este și cum funcționează → ce poate susține → ce știm și ce nu → dacă i se potrivește (verificare rapidă) → pregătire și siguranță → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const sauna = serv['sauna-cu-ozon']?.preturi || [];
  const pachet = sauna.find((p) => /pachet/i.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /antiaging/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație antiaging (cu vârsta biologică)';
  const dr = team.find((p) => p.nume.includes('Stănescu'));

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este sauna cu ozon'],
    ['cum-functioneaza', 'Cum funcționează'],
    ['beneficii', 'Ce poate susține'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['pregatire', 'Cum te pregătești'],
    ['siguranta', 'Siguranță și precauții'],
    ['la-moa', 'Sauna cu ozon la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cât durează o sesiune de saună cu ozon?', 'Durata poate varia, dar de obicei o sesiune durează între 20 și 30 de minute. Dacă te simți inconfortabil, poți ieși oricând, iar asistenta este lângă tine.'],
    ['Pot face sauna cu ozon dacă am tensiune mare sau o problemă cardiacă?', 'Doar după un consult medical. Căldura solicită circulația, așa că medicul stabilește dacă sauna ți se potrivește și în ce condiții.'],
    ['Pot face sauna în timpul menstruației sau în sarcină?', 'Nu se recomandă. Schimbările hormonale pot influența toleranța la căldură, așa că este bine să amâni sesiunea.'],
    ['Pot merge la sală în aceeași zi?', 'Este bine să eviți efortul fizic intens în ziua sesiunii. După saună, acordă-ți timp să te relaxezi și să te rehidratezi.'],
    ['Ce fac după sesiune?', 'Bea apă sau o băutură cu electroliți, ca să refaci lichidele pierdute prin transpirație, și odihnește-te puțin înainte să pleci.'],
    ['Pot combina sauna cu alte terapii?', 'Da, la recomandarea medicului. La MOA, sesiunile de saună cu ozon pot face parte din pachete împreună cu terapii intravenoase sau tratamente faciale.'],
  ];

  const intrebariCheck = [
    ['Ai o afecțiune cardiacă diagnosticată?', 'Căldura solicită inima și vasele de sânge; medicul decide dacă sauna e potrivită.'],
    ['Ai tensiune arterială mare (hipertensiune)?', 'Este una dintre situațiile în care se recomandă un consult înainte de prima sesiune.'],
    ['Ești însărcinată?', 'În sarcină, sauna cu ozon nu se recomandă.'],
    ['Ești în perioada menstruației?', 'Schimbările hormonale pot influența toleranța la căldură; e mai bine să amâni sesiunea.'],
    ['Ai planificat un antrenament intens în aceeași zi?', 'Sauna și efortul intens în aceeași zi pot solicita prea mult organismul; alege o altă zi.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Sauna cu ozon combină <b>căldura moderată</b> cu <b>ozonul</b>, un gaz cu proprietăți antimicrobiene și antiinflamatoare, generat de un aparat special.</li>
    <li>Căldura dilată vasele de sânge și pornește transpirația. Așa poate <b>susține circulația, eliminarea prin transpirație și relaxarea</b> musculară.</li>
    <li>Mulți oameni o folosesc pentru <b>relaxare, somn mai bun și o stare generală de bine</b>. Efectele diferă de la o persoană la alta.</li>
    <li><b>Nu se face fără acord medical</b> dacă ai probleme cardiace sau hipertensiune și nu se recomandă în sarcină sau în timpul menstruației.</li>
    <li>La MOA, sesiunea durează de obicei <b>20–30 de minute</b>, sub supravegherea asistentei${pret('sauna-cu-ozon') ? `, de la ${lei(pret('sauna-cu-ozon'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este sauna cu ozon</h2>
<p class="ar-first">Poate cauți o pauză de la ritmul zilnic, dormi mai prost sau simți că oboseala nu mai trece după un weekend liber. Sauna cu ozon este una dintre terapiile de antiaging intern de la MOA, gândită pentru relaxare și pentru susținerea organismului din interior.</p>
<p>La baza ei stă <b>ozonul</b>, un gaz cu proprietăți antimicrobiene și antiinflamatoare. Este produs într-un aparat special și introdus în saună, iar corpul tău este expus în același timp la o temperatură ridicată. Căldura pornește o serie de procese naturale, pe care ozonul le poate susține.</p>

<h2 id="cum-functioneaza">Cum funcționează sauna cu ozon</h2>
<p>Funcționarea se bazează pe interacțiunea dintre căldură și ozon. Pe scurt, se întâmplă trei lucruri:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Căldura încălzește corpul</b><p>Temperatura corpului crește ușor (o stare de hipertermie moderată). Vasele de sânge se dilată, iar circulația se activează.</p></div>
  <div class="rx-card"><i>02</i><b>Porii se deschid</b><p>Transpirația pornește, iar porii deschiși permit ozonului să ajungă în contact cu pielea.</p></div>
  <div class="rx-card"><i>03</i><b>Ozonul acționează</b><p>Ozonul poate declanșa mecanisme celulare asemănătoare celor din terapia sistemică cu oxigen-ozon (${link('autohemoterapia', 'autohemoterapia majoră')}), cu rol în oxigenarea țesuturilor.</p></div>
</div>

<h2 id="beneficii">Ce poate susține sauna cu ozon</h2>
<p>Efectele descrise mai jos vin din combinația dintre căldură, transpirație și ozon. Nu toate se simt la fel la fiecare persoană, iar sauna nu înlocuiește tratamentul unei boli.</p>
<div class="rx-two">
  <div><h3>Pentru corp</h3><ul><li><b>circulația</b>: vasele dilatate de căldură favorizează fluxul de sânge și oxigenarea țesuturilor</li><li><b>recuperarea după efort</b> și reducerea durerilor musculare, utile mai ales dacă ai o viață activă</li><li><b>eliminarea prin transpirație</b> și susținerea ficatului și a rinichilor în procesul de detoxifiere</li><li><b>imunitatea</b>: expunerea la căldură și ozon poate stimula sistemul imunitar</li><li><b>stresul oxidativ</b>: ozonul are rol în neutralizarea radicalilor liberi</li></ul></div>
  <div><h3>Pentru minte</h3><ul><li><b>relaxare</b> și reducerea stresului și a anxietății, într-un mediu calm</li><li>eliberarea de <b>endorfine</b>, cu efect asupra stării de spirit</li><li>o posibilă scădere a <b>cortizolului</b>, hormonul stresului</li><li><b>somn</b> mai odihnitor, prin relaxarea musculaturii și reducerea tensiunii</li><li>un moment de pauză, util și când te confrunți cu oboseala cronică (burnout)</li></ul></div>
</div>
<h3>Pentru piele</h3>
<p>Căldura deschide porii și ajută la eliminarea impurităților, iar ozonul, prin proprietățile lui antimicrobiene, poate reduce bacteriile implicate în acnee. Ozonul poate stimula și producția de colagen, iar circulația mai bună la nivelul pielii îmbunătățește aportul de nutrienți și oxigen. Persoanele cu eczemă sau psoriazis pot simți o calmare a iritației și a roșeții.</p>
<ul class="rx-chips"><li>piele mai curată</li><li>susținerea colagenului</li><li>hidratare prin circulație</li><li>mai puțină roșeață și iritație</li></ul>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Efectele căldurii asupra circulației, transpirației și relaxării sunt cunoscute. Cât contribuie ozonul în sine la piele, imunitate sau detoxifiere diferă însă de la o persoană la alta și se studiază în continuare. De aceea, la MOA, sauna cu ozon se recomandă după evaluare și face parte dintr-un plan, nu este o soluție separată pentru o problemă de sănătate.</p></aside>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul sau alege altă zi.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă că sauna e exclusă, ci că medicul trebuie să îți verifice întâi starea de sănătate sau că sesiunea e mai bine programată în altă zi.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile frecvente.</b><p>Poți programa o sesiune. Spune-i asistentei dacă iei medicamente sau ai alte afecțiuni, iar dacă ai nelămuriri, medicul îți răspunde înainte de prima sesiune.</p><a class="btn btn-gold" href="#programare" data-srv="Saună cu ozon">Programează o sesiune</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="pregatire">Cum te pregătești pentru o sesiune</h2>
<div class="rx-two">
  <div><h3>Înainte</h3><ul><li>bea apă cu câteva ore înainte de sesiune</li><li>evită alcoolul și băuturile energizante, pentru că deshidratează</li><li>fă un duș, ca să îndepărtezi impuritățile de pe piele</li><li>alege o ținută lejeră, din bumbac; evită materialele sintetice, care rețin căldura</li></ul></div>
  <div><h3>După</h3><ul><li>rehidratează-te cu apă sau cu o băutură cu electroliți</li><li>acordă-ți timp să te relaxezi</li><li>evită efortul fizic intens în aceeași zi</li></ul></div>
</div>

<h2 id="siguranta">Siguranță și precauții</h2>
<p>Sauna cu ozon se face într-un spațiu bine ventilat, ca ozonul să nu se acumuleze în exces, și sub supravegherea personalului medical. Câteva situații cer atenție:</p>
<ul class="rx-chips rx-chips-neg"><li>afecțiuni cardiace</li><li>hipertensiune arterială</li><li>sarcină</li><li>menstruație</li><li>efort intens în aceeași zi</li></ul>
<div class="rx-alert"><b>Spune imediat asistentei dacă, în timpul sesiunii, ai:</b> amețeală, disconfort sau orice simptom neobișnuit. Sesiunea se oprește, iar tu ești ajutat(ă) să te refaci.</div>

<h2 id="la-moa">Sauna cu ozon la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul medical</b><p>Dacă ai afecțiuni cunoscute sau iei tratamente, medicul îți verifică istoricul și stabilește dacă sauna ți se potrivește.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Pregătirea</b><p>Vii hidratat(ă), faci un duș și te schimbi într-o ținută lejeră.</p></li>
  <li><b>Sesiunea</b><p>Durează de obicei 20–30 de minute, cu asistenta aproape. Poți ieși oricând dacă te simți inconfortabil.</p>${pret('sauna-cu-ozon') ? `<em>Saună cu ozon · ${lei(pret('sauna-cu-ozon'))}</em>` : ''}${pachet ? `<em>Pachet 10 sesiuni · ${lei(pachet)}</em>` : ''}</li>
  <li><b>După sesiune și reevaluarea</b><p>Te rehidratezi și te odihnești. Dacă urmezi o serie de sesiuni, medicul discută cu tine ce s-a schimbat și cum continui.</p></li>
</ol>
<p class="rx-links">Sauna cu ozon se poate combina cu alte terapii: ${link('autohemoterapia', 'autohemoterapia majoră cu ozon')}, <a href="/nou/terapii-intravenoase/">terapiile intravenoase</a> sau ${link('glutation', 'perfuziile cu glutation')}, în cadrul <a href="/nou/longevitate/program/">programului Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Sauna cu ozon poate fi un moment de relaxare care susține circulația, pielea și starea de bine, atunci când o folosești corect și în siguranță. Dacă ai o afecțiune cronică sau nu ești sigur(ă) că ți se potrivește, începe cu o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Saună cu ozon">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu înainte de sauna cu ozon
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
    lede: 'Ce este sauna cu ozon, cum funcționează și ce poate susține pentru corp, minte și piele. Cu o verificare rapidă a precauțiilor și pașii unei sesiuni la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
