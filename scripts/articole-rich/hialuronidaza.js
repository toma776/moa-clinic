// Versiunea structurată a articolului „Hialuronidaza – ce este și cum ajută în tratamentele estetice”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva nemulțumit de un filler cu acid hialuronic:
// răspunsul scurt → ce este → când se folosește → ce trebuie să-i spui medicului (verificare rapidă) → riscuri → pașii la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este hialuronidaza'],
    ['cum-actioneaza', 'Cum acționează'],
    ['cand', 'Când se folosește'],
    ['verificare', 'Ce trebuie să știe medicul'],
    ['riscuri', 'Efecte secundare și contraindicații'],
    ['la-moa', 'Procedura la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cât de repede se vede efectul?', 'Efectul este rapid: uneori se observă în primele minute și, de obicei, este vizibil în maximum 48 de ore. Rezultatul final se evaluează după câteva zile, când trece umflătura.'],
    ['Pot dizolva acidul hialuronic imediat după injectare?', 'Da. Hialuronidaza poate fi folosită fie imediat după procedura cu filler, fie după câteva luni.'],
    ['Funcționează pe orice tip de filler?', 'Nu. Acționează doar asupra fillerelor pe bază de acid hialuronic. Substanțele de alt tip, cum este Sculptra, necesită alte abordări.'],
    ['De ce este nevoie de test cutanat?', 'Hialuronidaza are potențial alergen. Testul constă în injectarea unei cantități foarte mici în piele, pentru a verifica dacă organismul o tolerează, înainte de tratamentul propriu-zis.'],
    ['Pot elimina doar o parte din filler?', 'Da. Poți alege să elimini complet produsul sau doar să corectezi o asimetrie mică. Medicul stabilește cantitatea după evaluare.'],
    ['Ce evit după procedură?', 'Timp de 48 de ore e bine să eviți efortul fizic intens și căldura excesivă, cum sunt sauna sau soarele.'],
  ];

  const intrebariCheck = [
    ['Ești însărcinată sau alăptezi?', 'În sarcină și alăptare, injectarea cu hialuronidază nu este recomandată.'],
    ['Ai avut vreodată o reacție alergică severă la înțepături de albine sau viespi?', 'Poate exista o sensibilitate încrucișată, care crește riscul unei reacții alergice la enzimă.'],
    ['Ai alte alergii cunoscute, mai ales severe?', 'Medicul trebuie să știe istoricul complet înainte de testul cutanat.'],
    ['Nu știi ce produs ți s-a injectat sau ar putea fi altceva decât acid hialuronic?', 'Hialuronidaza acționează doar asupra acidului hialuronic. Medicul evaluează zona ca să afle cu ce lucrează.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Hialuronidaza este o <b>enzimă care dizolvă acidul hialuronic</b> injectat ca filler, total sau doar parțial.</li>
    <li>Se folosește când rezultatul pare <b>prea mult, asimetric sau nenatural</b>, când produsul a migrat sau au apărut umflături și noduli.</li>
    <li>Înainte de tratament este <b>obligatoriu un test cutanat</b>, pentru că substanța are potențial alergen.</li>
    <li>Efectul se vede, de obicei, <b>în maximum 48 de ore</b>; rezultatul final se evaluează după ce trece umflătura.</li>
    <li>Se administrează <b>doar de medic</b>, după evaluare și cu acordul tău informat. Nu acționează asupra fillerelor de alt tip.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este hialuronidaza</h2>
<p class="ar-first">Te privești în oglindă după o injectare cu acid hialuronic și, în locul încrederii pe care o așteptai, simți regret: buzele par prea pline, pomeții sunt asimetrici sau chipul nu mai arată natural. Senzația de „prea mult” e mai frecventă decât crezi și ține, de multe ori, de o tehnică nepotrivită sau de migrarea produsului.</p>
<p>Vestea bună este că fillerele cu acid hialuronic pot fi corectate. Hialuronidaza este o enzimă folosită în medicină încă din secolul al XIX-lea, iar în ultimele decenii a devenit soluția obișnuită în estetică pentru <b>dizolvarea fillerelor</b>. Îți permite să revii la aspectul de dinainte de procedură sau doar să ajustezi o zonă.</p>
<aside class="rx-note"><b>Un act medical, nu o procedură cosmetică</b><p>În România, substanțele injectabile pot fi administrate doar de medic, în cabinete autorizate de dermatologie sau dermato-estetică. Tratamentul se face numai după ce ți se explică beneficiile, limitele și riscurile și îți dai consimțământul informat.</p></aside>

<h2 id="cum-actioneaza">Cum acționează</h2>
<p>Injectată exact în depozitul de produs, enzima „taie” legăturile chimice ale acidului hialuronic. Acesta se fragmentează în particule mici, pe care organismul le elimină prin procesele lui naturale de drenaj.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Difuzează prin țesuturi</b><p>Conform unui studiu de specialitate (DeLorenzi, 2014), enzima difuzează prin țesuturi, așa că poate acționa și când fillerul a migrat în straturi mai profunde.</p></div>
  <div class="rx-card"><i>02</i><b>Doza contează</b><p>Nu e suficientă doar prezența enzimei: medicul stabilește o cantitate potrivită pentru zona și produsul de corectat.</p></div>
  <div class="rx-card"><i>03</i><b>Timpul variază</b><p>Cu cât cantitatea de filler este mai mare, cu atât dizolvarea durează mai mult. Contează și tipul de acid hialuronic injectat.</p></div>
</div>

<h2 id="cand">Când se folosește</h2>
<p>Fillerele sunt, în general, bine tolerate când sunt administrate corect. Există totuși situații în care dizolvarea devine necesară:</p>
<div class="rx-two">
  <div><h3>Motive estetice</h3><ul><li>umplere excesivă, cu trăsături rigide sau artificiale</li><li>asimetrii</li><li>produs plasat greșit sau migrat</li><li>volumul nou nu se armonizează cu trăsăturile tale</li></ul></div>
  <div><h3>Motive medicale</h3><ul><li>umflături persistente</li><li>sensibilitate crescută în zona injectată</li><li>reacții inflamatorii</li><li>noduli sub piele</li></ul></div>
</div>
<p>Avantajul principal este controlul: nu rămâi cu un rezultat care nu îți place. Medicul analizează însă întâi cât acid hialuronic ai, unde s-a acumulat și dacă a migrat. Uneori e nevoie de dizolvare, alteori de o corecție fină, alteori doar de o pauză. Dacă te gândești la buze, citește și <a href="/nou/acid-in-buze-exagerat/">ce faci când ai acid în buze în exces</a>.</p>

<h2 id="verificare">Ce trebuie să știe medicul: verificare rapidă</h2>
<div class="rx-check" data-check>
  <div class="rx-check-head"><b>${intrebariCheck.length} întrebări cu da sau nu</b><span>Nu pune un diagnostic. Îți arată doar ce e important să-i spui medicului la consult.</span></div>
  <div class="rx-check-prog"><i></i></div>
  <ol class="rx-qs">${intrebariCheck.map(([q, why], i) => `<li data-q="${i}"${i ? ' hidden' : ''}><p class="rx-q"><small>Întrebarea ${i + 1} din ${intrebariCheck.length}</small>${esc(q)}</p><div class="rx-ans"><button type="button" data-a="da">Da</button><button type="button" data-a="nu">Nu</button></div><p class="rx-why2" hidden>${esc(why)}</p></li>`).join('')}</ol>
  <div class="rx-res" data-res="da" hidden><b>Spune-i medicului de la început.</b><p>Ai răspuns „da” la cel puțin o întrebare. Nu înseamnă neapărat că dizolvarea e exclusă, dar medicul trebuie să știe aceste lucruri înainte de testul cutanat și de orice injectare.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează consultul${consultPret ? ` · ${lei(consultPret)}` : ''}</a></div>
  <div class="rx-res" data-res="nu" hidden><b>Nu ai niciuna dintre situațiile de mai sus.</b><p>Pasul următor este evaluarea: medicul analizează zona și tipul de filler, face testul cutanat și îți explică ce opțiuni ai.</p><a class="btn btn-gold" href="#programare" data-srv="${esc(consultNume)}">Programează evaluarea</a></div>
  <button type="button" class="rx-reset" hidden>Reia verificarea</button>
</div>

<h2 id="riscuri">Efecte secundare și contraindicații</h2>
<p>Ca orice tratament medical, injectarea cu hialuronidază cere prudență. Cercetările arată că efectele secundare sunt, în general, puține, iar reacțiile alergice severe sunt rare, cu condiția testării prealabile.</p>
<div class="rx-two">
  <div><h3>Reacții posibile</h3><ul><li>roșeață ușoară</li><li>mici vânătăi</li><li>sensibilitate trecătoare</li><li>umflătură sau mâncărime locală</li></ul><p>De obicei dispar în câteva zile.</p></div>
  <div><h3>Când nu se recomandă</h3><ul><li>sarcină sau alăptare</li><li>alergii severe la înțepături de albine sau viespi</li><li>reacție la testul cutanat</li></ul></div>
</div>
<div class="rx-alert"><b>După procedură:</b> evită efortul fizic intens și căldura excesivă (saună, soare) timp de 48 de ore. Dacă umflătura sau mâncărimea se accentuează în loc să scadă, anunță medicul.</div>

<h2 id="la-moa">Dizolvarea fillerului la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Discuți deschis cu medicul. Acesta evaluează zona, tipul de filler folosit și istoricul tău medical și îți explică beneficiile, limitele și riscurile.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Testul cutanat</b><p>O cantitate foarte mică de substanță se injectează în piele, pentru a verifica eventualele reacții alergice. Injectarea propriu-zisă se face doar după evaluarea rezultatului.</p></li>
  <li><b>Procedura</b><p>Pielea se dezinfectează, se aplică o cremă anestezică, iar enzima se injectează precis în zona vizată. La final se aplică gheață, ca să limiteze umflătura.</p></li>
  <li><b>Reevaluarea</b><p>După câteva zile, când edemul a trecut, medicul vede rezultatul și discută cu tine dacă mai e nevoie de o corecție${id('injectari-acid-hialuronic') ? ` sau, mai târziu, de o nouă injectare cu ${link('injectari-acid-hialuronic', 'acid hialuronic')}` : ''}.</p></li>
</ol>
<p class="rx-links">Citește și <a href="/nou/de-ce-nu-imi-tine-acidul-hialuronic-2/">de ce nu îți ține acidul hialuronic</a>, <a href="/nou/forme-de-buze-cu-acid-hialuronic/">formele de buze cu acid hialuronic</a> sau vezi pagina despre ${link('augmentare-buze', 'augmentarea buzelor')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Un filler care nu arată cum ți-ai dorit poate fi corectat. Primul pas este să afli exact ce se întâmplă în zona respectivă, iar decizia de dizolvare, corecție sau pauză se ia împreună cu medicul.</p>
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
    lede: 'Ce este hialuronidaza, cum dizolvă un filler cu acid hialuronic și când se folosește. Cu o verificare rapidă a ce trebuie să știe medicul și pașii procedurii la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
