import { defineStore } from "pinia";

// Axios
const axios = useApi();

// success response
const { response } = responseApi();

export const useGlobalStore = defineStore("global", {
  state: () => ({
    testRef: "koooooook",
    isSeoDataLoading: false,
    isSeoDataLoaded: false,
    SeoData: useCookie("SeoData") || [],
  }),
  actions: {
    // async theSeo() {
    //   if (this.isSeoDataLoaded || this.isSeoDataLoading) {
    //     return { status: "success", data: this.SeoData };
    //   }

    //   try {
    //     this.isSeoDataLoading = true;
    //     const { response } = responseApi();
    //     const axios = useApi();

    //     const res = await axios.get('seos');
    //     if (response(res) === "success") {
    //       this.SeoData = res.data.data;
    //       sessionStorage.setItem("SeoData", JSON.stringify(this.SeoData));
    //       this.isSeoDataLoaded = true;
    //     } else {
    //       console.error("Failed to fetch social data:", res.data.msg);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching social data:", error.message);
    //   } finally {
    //     this.isSeoDataLoading = false;
    //   }
    // },
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: "strict",
    }),
  },
});
