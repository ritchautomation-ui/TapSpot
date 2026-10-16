"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, Field, inputClass } from "@/components/ui";
import { copyToClipboard } from "@/lib/nfc/clipboard";
import { normalizeFacebookPageUrl, validateFacebookOverride } from "@/lib/nfc/facebook";
import { formatBothLinks } from "@/lib/nfc/format";
import { buildGoogleReviewUrl, validatePlaceId } from "@/lib/nfc/googleReview";
import { loadPlacesLibrary, onMapsAuthFailure, type PlacePrediction, type PlacesLibrary } from "@/lib/nfc/googleMaps";

/** Browser key, intended to be public. Restrict it by HTTP referrer and API in Google Cloud. */
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";

type Destination = "google" | "facebook" | "bundle";
type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";
type Suggestion = { placeId: string; main: string; secondary: string; prediction: PlacePrediction };
type Selected = { placeId: string; name: string; address: string };
type Item = { key: "google" | "facebook"; label: string; url: string | null; source: string; business?: string; hint: string };

const DESTINATIONS: { value: Destination; label: string }[] = [
  { value: "google", label: "Google Review" },
  { value: "facebook", label: "Facebook Reviews" },
  { value: "bundle", label: "Google + Facebook Bundle" },
];

const card = "rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6";
const SEARCH_HELP =
  "Google Places search couldn't complete. Check that the key is valid, Places API (New) is enabled, billing is on, and the key allows this website. You can still use \"Enter Place ID manually\".";

function describeError(error: unknown): string {
  const detail = error instanceof Error ? error.message : "";
  return detail && detail.length < 160 ? `${SEARCH_HELP} (${detail})` : SEARCH_HELP;
}

