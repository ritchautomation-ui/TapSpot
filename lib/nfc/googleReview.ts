/** Google Review link logic. Pure functions, no browser APIs, safe to unit test. */

export const GOOGLE_REVIEW_BASE = "https://search.google.com/local/writereview";

/** Google Place IDs are URL-safe strings (letters, digits, "_" and "-"). */
const PLACE_ID_PATTERN = /^[A-Za-z0-9_-]{10,300}$/;

export type PlaceIdCheck = { ok: true; placeId: string } | { ok: false; error: string };

export function validatePlaceId(input: string | null | undefined): PlaceIdCheck {
  const value = (input ?? "").trim();
  if (!value) return { ok: false, error: "Enter a Place ID." };
  if (/[/:.?=&%]/.test(value)) {
    return {
      ok: false,
      error:
        "That looks like a link, not a Place ID. Google Maps links don't reliably contain the Place ID, so TapSpot can't extract it. Use the business search, or paste the Place ID itself (it usually starts with ChIJ).",
    };
  }
  if (/\s/.test(value)) return { ok: false, error: "A Place ID has no spaces. Check that you copied the whole value." };
  if (!PLACE_ID_PATTERN.test(value)) {
    return { ok: false, error: "That doesn't look like a Place ID. It should be 10 or more letters, digits, dashes or underscores." };
  }
  return { ok: true, placeId: value };
}

/** Returns the exact review URL, or null when the Place ID is empty or invalid. Never falls back to a default. */
export function buildGoogleReviewUrl(placeId: string | null | undefined): string | null {
  const check = validatePlaceId(placeId);
  if (!check.ok) return null;
  return `${GOOGLE_REVIEW_BASE}?placeid=${encodeURIComponent(check.placeId)}`;
}
