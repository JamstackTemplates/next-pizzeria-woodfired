import { pizzeria, telHref } from '../content/pizzeria';
import { Icon } from './icons';

/**
 * The primary action: a "Call to order" tel: button, with the number written beside it for
 * desktop visitors who can't tap it.
 */
export function CallToOrder({ className = '', label = 'Call to order' }: { className?: string; label?: string }) {
  const { phone } = pizzeria.ordering;
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <a className="button" href={telHref(phone)}>
        <Icon name="phone" width={18} height={18} />{label}
      </a>
      <a href={telHref(phone)} className="font-sign text-[1.35rem] whitespace-nowrap no-underline hover:text-accent" aria-label={`Phone ${phone}`}>
        {phone}
      </a>
    </span>
  );
}
