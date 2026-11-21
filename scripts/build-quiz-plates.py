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
import json
import os
import subprocess

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


# Lesson diagrams that graduated from schematic vectors to reviewed raster plates.
# Same contract as the quiz plates: targets are code-owned so every numbered label
# can be audited in version control; the artwork itself lives in art-src/ (git-ignored)
# and is embedded into the committed SVG.
LESSON_OUT = os.path.join(ROOT, 'public', 'diagrams')
LESSON_H = 460

# n, label(x, y), target(x, y) in 760x460 lesson-plate coordinates.
LESSON_PINS = {
    'long-bone': [
        (1, (150, 60), (360, 70)),
        (2, (600, 50), (415, 40)),
        (3, (620, 230), (362, 235)),
        (4, (140, 170), (368, 175)),
        (5, (610, 370), (375, 365)),
        (6, (140, 300), (332, 230)),
    ],
    'growth-plate': [
        (1, (90, 60), (150, 150)),
        (2, (330, 420), (330, 200)),
        (3, (480, 420), (400, 230)),
        (4, (640, 80), (520, 200)),
    ],
    'synovial': [
        (1, (120, 70), (330, 150)),
        (2, (640, 60), (380, 210)),
        (3, (110, 180), (287, 205)),
        (4, (110, 320), (262, 150)),
        (5, (640, 400), (505, 275)),
    ],
    'joint-motion': [
        (1, (80, 420), (120, 290)),
        (2, (660, 60), (580, 220)),
        (3, (60, 150), (60, 297)),
    ],
    'foot-arch': [
        (1, (80, 420), (130, 280)),
        (2, (90, 90), (200, 180)),
        (3, (330, 60), (320, 200)),
        (4, (600, 90), (470, 260)),
        (5, (560, 420), (300, 330)),
    ],
    'spine': [
        (1, (560, 50), (390, 55)),
        (2, (560, 160), (380, 160)),
        (3, (560, 300), (390, 300)),
        (4, (560, 400), (380, 385)),
        (5, (200, 420), (365, 425)),
    ],
    'skull': [
        (1, (120, 60), (255, 110)),
        (2, (430, 35), (450, 70)),
        (3, (680, 120), (585, 230)),
        (4, (680, 300), (445, 250)),
        (5, (90, 220), (255, 265)),
        (6, (120, 420), (250, 390)),
        (7, (300, 40), (330, 195)),
    ],
    'cavities': [
        (1, (560, 60), (380, 60)),
        (2, (560, 150), (400, 140)),
        (3, (180, 190), (370, 190)),
        (4, (180, 260), (372, 242)),
        (5, (180, 360), (375, 320)),
    ],
    'planes': [
        (1, (600, 40), (400, 40)),
        (2, (120, 90), (300, 100)),
        (3, (110, 240), (250, 220)),
    ],
    'muscle-bundle': [
        (1, (90, 60), (150, 230)),
        (2, (330, 420), (340, 260)),
        (3, (500, 420), (490, 260)),
        (4, (660, 80), (620, 250)),
    ],
    'antagonists': [
        (1, (300, 60), (280, 200)),
        (2, (90, 400), (200, 290)),
        (3, (430, 430), (375, 350)),
        (4, (660, 60), (640, 140)),
    ],
    'airways': [
        (1, (560, 60), (380, 120)),
        (2, (240, 60), (352, 205)),
        (3, (520, 120), (408, 205)),
        (4, (120, 250), (240, 250)),
        (5, (640, 250), (510, 250)),
    ],
    'diaphragm': [
        (1, (140, 150), (330, 200)),
        (2, (140, 300), (380, 260)),
        (3, (560, 90), (300, 130)),
        (4, (600, 330), (430, 320)),
    ],
    'neuron': [
        (1, (80, 40), (120, 120)),
        (2, (80, 300), (175, 225)),
        (3, (300, 400), (250, 228)),
        (4, (430, 80), (430, 228)),
        (5, (660, 400), (690, 220)),
    ],
    'spinal-roots': [
        (1, (640, 80), (500, 200)),
        (2, (640, 420), (440, 280)),
        (3, (700, 265), (585, 265)),
        (4, (560, 430), (620, 320)),
        (5, (120, 60), (380, 210)),
    ],
    'meninges': [
        (1, (660, 120), (560, 185)),
        (2, (120, 80), (300, 195)),
        (3, (90, 220), (380, 215)),
        (4, (120, 360), (250, 250)),
        (5, (430, 430), (300, 330)),
    ],
}


