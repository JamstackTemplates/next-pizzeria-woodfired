import type { Diet } from '../content/menu';

/** Filters offered on the menu page. Each one narrows the menu; several together must all match. */
export type MenuFilter = 'vegetarian' | 'vegan' | 'no-heat';

export const MENU_FILTERS: { id: MenuFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'no-heat', label: 'No heat' },
];

/** What a filter needs to know about an item: its (derived) diet tags and chilli heat. */
export interface FilterFacts {
  diets: readonly Diet[];
  heat?: number;
}

/** Vegan items count as vegetarian even when not tagged twice. */
export function matchesFilter(item: FilterFacts, filter: MenuFilter): boolean {
  switch (filter) {
    case 'vegan': return item.diets.includes('vegan');
    case 'vegetarian': return item.diets.includes('vegetarian') || item.diets.includes('vegan');
    case 'no-heat': return !item.heat;
  }
}

export function matchesAll(item: FilterFacts, filters: readonly MenuFilter[]): boolean {
  return filters.every(filter => matchesFilter(item, filter));
}
