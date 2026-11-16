// The menu. Add, remove, reorder or reprice pizzas and dishes here; every page reads from this file.
// Names and prices are placeholders: replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.

/** Dietary markers shown as tags and used by the menu filters. */
export type Diet = 'vegan' | 'vegetarian' | 'contains-nuts';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegan: { label: 'Vegan', short: 'VG' },
  vegetarian: { label: 'Vegetarian', short: 'V' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

/**
 * How a topping is drawn on the pizza (see lib/pizza-layout.ts). Pick the closest look:
 * round slice (pepperoni, tomato, courgette), torn leaf (basil, rocket), melted blob (mozzarella),
 * crumble (sausage, parmesan, herbs), ring (onion, olive), strand (prosciutto, peppers, a honey drizzle),
 * chilli, mushroom slice, or dollop (ricotta, nduja).
 */
export type ToppingShape = 'round' | 'leaf' | 'blob' | 'crumble' | 'ring' | 'strand' | 'chilli' | 'mushroom' | 'dollop';

export const TOPPING_SHAPES: readonly ToppingShape[] = ['round', 'leaf', 'blob', 'crumble', 'ring', 'strand', 'chilli', 'mushroom', 'dollop'];

/** What a topping contains. Diet tags on pizzas are worked out from these, so they can't drift. */
export type Contains = 'meat' | 'fish' | 'dairy' | 'egg' | 'honey' | 'nuts';

export interface Topping {
  /** Name shown in the topping list, e.g. "Fior di latte". */
  label: string;
  shape: ToppingShape;
  /** Main colour of the drawing, as a hex colour such as "#f4efe2". */
  color: string;
  /** Leave out for plant-based toppings. `meat`/`fish` make a pizza not vegetarian; `dairy`/`egg`/`honey` make it not vegan; `nuts` adds "Contains nuts". */
  contains?: Contains[];
}

export type Base = 'rossa' | 'bianca';

export const BASES: Record<Base, { label: string; detail: string }> = {
  rossa: { label: 'Tomato base', detail: 'San Marzano-style tomatoes, crushed by hand with sea salt' },
  bianca: { label: 'White base', detail: 'Olive oil and garlic, no tomato' },
};

export type Badge = 'signature' | 'seasonal' | 'special' | 'new';

export const BADGES: Record<Badge, string> = {
  signature: 'House signature',
  seasonal: 'Seasonal',
  special: 'This week',
  new: 'New',
};

export interface SizePrice {
  /** e.g. '12"' or '16"'. */
  label: string;
  amount: number;
}

export interface Pizza {
  /** Unique, URL-safe id used for links such as /menu/#margherita. It also seeds the drawing. */
  id: string;
  name: string;
  base: Base;
  /** Topping ids from `toppings`, in the order they go on. They draw the pizza and set its diet tags. */
  toppings: string[];
  description: string;
  /** One price for a 12" pizza, or a price per size. Amounts are in `menu.currency`, e.g. 16.5. */
  price: number | SizePrice[];
  /** Chilli heat from 0 (none) to 3 (hot). Leave out for none. */
  heat?: 0 | 1 | 2 | 3;
  /** Optional sticker. */
  badge?: Badge;
  /** Show on the home page "From the oven". */
  featured?: boolean;
  /** Set to true to keep the pizza listed as "Sold out tonight" without deleting it. */
  soldOut?: boolean;
}

/** Little drawing for non-pizza dishes, tinted by `color`. See components/menu-art.tsx. */
export type Art = 'knots' | 'bowl' | 'salad' | 'tiramisu' | 'gelato' | 'cake' | 'soda' | 'beer' | 'wine';

export const ARTS: readonly Art[] = ['knots', 'bowl', 'salad', 'tiramisu', 'gelato', 'cake', 'soda', 'beer', 'wine'];

export interface Dish {
  /** Unique, URL-safe id used for links such as /menu/#garlic-knots. */
  id: string;
  name: string;
  description: string;
  price: number | SizePrice[];
  diet?: Diet[];
  heat?: 0 | 1 | 2 | 3;
  badge?: Badge;
  art: Art;
  /** Main colour of the drawing. Any CSS colour. */
  color: string;
  /** Set to true to keep the dish listed as "Sold out tonight" without deleting it. */
  soldOut?: boolean;
}

export interface MenuSection<T> {
  /** Unique, URL-safe id used for links such as /menu/#starters. */
  id: string;
  title: string;
  /** Short line shown under the section title. */
  description: string;
  items: T[];
}

export interface Menu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  /** Every ingredient a pizza can list, keyed by a URL-safe id. */
  toppings: Record<string, Topping>;
  /** Pizza sections, e.g. tomato-based and white. */
  pizzaSections: MenuSection<Pizza>[];
  /** Starters, salads, desserts and drinks. */
  sections: MenuSection<Dish>[];
  /** This week's special: the id of a pizza above, plus an optional short note. */
  special: { pizza: string; note?: string };
  /** Add-ons for any pizza. */
  extras: { name: string; price: number }[];
  /** About the dough, shown beside the extras. Be plain about gluten. */
  dough: string[];
  /** Small print under the menu, e.g. allergy advice. */
  notes: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  toppings: {
    'fior-di-latte': { label: 'Fior di latte', shape: 'blob', color: '#f6f1e4', contains: ['dairy'] },
    basil: { label: 'Basil', shape: 'leaf', color: '#3f8a3a' },
    garlic: { label: 'Garlic', shape: 'round', color: '#f1e6c8' },
    oregano: { label: 'Oregano', shape: 'crumble', color: '#5d7a35' },
    parmesan: { label: 'Parmesan', shape: 'crumble', color: '#f3dc9a', contains: ['dairy'] },
    pepperoni: { label: 'Pepperoni', shape: 'round', color: '#b8342a', contains: ['meat'] },
    'spicy-salami': { label: 'Spicy salami', shape: 'round', color: '#9e2b26', contains: ['meat'] },
    nduja: { label: '’Nduja', shape: 'dollop', color: '#c8401f', contains: ['meat'] },
    sausage: { label: 'Fennel sausage', shape: 'crumble', color: '#8a5236', contains: ['meat'] },
    prosciutto: { label: 'Prosciutto', shape: 'strand', color: '#e48a86', contains: ['meat'] },
    anchovy: { label: 'Anchovies', shape: 'strand', color: '#8b7b6b', contains: ['fish'] },
    mushroom: { label: 'Roasted mushrooms', shape: 'mushroom', color: '#b69272' },
    'red-onion': { label: 'Red onion', shape: 'ring', color: '#9b3f7a' },
    olive: { label: 'Black olives', shape: 'ring', color: '#2e2a26' },
    capers: { label: 'Capers', shape: 'crumble', color: '#6b7d3a' },
    rocket: { label: 'Rocket', shape: 'leaf', color: '#4f8a2e' },
    chilli: { label: 'Fresh chilli', shape: 'chilli', color: '#d4311f' },
    'hot-honey': { label: 'Hot honey', shape: 'strand', color: '#e0a02a', contains: ['honey'] },
    ricotta: { label: 'Ricotta', shape: 'dollop', color: '#fbf8f0', contains: ['dairy'] },
    'lemon-zest': { label: 'Lemon zest', shape: 'crumble', color: '#f2cf3a' },
    'roasted-pepper': { label: 'Roasted peppers', shape: 'strand', color: '#d8462c' },
    courgette: { label: 'Courgette', shape: 'round', color: '#8fb35a' },
    potato: { label: 'Potato', shape: 'round', color: '#f0d68c' },
    rosemary: { label: 'Rosemary', shape: 'leaf', color: '#4c6b3c' },
    squash: { label: 'Roasted squash', shape: 'dollop', color: '#e8892f' },
    sage: { label: 'Crispy sage', shape: 'leaf', color: '#7c9a6a' },
    pistachio: { label: 'Pistachio', shape: 'crumble', color: '#93b04a', contains: ['nuts'] },
    'cherry-tomato': { label: 'Cherry tomatoes', shape: 'round', color: '#e0402c' },
  },
  pizzaSections: [
    {
      id: 'pizze-rosse',
      title: 'Pizze rosse',
      description: 'Tomato base: crushed tomatoes and sea salt, nothing else.',
      items: [
        {
          id: 'margherita',
          name: 'Margherita',
          base: 'rossa',
          toppings: ['fior-di-latte', 'basil', 'parmesan'],
          description: 'The one we judge ourselves by. Fior di latte, torn basil, a little parmesan and good olive oil.',
          price: 15,
          badge: 'signature',
          featured: true,
        },
        {
          id: 'marinara',
          name: 'Marinara',
          base: 'rossa',
          toppings: ['garlic', 'oregano', 'basil'],
          description: 'The oldest pizza there is: sliced garlic, wild oregano and olive oil. No cheese, all fire.',
          price: 12,
        },
        {
          id: 'diavola',
          name: 'Diavola',
          base: 'rossa',
          toppings: ['fior-di-latte', 'spicy-salami', 'chilli', 'basil'],
          description: 'Spicy salami that crisps at the edges, fresh chilli and fior di latte.',
          price: 18,
          heat: 2,
          featured: true,
        },
        {
          id: 'hot-honey-pepperoni',
          name: 'Hot honey pepperoni',
          base: 'rossa',
          toppings: ['fior-di-latte', 'pepperoni', 'hot-honey'],
          description: 'Cupped pepperoni with a drizzle of chilli-infused honey as it leaves the oven.',
          price: 19,
          heat: 1,
          badge: 'signature',
          featured: true,
        },
        {
          id: 'fire-escape',
          name: 'Fire escape',
          base: 'rossa',
          toppings: ['fior-di-latte', 'nduja', 'sausage', 'red-onion', 'chilli'],
          description: 'Spreadable ’nduja, fennel sausage, red onion and more fresh chilli than is strictly sensible.',
          price: 20,
          heat: 3,
        },
        {
          id: 'orto',
          name: 'Orto',
          base: 'rossa',
          toppings: ['roasted-pepper', 'courgette', 'red-onion', 'olive', 'basil'],
          description: 'Our vegan garden pizza: roasted peppers, courgette, red onion and olives. No cheese, no compromise.',
          price: 17,
          badge: 'new',
          featured: true,
        },
        {
          id: 'napoli',
          name: 'Napoli',
          base: 'rossa',
          toppings: ['fior-di-latte', 'anchovy', 'capers', 'oregano'],
          description: 'Salty and bright: anchovies, capers, oregano and fior di latte.',
          price: 17,
        },
      ],
    },
    {
      id: 'pizze-bianche',
      title: 'Pizze bianche',
      description: 'White base: olive oil and garlic, no tomato.',
      items: [
        {
          id: 'ricotta-lemon',
          name: 'Ricotta & lemon',
          base: 'bianca',
          toppings: ['fior-di-latte', 'ricotta', 'lemon-zest', 'basil'],
          description: 'Clouds of ricotta, fior di latte, lemon zest and black pepper. Light and very easy to finish.',
          price: 17,
          featured: true,
        },
        {
          id: 'funghi-bianca',
          name: 'Funghi bianca',
          base: 'bianca',
          toppings: ['fior-di-latte', 'mushroom', 'garlic', 'parmesan'],
          description: 'Oven-roasted mushrooms, garlic, fior di latte and parmesan, finished with thyme.',
          price: 18,
          featured: true,
        },
        {
          id: 'squash-sage',
          name: 'Squash & sage',
          base: 'bianca',
          toppings: ['fior-di-latte', 'squash', 'ricotta', 'sage', 'pistachio'],
          description: 'Roasted squash, ricotta, crispy sage and crushed pistachio. Here until the farm runs out.',
          price: 19,
          badge: 'seasonal',
        },
        {
          id: 'patate',
          name: 'Patate',
          base: 'bianca',
          toppings: ['potato', 'rosemary', 'fior-di-latte', 'parmesan'],
          description: 'Paper-thin potato, rosemary and sea salt over fior di latte. Carbs on carbs, as it should be.',
          price: 16,
        },
        {
          id: 'prosciutto-rocket',
          name: 'Prosciutto & rocket',
          base: 'bianca',
          toppings: ['fior-di-latte', 'prosciutto', 'rocket', 'parmesan'],
          description: 'Draped with prosciutto and a handful of peppery rocket after it leaves the oven.',
          price: 21,
          soldOut: true,
        },
      ],
    },
  ],
  sections: [
    {
      id: 'starters',
      title: 'Starters',
      description: 'Small plates while the oven does its thing.',
      items: [
        {
          id: 'garlic-knots',
          name: 'Garlic knots',
          description: 'Six knots of our dough, wood-fired and tossed in garlic butter and parsley.',
          price: 8,
          diet: ['vegetarian'],
          badge: 'signature',
          art: 'knots',
          color: '#e3b56a',
        },
        {
          id: 'burrata',
          name: 'Burrata',
          description: 'A whole burrata with blistered cherry tomatoes, basil and warm dough to tear.',
          price: 14,
          diet: ['vegetarian'],
          art: 'bowl',
          color: '#f6f1e4',
        },
        {
          id: 'meatballs',
          name: 'Meatballs al forno',
          description: 'Pork and beef meatballs baked in tomato in the oven, with parmesan.',
          price: 13,
          art: 'bowl',
          color: '#9a4a2c',
        },
        {
          id: 'olives',
          name: 'Warm olives',
          description: 'Castelvetrano and Kalamata olives warmed with orange peel and chilli.',
          price: 6,
          diet: ['vegan'],
          heat: 1,
          art: 'bowl',
          color: '#6f7d3a',
        },
      ],
    },
    {
      id: 'salads',
      title: 'Salads',
      description: 'Something green to go with all that crust.',
      items: [
        {
          id: 'rocket-salad',
          name: 'Rocket & parmesan',
          description: 'Peppery rocket, shaved parmesan, lemon and olive oil.',
          price: 10,
          diet: ['vegetarian'],
          art: 'salad',
          color: '#5f9a3a',
        },
        {
          id: 'fennel-citrus',
          name: 'Fennel & citrus',
          description: 'Shaved fennel, orange, red onion, olives and mint.',
          price: 11,
          diet: ['vegan'],
          art: 'salad',
          color: '#f0a23c',
        },
        {
          id: 'little-gem',
          name: 'Little gem Caesar',
          description: 'Crisp little gem, anchovy dressing, parmesan and crunchy crusts from the oven.',
          price: 12,
          art: 'salad',
          color: '#9cc25a',
        },
      ],
    },
    {
      id: 'desserts',
      title: 'Desserts',
      description: 'Made here every morning, in small batches.',
      items: [
        {
          id: 'tiramisu',
          name: 'Tiramisu',
          description: 'Espresso-soaked sponge, mascarpone and a heavy dusting of cocoa.',
          price: 9,
          diet: ['vegetarian'],
          badge: 'signature',
          art: 'tiramisu',
          color: '#7a4b2e',
        },
        {
          id: 'gelato',
          name: 'Gelato, two scoops',
          description: 'From a local gelato maker. Ask what’s in the freezer tonight: pistachio is usually there.',
          price: 7,
          diet: ['vegetarian', 'contains-nuts'],
          art: 'gelato',
          color: '#c8d98a',
        },
        {
          id: 'olive-oil-cake',
          name: 'Olive oil cake',
          description: 'A tender orange and olive oil cake with whipped mascarpone.',
          price: 8,
          diet: ['vegetarian'],
          art: 'cake',
          color: '#e9b949',
        },
      ],
    },
    {
      id: 'drinks',
      title: 'Drinks',
      description: 'Cold and simple. Wine by the glass changes with the season.',
      items: [
        {
          id: 'lemon-soda',
          name: 'Sparkling lemon soda',
          description: 'Italian-style lemon soda, or blood orange if you ask.',
          price: 4,
          diet: ['vegan'],
          art: 'soda',
          color: '#f3d23f',
        },
        {
          id: 'cola',
          name: 'Cane sugar cola',
          description: 'In a glass bottle, very cold.',
          price: 4,
          diet: ['vegan'],
          art: 'soda',
          color: '#5a2c1c',
        },
        {
          id: 'lager',
          name: 'Local lager',
          description: 'Crisp, pale and brewed nearby. On draught.',
          price: [{ label: 'Half pint', amount: 5 }, { label: 'Pint', amount: 8 }],
          diet: ['vegan'],
          art: 'beer',
          color: '#e9b23a',
        },
        {
          id: 'red-wine',
          name: 'House red',
          description: 'A juicy, chillable red that loves tomato and char.',
          price: [{ label: 'Glass', amount: 11 }, { label: 'Carafe', amount: 30 }],
          diet: ['vegan'],
          art: 'wine',
          color: '#7a1f33',
        },
        {
          id: 'white-wine',
          name: 'House white',
          description: 'Dry, citrusy and good with the bianche.',
          price: [{ label: 'Glass', amount: 11 }, { label: 'Carafe', amount: 30 }],
          diet: ['vegan'],
          art: 'wine',
          color: '#ead77a',
        },
      ],
    },
  ],
  special: { pizza: 'squash-sage', note: 'While the squash lasts' },
  extras: [
    { name: 'Extra fior di latte', price: 3 },
    { name: 'Chilli oil', price: 1 },
    { name: 'Hot honey', price: 2 },
    { name: '’Nduja', price: 3 },
    { name: 'Burrata on top', price: 6 },
  ],
  dough: [
    'One dough, made in house every day and fermented for 48 hours: wheat flour, water, salt and yeast. It’s vegan.',
    'We can’t make a gluten-free pizza. Flour is everywhere around our oven, so nothing here is safe for coeliacs.',
  ],
  notes: [
    'VG vegan · V vegetarian · N contains nuts. Chillies show the heat, from one to three.',
    'Our kitchen handles wheat, dairy, nuts, fish and sesame. Please tell us about any allergy when you order.',
  ],
};

