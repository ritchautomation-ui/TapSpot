import { describe, expect, it } from "vitest";
import { buildGoogleReviewUrl, validatePlaceId } from "./googleReview";

const EXAMPLE_ID = "ChIJf5jpQgDzljMRR6hcJ0s-iVs";

describe("buildGoogleReviewUrl", () => {
  it("builds the exact review URL for a valid Place ID", () => {
    expect(buildGoogleReviewUrl(EXAMPLE_ID)).toBe(`https://search.google.com/local/writereview?placeid=${EXAMPLE_ID}`);
  });
  it("keeps dashes and underscores intact", () => {
    expect(buildGoogleReviewUrl("ChIJ_abc-DEF123456")).toBe("https://search.google.com/local/writereview?placeid=ChIJ_abc-DEF123456");
  });
  it("uses the ID it is given, never a default or the documentation example", () => {
    const other = "ChIJN1t_tDeuEmsRUsoyG83frY4";
    const url = buildGoogleReviewUrl(other);
    expect(url).toContain(other);
    expect(url).not.toContain(EXAMPLE_ID);
  });
  it("trims surrounding whitespace", () => {
    expect(buildGoogleReviewUrl(`  ${EXAMPLE_ID}\n`)).toBe(`https://search.google.com/local/writereview?placeid=${EXAMPLE_ID}`);
  });
  it("returns null for empty, whitespace, null and undefined", () => {
    expect(buildGoogleReviewUrl("")).toBeNull();
    expect(buildGoogleReviewUrl("   ")).toBeNull();
    expect(buildGoogleReviewUrl(null)).toBeNull();
    expect(buildGoogleReviewUrl(undefined)).toBeNull();
  });
  it("returns null instead of encoding unsafe input", () => {
    expect(buildGoogleReviewUrl("ChIJ abc def 12345")).toBeNull();
    expect(buildGoogleReviewUrl("ChIJabc&placeid=evil12345")).toBeNull();
    expect(buildGoogleReviewUrl("ChIJabc#frag1234567")).toBeNull();
  });
  it("returns null for too-short values", () => {
    expect(buildGoogleReviewUrl("abc")).toBeNull();
  });
});

describe("validatePlaceId", () => {
  it("accepts a normal Place ID", () => {
    expect(validatePlaceId(EXAMPLE_ID)).toEqual({ ok: true, placeId: EXAMPLE_ID });
  });
  it("rejects pasted Google Maps links with an explanation instead of guessing", () => {
    const r = validatePlaceId("https://www.google.com/maps/place/Coffee/@15.1,120.6,17z");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/link/i);
  });
  it("rejects short links too", () => {
    expect(validatePlaceId("https://maps.app.goo.gl/abc123").ok).toBe(false);
  });
  it("explains empty input", () => {
    const r = validatePlaceId("");
    expect(r.ok).toBe(false);
  });
});
