// Export the actual rendered layouts, not a separate approximation of the website.
// Start Vite; run: node scripts/export-edition.mjs http://localhost:5173
import { chromium } from 'playwright';
import serverless from '@sparticuz/chromium';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { tmpdir } from 'node:os';
const root = new URL('../', import.meta.url);
const temp = fs.mkdtempSync(path.join(tmpdir(), 'atlas-edition-'));
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_EXECUTABLE_PATH || (await serverless.executablePath()),
  args: serverless.args,
});
const screens = [];
let layerId = 0;
// Standalone SVG previews use the same locally licensed fonts even outside the site.
let embeddedFonts = '';
for (const [id, family, weights] of [
  ['inter', 'Inter', [400, 500, 600, 700]],
  ['cormorant-garamond', 'Cormorant Garamond', [400, 500, 600]],
]) {
  for (const weight of weights)
    for (const style of family === 'Cormorant Garamond' && weight === 500
      ? ['normal', 'italic']
      : ['normal'])
      for (const subset of ['latin', 'latin-ext']) {
        const font = fs
          .readFileSync(
            new URL(
              `node_modules/@fontsource/${id}/files/${id}-${subset}-${weight}-${style}.woff2`,
              root,
            ),
          )
          .toString('base64');
        embeddedFonts += `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${font}) format('woff2');${subset === 'latin-ext' ? 'unicode-range:U+0100-024F,U+1E00-1EFF;' : ''}}`;
      }
  fs.copyFileSync(
    new URL(`node_modules/@fontsource/${id}/LICENSE`, root),
    path.join(temp, `LICENSE-${id}.txt`),
  );
}

