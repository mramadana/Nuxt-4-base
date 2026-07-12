<template>
    <div class="container_layout">

        <form @submit.prevent="login" ref="loginForm" class="auth-login-card">
            <h1 class="main-title bold lg mb-1 text-center">{{ $t("Auth.login") }}</h1>
            <p class="auth-login-desc">{{ $t("Auth.login_desc") }}</p>
            <div class="row">
                <div class="col-12 col-md-11 mr-auto">
                    
                    <div class="col-12">
                        <div class="form-group">
                            <label class="label">
                                {{ $t("Auth.mobile_number") }}
                                <span class="label-symbol">*</span>
                            </label>
                            <div class="with_cun_select" :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
                                <FormInput ref="phoneInputRef" v-model:modelValue="phone" name="phone" type="number"
                                    :placeholder="$t('Auth.mobile_number')"
                                    :validation-schema="validations.phone" :showErrors="showValidation"
                                    :moveErrorToParent="true" />
                                <CountryDropdown v-model="selectedCountry"
                                    :placeholder="$t('Auth.select_country')" />
                            </div>
                            <p v-if="phoneInputRef?.shouldShowError" class="error-message text-danger mt-1"
                                :class="phoneInputRef?.localeDir">
                                {{ phoneInputRef?.errorMessage }}
                            </p>
                        </div>
                    </div>

                    <!-- Password input with eye icon -->
                    <FormInput v-model:modelValue="password" name="password"
                        :type="passwordVisible ? 'text' : 'password'" :label="$t('Auth.password')"
                        :placeholder="$t('Auth.please_enter_password')" :validation-schema="validations.password"
                        :showErrors="showValidation" required-symbol="*">
                        <template #rightIcon>
                            <button type="button" class="password-toggle-btn" @click="togglePasswordVisibility"
                                tabindex="-1">
                                <svg v-if="!passwordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                    </path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </template>
                    </FormInput>

                    <nuxt-link to="/Auth/restorepassword">
                        <p class="f-password">{{ $t('Auth.forget_password') }}</p>
                    </nuxt-link>

                    <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                        {{ $t('Auth.login') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                            aria-hidden="true"></span>
                    </button>

                    <div class="new-sign mt-4">
                        {{ $t('Auth.dont_have_account') }}
                        <nuxt-link to="/Auth/register">{{ $t('Auth.create_account') }}</nuxt-link>
                    </div>

                </div>
            </div>
        </form>

        <!-- Subscription Type Dialog -->
        <Dialog v-model:visible="subscriptionDialog" modal class="custum_dialog_width" :draggable="false">
            <div class="dialog-content">
                <h3 class="dialog-title">{{ $t('Auth.subscription_method') }}</h3>
                <p class="dialog-subtitle">{{ $t('Auth.select_subscription_method') }}</p>

                <div class="subscription-options">
                    <div class="option-item" :class="{ active: subscriptionType === 'commission' }">
                        <input type="radio" id="commission" value="commission" v-model="subscriptionType"
                            name="subscription_type" />
                        <label for="commission">
                            <span class="radio-dot"></span>
                            <span class="option-text">{{ $t('Auth.commission_account') }}</span>
                        </label>
                    </div>
                    <div class="option-item" :class="{ active: subscriptionType === 'package' }">
                        <input type="radio" id="package" value="package" v-model="subscriptionType"
                            name="subscription_type" />
                        <label for="package">
                            <span class="radio-dot"></span>
                            <span class="option-text">{{ $t('Auth.package_subscription') }}</span>
                        </label>
                    </div>
                </div>

                <button class="confirm-btn" @click="confirmSubscription" :disabled="!subscriptionType">
                    {{ $t('Auth.confirm') }}
                </button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>

import { useI18n } from 'vue-i18n';

// Icons
import userIcon from '@/assets/images/logo.svg';
import lockIcon from '@/assets/images/logo.svg';

definePageMeta({
    name: "Auth.login",
    layout: 'auth'
})

const { t, locale } = useI18n({ useScope: 'global' });

// Validation schemas
const { phoneNumber, password: passwordValidation } = useValidationSchema();
const validations = {
    phone: phoneNumber('Auth.mobile_number'),
    password: passwordValidation('Auth.password')
};

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Store
const store = useAuthStore();

const { signInHandler } = store;
const { notificationToken, user } = storeToRefs(store);

const loading = ref(false);
const showValidation = ref(false);

const loginForm = ref(null);
const phoneInputRef = ref(null);
const phone = ref('');
const selectedCountry = ref({ id: 1, key: '966' });
const password = ref('');
const passwordVisible = ref(false);
const subscriptionDialog = ref(false);
const subscriptionType = ref('');

// Form data (reactive object for validation)
const formData = computed(() => ({
    phone: phone.value,
    password: password.value
}));

// Toggle password visibility
const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
};


// use the composable for the validation - exactly like your example
const { isFormValid, scrollToFirstError } = useFormValidation();


// login Function
const login = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);
    console.log('Is Valid:', isValid);


    if (!isValid) {
        // if the images are valid but the inputs have errors
        scrollToFirstError(formData.value, validations);
    } else {
        // Send login request first
        loading.value = true;

        try {
            const fd = new FormData(loginForm.value);
            fd.append('device_id', notificationToken.value);
            fd.append('device_type', 'web');
            fd.append('lang', locale.value || 'ar');
            fd.append('country_code', selectedCountry.value?.key || '966');

            // Get Returned Data From Store
            const res = await signInHandler(fd);

            if (res.status === "success") {
                navigateTo('/');
                successToast(res.msg);
            } else {
                errorToast(res.msg);
            }
        } catch (error) {
            console.error('Login error:', error);
            errorToast(t('Auth.login_failed'));
        } finally {
            loading.value = false;
        }
    }
}


