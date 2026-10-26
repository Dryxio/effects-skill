/* Les effets aperçus en vignette dans la grille finale du reel. */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cam, FaceCrop, Fg, H, Pic, Rich, W, anton, clamp, fill, hand, inter, m1, mono, op, plain, pop, rnd, useP } from "../kit";

/* ===================== 8. lineup ===================== */
export const Lineup: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const D = 184;
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ ...fill, background: "linear-gradient(rgba(0,0,0,0.45), transparent 30%)" }} />
      {Array.from({ length: 5 }, (_, i) => {
        const k = pop(f, 4 + i * 4, 12, 220);
        const bob = Math.sin(f / 14 + i) * 6;
        return (
          <div key={i} style={{ position: "absolute", left: 32 + i * 208, top: 120 + Math.abs(2 - i) * 34 + bob, width: D, height: D, borderRadius: D / 2, overflow: "hidden", border: "6px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,0.4)", transform: `scale(${m1(k)})`, opacity: op(k) }}>
            <FaceCrop size={D - 12} n={i * 2} zoom={1.5} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: inter, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.6)", opacity: op(pop(f, 26)) }}>{p.title ? plain(p.title) : `5 versions de ${p.name}`}</div>
    </div>
  );
};

/* ===================== 9. shortcut-rain ===================== */
const KEYS = ["⌘", "C", "V", "Z", "⇧", "K", "⌥", "⏎", "S", "⌫"];
export const ShortcutRain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      {Array.from({ length: 26 }, (_, i) => {
        const speed = 9 + rnd(i) * 8;
        const start = rnd(i + 50) * 2400;
        const y = ((start + f * speed) % 2300) - 250;
        const x = 20 + rnd(i + 100) * 960;
        const size = 86 + rnd(i + 7) * 50;
        const rot = (rnd(i + 3) - 0.5) * 50 + f * (rnd(i + 9) - 0.5) * 3;
        const label = KEYS[i % KEYS.length];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: size * 0.2, background: "linear-gradient(#ffffff, #e6e6ea)", boxShadow: `0 ${size * 0.08}px 0 #b8b8c0, 0 ${size * 0.2}px ${size * 0.3}px rgba(0,0,0,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 700, fontSize: size * 0.48, color: "#222", transform: `rotate(${rot}deg)`, opacity: 0.95 }}>
            {label}
          </div>
        );
      })}
    </div>
  );
};

/* ===================== 10. red-collage ===================== */
export const RedCollage: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 6, 12, 200);
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#c8102e" }}>
      <div style={{ ...fill, backgroundImage: "radial-gradient(rgba(0,0,0,0.22) 3px, transparent 3.5px)", backgroundSize: "18px 18px" }} />
      <div style={{ position: "absolute", left: -60, top: 160, fontFamily: anton, fontSize: 330, lineHeight: 0.86, color: "rgba(0,0,0,0.18)", transform: "rotate(-7deg)", whiteSpace: "nowrap" }}>
        {(p.word ?? "FAIS-LE").toUpperCase()}
        <br />
        {(p.word ?? "FAIS-LE").toUpperCase()}
      </div>
      {p.cutFrames > 0 ? <Fg grade={false} style={{ filter: "grayscale(1) contrast(1.45) brightness(1.05)" }} /> : <Cam grade={false} style={{ filter: "grayscale(1) contrast(1.4)", mixBlendMode: "multiply" }} />}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, transform: `rotate(-4deg) scale(${0.6 + 0.4 * m1(k)})`, opacity: op(k) }}>
        <div style={{ background: "#f6ead6", color: "#161616", padding: "34px 40px", fontFamily: anton, fontSize: 104, lineHeight: 1, boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
          <Rich text={p.headline ?? "UN *CLIP.*\n36 EFFETS.\n*ZÉRO* APP."} color="#c8102e" />
        </div>
        <div style={{ position: "absolute", left: -20, top: -26, width: 170, height: 52, background: "rgba(255,255,230,0.75)", transform: "rotate(-14deg)" }} />
        <div style={{ position: "absolute", right: -16, bottom: -24, width: 170, height: 52, background: "rgba(255,255,230,0.75)", transform: "rotate(-10deg)" }} />
      </div>
    </div>
  );
};

/* ===================== 11. comment-box ===================== */
export const CommentBox: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 8, 13, 160);
  const likes = Math.floor(interpolate(f, [30, 120], [0, 1284], clamp));
  const liked = f >= 40;
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 230, borderRadius: 40, background: "#fff", padding: "30px 34px", display: "flex", gap: 24, alignItems: "flex-start", fontFamily: inter, boxShadow: "0 24px 60px rgba(0,0,0,0.35)", transform: `translateY(${(1 - m1(k)) * 500}px)` }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, overflow: "hidden", flexShrink: 0, border: "3px solid #e1306c" }}>
          <FaceCrop size={86} n={3} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, color: "#111" }}>
            <b>{p.handle.replace(/^@/, "")}</b> <span style={{ color: "#8e8e8e" }}>· 1 min</span>
          </div>
          <div style={{ fontSize: 58, color: "#111", marginTop: 6, fontWeight: 600 }}>{p.comment ?? "claude 🔥"}</div>
          <div style={{ fontSize: 26, color: "#8e8e8e", marginTop: 10, fontWeight: 600 }}>
            {likes.toLocaleString("fr-FR")} J'aime · Répondre
          </div>
        </div>
        <div style={{ fontSize: 50, color: liked ? "#ff3040" : "#8e8e8e", transform: `scale(${liked ? 1 + 0.3 * (1 - m1(pop(f, 40, 10, 300))) : 1})`, marginTop: 20 }}>{liked ? "♥" : "♡"}</div>
      </div>
    </div>
  );
};

/* ===================== 12. cover-star ===================== */
export const CoverStar: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 0, 16, 140);
  const name = p.name.toUpperCase();
  const size = Math.min(330, Math.floor(1900 / Math.max(3, name.length)));
  const top = Math.max(60, Math.min(700, p.face.top * H - size * 0.55));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#e9e2d6" }}>
      <Cam />
      <div style={{ ...fill, background: "linear-gradient(rgba(0,0,0,0.15), transparent 35%, transparent 60%, rgba(0,0,0,0.55))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: anton, fontSize: size, lineHeight: 1, color: p.accent === "#ff2d87" ? "#e11d2e" : p.accent, letterSpacing: -2, whiteSpace: "nowrap", transform: `translateY(${(1 - m1(k)) * -80}px)`, opacity: op(k) }}>{name}</div>
      <Fg />
      <div style={{ position: "absolute", left: 50, right: 50, top: top + size * 1.02, display: "flex", justifyContent: "space-between", fontFamily: inter, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
        <span>N° 36</span>
        <span>ÉDITION CRÉATEURS</span>
        <span>{p.handle}</span>
      </div>
      <div style={{ position: "absolute", left: 56, bottom: 220, width: 640, fontFamily: anton, fontSize: 92, lineHeight: 1.02, color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,0.5)", opacity: op(pop(f, 14)) }}>
        <Rich text={p.headline ?? "UN *CLIP.*\n36 EFFETS.\n*ZÉRO* APP."} color="#ffd23f" />
      </div>
      <div style={{ position: "absolute", right: 56, bottom: 120, width: 170, height: 96, background: "#fff", padding: 10, boxSizing: "border-box" }}>
        <div style={{ height: "100%", background: "repeating-linear-gradient(90deg,#111 0 3px,transparent 3px 6px,#111 6px 7px,transparent 7px 11px)" }} />
      </div>
    </div>
  );
};

/* ===================== 13. headline-wall ===================== */
export const HeadlineWall: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const notes = (p.notes ?? ["36 effets", "zéro app", "un seul clip", "monté par Claude"]).slice(0, 4);
  const colors = ["#ffe14d", "#ffd23f", "#fff27a", "#ffe14d"];
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      {notes.map((s, i) => {
        const k = pop(f, 4 + i * 6, 11, 240);
        const x = 40 + (i % 2) * 510 + (i > 1 ? 30 : 0);
        const y = 90 + Math.floor(i / 2) * 290 + (i % 2) * 30;
        const rot = [-6, 5, 4, -5][i];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 450, height: 250, background: colors[i], boxShadow: "0 16px 30px rgba(0,0,0,0.3)", transform: `rotate(${rot}deg) scale(${1.4 - 0.4 * m1(k)})`, opacity: op(k), padding: "40px 34px", boxSizing: "border-box", fontFamily: hand, fontSize: 76, lineHeight: 1, color: "#1d1b18" }}>
            <div style={{ position: "absolute", left: 160, top: -18, width: 130, height: 40, background: "rgba(255,255,255,0.55)", transform: "rotate(-3deg)" }} />
            {s}
          </div>
        );
      })}
    </div>
  );
};

/* ===================== 14. phone-fan ===================== */
const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", width: 400, height: 820, borderRadius: 66, background: "#0d0d10", padding: 14, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 54, overflow: "hidden", background: "#000" }}>
      {children}
      <div style={{ position: "absolute", left: "50%", top: 18, width: 120, height: 34, marginLeft: -60, borderRadius: 17, background: "#000" }} />
    </div>
  </div>
);
export const PhoneFan: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 0, 15, 140);
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#111" }}>
      <Cam style={{ filter: "brightness(0.4) blur(14px)", transform: "scale(1.1)" }} />
      {[-1, 1, 0].map((n) => (
        <Phone key={n} style={{ left: 340 + n * 250 * m1(k), top: 430 + Math.abs(n) * 90, transform: `rotate(${n * 16 * m1(k)}deg)`, transformOrigin: "50% 110%", zIndex: n === 0 ? 2 : 1 }}>
          {n === 0 ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${372 / W})`, transformOrigin: "0 0" }}>
              <Cam />
            </div>
          ) : (
            <Pic n={n < 0 ? 1 : 4} />
          )}
        </Phone>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: anton, fontSize: 130, color: "#fff", opacity: op(pop(f, 12)) }}>{(p.word ?? "MES REELS").toUpperCase()}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1590, textAlign: "center", fontFamily: inter, fontSize: 36, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{p.handle}</div>
    </div>
  );
};

