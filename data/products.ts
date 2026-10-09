import type { Product, SetupField } from "@/lib/types";

/**
 * ALL product data lives here. To change a price, edit `price`.
 * To switch a product on/off, edit `available`.
 * To add a product, copy an entry and give it a new id/slug.
 */

const businessName: SetupField = {
  key: "businessName",
  label: "Business name",
  type: "text",
  required: true,
  placeholder: "e.g. Mabuhay Café",
};

const googleReviewUrl: SetupField = {
  key: "googleReviewUrl",
  label: "Google review link",
  type: "url",
  required: true,
  placeholder: "https://g.page/r/…/review",
  help: "In Google Business Profile, choose “Ask for reviews” and copy the link.",
  hostHints: ["google.", "goo.gl", "g.page", "g.co"],
  hostHintMessage: "That doesn't look like a Google link. Paste the review link from your Google Business Profile.",
};

const facebookUrl: SetupField = {
  key: "facebookUrl",
  label: "Facebook page link",
  type: "url",
  required: true,
  placeholder: "https://facebook.com/yourpage",
  help: "Open your page on Facebook and copy the address from the browser.",
  hostHints: ["facebook.com", "fb.com", "fb.me", "m.me"],
  hostHintMessage: "That doesn't look like a Facebook link. Paste your Facebook page address.",
};

const optionalUrl = (key: string, label: string, placeholder: string): SetupField => ({
  key,
  label,
  type: "url",
  required: false,
  placeholder,
});

const notes: SetupField = {
  key: "notes",
  label: "Notes for our team",
  type: "textarea",
  required: false,
  placeholder: "Anything we should know about your setup",
};

