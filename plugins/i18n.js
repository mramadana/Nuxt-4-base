import { createI18n } from "vue-i18n";
import ar from "~/locales/ar.json";
import en from "~/locales/en.json";

export default defineNuxtPlugin(({ vueApp }) => {
    // const myAppLang = process.server ? 'ar' : localStorage.getItem('locale') || "ar";
    const myAppLang = useCookie('lang') || "ar";
    const i18n = createI18n({
      legacy: false,
      globalInjection: true,
      langDir: "locales",
      // locale: myAppLang,
      locale: `${myAppLang.value || "ar"}`,
      messages: {
        en: en,
        ar: ar,
      },
    });
  
    vueApp.use(i18n);
    
  });
  