/* ===================== 15. rabbit-hole ===================== */
export const RabbitHole: React.FC = () => {
  const f = useCurrentFrame();
  const phase = (f / 45) % 1;
  const layers = Array.from({ length: 8 }, (_, i) => Math.pow(0.7, i + 1 - phase));
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      {layers.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: (W - W * s) / 2, top: (H - H * s) / 2 + 80 * s, width: W * s, height: H * s, borderRadius: 40 * s, overflow: "hidden", border: `${Math.max(2, 10 * s)}px solid #fff`, boxShadow: "0 0 50px rgba(0,0,0,0.5)", transform: `rotate(${Math.sin((f + i * 20) / 40) * 3}deg)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${s})`, transformOrigin: "0 0" }}>
            <Cam />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ===================== 16. profile-wall ===================== */
export const ProfileWall: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const camTop = Math.max(1080 - H, Math.min(0, 0.3 * 1080 - p.face.y * H));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#fff", fontFamily: inter, color: "#111" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 60, display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ width: 160, height: 160, borderRadius: 80, padding: 6, background: "conic-gradient(#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)", flexShrink: 0 }}>
          <div style={{ width: 148, height: 148, borderRadius: 74, overflow: "hidden", border: "4px solid #fff", boxSizing: "border-box" }}>
            <FaceCrop size={140} n={2} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{p.handle.replace(/^@/, "")}</div>
          <div style={{ display: "flex", gap: 40, marginTop: 14, fontSize: 26 }}>
            <span>
              <b>36</b> publications
            </span>
            <span>
              <b>{p.followers ?? "71K"}</b> abonnés
            </span>
          </div>
          <div style={{ fontSize: 26, marginTop: 10, color: "#444" }}>{p.name} · monté par Claude</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const k = pop(f, 2 + i * 3, 14, 220);
          return (
            <div key={i} style={{ position: "relative", height: 300, overflow: "hidden", opacity: op(k), transform: `scale(${0.85 + 0.15 * m1(k)})` }}>
              <Pic n={i} />
              <div style={{ position: "absolute", left: 14, bottom: 10, color: "#fff", fontSize: 24, fontWeight: 700, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>▶ {[615, 353, 295, 182, 144, 141][i]}K</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 40, top: 900, width: 1000, height: 1080, borderRadius: 44, overflow: "hidden" }}>
        <Cam style={{ left: -40, top: camTop }} />
      </div>
    </div>
  );
};

