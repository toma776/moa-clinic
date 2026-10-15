// Afirmațiile publicitare riscante după Decizia CMR nr. 20/2025 (în vigoare din 1 ianuarie 2026): fără superlative
// („prima clinică…”, „unic în lume”, „de top”, „revoluționar”), fără rezultate garantate („rezultate sigure”, „fără riscuri”,
// „garantează”) și fără „aprobat FDA” fără indicația exactă. Se aplică la generare pe textul paginilor (nu pe recenziile
// pacienților, care sunt citate). Regulile sunt ordonate: cele specifice înaintea celor generale.
const R = [
  // poziționare: fapte verificabile în loc de „prima”
  [/prima clinică Global Antiaging din România(?= creată)/gi, 'o clinică Global Antiaging'],
  [/Prima clinică Global Antiaging din România/g, 'Clinică Global Antiaging'],
  [/prima clinică Global Antiaging din România/g, 'clinică Global Antiaging'],
  [/este prima clinică care introduce Vielight în România, ca parte a/gi, 'oferă Vielight ca parte a'],
  [/Prima clinică din România cu Vielight Neuro-Vagus Combo complet/g, 'Vielight Neuro-Vagus Combo complet, în clinică'],
  // FDA: doar cu indicația exactă
  [/\s+[–-]\s+Aprobat FDA/g, ''],
  [/tratament injectabil inovator, aprobat FDA, care/gi, 'tratament injectabil aprobat de FDA pentru corectarea ridurilor faciale, care'],
  // rezultate garantate / fără riscuri
  [/îți garantează și un rezultat/gi, 'te ajută să obții un rezultat'],
  [/garanția rezultatelor este un cumul de factori/gi, 'rezultatele depind de un cumul de factori'],
  [/să te bucuri de rezultate sigure și de o experiență/gi, 'să te bucuri de un tratament sigur și de o experiență'],
  [/Expertiza lui asigură rezultate sigure, fine/gi, 'Expertiza lui urmărește rezultate fine'],
  [/să te bucuri de rezultate sigure și eficiente/gi, 'să te bucuri de un tratament sigur și eficient'],
  [/fără riscul de cicatrizare sau infecții/gi, 'cu risc minim de cicatrizare sau infecții'],
  [/fără riscuri majore și fără durere/gi, 'cu riscuri reduse și disconfort minim'],
  [/primești îngrijirea adecvată, fără riscuri\./gi, 'primești îngrijirea adecvată.'],
  [/cu rezultate definitive după câteva luni/gi, 'cu rezultatul final vizibil după câteva luni'],
  [/Oferă rezultate permanente și naturale/g, 'Oferă rezultate de durată și naturale'],
  [/adaptat 100% pielii tale/gi, 'adaptat pielii tale'],
  // superlative și „de top”
  [/folosim doar produse de top din game precum/gi, 'folosim produse originale din game precum'],
  [/procedurile estetice de top/gi, 'procedurile estetice populare'],
  [/Aparatură de top/g, 'Aparatură medicală'],
  [/laserul medical Splendor X, unic în lume și alte metode/gi, 'laserul medical Splendor X și alte metode'],
  [/ceea ce îl face unic în lume și eficient/gi, 'ceea ce îl face eficient'],
  [/cea mai avansată generație de dispozitive/gi, 'o generație nouă de dispozitive'],
  [/lider global în estetica injectabilă/gi, 'companie globală de estetică injectabilă'],
  [/TMS este probabil cea mai modernă și eficientă investiție/gi, 'TMS poate fi o investiție eficientă'],
  [/rămâne cea mai eficientă opțiune/gi, 'este, de regulă, opțiunea potrivită'],
  [/una dintre cele mai revoluționare soluții/gi, 'una dintre soluțiile moderne'],
  [/Acest tratament revoluționar este/g, 'Acest tratament este'],
  [/revoluționară/g, 'modernă'], [/revoluționare/g, 'moderne'], [/revoluționari/g, 'moderni'], [/revoluționar/g, 'modern'],
  [/Revoluționară/g, 'Modernă'], [/Revoluționar/g, 'Modern'],
  [/de ultimă generație/g, 'de generație nouă'],
  // un singur nume de brand în text (nu în adrese: „moaclinic.ro” rămâne)
  [/\bMoaClinic\b/g, 'MOA Clinic'], [/\bMoa Clinic\b/g, 'MOA Clinic'], [/\bMoa Regenerative\b/g, 'MOA Regenerative'], [/\bClinica Moa\b/g, 'Clinica MOA'],
  // vârsta biologică: estimare, nu determinare
  [/determinarea vârstei biologice/g, 'estimarea vârstei biologice'], [/Determinarea vârstei biologice/g, 'Estimarea vârstei biologice'],
  [/determinare a vârstei biologice/g, 'estimare a vârstei biologice'],
];
const curata = (s) => R.reduce((t, [re, to]) => t.replace(re, to), String(s));
module.exports = { curata, REGULI: R };
