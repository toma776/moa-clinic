// Video pentru mobil: pentru fiecare video din data/entitati.json face
//   - o versiune comprimată (H.264, max 540px pe latura scurtă, ≤ 3 MB, +faststart) → nou/media/video/<id>.mp4
//   - o imagine de previzualizare dintr-un cadru reprezentativ (filtrul thumbnail evită cadrele negre) → nou/media/video/<id>.jpg
// și scrie data/video-media.json (îl folosesc enrich-entities.js, homepage-ul și panoul).
// Necesită ffmpeg (winget install Gyan.FFmpeg). Rulare: npm run video  [-- --force]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'nou', 'media', 'video');
const OUT_JSON = path.join(ROOT, 'data', 'video-media.json');
const MAX_MB = 3;
const FORCE = process.argv.includes('--force');

// ffmpeg: din PATH, din FFMPEG sau din instalarea winget
function findBin(name) {
  if (process.env.FFMPEG && name === 'ffmpeg') return process.env.FFMPEG;
  try { return execFileSync(process.platform === 'win32' ? 'where' : 'which', [name], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/)[0].trim(); } catch {}
  const base = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (fs.existsSync(base)) for (const d of fs.readdirSync(base).filter((x) => /FFmpeg/i.test(x))) {
    const walk = (p) => { for (const f of fs.readdirSync(p, { withFileTypes: true })) { const q = path.join(p, f.name); if (f.isDirectory()) { const r = walk(q); if (r) return r; } else if (f.name.toLowerCase() === name + '.exe') return q; } return null; };
    const r = walk(path.join(base, d)); if (r) return r;
  }
  throw new Error(`Nu găsesc ${name}. Instalează: winget install Gyan.FFmpeg`);
}
const FFMPEG = findBin('ffmpeg');
const FFPROBE = findBin('ffprobe');
const run = (bin, args) => execFileSync(bin, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
const probe = (src) => JSON.parse(run(FFPROBE, ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', src]));
const mb = (f) => Math.round((fs.statSync(f).size / 1048576) * 100) / 100;

const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'entitati.json'), 'utf8'));
const prev = fs.existsSync(OUT_JSON) ? JSON.parse(fs.readFileSync(OUT_JSON, 'utf8')) : { video: {} };
fs.mkdirSync(OUT_DIR, { recursive: true });

