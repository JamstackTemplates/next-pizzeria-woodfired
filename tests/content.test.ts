// Content invariants for the pizzeria and its menu. Runs with Node's built-in TypeScript type stripping.
// When one of these fails after an edit, the message names the item or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { formatAddress, pizzeria, publicLinks, telHref } from '../content/pizzeria.ts';
import {
  allDishes, allPizzas, ARTS, BADGES, BASES, DIETS, featuredPizzas, formatPrice, itemDiets, menu, pizzaDiets,
  specialPizza, startingPrice, TOPPING_SHAPES, type Pizza,
} from '../content/menu.ts';
import { DAYS, formatService, formatTime, groupedHours, SERVICE_LABELS, toMinutes } from '../lib/hours.ts';
import { matchesAll, matchesFilter } from '../lib/menu-filter.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEX = /^#[0-9a-f]{6}$/i;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;

function checkPrice(id: string, price: number | { label: string; amount: number }[]) {
  if (typeof price === 'number') {
    assert.ok(validPrice(price), `${id}: price ${price} must be a positive amount with at most two decimals`);
    return;
  }
  assert.ok(price.length >= 1, `${id}: give at least one size, or a single number`);
  for (const size of price) {
    assert.ok(size.label.trim(), `${id}: every size needs a label`);
    assert.ok(validPrice(size.amount), `${id} ${size.label}: price ${size.amount}`);
  }
  assert.equal(new Set(price.map(size => size.label)).size, price.length, `${id} repeats a size label`);
}

test('sections, pizzas, dishes and toppings have unique, URL-safe ids', () => {
  const sections = [...menu.pizzaSections, ...menu.sections];
  assert.ok(menu.pizzaSections.length >= 1 && allPizzas.length >= 1, 'Add at least one pizza section with a pizza.');
  const ids = [...sections.map(section => section.id), ...allPizzas.map(pizza => pizza.id), ...allDishes.map(dish => dish.id)];
  for (const id of [...ids, ...Object.keys(menu.toppings)]) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique across sections, pizzas and dishes: ${duplicates.join(', ')}`);
  for (const section of sections) {
    assert.ok(section.title.trim() && section.description.trim(), `section ${section.id} needs a title and description`);
    assert.ok(section.items.length >= 1, `section ${section.id} has no items`);
  }
});

test('every topping can be drawn', () => {
  for (const [id, topping] of Object.entries(menu.toppings)) {
    assert.ok(topping.label.trim(), `topping ${id} needs a label`);
    assert.ok(TOPPING_SHAPES.includes(topping.shape), `topping ${id}: shape must be one of ${TOPPING_SHAPES.join(', ')}`);
    assert.match(topping.color, HEX, `topping ${id}: color must be a hex colour such as #3f8a3a`);
    for (const value of topping.contains ?? []) {
      assert.ok(['meat', 'fish', 'dairy', 'egg', 'honey', 'nuts'].includes(value), `topping ${id} contains unknown "${value}"`);
    }
  }
});

test('every pizza is complete', () => {
  for (const pizza of allPizzas) {
    assert.ok(pizza.name.trim(), `${pizza.id}.name`);
    assert.ok(pizza.description.trim(), `${pizza.id}.description`);
    assert.ok(pizza.base in BASES, `${pizza.id}.base must be 'rossa' or 'bianca'`);
    assert.ok(pizza.toppings.length >= 1, `${pizza.id} needs at least one topping`);
    for (const topping of pizza.toppings) {
      assert.ok(topping in menu.toppings, `${pizza.id} lists topping "${topping}", which isn't in menu.toppings`);
    }
    assert.equal(new Set(pizza.toppings).size, pizza.toppings.length, `${pizza.id} lists a topping twice`);
    assert.ok(pizza.toppings.length <= 7, `${pizza.id}: more than 7 toppings won't fit on the drawing`);
    if (pizza.heat !== undefined) assert.ok([0, 1, 2, 3].includes(pizza.heat), `${pizza.id}.heat must be 0, 1, 2 or 3`);
    if (pizza.badge) assert.ok(pizza.badge in BADGES, `${pizza.id} has unknown badge "${pizza.badge}"`);
    checkPrice(pizza.id, pizza.price);
  }
});