// Confirm subscription and proceed
const confirmSubscription = async () => {
    subscriptionDialog.value = false;

    if (subscriptionType.value === 'commission') {
        // Reset form and redirect to home
        phone.value = '';
        password.value = '';
        subscriptionType.value = '';
        showValidation.value = false;

        // Redirect to home
        navigateTo('/');
    } else if (subscriptionType.value === 'package') {
        // Redirect to SignUpToPlan page
        navigateTo('/Auth/SignUpToPlan');
    }
}



</script>

<style lang="scss" scoped>
.auth-login-card {
    width: min(500px, 100%);
    min-height: 464px;
    padding: 40px;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .main-title {
        color: #0e3b64;
        font-size: 20px;
        line-height: 1.35;
        font-weight: 700;
        margin-bottom: 6px !important;
    }

    .auth-login-desc {
        color: #9aa8b6;
        font-size: 14px;
        line-height: 1.6;
        text-align: center;
        margin: 0 0 26px;
    }

    .row {
        width: 100%;
        margin: 0;
    }

    .col-12,
    .col-md-11 {
        width: 100%;
        max-width: 100%;
        padding: 0;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .label {
        color: #1f2933;
        font-size: 13px;
        line-height: 1.4;
        margin-bottom: 8px;
        text-align: start;
    }

    .label-symbol {
        color: #ef4444;
        font-size: 13px;
    }

    :deep(.main_input),
    .with_cun_select {
        min-height: 44px !important;
        height: 44px !important;
        border-color: #dce5ef;
        border-radius: 8px !important;
        box-shadow: none;
    }

    :deep(.main_input) {
        padding: 10px 14px !important;
        font-size: 13px;
        color: #0f2742;
    }

    :deep(.main_input::placeholder) {
        color: #a6b2bf;
        font-size: 12px;
    }

    .with_cun_select {
        overflow: hidden;
        margin-bottom: 0;
    }

    .with_cun_select :deep(.form-group) {
        margin-bottom: 0;
    }

    .with_cun_select :deep(.main_input) {
        border: 0 !important;
        height: 42px !important;
        min-height: 42px !important;
    }

    .with_cun_select :deep(.dropdown_card) {
        width: 112px;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        background: #fff;
    }

    .with_cun_select :deep(.p-dropdown),
    .with_cun_select :deep(.p-select) {

        padding: 0 8px;
        border: 0;
    }

    .with_cun_select :deep(.p-dropdown-label),
    .with_cun_select :deep(.p-select-label) {
        color: #0f2742;
        font-size: 12px;
        padding: 0;
    }

    .f-password {
        color: #0e3b64;
        font-size: 12px;
        margin: -8px 0 22px;
        font-weight: 400;
    }

    .custom-btn {
        min-height: 48px;
        border-radius: 8px;
        background: #0e3b64;
        border-color: #0e3b64;
        font-size: 15px;
        font-weight: 500;
    }

    .new-sign {
        color: #8b98a7;
        font-size: 14px;
        font-weight: 400;
        margin-top: 26px !important;
        margin-bottom: 0;
    }

    .new-sign a {
        color: #0e3b64 !important;
        font-weight: 500;
    }
}
.with_cun_select.is-invalid {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
    border-radius: 8px;
}

.password-toggle-btn {
    position: absolute;
    inset-inline-end: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    transition: color 0.3s ease;
    z-index: 10;
}

.password-toggle-btn:hover {
    color: #666;
}

.password-toggle-btn:focus {
    outline: none;
}

.password-toggle-btn svg {
    width: 20px;
    height: 20px;
}

/* Subscription Dialog Styles */
:deep(.subscription-dialog) {
    .p-dialog {
        max-width: 450px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    }

    .p-dialog-content {
        padding: 0;
    }
}

.dialog-content {
    padding: 30px;
    text-align: center;
}

.dialog-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.dialog-subtitle {
    font-size: 14px;
    color: #71717a;
    margin-bottom: 30px;
}

.subscription-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.option-item {
    position: relative;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px 20px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        border-color: #f9b055;
    }

    &.active {
        border-color: #f15a24;
        background: #fff9f7;
    }

    input[type="radio"] {
        display: none;
    }

    label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        margin: 0;
        width: 100%;
    }

    .radio-dot {
        width: 20px;
        height: 20px;
        border: 2px solid #dddddd;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    &.active .radio-dot {
        border-color: #f15a24;

        &::after {
            content: "";
            width: 10px;
            height: 10px;
            background: #f15a24;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .option-text {
        font-size: 15px;
        font-weight: 600;
        color: #1a1a1a;
        text-align: right;
        flex: 1;
    }
}

.confirm-btn {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(90deg, #f9b055 0%, #f15a24 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(241, 90, 36, 0.3);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
