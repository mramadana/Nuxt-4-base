<template>
  <div class="container container_layout">
    <div class="custom-width with-auth p-0 mt-4">

      <img src="@/assets/images/gif-img/OTP Verification Successful.gif" alt="login-image" class="d-block mx-auto mb-4 otp-img" />
      <h1 class="main-title bold lg mb-4">{{ $t("Global.change_password") }}</h1>
      <p class="desc mb-2 auth-desc">{{ $t("Auth.restore_password_desc") }}</p>
      <p class="desc mb-3 mt-3 auth-desc">{{ $t("Auth.restore_password_otp_hint") }} &nbsp; {{ forgetPasswordPhone }}</p>

      <form @submit.prevent="verificationCode">
        <div class="row">
          <div class="col-12 col-md-8 mr-auto">
            <FormOtpVerification
              v-model="bindModal"
              :num-inputs="4"
              :initial-countdown="60"
              @resend-code="resendCode"
              ref="otpComponent"
            />

            <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
              {{ $t("Titles.verification_code") }}
              <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
            </button>

          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });

definePageMeta({
  name: "Auth.restore_password",
  layout: "auth",
    customBackHandler: true,
  // showBackLink: true,
});

const { response } = responseApi();
const { successToast, errorToast } = toastMsg();
const axios = useApi();

const forgetPasswordPhone = ref("");
const forgetPasswordCountryId = ref("966");
const loading = ref(false);
const bindModal = ref("");
const otpComponent = ref(null);

const handleBack = () => {
  navigateTo("/Auth/login");
};
const handleAuthLayoutBack = () => {
    handleBack();
};

onMounted(() => {
    window.addEventListener("customBackClick", handleAuthLayoutBack);
});

onBeforeUnmount(() => {
    window.removeEventListener("customBackClick", handleAuthLayoutBack);
});

const verificationCode = async () => {
  if (!bindModal.value || bindModal.value.length < 4) {
    errorToast(t("validation.verification_code"));
    return;
  }

  loading.value = true;

  try {
    const fd = new FormData();
    fd.append("code", bindModal.value);
    fd.append("phone", forgetPasswordPhone.value);
    fd.append("country_code", forgetPasswordCountryId.value || "966");

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
  try {
    const fd = new FormData();
    fd.append("phone", forgetPasswordPhone.value);
    fd.append("country_code", forgetPasswordCountryId.value || "966");

    const res = await axios.post("provider/forget-password-resend-code", fd);

    if (response(res) === "success") {
      successToast(res.data.msg);
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
  forgetPasswordCountryId.value = localStorage.getItem("forgetPasswordCountryId") || "966";

  if (otpComponent.value) {
    otpComponent.value.startCountdown();
  }
});
</script>

<style lang="scss" scoped>
.back-btn-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--main);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(44, 88, 162, 0.2);
}

.back-btn-box:hover {
  background-color: #254b8a;
  transform: translateY(-2px);
}

.back-btn-box i {
  font-size: 16px;
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

.otp-img {
  height: 250px;
}

.auth-desc {
  width: 50%;
  margin: auto;
  max-width: 100%;
  color: #838996;
  font-size: 13px;
}

@media (max-width: 767px) {
  .auth-desc {
    width: 100%;
  }

  .otp-img {
    height: 200px;
  }
}
</style>