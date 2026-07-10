<template>
    <div class="container container_layout">
        <div class="custom-width with-auth p-0 mt-4"
            :class="{ 'step-one-auth-wrapper': currentStep === 1, 'step-two-auth-wrapper': currentStep === 2, 'step-three-auth-wrapper': currentStep === 3 }">
            <!-- Top Header & Back Button -->

            <form @submit.prevent="signUp" ref="signUpForm" class="register-form mt-4"
                :class="{ 'register-step-one-card': currentStep === 1, 'register-step-two-card': currentStep === 2, 'register-step-three-card': currentStep === 3 }">
                <div class="row">
                    <div class="col-12 col-md-12 mx-auto">

                        <!-- ==================== STEP 1 ==================== -->
                        <div v-show="currentStep === 1" class="step-one-layout">
                            <div class="step-one-heading">
                                <h2>{{ stepsTitle.create_account }}</h2>
                                <p>{{ $t("Auth.login_desc") }}</p>
                            </div>

                            <FormInput v-model:modelValue="name_ar" name="name[ar]" type="text"
                                :label="stepsTitle.username" :placeholder="stepsTitle.username"
                                :validation-schema="validations.name_ar" :showErrors="showValidation"
                                required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-user register-field-icon"></i>
                                </template>
                            </FormInput>

                            <FormInput v-model:modelValue="name_en" name="name[en]" type="text"
                                :label="stepsTitle.company_factory_name" :placeholder="stepsTitle.company_factory_name"
                                :validation-schema="validations.name_en" :showErrors="showValidation"
                                required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-building register-field-icon"></i>
                                </template>
                            </FormInput>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t("Auth.mobile_number") }}
                                    <span class="label-symbol">*</span>
                                </label>
                                <div class="with_cun_select" :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
                                    <FormInput ref="phoneInputRef" v-model:modelValue="phone" name="phone" type="number"
                                        :placeholder="$t('Auth.mobile_number')" :validation-schema="validations.phone"
                                        :showErrors="showValidation" :moveErrorToParent="true">
                                        <template #rightIcon>
                                            <i class="fa-solid fa-mobile-screen-button register-field-icon"></i>
                                        </template>
                                    </FormInput>
                                    <CountryDropdown v-model="selectedCountry"
                                        :placeholder="stepsTitle.select_country" />
                                </div>
                                <p v-if="phoneInputRef?.shouldShowError" class="error-message text-danger mt-1"
                                    :class="phoneInputRef?.localeDir">
                                    {{ phoneInputRef?.errorMessage }}
                                </p>
                            </div>

                            <FormInput v-model:modelValue="email" name="email" type="email"
                                :label="stepsTitle.official_email" :placeholder="stepsTitle.official_email"
                                :validation-schema="validations.email" :showErrors="showValidation">
                                <template #rightIcon>
                                    <i class="fa-regular fa-envelope register-field-icon"></i>
                                </template>
                            </FormInput>

                            <div class="form-group">
                                <label class="label">
                                    {{ stepsTitle.location }}
                                    <span class="label-symbol">*</span>
                                </label>
                                <button
                                    type="button"
                                    class="main_input location-select-trigger d-flex align-items-center justify-content-between text-start"
                                    :class="{ 'is-invalid': showValidation && !hasSelectedLocation }"
                                    @click="openLocationDialog"
                                >
                                    <span :class="locationAddress ? 'location-value' : 'location-placeholder'">
                                        {{ locationAddress || stepsTitle.location_placeholder }}
                                    </span>
                                    <i class="fa-solid fa-location-dot location-icon"></i>
                                </button>
                                <p v-if="showValidation && !hasSelectedLocation" class="error-message text-danger mt-1">
                                    {{ locale === "ar" ? "هذا الحقل مطلوب" : "This field is required" }}
                                </p>
                            </div>

                            <FormInput class="step-one-password-field" v-model:modelValue="password" name="password"
                                :type="passwordVisible ? 'text' : 'password'" :label="stepsTitle.password"
                                :placeholder="stepsTitle.password" :validation-schema="validations.password"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <button type="button" class="password-toggle-btn" @click="togglePasswordVisibility"
                                        tabindex="-1">
                                        <i class="fa-regular" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                                    </button>
                                </template>
                            </FormInput>

                            <FormInput class="step-one-password-field" v-model:modelValue="confirmPassword" name="password_confirmation"
                                :type="confirmPasswordVisible ? 'text' : 'password'" :label="stepsTitle.confirmPassword"
                                :placeholder="stepsTitle.confirmPassword" :validation-schema="validations.confirmPassword"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <button type="button" class="password-toggle-btn"
                                        @click="toggleConfirmPasswordVisibility" tabindex="-1">
                                        <i class="fa-regular" :class="confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"></i>
                                    </button>
                                </template>
                            </FormInput>

                            <button type="button" class="custom-btn w-100 mt-4 mr-auto" @click="nextStep">
                                {{ stepsTitle.next }}
                            </button>

                            <div class="new-sign mt-4 text-center">
                                {{ stepsTitle.already_have_acc }}
                                <nuxt-link to="/Auth/login">{{ stepsTitle.login }}</nuxt-link>
                            </div>
                        </div>
                        <!-- ==================== STEP 2 ==================== -->
                        <div v-show="currentStep === 2" class="step2-layout legal-docs-step">
                            <div class="step-two-heading">
                                <h2>{{ stepsTitle.create_account }}</h2>
                                <p>{{ $t("Auth.login_desc") }}</p>
                            </div>

                            <FormInput class="legal-number-field" v-model:modelValue="commercial_number"
                                name="commercial_registration_number" type="text" :label="stepsTitle.cr_number"
                                :placeholder="stepsTitle.cr_number" :validation-schema="validations.commercial_number"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-clipboard register-field-icon"></i>
                                </template>
                            </FormInput>

                            <div class="form-group legal-upload-group">
                                <label class="label legal-label">
                                    {{ stepsTitle.cr_image }}
                                    <span class="required-star">*</span>
                                </label>
                                <div class="position-relative legal-upload-box"
                                    :class="{ 'is-invalid': showValidation && !uploadedCommercialImage }">
                                    <div class="legal-upload-content">
                                        <span class="legal-upload-icon">
                                            <img src="@/assets/images/upload-img.svg" alt="upload">
                                        </span>
                                        <span class="legal-upload-title">{{ stepsTitle.upload_files }}</span>
                                        <span class="legal-upload-hint">{{ stepsTitle.upload_files_hint }}</span>
                                    </div>
                                    <ImgUploader ref="commercialUploader" acceptedFiles="image/*,application/pdf"
                                        :resetTrigger="resetImageTrigger" :maxFiles="1"
                                        @uploaded-images-updated="updateUploadedCommercialImage" />
                                </div>
                                <p v-if="showValidation && !uploadedCommercialImage"
                                    class="error-message text-danger mt-1">
                                    {{ stepsTitle.cr_image_required }}
                                </p>
                            </div>

                            <FormInput class="legal-number-field" v-model:modelValue="tax_number"
                                name="tax_registration_number" type="text" :label="stepsTitle.tax_number"
                                :placeholder="stepsTitle.tax_number" :validation-schema="validations.tax_number"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-clipboard register-field-icon"></i>
                                </template>
                            </FormInput>

                            <div class="form-group legal-upload-group">
                                <label class="label legal-label">
                                    {{ stepsTitle.tax_image }}
                                    <span class="required-star">*</span>
                                </label>
                                <div class="position-relative legal-upload-box"
                                    :class="{ 'is-invalid': showValidation && !uploadedIdentityImage }">
                                    <div class="legal-upload-content">
                                        <span class="legal-upload-icon">
                                            <img src="@/assets/images/upload-img.svg" alt="upload">
                                        </span>
                                        <span class="legal-upload-title">{{ stepsTitle.upload_files }}</span>
                                        <span class="legal-upload-hint">{{ stepsTitle.upload_files_hint }}</span>
                                    </div>
                                    <ImgUploader ref="identityUploader" acceptedFiles="image/*,application/pdf"
                                        :resetTrigger="resetImageTrigger" :maxFiles="1"
                                        @uploaded-images-updated="updateUploadedIdentityImage" />
                                </div>
                                <p v-if="showValidation && !uploadedIdentityImage"
                                    class="error-message text-danger mt-1">
                                    {{ stepsTitle.tax_image_required }}
                                </p>
                            </div>

                            <button type="button" class="custom-btn step2-continue-btn" @click="nextStep">
                                {{ stepsTitle.next }}
                            </button>

                            <div class="new-sign text-center step2-login-hint">
                                {{ stepsTitle.already_have_acc }}
                                <nuxt-link to="/Auth/login">{{ stepsTitle.login }}</nuxt-link>
                            </div>
                        </div>
                        <!-- ==================== STEP 3 ==================== -->
                        <div v-show="currentStep === 3" class="step3-layout bank-account-step">
                            <div class="step-three-heading">
                                <h2>{{ stepsTitle.create_account }}</h2>
                                <p>{{ $t("Auth.login_desc") }}</p>
                            </div>

                            <FormInput class="bank-field" v-model:modelValue="account_name"
                                name="bank_account_name" type="text" :label="stepsTitle.account_name"
                                :placeholder="stepsTitle.account_name_placeholder" :validation-schema="validations.account_name"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-user register-field-icon"></i>
                                </template>
                            </FormInput>

                            <FormInput class="bank-field" v-model:modelValue="bank_name"
                                name="bank_name" type="text" :label="stepsTitle.bank_name"
                                :placeholder="stepsTitle.bank_name_placeholder" :validation-schema="validations.bank_name"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-solid fa-building-columns register-field-icon"></i>
                                </template>
                            </FormInput>

                            <FormInput class="bank-field" v-model:modelValue="account_number"
                                name="bank_account_number" type="number" :label="stepsTitle.account_number"
                                :placeholder="stepsTitle.account_number_placeholder"
                                :validation-schema="validations.account_number" :showErrors="showValidation"
                                required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-credit-card register-field-icon"></i>
                                </template>
                            </FormInput>

                            <FormInput class="bank-field" v-model:modelValue="iban"
                                name="iban" type="text" :label="stepsTitle.iban"
                                :placeholder="stepsTitle.iban_placeholder" :validation-schema="validations.iban"
                                :showErrors="showValidation" required-symbol="*">
                                <template #rightIcon>
                                    <i class="fa-regular fa-credit-card register-field-icon"></i>
                                </template>
                            </FormInput>

                            <button type="submit" class="custom-btn step3-submit-btn" :disabled="loading">
                                {{ stepsTitle.create_account }}
                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
                            </button>

                            <div class="new-sign text-center step3-login-hint">
                                {{ stepsTitle.already_have_acc }}
                                <nuxt-link to="/Auth/login">{{ stepsTitle.login }}</nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <Dialog v-model:visible="termsDialogVisible" modal class="custum_dialog_width auth-daialog"
                :draggable="false">
                <div class="text-center">
                    <img src="@/assets/images/logo.svg" alt="login-logo" class="login-logo" loading="lazy">
                    <h1 class="main-title mb-3 main-cl">{{ $t("Auth.terms_and_conditions") }}</h1>
                    <div v-if="termsLoading" class="text-center mt-3">
                        <Skeleton v-for="i in 6" :key="i" height="1rem" width="100%" class="rounded-5 mb-3 mx-auto">
                        </Skeleton>
                    </div>
                    <p v-else class="main-desc terms-dialog-desc text-center" v-html="termsContent"></p>
                </div>
            </Dialog>

            <GlobalLocationPicker
                v-model:visible="locationDialogVisible"
                v-model:location="selectedLocation"
                :header="stepsTitle.location"
            />
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import GlobalLocationPicker from "@/components/global/LocationPicker.vue";

