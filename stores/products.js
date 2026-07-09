import { defineStore } from "pinia";

const axios = useApi();

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    pagination: null,
    isLoading: false,
    currentPage: 1,
  }),

  actions: {
    // ======= جلب قائمة المنتجات =======
    async getProducts(page = 1) {
      this.isLoading = true;
      try {
        const authStore = useAuthStore();
        const res = await axios.get("provider/products/index", {
          headers: { Authorization: `Bearer ${authStore.token}` },
          params: { page },
        });

        if (res.data.key === "success") {
          this.products = res.data.data.data;
          this.pagination = res.data.data.pagination;
          this.currentPage = page;
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getProducts error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      } finally {
        this.isLoading = false;
      }
    },

    // ======= إضافة منتج =======
    async addProduct(formData) {
      try {
        const authStore = useAuthStore();
        const res = await axios.post("provider/products/store", formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg, data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("addProduct error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ أثناء إضافة المنتج" };
      }
    },

    // ======= تعديل منتج =======
    async updateProduct(id, formData) {
      try {
        const authStore = useAuthStore();
        const res = await axios.post(
          `provider/products/update/${id}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("updateProduct error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ أثناء تعديل المنتج" };
      }
    },

    // ======= تبديل حالة التوفر =======
    async toggleStatus(id) {
      try {
        const authStore = useAuthStore();
        const formData = new FormData();
        formData.append("product_id", id);

        const res = await axios.post(
          "provider/products/toggle-status?_method=PATCH",
          formData,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          const product = this.products.find((p) => p.id === id);
          if (product) product.is_available = !product.is_available;
          return { status: "success", msg: res.data.msg };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("toggleStatus error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب جميع السمات =======
    async getAllFeatures() {
      try {
        const authStore = useAuthStore();
        const res = await axios.get(
          `provider/features`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getAllFeatures error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب خيارات سمة معينة =======
    async getFeatureOptionsById(featureId) {
      try {
        const authStore = useAuthStore();
        const res = await axios.get(
          `provider/feature/${featureId}/options`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getFeatureOptionsById error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب السمات والخيارات لمنتج معين =======
    async getProductFeaturesOptions(productId) {
      try {
        const authStore = useAuthStore();
        const res = await axios.get(
          `provider/products/get-features-options/${productId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getProductFeaturesOptions error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= إضافة متغير للمنتج =======
    async addProductVariant(productId, formData) {
      try {
        const authStore = useAuthStore();
        const res = await axios.post(
          `provider/products/add-variant/${productId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg, data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("addProductVariant error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= تحديث متغير المنتج =======
    async updateProductVariant(variantId, formData) {
      try {
        const authStore = useAuthStore();
        const res = await axios.post(
          `provider/products/update-variant/${variantId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg, data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("updateProductVariant error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب تفاصيل متغير المنتج =======
    async getVariantDetails(variantId) {
      try {
        const authStore = useAuthStore();
        const res = await axios.get(
          `provider/products/show-variant/${variantId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getVariantDetails error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب قائمة متغيرات المنتج =======
    async getProductVariants(productId) {
      try {
        const authStore = useAuthStore();
        const res = await axios.get(
          `provider/products/get-product-variants/${productId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getProductVariants error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب الأقسام الرئيسية =======
    async getMainCategories() {
      try {
        const res = await axios.get("main-categories-with-limit");
        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getMainCategories error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= جلب الأقسام الفرعية =======
    async getSubCategories(id) {
      try {
        const res = await axios.get(`categories/${id}`);
        if (res.data.key === "success") {
          return { status: "success", data: res.data.data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getSubCategories error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },
    // ======= Get base products =======
    async getBaseProducts() {
      try {
        const res = await axios.get("base-products");
        if (res.data.key === "success") {
          const data = Array.isArray(res.data.data)
            ? res.data.data.map((product) => ({ id: product.id, name: product.title }))
            : [];
          return { status: "success", data };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("getBaseProducts error:", error);
        return { status: "error", msg: error.response?.data?.msg || "Ø­Ø¯Ø« Ø®Ø·Ø£" };
      }
    },

    // ======= Set default variant =======
    async setVariantAsDefault(id) {
      try {
        const authStore = useAuthStore();
        const res = await axios.post(
          `provider/products/change-variant-is-default/${id}?_method=PATCH`,
          {},
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("setVariantAsDefault error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= حذف صورة متغير =======
    async deleteVariantImage(variantId, imageId) {
      try {
        const authStore = useAuthStore();
        const res = await axios.delete(
          `provider/products/delete-image/${variantId}/${imageId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("deleteVariantImage error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },

    // ======= حذف متغير المنتج =======
    async deleteProductVariant(variantId) {
      try {
        const authStore = useAuthStore();
        const res = await axios.delete(
          `provider/products/delete-variant/${variantId}`,
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (res.data.key === "success") {
          return { status: "success", msg: res.data.msg };
        } else {
          return { status: "error", msg: res.data.msg };
        }
      } catch (error) {
        console.error("deleteProductVariant error:", error);
        return { status: "error", msg: error.response?.data?.msg || "حدث خطأ" };
      }
    },
  },
});
