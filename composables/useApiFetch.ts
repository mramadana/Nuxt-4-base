// @ts-nocheck
import { computed, ref } from "vue";
import { useAuthStore } from "~/stores/auth";

export function useFetchAPI() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
  const { $i18n } = useNuxtApp();
  const authStore = useAuthStore();
  const { showError } = usePrimeToast();

  const getCurrentLocale = () => {
    if ($i18n?.locale?.value) return $i18n.locale.value;

    const langCookie = useCookie("lang");
    if (langCookie.value) return langCookie.value;

    if (process.client) {
      return localStorage.getItem("locale") || "ar";
    }

    return "ar";
  };

  const translate = (key, fallback) => {
    if ($i18n?.t) {
      const translated = $i18n.t(key);
      if (translated && translated !== key) return translated;
    }

    return fallback || key;
  };

  const getAuthCookie = () => {
    const authCookie = useCookie("auth");
    const rawAuth = authCookie.value;

    if (!rawAuth) return null;

    if (typeof rawAuth === "string") {
      try {
        return JSON.parse(rawAuth);
      } catch {
        return null;
      }
    }

    return rawAuth;
  };

  // Build fetch options
  const createFetchOptions = (options = {}) => {
    const token = getAuthCookie()?.token || authStore.token;

    const method = (options.method || "GET").toUpperCase();
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const currentLocale = getCurrentLocale();
    console.log("🌐 Current locale in useFetchAPI:", currentLocale);

    // Start with safe defaults
    const headers = {
      Accept: "application/json",
      Lang: currentLocale,

      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Spread remaining options but fix critical fields after
    const fetchOptions = {
      ...options,
      baseURL: baseURL,
      method,
      headers,
      responseType: "json",
    };

    // Never send a body with GET/HEAD
    if (method !== "GET" && method !== "HEAD" && options.body !== undefined) {
      fetchOptions.body = options.body;
    }

    // Ensure headers/baseURL are not overridden by spread
    fetchOptions.headers = headers;
    fetchOptions.baseURL = baseURL;

    return fetchOptions;
  };

  // useFetch wrapper
  const useFetchRunner = async (url, options = {}) => {
    const fetchOptions = createFetchOptions(options);
    const fullUrl = url.startsWith("http")
      ? url
      : `${baseURL.replace(/\/$/, "")}/${String(url).replace(/^\/+/, "")}`;

    const { data, pending, error, status, refresh } = await useFetch(fullUrl, {
      ...fetchOptions,
      baseURL: undefined,
    });

    const isUnauthenticated =
      data.value?.key === "unauthenticated" ||
      data.value?.data?.key === "unauthenticated" ||
      data.value?.status === "unauthenticated" ||
      data.value?.data?.status === "unauthenticated" ||
      data.value?.message === "unauthenticated" ||
      data.value?.data?.message === "unauthenticated" ||
      data.value?.error === "unauthenticated" ||
      data.value?.data?.error === "unauthenticated";

    const isBlocked =
      data.value?.key === "blocked" ||
      data.value?.data?.key === "blocked";

    if (isUnauthenticated) {
      authStore.removeAuth();
      await navigateTo("/");
    }

    if (isBlocked) {
      showError(
        data.value?.msg ||
          data.value?.data?.msg ||
          "تم حظر حسابك من قبل الاداره",
      );
      authStore.removeAuth();
      if (getCurrentLocale() === "ar") {
        await navigateTo("/");
      } else {
        await navigateTo("/en");
      }
    }

    return { data, error, loading: pending, status, refresh };
  };

  // $fetch wrapper
  const $fetchAPI = async (url, options = {}) => {
    const loading = ref(true);

    try {
      const fetchOptions = createFetchOptions(options);
      const fullUrl = url.startsWith("https")
        ? url
        : `${baseURL.replace(/\/$/, "")}${url}`;
      const data = await $fetch(fullUrl, {
        ...fetchOptions,
        baseURL: undefined,
      });

      const isUnauthenticated =
        data?.key === "unauthenticated" ||
        data?.data?.key === "unauthenticated";
      if (isUnauthenticated) {
        authStore.removeAuth();
        await navigateTo(getCurrentLocale() === "ar" ? "/" : "/en");
        return {
          data: null,
          error: translate("errors.authentication_required", "Authentication required"),
          loading,
        };
      }

      const isBlocked =
        data?.key === "blocked" ||
        data?.data?.key === "blocked";

      if (isBlocked) {
        showError(
          data?.msg ||
            data?.data?.msg ||
            translate("errors.account_blocked", "Account blocked"),
        );
        authStore.removeAuth();
        await navigateTo(getCurrentLocale() === "ar" ? "/" : "/en");
        return { data: null, error: "Account blocked", loading };
      }

      return { data, error: null, loading };
    } catch (error) {
      const isAuthError =
        error?.status === 401 ||
        error?.statusCode === 401 ||
        error?.status === 403 ||
        error?.statusCode === 403 ||
        error?.data?.key === "unauthenticated" ||
        error?.data?.key === "unauthorized" ||
        error?.message?.toLowerCase().includes("unauthenticated") ||
        error?.message?.toLowerCase().includes("unauthorized");

      if (isAuthError) {
        showError(
          error?.data?.msg ||
            error?.data?.message ||
            error?.message ||
            "حدث خطأ غير متوقع",
        );
        authStore.removeAuth();
        await navigateTo(getCurrentLocale() === "ar" ? "/" : "/en");
        return {
          data: null,
          error: translate("errors.authentication_required", "Authentication required"),
          loading,
        };
      }

      const isBlockedError =
        error?.data?.key === "blocked" ||
        error?.data?.msg?.toLowerCase().includes("حظر") ||
        error?.data?.message?.toLowerCase().includes("blocked");

      if (isBlockedError) {
        showError(error?.data?.msg || error?.data?.message);
        authStore.removeAuth();
        await navigateTo(getCurrentLocale() === "ar" ? "/" : "/en");
        return { data: null, error: "Account blocked", loading };
      }

      let errorMessage = "حدث خطأ غير متوقع";
      if (error?.data?.msg) errorMessage = error.data.msg;
      else if (error?.data?.message) errorMessage = error.data.message;
      else if (error?.message) errorMessage = error.message;

      return { data: null, error: errorMessage, loading };
    } finally {
      loading.value = false;
    }
  };

  // useAsyncData wrapper
  const useAsyncDataAPI = (key, url, options = {}) => {
    const fetchOptions = createFetchOptions(options);
    const fullUrl = url.startsWith("http")
      ? url
      : `${baseURL.replace(/\/$/, "")}/${String(url).replace(/^\/+/, "")}`;

    return useAsyncData(
      key,
      () =>
        $fetch(fullUrl, {
          ...fetchOptions,
          baseURL: undefined,
        }),
      {
        default: () => null,
        watch: options.watch || [],
        server: options.server !== false,
        lazy: options.lazy || false,
        transform: options.transform,
      },
    );
  };

  // dynamic selector
  const fetchAPI = async (
    url,
    options = {},
    type = "$fetch",
  ) => {
    if (type === "useFetch") return useFetchRunner(url, options);
    if (type === "useAsyncData")
      return useAsyncDataAPI("api-" + url, url, options);
    return await $fetchAPI(url, options);
  };

  return {
    fetchAPI,
    useFetchAPI: useFetchRunner,
    $fetchAPI,
    useAsyncDataAPI,
  };
}

export const useApiFetch = async (path, options = {}) => {
  const fetchHelpers = useFetchAPI();
  return await fetchHelpers.useFetchAPI(path, options);
};

export const useApiData = async (path, options = {}) => {
  const asyncData = await useApiFetch(path, options);

  const payload = computed(() => asyncData.data.value?.data ?? null);
  const statusKey = computed(() => asyncData.data.value?.key ?? null);
  const message = computed(() => asyncData.data.value?.msg ?? "");
  const isSuccess = computed(() => statusKey.value === "success");

  return {
    ...asyncData,
    payload,
    statusKey,
    message,
    isSuccess,
  };
};

export const useApiMutation = () => {
  const fetchHelpers = useFetchAPI();

  return async (path, options = {}) => {
    const result = await fetchHelpers.$fetchAPI(path, options);

    if (result.data) {
      return result.data;
    }

    return {
      key: "error",
      msg: result.error || "حدث خطأ غير متوقع",
    };
  };
};