def lesson_image(name):
    """Cover-crop the reviewed artwork to the 760x460 lesson plate ratio."""
    im = Image.open(os.path.join(SRC, f'{name}.png')).convert('RGB')
    w, h = im.size
    ratio = 760 / LESSON_H
    if w / h > ratio:
        nw = int(h * ratio)
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(w / ratio)
        y = (h - nh) // 2
        im = im.crop((0, y, w, y + nh))
    im = im.resize((1440, int(1440 / ratio)), Image.LANCZOS)
    buffer = io.BytesIO()
    im.save(buffer, format='JPEG', quality=82, optimize=True, progressive=True)
    return base64.b64encode(buffer.getvalue()).decode('ascii')


def lesson_meta():
    """Title/caption/legend text stays owned by src/content/diagrams.js so the plate
    and the vector pipeline can never drift apart."""
    script = (
        "import {diagrams} from './src/content/diagrams.js';"
        "console.log(JSON.stringify(Object.fromEntries(Object.entries(diagrams)"
        ".map(([id, d]) => [id, {title: d.title, caption: d.caption, labels: d.labels.map(l => [l.name, l.text])}]))));"
    )
    out = subprocess.run(['node', '-e', script], cwd=ROOT, capture_output=True, check=True, text=True)
    return json.loads(out.stdout)


def escape(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def build_lesson_plates():
    meta = lesson_meta()
    targets = {}
    for name, pins in LESSON_PINS.items():
        data = lesson_image(name)
        markers = ''.join(pin(n, label, target) for n, label, target in pins)
        figure = meta[name]
        legend = ' '.join(f'{i + 1}. {escape(nm)}: {escape(tx)}' for i, (nm, tx) in enumerate(figure['labels']))
        svg = (
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            'viewBox="0 0 760 460" role="img" aria-labelledby="title description">'
            f'<title id="title">{escape(figure["title"])}</title>'
            f'<desc id="description">{escape(figure["caption"])} {legend}</desc>'
            f'<rect width="760" height="{LESSON_H}" fill="#f4ead2"/>'
            f'<image x="0" y="0" width="760" height="{LESSON_H}" xlink:href="data:image/jpeg;base64,{data}"/>'
            f'<g>{markers}</g></svg>'
        )
        with open(os.path.join(LESSON_OUT, f'{name}.svg'), 'w', encoding='utf-8') as handle:
            handle.write(svg + '\n')
        targets[name] = [[tx, ty] for _n, _label, (tx, ty) in pins]
        print(f'{name}.svg: {len(svg) // 1024} KB, {len(pins)} pins')
    return targets


def sync_diagram_pins(targets):
    """Keep src/content/diagramPins.js (ResearchLens overlay) on the plate targets."""
    path = os.path.join(ROOT, 'src', 'content', 'diagramPins.js')
    with open(path, encoding='utf-8') as handle:
        source = handle.read()
    import json
    body = source[source.index('{'):source.rindex('}') + 1]
    pins = json.loads(body)
    for name, coords in targets.items():
        pins[name] = coords
    with open(path, 'w', encoding='utf-8') as handle:
        handle.write(
            '// Lesson plates: targets for raster plates come from scripts/build-quiz-plates.py;\n'
            '// remaining vector diagrams keep the coordinates from scripts/build-diagrams.mjs.\n'
            '// Coordinates are SVG viewBox space (760 × 460).\n'
            'export const diagramPins = ' + json.dumps(pins, separators=(',', ':')) + ';\n'
        )
    with open(os.path.join(SRC, 'plated.json'), 'w', encoding='utf-8') as handle:
        handle.write(json.dumps(sorted(targets), indent=2) + '\n')
    print('diagramPins.js synced for', ', '.join(sorted(targets)))


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


build_lesson_plates_targets = build_lesson_plates()
sync_diagram_pins(build_lesson_plates_targets)

for name, pins in PINS.items():
    # The quiz plate sources are reviewed offline; in checkouts without art-src/
    # the committed plates stay as they are instead of failing the build.
    if not os.path.exists(os.path.join(SRC, f'{name}.png')):
        print(f'skip (no source in this checkout): {name}')
        continue
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
