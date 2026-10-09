/** Shipping rules. Change the numbers; the cart and checkout update automatically. */
export const shippingConfig = {
  enabled: false,
  flatRate: 150, // TODO: set your real flat rate in PHP
  freeShippingThreshold: null as number | null, // e.g. 3000 to ship free from ₱3,000
  label: "Delivery confirmed by message",
  note: "Courier delivery time is separate from processing time.",
};

