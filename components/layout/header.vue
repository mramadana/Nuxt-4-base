<template>
  <div class="defaultLayout auth-padding main-header" :class="{ active: isActive }">
    <header class="header" :class="[headerClass, { headerAdded: isScrolled }]">
      <div class="container">
          <div class="inner-header">
            <div class="right-side d-flex align-items-center gap-2 flex-wrap">

              <div class="navbar-btn" @click="toggleActive">
                <i class="fas fa-bars"></i>
              </div>

              <NuxtLink v-if="user?.is_parent" to="/settings" class="settings-link">
                <i class="fa-solid fa-gear"></i>
              </NuxtLink>

              <div v-if="globalStore?.title">
                <div class="d-flex align-items-center gap-2 header-title">
                  <NuxtLink v-if="globalStore?.titleLink" :to="globalStore.titleLink" class="main-title bold md mb-0"
                    style="color: #fff; text-decoration: none">
                    {{ globalStore.title }}
                  </NuxtLink>

                  <h3 v-else class="main-title bold md mb-0">
                    {{ globalStore.title }}
                  </h3>

                  <i v-if="globalStore?.titleIcon" class="fz-20" :class="globalStore.titleIcon" style="color: #fff"></i>

                  <div v-if="globalStore?.subtitle" style="font-size: 13px; color: #ccc">
                    {{ globalStore.subtitle }}
                  </div>

                  <i v-if="globalStore?.subTitleIcon" class="fz-20" :class="globalStore.subTitleIcon"
                    style="color: #fff"></i>

                  <div v-if="globalStore?.subSubTitle" style="font-size: 13px; color: #ccc">
                    {{ globalStore.subSubTitle }}
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <!-- Support / Terms Button -->
              <button @click="termsDialog = true" class="support-btn mx-2">
                <!-- <img src="@/assets/images/common/customer_service.svg" alt="customer_service" /> -->
              </button>

              <NuxtLink to="/Notifications" class="notification ml-5" :class="{
                'hide-badge':
                  !updateNotificationCount || updateNotificationCount === 0,
              }">
                <!-- <img src="@/assets/images/notification-img.svg" alt="notification-img" /> -->
                <div class="nof-cont" v-if="notifCount" :data-number="notifCount"></div>
              </NuxtLink>
              <!-- <div style="color: #fff;">{{ updateNotificationCount }} lll</div> -->

              <div class="AuthLang">
                <GlobalLang :color-lang="true" />
              </div>

            </div>
          </div>
      </div>
    </header>

    <!-- Terms Dialog -->
    <Dialog v-model:visible="termsDialog" modal class="custum_dialog_width terms-dialog" :draggable="false"
      :closable="false">
      <div class="dialog-close-btn" @click="termsDialog = false">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div class="text-center p-4">
        <div class="terms-icon-wrapper mb-4">
          <img src="@/assets/images/logo.svg" alt="terms" class="terms-img" onerror="this.src='/Logo.svg'" />
        </div>
        <h2 class="main-title bold mb-4">
          {{ $t("Global.terms") || "الشروط والأحكام" }}
        </h2>
        <!-- Loading State -->
        <div v-if="termsLoading" class="text-center py-4">
          <i class="fas fa-spinner fa-spin fa-2x text-danger"></i>
        </div>
        
        <!-- Terms Content -->
        <div v-else class="terms-text text-muted lh-lg">
          <div v-if="termsContent" v-html="termsContent"></div>
          <div v-else>
            هذا النص نص بديل يمكن ان يستبدل بنص أخر في نفس المساحة
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>


<script setup>
// const router = useRouter();
const route = useRoute();
defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// store
const store = useAuthStore();
const globalStore = useGlobalStore();

const { user, isLoggedIn, token, updateNotificationCount } = storeToRefs(store);

const imageheader = ref(null);

const { response } = responseApi();

const { logoutHandler } = store;
// notifications
const notifCount = ref(null);
const logoutDialog = ref(false);
const termsDialog = ref(false);
const termsContent = ref("");
const termsLoading = ref(false);

// config
let config = {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
};
const logout = async () => {
  // Get Returned Data From Store
  logoutDialog.value = false;
  const res = await logoutHandler();
  res.status == "success" ? successToast(res.msg) : errorToast(res.msg);
  localStorage.clear();
};

const emit = defineEmits(["toggle-active"]);

const toggleActive = () => {
  emit("toggle-active");
};

// Get Terms and Conditions
const getTermsContent = async () => {
  termsLoading.value = true;
  try {
    const res = await axios.get("general/terms/providers-terms");
    if (response(res) === "success") {
      termsContent.value = res.data.data;
    }
  } catch (err) {
    console.error(err);
  } finally {
    termsLoading.value = false;
  }
};

// get notifications Count
const getNotificationsCount = async () => {
  try {
    const res = await axios.get("general/count-notifications", config);
    if (response(res) === "success") {
      updateNotificationCount.value = res.data.data.count;
    }
  } catch (err) {
    console.error(err);
  }
};

// route get notif count
watch(
  () => route.path,
  () => {
    getNotificationsCount();
  }
);

// watch(() => updateNotificationCount.value, () => {
//     getNotificationsCount();
// });

// Watch termsDialog to fetch data when opened
let chatRedirectTimer = null;

watch(termsDialog, (newValue) => {
  if (newValue && !termsContent.value) {
    getTermsContent();
  }

  if (newValue) {
    chatRedirectTimer = setTimeout(() => {
      termsDialog.value = false;
      navigateTo('/chat?room_id=1');
    }, 3000);
  } else {
    clearTimeout(chatRedirectTimer);
  }
});

onMounted(() => {
  getNotificationsCount();
});

onMounted(() => {
  store.user?.image;
  imageheader.value = user?.value?.image;
});

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>


<style lang="scss">

.header {
    min-height: 40px;
    background: #fff;
    border-radius: 0;
    box-shadow: 0 1px 10px rgba(15, 23, 42, 0.04);
    margin: 0;
}

.settings-link {
  width: 35px;
  height: 35px;
  background: #3a3a3a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
}

.add-margin {
  margin-bottom: 40px;
}

.defaultLayout {
  position: sticky;
  top: 0;
  z-index: 33;
  background: #fbfbfd;
}

.header {
  transition: all 0.4s ease-in-out;

  &.headerAdded {
    transform: none;
    border-color: #fff;
    box-shadow: 0 1px 10px rgba(15, 23, 42, 0.06);
  }
}
</style>

<style lang="scss" scoped>
.header-title {
  @media (max-width: 500px) {
    display: none !important;
  }
}

.support-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #0e3f69;

  &::before {
    content: "\f590";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: 13px;
  }
}

.navbar-btn,
.notification {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f8fafc;
  color: #0e3f69;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
}

.notification::before {
  content: "\f0f3";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  font-size: 13px;
}

.notification.ml-5 {
  margin-left: 10px !important;
}

.AuthLang {
  margin-inline-start: 10px;
}

.terms-dialog {
  position: relative;
}

.dialog-close-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #e41f18;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e41f18;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  i {
    font-size: 14px;
  }

  &:hover {
    background-color: #e41f18;
    color: #fff;
  }
}

.terms-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.terms-text {
  font-size: 16px;
  text-align: center;
  line-height: 2.2;
}
</style>
