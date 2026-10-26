/* Les 15 effets en plus pour arriver à 36. */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cam, FaceCrop, H, Rich, W, anton, clamp, fill, hand, inter, lora, m1, mono, op, plain, pop, rnd, useP, useProgress } from "../kit";

/* Le clip réduit dans une boîte de largeur w (garde le 9:16) */
const Mini: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${w / W})`, transformOrigin: "0 0", ...style }}>
    <Cam />
  </div>
);

/* ===================== 22. polaroid ===================== */
export const Polaroid: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 0, 12, 120);
  const sway = Math.sin(f / 28) * 2.2 - 3;
  return (
    <div style={{ ...fill, overflow: "hidden", background: "radial-gradient(circle at 50% 40%, #d8c7a8, #a88f6b)" }}>
      <div style={{ ...fill, backgroundImage: "radial-gradient(rgba(80,50,20,0.18) 1.5px, transparent 2px)", backgroundSize: "11px 13px" }} />
      <div style={{ position: "absolute", left: 110, top: 200, width: 860, height: 1340, background: "#fbfaf6", padding: "40px 40px 0", boxSizing: "border-box", boxShadow: "0 40px 70px rgba(0,0,0,0.4)", transform: `translateY(${(1 - m1(k)) * 300}px) rotate(${sway}deg)`, opacity: op(k) }}>
        <div style={{ position: "relative", width: 780, height: 1060, overflow: "hidden", background: "#222" }}>
          <Mini w={780} style={{ top: -((780 / W) * H - 1060) * Math.min(1, Math.max(0, p.face.y - 0.12)) }} />
          <div style={{ ...fill, background: "linear-gradient(140deg, rgba(255,255,255,0.12), transparent 40%)" }} />
        </div>
        <div style={{ textAlign: "center", fontFamily: hand, fontSize: 96, color: "#222", marginTop: 34, transform: "rotate(-2deg)" }}>{p.title ? plain(p.title) : p.name}</div>
      </div>
      <div style={{ position: "absolute", left: 440, top: 160, width: 200, height: 64, background: "rgba(255,255,240,0.6)", transform: `rotate(${sway + 4}deg)` }} />
    </div>
  );
};

/* ===================== 23. filmstrip ===================== */
export const Filmstrip: React.FC = () => {
  const f = useCurrentFrame();
  const frameH = 1300;
  const gap = 90;
  const scroll = (f * 4) % (frameH + gap);
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#0e0d0c" }}>
      <div style={{ position: "absolute", left: 70, width: 940, top: 0, bottom: 0, background: "#1d1a17" }} />
      {[-1, 0, 1].map((n) => (
        <div key={n} style={{ position: "absolute", left: 170, top: 310 + n * (frameH + gap) + scroll, width: 740, height: frameH, overflow: "hidden", borderRadius: 10 }}>
          <Mini w={740} style={{ top: -((740 / W) * H - frameH) / 2 }} />
          <div style={{ ...fill, background: "rgba(255,180,90,0.1)", mixBlendMode: "overlay" }} />
        </div>
      ))}
      {[95, 935].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, width: 50, top: -100 + ((f * 4) % 100), height: 2200, backgroundImage: "linear-gradient(#e8e2d6 0 56px, transparent 56px 100px)", backgroundSize: "50px 100px", borderRadius: 8 }} />
      ))}
      <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 12, writingMode: "vertical-rl", fontFamily: mono, fontSize: 22, color: "#f2a33a", letterSpacing: 8, transform: `translateY(${scroll}px)` }}>FILM 400 ▸ 36 ▸ 36A ▸ FILM 400 ▸ 37 ▸ 37A</div>
      <div style={{ ...fill, background: "radial-gradient(80% 60% at 50% 50%, transparent 60%, rgba(0,0,0,0.6))" }} />
    </div>
  );
};

/* ===================== 24. comic-book ===================== */
export const ComicBook: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 6, 9, 260);
  const word = `${(p.word ?? "BOUM").toUpperCase()} !`;
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 0.72 : 1;
    return `${50 + Math.cos(a) * 50 * r}% ${50 + Math.sin(a) * 50 * r}%`;
  }).join(",");
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#111" }}>
      <Cam grade={false} style={{ filter: "contrast(1.7) saturate(1.9) brightness(1.05)" }} />
      <div style={{ ...fill, backgroundImage: "radial-gradient(rgba(0,0,0,0.35) 2.5px, transparent 3px)", backgroundSize: "12px 12px", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 40, top: 110, width: 720, height: 420, clipPath: `polygon(${pts})`, background: "#ffe12a", transform: `rotate(-8deg) scale(${m1(k)})` }} />
      <div style={{ position: "absolute", left: 40, top: 110, width: 720, height: 420, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: anton, fontSize: Math.min(150, Math.floor(1000 / word.length)), color: "#ff2a2a", WebkitTextStroke: "6px #111", transform: `rotate(-8deg) scale(${m1(k)})`, whiteSpace: "nowrap" }}>{word}</div>
      <div style={{ position: "absolute", inset: 26, border: "18px solid #111", borderRadius: 6 }} />
    </div>
  );
};

/* ===================== 25. glitch ===================== */
export const Glitch: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const hit = f % 36 < 5 || f % 61 < 3;
  const off = hit ? 18 + rnd(f) * 30 : 4;
  const slices = hit
    ? Array.from({ length: 4 }, (_, i) => {
        const y = rnd(f * 7 + i) * 90;
        return { y, h: 3 + rnd(f * 3 + i) * 9, dx: (rnd(f * 5 + i) - 0.5) * 140 };
      })
    : [];
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#000" }}>
      <Cam style={{ filter: "saturate(1.2) contrast(1.1)" }} />
      <div style={{ ...fill, mixBlendMode: "screen", opacity: 0.7 }}>
        <Cam grade={false} style={{ transform: `translateX(${-off}px)`, filter: "sepia(1) saturate(6) hue-rotate(-50deg) brightness(0.6)" }} />
      </div>
      <div style={{ ...fill, mixBlendMode: "screen", opacity: 0.7 }}>
        <Cam grade={false} style={{ transform: `translateX(${off}px)`, filter: "sepia(1) saturate(6) hue-rotate(150deg) brightness(0.6)" }} />
      </div>
      {slices.map((s, i) => (
        <div key={i} style={{ ...fill, clipPath: `inset(${s.y}% 0 ${100 - s.y - s.h}% 0)`, transform: `translateX(${s.dx}px)` }}>
          <Cam />
        </div>
      ))}
      <div style={{ ...fill, background: "repeating-linear-gradient(rgba(255,255,255,0.04) 0 2px, transparent 2px 4px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1440, textAlign: "center", fontFamily: mono, fontWeight: 700, fontSize: 130, color: "#fff", textShadow: `${-off / 2}px 0 #00f0ff, ${off / 2}px 0 #ff0050`, transform: hit ? `translateX(${(rnd(f) - 0.5) * 40}px) skewX(${(rnd(f + 2) - 0.5) * 20}deg)` : "none" }}>{(p.word ?? "GLITCH").toUpperCase()}</div>
    </div>
  );
};

