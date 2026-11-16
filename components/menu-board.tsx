'use client';

import { useState } from 'react';
import {
  BADGES, BASES, formatPrice, itemDiets, menu, toppingLabels, type Dish, type MenuSection, type Pizza,
} from '../content/menu';
import { MENU_FILTERS, matchesAll, type MenuFilter } from '../lib/menu-filter';
import { HeatMeter } from './heat-meter';
import { Icon } from './icons';
import { MenuArt } from './menu-art';
import { PizzaArt } from './pizza-art';
import { DietTags } from './pizza-card';

const chipSmall = 'chip min-h-[2.1rem] py-0.5 text-[.88rem]';
const itemCard = 'menu-item card relative flex scroll-mt-[7.25rem] items-start rounded-card transition hover:border-accent/40 hover:shadow-card';

function Price({ price, dim }: { price: Pizza['price']; dim: boolean }) {
  const base = `font-extrabold whitespace-nowrap text-accent tabular-nums ${dim ? 'opacity-60' : ''}`;
  if (typeof price === 'number') return <span className={`${base} text-[1.1rem]`}>{formatPrice(price)}</span>;
  return (
    <span className={`${base} grid justify-items-end gap-px text-[.95rem]`}>
      {price.map(size => (
        <span key={size.label}><span className="text-[.8rem] font-semibold text-muted">{size.label}</span> {formatPrice(size.amount)}</span>
      ))}
    </span>
  );
}

function Stickers({ item }: { item: Pizza | Dish }) {
  const special = 'toppings' in item && item.id === menu.special.pizza;
  return (
    <>
      {item.soldOut ? <span className="sticker sticker-soldout">Sold out tonight</span> : null}
      {special ? <span className="sticker sticker-special">{BADGES.special}</span> : null}
      {item.badge && !(special && item.badge === 'special') ? <span className={`sticker sticker-${item.badge}`}>{BADGES[item.badge]}</span> : null}
    </>
  );
}

function PizzaItem({ pizza }: { pizza: Pizza }) {
  const soldOut = !!pizza.soldOut;
  return (
    <li id={pizza.id} data-sold-out={soldOut} className={`${itemCard} gap-4 p-4 sm:gap-5 sm:p-5`}>
      <PizzaArt pizza={pizza} size={104} className="max-xs:size-[76px]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className={`text-[1.4rem] leading-tight ${soldOut ? 'opacity-60' : ''}`}>{pizza.name}</h3>
          <span className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-line" aria-hidden="true" />
          <Price price={pizza.price} dim={soldOut} />
        </div>
        <p className="mt-1 text-[.92rem] font-bold">
          <span className="text-muted">{BASES[pizza.base].label}</span> · {toppingLabels(pizza).join(', ')}
        </p>
        <p className="mt-1 text-[.95rem] leading-normal text-muted">{pizza.description}</p>
        <p className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Stickers item={pizza} />
          <HeatMeter heat={pizza.heat} className="mr-1" />
          <DietTags diets={itemDiets(pizza)} />
        </p>
      </div>
    </li>
  );
}

function DishItem({ dish }: { dish: Dish }) {
  const soldOut = !!dish.soldOut;
  return (
    <li id={dish.id} data-sold-out={soldOut} className={`${itemCard} gap-3 p-3.5 sm:gap-4 sm:px-[1.1rem] sm:py-4`}>
      <MenuArt art={dish.art} color={dish.color} size={58} className="max-sm:size-[46px]!" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className={`text-[1.2rem] leading-tight ${soldOut ? 'opacity-60' : ''}`}>{dish.name}</h3>
          <span className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-line" aria-hidden="true" />
          <Price price={dish.price} dim={soldOut} />
        </div>
        <p className="mt-1 text-[.95rem] leading-normal text-muted">{dish.description}</p>
        {soldOut || dish.badge || dish.heat || dish.diet?.length ? (
          <p className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Stickers item={dish} />
            {dish.heat ? <HeatMeter heat={dish.heat} className="mr-1" /> : null}
            <DietTags diets={itemDiets(dish)} />
          </p>
        ) : null}
      </div>
    </li>
  );
}

