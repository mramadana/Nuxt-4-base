<template>
  <div>
    <aside class="sidebar" :class="{ active: isActive }">
      <button type="button" class="close-icon" @click="$emit('toggle-active')">
        <i class="fas fa-times"></i>
      </button>

      <div class="sidebar-logo">
        <nuxt-link to="/" class="logo-link">
          <img src="@/assets/images/logo.svg" loading="lazy" alt="logo" class="logo-img" />
        </nuxt-link>
        <p class="sidebar-title">{{ currentLocale === 'ar' ? 'القائمة' : 'Menu' }}</p>
      </div>

      <nav class="sidebar-menu">
        <nuxt-link v-for="item in primaryMenuItems" :key="item.to" class="sidebar-link" :to="item.to"
          :class="{ active: isActiveLink(item.to) }">
          <img :src="item.icon" :alt="item.label" class="sidebar-icon" />
          <span>{{ item.label }}</span>
        </nuxt-link>
      </nav>

      <div class="sidebar-bottom">
        <nuxt-link class="sidebar-link" to="/settings" :class="{ active: isActiveLink('/settings') }">
          <i class="fa-solid fa-gear sidebar-fa-icon"></i>
          <span>{{ currentLocale === 'ar' ? 'الإعدادات' : 'Settings' }}</span>
        </nuxt-link>

        <nuxt-link class="sidebar-link" to="/contact" :class="{ active: isActiveLink('/contact') }">
          <img :src="supportIcon" alt="support" class="sidebar-icon" />
          <span>{{ currentLocale === 'ar' ? 'المساعدة' : 'Help' }}</span>
        </nuxt-link>

        <button type="button" class="sidebar-link logout-link" @click="logoutDialog = true">
          <i class="fa-solid fa-right-from-bracket logout-icon"></i>
          <span>{{ currentLocale === 'ar' ? 'تسجيل الخروج' : 'Logout' }}</span>
        </button>
      </div>

      <Dialog v-model:visible="logoutDialog" modal class="custum_dialog_width" :draggable="false">
        <div class="text-center">
          <h1 class="main-title bold md mb-4">
            {{ currentLocale === 'ar' ? 'هل حقا تريد تسجيل الخروج؟' : 'Are you sure you want to log out?' }}
          </h1>
          <div class="section-btns mt-5">
            <button type="button" class="custom-btn cancel d-inline-flex" @click="logoutDialog = false">
              {{ $t("Auth.retreat") }}
            </button>
            <button type="button" class="custom-btn logout d-inline-flex" @click="logout">
              {{ currentLocale === 'ar' ? 'خروج' : 'Logout' }}
              <span class="spinner-border-sm" v-if="logoutLoading">
                <i class="fa-solid fa-spinner fa-spin fz-16"></i>
              </span>
            </button>
          </div>
        </div>
      </Dialog>
    </aside>

    <div class="overlay-sidebar" @click="$emit('toggle-active')" :class="{ show: isActive }"></div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";

import homeIcon from "@/assets/images/sidebar/Icon-374.svg";
import productsIcon from "@/assets/images/sidebar/Icon-381.svg";
import ordersIcon from "@/assets/images/sidebar/Icon-391.svg";
import inventoryIcon from "@/assets/images/sidebar/Icon-398.svg";
import paymentsIcon from "@/assets/images/sidebar/Icon-520.svg";
import financialIcon from "@/assets/images/sidebar/Icon-405.svg";
import supportIcon from "@/assets/images/sidebar/Icon-427.svg";

const props = defineProps({
  isActive: Boolean,
});

const emit = defineEmits(["toggle-active"]);
const route = useRoute();
const { locale } = useI18n({ useScope: "global" });
const currentLocale = computed(() => locale.value || "ar");

const logoutDialog = ref(false);
const logoutLoading = ref(false);

const store = useAuthStore();
const { logoutHandler } = store;
const { successToast, errorToast } = toastMsg();

