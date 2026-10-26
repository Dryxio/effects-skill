/* Les 7 effets montrés en plein écran dans le reel. */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cam, FaceCrop, Fg, Glass, H, Pic, Rich, Spark, Still, W, anton, clamp, fill, inter, lora, m1, mono, op, plain, pop, useP, useProgress, waveH } from "../kit";

const ORANGE = "#d97757";
const CHART = { values: [615, 353, 295, 182, 144, 141, 89], labels: ["Reel 1", "Reel 2", "Reel 3", "Reel 4", "Reel 5", "Reel 6", "Reel 7"], unit: "K" };
const fmt = (v: number, unit = "") => `${v}${unit}`;

/* ===================== 1. glass-widgets ===================== */
export const GlassWidgets: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const prog = useProgress();
  const k = (i: number) => pop(f, i * 3, 13, 240);
  const chart = p.chart ?? CHART;
  const max = Math.max(...chart.values, 1);
  const secs = (durationInFrames / fps).toFixed(1).replace(".", ",");
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <Glass x={40} y={70} w={290} h={330} k={k(0)}>
        <div style={{ fontSize: 26, opacity: 0.85 }}>Claude</div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, marginTop: 6 }}>36</div>
        <div style={{ fontSize: 28, lineHeight: 1.15, marginTop: 8, opacity: 0.9 }}>
          effets
          <br />
          un seul clip
        </div>
      </Glass>
      <Glass x={690} y={70} w={350} h={130} k={k(1)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700 }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: "#ff4d4d", opacity: f % 30 < 18 ? 1 : 0.3 }} /> Rendu en cours
        </div>
        <div style={{ marginTop: 14, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: `${prog * 100}%`, height: 12, borderRadius: 6, background: "#fff" }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 20, opacity: 0.85 }}>rendu 4K · {Math.round(prog * 100)} %</div>
      </Glass>
      <Glass x={690} y={220} w={350} h={130} k={k(2)}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 34, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
            <div style={{ fontSize: 22, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.handle}</div>
          </div>
          <div style={{ width: 84, height: 84, borderRadius: 42, overflow: "hidden", border: "3px solid #fff", flexShrink: 0 }}>
            <FaceCrop size={84} n={0} />
          </div>
        </div>
      </Glass>
      <Glass x={40} y={1190} w={300} h={300} k={k(3)} light>
        <div style={{ fontSize: 28, fontWeight: 800 }}>Top reels</div>
        <div style={{ fontSize: 50, fontWeight: 900, color: "#d64a3a", lineHeight: 1.1 }}>{fmt(chart.values[0], chart.unit)}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginTop: 10 }}>
          {chart.values.slice(0, 7).map((v, i) => (
            <div key={i} style={{ width: 24, height: (v / max) * 120 * m1(pop(f, 8 + i * 2, 14, 200)), borderRadius: 5, background: i === 0 ? "#f2c94c" : "#d64a3a" }} />
          ))}
        </div>
      </Glass>
      <Glass x={40} y={1510} w={260} h={170} k={k(4)}>
        <div style={{ fontSize: 22, color: "#ffb3a8", fontWeight: 800 }}>ABONNÉS</div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1 }}>{p.followers ?? "71K"}</div>
      </Glass>
      <Glass x={720} y={1190} w={320} h={220} k={k(5)}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spark size={44} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 18, opacity: 0.8, letterSpacing: 1 }}>EN MONTAGE</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>soft UI pops</div>
            <div style={{ fontSize: 20, opacity: 0.8 }}>sfx · {secs} s</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 46, marginTop: 22, fontSize: 34 }}>
          <span>⏮</span>
          <span>{f % 60 < 30 ? "▶" : "❚❚"}</span>
          <span>⏭</span>
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 800, top: 1440, width: 210, height: 210, opacity: op(k(6)), transform: `scale(${0.8 + 0.2 * m1(k(6))})` }}>
        <svg width={210} height={210} viewBox="0 0 210 210">
          <circle cx={105} cy={105} r={92} fill="rgba(255,248,240,0.3)" stroke="rgba(255,255,255,0.35)" strokeWidth={14} />
          <circle cx={105} cy={105} r={92} fill="none" stroke="#22c55e" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${578 * prog} 578`} transform="rotate(-90 105 105)" />
          <text x={105} y={124} textAnchor="middle" fill="#fff" fontSize={58} fontWeight={900} fontFamily={inter}>
            4K
          </text>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1700, display: "flex", justifyContent: "center", opacity: op(k(7)) }}>
        <span style={{ padding: "16px 34px", borderRadius: 999, background: "rgba(40,30,25,0.45)", backdropFilter: "blur(14px)", border: "2px solid rgba(255,255,255,0.4)", color: "#fff", fontFamily: inter, fontSize: 38, fontWeight: 600 }}>
          Monté par <span style={{ color: "#ffb08f", fontWeight: 800 }}>Claude</span>
        </span>
      </div>
    </div>
  );
};

/* ===================== 2. documentary (couverture magazine) ===================== */
export const Documentary: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const t = pop(f, 0, 14, 220);
  const clicked = f >= 16;
  const curX = interpolate(f, [2, 13], [980, 870], clamp);
  const curY = interpolate(f, [2, 13], [1500, 1268], clamp);
  const pink = p.accent;
  /* on décale le sujet pour que son visage tombe à gauche, dans l'anneau */
  const dx = Math.max(-320, Math.min(120, 330 - p.face.x * W));
  const subject = { transform: `translate(${dx}px, 140px) scale(0.95)` };
  const ghost = (p.word ?? "CHAQUE JOUR").toUpperCase().split(" ");
  return (
    <div style={{ ...fill, overflow: "hidden", background: "radial-gradient(90% 60% at 40% 45%, #4a0f33 0%, #22071a 55%, #0e0309 100%)" }}>
      <div style={{ position: "absolute", left: 50, top: 110, right: 50, fontFamily: inter, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#f4d9e6" }}>{p.kicker ?? "ÉDITION SPÉCIALE · MONTÉ PAR CLAUDE"}</div>
      <div style={{ position: "absolute", left: 40, top: 520, width: 640, height: 640, borderRadius: 320, background: `radial-gradient(circle, transparent 52%, ${pink} 60%, ${pink}40 70%, transparent 78%)`, transform: `scale(${0.85 + 0.15 * m1(t)})` }} />
      <div style={{ position: "absolute", left: 40, top: 520, width: 640, height: 640, borderRadius: 320, background: `radial-gradient(circle, ${pink}59, transparent 62%)` }} />
      <div style={{ position: "absolute", right: -40, top: 1180, fontFamily: anton, fontSize: 300, lineHeight: 0.9, color: "transparent", WebkitTextStroke: "3px rgba(255,255,255,0.12)", textAlign: "right", whiteSpace: "nowrap" }}>
        {ghost.map((g, i) => (
          <div key={i}>{g}</div>
        ))}
      </div>
      {p.cutFrames > 0 ? (
        <Fg grade={false} style={{ filter: "grayscale(1) contrast(1.15) brightness(1.05)", ...subject }} />
      ) : (
        <Cam grade={false} style={{ filter: "grayscale(1) contrast(1.15)", ...subject }} />
      )}
      <div style={{ position: "absolute", left: 610, right: 30, top: 300, fontFamily: anton, fontSize: 118, lineHeight: 1.02, color: "#fff", transform: `translateX(${(1 - m1(t)) * 200}px)`, opacity: op(t) }}>
        <Rich text={p.headline ?? "UN *CLIP.*\n36 EFFETS.\n*ZÉRO* APP."} color={pink} />
      </div>
      <div style={{ position: "absolute", left: 50, top: 1490, padding: "10px 24px", background: pink, color: "#fff", fontFamily: inter, fontWeight: 900, fontSize: 44, letterSpacing: 2 }}>{p.name.toUpperCase()}</div>
      <div style={{ position: "absolute", left: 56, top: 1572, color: "#f4d9e6", fontFamily: inter, fontSize: 30 }}>{p.handle}</div>
      <div style={{ position: "absolute", left: 690, top: 1220, width: 300, height: 92, borderRadius: 18, background: clicked ? "#fff" : "#1f8fff", color: clicked ? "#111" : "#fff", fontFamily: inter, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", transform: `scale(${f >= 13 && f < 17 ? 0.92 : 1})` }}>
        {clicked ? "Abonné(e)" : "Suivre"}
      </div>
      <svg width={60} height={80} viewBox="0 0 24 32" style={{ position: "absolute", left: curX, top: curY, opacity: interpolate(f, [40, 50], [1, 0], clamp) }}>
        <path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 18 L20 18 Z" fill="#fff" stroke="#000" strokeWidth={1.6} />
      </svg>
    </div>
  );
};

/* ===================== 3. orbit ===================== */
export const Orbit: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 0, 16, 160);
  const cx0 = p.face.x * W;
  const cy0 = Math.max(820, Math.min(1180, p.face.y * H + 300));
  const items = Array.from({ length: 10 }, (_, i) => {
    const ring = i % 2;
    /* orbite inclinée : derrière la tête en haut, devant seulement à hauteur du torse */
    const a = (i / 10) * Math.PI * 2 + f * (ring ? -0.045 : 0.04) + (ring ? 1.1 : 0.4);
    const cx = cx0 + Math.cos(a) * (ring ? 420 : 470) * m1(k);
    const cy = cy0 + (ring ? 100 : 0) + Math.sin(a) * (ring ? 450 : 520) * m1(k);
    const depth = Math.sin(a);
    return { i, cx, cy, depth, s: 0.82 + 0.25 * depth };
  });
  const card = (it: (typeof items)[number]) => (
    <div key={it.i} style={{ position: "absolute", left: it.cx - 95, top: it.cy - 168, width: 190, height: 336, borderRadius: 18, overflow: "hidden", border: "5px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,0.35)", transform: `scale(${it.s * m1(k)}) rotate(${((it.i % 3) - 1) * 4}deg)`, filter: it.depth < 0 ? "brightness(0.8)" : "none" }}>
      <Pic n={it.i} />
    </div>
  );
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      {items.filter((it) => it.depth < 0).map(card)}
      <Fg />
      {items.filter((it) => it.depth >= 0).map(card)}
    </div>
  );
};

/* ===================== 4. kallaway-split ===================== */
export const KallawaySplit: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const chart = { ...CHART, ...p.chart };
  const vals = chart.values.slice(0, 7);
  const max = Math.max(...vals, 1);
  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  const HH = 470;
  const base = 820;
  const step = 896 / vals.length;
  const ticks = [0, 1, 2, 3].map((i) => Math.round((max * i) / 3));
  const camTop = Math.max(1100 - H, Math.min(0, 0.32 * 1100 - p.face.y * H));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#efe9df", fontFamily: inter }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 100, fontSize: 64, fontWeight: 800, color: "#1d1b18", lineHeight: 1.05 }}>
        <Rich text={chart.title ?? "Mes 7 meilleurs reels\npar *vues*"} color="#c8402f" style={{ fontFamily: lora, fontStyle: "italic", textDecoration: "underline", textDecorationThickness: 3 }} />
      </div>
      {ticks.map((v) => (
        <div key={v} style={{ position: "absolute", left: 40, top: base - (v / max) * HH - 12, fontSize: 20, color: "#8b857a", fontWeight: 700 }}>{v ? fmt(v, chart.unit) : "0"}</div>
      ))}
      <div style={{ position: "absolute", left: 120, right: 40, top: base - (avg / max) * HH, borderTop: "3px dashed #c8402f", opacity: op(pop(f, 14, 14, 200)) }}>
        <span style={{ position: "absolute", right: 0, top: -34, color: "#c8402f", fontWeight: 800, fontSize: 24 }}>moy. {fmt(avg, chart.unit)}</span>
      </div>
      {vals.map((v, i) => {
        const g = m1(pop(f, i * 2, 15, 170));
        const h = (v / max) * HH * g;
        const x = 130 + i * step;
        const bw = step * 0.76;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: base - h, width: bw, height: h, borderRadius: "10px 10px 0 0", background: i === 0 ? "#f2c94c" : "#d64a3a" }} />
            <div style={{ position: "absolute", left: x - 20, width: bw + 40, top: base - h - 52, textAlign: "center", fontFamily: anton, fontSize: 40, color: "#1d1b18", opacity: op(g) }}>{fmt(v, chart.unit)}</div>
            <div style={{ position: "absolute", left: x - 20, width: bw + 40, top: base + 12, textAlign: "center", fontSize: 21, fontWeight: 700, color: "#3b372f", whiteSpace: "nowrap", overflow: "hidden" }}>{chart.labels[i] ?? ""}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 40, top: 900, width: 1000, height: 1100, borderRadius: 44, overflow: "hidden" }}>
        <Cam style={{ left: -40, top: camTop }} />
      </div>
    </div>
  );
};

/* ===================== 5. spotlight (néon derrière la tête) ===================== */
export const Spotlight: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const flick = f < 8 ? [1, 0.2, 1, 0.4, 1, 1, 0.6, 1][f] : 1;
  const word = p.word ?? "CLAUDIT";
  const size = Math.min(196, Math.floor(1700 / Math.max(4, word.length)));
  const top = Math.max(120, Math.min(900, p.face.top * H - size * 0.35));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#120d0b" }}>
      <Cam style={{ filter: "brightness(0.38) saturate(0.8)" }} />
      <div style={{ ...fill, background: "radial-gradient(55% 40% at 50% 42%, rgba(255,140,110,0.18), rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: lora, fontStyle: "italic", fontWeight: 600, fontSize: size, letterSpacing: -4, color: "#ffd2c4", opacity: flick, whiteSpace: "nowrap", textShadow: "0 0 10px #ff9a85, 0 0 30px #ff6b6b, 0 0 70px #ff4d6d, 0 0 120px #ff3d6e" }}>{word}</div>
      <Fg style={{ filter: "brightness(1.02) saturate(1.05)" }} />
      <div style={{ ...fill, background: "radial-gradient(60% 45% at 50% 45%, rgba(0,0,0,0), rgba(0,0,0,0.45) 100%)" }} />
    </div>
  );
};

/* ===================== 6. checklist ===================== */
const STEPS: [string, string][] = [
  ["Visage trouvé", "chaque frame"],
  ["Détouré de la pièce", "masque IA"],
  ["Texte placé derrière toi", "profondeur"],
  ["Couleurs étalonnées", "chaud"],
  ["Rendu en 4K", "2160p"],
];
export const Checklist: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const steps = (p.steps ?? STEPS).slice(0, 5);
  const k = pop(f, 0, 14, 220);
  const every = Math.max(5, Math.min(24, Math.floor((durationInFrames * 0.5) / steps.length)));
  const done = Math.max(0, Math.min(steps.length, Math.floor((f - 4) / every) + 1));
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ position: "absolute", left: 50, right: 50, top: 1130, borderRadius: 34, background: "rgba(28,26,24,0.82)", backdropFilter: "blur(16px)", border: "2px solid rgba(255,255,255,0.12)", padding: "26px 34px", fontFamily: inter, color: "#fff", opacity: op(k), transform: `translateY(${(1 - m1(k)) * 80}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
          <Spark size={34} color={ORANGE} /> Claude monte ton clip
          <span style={{ marginLeft: "auto", fontSize: 24, color: "#a19f97", fontWeight: 600 }}>
            {Math.min(steps.length, done + 1)} sur {steps.length}
          </span>
        </div>
        {steps.map(([a, b], i) => {
          const ok = i < done;
          return (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 18, height: 62 }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, border: ok ? "none" : "3px solid #8a8780", background: ok ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, transform: `scale(${ok ? 0.9 + 0.1 * m1(pop(f, 4 + i * every, 10, 300)) : 1})`, boxSizing: "border-box" }}>{ok ? "✓" : ""}</div>
              <span style={{ fontSize: 34, fontWeight: 700, color: ok ? "#fff" : "#b7b4ac" }}>{a}</span>
              <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 22, color: ok ? "#4ade80" : "#77746d" }}>{b}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== 7. timeline (rendu en direct) ===================== */
