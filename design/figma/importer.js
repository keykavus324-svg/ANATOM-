// Bundled after SCREENS and PALETTE by scripts/export-edition.mjs.
// Desktop Figma development plugin: creates a new page, never rewrites existing frames.
(async function () {
  const fonts = await figma.listAvailableFontsAsync();
  const fontCache = new Map(),
    textStyles = new Map();
  function rgb(s) {
    if (s[0] === '#')
      return {
        r: parseInt(s.slice(1, 3), 16) / 255,
        g: parseInt(s.slice(3, 5), 16) / 255,
        b: parseInt(s.slice(5, 7), 16) / 255,
      };
    const v = s.match(/[\d.]+/g);
    return { r: +v[0] / 255, g: +v[1] / 255, b: +v[2] / 255 };
  }
  const solid = (s) => [{ type: 'SOLID', color: rgb(s) }];
  async function fontFor(n) {
    const style =
      (n.weight >= 700
        ? 'Bold'
        : n.weight >= 600
          ? 'SemiBold'
          : n.weight >= 500
            ? 'Medium'
            : 'Regular') + (n.italic ? ' Italic' : '');
    const token = n.font + style;
    if (!fontCache.has(token)) {
      const family = fonts.filter((f) => f.fontName.family === n.font);
      const choice =
        family.find(
          (f) =>
            f.fontName.style.replace(/\s/g, '').toLowerCase() ===
            style.replace(/\s/g, '').toLowerCase(),
        ) ||
        family.find((f) =>
          n.italic
            ? /italic/i.test(f.fontName.style)
            : f.fontName.style === 'Regular',
        );
      const fn = choice
        ? choice.fontName
        : { family: 'Inter', style: n.italic ? 'Italic' : 'Regular' };
      await figma.loadFontAsync(fn);
      fontCache.set(token, fn);
    }
    return fontCache.get(token);
  }
  const page = figma.createPage();
  page.name = 'ANATOMİ / Atlas Edition';
  await figma.setCurrentPageAsync(page);
  const paints = {};
  for (const key of Object.keys(PALETTE)) {
    const style = figma.createPaintStyle();
    style.name = 'Atlas Edition / ' + key;
    style.paints = solid(PALETTE[key]);
    paints[key] = style;
  }
  async function draw(n, parent) {
    if (n.kind === 'group') {
      const children = [];
      for (const next of n.children) {
        const node = await draw(next, parent);
        if (node) children.push(node);
      }
      if (!children.length) return null;
      const group = figma.group(children, parent);
      group.name = n.name;
      if (/^station station-/.test(n.name)) {
        const comp = figma.createComponentFromNode(group);
        comp.name = 'Atlas / ' + n.name.split(' ')[1];
        return comp;
      }
      return group;
    }
    let node;
    if (n.kind === 'text') {
      const font = await fontFor(n);
      node = figma.createText();
      node.fontName = font;
      node.fontSize = n.size;
      node.characters = n.text;
      node.letterSpacing = { value: n.spacing, unit: 'PIXELS' };
      node.fills = solid(n.color);
      const key =
        font.family + '/' + font.style + '/' + n.size + '/' + n.spacing;
      if (!textStyles.has(key)) {
        const s = figma.createTextStyle();
        s.name = 'Atlas Edition / ' + key;
        s.fontName = font;
        s.fontSize = n.size;
        s.letterSpacing = node.letterSpacing;
        textStyles.set(key, s);
      }
      await node.setTextStyleIdAsync(textStyles.get(key).id);
    } else if (n.kind === 'image') {
      node = figma.createRectangle();
      node.name = 'Illustration';
      node.resize(n.w, n.h);
      const img = figma.createImage(figma.base64Decode(n.data));
      node.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FIT' }];
    } else {
      node = figma.createNodeFromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${n.w}" height="${n.h}" viewBox="0 0 ${n.w} ${n.h}">${n.markup}</svg>`,
      );
      node.name = 'Vector';
    }
    parent.appendChild(node);
    node.x = n.x;
    node.y = n.y;
    return node;
  }
  const frames = [];
  let left = 0;
  for (const screen of SCREENS) {
    const frame = figma.createFrame();
    frame.name = screen.name + ' / Genel Bakış';
    frame.resize(screen.width, screen.height);
    frame.x = left;
    frame.y = 0;
    await frame.setFillStyleIdAsync(paints.paper.id);
    for (const layer of screen.nodes) await draw(layer, frame);
    frames.push(frame);
    left += screen.width + 100;
  }
  figma.currentPage.selection = frames;
  figma.viewport.scrollAndZoomIntoView(frames);
  figma.closePlugin(
    'Atlas Edition: iki ekran ve tasarım stilleri oluşturuldu.',
  );
})().catch((err) => figma.closePlugin('Aktarım tamamlanamadı: ' + err.message));
