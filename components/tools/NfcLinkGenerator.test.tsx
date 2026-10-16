// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ID_A = "ChIJAAAAAAAAAAAAAAAAAAAA-1";
const ID_B = "ChIJBBBBBBBBBBBBBBBBBBBB_2";

/** Fake Places library: two branches of the same café, so "similar names" must be chosen by hand. */
const PLACES: Record<string, { name: string; address: string }> = {
  [ID_A]: { name: "Coffee Project - Angeles", address: "MacArthur Hwy, Angeles, Pampanga" },
  [ID_B]: { name: "Coffee Project - Clark", address: "Clark Freeport Zone, Pampanga" },
};
vi.mock("@/lib/nfc/googleMaps", () => ({
  onMapsAuthFailure: () => () => {},
  loadPlacesLibrary: async () => ({
    AutocompleteSessionToken: class {},
    AutocompleteSuggestion: {
      fetchAutocompleteSuggestions: async ({ input }: { input: string }) => ({
        suggestions: /^nothing/i.test(input)
          ? []
          : Object.entries(PLACES).map(([placeId, p]) => ({
              placePrediction: {
                placeId,
                text: { text: `${p.name}, ${p.address}` },
                mainText: { text: p.name },
                secondaryText: { text: p.address },
                toPlace: () => ({
                  id: placeId,
                  displayName: p.name,
                  formattedAddress: p.address,
                  fetchFields: async () => undefined,
                }),
              },
            })),
      }),
    },
  }),
}));

const reviewUrl = (id: string) => `https://search.google.com/local/writereview?placeid=${id}`;
const copyMock = vi.fn();
copyMock.mockResolvedValue(undefined);

async function load(key: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", key);
  const { NfcLinkGenerator } = await import("./NfcLinkGenerator");
  const user = userEvent.setup();
  Object.defineProperty(navigator, "clipboard", { value: { writeText: copyMock }, configurable: true });
  render(<NfcLinkGenerator />);
  return user;
}

const urlBox = (name: RegExp) => screen.queryByRole("textbox", { name }) as HTMLInputElement | null;

beforeEach(() => {
  copyMock.mockReset();
  copyMock.mockResolvedValue(undefined);
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("without an API key", () => {
  it("shows the setup notice, disables search, and manual Place ID still builds the exact URL", async () => {
    const user = await load("");
    expect(screen.getByText(/live business search isn't set up yet/i)).toBeTruthy();
    expect((screen.getByRole("combobox") as HTMLInputElement).disabled).toBe(true);

    expect(urlBox(/google review url/i)).toBeNull(); // nothing generated yet
    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), ID_A);
    expect(urlBox(/google review url/i)?.value).toBe(reviewUrl(ID_A));

    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(copyMock).toHaveBeenCalledWith(reviewUrl(ID_A));
  });

  it("rejects a pasted Maps link and generates nothing", async () => {
    const user = await load("");
    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), "https://www.google.com/maps/place/x");
    expect(screen.getByRole("alert").textContent).toMatch(/looks like a link/i);
    expect(urlBox(/google review url/i)).toBeNull();
  });

  it("Reset clears the manual Place ID, Facebook fields, destination and URL", async () => {
    const user = await load("");
    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), ID_A);
    await user.click(screen.getByRole("radio", { name: "Facebook Reviews" }));
    await user.type(screen.getByLabelText(/paste the client's facebook page url/i), "facebook.com/examplebusiness");
    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByRole("radio", { name: "Google Review" }).getAttribute("aria-checked")).toBe("true");
    expect(urlBox(/google review url/i)).toBeNull();
    expect((screen.getByLabelText("Place ID") as HTMLInputElement).value).toBe("");
    await user.click(screen.getByRole("radio", { name: "Facebook Reviews" }));
    expect((screen.getByLabelText(/paste the client's facebook page url/i) as HTMLInputElement).value).toBe("");
  });
});

describe("with an API key (mocked Google Places)", () => {
  it("requires an explicit pick, then never reuses a stale Place ID", async () => {
    const user = await load("test-key-not-real");
    const search = screen.getByRole("combobox");

    await user.type(search, "Coffee Project");
    const list = await screen.findByRole("listbox", {}, { timeout: 3000 });
    const options = within(list).getAllByRole("option");
    expect(options).toHaveLength(2);

    // Enter without highlighting a result must not auto-pick the first one.
    await user.keyboard("{Enter}");
    expect(urlBox(/google review url/i)).toBeNull();

    // Pick branch A.
    await user.click(options[0]);
    await waitFor(() => expect(urlBox(/google review url/i)?.value).toBe(reviewUrl(ID_A)));
    expect(screen.getByText("Selected business")).toBeTruthy();
    expect(screen.getAllByText(ID_A).length).toBeGreaterThan(0);

    // Edit the query: the old selection and URL must disappear immediately.
    await user.type(search, " Clark");
    expect(urlBox(/google review url/i)).toBeNull();
    expect(screen.queryByText("Selected business")).toBeNull();

    // Pick branch B explicitly: URL updates to B and A is nowhere in it.
    const list2 = await screen.findByRole("listbox", {}, { timeout: 3000 });
    await user.click(within(list2).getAllByRole("option")[1]);
    await waitFor(() => expect(urlBox(/google review url/i)?.value).toBe(reviewUrl(ID_B)));
    expect(urlBox(/google review url/i)?.value).not.toContain(ID_A);
  });

  it("arrow keys plus Enter select the highlighted result", async () => {
    const user = await load("test-key-not-real");
    await user.type(screen.getByRole("combobox"), "Coffee Project");
    await screen.findByRole("listbox", {}, { timeout: 3000 });
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await waitFor(() => expect(urlBox(/google review url/i)?.value).toBe(reviewUrl(ID_B)));
  });

  it("shows a useful message when nothing matches, and recovers on a new query", async () => {
    const user = await load("test-key-not-real");
    const search = screen.getByRole("combobox");
    await user.type(search, "nothing here");
    expect(await screen.findByText(/no matching businesses/i, {}, { timeout: 3000 })).toBeTruthy();
    await user.clear(search);
    await user.type(search, "Coffee Project");
    expect(await screen.findByRole("listbox", {}, { timeout: 3000 })).toBeTruthy();
  });

  it("manual Place ID replaces a searched business so only one source is ever active", async () => {
    const user = await load("test-key-not-real");
    await user.type(screen.getByRole("combobox"), "Coffee Project");
    const list = await screen.findByRole("listbox", {}, { timeout: 3000 });
    await user.click(within(list).getAllByRole("option")[0]);
    await waitFor(() => expect(urlBox(/google review url/i)?.value).toBe(reviewUrl(ID_A)));

    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), ID_B);
    expect(urlBox(/google review url/i)?.value).toBe(reviewUrl(ID_B));
    expect(screen.queryByText("Selected business")).toBeNull();
  });
});

