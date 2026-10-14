#!/usr/bin/env python3
"""Reproducibly import every page of the instructor's supplied PDFs.

Input PDFs stay in ignored google_drive/. Output includes ALL extracted text and
an unaltered-color editorial reference image for EVERY page, including pages with
no text layer. Nothing is silently dropped. This is not OCR or medical review.
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
INPUT = ROOT / 'google_drive'
OUTPUT = ROOT / 'reference/course-content'
OUTPUT.mkdir(parents=True, exist_ok=True)
CATALOG = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {notes} from './src/data.js';console.log(JSON.stringify(notes));"], cwd=ROOT, text=True))
manifest = {}

BULLETS = dict.fromkeys(map(ord, '\uf0a2\uf06e\uf097\uf0fc\uf0b4\uf0d8\uf076\uf050\uf0a7\uf0d9'), '•')

def clean(text):
    text = text.translate(BULLETS).replace('\x00', '').replace('\ufb01', 'fi').replace('\ufb02', 'fl')
    return '\n'.join(re.sub(r'[ \t]+', ' ', line).strip() for line in text.splitlines()).strip()

for note in CATALOG:
    number = note['number']
    source = INPUT / note['original']
    if not source.exists():
        # Original catalog spelling may have spacing differences, never guess another lesson.
        matches = [p for p in INPUT.glob('*.pdf') if re.match(rf'^{number}[.\-]', p.name)]
        if len(matches) != 1:
            raise RuntimeError(f'Cannot identify exactly one PDF for lesson {number}')
        source = matches[0]
    doc = pymupdf.open(source)
    image_dir = OUTPUT / 'pages' / str(number)
    image_dir.mkdir(parents=True, exist_ok=True)
    pages = []
    previous_title = note['title']
    for i, page in enumerate(doc):
        # Keep native text blocks, including repetitions and figure labels.
        blocks = []
        for block in page.get_text('blocks', sort=True):
            if block[6] == 0:
                text = clean(block[4])
                if text:
                    blocks.append(text)
        text = '\n\n'.join(blocks)
        candidates = [b.replace('\n', ' ').strip(' •') for b in blocks if 4 <= len(b.replace('\n', ' ')) <= 150 and re.search(r'[A-Za-zÇĞİÖŞÜçğıöşü]', b)]
        title = candidates[0] if candidates else previous_title
        if len(title) > 105:
            title = title[:102].rsplit(' ', 1)[0] + '…'
        if candidates:
            previous_title = title
        scale = 1600 / max(page.rect.width, page.rect.height)
        pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
        image = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        asset = image_dir / f'{i+1:03d}.webp'
        image.save(asset, 'WEBP', quality=84, method=4)
        pages.append({
            'number': i+1, 'title': title, 'blocks': blocks, 'text': text,
            'image': f'pages/{number}/{i+1:03d}.webp',
            'width': pix.width, 'height': pix.height,
            'hasExtractableText': bool(text),
        })
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    word_count = sum(len(p['text'].split()) for p in pages)
    item = {
        'number': number, 'sourceId': note['id'], 'sourceName': source.name,
        'totalPages': len(doc), 'sourceSha256': digest,
        'importedAt': '2026-10-14', 'extraction': 'PyMuPDF native text blocks; every page has a rendered visual fallback; no OCR',
        'pages': pages,
    }
    (OUTPUT / f'{number}.json').write_text(json.dumps(item, ensure_ascii=False, indent=2))
    manifest[str(number)] = {'sourceId': note['id'], 'sourceName': source.name, 'totalPages': len(doc), 'wordCount': word_count, 'sourceSha256': digest, 'imageOnlyPages': sum(not p['hasExtractableText'] for p in pages)}
    print(f"{number:02}: {len(pages)}/{len(doc)} pages, {word_count} words, {source.name}", flush=True)
    doc.close()
(ROOT / 'src/courseManifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
print('TOTAL:', sum(n['totalPages'] for n in manifest.values()), 'pages', flush=True)
