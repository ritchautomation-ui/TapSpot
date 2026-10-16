import { describe, expect, it } from "vitest";
import { normalizeFacebookPageUrl, validateFacebookOverride } from "./facebook";

const ok = (input: string) => {
  const r = normalizeFacebookPageUrl(input);
  if (!r.ok) throw new Error(`expected ok for ${input}: ${r.error}`);
  return r;
};

describe("normalizeFacebookPageUrl: valid pages", () => {
  const expected = "https://www.facebook.com/examplebusiness/reviews";
  it.each([
    "https://www.facebook.com/examplebusiness",
    "https://www.facebook.com/examplebusiness/",
    "facebook.com/examplebusiness",
    "www.facebook.com/examplebusiness",
    "http://facebook.com/examplebusiness",
    "https://m.facebook.com/examplebusiness",
    "https://web.facebook.com/examplebusiness",
    "https://fb.com/examplebusiness",
    "https://www.facebook.com/examplebusiness?ref=page_internal&locale=en_US",
    "https://www.facebook.com/examplebusiness#section",
    "https://www.facebook.com/examplebusiness/reviews",
    "https://www.facebook.com/examplebusiness/posts/12345678901",
    "  https://www.facebook.com/examplebusiness  ",
  ])("normalizes %s", (input) => {
    const r = ok(input);
    expect(r.kind).toBe("vanity");
    expect(r.pageUrl).toBe("https://www.facebook.com/examplebusiness");
    expect(r.reviewsUrl).toBe(expected);
  });
  it("is case-insensitive about the host but keeps the page name as typed", () => {
    expect(ok("HTTPS://WWW.FACEBOOK.COM/TapSpotPH").reviewsUrl).toBe("https://www.facebook.com/TapSpotPH/reviews");
  });
  it("handles profile.php?id= pages", () => {
    const r = ok("https://www.facebook.com/profile.php?id=61595222673008");
    expect(r.kind).toBe("id");
    expect(r.pageUrl).toBe("https://www.facebook.com/profile.php?id=61595222673008");
    expect(r.reviewsUrl).toBe("https://www.facebook.com/profile.php?id=61595222673008&sk=reviews");
  });
  it("drops unrelated query params on profile.php links", () => {
    expect(ok("https://m.facebook.com/profile.php?id=61595222673008&mibextid=abc&sk=about").reviewsUrl).toBe(
      "https://www.facebook.com/profile.php?id=61595222673008&sk=reviews",
    );
  });
  it("handles legacy /pages/Name/ID links", () => {
    expect(ok("https://www.facebook.com/pages/Some-Cafe/123456789012345").reviewsUrl).toBe(
      "https://www.facebook.com/profile.php?id=123456789012345&sk=reviews",
    );
  });
  it("handles a numeric id used as the path", () => {
    expect(ok("https://www.facebook.com/123456789012345").kind).toBe("id");
  });
});

describe("normalizeFacebookPageUrl: rejections", () => {
  it.each([
    ["", /paste/i],
    ["   ", /paste/i],
    ["hello", /facebook\.com/i],
    ["https://example.com/examplebusiness", /facebook\.com/i],
    ["https://notfacebook.com/examplebusiness", /facebook\.com/i],
    ["https://facebook.com.evil.com/examplebusiness", /facebook\.com/i],
    ["https://www.instagram.com/examplebusiness", /facebook\.com/i],
    ["https://www.facebook.com", /page/i],
    ["https://www.facebook.com/", /page/i],
    ["https://www.facebook.com/groups/12345678", /groups/i],
    ["https://www.facebook.com/events/12345678", /events/i],
    ["https://www.facebook.com/share/p/abc123xyz", /share/i],
    ["https://www.facebook.com/photo.php?fbid=1234567890", /photo/i],
    ["https://www.facebook.com/profile.php", /numeric id/i],
    ["https://www.facebook.com/profile.php?id=abc", /numeric id/i],
    ["https://www.facebook.com/abc", /page name/i],
    ["https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com", /redirect/i],
    ["https://user:pass@www.facebook.com/examplebusiness", /username|password/i],
    ["ftp://facebook.com/examplebusiness", /https/i],
    ["javascript:alert(1)", /valid web address/i],
  ])("rejects %j", (input, message) => {
    const r = normalizeFacebookPageUrl(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(message);
  });
});

describe("validateFacebookOverride", () => {
  it("accepts an exact Facebook URL and keeps its path and query", () => {
    const r = validateFacebookOverride("https://www.facebook.com/examplebusiness/reviews_and_recommendations");
    expect(r).toEqual({ ok: true, url: "https://www.facebook.com/examplebusiness/reviews_and_recommendations" });
  });
  it("upgrades http to https and adds a missing scheme", () => {
    expect(validateFacebookOverride("http://www.facebook.com/examplebusiness/reviews")).toEqual({
      ok: true,
      url: "https://www.facebook.com/examplebusiness/reviews",
    });
    expect(validateFacebookOverride("facebook.com/examplebusiness/reviews")).toEqual({
      ok: true,
      url: "https://facebook.com/examplebusiness/reviews",
    });
  });
  it("keeps query strings such as sk=reviews", () => {
    const r = validateFacebookOverride("https://www.facebook.com/profile.php?id=61595222673008&sk=reviews");
    expect(r).toEqual({ ok: true, url: "https://www.facebook.com/profile.php?id=61595222673008&sk=reviews" });
  });
  it("removes URL fragments", () => {
    const r = validateFacebookOverride("https://www.facebook.com/examplebusiness/reviews#top");
    expect(r).toEqual({ ok: true, url: "https://www.facebook.com/examplebusiness/reviews" });
  });
  it.each(["", "   ", "https://example.com/reviews", "https://www.facebook.com", "https://l.facebook.com/l.php?u=x", "javascript:alert(1)", "https://u:p@facebook.com/x"])(
    "rejects %j",
    (input) => {
      expect(validateFacebookOverride(input).ok).toBe(false);
    },
  );
});
