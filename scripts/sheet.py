"""Assemble les aperçus en une planche : python scripts/sheet.py <dossier> <sortie.jpg> <effet> [<effet>…]"""
import math
import sys

from PIL import Image, ImageDraw, ImageFont

src, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
tw, th, cols, gap = 270, 480, 6, 12
rows = math.ceil(len(names) / cols)
sheet = Image.new("RGB", (cols * (tw + gap) + gap, rows * (th + gap) + gap), (24, 23, 22))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.load_default(size=22)
except TypeError:
    font = ImageFont.load_default()
for i, name in enumerate(names):
    x, y = gap + (i % cols) * (tw + gap), gap + (i // cols) * (th + gap)
    sheet.paste(Image.open(f"{src}/{name}.jpg").convert("RGB").resize((tw, th)), (x, y))
    draw.rectangle([x, y + th - 40, x + tw, y + th], fill=(0, 0, 0))
    draw.text((x + 10, y + th - 33), f"{i + 1}. /{name}", fill=(255, 255, 255), font=font)
sheet.save(out, quality=88)
