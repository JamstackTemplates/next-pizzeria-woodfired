import type { CSSProperties, ReactNode } from 'react';
import type { Art } from '../content/menu';

// Little illustrations for starters, salads, desserts and drinks, drawn on a 64×64 grid.
// `color` tints the food or drink; outlines, ceramics and glass come from theme tokens.

const line = { stroke: 'var(--art-line)', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
const shine = 'rgba(255,255,255,.5)';
const shade = 'rgba(40,20,10,.2)';

const drawings: Record<Art, (color: string) => ReactNode> = {
  knots: color => (
    <>
      <ellipse cx="32" cy="50" rx="25" ry="6" fill="var(--art-ceramic)" {...line} />
      {[[20, 38], [36, 36], [28, 28], [44, 26]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M${x - 8} ${y}c0-6 6-9 10-6s1 9-3 9-7-5-4-9 9-2 9 3`} fill={color} {...line} strokeWidth={1.8} />
          <circle cx={x - 2} cy={y - 2} r="1" fill="var(--art-leaf)" /><circle cx={x + 3} cy={y + 2} r=".9" fill="var(--art-leaf)" />
        </g>
      ))}
      <path d="M14 34c1-3 3-5 6-6" fill="none" stroke={shine} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  bowl: color => (
    <>
      <path d="M15 30c0-6 7-10 17-10s17 4 17 10" fill={color} {...line} />
      <circle cx="24" cy="26" r="4" fill={color} {...line} strokeWidth={1.6} />
      <circle cx="35" cy="23" r="4.5" fill={color} {...line} strokeWidth={1.6} />
      <circle cx="43" cy="28" r="3.4" fill={color} {...line} strokeWidth={1.6} />
      <path d="M29 20c1-2 3-3 5-2" fill="none" stroke="var(--art-leaf)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 31h48c0 12-10 21-24 21S8 43 8 31z" fill="var(--art-ceramic)" {...line} />
      <path d="M14 36c2 6 6 10 11 11.5" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  salad: color => (
    <>
      <path d="M13 30c-2-8 6-12 10-8 1-7 11-8 13-2 4-5 13-2 11 6 5 1 6 6 3 8" fill="var(--art-leaf)" {...line} />
      <path d="M21 28c2-4 6-6 9-5M36 26c3-3 7-3 9 0" fill="none" stroke={shade} strokeWidth="2" strokeLinecap="round" />
      <circle cx="27" cy="28" r="3.6" fill={color} {...line} strokeWidth={1.5} />
      <circle cx="40" cy="30" r="3" fill={color} {...line} strokeWidth={1.5} />
      <path d="M33 25l5-2" stroke="var(--art-cream)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 31h48c0 12-10 21-24 21S8 43 8 31z" fill="var(--art-ceramic)" {...line} />
      <path d="M14 36c2 6 6 10 11 11.5" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  tiramisu: color => (
    <>
      <ellipse cx="32" cy="52" rx="24" ry="4.5" fill="var(--art-ceramic)" {...line} />
      <path d="M12 26l40-6v26l-40 4z" fill="var(--art-cream)" {...line} />
      <path d="M12 34l40-5M12 42l40-5" stroke={color} strokeWidth="4" />
      <path d="M12 26l40-6v4l-40 6z" fill="var(--art-cocoa)" />
      <path d="M12 26l40-6v26l-40 4z" fill="none" {...line} />
      <circle cx="20" cy="25" r=".8" fill={shine} /><circle cx="34" cy="22.5" r=".8" fill={shine} /><circle cx="44" cy="21.5" r=".7" fill={shine} />
    </>
  ),
  gelato: color => (
    <>
      <path d="M17 34h30l-4 18H21z" fill="var(--art-ceramic)" {...line} />
      <path d="M21 46h22" stroke={shade} strokeWidth="2" />
      <circle cx="25" cy="27" r="9" fill={color} {...line} />
      <circle cx="39" cy="27" r="9" fill="var(--art-cream)" {...line} />
      <path d="M33 34c1-3 3-4 5-3M20 34c1-2 2-3 4-3" fill="none" stroke={shade} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 23c1-2 3-3.5 5-3.5M34 23c1-2 3-3.5 5-3.5" fill="none" stroke={shine} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M44 16l-4 8" stroke="var(--art-dough)" strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  cake: color => (
    <>
      <ellipse cx="32" cy="52" rx="24" ry="4.5" fill="var(--art-ceramic)" {...line} />
      <path d="M12 46V30l34-10 6 4v18L18 50z" fill={color} {...line} />
      <path d="M12 30l34-10 6 4-34 10z" fill="var(--art-cream)" {...line} strokeWidth={1.6} />
      <path d="M18 34v16" {...line} strokeWidth={1.6} />
      <circle cx="36" cy="24" r="3.4" fill="var(--art-cream)" {...line} strokeWidth={1.4} />
      <path d="M22 40c4-1 10-3 14-4.5" fill="none" stroke={shine} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  soda: color => (
    <>
      <path d="M27 6h10v8c0 3 5 5 5 12v26a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V26c0-7 5-9 5-12z" fill={color} {...line} />
      <rect x="26" y="4" width="12" height="5" rx="1.5" fill="var(--art-line)" />
      <rect x="22" y="31" width="20" height="13" fill="var(--art-cream)" {...line} strokeWidth={1.6} />
      <path d="M26 36h12M28 40h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M26 24v-6" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  beer: color => (
    <>
      <path d="M44 24h4a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-4" fill="none" {...line} strokeWidth={3} />
      <path d="M16 18h28v34a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z" fill={color} />
      <path d="M16 18h28v34a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z" fill="var(--art-glass)" opacity=".4" />
      <path d="M14 18c0-5 4-8 8-7 2-4 9-4 11 0 4-2 10 1 10 6 0 3-2 4-4 4H18c-2 0-4-1-4-3z" fill="var(--art-cream)" {...line} />
      <path d="M16 18h28v34a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z" fill="none" {...line} />
      <path d="M21 26v22" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="33" cy="40" r="1.2" fill={shine} /><circle cx="37" cy="32" r="1" fill={shine} /><circle cx="30" cy="48" r=".9" fill={shine} />
    </>
  ),
  wine: color => (
    <>
      <path d="M32 40v13M22 55h20" fill="none" {...line} strokeWidth={2.4} />
      <path d="M20 8h24l1 14c0 8-6 14-13 14s-13-6-13-14z" fill="var(--art-glass)" />
      <path d="M19.6 18h24.8l.6 4c0 8-6 14-13 14s-13-6-13-14z" fill={color} />
      <path d="M20 8h24l1 14c0 8-6 14-13 14s-13-6-13-14z" fill="none" {...line} />
      <path d="M24 12v8" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
};

/** Decorative drawing for a dish, sat on a soft tinted disc. */
export function MenuArt({ art, color, size = 64, className = '' }: { art: Art; color: string; size?: number; className?: string }) {
  return (
    <span className={`menu-art ${className}`} style={{ '--art-tint': color, width: size, height: size } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size} focusable="false">{drawings[art](color)}</svg>
    </span>
  );
}