describe("Facebook and bundle", () => {
  it("proposes a /reviews URL, labels it proposed, and a valid override replaces it", async () => {
    const user = await load("");
    await user.click(screen.getByRole("radio", { name: "Facebook Reviews" }));
    expect(urlBox(/facebook reviews url/i)).toBeNull();

    await user.type(screen.getByLabelText(/paste the client's facebook page url/i), "https://m.facebook.com/examplebusiness?ref=x");
    expect(urlBox(/facebook reviews url/i)?.value).toBe("https://www.facebook.com/examplebusiness/reviews");
    expect(screen.getByText(/proposed from the page url/i)).toBeTruthy();

    await user.type(screen.getByLabelText(/exact review url override/i), "https://www.facebook.com/examplebusiness/reviews_and_recommendations");
    expect(urlBox(/facebook reviews url/i)?.value).toBe("https://www.facebook.com/examplebusiness/reviews_and_recommendations");
    expect(screen.getByText("Manually entered")).toBeTruthy();
  });

  it("an invalid override blocks the link instead of silently using the proposed one", async () => {
    const user = await load("");
    await user.click(screen.getByRole("radio", { name: "Facebook Reviews" }));
    await user.type(screen.getByLabelText(/paste the client's facebook page url/i), "facebook.com/examplebusiness");
    await user.type(screen.getByLabelText(/exact review url override/i), "https://example.com/nope");
    expect(urlBox(/facebook reviews url/i)).toBeNull();
    expect(screen.getByText(/isn't a facebook\.com address/i)).toBeTruthy();
  });

  it("shows an error for a non-page Facebook link and generates nothing", async () => {
    const user = await load("");
    await user.click(screen.getByRole("radio", { name: "Facebook Reviews" }));
    await user.type(screen.getByLabelText(/paste the client's facebook page url/i), "https://www.facebook.com/groups/123456789");
    expect(screen.getByText(/not a page/i)).toBeTruthy();
    expect(urlBox(/facebook reviews url/i)).toBeNull();
  });

  it("bundle shows two independent URLs, each with its own copy, plus a labeled Copy Both", async () => {
    const user = await load("");
    await user.click(screen.getByRole("radio", { name: "Google + Facebook Bundle" }));
    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), ID_A);
    await user.type(screen.getByLabelText(/paste the client's facebook page url/i), "facebook.com/examplebusiness");

    const g = urlBox(/google review url/i)?.value;
    const f = urlBox(/facebook reviews url/i)?.value;
    expect(g).toBe(reviewUrl(ID_A));
    expect(f).toBe("https://www.facebook.com/examplebusiness/reviews");
    expect(g).not.toBe(f);

    await user.click(screen.getByRole("button", { name: "Copy Google Review Link" }));
    expect(copyMock).toHaveBeenLastCalledWith(g);
    await user.click(screen.getByRole("button", { name: "Copy Facebook Reviews Link" }));
    expect(copyMock).toHaveBeenLastCalledWith(f);
    await user.click(screen.getByRole("button", { name: "Copy Both Links" }));
    expect(copyMock).toHaveBeenLastCalledWith(`Google Review: ${g}\nFacebook Review: ${f}`);
  });

  it("Open / Test links open in a new tab safely", async () => {
    const user = await load("");
    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), ID_A);
    const link = screen.getByRole("link", { name: "Open / Test Link" });
    expect(link.getAttribute("href")).toBe(reviewUrl(ID_A));
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("shows a manual-copy message when the clipboard is unavailable", async () => {
    const user = await load("");
    copyMock.mockRejectedValueOnce(new Error("denied"));
    (document as unknown as { execCommand: () => boolean }).execCommand = () => false;
    await user.click(screen.getByText("Enter Place ID manually"));
    await user.type(screen.getByLabelText("Place ID"), ID_A);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(await screen.findByText(/blocked automatic copying/i)).toBeTruthy();
  });
});
