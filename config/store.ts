/**
 * Central store settings. Edit this file to change brand name, contact details
 * and links. No UI component needs to be touched.
 */
export const storeConfig = {
  brandName: "TapSpot",
  tagline: "NFC solutions for local businesses",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tapspot.example.com",
  currency: { code: "PHP", symbol: "₱", locale: "en-PH" },

  // TODO: replace with your real details
  contact: {
    email: "hello@tapspot.example.com",
    phone: "", // e.g. "0917 000 0000" (leave empty to hide)
    facebookUrl: "https://facebook.com/", // your TapSpot Facebook page
    messengerUrl: "https://m.me/", // e.g. https://m.me/yourpagename
    supportHours: "", // e.g. "Mon–Sat, 9:00 AM – 6:00 PM"
  },

  processingTime: "3–5 business days", // shown in FAQ + confirmation. Edit to match reality.
  defectPolicy: "", // leave empty to hide. Example: "Free replacement for defective or wrong items."

  /** Set to true once you have real customer testimonials in data/testimonials.ts */
  showTestimonials: false,
};
