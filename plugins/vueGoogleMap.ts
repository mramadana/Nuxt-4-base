import { defineNuxtPlugin } from "#app";
import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: config.public.googleMapsKey,
      libraries: "places", // This is required if you use the Autocomplete plugin
    },
  });
});
