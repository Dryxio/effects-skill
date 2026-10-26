import React from "react";
import { Img, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

export const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const lora = loadLora("italic", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const inter = loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const hand = loadCaveat("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const W = 1080;
export const H = 1920;

/* Position de la tête, en fractions de l'image (0–1). size = largeur de la tête. */
export type Face = { x: number; y: number; size: number; top: number };

export type FxProps = {
  effect: string;
  durationInFrames: number;
  hasAudio: boolean;
  /* nombre de frames détourées (0 = pas de détourage) */
  cutFrames: number;
  /* cadence des frames détourées (15 = une image sur deux, comme dans le reel) */
  cutFps: number;
  stills: number;
  images: number;
  face: Face;
  accent: string;
  grade: "warm" | "cool" | "bw" | "none";
  name: string;
  handle: string;
  headline?: string;
  title?: string;
  word?: string;
  comment?: string;
  kicker?: string;
  followers?: string;
  notes?: string[];
  steps?: [string, string][];
  chart?: { title?: string; values: number[]; labels: string[]; unit?: string };
};

export const defaultProps: FxProps = {
  effect: "glass-widgets",
  durationInFrames: 150,
  hasAudio: false,
  cutFrames: 0,
  cutFps: 15,
  stills: 10,
  images: 0,
  face: { x: 0.5, y: 0.33, size: 0.32, top: 0.18 },
  accent: "#ff2d87",
  grade: "warm",
  name: "Ton nom",
  handle: "@toncompte",
};

const Ctx = React.createContext<FxProps>(defaultProps);
export const FxProvider = Ctx.Provider;
export const useP = () => React.useContext(Ctx);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/* ressort d'entrée : 0 avant `at`, puis monte vers 1 avec un léger rebond */
export const pop = (f: number, at: number, damping = 14, stiffness = 220) =>
  f < at ? 0 : spring({ frame: f - at, fps: 30, config: { damping, stiffness, mass: 0.8 } });
export const m1 = (k: number) => Math.min(1, k);
export const op = (k: number) => Math.min(1, k * 1.5);
const pad6 = (n: number) => String(n).padStart(6, "0");
/* numéro (1…) de la frame détourée à afficher à la frame f de la vidéo (30 i/s) */
const cutIndex = (f: number, p: FxProps) => Math.min(Math.floor((f * p.cutFps) / 30), p.cutFrames - 1) + 1;

/* Progression 0 → 1 sur toute la durée du clip */
export const useProgress = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return Math.min(1, f / Math.max(1, durationInFrames - 1));
};

const GRADES: Record<FxProps["grade"], string> = {
  warm: "saturate(1.08) sepia(0.08) contrast(1.04)",
  cool: "saturate(0.95) hue-rotate(-6deg) contrast(1.06) brightness(1.02)",
  bw: "grayscale(1) contrast(1.12)",
  none: "",
};

const fullFrame: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" };

/* Le clip. Quand il a été détouré, on affiche les frames extraites pour rester parfaitement aligné avec la découpe. */
export const Cam: React.FC<{ style?: React.CSSProperties; grade?: boolean }> = ({ style, grade = true }) => {
  const p = useP();
  const f = useCurrentFrame();
  const filter = [grade ? GRADES[p.grade] : "", style?.filter ?? ""].join(" ").trim() || undefined;
  const s = { ...fullFrame, ...style, filter };
  if (p.cutFrames > 0) return <Img src={staticFile(`cut${p.cutFps}/frames/${pad6(cutIndex(f, p))}.jpg`)} style={s} />;
  return <OffthreadVideo muted src={staticFile("clip.mp4")} style={s} />;
};

/* Toi, détouré (fond transparent). Rien si le clip n'a pas été détouré. */
export const Fg: React.FC<{ style?: React.CSSProperties; grade?: boolean }> = ({ style, grade = true }) => {
  const p = useP();
  const f = useCurrentFrame();
  if (p.cutFrames === 0) return null;
  const filter = [grade ? GRADES[p.grade] : "", style?.filter ?? ""].join(" ").trim() || undefined;
  return <Img src={staticFile(`cut${p.cutFps}/fg/${pad6(cutIndex(f, p))}.webp`)} style={{ ...fullFrame, ...style, filter }} />;
};

/* Une image fixe tirée du clip (n tourne en boucle sur les images disponibles) */
export const Still: React.FC<{ n: number; style?: React.CSSProperties }> = ({ n, style }) => {
  const p = useP();
  return <Img src={staticFile(`st/s${((n % p.stills) + p.stills) % p.stills}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
};

/* Une image de tes reels (dossier --images), sinon une image du clip */
export const Pic: React.FC<{ n: number; style?: React.CSSProperties }> = ({ n, style }) => {
  const p = useP();
  if (p.images === 0) return <Still n={n} style={style} />;
  return <Img src={staticFile(`img/i${n % p.images}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
};

/* Ton visage recadré au centre d'une boîte de `size` px (pastilles, avatars) */
export const FaceCrop: React.FC<{ n?: number; size: number; zoom?: number }> = ({ n = 0, size, zoom = 1.6 }) => {
  const { face } = useP();
  const scale = size / (face.size * W * zoom);
  return (
    <div style={{ position: "relative", width: size, height: size, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: W * scale, height: H * scale, left: size / 2 - face.x * W * scale, top: size / 2 - face.y * H * scale }}>
        <Still n={n} />
      </div>
    </div>
  );
};

/* Texte avec les *mots entre astérisques* mis en couleur */
export const Rich: React.FC<{ text: string; color: string; style?: React.CSSProperties }> = ({ text, color, style }) => (
  <>
    {text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {line.split(/(\*[^*]+\*)/).map((part, j) =>
          part.startsWith("*") && part.endsWith("*") ? (
            <span key={j} style={{ color, ...style }}>
              {part.slice(1, -1)}
            </span>
          ) : (
            <React.Fragment key={j}>{part}</React.Fragment>
          ),
        )}
      </React.Fragment>
    ))}
  </>
);
export const plain = (s: string) => s.replace(/\*/g, "");

export const Glass: React.FC<{ x: number; y: number; w: number; h: number; k: number; children: React.ReactNode; light?: boolean }> = ({ x, y, w, h, k, children, light }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 34,
      background: light ? "rgba(255,255,255,0.92)" : "rgba(255,248,240,0.26)",
      backdropFilter: "blur(18px)",
      border: "2px solid rgba(255,255,255,0.45)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
      padding: 22,
      boxSizing: "border-box",
      opacity: op(k),
      transform: `scale(${0.8 + 0.2 * m1(k)})`,
      fontFamily: inter,
      color: light ? "#1d1d1b" : "#fff",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

/* Petite étoile à 8 branches (icône « IA ») */
export const Spark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ flexShrink: 0 }}>
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={-1.4} y={-11} width={2.8} height={9} rx={1.4} fill={color} transform={`rotate(${i * 45})`} />
    ))}
  </svg>
);

/* Hauteurs pseudo-aléatoires mais stables d'une forme d'onde */
export const waveH = (i: number) => Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31));

/* Pseudo-aléatoire stable */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const fill: React.CSSProperties = { position: "absolute", inset: 0 };