const ROWS: [string, string][] = [
  ["coupe", "pauses enlevées"],
  ["sous-titres", "mots calés"],
  ["étalonnage", "chaud · teint"],
  ["effets", "36 chargés"],
  ["son", "soft UI pops"],
];
export const Timeline: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const prog = interpolate(useProgress(), [0, 1], [0.08, 1]);
  const k = pop(f, 0, 14, 220);
  const every = Math.max(4, Math.min(20, Math.floor((durationInFrames * 0.5) / ROWS.length)));
  const chips = plain(p.headline ?? "un clip\n36 effets\nzéro app").toLowerCase().split("\n").slice(0, 3);
  const camTop = Math.max(1100 - H, Math.min(0, 0.32 * 1100 - p.face.y * H));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#efe9df", fontFamily: inter }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontSize: 72, fontWeight: 800, color: "#1d1b18" }}>
        <Rich text={p.title ?? "Claude *le monte*"} color="#c8402f" style={{ fontFamily: lora, fontStyle: "italic", fontWeight: 500 }} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 170, width: 1000, height: 680, borderRadius: 30, background: "#2a1533", border: "4px solid #5b2c66", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", padding: 24, boxSizing: "border-box", opacity: op(k), transform: `scale(${0.92 + 0.08 * m1(k)})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 20, color: "#f0a3c8", marginBottom: 16 }}>
          <span>● ● ●  MONTAGE · RENDU</span>
          <span>4K · 30FPS</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ position: "relative", width: 170, height: 300, borderRadius: 14, overflow: "hidden", border: "3px solid #f0a3c8", flexShrink: 0 }}>
            <Cam style={{ width: 170, height: 302 }} />
          </div>
          <div style={{ flex: 1 }}>
            {ROWS.map(([a, b], i) => {
              const ok = f >= 3 + i * every;
              return (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 56, borderBottom: "1px solid rgba(240,163,200,0.18)", fontFamily: mono, fontSize: 22 }}>
                  <span style={{ color: "#c9a3d6" }}>{a}</span>
                  <span style={{ color: ok ? "#fff" : "#7d6585" }}>
                    {ok ? "✓ " : "… "}
                    {b}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "relative", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 6, height: 92 }}>
            {Array.from({ length: 10 }, (_, n) => (
              <div key={n} style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: "2px solid #f2c94c" }}>
                <Still n={n} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {chips.map((t, i) => (
              <span key={i} style={{ flex: [2, 2, 3][i], height: 34, borderRadius: 8, background: ["#e5679b", "#c04f86", "#f08bb3"][i], color: "#2a1533", fontSize: 18, fontWeight: 800, padding: "4px 10px", boxSizing: "border-box", whiteSpace: "nowrap", overflow: "hidden" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 50, marginTop: 12 }}>
            {Array.from({ length: 110 }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 8 + waveH(i) * 40, borderRadius: 2, background: "#f0a3c8" }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: `${prog * 100}%`, top: -6, width: 4, height: 230, background: "#ff4d8d", boxShadow: "0 0 10px #ff4d8d" }} />
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#4a2a55" }}>
            <div style={{ width: `${prog * 100}%`, height: 12, borderRadius: 6, background: "linear-gradient(90deg,#e5679b,#f2c94c)" }} />
          </div>
          <span style={{ fontFamily: anton, fontSize: 40, color: "#f2c94c" }}>{Math.round(prog * 100)} %</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 890, width: 1000, height: 1100, borderRadius: 44, overflow: "hidden" }}>
        <Cam style={{ left: -40, top: camTop }} />
      </div>
    </div>
  );
};