/** Every pizza, in menu order. */
export const allPizzas: Pizza[] = menu.pizzaSections.flatMap(section => section.items);

/** Every starter, salad, dessert and drink, in menu order. */
export const allDishes: Dish[] = menu.sections.flatMap(section => section.items);

/** Pizzas shown in the home page "From the oven". */
export const featuredPizzas: Pizza[] = allPizzas.filter(pizza => pizza.featured);

export function findPizza(id: string): Pizza | undefined {
  return allPizzas.find(pizza => pizza.id === id);
}

/** This week's special pizza (the content test checks it exists and isn't sold out). */
export function specialPizza(): Pizza {
  return findPizza(menu.special.pizza) ?? allPizzas[0];
}

export function isPizza(item: Pizza | Dish): item is Pizza {
  return 'toppings' in item;
}

/** Diet tags for a pizza, worked out from what its toppings contain. The dough and both bases are vegan. */
export function pizzaDiets(pizza: Pizza, toppings = menu.toppings): Diet[] {
  const contains = new Set(pizza.toppings.flatMap(id => toppings[id]?.contains ?? []));
  const vegetarian = !contains.has('meat') && !contains.has('fish');
  const vegan = vegetarian && !contains.has('dairy') && !contains.has('egg') && !contains.has('honey');
  return [
    ...(vegan ? ['vegan' as const] : vegetarian ? ['vegetarian' as const] : []),
    ...(contains.has('nuts') ? ['contains-nuts' as const] : []),
  ];
}

/** Diet tags for any menu item. */
export function itemDiets(item: Pizza | Dish): Diet[] {
  return isPizza(item) ? pizzaDiets(item) : item.diet ?? [];
}

/** Topping labels in order, e.g. ["Fior di latte", "Basil"]. */
export function toppingLabels(pizza: Pizza): string[] {
  return pizza.toppings.map(id => menu.toppings[id]?.label ?? id);
}

const formatter = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });

/** "$16.50", or "$16" for whole amounts. */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Lowest price, for compact cards. */
export function startingPrice(item: Pizza | Dish): number {
  return typeof item.price === 'number' ? item.price : Math.min(...item.price.map(size => size.amount));
}
