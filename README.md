# /effects : 36 effets vidéo pour tes clips, montés par Claude

Tu filmes un clip face caméra, tu tapes `/effects spotlight` dans Claude Code, et tu récupères ta vidéo en 4K avec l'effet. Pas d'appli de montage.

Claude détoure ton visage avec une IA (BiRefNet), place le texte derrière ta tête, étalonne les couleurs et fait le rendu avec [Remotion](https://www.remotion.dev).

## Installation

Il te faut [Claude Code](https://claude.com/claude-code), [Node.js](https://nodejs.org) 18+, Python 3.11+ et ffmpeg (`brew install ffmpeg` sur Mac).

```bash
git clone https://github.com/Dryxio/effects-skill ~/.claude/skills/effects
cd ~/.claude/skills/effects && ./setup.sh
```

L'installation prend quelques minutes, une seule fois. Elle télécharge le modèle de détourage (~1 Go).

Tu peux aussi juste demander à Claude Code : *« installe le skill https://github.com/Dryxio/effects-skill dans ~/.claude/skills/effects et lance son setup.sh »*.

## Utilisation

Dans Claude Code, joins ta vidéo (format vertical, toi face caméra) et tape :

```
/effects spotlight
```

Claude te demande ton prénom et ton @ la première fois, puis coche les étapes une par une :

1. Visage trouvé
2. Détouré de la pièce
3. Texte placé derrière toi
4. Couleurs étalonnées
5. Rendu en 4K

Ta vidéo arrive à côté du clip d'origine : `mon-clip-spotlight.mp4`.

Pour voir les 36 effets sur ton propre clip avant de choisir : `/effects toutes`.

Tu peux aussi parler normalement : *« /effects spotlight avec le mot FOCUS »*, *« /effects split-headline avec le titre Claude \*monte\* mes reels »*, *« fais-moi une version en noir et blanc »*.

## Les 36 effets

✂ = Claude te détoure (c'est plus long : environ 1 seconde par image sur un Mac récent).

| # | Effet | Ce que ça fait |
|---|---|---|
| 1 | `glass-widgets` | Widgets en verre dépoli autour de toi |
| 2 | `documentary` ✂ | Couverture de magazine noir et blanc, anneau néon rose |
| 3 | `orbit` ✂ | Tes reels en orbite, derrière ta tête et devant toi |
| 4 | `kallaway-split` | Graphique de tes meilleurs reels en haut, toi en bas |
| 5 | `spotlight` ✂ | Un mot en néon derrière ta tête |
| 6 | `checklist` | « Claude monte ton clip », 5 étapes qui se cochent |
| 7 | `timeline` | Panneau de rendu violet au-dessus de ton clip |
| 8 | `lineup` | Rangée de pastilles avec ton visage |
| 9 | `shortcut-rain` | Pluie de touches de clavier |
| 10 | `red-collage` ✂ | Collage rouge, toi en noir et blanc, gros titre |
| 11 | `comment-box` | Commentaire Instagram qui monte |
| 12 | `cover-star` ✂ | Ton nom en énorme titre, derrière ta tête |
| 13 | `headline-wall` | Post-it jaunes avec tes titres |
| 14 | `phone-fan` | 3 téléphones en éventail |
| 15 | `rabbit-hole` | Ton clip imbriqué en zoom infini |
| 16 | `profile-wall` | Ton profil Insta en haut, ton clip en bas |
| 17 | `noise` | Caméscope rétro : grain, REC, date |
| 18 | `the-bill` | Ticket de caisse « 36 effets · 0,00 € » |
| 19 | `split-headline` | Titre avec un mot surligné, ton clip en dessous |
| 20 | `pastel-word` ✂ | Fond pastel, mot géant derrière toi |
| 21 | `tier-list` | Tier list S/A/B/C/D |
| 22 | `polaroid` | Ton clip dans un polaroid |
| 23 | `filmstrip` | Pellicule 35 mm qui défile |
| 24 | `comic-book` | Style BD avec une bulle BOUM ! |
| 25 | `glitch` | Bug numérique, décalage RVB |
| 26 | `duotone` | Bichromie et gros mot |
| 27 | `scanline` | Vieux moniteur vert |
| 28 | `cinema` | Bandes noires et sous-titre de film |
| 29 | `breaking-news` | Bandeau de chaîne info |
| 30 | `quote-card` | Citation sur une carte |
| 31 | `countdown` | Compte à rebours 3, 2, 1 |
| 32 | `progress-ring` | Barre de story et anneau de % |
| 33 | `emoji-burst` | Emojis qui explosent autour de toi |
| 34 | `neon-frame` | Cadre en tube néon |
| 35 | `typewriter` | Ton texte tapé dans un terminal |
| 36 | `zoom-punch` | Zooms secs sur ton visage |

## Sans Claude Code

```bash
cd ~/.claude/skills/effects
node scripts/effects.mjs list
node scripts/effects.mjs render spotlight ~/Desktop/clip.mp4 --word FOCUS --name Salim --handle @salim
node scripts/effects.mjs sheet ~/Desktop/clip.mp4
npm run studio   # ouvre Remotion Studio pour modifier un effet
```

Toutes les options sont décrites dans [SKILL.md](SKILL.md).

## Bon à savoir

- Sans carte graphique (PC sans NVIDIA, Mac Intel), les effets ✂ marchent mais sont lents (~15 s par image). Ajoute `--seconds 5` pour tester, ou `--fast` pour un détourage rapide mais moins propre.
- Les effets sans ✂ se rendent en une à deux minutes.
- Remotion est gratuit pour les particuliers et les entreprises de 3 personnes maximum. Au-delà, il faut [une licence](https://www.remotion.dev/license).
- Le détourage utilise [BiRefNet](https://github.com/ZhengPeng7/BiRefNet) (licence MIT).

---

Fait par [Agentic Academy](https://agentic-academy.fr) : les ressources IA les plus utiles, mises à jour chaque semaine.
