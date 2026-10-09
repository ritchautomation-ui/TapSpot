/** Edit these offers before publishing. Prices are in PHP. */
export const cardPackages = [
  { id: 'starter', name: 'Starter', price: 998, tagline: 'A simple introduction. One easy tap.', description: '1 NFC card + a basic digital landing page.', features: ['Name, photo and business details', 'Call, email and social links', 'Save-contact button'], tone: 'light' },
  { id: 'business', name: 'Business', price: 1698, tagline: 'Give your business a place to shine.', description: '1 NFC card + a business showcase landing page.', features: ['Everything in Starter', 'Customized business content sections', 'Products, services and location'], tone: 'orange' },
  { id: 'executive', name: 'Executive', price: 3898, tagline: 'A digital experience made around you.', description: '1 NFC card + a fully customized landing page.', features: ['Custom page design and sections', 'Animations and visual effects', 'A custom mobile experience'], tone: 'dark' },
] as const;

export const growthBundle = {
  id: 'business-growth-bundle',
  name: 'Local Business Growth Package',
  price: null as number | null, // Set the agreed bundle price, or keep quote-only.
  includes: ['1 Google Review NFC display', '1 Facebook NFC display', '5,000 Facebook followers'],
  description: 'Bring reviews, page connections and your Facebook follower service into one package.',
};
