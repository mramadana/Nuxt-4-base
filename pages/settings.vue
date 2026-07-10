<template>
  <div>
    <h4 class="main-title lg mb-5 page-title">
      <div class="container fs17 d-flex align-items-center justify-content-between">
        <div>
          <nuxt-link to="/"><i class="fas fa-home c-main"></i></nuxt-link>
          /
          <span v-if="currentView === 'menu'">{{ $t("Home.settings") }}</span>
          <span v-else>
            <span class="cursor-pointer" @click="currentView = 'menu'">{{
              $t("Home.settings")
            }}</span>
            /
            {{ $t("settings.profile_settings") }}
          </span>
        </div>
        <button v-if="currentView !== 'menu'" class="back-btn-link" @click="currentView = 'menu'">
          <i class="fas" :class="locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          {{ $t("Home.retreat") }}
        </button>
      </div>
    </h4>
    <div class="container profile-page">
      <!-- Settings Main Menu -->
      <div v-if="currentView === 'menu'" class="settings-menu-list col-md-6 mx-auto mb-5">
        <!-- Profile Settings -->
        <div class="settings-menu-item" @click="goToProfileTab('merchant')">
          <div class="item-right">
            <i class="fas fa-user menu-icon"></i>
            <span>{{ $t("settings.profile_settings") }}</span>
          </div>
          <i class="fas arrow-icon" :class="locale === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
        </div>

        <!-- Notifications -->
        <div class="settings-menu-item">
          <div class="item-right">
            <i class="fas fa-bell menu-icon"></i>
            <span>{{ $t("Global.notifications") }}</span>
          </div>
          <label class="switch">
            <input type="checkbox" :checked="isSelected" @change="toggleNotify" />
            <div class="slider round"></div>
          </label>
        </div>

        <!-- Mobile Number -->
        <div class="settings-menu-item" @click="openChangePhoneDialog">
          <div class="item-right">
            <i class="fas fa-mobile-alt menu-icon"></i>
            <span>{{ $t("Auth.mobile_number") }}</span>
          </div>
          <i class="fas arrow-icon" :class="locale === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
        </div>

        <!-- Password -->
        <div class="settings-menu-item" @click="changePasswordDialog = true">
          <div class="item-right">
            <i class="fas fa-lock menu-icon"></i>
            <span>{{ $t("Global.change_password") }}</span>
          </div>
          <i class="fas arrow-icon" :class="locale === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
        </div>

        <!-- Delete Account -->
        <div class="settings-menu-item delete-account-btn" @click="deleteAcount = true">
          <div class="item-right">
            <i class="fas fa-user-minus menu-icon"></i>
            <span>{{ $t("Global.delete_account") }}</span>
          </div>
        </div>
      </div>

      <!-- Profile Settings View (Tabs and contents) -->
      <div v-else>
        <!-- New Tabs and Sections -->
        <div v-if="currentTab !== 'phone'" class="settings-tabs mb-4">
          <button class="tab-btn" :class="{ active: currentTab === 'merchant' }" @click="currentTab = 'merchant'">
            {{ $t("settings.merchant_tab") }}
          </button>
          <button class="tab-btn" :class="{ active: currentTab === 'work' }" @click="currentTab = 'work'">
            {{ $t("settings.work_tab") }}
          </button>
          <button class="tab-btn" :class="{ active: currentTab === 'bank' }" @click="currentTab = 'bank'">
            {{ $t("settings.bank_tab") }}
          </button>
        </div>

        <!-- Merchant Tab -->
        <div v-if="currentTab === 'merchant'" class="settings-card col-md-6 mx-auto mb-5">
          <!-- Circular dashed avatar / Logo uploader -->
          <div class="avatar-uploader-wrapper">
            <div class="avatar-uploader-circle">
              <template v-if="!uploadedLogo">
                <i class="fa-solid fa-camera-rotate upload-icon"></i>
              </template>
              <ImgUploader ref="logoUploader" acceptedFiles="image/*" :newImages="uploadedLogo"
                :resetTrigger="resetImageTrigger" :showValidation="showValidation" :required="false"
                @uploaded-images-updated="updateUploadedLogo" />
            </div>
            <label class="label mt-2 text-center d-block mb-3">{{
              stepsTitle.merchant_logo
            }}</label>
          </div>

          <!-- Merchant Name (Arabic) -->
          <FormInput v-model:modelValue="name_ar" name="name[ar]" type="text" :label="stepsTitle.merchant_name_ar"
            :placeholder="stepsTitle.merchant_name_placeholder_ar" :validation-schema="validations.name_ar"
            :showErrors="showValidation" />

          <!-- Merchant Name (English) -->
          <FormInput v-model:modelValue="name_en" name="name[en]" type="text" :label="stepsTitle.merchant_name_en"
            :placeholder="stepsTitle.merchant_name_placeholder_en" :validation-schema="validations.name_en"
            :showErrors="showValidation" />

          <!-- Merchant Type (Dropdown) -->
          <CustomDropdown v-model="provider_type" :options="merchantTypes" option-value="id"
            :placeholder="stepsTitle.select_type" :label="stepsTitle.merchant_type" :showValidation="showValidation"
            :validation-schema="validations.provider_type" />

          <!-- Email -->
          <FormInput v-model:modelValue="email" name="email" type="email" :label="stepsTitle.email"
            :placeholder="stepsTitle.email_placeholder" :validation-schema="validations.email"
            :showErrors="showValidation" />

          <!-- City (Dropdown) -->
          <CustomDropdown v-model="city_id" :options="cities" option-value="id"
            :placeholder="stepsTitle.select_city" :label="stepsTitle.city" :showValidation="showValidation"
            :validation-schema="validations.city_id" />

          <!-- Save Changes Button -->
          <button type="button" class="custom-btn xl m-auto d-block mt-4" :disabled="loading" @click="saveMerchantTab">
            {{ $t("settings.save_changes") }}
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
          </button>
        </div>

        <!-- Business (Work) Tab -->
        <div v-if="currentTab === 'work'" class="settings-card col-md-6 mx-auto mb-5 step2-layout">
          <!-- Description (Arabic) -->
          <div class="form-group mb-4">
            <label class="label mb-2 d-block text-start">{{
              stepsTitle.description_ar
            }}</label>
            <div class="position-relative">
              <textarea v-model="description_ar" name="description[ar]" class="main_input main_area"
                :placeholder="stepsTitle.description_placeholder_ar" rows="4"
                :class="{ 'is-invalid': showValidation && !description_ar }"></textarea>
            </div>
            <p v-if="showValidation && !description_ar" class="error-message text-danger mt-1">
              {{
                locale === "ar" ? "هذا الحقل مطلوب" : "This field is required"
              }}
            </p>
          </div>

          <!-- Description (English) -->
          <div class="form-group mb-4">
            <label class="label mb-2 d-block text-start">{{
              stepsTitle.description_en
            }}</label>
            <div class="position-relative">
              <textarea v-model="description_en" name="description[en]" class="main_input main_area"
                :placeholder="stepsTitle.description_placeholder_en" rows="4"
                :class="{ 'is-invalid': showValidation && !description_en }"></textarea>
            </div>
            <p v-if="showValidation && !description_en" class="error-message text-danger mt-1">
              {{
                locale === "ar" ? "هذا الحقل مطلوب" : "This field is required"
              }}
            </p>
          </div>

          <!-- Identity Image Upload -->
          <div class="form-group mb-4">
            <label class="label mb-2 d-block text-start">
              {{ stepsTitle.identity_image }}
              <span class="required-star">*</span>
            </label>
            <div class="position-relative upload-box-trigger">
              <div class="main_input special-input d-flex align-items-center justify-content-between px-3" :class="{
                'is-invalid': showValidation && !uploadedIdentityImage,
              }">
                <span class="text-muted-custom">{{
                  stepsTitle.attach_images
                }}</span>
                <i class="fa-regular fa-copy fz-18 main-cl"></i>
              </div>
              <ImgUploader ref="identityUploader" acceptedFiles="image/*" :newImages="uploadedIdentityImage"
                :resetTrigger="resetImageTrigger" :showValidation="showValidation" :required="true"
                @uploaded-images-updated="updateUploadedIdentityImage" />
            </div>
            <p v-if="showValidation && !uploadedIdentityImage" class="error-message text-danger mt-1">
              {{
                locale === "ar"
                  ? "يرجى إرفاق صورة الهوية"
                  : "Identity image is required"
              }}
            </p>
          </div>

          <!-- Commercial Registration Number -->
          <FormInput v-model:modelValue="commercial_number" name="commercial_registration_number" type="text"
            :label="stepsTitle.cr_number" :placeholder="stepsTitle.cr_placeholder"
            :validation-schema="validations.commercial_number" :showErrors="showValidation" />

          <!-- Commercial Registration Image Upload -->
          <div class="form-group mb-4">
            <label class="label mb-2 d-block text-start">
              {{ stepsTitle.cr_image }}
              <span class="required-star">*</span>
            </label>
            <div class="position-relative upload-box-trigger">
              <div class="main_input special-input d-flex align-items-center justify-content-between px-3" :class="{
                'is-invalid': showValidation && !uploadedCommercialImage,
              }">
                <span class="text-muted-custom">{{
                  stepsTitle.attach_images
                }}</span>
                <i class="fa-regular fa-copy fz-18 main-cl"></i>
              </div>
              <ImgUploader ref="commercialUploader" acceptedFiles="image/*" :newImages="uploadedCommercialImage"
                :resetTrigger="resetImageTrigger" :showValidation="showValidation" :required="true"
                @uploaded-images-updated="updateUploadedCommercialImage" />
            </div>
            <p v-if="showValidation && !uploadedCommercialImage" class="error-message text-danger mt-1">
              {{
                locale === "ar"
                  ? "يرجى إرفاق صورة السجل التجاري"
                  : "Commercial Registration image is required"
              }}
            </p>
          </div>

          <!-- Main Section -->
          <div class="form-group mb-4 step2-field">
            <CustomDropdown v-model="main_section_id" :options="mainSectionOptions" option-value="id"
              :placeholder="stepsTitle.section_name" :label="stepsTitle.main_section" :showValidation="showValidation"
              :multiple="true" :maxSelectedLabels="3" />
          </div>

          <!-- Sub Section -->
          <div class="form-group mb-4 step2-field">
            <CustomDropdown v-model="sub_section_id" :options="subSectionOptions" option-value="id"
              :placeholder="stepsTitle.section_name" :label="stepsTitle.sub_section" :showValidation="showValidation"
              :multiple="true" :maxSelectedLabels="3" />
          </div>

          <!-- Save Changes Button -->
          <button type="button" class="custom-btn xl m-auto d-block mt-4" :disabled="loading" @click="saveWorkTab">
            {{ $t("settings.save_changes") }}
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
          </button>
        </div>

        <!-- Bank Tab -->
        <div v-if="currentTab === 'bank'" class="settings-card col-md-6 mx-auto mb-5">
          <!-- Bank Name -->
          <FormInput v-model:modelValue="bank_name" name="bank_name" type="text" :label="stepsTitle.bank_name"
            :placeholder="stepsTitle.bank_name_placeholder" :validation-schema="validations.bank_name"
            :showErrors="showValidation" />

          <!-- Account Holder Name -->
          <FormInput v-model:modelValue="account_name" name="bank_account_name" type="text"
            :label="stepsTitle.account_name" :placeholder="stepsTitle.account_name_placeholder"
            :validation-schema="validations.account_name" :showErrors="showValidation" />

          <!-- Account Number -->
          <FormInput v-model:modelValue="account_number" name="bank_account_number" type="text"
            :label="stepsTitle.account_number" :placeholder="stepsTitle.account_number_placeholder"
            :validation-schema="validations.account_number" :showErrors="showValidation" />

          <!-- IBAN Number -->
          <FormInput v-model:modelValue="iban" name="iban" type="text" :label="stepsTitle.iban"
            :placeholder="stepsTitle.iban_placeholder" :validation-schema="validations.iban"
            :showErrors="showValidation" />

          <!-- Save Changes Button -->
          <button type="button" class="custom-btn xl m-auto d-block mt-4" :disabled="loading" @click="saveBankTab">
            {{ $t("settings.save_changes") }}
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- chnage profile Data -->

    <Dialog v-model:visible="profileDialog" modal class="custum_dialog_width auth-daialog" :draggable="false">
      <div class="main-text center">
        <img src="@/assets/images/main-logo.svg" alt="login-logo" class="login-logo" loading="lazy" />
        <h1 class="main-title main-cl">{{ $t("Home.edit_my_data") }}</h1>
        <p class="main-desc">{{ $t("Home.profile_information") }}</p>
      </div>

      <form @submit.prevent="editProfile" ref="profileForm">
        <div class="form-group">
          <label class="label">
            {{ $t("Auth.username") }}
          </label>
          <div class="main_input">
            <input type="text" class="custum-input-icon validInputs" valid="name" name="name" v-model="name"
              :placeholder="$t('Auth.enter_username')" />
          </div>
        </div>

        <div class="form-group">
          <label class="label">
            {{ $t("Auth.city") }}
          </label>
          <div class="flex justify-content-center dropdown_card main_input special-custom">
            <Select v-model="city" :options="cities" filter :emptyMessage="$t('Home.no_available_options')"
              optionLabel="name" :emptyFilterMessage="$t('Home.emptyFilterMessage')"
              :placeholder="$t('Auth.select_city')" class="w-full md:w-14rem custum-dropdown" />
          </div>
        </div>

        <div class="form-group">
          <label class="label">
            {{ $t("Auth.email") }}
          </label>
          <div class="main_input">
            <input type="email" class="custum-input-icon validInputs" valid="email" name="email" v-model="email"
              :placeholder="$t('Auth.enter_email')" />
          </div>
        </div>

        <button type="submit" class="custom-btn md mr-auto" :disabled="loading">
          {{ $t("Global.Saving_changes") }}
          <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
        </button>
      </form>
    </Dialog>

    <!-- Change Password Dialog -->
    <Dialog v-model:visible="changePasswordDialog" modal class="custum_dialog_width auth-daialog" :draggable="false">
      <form @submit.prevent="submitChangePassword">
        <div class="text-center mb-3">
          <h3 class="main-title">{{ $t("Global.change_password") }}</h3>
        </div>
        <div class="form-group mb-3">
          <label class="label">{{ $t("settings.current_password") }}</label>
          <div class="main_input">
            <input type="password" class="custum-input-icon" v-model="oldPass" placeholder="********" />
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="label">{{ $t("Auth.new_password") }}</label>
          <div class="main_input">
            <input type="password" class="custum-input-icon" v-model="newPass" placeholder="********" />
          </div>
        </div>
        <div class="form-group mb-4">
          <label class="label">{{ $t("Auth.confirm_password_sm") }}</label>
          <div class="main_input">
            <input type="password" class="custum-input-icon" v-model="confirmPass" placeholder="********" />
          </div>
        </div>
        <button type="submit" class="custom-btn xl m-auto d-block" :disabled="loading">
          {{ $t("Global.confirm") }}
          <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
        </button>
      </form>
    </Dialog>

    <Dialog v-model:visible="changePhoneDialogVisible" modal class="custum_dialog_width auth-daialog md"
      :draggable="false" @hide="resetChangePhoneDialog">
      <form v-if="phoneStep === 1" @submit.prevent="submitOldPhoneCode">
        <div class="text-center">
          <h5 class="main-title main_color">{{ $t("Auth.activation_code") }}</h5>
          <p class="text-muted">
            {{ $t("settings.enter_otp_sent") }} {{ currentFullPhone }}
          </p>
        </div>
        <img src="@/assets/images/gif-img/OTP Verification Successful.gif" alt="image-Verification"
          class="img-done mx-auto d-block">
        <div class="layout-activate d-flex justify-content-center mb-3" dir="ltr">
          <v-otp-input ref="oldOtpInput" v-model:value="oldPhoneOtp" input-classes="otp-input mb-3" separator=" "
            :num-inputs="4" :should-auto-focus="true" :is-input-num="true" />
        </div>
        <div class="text-center mb-3 main-cl" v-if="countStatus">
          {{ $t("Auth.resend_code_in") }} {{ formattedCountdown }}
        </div>

        <button type="submit" class="custom-btn xl m-auto d-block" :disabled="loading">
          {{ $t("Global.confirm") }}
          <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
        </button>
        <div class="text-center mt-3">
          <span>{{ $t("Auth.havent_received_code") }}</span>
          <button type="button" class="btn-link" @click="resendPhoneCode" :disabled="countStatus || loading"
            :class="{ disabled: countStatus }">
            {{ $t("Auth.send_new_code") }}
          </button>
        </div>
      </form>

      <form v-else-if="phoneStep === 2" @submit.prevent="submitNewPhone">
        <div class="main_color mb-4">
          {{ $t("Global.change_mobile_number") }}
        </div>
        <div class="form-group mb-4">
          <label class="label">{{ $t("settings.new_phone_number") }}</label>
          <div class="with_cun_select">
            <div class="main_input">
              <input type="number" class="custum-input-icon" v-model="newPhone"
                :placeholder="$t('Auth.please_mobile_number')" />
            </div>
          </div>
        </div>
        <button type="submit" class="custom-btn xl m-auto d-block" :disabled="loading">
          {{ $t("Global.confirm") }}
          <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
        </button>
      </form>

      <form v-else-if="phoneStep === 3" @submit.prevent="submitNewPhoneCode">
        <div class="text-center">
          <h5 class="main-title">{{ $t("Auth.activation_code") }}</h5>
          <p class="text-muted">
            {{ $t("settings.enter_otp_sent") }} {{ fullNewPhone }}
          </p>
        </div>
        <img src="@/assets/images/gif-img/OTP Verification Successful.gif" alt="image-Verification"
          class="img-done mx-auto d-block">
        <div class="layout-activate d-flex justify-content-center mb-3" dir="ltr">
          <v-otp-input ref="newOtpInput" v-model:value="newPhoneOtp" input-classes="otp-input mb-3" separator=" "
            :num-inputs="4" :should-auto-focus="true" :is-input-num="true" />
        </div>
        <div class="text-center mb-3 main-cl" v-if="countStatus">
          {{ $t("Auth.resend_code_in") }} {{ formattedCountdown }}
        </div>

        <button type="submit" class="custom-btn xl m-auto d-block" :disabled="loading">
          {{ $t("Global.confirm") }}
          <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
        </button>
        <div class="text-center mt-3">
          <span>{{ $t("Auth.havent_received_code") }}</span>
          <button type="button" class="btn-link" @click="resendPhoneCode" :disabled="countStatus || loading"
            :class="{ disabled: countStatus }">
            {{ $t("Auth.send_new_code") }}
          </button>
        </div>
      </form>
    </Dialog>

    <!-- deleteAcount Dialog -->
    <Dialog v-model:visible="deleteAcount" modal class="custum_dialog_width" :draggable="false">
      <div class="text-center">
        <img src="@/assets/images/noun_warning.svg" loading="lazy" alt="check-img" class="check-img" />
        <h1 class="main-title bold mb-4">
          {{ $t("Global.sure_delete_account") }}
        </h1>
        <div class="section-btns mt-5">
          <button type="button" class="custom-btn logout sm d-inline-flex" @click="deletedAcount" :disabled="loading">
            {{ $t("Auth.confirmation") }}
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
          </button>
          <button type="button" class="custom-btn cancel sm d-inline-flex" @click="deleteAcount = false">
            {{ $t("Home.retreat") }}
          </button>
        </div>
      </div>
    </Dialog>

    <!-- Success Dialog -->
    <Dialog v-model:visible="successDialogVisible" modal :draggable="false"
      class="custum_dialog_width auth-daialog without-close">
      <div class="success-wrap">
        <div class="success-icon-container text-center">
          <img src="@/assets/images/gif-img/Done.gif" alt="" class="img-done" />
        </div>

        <p class="success-text text-center mb-3">{{ successDialogMessage }}</p>

        <button type="button" class="custom-btn w-100" @click="handleSuccessContinue">
          {{ $t("followers.follow") }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Home.settings",
  authIsRequired: true,
  middleware: "auth",
});

