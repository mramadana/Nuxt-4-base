<template>
  <div v-if="isOpen" class="variant-popup-overlay" @click.self="closePopup">
    <div class="variant-popup">
      <button type="button" class="variant-popup-close" @click="closePopup">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <h2 class="variant-popup-title">{{ titleLabel }}</h2>

      <div v-if="isLoading" class="variant-popup-loader">
        <span class="spinner-border" role="status" aria-hidden="true"></span>
      </div>

      <div v-else-if="variants.length" class="variant-popup-list">
        <label
          v-for="variant in variants"
          :key="variant.id"
          class="variant-popup-item"
          :class="{ active: selectedVariantId === variant.id }"
        >
          <input
            v-model="selectedVariantId"
            type="radio"
            class="variant-popup-radio-input"
            :value="variant.id"
          />
          <span class="variant-popup-radio"></span>

          <span class="variant-popup-image">
            <img v-if="variant.image" :src="variant.image" alt="variant" />
          </span>

          <span class="variant-popup-name">{{ variant.productTitle }}</span>
          <span class="variant-popup-price">{{ variant.price }} {{ currencyLabel }}</span>

          <span class="variant-popup-options">
            <span v-for="option in variant.options" :key="option" class="variant-popup-option">
              {{ option }}
            </span>
          </span>
        </label>
      </div>

      <div v-else class="variant-popup-empty">
        {{ noDataLabel }}
      </div>

      <button
        type="button"
        class="variant-popup-confirm"
        :disabled="!selectedVariantId || isSubmitting"
        @click="confirmSelection"
      >
        <span v-if="!isSubmitting">{{ confirmLabel }}</span>
        <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["close"]);

const productsStore = useProductsStore();
const { errorToast, successToast } = toastMsg();
const router = useRouter();

const isOpen = ref(true);
const isLoading = ref(false);
const isSubmitting = ref(false);
const variants = ref([]);
const selectedVariantId = ref(null);

const titleLabel = computed(() => "اختر منتج العرض الرئيسي");
const confirmLabel = computed(() => "تأكيد");
const loadingErrorLabel = computed(() => "فشل تحميل بيانات المتغيرات");
const successLabel = computed(() => "تم تعيين المنتج كافتراضي بنجاح");
const submitErrorLabel = computed(() => "فشل التعيين كافتراضي");
const noDataLabel = computed(() => "لا توجد بيانات متاحة");
const currencyLabel = computed(() => "ر.س");

const getVariantsFromResponse = (data) => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

const getImageUrl = (variant) => {
  const firstImage = Array.isArray(variant.images) ? variant.images[0] : null;
  return (
    variant.image ||
    variant.url ||
    firstImage?.image ||
    firstImage?.url ||
    firstImage?.path ||
    firstImage?.full_path ||
    ""
  );
};

const getOptionName = (option) => {
  if (typeof option === "string") return option;
  return option?.name || option?.title || option?.value || "";
};

const getVariantOptions = (variant) => {
  const options = variant.options_ids || variant.options || [];
  return options.map(getOptionName).filter(Boolean);
};

const mapVariant = (variant) => ({
  id: variant.id,
  image: getImageUrl(variant),
  price: variant.price || "0",
  productTitle: variant.product_title || variant.title || variant.name || "-",
  options: getVariantOptions(variant),
  isDefault: Boolean(variant.is_default),
});

const fetchProductVariants = async () => {
  isLoading.value = true;
  const result = await productsStore.getProductVariants(props.productId);
  isLoading.value = false;

  if (result.status !== "success") {
    errorToast(result.msg || loadingErrorLabel.value);
    return;
  }

  variants.value = getVariantsFromResponse(result.data).map(mapVariant).filter((variant) => variant.id);
  const defaultVariant = variants.value.find((variant) => variant.isDefault);
  selectedVariantId.value = defaultVariant?.id || variants.value[0]?.id || null;
};

onMounted(fetchProductVariants);

const closePopup = () => {
  isOpen.value = false;
  emit("close");
};

const confirmSelection = async () => {
  if (!selectedVariantId.value) return;

  isSubmitting.value = true;
  const result = await productsStore.setVariantAsDefault(selectedVariantId.value);
  isSubmitting.value = false;

  if (result.status === "success") {
    successToast(result.msg || successLabel.value);
    closePopup();
    router.push("/myProducts");
    return;
  }

  errorToast(result.msg || submitErrorLabel.value);
};
</script>

<style scoped>
.variant-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.65);
}

.variant-popup {
  position: relative;
  width: min(960px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 46px 48px 32px;
  border-radius: 26px;
  background: #fff;
  border-inline-start: 7px solid var(--main);
  box-shadow: 0 20px 55px rgba(44, 88, 162, 0.2);
}

.variant-popup-close {
  position: absolute;
  top: 28px;
  inset-inline-end: 32px;
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: #ff4d4f;
  font-size: 30px;
  line-height: 1;
}

.variant-popup-title {
  margin: 0 0 38px;
  color: var(--main);
  text-align: center;
  font-size: 30px;
  font-weight: 800;
}

.variant-popup-loader,
.variant-popup-empty {
  min-height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--main);
  font-weight: 700;
}

.variant-popup-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 50px;
}

.variant-popup-item {
  display: grid;
  grid-template-columns: 34px 84px minmax(110px, 1fr) 120px minmax(120px, 1fr);
  align-items: center;
  gap: 24px;
  min-height: 132px;
  padding: 22px 26px;
  border: 1px solid rgba(44, 88, 162, 0.45);
  border-radius: 18px;
  background: var(--main-bg);
  cursor: pointer;
  transition: 0.2s ease;
}

.variant-popup-item.active,
.variant-popup-item:hover {
  border-color: var(--main);
  box-shadow: 0 10px 30px rgba(44, 88, 162, 0.12);
}

.variant-popup-radio-input {
  display: none;
}

.variant-popup-radio {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(44, 88, 162, 0.45);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.variant-popup-radio::after {
  content: "";
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--main);
  opacity: 0;
  transition: 0.2s ease;
}

.variant-popup-item.active .variant-popup-radio {
  border-color: var(--main);
}

.variant-popup-item.active .variant-popup-radio::after {
  opacity: 1;
}

.variant-popup-image {
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5px;
  border: 5px solid #fff;
  border-radius: 15px;
  background: #edf1fb;
}

.variant-popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.variant-popup-name {
  color: #222;
  font-size: 17px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.variant-popup-price {
  color: var(--main);
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
}

.variant-popup-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #222;
}

.variant-popup-option {
  font-size: 15px;
  font-weight: 600;
}

.variant-popup-confirm {
  width: min(525px, 100%);
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 0;
  border-radius: 18px;
  background: var(--main);
  color: #fff;
  font-size: 23px;
  font-weight: 800;
  transition: 0.2s ease;
}

.variant-popup-confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(44, 88, 162, 0.25);
}

.variant-popup-confirm:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.variant-popup::-webkit-scrollbar {
  width: 6px;
}

.variant-popup::-webkit-scrollbar-track {
  background: transparent;
}

.variant-popup::-webkit-scrollbar-thumb {
  background: rgba(44, 88, 162, 0.35);
  border-radius: 10px;
}

@media (max-width: 767px) {
  .variant-popup {
    padding: 38px 18px 24px;
  }

  .variant-popup-title {
    font-size: 22px;
  }

  .variant-popup-item {
    grid-template-columns: 28px 70px 1fr;
    gap: 14px;
  }

  .variant-popup-price,
  .variant-popup-options {
    grid-column: 3;
  }

  .variant-popup-image {
    width: 70px;
    height: 70px;
  }
}
</style>
