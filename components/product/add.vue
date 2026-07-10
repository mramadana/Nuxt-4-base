<template>
  <div class="product-add-page">
    <div class="container container_layout">
      <div class="product-shell">
        <form class="form-container product-form" @submit.prevent="submitForm">
          <h2 class="main-title lg bold mb-2 form-title">{{ action === "add" ? addTitle : editTitle }}</h2>

      <div class="type-block mb-3">
        <p class="type-label mb-1">{{ typeLabel }}</p>
        <div class="type-options">
          <label class="type-option">
            <input v-model="form.type" type="radio" :value="1" name="product_type" />
            <span>{{ simpleTypeLabel }}</span>
          </label>
          <label class="type-option">
            <input v-model="form.type" type="radio" :value="2" name="product_type" />
            <span>{{ multiTypeLabel }}</span>
          </label>
        </div>
      </div>

      <CustomDropdown
        v-model="form.main_section"
        :options="mainSectionOptions"
        option-value="id"
        :placeholder="mainSectionPlaceholder"
        :label="mainSectionLabel"
        :showValidation="showValidation"
        :validation-schema="dropdownValidations.main_section"
      />

      <CustomDropdown
        v-model="form.sub_section"
        :options="subSectionOptions"
        option-value="id"
        :placeholder="subSectionPlaceholder"
        :label="subSectionLabel"
        :disabled="!form.main_section"
        :showValidation="showValidation"
        :validation-schema="dropdownValidations.sub_section"
      />

      <CustomDropdown
        v-model="form.base_product_id"
        :options="baseProductOptions"
        option-value="id"
        :placeholder="namePlaceholder"
        :label="nameLabel"
        :showValidation="showValidation"
        :validation-schema="dropdownValidations.base_product_id"
      />

      <CustomDropdown
        v-model="form.retrieval_eligibility"
        :options="retrievalOptions"
        option-value="id"
        :placeholder="retrievalEligibilityPlaceholder"
        :label="retrievalEligibilityLabel"
      />

      <div v-if="showSimpleFields" class="row g-3">
        <div class="col-12">
          <div class="form-group mb-3">
            <label class="label d-block mb-2">{{ priceLabel }}</label>
            <input v-model="form.price" type="number" min="0" class="main_input" :placeholder="pricePlaceholder" />
            <p v-if="errors.price" class="error-message text-danger mt-1">{{ errors.price }}</p>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group mb-3">
            <label class="label d-block mb-2">{{ stockLabel }}</label>
            <input v-model="form.stock" type="number" min="0" class="main_input" :placeholder="stockPlaceholder" />
            <p v-if="errors.stock" class="error-message text-danger mt-1">{{ errors.stock }}</p>
          </div>
        </div>

        <div class="col-12">
          <div class="type-block">
            <p class="type-label mb-3">{{ discountTypeLabel }}</p>
            <div class="type-options discount-type-options">
              <label v-for="option in discountTypeOptions" :key="option.id" class="type-option">
                <input v-model="form.discount_type" type="radio" :value="option.id" name="discount_type" />
                <span>{{ option.name }}</span>
              </label>
            </div>
            <p v-if="errors.discount_type" class="error-message text-danger mt-1">{{ errors.discount_type }}</p>
          </div>
        </div>

        <div v-if="showDiscountField" class="col-12">
          <div class="form-group mb-3">
            <label class="label d-block mb-2">{{ discountLabel }}</label>
            <input v-model="form.discount" type="number" min="0" class="main_input" :placeholder="discountPlaceholder" />
            <p v-if="errors.discount" class="error-message text-danger mt-1">{{ errors.discount }}</p>
          </div>
        </div>
      </div>

      <div class="form-group mb-3">
        <label class="label d-block mb-2">{{ descriptionLabel }}</label>
        <textarea
          v-model="form.description"
          class="main_input main_area"
          :placeholder="descriptionPlaceholder"
          rows="4"
        ></textarea>
        <p v-if="errors.description" class="error-message text-danger mt-1">{{ errors.description }}</p>
      </div>

      <div class="form-group mb-3">
        <label class="label d-block mb-2">{{ descriptionEnLabel }}</label>
        <textarea
          v-model="form.description_en"
          class="main_input main_area"
          :placeholder="descriptionEnPlaceholder"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group mb-4">
        <label class="label d-block mb-2">{{ imageLabel }}</label>
        <div class="position-relative upload-box-trigger">
          <div class="main_input d-flex align-items-center justify-content-between px-3">
            <span class="text-muted-custom">{{ imagePlaceholder }}</span>
            <i class="fa-regular fa-copy fz-18 main-cl"></i>
          </div>
          <GlobalImgUploader
            acceptedFiles="image/*"
            :IsMultible="true"
            :newImages="existingImages"
            @uploaded-images-updated="handleImageFilesUpdated"
            @remove-image="handleExistingImageRemove"
          />
        </div>
        <p v-if="errors.images" class="error-message text-danger mt-1">{{ errors.images }}</p>
      </div>

          <button type="submit" class="custom-btn w-100 submit-btn" :disabled="isSubmitting">
            {{ action === "add" ? addTitle : editTitle }}
            <span class="spinner-border spinner-border-sm ms-1" v-if="isSubmitting" role="status" aria-hidden="true"></span>
          </button>
        </form>
      </div>
    </div>

    <Dialog v-model:visible="showModal" modal class="custum_dialog_width" :draggable="false">
      <div class="text-center py-3">
        <img src="@/assets/images/gif-img/Done.gif" alt="done" class="img-done mb-3" />
        <h4 class="main-title bold mb-3">{{ action === "add" ? successAddText : successEditText }}</h4>
        <button type="button" class="custom-btn w-100" @click="goMain">
          {{ continueLabel }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from "vue";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";
import GlobalImgUploader from "~/components/global/ImgUploader.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const productsStore = useProductsStore();
const { successToast, errorToast } = toastMsg();
const { required } = useValidationSchema();

const isSubmitting = ref(false);
const showModal = ref(false);
const showValidation = ref(false);
const action = computed(() => route.query.action || "add");
const productId = computed(() => route.query.id);
const variantId = ref(null);

const retrievalOptions = ref([
  { id: 1, name: "نعم" },
  { id: 0, name: "لا" },
]);

const mainSectionOptions = ref([]);
const subSectionOptions = ref([]);
const baseProductOptions = ref([]);

const form = ref({
  type: 1,
  base_product_id: null,
  price: "",
  stock: "",
  discount_type: 1,
  discount: "",
  main_section: null,
  sub_section: null,
  description: "",
  description_en: "",
  retrieval_eligibility: null,
});

const existingImages = ref([]);
const newImageFiles = ref([]);

const showSimpleFields = computed(() => form.value.type === 1);
const showDiscountField = computed(() => showSimpleFields.value && form.value.discount_type !== 3);
const discountTypeOptions = computed(() => [
  { id: 1, name: t("products.discount_type.percentage") },
  { id: 2, name: t("products.discount_type.value") },
  { id: 3, name: t("products.discount_type.none") },
]);

const errors = reactive({
  base_product_id: null,
  price: null,
  stock: null,
  discount_type: null,
  discount: null,
  main_section: null,
  sub_section: null,
  description: null,
  images: null,
});

const addTitle = computed(() => t("products.addProduct"));
const editTitle = computed(() => t("products.editProduct"));
const successAddText = computed(() => t("products.successAddProduct"));
const successEditText = computed(() => t("products.successEditProduct"));
const continueLabel = computed(() => t("Home.continue"));

const typeLabel = computed(() => t("products.type.label"));
const simpleTypeLabel = computed(() => t("products.type.simple"));
const multiTypeLabel = computed(() => t("products.type.multiple"));
const nameLabel = computed(() => t("products.name.label"));
const namePlaceholder = computed(() => t("products.name.placeholder"));
const priceLabel = computed(() => t("products.price.label"));
const pricePlaceholder = computed(() => t("products.price.placeholder"));
const stockLabel = computed(() => t("products.quantity.label"));
const stockPlaceholder = computed(() => t("products.quantity.placeholder"));
const discountTypeLabel = computed(() => t("products.discount_type.label"));
const discountLabel = computed(() => t("products.discount.label"));
const discountPlaceholder = computed(() => t("products.discount.placeholder"));
const mainSectionLabel = computed(() => t("products.main_section.label"));
const mainSectionPlaceholder = computed(() => t("products.main_section.placeholder"));
const subSectionLabel = computed(() => t("products.sub_section.label"));
const subSectionPlaceholder = computed(() => t("products.sub_section.placeholder"));
const descriptionLabel = computed(() => t("products.description.label"));
const descriptionPlaceholder = computed(() => t("products.description.placeholder"));
const descriptionEnLabel = computed(() => t("products.description_en.label"));
const descriptionEnPlaceholder = computed(() => t("products.description_en.placeholder"));
const retrievalEligibilityLabel = computed(() => t("products.retrieval_eligibility.label"));
const retrievalEligibilityPlaceholder = computed(() => t("products.retrieval_eligibility.placeholder"));
const imageLabel = computed(() => t("products.image.label"));
const imagePlaceholder = computed(() => t("Auth.attach_images"));

const dropdownValidations = computed(() => ({
  main_section: required("products.main_section.label"),
  sub_section: required("products.sub_section.label"),
  base_product_id: required("products.name.label"),
}));

const normalizeExistingImages = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((image, index) => {
      if (typeof image === "string") {
        return {
          id: `existing-${index}`,
          image,
        };
      }

      return {
        id: image?.id || image?.image_id || `existing-${index}`,
        image: image?.image || image?.url || image?.path || image?.full_path || "",
      };
    })
    .filter((image) => image.image);
};

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = null;
  });
};

