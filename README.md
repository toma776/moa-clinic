# MOA Clinic – local

Copie locală a homepage-ului [moaclinic.ro](https://moaclinic.ro/) și panoul de administrare al brandului: brand book, entități, legături, leads, pagini și starea site-ului.

## Pornire

Fără dependențe, doar Node.js 18+.

```bash
npm start
```

- `http://localhost:3100/` – homepage-ul copiat (HTML + CSS/JS/imagini/fonturi în `site/`)
- `http://localhost:3100/manage` – panoul
  - `/manage/brand` – mini brand book: esență, logo, culori (cu contrast WCAG), tipografie, UI, imagini, voce și CTA-uri, nume, date legale, inconsecvențe. Fiecare secțiune se editează din panou (`data/brand.json`).
  - `/manage/entitati` – entitățile brandului pe 3 niveluri: categorie → grup → entități, fiecare cu paginile pe care apare
  - `/manage/legaturi` – graful entităților (d3): ce se leagă de ce și ce e izolat
  - `/manage/structura` – propunerea de structură și meniu pe user journey: 6 etape, meniul (mega-meniu), arborele cu URL-urile noi, șabloane de pagină, 63 de redirecturi 301; articolele de blog își păstrează URL-urile (`npm run structura`)
  - `/manage/leads` – cereri de programare, cu status, serviciu, medic; export CSV
  - `/manage/pages` – toate URL-urile din sitemap (arbore sau listă) cu title, description, H1, canonical, schema, timp de răspuns și probleme
  - `/manage/health` – scor 0–100 pe 5 arii (SEO tehnic, date structurate, conținut, brand, performanță) + verificări de bază

Portul se schimbă cu variabila `PORT`.

## Entități

| Categorie | Grupuri |
|---|---|
| MOA Clinic | identitate, ce spune site-ul despre MOA, propunerea de valoare, contact, concepte, afilieri, graf de relații |
| Echipa | pe specialități (gerontologie, chirurgie plastică, dermatologie, estetică, asistență) |
| Servicii | pe categoriile din meniu; fiecare serviciu cu tehnologiile, produsele, medicii și prețurile lui |
| Tehnologii & produse | aparatură, mărci folosite, produse proprii MOA |
| Prețuri & oferte | lista de prețuri, ofertele lunii |
| Blog | articolele pe tipuri: ghid, tratament, îngrijire, comparație, opinii (cu motivul fiecărei încadrări) |
| Glosar | termeni medicali cu definiția găsită pe site |
| Dovezi | recenzii pacienți, cifre și afirmații cu sursa |
| Întrebări frecvente | extrase din conținut; se validează / editează / resping din panou (`data/intrebari-status.json`) |
| Media | imaginile homepage-ului (cu alt) și video-urile de pe tot site-ul: fișier, mărime, pagina și secțiunea în care apar (export CSV) |
| Audit SEO | observații entity SEO cu verificare pe site-ul live, schema `MedicalClinic` propusă, date legale |

### Observații SEO: rezolvare cu verificare

Fiecare observație are o regulă (`check`) care se rulează pe site-ul live (`scripts/checks.js`):

- **Rezolvat** – serverul descarcă pagina și rulează regula. Dacă problema nu mai apare, observația trece la „Rezolvate”.
- **Confirmă rezolvarea** – pentru regulile `manual` (fără semnal verificabil automat), cu o notă opțională.
- **Verifică toate** – rulează toate regulile automate și arată ce pare rezolvat, fără să închidă nimic.
- **Redeschide** – din lista „Rezolvate”.

Starea se salvează în `data/observatii-status.json`.

## Actualizare date

```bash
npm run sync
```

| Pas | Script | Ce face |
|---|---|---|
| `npm run mirror` | `scripts/mirror-homepage.js` | copiază homepage-ul și resursele lui în `site/` |
| `npm run crawl` | `scripts/crawl-pages.js` | citește toate URL-urile din sitemap → `data/pages.json` + textul fiecărei pagini în `source/site/` (~40 s) |
| `npm run extract` | `scripts/extract-entities.js` | entitățile din homepage, `/preturi/`, `/echipa/`, `/abonamente/`, schema.org → `data/entitati.json` |
| `npm run enrich` | `scripts/enrich-entities.js` | leagă entitățile de paginile din crawl; servicii, articole, glosar, întrebări, dovezi, media, date legale, observații |
| `npm run brand` | `scripts/build-brand.js` | brand book-ul (`data/brand.json`); nu suprascrie unul editat din panou decât cu `-- --force` |
| `npm run health` | `scripts/site-health.js` | analiza site-ului → `data/site-health.json` (și din panou: „Rulează analiza acum”) |

Producătorii produselor și tehnologiilor nu apar pe site. Sunt cunoaștere generală, marcată „de verificat”.

## API

| Metodă | Rută | |
|---|---|---|
| GET | `/api/entitati`, `/api/pages`, `/api/brand`, `/api/site-health` | datele din `data/` |
| PUT | `/api/brand` | salvează brand book-ul editat |
| GET / PUT | `/api/leads` | lista de leads / o înlocuiește |
| POST | `/api/leads` | adaugă un lead (ex. din formularul site-ului): `{"nume":"…","telefon":"…","email":"…","serviciu":"…","mesaj":"…"}` |
| PATCH | `/api/leads/<id>` | completează un lead |
| GET / PUT | `/api/intrebari/status` | validarea întrebărilor frecvente |
| GET | `/api/observatii/status` | observațiile rezolvate |
| POST | `/api/observatii/verifica` · `confirma` · `redeschide` | rezolvarea observațiilor |
| POST | `/api/site-health/ruleaza` | crawl nou + analiză |

`data/leads.json` conține date personale și **nu se urcă pe GitHub** (e în `.gitignore`).

## Note

Pe localhost, scripturile legate de domeniu (CookieYes prin GTM, Pixel Your Site / admin-ajax) dau erori în consolă pe homepage. E normal.