const primaryMenuItems = computed(() => [
  {
    label: currentLocale.value === "ar" ? "الرئيسية" : "Home",
    to: "/",
    icon: homeIcon,
  },
  {
    label: currentLocale.value === "ar" ? "المنتجات" : "Products",
    to: "/products",
    icon: productsIcon,
  },
  {
    label: currentLocale.value === "ar" ? "الطلبات" : "Orders",
    to: "/orders-main",
    icon: ordersIcon,
  },
  {
    label: currentLocale.value === "ar" ? "المخزون" : "Inventory",
    to: "/inventory",
    icon: inventoryIcon,
  },
  {
    label: currentLocale.value === "ar" ? "الدفعات / الأرصدة" : "Payments / Balances",
    to: "/commission",
    icon: paymentsIcon,
  },
  {
    label: currentLocale.value === "ar" ? "المالية" : "Financial",
    to: "/FinancialTransactions",
    icon: financialIcon,
  },
]);

const isActiveLink = (path) => {
  if (path === "/") return route.path === "/";
  return route.path === path || route.path.startsWith(`${path}/`);
};

const logout = async () => {
  logoutLoading.value = true;
  try {
    const res = await logoutHandler();
    res.status === "success" ? successToast(res.msg) : errorToast(res.msg);
    logoutDialog.value = false;
    localStorage.clear();
  } finally {
    logoutLoading.value = false;
  }
};

watch(
  () => route.path,
  () => {
    if (process.client && window.innerWidth <= 1250 && props.isActive) {
      emit("toggle-active");
    }
  }
);
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 68px;
  bottom: 18px;
  inset-inline-start: 16px;
  width: 228px;
  min-height: calc(100vh - 86px);
  background: #0e3f69;
  border-radius: 18px;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  box-shadow: none;
  transition: all .8s cubic-bezier(.68, -.3, .265, 1.3);
}

.close-icon {
  display: none;
  position: absolute;
  top: 14px;
  inset-inline-end: 14px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  align-items: center;
  justify-content: center;
}

.sidebar-logo {
  // min-height: 154px;
  padding: 15px 18px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 150px;
  max-width: 100%;
  display: block;
}

.sidebar-title {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
}

.sidebar-menu {
  padding: 22px 28px;
  display: flex;
  flex-direction: column;
  gap: 21px;
}

.sidebar-link {
  width: 100%;
  min-height: 22px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.7) !important;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 14px;
  padding: 0;
  text-decoration: none;
  font-size: 13px;
  line-height: 22px;
  font-weight: 400;
  text-align: start;
  cursor: pointer;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  color: #fff !important;
}

.sidebar-icon {
  width: 17px;
  height: 16px;
  flex: 0 0 17px;
  object-fit: contain;
}

.sidebar-fa-icon {
  width: 17px;
  height: 16px;
  flex: 0 0 17px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sidebar-bottom {
  margin-top: auto;
  padding: 18px 12px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sidebar-bottom .sidebar-link:not(.logout-link) {
  padding-inline: 17px;
}

.logout-link {
  min-height: 39px;
  justify-content: center;
  flex-direction: row;
  gap: 12px;
  border-radius: 11px;
  background: #fde6e6;
  color: #e01010 !important;
  font-weight: 500;
}

.logout-icon {
  color: #e01010;
  font-size: 13px;
}

.overlay-sidebar {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.overlay-sidebar.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

@media (min-width: 1281px) {
  .sidebar.active {
    transform: translateX(110%);
  }

  html[lang="en"] .sidebar.active {
    transform: translateX(-110%);
  }

  .overlay-sidebar.show {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

@media (max-width: 1280px) {
  .sidebar {
    transform: translateX(110%);
  }

  html[lang="en"] .sidebar {
    transform: translateX(-110%);
  }

  .sidebar.active,
  html[lang="en"] .sidebar.active {
    transform: translateX(0);
  }

  .close-icon {
    display: inline-flex;
  }
}

@media (max-width: 576px) {
  .sidebar {
    width: min(228px, calc(100vw - 24px));
  }
}
</style>