const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
function svg(n) {
  if (n.kind === 'group')
    return `<g id="${esc(n.name.replace(/[^A-Za-z0-9_-]/g, '-'))}-${++layerId}">${n.children.map(svg).join('')}</g>`;
  if (n.kind === 'text')
    return `<text x="${n.x}" y="${n.y + n.baseline}" font-family="${esc(n.font)}" font-size="${n.size}" font-weight="${n.weight}" font-style="${n.italic ? 'italic' : 'normal'}" letter-spacing="${n.spacing}" fill="${esc(n.color)}" xml:space="preserve">${esc(n.text)}</text>`;
  if (n.kind === 'image')
    return `<image x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" preserveAspectRatio="none" xlink:href="data:image/png;base64,${n.data}"/>`;
  return `<svg x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" viewBox="0 0 ${n.w} ${n.h}">${n.markup}</svg>`;
}
try {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    locale: 'tr-TR',
  });
  for (const [name, w] of [
    ['Desktop', 1440],
    ['Mobile', 390],
  ]) {
    const page = await context.newPage();
    await page.setViewportSize({ width: w, height: 980 });
    await page.goto(process.argv[2] || 'http://localhost:5173', {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);
    const height = await page
      .locator('.plate-library')
      .evaluate((el) => Math.ceil(el.getBoundingClientRect().bottom + 24));
    await page.setViewportSize({ width: w, height });
    const nodes = await page.evaluate(async () => {
      const round = (v) => Math.round(v * 100) / 100,
        ctx = document.createElement('canvas').getContext('2d');
      const bounds = (el) => {
        const r = el.getBoundingClientRect();
        return {
          x: round(r.x),
          y: round(r.y),
          w: round(r.width),
          h: round(r.height),
        };
      };
      const art = (r, markup) => ({ kind: 'art', ...r, markup });
      function textLines(node, el, css) {
        const lines = [];
        let line = null;
        // Use browser line breaking for mixed Turkish/Latin text; retain editable characters.
        for (let i = 0; i < node.length; i++) {
          const range = new Range();
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const r = range.getBoundingClientRect();
          if (!r.height || r.y < 0 || r.y >= innerHeight) continue;
          const c = node.data[i].replace(/\s/, ' ');
          if (!line || Math.abs(line.y - r.y) > 1) {
            line = { x: round(r.x), y: round(r.y), h: r.height, text: '' };
            lines.push(line);
          }
          line.text += c;
        }
        const size = parseFloat(css.fontSize),
          font = css.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        ctx.font = `${css.fontStyle} ${css.fontWeight} ${size}px "${font}"`;
        const m = ctx.measureText('Ğğ');
        return lines
          .filter((l) => l.text.trim())
          .map((l) => ({
            kind: 'text',
            ...l,
            font: font === 'monospace' ? 'Roboto Mono' : font,
            spacing: parseFloat(css.letterSpacing) || 0,
            weight: Number(css.fontWeight) || 400,
            size,
            color: css.color,
            italic: css.fontStyle === 'italic',
            baseline: round(
              (l.h - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 +
                m.fontBoundingBoxAscent,
            ),
          }));
      }
      async function walk(el) {
        const c = getComputedStyle(el),
          r = bounds(el),
          cls = el.getAttribute('class') || el.tagName.toLowerCase();
        if (
          c.display === 'none' ||
          c.visibility === 'hidden' ||
          Number(c.opacity) === 0 ||
          r.w <= 0 ||
          r.h <= 0 ||
          r.x + r.w <= 0 ||
          r.x >= innerWidth ||
          r.y >= innerHeight ||
          r.y + r.h <= 0
        )
          return [];
        const result = [];
        if (el instanceof SVGSVGElement) {
          const dup = el.cloneNode(true),
            from = [el, ...el.querySelectorAll('*')],
            to = [dup, ...dup.querySelectorAll('*')];
          from.forEach((e, i) => {
            const s = getComputedStyle(e);
            for (const attr of [
              'fill',
              'stroke',
              'stroke-width',
              'stroke-linecap',
              'stroke-linejoin',
              'opacity',
            ])
              to[i].setAttribute(attr, s.getPropertyValue(attr));
          });
          dup.setAttribute('width', r.w);
          dup.setAttribute('height', r.h);
          return [art(r, dup.outerHTML)];
        }
        if (el instanceof HTMLImageElement) {
          await el.decode();
          const can = document.createElement('canvas');
          const k = Math.min(
            2,
            Math.max(el.naturalWidth / r.w, el.naturalHeight / r.h),
          );
          can.width = Math.max(1, Math.round(r.w * k));
          can.height = Math.max(1, Math.round(r.h * k));
          const g = can.getContext('2d'),
            scale = Math.min(
              can.width / el.naturalWidth,
              can.height / el.naturalHeight,
            );
          const dw = el.naturalWidth * scale,
            dh = el.naturalHeight * scale;
          g.filter = c.filter;
          g.drawImage(el, (can.width - dw) / 2, (can.height - dh) / 2, dw, dh);
          return [{ kind: 'image', ...r, data: can.toDataURL().split(',')[1] }];
        }
        let fill = c.backgroundColor;
        if (el.matches('.edition-cover')) fill = '#302329';
        if (el.matches('.edition-dial')) fill = 'none';
        if (fill !== 'rgba(0, 0, 0, 0)' || parseFloat(c.borderTopWidth) > 0) {
          const line = parseFloat(c.borderTopWidth) || 0,
            rad = c.borderTopLeftRadius.includes('%')
              ? Math.min(r.w, r.h) / 2
              : parseFloat(c.borderTopLeftRadius) || 0;
          result.push(
            art(
              r,
              `<rect x="${line / 2}" y="${line / 2}" width="${Math.max(0, r.w - line)}" height="${Math.max(0, r.h - line)}" rx="${rad}" fill="${fill === 'rgba(0, 0, 0, 0)' ? 'none' : fill}" stroke="${line ? c.borderTopColor : 'none'}" stroke-width="${line}"/>`,
            ),
          );
        }
        if (el.matches('.edition-viewport')) {
          let grid = '';
          for (let x = 0; x < r.w; x += 28) grid += `M${x} 0v${r.h}`;
          for (let y = 0; y < r.h; y += 28) grid += `M0 ${y}h${r.w}`;
          result.push(
            art(
              r,
              `<path d="${grid}" fill="none" stroke="#59434a" stroke-width="0.55" opacity=".54"/>`,
            ),
          );
        }
        if (el.matches('.edition-dial')) {
          result.push(
            art(
              r,
              `<circle cx="${r.w / 2}" cy="${r.h / 2}" r="${r.w * 0.46}" fill="none" stroke="#8c706c" opacity=".4" stroke-width="1" stroke-dasharray="3 4"/>`,
            ),
          );
        }
        for (const n of el.childNodes) {
          if (n.nodeType === 3) result.push(...textLines(n, el, c));
          else if (n.nodeType === 1) result.push(...(await walk(n)));
        }
        return result.length
          ? [{ kind: 'group', name: cls, children: result }]
          : [];
      }
      let out = [];
      for (const sel of ['.sidebar', '.topbar', '.academic-home'])
        out.push(...(await walk(document.querySelector(sel))));
      return out;
    });
    const screen = { name, width: w, height, nodes };
    screens.push(screen);
    fs.writeFileSync(
      path.join(temp, `${name}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}"><title>ANATOMİ / Atlas Edition / ${name}</title><style>${embeddedFonts}</style><rect width="100%" height="100%" fill="#f7f5f0"/>${nodes.map(svg).join('')}</svg>`,
    );
    await page.close();
  }
  const theme = fs.readFileSync(
    new URL('src/editionTokens.json', root),
    'utf8',
  );
  fs.writeFileSync(path.join(temp, 'tokens.json'), theme);
  fs.writeFileSync(
    path.join(temp, 'code.js'),
    `const SCREENS=${JSON.stringify(screens)};\nconst PALETTE=${theme};\n` +
      fs.readFileSync(new URL('design/figma/importer.js', root), 'utf8'),
  );
  fs.copyFileSync(
    new URL('design/figma/README.md', root),
    path.join(temp, 'README.md'),
  );
  execFileSync(
    'python',
    [
      '-m',
      'zipfile',
      '-c',
      path.join(new URL('design/figma/', root).pathname, 'Atlas-Edition.zip'),
      'Desktop.svg',
      'Mobile.svg',
      'tokens.json',
      'code.js',
      'README.md',
      'LICENSE-inter.txt',
      'LICENSE-cormorant-garamond.txt',
    ],
    { cwd: temp },
  );
  console.log(
    'Exported desktop + mobile boards, tokens and native Figma importer.',
  );
} finally {
  await browser.close();
  fs.rmSync(temp, { recursive: true, force: true });
}
