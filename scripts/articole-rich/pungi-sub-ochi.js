// Versiunea structurată a articolului „Pungi sub ochi – soluții de reducere”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva deranjat de pungile de sub ochi:
// răspunsul scurt → de ce apar → când e semn medical (verificare rapidă) → ce poți face acasă → proceduri → prevenție → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const derm = [...trNode.entries()].find(([, l]) => l.consult && /dermatolog/i.test(l.nod.nume));
  const dermPret = derm ? pret(derm[0]) : null;
  const dermNume = derm ? derm[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const pPoli = pret('polinucleotide');
  const pSkin = pret('skinbooster-vital');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['cauze', 'De ce apar pungile sub ochi'],
    ['semne', 'Când sunt un semn medical'],
    ['acasa', 'Ce poți face acasă'],
    ['proceduri', 'Proceduri recomandate'],
    ['prevenire', 'Obiceiuri care ajută'],
    ['somn', 'Somnul contează'],
    ['la-moa', 'Evaluarea la MOA, pas cu pas'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Pungile sub ochi sunt periculoase?', 'De obicei nu. În majoritatea cazurilor sunt o problemă estetică. Dacă umflătura este dureroasă, roșie sau te mănâncă, adresează-te unui medic oftalmolog.'],
    ['Pot scăpa complet de pungile sub ochi?', 'Pungile sub ochi pot fi reduse, nu eliminate. Rezultatul diferă de la o persoană la alta, în funcție de cauză, de aspectul lor și de alte condiții.'],
    ['Ajută compresele reci?', 'Da, pot reduce inflamația și umflătura, pentru că scad fluxul de sânge din zonă. Folosește-le doar câteva minute și niciodată direct pe piele, ci înfășurate într-un prosop subțire.'],
    ['Pot folosi creme cu retinol sub ochi?', 'Cremele cu retinol sunt des folosite pentru zona de sub ochi, dar cele cu concentrație mare se folosesc doar la recomandarea unui specialist. Unele produse cu retinol nu sunt făcute pentru zona ochilor, iar în sarcină și alăptare este indicat să le eviți.'],
    ['Ce rol are sarea în alimentație?', 'Alimentele bogate în sare favorizează reținerea apei în organism, iar asta poate accentua umflăturile de sub ochi.'],
    ['Ce proceduri se pot face la clinică?', 'Medicul poate recomanda, după evaluare, tratamentul cu polinucleotide sau un skinbooster. Alegerea depinde de cauza și de aspectul pungilor.'],
  ];

  const intrebariCheck = [
    ['Umflătura de sub ochi este dureroasă?', 'Durerea nu e tipică pentru pungile obișnuite și merită evaluată de un medic oftalmolog.'],
    ['Zona este roșie?', 'Roșeața poate indica o inflamație care trebuie văzută de medic.'],
    ['Simți mâncărime în zona ochilor?', 'Mâncărimea poate ține de o alergie sau de o iritație care trebuie evaluată.'],
    ['Pungile au apărut brusc sau se agravează?', 'Schimbările rapide sunt un motiv să ceri sfatul unui medic, ca să fie excluse cauzele medicale.'],
    ['Sunt însoțite de alte simptome?', 'Când apar și alte simptome, e bine să afli cauza de la medic înainte de orice procedură estetică.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Pungile sub ochi sunt, de obicei, <b>o problemă estetică</b>, nu o afecțiune.</li>
    <li>Apar din cauza <b>somnului insuficient, a oboselii, a sării în exces, a alergiilor, a geneticii sau a înaintării în vârstă</b>.</li>
    <li>Dacă umflătura este <b>dureroasă, roșie sau te mănâncă</b>, mergi la un medic oftalmolog.</li>
    <li>Acasă pot ajuta <b>compresele reci</b> și plicurile reci de ceai negru. Cremele cu retinol concentrat se folosesc doar la recomandarea specialistului.</li>
    <li>La clinică, medicul poate recomanda <b>polinucleotide sau skinbooster</b>. Pungile pot fi reduse, nu eliminate.</li>
  </ul>
</section>

<h2 id="cauze">De ce apar pungile sub ochi</h2>
<p class="ar-first">Te uiți dimineața în oglindă și zona de sub ochi pare umflată, chiar dacă te simți bine. Pungile sub ochi pot fi deranjante, dar vestea bună este că, în cele mai multe cazuri, nu sunt efectul unei boli și pot fi diminuate cu obiceiuri simple sau cu proceduri potrivite.</p>
<p>Cauzele sunt multiple. Specialiștii în chirurgie plastică facială consideră îmbătrânirea cauza întâlnită cel mai des.</p>
<div class="rx-why">
  <span class="rx-why-h">De ce apar</span>
  <ul class="rx-chips rx-chips-neg"><li>alimentele sărate în exces</li><li>oboseala cronică</li><li>somnul insuficient</li><li>alergiile</li><li>factorul genetic</li><li>înaintarea în vârstă</li></ul>
</div>
<div class="rx-why">
  <span class="rx-why-h">Ce le poate accentua</span>
  <ul class="rx-chips rx-chips-neg"><li>deshidratarea</li><li>alergiile</li><li>fumatul</li><li>alcoolul</li></ul>
</div>
<p>Sarea favorizează reținerea apei în organism, iar inflamația provocată de alergii poate umfla zona de sub ochi. Unele persoane moștenesc pur și simplu această tendință.</p>

<h2 id="semne">Când sunt un semn medical? Verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să mergi întâi la medic.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Mergi întâi la medic.</b><p>Ai răspuns „da” la cel puțin o întrebare. Pentru umflături dureroase, roșii sau cu mâncărime, adresează-te unui medic oftalmolog. După ce sunt excluse cauzele medicale, poți discuta și opțiunile estetice la un consult dermatologic.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(dermNume)}">Programează consultul dermatologic${dermPret ? ` · ${lei(dermPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Pare o problemă estetică.</b><p>Nu ai semnele care cer un consult urgent. Dacă remediile de acasă și obiceiurile de mai jos nu ajută, medicul îți poate spune la consult ce procedură se potrivește cauzei și aspectului pungilor tale.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(dermNume)}">Programează un consult</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="acasa">Ce poți face acasă</h2>
<p>De obicei, primul pas sunt remediile simple. Multe dintre ele pot ajuta, mai ales când umflătura ține de oboseală sau de retenția de apă.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Comprese reci</b><p>Reduc inflamația și umflătura prin scăderea fluxului de sânge. Poți folosi gheață, o pungă de legume congelate sau felii reci de castravete, câteva minute, înfășurate într-un prosop subțire.</p></div>
  <div class="rx-card"><i>02</i><b>Ceai negru la plic</b><p>Plicurile răcite, aplicate pe ochii închiși. Cofeina îngustează vasele de sânge și poate reduce umflătura.</p></div>
  <div class="rx-card"><i>03</i><b>Creme cu retinol</b><p>Retinolul este înrudit cu vitamina A. Concentrațiile mari se folosesc doar la recomandarea unui specialist, iar unele produse nu sunt făcute pentru zona ochilor.</p></div>
</div>
<div class="rx-alert"><b>Dacă ești însărcinată sau alăptezi,</b> este indicat să eviți cremele și gelurile cu retinol.</div>

<h2 id="proceduri">Proceduri recomandate</h2>
<p>Dacă remediile de acasă nu ajută, poți lua în calcul o procedură, doar la recomandarea unui specialist. Alegerea depinde de cauza și de aspectul pungilor.</p>
<div class="rx-compare">
  <div class="rx-col"><small>Polinucleotide</small><b>Pentru tonusul pielii din jurul ochilor</b><dl><dt>Când se recomandă</dt><dd>cearcăne închise la culoare, piele lăsată sau lipsită de tonus</dd><dt>Cine decide</dt><dd>medicul, după evaluare</dd><dt>Preț</dt><dd>${pPoli ? `de la ${lei(pPoli)}` : 'la consult'}</dd></dl>${id('polinucleotide') ? `<a class="link-u" href="${esc(live('polinucleotide'))}">Despre polinucleotide →</a>` : ''}</div>
  <div class="rx-col"><small>Skinbooster</small><b>Pentru textura și luminozitatea pielii</b><dl><dt>Când se recomandă</dt><dd>semne de oboseală, aspect tern, textură neuniformă</dd><dt>Cine decide</dt><dd>medicul, după evaluare</dd><dt>Preț</dt><dd>${pSkin ? `de la ${lei(pSkin)}` : 'la consult'}</dd></dl>${id('skinbooster-vital') ? `<a class="link-u" href="${esc(live('skinbooster-vital'))}">Despre skinbooster →</a>` : ''}</div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Fotografiile „înainte și după” îți pot da o idee despre ce se poate obține, dar rezultatele diferă de la o persoană la alta, în funcție de cauză, de aspectul pungilor și de alte condiții. Pungile sub ochi pot fi reduse, nu eliminate, așa că e bine să pornești cu așteptări realiste.</p></aside>

<h2 id="prevenire">Obiceiuri care ajută zilnic</h2>
<div class="rx-two">
  <div><h3>Rutina de zi cu zi</h3><ul><li>bea apă și ceaiuri</li><li>spală-ți fața înainte de culcare, chiar dacă nu te-ai machiat</li><li>demachiază-te atent: fondul de ten, pudra și rimelul pot irita pielea peste noapte</li><li>dormi 7–8 ore</li><li>renunță la fumat</li></ul></div>
  <div><h3>Pe farfurie</h3><ul><li><b>vitamina C</b>: portocale, căpșuni, broccoli, ardei roșii. Ajută corpul să absoarbă acid hialuronic și susține producția de colagen.</li><li><b>fier</b>: fasole, legume cu frunze verzi, fructe uscate, mazăre.</li><li>mai puțină sare</li></ul></div>
</div>
<p>Deficitul de fier poate da cearcăne, dar el se stabilește doar prin analize.</p>

<h2 id="somn">Somnul contează</h2>
<p>Medicii recomandă 7–8 ore de somn pe noapte. Dacă insomnia devine o problemă constantă, cere ajutorul unui specialist. Până atunci, poți încerca:</p>
<ul class="rx-chips"><li>culcare la aceeași oră, inclusiv în weekend</li><li>de preferat între 22 și 23</li><li>fără cofeină după ora 14</li><li>fără masă după ora 18</li><li>fără ecrane înainte de somn</li></ul>

<h2 id="la-moa">Evaluarea la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul caută cauza pungilor, îți evaluează pielea din jurul ochilor și îți spune ce se poate reduce și ce nu.</p>${dermPret ? `<em>${esc(dermNume)} · ${lei(dermPret)}</em>` : ''}</li>
  <li><b>Planul</b><p>Dacă o procedură are sens, medicul îți recomandă varianta potrivită: polinucleotide sau skinbooster.</p></li>
  <li><b>Tratamentul</b><p>Se face în clinică, de medic, cu produsul și cantitatea stabilite la consult.</p>${pPoli ? `<em>Polinucleotide · de la ${lei(pPoli)}</em>` : ''}${pSkin ? `<em>Skinbooster · de la ${lei(pSkin)}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește cu tine rezultatul și îți spune dacă e nevoie de alte ședințe.</p></li>
</ol>
<p class="rx-links">Dacă te deranjează și culoarea închisă de sub ochi, citește <a href="/nou/cearcane/">articolul despre cearcăne și pungi sub ochi</a> sau vezi ${link('jalupro-young-eye', 'tratamentul pentru cearcăne')}. Pentru pleoapele căzute, află mai multe despre <a href="/nou/ptoza-palpebrala/">ptoza palpebrală</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Pungile sub ochi sunt rareori o problemă de sănătate, dar cauza contează: de ea depinde dacă ajung obiceiurile simple sau ai nevoie de o procedură. Dacă persistă, se agravează sau apar alte simptome, cere sfatul unui medic.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(dermNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
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
    lede: 'De ce apar pungile sub ochi, când sunt un semn medical, ce poți face acasă și ce proceduri pot ajuta. Cu o verificare rapidă care îți arată dacă e bine să mergi întâi la medic.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
