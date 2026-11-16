import type { Metadata } from 'next';
import { CallToOrder } from '../../components/call-to-order';
import { MenuBoard } from '../../components/menu-board';
import { OrderingStatus } from '../../components/ordering-status';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { SpecialsBoard } from '../../components/specials-board';
import { pizzeria } from '../../content/pizzeria';
import { formatPrice, menu } from '../../content/menu';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `Wood-fired pizzas, this week’s special, starters, salads, desserts and drinks at ${pizzeria.name}. Call to order for pickup.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  const { ordering } = pizzeria;
  return (
    <>
      <PageHead eyebrow="Menu" title={<>Pizza, <em>straight from the fire</em></>}
        after={(
          <div className="mt-7 grid justify-items-start gap-3">
            <CallToOrder />
            <OrderingStatus />
            <p className="text-[.92rem] text-muted">Pickup only, ready in {ordering.pickupWait}. {ordering.payment}</p>
          </div>
        )}>
        <p>
          Every pizza is 12 inches, made to order and in the oven for about ninety seconds. Half-and-half is fine, any two
          from the same base.
        </p>
      </PageHead>

      <section className="wrap pb-6" aria-labelledby="menu-special-title">
        <SpecialsBoard compact headingId="menu-special-title" />
      </section>

      <div className="wrap grid items-start gap-[clamp(1.5rem,4vw,3rem)] pb-(--space-section) lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <MenuBoard />

        <aside className="mt-4 grid gap-4 max-lg:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]" aria-labelledby="extras-title">
          <div className="card p-[1.4rem]">
            <h2 id="extras-title" className="mb-3 text-[1.45rem]">Extras</h2>
            <ul>
              {menu.extras.map(extra => (
                <li key={extra.name} className="flex justify-between gap-4 border-b border-dashed border-line py-2 text-[.95rem]">
                  <span>{extra.name}</span>
                  <span className="font-bold whitespace-nowrap text-accent tabular-nums">{extra.price ? `+${formatPrice(extra.price)}` : 'Free'}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-[1.4rem]">
            <h2 className="mb-2 text-[1.45rem]">The dough</h2>
            <div className="grid gap-2.5 text-[.92rem] text-muted">
              {menu.dough.map(note => <p key={note}>{note}</p>)}
            </div>
          </div>
          <div className="grid gap-3 rounded-card bg-surface-2 p-[1.4rem] text-[.9rem] text-muted">
            <h2 className="text-[1.2rem] text-ink">Allergies</h2>
            {menu.notes.map(note => <p key={note}>{note}</p>)}
            <p><SiteLink href="/contact/" className="text-link">Ordering for a party? Tell us</SiteLink></p>
          </div>
        </aside>
      </div>
    </>
  );
}
