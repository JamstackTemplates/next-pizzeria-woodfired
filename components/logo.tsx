/** Small brick-oven mark used beside the pizzeria name: a domed arch with a flame inside. Decorative. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={`size-9 flex-none ${className}`} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M3 34C3 17 10 6 20 6s17 11 17 28z" fill="var(--accent)" />
      <path d="M11 34V27a9 9 0 0 1 18 0v7z" fill="var(--mouth)" />
      <path d="M20 19.5c.7 2.4 4.2 3.7 4.2 7.6a4.2 4.2 0 0 1-8.4 0c0-2.1 1.3-3.3 2-4.4.2 1.3.8 2.1 1.8 2.3-.7-1.7-.4-3.6.4-5.5z" fill="var(--fire-2)" />
      <path d="M8 13.5l4 2.4M32 13.5l-4 2.4M20 6v5" stroke="var(--mortar)" strokeWidth="1.4" opacity=".55" />
      <rect x="1" y="33" width="38" height="4" rx="1.5" fill="var(--text)" />
    </svg>
  );
}