const createSimpleNumberSchema = (key) => {
  const message = t(`products.${key}.required`);

  return Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .when("type", ([type], schema) => {
      return type === 1 ? schema.typeError(message).required(message) : schema.notRequired();
    });
};

const createSimpleSelectSchema = (key) => {
  const message = t(`products.${key}.required`);

  return Yup.mixed().when("type", ([type], schema) => {
    return type === 1 ? schema.required(message) : schema.notRequired();
  });
};

const createDiscountSchema = () => {
  const message = t("products.discount.required");

  return Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .when(["type", "discount_type"], ([type, discountType], schema) => {
      return type === 1 && discountType !== 3 ? schema.typeError(message).required(message) : schema.notRequired();
    });
};

const productSchema = Yup.object().shape({
  type: Yup.mixed().required(t("products.type.required")),
  base_product_id: Yup.number().required(t("products.name.required")),
  price: createSimpleNumberSchema("price"),
  stock: createSimpleNumberSchema("quantity"),
  discount_type: createSimpleSelectSchema("discount_type"),
  discount: createDiscountSchema(),
  main_section: Yup.number().required(t("products.main_section.required")),
  sub_section: Yup.number().required(t("products.sub_section.required")),
  description: Yup.string().required(t("products.description.required")),
});

watch(
  () => form.value.type,
  (productType) => {
    if (productType !== 1) {
      ["price", "stock", "discount_type", "discount", "images"].forEach((field) => {
        errors[field] = null;
      });
    }
  }
);

