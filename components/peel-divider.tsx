/** A wooden pizza peel lying across the page, used as a section divider. Decorative. */
export function PeelDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`wrap flex items-center gap-0 print:hidden ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <svg viewBox="0 0 260 60" width="260" height="60" className="mx-3 max-w-[60vw] flex-none" focusable="false">
        <ellipse cx="130" cy="50" rx="118" ry="5" fill="var(--pizza-shadow)" />
        <path d="M150 27h96a6 6 0 0 1 0 12h-96z" fill="var(--peel-2)" />
        <circle cx="244" cy="33" r="2.4" fill="var(--bg)" />
        <path d="M14 33c0-14 18-24 52-24h44c22 0 40 8 44 18v12c-4 10-22 18-44 18H66C32 57 14 47 14 33z" fill="var(--peel)" />
        <path d="M30 24c10-7 24-9 42-9h30" fill="none" stroke="var(--peel-2)" strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
        <path d="M34 44c12 5 26 6 40 6h26" fill="none" stroke="var(--peel-2)" strokeWidth="1.6" strokeLinecap="round" opacity=".5" />
        <circle cx="60" cy="31" r="2" fill="var(--flour)" /><circle cx="92" cy="40" r="1.6" fill="var(--flour)" />
        <circle cx="110" cy="26" r="1.3" fill="var(--flour)" /><circle cx="76" cy="22" r="1.1" fill="var(--flour)" />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
