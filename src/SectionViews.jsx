import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from './i18n';
import {
  volumeId,
  volumeShape,
  planes,
  offset,
  project,
  pick,
  world,
} from './sectionSpace';
import './sectionLab.css';

let pending;
function getVolume() {
  if (!pending)
    pending = fetch(`${import.meta.env.BASE_URL}sections/${volumeId}.u8`)
      .then(async (response) => {
        if (!response.ok) throw Error('Volume unavailable');
        const data = new Uint8Array(await response.arrayBuffer());
        if (data.length !== volumeShape.reduce((a, b) => a * b))
          throw Error('Invalid volume');
        return data;
      })
      .catch((err) => {
        pending = null;
        throw err;
      });
  return pending;
}
function Plane({ data, point, anchor, plane, onPoint }) {
  const { tr } = useI18n();
  const ref = useRef(null);
  const { axis, u, v, edges } = plane;
  const w = volumeShape[u],
    h = volumeShape[v],
    slice = point[axis];
  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    const frame = ctx.createImageData(w, h);
    const p = [0, 0, 0];
    p[axis] = slice;
    for (let y = 0; y < h; y++) {
      p[v] = h - 1 - y;
      for (let x = 0; x < w; x++) {
        p[u] = plane.flipU ? w - 1 - x : x;
        const val = data[offset(p)],
          i = 4 * (x + y * w);
        frame.data[i] = val;
        frame.data[i + 1] = val;
        frame.data[i + 2] = val;
        frame.data[i + 3] = 255;
      }
    }
    ctx.putImageData(frame, 0, 0);
  }, [data, plane, w, h, slice, u, v, axis]);
  const [x, y] = project(point, plane).map((n) => n + 0.5);
  const xy =
    anchor && anchor[axis] === slice
      ? project(anchor, plane).map((n) => n + 0.5)
      : null;
  function choose(e) {
    if (!onPoint) return;
    const r = e.currentTarget.getBoundingClientRect();
    onPoint(
      pick(
        point,
        plane,
        ((e.clientX - r.left) * w) / r.width,
        ((e.clientY - r.top) * h) / r.height,
      ),
    );
  }
  function arrow(e) {
    const dir = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[e.key];
    if (!onPoint || !dir) return;
    e.preventDefault();
    onPoint(pick(point, plane, x + dir[0], y + dir[1]));
  }
  return (
    <div className="slice-plane">
      <header>
        <b>{tr(plane.name)}</b>
        <small dir="ltr">
          {'XYZ'[axis]} {world(point)[axis]} mm
        </small>
      </header>
      <div className="slice-stage">
        <div
          className="slice-image"
          tabIndex={onPoint ? 0 : undefined}
          role="group"
          aria-label={tr('{plane} kesiti', { plane: tr(plane.name) })}
          onClick={choose}
          onKeyDown={arrow}
        >
          <canvas
            width={w}
            height={h}
            ref={ref}
            aria-label={tr('{plane} kesiti', { plane: tr(plane.name) })}
          />
          <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            <path
              d={`M0 ${y}H${w}M${x} 0V${h}`}
              stroke="#72e1ce"
              strokeWidth="0.42"
            />
            <circle
              cx={x}
              cy={y}
              r="2"
              stroke="#9af5d5"
              strokeWidth=".7"
              fill="none"
            />
            {xy && (
              <g stroke="#ffbf6f" fill="none">
                <path
                  d={`M${x} ${y}L${xy[0]} ${xy[1]}`}
                  strokeWidth=".7"
                  strokeDasharray="2 1"
                />
                <circle cx={xy[0]} cy={xy[1]} r="2.4" strokeWidth="1" />
              </g>
            )}
          </svg>
        </div>
        {edges.map((l, i) => (
          <small key={i} className={`slice-edge e${i}`} aria-hidden="true">
            {l}
          </small>
        ))}
      </div>
      {onPoint && (
        <label className="slice-slider">
          <span>
            {slice + 1} / {volumeShape[axis]}
          </span>
          <input
            type="range"
            min="0"
            max={volumeShape[axis] - 1}
            value={slice}
            aria-label={tr('{plane} dilimi', { plane: tr(plane.name) })}
            aria-valuetext={`${world(point)[axis]} mm`}
            onChange={(e) => {
              const next = [...point];
              next[axis] = Number(e.target.value);
              onPoint(next);
            }}
          />
        </label>
      )}
    </div>
  );
}
export default function SectionViews({ point, anchor, onPoint, onReady }) {
  const { tr } = useI18n();
  const [data, D] = useState(null),
    [error, E] = useState(false),
    [attempt, retry] = useState(0);
  useEffect(() => {
    let active = true;
    E(false);
    getVolume()
      .then((a) => active && D(a))
      .catch(() => active && E(true));
    return () => {
      active = false;
    };
  }, [attempt]);
  useEffect(() => {
    onReady?.(Boolean(data));
  }, [data, onReady]);
  if (!data)
    return (
      <div className="slice-loading" role="status">
        {tr(error ? 'Şablon yüklenemedi.' : 'Kesit hacmi hazırlanıyor…')}
        {error && (
          <button onClick={() => retry((a) => a + 1)}>
            {tr('Yeniden dene')}
          </button>
        )}
      </div>
    );
  return (
    <div className="slice-views" dir="ltr">
      {planes.map((plane) => (
        <Plane key={plane.id} {...{ data, point, anchor, plane, onPoint }} />
      ))}
    </div>
  );
}