/* ===================== 26. duotone ===================== */
export const Duotone: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#1b0f5c" }}>
      <Cam grade={false} style={{ filter: "grayscale(1) contrast(1.35) brightness(1.1)", mixBlendMode: "screen" }} />
      <div style={{ ...fill, background: p.accent, mixBlendMode: "multiply" }} />
      <div style={{ ...fill, background: "linear-gradient(transparent 60%, rgba(27,15,92,0.85))" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1420, fontFamily: anton, fontSize: 210, lineHeight: 0.95, color: "#fff", opacity: op(pop(f, 6)), transform: `translateY(${(1 - m1(pop(f, 6))) * 60}px)` }}>{(p.word ?? "FOCUS").toUpperCase()}</div>
    </div>
  );
};

/* ===================== 27. scanline ===================== */
export const Scanline: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const bar = ((f * 9) % (H + 400)) - 200;
  const msg = `> ${plain(p.title ?? "signal reçu")}`;
  const typed = msg.slice(0, Math.floor(f / 2));
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#010a03" }}>
      <Cam grade={false} style={{ filter: "grayscale(1) contrast(1.4) brightness(1.1) sepia(1) hue-rotate(70deg) saturate(3)" }} />
      <div style={{ ...fill, background: "repeating-linear-gradient(rgba(0,0,0,0.45) 0 3px, transparent 3px 7px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: bar, height: 160, background: "linear-gradient(transparent, rgba(150,255,170,0.18), transparent)" }} />
      <div style={{ ...fill, borderRadius: 60, boxShadow: "inset 0 0 160px 40px rgba(0,0,0,0.85)" }} />
      <div style={{ position: "absolute", left: 80, top: 120, fontFamily: mono, fontSize: 40, color: "#9fffad", textShadow: "0 0 10px #2bff5a" }}>
        CH-36 · {String(f).padStart(5, "0")}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 200, fontFamily: mono, fontSize: 54, color: "#b8ffc3", textShadow: "0 0 12px #2bff5a" }}>
        {typed}
        <span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>█</span>
      </div>
    </div>
  );
};

