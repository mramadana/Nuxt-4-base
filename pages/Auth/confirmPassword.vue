<template>
    <div class="container container_layout">
        <div class="custom-width with-auth p-0 mt-4 confirm-password-wrapper">

            <form @submit.prevent="resetPassword" ref="confirmPasswordForm" class="confirm-password-form mt-4">
                <div class="row">
                    <div class="col-12 col-md-12 mx-auto">
                        <div class="confirm-password-card">
                            <div class="confirm-password-heading">
                                <h2>{{ $t("Global.change_password") }}</h2>
                                <p>{{ $t("Auth.restore_password_desc") }}</p>
                            </div>

                            <FormInput class="confirm-password-field" v-model:modelValue="password" name="password"
                                :type="passwordVisible ? 'text' : 'password'" :label="$t('Auth.new_password')"
                                :placeholder="$t('Auth.new_password')" :validation-schema="validations.password"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <button type="button" class="password-toggle-btn" @click="passwordVisible = !passwordVisible"
                                        tabindex="-1">
                                        <i class="fa-regular" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                                    </button>
                                </template>
                            </FormInput>

                            <FormInput class="confirm-password-field" v-model:modelValue="confirmPassword"
                                name="password_confirmation" :type="confirmPasswordVisible ? 'text' : 'password'"
                                :label="$t('Auth.confirm_password_sm')" :placeholder="$t('Auth.confirm_password_sm')"
                                :validation-schema="validations.confirmPassword" :showErrors="showValidation"
                                required-symbol="*">
                                <template #rightIcon>
                                    <button type="button" class="password-toggle-btn"
                                        @click="confirmPasswordVisible = !confirmPasswordVisible" tabindex="-1">
                                        <i class="fa-regular" :class="confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                                    </button>
                                </template>
                            </FormInput>

                            <button type="submit" class="custom-btn confirm-submit-btn" :disabled="loading">
                                {{ $t('Auth.confirmation') }}
                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
                            </button>
                        </div>
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
    name: "Auth.new_password",
    layout: "auth",
    customBackHandler: true,
});

const { response } = responseApi();
const { successToast, errorToast } = toastMsg();
const axios = useApi();

const forgetPasswordPhone = ref("");
const forgetPasswordCountryId = ref("");
const forgetPasswordCode = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const loading = ref(false);
const showValidation = ref(false);
const confirmPasswordForm = ref(null);

const formData = computed(() => ({
    password: password.value,
    confirmPassword: confirmPassword.value,
}));

const { isFormValid, scrollToFirstError } = useFormValidation();
const { password: passwordValidation } = useValidationSchema();

const validations = {
    password: passwordValidation("Auth.password"),
    confirmPassword: passwordValidation("Auth.confirm_password_sm"),
};

const validateConfirmPassword = (data, schemas) => {
    try {
        schemas.confirmPassword.validateSync(data.confirmPassword);
    } catch (error) {
        return false;
    }

    return data.password === data.confirmPassword;
};

const handleBack = () => {
    navigateTo("/Auth/restorepassword");
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

const resetPassword = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);
    const isConfirmPasswordValid = validateConfirmPassword(formData.value, validations);

    if (!isValid) {
        scrollToFirstError(formData.value, validations);
        return;
    }

    if (!isConfirmPasswordValid) {
        errorToast(t("validation.confirmPassword"));
        return;
    }

    loading.value = true;

    try {
        const fd = new FormData(confirmPasswordForm.value);
        fd.append("phone", forgetPasswordPhone.value);
        fd.append("country_code", forgetPasswordCountryId.value || "966");
        fd.append("code", forgetPasswordCode.value);

        const res = await axios.post("provider/reset-password", fd);

        if (response(res) == "success") {
            successToast(res.data.msg);
            setTimeout(() => {
                navigateTo("/Auth/login");
            }, 2000);
        } else {
            errorToast(res.data.msg);
        }
    } catch (err) {
        console.log(err);
        errorToast(t("Auth.error_occurred"));
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    forgetPasswordPhone.value = localStorage.getItem("forgetPasswordPhone") || "";
    forgetPasswordCountryId.value = localStorage.getItem("forgetPasswordCountryId") || "";
    forgetPasswordCode.value = localStorage.getItem("forgetPasswordCode") || "";
});
</script>

<style lang="scss" scoped>
.confirm-password-wrapper {
    width: min(448px, 100%);
}

.confirm-password-form {
    width: min(448px, 100%);
}

.confirm-password-card {
    width: 100%;
    min-height: 292px;
    padding: 40px;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    background: #fff;
    overflow: hidden;

    .row {
        width: 100%;
        margin: 0;
    }

    .col-12,
    .col-md-12 {
        width: 100%;
        max-width: 100%;
        padding: 0;
    }
}

.confirm-password-heading {
    text-align: center;
    margin-bottom: 32px;

    h2 {
        color: #0e3b64;
        font-size: 20px;
        line-height: 24px;
        font-weight: 500;
        margin: 0 0 8px;
    }

    p {
        color: #9ca3af;
        font-size: 14px;
        line-height: 20px;
        margin: 0;
    }
}

.confirm-password-card :deep(.form-group) {
    margin-bottom: 16px !important;
}

.confirm-password-card :deep(.label) {
    display: block;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 16px;
    text-align: start;
}

.confirm-password-card :deep(.label-symbol) {
    color: #ec2d30;
    font-size: 14px;
    margin-inline-start: 0;
}

// .confirm-password-card :deep(.main_input) {
//     width: 100%;
//     height: 48px !important;
//     min-height: 48px !important;
//     border: 1px solid #e2e8f0 !important;
//     border-radius: 8px !important;
//     background: #fff;
//     color: #0f172a;
//     font-size: 12px;
//     line-height: 20px;
//     padding: 14px 40px 14px 16px !important;
//     box-shadow: none !important;
//     text-align: start;
// }

.confirm-password-card :deep(.main_input::placeholder) {
    color: #94a3b8;
    font-size: 12px;
}

.password-toggle-btn {
    position: absolute;
    inset-inline-end: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #0e3b64;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.confirm-submit-btn {
    width: 100%;
    height: 48px;
    min-height: 48px;
    margin-top: 12px;
    border-radius: 8px;
    background: #0e3b64;
    border-color: #0e3b64;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
}

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

    &:hover {
        background-color: #254b8a;
        transform: translateY(-2px);
    }

    i {
        font-size: 16px;
    }
}

@media (max-width: 576px) {
    .confirm-password-card {
        padding: 28px 20px;
        border-radius: 18px;
    }
}
</style>