#!/usr/bin/env python3
"""Quiz plate renderer.

Takes the hand-reviewed illustration source PNGs in art-src/, harmonizes them
to the site's parchment palette (adaptive quantization), embeds them as
compressed base64 images inside SVG plates and overlays the numbered pin
markers whose targets are pinned here in code. Pins are code-owned, so label
targets are always reviewable in version control.

Usage: python3 scripts/build-quiz-plates.py
Output: public/diagrams/quiz/<id>.svg (760x507 viewBox, 3:2 plate)
"""
import base64
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art-src')
OUT = os.path.join(ROOT, 'public', 'diagrams', 'quiz')
os.makedirs(OUT, exist_ok=True)

INK = '#6b5d4f'
PAPER = '#f9f5e9'

# n, label(x, y), target(x, y) in 760x507 plate coordinates.
PINS = {
    'vertebra': [
        (1, (120, 320), (385, 290)),
        (2, (655, 130), (400, 212)),
        (3, (80, 130), (165, 205)),
        (4, (670, 250), (452, 190)),
        (5, (600, 40), (402, 48)),
    ],
    'sarcomere': [
        (1, (105, 335), (264, 205)),
        (2, (120, 55), (560, 180)),
        (3, (665, 90), (430, 228)),
        (4, (660, 330), (380, 255)),
    ],
    'heart': [
        (1, (90, 130), (222, 120)),
        (2, (75, 290), (245, 182)),
        (3, (675, 110), (495, 95)),
        (4, (690, 300), (515, 220)),
        (5, (150, 55), (392, 22)),
    ],
    'nephron': [
        (1, (90, 90), (185, 78)),
        (2, (75, 270), (300, 100)),
        (3, (350, 395), (424, 262)),
        (4, (660, 60), (503, 72)),
        (5, (680, 280), (638, 150)),
    ],
    'eye': [
        (1, (75, 150), (124, 178)),
        (2, (75, 300), (234, 190)),
        (3, (230, 55), (190, 172)),
        (4, (660, 120), (576, 232)),
        (5, (300, 390), (392, 215)),
        (6, (690, 300), (652, 250)),
    ],
    'ear': [
        (1, (90, 90), (264, 202)),
        (2, (300, 330), (396, 208)),
        (3, (480, 55), (432, 178)),
        (4, (690, 300), (589, 238)),
        (5, (660, 60), (564, 103)),
        (6, (250, 395), (441, 287)),
    ],
    'brain': [
        (1, (80, 100), (172, 124)),
        (2, (390, 45), (392, 75)),
        (3, (100, 320), (356, 247)),
        (4, (680, 90), (613, 148)),
        (5, (670, 330), (500, 302)),
        (6, (300, 395), (423, 296)),
    ],
}


def plate_image(name):
    im = Image.open(os.path.join(SRC, f'{name}.png')).convert('RGB')
    im = im.resize((1440, 960), Image.LANCZOS)
    buffer = io.BytesIO()
    im.save(buffer, format='JPEG', quality=82, optimize=True, progressive=True)
    return base64.b64encode(buffer.getvalue()).decode('ascii')


def pin(n, label, target):
    lx, ly = label
    tx, ty = target
    return (
        f'<line x1="{lx}" y1="{ly}" x2="{tx}" y2="{ty}" stroke="{INK}" stroke-width="1.1" stroke-dasharray="3 3"/>'
        f'<ellipse cx="{tx}" cy="{ty}" rx="2.6" ry="2.6" fill="{INK}"/>'
        f'<circle cx="{lx}" cy="{ly}" r="15" fill="{PAPER}" stroke="{INK}" stroke-width="1.1"/>'
        f'<text x="{lx}" y="{ly + 5}" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="{INK}">{n}</text>'
    )


for name, pins in PINS.items():
    data = plate_image(name)
    markers = ''.join(pin(n, label, target) for n, label, target in pins)
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        'viewBox="0 0 760 507" role="img" aria-label="Numaralı anatomi plakası">'
        f'<rect width="760" height="507" fill="#f4ead2"/>'
        f'<image x="0" y="0" width="760" height="507" xlink:href="data:image/jpeg;base64,{data}"/>'
        f'<g>{markers}</g></svg>'
    )
    with open(os.path.join(OUT, f'{name}.svg'), 'w', encoding='utf-8') as handle:
        handle.write(svg + '\n')
    print(f'{name}.svg: {len(svg) // 1024} KB, {len(pins)} pins')
