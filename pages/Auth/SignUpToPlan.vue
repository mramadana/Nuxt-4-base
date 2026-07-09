<template>
  <div class="subscriptions-page" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="subscriptions-wrapper">
      <img src="@/assets/images/Logo.svg" alt="logo" class="brand-logo" />
      <h1 class="page-title">{{ $t('Packages.subscribe_to_plan') }}</h1>
      <p class="page-subtitle">{{ $t('Packages.please_choose_suitable_plan') }}</p>

      <!-- Loading State -->
      <div v-if="loadingPackages" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>{{ $t('Packages.loading_packages') }}</p>
      </div>

      <!-- Packages Grid -->
      <div v-else-if="packages.length > 0" class="packages-grid">
        <article v-for="pkg in packages" :key="pkg.id" class="package-card">
          <div class="card-top-row">
            <div class="package-meta">
              <h2 class="package-name">{{ pkg.name }}</h2>
              <p class="package-duration">{{ pkg.duration }} {{ pkg.duration_type }}</p>
            </div>
            <span class="package-price">{{ pkg.price }} {{ $t('Packages.currency') }}</span>
          </div>

          <p class="package-description">
            {{ pkg.description }}
          </p>

          <button class="subscribe-btn" type="button" @click="openDiscountDialog(pkg)" :disabled="subscribingToPackage">
            <span v-if="subscribingToPackage && selectedPackage?.id === pkg.id">
              <i class="pi pi-spin pi-spinner"></i> {{ $t('Packages.subscribing') }}
            </span>
            <span v-else>{{ $t('Packages.subscribe') }}</span>
          </button>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p>{{ $t('Packages.no_packages_available') }}</p>
      </div>

      <NuxtLink to="/" class="skip-btn">{{ $t('Packages.skip_and_subscribe_by_commission') }}</NuxtLink>
    </div>

    <Dialog v-model:visible="discountDialogVisible" modal :draggable="false" :closable="false"
      class="custum_dialog_width">
      <div class="discount-dialog-content" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
        <button class="close-dialog-btn" type="button" @click="discountDialogVisible = false">
          <i class="pi pi-times"></i>
          <i class="fas fa-times"></i>
        </button>

        <img src="@/assets/images/Logo.svg" alt="logo" class="dialog-logo" />

        <h3 class="dialog-title">{{ $t('Packages.discount_code') }}</h3>
        <p class="dialog-subtitle">{{ $t('Packages.please_enter_discount_code') }}</p>

        <label class="field-label">{{ $t('Packages.discount_code') }}</label>
        <div class="coupon-field">
          <div class="coupon-input-wrap">
            <i class="pi pi-calendar"></i>
            <input v-model="couponCode" type="text" :placeholder="$t('Packages.enter_discount_code')" />
          </div>
          <span class="coupon-action" @click="verifyCoupon" :class="{ disabled: verifyingCoupon || !couponCode }">{{ verifyingCoupon ? $t('Packages.verifying') : $t('Packages.activate') }}</span>
        </div>

        <button class="confirm-subscribe-btn" type="button" @click="confirmSubscription">
          {{ $t('Packages.confirm') }}
        </button>
      </div>
    </Dialog>

    <Dialog v-model:visible="successDialogVisible" modal :draggable="false" :closable="false" class="success-dialog">
      <div class="success-dialog-content" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
        <img src="@/assets/images/Logo.svg" alt="logo" class="dialog-logo" />
        <h3>{{ $t('Packages.package_subscribed_successfully') }}</h3>
        <p>{{ $t('Packages.will_redirect_to_home_soon') }}</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
// Axios
const axios = useApi();

definePageMeta({
  name: "Auth.sign_up_plan",
  layout: false
})

const { locale, t } = useI18n()
const { successToast, errorToast } = toastMsg()

// Auth Store
const authStore = useAuthStore()

const packages = ref([])
const loadingPackages = ref(false)

const selectedPackage = ref(null)
const couponCode = ref('')
const discountDialogVisible = ref(false)
const successDialogVisible = ref(false)
const verifyingCoupon = ref(false)
const couponVerified = ref(false)
const couponDiscount = ref(null)
const subscribingToPackage = ref(false)

// Fetch packages from API
const fetchPackages = async () => {
  loadingPackages.value = true

  try {
    const response = await axios.get('provider/packages/subscription-packages', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    if (response.data.key === 'success') {
      packages.value = response.data.data
    } else {
      errorToast(response.data.msg || t('Packages.failed_to_load_packages'))
    }
  } catch (err) {
    console.error('Failed to fetch packages:', err)
    errorToast(err.response?.data?.msg || t('Packages.failed_to_load_packages'))
  } finally {
    loadingPackages.value = false
  }
}

// Fetch packages on component mount
onMounted(() => {
  fetchPackages()
})

const openDiscountDialog = async (pkg) => {
  selectedPackage.value = pkg
  subscribingToPackage.value = true

  try {
    const formData = new FormData()
    formData.append('package_id', pkg.id)
    formData.append('payment_method', 2)

    const response = await axios.post('provider/subscriptions/store', formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    if (response.data.key === 'success') {
      successToast(response.data.msg || t('Packages.package_subscribed_successfully'))
      successDialogVisible.value = true
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigateTo('/')
      }, 2000)
    } else {
      errorToast(response.data.msg || t('Packages.subscription_failed'))
    }
  } catch (err) {
    console.error('Subscription error:', err)
    errorToast(err.response?.data?.msg || t('Packages.subscription_failed'))
  } finally {
    subscribingToPackage.value = false
  }
}

