import { BASES, formatPrice, menu, pizzaDiets, specialPizza, startingPrice, toppingLabels } from '../content/menu';
import { menuAnchor } from '../lib/paths';
import { HeatMeter } from './heat-meter';
import { OvenStamp } from './oven-stamp';
import { PizzaArt } from './pizza-art';
import { DietTags } from './pizza-card';
import { SiteLink } from './site-link';

/**
 * This week's special, hand-lettered on a framed board beside its drawing. Change it with
 * `special` in content/menu.ts. `compact` is the menu page version.
 */
export function SpecialsBoard({ compact = false, headingId }: { compact?: boolean; headingId?: string }) {
  const pizza = specialPizza();
  const note = menu.special.note;
  const price = `${typeof pizza.price === 'number' ? '' : 'from '}${formatPrice(startingPrice(pizza))}`;
  return (
    <div className={`grid items-center ${compact ? 'gap-5 sm:grid-cols-[minmax(0,1fr)_auto]' : 'gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]'}`}>
      <div className={`board -rotate-[.6deg] ${compact ? 'p-5 sm:p-7' : 'p-[clamp(1.4rem,4vw,2.75rem)]'}`}>
        <p className="board__hand text-[1.15rem] text-board-accent">This week’s special</p>
        <h2 id={headingId} className={`board__hand mt-1 leading-[1.05] font-bold tracking-normal ${compact ? 'text-[clamp(2rem,5vw,2.8rem)]' : 'text-[clamp(2.4rem,6vw,4rem)]'}`}>
          {pizza.name}
        </h2>
        {note ? (
          <p className="board__hand mt-2 inline-block -rotate-1 text-[1.25rem] text-board-accent">
            <span className="underline decoration-wavy decoration-board-accent/60 underline-offset-[.3em]">{note}</span>
          </p>
        ) : null}
        <ul className={`board__hand mt-4 grid gap-0.5 text-[1.2rem] leading-snug ${compact ? 'sm:grid-cols-2 sm:gap-x-6' : ''}`}>
          <li>– {BASES[pizza.base].label.toLowerCase()}</li>
          {toppingLabels(pizza).map(label => <li key={label}>– {label.toLowerCase()}</li>)}
        </ul>
        {compact ? null : <p className="mt-4 max-w-md text-[.98rem] text-board-ink/80">{pizza.description}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="board__hand text-[2.2rem] leading-none font-bold text-board-accent">{price}</span>
          {pizza.heat ? <HeatMeter heat={pizza.heat} /> : null}
          <span className="flex gap-1.5 [&_.diet-tag]:border-board-ink/40 [&_.diet-tag]:bg-transparent [&_.diet-tag]:text-board-ink"><DietTags diets={pizzaDiets(pizza)} /></span>
          {compact ? null : (
            <SiteLink href={menuAnchor(pizza.id)} className="ml-auto font-bold text-board-ink underline decoration-board-accent decoration-2 underline-offset-[.25em] hover:text-board-accent">
              On the menu →
            </SiteLink>
          )}
        </div>
      </div>
      <div className={`relative mx-auto ${compact ? 'max-sm:hidden' : 'w-full max-w-[26rem] max-sm:max-w-[18rem]'}`}>
        <PizzaArt pizza={pizza} size={compact ? 190 : 420} className={compact ? '' : 'h-auto w-full'} />
        <OvenStamp className={`settle absolute ${compact ? '-top-3 -right-4' : 'top-0 right-0 max-sm:size-24'} rotate-[10deg]`} size={compact ? 84 : 120} />
        {compact ? null : <span className="hand-label absolute bottom-[6%] left-0 -rotate-6 text-[1.25rem]">just fired!</span>}
      </div>
    </div>
  );
}