const { t, locale } = useI18n({ useScope: "global" });

// Page Meta
definePageMeta({
    name: "Auth.create_account",
    layout: "auth",
    customBackHandler: true,
    
});

// Composable validation elements
const {
    phoneNumber,
    password: passwordValidation,
    customerName,
    email: emailValidation,
    commerciaRumber,
    taxNumber,
    required
} = useValidationSchema();

// State vars
const currentStep = ref(1);
const agreeTerms = ref(false);
const loading = ref(false);
const showValidation = ref(false);
const signUpForm = ref(null);
const phoneInputRef = ref(null);
const termsDialogVisible = ref(false);
const locationDialogVisible = ref(false);
const termsLoading = ref(false);
const termsContent = ref("");

// Step 1 fields
const name_ar = ref("");
const name_en = ref("");
const provider_type = ref("");
const phone = ref("");
const email = ref("");
const city_id = ref(null);
const password = ref("");
const confirmPassword = ref("");
const selectedLocation = ref(null);
const selectedCountry = ref({ id: 1, key: "966" });

// Step 2 fields
const description_ar = ref("");
const description_en = ref("");
const commercial_number = ref("");
const tax_number = ref("");
const main_section_id = ref([]);
const sub_section_id = ref([]);

// Step 3 fields
const bank_name = ref("");
const account_name = ref("");
const account_number = ref("");
const iban = ref("");

