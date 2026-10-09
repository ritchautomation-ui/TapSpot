# TapSpot update: tap demo + site fixes

## Added
- components/TapSpotDemo.tsx: interactive NFC demo ("See the Tap in Action"). Replaces the old <TapDemo /> on the homepage (the /how-it-works page still uses the old one).
- public/images/tapspot-google-review-plaque.png (real plaque). The phone wallpaper reuses your existing public/images/icon.png.
- components/MobileCtaBar.tsx: mobile-only "Shop NFC products / Message us" bar after the hero; hidden on cart, checkout, contact, order confirmation and while the cart drawer is open.
- app/robots.ts, Organization JSON-LD on the homepage.

## Fixed / improved
- Social previews pointed to http://localhost:3107. config/store.ts now uses NEXT_PUBLIC_SITE_URL, then Vercel's production URL, then localhost. Still set NEXT_PUBLIC_SITE_URL to your final domain.
- Contact section had no buttons when contact env vars are empty. It now falls back to "Send an inquiry" (/contact) so there is never a dead end. Add real contacts in Vercel env vars (see .env.example).
- Header logo requested a 3840px image; now sized for its real display size.
- Mobile menu closes with Escape.
- next.config.mjs: AVIF/WebP, security headers, no X-Powered-By.
- Footer bottom padding on mobile so the CTA bar never covers the copyright line.

## Verified
npm run lint, npx tsc --noEmit, npm run build all pass. Browser-tested at 390 and 1440px: no horizontal overflow, demo runs tap -> notify -> review -> reset -> replay, no console errors.
