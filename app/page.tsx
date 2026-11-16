import type { Metadata } from 'next';
import { CallToOrder } from '../components/call-to-order';
import { GoogleMap } from '../components/google-map';
import { HeroOven } from '../components/hero-oven';
import { Icon } from '../components/icons';
import { OrderingStatus } from '../components/ordering-status';
import { OvenStamp } from '../components/oven-stamp';
import { PeelDivider } from '../components/peel-divider';
import { PizzaArt } from '../components/pizza-art';
import { PizzaCard } from '../components/pizza-card';
import { SiteLink } from '../components/site-link';
import { SpecialsBoard } from '../components/specials-board';
import { TimeZoneNote } from '../components/time-zone-note';
import { formatAddress, pizzeria, telHref } from '../content/pizzeria';
import { allPizzas, featuredPizzas } from '../content/menu';
import { groupedHours } from '../lib/hours';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl } from '../lib/paths';
import { jsonLd, pizzeriaStructuredData } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

// Repeated text styles, kept here so every section matches.
const sectionTitle = 'mt-2 text-[clamp(2.2rem,5vw,3.6rem)]';
const lede = 'max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)] text-muted';
const panel = 'card rounded-panel p-[clamp(1.4rem,3.5vw,2.5rem)] shadow-card';

export default function HomePage() {
  const { ordering } = pizzeria;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(pizzeriaStructuredData()) }} />

      <section className="overflow-hidden pt-[clamp(1.75rem,4.5vw,3.5rem)] pb-[clamp(2rem,4vw,3rem)]" aria-labelledby="hero-title">
        <div className="wrap grid items-center gap-[clamp(1.5rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <OrderingStatus />
            <h1 id="hero-title" className="mt-5 mb-4 grid gap-3">
              <span className="text-[clamp(3.6rem,10vw,7.4rem)] leading-[.86] font-extrabold tracking-[-.035em] [font-stretch:78%]">
                {pizzeria.name.split(' ').map((word, i) => <span key={word} className={i ? 'block text-accent' : 'block'}>{word}</span>)}
              </span>
              <span className="font-sans text-[clamp(.8rem,1.2vw,.92rem)] font-extrabold tracking-[.18em] text-muted uppercase [font-stretch:100%]">{pizzeria.tagline}</span>
            </h1>
            <p className="max-w-lg text-[clamp(1.08rem,1.6vw,1.24rem)]">{pizzeria.introduction}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-4">
              <CallToOrder />
              <SiteLink href="/menu/" className="button button-ghost">See the menu <Icon name="arrow" width={18} height={18} /></SiteLink>
            </div>
            <p className="mt-6 text-[.95rem] text-muted">
              <a href="#find-us" className="inline-flex items-center gap-2 border-b-[1.5px] border-dashed border-line no-underline hover:border-accent hover:text-ink">
                <Icon name="pin" width={18} height={18} className="flex-none text-accent" />{formatAddress()}
              </a>
            </p>
          </div>
          <div className="hero-glow relative mx-auto w-full max-w-xl lg:max-w-none print:hidden">
            <HeroOven />
            <OvenStamp className="settle absolute top-[2%] right-[2%] rotate-[8deg] max-sm:size-24" size={128} />
          </div>
        </div>
      </section>

      <section id="find-us" className="wrap grid gap-6 pt-[clamp(1rem,3vw,2rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]" aria-labelledby="find-us-title">
        <div className={panel}>
          <p className="eyebrow">Find us</p>
          <h2 id="find-us-title" className="mt-3 flex items-start gap-2 text-[clamp(1.9rem,3.4vw,2.6rem)]">
            <Icon name="pin" width={24} height={24} className="mt-1.5 flex-none text-accent" />
            <span>
              {pizzeria.address.street}
              <span className="mt-1 block font-sans text-[1.05rem] font-bold tracking-normal text-muted [font-stretch:100%]">
                {pizzeria.address.locality}, {pizzeria.address.region} {pizzeria.address.postalCode}
              </span>
            </span>
          </h2>
          {pizzeria.address.note ? <p className="mt-2 text-[.95rem] text-muted">{pizzeria.address.note}</p> : null}
          <p className="mt-5 mb-1 flex flex-wrap gap-3">
            <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <Icon name="arrow" width={18} height={18} /></a>
            <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
          </p>
          {pizzeria.directions.length ? (
            <ul className="mt-5 grid list-disc gap-1.5 pl-[1.1rem] text-[.95rem] text-muted marker:text-accent">
              {pizzeria.directions.map(line => <li key={line}>{line}</li>)}
            </ul>
          ) : null}
          {pizzeria.notice ? (
            <p className="my-4 flex items-start gap-2 rounded-ui bg-accent-soft px-4 py-3 text-[.96rem] font-semibold">
              <Icon name="flame" width={16} height={16} className="mt-1 flex-none text-accent" />{pizzeria.notice}
            </p>
          ) : null}
          <h3 className="mt-7 flex items-center gap-2 text-[1.35rem]"><Icon name="clock" width={20} height={20} className="text-accent" />Opening hours</h3>
          <ul className="mt-2 mb-1">
            {groupedHours(pizzeria.hours).map(group => (
              <li key={group.label} className="grid grid-cols-[minmax(5.5rem,auto)_1fr] gap-x-4 border-b border-dashed border-line py-2.5 sm:grid-cols-[8rem_1fr]">
                <span className="font-bold">{group.label}</span>
                <span className="grid gap-0.5">
                  {group.services.length ? group.services.map(service => (
                    <span key={service.label} className="flex flex-wrap justify-between gap-x-3">
                      <span className="text-muted">{service.label}</span><span className="tabular-nums">{service.hours}</span>
                    </span>
                  )) : <span className="text-muted">Closed</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[.92rem] text-muted">
            Pickup orders by phone until {ordering.lastOrdersMinutes} minutes before each service ends. Ready in {ordering.pickupWait}.
          </p>
          <TimeZoneNote />
        </div>
        <GoogleMap className="min-h-96" />
      </section>

      <PeelDivider className="mt-[clamp(3rem,6vw,5rem)]" />

      <section id="special" className="wrap pt-[clamp(2rem,4vw,3rem)]" aria-labelledby="special-title">
        <SpecialsBoard headingId="special-title" />
      </section>

      <section className="wrap section-y" aria-labelledby="oven-title">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="eyebrow">From the oven</p>
            <h2 id="oven-title" className={sectionTitle}>Tonight’s favourites</h2>
          </div>
          <SiteLink href="/menu/" className="text-link">Full menu · {allPizzas.length} pizzas and more</SiteLink>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPizzas.map(pizza => <li key={pizza.id}><PizzaCard pizza={pizza} /></li>)}
        </ul>
      </section>

      <section className="section-y relative overflow-hidden border-y border-line bg-band" aria-labelledby="fire-title">
        <div className="wrap grid items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow">The fire</p>
            <h2 id="fire-title" className={sectionTitle}>Ninety seconds, <em>no shortcuts</em></h2>
            {pizzeria.story.map(paragraph => <p key={paragraph} className={`mt-5 ${lede}`}>{paragraph}</p>)}
            <ul className="mt-9 grid gap-x-7 gap-y-5 sm:grid-cols-2">
              {pizzeria.approach.map((point, i) => (
                <li key={point.title} className="flex items-start gap-3.5">
                  <span className="grid size-11 flex-none place-items-center rounded-full border-[1.5px] border-line bg-surface text-accent">
                    <Icon name={(['wood', 'dough', 'thermometer', 'leaf'] as const)[i % 4]} />
                  </span>
                  <span>
                    <strong className="block font-extrabold">{point.title}</strong>
                    <span className="block text-[.95rem] leading-normal text-muted">{point.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <FiredTonight />
        </div>
      </section>

      <section className="wrap pt-[clamp(3rem,6vw,5rem)]" aria-labelledby="parties-title">
        <div className="relative grid items-center gap-x-8 gap-y-5 overflow-hidden rounded-panel bg-footer p-[clamp(1.5rem,4vw,2.75rem)] text-footer-ink shadow-lift md:grid-cols-[auto_1fr_auto]">
          <div className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-[radial-gradient(circle,var(--fire-glow),transparent_65%)] opacity-35" aria-hidden="true" />
          <PizzaArt pizza={{ id: 'party-pie', base: 'rossa', toppings: ['fior-di-latte', 'pepperoni', 'basil'] }} size={112} className="max-md:hidden -rotate-12" />
          <div>
            <h2 id="parties-title" className="text-[clamp(1.9rem,3.4vw,2.6rem)] text-footer-ink">Parties, large orders &amp; events</h2>
            <p className="mt-2 max-w-xl text-footer-soft">
              A birthday for twelve, twenty pizzas for the office, or the whole room on a Monday? Tell us the date and how many,
              and we’ll get back to you to work it out.
            </p>
          </div>
          <p className="relative"><SiteLink href="/contact/" className="button">Send an enquiry <Icon name="arrow" width={18} height={18} /></SiteLink></p>
        </div>
      </section>

      {pizzeria.faqs.length ? (
        <section id="faq" className="wrap section-y" aria-labelledby="faq-title">
          <p className="eyebrow">FAQs</p>
          <h2 id="faq-title" className={sectionTitle}>Good to know</h2>
          <div className="mt-7 grid max-w-[52rem] gap-3">
            {pizzeria.faqs.map(faq => (
              <details key={faq.question} className="faq card">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[1.05rem] font-extrabold">{faq.question}</summary>
                <p className="max-w-(--measure) px-5 pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-muted">
            Something else? Call <a className="text-link" href={telHref()}>{ordering.phone}</a> or{' '}
            <SiteLink href="/contact/" className="text-link">send us a message</SiteLink>.
          </p>
        </section>
      ) : null}
    </>
  );
}

/** The stamped "Fired tonight" card beside the story: the numbers that matter. */
function FiredTonight() {
  const facts = [
    { value: '450°C', label: 'in the dome' },
    { value: '90 sec', label: 'per pizza' },
    { value: '48 hr', label: 'dough' },
  ];
  return (
    <div className="card char-spots relative mx-auto w-full max-w-md rotate-[1.2deg] rounded-panel p-7 pt-8 shadow-lift">
      <OvenStamp className="settle absolute -top-10 -left-6 -rotate-12" size={112} text="Fired tonight · Fired tonight · " center="Fired" sub="tonight" />
      <p className="hand-label mt-10 text-[1.4rem]">today’s fire</p>
      <dl className="mt-3 grid grid-cols-3 gap-3 border-y border-dashed border-line py-5 text-center">
        {facts.map(fact => (
          <div key={fact.label}>
            <dt className="sr-only">{fact.label}</dt>
            <dd className="font-sign text-[clamp(1.6rem,4vw,2.2rem)] leading-none text-accent">{fact.value}</dd>
            <dd className="mt-1.5 text-[.85rem] font-bold text-muted">{fact.label}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[.98rem] text-muted">Oak and maple, lit every morning. The oven is ready when the dome burns clear and white.</p>
    </div>
  );
}
