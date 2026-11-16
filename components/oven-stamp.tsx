import { useId } from 'react';

/**
 * Round rubber stamp with text around the edge, e.g. "Fresh from the oven". Decorative unless
 * `label` is given. Settles into place once on page load (stopped under reduced motion).
 */
export function OvenStamp({ text = 'Fresh from the oven · Fired tonight · ', center = '450°', sub = 'Celsius', size = 132, className = '' }: {
  text?: string; center?: string; sub?: string; size?: number; className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg className={`stamp ${className}`} viewBox="0 0 140 140" width={size} height={size} aria-hidden="true" focusable="false">
      <defs><path id={`stamp-${id}`} d="M70 70m-50 0a50 50 0 1 1 100 0a50 50 0 1 1-100 0" /></defs>
      <circle cx="70" cy="70" r="66" fill="var(--surface)" stroke="var(--accent)" strokeWidth="3" />
      <circle cx="70" cy="70" r="37" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="2 3" />
      <text fill="var(--accent)" fontSize="12.5"><textPath href={`#stamp-${id}`} textLength="308">{text}</textPath></text>
      <text x="70" y="74" textAnchor="middle" fill="var(--accent)" fontSize="26">{center}</text>
      <text x="70" y="91" textAnchor="middle" fill="var(--accent)" fontSize="9.5">{sub}</text>
      <path d="M70 41c.8 2.6 4.4 4 4.4 8a4.4 4.4 0 0 1-8.8 0c0-2.2 1.4-3.4 2.1-4.6.2 1.3.9 2.2 1.9 2.4-.7-1.8-.4-3.8.4-5.8z" fill="var(--accent)" />
    </svg>
  );
}
