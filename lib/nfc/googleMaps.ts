/**
 * Browser-only loader for the Google Maps JavaScript API "places" library, using the current
 * Autocomplete Data API (AutocompleteSuggestion + Place.fetchFields from Places API (New)).
 * Loaded lazily, only on the NFC Link Generator page. Minimal local types avoid an extra dependency.
 */

export interface PlaceLike {
  id?: string | null;
  displayName?: string | null;
  formattedAddress?: string | null;
  fetchFields(options: { fields: string[] }): Promise<unknown>;
}
export interface PlacePrediction {
  placeId: string;
  text: { text: string };
  mainText?: { text: string } | null;
  secondaryText?: { text: string } | null;
  toPlace(): PlaceLike;
}
export interface PlacesLibrary {
  AutocompleteSessionToken: new () => unknown;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string;
      sessionToken?: unknown;
      region?: string;
      language?: string;
    }): Promise<{ suggestions: { placePrediction: PlacePrediction | null }[] }>;
  };
}

interface GoogleWindow extends Window {
  google?: { maps?: { importLibrary?: (name: string) => Promise<unknown> } };
  gm_authFailure?: () => void;
}

let loading: Promise<PlacesLibrary> | null = null;
const authFailureListeners = new Set<() => void>();

/** Google calls window.gm_authFailure when the key is rejected (bad key, referrer, billing...). */
export function onMapsAuthFailure(listener: () => void): () => void {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

export function loadPlacesLibrary(apiKey: string): Promise<PlacesLibrary> {
  if (loading) return loading;
  const w = window as GoogleWindow;
  loading = new Promise<PlacesLibrary>((resolve, reject) => {
    const finish = async () => {
      try {
        const importLibrary = w.google?.maps?.importLibrary;
        if (!importLibrary) throw new Error("Google Maps loaded without importLibrary.");
        resolve((await importLibrary("places")) as PlacesLibrary);
      } catch (error) {
        loading = null;
        reject(error);
      }
    };
    if (w.google?.maps?.importLibrary) {
      void finish();
      return;
    }
    w.gm_authFailure = () => authFailureListeners.forEach((fn) => fn());
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&v=weekly`;
    script.async = true;
    script.onload = () => void finish();
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("The Google Maps script could not be loaded. Check your connection or ad blocker."));
    };
    document.head.appendChild(script);
  });
  return loading;
}
