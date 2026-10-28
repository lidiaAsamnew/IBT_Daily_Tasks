"""Renders the Day 43 placeholder dish images from the same plate artwork as components/DishArt.jsx.
Not part of the app. Swap any file in public/dishes/ for a real photograph at the same name and size
(800x600) and nothing else needs to change.   Usage: python3 scripts/make-dish-images.py  (needs Pillow)"""
import math, os
from PIL import Image, ImageDraw, ImageFilter

DISHES = {
    "kitfo": ["#8f2a1d"], "tibs": ["#a4531f", "#3f7a46"], "shiro": ["#d99a2b"],
    "misir": ["#b9461f"], "firfir": ["#9a3b1e", "#d9b36a"], "ful": ["#7a5a2e", "#e0c46b"],
}
HERO = ["#8f2a1d", "#d99a2b", "#3f7a46", "#a4531f", "#b9461f"]
SS = 3  # supersampling for smooth edges

def rgb(h, a=255):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)

def plate(size, palette):
    """200x200 viewBox of DishArt, drawn at size*SS px on a transparent canvas."""
    s = size * SS / 200
    im = Image.new("RGBA", (size * SS, size * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def circ(cx, cy, r, fill=None, outline=None, w=1):
        d.ellipse([(cx - r) * s, (cy - r) * s, (cx + r) * s, (cy + r) * s], fill=fill, outline=outline, width=int(w * s))
    circ(100, 100, 97, fill=rgb("#e2cf9f"))
    circ(100, 100, 89, fill=rgb("#f2e6c6"))
    for k in range(60):  # dotted rim
        a = k / 60 * math.tau
        circ(100 + math.cos(a) * 89, 100 + math.sin(a) * 89, 1.1, fill=rgb("#d6bf8c"))
    n = len(palette)
    spots = [(100, 100, 46)] if n == 1 else [
        (100 + math.cos(i / n * math.tau - math.pi / 2) * 44, 100 + math.sin(i / n * math.tau - math.pi / 2) * 44, 21 if n > 3 else 27)
        for i in range(n)]
    for i, (x, y, r) in enumerate(spots):
        circ(x, y, r, fill=rgb(palette[i]))
        hl = Image.new("RGBA", im.size, (0, 0, 0, 0)); hd = ImageDraw.Draw(hl)
        hr = r * 0.34; hx, hy = x - r * 0.3, y - r * 0.32
        hd.ellipse([(hx - hr) * s, (hy - hr) * s, (hx + hr) * s, (hy + hr) * s], fill=(255, 255, 255, 51))
        im = Image.alpha_composite(im, hl); d = ImageDraw.Draw(im)
    return im

def shadow(canvas_size, box, blur, alpha):
    sh = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse(box, fill=(60, 40, 10, alpha))
    return sh.filter(ImageFilter.GaussianBlur(blur))

out = os.path.join(os.path.dirname(__file__), "..", "public", "dishes")
os.makedirs(out, exist_ok=True)

# Dish images: 800x600 (4:3), warm cloth background baked in, plate centred. JPEG, like a photograph.
W, H, P = 800, 600, 460
for name, pal in DISHES.items():
    bg = Image.new("RGBA", (W * SS, H * SS), rgb("#f3ead3"))
    vig = Image.new("L", (W, H), 0); ImageDraw.Draw(vig).ellipse([-120, -100, W + 120, H + 100], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(90)).resize((W * SS, H * SS))
    edge = Image.new("RGBA", bg.size, rgb("#e6d6aa")); bg = Image.composite(bg, edge, vig)
    ox, oy = (W - P) // 2 * SS, (H - P) // 2 * SS
    bg = Image.alpha_composite(bg, shadow(bg.size, (ox + 20 * SS, oy + 30 * SS, ox + (P - 10) * SS, oy + (P + 20) * SS), 14 * SS, 90))
    bg.alpha_composite(plate(P, pal), (ox, oy))
    bg.convert("RGB").resize((W, H), Image.LANCZOS).save(os.path.join(out, f"{name}.jpg"), quality=80, optimize=True, progressive=True)

# Hero: 960x960 WebP with transparency (it sits on the green banner and keeps its drop shadow).
hero = plate(960, HERO).resize((960, 960), Image.LANCZOS)
hero.save(os.path.join(out, "hero.webp"), quality=85, method=6)
print("done")
