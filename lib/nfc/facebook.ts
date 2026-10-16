/** Facebook Page URL handling. Pure functions, no browser APIs, safe to unit test. */

const FB_HOSTS = new Set([
  "facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "mbasic.facebook.com", "fb.com", "www.fb.com",
]);
const REDIRECT_HOSTS = new Set(["l.facebook.com", "lm.facebook.com", "l.messenger.com"]);

/** First path segments that are Facebook features, not a Page. */
const RESERVED = new Set([
  "groups", "events", "share", "sharer", "sharer.php", "photo", "photo.php", "photos", "watch", "marketplace", "login", "login.php",
  "reel", "reels", "stories", "hashtag", "gaming", "permalink.php", "story.php", "people", "public", "dialog", "plugins", "help",
  "policies", "settings", "friends", "messages", "notifications", "bookmarks", "search", "video", "videos", "posts", "business",
  "ads", "l.php", "home.php", "composer", "privacy", "legal", "about",
]);

export type FacebookNormalized =
  | { ok: true; kind: "vanity" | "id"; pageUrl: string; reviewsUrl: string }
  | { ok: false; error: string };

export type FacebookOverrideCheck = { ok: true; url: string } | { ok: false; error: string };

function parseUrl(input: string): URL | null {
  const text = input.trim();
  if (!text) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`;
  try {
    return new URL(withScheme);
  } catch {
    return null;
  }
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

type HostCheck = { ok: true; url: URL } | { ok: false; error: string };

function checkFacebookHost(input: string): HostCheck {
  const url = parseUrl(input);
  if (!url) return { ok: false, error: "That doesn't look like a valid web address." };
  if (url.protocol !== "https:" && url.protocol !== "http:") return { ok: false, error: "Use a normal https:// web address." };
  if (url.username || url.password) return { ok: false, error: "Remove the username or password from that address." };
  const host = url.hostname.toLowerCase();
  if (REDIRECT_HOSTS.has(host)) {
    return { ok: false, error: "That is a Facebook redirect link. Open the Page in your browser and copy its address instead." };
  }
  if (!FB_HOSTS.has(host)) return { ok: false, error: "That isn't a facebook.com address." };
  return { ok: true, url };
}

const fail = (error: string): FacebookNormalized => ({ ok: false, error });

export function normalizeFacebookPageUrl(input: string): FacebookNormalized {
  if (!input.trim()) return fail("Paste the client's Facebook Page URL.");
  const checked = checkFacebookHost(input);
  if (!checked.ok) return fail(checked.error);
  const { url } = checked;

  const segments = url.pathname.split("/").filter(Boolean).map(safeDecode);
  if (segments.length === 0) return fail("Add the Page's own address, not just facebook.com.");

  const first = segments[0].toLowerCase();

  const fromId = (id: string): FacebookNormalized => ({
    ok: true,
    kind: "id",
    pageUrl: `https://www.facebook.com/profile.php?id=${id}`,
    reviewsUrl: `https://www.facebook.com/profile.php?id=${id}&sk=reviews`,
  });

  if (first === "profile.php") {
    const id = url.searchParams.get("id");
    if (id && /^\d{5,}$/.test(id)) return fromId(id);
    return fail("That profile.php link has no numeric id. Open the Page and copy its address again.");
  }
  if (first === "pages") {
    const id = [...segments].reverse().find((s) => /^\d{5,}$/.test(s));
    if (id) return fromId(id);
    return fail("Couldn't find the Page id in that /pages/ link. Open the Page and copy its address again.");
  }
  if (RESERVED.has(first)) {
    return fail(`That link points to a Facebook "${segments[0]}" section, not a Page. Open the Page itself and copy its address.`);
  }
  if (/^\d{5,}$/.test(first)) return fromId(first);
  if (!/^[A-Za-z0-9._-]{5,}$/.test(segments[0])) return fail("Couldn't find a Page name in that address.");

  const pageUrl = `https://www.facebook.com/${segments[0]}`;
  return { ok: true, kind: "vanity", pageUrl, reviewsUrl: `${pageUrl}/reviews` };
}

/** Validates an exact review/recommendations URL pasted by hand. Upgrades http to https. */
export function validateFacebookOverride(input: string): FacebookOverrideCheck {
  if (!input.trim()) return { ok: false, error: "Paste the exact Facebook URL." };
  const checked = checkFacebookHost(input);
  if (!checked.ok) return checked;
  const { url } = checked;
  if (url.pathname.replace(/\//g, "") === "" && !url.search) return { ok: false, error: "Add the full address, not just facebook.com." };
  url.protocol = "https:";
  url.hash = "";
  return { ok: true, url: url.toString() };
}
