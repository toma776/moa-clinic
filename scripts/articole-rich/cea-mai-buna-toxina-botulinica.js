// Versiunea structurată a articolului „Cea mai bună toxină botulinică: rezultate după 6 luni de studiu”.
// Titlul vine din date și rămâne neschimbat; conținutul este scris neutru, fără clasamente de preparate și fără nume de branduri
// (Decizia CMR 20/2025 și regula din SPEC privind brandurile). Ordinea de citire:
// răspunsul scurt → ce este și cum acționează → de ce diferă preparatele → după ce criterii se alege (file) → cât ține → riscuri și îngrijire → la MOA → întrebări.
// Primește helperele din build-homepage.js.
module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => {
  const id = (k) => [...trNode.keys()].find((x) => x === k);
  const link = (sid, txt) => (id(sid) ? `<a href="${esc(live(sid))}">${txt}</a>` : txt);
  const pret = (sid) => minPrice(sid);
  const btx = serv['injectare-botox']?.preturi || [];
  const pB = (re) => btx.find((p) => re.test(p.nume))?.valoare;
  const consult = [...trNode.entries()].find(([, l]) => l.consult && /dermato/i.test(l.nod.nume));
  const consultPret = consult ? pret(consult[0]) : null;
  const consultNume = consult ? consult[1].nod.nume : 'Consultație dermatologie & dermatoestetică';

  const toc = [
    ['pe-scurt', 'Pe scurt'],
    ['ce-este', 'Ce este toxina botulinică'],
    ['preparate', 'De ce diferă preparatele'],
    ['alegere', 'Cum se alege preparatul'],
    ['durata', 'Cât ține efectul'],
    ['riscuri', 'Reacții adverse și îngrijire'],
    ['la-moa', 'Toxina botulinică la MOA'],
    ['intrebari', 'Întrebări frecvente'],
  ].map(([i, x]) => ({ id: i, x }));

  const faq = [
    ['Există o toxină botulinică potrivită pentru toată lumea?', 'Nu. Alegerea depinde de zona tratată, de istoricul tău medical și de rezultatul pe care îl urmărești. Rezultatul ține nu doar de produs, ci mai ales de medicul care îl administrează și de stilul tău de viață.'],
    ['Cât durează efectul?', 'De obicei între 3 și 6 luni, în funcție de preparat, de zonă, de doză și de metabolismul fiecărei persoane.'],
    ['Când se văd rezultatele?', 'Primele efecte apar în câteva zile, iar rezultatul final se vede, în general, după 10–14 zile. La unele preparate efectul se instalează mai lent.'],
    ['De ce mi-a trecut efectul mai repede?', 'Câțiva factori pot scurta durata: metabolismul rapid, expunerea frecventă la soare sau căldură (saună, solar), stresul, mișcările faciale accentuate, o doză insuficientă sau nerespectarea recomandărilor medicului.'],
    ['Se poate face retuș?', 'Da. Mai ales la prima procedură, dacă rezultatul nu este cel dorit, se poate face un retuș la câteva săptămâni, de preferat de același medic.'],
  ];

  const html = `
<section class="rx-tldr" id="pe-scurt">
  <h2>Pe scurt</h2>
  <ul>
    <li>Toxina botulinică <b>relaxează temporar mușchii</b> care formează ridurile de expresie, iar pielea de deasupra arată mai netedă.</li>
    <li>Există <b>mai multe preparate</b>, care diferă prin difuzie, viteza de instalare și durata efectului.</li>
    <li><b>Nu există un preparat potrivit pentru oricine</b>: alegerea depinde de zona tratată, de istoricul medical și de rezultatul dorit.</li>
    <li>Efectul durează, de obicei, <b>3–6 luni</b>; rezultatul final se vede după 10–14 zile.</li>
    <li>La MOA, preparatul și doza se aleg <b>la consult, împreună cu medicul</b>${pret('injectare-botox') ? `; tratamentul pornește de la ${lei(pret('injectare-botox'))}` : ''}.</li>
  </ul>
</section>

<h2 id="ce-este">Ce este toxina botulinică și cum funcționează</h2>
<p class="ar-first">Te întrebi ce toxină botulinică ți se potrivește și care își păstrează efectul mai mult timp. Sunt întrebări pe care le auzim des în cabinet. Răspunsul cinstit este că nu există un singur câștigător, ci o alegere potrivită pentru tine, făcută împreună cu medicul.</p>
<p>Toxina botulinică este o neurotoxină produsă de bacteria <b>Clostridium botulinum</b>. Mulți o asociază cu ceva periculos, dar în doze mici și controlate, administrată de medic, are utilizări medicale și estetice. A fost aprobată pentru prima dată în scop medical în 1989, pentru strabism, iar în ultimele două decenii a devenit cunoscută pentru netezirea ridurilor de pe frunte, din colțul ochilor, din jurul gurii sau de pe gât.</p>
<div class="rx-cards">
  <div class="rx-card"><i>01</i><b>Blochează semnalul</b><p>Injectată, toxina blochează semnalele nervoase care le spun mușchilor să se contracte.</p></div>
  <div class="rx-card"><i>02</i><b>Mușchiul se relaxează</b><p>Mușchii tratați se relaxează, iar ridurile de expresie se estompează temporar.</p></div>
  <div class="rx-card"><i>03</i><b>Efectul trece treptat</b><p>Primele efecte apar în câteva zile, rezultatul final după 10–14 zile, iar efectul durează de obicei 3–6 luni.</p></div>
</div>

<h2 id="preparate">De ce diferă preparatele între ele</h2>
<p>Preparatele de toxină botulinică folosite în estetică nu sunt identice. Diferențele se văd în felul în care se răspândesc în țesut, în cât de repede se instalează efectul, în cât durează și în cât de discret arată rezultatul.</p>
<div class="rx-why">
  <span class="rx-why-h">Prin ce se deosebesc</span>
  <ul class="rx-chips"><li>difuzia în țesut</li><li>viteza de instalare</li><li>durata efectului</li><li>cât de ușor se dozează pentru un efect subtil</li><li>toleranța individuală</li></ul>
</div>
<aside class="rx-note"><b>Ce știm și ce nu</b><p>Diferențele dintre preparate există, dar nu fac din niciunul alegerea potrivită pentru toată lumea. Durata și aspectul rezultatului depind la fel de mult de zonă, doză, tehnica medicului și de felul în care răspunde organismul tău. De aceea, la MOA nu recomandăm un preparat dinainte, ci după consult.</p></aside>

<h2 id="alegere">Cum se alege preparatul potrivit</h2>
<p>Medicul ține cont de trei lucruri. Alege fiecare criteriu ca să vezi ce înseamnă în practică.</p>
<div class="rx-tabs" data-tabs>
  <div class="rx-tablist" role="tablist">
    <button type="button" role="tab" aria-selected="true" data-tab="0">Zona tratată</button>
    <button type="button" role="tab" aria-selected="false" data-tab="1">Istoricul tău</button>
    <button type="button" role="tab" aria-selected="false" data-tab="2">Rezultatul dorit</button>
  </div>
  <div class="rx-panel" data-panel="0"><p>Pentru zonele largi, cum este fruntea, unele preparate cu difuzie mai mare pot fi de folos. Pentru zone mai mici și mai delicate, cum sunt ridurile dintre sprâncene sau din jurul ochilor, contează un preparat ușor de dozat, pentru un efect natural.</p><ul class="rx-chips"><li>frunte</li><li>între sprâncene</li><li>colțul ochilor</li><li>în jurul gurii</li><li>gât</li></ul></div>
  <div class="rx-panel" data-panel="1" hidden><p>Contează dacă ești la prima procedură, cum ai reacționat la tratamente anterioare și dacă ai fost sensibil(ă) la alte forme de toxină. Pentru cine e la început de drum sau a avut reacții, medicul poate alege un preparat cu instalare mai lentă și efect mai discret.</p></div>
  <div class="rx-panel" data-panel="2" hidden><p>Unele preparate dau un efect care se instalează mai repede și durează mai mult, altele un rezultat mai subtil, care apare treptat. Spune-i medicului ce aștepți: un aspect discret, un efect vizibil mai repede sau intervale mai lungi între ședințe.</p></div>
</div>

<h2 id="durata">Cât ține efectul și de ce poate dispărea mai repede</h2>
<p>În medie, efectul toxinei botulinice durează <b>3–6 luni</b>, în funcție de preparat și de metabolism. Urmărind pacienții la 6 luni după injectare, se vede că durata variază de la o persoană la alta și de la un preparat la altul, iar menținerea rezultatului ține de retușuri periodice și de stilul de viață. Cu tratamente regulate, mușchii pot deveni mai puțin activi, iar rezultatele pot dura mai mult.</p>
<div class="rx-two">
  <div><h3>Ce poate scurta durata</h3><ul><li>metabolismul rapid</li><li>soarele sau căldura intensă (saună, solar)</li><li>stresul și mișcările faciale accentuate</li><li>o doză insuficientă</li><li>nerespectarea recomandărilor medicului</li></ul></div>
  <div><h3>Ce mai influențează rezultatul</h3><ul><li>vârsta</li><li>grosimea pielii</li><li>fumatul, somnul și alimentația</li><li>regularitatea tratamentelor</li></ul></div>
</div>
<p>Mai ales la prima procedură, dacă rezultatul nu este cel dorit, se poate face un <b>retuș la câteva săptămâni</b>, de preferat de același medic. Doza și frecvența se pot ajusta în funcție de zona tratată, de metabolism și de stilul de viață.</p>

<h2 id="riscuri">Reacții adverse și îngrijire după injectare</h2>
<p>Efectele secundare sunt rare, dar există. Cele mai multe sunt ușoare și trecătoare.</p>
<div class="rx-two">
  <div><h3>Reacții posibile</h3><ul><li>roșeață la locul injectării</li><li>vânătăi ușoare</li><li>senzație de tensiune</li><li>rar: dureri de cap, căderea temporară a pleoapei, asimetrii</li></ul></div>
  <div><h3>Ce eviți după injectare</h3><ul><li>masajul zonei, 24 de ore</li><li>efortul intens, 24–48 de ore</li><li>să stai întins(ă) sau cu capul aplecat, cel puțin 4 ore</li><li>sauna, băile fierbinți și soarele intens, 7 zile</li></ul></div>
</div>
<div class="rx-alert"><b>Contează cine face procedura.</b> Administrarea de către persoane fără pregătire medicală poate duce la complicații serioase, inclusiv infecții. Un medic cu experiență știe cât produs să folosească și unde să injecteze, pentru un rezultat natural.</div>

<h2 id="la-moa">Toxina botulinică la MOA, pas cu pas</h2>
<ol class="rx-steps">
  <li><b>Consultul</b><p>Medicul discută cu tine zona, istoricul și rezultatul pe care îl urmărești, apoi alege preparatul și doza.</p>${consultPret ? `<em>${esc(consultNume)} · de la ${lei(consultPret)}</em>` : ''}</li>
  <li><b>Injectarea</b><p>Procedura se face în cabinet și durează puțin.</p>${pB(/1 zonă/i) ? `<em>1 zonă · ${lei(pB(/1 zonă/i))}</em>` : ''}${pB(/2 zone/i) ? `<em>2 zone · ${lei(pB(/2 zone/i))}</em>` : ''}${pB(/3 zone.*femei/i) ? `<em>3 zone, femei · ${lei(pB(/3 zone.*femei/i))}</em>` : ''}</li>
  <li><b>Primele zile</b><p>Urmezi recomandările de după procedură, iar efectul se instalează treptat.</p></li>
  <li><b>Reevaluarea</b><p>La câteva săptămâni, medicul verifică rezultatul și face, dacă e nevoie, un retuș.</p></li>
</ol>
<p class="rx-links">Citește și ${link('injectare-botox', 'despre tratamentul cu toxină botulinică la MOA')}, <a href="/nou/efecte-botox/">efectele botoxului</a>, <a href="/nou/ce-nu-e-permis-dupa-injectarea-cu-botox/">ce nu e permis după botox</a> și <a href="/nou/unde-se-pune-botox/">unde se pune botox</a>.</p>

<section class="rx-faq" id="intrebari">
  <h2>Întrebări frecvente</h2>
  <div class="tr-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div>
</section>

<div class="rx-end">
  <p>Întrebarea potrivită nu este care preparat e mai bun în general, ci care ți se potrivește ție, pentru zona pe care vrei să o tratezi. Răspunsul îl găsești împreună cu medicul, la consult.</p>
  <div class="rx-end-cta"><a class="btn btn-gold arrow" href="#programare" data-srv="Toxină botulinică (Botox)">Programează-te</a><a class="btn btn-line" href="tel:+40743056605">Sună: 0743 056 605</a></div>
</div>`;

  const script = `
// articol interactiv: file cu criteriile de alegere a preparatului
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
    lede: 'Cum acționează toxina botulinică, de ce diferă preparatele între ele și după ce criterii alege medicul. Cu durata efectului, factorii care o scurtează și îngrijirea de după.',
    trust: ['Scris de medic primar geriatrie-gerontologie', 'Conținut educațional, nu înlocuiește consultația'],
    minute: 7,
  };
};