/* ===================== 17. noise (caméscope rétro) ===================== */
export const Noise: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.floor(f / fps);
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(f % fps).padStart(2, "0")}`;
  const d = new Date();
  const months = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#000" }}>
      <Cam grade={false} style={{ filter: "grayscale(0.55) sepia(0.35) contrast(1.25) brightness(1.05) blur(0.6px)", transform: `translate(${(rnd(f) - 0.5) * 4}px, ${(rnd(f + 1) - 0.5) * 4}px) scale(1.02)` }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: 0.28, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={f % 50} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div style={{ ...fill, background: "repeating-linear-gradient(rgba(0,0,0,0.12) 0 2px, transparent 2px 5px)" }} />
      <div style={{ ...fill, background: "radial-gradient(75% 60% at 50% 50%, transparent 55%, rgba(0,0,0,0.75))" }} />
      <div style={{ ...fill, background: "linear-gradient(110deg, rgba(255,120,40,0.18), transparent 35%)", opacity: 0.6 + 0.4 * Math.sin(f / 23) }} />
      <div style={{ position: "absolute", left: 70, top: 110, fontFamily: mono, fontWeight: 700, fontSize: 46, color: "#fff", textShadow: "0 0 6px rgba(255,255,255,0.6)" }}>
        <span style={{ color: "#ff3b30", opacity: f % 30 < 18 ? 1 : 0 }}>●</span> REC
      </div>
      <div style={{ position: "absolute", right: 70, top: 110, fontFamily: mono, fontSize: 40, color: "#fff" }}>{tc}</div>
      <div style={{ position: "absolute", right: 70, bottom: 140, fontFamily: mono, fontWeight: 700, fontSize: 48, color: "#ffb02e", textShadow: "0 0 8px rgba(255,150,0,0.7)" }}>
        {months[d.getMonth()]} {String(d.getDate()).padStart(2, "0")} {d.getFullYear()}
      </div>
    </div>
  );
};

/* ===================== 18. the-bill ===================== */
export const TheBill: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 4, 16, 110);
  const lines: [string, string][] = [
    ["1 clip face caméra", "0,00 €"],
    ["36 effets", "0,00 €"],
    ["Logiciel de montage", "0,00 €"],
    ["Heures passées", "0 h"],
    ["Claude", "inclus"],
  ];
  const zig = "linear-gradient(135deg, #fffdf3 25%, transparent 25%) -14px 0/28px 28px, linear-gradient(225deg, #fffdf3 25%, transparent 25%) -14px 0/28px 28px";
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam style={{ filter: "brightness(0.55)" }} />
      <div style={{ position: "absolute", left: 160, top: 300, width: 760, transform: `translateY(${(1 - m1(k)) * 1700}px) rotate(-4deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.45))" }}>
        <div style={{ height: 28, background: zig, transform: "rotate(180deg)" }} />
        <div style={{ background: "#fffdf3", padding: "30px 56px 40px", fontFamily: mono, color: "#222" }}>
          <div style={{ textAlign: "center", fontSize: 54, fontWeight: 700 }}>REÇU</div>
          <div style={{ textAlign: "center", fontSize: 26, marginTop: 6 }}>/effects · {p.handle}</div>
          <div style={{ borderTop: "3px dashed #999", margin: "28px 0" }} />
          {lines.map(([a, b], i) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, lineHeight: "62px", opacity: op(pop(f, 14 + i * 5)) }}>
              <span>{a}</span>
              <span>{b}</span>
            </div>
          ))}
          <div style={{ borderTop: "3px dashed #999", margin: "28px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 52, fontWeight: 700 }}>
            <span>TOTAL</span>
            <span>0,00 €</span>
          </div>
          <div style={{ height: 110, marginTop: 36, background: "repeating-linear-gradient(90deg,#222 0 4px,transparent 4px 7px,#222 7px 9px,transparent 9px 14px)" }} />
          <div style={{ textAlign: "center", fontSize: 26, marginTop: 20 }}>MERCI {p.name.toUpperCase()} · À BIENTÔT</div>
        </div>
        <div style={{ height: 28, background: zig }} />
      </div>
    </div>
  );
};

