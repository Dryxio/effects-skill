"""Détourage du sujet (BiRefNet portrait) et repérage du visage.

  python scripts/cutout.py warmup
  python scripts/cutout.py face   <image> <out.json>
  python scripts/cutout.py frames <dossier_frames> <dossier_sortie>

Utilise la carte graphique quand il y en a une (Mac Apple Silicon ou NVIDIA) : ~1 s par image.
Sinon, retombe sur le processeur via rembg (beaucoup plus lent).
Option --fast : modèle léger u2net_human_seg (rapide, contours moins propres).
"""
import json
import os
import sys
import time

import numpy as np
from PIL import Image

HF_MODEL = "ZhengPeng7/BiRefNet-portrait"


def gpu_device():
    try:
        import torch
    except ImportError:
        return None
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return None


class Cutter:
    def __init__(self, fast=False):
        self.device = None if fast else gpu_device()
        if self.device:
            import torch
            from torchvision import transforms
            from transformers import AutoModelForImageSegmentation

            self.torch = torch
            self.model = AutoModelForImageSegmentation.from_pretrained(HF_MODEL, trust_remote_code=True).to(self.device).eval().half()
            self.tf = transforms.Compose(
                [transforms.Resize((1024, 1024)), transforms.ToTensor(), transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])]
            )
        else:
            from rembg import new_session

            self.session = new_session("u2net_human_seg" if fast else "birefnet-portrait")

    @property
    def label(self):
        return f"BiRefNet portrait · {self.device.upper()}" if self.device else "rembg · processeur"

    def mask(self, img):
        """Masque alpha (PIL L) de la personne."""
        if self.device:
            x = self.tf(img).unsqueeze(0).to(self.device).half()
            with self.torch.no_grad():
                pred = self.model(x)[-1].sigmoid().float().cpu()[0, 0].numpy()
            return Image.fromarray((pred * 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)
        from rembg import remove

        return remove(img, session=self.session, only_mask=True)

    def cut(self, img):
        out = img.copy()
        out.putalpha(self.mask(img))
        return out


def face_box(mask):
    """Repère la tête à partir du masque : haut du masque, centre et largeur de la tête."""
    alpha = np.asarray(mask, dtype=np.float32) / 255.0
    h, w = alpha.shape
    rows = np.where(alpha.max(axis=1) > 0.5)[0]
    if len(rows) == 0:
        return {"found": False, "x": 0.5, "y": 0.33, "size": 0.32, "top": 0.15}
    top = int(rows[0])
    band = alpha[top : min(h, top + int(0.12 * h))] > 0.5
    xs = np.where(band.any(axis=0))[0]
    cx = float(xs.mean()) if len(xs) else w / 2
    probe = alpha[min(h - 1, top + int(0.07 * h))] > 0.5
    pxs = np.where(probe)[0]
    head_w = float(pxs[-1] - pxs[0]) if len(pxs) > 1 else 0.3 * w
    head_w = max(0.18 * w, min(head_w, 0.6 * w))
    cy = top + 0.62 * head_w
    return {"found": True, "x": round(cx / w, 4), "y": round(cy / h, 4), "size": round(head_w / w, 4), "top": round(top / h, 4)}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    fast = "--fast" in sys.argv
    args = [a for a in sys.argv[2:] if not a.startswith("--")]

    if cmd == "warmup":
        c = Cutter(fast)
        c.mask(Image.new("RGB", (64, 64), "white"))
        print(f"modèle prêt ({c.label})")
        return

    if cmd == "face":
        src, out = args
        box = face_box(Cutter(fast).mask(Image.open(src).convert("RGB")))
        with open(out, "w") as fh:
            json.dump(box, fh)
        print(json.dumps(box))
        return

    if cmd == "frames":
        src, out = args
        os.makedirs(out, exist_ok=True)
        files = sorted(f for f in os.listdir(src) if f.lower().endswith((".jpg", ".png")))
        todo = [f for f in files if not os.path.exists(os.path.join(out, os.path.splitext(f)[0] + ".webp"))]
        if not todo:
            print(f"détourage déjà fait ({len(files)} images)")
            return
        c = Cutter(fast)
        print(f"détourage de {len(todo)} images ({c.label})", flush=True)
        t0 = time.time()
        for i, name in enumerate(todo):
            target = os.path.join(out, os.path.splitext(name)[0] + ".webp")
            c.cut(Image.open(os.path.join(src, name)).convert("RGB")).save(target, "WEBP", quality=90, method=4)
            done = i + 1
            if done == 1 or done % 15 == 0 or done == len(todo):
                eta = (time.time() - t0) / done * (len(todo) - done)
                print(f"  détourage {done}/{len(todo)} · reste ~{int(eta)} s", flush=True)
        return

    print(__doc__)
    sys.exit(1)


if __name__ == "__main__":
    main()