/* ===================== 28. cinema ===================== */
export const Cinema: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bars = interpolate(f, [0, 14], [0, 1], clamp);
  const barH = 330 * bars;
  const chapter = interpolate(f, [8, 20, 70, 90], [0, 1, 1, 0], clamp);
  const sub = interpolate(f, [24, 34, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], clamp);
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#000" }}>
      <Cam grade={false} style={{ filter: "contrast(1.18) saturate(0.85) sepia(0.18) hue-rotate(-12deg)" }} />
      <div style={{ ...fill, background: "linear-gradient(rgba(0,80,90,0.18), rgba(255,140,60,0.12))", mixBlendMode: "overlay" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: barH, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: barH, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: lora, fontStyle: "italic", fontSize: 54, color: "#eadfcf", letterSpacing: 6, opacity: chapter }}>{p.kicker ?? "Chapitre I"}</div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 380, textAlign: "center", fontFamily: inter, fontWeight: 600, fontSize: 46, lineHeight: 1.3, color: "#ffe28a", textShadow: "0 2px 6px #000, 0 0 2px #000", opacity: sub }}>{plain(p.title ?? p.headline ?? "Un clip. Trente-six effets.").replace(/\n/g, " ")}</div>
    </div>
  );
};

/* ===================== 29. breaking-news ===================== */
export const BreakingNews: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 4, 16, 180);
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const ticker = `${p.word ?? "DERNIÈRE MINUTE"}  ●  ${p.name} sort 36 effets en un clip  ●  ${p.handle}  ●  `;
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ position: "absolute", left: 50, top: 90, display: "flex", gap: 14, fontFamily: inter, fontWeight: 900, fontSize: 32 }}>
        <span style={{ background: "#d5122b", color: "#fff", padding: "10px 20px", borderRadius: 6 }}>
          <span style={{ opacity: f % 30 < 18 ? 1 : 0.3 }}>●</span> EN DIRECT
        </span>
        <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", padding: "10px 20px", borderRadius: 6 }}>{clock}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 230, transform: `translateX(${(1 - m1(k)) * -1100}px)` }}>
        <div style={{ display: "inline-block", marginLeft: 40, background: "#ffcc00", color: "#111", fontFamily: inter, fontWeight: 900, fontSize: 30, padding: "8px 22px" }}>BREAKING NEWS</div>
        <div style={{ margin: "0 40px", background: "#fff", padding: "22px 30px", fontFamily: inter, fontWeight: 900, fontSize: 60, lineHeight: 1.08, color: "#111", borderLeft: "14px solid #d5122b" }}>
          <Rich text={(p.headline ?? "UN *CLIP.* 36 EFFETS. *ZÉRO* APP.").replace(/\n/g, " ")} color="#d5122b" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, height: 84, background: "#0b1e3f", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ whiteSpace: "nowrap", fontFamily: inter, fontWeight: 700, fontSize: 38, color: "#fff", transform: `translateX(${-((f * 6) % 1600)}px)` }}>{ticker.repeat(4)}</div>
      </div>
    </div>
  );
};

