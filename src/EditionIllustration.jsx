import React from 'react';
// Small original atlas-workstation glyphs. Geometry stays vector in the Figma handoff.
export default function EditionIllustration({ type }) {
  return (
    <svg
      className="station-art"
      viewBox="0 0 120 78"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {type === 'library' && (
        <>
          <path
            d="m16 42 44 21 44-21v6L60 69 16 48z"
            fill="currentColor"
            opacity=".10"
          />
          <path d="m16 42 44 21 44-21M16 47l44 21 44-21M18 37l42 20 42-20" />
          <path
            d="M60 51 19 32V14c13 0 27 6 41 16 14-10 28-16 41-16v18z"
            fill="var(--tile)"
          />
          <path d="M60 30v21m-35-30c8 1 18 6 27 11m-27-5c9 2 18 6 27 11m17-7c9-5 17-9 25-10m-25 16c9-5 17-9 25-10" />
        </>
      )}
      {type === 'atlas' && (
        <>
          <path
            d="m17 49 43-22 43 22-43 22z"
            fill="currentColor"
            opacity=".12"
          />
          <path d="m17 49 43 22 43-22M17 41l43 22 43-22M17 33l43 22 43-22" />
          <path d="m17 25 43-21 43 21-43 22z" fill="var(--tile)" />
          <path d="M36 26q7-10 20-11 5-4 13 0 10 0 14 7l-8 8-12 3-16-2-11-5zM51 19q8 1 9 6l11-3m-12 8 4-5M25 32v8m69-8v8" />
        </>
      )}
      {type === 'sections' && (
        <>
          <ellipse
            cx="52"
            cy="33"
            rx="24"
            ry="27"
            fill="currentColor"
            opacity=".08"
          />
          <ellipse cx="52" cy="33" rx="24" ry="27" />
          <path d="M56 7c21-2 32 16 29 31-2 13-11 21-27 22" />
          <ellipse cx="52" cy="33" rx="13" ry="17" />
          <path d="m54 40 37 16v8L52 48zm-25 5-8 11 35 15 12-8m14-7 14-5 8 4-12 4M35 10l5 5m-12 8 5 2m14-17 1 5m11-4-2 5" />
        </>
      )}
      {type === 'planner' && (
        <>
          <path
            d="m24 43 38 18 34-18v7L62 69 24 50z"
            fill="currentColor"
            opacity=".09"
          />
          <path d="m25 43 37 18 35-18M25 49l37 19 35-19" />
          <path d="m30 33 25-25 40 18-30 30z" fill="var(--tile)" />
          <path d="m45 29 4 2 8-6m1 10 17 8M51 23l5 2 8-6m1 10 16 7m-40 0 5 3 7-5" />
        </>
      )}
      <g opacity=".55">
        <path d="M8 63v6m-3-3h6m95-56v6m-3-3h6" />
      </g>
    </svg>
  );
}