// Upload triggers & states
const logoUploader = ref(null);
const identityUploader = ref(null);
const commercialUploader = ref(null);

const uploadedLogo = ref(null);
const uploadedIdentityImage = ref(null);
const uploadedCommercialImage = ref(null);
const resetImageTrigger = ref(0);

// Password visibility
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
};

const toggleConfirmPasswordVisibility = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
};

// Image update callbacks
const updateUploadedLogo = (image) => {
    uploadedLogo.value = image;
};
const updateUploadedIdentityImage = (image) => {
    uploadedIdentityImage.value = image;
};
const updateUploadedCommercialImage = (image) => {
    uploadedCommercialImage.value = image;
};

// Dropdown lists
const cities = ref([]);
const mainSectionOptions = ref([]);
const subSectionOptions = ref([]);

const merchantTypes = computed(() => [
    { name: t("Auth.individual"), id: 'individual' },
    { name: t("Auth.company"), id: 'company' }
]);
const termsAgreementPrefix = computed(() =>
    locale.value === "ar" ? "بالتسجيل فأنت توافق على " : "By registering, you agree to "
);

const locationAddress = computed(() => selectedLocation.value?.map_desc || "");
const hasSelectedLocation = computed(() =>
    selectedLocation.value?.lat != null && selectedLocation.value?.lng != null
);

// Dynamic Titles & Placeholders for flawless Multi-Step UI (localized)
const stepsTitle = computed(() => {
    return {
        title: t("Auth.register_title"),
        create_account: t("Auth.create_account"),
        username: t("Auth.username"),
        company_factory_name: t("Auth.company_factory_name"),
        official_email: t("Auth.official_email"),
        step1: t("Auth.step_basic_info"),
        step2: t("Auth.step_legal_docs"),
        next: t("Auth.next"),
        submit: t("Auth.submit_admin"),
        already_have_acc: t("Auth.already_have_account"),
        login: t("Auth.login"),
        merchant_logo: t("Auth.merchant_logo"),
        merchant_name_ar: t("Auth.merchant_name"),
        merchant_name_placeholder_ar: t("Auth.enter_merchant_name"),
        merchant_name_en: t("Auth.merchant_name_en"),
        merchant_name_placeholder_en: t("Auth.enter_merchant_name"),
        merchant_type: t("Auth.merchant_type"),
        select_type: t("Auth.select_type"),
        city: t("Auth.city"),
        select_city: t("Auth.select_city_placeholder"),
        description_ar: t("Auth.description_ar"),
        description_placeholder_ar: t("Auth.description_placeholder_ar"),
        description_en: t("Auth.description_en"),
        description_placeholder_en: t("Auth.description_placeholder_en"),
        identity_image: t("Auth.identity_image"),
        cr_number: t("Auth.cr_number"),
        cr_placeholder: t("Auth.cr_placeholder"),
        cr_image: t("Auth.cr_image"),
        tax_number: t("Auth.tax_number"),
        tax_image: t("Auth.tax_image"),
        upload_files: t("Auth.upload_files"),
        upload_files_hint: t("Auth.upload_files_hint"),
        cr_image_required: t("Auth.cr_image_required"),
        tax_image_required: t("Auth.tax_image_required"),
        bank_name: t("Auth.bank_name"),
        bank_name_placeholder: t("Auth.bank_name_placeholder"),
        account_name: locale.value === "ar" ? "اسم مالك الحساب" : t("Auth.account_name"),
        account_name_placeholder: locale.value === "ar" ? "اسم مالك الحساب" : t("Auth.account_name_placeholder"),
        account_number: t("Auth.account_number"),
        account_number_placeholder: locale.value === "ar" ? "ادخل رقم الحساب" : t("Auth.account_number_placeholder"),
        iban: t("Auth.iban"),
        iban_placeholder: "SA00 0000 0000 0000 0000 0000",
        attach_images: t("Auth.attach_images"),
        main_section: t("Auth.main_section"),
        sub_section: t("Auth.sub_section"),
        section_name: t("Auth.section_name"),
        select_country: t("Auth.select_country"),
        password: t("Auth.password"),
        confirmPassword: t("Auth.confirm_password_sm"),
        phone: t("Auth.mobile_number"),
        phone_placeholder: "55 987 6547",
        email: t("Auth.email"),
        email_placeholder: "Musa Al-Dubiyan@gmail.com",
        location: locale.value === "ar" ? "الموقع الجغرافي" : "Location",
        location_placeholder: locale.value === "ar" ? "اختر الموقع من الخريطة" : "Select location from map",
        agree_to_terms: t("Auth.agree_to_terms")
    };
});