test('every starter, salad, dessert and drink is complete', () => {
  for (const dish of allDishes) {
    assert.ok(dish.name.trim(), `${dish.id}.name`);
    assert.ok(dish.description.trim(), `${dish.id}.description`);
    assert.ok(ARTS.includes(dish.art), `${dish.id}.art must be one of ${ARTS.join(', ')}`);
    assert.ok(dish.color.trim(), `${dish.id}.color`);
    for (const diet of dish.diet ?? []) assert.ok(diet in DIETS, `${dish.id} has unknown diet "${diet}"`);
    assert.equal(new Set(dish.diet).size, dish.diet?.length ?? 0, `${dish.id} repeats a diet tag`);
    assert.ok(!(dish.diet?.includes('vegan') && dish.diet.includes('vegetarian')), `${dish.id}: vegan already implies vegetarian, keep just 'vegan'`);
    if (dish.heat !== undefined) assert.ok([0, 1, 2, 3].includes(dish.heat), `${dish.id}.heat must be 0, 1, 2 or 3`);
    if (dish.badge) assert.ok(dish.badge in BADGES, `${dish.id} has unknown badge "${dish.badge}"`);
    checkPrice(dish.id, dish.price);
  }
  for (const extra of menu.extras) assert.ok(extra.name.trim() && extra.price >= 0, `extra "${extra.name}"`);
});

test('pizza diet tags come from their toppings', () => {
  const tags = (id: string) => pizzaDiets(allPizzas.find(pizza => pizza.id === id)!);
  assert.deepEqual(tags('marinara'), ['vegan']);
  assert.deepEqual(tags('orto'), ['vegan']);
  assert.deepEqual(tags('margherita'), ['vegetarian']);
  assert.deepEqual(tags('diavola'), []);
  assert.deepEqual(tags('napoli'), [], 'anchovies are fish');
  assert.deepEqual(tags('squash-sage'), ['vegetarian', 'contains-nuts']);
  // Honey is not vegan.
  const honey: Pizza = { id: 'x', name: 'x', base: 'bianca', toppings: ['hot-honey'], description: 'x', price: 1 };
  assert.deepEqual(pizzaDiets(honey), ['vegetarian']);
  assert.ok(allPizzas.some(pizza => pizzaDiets(pizza).includes('vegan')), 'Keep at least one vegan pizza on the menu.');
});

test('menu filters: vegan implies vegetarian; no heat hides anything with chillies', () => {
  assert.ok(matchesFilter({ diets: ['vegan'] }, 'vegetarian'));
  assert.ok(!matchesFilter({ diets: ['vegetarian'] }, 'vegan'));
  assert.ok(matchesFilter({ diets: [], heat: 0 }, 'no-heat'));
  assert.ok(!matchesFilter({ diets: ['vegan'], heat: 1 }, 'no-heat'));
  assert.ok(matchesAll({ diets: [] }, []));
  const diavola = allPizzas.find(pizza => pizza.id === 'diavola')!;
  assert.ok(!matchesAll({ diets: itemDiets(diavola), heat: diavola.heat }, ['no-heat']));
});

test('this week’s special is a pizza that’s on tonight', () => {
  const pizza = allPizzas.find(item => item.id === menu.special.pizza);
  assert.ok(pizza, `menu.special.pizza "${menu.special.pizza}" must be the id of a pizza`);
  assert.ok(!pizza.soldOut, `This week’s special "${pizza.id}" is marked soldOut; choose another pizza or remove soldOut`);
  assert.equal(specialPizza().id, pizza.id);
  if (menu.special.note) assert.ok(menu.special.note.length <= 60, 'Keep the special’s note short (60 characters or fewer).');
});

test('the home page has 4–6 pizzas to show, all available', () => {
  assert.ok(featuredPizzas.length >= 4 && featuredPizzas.length <= 6, `Mark 4–6 pizzas with featured: true (now ${featuredPizzas.length})`);
  for (const pizza of featuredPizzas) assert.ok(!pizza.soldOut, `${pizza.id} is featured but sold out`);
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(16.5), '$16.50');
  assert.equal(formatPrice(16), '$16');
  assert.equal(formatPrice(0), 'Free');
  assert.equal(startingPrice({ ...allDishes[0], price: [{ label: 'L', amount: 8 }, { label: 'S', amount: 5 }] }), 5);
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
});

