import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

type LoadedGoogleMaps = {
  Map: any;
  Marker: any;
  Autocomplete: any;
  Geocoder: any;
};

let loaderConfigured = false;
let configuredKey = "";
let configuredLanguage = "";
let warnedReconfigure = false;
let librariesPromise: Promise<LoadedGoogleMaps> | null = null;

export const useGoogleMapsLoader = () => {
  const config = useRuntimeConfig();

  const loadGoogleMaps = async (language = "ar") => {
    if (import.meta.server) return null;

    const key = String(
      config.public.googleMapsKey || config.public.googleMapsApiKey || ""
    );
    const normalizedLanguage =
      typeof language === "string" && language ? language : "ar";

    if (!key) return null;

    if (!loaderConfigured) {
      setOptions({
        key,
        language: normalizedLanguage,
        libraries: ["places"],
        v: "weekly",
      });

      configuredKey = key;
      configuredLanguage = normalizedLanguage;
      loaderConfigured = true;
    } else if (
      !warnedReconfigure &&
      (configuredKey !== key || configuredLanguage !== normalizedLanguage)
    ) {
      console.warn(
        "Google Maps loader is already initialized; reusing the first key/language configuration."
      );
      warnedReconfigure = true;
    }

    if (!librariesPromise) {
      librariesPromise = Promise.all([
        importLibrary("maps"),
        importLibrary("marker"),
        importLibrary("places"),
        importLibrary("geocoding"),
      ]).then(([mapsLib, markerLib, placesLib, geocodingLib]: any[]) => ({
        Map: mapsLib.Map,
        Marker: markerLib.Marker,
        Autocomplete: placesLib.Autocomplete,
        Geocoder: geocodingLib.Geocoder,
      }));
    }

    return librariesPromise;
  };

  return { loadGoogleMaps };
};
