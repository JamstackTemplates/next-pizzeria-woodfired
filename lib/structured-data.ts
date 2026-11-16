import { formatAddress, pizzeria } from '../content/pizzeria';
import { menu } from '../content/menu';
import { mapSearchUrl } from './maps';
import { absoluteUrl } from './paths';

/** schema.org Restaurant for search engines and maps. Built from the same content as the pages. */
export function pizzeriaStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: pizzeria.name,
    description: pizzeria.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: pizzeria.email,
    telephone: pizzeria.ordering.phone,
    servesCuisine: 'Pizza',
    acceptsReservations: false,
    priceRange: '$$',
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: pizzeria.address.street,
      addressLocality: pizzeria.address.locality,
      addressRegion: pizzeria.address.region,
      postalCode: pizzeria.address.postalCode,
      addressCountry: pizzeria.address.country,
    },
    hasMap: mapSearchUrl(formatAddress()),
    // One entry per service, so lunch and dinner each appear with their own hours.
    openingHoursSpecification: pizzeria.hours.flatMap(entry => entry.services.map(service => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${entry.day}`,
      opens: service.opens,
      closes: service.closes,
    }))),
    sameAs: pizzeria.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