export function NfcLinkGenerator() {
  const listId = useId();
  const [destination, setDestination] = useState<Destination>("google");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectError, setSelectError] = useState<string | null>(null);

  const [manualOpen, setManualOpen] = useState(false);
  const [manualId, setManualId] = useState("");

  const [fbInput, setFbInput] = useState("");
  const [fbOverride, setFbOverride] = useState("");

  const [copied, setCopied] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const placesRef = useRef<PlacesLibrary | null>(null);
  const tokenRef = useRef<unknown>(null);
  const reqRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const off = onMapsAuthFailure(() => {
      reqRef.current += 1;
      setStatus("error");
      setSearchError("Google rejected the API key (invalid key, a referrer restriction that excludes this site, or billing is off). Live search is unavailable. Use manual Place ID entry.");
      setOpen(true);
    });
    return () => {
      off();
      clearTimeout(timerRef.current);
    };
  }, []);

  /* ---------- Google Places search ---------- */

  function onQueryChange(value: string) {
    setQuery(value);
    // Any edit invalidates the previous business so its Place ID can never leak into the next link.
    setSelected(null);
    setSelectError(null);
    setActive(-1);
    clearTimeout(timerRef.current);
    const id = ++reqRef.current;
    if (value.trim().length < 3) {
      setSuggestions([]);
      setStatus("idle");
      setOpen(false);
      return;
    }
    setStatus("loading");
    setOpen(true);
    timerRef.current = setTimeout(() => void runSearch(value.trim(), id), 300);
  }

  async function runSearch(input: string, id: number) {
    try {
      const lib = placesRef.current ?? (await loadPlacesLibrary(API_KEY));
      placesRef.current = lib;
      if (id !== reqRef.current) return;
      tokenRef.current ??= new lib.AutocompleteSessionToken();
      const { suggestions: raw } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        sessionToken: tokenRef.current,
        region: "ph",
        language: "en",
      });
      if (id !== reqRef.current) return;
      const list: Suggestion[] = raw.flatMap((s) => {
        const p = s.placePrediction;
        if (!p) return [];
        return [{ placeId: p.placeId, main: p.mainText?.text ?? p.text.text, secondary: p.secondaryText?.text ?? "", prediction: p }];
      });
      setSuggestions(list);
      setStatus(list.length ? "results" : "empty");
      setOpen(true);
    } catch (error) {
      if (id !== reqRef.current) return;
      setStatus("error");
      setSearchError(describeError(error));
      setOpen(true);
    }
  }

  async function choose(s: Suggestion) {
    const id = reqRef.current;
    setOpen(false);
    setSelecting(true);
    setSelectError(null);
    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: ["id", "displayName", "formattedAddress"] });
      if (id !== reqRef.current) return; // the user kept typing, so this result is already stale
      const check = validatePlaceId(place.id);
      if (!check.ok) throw new Error("Google returned no usable Place ID for this result.");
      const name = place.displayName || s.main;
      setSelected({ placeId: check.placeId, name, address: place.formattedAddress || s.secondary });
      setQuery(name);
      setManualId("");
      setSuggestions([]);
      setStatus("idle");
      tokenRef.current = null; // the billing session ends once the place is fetched
    } catch (error) {
      if (id !== reqRef.current) return;
      setSelected(null);
      setSelectError(error instanceof Error && error.message.startsWith("Google returned") ? error.message : "That result couldn't be loaded. Pick it again or try another search.");
    } finally {
      setSelecting(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || status !== "results") return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); void choose(suggestions[active]); } // never auto-picks the first result
    else if (e.key === "Escape") setOpen(false);
  }

  function onManualChange(value: string) {
    setManualId(value);
    if (value.trim()) setSelected(null); // one source at a time: manual entry replaces any searched business
  }

  /* ---------- Derived values ---------- */

  const manualCheck = useMemo(() => (manualId.trim() ? validatePlaceId(manualId) : null), [manualId]);
  const google = selected
    ? { placeId: selected.placeId, name: selected.name, address: selected.address, source: "Generated from Google Places search" }
    : manualCheck?.ok
      ? { placeId: manualCheck.placeId, name: "", address: "", source: "Generated from manually entered Place ID" }
      : null;
  const googleUrl = google ? buildGoogleReviewUrl(google.placeId) : null;

  const fbNorm = useMemo(() => (fbInput.trim() ? normalizeFacebookPageUrl(fbInput) : null), [fbInput]);
  const fbOv = useMemo(() => (fbOverride.trim() ? validateFacebookOverride(fbOverride) : null), [fbOverride]);
  const facebook = fbOverride.trim()
    ? fbOv?.ok ? { url: fbOv.url, source: "Manually entered" } : null
    : fbNorm?.ok ? { url: fbNorm.reviewsUrl, source: "Proposed from the Page URL. Test it before writing the tag" } : null;

  const showGoogle = destination !== "facebook";
  const showFacebook = destination !== "google";
  const items: Item[] = [];
  if (showGoogle) {
    items.push({
      key: "google",
      label: "Google Review",
      url: googleUrl,
      source: google?.source ?? "",
      business: google?.name || undefined,
      hint: "Search for a business or enter a Place ID to generate this link.",
    });
  }
  if (showFacebook) {
    items.push({
      key: "facebook",
      label: "Facebook Reviews",
      url: facebook?.url ?? null,
      source: facebook?.source ?? "",
      hint: "Paste the client's Facebook Page URL to propose this link.",
    });
  }
  const bothReady = destination === "bundle" && googleUrl && facebook;

  /* ---------- Actions ---------- */

  async function copy(key: string, text: string) {
    const ok = await copyToClipboard(text);
    setCopyFailed(!ok);
    setCopied(ok ? key : null);
    if (ok) setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
  }

  function reset() {
    clearTimeout(timerRef.current);
    reqRef.current += 1;
    tokenRef.current = null;
    setDestination("google");
    setQuery("");
    setStatus("idle");
    setSuggestions([]);
    setOpen(false);
    setActive(-1);
    setSearchError(null);
    setSelected(null);
    setSelecting(false);
    setSelectError(null);
    setManualOpen(false);
    setManualId("");
    setFbInput("");
    setFbOverride("");
    setCopied(null);
    setCopyFailed(false);
    inputRef.current?.focus();
  }

  return (
    <div className="mt-10 space-y-6">
      <p className="text-sm font-medium text-mute">Search business → Select branch → Choose destination → Copy → Write to NFC</p>

      {/* 1. Destination */}
      <section className={card} aria-labelledby="dest-h">
        <h2 id="dest-h" className="text-lg font-semibold">1. Choose the tag destination</h2>
        <div role="radiogroup" aria-labelledby="dest-h" className="mt-4 grid gap-2 sm:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              role="radio"
              aria-checked={destination === d.value}
              onClick={() => setDestination(d.value)}
              className={`min-h-12 rounded-xl border px-4 text-[15px] font-semibold transition-colors ${
                destination === d.value ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-ink"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        {destination === "bundle" && (
          <p className="mt-3 text-sm text-mute">The bundle gives you two separate links. Write each one to its own NFC tag. They are never combined.</p>
        )}
      </section>

      {/* 2. Google business */}
      {showGoogle && (
        <section className={card} aria-labelledby="google-h">
          <h2 id="google-h" className="text-lg font-semibold">2. Find the business (Google)</h2>

          {!API_KEY && (
            <div role="status" className="mt-4 rounded-xl border border-brand/40 bg-brand-soft p-4 text-sm text-ink">
              <p className="font-semibold">Live business search isn't set up yet.</p>
              <p className="mt-1">
                Add <code className="rounded bg-white/70 px-1 py-0.5 text-xs text-ink">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in Vercel (or <code className="rounded bg-white/70 px-1 py-0.5 text-xs text-ink">.env.local</code>) and redeploy. See docs/NFC_LINK_GENERATOR_SETUP.md. Until then, use “Enter Place ID manually” below.
              </p>
            </div>
          )}

          <div
            className="relative mt-4"
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}
          >
            <Field id="biz-search" label="Business search">
              <input
                ref={inputRef}
                id="biz-search"
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                autoComplete="off"
                disabled={!API_KEY}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => { if (status !== "idle") setOpen(true); }}
                placeholder="Search café, restaurant, salon, or business..."
                className={`${inputClass()} text-lg disabled:bg-paper`}
              />
            </Field>
            {API_KEY && !selected && status === "idle" && !selecting && (
              <p className="mt-1.5 text-sm text-mute">Try “Coffee Project Angeles City” or a street address. Pick the exact branch from the list.</p>
            )}
            {selecting && <p role="status" className="mt-1.5 text-sm text-mute">Getting the Place ID…</p>}
            {selectError && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{selectError}</p>}

            {open && (
              <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl border border-line bg-white shadow-lift">
                {status === "loading" && <p role="status" className="px-4 py-3 text-sm text-mute">Searching…</p>}
                {status === "empty" && <p role="status" className="px-4 py-3 text-sm text-mute">No matching businesses. Try the business name plus the city, or an address.</p>}
                {status === "error" && <p role="alert" className="px-4 py-3 text-sm font-medium text-red-700">{searchError}</p>}
                {status === "results" && (
                  <ul id={listId} role="listbox" aria-label="Matching businesses" className="max-h-80 divide-y divide-line overflow-auto">
                    {suggestions.map((s, i) => (
                      <li
                        key={s.placeId}
                        id={`${listId}-${i}`}
                        role="option"
                        aria-selected={i === active}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => void choose(s)}
                        className={`cursor-pointer px-4 py-3 ${i === active ? "bg-brand-soft" : "hover:bg-paper"}`}
                      >
                        <span className="block font-medium text-ink">{s.main}</span>
                        {s.secondary && <span className="block text-sm text-mute">{s.secondary}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {status === "results" && <p className="border-t border-line px-4 py-2 text-xs text-mute">Powered by Google</p>}
              </div>
            )}
          </div>

          {selected && (
            <div className="mt-4 rounded-xl border-2 border-brand bg-brand-soft p-4" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Selected business</p>
              <p className="mt-1 text-lg font-semibold text-ink">{selected.name}</p>
              {selected.address && <p className="text-sm text-ink/70">{selected.address}</p>}
              <p className="mt-2 text-sm text-ink/70">Place ID</p>
              <p className="break-all font-mono text-sm text-ink">{selected.placeId}</p>
            </div>
          )}

          <details
            className="mt-5 rounded-xl border border-line p-4"
            open={manualOpen}
            onToggle={(e) => setManualOpen(e.currentTarget.open)}
          >
            <summary className="cursor-pointer text-[15px] font-semibold text-ink">Enter Place ID manually</summary>
            <div className="mt-4">
              <Field
                id="manual-place-id"
                label="Place ID"
                help="Use this if search is unavailable. The Place ID usually starts with ChIJ. Pasted Google Maps links can't be used because they don't reliably contain the Place ID."
                error={manualCheck && !manualCheck.ok ? manualCheck.error : undefined}
              >
                <input
                  id="manual-place-id"
                  type="text"
                  value={manualId}
                  onChange={(e) => onManualChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="ChIJ…"
                  aria-invalid={manualCheck ? !manualCheck.ok : undefined}
                  className={`${inputClass(manualCheck ? !manualCheck.ok : false)} font-mono`}
                />
              </Field>
            </div>
          </details>
        </section>
      )}

      {/* 3. Facebook */}
      {showFacebook && (
        <section className={card} aria-labelledby="fb-h">
          <h2 id="fb-h" className="text-lg font-semibold">{showGoogle ? "3" : "2"}. Facebook Page</h2>
          <div className="mt-4 space-y-4">
            <Field
              id="fb-url"
              label="Paste the client's Facebook Page URL"
              help="Example: https://www.facebook.com/examplebusiness"
              error={fbNorm && !fbNorm.ok ? fbNorm.error : undefined}
            >
              <input
                id="fb-url"
                type="url"
                inputMode="url"
                value={fbInput}
                onChange={(e) => setFbInput(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="https://www.facebook.com/examplebusiness"
                aria-invalid={fbNorm ? !fbNorm.ok : undefined}
                className={inputClass(fbNorm ? !fbNorm.ok : false)}
              />
            </Field>
            {fbNorm?.ok && !fbOverride.trim() && (
              <p className="text-sm text-mute">
                Proposed destination: the Page's <span className="font-mono">/reviews</span> address. Not every Page has reviews switched on, so open the link and check it before writing the tag.
              </p>
            )}
            <Field
              id="fb-override"
              label="Exact review URL override"
              optional
              help="If the proposed link is wrong, paste the exact reviews or recommendations URL here. It replaces the proposed one."
              error={fbOv && !fbOv.ok ? fbOv.error : undefined}
            >
              <input
                id="fb-override"
                type="url"
                inputMode="url"
                value={fbOverride}
                onChange={(e) => setFbOverride(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="https://www.facebook.com/…"
                aria-invalid={fbOv ? !fbOv.ok : undefined}
                className={inputClass(fbOv ? !fbOv.ok : false)}
              />
            </Field>
          </div>
        </section>
      )}

      {/* Ready to write */}
      <section className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card sm:p-6" aria-labelledby="ready-h">
        <h2 id="ready-h" className="text-xl font-bold">Ready to Write to NFC</h2>
        <div className="mt-4 space-y-5">
          {items.map((item, idx) => (
            <div key={item.key} className={idx > 0 ? "border-t border-line pt-5" : ""}>
              <p className="text-sm font-semibold text-ink">
                {destination === "bundle" ? `Tag ${idx + 1}: ` : "Destination: "}{item.label}
              </p>
              {item.business && <p className="text-sm text-mute">Business: {item.business}</p>}
              {item.url ? (
                <>
                  <label htmlFor={`final-${item.key}`} className="sr-only">{item.label} URL</label>
                  <input
                    id={`final-${item.key}`}
                    readOnly
                    value={item.url}
                    onFocus={(e) => e.currentTarget.select()}
                    className={`${inputClass()} mt-2 font-mono text-sm`}
                  />
                  <p className="mt-1.5 text-sm text-mute">{item.source}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button type="button" onClick={() => void copy(item.key, item.url!)}>
                      {copied === item.key ? "Copied" : destination === "bundle" ? `Copy ${item.label} Link` : "Copy Link"}
                    </Button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/20 px-6 text-[15px] font-semibold text-ink transition-colors hover:border-ink hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      Open / Test Link
                    </a>
                  </div>
                </>
              ) : (
                <p className="mt-2 rounded-xl bg-paper p-4 text-sm text-mute">{item.hint}</p>
              )}
            </div>
          ))}
        </div>

        {bothReady && (
          <div className="mt-5 border-t border-line pt-5">
            <Button type="button" variant="dark" onClick={() => void copy("both", formatBothLinks(googleUrl!, facebook!.url))}>
              {copied === "both" ? "Copied both" : "Copy Both Links"}
            </Button>
            <p className="mt-2 text-sm text-mute">Copies two labeled lines. Write each URL to its own tag, never both on one tag.</p>
          </div>
        )}

        {copyFailed && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-700">
            Your browser blocked automatic copying. Tap the link box above to select it, then copy it manually.
          </p>
        )}

        <div className="mt-6 rounded-xl bg-paper p-4">
          <h3 className="text-sm font-semibold text-ink">Write it with NFC Tools</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink/70">
            <li>Copy the final URL.</li>
            <li>Open NFC Tools on the phone.</li>
            <li>Select Write.</li>
            <li>Choose Add a record.</li>
            <li>Select URL / URI.</li>
            <li>Paste the copied URL.</li>
            <li>Select Write and hold the NFC tag to the phone.</li>
            <li>Test the tag with a phone before delivering it.</li>
          </ol>
          <p className="mt-3 text-sm text-mute">This page only generates and copies links. It does not program NFC tags, and copying does not write anything to a tag.</p>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}
