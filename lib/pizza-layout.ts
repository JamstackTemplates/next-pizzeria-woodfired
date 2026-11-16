// Draws a pizza from its toppings. Pure data, no React, so it is unit tested directly:
// components/pizza-art.tsx turns the result into SVG.
//
// Positions come from a small seeded random generator keyed on the pizza's id, so the same pizza
// looks the same in every build and a new pizza needs no image file. The drawing is on a 200×200
// grid centred on (100, 100).
import type { Base, Topping, ToppingShape } from '../content/menu';

export const CENTER = 100;
/** Outside edge of the crust. */
export const CRUST_RADIUS = 96;
/** Where the sauce (or the white base) meets the puffy crust. */
export const SAUCE_RADIUS = 78;
/** Toppings stay inside this circle, so none of them sit on the crust. */
export const TOPPING_RADIUS = 74;

/** FNV-1a string hash → 32-bit unsigned integer. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Mulberry32: a tiny, fast, seeded generator returning numbers in [0, 1). */
export function seededRandom(seed: number | string): () => number {
  let state = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Paint for a part: the topping's own colour, a darker shade, a highlight, or nothing. */
export type Paint = 'color' | 'shade' | 'shine' | 'none';

export type ShapePart =
  | { kind: 'circle'; cx: number; cy: number; r: number; fill: Paint; stroke?: Paint; strokeWidth?: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill: Paint; stroke?: Paint; strokeWidth?: number }
  | { kind: 'path'; d: string; fill: Paint; stroke?: Paint; strokeWidth?: number };

export interface ShapeGeometry {
  /** Furthest any part reaches from (0, 0) at scale 1, used to keep toppings inside the crust. */
  extent: number;
  /** Typical number of pieces on a pizza with about three toppings. */
  count: number;
  /** How close pieces of any topping may sit, as a fraction of their combined extents. */
  spacing: number;
  parts: ShapePart[];
}

/**
 * Every topping shape, drawn around (0, 0). Adding a shape to `ToppingShape` in content/menu.ts
 * fails the type check until it is drawn here, and the tests check each one renders.
 */
export const SHAPES: Record<ToppingShape, ShapeGeometry> = {
  round: {
    extent: 9, count: 7, spacing: .9,
    parts: [
      { kind: 'circle', cx: 0, cy: 0, r: 8, fill: 'color', stroke: 'shade', strokeWidth: 1.2 },
      { kind: 'circle', cx: -2.6, cy: -1.8, r: 1.3, fill: 'shade' },
      { kind: 'circle', cx: 2.4, cy: 2.2, r: 1.1, fill: 'shade' },
      { kind: 'circle', cx: 2.2, cy: -2.8, r: .9, fill: 'shade' },
      { kind: 'path', d: 'M-5 2.5a6 6 0 0 0 4 3.5', fill: 'none', stroke: 'shine', strokeWidth: 1.4 },
    ],
  },
  leaf: {
    extent: 8, count: 6, spacing: .7,
    parts: [
      { kind: 'path', d: 'M-7.5 1C-4.5-5.5 3.5-6.5 7.5-1.2 4 4.8-3.6 5.4-7.5 1Z', fill: 'color' },
      { kind: 'path', d: 'M-6.4.9C-2 .1 2.6-.6 6.4-1.1', fill: 'none', stroke: 'shade', strokeWidth: .9 },
      { kind: 'path', d: 'M-2.5-3.4C-.5-4.4 1.8-4.6 3.8-4', fill: 'none', stroke: 'shine', strokeWidth: .9 },
    ],
  },
  blob: {
    extent: 12, count: 6, spacing: .75,
    parts: [
      { kind: 'path', d: 'M-9-2C-10-7-4-11 1-9.5 5-10.5 10.5-7 9.5-2 11.5 2.5 7.5 9 2 8.5-2.5 10.5-9 8.5-9.5 4-11 1.5-10 0-9-2Z', fill: 'color' },
      { kind: 'path', d: 'M-5-4.5C-3-6.5 0-7 2.5-6', fill: 'none', stroke: 'shine', strokeWidth: 1.6 },
      { kind: 'circle', cx: 3.5, cy: 3, r: 1.6, fill: 'shade' },
    ],
  },
  crumble: {
    extent: 4.5, count: 16, spacing: .5,
    parts: [
      { kind: 'circle', cx: -1.6, cy: -1, r: 2.2, fill: 'color' },
      { kind: 'circle', cx: 2.1, cy: -.4, r: 1.6, fill: 'color' },
      { kind: 'circle', cx: .2, cy: 2.2, r: 1.4, fill: 'color' },
      { kind: 'circle', cx: -1.9, cy: -1.5, r: .7, fill: 'shine' },
    ],
  },
  ring: {
    extent: 6, count: 8, spacing: .8,
    parts: [
      { kind: 'circle', cx: 0, cy: 0, r: 4.6, fill: 'none', stroke: 'color', strokeWidth: 2.4 },
      { kind: 'path', d: 'M-3.4-1.6a3.8 3.8 0 0 1 2.4-2.4', fill: 'none', stroke: 'shine', strokeWidth: .9 },
    ],
  },
  strand: {
    extent: 12.5, count: 5, spacing: .55,
    parts: [
      { kind: 'path', d: 'M-10.5 1.5C-7-4-3.5 4.5 0 0S7-4.5 10.5 1', fill: 'none', stroke: 'color', strokeWidth: 3.2 },
      { kind: 'path', d: 'M-8-1.2C-6.4-2.6-5.2-2.2-4.2-1', fill: 'none', stroke: 'shine', strokeWidth: 1 },
    ],
  },
  chilli: {
    extent: 11.5, count: 4, spacing: .9,
    parts: [
      { kind: 'path', d: 'M-7 3.5C-4 4.5 2 3.2 5.5-1.2 6.8-3 5.2-4.4 3.6-3 .5-.3-3.5 1.5-7.5 2.2c-.8.2-.6 1.1.5 1.3Z', fill: 'color' },
      { kind: 'path', d: 'M4.8-3.6C5.6-5.2 7-6.2 8.6-6.4', fill: 'none', stroke: 'shade', strokeWidth: 1.6 },
      { kind: 'path', d: 'M-3.5 1.8C-1 1.2 1.2 0 3-1.6', fill: 'none', stroke: 'shine', strokeWidth: .9 },
    ],
  },
  mushroom: {
    extent: 9.5, count: 6, spacing: .75,
    parts: [
      { kind: 'path', d: 'M-8 0C-8-5.5-4-8.5 0-8.5S8-5.5 8 0C8 1.4 6.6 1.8 5 1.4 3.6 1 2.6 1.2 2.4 2.6L2 7.6C1.9 8.6-1.9 8.6-2 7.6L-2.4 2.6C-2.6 1.2-3.6 1-5 1.4-6.6 1.8-8 1.4-8 0Z', fill: 'color', stroke: 'shade', strokeWidth: 1 },
      { kind: 'path', d: 'M-5.5-1.5C-5-4.5-2.5-6.2 0-6.4', fill: 'none', stroke: 'shine', strokeWidth: 1.1 },
      { kind: 'path', d: 'M-1 1.5V6.5M1 1.5V6.5', fill: 'none', stroke: 'shade', strokeWidth: .6 },
    ],
  },
  dollop: {
    extent: 8.5, count: 6, spacing: .75,
    parts: [
      { kind: 'circle', cx: -3, cy: 1, r: 4.6, fill: 'color' },
      { kind: 'circle', cx: 2.6, cy: 1.8, r: 4.2, fill: 'color' },
      { kind: 'circle', cx: -.2, cy: -2.6, r: 4.6, fill: 'color' },
      { kind: 'path', d: 'M-3-3.8C-2-5.4 0-5.8 1.6-5', fill: 'none', stroke: 'shine', strokeWidth: 1.2 },
      { kind: 'circle', cx: 2.4, cy: 3, r: 1.1, fill: 'shade' },
    ],
  },
};

export interface PlacedTopping {
  /** Topping id from the menu. */
  topping: string;
  shape: ToppingShape;
  color: string;
  x: number;
  y: number;
  /** Degrees. */
  rotate: number;
  scale: number;
}

export interface Bubble {
  x: number;
  y: number;
  r: number;
  /** A leopard-spot char mark on this bubble, offset from its centre. */
  char?: { dx: number; dy: number; r: number };
}

export interface PizzaLayout {
  base: Base;
  /** Wobbly edge where sauce meets crust, as an SVG path. */
  saucePath: string;
  /** Puffs of the cornicione around the rim. */
  bubbles: Bubble[];
  /** Small char flecks on the crust. */
  flecks: { x: number; y: number; r: number }[];
  /** Darker spots in the sauce or oil, for texture. */
  sauceSpots: { x: number; y: number; r: number }[];
  toppings: PlacedTopping[];
}

const round = (value: number) => Math.round(value * 100) / 100;

/** How many pieces of one topping to scatter, fewer when the pizza carries more toppings. */
export function pieceCount(shape: ToppingShape, toppingCount: number): number {
  const density = Math.min(1.15, Math.max(.55, 3.2 / Math.max(1, toppingCount)));
  return Math.max(shape === 'chilli' || shape === 'strand' ? 2 : 3, Math.round(SHAPES[shape].count * density));
}

/**
 * Lay out a pizza. `id` seeds every random choice, so the result is stable across builds.
 * Unknown topping ids are skipped (the content tests report them).
 */
export function layoutPizza(id: string, base: Base, toppingIds: readonly string[], toppings: Record<string, Topping>): PizzaLayout {
  const random = seededRandom(`pizza:${id}`);
  const between = (min: number, max: number) => min + random() * (max - min);
  const at = (angle: number, distance: number) => ({ x: CENTER + Math.cos(angle) * distance, y: CENTER + Math.sin(angle) * distance });

  // Sauce edge: a ring of points with a little wobble, smoothed through their midpoints.
  const edge = Array.from({ length: 26 }, (_, i) => at((i / 26) * Math.PI * 2, SAUCE_RADIUS - between(0, 3.5)));
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const first = mid(edge.at(-1)!, edge[0]);
  const saucePath = `M${round(first.x)} ${round(first.y)}` + edge.map((point, i) => {
    const end = mid(point, edge[(i + 1) % edge.length]);
    return `Q${round(point.x)} ${round(point.y)} ${round(end.x)} ${round(end.y)}`;
  }).join('') + 'Z';

  // The cornicione: overlapping puffs around the rim, some with leopard spots.
  const bubbleCount = 10 + Math.floor(random() * 4);
  const bubbles: Bubble[] = Array.from({ length: bubbleCount }, (_, i) => {
    const angle = ((i + between(-.25, .25)) / bubbleCount) * Math.PI * 2;
    const r = between(5, 8.5);
    const { x, y } = at(angle, between(84, 87));
    const charred = random() < .55;
    return {
      x: round(x), y: round(y), r: round(r),
      ...(charred ? { char: { dx: round(between(-r, r) * .4), dy: round(between(-r, r) * .4), r: round(between(1.2, 2.6)) } } : {}),
    };
  });
  const flecks = Array.from({ length: 16 }, () => {
    const { x, y } = at(between(0, Math.PI * 2), between(81, 93));
    return { x: round(x), y: round(y), r: round(between(.6, 1.6)) };
  });
  const sauceSpots = Array.from({ length: 9 }, () => {
    const { x, y } = at(between(0, Math.PI * 2), Math.sqrt(random()) * 66);
    return { x: round(x), y: round(y), r: round(between(2, 6)) };
  });

  // Toppings, in the order they go on: later ones draw on top.
  const known = toppingIds.filter(topping => toppings[topping]);
  const placed: (PlacedTopping & { reach: number; spacing: number })[] = [];
  for (const toppingId of known) {
    const topping = toppings[toppingId];
    const geometry = SHAPES[topping.shape];
    const count = pieceCount(topping.shape, known.length);
    for (let n = 0; n < count; n++) {
      const scale = round(between(.85, 1.15));
      const reach = geometry.extent * scale;
      const limit = TOPPING_RADIUS - reach - .02;
      let best: { x: number; y: number; gap: number } | undefined;
      for (let attempt = 0; attempt < 24; attempt++) {
        const { x, y } = at(between(0, Math.PI * 2), Math.sqrt(random()) * limit);
        // Distance to the nearest piece, relative to how close the two may sit.
        let gap = Infinity;
        for (const other of placed) {
          const allowed = (reach + other.reach) * Math.min(geometry.spacing, other.spacing);
          gap = Math.min(gap, Math.hypot(x - other.x, y - other.y) / allowed);
        }
        if (!best || gap > best.gap) best = { x, y, gap };
        if (gap >= 1) break;
      }
      placed.push({
        topping: toppingId, shape: topping.shape, color: topping.color,
        x: round(best!.x), y: round(best!.y), rotate: Math.round(between(0, 360)), scale,
        reach, spacing: geometry.spacing,
      });
    }
  }

  return {
    base,
    saucePath,
    bubbles,
    flecks,
    sauceSpots,
    toppings: placed.map(({ reach: _reach, spacing: _spacing, ...piece }) => piece),
  };
}

/** Distance from the centre to the furthest point of a placed piece. */
export function pieceReach(piece: PlacedTopping): number {
  return Math.hypot(piece.x - CENTER, piece.y - CENTER) + SHAPES[piece.shape].extent * piece.scale;
}
