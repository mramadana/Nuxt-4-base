<template>
  <div>
    <div
      class="product-card w-full products-grid"
      v-if="!productsStore.isLoading && productsStore.products.length"
    >
      <div class="card-box" v-for="product in productsStore.products" :key="product.id">
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div class="d-flex align-items-start gap-2 flex-grow-1">
            <div class="img-product">
              <img :src="product.image" alt="product" />
            </div>

            <div class="flex-grow-1">
              <h4 class="mb-1">{{ product.title }}</h4>

              <p class="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span
                  v-if="product.price_after_discount && product.price_after_discount !== '0'"
                  class="price-discounted"
                >
                  {{ product.price_after_discount }} {{ currencyLabel }}
                </span>
                <span
                  :class="
                    product.price_after_discount && product.price_after_discount !== '0'
                      ? 'price-original'
                      : ''
                  "
                >
                  {{ product.price }} {{ currencyLabel }}
                </span>
              </p>

              <p class="d-flex align-items-center gap-2 mb-0 rate-line">
                <i class="fa-solid fa-star"></i>
                <span>{{ product.avg_rate }}</span>
              </p>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <span class="font-base text-sm">{{ hideLabel }}</span>
            <label class="switch">
              <input
                type="checkbox"
                :checked="!!product.is_available"
                @change="handleToggle(product)"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-center gap-2 actions">
          <button
            type="button"
            class="custom-btn action-btn"
            @click="editProduct(product.id)"
          >
            <i class="fa-solid fa-pen"></i>
            <span>{{ editLabel }}</span>
          </button>

          <button
            type="button"
            class="custom-btn action-btn delete-btn"
            @click="openDeleteModal(product.id)"
          >
            <i class="fa-solid fa-trash"></i>
            <span>{{ deleteLabel }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="productsStore.isLoading" class="text-center py-4">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </div>

    <div v-if="!productsStore.isLoading && !productsStore.products.length" class="text-center py-4">
      <p class="mb-0">{{ emptyProductsLabel }}</p>
    </div>

    <Dialog v-model:visible="showModal" modal class="custum_dialog_width" :draggable="false">
      <div>
        <h4 class="text-center text-2xl font-bold font-base mb-4 mt-2">
          {{ deleteConfirmLabel }}
        </h4>
        <div class="d-flex align-items-center justify-content-center gap-2">
          <button
            type="button"
            class="custom-btn delete-btn"
            :disabled="deletingProduct"
            @click="confirmDelete"
          >
            {{ deleteButtonLabel }}
            <span
              class="spinner-border spinner-border-sm ms-1"
              v-if="deletingProduct"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
          <button
            type="button"
            class="custom-btn cancel-btn"
            :disabled="deletingProduct"
            @click="showModal = false"
          >
            {{ backLabel }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const productsStore = useProductsStore();
const { successToast, errorToast } = toastMsg();

const showModal = ref(false);
const selectedProductId = ref(null);
const deletingProduct = ref(false);

const getText = (key, fallback) => {
  const value = t(key);
  return value === key ? fallback : value;
};

const currencyLabel = computed(() => getText("Global.Rs", "SAR"));
const hideLabel = computed(() => getText("products.hide", "Hide"));
const editLabel = computed(() => getText("products.editProduct", "Edit Product"));
const deleteLabel = computed(() => getText("products.deleteProduct", "Delete Product"));
const deleteConfirmLabel = computed(() => getText("products.deleteProductConfirmation", "Are you sure you want to delete this product?"));
const deleteButtonLabel = computed(() => getText("buttons.delete", "Delete"));
const backLabel = computed(() => getText("buttons.back", "Back"));
const emptyProductsLabel = computed(() => getText("products.no_products", "No products yet"));

onMounted(async () => {
  await productsStore.getProducts();
});

const editProduct = (id) => {
  router.push(
    { path: "/products/form", query: { action: "edit", id } }
  );
};

const openDeleteModal = (id) => {
  selectedProductId.value = id;
  showModal.value = true;
};

const confirmDelete = async () => {
  if (deletingProduct.value || !selectedProductId.value) return;

  try {
    deletingProduct.value = true;
    const axios = useApi();
    const authStore = useAuthStore();

    const response = await axios.delete(`provider/products/${selectedProductId.value}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    if (response.data?.key === "success") {
      successToast(response.data?.msg || "Deleted successfully");
      showModal.value = false;
      await productsStore.getProducts(productsStore.currentPage || 1);
    } else {
      errorToast(response.data?.msg || "Delete failed");
    }
  } catch (error) {
    console.error("Delete product error:", error);
    errorToast(error.response?.data?.msg || "Delete failed");
  } finally {
    deletingProduct.value = false;
  }
};

const handleToggle = async (product) => {
  const result = await productsStore.toggleStatus(product.id);
  if (result.status === "success") {
    successToast(result.msg);
    return;
  }

  errorToast(result.msg);
};
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 550px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.price-discounted {
  color: #3b82f6;
}

.price-original {
  color: #9ca3af;
  text-decoration: line-through;
}

.rate-line i {
  color: #f4b400;
}

.action-btn {
  width: auto;
  min-height: 40px;
  padding-inline: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.delete-btn {
  background-color: #dc3545;
  border-color: #dc3545;
}

.cancel-btn {
  background-color: #fff;
  color: var(--main);
  border: 1px solid var(--main);
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: 0.2s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  top: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #34c759;
}

.switch input:checked + .slider:before {
  transform: translateX(20px);
}
</style>