export const products: Product[] = [
  {
    id: "google-review",
    slug: "google-review",
    name: "NFC Google Review",
    shortName: "Google Review",
    category: "review",
    tagline: "Make leaving a Google review easier.",
    description:
      "A TapSpot display programmed with your Google review link. After a good experience, customers tap their phone and your review page opens. No searching for your business.",
    price: 1000,
    priceNote: "per unit",
    available: true,
    featured: true,
    visual: "google",
    showcaseTile: 0,
    images: [
      { src: "/images/standee-google.jpg", alt: "TapSpot NFC Google Review display on a counter", width: 360, height: 530 },
      { src: "/images/hero-scene.jpg", alt: "Customer tapping a phone on a TapSpot display to open a Google review page", width: 1175, height: 725 },
    ],
    includes: [
      "NFC-enabled TapSpot display",
      "Your business name set up",
      "NFC programming to your Google review link",
      "Testing before delivery",
    ],
    benefits: [
      { title: "Fewer steps", body: "Reduce the steps between a great customer experience and a Google review." },
      { title: "Works with any NFC phone", body: "Customers tap. The page opens. No app to install." },
      { title: "Ready to use", body: "You get a finished display, not a blank chip. Set it on your counter or table." },
    ],
    howItWorks: [
      "Send us your business name and Google review link.",
      "We review your details and program the NFC chip.",
      "We test it, pack it and ship it to you.",
    ],
    useCases: ["Cafés", "Restaurants", "Salons", "Clinics", "Retail stores"],
    setupFields: [businessName, googleReviewUrl],
    related: ["facebook", "google-facebook-bundle"],
  },
  {
    id: "facebook",
    slug: "facebook",
    name: "NFC Facebook",
    shortName: "Facebook",
    category: "social",
    tagline: "Turn customer interactions into easier Facebook connections.",
    description:
      "A TapSpot display programmed with your Facebook page link. Customers tap and land on your page, ready to like, follow or message you.",
    price: 1000,
    priceNote: "per unit",
    available: true,
    featured: true,
    visual: "facebook",
    showcaseTile: 1,
    images: [
      { src: "/images/standee-facebook.jpg", alt: "TapSpot NFC Facebook display on a counter", width: 330, height: 530 },
      { src: "/images/hero-scene.jpg", alt: "TapSpot NFC displays on a café counter", width: 1175, height: 725 },
    ],
    includes: [
      "NFC-enabled TapSpot display",
      "Your business name set up",
      "NFC programming to your Facebook page",
      "Testing before delivery",
    ],
    benefits: [
      { title: "A faster path to your page", body: "Walk-ins reach your Facebook page without typing or searching." },
      { title: "No app needed", body: "Compatible phones open the page straight from a tap." },
      { title: "Counter-ready", body: "Looks tidy next to the register, at reception or on a table." },
    ],
    howItWorks: [
      "Send us your business name and Facebook page link.",
      "We review your details and program the NFC chip.",
      "We test it, pack it and ship it to you.",
    ],
    useCases: ["Barbershops", "Salons", "Cafés", "Gyms", "Local shops"],
    setupFields: [businessName, facebookUrl],
    related: ["google-review", "google-facebook-bundle"],
  },
  {
    id: "google-facebook-bundle",
    slug: "google-facebook-bundle",
    name: "Google + Facebook Bundle",
    shortName: "Google + Facebook",
    category: "bundle",
    tagline: "One for reviews. One for social.",
    description:
      "Two essential customer touchpoints in one bundle. You get one Google Review NFC display and one Facebook NFC display. Each has its own chip and its own destination.",
    price: 1500,
    priceNote: "per bundle",
    badge: "Best value",
    available: true,
    featured: true,
    visual: "bundle",
    images: [
      { src: "/images/standee-pair.jpg", alt: "TapSpot Google Review and Facebook NFC displays side by side", width: 645, height: 530 },
      { src: "/images/hero-scene.jpg", alt: "Customer tapping a phone on a TapSpot display", width: 1175, height: 725 },
    ],
    includes: [
      "1 × NFC Google Review display",
      "1 × NFC Facebook display",
      "Your business name set up on both",
      "NFC programming for both destinations",
      "Testing before delivery",
    ],
    benefits: [
      { title: "Two touchpoints, one order", body: "Reviews on one display, social on the other. Customers pick what they want to do." },
      { title: "Each display does one job", body: "Each chip opens one destination, so there's nothing confusing for customers." },
      { title: "Lower than buying separately", body: "The bundle price is already the offer." },
    ],
    howItWorks: [
      "Send us your business name, Google review link and Facebook page link.",
      "We review your details and program both chips.",
      "We test both, pack them together and ship.",
    ],
    useCases: ["Cafés", "Restaurants", "Salons", "Clinics", "Hotels and Airbnb hosts"],
    setupFields: [businessName, googleReviewUrl, facebookUrl],
    related: ["google-review", "facebook"],
  },
  {
    id: "nfc-business-card",
    slug: "nfc-business-card",
    name: "NFC Digital Business Card",
    shortName: "Business Card",
    category: "profile",
    tagline: "Your professional identity, one tap away.",
    description:
      "A premium PVC card with an NTAG215 NFC chip. Tap it on a phone and your mobile profile opens: your photo, contact details, social links and a Save Contact button. The card stays generic. Your details live on your profile page.",
    price: null, // TODO: set the price (number) when ready, e.g. 799. Until then the page shows "Price on request".
    priceNote: "per card",
    available: true,
    featured: true,
    visual: "business-card",
    images: [
      { src: "/images/business-cards.jpg", alt: "TapSpot NFC business card, black front and light back", width: 1536, height: 1024 },
    ],
    includes: [
      "PVC NFC business card, 85.5 × 54 mm",
      "NTAG215 NFC chip",
      "Mobile profile page with your details",
      "NFC programming to your profile",
      "Testing before delivery",
    ],
    benefits: [
      { title: "One tap shares everything", body: "Phone, email, social links, website and a Save Contact button, all in one page." },
      { title: "Update without reprinting", body: "Your details live on the profile page, not on the card." },
      { title: "Looks the part", body: "A clean black card that says you take your business seriously." },
    ],
    howItWorks: [
      "Send us your details, photo and links.",
      "We build your mobile profile and program the card.",
      "We test it, pack it and ship it to you.",
    ],
    useCases: ["Dentists", "Realtors", "Insurance agents", "Sales agents", "Freelancers", "Consultants"],
    setupFields: [
      { key: "fullName", label: "Full name", type: "text", required: true, placeholder: "Your name as it should appear" },
      { key: "jobTitle", label: "Job title", type: "text", required: true, placeholder: "e.g. Licensed Real Estate Broker" },
      { key: "businessName", label: "Business name", type: "text", required: false, placeholder: "Company or practice" },
      { key: "phone", label: "Phone", type: "tel", required: true, placeholder: "0917 123 4567" },
      { key: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      optionalUrl("facebook", "Facebook", "https://facebook.com/…"),
      optionalUrl("instagram", "Instagram", "https://instagram.com/…"),
      optionalUrl("tiktok", "TikTok", "https://tiktok.com/@…"),
      optionalUrl("linkedin", "LinkedIn", "https://linkedin.com/in/…"),
      optionalUrl("website", "Website", "https://…"),
      optionalUrl("photoUrl", "Profile photo link", "https://drive.google.com/…"),
      optionalUrl("logoUrl", "Logo link", "https://drive.google.com/…"),
      { key: "bio", label: "About you (optional)", type: "textarea", required: false, placeholder: "A short bio for your profile" },
    ],
    setupNote: "Photos and logos: paste a Google Drive or Facebook link, or send them to us on Messenger after you order.",
    related: ["google-review", "google-facebook-bundle"],
  },
];

/**
 * Future products. They stay hidden until you set `available: true`.
 * Copy one of the entries above to flesh them out fully.
 */
const futureStub = (id: string, name: string, category: Product["category"]): Product => ({
  id,
  slug: id,
  name,
  shortName: name,
  category,
  tagline: "",
  description: "",
  price: null,
  available: false,
  featured: false,
  visual: "business-card",
  images: [],
  includes: [],
  benefits: [],
  howItWorks: [],
  useCases: [],
  setupFields: [businessName],
  related: [],
});

export const futureProducts: Product[] = [
  { ...futureStub("instagram", "NFC Instagram", "social"), shortName: "Instagram", showcaseTile: 2, tagline: "Make it easier for customers to follow your Instagram." },
  { ...futureStub("tiktok", "NFC TikTok", "social"), shortName: "TikTok", showcaseTile: 3, tagline: "Connect customers with your latest TikTok content." },
  { ...futureStub("menu", "NFC Menu", "menu"), shortName: "Menu", showcaseTile: 4, tagline: "Put your menu one tap away." },
  { ...futureStub("services", "NFC Services", "services"), shortName: "Services", showcaseTile: 5, tagline: "Help customers explore what you offer." },
  futureStub("booking", "NFC Booking", "booking"),
];

const all = [...products, ...futureProducts];

export const getProduct = (idOrSlug: string): Product | undefined =>
  all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

export const availableProducts = (): Product[] => all.filter((p) => p.available);
export const featuredProducts = (): Product[] => all.filter((p) => p.available && p.featured);

/** Preview the range without changing purchasing availability. */
export const showcaseProducts = (): Product[] => all
  .filter((p) => p.showcaseTile !== undefined)
  .sort((a, b) => a.showcaseTile! - b.showcaseTile!);