watch(
  () => form.value.discount_type,
  (discountType) => {
    if (discountType === 3) {
      form.value.discount = "";
      errors.discount = null;
    }
  }
);

watch(
  () => form.value.main_section,
  async (newMainSection) => {
    if (!newMainSection) {
      form.value.sub_section = null;
      subSectionOptions.value = [];
      return;
    }

    form.value.sub_section = null;
    subSectionOptions.value = [];
    const res = await productsStore.getSubCategories(newMainSection);
    if (res.status === "success") {
      subSectionOptions.value = res.data;
    }
  }
);

onMounted(async () => {
  const categoriesRes = await productsStore.getMainCategories();
  if (categoriesRes.status === "success") {
    mainSectionOptions.value = categoriesRes.data;
  }

  const baseProductsRes = await productsStore.getBaseProducts();
  if (baseProductsRes.status === "success") {
    baseProductOptions.value = baseProductsRes.data;
  }

  if (action.value === "edit" && productId.value) {
    await fetchProductData(productId.value);
  }
});

const fetchProductData = async (id) => {
  try {
    const authStore = useAuthStore();
    const axios = useApi();

    const response = await axios.get(`provider/products/show/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    if (response.data.key !== "success" || !response.data.data) return;

    const product = response.data.data;

    form.value.type = product.type === "simple" ? 1 : 2;
    form.value.base_product_id = product.base_product_id || product.base_product?.id || null;
    form.value.description = product.description?.ar || product.description || "";
    form.value.description_en = product.description?.en || product.description_en || "";
    form.value.main_section = product.category_id || null;
    form.value.retrieval_eligibility = typeof product.is_returnable === "boolean" ? Number(product.is_returnable) : null;

    if (product.type === "simple") {
      form.value.price = product.price || "";
      form.value.stock = product.stock || "";
      form.value.discount = product.discount_amount || "";
      form.value.discount_type = product.discount_type === "ratio" ? 1 : product.discount_type === "number" ? 2 : 3;
    }

    variantId.value = product.variants?.id || product.variants?.[0]?.id || product.variant_id || null;

    if (product.category_id) {
      const subRes = await productsStore.getSubCategories(product.category_id);
      if (subRes.status === "success") {
        subSectionOptions.value = subRes.data;
        form.value.sub_section = product.sub_category_id || null;
      }
    }

    existingImages.value = normalizeExistingImages(product.images);
    newImageFiles.value = [];
  } catch (error) {
    console.error("Error fetching product", error);
    errorToast(error.response?.data?.msg || t("Global.error_occurred"));
  }
};

const handleImageFilesUpdated = (files) => {
  newImageFiles.value = Array.isArray(files) ? files : [];
};

const handleExistingImageRemove = async (imageId) => {
  if (!imageId) return;

  if (!variantId.value) {
    existingImages.value = existingImages.value.filter((img) => img.id !== imageId);
    return;
  }

  const result = await productsStore.deleteVariantImage(variantId.value, imageId);
  if (result.status === "success") {
    existingImages.value = existingImages.value.filter((img) => img.id !== imageId);
    successToast(result.msg || "Image deleted successfully");
    return;
  }

  errorToast(result.msg || "Image delete failed");
};

const submitForm = async () => {
  showValidation.value = true;
  clearErrors();

  try {
    await productSchema.validate(form.value, { abortEarly: false });

    const totalImages = (existingImages.value?.length || 0) + (newImageFiles.value?.length || 0);
    if (totalImages < 1) {
      errors.images = t("products.image.required");
      return;
    }

    if (form.value.type === 2 && action.value === "add") {
      const multiFormData = new FormData();
      multiFormData.append("type", "multi");
      multiFormData.append("category_id", form.value.main_section);
      multiFormData.append("sub_category_id", form.value.sub_section);
      multiFormData.append("base_product_id", form.value.base_product_id);
      multiFormData.append("description[ar]", form.value.description);
      if (form.value.description_en) multiFormData.append("description[en]", form.value.description_en);
      if (form.value.retrieval_eligibility !== null && form.value.retrieval_eligibility !== undefined) {
        multiFormData.append("is_returnable", form.value.retrieval_eligibility ? "1" : "0");
      }
      newImageFiles.value.forEach((file) => {
        multiFormData.append("images[]", file);
      });

      isSubmitting.value = true;
      const result = await productsStore.addProduct(multiFormData);
      isSubmitting.value = false;

      if (result.status === "success" && result.data?.product_id) {
        successToast(result.msg || successAddText.value);
        return navigateTo(`/products/${result.data.product_id}/attributes`);
      } else {
        errorToast(result.msg || "Add product failed");
      }
      return;
    }

    if (form.value.type === 2 && action.value === "edit") {
      const multiFormData = new FormData();
      multiFormData.append("type", "multi");
      multiFormData.append("category_id", form.value.main_section);
      multiFormData.append("sub_category_id", form.value.sub_section);
      multiFormData.append("base_product_id", form.value.base_product_id);
      multiFormData.append("description[ar]", form.value.description);
      if (form.value.description_en) multiFormData.append("description[en]", form.value.description_en);
      if (form.value.retrieval_eligibility !== null && form.value.retrieval_eligibility !== undefined) {
        multiFormData.append("is_returnable", form.value.retrieval_eligibility ? "1" : "0");
      }
      newImageFiles.value.forEach((file) => {
        multiFormData.append("images[]", file);
      });

      isSubmitting.value = true;
      const result = await productsStore.updateProduct(productId.value, multiFormData);
      isSubmitting.value = false;

      if (result.status === "success") {
        successToast(result.msg || successEditText.value);
        showModal.value = true;
        return;
      } else {
        errorToast(result.msg || "Update product failed");
      }
      return;
    }

    const payload = new FormData();
    payload.append("type", form.value.type === 1 ? "simple" : "multi");
    payload.append("category_id", form.value.main_section);
    payload.append("sub_category_id", form.value.sub_section);
    payload.append("base_product_id", form.value.base_product_id);
    payload.append("description[ar]", form.value.description);
    if (form.value.description_en) payload.append("description[en]", form.value.description_en);
    if (form.value.retrieval_eligibility !== null && form.value.retrieval_eligibility !== undefined) {
      payload.append("is_returnable", form.value.retrieval_eligibility ? "1" : "0");
    }

    if (form.value.type === 1) {
      payload.append("price", form.value.price);
      payload.append("stock", form.value.stock);
      if (form.value.discount_type && form.value.discount_type !== 3) {
        payload.append("discount_type", form.value.discount_type === 1 ? "ratio" : "number");
        payload.append("discount_amount", form.value.discount);
      }
    }

    newImageFiles.value.forEach((file) => {
      payload.append("images[]", file);
    });

    isSubmitting.value = true;
    const result = action.value === "add" ? await productsStore.addProduct(payload) : await productsStore.updateProduct(productId.value, payload);

    if (result.status === "success") {
      successToast(result.msg || (action.value === "add" ? successAddText.value : successEditText.value));
      showModal.value = true;
    } else {
      errorToast(result.msg || "Save failed");
    }
  } catch (err) {
    if (err.inner) {
      err.inner.forEach((validationError) => {
        if (validationError.path && Object.prototype.hasOwnProperty.call(errors, validationError.path)) {
          errors[validationError.path] = validationError.message;
        }
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const goMain = () => {
  showModal.value = false;
  router.push({ path: "/myProducts" });
};
</script>

<style scoped>
:deep(.uploaded-block) {
  margin-top: 10px;
}
.product-add-page {
  width: 100%;
  padding: 20px 0 28px;
}

.product-shell {
  width: 100%;
}

.product-form {
  width: 100%;
  margin-inline: auto;
  direction: rtl;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 4px;
}

.product-form > .mb-1,
.product-form > .mb-2,
.product-form > .mb-3,
.product-form > .mb-4 {
  margin-bottom: 0 !important;
}

.form-title {
  text-align: start;
  margin-bottom: 0 !important;
}

.type-block {
  text-align: start;
}

.type-label {
  font-size: 17px;
  color: #222;
}

.type-options {
  display: flex;
  align-items: center;
  gap: 30px;
}

.discount-type-options {
  flex-wrap: wrap;
  gap: 28px;
}

.type-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #444;
  font-size: 15px;
}

.type-option input {
  width: 16px;
  height: 16px;
  accent-color: #2f5daa;
}

.main_area {
  min-height: 84px;
  resize: none;
}

.submit-btn {
  margin-top: 2px;
}

.img-done {
  width: 110px;
  height: 110px;
  object-fit: contain;
}

@media (max-width: 767px) {
  .product-add-page {
    padding: 14px 0 22px;
  }

  .product-form {
    gap: 14px;
    padding: 0;
  }
}
</style>
