import { formatAddress, pizzeria, publicLinks, telHref } from '../content/pizzeria';
import { groupedHours } from '../lib/hours';
import { Icon } from './icons';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 text-[.78rem] font-extrabold tracking-[.16em] text-footer-soft uppercase';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { phone } = pizzeria.ordering;
  return (
    <footer className="site-footer relative mt-20 bg-footer text-footer-ink">
      {/* Brick arch along the top edge, like the mouth of the oven. */}
      <svg className="absolute inset-x-0 bottom-[calc(100%-1px)] h-10 w-full sm:h-14 print:hidden" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 60V40Q600-22 1200 40V60Z" fill="var(--footer-bg)" />
        <path d="M0 45Q600-17 1200 45" fill="none" stroke="var(--brick)" strokeWidth="12" vectorEffect="non-scaling-stroke" />
        <path d="M0 45Q600-17 1200 45" fill="none" stroke="var(--footer-bg)" strokeWidth="12" strokeDasharray="2 30" vectorEffect="non-scaling-stroke" opacity=".85" />
      </svg>
      <div className="wrap grid gap-x-12 gap-y-9 pt-12 pb-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_.8fr]">
        <div>
          <p className="font-sign text-[2.2rem] leading-none text-footer-flame">{pizzeria.name}</p>
          <p className="mt-2 mb-5 text-[.9rem] text-footer-soft">{pizzeria.tagline}</p>
          <p className="text-[.85rem] font-bold tracking-[.12em] text-footer-soft uppercase">Call to order for pickup</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a className="button" href={telHref(phone)}><Icon name="phone" width={18} height={18} />Call to order</a>
            <a className="font-sign text-[1.5rem] whitespace-nowrap no-underline hover:text-footer-flame" href={telHref(phone)}>{phone}</a>
          </p>
          <address className="mt-6 leading-[1.8] not-italic">
            {formatAddress()}
            {pizzeria.address.note ? <><br /><span className="text-footer-muted">{pizzeria.address.note}</span></> : null}
            <br /><a className="font-bold underline decoration-footer-flame/40 underline-offset-[.2em] hover:decoration-footer-flame" href={`mailto:${pizzeria.email}`}>{pizzeria.email}</a>
          </address>
        </div>
        <div>
          <h2 className={heading}>Hours</h2>
          <ul className="text-[.95rem]">
            {groupedHours(pizzeria.hours).map(group => (
              <li key={group.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-dashed border-white/15 py-2">
                <span className="font-bold">{group.label}</span>
                <span className="grid gap-0.5">
                  {group.services.length ? group.services.map(service => (
                    <span key={service.label} className="flex justify-between gap-3">
                      <span className="text-footer-muted">{service.label}</span><span className="whitespace-nowrap tabular-nums">{service.hours}</span>
                    </span>
                  )) : <span className="text-footer-muted">Closed</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[.85rem] text-footer-muted">Last orders {pizzeria.ordering.lastOrdersMinutes} minutes before closing.</p>
          <TimeZoneNote className="text-footer-muted" />
        </div>
        <div>
          <h2 className={heading}>Around here</h2>
          <ul className="grid gap-2 font-bold [&_a]:no-underline [&_a:hover]:text-footer-flame [&_a:hover]:underline">
            <li><SiteLink href="/menu/">Menu</SiteLink></li>
            <li><SiteLink href="/#special">This week’s special</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/#faq">FAQs</SiteLink></li>
            <li><SiteLink href="/contact/">Parties &amp; large orders</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-5 pb-8 text-[.88rem] text-footer-muted">
        <span>© {year} {pizzeria.name} · fired with oak and maple</span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-footer-flame hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </p>
    </footer>
  );
}
