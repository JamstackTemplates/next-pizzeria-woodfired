import type { CSSProperties } from 'react';
import { menu, type Pizza } from '../content/menu';
import { CENTER, CRUST_RADIUS, layoutPizza, SHAPES, type Paint, type ShapePart } from '../lib/pizza-layout';

// Turns a pizza's seeded layout (lib/pizza-layout.ts) into a top-down SVG drawing. Crust, sauce and
// shading come from theme tokens; each topping uses its own `color` from content/menu.ts.

const SHADE = 'rgba(45, 20, 8, .32)';
const SHINE = 'rgba(255, 255, 255, .5)';

function paint(value: Paint | undefined, color: string): string | undefined {
  if (value === 'color') return color;
  if (value === 'shade') return SHADE;
  if (value === 'shine') return SHINE;
  return value === 'none' ? 'none' : undefined;
}

function Part({ part, color }: { part: ShapePart; color: string }) {
  const common = {
    fill: paint(part.fill, color),
    stroke: paint(part.stroke, color),
    strokeWidth: part.strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (part.kind === 'circle') return <circle cx={part.cx} cy={part.cy} r={part.r} {...common} />;
  if (part.kind === 'ellipse') return <ellipse cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry} {...common} />;
  return <path d={part.d} {...common} />;
}

/** A pizza drawn from its toppings. Decorative: the name and toppings are always written beside it. */
export function PizzaArt({ pizza, size = 160, className = '', style }: {
  pizza: Pick<Pizza, 'id' | 'base' | 'toppings'>; size?: number; className?: string; style?: CSSProperties;
}) {
  const layout = layoutPizza(pizza.id, pizza.base, pizza.toppings, menu.toppings);
  const rossa = layout.base === 'rossa';
  return (
    <svg className={`pizza-art ${className}`} style={style} viewBox="-4 -4 212 212" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx={CENTER + 3} cy={CENTER + 5} r={CRUST_RADIUS} fill="var(--pizza-shadow)" />
      <circle cx={CENTER} cy={CENTER} r={CRUST_RADIUS} fill="var(--crust-shadow)" />
      <circle cx={CENTER - 1} cy={CENTER - 1.5} r={CRUST_RADIUS - 3} fill="var(--crust)" />
      {layout.bubbles.map((bubble, i) => (
        <g key={i}>
          <circle cx={bubble.x} cy={bubble.y} r={bubble.r} fill="var(--crust-light)" />
          <circle cx={bubble.x - bubble.r * .25} cy={bubble.y - bubble.r * .3} r={bubble.r * .4} fill={SHINE} opacity=".35" />
          {bubble.char ? <circle cx={bubble.x + bubble.char.dx} cy={bubble.y + bubble.char.dy} r={bubble.char.r} fill="var(--oven-char)" opacity=".85" /> : null}
        </g>
      ))}
      {layout.flecks.map((fleck, i) => <circle key={i} cx={fleck.x} cy={fleck.y} r={fleck.r} fill="var(--oven-char)" opacity=".7" />)}
      <path d={layout.saucePath} fill={rossa ? 'var(--sauce)' : 'var(--bianca)'} />
      {layout.sauceSpots.map((spot, i) => (
        <circle key={i} cx={spot.x} cy={spot.y} r={spot.r} fill={rossa ? 'var(--sauce-spot)' : 'var(--bianca-spot)'} opacity=".55" />
      ))}
      {layout.toppings.map((piece, i) => (
        <g key={i} transform={`translate(${piece.x} ${piece.y}) rotate(${piece.rotate}) scale(${piece.scale})`}>
          {SHAPES[piece.shape].parts.map((part, j) => <Part key={j} part={part} color={piece.color} />)}
        </g>
      ))}
    </svg>
  );
}
