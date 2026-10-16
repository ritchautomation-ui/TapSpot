/** Labeled text for the "Copy Both Links" button. The two URLs are never merged into one. */
export function formatBothLinks(googleUrl: string, facebookUrl: string): string {
  return `Google Review: ${googleUrl}\nFacebook Review: ${facebookUrl}`;
}
