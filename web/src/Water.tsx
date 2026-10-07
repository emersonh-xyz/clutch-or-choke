import type { CSSProperties } from 'react';

// ponytail: fixed bubble layout, deterministic so it never reshuffles on render
const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 8 + ((i * 13) % 34),
  delay: -((i * 2.3) % 14),
  duration: 11 + ((i * 7) % 10),
}));

export const Water = () => (
  <div className="water" aria-hidden>
    <div className="water__sky" />
    <div className="water__sun" />
    <div className="water__sea">
      {/* one untiled turbulence field, so the light pattern never shows seams */}
      <svg className="water__caustics" preserveAspectRatio="none">
        <filter id="caustic" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.006 0.016" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -5 0 0 0 1.15" />
        </filter>
        <rect width="100%" height="100%" filter="url(#caustic)" />
      </svg>
    </div>
    {BUBBLES.map((b, i) => (
      <span
        key={i}
        className="water__bubble"
        style={
          {
            '--left': `${b.left}%`,
            '--size': `${b.size}px`,
            '--delay': `${b.delay}s`,
            '--duration': `${b.duration}s`,
          } as CSSProperties
        }
      />
    ))}
  </div>
);
