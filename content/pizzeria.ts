// Pizzeria details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious pizzeria. The sample address is a public
// landmark (New Haven Green, at Church Street and Chapel Street) so the map has something real to
// show; replace it with yours. Plain strings only: text is rendered as text, never as HTML.
import type { DayHours } from '../lib/hours';

export interface Amenity {
  /** Icon name from components/icons.tsx. */
  icon: 'flame' | 'phone' | 'walk-in' | 'kids' | 'leaf' | 'glass' | 'access' | 'clock';
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SocialLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Ordering {
  /** Number people call for pickup orders, as written for people, e.g. "(203) 555-0147". */
  phone: string;
  /** Orders stop this many minutes before each service closes, e.g. 30. */
  lastOrdersMinutes: number;
  /** Typical wait for a pickup order, e.g. "about 20 minutes". */
  pickupWait: string;
  /** How people pay, e.g. "Pay when you collect: card, tap or cash." */
  payment: string;
}

export interface Pizzeria {
  name: string;
  /** Short line under the name on the home page. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** Home page "the fire" paragraphs: the oven, the dough, the flour and the fire. */
  story: string[];
  /** Short points beside the story, e.g. "48-hour dough". */
  approach: { title: string; detail: string }[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people. Usually the same as `ordering.phone`. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional landmark or cross streets shown under the address. */
    note?: string;
  };
  /** How to find you: transit, parking, step-free access. */
  directions: string[];
  /**
   * Every day of the week, Monday first, with its services in local time (the time zone is `timeZone`
   * in site.config.json). `services: []` means closed all day.
   */
  hours: DayHours[];
  /** Phone ordering for pickup. There is no online ordering or delivery. */
  ordering: Ordering;
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: SocialLink[];
}

const lunch = { label: 'Lunch', opens: '12:00', closes: '14:30' } as const;
const dinner = { label: 'Dinner', opens: '17:00', closes: '22:00' } as const;

export const pizzeria: Pizzeria = {
  name: 'Acme Pizza',
  tagline: 'Wood-fired · blistered · ready in ninety seconds',
  introduction:
    'A neighbourhood pizzeria built around one domed brick oven. Slow-fermented dough, good tomatoes and a fire we light every morning. Eat in, or call ahead and pick up.',
  story: [
    'The oven came first. We built it by hand from firebrick and clay, a low dome with a mouth just wide enough for the peel, and it takes three hours of oak and maple every morning before it’s ready.',
    'The dough is one recipe: flour, water, salt and a little yeast, mixed in the afternoon and left for 48 hours so it turns light, airy and easy to digest. Each pie spends about ninety seconds at 450°C (840°F), long enough for a leopard-spotted crust and a soft, steaming middle.',
  ],
  approach: [
    { title: 'Oak and maple', detail: 'Seasoned hardwood only, split small so the flame rolls across the dome.' },
    { title: '48-hour dough', detail: 'One dough, made in house every day and fermented slowly for flavour.' },
    { title: '90 seconds at 450°C', detail: 'Turned once on the peel. Charred spots are the point, not a mistake.' },
    { title: 'Short menu, good things', detail: 'Tomatoes from one farm, fior di latte made locally, basil torn to order.' },
  ],
  email: 'hello@example.com',
  phone: '(203) 555-0147',
  address: {
    street: 'New Haven Green',
    locality: 'New Haven',
    region: 'CT',
    postalCode: '06510',
    country: 'US',
    note: 'On the corner of Church Street and Chapel Street',
  },
  directions: [
    'CTtransit buses stop on Chapel Street and Church Street, right beside the Green.',
    'A 20-minute walk or a short bus ride from New Haven Union Station (Metro-North and Amtrak).',
    'Metered street parking around the Green; the Temple Street garage is a two-minute walk.',
    'Step-free entrance and an accessible restroom.',
  ],
  hours: [
    { day: 'Monday', services: [] },
    { day: 'Tuesday', services: [lunch, dinner] },
    { day: 'Wednesday', services: [lunch, dinner] },
    { day: 'Thursday', services: [lunch, dinner] },
    { day: 'Friday', services: [lunch, { label: 'Dinner', opens: '17:00', closes: '23:00' }] },
    { day: 'Saturday', services: [{ label: 'All day', opens: '12:00', closes: '23:00' }] },
    { day: 'Sunday', services: [{ label: 'All day', opens: '12:00', closes: '21:00' }] },
  ],
  ordering: {
    phone: '(203) 555-0147',
    lastOrdersMinutes: 30,
    pickupWait: 'about 20 minutes',
    payment: 'Pay when you pick up: card, tap or cash.',
  },
  notice: '',
  amenities: [
    { icon: 'walk-in', title: 'Walk-ins welcome', detail: 'No reservations. Groups of 8 or more, send us a note first.' },
    { icon: 'phone', title: 'Call for pickup', detail: 'Ready in about 20 minutes, hot from the oven.' },
    { icon: 'kids', title: 'Kids welcome', detail: 'High chairs, small plain pizzas and dough to play with.' },
    { icon: 'access', title: 'Step-free', detail: 'Level entrance and an accessible restroom.' },
  ],
  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'We’re walk-in only, and tables turn quickly. For groups of 8 or more, send us a message through the Contact page a few days ahead and we’ll do our best to set you up.',
    },
    {
      question: 'How long does a pickup order take?',
      answer: 'Usually about 20 minutes from your call, a little longer on Friday and Saturday nights. Pizzas take ninety seconds in the oven; the queue is the slow part.',
    },
    {
      question: 'Do you deliver?',
      answer: 'No. A wood-fired pizza is at its best in the first ten minutes, so we only do dine-in and phone orders for pickup.',
    },
    {
      question: 'Do you have vegan and dairy-free options?',
      answer: 'Yes. The Marinara and the Orto have no cheese at all and are vegan as they come, and the menu marks every vegan and vegetarian pizza. The dough is vegan too.',
    },
    {
      question: 'Can you make a gluten-free pizza?',
      answer: 'No, sorry. We make one dough with wheat flour, and flour is in the air all day around the oven and the bench, so we can’t make anything safe for coeliacs or gluten intolerance.',
    },
    {
      question: 'Can I get half-and-half?',
      answer: 'Yes, any two pizzas from the same base (two rosse or two bianche), charged at the higher price.',
    },
    {
      question: 'Are kids welcome?',
      answer: 'Always. We have high chairs, small plain margheritas on request, and a ball of dough to play with while they wait.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = pizzeria.links.filter(link => link.url.trim() !== '');

/** Single-line postal address, also used for the map and directions. */
export function formatAddress(address = pizzeria.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** tel: link for a number written for people, e.g. "(203) 555-0147" → "tel:2035550147". */
export function telHref(phone = pizzeria.ordering.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