const successDialogVisible = ref(false);
const successDialogMessage = ref("تم تغيير البيانات بنجاح");
const handleSuccessContinue = () => {
  successDialogVisible.value = false;
};

// import otp
import VOtpInput from "vue3-otp-input";
// pinia store
import { useAuthStore } from "~/stores/auth";

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n({ useScope: "global" });

const { response } = responseApi();

const { successToast, errorToast } = toastMsg();

const axios = useApi();

const store = useAuthStore();

const { deleteAccountHandler, profileHandler } = store;

const { token, newPhone, user } = storeToRefs(store);

const loading = ref(false);
// New tabs
const currentTab = ref("merchant");
const currentView = ref("menu"); // 'menu' or 'profile'

const goToProfileTab = async (tabName) => {
  currentTab.value = tabName;
  currentView.value = "profile";
};

const changePhoneDialogVisible = ref(false);
const openChangePhoneDialog = async () => {
  changePhoneDialogVisible.value = true;
  await startChangePhoneFlow();
};

// ===== Form fields for merchant/work/bank tabs =====
const showValidation = ref(false);
const resetImageTrigger = ref(0);

const name_ar = ref("");
const name_en = ref("");
const provider_type = ref("");
const description_ar = ref("");
const description_en = ref("");
const commercial_number = ref("");
const main_section_id = ref([]);
const sub_section_id = ref([]);
const bank_name = ref("");
const account_name = ref("");
const account_number = ref("");
const iban = ref("");

