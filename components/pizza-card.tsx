import { BADGES, DIETS, formatPrice, pizzaDiets, startingPrice, toppingLabels, type Pizza } from '../content/menu';
import { menuAnchor } from '../lib/paths';
import { HeatMeter } from './heat-meter';
import { PizzaArt } from './pizza-art';
import { SiteLink } from './site-link';

/** Diet tags (VG, V, N) with full names on hover and for screen readers. */
export function DietTags({ diets }: { diets: readonly (keyof typeof DIETS)[] }) {
  return (
    <>
      {diets.map(diet => (
        <abbr key={diet} className="diet-tag" data-diet={diet} title={DIETS[diet].label}>
          <span aria-hidden="true">{DIETS[diet].short}</span><span className="sr-only">{DIETS[diet].label}</span>
        </abbr>
      ))}
    </>
  );
}

/** Home page "From the oven" card: the drawing, toppings, heat and price, linking to the menu. */
export function PizzaCard({ pizza }: { pizza: Pizza }) {
  return (
    <SiteLink href={menuAnchor(pizza.id)}
      className="group card char-spots relative flex h-full flex-col px-5 pt-5 pb-5 no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lift">
      {pizza.badge ? <span className={`sticker sticker-${pizza.badge} settle absolute top-4 left-4 z-10 -rotate-3`}>{BADGES[pizza.badge]}</span> : null}
      <PizzaArt pizza={pizza} size={190} className="mx-auto mt-1 mb-4 max-w-[70%] transition-transform duration-700 ease-out group-hover:rotate-[24deg] sm:max-w-none" />
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-sign text-[1.5rem] leading-tight">{pizza.name}</span>
        <span className="text-[1.15rem] font-extrabold whitespace-nowrap text-accent tabular-nums">
          {typeof pizza.price === 'number' ? '' : 'from '}{formatPrice(startingPrice(pizza))}
        </span>
      </span>
      <span className="mt-1 flex-1 text-[.95rem] text-muted">{toppingLabels(pizza).join(' · ')}</span>
      <span className="mt-3 flex flex-wrap items-center gap-2">
        <HeatMeter heat={pizza.heat} />
        <DietTags diets={pizzaDiets(pizza)} />
      </span>
    </SiteLink>
  );
}
