export const useSeo = () => {
  const seoState = useState("seo-data", () => []);
  const isSeoDataLoaded = useState("seo-loaded", () => false);
  const isSeoDataLoading = useState("seo-loading", () => false);
  const cloneSeoData = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => ({ ...item }));
  };

  const getSeoData = async () => {
    if (isSeoDataLoaded.value || isSeoDataLoading.value) {
      return { status: "success", data: seoState.value };
    }

    isSeoDataLoading.value = true;

    try {
      const { data, payload, statusKey, message } = await useApiData("seos", {
        cacheKey: "api:seos",
      });

      if (statusKey.value === "success") {
        seoState.value = cloneSeoData(payload.value || data.value?.data || []);
        isSeoDataLoaded.value = true;
        return { status: "success", data: seoState.value };
      }

      return { status: "error", msg: message.value || "Failed to load SEO data" };
    } catch (error) {
      console.error("Error fetching SEO data:", error);
      return { status: "error", msg: error?.message || "Failed to load SEO data" };
    } finally {
      isSeoDataLoading.value = false;
    }
  };

  const checkSeoKey = (key) => {
    if (!isSeoDataLoaded.value) return false;
    return seoState.value.find((item) => item.key === key) || false;
  };

  return {
    getSeoData,
    checkSeoKey,
    seoState,
    isSeoDataLoaded,
  };
};
