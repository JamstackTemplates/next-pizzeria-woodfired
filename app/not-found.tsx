import type { Metadata } from 'next';
import { PageHead } from '../components/page-head';
import { PizzaArt } from '../components/pizza-art';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="pb-(--space-section)" aria-labelledby="not-found-title">
      <PageHead id="not-found-title" eyebrow="404" title={<>This one fell <em>off the peel…</em></>}
        before={<PizzaArt pizza={{ id: 'dropped', base: 'rossa', toppings: ['fior-di-latte', 'basil'] }} size={110} className="mb-3 rotate-[150deg] opacity-90" />}>
        <p>The link may be out of date, or the page may have moved. There’s plenty more where it came from:</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="text-link">The menu</SiteLink></li>
        <li><SiteLink href="/#find-us" className="text-link">Hours &amp; directions</SiteLink></li>
        <li><SiteLink href="/contact/" className="text-link">Contact</SiteLink></li>
      </ul>
    </section>
  );
}