type AnySection = { section: MenuSection<Pizza>; kind: 'pizza' } | { section: MenuSection<Dish>; kind: 'dish' };

const facts = (item: Pizza | Dish) => ({ diets: itemDiets(item), heat: item.heat });

/**
 * The full menu with section shortcuts and filters. The complete menu is in the static HTML;
 * filtering is a progressive enhancement that only hides non-matching items.
 */
export function MenuBoard() {
  const [filters, setFilters] = useState<MenuFilter[]>([]);
  const sections: AnySection[] = [
    ...menu.pizzaSections.map(section => ({ section, kind: 'pizza' as const })),
    ...menu.sections.map(section => ({ section, kind: 'dish' as const })),
  ];
  const counts: Record<string, number> = Object.fromEntries(sections.map(({ section }) =>
    [section.id, (section.items as (Pizza | Dish)[]).filter(item => matchesAll(facts(item), filters)).length]));
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  const toggle = (id: MenuFilter) =>
    setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);

  return (
    <div>
      <div className="sticky top-(--header-h) z-20 mb-2 grid gap-2.5 border-b border-line bg-bg/92 py-3.5 backdrop-blur-md print:hidden">
        <nav className="scrollbar-none flex gap-2 overflow-x-auto p-0.5" aria-label="Menu sections">
          {sections.map(({ section }) => (
            <a key={section.id} href={`#${section.id}`} className={chipSmall}>
              {section.title}
              {filters.length ? (
                <span className="min-w-[1.4rem] rounded-full bg-accent-soft px-1.5 text-center text-[.78rem] text-accent-strong">{counts[section.id]}</span>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="scrollbar-none flex gap-2 overflow-x-auto p-0.5" role="group" aria-label="Menu filters">
          <span className="inline-flex items-center gap-1.5 pr-1 text-[.85rem] font-bold whitespace-nowrap text-muted"><Icon name="filter" width={16} height={16} />Show only</span>
          {MENU_FILTERS.map(filter => (
            <button key={filter.id} type="button" className={chipSmall} aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}>
              {filter.label}
            </button>
          ))}
          {filters.length ? <button type="button" className={`${chipSmall} border-dashed text-muted`} onClick={() => setFilters([])}>Clear</button> : null}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {filters.length ? `${total} items match.` : ''}
        </p>
      </div>

      {sections.map(({ section, kind }) => (
        <section key={section.id} id={section.id} className="scroll-mt-[7.25rem] pt-8 pb-4" aria-labelledby={`${section.id}-title`}>
          <header className="mb-5 grid gap-1.5">
            <h2 id={`${section.id}-title`} className="text-[clamp(2rem,4vw,2.8rem)] after:mt-2.5 after:block after:h-1.5 after:w-16 after:rounded after:bg-linear-to-r after:from-accent after:to-ember">
              {section.title}
            </h2>
            <p className="text-muted">{section.description}</p>
          </header>
          {counts[section.id] ? (
            <ul className={kind === 'pizza' ? 'grid gap-3.5 xl:grid-cols-2 xl:[&>li:last-child:nth-child(odd)]:col-span-2' : 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,21rem),1fr))] gap-3.5'}>
              {kind === 'pizza'
                ? section.items.filter(item => matchesAll(facts(item), filters)).map(item => <PizzaItem key={item.id} pizza={item} />)
                : section.items.filter(item => matchesAll(facts(item), filters)).map(item => <DishItem key={item.id} dish={item} />)}
            </ul>
          ) : (
            <p className="rounded-ui border-[1.5px] border-dashed border-line p-5 text-muted">Nothing here matches those filters. Ask us when you call: we can often leave something off.</p>
          )}
        </section>
      ))}
    </div>
  );
}
