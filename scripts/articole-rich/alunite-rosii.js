// Versiunea structurată a articolului „Alunițe roșii – cum să le identifici pe cele periculoase”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva îngrijorat de o aluniță roșie:
// răspunsul scurt → ce sunt → de ce apar → semnele de alarmă (verificare rapidă) → tratament → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt alunițele roșii'],
    ['cauze', 'De ce apar'],
    ['semne', 'Semnele care cer atenție'],
    ['verificare', 'Verificare rapidă'],
    ['diferente', 'Cu ce se pot confunda'],
    ['tratament', 'Tratament și monitorizare'],
    ['la-moa', 'Evaluarea la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Alunițele roșii sunt periculoase?', 'În marea lor majoritate, alunițele roșii (angioamele cherry) sunt leziuni benigne și nu au nevoie de tratament. Cer însă consult dacă își schimbă mărimea, culoarea sau forma, dacă sângerează repetat, dor sau apar brusc multe leziuni.'],
    ['Pot să îndepărtez singur(ă) o aluniță roșie acasă?', 'Nu. Îndepărtarea acasă poate duce la sângerare și infecții, iar leziunea nu mai poate fi evaluată corect. Îndepărtarea se face în cabinet, după examinare.'],
    ['La ce vârstă apar de obicei?', 'De obicei după 30 de ani, iar frecvența lor crește odată cu vârsta. Femeile sunt mai predispuse, iar predispoziția familială contează.'],
    ['Este normal să apară alunițe roșii în sarcină?', 'Da, modificările hormonale din sarcină pot favoriza apariția lor, iar de multe ori dispar sau se reduc după naștere. Dacă o leziune se modifică, este indicat un consult.'],
    ['Cum se pune diagnosticul?', 'Prin examinare clinică și dermatoscopie, adică examinarea pielii cu un dermatoscop. Dacă există o suspiciune, medicul poate recomanda biopsie.'],
    ['Pot reapărea după tratament?', 'Da, recurența este posibilă. Pot apărea și cicatrici sau depigmentare locală ori sângerare după procedură. Riscurile sunt reduse atunci când metoda este aleasă potrivit leziunii.'],
  ];

  const intrebariCheck = [
    ['Și-a schimbat alunița mărimea, culoarea sau forma?', 'Schimbările pot semnala și alte leziuni, de aceea trebuie evaluate de dermatolog.'],
    ['Sângerează fără să o fi zgâriat sau iritat, ori s-a ulcerat?', 'Sângerarea spontană și repetată este un semn că e nevoie de consult.'],
    ['Este o singură leziune care crește foarte repede?', 'O leziune care crește rapid trebuie examinată, uneori cu biopsie.'],
    ['Au apărut brusc multe leziuni noi?', 'În situații rare, apariția bruscă a multor leziuni poate avea o cauză generală.'],
    ['Te doare zona?', 'Durerea nu este tipică pentru un angiom obișnuit și merită evaluată.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Alunițele roșii, numite și <b>angioame cherry</b>, sunt mici aglomerări de vase de sânge sub piele. <b>Majoritatea sunt inofensive.</b></li>
    <li>Apar mai ales <b>după 30 de ani</b>, cel mai des pe trunchi, iar vârsta, predispoziția familială și sarcina contează.</li>
    <li>Cer consult dacă își <b>schimbă mărimea, culoarea sau forma</b>, dacă <b>sângerează repetat</b>, dor sau dacă apar brusc multe leziuni.</li>
    <li>Diagnosticul se pune <b>doar în cabinet</b>: examinare clinică, dermatoscopie și, uneori, biopsie.</li>
    <li>Se pot îndepărta prin laser, crioterapie sau excizie/electrocauterizare. <b>Nu încerca să le îndepărtezi acasă.</b></li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt alunițele roșii și cum arată</h2>
<p class="ar-first">Ai observat pe piele un punct roșu, mic și lucios, și te întrebi dacă e ceva de care să îți faci griji. Vestea bună este că majoritatea alunițelor roșii sunt inofensive. Merită totuși să știi cum arată una obișnuită și ce semne cer un consult.</p>
<p>Alunițele roșii, sau angioamele cherry, sunt mici aglomerări de vase de sânge sub piele. Apar cel mai des pe trunchi, dar și pe brațe, gât, față sau chiar pe scalp, și rar pe mâini și picioare.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Culoarea</b><p>Roșii, uneori violacee, cu suprafața netedă.</p></div>
  <div class="rx-card"><i>02</i><b>Forma</b><p>Plate sau ușor proeminente. Încep mici și ajung de obicei la 3,5–5 mm.</p></div>
  <div class="rx-card"><i>03</i><b>Cine le are</b><p>Se dezvoltă de obicei după 30 de ani, iar femeile sunt mai predispuse.</p></div>
</div>

<h2 id="cauze">De ce apar alunițele roșii</h2>
<p>Apariția lor este legată de mai mulți factori. Unii sunt frecvenți, alții sunt excepții:</p>
<div class="rx-why">
  <span class="rx-why-h">Factori asociați cu apariția lor</span>
  <ul class="rx-chips"><li>înaintarea în vârstă</li><li>predispoziția familială</li><li>sarcina</li><li>modificările hormonale</li><li>unele substanțe chimice sau medicamente</li></ul>
</div>
<p>În sarcină, apariția lor este frecventă, iar de multe ori dispar sau se reduc după naștere. Pentru unele substanțe și medicamente, legătura nu este întotdeauna clară, dar e bine să i le spui medicului. În situații rare, erupțiile vasculare pot fi legate de infecții virale sau de tulburări hematologice ori autoimune. Acestea sunt excepțiile, nu regula, dar dacă apar brusc multe leziuni, mergi la dermatolog.</p>

<h2 id="semne">Semnele care cer atenție</h2>
<p>Cele mai multe angioame cherry sunt benigne. Unele leziuni roșii pot fi însă altceva, de aceea contează să știi ce să urmărești.</p>
<div class="rx-two">
  <div><h3>De obicei, fără motiv de îngrijorare</h3><ul><li>punct roșu mic, neted, care nu se schimbă în timp</li><li>sângerează ușor doar dacă l-ai zgâriat sau iritat</li><li>apare treptat, odată cu vârsta</li></ul></div>
  <div><h3>Mergi la dermatolog dacă observi</h3><ul><li>schimbare de mărime, culoare sau formă</li><li>margini care devin neregulate</li><li>sângerare spontană, repetată, sau ulcerație</li><li>o singură leziune care crește foarte repede</li><li>durere</li><li>apariția bruscă a multor leziuni</li></ul></div>
</div>
<div class="rx-alert"><b>Nu încerca să le îndepărtezi acasă.</b> Riști sângerare și infecții, iar o leziune care trebuia examinată nu mai poate fi evaluată corect.</div>

<h2 id="verificare">Merită să mergi la dermatolog? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să programezi un consult dermatologic.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Programează un consult dermatologic.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă că leziunea e gravă, ci că medicul trebuie să o vadă: o examinează cu dermatoscopul și îți spune dacă e nevoie de altceva.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciunul dintre semnele frecvente de alarmă.</b><p>Urmărește leziunea în timp. Dacă te deranjează estetic, se agață de haine sau ai multe alunițe ori antecedente de leziuni atipice, un consult te ajută să alegi între monitorizare și îndepărtare.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="diferente">Cu ce se poate confunda o aluniță roșie</h2>
<p>Identificarea corectă o face medicul dermatolog. Câteva leziuni pot semăna cu un angiom cherry:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Angiomul spider</b><p>Are ramificații vasculare, ca picioarele unui păianjen, vizibile de obicei pe față sau decolteu.</p></div>
  <div class="rx-card"><i>02</i><b>Botriomicomul</b><p>Granulomul piogenic crește rapid, e umflat, ușor ulcerat și sângerează ușor. De regulă se excizează, cu biopsie.</p></div>
  <div class="rx-card"><i>03</i><b>Nevul Reed (Spitz)</b><p>Poate arăta ca un nodul pigmentat sau roșiatic. Uneori e nevoie de excizie pentru clarificare.</p></div>
</div>
<aside class="rx-note"><b>De ce contează examinarea</b><p>Melanomul amelanotic, adică fără pigment, poate arăta ca o leziune roșie sau roz. Este rar, dar orice leziune atipică trebuie exclusă de medic, cu dermatoscopie și, dacă e nevoie, biopsie.</p></aside>

<h2 id="tratament">Tratament și monitorizare</h2>
<p>Alunițele roșii obișnuite nu au nevoie de tratament. Se îndepărtează atunci când sângerează frecvent, provoacă disconfort sau se rănesc ușor, când te deranjează estetic sau când există o suspiciune care impune biopsie.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Laser vascular</small><b>Tratament cu laser</b><dl><dt>Când se folosește</dt><dd>pentru multe angioame roșii</dd><dt>Ce trebuie știut</dt><dd>metoda se alege după tipul leziunii</dd></dl>${id('laser-vascular') ? `<a class="link-u" href="${esc(live('laser-vascular'))}">Despre laserul vascular →</a>` : ''}</div>
  <div class="rx-col"><small>Crioterapie</small><b>Înghețare locală</b><dl><dt>Când se folosește</dt><dd>pentru leziuni mici</dd><dt>Ce trebuie știut</dt><dd>se face în cabinet</dd></dl></div>
  <div class="rx-col rx-col-on"><small>Excizie / electrocauterizare</small><b>Cu examinare la microscop</b><dl><dt>Când se folosește</dt><dd>când e nevoie de biopsie sau leziunea sângerează</dd><dt>Ce trebuie știut</dt><dd>permite analiza histologică</dd></dl>${id('nevi-pigmentari') ? `<a class="link-u" href="${esc(live('nevi-pigmentari'))}">Despre îndepărtarea alunițelor →</a>` : ''}</div>
</div>
<div class="rx-two">
  <div><h3>Monitorizarea</h3><p>Dacă ai multe leziuni sau ai avut leziuni atipice, dermatoscopia digitală compară fotografii ale pielii în timp și ajută la observarea devreme a schimbărilor.</p></div>
  <div><h3>Ce poate apărea după tratament</h3><ul><li>recurență</li><li>cicatrici sau depigmentare locală</li><li>sângerare după procedură</li></ul></div>
</div>
<p>Între timp, protejează-ți pielea de soare și evită să traumatizezi leziunile.</p>

<h2 id="la-moa">Evaluarea alunițelor roșii la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul dermatologic</b><p>Medicul dermatolog examinează leziunile, te întreabă de istoric, tratamente și sarcină, și le privește cu dermatoscopul.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Decizia</b><p>Împreună stabiliți dacă leziunea se urmărește în timp sau se îndepărtează și ce metodă se potrivește: laser, crioterapie sau excizie.</p></li>
  <li><b>Procedura, dacă e cazul</b><p>Se face în cabinet. Când e nevoie, fragmentul îndepărtat se trimite la analiză.</p></li>
  <li><b>Urmărirea</b><p>Dacă ai multe leziuni sau antecedente de nevi atipici, medicul îți recomandă controale periodice.</p></li>
</ol>
<p class="rx-links">Citește și despre ${link('nevi-pigmentari', 'îndepărtarea alunițelor')}, despre ${link('laser-vascular', 'laserul vascular')} sau vezi ${link('consultatie-dermatoestetica-dermatologie', 'consultația de dermatologie')} la MOA.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Cele mai multe alunițe roșii sunt inofensive și nu au nevoie de tratament. Urmărește-le în timp și cere părerea dermatologului când observi o schimbare. Doar medicul poate stabili diagnosticul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu pentru semnele care cer consult dermatologic
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
    lede: 'Ce sunt alunițele roșii, de ce apar și ce semne arată că e nevoie de un dermatolog. Cu o verificare rapidă a semnelor de alarmă și opțiunile de tratament.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
