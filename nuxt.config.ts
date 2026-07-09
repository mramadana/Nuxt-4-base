export default defineNuxtConfig({

  devtools: { enabled: false },

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
          children: `
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
          defer: true,
        },
      ],
    },
  },


  css: [
    "bootstrap/dist/css/bootstrap.rtl.css",
    "primevue/resources/themes/lara-light-green/theme.css",
    "primevue/resources/primevue.min.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
    "~/assets/css/style.scss",
  ],

  // primevue
  modules: [
    'nuxt-primevue',
    "@pinia/nuxt",
    '@pinia-plugin-persistedstate/nuxt',
  ],

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },

  build: {
    transpile: ["@fawmi/vue-google-maps"],
  },


})


