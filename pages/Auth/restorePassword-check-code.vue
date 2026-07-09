<template>
  <div class="container container_layout">
    <div class="custom-width with-auth p-0 mt-4 otp-check-screen">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <button type="button" class="back-btn-box" @click="handleBack">
          <i class="fa-solid" :class="locale === 'ar' ? 'fa-angle-right' : 'fa-angle-left'"></i>
        </button>
      </div>

      <div class="otp-head text-center">
        <h1 class="main-title bold lg mb-3">{{ $t("Auth.activation_code") }}</h1>
        <p class="desc otp-desc mb-4">{{ $t("Auth.please_enter_activation_code") }}</p>
        <img src="@/assets/images/otp_verification.svg" alt="otp-verification" class="otp-illustration mb-4" />
      </div>

      <form @submit.prevent="verificationCode">
        <div class="otp-wrapper mb-4 d-flex justify-content-center" dir="ltr">
          <v-otp-input ref="otpInput" v-model:value="bindModal" input-classes="otp-input" separator=" " :num-inputs="4"
            :should-auto-focus="true" :is-input-num="true" :placeholder="['', '', '', '']" />
        </div>

        <p class="otp-timer-text text-center mt-4 mb-4" v-if="countStatus">
          {{ $t("Auth.resend_code_in") }}
          <span class="timer-value">{{ formattedCountdown }}</span>
        </p>

        <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
          {{ $t("Auth.confirmation") }}
          <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
        </button>
      </form>

      <div class="text-center mt-4">
        <p class="otp-resend-line mb-3">
          <span>{{ $t("Auth.havent_received_code") }}</span>
          <button type="button" class="resend-btn" @click="resendCode" :disabled="countStatus"
            :class="{ disabled: countStatus }">
            {{ $t("Auth.send_new_code") }}
          </button>
        </p>

        <button type="button" class="edit-mobile-btn" @click="navigateTo('/Auth/changePhone')">
          <i class="fa-solid fa-phone-volume"></i>
          <span>{{ $t("Auth.edit_mobile_number") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import VOtpInput from "vue3-otp-input";

const { t, locale } = useI18n({ useScope: "global" });

definePageMeta({
  name: "Titles.activation_code",
  layout: "auth",
  hideHeader: true,
});

const { response } = responseApi();
const { successToast, errorToast } = toastMsg();
const axios = useApi();

const forgetPasswordPhone = ref("");
const forgetPasswordCountryId = ref("");

const loading = ref(false);
const bindModal = ref("");
const otpInput = ref(null);
const countStatus = ref(false);
const countDown = ref(60);
let countInterval = null;

const formattedCountdown = computed(() => {
  const seconds = String(countDown.value).padStart(2, "0");
  return `00.${seconds}`;
});

const startCountdown = () => {
  if (countInterval) {
    clearInterval(countInterval);
  }

  countStatus.value = true;
  countDown.value = 60;

  countInterval = setInterval(() => {
    countDown.value -= 1;
    if (countDown.value <= 0) {
      clearInterval(countInterval);
      countInterval = null;
      countStatus.value = false;
      countDown.value = 60;
    }
  }, 1000);
};

const handleBack = () => {
  if (process.client && window.history.length > 1) {
    window.history.back();
    return;
  }
  navigateTo("/Auth/restorepassword");
};

const verificationCode = async () => {
  if (!bindModal.value || bindModal.value.length < 4) {
    errorToast(t("validation.verification_code"));
    return;
  }

  loading.value = true;
  const fd = new FormData();
  fd.append("code", bindModal.value);
  fd.append("phone", forgetPasswordPhone.value);
  fd.append("country_code", forgetPasswordCountryId.value || "966");

  try {
    const res = await axios.post("provider/forget-password-check-code", fd);

    if (response(res) === "success") {
      successToast(res.data.msg);
      localStorage.setItem("forgetPasswordCode", bindModal.value);
      navigateTo("/Auth/confirmPassword");
    } else {
      errorToast(res.data.msg);
    }
  } catch (error) {
    console.error("Verification error:", error);
    errorToast(t("Auth.error_occurred"));
  } finally {
    loading.value = false;
  }
};

const resendCode = async () => {
  if (countStatus.value) return;

  try {
    const fd = new FormData();
    fd.append("phone", forgetPasswordPhone.value);
    fd.append("country_code", "966");

    const res = await axios.post("provider/forget-password-resend-code", fd);

    if (response(res) === "success") {
      successToast(res.data.msg);
      startCountdown();
    } else {
      errorToast(res.data.msg);
    }
  } catch (error) {
    console.error("Resend Code error:", error);
    errorToast(t("Auth.error_occurred"));
  }
};

onMounted(() => {
  forgetPasswordPhone.value = localStorage.getItem("forgetPasswordPhone") || "";
  forgetPasswordCountryId.value = localStorage.getItem("forgetPasswordCountryId") || "";
  startCountdown();
});

onBeforeUnmount(() => {
  if (countInterval) {
    clearInterval(countInterval);
  }
});
</script>

<style lang="scss" scoped>
.otp-check-screen {
  max-width: 528px;
  margin-inline: auto;
}

.back-btn-box {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: var(--main);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-btn-box i {
  font-size: 16px;
}

.otp-desc {
  max-width: 420px;
  margin-inline: auto;
}

.otp-illustration {
  width: 250px;
  max-width: 100%;
  height: auto;
}

.otp-wrapper :deep(.otp-input) {
  margin: 0 8px !important;
}

.otp-timer-text {
  font-size: 16px;
  color: #1a1a1a;
}

.timer-value {
  color: var(--main);
  font-weight: 600;
  margin-inline-start: 4px;
}

.otp-resend-line {
  font-size: 14px;
  color: #1a1a1a;
}

.resend-btn {
  border: none;
  background: transparent;
  color: var(--main);
  font-weight: 700;
  padding: 0;
  margin-inline-start: 6px;
}

.resend-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-mobile-btn {
  border: none;
  background: transparent;
  color: var(--main);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  line-height: 28px;
}

.edit-mobile-btn i {
  font-size: 14px;
}

@media (max-width: 767px) {
  .otp-check-screen {
    max-width: 100%;
  }

  .otp-wrapper :deep(.otp-input) {
    width: 60px !important;
    height: 60px !important;
    margin: 0 4px !important;
  }
}
</style>