const verifyCoupon = async () => {
  if (!couponCode.value || verifyingCoupon.value) return

  verifyingCoupon.value = true

  try {
    const response = await axios.post('/coupons/verify', {
      code: couponCode.value
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    if (response.data.status === 'success') {
      successToast(response.data.message || t('Packages.coupon_verified_successfully'))
      couponVerified.value = true
      couponDiscount.value = response.data.discount || null
    } else {
      errorToast(response.data.message || t('Packages.invalid_coupon'))
      couponVerified.value = false
      couponDiscount.value = null
    }
  } catch (err) {
    console.error('Coupon verification error:', err)
    errorToast(err.response?.data?.message || t('Packages.coupon_verification_failed'))
    couponVerified.value = false
    couponDiscount.value = null
  } finally {
    verifyingCoupon.value = false
  }
}

const confirmSubscription = () => {
  discountDialogVisible.value = false
  successDialogVisible.value = true

  setTimeout(() => {
    successDialogVisible.value = false
    navigateTo('/')
  }, 2200)
}
</script>

<style scoped lang="scss">
.subscriptions-page {
  min-height: 100vh;
  padding: 24px 14px;
  background: #f5f5f5;
}

.subscriptions-wrapper {
  max-width: 1160px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 24px 24px 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.brand-logo {
  width: 78px;
  height: 78px;
  display: block;
  margin: 0 auto 8px;
}

.page-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #2b2b2b;
  margin: 0;
}

.page-subtitle {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin: 6px 0 24px;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.package-card {
  border: 1px solid #ebebeb;
  border-radius: 12px;
  padding: 20px;
  min-height: 160px;
  text-align: start;
}

.card-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.package-price {
  font-size: 18px;
  font-weight: 700;
  color: #ec5e1e;
}

.package-meta {
  text-align: start;
}

.package-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2a2a2a;
}

.package-duration {
  margin: 4px 0 0;
  font-size: 13px;
  color: #757575;
}

.package-description {
  margin: 12px 0 20px;
  font-size: 14px;
  color: #575757;
  line-height: 1.6;
}

.subscribe-btn {
  width: 174px;
  height: 43px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #f5b04e 0%, #ed1f24 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  display: block;
  margin: 0 auto;
  cursor: pointer;
}

.skip-btn {
  width: min(100%, 560px);
  height: 48px;
  border: 1px solid #f28965;
  color: #f28965;
  background: #fff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px auto 0;
  cursor: pointer;
}

.discount-dialog-content {
  position: relative;
  text-align: center;
  padding: 0;
}

.close-dialog-btn {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #f5dfd5;
  color: #ec5e1e;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: #fdf3f0;
  }

  i {
    font-size: 16px;
  }
}

.dialog-logo {
  width: 120px;
  height: 120px;
  display: block;
  margin: 0 auto 16px;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #000;
}

.dialog-subtitle {
  margin: 8px 0 32px;
  font-size: 16px;
  color: #666;
}

.field-label {
  display: block;
  text-align: start;
  margin-bottom: 8px;
  font-size: 16px;
  color: #000;
  font-weight: 700;
}

.coupon-field {
  border: 1px dashed #ec5e1e;
  border-radius: 12px;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 24px;
  background: #fff;
}

.coupon-action {
  font-size: 16px;
  font-weight: 700;
  color: #ec5e1e;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover:not(.disabled) {
    opacity: 0.8;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.coupon-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;

  .pi {
    color: #ec5e1e;
    font-size: 20px;
  }

  input {
    border: 0;
    outline: 0;
    background: transparent;
    text-align: start;
    font-size: 15px;
    color: #202020;
    width: 100%;

    &::placeholder {
      color: #999;
    }
  }
}

.confirm-subscribe-btn {
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(90deg, #f5b04e 0%, #ed1f24 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.success-dialog-content {
  text-align: center;
  padding: 32px 24px;

  .dialog-logo {
    margin-bottom: 20px;
  }

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #2f2f2f;
    margin: 0 0 12px;
  }

  p {
    margin: 0;
    color: #686868;
    font-size: 16px;
  }
}

:deep(.subscription-dialog) {
  width: min(92vw, 600px);

  .p-dialog-header {
    display: none;
  }

  .p-dialog-content {
    padding: 0;
    border-radius: 20px;
    overflow: hidden;
  }
}

:deep(.success-dialog) {
  width: min(92vw, 500px);

  .p-dialog-header {
    display: none;
  }

  .p-dialog-content {
    padding: 0;
    border-radius: 20px;
  }
}

@media (max-width: 991px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
