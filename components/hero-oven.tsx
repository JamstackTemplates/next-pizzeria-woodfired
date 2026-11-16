import { asset } from '../lib/paths';

// Hero illustration: a domed brick oven with a log fire, a Margherita on the peel, a log store and a
// sack of 00 flour. There is a daytime picture for the light theme and a night-time one for dark;
// only the one for the current theme downloads (the hidden <img> is lazy and display:none).
// The day picture has a pure white background and is multiplied onto the page; the night picture
// has pure black and is screened onto it. Either way the background disappears into the page
// texture and glow, whatever the theme colours. A soft firelight glow flickers over the oven mouth
// (it stops for visitors who prefer reduced motion).
// To replace the pictures, keep that white/black background (see README "Hero pictures").

const ALT = 'A domed brick oven with a log fire burning inside and a Margherita pizza on a wooden peel going in';
const WIDTH = 2000;
const HEIGHT = 1792;
const SIZES = '(min-width: 640px) 36rem, 100vw';

function srcSet(theme: 'light' | 'dark') {
  return [
    `${asset(`/hero-oven-${theme}-800.webp`)} 800w`,
    `${asset(`/hero-oven-${theme}-1280.webp`)} 1280w`,
    `${asset(`/hero-oven-${theme}-2000.webp`)} 2000w`,
  ].join(', ');
}

const image = 'block h-auto w-full';

export function HeroOven() {
  return (
    <div className="relative">
      <img src={asset('/hero-oven-light-1280.webp')} srcSet={srcSet('light')} sizes={SIZES} width={WIDTH} height={HEIGHT}
        alt={ALT} loading="lazy" decoding="async" className={`${image} mix-blend-multiply dark:hidden`} />
      <img src={asset('/hero-oven-dark-1280.webp')} srcSet={srcSet('dark')} sizes={SIZES} width={WIDTH} height={HEIGHT}
        alt={ALT} loading="lazy" decoding="async" className={`${image} hidden mix-blend-screen dark:block`} />
      <span className="oven-firelight pointer-events-none absolute top-[38%] left-[32%] h-[30%] w-[36%]" aria-hidden="true" />
    </div>
  );
}
