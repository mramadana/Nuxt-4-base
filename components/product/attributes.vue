<template>
  <div class="attributes-page">
    <section class="attributes-selector-card mb-4">
      <div class="attributes-card-header">
        <h2 class="attributes-card-title">{{ displayPageTitle }}</h2>
      </div>

      <div class="attributes-card-body">
        <div class="attributes-dropdown-wrap">
          <GlobalCustomDropdown
            v-model="form.theme"
            :options="options"
            option-value="id"
            :placeholder="displayFeaturePlaceholder"
            :label="displayFeatureLabel"
            :showValidation="showThemeValidation"
            :validation-schema="dropdownValidations.theme"
          />
          <!-- <p v-if="errors.theme" class="error-message text-danger mt-1">{{ errors.theme }}</p> -->
        </div>

        <button type="button" class="custom-btn attributes-add-btn" @click="addTheme" :disabled="isLoading">
          {{ displayAddLabel }}
          <span
            class="spinner-border spinner-border-sm ms-1"
            v-if="isLoading"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </section>

    <div
      v-for="(themeItem, index) in addedThemes"
      :key="themeItem.id"
      class="form-container rounded position-relative mb-4"
    >
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h5 class="mb-0">{{ themeItem.name }}</h5>
        <button type="button" class="remove-theme-btn" @click="removeTheme(index)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="form-group">
        <label class="label d-block mb-2">{{ themeItem.name }}</label>
        <GlobalCustomDropdown
          v-model="themeItem.selectedOptions"
          :options="themeItem.options"
          option-value="id"
          :placeholder="selectOptionsLabel"
          :showValidation="false"
          :validation-schema="dropdownValidations.options"
          :multiple="true"
          @change="clearThemeOptionError(index)"
        />

        <p v-if="themeItem.errors?.options" class="error-message text-danger mt-1">
          {{ themeItem.errors.options }}
        </p>
      </div>
    </div>

    <button
      type="button"
      class="custom-btn w-100"
      :disabled="isLoading"
      @click="submitAllThemes"
    >
      {{ submitAllLabel }}
      <span
        class="spinner-border spinner-border-sm ms-1"
        v-if="isLoading"
        role="status"
        aria-hidden="true"
      ></span>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";

