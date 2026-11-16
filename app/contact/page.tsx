import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { Icon } from '../../components/icons';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { PizzaArt } from '../../components/pizza-art';
import { pizzeria, telHref } from '../../content/pizzeria';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Parties, large orders & events',
  description: `Enquiries about parties, large orders and events at ${pizzeria.name}. Tonight’s pickup orders are by phone.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'mb-1 text-[1.35rem]';
const tips = ['The date and time', 'How many people, or how many pizzas', 'Dine-in or pickup', 'Any allergies'];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  const { phone } = pizzeria.ordering;
  return (
    <>
      <PageHead eyebrow="Contact" title={<>Parties, large orders <em>&amp; events</em></>}>
        <p>
          Planning a birthday, feeding the office or hoping to take over the room? Send us an enquiry and someone from the
          pizzeria will reply, usually within a day. Nothing is booked or ordered until we’ve replied to confirm.
        </p>
      </PageHead>

      <div className="wrap">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-ui border-l-4 border-accent bg-surface-2 px-5 py-4 text-[1rem]">
          <Icon name="phone" width={18} height={18} className="flex-none text-accent" />
          <span><strong>Ordering for tonight?</strong> Pickup orders are by phone only: call{' '}
            <a className="text-link whitespace-nowrap" href={telHref(phone)}>{phone}</a>.</span>
        </p>
      </div>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(2rem,4vw,3rem)] pb-(--space-section) lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={pizzeria.email} />
          ) : (
            <div className="card char-spots relative grid justify-items-start gap-[1.1rem] rounded-panel p-[clamp(1.5rem,4vw,2.75rem)] shadow-card">
              <PizzaArt pizza={{ id: 'contact', base: 'rossa', toppings: ['fior-di-latte', 'basil', 'olive'] }} size={96} />
              <h2 className="text-[clamp(1.8rem,3vw,2.3rem)]">Write to us directly</h2>
              <p className="max-w-[34rem] text-muted">
                Email is the best way to reach us about parties and large orders. Tell us what you’re planning, and we’ll
                reply with what we can do. It’s an enquiry, not a booking, until we confirm.
              </p>
              <p><a className="button" href={`mailto:${pizzeria.email}?subject=${encodeURIComponent('Party or large order enquiry')}`}>Email {pizzeria.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 pt-1" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="font-sign text-[1.4rem] wrap-anywhere"><a className="text-link" href={`mailto:${pizzeria.email}`}>{pizzeria.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={pizzeria.email} /></p>

          <h2 className={`mt-5 ${subhead}`}>Phone</h2>
          <p><a className="text-link" href={telHref(phone)}>{phone}</a></p>
          <p className="text-[.92rem] text-muted">For tonight’s pickup orders and quick questions during opening hours.</p>

          <h2 className={`mt-5 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 text-muted">
            {tips.map(tip => (
              <li key={tip} className="relative pl-6 before:absolute before:top-[.1em] before:left-0 before:text-accent before:content-['✦']">{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
