# TapSpot — GitHub and Vercel setup

This is the latest complete source: rotating showcase, matching product artwork, digital card packages and samples, growth bundle, contact page, and direct Messenger/email/SMS inquiries.

## 1. Add your contacts

Edit config/store.ts. Replace the empty fallback strings after `||` with your real details, for example your email, phone, Facebook page, Messenger link and service area. You can alternatively set the NEXT_PUBLIC_* variables listed in .env.example in Vercel.

Set NEXT_PUBLIC_SITE_URL to your real HTTPS Vercel URL or custom domain. This is used by metadata and the sitemap. Redeploy after changing environment variables.

Contact links only appear when configured. Messenger inquiries require the customer to copy the prepared message, open Messenger and send it. No order is automatically confirmed and no payment is taken on this website.

## 2. Review your offers

- data/products.ts: NFC prices, product descriptions and availability.
- data/packages.ts: Starter PHP998, Business PHP1698, Executive PHP3898.
- The Google NFC + Facebook NFC + 5,000-follower package is quote-only. Set its price and actual service details before advertising a fixed-price offer.
- config/store.ts: processing time, support hours and service area.
- config/shipping.ts: delivery is confirmed by message.
- config/discounts.ts: example discount codes are disabled.

The sample card pages are demos. They download a sample vCard and demonstrate page features; they are not live customer profiles.

## 3. Upload to GitHub

Extract the ZIP. Create a GitHub repository and upload the CONTENTS of the tapspot-vercel-ready folder. Put package.json directly in the repository root. Upload folders and hidden configuration files too, including .eslintrc.json and .gitignore.

Do not upload the ZIP itself as your website source. Dependencies, build output and local environment files are excluded from this delivery.

## 4. Import into Vercel

Import that GitHub repository as a new Vercel project. Use:

- Framework preset: Next.js
- Root directory: repository root (the folder containing package.json)
- Build command: npm run build
- Install command: npm ci
- Output directory: leave the Next.js default

If you uploaded the enclosing folder rather than its contents, set Vercel's root directory to tapspot-vercel-ready instead.

Add your NEXT_PUBLIC_* environment variables before the final production deployment. After Vercel gives you your domain, set NEXT_PUBLIC_SITE_URL to that HTTPS address and redeploy.

Official instructions:
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/environment-variables

## Local checks

Run from the folder containing package.json:

    npm ci
    npm run lint
    npx tsc --noEmit
    npm run build
    npm run check:launch

check:launch intentionally fails until you configure a real public HTTPS URL and at least one real contact method.

To preview locally:

    npm run dev

## Verification completed

Lint, TypeScript and production build passed. Browser checks passed for catalogue artwork, package pricing, product setup validation, cart-to-inquiry messages, retained cart, cart drawer navigation, all three sample pages, vCard downloads, growth-package inquiry and responsive layouts at 320/390/768/1440px. No browser page errors were observed.

The earlier showcase was also checked for automatic rotation, hover/focus pause, keyboard controls, touch swipes, vertical scrolling and reduced motion.

The source is prepared for Vercel deployment; actual delivery through your public contact accounts and the final public domain must be checked after you configure them.
