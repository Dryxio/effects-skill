#!/usr/bin/env bash
# Installe tout ce qu'il faut pour /effects : Remotion (Node) + le détourage IA (Python, rembg + BiRefNet).
set -euo pipefail
cd "$(dirname "$0")"

say() { printf '%s\n' "$*"; }
need() { command -v "$1" >/dev/null 2>&1; }

need node || { say "✗ Node.js 18+ est requis : https://nodejs.org"; exit 1; }
need ffmpeg || { say "✗ ffmpeg est requis (macOS : brew install ffmpeg · Linux : sudo apt install ffmpeg)"; exit 1; }
need ffprobe || { say "✗ ffprobe est requis (il est livré avec ffmpeg)"; exit 1; }

say "→ Installation de Remotion…"
npm install --no-audit --no-fund --loglevel=error
npx remotion browser ensure >/dev/null

PY=""
for c in python3.12 python3.13 python3.11 python3.14 python3; do
  if need "$c" && "$c" -c 'import sys; sys.exit(0 if sys.version_info[:2] >= (3, 11) else 1)' 2>/dev/null; then PY="$c"; break; fi
done
[ -n "$PY" ] || { say "✗ Python 3.11+ est requis pour le détourage : https://www.python.org/downloads/"; exit 1; }

say "→ Installation du détourage IA ($PY)…"
[ -d .venv ] || "$PY" -m venv .venv
.venv/bin/python -m pip install --quiet --upgrade pip
.venv/bin/python -m pip install --quiet "rembg[cpu]" pillow numpy
# Avec une carte graphique (Mac Apple Silicon ou NVIDIA), le détourage passe de ~15 s à ~1 s par image.
if { [ "$(uname -s)" = "Darwin" ] && [ "$(uname -m)" = "arm64" ]; } || need nvidia-smi; then
  say "→ Carte graphique détectée : installation de l'accélération (PyTorch)…"
  .venv/bin/python -m pip install --quiet torch torchvision timm kornia einops "transformers<5"
fi

say "→ Téléchargement du modèle de détourage (une seule fois, ~1 Go)…"
.venv/bin/python scripts/cutout.py warmup

say "✓ /effects est prêt. Dans Claude Code : /effects glass-widgets (avec ta vidéo jointe)"