// Toast / Axios / Composable validations
const { successToast, errorToast } = toastMsg();
const store = useAuthStore();
const { signUpHandler } = store;
const { device_id } = storeToRefs(store);
const axios = useApi();
const { response } = responseApi();
const { isFormValid, scrollToFirstError } = useFormValidation();

// Fetch Cities from Backend API
const getCities = async () => {
    try {
        const res = await axios.get('cities');
        if (response(res) === "success" || res.data.key === "success") {
            cities.value = res.data.data;
        }
    } catch (err) {
        console.error("Fetch cities error:", err);
    }
};

const allCategoriesWithSubs = ref([]);

const getMainSections = async () => {
    try {
        const res = await axios.get(`main-categories?lang=${locale.value || 'ar'}`);
        if (response(res) === "success" || res.data.key === "success") {
            allCategoriesWithSubs.value = res.data.data;
            mainSectionOptions.value = res.data.data;
        }
    } catch (err) {
        console.error("Fetch categories error:", err);
    }
};

const getSubSections = (mainIds) => {
    if (!mainIds || mainIds.length === 0) {
        subSectionOptions.value = [];
        sub_section_id.value = [];
        return;
    }
    // Collect all sub-categories from selected main categories
    const allSubs = [];
    mainIds.forEach(mainId => {
        const found = allCategoriesWithSubs.value.find(c => c.id === mainId);
        if (found && found.subCategories?.length) {
            allSubs.push(...found.subCategories);
        }
    });
    subSectionOptions.value = allSubs;
    // Keep only sub_section_id values that exist in new options
    sub_section_id.value = sub_section_id.value.filter(id => 
        allSubs.some(sub => sub.id === id)
    );
};

const cleanHtml = (html) => {
    if (!html) return "";
    return html
        .replace(/\\r\\n/g, "")
        .replace(/\r\n/g, "")
        .replace(/\n/g, "");
};

const getTermsContent = async () => {
    termsLoading.value = true;
    try {
        const res = await axios.get("provider/terms");
        if (response(res) === "success") {
            termsContent.value = cleanHtml(res.data.data.content);
        } else {
            termsContent.value = t("Auth.agree_terms_conditions");
        }
    } catch (err) {
        termsContent.value = t("Auth.agree_terms_conditions");
    } finally {
        termsLoading.value = false;
    }
};

const openTermsDialog = async () => {
    termsDialogVisible.value = true;
    if (!termsContent.value) {
        await getTermsContent();
    }
};

onMounted(() => {
    getCities();
    getMainSections();
});

watch(main_section_id, (newVal) => {
    getSubSections(newVal);
});

// Validation rules
const validations = {
    name_ar: customerName("Auth.merchant_name_ar"),
    name_en: customerName("Auth.merchant_name_en"),
    provider_type: required("Auth.merchant_type"),
    phone: phoneNumber("Auth.mobile_number"),
    email: emailValidation("Auth.email"),
    city_id: required("Auth.city"),
    password: passwordValidation("Auth.password"),
    confirmPassword: passwordValidation("Auth.confirm_password_sm"),
    description_ar: required("Auth.description_ar"),
    description_en: required("Auth.description_en"),
    commercial_number: commerciaRumber("Auth.cr_number"),
    tax_number: taxNumber("Auth.tax_number"),
    bank_name: yup
        .string()
        .trim()
        .required(t("validation.required_with_label", { field: t("Auth.bank_name") }))
        .min(3, t("Auth.bank_name") + " " + t("validation.min", { field: t("Auth.bank_name"), min: 3 })),
    account_name: yup
        .string()
        .trim()
        .required(t("validation.required_with_label", { field: stepsTitle.value.account_name }))
        .min(3, stepsTitle.value.account_name + " " + t("validation.min", { field: stepsTitle.value.account_name, min: 3 })),
    account_number: yup
        .string()
        .trim()
        .required(t("validation.required_with_label", { field: t("Auth.account_number") }))
        .matches(/^[0-9]+$/, t("validation.account_number_only_digits"))
        .min(10, t("Auth.account_number") + " " + t("validation.min_num", { field: t("Auth.account_number"), min: 10 })),
    iban: yup
        .string()
        .trim()
        .required(t("validation.required_with_label", { field: t("Auth.iban") }))
        .min(24, t("Auth.iban") + " " + t("validation.min_num", { field: t("Auth.iban"), min: 24 })),
    main_section_id: required("Auth.main_section"),
    sub_section_id: required("Auth.sub_section"),
};