// Upload refs
const logoUploader = ref(null);
const identityUploader = ref(null);
const commercialUploader = ref(null);
const uploadedLogo = ref(null);
const uploadedIdentityImage = ref(null);
const uploadedCommercialImage = ref(null);

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
const mainSectionOptions = ref([]);
const subSectionOptions = ref([]);

const merchantTypes = computed(() => [
  { name: t("Auth.individual"), id: "freelancer" },
  { name: t("Auth.company"), id: "company" },
]);

// Validations (safe fallback if composable not available)
const validations = ref({
  name_ar: null,
  name_en: null,
  provider_type: null,
  email: null,
  city_id: null,
  description_ar: null,
  description_en: null,
  commercial_number: null,
  main_section_id: null,
  sub_section_id: null,
  bank_name: null,
  account_name: null,
  account_number: null,
  iban: null,
});

// Try to use validation composables if available
try {
  const validationSchema = useValidationSchema();
  const { isFormValid, scrollToFirstError } = useFormValidation();
  if (validationSchema) {
    validations.value = {
      name_ar: validationSchema.customerName?.("Auth.merchant_name_ar"),
      name_en: validationSchema.customerName?.("Auth.merchant_name_en"),
      provider_type: validationSchema.required?.("Auth.merchant_type"),
      email: validationSchema.email?.("Auth.email"),
      city_id: validationSchema.required?.("Auth.city"),
      description_ar: validationSchema.required?.("Auth.description_ar"),
      description_en: validationSchema.required?.("Auth.description_en"),
      commercial_number: validationSchema.commerciaRumber?.("Auth.cr_number"),
      main_section_id: validationSchema.required?.("Auth.main_section"),
      sub_section_id: validationSchema.required?.("Auth.sub_section"),
      bank_name: validationSchema.bankName?.("Auth.bank_name"),
      account_name: validationSchema.accountHolderName?.("Auth.account_name"),
      account_number: validationSchema.accountNumber?.("Auth.account_number"),
      iban: validationSchema.iban?.("Auth.iban"),
    };
  }
} catch (e) {
  console.warn("Validation schema not available", e);
}

