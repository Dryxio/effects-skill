import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { FxProps, FxProvider } from "./kit";
import * as hero from "./effects/hero";
import * as grid from "./effects/grid";
import * as extra from "./effects/extra";

export const EFFECTS: Record<string, React.FC> = {
  "glass-widgets": hero.GlassWidgets,
  documentary: hero.Documentary,
  orbit: hero.Orbit,
  "kallaway-split": hero.KallawaySplit,
  spotlight: hero.Spotlight,
  checklist: hero.Checklist,
  timeline: hero.Timeline,
  lineup: grid.Lineup,
  "shortcut-rain": grid.ShortcutRain,
  "red-collage": grid.RedCollage,
  "comment-box": grid.CommentBox,
  "cover-star": grid.CoverStar,
  "headline-wall": grid.HeadlineWall,
  "phone-fan": grid.PhoneFan,
  "rabbit-hole": grid.RabbitHole,
  "profile-wall": grid.ProfileWall,
  noise: grid.Noise,
  "the-bill": grid.TheBill,
  "split-headline": grid.SplitHeadline,
  "pastel-word": grid.PastelWord,
  "tier-list": grid.TierList,
  polaroid: extra.Polaroid,
  filmstrip: extra.Filmstrip,
  "comic-book": extra.ComicBook,
  glitch: extra.Glitch,
  duotone: extra.Duotone,
  scanline: extra.Scanline,
  cinema: extra.Cinema,
  "breaking-news": extra.BreakingNews,
  "quote-card": extra.QuoteCard,
  countdown: extra.Countdown,
  "progress-ring": extra.ProgressRing,
  "emoji-burst": extra.EmojiBurst,
  "neon-frame": extra.NeonFrame,
  typewriter: extra.Typewriter,
  "zoom-punch": extra.ZoomPunch,
};

export const Effect: React.FC<FxProps> = (props) => {
  const Fx = EFFECTS[props.effect];
  if (!Fx) throw new Error(`Effet inconnu : ${props.effect}`);
  return (
    <FxProvider value={props}>
      <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
        <Fx />
        {props.hasAudio && <Audio src={staticFile("clip.mp4")} />}
      </AbsoluteFill>
    </FxProvider>
  );
};
