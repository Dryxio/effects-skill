#!/usr/bin/env node
/*
 * /effects : applique un des 36 effets à un clip face caméra.
 *
 *   node scripts/effects.mjs list
 *   node scripts/effects.mjs doctor
 *   node scripts/effects.mjs render <effet> <clip> [options]
 *   node scripts/effects.mjs still  <effet> <clip> [options]     aperçu en image (rapide)
 *   node scripts/effects.mjs sheet  <clip> [options]             planche avec les 36 aperçus
 *
 * Options :
 *   --out <fichier>        fichier de sortie
 *   --hd                   rendu 1080p au lieu de 4K (2× plus rapide)
 *   --start <s> --seconds <s>   ne garder qu'un morceau du clip
 *   --smooth               détourage à 30 i/s au lieu de 15 (2× plus long)
 *   --fast                 détourage rapide (contours moins propres)
 *   --images <dossier>     captures de tes reels (orbit, phone-fan, profile-wall, tier-list)
 *   --name --handle --headline --title --word --comment --kicker --followers
 *   --accent <#hex>        couleur principale
 *   --grade warm|cool|bw|none   étalonnage (warm par défaut)
 *   --props '<json>'       n'importe quelle prop (notes, steps, chart…)
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = JSON.parse(fs.readFileSync(path.join(ROOT, "effects.json"), "utf8"));
const IDS = CATALOG.map((e) => e.id);
const PY = [path.join(ROOT, ".venv/bin/python"), path.join(ROOT, ".venv/Scripts/python.exe")].find((p) => fs.existsSync(p));
const STILLS = 10;

/* ---------- petits outils ---------- */
const say = (s = "") => process.stdout.write(s + "\n");
const fail = (s) => {
  say(`✗ ${s}`);
  process.exit(1);
};
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: opts.quiet ? "pipe" : "inherit", encoding: "utf8" });
  if (r.status !== 0) fail(`${cmd} a échoué${r.stderr ? ` :\n${r.stderr.slice(-1500)}` : ""}`);
  return r.stdout ?? "";
};
const ffmpeg = (args) => run("ffmpeg", ["-v", "error", "-y", ...args], { quiet: true });
const has = (cmd) => spawnSync(cmd, ["-version"], { stdio: "ignore" }).status === 0;
const step = (n, label, detail = "") => say(`✓ ${n}/5  ${label}${detail ? `  ·  ${detail}` : ""}`);

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) opt[key] = true;
      else opt[key] = argv[++i];
    } else pos.push(a);
  }
  return { pos, opt };
}

function probe(file) {
  const out = run("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", file], { quiet: true });
  const j = JSON.parse(out);
  return { duration: parseFloat(j.format?.duration ?? "0"), hasAudio: (j.streams ?? []).some((s) => s.codec_type === "audio") };
}

function readProfile() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, "profile.json"), "utf8"));
  } catch {
    return {};
  }
}

/* ---------- préparation du clip (mise en cache dans .work/) ---------- */
function prepare(clipPath, opt) {
  if (!fs.existsSync(clipPath)) fail(`clip introuvable : ${clipPath}`);
  const abs = path.resolve(clipPath);
  const st = fs.statSync(abs);
  const key = createHash("sha1").update([abs, st.size, st.mtimeMs, opt.start ?? "", opt.seconds ?? "", opt.images ?? ""].join("|")).digest("hex").slice(0, 12);
  const job = path.join(ROOT, ".work", key);
  fs.mkdirSync(path.join(job, "st"), { recursive: true });

  const clip = path.join(job, "clip.mp4");
  if (!fs.existsSync(clip)) {
    say("→ Préparation du clip (9:16, 1080×1920, 30 i/s)…");
    const cut = [...(opt.start ? ["-ss", String(opt.start)] : []), ...(opt.seconds ? ["-t", String(opt.seconds)] : [])];
    ffmpeg([...cut, "-i", abs, "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", clip + ".tmp.mp4"]);
    fs.renameSync(clip + ".tmp.mp4", clip);
  }
  const { duration, hasAudio } = probe(clip);
  const frames = Math.max(1, Math.floor(duration * 30));

  for (let i = 0; i < STILLS; i++) {
    const out = path.join(job, "st", `s${i}.jpg`);
    if (!fs.existsSync(out)) ffmpeg(["-ss", String(((i + 0.5) / STILLS) * duration), "-i", clip, "-frames:v", "1", "-q:v", "3", "-vf", "scale=720:-2", out]);
  }

  let images = 0;
  if (opt.images) {
    const dir = path.resolve(String(opt.images));
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|heic|mp4|mov)$/i.test(f)).sort().slice(0, 12) : [];
    if (!files.length) say(`! aucun visuel trouvé dans ${dir}, j'utilise des images de ton clip`);
    fs.mkdirSync(path.join(job, "img"), { recursive: true });
    files.forEach((f, i) => {
      const out = path.join(job, "img", `i${i}.jpg`);
      if (!fs.existsSync(out)) ffmpeg(["-i", path.join(dir, f), "-frames:v", "1", "-q:v", "3", "-vf", "scale=720:-2", out]);
    });
    images = files.length;
  }

  const facePath = path.join(job, "face.json");
  if (!fs.existsSync(facePath)) {
    if (!PY) fail("le détourage n'est pas installé : lance ./setup.sh dans le dossier du skill");
    run(PY, [path.join(ROOT, "scripts/cutout.py"), "face", path.join(job, "st", `s${Math.floor(STILLS / 2)}.jpg`), facePath, ...(opt.fast ? ["--fast"] : [])], { quiet: true });
  }
  const face = JSON.parse(fs.readFileSync(facePath, "utf8"));
  return { job, duration, frames, hasAudio, images, face };
}

