# Working on this website

This is a customer-owned Next.js website for a wood-fired pizzeria. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample pizzeria (Forno Vivo),
  menu, prices, address, hours and contact details with the owner's real details; the fictional examples are
  starting content.

## Structure and content

- `content/menu.ts` owns the menu: `toppings` (label, drawing `shape`, `color`, and what each `contains`),
  `pizzaSections` (pizzas with `base`, `toppings`, price, `heat` 0–3, `badge`, `featured`, `soldOut`),
  `sections` (starters, salads, desserts, drinks with an `art` drawing and `color`), this week's `special`,
  `extras`, the `dough` note and allergy `notes`. Most owner requests ("add a pizza", "raise the Diavola
  price", "the prosciutto is sold out", "change the special") are edits here only.
- Pizza diet tags (vegan, vegetarian, contains nuts) are **derived from the toppings' `contains`** list by
  `pizzaDiets()`. Never add a diet field to a pizza; fix the topping instead. Dishes keep an explicit `diet`.
- Every pizza draws itself: `lib/pizza-layout.ts` scatters its toppings with a generator seeded by the pizza
  `id`, and `components/pizza-art.tsx` renders the SVG. A new pizza needs no image file. Renaming an `id`
  changes its drawing (and its `/menu/#id` link). A new topping needs one of the existing shapes; a new
  shape must be drawn in `SHAPES` in `lib/pizza-layout.ts` and added to `TOPPING_SHAPES`.
- `content/pizzeria.ts` owns the name, tagline, introduction, story and approach points, email, phone,
  address (with a landmark/cross-streets `note`), directions, `hours` (each day's lunch/dinner `services`),
  `ordering` (pickup phone, `lastOrdersMinutes`, pickup wait, payment), notice, amenities, FAQs and links.
  There is no online ordering or delivery: don't add copy that suggests either, or delivery app names.
- `lib/hours.ts` holds the pure hours logic: grouping by service, and the "Taking orders / Between
  services / Last orders in N minutes / Closed" status. Keep it pure and covered by `tests/ordering.test.ts`.
- The address drives the home page "Find us" section, Google map, directions links and structured data.
  Maps use keyless Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there).
  Change it there, not in content; without it the ordering status stays neutral.
- Keep ids unique, lowercase and hyphenated; they are page anchors. Use the existing drawings and theme
  colours rather than adding image files. The one exception is the home page oven: two pictures in
  `public/hero-oven-{light,dark}-{800,1280,2000}.webp` with pure white/black backgrounds that
  `components/hero-oven.tsx` blends onto the page. Replacements keep those backgrounds (README "Hero pictures").
- Keep content out of `site.config.json`: Jamstacks may rewrite it with deployment fields only.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds everything utilities can't express: the colour tokens (`:root` for light,
  plus two dark blocks that must stay identical), the `@theme` built from them, base element styles, shared
  building blocks (`.button`, `.button-ghost`, `.button-sm`, `.text-link`, `.eyebrow`, `.hand-label`, `.chip`,
  `.sticker`, `.diet-tag`, `.card`, `.char-spots`, `.board`), the oven firelight, pizza and drawing tokens, animation,
  and styles driven by data attributes.
- Only this template's palette exists (`bg`, `band`, `surface`, `ink`, `muted`, `line`, `accent`, `basil`,
  `ember`, `board`, `footer` and their variants). Tailwind's default colours are switched off. To add a
  colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on. Never hard-code hex values in components.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
  Don't put two utilities for the same property on one element.
- Fonts: `font-display`/`font-sign` (Bricolage Grotesque) for headings, `font-sans` (Manrope) for text, and
  `font-hand` (Kalam) **only** for the specials board and small "just fired" labels.
- Reuse the building blocks and existing components (`PageHead`, `CallToOrder`, `OrderingStatus`,
  `PizzaArt`, `MenuArt`, `HeatMeter`, `OvenStamp`, `PeelDivider`) instead of restyling each instance.
  Add a reusable layout helper with `@utility`.
- Keep the `--jamstacks-*` component variables mapped to the tokens, with a dark-mode primary dark enough
  for white button text. Preserve readable contrast in both themes, responsive layouts from 360px (the
  header must stay on one line at 390px), visible keyboard focus, semantic headings, the skip link and
  reduced-motion support (every animation stops under `prefers-reduced-motion`).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no request-time rendering,
  Route Handlers, Server Actions, middleware, database or production Next.js server.
- Use local content for pages and ordinary client code only for browser-only interactions (the ordering
  status, menu filters, copy button). Time-dependent text is computed in the browser, never at build time.
- Client components must not import `lib/site.ts`: it would ship the Jamstacks embed URL to every page.
  Read the single `process.env.NEXT_PUBLIC_*` value you need instead (see `lib/paths.ts`).
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths. Use the shared path
  helpers and `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework
  behavior. Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>` with
  `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at
  `/sites/{publicSiteId}/embed.js`, on the Contact page only; no ID means no script request and a useful email fallback.
- The shared runtime owns form rendering, validation, spam protection and submission. Do not copy it,
  register a replacement element, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount contract is
  available. Keep the email visible beside the form and usable during outages.
- The form supports name, email and message. Contact copy says a message is an enquiry: nothing is booked
  or ordered until the pizzeria replies, and tonight's pickup orders are by phone. Don't promise bookings,
  ordering, attachments or extra fields.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials, publishing keys or
  private notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated run name
  when changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # content, hours/ordering, pizza drawings, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/pizzeria-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the pizza, topping or day to
fix. `npm start` previews the export on port 3000; stop the dev server first, or use
`npm start -- --port 3200`. Browser-check affected routes in light and dark, at desktop and phone widths,
and root/project-path assets when changing layout, navigation or deployment behavior. Report local checks
separately from any actual GitHub deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import or read it.
- Keep `site.config.json`, the embed integration and the Pages workflow outside the optional folder.
