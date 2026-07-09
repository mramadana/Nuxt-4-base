<template>
  <div class="group-page form-container">
    <h2 class="main-title lg bold mb-2">{{ pageTitle }}</h2>
    <p class="text-muted mb-4">{{ descriptionText }}</p>

    <button type="button" class="custom-btn w-100" @click="goToVariants">
      {{ goToVariantsLabel }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

const getText = (key, fallback) => {
  const value = t(key);
  return value === key ? fallback : value;
};

const pageTitle = computed(() => getText("products.title", "Products"));
const descriptionText = computed(() =>
  getText(
    "products.addAttributesDescription",
    "Manage product variants from the variants step."
  )
);
const goToVariantsLabel = computed(() =>
  getText("products.mainProduct", "Go To Variants")
);

const goToVariants = () => {
  const productId = route.query.product_id || route.query.id;
  navigateTo(
    {
      path: "/products/variants/add",
      query: productId ? { product_id: productId } : {},
    }
  );
};
</script>

<style scoped>
.group-page {
  max-width: 760px;
  margin-inline: auto;
}
</style>
