import { describe, expect, it } from "vitest";
import { formatBothLinks } from "./format";

describe("formatBothLinks", () => {
  it("produces clearly labeled lines and keeps both URLs separate", () => {
    const g = "https://search.google.com/local/writereview?placeid=ChIJf5jpQgDzljMRR6hcJ0s-iVs";
    const f = "https://www.facebook.com/examplebusiness/reviews";
    const text = formatBothLinks(g, f);
    expect(text).toBe(`Google Review: ${g}\nFacebook Review: ${f}`);
    expect(text.split("\n")).toHaveLength(2);
  });
});
