# MOA Clinic – local

Copie locală a homepage-ului [moaclinic.ro](https://moaclinic.ro/) și un panou cu toate entitățile brandului.

## Pornire

```bash
npm start
```

- `http://localhost:3100/` – homepage-ul copiat (HTML + CSS/JS/imagini/fonturi în `site/`)
- `http://localhost:3100/manage/entitati` – entitățile brandului, structurat
- `http://localhost:3100/api/entitati` – datele brute (JSON)

Portul se schimbă cu variabila `PORT`.

## Reîmprospătare date

```bash
npm run sync
```

Rulează pe rând:

- `npm run mirror` – descarcă din nou homepage-ul și resursele lui în `site/` (fișierele existente nu se mai descarcă)
- `npm run extract` – regenerează `data/entitati.json` din homepage, `/preturi/`, `/echipa/`, `/abonamente/` și sitemap-uri

## Ce conține `data/entitati.json`

| Cheie | Conținut |
|---|---|
| `brand` | nume, variante, brand părinte (Oxxygene), poziționare, fondator, specialități, logo |
| `contact` | NAP: adresă, telefon, email, Google Maps, coordonate, program |
| `social`, `reputatie` | rețele sociale, rating schema vs. Trustindex/Google, exemple recenzii |
| `afilieri` | entități asociate (Oxxygene, Institutul Ana Aslan, Trustindex, FDA…) |
| `echipa` | medici, asistente, specialiști – grad, specialitate, pe ce pagini apar |
| `categoriiServicii` | arborele de servicii din meniu, cu URL-uri |
| `tehnologii`, `produse` | aparatură și mărci menționate (Splendor X, Venus, Stylage, Sculptra…) |
| `produseProprii` | terapiile IV cu nume de brand MOA |
| `preturi`, `oferte` | lista de prețuri (19 categorii) și ofertele lunii |
| `schemaOrg` | blocurile JSON-LD de pe homepage |
| `continut` | pagini, articole de blog, statusul linkurilor interne |
| `inconsistente` | conflicte de entitate detectate automat (program, prețuri, echipă, NAP, linkuri…) |

Producătorii produselor și tehnologiilor nu apar pe site. Sunt cunoaștere generală, marcată în date ca „de verificat”.

## Note

Pe localhost, scripturile legate de domeniu (banner-ul CookieYes, Pixel Your Site / admin-ajax) dau erori în consolă. E normal, nu afectează afișarea.
