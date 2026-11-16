import type { SVGProps } from 'react';
import type { Amenity } from '../content/pizzeria';

// Small line icons. Decorative: always paired with visible text.
type IconName = Amenity['icon'] | 'pin' | 'mail' | 'arrow' | 'filter' | 'wood' | 'dough' | 'thermometer';

const paths: Record<IconName, React.ReactNode> = {
  flame: <path d="M12 3c1 3.5 6 5.5 6 11a6 6 0 0 1-12 0c0-3 2-4.8 3-6.4.3 2 1.2 3.2 2.6 3.4C10.6 8 11 5.4 12 3z" />,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />,
  'walk-in': <><circle cx="13" cy="4.5" r="1.8" /><path d="M10 21l2-6 2.5 2.5V21M8 12l2.5-4.5h3L16 11l2.5 1M12.5 7.5L12 15" /></>,
  kids: <><circle cx="8" cy="6" r="2" /><circle cx="16.5" cy="9" r="1.6" /><path d="M8 8v6m-3-3.5h6M6.5 20l1.5-6 1.5 6M16.5 10.6v4.4m-2-2.5h4M15 20l1.5-5 1.5 5" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19l8-8" /></>,
  glass: <><path d="M7.5 3.5h9l-.6 5.2a3.9 3.9 0 0 1-7.8 0z" /><path d="M12 12.6V20M8.5 20.5h7" /></>,
  access: <><circle cx="12" cy="4.5" r="1.7" /><path d="M6 8.5l6 1 6-1M12 9.5v5m0 0l-3 6m3-6l3 6" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7l7.5 6 7.5-6" /></>,
  arrow: <><path d="M5 12h13" /><path d="M13 7l5 5-5 5" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  wood: <><ellipse cx="6.5" cy="15" rx="3" ry="3.5" /><path d="M6.5 11.5h12c1.7 0 3 1.6 3 3.5s-1.3 3.5-3 3.5h-12" /><path d="M6.5 13.6a1.4 1.4 0 1 1 0 2.8" /><path d="M8 6.5l7-2" /></>,
  dough: <><path d="M3.5 15c0-4 3.8-7 8.5-7s8.5 3 8.5 7c0 2-2 3-4 3H7.5c-2 0-4-1-4-3z" /><path d="M8 12.5c1-1 2.4-1.5 4-1.5" /></>,
  thermometer: <><path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0z" /><path d="M12 9v7" /></>,
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