// stepsTitle computed - all labels used in the template
const stepsTitle = computed(() => ({
  title: t("Auth.register_title"),
  merchant_logo: locale.value === "ar" ? "شعار التاجر" : "Merchant Logo",
  merchant_name_ar:
    locale.value === "ar" ? "اسم التاجر" : "Merchant Name (Arabic)",
  merchant_name_placeholder_ar:
    locale.value === "ar" ? "ادخل اسم التاجر" : "Enter Merchant Name",
  merchant_name_en:
    locale.value === "ar" ? "اسم التاجر بالانجليزي" : "Merchant Name (English)",
  merchant_name_placeholder_en:
    locale.value === "ar" ? "ادخل اسم التاجر" : "Enter Merchant Name",
  merchant_type: locale.value === "ar" ? "نوع التاجر" : "Merchant Type",
  select_type: locale.value === "ar" ? "اختر النوع" : "Select Type",
  email: t("Auth.email"),
  email_placeholder: "example@gmail.com",
  city: t("Auth.city"),
  select_city: locale.value === "ar" ? "اختر المدينة" : "Select City",
  description_ar: locale.value === "ar" ? "الوصف" : "Description (Arabic)",
  description_placeholder_ar:
    locale.value === "ar" ? "ادخل الوصف" : "Enter Description",
  description_en:
    locale.value === "ar" ? "الوصف بالانجليزي" : "Description (English)",
  description_placeholder_en:
    locale.value === "ar" ? "ادخل الوصف" : "Enter Description",
  identity_image: locale.value === "ar" ? "صورة الهوية" : "Identity Image",
  cr_number:
    locale.value === "ar"
      ? "رقم السجل التجاري"
      : "Commercial Registration Number",
  cr_placeholder:
    locale.value === "ar" ? "ادخل رقم السجل التجاري" : "Enter CR Number",
  cr_image:
    locale.value === "ar"
      ? "صورة السجل التجاري"
      : "Commercial Registration Image",
  attach_images: locale.value === "ar" ? "إرفاق صور" : "Attach Images",
  main_section: locale.value === "ar" ? "القسم الرئيسي" : "Main Section",
  sub_section: locale.value === "ar" ? "القسم الفرعي" : "Sub Section",
  section_name: locale.value === "ar" ? "اسم القسم" : "Section Name",
  bank_name: locale.value === "ar" ? "اسم البنك" : "Bank Name",
  bank_name_placeholder:
    locale.value === "ar" ? "ادخل اسم البنك" : "Enter Bank Name",
  account_name:
    locale.value === "ar" ? "اسم صاحب الحساب" : "Account Holder Name",
  account_name_placeholder:
    locale.value === "ar"
      ? "ادخل اسم صاحب الحساب"
      : "Enter Account Holder Name",
  account_number: locale.value === "ar" ? "رقم الحساب" : "Account Number",
  account_number_placeholder: "1234 5497 3654 4987",
  iban: locale.value === "ar" ? "رقم الايبان" : "IBAN Number",
  iban_placeholder: "12345678",
}));

