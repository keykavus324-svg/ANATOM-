// Coordinate contract for the pinned, x-fastest UINT8 educational template.
export const volumeId = 'mni152-t1-2mm-v1';
export const volumeShape = [99, 117, 95];
export const origin = [-98, -134, -72];
export const step = 2;
export const initialPoint = [49, 58, 44];
export const sourceURL =
  'https://github.com/nilearn/nilearn/blob/dfa32179a7e6d8333c053eaa33498dd385da43e7/nilearn/datasets/data/mni_icbm152_t1_tal_nlin_sym_09a_converted.nii.gz';
export const planes = [
  {
    id: 'axial',
    name: 'Aksiyel',
    u: 0,
    v: 1,
    axis: 2,
    flipU: false,
    edges: ['L', 'R', 'A', 'P'],
  },
  {
    id: 'coronal',
    name: 'Koronal',
    u: 0,
    v: 2,
    axis: 1,
    flipU: false,
    edges: ['L', 'R', 'S', 'I'],
  },
  {
    id: 'sagittal',
    name: 'Sagittal',
    u: 1,
    v: 2,
    axis: 0,
    flipU: true,
    edges: ['A', 'P', 'S', 'I'],
  },
];
export const validPoint = (p) =>
  Array.isArray(p) &&
  p.length === 3 &&
  p.every((v, i) => Number.isInteger(v) && v >= 0 && v < volumeShape[i]);
export const world = (p) => p.map((v, i) => origin[i] + step * v);
export const distance = (a, b) =>
  step * Math.hypot(...a.map((v, i) => v - b[i]));
export const offset = (p) =>
  p[0] + volumeShape[0] * (p[1] + volumeShape[1] * p[2]);
export const project = (p, plane) => [
  plane.flipU ? volumeShape[plane.u] - 1 - p[plane.u] : p[plane.u],
  volumeShape[plane.v] - 1 - p[plane.v],
];
export function pick(p, plane, x, y) {
  const next = [...p];
  const clamp = (v, i) =>
    Math.max(0, Math.min(volumeShape[i] - 1, Math.floor(v)));
  const u = clamp(x, plane.u);
  next[plane.u] = plane.flipU ? volumeShape[plane.u] - 1 - u : u;
  next[plane.v] = volumeShape[plane.v] - 1 - clamp(y, plane.v);
  return next;
}
export function sectionHash(p, anchor = null) {
  const params = new URLSearchParams({ p: world(p).join(',') });
  if (anchor) params.set('a', world(anchor).join(','));
  return `#/kesit/v1?${params}`;
}
function decodePoint(s) {
  if (!s || !/^[-\d]+,[-\d]+,[-\d]+$/.test(s)) return null;
  const p = s.split(',').map((v, i) => (Number(v) - origin[i]) / step);
  return validPoint(p) ? p : null;
}
export function readSection(hash) {
  const params = new URLSearchParams(hash.split('?')[1]);
  const p = decodePoint(params.get('p'));
  return {
    point: p || [...initialPoint],
    anchor: p ? decodePoint(params.get('a')) : null,
  };
}
export function validSectionClip(c) {
  return (
    c?.kind === 'mri' &&
    c.volume === volumeId &&
    validPoint(c.point) &&
    (c.anchor === null || validPoint(c.anchor)) &&
    ['id', 'lesson', 'lang', 'heading', 'text', 'comment'].every(
      (k) => typeof c[k] === 'string',
    )
  );
}
export function coordText(p, anchor = null) {
  const xyz = (v) => world(v).join(', ');
  return anchor
    ? `A (${xyz(anchor)}) mm → B (${xyz(p)}) mm · ${distance(anchor, p).toFixed(1)} mm`
    : `RAS (${xyz(p)}) mm`;
}

export const radii = [4, 6, 10];
export function exerciseHash(point, prompt, radius) {
  return `#/kesit/v1?${new URLSearchParams({ target: world(point).join(','), task: prompt.trim().slice(0, 180), r: String(radius) })}`;
}
export function readExercise(hash) {
  const p = new URLSearchParams(hash.split('?')[1]);
  const target = decodePoint(p.get('target')),
    prompt = p.get('task')?.trim(),
    radius = Number(p.get('r'));
  return target && prompt && prompt.length <= 180 && radii.includes(radius)
    ? { target, prompt, radius }
    : null;
}