/* ===================== 30. quote-card ===================== */
export const QuoteCard: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const k = pop(f, 4, 14, 160);
  const quote = plain(p.title ?? "Le meilleur monteur, c'est celui qui ne te fait pas attendre.").replace(/\n/g, " ");
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam style={{ filter: "brightness(0.45) blur(2px)" }} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 520, borderRadius: 36, background: "rgba(18,16,15,0.78)", border: "2px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", padding: "50px 60px", color: "#fff", opacity: op(k), transform: `translateY(${(1 - m1(k)) * 80}px)` }}>
        <div style={{ fontFamily: lora, fontSize: 220, lineHeight: 0.6, color: p.accent, height: 110 }}>“</div>
        <div style={{ fontFamily: lora, fontStyle: "italic", fontSize: 72, lineHeight: 1.18 }}>{quote}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 50, fontFamily: inter }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, overflow: "hidden", border: `3px solid ${p.accent}` }}>
            <FaceCrop size={90} n={4} />
          </div>
          <div>
            <div style={{ fontSize: 38, fontWeight: 800 }}>{p.name}</div>
            <div style={{ fontSize: 28, opacity: 0.7 }}>{p.handle}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== 31. countdown ===================== */
export const Countdown: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 3 - Math.floor(f / fps);
  const inCount = n >= 1;
  const local = (f % fps) / fps;
  const reveal = interpolate(f, [3 * fps, 3 * fps + 10], [1, 0], clamp);
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam style={{ filter: inCount ? "brightness(0.35) grayscale(0.6)" : "none", transform: `scale(${1 + 0.06 * reveal})` }} />
      {reveal > 0 && (
        <div style={{ ...fill, opacity: reveal }}>
          <svg width={W} height={H} style={{ position: "absolute" }}>
            <circle cx={W / 2} cy={H / 2 - 60} r={300} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={24} />
            <circle cx={W / 2} cy={H / 2 - 60} r={300} fill="none" stroke={p.accent} strokeWidth={24} strokeLinecap="round" strokeDasharray={`${1885 * (inCount ? 1 - local : 0)} 1885`} transform={`rotate(-90 ${W / 2} ${H / 2 - 60})`} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - 60 - 230, textAlign: "center", fontFamily: anton, fontSize: 420, lineHeight: "460px", color: "#fff", transform: `scale(${1.25 - 0.25 * m1(pop(f, Math.floor(f / fps) * fps, 10, 260))})` }}>{inCount ? n : "GO"}</div>
        </div>
      )}
    </div>
  );
};

/* ===================== 32. progress-ring ===================== */
export const ProgressRing: React.FC = () => {
  const p = useP();
  const prog = useProgress();
  const segs = 5;
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ position: "absolute", left: 30, right: 30, top: 50, display: "flex", gap: 8 }}>
        {Array.from({ length: segs }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.35)", overflow: "hidden" }}>
            <div style={{ width: `${Math.max(0, Math.min(1, prog * segs - i)) * 100}%`, height: "100%", background: "#fff" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 30, top: 80, display: "flex", alignItems: "center", gap: 16, fontFamily: inter, color: "#fff", fontWeight: 700, fontSize: 32, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 66, height: 66, borderRadius: 33, overflow: "hidden", border: "3px solid #fff" }}>
          <FaceCrop size={60} n={1} />
        </div>
        {p.handle.replace(/^@/, "")} <span style={{ opacity: 0.7, fontWeight: 500 }}>· 2 h</span>
      </div>
      <svg width={360} height={360} viewBox="0 0 360 360" style={{ position: "absolute", right: 50, bottom: 170 }}>
        <circle cx={180} cy={180} r={150} fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.25)" strokeWidth={26} />
        <circle cx={180} cy={180} r={150} fill="none" stroke={p.accent} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${942 * prog} 942`} transform="rotate(-90 180 180)" />
        <text x={180} y={200} textAnchor="middle" fill="#fff" fontFamily={anton} fontSize={92}>
          {Math.round(prog * 100)}%
        </text>
        <text x={180} y={250} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontFamily={inter} fontWeight={700} fontSize={26}>
          {(p.word ?? "regardé").toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

/* ===================== 33. emoji-burst ===================== */
const EMOJIS = ["🔥", "✨", "💜", "⚡", "🎬", "🚀"];
export const EmojiBurst: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const cx = p.face.x * W;
  const cy = p.face.y * H;
  const period = 45;
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      {[0, 1].map((wave) => {
        const t0 = Math.floor((f - wave * 22) / period);
        const local = (f - wave * 22) % period;
        if (f < wave * 22) return null;
        return Array.from({ length: 14 }, (_, i) => {
          const seed = t0 * 31 + i + wave * 100;
          const a = rnd(seed) * Math.PI * 2;
          const v = 18 + rnd(seed + 1) * 16;
          const x = cx + Math.cos(a) * v * local;
          const y = cy + Math.sin(a) * v * local + 0.35 * local * local;
          const o = interpolate(local, [0, 4, period - 12, period], [0, 1, 1, 0], clamp);
          return (
            <div key={`${wave}-${i}`} style={{ position: "absolute", left: x - 50, top: y - 50, fontSize: 70 + rnd(seed + 2) * 50, opacity: o, transform: `rotate(${(rnd(seed + 3) - 0.5) * 8 * local}deg)` }}>
              {EMOJIS[Math.floor(rnd(seed + 4) * EMOJIS.length)]}
            </div>
          );
        });
      })}
    </div>
  );
};

/* ===================== 34. neon-frame ===================== */
export const NeonFrame: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const on = f < 10 ? [1, 0, 1, 0, 0, 1, 0.4, 1, 1, 1][f] : f % 97 === 0 ? 0.4 : 1;
  const glow = 30 + Math.sin(f / 6) * 10;
  const c = p.accent;
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam style={{ filter: "brightness(0.85)" }} />
      <div style={{ position: "absolute", inset: 46, borderRadius: 56, border: `10px solid #ffe6f2`, boxShadow: `0 0 ${glow}px ${c}, 0 0 ${glow * 2}px ${c}, inset 0 0 ${glow}px ${c}`, opacity: on }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, textAlign: "center", fontFamily: hand, fontSize: 170, color: "#ffe6f2", textShadow: `0 0 10px ${c}, 0 0 30px ${c}, 0 0 70px ${c}`, opacity: on, transform: "rotate(-4deg)" }}>{p.word ?? "live"}</div>
    </div>
  );
};

