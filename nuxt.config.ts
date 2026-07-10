import Lara from "@primeuix/themes/lara";

export default defineNuxtConfig({

  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      googleMapsKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_KEY || "AIzaSyBNLoYGrbnQI_GMqHt6m0PSN9yA7Zvq7gA",
    },
  },

  app: {
    pageTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: "اوشــاك، لقطع غيار الشاحنات",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "ar", class: "html_direction" },
      meta: [
        { name: "description", content: "اوشــاك، لقطع غيار الشاحنات" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/logo.svg" },
      ],
      script: [
        {
          innerHTML: `
            (function () {
              const savedLang = localStorage.getItem("locale") || "ar";
              const html = document.documentElement;
              html.lang = savedLang;
              html.dir = savedLang === "ar" ? "rtl" : "ltr";
              window.__NUXT_LANG__ = savedLang;
              window.__NUXT_TEXTS__ = { ar: "العربية", en: "English" };
            })();
          `,
          type: "text/javascript",
        },
      ],
    },
  },


  css: [
    "bootstrap/dist/css/bootstrap.rtl.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
    "~/assets/css/style.scss",
  ],

  // primevue
  modules: [
    '@primevue/nuxt-module',
    "@pinia/nuxt",
    '@pinia-plugin-persistedstate/nuxt',
  ],

  primevue: {
    options: {
      theme: {
        preset: Lara,
        options: {
          prefix: "p",
          darkModeSelector: false,
          cssLayer: false,
        },
      },
    },
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
})


