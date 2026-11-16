'use client';

import { useEffect, useState } from 'react';
import { pizzeria } from '../content/pizzeria';
import { describeOrdering, orderingState, zonedNow, type OrderingTone } from '../lib/hours';

/**
 * "Taking orders · last orders 9:30pm" pill. The static HTML shows a neutral "Call to order for pickup"
 * with the number; the browser fills in the live state after hydration (so the build never bakes in the
 * time it ran) and refreshes it each minute. Without a configured time zone the neutral label stays.
 */
export function OrderingStatus({ className = '' }: { className?: string }) {
  // Inlined at build time from site.config.json `timeZone` (see next.config.mjs).
  const timeZone = process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '';
  const [label, setLabel] = useState<{ text: string; tone: OrderingTone } | null>(null);

  useEffect(() => {
    if (!timeZone) return;
    const update = () => {
      const now = zonedNow(timeZone);
      setLabel(describeOrdering(orderingState(now.day, now.minutes, pizzeria.hours, pizzeria.ordering.lastOrdersMinutes)));
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [timeZone]);

  return (
    <span className={`order-status inline-flex items-center gap-2 rounded-full border-[1.5px] border-line bg-surface py-1.5 pr-3.5 pl-3 text-[.9rem] font-bold shadow-card ${className}`}
      data-tone={label?.tone}>
      <span className="order-dot" aria-hidden="true" />
      <span>{label?.text ?? 'Call to order for pickup'}<span className="order-phone"> · {pizzeria.ordering.phone}</span></span>
    </span>
  );
}
