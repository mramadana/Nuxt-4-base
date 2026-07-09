<template>
  <div class="container_layout">

    <form @submit.prevent="forgetPassword" ref="forgetForm">
      <h1 class="main-title bold mb-3 main_color">{{ $t("Global.change_mobile_number") }}</h1>
      <div class="row">
        <div class="col-12 col-md-11 mr-auto">
          <FormInput v-model:modelValue="phone" name="phone" type="number" :label="$t('Auth.mobile_number')"
            :placeholder="$t('Auth.enter_mobile_number')" :validation-schema="validations.phone"
            :showErrors="showValidation" />

          <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
            &#1578;&#1581;&#1602;&#1602;
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>

definePageMeta({
  name: "Auth.change_phone",
  layout: 'auth',
    customBackHandler: true,
  // hideHeader: true,
});

/******************* Plugins *******************/
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n({ useScope: 'global' });

// Validation schemas
const { phoneNumber } = useValidationSchema();
const validations = {
  phone: phoneNumber('Auth.mobile_number')
};

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

/******************* Data *******************/

const forgetForm = ref(null);
const phone = ref('');
const loading = ref(false);
const showValidation = ref(false);

// Form data (reactive object for validation)
const formData = computed(() => ({
  phone: phone.value
}));

// use the composable for the validation - exactly like your example
const { isFormValid, scrollToFirstError } = useFormValidation();



/******************* Methods *******************/

const handleBack = () => {
  if (process.client && window.history.length > 1) {
    window.history.back();
    return;
  }

  navigateTo('/Auth/login');
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



// forgetPassword Function
const forgetPassword = async () => {
  showValidation.value = true;

  const isValid = isFormValid(formData.value, validations);
  console.log('Is Valid:', isValid);

  if (!isValid) {
    // if the validation fails, scroll to first error
    scrollToFirstError(formData.value, validations);
    console.log("22222222222");
  } else {
    console.log("11111111111 - Validation Passed");
    loading.value = true;

    try {
      const fd = new FormData(forgetForm.value);
      fd.append('country_code', '966');

      const res = await axios.post('provider/forget-password-send-code', fd);

      if (response(res) === "success") {
        // Store phone and country_id in localStorage for next page
        localStorage.setItem('forgetPasswordPhone', phone.value);
        localStorage.setItem('forgetPasswordCountryId', '');
        
        successToast(res.data.msg);
        // Reset form on success
        phone.value = '';
        showValidation.value = false;
        navigateTo('/Auth/restorePassword-check-code');
      } else {
        errorToast(res.data.msg);
      }
    } catch (error) {
      console.error('Forget Password error:', error);
      errorToast(t('Auth.error_occurred'));
    } finally {
      loading.value = false;
    }
  }
};

</script>

<style scoped>
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
</style>

