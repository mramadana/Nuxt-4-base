import { useToast } from "primevue/usetoast";

export default function toastMsg() {
  const nuxtApp = useNuxtApp();
  const getToast = () => nuxtApp.vueApp?.config?.globalProperties?.$toast || null;

  const toast = getToast();
  const addToast = (options) => {
    if (toast?.add) {
      toast.add(options);
    }
  };

  // successToast
  const successToast = (msg) => {
    addToast({ severity: "success", summary: msg, life: 3500 });
  };

  // errorToast
  const errorToast = (msg) => {
    addToast({ severity: "error", summary: msg, life: 3500 });
  };

  const customToast = (msg, type, time, msgDesc) => {
    addToast({ severity: `${type}`, summary: msg, detail: msgDesc, life: time || 4000 });
  };

  return { successToast, errorToast, customToast };
}