const props = defineProps({
  redirectAfterSave: {
    type: Boolean,
    default: true,
  },
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const productsStore = useProductsStore();
const { successToast, errorToast } = toastMsg();
const { required, multipleCheckboxes } = useValidationSchema();

const productId = route.params.id || route.query.product_id || route.query.id;
const isEditMode = route.query.action === "edit";

const isLoading = ref(false);
const showThemeValidation = ref(false);
const showOptionsValidation = ref(false);
const options = ref([]);
const featuresData = ref([]);

const form = ref({
  theme: null,
});

const addedThemes = ref([]);

const errors = reactive({
  theme: null,
});

const getText = (key, fallback) => {
  const value = t(key);
  return value === key ? fallback : value;
};

const displayPageTitle = computed(() => "سمات المنتج");
const displayFeatureLabel = computed(() => "تحديد السمة");
const displayFeaturePlaceholder = computed(() => "اختر السمة");
const displayAddLabel = computed(() => "إضافة السمة");
const selectOptionsLabel = computed(() => getText("products.selectOptions", "اختر السمة"));
const submitAllLabel = computed(() => getText("products.submitAll", "حفظ السمات"));
const dropdownValidations = computed(() => ({
  theme: required("products.theme.label"),
  options: multipleCheckboxes("products.selectOptions", 1),
}));

const themeSelectionSchema = Yup.object().shape({
  theme: Yup.mixed().required(getText("products.theme.required", "Feature is required")),
});

const optionsSchema = Yup.object().shape({
  selectedOptions: Yup.array().min(1, getText("products.selectOptionsRequired", "يجب اختيار خيار واحد على الأقل")),
});

watch(
  () => form.value.theme,
  (theme) => {
    if (theme) {
      errors.theme = null;
      showThemeValidation.value = false;
    }
  }
);

onMounted(async () => {
  if (!productId) {
    errorToast("Product id is missing");
    return;
  }

  isLoading.value = true;
  const allFeaturesResult = await productsStore.getAllFeatures();

  if (allFeaturesResult.status !== "success" || !allFeaturesResult.data) {
    errorToast(allFeaturesResult.msg || "Failed to load features");
    isLoading.value = false;
    return;
  }

  featuresData.value = allFeaturesResult.data;

  options.value = featuresData.value.map((feature) => ({
    name: feature.name,
    id: feature.id,
    options: feature.options || [],
  }));

  if (isEditMode) {
    await hydrateExistingFeatures();
  }

  isLoading.value = false;
});

const hydrateExistingFeatures = async () => {
  try {
    const authStore = useAuthStore();
    const axios = useApi();

    const response = await axios.get(`provider/products/show/${productId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    if (response.data.key !== "success" || !response.data.data?.features) return;

    for (const productFeature of response.data.data.features) {
      const fullFeature = featuresData.value.find((f) => f.id === productFeature.id);
      if (!fullFeature) continue;

      const selectedOptionIds = productFeature.options
        ? productFeature.options.map((opt) => opt.id)
        : [];

      addedThemes.value.push({
        name: fullFeature.name,
        id: fullFeature.id,
        options: fullFeature.options || [],
        selectedOptions: selectedOptionIds,
        errors: {
          options: null,
        },
      });
    }
  } catch (error) {
    console.error("Error hydrating features:", error);
  }
};

const clearThemeErrors = () => {
  errors.theme = null;
};

const clearAddedThemeErrors = () => {
  addedThemes.value.forEach((theme) => {
    if (theme.errors) {
      theme.errors.options = null;
    }
  });
};

const addTheme = async () => {
  showThemeValidation.value = true;
  clearThemeErrors();

  try {
    await themeSelectionSchema.validate(form.value);
  } catch (err) {
    errors.theme = err.message;
    return;
  }

  const selected = options.value.find((opt) => opt.id === form.value.theme);
  if (!selected) return;

  if (addedThemes.value.some((theme) => theme.id === selected.id)) {
    return;
  }

  isLoading.value = true;
  const result = await productsStore.getFeatureOptionsById(selected.id);
  isLoading.value = false;

  if (result.status === "success" && result.data) {
    addedThemes.value.push({
      ...selected,
      options: result.data,
      selectedOptions: [],
      errors: {
        options: null,
      },
    });

    form.value.theme = null;
    showThemeValidation.value = false;
    return;
  }

  errorToast(result.msg || "Failed to load feature options");
};

const removeTheme = (index) => {
  addedThemes.value.splice(index, 1);
};

const clearThemeOptionError = (index) => {
  const themeItem = addedThemes.value[index];
  if (!themeItem?.errors) return;

  themeItem.errors.options = null;
};

const submitAllThemes = async () => {
  if (!addedThemes.value.length) {
    showThemeValidation.value = true;
    errors.theme = getText("products.theme.required", "Feature is required");
    return;
  }

  showOptionsValidation.value = true;

  clearAddedThemeErrors();
  let hasErrors = false;

  for (const themeItem of addedThemes.value) {
    try {
      await optionsSchema.validate(themeItem);
    } catch (err) {
      hasErrors = true;
      themeItem.errors.options = err.message;
    }
  }

  if (hasErrors) return;

  const payload = addedThemes.value.map((themeItem) => ({
    feature_id: themeItem.id,
    options_ids: themeItem.selectedOptions,
  }));

  try {
    isLoading.value = true;
    const authStore = useAuthStore();
    const axios = useApi();

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("features", JSON.stringify(payload));

    const response = await axios.post("provider/products/feature-add-or-update", formData, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    isLoading.value = false;

    if (response.data.key === "success") {
      successToast(response.data.msg || "Attributes saved successfully");
      if (props.redirectAfterSave) {
        router.push(
          { path: "/products/variants/add", query: { product_id: productId } }
        );
      }
      return;
    }

    errorToast(response.data.msg || "Failed to save attributes");
  } catch (error) {
    isLoading.value = false;
    console.error("Submit features error:", error);
    errorToast(error.response?.data?.msg || "Failed to save attributes");
  }
};
</script>

<style scoped>
.attributes-page {
  width: 100%;
  max-width: 1800px;
  margin-inline: auto;
  padding: 42px 32px;
}

.attributes-selector-card {
  overflow: hidden;
  border: 1px solid #d1d1d1;
  border-radius: 18px;
  background: #fff;
}

.attributes-card-header {
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 20px;
  border-bottom: 1px solid #d1d1d1;
}

.attributes-card-title {
  margin: 0;
  color: #2f5daa;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  text-align: start;
}

.attributes-card-body {
  padding: 28px 20px;
}

.attributes-dropdown-wrap {
  margin-bottom: 60px;
}

.attributes-add-btn {
  width: min(420px, 100%);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline: auto;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
}

.attributes-selector-card :deep(.label) {
  display: block;
  margin-bottom: 10px;
  color: #222;
  font-size: 20px;
  font-weight: 700;
  text-align: start;
}

.attributes-selector-card :deep(.dropdown_card) {
  min-height: 60px;
  border: 1px solid #d1d1d1;
  border-radius: 10px;
}

.attributes-selector-card :deep(.custom-dropdown) {
  width: 100%;
  border: 0;
  box-shadow: none;
}

.attributes-selector-card :deep(.p-dropdown-label) {
  font-size: 18px;
  color: #777;
}

.remove-theme-btn {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: #dc3545;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-dropdown),
:deep(.p-multiselect) {
  width: 100%;
}

@media (max-width: 767px) {
  .attributes-page {
    padding: 20px 12px;
  }

  .attributes-card-header {
    min-height: 68px;
    padding: 18px 16px;
  }

  .attributes-card-body {
    padding: 22px 16px;
  }

  .attributes-dropdown-wrap {
    margin-bottom: 34px;
  }
}
</style>
