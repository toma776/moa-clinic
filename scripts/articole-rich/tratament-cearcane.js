// Versiunea structurată a articolului „Tratament cearcăne”.
// Conținutul de pe site-ul vechi, reorganizat după cum citește cineva care vrea să scape de cearcăne:
// răspunsul scurt → ce sunt și de ce apar → ce tip ai (file interactive) → ce poți face acasă → tratamente în clinică → la MOA → întrebări.
// Formulări fără superlative și fără rezultate promise (Decizia CMR 20/2025). Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => (id(sid) ? minPrice(sid) : null);
  const blef = serv.blefaroplastie?.preturi || [];
  const pBlefInf = blef.find((p) => /inferioar/i.test(p.nume))?.valoare;
  const consultNume = 'Consultație dermatologie & dermatoestetică';
  const consultPret = pret('consultatie-dermatoestetica-dermatologie');

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-sunt', 'Ce sunt cearcănele'],
    ['cauze', 'De ce apar'],
    ['tipuri', 'Ce tip de cearcăne ai'],
    ['acasa', 'Ce poți face acasă'],
    ['tratamente', 'Tratamente în clinică'],
    ['la-moa', 'Tratamentul la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Cearcănele sunt un semn de boală?', 'De obicei, nu. De regulă apar din cauza somnului insuficient, a predispoziției genetice, a stilului de viață sau a frecării ochilor. Contează însă tipul lor, pentru că de el depinde tratamentul.'],
    ['Dispar cearcănele dacă dorm mai mult?', 'Nu întotdeauna. Somnul insuficient poate accentua cearcănele, dar cele pigmentare sau structurale nu dispar doar cu odihnă. Nu există o tehnică minune care să le elimine complet.'],
    ['Cum știu ce tip de cearcăne am?', 'Pe scurt: tenta albăstruie sau violet, cu vase vizibile, indică cearcăne vasculare; o culoare mai închisă a pielii, cearcăne pigmentare; o zonă adâncită, cearcăne structurale. Frecvent sunt mixte, iar tipul exact îl stabilește medicul la consult.'],
    ['Ajută remediile naturale?', 'Castraveții, compresele cu ceai și masajul ușor pot ajuta, iar serurile și cremele pentru zona ochilor completează îngrijirea. Dacă nu observi diferențe, poți discuta cu medicul despre tratamentele din clinică.'],
    ['Acidul hialuronic e potrivit pentru orice cearcăn?', 'Nu. Acidul hialuronic se folosește când cearcănele sunt accentuate de lipsa volumului sau de șanțul lacrimal adâncit. Pentru zona de sub ochi se folosește un acid hialuronic cu densitate redusă, potrivit acestei zone.'],
    ['Când se recomandă blefaroplastia?', 'Atunci când cearcănele sunt accentuate de excesul de piele sau de structura pleoapei inferioare, iar tratamentele minim invazive nu pot oferi rezultatul dorit.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Cearcănele <b>nu sunt, de obicei, un semn de boală</b>, dar nici nu dispar toate dacă dormi mai mult.</li>
    <li>Apar din cauza <b>somnului insuficient, a geneticii, a stilului de viață</b> (fumat, alcool, stres) și a frecării ochilor.</li>
    <li>Există patru tipuri: <b>vasculare, pigmentare, structurale și mixte</b>. Tipul decide tratamentul.</li>
    <li>Acasă te pot ajuta compresele, masajul ușor și serurile pentru ochi. În clinică, opțiunile includ <b>polinucleotide, Jalupro Young Eye, peeling delicat, acid hialuronic</b> și, în cazurile structurale, <b>blefaroplastia</b>.</li>
    <li>Nu există o tehnică minune care să le elimine complet. La MOA, totul începe cu <b>identificarea tipului de cearcăne</b>, la consult.</li>
  </ul>
</section>

<h2 id="ce-sunt">Ce sunt cearcănele</h2>
<p class="ar-first">Ți-ai dorit vreodată să ștergi cearcănele ca pe un text de pe ecran? Nu ai nevoie de un buton „Undo”, ci de un plan potrivit tipului tău de cearcăne. Pentru asta trebuie să înțelegi întâi de unde vin.</p>
<p>Cearcănele sunt umbrele întunecate de sub pleoapele inferioare. Pot apărea ca o piele subțiată, o zonă ușor adâncită sau un ton mai închis, semn că structura pielii s-a schimbat sau că circulația nu mai este optimă. La unii persistă, la alții apar doar temporar. Sunt mai frecvente la <b>persoanele în vârstă</b> și la cele cu <b>pielea mai închisă la culoare</b>.</p>

<h2 id="cauze">De ce apar cearcănele</h2>
<div class="rx-why">
  <span class="rx-why-h">Ce le favorizează</span>
  <ul class="rx-chips rx-chips-neg"><li>predispoziția genetică</li><li>somnul insuficient</li><li>fumatul</li><li>alcoolul</li><li>stresul</li><li>frecarea ochilor</li><li>vârsta</li></ul>
</div>
<p>Dacă părinții tăi au cearcăne, este mai probabil să le ai și tu. Somnul are și el un rol: când nu dormi suficient, circulația din zona ochilor este deficitară, pielea devine palidă și vasele de sânge se văd mai ușor. Tot somnul insuficient favorizează și pungile de sub ochi.</p>

<h2 id="tipuri">Ce tip de cearcăne ai</h2>
<p>Alege descrierea apropiată de ce vezi în oglindă. Este doar un punct de plecare; tipul exact îl stabilește medicul.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Vasculare</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Pigmentare</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Structurale</button>
    <button type="button" role="tab" aria-selected="false" data-tab="3">Mixte</button>
  </div>
  <div class="rx-panel" data-panel="0"><p><b>Cum arată:</b> pielea din zona ochilor are o tentă albăstruie sau violet, este subțire și vasele de sânge se văd.</p><p><b>Ce se discută:</b> tratamente care îmbunătățesc grosimea pielii, cum sunt polinucleotidele, care reduc transparența, și produse cu antioxidanți pentru zona ochilor.</p></div>
  <div class="rx-panel" data-panel="1" hidden><p><b>Cum arată:</b> o culoare mai închisă a pielii de sub ochi, dată de excesul de melanină (pigmentul natural al pielii). Apar mai ales la persoanele cu pielea mai închisă.</p><p><b>Ce se discută:</b> un peeling chimic delicat, cu acizi blânzi potriviți zonei, și seruri cu vitamina C.</p></div>
  <div class="rx-panel" data-panel="2" hidden><p><b>Cum arată:</b> o zonă adâncită, un „șanț” sub ochi, dat de conturul natural al ochilor sau de reducerea colagenului.</p><p><b>Ce se discută:</b> acid hialuronic special pentru zona cearcănelor, când lipsește volum, sau blefaroplastie inferioară, când există exces de piele sau o problemă de structură a pleoapei.</p></div>
  <div class="rx-panel" data-panel="3" hidden><p><b>Cum arată:</b> o combinație a tipurilor de mai sus. Sunt adesea cele mai frecvente.</p><p><b>Ce se discută:</b> un plan care combină mai multe tratamente, stabilit de medic după ce identifică ce predomină.</p></div>
</div>

<h2 id="acasa">Ce poți face acasă</h2>
<p>Remediile naturale pot fi primul pas: <b>castraveții, compresele cu ceai și masajul ușor</b> în zona ochilor. Le poți completa cu seruri, creme și plasturi pentru ochi, alese după ce urmărești:</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Vitamina C</b><p>Pentru redarea luminozității zonei.</p></div>
  <div class="rx-card"><i>02</i><b>Peptide și acid hialuronic</b><p>Pentru hidratarea pielii subțiri de sub ochi.</p></div>
  <div class="rx-card"><i>03</i><b>Antioxidanți</b><p>Pentru stimulare vasculară, când cearcănele sunt de tip vascular.</p></div>
</div>

<h2 id="tratamente">Tratamente pentru cearcăne în clinică</h2>
<p>Dacă remediile de acasă nu ajută, există tratamente minim invazive. Alegerea depinde de tipul cearcănelor:</p>
<div class="rx-compare">
  <div class="rx-col"><small>Polinucleotide</small><b>Regenerează pielea subțire</b><dl><dt>Ce sunt</dt><dd>fragmente de ADN purificat</dd><dt>Ce urmăresc</dt><dd>activează fibroblastele (colagen și elastină), îngroașă pielea, cresc hidratarea</dd><dt>Potrivite pentru</dt><dd>cearcăne albăstrui, piele transparentă</dd></dl>${id('polinucleotide') ? `<a class="link-u" href="${esc(live('polinucleotide'))}">Despre polinucleotide →</a>` : ''}</div>
  <div class="rx-col"><small>Jalupro Young Eye</small><b>Formulă pentru zona ochilor</b><dl><dt>Ce conține</dt><dd>acid hialuronic, peptide și aminoacizi esențiali</dd><dt>Ce urmărește</dt><dd>reface discret volumul, netezește ridurile fine, luminează zona</dd><dt>Potrivit pentru</dt><dd>aspect întunecat dat de oboseală sau deshidratare</dd></dl>${id('jalupro-young-eye') ? `<a class="link-u" href="${esc(live('jalupro-young-eye'))}">Despre Jalupro Young Eye →</a>` : ''}</div>
  <div class="rx-col"><small>Acid hialuronic</small><b>Pentru lipsa de volum</b><dl><dt>Ce este</dt><dd>acid hialuronic cu densitate redusă, pentru zona cearcănelor</dd><dt>Ce urmărește</dt><dd>un contur natural între pleoapă și pomeți, mai puțină adâncime</dd><dt>Potrivit pentru</dt><dd>șanț lacrimal adâncit, cearcăne structurale</dd></dl>${id('injectari-acid-hialuronic') ? `<a class="link-u" href="${esc(live('injectari-acid-hialuronic'))}">Despre acidul hialuronic →</a>` : ''}</div>
</div>
<div class="rx-two">
  <div><h3>Peeling chimic delicat</h3><p>Cu acizi blânzi, potriviți zonei ochilor. Exfoliază fin stratul superficial, uniformizează pigmentul, îmbunătățește textura și redă luminozitatea. Se potrivește când cearcănele sunt date de pigmentare sau de o textură neregulată.</p></div>
  <div><h3>Blefaroplastie inferioară</h3><p>Când cearcănele sunt accentuate de excesul de piele sau de structura pleoapei. Intervenția îndepărtează pielea în exces și repoziționează sau reduce depozitele de grăsime. Se recomandă când tratamentele minim invazive nu pot oferi rezultatul dorit.</p></div>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Nu toate cearcănele sunt la fel și nu există o tehnică care să le elimine complet. Tratamentele precum polinucleotidele lucrează treptat, pe măsură ce pielea se reface, iar rezultatul diferă de la o persoană la alta. De aceea, la MOA începem cu identificarea tipului de cearcăne.</p></aside>

<h2 id="la-moa">Tratamentul cearcănelor la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul identifică tipul cearcănelor (vascular, pigmentar, structural sau mixt) și discută cu tine opțiunile potrivite.</p>${consultPret ? `<em>Consultație dermatologie · ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Planul de tratament</b><p>Stabilim împreună un plan: un singur tratament sau o combinație, în funcție de ce predomină.</p></li>
  <li><b>Procedura</b><p>Tratamentul ales se face în clinică, cu produse potrivite pielii subțiri și sensibile din jurul ochilor.</p>${pret('jalupro-young-eye') ? `<em>Jalupro Young Eye · de la ${lei(pret('jalupro-young-eye'))}</em>` : ''}${pret('polinucleotide') ? `<em>Polinucleotide · de la ${lei(pret('polinucleotide'))}</em>` : ''}${id('blefaroplastie') && pBlefInf ? `<em>Blefaroplastie inferioară · ${lei(pBlefInf)}</em>` : ''}</li>
  <li><b>Reevaluarea</b><p>Medicul urmărește cum a răspuns zona și dacă planul trebuie ajustat.</p></li>
</ol>
<p class="rx-links">Citește și ghidul despre <a href="/nou/cearcane/">cearcăne și pungi sub ochi</a> și articolul despre <a href="/nou/pungi-sub-ochi/">pungile sub ochi</a>. Pentru cazurile structurale, vezi pagina despre ${link('blefaroplastie', 'blefaroplastie')}.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Nu toate cearcănele sunt la fel: tipul lor (vascular, pigmentar, structural sau mixt) decide tratamentul. Dacă îngrijirea de acasă nu te ajută, un consult te ajută să alegi planul potrivit pentru tine.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="${esc(consultNume)}">Programează un consult</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file pentru tipurile de cearcăne
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
    lede: 'De ce apar cearcănele, cum recunoști tipul lor și ce tratamente se potrivesc fiecărui tip, de la îngrijirea de acasă la polinucleotide, acid hialuronic sau blefaroplastie.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