/* ===================== 19. split-headline ===================== */
export const SplitHeadline: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const title = p.title ?? "Claude *monte* mes reels.";
  const wipe = interpolate(f, [10, 24], [0, 100], clamp);
  const parts = title.split(/(\*[^*]+\*)/);
  const camTop = Math.max(1180 - H, Math.min(0, 0.3 * 1180 - p.face.y * H));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#f7f5ef" }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 150, fontFamily: inter, fontWeight: 900, fontSize: 120, lineHeight: 1.04, letterSpacing: -3, color: "#111", opacity: op(pop(f, 0)) }}>
        {parts.map((s, i) =>
          s.startsWith("*") ? (
            <span key={i} style={{ background: `linear-gradient(90deg, #4ade80 ${wipe}%, transparent ${wipe}%)`, padding: "0 12px", borderRadius: 10 }}>
              {s.slice(1, -1)}
            </span>
          ) : (
            <React.Fragment key={i}>{s}</React.Fragment>
          ),
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, height: H - 740, overflow: "hidden" }}>
        <Cam style={{ top: camTop }} />
      </div>
    </div>
  );
};

/* ===================== 20. pastel-word ===================== */
export const PastelWord: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 0, 13, 160);
  const word = (p.word ?? "REELS").toUpperCase();
  const size = Math.min(420, Math.floor(1950 / Math.max(3, word.length)));
  const top = Math.max(80, Math.min(820, p.face.top * H - size * 0.2));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "linear-gradient(160deg, #d9ccff, #c6b7ea 45%, #f6c9de)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: anton, fontSize: size, lineHeight: 1, color: "#fff8e8", letterSpacing: 4, whiteSpace: "nowrap", textShadow: "0 20px 50px rgba(90,60,160,0.25)", transform: `scale(${0.7 + 0.3 * m1(k)})`, opacity: op(k) }}>{word}</div>
      {p.cutFrames > 0 ? <Fg /> : <Cam style={{ mixBlendMode: "luminosity", opacity: 0.9 }} />}
    </div>
  );
};