// Fetch main/sub sections
const allCategoriesWithSubs = ref([]);

const getMainSections = async () => {
  try {
    const res = await axios.get(`main-categories?lang=${locale.value || "ar"}`);
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
  mainIds.forEach((mainId) => {
    const found = allCategoriesWithSubs.value.find((c) => c.id === mainId);
    if (found && found.subCategories?.length) {
      allSubs.push(...found.subCategories);
    }
  });
  subSectionOptions.value = allSubs;
  // Keep only sub_section_id values that exist in new options
  sub_section_id.value = sub_section_id.value.filter((id) =>
    allSubs.some((sub) => sub.id === id),
  );
};

watch(main_section_id, (newVal) => {
  getSubSections(newVal);
});

// Save tab functions
const saveMerchantTab = async () => {
  showValidation.value = true;
  await updateProfile();
};

const saveWorkTab = async () => {
  showValidation.value = true;
  if (!uploadedIdentityImage.value) {
    return errorToast(
      locale.value === "ar"
        ? "يرجى إرفاق صورة الهوية"
        : "Identity image is required",
    );
  }
  if (!uploadedCommercialImage.value) {
    return errorToast(
      locale.value === "ar"
        ? "يرجى إرفاق صورة السجل التجاري"
        : "Commercial Registration image is required",
    );
  }
  await updateProfile();
};

const saveBankTab = async () => {
  showValidation.value = true;
  await updateProfile();
};

// Inline profile form
const profileInlineForm = ref(null);
const profileImage = ref(null);
const profileImagePreview = ref("");

const onSelectProfileImage = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  profileImage.value = f;
  const reader = new FileReader();
  reader.onload = () => (profileImagePreview.value = reader.result);
  reader.readAsDataURL(f);
};

// Get Profile Data
const getProfile = async () => {
  try {
    const res = await axios.get("provider/profile", config.value);
    if (response(res) === "success") {
      const data = res.data.data;

      // Merchant Tab
      name_ar.value = data.name?.ar || "";
      name_en.value = data.name?.en || "";
      provider_type.value = data.type?.name || "";
      email.value = data.email || "";
      city_id.value = data.city?.id || null;
      uploadedLogo.value = data.image || null;

      // Work Tab
      description_ar.value = data.description?.ar || "";
      description_en.value = data.description?.en || "";
      commercial_number.value = data.commercial_number || "";
      uploadedIdentityImage.value = data.identity_image || null;
      uploadedCommercialImage.value = data.commercial_image || null;

      // Categories - load all selected
      if (data.main_categories?.length) {
        main_section_id.value = data.main_categories.map((cat) => cat.id);
        // Trigger sub-categories load
        if (main_section_id.value.length > 0) {
          getSubSections(main_section_id.value);
        }
      }
      if (data.sub_categories?.length) {
        sub_section_id.value = data.sub_categories.map((cat) => cat.id);
      }

      // Bank Tab
      if (data.bank_account_info) {
        bank_name.value = data.bank_account_info.bank_name || "";
        account_name.value = data.bank_account_info.bank_account_name || "";
        account_number.value = data.bank_account_info.bank_account_number || "";
        iban.value = data.bank_account_info.iban || "";
      }
    }
  } catch (err) {
    console.error("Get profile error:", err);
  }
};

