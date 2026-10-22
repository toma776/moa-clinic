# Cum se scrie versiunea structurată a unui articol

Modelul de referință: `glutation-beneficii-si-contraindicatii-ce-este.js` (citește-l întreg înainte). Fiecare articol primește un fișier
`scripts/articole-rich/<id-articol>.js` cu aceeași formă: `module.exports = ({ esc, lei, live, minPrice, serv, trNode, team, photos, resized }) => ({ toc, html, script, faq, lede, trust, minute })`.

## Sursa conținutului
- Textul original: `data/articole.json` → `articole["<id>"].blocuri` (h2/h3/p/ul/ol/img/tabel). Păstrează informația, reorganizeaz-o, scurteaz-o. NU inventa fapte medicale, cifre, studii, statistici sau prețuri.
- Prețuri și linkuri: doar din `CONTEXT.md` (id-uri de servicii, prețuri, pagini, medici, alte articole). Preferă `minPrice('<id>')`/`lei()` în cod în locul prețurilor scrise de mână.
- Imaginile din text NU se folosesc (coperta e deja afișată de șablon). Ignoră liniile „Sursa foto”.

## Structura (adaptată subiectului; nu toate secțiunile sunt obligatorii)
1. `rx-tldr` „Pe scurt” – 4–6 puncte, cu `<b>` pe ideile cheie. Obligatoriu, primul.
2. Ce este / de ce apare – primul paragraf cu `class="ar-first"` (literă inițială). Doar primul paragraf al articolului are `ar-first`.
3. Componente vizuale unde se potrivesc conținutului: `rx-cards` (2–3 carduri numerotate), `rx-chips` / `rx-chips-neg`, `rx-tabs` (file), `rx-compare` (2–3 coloane de comparație, `rx-col-on` pentru varianta de la MOA), `rx-two` (două casete), `rx-note` („Ce știm și ce nu” – onest, fără promisiuni), `rx-alert` (când trebuie mers la medic / reacții de semnalat).
4. Exact UN element interactiv potrivit subiectului, de regulă `rx-check` (3–5 întrebări da/nu, „nu pune un diagnostic”, cu două rezultate și butoane de programare `href="#programare" data-srv="<numele exact al serviciului din CONTEXT>"`). Alternativ, `rx-todo` (listă bifabilă cu cheie localStorage unică `moa-<id>-...`) sau `rx-tabs`. Copiază scriptul din model doar pentru componentele folosite.
5. `rx-steps` „<Tratamentul> la MOA, pas cu pas” – consult → procedură → după → reevaluare, cu prețuri reale (`<em>`), când articolul e legat de un tratament MOA.
6. `rx-links` – un paragraf cu 2–4 linkuri către paginile de tratament, programul de longevitate, medici sau alte articole relevante (din CONTEXT).
7. `rx-faq` – 4–6 întrebări frecvente (`<section class="rx-faq" id="intrebari">` cu `.tr-faq` + `<details>`), răspunsuri scurte din conținutul articolului. Sunt și în `faq` (array [q, a]) pentru schema Google.
8. `rx-end` – concluzie scurtă (italic) + butoane: „Programează un consult/-te” (`data-srv` corect) și „Sună: 0743 056 605”.

Fiecare `h2` are `id` și apare în `toc` ([{ id, x }], 6–10 intrări, titluri scurte). `lede`: 1–2 fraze despre ce afli din articol. `trust`: `['Scris de <rolul autorului>', 'Conținut educațional, nu înlocuiește consultația']` (autorul e în `data/entitati.json` → `articole[].autor`; pentru Dr. Adrian Stănescu: „Scris de medic primar geriatrie-gerontologie”). `minute`: estimare realistă de citire.

## Reguli de text (obligatorii)
- Română corectă, cu diacritice (ș, ț cu virgulă). Ton cald, direct, la persoana a II-a, fără exclamații.
- Decizia CMR 20/2025: FĂRĂ superlative („cel mai bun/eficient/sigur”, „unic”, „primul”, „revoluționar”, „de top”, „de ultimă generație”, „lider”), FĂRĂ rezultate garantate („garantat”, „100%”, „permanent”, „definitiv”, „fără riscuri”, „rezultate sigure”), FĂRĂ comparații cu alte clinici, FĂRĂ „aprobat FDA” fără indicația exactă. Formulează „poate”, „de obicei”, „medicul stabilește”.
- Nu numi branduri de produse în afara celor din CONTEXT/prețuri.
- Titlurile de secțiune nu se termină cu punct.
- Escapează textul dinamic cu `esc()`; textul scris de tine în template poate conține `<b>`, `<a>` simple.

## Verificare înainte de a termina
`node -e "const m=require('./scripts/articole-rich/<id>.js');const r=m({esc:s=>String(s),lei:n=>n+' lei',live:i=>'/x/'+i,minPrice:()=>100,serv:{},trNode:new Map(),team:[],photos:{},resized:s=>s});console.log(r.toc.length,r.faq.length,r.html.length)"`
trebuie să ruleze fără erori. Nu rula build-ul site-ului și nu face commit.