// Form data representation (computed for validation syncing)
const formData = computed(() => ({
    name_ar: name_ar.value,
    name_en: name_en.value,
    provider_type: provider_type.value,
    phone: phone.value,
    email: email.value,
    city_id: city_id.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    description_ar: description_ar.value,
    description_en: description_en.value,
    commercial_number: commercial_number.value,
    tax_number: tax_number.value,
    bank_name: bank_name.value,
    account_name: account_name.value,
    account_number: account_number.value,
    iban: iban.value,
    main_section_id: main_section_id.value,
    sub_section_id: sub_section_id.value
}));

// Password Confirmation matcher
const validateConfirmPassword = (data, schemas) => {
    try {
        schemas.confirmPassword.validateSync(data.confirmPassword);
    } catch (error) {
        return false;
    }
    if (data.password !== data.confirmPassword) {
        return false;
    }
    return true;
};

// Validate individual Step 1 fields
const validateStep1 = () => {
    showValidation.value = true;

    const step1Data = {
        name_ar: name_ar.value,
        name_en: name_en.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
    };

    const step1Validations = {
        name_ar: validations.name_ar,
        name_en: validations.name_en,
        phone: validations.phone,
        email: validations.email,
        password: validations.password,
        confirmPassword: validations.confirmPassword,
    };

    const isValid = isFormValid(step1Data, step1Validations);
    const isConfirmPasswordValid = validateConfirmPassword(
        { password: password.value, confirmPassword: confirmPassword.value },
        validations
    );
    const hasLocation = hasSelectedLocation.value;

    if (!isValid || !isConfirmPasswordValid || !hasLocation) {
        if (!isConfirmPasswordValid && password.value !== confirmPassword.value) {
            errorToast(t("validation.confirmPassword"));
        }
        scrollToFirstError(step1Data, step1Validations);
        return false;
    }


    showValidation.value = false;
    return true;
};

// Validate individual Step 2 fields
const validateStep2 = () => {
    showValidation.value = true;

    const step2Data = {
        commercial_number: commercial_number.value,
        tax_number: tax_number.value,
    };

    const step2Validations = {
        commercial_number: validations.commercial_number,
        tax_number: validations.tax_number,
    };

    const isValid = isFormValid(step2Data, step2Validations);
    const isTaxImageValid = !!uploadedIdentityImage.value && !Array.isArray(uploadedIdentityImage.value);
    const isCommercialValid = !!uploadedCommercialImage.value && !Array.isArray(uploadedCommercialImage.value);

    if (!isValid || !isTaxImageValid || !isCommercialValid) {
        if (isValid) {
            return false;
        }

        scrollToFirstError(step2Data, step2Validations);
        return false;
    }

    showValidation.value = false;
    return true;
};

