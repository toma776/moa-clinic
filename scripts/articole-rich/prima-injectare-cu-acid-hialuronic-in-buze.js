// Versiunea structurată a articolului „Prima injectare cu acid hialuronic în buze: ghid”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva emoționat înaintea primei proceduri:
// răspunsul scurt → ce este și de ce se folosește → ți se potrivește (verificare rapidă) → cum te pregătești → cum decurge la MOA → reguli după → efecte și retuș → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';
  const pBuze = pret('augmentare-buze');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este acidul hialuronic'],
    ['potrivit', 'Ți se potrivește? Verificare rapidă'],
    ['inainte', 'Cum te pregătești'],
    ['la-moa', 'Prima injectare la MOA'],
    ['dupa', 'Reguli după injectare'],
    ['efecte', 'Efecte, durată și retuș'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Doare injectarea cu acid hialuronic în buze?', 'Înainte de injectare, medicul aplică o cremă anestezică, iar acul folosit este foarte subțire, așa că disconfortul este de obicei redus. Sensibilitatea diferă de la o persoană la alta.'],
    ['Cât durează procedura?', 'De obicei până la 30 de minute. La prima vizită poate dura puțin mai mult, de exemplu dacă e nevoie de o ajustare.'],
    ['Cât durează efectul?', 'Câteva luni, de obicei între 6 și 12. Depinde de vârstă, metabolism, stil de viață, tipul de produs, cantitatea folosită și de cât de atent respecți recomandările de după.'],
    ['Ce fac dacă nu îmi place rezultatul?', 'Acidul hialuronic poate fi ajustat, iar la nevoie poate fi dizolvat, în timpul procedurii sau la o vizită ulterioară. În plus, efectul se reduce treptat, iar tu decizi dacă îl menții.'],
    ['De la ce vârstă se poate face?', 'Recomandăm augmentarea buzelor de la minimum 21 de ani, la persoanele sănătoase, fără contraindicații și cu așteptări realiste.'],
    ['Am avut herpes. Pot face procedura?', 'Spune-i medicului la consult. Îți poate recomanda un tratament de prevenție înainte de injectare.'],
  ];

  const intrebariCheck = [
    ['Ești însărcinată sau alăptezi?', 'Augmentarea buzelor nu se face în sarcină și alăptare.'],
    ['Ai o boală autoimună?', 'Bolile autoimune sunt o contraindicație; medicul discută cu tine situația ta.'],
    ['Ai acum o infecție în zona gurii?', 'Infecțiile din zona gurii sunt o contraindicație; medicul îți spune când se poate face procedura.'],
    ['Ai avut vreodată o reacție alergică la un filler sau la acid hialuronic?', 'Alergia la substanța injectată este o contraindicație.'],
    ['Ai sub 21 de ani?', 'Recomandăm augmentarea buzelor de la minimum 21 de ani.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Acidul hialuronic există deja în organism, așa că este, în general, <b>bine tolerat</b>; reacțiile sunt de obicei ușoare și trec în câteva zile.</li>
    <li>Procedura durează <b>până la 30 de minute</b>, cu cremă anestezică și un ac foarte subțire.</li>
    <li>Efectul durează <b>câteva luni</b> și este <b>reversibil</b>: poate fi ajustat sau, la nevoie, dizolvat.</li>
    <li>Nu se face în <b>sarcină, alăptare, boli autoimune, infecții în zona gurii</b> sau în caz de alergie la substanță; recomandăm vârsta de minimum 21 de ani.</li>
    <li>La MOA, prima injectare începe cu <b>o consultație</b> în care stabiliți împreună forma și cantitatea${pBuze ? `; augmentarea pornește de la ${lei(pBuze)}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este acidul hialuronic și cum acționează în buze</h2>
<p class="ar-first">Te gândești la prima injectare cu acid hialuronic în buze, dar îți e teamă: de ac, de reacții, de „ce vor spune ceilalți”. Este firesc. Ca să decizi liniștit(ă), merită să știi ce se întâmplă de fapt, cine poate face procedura și ce reguli contează după.</p>
<p>Acidul hialuronic este o substanță prezentă în mod natural în organism, care menține pielea hidratată și elastică. Injectat în buze, le poate da <b>volum, contur și un aspect mai uniform</b>, păstrând un rezultat natural atunci când nu se exagerează.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Discret și natural</b><p>Mărește buzele moderat și le dă formă, fără efectul de „prea mult”, dacă cantitatea este potrivită.</p></div>
  <div class="rx-card"><i>02</i><b>Reversibil și ajustabil</b><p>Efectul se reduce treptat în câteva luni. Poate fi corectat în timpul procedurii sau la o vizită ulterioară și, la nevoie, dizolvat.</p></div>
  <div class="rx-card"><i>03</i><b>Hidratare</b><p>Reține apa în țesuturi, așa că buzele arată mai hidratate și mai netede.</p></div>
</div>
<p>Același tip de substanță se folosește și în alte tratamente, de exemplu pentru ridurile din jurul ochilor, al gurii sau de pe gât.</p>

<h2 id="potrivit">Ți se potrivește? Verificare rapidă</h2>
<p>Recomandăm prima injectare persoanelor de <b>minimum 21 de ani</b>, sănătoase, fără contraindicații și cu <b>așteptări realiste</b>: scopul este să îmbunătățești aspectul buzelor, nu să exagerezi volumul.</p>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>5 întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar dacă e bine să discuți întâi cu medicul.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Discută întâi cu medicul.</b><p>Ai răspuns „da” la cel puțin o întrebare. În unele situații procedura doar se amână, în altele nu este recomandată. Medicul îți explică la consult ce înseamnă pentru tine.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre contraindicațiile frecvente.</b><p>Următorul pas este consultul dinaintea procedurii, în care medicul analizează buzele și stabilește cu tine forma și cantitatea potrivite. Dacă ai avut vreodată herpes, spune-i atunci.</p><a class="btn btn-gold" href="#programare" data-srv="Augmentare buze">Programează-te pentru augmentare</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="inainte">Cum te pregătești pentru prima injectare</h2>
<p>Pregătirea influențează cât de bine decurge procedura și cât de repede trec umflătura și vânătăile. Îți recomandăm să eviți:</p>
<div class="rx-why">
  <span class="rx-why-h">Înainte de procedură</span>
  <ul class="rx-chips rx-chips-neg"><li>antiinflamatoarele, cu 1–2 săptămâni înainte</li><li>suplimentele cu ginkgo biloba sau omega-3</li><li>alcoolul și cafeaua, cu 48 de ore înainte</li><li>programarea în timpul menstruației</li></ul>
</div>
<p>Dacă iei medicamente prescrise, nu le întrerupe singur(ă): spune-i medicului la consult ce iei.</p>

<h2 id="la-moa">Prima injectare cu acid hialuronic la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultația</b><p>Discutați ce îți dorești și cum îți imaginezi rezultatul. Medicul analizează forma și proporțiile buzelor, îți explică procedura, durata și tipul de produs potrivit. Se fac câteva fotografii, ca punct de plecare.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Pregătirea</b><p>Medicul dezinfectează zona buzelor și aplică o cremă anestezică, pentru ca disconfortul să fie minim.</p></li>
  <li><b>Injectarea</b><p>Acidul hialuronic se injectează cu un ac foarte subțire. Procedura durează de obicei până la 30 de minute; la prima vizită poate dura puțin mai mult, dacă e nevoie de o ajustare.</p>${pBuze ? `<em>Augmentare buze · de la ${lei(pBuze)}</em>` : ''}</li>
  <li><b>După procedură</b><p>Primești recomandările pentru primele zile, iar fotografiile de la început ajută la urmărirea rezultatului în timp.</p></li>
</ol>

<h2 id="dupa">Reguli după injectarea cu acid hialuronic în buze</h2>
<p>Respectarea lor ajută rezultatul să se așeze frumos și să dureze.</p>
<div class="rx-two">
  <div><h3>Primele zile</h3><ul><li>nu atinge și nu masa buzele, mai ales în primele 24 de ore</li><li>fără efort fizic intens cel puțin 72 de ore</li><li>fără saună, solar sau băi fierbinți cel puțin 3 zile</li><li>evită alcoolul, care poate accentua umflătura</li><li>fără machiaj în zonă, în afara produselor recomandate de medic</li><li>nu-ți mușca buzele și evită să dormi pe față</li></ul></div>
  <div><h3>Primele 2 săptămâni</h3><ul><li>evită expunerea excesivă la soare</li><li>amână procedurile stomatologice și alte tratamente faciale timp de 14 zile</li><li>bea multă apă sau ceai, de preferat peste 2 litri pe zi</li><li>dacă fumezi, redu țigările în primele zile sau schimbă partea pe care ții țigara</li></ul></div>
</div>

<h2 id="efecte">Efecte secundare, durată și retuș</h2>
<p>Cele mai frecvente efecte sunt <b>umflătura și vânătăile</b>, care dispar de obicei în câteva zile. Imediat după procedură, buzele pot părea puțin rigide, dar senzația trece repede.</p>
<div class="rx-alert"><b>Sună la clinică dacă</b> umflătura sau vânătăile nu se ameliorează în câteva zile ori dacă observi ceva care te îngrijorează. Medicul îți spune dacă e nevoie să revii.</div>
<p>Efectul durează <b>câteva luni, de obicei între 6 și 12</b>, în funcție de vârstă, metabolism, stil de viață, produsul ales și cantitatea folosită. Dacă volumul scade mai devreme sau forma nu mai e uniformă, se poate discuta un retuș. Pentru menținere, medicul îți spune când are sens o nouă ședință.</p>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rezultatul nu arată la fel la toate persoanele: depinde de forma și anatomia buzelor tale. De aceea, la consult discuți deschis ce așteptări ai, iar medicul îți spune ce este realist.</p></aside>
<p class="rx-links">Dacă încă alegi forma, citește despre <a href="/nou/forme-de-buze-cu-acid-hialuronic/">formele de buze cu acid hialuronic</a>, despre <a href="/nou/acid-hialuronic-in-buze-cat-dureaza/">cât durează efectul</a> și despre <a href="/nou/hialuronidaza/">hialuronidază</a>, sau vezi ${link('augmentare-buze', 'pagina tratamentului de augmentare a buzelor')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Prima injectare cu acid hialuronic în buze vine cu emoții, dar este mai simplă când știi ce urmează. Făcută informat și cu așteptări realiste, poate fi un pas mic spre a te simți bine cu tine. Totul începe cu o discuție cu medicul.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: verificare rapidă cu da/nu a contraindicațiilor
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
    lede: 'Ce este acidul hialuronic, cine poate face prima injectare în buze, cum te pregătești și ce reguli contează după. Cu o verificare rapidă a contraindicațiilor și pașii procedurii la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