test('opening hours list each day once, with valid services in order', () => {
  assert.deepEqual(pizzeria.hours.map(entry => entry.day), [...DAYS], 'List every day once, Monday first.');
  for (const entry of pizzeria.hours) {
    let previousClose = -1;
    for (const service of entry.services) {
      const name = `${entry.day} ${service.label}`;
      assert.ok(SERVICE_LABELS.includes(service.label), `${name}: label must be one of ${SERVICE_LABELS.join(', ')}`);
      assert.match(service.opens, TIME, `${name}.opens must be "HH:MM"`);
      assert.match(service.closes, TIME, `${name}.closes must be "HH:MM"`);
      assert.ok(toMinutes(service.opens) < toMinutes(service.closes), `${name} must open before it closes`);
      assert.ok(toMinutes(service.opens) >= previousClose, `${name} overlaps or comes before the service listed above it`);
      assert.ok(toMinutes(service.closes) - toMinutes(service.opens) > pizzeria.ordering.lastOrdersMinutes,
        `${name} is shorter than ordering.lastOrdersMinutes, so it would never take orders`);
      previousClose = toMinutes(service.closes);
    }
  }
  assert.ok(pizzeria.hours.some(entry => entry.services.length), 'Open on at least one day.');
});

test('phone ordering is set up, with no delivery promises', () => {
  const { ordering } = pizzeria;
  assert.match(ordering.phone, /\d{3}.*\d{4}/, 'ordering.phone');
  assert.match(telHref(ordering.phone), /^tel:\+?\d{7,15}$/);
  assert.ok(Number.isInteger(ordering.lastOrdersMinutes) && ordering.lastOrdersMinutes >= 0 && ordering.lastOrdersMinutes <= 90,
    'ordering.lastOrdersMinutes must be a whole number of minutes, 0–90');
  assert.ok(ordering.pickupWait.trim() && ordering.payment.trim());
  const text = JSON.stringify({ pizzeria, menu });
  assert.doesNotMatch(text, /doordash|uber ?eats|grubhub|postmates|deliveroo|seamless|slice app/i, 'No third-party delivery app names.');
  assert.doesNotMatch(text, /order online|online ordering|we deliver|free delivery/i, 'There is no online ordering or delivery.');
});

test('hours format and group for people', () => {
  assert.equal(formatTime('12:00'), '12pm');
  assert.equal(formatTime('14:30'), '2:30pm');
  assert.equal(formatTime('00:00'), '12am');
  assert.equal(formatService({ label: 'Lunch', opens: '12:00', closes: '14:30' }), '12pm – 2:30pm');
  const lunch = { label: 'Lunch', opens: '12:00', closes: '14:30' } as const;
  const dinner = { label: 'Dinner', opens: '17:00', closes: '22:00' } as const;
  assert.deepEqual(groupedHours([
    { day: 'Monday', services: [] }, { day: 'Tuesday', services: [lunch, dinner] }, { day: 'Wednesday', services: [lunch, dinner] },
    { day: 'Thursday', services: [dinner] },
  ]), [
    { label: 'Monday', services: [] },
    { label: 'Tue – Wed', services: [{ label: 'Lunch', hours: '12pm – 2:30pm' }, { label: 'Dinner', hours: '5pm – 10pm' }] },
    { label: 'Thursday', services: [{ label: 'Dinner', hours: '5pm – 10pm' }] },
  ]);
});

test('contact details and links are publishable', () => {
  assert.match(pizzeria.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(pizzeria.story.length >= 1 && pizzeria.approach.length >= 3 && pizzeria.approach.length <= 4, 'Write 3–4 approach points.');
  assert.ok(pizzeria.faqs.length >= 1 && pizzeria.amenities.length >= 1);
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('America/Los_Angeles'), 'Pacific Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(pizzeria.address[key].trim(), `address.${key}`);
  assert.match(pizzeria.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, 'New Haven Green, New Haven, CT 06510');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=New%20Haven%20Green'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sNew+Haven+Green%2C+New+Haven%2C+CT+06510!6i16');
  assert.ok(mapEmbedUrl('Shop! 1').includes('1sShop%21+1!6i16'));
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
