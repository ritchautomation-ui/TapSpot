# NFC Link Generator: setup

Internal tool at **/tools/nfc-link-generator** (linked from the footer, `noindex`, not in the sitemap).
It finds a business with Google Places, gets its real Place ID, and builds:

    https://search.google.com/local/writereview?placeid={PLACE_ID}

It also builds Facebook review links and a Google + Facebook pair. It only **generates and copies URLs**.
Writing to the tag is still done in NFC Tools on your phone.

## Works without any setup
Manual Place ID entry ("Enter Place ID manually") and the Facebook workflow need no API key.
Only live business search needs the Google key below.

## One-time Google setup (for live search)
1. In Google Cloud Console, create or choose a project.
2. **Enable billing** on it. Maps Platform requires a billing account, even though Google gives a monthly free usage allowance.
3. Enable these two APIs (APIs & Services → Library):
   - **Maps JavaScript API**
   - **Places API (New)**
4. Create an API key (APIs & Services → Credentials).
5. **Restrict the key** (this key is visible in the browser, so restrictions are what protect it):
   - Application restriction: **Websites (HTTP referrers)**. Add
     `https://tapspot-nfc.vercel.app/*` and `http://localhost:3000/*`
     (add your custom domain and, if you want search on previews, `https://*-ritchautomation-uis-projects.vercel.app/*`).
   - API restriction: **Restrict key** → only *Maps JavaScript API* and *Places API (New)*.
6. Set a **budget alert** and, if you like, a daily quota cap on Places API (New), so a leaked page can't run up a bill.
7. In Vercel → Project → Settings → Environment Variables add
   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Production and Preview), then **redeploy**.
   For local work put it in `.env.local`.

`NEXT_PUBLIC_` variables are readable by anyone who opens the site. That is expected for a browser Maps key, which is why step 5 matters.
Never put a server or secret key in a `NEXT_PUBLIC_` variable.

## What the tool does and doesn't promise
- A Google link is labelled **Generated**. It is not "verified". Open / Test Link it before writing a tag.
- Facebook links are **Proposed** (the Page's `/reviews` address). Not every Page has reviews turned on. Test it, or paste the exact URL in the override box.
- Google Maps links can't be used to get a Place ID reliably, so the manual box rejects them with an explanation instead of guessing.
- Nothing is stored. Everything lives in the page's memory and disappears on reload or Reset.

## Cost notes
Search uses Place Autocomplete with a session token, then fetches only `id`, `displayName` and `formattedAddress` for the one place you pick.
The Maps script loads only on this page, and only once you click into the search box.

## Troubleshooting
| Symptom | Likely cause |
|---|---|
| Setup notice, search box disabled | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` not set in this deployment (redeploy after adding it) |
| "Google rejected the API key" | Key invalid, referrer list doesn't include this site, or billing is off |
| "Google Places search couldn't complete" | Places API (New) not enabled, or the key's API restriction excludes it |
| "The Google Maps script could not be loaded" | Offline, or an ad blocker is blocking `maps.googleapis.com` |

## Developing
    npm test          # unit + component tests (Vitest)
    npm run typecheck
    npm run lint
    npm run build
