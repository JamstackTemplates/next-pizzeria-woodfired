# Wood-fired pizzeria (Next.js)

A bold, fire-lit theme for wood-fired pizzerias: a pizza menu where every pie is drawn from its toppings, weekly specials, opening hours with lunch and dinner services, a call-to-order button, location and a [Jamstacks](https://jamstacks.net) contact component for parties, large orders and events.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend. Light mode is "flour & fire": flour white, charred black, tomato red and basil green. Dark mode is "the oven at night": charcoal, ash and flame orange, with the oven glowing. Both follow the visitor's device unless they pick one with the header toggle.

**Forno Vivo**, its menu, prices, story and contact details are fictitious placeholders. The sample address is a public landmark, New Haven Green (Church Street and Chapel Street, New Haven, CT), so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | Hero with the name, a live "taking orders" status, **Call to order** and **See the menu**, beside an illustrated brick oven (a day and a night picture). Then **Find us** (address, cross streets, directions, hours by service, map), this week's special on a hand-lettered board, featured pizzas "From the oven", the story of the fire, a parties & large orders invitation and FAQs |
| `/menu/` | Call to order and ordering status at the top, the special, then every pizza (drawn from its toppings) with heat, diet tags, badges and prices, plus starters, salads, desserts and drinks. Section shortcuts, vegetarian/vegan/no-heat filters, and extras, dough and allergy notes beside it |
| `/contact/` | "Parties, large orders & events": email and phone (always shown) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "This one fell off the peel…" |

The header has two links, **Menu** and **Contact**, a **Call** button (a compact phone icon on phones) and the light/dark toggle. "Find us" is reached from the hero and the footer.

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # content, hours, pizza drawing, configuration and embed checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from two content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | Toppings, pizzas, prices, heat, badges, sold-out pizzas, this week's special, starters, salads, desserts, drinks, extras, the dough note, allergy notes, currency |
| [content/pizzeria.ts](content/pizzeria.ts) | Name, tagline, introduction, story and approach points, email, phone, address (plus a landmark/cross-streets `note`), directions, hours by service, phone ordering details, notice, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (including the oven, pizza and drawing palette), fonts and other customizations. Components are styled with Tailwind classes |
| `public/og.png` | 1200×630 social preview image |
| `public/hero-oven-*.webp` | The home page oven, by day and at night (see [Hero pictures](#hero-pictures)) |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, domain, time zone and public deployment settings (see below) |

### Pizzas draw themselves

Each pizza is a list of topping ids, and the website draws it: a top-down pizza with a charred, bubbled crust, a tomato or white base, and its toppings scattered across it. Positions come from a generator seeded by the pizza's `id`, so the same pizza looks the same in every build and a new pizza needs no photo.

A pizza in `content/menu.ts` looks like this:

```ts
{
  id: 'diavola',                       // unique; also the link /menu/#diavola, and the drawing's seed
  name: 'Diavola',
  base: 'rossa',                       // 'rossa' (tomato) or 'bianca' (white)
  toppings: ['fior-di-latte', 'spicy-salami', 'chilli', 'basil'], // ids from `toppings`, in the order they go on
  description: 'Spicy salami that crisps at the edges, fresh chilli and fior di latte.',
  price: 18,                           // 12" price; or sizes: [{ label: '12"', amount: 18 }, { label: '16"', amount: 24 }]
  heat: 2,                             // optional, 0–3 chillies
  badge: 'signature',                  // optional: 'signature' | 'seasonal' | 'special' | 'new'
  featured: true,                      // optional: show in "From the oven" on the home page (keep 4–6)
}
```

Each topping is defined once in `toppings`:

```ts
'spicy-salami': { label: 'Spicy salami', shape: 'round', color: '#9e2b26', contains: ['meat'] },
```

- `shape` is how it's drawn: `round` (pepperoni, tomato, courgette), `leaf` (basil, rocket), `blob` (melted mozzarella), `crumble` (sausage, parmesan, herbs), `ring` (onion, olives), `strand` (prosciutto, peppers, a honey drizzle), `chilli`, `mushroom` or `dollop` (ricotta, ’nduja).
- `color` is a hex colour for the drawing.
- `contains` sets the diet tags. Pizzas are **not** tagged by hand: a pizza is vegetarian unless a topping contains `meat` or `fish`, vegan unless one also contains `dairy`, `egg` or `honey`, and "contains nuts" if one contains `nuts`. The dough and both bases are vegan. So adding pepperoni to a pizza can't leave a stale "vegetarian" tag behind.

Common tasks:

- **Change this week's special:** set `special: { pizza: 'squash-sage', note: 'While the squash lasts' }` to another pizza's id and a short note (or no note). It shows on the board on the home page and at the top of the menu.
- **Sold out tonight?** Add `soldOut: true` to the pizza or dish. It stays listed, greyed out, with a "Sold out tonight" sticker. Remove the line when it's back. The special and featured pizzas can't be sold out (the tests remind you).
- **Seasonal pizza:** add it with `badge: 'seasonal'`, and delete it (or mark it `soldOut`) when the season ends.
- **New topping:** add it to `toppings` with a label, the closest `shape`, a `color` and what it `contains`.
- **New section:** add `{ id, title, description, items: [...] }` to `pizzaSections` (pizzas) or `sections` (dishes with an `art` drawing: `knots`, `bowl`, `salad`, `tiramisu`, `gelato`, `cake`, `soda`, `beer` or `wine`). It appears in the section shortcuts automatically.
- **Prices** are numbers in `menu.currency` (`16` is $16, `16.5` is $16.50). Change `currency` and `locale` for other countries.

`npm test` checks the menu after every edit: unique, URL-safe ids, known toppings and shapes, valid prices, heat 0–3, the special, 4–6 featured pizzas, and that every pizza draws inside its crust. A failure names the pizza, topping or day to fix.

### Hours, services and the ordering status

`hours` in `content/pizzeria.ts` lists every day, Monday first, with its `services` in your local time:

```ts
{ day: 'Tuesday', services: [
  { label: 'Lunch', opens: '12:00', closes: '14:30' },
  { label: 'Dinner', opens: '17:00', closes: '22:00' },
] },
{ day: 'Monday', services: [] },          // closed all day
{ day: 'Saturday', services: [{ label: 'All day', opens: '12:00', closes: '23:00' }] },
```

`ordering.lastOrdersMinutes` (30 in the sample) stops phone orders that long before each service closes. Use `notice` for one-off messages such as holiday hours; leave it `''` to hide it.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/New_York`. If Jamstacks created this website, it's the time zone you chose in the portal. With it, the status beside every Call button works out, in the visitor's browser using *your* clock and refreshed every minute:

- "Taking orders · last orders 9:30pm"
- "Last orders in 15 minutes"
- "Between services · dinner from 5pm"
- "Closed · opens Tuesday at 12pm"

The built files never contain a time. Without a time zone, or without JavaScript, the status shows a neutral "Call to order for pickup" with your number and makes no claim about now. The hours say "Times shown in Eastern Time" (or your zone). An invalid name fails the build with a clear message.

### Location and map

The home page puts the address, cross streets, directions and hours directly under the hero, beside a Google map. The map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/pizzeria.ts`.

All three are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `google.com/maps?q=…&output=embed` redirects to). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts) to the `maps/embed/v1/place` form shown there. Embed API keys are meant to be public.

The map is lazy-loaded, so Google is only contacted when it scrolls into view. Google may set cookies in the embedded map, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter` in `app/tailwind.input.css`) darkens it to match the theme; set it to `none` to show Google's normal colours.

Text is rendered as plain text, never HTML. Don't present invented reviews or awards as fact.

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint.

The pizzas, the dish drawings, the heat meter, the "Fresh from the oven" stamp, the peel divider and the specials board are inline SVG/CSS coloured by tokens in `app/tailwind.input.css`, so a new pizza or dish needs no image file. Gentle motion (firelight flickering in the oven and stickers settling on load) stops for visitors who prefer reduced motion.

### Hero pictures

The home page oven is a pair of pictures in `public/`: `hero-oven-light-*.webp` (by day) and `hero-oven-dark-*.webp` (the oven at night), each at 800, 1280 and 2000 pixels wide. Only the one for the current theme is downloaded. The day picture has a pure white background and the night picture pure black; [components/hero-oven.tsx](components/hero-oven.tsx) blends them onto the page (multiply and screen), so the background disappears into the page whatever the theme colours.

To use your own oven (or a photo-style illustration of your shopfront), make both versions at the same size and framing, keep the top-right corner clear for the stamp, then map the background to exactly white or black and export the three widths, for example with ImageMagick:

```sh
# Day: scale each channel so the background colour (here 249,238,224) becomes white
magick day.png -channel R -evaluate multiply 1.031 -channel G -evaluate multiply 1.077 \
  -channel B -evaluate multiply 1.145 +channel day-white.png
# Night: subtract the background colour (here 22,17,17) so it becomes black
magick night.png -channel R -evaluate subtract 9.2% -channel G -evaluate subtract 7.2% \
  -channel B -evaluate subtract 7.4% +channel night-black.png
for w in 800 1280 2000; do
  magick day-white.png -resize ${w}x -quality 82 public/hero-oven-light-$w.webp
  magick night-black.png -resize ${w}x -quality 82 public/hero-oven-dark-$w.webp
done
```

If the new pictures aren't 2000×1792, update `WIDTH` and `HEIGHT` in `components/hero-oven.tsx`, and move the firelight glow over the oven mouth if it is somewhere else.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks, which must match). To add one, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on).

Fonts, all self-hosted through `@fontsource` packages under the SIL Open Font License:

- [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), heavy and slightly condensed, for the sign-painted headings;
- [Manrope](https://fonts.google.com/specimen/Manrope) for text;
- [Kalam](https://fonts.google.com/specimen/Kalam), a marker hand, only on the specials board and small "just fired" labels.

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Forno Vivo",
  "description": "Wood-fired pizza from a domed brick oven. The menu, this week's special, lunch and dinner hours, and a number to call for pickup.",
  "domain": "next-pizzeria-woodfired.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo. **Replace it with your own domain** (hostname only, e.g. `www.yourpizzeria.com`), or set it to `""` if you don't know it yet; it drives canonical URLs, the sitemap and social images. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-pizzeria` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts it and emits HTTPS canonical, social and sitemap URLs. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (`servesCuisine: "Pizza"`, address, opening hours per service, telephone, menu link, `acceptsReservations: false`) built from `content/pizzeria.ts`.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number, a reminder that tonight's pickup orders are by phone, and a "useful to include" list. No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Parties, large orders & events", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing the menu, hours or the site ID does need a rebuild.
- The form supports name, email and message today. The page copy calls a message an *enquiry*: nothing is booked or ordered until you reply. Don't promise booking slots, party-size fields or online ordering.
- Only the Contact page loads the Jamstacks script or contains its URL.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation). This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). In dark mode the form's primary colour stays tomato red so its white button text is readable. A theme you publish in the portal overrides these. Don't style the component's internals.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets; they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/pizzeria-preview npm run build
node scripts/serve.mjs --base /pizzeria-preview   # http://localhost:3000/pizzeria-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, and put the same hostname in `site.config.json`'s `domain`. A `public/CNAME` file isn't needed: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal.

## Project structure

```
app/                    routes, metadata, sitemap/robots, global styles and tokens
components/             header, footer, hero oven, pizza and dish drawings, specials board, menu board,
                        ordering status, call to order, heat meter, stamp, Jamstacks host/loader
content/                pizzeria.ts and menu.ts: your content
lib/hours.ts            hours by service and the "taking orders" status (pure, unit tested)
lib/pizza-layout.ts     seeded topping placement and topping shapes (pure, unit tested)
lib/menu-filter.ts      vegetarian / vegan / no-heat filter rules
lib/config.mjs          build-time public config resolution and validation
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/jamstacks.d.ts    typed JSX for <jamstacks-support-form>
public/                 hero oven pictures and the social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Forno Vivo, the address (and its `note`), directions, email, phone, menu, prices, story, FAQs and social links with your own details.
- Set your real services and `lastOrdersMinutes`, and `timeZone` in `site.config.json`. Check the ordering status on the home page at a few times of day.
- Choose this week's special and your 4–6 featured pizzas.
- Replace `domain` in `site.config.json` with your own domain (or `""`). Update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation, the menu filters and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed: Jamstacks provisioning removes it after verifying it.
Normal `npm test`, type checking, builds and the Pages workflow do not import or read it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
