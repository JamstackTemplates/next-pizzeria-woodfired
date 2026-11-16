// The seeded pizza drawings: the same pizza always looks the same, and every topping fits on it.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { allPizzas, menu, TOPPING_SHAPES, type Topping } from '../content/menu.ts';
import {
  CENTER, CRUST_RADIUS, hashString, layoutPizza, pieceCount, pieceReach, SAUCE_RADIUS, seededRandom, SHAPES, TOPPING_RADIUS,
} from '../lib/pizza-layout.ts';

const layout = (pizza: (typeof allPizzas)[number]) => layoutPizza(pizza.id, pizza.base, pizza.toppings, menu.toppings);

test('the seeded generator is deterministic and stays in [0, 1)', () => {
  const a = seededRandom('margherita');
  const b = seededRandom('margherita');
  const values = Array.from({ length: 500 }, () => a());
  assert.deepEqual(values, Array.from({ length: 500 }, () => b()));
  assert.ok(values.every(value => value >= 0 && value < 1));
  assert.notDeepEqual(values.slice(0, 5), Array.from({ length: 5 }, seededRandom('marinara')));
  assert.equal(hashString('margherita'), hashString('margherita'));
});

test('the same pizza draws the same way every time; different pizzas differ', () => {
  for (const pizza of allPizzas) assert.deepEqual(layout(pizza), layout(pizza), pizza.id);
  const [first, second] = allPizzas;
  const same = layoutPizza('a', 'rossa', ['basil'], menu.toppings);
  const other = layoutPizza('b', 'rossa', ['basil'], menu.toppings);
  assert.notDeepEqual(same.toppings, other.toppings, 'the id seeds the positions');
  assert.notDeepEqual(layout(first).toppings, layout(second).toppings);
});

test('every topping of every pizza is drawn, inside the crust', () => {
  for (const pizza of allPizzas) {
    const drawn = layout(pizza);
    for (const topping of pizza.toppings) {
      assert.ok(drawn.toppings.some(piece => piece.topping === topping), `${pizza.id}: no pieces drawn for ${topping}`);
    }
    for (const piece of drawn.toppings) {
      assert.ok(pieceReach(piece) <= TOPPING_RADIUS, `${pizza.id}: a ${piece.topping} piece pokes out onto the crust`);
    }
  }
});

test('toppings stay inside for any id and any mix of shapes', () => {
  const ids = Object.keys(menu.toppings);
  for (let n = 0; n < 300; n++) {
    const random = seededRandom(n);
    const count = 1 + Math.floor(random() * 7);
    const picks = Array.from({ length: count }, () => ids[Math.floor(random() * ids.length)]);
    const drawn = layoutPizza(`test-${n}`, n % 2 ? 'rossa' : 'bianca', [...new Set(picks)], menu.toppings);
    for (const piece of drawn.toppings) {
      assert.ok(pieceReach(piece) <= TOPPING_RADIUS, `test-${n}: ${piece.topping} at ${piece.x},${piece.y}`);
      assert.ok(piece.scale > 0 && Number.isFinite(piece.rotate));
    }
    for (const bubble of drawn.bubbles) {
      assert.ok(Math.hypot(bubble.x - CENTER, bubble.y - CENTER) + bubble.r <= CRUST_RADIUS + .5, `test-${n}: crust bubble outside the pizza`);
    }
  }
  assert.ok(TOPPING_RADIUS < SAUCE_RADIUS && SAUCE_RADIUS < CRUST_RADIUS);
});

test('no shape is left unrenderable', () => {
  assert.deepEqual(Object.keys(SHAPES).sort(), [...TOPPING_SHAPES].sort(), 'lib/pizza-layout.ts draws exactly the shapes content/menu.ts allows');
  for (const shape of TOPPING_SHAPES) {
    const geometry = SHAPES[shape];
    assert.ok(geometry.parts.length >= 1, `${shape} has nothing to draw`);
    assert.ok(geometry.parts.some(part => part.fill === 'color' || part.stroke === 'color'), `${shape} never uses the topping colour`);
    assert.ok(geometry.extent > 0 && geometry.extent < 20 && geometry.count >= 1, `${shape} extent/count`);
    for (const part of geometry.parts) {
      if (part.kind === 'path') assert.match(part.d, /^M[-\d.\s,MCSQLHVZAaclsqhvz]+$/, `${shape} path`);
      // Circles must fit inside the declared extent, including half the stroke.
      if (part.kind === 'circle') {
        const reach = Math.hypot(part.cx, part.cy) + part.r + (part.strokeWidth ?? 0) / 2;
        assert.ok(reach <= geometry.extent, `${shape}: circle reaches ${reach}, beyond extent ${geometry.extent}`);
      }
    }
    // Each shape can be drawn alone, on either base.
    const topping: Topping = { label: shape, shape, color: '#123456' };
    for (const base of ['rossa', 'bianca'] as const) {
      const drawn = layoutPizza(`only-${shape}`, base, ['only'], { only: topping });
      assert.equal(drawn.toppings.length, pieceCount(shape, 1), `${shape} on ${base}`);
    }
  }
});

test('unknown topping ids are skipped rather than crashing the build', () => {
  const drawn = layoutPizza('ghost', 'rossa', ['not-a-topping', 'basil'], menu.toppings);
  assert.ok(drawn.toppings.every(piece => piece.topping === 'basil'));
});
