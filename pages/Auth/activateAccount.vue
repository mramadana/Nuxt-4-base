<template>
    <div class="container container_layout">
        <div class="custom-width with-auth p-0 mt-4">
            <img src="@/assets/images/gif-img/OTP Verification Successful.gif" alt="login-image" class="d-block mx-auto mb-4 otp-img" />
            <h1 class="main-title bold lg mb-4">{{ $t("Auth.activation_code_auth") }}</h1>
            <p class="desc mb-4 auth-desc">{{ $t("Auth.verification_info") }} &nbsp; {{ user?.phone }}</p>
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
                            {{ $t('Titles.verification_code') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                        </button>
                        
                        <button type="button" class="edit-mobile-btn d-flex mx-auto mt-3" @click="navigateTo('/Auth/restorepassword')">
                          <i class="fa-solid fa-phone-volume"></i>
                          <span>{{ $t("Auth.edit_mobile_number") }}</span>
                        </button>

                    </div>
                </div>
            </form>
        </div>

        <!-- Success Dialog -->
        <Dialog v-model:visible="successDialogVisible" modal :closable="false" class="success-dialog">
            <div class="text-center p-4">
                <img src="@/assets/images/gif-img/Done.gif" alt="success" class="success-gif mb-3" />
                <p class="success-message mb-4">تم إرسال الطلب بنجاح في انتظار رد الإدارة !</p>
                <button type="button" class="custom-btn w-100" @click="handleContinue">
                    متابعة
                </button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n({ useScope: "global" });

definePageMeta({
    name: "Auth.activation_code_auth",
    layout: "auth",
    showBackLink: true,
});

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

// Store
const store = useAuthStore();
const { verificationHandler } = store;
const { user, notificationToken, device_id } = storeToRefs(store);

// Variables
const loading = ref(false);
const bindModal = ref("");
const otpComponent = ref(null);
const successDialogVisible = ref(false);

// Verification function
const verificationCode = async () => {
    if (!bindModal.value) {
        errorToast(t("validation.verification_code"));
        return;
    }
    loading.value = true;
    const fd = new FormData();

    fd.append('phone', user.value.phone);
    fd.append('country_code', '966');
    fd.append('code', bindModal.value);
    fd.append('device_type', 'web');
    fd.append('device_id', device_id.value);

    // Get Returned Data From Store
    const res = await verificationHandler(fd, 'provider/activate?_method=patch');
    
    if (res.status == "success") {
        successDialogVisible.value = true;
    } else {
        errorToast(res.msg);
    }

    loading.value = false;
}

const handleContinue = () => {
    successDialogVisible.value = false;
    navigateTo('/Auth/login');
};

// Resend code function
const resendCode = async () => {
    try {
        const fd = new FormData();
        fd.append("phone", user.value.phone);
        fd.append("country_code", "966");

        const res = await axios.post("provider/resend-code", fd);

        if (response(res) === "success") {
            successToast(res.data.msg);
        } else {
            errorToast(res.data.msg);
        }
    } catch (err) {
        console.error("Resend Code Error:", err);

        errorToast(
            err?.response?.data?.msg ||
            "حدث خطأ أثناء إعادة إرسال الكود"
        );
    }
};


// Start countdown on mount
onMounted(() => {
    if (otpComponent.value) {
        otpComponent.value.startCountdown();
    }
});

</script>

<style lang="scss">

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

.success-gif {
    width: 120px;
    height: 120px;
    object-fit: contain;
}

.success-message {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    line-height: 1.6;
}

:deep(.success-dialog) {
    max-width: 500px;
    border-radius: 16px;
    
    .p-dialog-content {
        padding: 0;
    }
}
.auth-desc {
    width: 50%;
    margin: auto;
    max-width: 100%;
}
</style>