/* Détoure le sujet. onlyFrame = une seule image (aperçus). Renvoie le nombre de frames détourées. */
function cutout(prep, opt, onlyFrame) {
  const fps = opt.smooth ? 30 : 15;
  const dir = path.join(prep.job, `cut${fps}`);
  const framesDir = path.join(dir, "frames");
  const fgDir = path.join(dir, "fg");
  if (!fs.existsSync(framesDir) || fs.readdirSync(framesDir).length === 0) {
    fs.mkdirSync(framesDir, { recursive: true });
    ffmpeg(["-i", path.join(prep.job, "clip.mp4"), "-vf", `fps=${fps}`, "-q:v", "2", path.join(framesDir, "%06d.jpg")]);
  }
  const total = fs.readdirSync(framesDir).filter((f) => f.endsWith(".jpg")).length;
  let src = framesDir;
  if (onlyFrame !== undefined) {
    const idx = Math.min(Math.floor((onlyFrame * fps) / 30), total - 1) + 1;
    const name = `${String(idx).padStart(6, "0")}.jpg`;
    src = fs.mkdtempSync(path.join(os.tmpdir(), "fx-"));
    fs.copyFileSync(path.join(framesDir, name), path.join(src, name));
  }
  run(PY, [path.join(ROOT, "scripts/cutout.py"), "frames", src, fgDir, ...(opt.fast ? ["--fast"] : [])], { quiet: onlyFrame !== undefined });
  return { cutFrames: total, cutFps: fps };
}

function buildProps(effect, prep, cut, opt) {
  const profile = readProfile();
  const extra = opt.props ? JSON.parse(String(opt.props)) : {};
  const pick = (k) => (typeof opt[k] === "string" ? opt[k].replace(/\\n/g, "\n") : (extra[k] ?? profile[k]));
  const props = {
    effect,
    durationInFrames: prep.frames,
    hasAudio: prep.hasAudio,
    cutFrames: cut?.cutFrames ?? 0,
    cutFps: cut?.cutFps ?? 15,
    stills: STILLS,
    images: prep.images,
    face: prep.face,
    accent: pick("accent") ?? "#ff2d87",
    grade: pick("grade") ?? "warm",
    name: pick("name") ?? "Ton nom",
    handle: pick("handle") ?? "@toncompte",
  };
  for (const k of ["headline", "title", "word", "comment", "kicker", "followers", "notes", "steps", "chart"]) {
    const v = pick(k);
    if (v !== undefined) props[k] = v;
  }
  if (props.handle && !props.handle.startsWith("@")) props.handle = "@" + props.handle;
  return props;
}

async function bundleFor(job) {
  const { bundle } = await import("@remotion/bundler");
  say("→ Préparation du moteur de rendu…");
  return bundle({ entryPoint: path.join(ROOT, "src/index.tsx"), publicDir: job, onProgress: () => {} });
}

/* ---------- commandes ---------- */
async function render(effect, clipPath, opt) {
  const meta = CATALOG.find((e) => e.id === effect);
  if (!meta) fail(`effet inconnu « ${effect} ». Liste : node scripts/effects.mjs list`);
  const prep = prepare(clipPath, opt);
  step(1, "Visage trouvé", prep.face.found ? `x ${Math.round(prep.face.x * 100)} %, y ${Math.round(prep.face.y * 100)} %` : "pas net, je centre par défaut");

  let cut = null;
  if (meta.cutout) {
    say("→ Détourage de chaque image (le plus long : ~1 s par image avec une carte graphique)…");
    cut = cutout(prep, opt);
    step(2, "Détouré de la pièce", `${cut.cutFrames} images à ${cut.cutFps} i/s`);
  } else step(2, "Détourage", "pas nécessaire pour cet effet");

  const props = buildProps(effect, prep, cut, opt);
  step(3, meta.cutout ? "Texte placé derrière toi" : "Éléments placés autour de toi", effect);
  step(4, "Couleurs étalonnées", { warm: "chaud", cool: "froid", bw: "noir et blanc", none: "aucun" }[props.grade] ?? props.grade);

  const { renderMedia, selectComposition } = await import("@remotion/renderer");
  const serveUrl = await bundleFor(prep.job);
  const composition = await selectComposition({ serveUrl, id: effect, inputProps: props });
  const scale = opt.hd ? 1 : 2;
  const base = path.basename(clipPath).replace(/\.[^.]+$/, "");
  const out = path.resolve(opt.out ? String(opt.out) : path.join(path.dirname(path.resolve(clipPath)), `${base}-${effect}.mp4`));
  say(`→ Rendu ${opt.hd ? "1080p" : "4K"} (${(prep.frames / 30).toFixed(1)} s de vidéo)…`);
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 18,
    scale,
    inputProps: props,
    outputLocation: out,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== last) {
        last = p;
        say(`  rendu ${p * 10} %`);
      }
    },
  });
  step(5, opt.hd ? "Rendu en 1080p" : "Rendu en 4K", out);
}

