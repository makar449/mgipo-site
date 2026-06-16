# v6.0 — Final UI correction from real screenshots

## What was fixed

1. Header
- Header is rebuilt with a compact logo mode.
- Logo no longer reserves excessive horizontal width.
- Desktop navigation is forced to one-line labels.
- Header action buttons are compressed on 1280–1439 px.
- Mobile menu is used below 1280 px to prevent broken navigation.

2. Hero / 3D scene
- Hero visual is rebuilt larger and wider.
- Main card is moved left inside the visual so the certificate does not cover the title.
- Certificate is placed to the right/top as a separate layer.
- All hero elements have motion on desktop: card, certificate, chips, platform, globe, rings, mini cards, bars.
- Motion uses only transform animations.
- Heavy decorative parts are disabled on small screens to keep performance stable.

3. Text readability
- Secondary text is increased globally.
- Tiny descriptions in cards, stats, footer, forms and content blocks are more readable.
- Kicker labels keep premium uppercase style but are no longer too small.

4. Lead form
- Form remains single-column to prevent fields from colliding.
- Program picker is kept as a premium searchable selector.
- Program selector is protected from width overflow.
- On mobile the picker behaves as a safe panel inside viewport boundaries.

5. Adaptive layout
- 320 / 375 / 768 / 1024 / 1280 / 1440+ breakpoints were reinforced.
- Horizontal overflow is blocked.
- Hero is simplified on mobile instead of breaking the page.

## Files changed
- src/components/header.tsx
- src/components/logo.tsx
- src/components/hero-3d-scene.tsx
- src/app/page.tsx
- src/app/globals.css
- package.json
