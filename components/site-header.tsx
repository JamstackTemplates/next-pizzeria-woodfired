import { DarkModeToggle } from 'jamstacks';
import { pizzeria, telHref } from '../content/pizzeria';
import { Icon } from './icons';
import { Logo } from './logo';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/menu/', label: 'Menu' },
  { href: '/contact/', label: 'Contact' },
];

/**
 * Two thin courses of running-bond brickwork along the bottom of the header, like the brick arch
 * above the footer, with a faint ember glow below (stronger in dark mode). It sits inside the header,
 * so the header stays exactly --header-h tall.
 */
function BrickCourse() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 print:hidden" aria-hidden="true">
      <svg className="block h-2.5 w-full" focusable="false">
        <defs>
          <pattern id="header-bricks" width="52" height="10" patternUnits="userSpaceOnUse">
            <rect width="52" height="10" fill="var(--brick)" />
            <rect x="1" y="1" width="24" height="3.5" fill="var(--brick-shade)" />
            <rect x="40" y="5.5" width="12" height="4" fill="var(--brick-shade)" />
            <path d="M0 .5H52M0 5H52M0 9.5H52M.5 0V5M26.5 0V5M13.5 5V10M39.5 5V10" stroke="var(--mortar)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#header-bricks)" />
      </svg>
      <div className="absolute inset-x-0 top-full h-3 bg-linear-to-b from-header-glow to-transparent" />
    </div>
  );
}

export function SiteHeader() {
  const { phone } = pizzeria.ordering;
  return (
    <header className="site-header sticky top-0 z-50 bg-bg/85 backdrop-blur-md backdrop-saturate-150">
      <div className="wrap flex min-h-(--header-h) items-center justify-between gap-2 sm:gap-4">
        <SiteLink href="/" className="inline-flex min-w-0 items-center gap-2 no-underline">
          <Logo className="max-sm:size-8" />
          <span className="font-sign text-[1.3rem] leading-none whitespace-nowrap max-[22.5rem]:sr-only sm:text-[1.6rem]">{pizzeria.name}</span>
        </SiteLink>
        <div className="flex items-center gap-1 sm:gap-2.5 print:hidden">
          <nav aria-label="Main">
            <ul className="flex">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent="section"
                    className="inline-block rounded-ui px-2 py-1.5 font-bold text-muted no-underline transition-colors hover:bg-surface-2 hover:text-ink aria-[current]:text-ink aria-[current]:underline aria-[current]:decoration-accent aria-[current]:decoration-2 aria-[current]:underline-offset-[.35em] sm:px-3">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <a className="button button-sm max-sm:px-2.5" href={telHref(phone)} aria-label={`Call to order: ${phone}`}>
            <Icon name="phone" width={17} height={17} />
            <span className="max-sm:hidden">Call</span>
            <span className="max-lg:hidden">{phone}</span>
          </a>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
      <BrickCourse />
    </header>
  );
}
