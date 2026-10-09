# TapSpot website

A Next.js (App Router) + TypeScript + Tailwind store for TapSpot NFC products: home page with a rotating 3D product showcase, product pages with setup forms, cart, checkout and order confirmation. It runs without a database.

## Run it on your computer
1. Install Node.js 20 or newer.
2. In this folder run `npm install`, then `npm run dev`.
3. Open http://localhost:3000.

Checks: `npm run build`, `npm run lint`, `npx tsc --noEmit`.

## Change things (no UI code needed)
| What | File |
|---|---|
| Prices, product text, on/off (`available`), setup fields | `data/products.ts` |
| Business card price | `data/products.ts` → `nfc-business-card` → set `price: 799` (any number). Until then the page shows "Price on request" |
| Brand name, email, phone, Facebook, Messenger, processing time | `config/store.ts` |
| Shipping fee, free-shipping threshold | `config/shipping.ts` |
| Payment methods (GCash, Maya, bank, COD on/off) | `config/checkout.ts` |
| Discount codes | `config/discounts.ts` |
| FAQ | `data/faq.ts` |
| Testimonials (real ones only), then set `showTestimonials: true` | `data/testimonials.ts`, `config/store.ts` |
| Images | `public/images/` |

Placeholders to replace before launch: contact details in `config/store.ts`, the shipping fee (currently ₱150), and the business card price.

## Add a product
Copy an entry in `data/products.ts`, give it a new `id` and `slug`, set `available: true`. Instagram, TikTok, Menu, Services and Booking already exist as hidden entries (`futureProducts`). Fill them in and switch `available` on.

## How orders work (important)
There is no database or payment gateway yet.
- Checkout calls `lib/services/orderService.ts`, which POSTs to `/api/orders`.
- If you set `ORDER_WEBHOOK_URL` (Make, Zapier, n8n, Google Apps Script, Discord/Slack), the order is forwarded there and the customer sees "Order received."
- If not, the order is saved only in the customer's browser, and the confirmation page tells them to email or message the order summary to you. The site never claims TapSpot received an order when it didn't.
- Payments are manual: customers pick GCash, Maya or bank transfer, and you message them the details. No card data is collected. To connect PayMongo/Xendit/Stripe later, see `lib/services/paymentService.ts`.

## Connect a backend later
Edit `app/api/orders/route.ts` to insert the order into Supabase, Firebase or Postgres (Prisma). Also recompute prices on the server there (see `lib/pricing.ts`) so totals can't be tampered with. The rest of the site stays the same.

## Environment variables
Copy `.env.example` to `.env.local`:
- `ORDER_WEBHOOK_URL` (optional)
- `NEXT_PUBLIC_SITE_URL` (your real domain, for SEO and share images)

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com choose Add New → Project, import the repo, and keep the defaults.
3. Add the environment variables above, then deploy.
