const LABELS = ['No heat', 'A little heat', 'Medium heat', 'Hot'] as const;

const chilli = 'M2.5 12.5C5 13.6 10.6 12.6 14 7.6c1.1-1.7-.3-3.1-1.8-1.9C9.4 8 5.6 9.9 2 10.7c-.8.2-.6 1.5.5 1.8z';

/** 0–3 chillies. Filled chillies show the heat; the rest are outlines. */
export function HeatMeter({ heat = 0, className = '' }: { heat?: number; className?: string }) {
  const level = Math.max(0, Math.min(3, Math.round(heat)));
  return (
    <span className={`inline-flex items-center gap-px ${className}`} role="img" aria-label={LABELS[level]} title={LABELS[level]}>
      {[1, 2, 3].map(n => (
        <svg key={n} viewBox="0 0 18 16" width="18" height="16" aria-hidden="true" focusable="false">
          <path d={chilli} fill={n <= level ? 'var(--accent)' : 'none'} stroke={n <= level ? 'var(--accent)' : 'var(--line)'} strokeWidth="1.3" />
          <path d="M13.4 5.4c.5-1.4 1.6-2.4 3-2.6" fill="none" stroke={n <= level ? 'var(--basil)' : 'var(--line)'} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}
    </span>
  );
}
