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

## Custom Branded NFC Sign + simpler /products
- data/products.ts: new product `custom-branded-sign` (₱1,299 per sign, stick-on, no stand). Setup fields: business name, link to open, logo link, brand colors, text on sign, notes.
- components/CustomSignArtwork.tsx: placeholder mockup (replace with a real photo any time).
- components/ProductArtwork.tsx, ProductVisual.tsx, lib/types.ts: new `custom-sign` visual.
- components/ProductCard.tsx: category label above the name, "View details" button.
- app/products/page.tsx: simple catalogue (heading, cards, bulk/reseller banner). Growth package and business card packages stay on the homepage and /business-card.

## Contact details + contact cards
- config/store.ts: email tapspotpampanga@gmail.com, Facebook page and Messenger link (https://m.me/61595222673008) set as defaults. Env vars still override.
- components/ContactActions.tsx: new `ContactCards` (Email + Facebook cards) and buttons "Message on Facebook" / "Email Us" with icons. Only configured channels show.
- components/ContactSection.tsx, app/contact/page.tsx: use the cards + buttons (the duplicate email line on /contact was removed).

## Night mode + logo intro
- Night mode: moon/sun button in the header (components/ThemeToggle.tsx). Saved in the browser; on a first visit it follows the device setting. `darkMode: "class"` in tailwind.config.ts; the colour remaps are in the "Night mode" block of app/globals.css, so no component had to be rewritten. In night mode the header logo switches to the icon + white wordmark (components/Brand.tsx) because the logo file has black text.
- Logo intro: components/IntroSplash.tsx + the "Logo intro" block in app/globals.css. Shows once per browser session (about 2.9 s), skipped for visitors who prefer reduced motion, and removes itself with CSS only. To change the length edit the 2.35s delay in `.intro-splash`; to turn it off, remove `<IntroSplash />` from app/layout.tsx.
- Custom sign mockup now scales cleanly (container units).

## /customize design preview (Custom Sign ₱1,299 + Custom Business Card ₱1,099)
- app/customize/page.tsx + components/Customizer.tsx: upload PNG/JPG/WEBP (max 10 MB, drag and drop), Fit/Fill, zoom, horizontal/vertical position, rotation, Center design, Reset, optional safe-area guide, live preview on a code-drawn sign or card. Switch between Sign and Business Card at the top (`/customize?product=card` opens the card).
- config/customize.ts: prices, printable-area ratios and destination options. Sign: Google Review / Facebook / Other link (link required). Card: TapSpot digital profile / Facebook / Other link.
- "Request this design" opens /contact with a ready-made message (product, quantity, destination link, artwork file name, placement values, instructions). app/contact/page.tsx validates every parameter and falls back to the general message if anything is off.
- The artwork file is NOT uploaded anywhere (no server/database yet). The customer sends the file on Messenger; /contact shows a "Next step" note saying so.
- Entry links: Custom Sign product page, NFC Business Card product page and /business-card. Added to sitemap. Mobile CTA bar hidden on /customize.
- Not changed: the NFC Digital Business Card product still shows packages (From ₱998). ₱1,099 appears only inside /customize.

## Realistic package samples (/samples/starter, /business, /executive)
- components/samples/: three fictional demos in a phone frame. Starter = real estate broker (essentials), Business = café (About / Menu / Location tabs, hours, Google review button), Executive = wedding photographer (animated intro, photo gallery, rotating testimonials, packages). All images are code-drawn, no new files needed.
- app/samples/[slug]/page.tsx: shows the phone beside "What this sample shows", the package price, a contact button and links to the other samples. Buttons only show what would happen on a live page; Save contact downloads a sample .vcf.
- Removed components/SampleProfile.tsx (replaced). Animations respect reduced motion.