async function stills(effects, clipPath, opt, outDir) {
  const prep = prepare(clipPath, opt);
  const { renderStill, selectComposition } = await import("@remotion/renderer");
  const frame = Math.min(prep.frames - 1, Number(opt.frame ?? 60));
  const cut = effects.some((e) => CATALOG.find((c) => c.id === e)?.cutout) ? cutout(prep, opt, frame) : null;
  const serveUrl = await bundleFor(prep.job);
  const outs = [];
  for (const effect of effects) {
    const meta = CATALOG.find((e) => e.id === effect);
    if (!meta) fail(`effet inconnu « ${effect} »`);
    const props = buildProps(effect, prep, meta.cutout ? cut : null, opt);
    const composition = await selectComposition({ serveUrl, id: effect, inputProps: props });
    const out = path.join(outDir, `${effect}.jpg`);
    await renderStill({ serveUrl, composition, frame, inputProps: props, output: out, imageFormat: "jpeg", jpegQuality: 85, scale: opt.scale ? Number(opt.scale) : 0.5 });
    say(`✓ ${effect}`);
    outs.push(out);
  }
  return outs;
}

function doctor() {
  let ok = true;
  const check = (cond, label, fix) => {
    say(`${cond ? "✓" : "✗"} ${label}${cond ? "" : `  →  ${fix}`}`);
    ok &&= cond;
  };
  check(has("ffmpeg") && has("ffprobe"), "ffmpeg", "installe ffmpeg (brew install ffmpeg)");
  check(fs.existsSync(path.join(ROOT, "node_modules/@remotion/renderer")), "Remotion", "lance ./setup.sh");
  check(Boolean(PY), "Détourage IA (Python)", "lance ./setup.sh");
  if (PY) {
    const gpu = spawnSync(PY, ["-c", "import torch;print('cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else '')"], { encoding: "utf8" }).stdout?.trim();
    say(gpu ? `✓ Carte graphique : ${gpu.toUpperCase()} (détourage ~1 s/image)` : "· Pas de carte graphique : le détourage marche mais il est lent (~15 s/image)");
  }
  const profile = readProfile();
  say(profile.name ? `✓ Profil : ${profile.name} ${profile.handle ?? ""}` : "· Pas de profil (profile.json) : nom et @ par défaut");
  process.exit(ok ? 0 : 1);
}

/* ---------- main ---------- */
const { pos, opt } = parseArgs(process.argv.slice(2));
const [cmd, a, b] = pos;
if (cmd === "list" || !cmd) {
  CATALOG.forEach((e, i) => say(`${String(i + 1).padStart(2)}. ${e.id.padEnd(16)} ${e.cutout ? "✂ " : "  "}${e.desc}`));
  say("\n✂ = détoure le sujet (plus long)");
} else if (cmd === "doctor") doctor();
else if (cmd === "render") {
  if (!a || !b) fail("usage : render <effet> <clip>");
  await render(a, b, opt);
} else if (cmd === "still") {
  if (!a || !b) fail("usage : still <effet> <clip>");
  const outDir = opt.out ? path.dirname(path.resolve(String(opt.out))) : path.dirname(path.resolve(b));
  const [file] = await stills([a], b, opt, fs.mkdtempSync(path.join(os.tmpdir(), "fx-")));
  const dest = opt.out ? path.resolve(String(opt.out)) : path.join(outDir, `${path.basename(b).replace(/\.[^.]+$/, "")}-${a}.jpg`);
  fs.copyFileSync(file, dest);
  say(`→ ${dest}`);
} else if (cmd === "sheet") {
  if (!a) fail("usage : sheet <clip>");
  const dir = path.join(ROOT, ".work", "sheet");
  fs.mkdirSync(dir, { recursive: true });
  const list = opt.only ? String(opt.only).split(",") : IDS;
  await stills(list, a, opt, dir);
  const dest = opt.out ? path.resolve(String(opt.out)) : path.join(path.dirname(path.resolve(a)), `${path.basename(a).replace(/\.[^.]+$/, "")}-36-effets.jpg`);
  run(PY, [path.join(ROOT, "scripts/sheet.py"), dir, dest, ...list], { quiet: true });
  say(`→ ${dest}`);
} else fail(`commande inconnue : ${cmd}`);
