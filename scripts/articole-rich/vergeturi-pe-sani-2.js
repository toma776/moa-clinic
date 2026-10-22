// Versiunea structurată a articolului „Vergeturi pe sâni – cauze, tratamente și metode de prevenție”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care tocmai și-a observat vergeturile:
// răspunsul scurt → ce sunt și cum arată → sunt noi sau vechi (verificare rapidă) → de ce apar → ce tratamente există → prevenție → cum decurge la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const viva = serv['venus-viva']?.preturi || [];
  const pV = (re) => viva.find((p) => re.test(p.nume))?.valoare;
  const pVerg = pV(/vergeturi/i);
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt și cum arată'],
    ['noi-sau-vechi', 'Noi sau vechi? Verificare rapidă'],
    ['cauze', 'De ce apar'],
    ['tratamente', 'Ce tratamente există'],
    ['preventie', 'Cum le previi'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Vergeturile de pe sâni sunt periculoase?', 'Nu. Vergeturile nu sunt o problemă de sănătate. Pot fi însă deranjante din punct de vedere estetic și pot afecta încrederea în tine, motiv pentru care multe persoane caută soluții de estompare.'],
    ['Pot scăpa complet de vergeturi?', 'Tratamentele le pot face mai puțin vizibile, dar niciunul nu le elimină complet, cu excepția intervenției chirurgicale. Cât de mult se estompează depinde de vechimea lor și de piele.'],
    ['Când e bine să le tratezi?', 'Cât sunt încă roșii, roz sau violet, adică recente. În această fază răspund de obicei mai bine la tratament decât atunci când au devenit alb-argintii.'],
    ['Apar vergeturi pe sâni și la bărbați?', 'Da. Vergeturile apar la majoritatea oamenilor de-a lungul vieții, femei și bărbați deopotrivă, pe sâni, abdomen, coapse sau fese.'],
    ['Cremele previn vergeturile?', 'Hidratarea zilnică ajută pielea să rămână elastică, dar cremele și loțiunile nu garantează că vergeturile nu vor apărea. Contează și greutatea stabilă, alimentația și hidratarea din interior.'],
    ['Cum știu că sunt vergeturi și nu altceva?', 'La început pot fi confundate cu venele varicoase sau cu alte semne de pe piele. Dacă nu ești sigură, un consult dermatologic lămurește rapid ce sunt.'],
  ];

  const intrebariCheck = [
    ['Liniile sunt roșii, roz sau violet?', 'Culoarea intensă este tipică vergeturilor recente.'],
    ['Au apărut în ultimele luni?', 'Vergeturile noi sunt, de obicei, cele mai ușor de tratat.'],
    ['Simți o ușoară mâncărime în zonă?', 'Mâncărimea poate însoți vergeturile la început.'],
    ['Ai avut recent o schimbare rapidă: sarcină, alăptare, kilograme în plus sau în minus?', 'Întinderea rapidă a pielii este cauza principală a vergeturilor noi.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Vergeturile sunt linii fine care apar când <b>pielea se întinde prea repede</b> și fibrele de colagen și elastină se rup în profunzime.</li>
    <li>La început sunt <b>roșii, roz sau violet</b>; în timp devin <b>alb-argintii</b> și seamănă cu o cicatrice fină.</li>
    <li>Apar mai ales în <b>pubertate, sarcină, alăptare</b> sau după fluctuații de greutate; genetica și hormonii contează și ele.</li>
    <li><b>Nu sunt periculoase</b> pentru sănătate. Tratamentele le pot estompa, dar niciunul nu le elimină complet, cu excepția chirurgiei.</li>
    <li>La MOA, medicul le evaluează la consult și îți propune un plan${pVerg ? `; ședința Venus Viva pentru vergeturi pornește de la ${lei(pVerg)}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt vergeturile pe sâni și cum arată</h2>
<p class="ar-first">„Am vergeturi pe sâni și nu știu cum să scap de ele.” Dacă te regăsești aici, află că nu ești singură: majoritatea oamenilor au vergeturi la un moment dat, pe sâni, abdomen, coapse sau fese. Nu sunt o problemă de sănătate, dar pot face neplăcută alegerea unui sutien decoltat sau pot crea jenă în cuplu.</p>
<p>Se formează atunci când pielea nu are timp să se adapteze la o schimbare bruscă, cum ar fi o creștere rapidă în volum. În profunzime se rup fibrele de colagen și elastină, cele care țin pielea fermă și elastică. Au adesea o formă ușor ondulată, ceea ce te ajută să le recunoști.</p>
<div class="rx-two">
  <div><h3>Vergeturi noi</h3><ul><li>linii fine, roșii, roz sau violet</li><li>uneori, o ușoară mâncărime</li><li>răspund de obicei mai bine la tratament</li><li>la început pot fi confundate cu venele varicoase</li></ul></div>
  <div><h3>Vergeturi vechi</h3><ul><li>culoare alb-argintie</li><li>textură asemănătoare unei cicatrici fine</li><li>pot fi estompate, nu eliminate</li><li>sunt mai puțin vizibile decât la început</li></ul></div>
</div>
<div class="rx-why">
  <span class="rx-why-h">Unde apar de obicei pe sâni</span>
  <ul class="rx-chips"><li>pe părțile laterale, spre axilă</li><li>în partea de jos, unde greutatea sânului întinde pielea</li><li>în partea de sus, după o creștere rapidă în volum</li></ul>
</div>

<h2 id="noi-sau-vechi">Vergeturile tale sunt noi sau vechi? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>4 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar în ce fază par să fie vergeturile și ce poți discuta cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Par să fie vergeturi recente.</b><p>Este faza în care răspund de obicei mai bine la tratament. Un consult dermatologic confirmă ce sunt (la început pot semăna cu alte semne de pe piele) și stabilește ce variantă ți se potrivește.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Par să fie vergeturi mai vechi.</b><p>Le poți face mai puțin vizibile, chiar dacă nu dispar complet. Medicul îți spune la consult ce tratament și câte ședințe au sens pentru pielea ta.</p><a class="btn btn-gold" href="#programare" data-srv="Venus Viva – radiofrecvență fracționată">Programează-te pentru Venus Viva</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="cauze">De ce apar vergeturile pe sâni</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Sarcina și alăptarea</b><p>Sânii se măresc repede în pregătirea pentru alăptare, iar pielea nu are elasticitatea să țină pasul. Hormonii din această perioadă contribuie și ei.</p></div>
  <div class="rx-card"><i>02</i><b>Pubertatea</b><p>Sânii cresc rapid, iar pielea nu se adaptează întotdeauna la același ritm. La această vârstă sunt normale și, de obicei, devin mult mai puțin vizibile în timp.</p></div>
  <div class="rx-card"><i>03</i><b>Fluctuațiile de greutate</b><p>Îngrășarea sau slăbirea bruscă modifică volumul sânilor. Efectul e mai vizibil dacă pielea nu e hidratată sau alimentația nu o susține.</p></div>
</div>
<p>Contează și <b>genetica</b>: dacă în familia ta sunt persoane cu vergeturi, e posibil să apară și la tine. Iar schimbările hormonale din pubertate, sarcină sau menopauză pot favoriza apariția lor pe sâni sau în alte zone.</p>

<h2 id="tratamente">Ce tratamente există pentru vergeturi</h2>
<p>Înainte de toate: dacă nu te deranjează, poți alege să le accepți. Sunt parte din schimbările prin care a trecut corpul tău. Dacă vrei să le estompezi, iată opțiunile, de la îngrijirea de acasă la tratamentele din clinică.</p>
<div class="rx-two">
  <div><h3>Acasă</h3><ul><li><b>Creme cu retinoizi sau acid hialuronic</b>: retinoizii susțin producția de colagen, acidul hialuronic hidratează. Ajută mai ales pe vergeturile noi. Întreabă medicul înainte să folosești retinoizi, mai ales în sarcină sau alăptare.</li><li><b>Uleiuri și masaj</b>: ulei de migdale dulci, cocos sau trandafir, cu un masaj ușor zilnic, pot îmbunătăți elasticitatea pielii. Nu fac minuni, dar ajută.</li></ul></div>
  <div><h3>În clinică</h3><ul><li><b>Radiofrecvența și microneedlingul</b> stimulează pielea să se refacă și să producă colagen nou.</li><li><b>Laserul fracționat</b> ajută la refacerea pielii din interior, cu rezultate după câteva ședințe.</li><li><b>Lumina intens pulsată</b> estompează mai ales culoarea vergeturilor noi.</li><li><b>Peelingul chimic</b>, carboxiterapia sau biodermogeneza pot îmbunătăți textura și aspectul zonei.</li></ul></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Tratamentele pot face vergeturile mai puțin vizibile, cu un ton și o textură mai uniforme ale pielii. Niciunul nu le elimină complet, cu excepția intervenției chirurgicale. Cât de mult se estompează depinde de vechimea lor, de tipul de piele și de numărul de ședințe, iar medicul îți spune la consult la ce te poți aștepta.</p></aside>

<h2 id="preventie">Cum previi apariția vergeturilor pe sâni</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Hidratare, din exterior și din interior</b><p>O cremă hidratantă cu vitamine, aplicată zilnic, și lichide suficiente (aproximativ 2 litri pe zi) ajută pielea să rămână elastică.</p></div>
  <div class="rx-card"><i>02</i><b>Greutate stabilă</b><p>Fluctuațiile mari de greutate întind sau lasă pielea. O greutate constantă reduce acest efect.</p></div>
  <div class="rx-card"><i>03</i><b>Alimentație și mișcare</b><p>Alimentele bogate în vitaminele C și E susțin pielea, iar exercițiile pentru mușchii din jurul sânilor îmbunătățesc circulația și fermitatea zonei.</p></div>
</div>

<h2 id="la-moa">Tratamentul vergeturilor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul dermatologic</b><p>Medicul examinează vergeturile, stabilește cât de vechi sunt, îți verifică istoricul (sarcină, alăptare, tratamente) și îți spune ce tratament are sens.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul de tratament</b><p>Primești o recomandare clară: ce procedură, câte ședințe și la ce rezultat realist te poți aștepta.</p></li>
  <li><b>Ședințele</b><p>De exemplu, Venus Viva folosește radiofrecvență fracționată pentru a stimula refacerea pielii din zona tratată.</p>${pVerg ? `<em>Venus Viva pentru cicatrici/vergeturi · ${lei(pVerg)}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>După o serie de ședințe, medicul discută cu tine ce s-a schimbat și dacă merită continuat.</p></li>
</ol>
<p class="rx-links">Află mai multe despre ${link('venus-viva', 'Venus Viva')} și ${link('microneedeling', 'microneedling')}, sau citește ce trebuie să știi despre <a href="/nou/recuperare-dupa-dermapen/">recuperarea după Dermapen</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Vergeturile sunt semne ale schimbărilor prin care a trecut corpul tău. Dacă îți afectează încrederea, le poți face mai puțin vizibile, iar primul pas este o discuție cu medicul, care îți spune sincer la ce te poți aștepta.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu (vergeturi noi sau vechi)
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
    lede: 'Ce sunt vergeturile de pe sâni, cum le deosebești pe cele noi de cele vechi, de ce apar și ce tratamente le pot estompa. Cu o verificare rapidă și pașii tratamentului la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
