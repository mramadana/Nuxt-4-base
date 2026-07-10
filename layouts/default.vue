<template>
    <div class="default-layout">
      <!-- loader -->

      <!-- <div v-if="loading" class="fixed_class">
        
      </div> -->


        <LayoutHeader :is-active="isActive" @toggle-active="toggleActive" @openDialog="openDialog" />

        <div class="default-layout__content" :class="{ active: isActive }">
            <slot />
        </div>


        <LayoutSidebar :is-active="isActive" @toggle-active="toggleActive"  />

        <ComplaintsDialog :visible="ComplaintsDialog" @close-dialog="ComplaintsDialog = false" />

    </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { storeToRefs } from 'pinia';
import { useI18n } from "vue-i18n";
import { useRoute } from "#vue-router";

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);
const isActive = ref(false);
const ComplaintsDialog = ref(false);

const openDialog = () => {
  ComplaintsDialog.value = true;
};

const { t, locale } = useI18n();
const route = useRoute();

const hideFooterOnAuth = computed(() => /^\/auth(\/|$)/i.test(route.path));
const showFooter = computed(() => !hideFooterOnAuth.value);

watchEffect(() => {
  useHead({
    title: `${t(route.name)}`,
  });
});

const nuxtApp = useNuxtApp();
const loading = ref(true);
nuxtApp.hook("page:start", () => {
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});

const toggleActive = () => {
  isActive.value = !isActive.value;
};

onMounted(() => {
  document.addEventListener('click', function (event) {
    if (event.target.closest('.p-dialog-header-close')) {
      ComplaintsDialog.value = false;
    }
  });
});

</script>

<style>
.default-layout {
  --layout-sidebar-width: 228px;
  --layout-sidebar-gap: 16px;
  --layout-content-gap: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fbfbfd;
}

.default-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px var(--layout-content-gap) 60px;
  padding-inline-start: calc(var(--layout-sidebar-width) + var(--layout-sidebar-gap) + var(--layout-content-gap));
  transition: all .8s cubic-bezier(.68, -.3, .265, 1.3);
}

@media (min-width: 1281px) {
  .default-layout__content.active {
    padding-inline-start: 0;
  }
}

@media (max-width: 1280px) {
  .default-layout__content {
    padding-inline-start: var(--layout-content-gap);
  }
}

@media (max-width: 576px) {
  .default-layout__content {
    padding: 14px 12px 40px;
  }
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fixed_class {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5000;
  transition: all 0.5s;
  transform: translate3d(0, 0, 0);
  height: 100vh;
  background-color: #000;
}
</style>