const updateProfile = async () => {
  loading.value = true;
  const fd = new FormData();

  // Merchant Tab fields
  if (currentTab.value === "merchant") {
    if (name_ar.value) fd.append("name[ar]", name_ar.value);
    if (name_en.value) fd.append("name[en]", name_en.value);
    if (email.value) fd.append("email", email.value);
    if (city_id.value) fd.append("city_id", city_id.value);
    if (provider_type.value)
      fd.append("type", provider_type.value === "company" ? "1" : "0");
    if (uploadedLogo.value instanceof File)
      fd.append("image", uploadedLogo.value);
  }

  // Work Tab fields
  if (currentTab.value === "work") {
    if (description_ar.value)
      fd.append("description[ar]", description_ar.value);
    if (description_en.value)
      fd.append("description[en]", description_en.value);
    if (commercial_number.value)
      fd.append("commercial_number", commercial_number.value);
    if (uploadedIdentityImage.value instanceof File)
      fd.append("identity_image", uploadedIdentityImage.value);
    if (uploadedCommercialImage.value instanceof File)
      fd.append("commercial_image", uploadedCommercialImage.value);

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
  }

  // Bank Tab fields
  if (currentTab.value === "bank") {
    if (bank_name.value) fd.append("bank_name", bank_name.value);
    if (account_name.value) fd.append("bank_account_name", account_name.value);
    if (account_number.value)
      fd.append("bank_account_number", account_number.value);
    if (iban.value) fd.append("iban", iban.value);
  }

  try {
    const res = await axios.post(
      "provider/update-profile?_method=PUT",
      fd,
      config.value,
    );
    if (response(res) === "success") {
      successToast(res.data.msg);
      successDialogMessage.value = "تم تغيير البيانات بنجاح";
      successDialogVisible.value = true;
      setTimeout(() => {
        successDialogVisible.value = false;
        currentView.value = "menu";
      }, 1500);
      // Update store user data
      if (res.data.data) {
        user.value = res.data.data;
      }
      // Refresh profile data
      // await getProfile();
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    console.error("Update profile error:", err);
    errorToast(err?.response?.data?.msg || t("Auth.api_error"));
  } finally {
    loading.value = false;
  }
};

// Change password dialog
const changePasswordDialog = ref(false);
const oldPass = ref("");
const newPass = ref("");
const confirmPass = ref("");
const submitChangePassword = async () => {
  if (!oldPass.value || !newPass.value || !confirmPass.value)
    return errorToast(t("validation.fill_all_fields"));
  if (newPass.value !== confirmPass.value)
    return errorToast(t("validation.confirm_password_mismatch"));
  loading.value = true;
  const fd = new FormData();
  fd.append("old_password", oldPass.value);
  fd.append("password", newPass.value);
  fd.append("password_confirmation", confirmPass.value);
  await axios
    .post("provider/update-password?_method=patch", fd, config.value)
    .then((res) => {
      if (response(res) == "success") {
        successToast(res.data.msg);
        changePasswordDialog.value = false;
        oldPass.value = newPass.value = confirmPass.value = "";
      } else {
        errorToast(res.data.msg);
      }
      loading.value = false;
    })
    .catch((err) => {
      console.error(err);
      loading.value = false;
    });
};

// Change phone flow (inside /settings only)
const phoneStep = ref(1);
const oldPhoneOtp = ref("");
const newPhoneOtp = ref("");
const countStatus = ref(false);
const countDown = ref(60);
const otpStepType = ref(1); // 1 => old phone, 2 => new phone
const oldOtpInput = ref(null);
const newOtpInput = ref(null);
let countInterval = null;

const normalizeCountryCode = (value) =>
  (value || "966").toString().replace("+", "");
const currentFullPhone = computed(
  () =>
    `${user.value?.phone || phone.value || ""} +${normalizeCountryCode(user.value?.country_code || selectedCountry.value?.key)}`,
);
const fullNewPhone = computed(
  () =>
    ` ${newPhone.value || ""} +${normalizeCountryCode(selectedCountry.value?.key)}`,
);
const formattedCountdown = computed(() => {
  const seconds = String(countDown.value).padStart(2, "0");
  return `00.${seconds}`;
});

const clearOtpTimer = () => {
  if (countInterval) {
    clearInterval(countInterval);
    countInterval = null;
  }
  countStatus.value = false;
  countDown.value = 60;
};

const startOtpTimer = (type = 1) => {
  clearOtpTimer();
  otpStepType.value = type;
  countStatus.value = true;
  countDown.value = 60;
  countInterval = setInterval(() => {
    countDown.value -= 1;
    if (countDown.value <= 0) {
      clearOtpTimer();
    }
  }, 1000);
};

const startChangePhoneFlow = async () => {
  phoneStep.value = 1;
  oldPhoneOtp.value = "";
  newPhone.value = "";
  newPhoneOtp.value = "";
  await sendCodeToOldPhone();
};

const resetChangePhoneDialog = () => {
  clearOtpTimer();
  phoneStep.value = 1;
  oldPhoneOtp.value = "";
  newPhoneOtp.value = "";
};

const sendCodeToOldPhone = async () => {
  loading.value = true;
  const fd = new FormData();
  fd.append(
    "country_code",
    normalizeCountryCode(
      user.value?.country_code || selectedCountry.value?.key,
    ),
  );
  fd.append("phone", user.value?.phone || phone.value || "");

  try {
    const res = await axios.post(
      "provider/change-phone-send-code-to-old-phone",
      fd,
      config.value,
    );
    if (response(res) === "success") {
      successToast(res.data.msg);
      startOtpTimer(1);
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    errorToast(err?.response?.data?.msg || t("Auth.api_error"));
  } finally {
    loading.value = false;
  }
};

const submitOldPhoneCode = async () => {
  if (!oldPhoneOtp.value)
    return errorToast(t("validation.enter_activation_code"));
  loading.value = true;
  const fd = new FormData();
  fd.append("code", oldPhoneOtp.value);

  try {
    const res = await axios.post(
      "provider/change-phone-old-phone-check-code",
      fd,
      config.value,
    );
    if (response(res) === "success") {
      successToast(res.data.msg);
      phoneStep.value = 2;
      clearOtpTimer();
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    errorToast(err?.response?.data?.msg || t("Auth.api_error"));
  } finally {
    loading.value = false;
  }
};

const submitNewPhone = async () => {
  if (!newPhone.value || !selectedCountry.value?.key)
    return errorToast(t("validation.enter_phone"));
  loading.value = true;
  const fd = new FormData();
  fd.append("country_code", normalizeCountryCode(selectedCountry.value.key));
  fd.append("phone", newPhone.value);

  try {
    const res = await axios.post(
      "provider/change-phone-send-code-to-new-phone",
      fd,
      config.value,
    );
    if (response(res) === "success") {
      successToast(res.data.msg);
      phoneStep.value = 3;
      newPhoneOtp.value = "";
      startOtpTimer(2);
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    errorToast(err?.response?.data?.msg || t("Auth.api_error"));
  } finally {
    loading.value = false;
  }
};

const submitNewPhoneCode = async () => {
  if (!newPhoneOtp.value)
    return errorToast(t("validation.enter_activation_code"));
  loading.value = true;
  const fd = new FormData();
  fd.append("code", newPhoneOtp.value);
  fd.append("country_code", normalizeCountryCode(selectedCountry.value?.key));
  fd.append("phone", newPhone.value);

  try {
    const res = await axios.post(
      "provider/change-phone-new-phone-check-code",
      fd,
      config.value,
    );
    if (response(res) === "success") {
      successToast(res.data.msg);
      if (res.data?.data?.phone) {
        phone.value = res.data.data.phone;
      } else {
        phone.value = newPhone.value;
      }
      if (user.value) {
        user.value.phone = phone.value;
        user.value.country_code = normalizeCountryCode(
          selectedCountry.value?.key,
        );
      }
      clearOtpTimer();
      phoneStep.value = 1;
      oldPhoneOtp.value = "";
      newPhone.value = "";
      newPhoneOtp.value = "";
      changePhoneDialogVisible.value = false;
      successDialogMessage.value = "تم تغيير رقم الجوال بنجاح";
      successDialogVisible.value = true;
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    errorToast(err?.response?.data?.msg || t("Auth.api_error"));
  } finally {
    loading.value = false;
  }
};

const resendPhoneCode = async () => {
  if (countStatus.value) return;

  const fd = new FormData();
  fd.append("type", otpStepType.value === 1 ? "1" : "2");
  if (otpStepType.value === 2) {
    fd.append("country_code", normalizeCountryCode(selectedCountry.value?.key));
    fd.append("phone", newPhone.value || "");
  }

  try {
    const res = await axios.post(
      "provider/change-phone-re-send-code",
      fd,
      config.value,
    );
    if (response(res) === "success") {
      successToast(res.data.msg);
      startOtpTimer(otpStepType.value);
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    errorToast(err?.response?.data?.msg || t("Auth.api_error"));
  }
};

const profileForm = ref(null);

const profileDialog = ref(false);

const errors = ref([]);

const deleteAcount = ref(false);

// variables of city

const city = ref(null);

const cities = ref([]);

const city_id = ref(null);

const email = ref("");

const isLoadingProfile = ref(false);

// change phone variable

// countries
const selectedCountry = ref({
  key: "966",
  id: 1,
  image: "https://flagcdn.com/w40/sa.png",
  name: "Saudi Arabia",
});
const countries = ref([{ ...selectedCountry.value }]);

const name = ref(null);

const phone = ref(null);

const isSelected = ref(false);

// config
const config = computed(() => {
  return { headers: { Authorization: `Bearer ${token.value}` } };
});

// Validation Function
function validate() {
  let allInputs = document.querySelectorAll(".validInputs");
  for (let i = 0; i < allInputs.length; i++) {
    const input = allInputs[i];
    const inputValue = input.value.trim();
    const validType = input.getAttribute("valid");

    // Check if empty
    if (inputValue === "") {
      errors.value.push(t(`validation.${validType}`));
    } else if (validType === "email") {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        errors.value.push(t(`validation.email_format`));
      }
    }
  }
}

// Get All cities
const getCities = async () => {
  await axios
    .get("cities")
    .then((res) => {
      if (response(res) == "success") {
        cities.value = res.data.data;

        for (let i = 0; i < cities.value.length; i++) {
          if (cities.value[i].id == city_id.value) {
            city.value = cities.value[i];
          }
        }
      }
    })
    .catch((err) => console.log(err));
};

//  get profile data
const profileData = async () => {
  await axios
    .get("user/profile", config.value)
    .then((res) => {
      const data = res.data.data;
      name.value = data.name;
      name_ar.value = data.name_ar || data.name || "";
      name_en.value = data.name_en || data.name || "";
      provider_type.value = data.provider_type || "";
      city_id.value = data.city?.id;
      // pick from list if available, otherwise fallback to API object
      city.value =
        (cities.value || []).find((c) => c.id == city_id.value) ||
        data.city ||
        null;
      phone.value = data.phone;
      email.value = data.email;

      description_ar.value = data.description_ar || data.description || "";
      description_en.value = data.description_en || data.description || "";
      commercial_number.value =
        data.commercial_registration_number || data.commercial_number || "";
      main_section_id.value =
        data.main_section?.id || data.main_section_id || null;
      sub_section_id.value =
        data.sub_section?.id || data.sub_section_id || null;

      bank_name.value = data.bank_name || "";
      account_name.value = data.bank_account_name || data.account_name || "";
      account_number.value =
        data.bank_account_number || data.account_number || "";
      iban.value = data.iban || "";

      uploadedLogo.value = data.image || null;
      uploadedIdentityImage.value = data.identity_image || null;
      uploadedCommercialImage.value =
        data.commercial_registration_image || null;

      if (selectedCountry.value && data.country_code) {
        selectedCountry.value.key = normalizeCountryCode(data.country_code);
      }
    })
    .catch((err) => console.log(err));
};

// update profile
const editProfile = async () => {
  loading.value = true;
  const fd = new FormData(profileInlineForm.value);

  if (city.value) {
    fd.append("city_id", city.value.id);
  }

  validate();

  try {
    // Get Returned Data From Store
    const res = await profileHandler(fd);
    if (res.status == "success") {
      successToast(res.msg);
      profileDialog.value = false;
    } else {
      errorToast(res.msg);
    }
  } catch (err) {
    console.error(err);
    errorToast(err.response?.data?.msg || "حدث خطأ");
  } finally {
    loading.value = false;
  }
};

// Delete Account
const deletedAcount = async () => {
  loading.value = true;

  try {
    // Get Returned method From Store
    const res = await deleteAccountHandler();
    if (res.status == "success") {
      successToast(res.msg);
      deleteAcount.value = false;
      localStorage.clear();
      navigateTo("/Auth/register")
    } else {
      errorToast(res.msg);
    }
  } finally {
    loading.value = false;
  }
};

// toggleNotify
const toggleNotify = async (e) => {
  const newValue = e.target.checked;

  try {
    if (!token.value) return errorToast("User not authenticated");

    const res = await axios.patch("provider/switch-notify", {}, config.value);

    if (res.data.key === "success") {
      isSelected.value = res.data.data.notify;
      localStorage.setItem("notify", isSelected.value.toString());
      successToast(res.data.msg);
    } else {
      errorToast(res.data.msg);
    }
  } catch (err) {
    console.error(err);
    errorToast("حدث خطأ أثناء الاتصال بالسيرفر");
  }
};

// initializeNotificationSettings
const initializeNotificationSettings = () => {
  const stored = localStorage.getItem("notify");
  if (stored !== null) {
    isSelected.value = stored === "true";
  }
};

// Watch isSelected to save to localStorage
watch(isSelected, (newValue) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("notify", newValue.toString());
  }
});

watch(currentView, (view) => {
  if (view === "menu") {
    clearOtpTimer();
    phoneStep.value = 1;
    oldPhoneOtp.value = "";
    newPhoneOtp.value = "";
  }
});

onBeforeUnmount(() => {
  clearOtpTimer();
});

onMounted(async () => {
  await getCities();
  await getMainSections();
  await getProfile();
  await profileData();

  initializeNotificationSettings();
});

watch(
  () => profileDialog.value,
  async (newVal) => {
    if (newVal === true) {
      isLoadingProfile.value = true;
      await profileData();
      await getCities();

      isLoadingProfile.value = false;
    }
  },
);
</script>

<style lang="scss" scoped>
.settings-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  background: #e3e3e3;
  border-radius: 4px;
  padding: 10px;
  max-width: 560px;
  margin: 0 auto 16px;
}

.tab-btn {
  flex: 1;
  min-width: 110px;
  height: 35px;
  padding: 0 16px;
  border-radius: 4px;
  background: transparent;
  border: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  color: #2f2f2f;
  text-align: center;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #2f5fa9;
  color: #fff;
  box-shadow: none;
}

.settings-card {
  background: #f5f7f9;
  border-radius: 26px;
  padding: 40px 28px;
  border: 1px solid #eef0f2;
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  border: 3px solid #e8e8e8;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-avatar.uploader .camera-btn {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: #fff;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid #ddd;
  color: var(--main);
}

.profile-avatar.uploader input[type="file"] {
  display: none;
}

.otp-input {
  width: 54px !important;
  height: 54px !important;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: center;
  font-size: 20px;
  margin: 0 6px;
  outline: none;
}

.otp-input:focus {
  border-color: var(--main);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
}

.btn-link {
  background: transparent;
  border: 0;
  color: var(--main);
  cursor: pointer;
}

.btn-link.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: 0.3s;
  border: none;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: none;
}

input:checked+.slider {
  background-color: var(--main);
}

input:checked+.slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.settings-menu-list {
  background: #fff;
  border-radius: 20px;
  padding: 10px 15px;
  border: 1px solid #f0f2f5;
  max-width: 600px;
  margin: 0 auto;
}

.settings-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  // &:hover {
  //   background-color: #fafbfe;
  //   border-radius: 12px;
  // }

  .item-right {
    display: flex;
    align-items: center;
    gap: 16px;

    span {
      font-size: 16px;
      font-weight: 500;
      color: #1a202c;
    }
  }

  .menu-icon {
    font-size: 20px;
    color: var(--main);
    width: 24px;
    display: flex;
    justify-content: center;
  }

  .arrow-icon {
    font-size: 14px;
    color: #a0aec0;
    transition: transform 0.2s ease;
  }

  &.delete-account-btn {
    border-bottom: none;

    .menu-icon {
      color: #f25f5f;
    }

    .item-right span {
      color: #f25f5f;
      font-weight: 600;
    }
  }
}

.back-btn-link {
  font-size: 15px;
  font-weight: 500;
  color: var(--main);
  border: none;
  background: none;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  cursor: pointer;
}

.back-btn-link:hover {
  color: var(--main);
  opacity: 0.8;
}

.cursor-pointer {
  cursor: pointer;
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
    width: 100%;
  }

  // :deep(.p-dropdown-label),
  // :deep(.p-multiselect-label) {
  //     font-size: 16px;
  //     line-height: 24px;
  //     color: #666;
  // }
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
    background-color: #f8f9fa;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f0f4f8;
      border-color: darken(#2c58a2, 10%);
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

.text-muted {
  font-size: 14px;
}
</style>
