/**
 * Central store settings. Edit this file to change brand name, contact details
 * and links. No UI component needs to be touched.
 */
/**
 * Public site URL. Priority: NEXT_PUBLIC_SITE_URL (your custom domain) ->
 * Vercel production URL (set automatically on Vercel) -> local dev.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3107";
}

export const storeConfig = {
  brandName: "TapSpot",
  tagline: "NFC solutions for local businesses",
  siteUrl: resolveSiteUrl(),
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA || "",
  currency: { code: "PHP", symbol: "₱", locale: "en-PH" },

  // Env vars (Vercel) override the fallbacks below.
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "tapspotpampanga@gmail.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/profile.php?id=61595222673008",
    // Opens a Messenger chat with the page. If it does not open for you, set this to "" to fall back to the Facebook page link.
    messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL || "https://m.me/61595222673008",
    supportHours: "", // e.g. "Mon–Sat, 9:00 AM – 6:00 PM"
  },

  processingTime: "3–5 business days", // shown in FAQ + confirmation. Edit to match reality.
  defectPolicy: "", // leave empty to hide. Example: "Free replacement for defective or wrong items."

  /** Set to true once you have real customer testimonials in data/testimonials.ts */
  showTestimonials: false,
};