const out = { generat: new Date().toISOString().slice(0, 10), max_mb: MAX_MB, video: {} };
for (const v of D.video || []) {
  const mp4 = path.join(OUT_DIR, v.id.replace(/-mp4$/, '') + '.mp4');
  const jpg = mp4.replace(/\.mp4$/, '.jpg');
  const rel = (f) => '/' + path.relative(ROOT, f).split(path.sep).join('/');
  if (!FORCE && prev.video[v.id] && fs.existsSync(mp4) && fs.existsSync(jpg)) { out.video[v.id] = prev.video[v.id]; console.log(`  = ${v.id} (există)`); continue; }

  const info = probe(v.url);
  const vs = info.streams.find((s) => s.codec_type === 'video');
  const hasAudio = info.streams.some((s) => s.codec_type === 'audio');
  const dur = +info.format.duration || 0;
  // rotația din metadate (telefoanele salvează adesea video vertical ca orizontal + rotație)
  const rot = Math.abs(+(vs.side_data_list?.find((x) => x.rotation != null)?.rotation ?? vs.tags?.rotate ?? 0));
  const [w, h] = rot === 90 || rot === 270 ? [vs.height, vs.width] : [vs.width, vs.height];
  const vertical = h > w;
  // latura scurtă max 540px, dimensiuni pare
  const scale = vertical ? 'scale=\'min(540,iw)\':-2' : 'scale=-2:\'min(540,ih)\'';
  const audio = hasAudio ? ['-c:a', 'aac', '-b:a', '64k', '-ac', '1'] : ['-an'];
  const base = ['-y', '-v', 'error', '-i', v.url, '-map_metadata', '-1', '-vf', `${scale},fps=30`, '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-movflags', '+faststart', ...audio];
  run(FFMPEG, [...base, '-crf', '28', mp4]);
  // dacă depășește limita (3 MB, dar și 85% din original – nu are sens o „versiune pentru mobil” mai mare): bitrate pe durată, în două treceri
  const limit = Math.min(MAX_MB, v.mb ? v.mb * 0.85 : MAX_MB);
  if (mb(mp4) > limit && dur > 0) {
    const kbps = Math.floor(((limit * 8 * 1024 * 0.93) / dur) - (hasAudio ? 64 : 0));
    const log = path.join(OUT_DIR, 'ffpass');
    run(FFMPEG, ['-y', '-v', 'error', '-i', v.url, '-vf', `${scale},fps=30`, '-c:v', 'libx264', '-preset', 'slow', '-b:v', kbps + 'k', '-pass', '1', '-passlogfile', log, '-an', '-f', 'mp4', process.platform === 'win32' ? 'NUL' : '/dev/null']);
    run(FFMPEG, [...base, '-b:v', kbps + 'k', '-maxrate', Math.round(kbps * 1.5) + 'k', '-bufsize', kbps * 2 + 'k', '-pass', '2', '-passlogfile', log, mp4]);
    for (const f of fs.readdirSync(OUT_DIR).filter((x) => x.startsWith('ffpass'))) fs.unlinkSync(path.join(OUT_DIR, f));
  }
  // cadrul reprezentativ: din primele ~8 s (sau din tot clipul, dacă e scurt), cel mai „tipic” din 100 de cadre
  // dacă iese întunecat (luminozitate medie < 60/255), încearcă și la 25/50/75% din durată și păstrează cel mai luminos
  const luma = () => +(/YAVG=([\d.]+)/.exec(execFileSync(FFMPEG, ['-v', 'error', '-i', jpg, '-vf', 'signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-f', 'null', '-'], { encoding: 'utf8' }).replace(/lavfi\.signalstats\./g, '')) || [0, 0])[1];
  const grab = (t) => { run(FFMPEG, ['-y', '-v', 'error', '-ss', String(t), '-i', mp4, '-t', String(Math.min(8, Math.max(1, dur - t))), '-vf', 'thumbnail=100', '-frames:v', '1', '-q:v', '3', jpg]); return luma(); };
  let best = { t: Math.max(0, Math.min(dur * 0.15, 3)) };
  best.y = grab(best.t);
  if (best.y < 60) for (const t of [0.25, 0.5, 0.75].map((k) => dur * k)) { const y = grab(t); if (y > best.y) best = { t, y }; if (y >= 60) break; }
  if (luma() !== best.y) grab(best.t);

  const o = probe(mp4);
  const ov = o.streams.find((s) => s.codec_type === 'video');
  out.video[v.id] = {
    sursa: v.url,
    mobil: rel(mp4),
    poster: rel(jpg),
    durata_s: Math.round(dur),
    original_mb: v.mb,
    mobil_mb: mb(mp4),
    poster_kb: Math.round(fs.statSync(jpg).size / 1024),
    dimensiuni: `${ov.width}×${ov.height}`,
    orientare: ov.height > ov.width ? 'vertical' : 'orizontal',
    audio: hasAudio,
  };
  console.log(`  ✓ ${v.id}: ${v.mb} MB → ${out.video[v.id].mobil_mb} MB · ${out.video[v.id].dimensiuni} · ${Math.round(dur)} s · poster ${out.video[v.id].poster_kb} KB`);
}
fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2));
const tot = Object.values(out.video);
console.log(`Gata: ${tot.length} video · ${tot.reduce((n, x) => n + (x.original_mb || 0), 0).toFixed(1)} MB → ${tot.reduce((n, x) => n + x.mobil_mb, 0).toFixed(1)} MB · data/video-media.json`);