/* ===================== 35. typewriter ===================== */
export const Typewriter: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const text = plain(p.title ?? p.headline ?? "Un clip. 36 effets. Zéro app.");
  const n = Math.min(text.length, Math.floor(Math.max(0, f - 8) / 1.6));
  const k = pop(f, 0, 14, 200);
  return (
    <div style={{ ...fill, overflow: "hidden" }}>
      <Cam />
      <div style={{ position: "absolute", left: 50, right: 50, top: 1200, borderRadius: 26, overflow: "hidden", background: "rgba(16,16,18,0.88)", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", opacity: op(k), transform: `translateY(${(1 - m1(k)) * 60}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", background: "rgba(255,255,255,0.06)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
          ))}
          <span style={{ marginLeft: 16, fontFamily: mono, fontSize: 24, color: "#9a9a9a" }}>claude — /effects</span>
        </div>
        <div style={{ padding: "26px 34px 40px", fontFamily: mono, fontSize: 56, lineHeight: 1.3, color: "#f2f2f2", whiteSpace: "pre-wrap", minHeight: 220 }}>
          <span style={{ color: "#d97757" }}>{"> "}</span>
          {text.slice(0, n)}
          <span style={{ opacity: f % 24 < 12 ? 1 : 0, color: "#d97757" }}>▌</span>
        </div>
      </div>
    </div>
  );
};

/* ===================== 36. zoom-punch ===================== */
export const ZoomPunch: React.FC = () => {
  const p = useP();
  const f = useCurrentFrame();
  const period = 40;
  const local = f % period;
  const beat = Math.floor(f / period);
  const punch = Math.exp(-local / 5);
  const zoomed = beat % 2 === 1;
  const scale = (zoomed ? 1.35 : 1) + 0.18 * punch;
  const words = plain(p.title ?? p.word ?? "UN CLIP 36 EFFETS ZÉRO APP").toUpperCase().split(/\s+/);
  const word = words[beat % words.length];
  return (
    <div style={{ ...fill, overflow: "hidden", background: "#000" }}>
      <Cam style={{ transform: `scale(${scale})`, transformOrigin: `${p.face.x * 100}% ${p.face.y * 100}%`, filter: `contrast(${1 + 0.15 * punch})` }} />
      <div style={{ ...fill, background: "#fff", opacity: punch * 0.25 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center", fontFamily: anton, fontSize: Math.min(240, Math.floor(1700 / Math.max(3, word.length))), color: "#fff", WebkitTextStroke: "4px #000", transform: `scale(${1 + 0.35 * punch})`, textShadow: `0 10px 30px rgba(0,0,0,0.5)` }}>{word}</div>
    </div>
  );
};
