---
name: effects
description: Applies one of 36 video effects (neon text behind the head, magazine cover, reels orbiting around the person, glass widgets, render checklist, tier list, glitch…) to a vertical face-camera clip and renders it in 4K with Remotion. Use when the user types /effects, attaches a selfie/facecam video and asks for an effect, an edit, a "reel effect", or wants to see the list of effects.
argument-hint: "[effet] [chemin du clip]"
---

# /effects

Arguments : `$ARGUMENTS`

Everything runs from this skill's folder (the folder containing this file, usually `~/.claude/skills/effects`). Call it `SKILL_DIR`. Reply to the user in their language (French by default).

## 1. Make sure it is installed

Run `node SKILL_DIR/scripts/effects.mjs doctor`. If anything shows ✗, tell the user it is a one-time install (3–10 min, downloads ~1–2 GB) and run `bash SKILL_DIR/setup.sh` in the background, then run `doctor` again. If `doctor` says there is no graphics card, warn that effects marked ✂ will be slow (~15 s per image) and suggest `--seconds 5` or `--fast`.

## 2. Gather what you need

- **The clip**: the video the user attached or named (vertical 9:16 face-camera works best; any format is cropped to 1080×1920). If there is none, ask for it. Never invent a path.
- **The effect**: the first argument. If missing or unknown, run `node SKILL_DIR/scripts/effects.mjs list`, show the list and ask which one. "all" / "toutes" / "aperçu" → run the `sheet` command (step 4).
- **Their profile**: if `SKILL_DIR/profile.json` does not exist, ask once for their first name or brand and their @, then write it:
  `{"name": "Salim", "handle": "@salim", "accent": "#ff2d87"}` (accent optional). Reuse it every time after that.
- **Texts**: use the user's words if they gave some, otherwise the defaults are fine. Which option each effect reads is in the table below.

## 3. Render, showing the checklist

Create a task list with these 5 steps and tick them as the script prints its `✓ n/5` lines:

1. Visage trouvé
2. Détouré de la pièce
3. Texte placé derrière toi
4. Couleurs étalonnées
5. Rendu en 4K

```bash
node SKILL_DIR/scripts/effects.mjs render <effet> "<clip>" [options]
```

Run it in the background when it is long (effects marked ✂ need ~1 s per image with a graphics card, so ~2–3 min for 10 s of video), and relay the progress lines. The output lands next to the clip as `<clip>-<effet>.mp4` (2160×3840). Give the user that path.

Useful options:

| Option | Effect |
|---|---|
| `--hd` | 1080p instead of 4K, twice as fast |
| `--start 3 --seconds 8` | only keep a section of the clip |
| `--smooth` | cutout at 30 fps instead of 15 (twice as long, smoother on fast motion) |
| `--fast` | quick but rougher cutout (bits of background around the hair) |
| `--images <folder>` | screenshots of their reels for orbit, phone-fan, profile-wall, tier-list |
| `--grade warm\|cool\|bw\|none` | colour grade (warm by default) |
| `--accent "#00c2ff"` | main colour |
| `--props '{"notes":["…"]}'` | any other prop (JSON) |

Before a long ✂ render, if the user's texts are long or unusual, run a preview first (~30 s) and look at it:

```bash
node SKILL_DIR/scripts/effects.mjs still <effet> "<clip>" [same options]
```

## 4. See all 36 on their clip

```bash
node SKILL_DIR/scripts/effects.mjs sheet "<clip>" [--name … --handle …]
```

It makes `<clip>-36-effets.jpg` (one frame of each effect). Show it to the user so they can choose.

## Texts each effect reads

Use `*stars*` around a word in `--headline` or `--title` to colour it. `\n` for a line break.

| Effect | Options it reads (defaults in brackets) |
|---|---|
| glass-widgets | `--name --handle --followers [71K]`, `--props '{"chart":{"values":[…],"labels":[…],"unit":"K"}}'` |
| documentary ✂ | `--headline ["UN *CLIP.*\n36 EFFETS.\n*ZÉRO* APP."] --name --handle --kicker --word` (ghost text) |
| orbit ✂ | `--images` |
| kallaway-split | `--props '{"chart":{"title":"Mes 7 meilleurs reels\npar *vues*","values":[615,353,…],"labels":["Reel 1",…],"unit":"K"}}'` |
| spotlight ✂ | `--word [CLAUDIT]` (one short word works best) |
| checklist | `--props '{"steps":[["Visage trouvé","chaque frame"],…]}'` (5 pairs) |
| timeline | `--title ["Claude *le monte*"] --headline` (chips) |
| lineup | `--title` |
| shortcut-rain | none |
| red-collage ✂ | `--headline --word` (background text) |
| comment-box | `--comment ["claude 🔥"] --handle` |
| cover-star ✂ | `--name` (giant title) `--headline --handle` |
| headline-wall | `--props '{"notes":["…","…","…","…"]}'` |
| phone-fan | `--word [MES REELS] --handle --images` |
| rabbit-hole | none |
| profile-wall | `--handle --name --followers --images` |
| noise | none |
| the-bill | `--name --handle` |
| split-headline | `--title ["Claude *monte* mes reels."]` (the starred word gets highlighted) |
| pastel-word ✂ | `--word [REELS]` |
| tier-list | `--title --images` |
| polaroid | `--title` (caption, defaults to name) |
| filmstrip | none |
| comic-book | `--word [BOUM]` |
| glitch | `--word [GLITCH]` |
| duotone | `--word [FOCUS] --accent` |
| scanline | `--title` |
| cinema | `--kicker [Chapitre I] --title` (subtitle) |
| breaking-news | `--headline --word --name --handle` |
| quote-card | `--title` (the quote) `--name --handle` |
| countdown | `--accent` |
| progress-ring | `--word [regardé] --handle` |
| emoji-burst | none |
| neon-frame | `--word [live] --accent` |
| typewriter | `--title` or `--headline` |
| zoom-punch | `--title` (one word per punch) |

## If something fails

- `clip introuvable`: check the path, quote it if it has spaces.
- Fonts come from Google Fonts and Remotion downloads a headless Chrome on the first render: both need internet.
- A ✂ effect with a person barely visible or several people: the cutout keeps everyone it sees as a person. Say so to the user.
- Prepared files are cached in `SKILL_DIR/.work/` (one folder per clip). It can be deleted at any time to free space.