// Step Navigation
const nextStep = () => {
    if (currentStep.value === 1) {
        if (validateStep1()) {
            currentStep.value = 2;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else if (currentStep.value === 2) {
        if (validateStep2()) {
            currentStep.value = 3;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

const openLocationDialog = () => {
    locationDialogVisible.value = true;
};

const handleBack = () => {
    if (currentStep.value === 1) {
        navigateTo('/Auth/login');
    } else {
        currentStep.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

// Main SignUp form submit
const signUp = async () => {
    showValidation.value = true;

    if (!validateStep1()) {
        currentStep.value = 1;
        return;
    }
    if (!validateStep2()) {
        currentStep.value = 2;
        return;
    }

    showValidation.value = true;

    const step3Data = {
        bank_name: bank_name.value,
        account_name: account_name.value,
        account_number: account_number.value,
        iban: iban.value,
    };

    const step3Validations = {
        bank_name: validations.bank_name,
        account_name: validations.account_name,
        account_number: validations.account_number,
        iban: validations.iban,
    };

    if (!isFormValid(step3Data, step3Validations)) {
        currentStep.value = 3;
        scrollToFirstError(step3Data, step3Validations);
        return;
    }

    loading.value = true;

    try {
        const fd = new FormData();

        // Basic info
        fd.append("name[ar]", name_ar.value);
        fd.append("name[en]", name_en.value);
        fd.append("description[ar]", description_ar.value);
        fd.append("description[en]", description_en.value);
        fd.append("email", email.value);
        fd.append("country_code", selectedCountry.value?.key || "966");
        fd.append("phone", phone.value);
        fd.append("password", password.value);
        fd.append("password_confirmation", confirmPassword.value);
        fd.append("city_id", city_id.value || "");
        fd.append("commercial_number", commercial_number.value);
        fd.append("tax_number", tax_number.value);
        fd.append("bank_name", bank_name.value);
        fd.append("bank_account_name", account_name.value);
        fd.append("bank_account_number", account_number.value);
        fd.append("iban", iban.value);
        fd.append("type", provider_type.value === "company" ? "1" : "0");

        // Categories
        if (main_section_id.value && main_section_id.value.length > 0) {
            main_section_id.value.forEach((id, index) => {
                fd.append(`categories[${index}]`, id);
            });
        }
        if (sub_section_id.value && sub_section_id.value.length > 0) {
            sub_section_id.value.forEach((id, index) => {
                fd.append(`sub_categories[${index}]`, id);
            });
        }

        fd.append("lat", String(selectedLocation.value?.lat ?? ""));
        fd.append("lng", String(selectedLocation.value?.lng ?? ""));
        fd.append("map_desc", selectedLocation.value?.map_desc || "");

        // Files
        if (uploadedLogo.value) {
            fd.append("image", uploadedLogo.value);
        }
        if (uploadedIdentityImage.value) {
            fd.append("identity_image", uploadedIdentityImage.value);
        }
        if (uploadedCommercialImage.value) {
            fd.append("commercial_image", uploadedCommercialImage.value);
        }

        const res = await signUpHandler(fd);

        if (res.status === "success") {
            successToast(res.msg);

            if (process.client) {
                localStorage.setItem(
                    "verificationCode",
                    JSON.stringify({
                        phone: phone.value,
                        email: email.value,
                        password: password.value,
                    })
                );
            }

            showValidation.value = false;
            resetImageTrigger.value++;

            // Route to Activation Account OTP screen
            setTimeout(() => {
                navigateTo('/Auth/activateAccount');
            }, 1500);
        } else {
            errorToast(res.msg);
        }
    } catch (error) {
        console.error("SignUp API failure:", error);
        errorToast(t("Auth.api_error"));
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
.step-one-auth-wrapper {
    width: min(448px, 100%);
    margin-top: 0 !important;
}

.register-step-one-card {
    width: min(448px, 100%);
    min-height: 704px;
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

    .step-one-heading {
        text-align: center;
        margin-bottom: 32px;

        h2 {
            color: #0e3b64;
            font-size: 20px;
            line-height: 24px;
            font-weight: 500;
            margin: 0 0 4px;
        }

        p {
            color: #9ca3af;
            font-size: 14px;
            line-height: 20px;
            margin: 0;
        }
    }

    :deep(.form-group),
    .form-group {
        margin-bottom: 16px;
    }

    :deep(.label-symbol),
    .label-symbol {
        color: #ec2d30;
        font-size: 14px;
    }

    :deep(.main_input),
    .with_cun_select {
        width: 100%;
        height: 48px !important;
        min-height: 48px !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        box-shadow: none !important;
        background: #fff;
    }

    :deep(.main_input) {
        color: #0f172a;
        font-size: 12px;
        line-height: 20px;
        padding: 14px 40px 14px 40px !important;
    }

    .step-one-password-field :deep(.main_input) {
        padding: 10px !important;
    }

    .location-select-trigger {
        padding: 12px 16px !important;
        background-color: #fff;
        overflow: hidden;
    }

    .location-value,
    .location-placeholder {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 20px;
    }

    .location-value {
        color: #0f172a;
    }

    .location-placeholder {
        color: #94a3b8;
    }

    .location-icon {
        flex: 0 0 auto;
        color: #0e3b64;
        font-size: 18px;
        margin-inline-start: 12px;
    }

    :deep(.main_input::placeholder) {
        color: #94a3b8;
        font-size: 12px;
    }

    .register-field-icon {
        position: absolute;
        inset-inline-start: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #0e3b64;
        font-size: 16px;
        line-height: 1;
        z-index: 2;
        pointer-events: none;
    }

    .with_cun_select {
        display: flex;
        align-items: stretch;
        overflow: hidden;
    }

    .with_cun_select :deep(.form-group) {
        flex: 1;
        margin: 0;
    }

    .with_cun_select :deep(.label) {
        display: none;
    }

    .with_cun_select :deep(.main_input) {
        border: 0 !important;
        height: 46px !important;
        min-height: 46px !important;
    }

    .with_cun_select :deep(.dropdown_card) {
        width: 96px;
        flex-shrink: 0;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        background: #fff;
    }

    .with_cun_select :deep(.p-dropdown),
    .with_cun_select :deep(.p-select) {
        height: 46px;
        display: flex;
        align-items: center;
        padding: 0 8px;
    }

    .with_cun_select :deep(.p-dropdown-label),
    .with_cun_select :deep(.p-select-label) {
        color: #000;
        font-size: 14px;
        line-height: 24px;
        padding: 0;
    }

    .password-toggle-btn {
        color: #0e3b64;
    }

    .custom-btn {
        width: 100%;
        height: 48px;
        min-height: 48px;
        border-radius: 8px;
        background: #0e3b64;
        border-color: #0e3b64;
        font-size: 16px;
        font-weight: 400;
    }

    .new-sign {
        color: #6b7280;
        font-size: 14px;
        line-height: 20px;
        margin-top: 24px !important;
        margin-bottom: 0;
    }

    .new-sign a {
        color: #0e3b64 !important;
        font-weight: 500;
    }
}


.step-two-auth-wrapper {
    width: min(448px, 100%);
    margin-top: 0 !important;
}

.register-step-two-card {
    width: min(448px, 100%);
    min-height: 668px;
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

.legal-docs-step {
    width: 100%;
    direction: rtl;

    .step-two-heading {
        text-align: center;
        margin-bottom: 32px;

        h2 {
            color: #0e3b64;
            font-size: 20px;
            line-height: 24px;
            font-weight: 500;
            margin: 0 0 4px;
        }

        p {
            color: #9ca3af;
            font-size: 14px;
            line-height: 20px;
            margin: 0;
        }
    }

    :deep(.form-group),
    .form-group {
        margin-bottom: 16px !important;
    }

    :deep(.label),
    .label {
        display: block;
        color: #000;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin-bottom: 16px;
        text-align: start;
    }

    :deep(.label-symbol),
    .required-star {
        color: #e63946;
        font-size: 14px;
        margin-inline-start: 0;
    }

    :deep(.main_input) {
        // width: 100%;
        // height: 48px !important;
        // min-height: 48px !important;
        // border: 1px solid #e2e8f0 !important;
        // border-radius: 8px !important;
        // background: #fff;
        // color: #0f172a;
        // font-size: 12px;
        // line-height: 20px;
        // box-shadow: none !important;
        padding: 14px 40px 14px 16px !important;
        text-align: start;
    }

    :deep(.main_input::placeholder) {
        color: #94a3b8;
        font-size: 12px;
    }

    .register-field-icon {
        position: absolute;
        inset-inline-start: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #0e3b64;
        font-size: 16px;
        line-height: 1;
        z-index: 2;
        pointer-events: none;
    }

    .legal-upload-group {
        margin-bottom: 16px !important;
    }

    .legal-label {
        margin-bottom: 12px !important;
    }

    .legal-upload-box {
        width: 100%;
        min-height: 136px;
        border: 2px dashed #e2e8f0;
        border-radius: 8px;
        background: #fff;
        padding: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: border-color 0.2s ease, background-color 0.2s ease;

        &:hover {
            border-color: rgba(14, 59, 100, 0.45);
            background: #fbfdff;
        }

        &.is-invalid {
            border-color: #e74c3c !important;
        }
    }

    .legal-upload-content {
        position: relative;
        z-index: 2;
        min-height: 72px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        pointer-events: none;
    }

    .legal-upload-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #eefbf6;
        color: #24b78f;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        margin-bottom: 12px;
    }

    .legal-upload-title {
        color: #0f2c4d;
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        text-align: center;
    }

    .legal-upload-hint {
        color: #4b5563;
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        text-align: center;
    }

    .legal-upload-box :deep(input[type="file"]) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 4;
    }

    .legal-upload-box :deep(.single-image) {
        position: absolute;
        inset: 12px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        pointer-events: none;
    }

    .legal-upload-box :deep(.images-container) {
        width: 100%;
        height: 100%;
    }

    .legal-upload-box :deep(.uploaded-block) {
        position: relative;
        z-index: 5;
        pointer-events: auto;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .legal-upload-box :deep(.uploaded-block img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .legal-upload-box :deep(.file-block) {
        max-width: 100%;
        padding: 16px;
        color: #0f2c4d;
        text-align: center;
    }

    .legal-upload-box :deep(.file-name) {
        max-width: 240px;
        margin: 8px 0 0;
        color: #4b5563;
        font-size: 12px;
        line-height: 18px;
        word-break: break-word;
    }

    .legal-upload-box :deep(.remove-btn) {
        position: absolute;
        top: 8px;
        inset-inline-start: 8px;
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        background: #e74c3c;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 6;
    }

    .step2-continue-btn {
        width: 100%;
        height: 48px;
        min-height: 48px;
        margin-top: 14px;
        border-radius: 8px;
        background: #0e3b64;
        border-color: #0e3b64;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
    }

    .step2-login-hint {
        color: #6b7280;
        font-size: 14px;
        line-height: 20px;
        margin-top: 24px !important;
        margin-bottom: 0;
    }

    .step2-login-hint a {
        color: #0e3b64 !important;
        font-weight: 500;
    }
}

@media (max-width: 576px) {
    .register-step-two-card,
    .register-step-three-card {
        padding: 28px 20px;
        border-radius: 18px;
    }

    .legal-docs-step .legal-upload-box {
        min-height: 150px;
        padding: 24px 16px;
    }
}
.step-three-auth-wrapper {
    width: min(448px, 100%);
    margin-top: 0 !important;
}

.register-step-three-card {
    width: min(448px, 100%);
    min-height: 672px;
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

.bank-account-step {
    width: 100%;
    direction: rtl;

    .step-three-heading {
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

    :deep(.form-group) {
        margin-bottom: 24px !important;
    }

    :deep(.label) {
        display: block;
        color: #000;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin-bottom: 16px;
        text-align: start;
    }

    :deep(.label-symbol) {
        color: #e63946;
        font-size: 14px;
        margin-inline-start: 0;
    }

    :deep(.main_input) {
        // width: 100%;
        // height: 60px !important;
        // min-height: 60px !important;
        // border: 1px solid #e2e8f0 !important;
        // border-radius: 8px !important;
        // background: #fff;
        // color: #0f172a;
        // font-size: 16px;
        // line-height: 24px;
        // box-shadow: none !important;
        padding: 18px 44px 18px 18px !important;
        text-align: start;
    }

    // :deep(.main_input::placeholder) {
    //     color: #94a3b8;
    //     font-size: 16px;
    // }

    .register-field-icon {
        position: absolute;
        inset-inline-start: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #0e3b64;
        font-size: 16px;
        line-height: 1;
        z-index: 2;
        pointer-events: none;
    }

    .step3-submit-btn {
        width: 100%;
        height: 60px;
        min-height: 60px;
        margin-top: 2px;
        border-radius: 8px;
        background: #0e3b64;
        border-color: #0e3b64;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
    }

    .step3-login-hint {
        color: #6b7280;
        font-size: 14px;
        line-height: 20px;
        margin-top: 28px !important;
        margin-bottom: 0;
    }

    .step3-login-hint a {
        color: #0e3b64 !important;
        font-weight: 500;
    }
}
@media (max-width: 576px) {
    .register-step-three-card {
        padding: 28px 20px;
        border-radius: 18px;
    }

    .bank-account-step :deep(.form-group) {
        margin-bottom: 20px !important;
    }

    .bank-account-step :deep(.main_input),
    .bank-account-step .step3-submit-btn {
        height: 54px !important;
        min-height: 54px !important;
    }
}
// Back Button Style (Circle Box matching screenshots)
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
        background-color: darken(#2C58A2, 8%);
        transform: translateY(-2px);
    }

    i {
        font-size: 16px;
    }
}

// Circular dashed logo avatar uploader
.avatar-uploader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;

    .avatar-uploader-circle {
        width: 110px;
        height: 110px;
        border: 2px dashed var(--main);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        background-color: #F8F9FA;
        transition: all 0.3s ease;
        &:hover {
            background-color: #F0F4F8;
            border-color: darken(#2C58A2, 10%);
        }

        .upload-icon {
            font-size: 24px;
            color: var(--main);
            pointer-events: none;
        }

        :deep(.single-image) {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;

            .uploaded-block {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .remove-btn {
                    width: 22px;
                    height: 22px;
                    font-size: 10px;
                    top: 2px;
                    left: 2px !important;
                    background-color: #e74c3c;
                    color: #fff;
                    z-index: 5;
                }
            }
        }

        :deep(input[type="file"]) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: 10;
        }
    }
}

// Step 2 custom upload overlay (matches input field design)
.upload-box-trigger {
    cursor: pointer;

    .special-input {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 10px;
        height: 48px;
        transition: border-color 0.3s ease;

        &.is-invalid {
            border-color: #e74c3c !important;
        }

        .main-cl {
            color: var(--main);
        }
    }

    :deep(.single-image) {
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;

        .uploaded-block {
            position: relative;
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px;

            }

            .remove-btn {
                position: absolute;
                top: 2px;
                left: 2px !important;
                width: 22px;
                height: 22px;
                font-size: 8px;
                background-color: #e74c3c;
                color: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                cursor: pointer;
            }
        }
    }

    :deep(input[type="file"]) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 48px;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
    }
}

.step2-layout {
    .form-group {
        margin-bottom: 20px !important;
    }

    :deep(.label),
    .label {
        font-size: 14px;
        font-weight: 500;
        line-height: 28px;
        color: #1a1a1a;
    }

    :deep(.label-symbol),
    .required-star {
        color: #d26062;
        margin-inline-start: 4px;
        font-size: 17px;
    }

    :deep(.main_input),
    .main_area {
        min-height: 48px;
        border-radius: 8px !important;
        border: 1px solid #ccc !important;
        padding: 14px 16px;
        font-size: 16px;
        line-height: 24px;
        color: #666;
        width: 100%;
    }

    .main_area {
        min-height: 124px;
        width: 100%;
        resize: none;
        outline: none;
        transition: border-color 0.3s ease;

        &:focus {
            border-color: var(--main) !important;
        }

        &.is-invalid {
            border-color: #e74c3c !important;
        }
    }

    .special-input {
        border-radius: 8px !important;
        border-color: #ccc !important;
    }

    :deep(.custom-dropdown) {
        min-height: 48px;
        border-radius: 8px !important;
        border-color: #ccc !important;
        width: 100%;
    }

    :deep(.p-dropdown-label),
    :deep(.p-select-label),
    :deep(.p-multiselect-label) {
        font-size: 16px;
        line-height: 24px;
        color: #666;
    }
}

.step2-continue-btn {
    width: 366px;
    max-width: 100%;
    height: 48px;
}

.step2-login-hint {
    margin-top: 22px !important;
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

    &:hover {
        color: #666;
    }
}

.with_cun_select.is-invalid {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
    border-radius: 8px;
}

.main_input.is-invalid {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}

.main_area {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 10px;
    resize: none;
    outline: none;
    font-size: 14px;

    &:focus {
        border-color: var(--main);
    }

    &.is-invalid {
        border-color: #e74c3c !important;
    }
}

.special-custom {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;

    :deep(.custum-dropdown) {
        width: 100%;
        height: 48px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0 12px;
        transition: all 0.3s ease;

        &:hover,
        &:focus-within {
            border-color: var(--main);
        }

        .p-dropdown-label,
        .p-select-label {
            padding: 0;
            font-size: 14px;
            color: #333;
            text-align: start;
            border: none;
            background: transparent;
        }

        .p-dropdown-trigger,
        .p-select-dropdown {
            width: auto;
            color: #999;
        }

        .p-inputtext {
            border: none;
            box-shadow: none;
            background: transparent;
        }
    }
}


.label-check {
    font-size: 14px;
    color: #666;
    user-select: none;
    cursor: pointer;
    font-weight: 500;
}

.terms-link {
    color: var(--main);
    text-decoration: underline;
    margin-inline-start: 4px;
}

.terms-dialog-desc {
    text-align: start;
    line-height: 2;
}

.form-check-input {
    width: 18px;
    height: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    accent-color: var(--main);
    transition: all 0.2s ease-in-out;
    margin: 0;

    &:checked {
        background-color: var(--main);
        border-color: var(--main);
    }

    &:focus {
        box-shadow: 0 0 0 0.2rem rgba(var(--main-rgb), 0.25);
    }
}
</style>
