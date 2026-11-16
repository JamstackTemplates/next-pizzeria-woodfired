import type { ReactNode } from 'react';

/** Heading block for inner pages: eyebrow, large sign-painted title (use <em> for the accent words) and a lede. */
export function PageHead({ eyebrow, title, children, id, before, after }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the eyebrow. */
  before?: ReactNode;
  /** Optional content under the lede, e.g. the call-to-order row. */
  after?: ReactNode;
}) {
  return (
    <header className="wrap pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(1.5rem,3vw,2.5rem)]">
      {before}
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={id} className="mt-3 mb-5 max-w-[16ch] text-[clamp(2.7rem,7vw,5rem)] leading-[.95] font-extrabold">{title}</h1>
      {children ? <div className="max-w-(--measure) text-[clamp(1.08rem,1.6vw,1.22rem)] text-muted">{children}</div> : null}
      {after}
    </header>
  );
}