/* ===================== 21. tier-list ===================== */
const TIERS = [
  ["S", "#ff7f7f"],
  ["A", "#ffbf7f"],
  ["B", "#ffdf7f"],
  ["C", "#bfff7f"],
  ["D", "#7fbfff"],
] as const;
export const TierList: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ position: "absolute", left: 30, top: 110, width: 560, borderRadius: 24, overflow: "hidden", background: "rgba(20,20,24,0.82)", border: "2px solid rgba(255,255,255,0.15)", fontFamily: inter, opacity: op(pop(f, 0)) }}>
        <div style={{ padding: "18px 24px", fontSize: 34, fontWeight: 800, color: "#fff" }}>{p.title ? plain(p.title) : "Tier list de mes reels"}</div>
        {TIERS.map(([t, c], i) => (
          <div key={t} style={{ display: "flex", height: 150, borderTop: "2px solid #000" }}>
            <div style={{ width: 120, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 900, color: "#111" }}>{t}</div>
            <div style={{ flex: 1, display: "flex", gap: 8, padding: 10 }}>
              {Array.from({ length: i < 2 ? 2 : 1 }, (_, j) => {
                const at = 8 + (i * 2 + j) * 7;
                const k = pop(f, at, 12, 220);
                return (
                  <div key={j} style={{ width: 96, height: 130, borderRadius: 10, overflow: "hidden", transform: `translateY(${(1 - m1(k)) * -300}px)`, opacity: op(k) }}>
                    <Pic n={i * 2 + j} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
