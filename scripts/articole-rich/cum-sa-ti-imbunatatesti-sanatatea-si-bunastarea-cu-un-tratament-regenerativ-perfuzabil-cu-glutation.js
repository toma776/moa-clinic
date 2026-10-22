// Versiunea structurată a articolului „Tratamentul regenerativ perfuzabil cu glutation”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care se gândește la o perfuzie cu glutation:
// răspunsul scurt → ce sunt antioxidanții și ce face glutationul → antiaging → unde se studiază (file pe domenii) → semne de nivel scăzut → siguranță → la MOA → întrebări.
// Bolile din textul original sunt prezentate ca direcții de cercetare, nu ca indicații de tratament. Fără superlative și fără rezultate promise (Decizia CMR 20/2025).
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
    ['ce-este', 'Ce este tratamentul cu glutation'],
    ['antioxidanti', 'Antioxidanți și radicali liberi'],
    ['beneficii', 'Ce face glutationul'],
    ['antiaging', 'Glutationul și îmbătrânirea'],
    ['cercetari', 'Unde se studiază glutationul'],
    ['siguranta', 'Efecte secundare și precauții'],
    ['la-moa', 'Perfuzia cu glutation la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Ce este glutationul?', 'Este o moleculă formată din trei aminoacizi (cisteină, glicină și acid glutamic) care acționează ca antioxidant și agent de detoxifiere în celule. Neutralizează radicalii liberi și participă la detoxifiere, la reglarea răspunsului imun și la menținerea structurii proteinelor.'],
    ['Când poate fi recomandată perfuzia cu glutation?', 'Medicul o poate recomanda persoanelor cu oboseală cronică, imunitate slăbită, inflamații recurente sau probleme ale pielii, după un consult.'],
    ['Ce efecte secundare pot apărea?', 'Efectele secundare sunt de obicei minore: greață ușoară, dureri de cap sau, mai rar, reacții alergice la substanța din perfuzie. De aceea perfuzia se face într-un centru medical, cu personal pregătit și trusă de urgență.'],
    ['Cum mă pregătesc pentru perfuzie?', 'Începi cu un consult, în care medicul îți evaluează starea de sănătate și stabilește planul. Apoi urmezi instrucțiunile primite despre alimentație, hidratare și alte recomandări specifice.'],
    ['Perfuzia tratează bolile cronice?', 'Nu înlocuiește tratamentul unei boli. Glutationul este studiat în mai multe afecțiuni, iar medicul poate discuta cu tine dacă are sens ca parte dintr-un plan, alături de tratamentul pe care îl urmezi.'],
    ['De ce perfuzie și nu supliment?', 'Prin perfuzie, glutationul ajunge direct în sânge, fără să treacă prin digestie, unde o parte se poate descompune.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Glutationul este un <b>antioxidant produs în mod natural</b> în aproape toate celulele. Nivelul lui scade cu vârsta, stresul, poluarea și alimentația dezechilibrată.</li>
    <li>Protejează celulele și ADN-ul de stresul oxidativ, susține <b>imunitatea, detoxifierea și producția de energie</b> din mitocondrii.</li>
    <li>Prin perfuzie, glutationul ajunge <b>direct în sânge</b>, fără să treacă prin digestie.</li>
    <li>Este studiat în mai multe afecțiuni cronice, dar <b>nu înlocuiește tratamentul</b> unei boli.</li>
    <li>La MOA, perfuzia se face <b>după un consult</b>, într-un cadru medical${pret('glutation') ? `, de la ${lei(pret('glutation'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este tratamentul regenerativ cu glutation perfuzabil</h2>
<p class="ar-first">Trăim mai mult decât generațiile dinainte, dar o viață mai lungă nu înseamnă neapărat și una sănătoasă. Mișcarea, alimentația potrivită și, la nevoie, suplimentele contează. Perfuzia cu glutation este una dintre terapiile prin care poți susține organismul din interior.</p>
<p>Glutationul este prezent în mod natural în majoritatea celulelor, dar nivelul lui poate scădea din cauza stresului, a poluării, a alimentației nesănătoase și a trecerii timpului. În tratamentul regenerativ, glutationul se administrează <b>prin perfuzie</b>, pentru protecție antioxidantă și detoxifiere la nivel celular.</p>
<div class="rx-why">
  <span class="rx-why-h">Ce scade nivelul de glutation</span>
  <ul class="rx-chips rx-chips-neg"><li>înaintarea în vârstă</li><li>stresul</li><li>poluarea</li><li>alimentația nesănătoasă</li></ul>
</div>

<h2 id="antioxidanti">Ce sunt antioxidanții și radicalii liberi</h2>
<p>Radicalii liberi sunt molecule instabile care conțin oxigen și au un electron nepereche. Ca să devină stabile, „fură” electroni din celulele noastre și le deteriorează. <b>Antioxidanții</b> le pot dona un electron și opresc acest proces.</p>
<p>Corpul păstrează un echilibru fin între cele două. Când radicalii liberi depășesc antioxidanții, apare <b>stresul oxidativ</b>, care deteriorează ADN-ul și proteinele din celule. Multe semne ale îmbătrânirii, cum sunt liniile fine și ridurile, și multe afecțiuni cronice sunt asociate cu acest dezechilibru.</p>

<h2 id="beneficii">Ce face glutationul în organism</h2>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Protejează celulele</b><p>Apără celulele și ADN-ul de daunele provocate de stresul oxidativ și de radicalii liberi.</p></div>
  <div class="rx-card"><i>02</i><b>Susține imunitatea și detoxifierea</b><p>Ajută sistemul imunitar și susține eliminarea unor substanțe precum metalele grele și alte toxine.</p></div>
  <div class="rx-card"><i>03</i><b>Susține energia celulară</b><p>Protejează mitocondriile, „centralele” celulelor, și le ajută să producă energie.</p></div>
</div>

<h2 id="antiaging">Glutationul și îmbătrânirea</h2>
<p>Glutationul este unul dintre antioxidanții principali ai organismului și are rol în menținerea sănătății celulare. Pe lângă protecția celulelor, rolul lui în detoxifiere ajută la prevenirea acumulării de toxine care pot contribui la stresul oxidativ. Pe măsură ce îmbătrânim, nivelul lui scade, iar multe semne ale îmbătrânirii sunt asociate cu un nivel scăzut de glutation.</p>
<p>La MOA, glutationul intră în plan în două moduri: direct, prin ${link('glutation', 'perfuziile cu glutation')}, și indirect, prin ${link('autohemoterapia', 'autohemoterapia majoră cu ozon')}, care poate stimula producția proprie de glutation.</p>
<div class="rx-why">
  <span class="rx-why-h">Semne care pot apărea când glutationul este scăzut</span>
  <ul class="rx-chips rx-chips-neg"><li>oboseală</li><li>„ceață” mentală</li><li>probleme de somn</li><li>infecții frecvente</li><li>anemie</li><li>pierderea coordonării</li></ul>
</div>
<p>Aceste semne pot avea multe alte cauze. Nivelul de glutation se poate măsura în sânge, iar medicul le interpretează împreună cu istoricul tău.</p>

<h2 id="cercetari">Unde se studiază glutationul</h2>
<p>Glutationul a fost folosit și studiat în mai multe afecțiuni cronice, care pot scurta viața sau îi pot scădea calitatea. Alege un domeniu ca să vezi ce s-a observat.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Ficat</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Metabolism</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Piele și imunitate</button>
    <button type="button" role="tab" aria-selected="false" data-tab="3">Circulație și respirație</button>
    <button type="button" role="tab" aria-selected="false" data-tab="4">Sistem nervos</button>
  </div>
  <div class="rx-panel" data-panel="0"><p><b>Boala ficatului gras</b> (alcoolică și non-alcoolică) apare când se depune prea multă grăsime în ficat, care se inflamează. Un studiu a observat că glutationul administrat în doze mari a îmbunătățit rezultatele unor teste hepatice, chiar și la câteva luni după tratament.</p></div>
  <div class="rx-panel" data-panel="1" hidden><p>Se studiază efectul glutationului asupra <b>rezistenței la insulină</b> și asupra daunelor produse de <b>diabetul necontrolat</b>. Stresul oxidativ este asociat cu diabetul, hipertensiunea și bolile inflamatorii.</p></div>
  <div class="rx-panel" data-panel="2" hidden><p>În <b>psoriazis</b>, o afecțiune autoimună în care celulele pielii se acumulează în scuame și pete uscate care provoacă mâncărime, glutationul poate ameliora simptomele. În bolile autoimune, precum <b>lupusul</b>, inflamația cronică crește stresul oxidativ și afectează mitocondriile; glutationul poate susține organismul în acest context.</p></div>
  <div class="rx-panel" data-panel="3" hidden><p>În <b>boala arterială periferică</b>, plăcile depuse îngustează vasele de sânge ale picioarelor și pot provoca dureri la mers; glutationul poate îmbunătăți mobilitatea. Este studiat și în <b>bolile respiratorii</b>, inclusiv boala pulmonară obstructivă cronică (BPOC) și fibroza chistică.</p></div>
  <div class="rx-panel" data-panel="4" hidden><p>În <b>boala Parkinson</b>, glutationul este studiat pentru ameliorarea simptomelor.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Rolul glutationului ca antioxidant este bine documentat. Rezultatele din afecțiunile de mai sus sunt însă direcții de cercetare, nu indicații de tratament, iar efectul unei perfuzii diferă de la o persoană la alta. Dacă ai o boală cronică, perfuzia nu înlocuiește tratamentul tău, iar decizia se ia împreună cu medicul.</p></aside>

<h2 id="siguranta">Efecte secundare și precauții</h2>
<p>Terapia cu glutation este considerată sigură și bine tolerată de majoritatea persoanelor. Pot apărea însă efecte secundare minore:</p>
<ul class="rx-chips rx-chips-neg"><li>greață ușoară</li><li>dureri de cap</li><li>reacții alergice la substanța din perfuzie</li></ul>
<div class="rx-alert"><b>Perfuziile se fac doar într-un centru medical,</b> cu personal specializat și trusă de urgență, respectând doza stabilită de medic. Spune imediat asistentei dacă, în timpul perfuziei, ai dificultăți de respirație, erupții pe piele sau te simți rău.</div>

<h2 id="la-moa">Perfuzia cu glutation la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Un medic specializat în terapii perfuzabile îți evaluează starea de sănătate, discută cu tine obiectivele și așteptările și stabilește un plan personalizat.</p>${consultPret ? `<em>${esc(consultNume.replace(/\s*\(.*\)$/, ''))} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Pregătirea</b><p>Urmezi instrucțiunile medicului despre alimentație, hidratare și alte recomandări specifice.</p></li>
  <li><b>Perfuzia</b><p>Glutationul se administrează în clinică, sub supraveghere, în doza stabilită de medic.</p>${pG(/therapy/i) ? `<em>Glutation Therapy · ${lei(pG(/therapy/i))}</em>` : ''}${pG(/detox/i) ? `<em>Glutation Detox Boost · ${lei(pG(/detox/i))}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>După o serie de ședințe, medicul discută cu tine ce s-a schimbat și dacă merită continuat.</p></li>
</ol>
<p class="rx-links">Citește și ghidul <a href="/nou/glutation-beneficii-si-contraindicatii-ce-este/">Glutation: ce este, beneficii și contraindicații</a>, despre ${link('terapia-nad', 'terapia NAD+')} sau despre <a href="/nou/longevitate/program/">programul Global Antiaging</a>, coordonat de ${dr ? `<a href="/nou/medici/${esc(dr.id)}/">${esc(dr.nume)}</a>` : 'medicul gerontolog'}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Perfuzia cu glutation poate susține imunitatea, detoxifierea și energia celulară, ca parte dintr-un stil de viață echilibrat. Înainte de a începe, discută cu medicul, ca planul să fie potrivit pentru tine.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Perfuzii cu glutation">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pe domeniile în care se studiază glutationul
(() => {
  document.querySelectorAll('[data-tabs]').forEach((t) => {
    const bs = [...t.querySelectorAll('[role=tab]')], ps = [...t.querySelectorAll('[data-panel]')];
    bs.forEach((b) => b.addEventListener('click', () => { bs.forEach((x) => x.setAttribute('aria-selected', x === b)); ps.forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.tab)); }));
  });
})();`;

  return {
    toc,
    html,
    script,
    faq,
    lede: 'Ce este tratamentul regenerativ cu glutation, ce fac antioxidanții și ce se știe, onest, despre rolul glutationului în îmbătrânire și în bolile cronice. Cu pașii perfuziei la MOA.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 8,
  };
};
