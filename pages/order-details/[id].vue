<template>
  <div>
    <section class="preparing-screen">
      <div class="container preparing-container">
        <div class="preparing-head">
          <h1 class="preparing-title">
            <span class="title-dot"></span>
            <!-- {{ order?.status?.title || $t('inPreparation.page_title') }} -->
            {{ order?.status?.title }}
          </h1>
        </div>

        <div class="truck-wrap" v-if="showTruckImage">
          <img :src="truckImage" alt="truck" class="truck-img" />
        </div>

        <div v-if="loading" class="details-skeleton">
          <div class="preparing-card mb-3">
            <Skeleton width="100%" height="120px"></Skeleton>
          </div>
          <div class="preparing-card mb-3">
            <Skeleton width="100%" height="220px"></Skeleton>
          </div>
          <div class="preparing-card">
            <Skeleton width="100%" height="220px"></Skeleton>
          </div>
        </div>

        <div v-if="!loading && order">
          <div class="preparing-card" v-if="thumbnailImages.length">
            <h2 class="card-title">{{ $t('quote.products_images') }}</h2>
            <div class="card-divider"></div>
            <div class="product-images-row">
              <div class="product-thumb" v-for="(img, idx) in thumbnailImages" :key="idx">
                <img :src="img.image" alt="product" />
              </div>
            </div>
          </div>

          <div class="preparing-card">
            <h2 class="card-title">{{ $t('quoteAccepted.sent_product') }}</h2>
            <div class="card-divider"></div>
            <div class="sent-product-row">
              <div class="sent-product-thumb" v-if="sentProductImage">
                <img :src="sentProductImage" alt="product" />
              </div>
              <div class="sent-product-info">
                <span class="product-name">{{ sentProductName }}</span>
                <p class="product-desc">{{ sentProductDesc }}</p>
              </div>
              <div class="product-qty">{{ $t('quoteAccepted.quantity') }} : {{ sentProductQty }}</div>
            </div>
          </div>

          <div class="preparing-card details-card">
            <h2 class="card-title">{{ $t('quote.order_details') }}</h2>
            <div class="card-divider"></div>
            <div class="details-grid">
              <template v-for="item in detailRows" :key="item.label">
                <div class="detail-label">{{ item.label }}</div>
                <div class="detail-value" :class="{ 'location-val': item.isLocation }">
                  <i v-if="item.isLocation" class="fa-solid fa-location-dot"></i>
                  {{ item.value }}
                </div>
              </template>
            </div>
          </div>

          <div class="preparing-card details-card">
            <h2 class="card-title">{{ $t('quoteAccepted.order_summary') }}</h2>
            <div class="card-divider"></div>
            <div class="details-grid summary-grid">
              <template v-for="item in summaryRows" :key="item.label">
                <div class="detail-label" :class="{ 'total-label': item.total }">{{ item.label }}</div>
                <div class="detail-value" :class="{ 'total-value': item.total }">{{ item.value }}</div>
              </template>
            </div>
          </div>

          <div class="preparing-card text-card">
            <h2 class="card-title">{{ $t('quote.text_details') }}</h2>
            <div class="card-divider"></div>
            <p class="text-details">{{ textDetails }}</p>
          </div>

          <div class="preparing-card text-card" v-if="providerTextDetails">
            <h2 class="card-title">{{ $t('inPreparation.provider_text_details') }}</h2>
            <div class="card-divider"></div>
            <p class="text-details">{{ providerTextDetails }}</p>
          </div>

          <div class="preparing-card client-card" v-if="order.user">
            <h2 class="card-title">{{ $t('quote.client_data') }}</h2>
            <div class="card-divider"></div>
            <div class="client-row">
              <div class="client-item"><i class="fa-solid fa-user"></i> {{ order.user?.name || '-' }}</div>
              <div class="client-item"><i class="fa-solid fa-location-dot"></i> {{ order.user?.city || order.city || '-'
                }}</div>
              <div class="client-item" v-if="allActions.show_user_rate">
                <i class="fa-solid fa-star"></i> {{ order.user?.rate || '-' }}
              </div>
            </div>
          </div>

          <div class="preparing-card driver-card" v-if="delegateData">
            <h2 class="card-title">{{ $t('inPreparation.driver_details') }}</h2>
            <div class="card-divider"></div>
            <div class="driver-row">
              <div class="driver-thumb" v-if="delegateData.image">
                <img :src="delegateData.image" alt="driver" />
              </div>
              <div class="driver-meta">
                <div class="driver-name"><i class="fa-solid fa-user"></i> {{ delegateData.name || '-' }}</div>
                <div class="driver-phone"><i class="fa-solid fa-mobile-screen-button"></i> {{ delegateData.phone ||
                  delegateData.full_phone || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="actions-column">
            
            <button v-if="normalActions.send_offer_button || normalActions.update_offer_button" type="button"
              class="done-btn" @click="goToQuoteForm">
              {{ normalActions.update_offer_button ? 'تعديل عرض السعر' : 'إرسال عرض سعر' }}
            </button>

            <button v-if="normalActions.invoice_button" type="button" class="done-btn"
              @click="openIssueInvoiceDialog">إصدار
              فاتورة</button>

            <!-- <button v-if="normalActions.invoice_button" type="button" class="done-btn" @click="openInvoiceDialog">عرض الفاتورة</button> -->

            <button v-if="normalActions.processed_button" type="button" class="done-btn"
              :disabled="actionLoading.prepared" @click="openPreparedDialog">{{
              $t('inPreparation.prepared_btn') }}</button>

            <button v-if="normalActions.reject_button" type="button" class="done-btn reject-btn"
              :disabled="actionLoading.reject" @click="handleRejectOrder">
              <span v-if="!actionLoading.reject">رفض الطلب</span>
              <span v-else class="spinner-border spinner-border-sm" role="status"></span>
            </button>

            <button v-if="showDeliverButton" type="button" class="done-btn" :disabled="actionLoading.deliver"
              @click="handleDeliverToDelegate">
              تم التسليم للمندوب
            </button>

            <button v-if="retrievalActions.dispatch_button" type="button" class="done-btn"
              @click="openDispatchDialog">{{
                $t('deliveryMethod.submit_request_to_driver') }}</button>

            <button v-if="allActions.accept_to_send_delegate_contact_button" type="button" class="done-btn"
              :disabled="actionLoading.acceptDelegateContact" @click="handleAcceptToSendDelegateContact">
              قبول إرسال تواصل المندوب
            </button>

            <button v-if="allActions.show_user_rate" type="button" class="done-btn" @click="reviewDialog = true">
              عرض التقييم
            </button>
          </div>

          <div class="todo-box" v-if="hasUnsupportedRetrievalActions">
            TODO: الأزرار `accept_button` / `refuse_button` / `finished_button` موجودة في response لكن لا توجد endpoints
            مقابلة في
            Postman المرفق.
          </div>
        </div>
      </div>
    </section>

    <Dialog v-model:visible="offerDialog" modal :draggable="false" header="عرض السعر" class="custum_dialog_width">
      <div class="p-2 d-flex flex-column gap-3">
        <CustomDropdown v-model="offerForm.product_id" :options="products" option-value="id" label="المنتج"
          placeholder="اختر المنتج" @change="onOfferProductChange" />

        <CustomDropdown v-model="offerForm.variant_id" :options="variants" option-value="id" label="النسخة"
          placeholder="اختر النسخة" />

        <FormInput v-model:modelValue="offerForm.price" type="number" name="offer_price" label="السعر"
          placeholder="أدخل السعر" />
        <FormInput v-model:modelValue="offerForm.execution_time" type="number" name="offer_execution_time"
          label="مدة التنفيذ" placeholder="أدخل مدة التنفيذ" />

        <div>
          <label class="label mb-2">ملاحظات</label>
          <textarea v-model="offerForm.notes" class="main_input main_area" rows="3" placeholder="اختياري"></textarea>
        </div>

        <button class="custom-btn" :disabled="actionLoading.offer" @click="submitOffer">
          <span v-if="!actionLoading.offer">تأكيد</span>
          <span v-else class="spinner-border spinner-border-sm" role="status"></span>
        </button>
      </div>
    </Dialog>

    <Dialog v-model:visible="invoiceIssueDialog" modal :draggable="false" header="إصدار فاتورة"
      class="custum_dialog_width sm">
      <div class="p-2 d-flex flex-column gap-3">
        <FormInput v-model:modelValue="invoiceForm.final_price" type="number" name="final_price"
          :label="finalPriceLabel" placeholder="أدخل السعر النهائي" :required-symbol="isFinalPriceRequired ? '*' : ''" />
        <small class="text-muted">في حالة التقسيط قد يتطلب إرسال الفاتورة الأولى مع السعر النهائي.</small>
        <button class="custom-btn" :disabled="actionLoading.invoice" @click="submitIssueInvoice">
          <span v-if="!actionLoading.invoice">إصدار</span>
          <span v-else class="spinner-border spinner-border-sm" role="status"></span>
        </button>
      </div>
    </Dialog>

    <Dialog v-model:visible="preparedDialog" modal :draggable="false" header="تجهيز الطلب"
      class="custum_dialog_width sm">
      <div class="p-2 d-flex flex-column gap-3">
        <CustomDropdown v-model="preparedForm.delegate_id" :options="delegates" option-value="id"
          label="المندوب (اختياري)" placeholder="اختر مندوب أو اتركه فارغًا" />
        <button class="custom-btn" :disabled="actionLoading.prepared" @click="submitPrepared">
          <span v-if="!actionLoading.prepared">تأكيد</span>
          <span v-else class="spinner-border spinner-border-sm" role="status"></span>
        </button>
      </div>
    </Dialog>

    <Dialog v-model:visible="dispatchDialog" modal :draggable="false" header="تعيين مندوب"
      class="custum_dialog_width sm">
      <div class="p-2 d-flex flex-column gap-3">
        <CustomDropdown v-model="dispatchForm.delegate_id" :options="delegates" option-value="id"
          label="المندوب (اختياري)" placeholder="اختر مندوب أو اتركه فارغًا" />
        <button class="custom-btn" :disabled="actionLoading.dispatch" @click="submitDispatch">
          <span v-if="!actionLoading.dispatch">تأكيد</span>
          <span v-else class="spinner-border spinner-border-sm" role="status"></span>
        </button>
      </div>
    </Dialog>

    <Dialog v-model:visible="invoiceDialog" modal :draggable="false" header="الفاتورة" class="custum_dialog_width lg">
      <div class="p-2" v-if="invoiceLoading">
        <Skeleton width="100%" height="220px"></Skeleton>
      </div>
      <div class="p-2" v-else-if="invoiceData">
        <div class="details-grid">
          <div class="detail-label">رقم الفاتورة</div>
          <div class="detail-value">{{ invoiceData.invoice_number || '-' }}</div>
          <div class="detail-label">التاريخ</div>
          <div class="detail-value">{{ invoiceData.date || '-' }}</div>
          <div class="detail-label">الوقت</div>
          <div class="detail-value">{{ invoiceData.time || '-' }}</div>
          <div class="detail-label">تاريخ الإنشاء</div>
          <div class="detail-value">{{ invoiceData.created_at || '-' }}</div>
          <div class="detail-label">التاريخ الهجري</div>
          <div class="detail-value">{{ invoiceData.hijri_date || '-' }}</div>
          <div class="detail-label">نوع الدفع</div>
          <div class="detail-value">{{ invoiceData.pay_type || '-' }}</div>
          <div class="detail-label">الحالة</div>
          <div class="detail-value">{{ invoiceData.status?.title || '-' }}</div>
          <div class="detail-label">كود التسليم</div>
          <div class="detail-value">{{ invoiceData.delivery_code || '-' }}</div>
        </div>
      </div>
      <div class="p-2" v-else>
        <p class="text-muted mb-0">لا توجد فاتورة متاحة لهذا الطلب.</p>
      </div>
    </Dialog>

    <Dialog v-model:visible="reviewDialog" modal :draggable="false" header="التقييم"
      class="custum_dialog_width review-dialog text-center">
      <div class="review-content" v-if="currentReview">
        <div class="review-head">
          <h3 class="review-name">{{ currentReviewName }}</h3>
          <div class="review-stars" aria-label="rating">
            <i v-for="star in 5" :key="star" class="fa-solid fa-star" :class="{ muted: star > currentReviewRate }"></i>
          </div>
        </div>
        <p class="review-comment">{{ currentReview.comment || '-' }}</p>
      </div>
      <p v-else class="review-empty">لا يوجد تقييم</p>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Titles.order_details",
  authIsRequired: true,
  middleware: "auth",
});

import receiveParcelImage from '@/assets/images/gif-img/Receive_Parcel.gif';
import hourglassImage from '@/assets/images/gif-img/Hourglass.gif';
import cardPaymentImage from '@/assets/images/gif-img/Man doing Card Payment.gif';
import deliveryOnTimeImage from '@/assets/images/gif-img/delivery on time.gif';
import orderDeliveredImage from '@/assets/images/gif-img/Order delivered.gif';
import { useI18n } from "vue-i18n";

const route = useRoute();
const { id } = route.params;
const { successToast, errorToast } = toastMsg();
const { t } = useI18n({ useScope: 'global' });

const {
  getNormalOrderDetails,
  getRetrievalOrderDetails,
  getOrderInvoice,
  sendOrUpdateOffer,
  getProductsFromBaseProduct,
  getVariantsFromProduct,
  issueInvoice,
  preparedOrder,
  deliverToUserDelegate,
  rejectOrder,
  dispatchRetrievalOrder,
  getProviderDelegates,
  acceptToSendDelegateContact,
} = useProviderOrdersApi();

const loading = ref(true);
const order = ref(null);

const isNormalOrder = computed(() => route.query.type !== 'retrieval');

const offerDialog = ref(false);
const invoiceIssueDialog = ref(false);
const preparedDialog = ref(false);
const dispatchDialog = ref(false);
const invoiceDialog = ref(false);
const reviewDialog = ref(false);

const invoiceLoading = ref(false);
const invoiceData = ref(null);

const delegates = ref([]);
const products = ref([]);
const variants = ref([]);
const offerForm = ref({
  product_id: null,
  variant_id: null,
  price: '',
  execution_time: '',
  notes: '',
});

const invoiceForm = ref({
  final_price: '',
});

const preparedForm = ref({
  delegate_id: null,
});

const dispatchForm = ref({
  delegate_id: null,
});

const actionLoading = reactive({
  offer: false,
  invoice: false,
  prepared: false,
  deliver: false,
  reject: false,
  dispatch: false,
  acceptDelegateContact: false,
});

const safeArray = (value) => (Array.isArray(value) ? value : []);

const allActions = computed(() => order.value?.actions || {});
const normalActions = computed(() => (isNormalOrder.value ? allActions.value : {}));
const retrievalActions = computed(() => (!isNormalOrder.value ? allActions.value : {}));
const statusKey = computed(() => Number(order.value?.status?.key || 0));

const showTruckImage = computed(() => {
  if (loading.value || !order.value) return false;
  return [1, 2, 3, 4, 10, 12].includes(statusKey.value) || order.value?.status?.name === 'receiving_offers';
});

const truckImage = computed(() => {
  if (statusKey.value === 1) return hourglassImage;
  if (statusKey.value === 2 || statusKey.value === 10) return cardPaymentImage;
  if (statusKey.value === 3 || statusKey.value === 4) return deliveryOnTimeImage;
  if (statusKey.value === 12) return orderDeliveredImage;
  return receiveParcelImage;
});

const hasUnsupportedRetrievalActions = computed(() => {
  if (isNormalOrder.value) return false;
  return !!(allActions.value?.accept_button || allActions.value?.refuse_button || allActions.value?.finished_button);
});

const showDeliverButton = computed(() => {
  if (!isNormalOrder.value) return false;
  return !!(allActions.value?.delilver_to_delegate || allActions.value?.deliver_to_delegate);
});

const effectiveVariant = computed(() => order.value?.variant || order.value?.offer?.variant || null);

const thumbnailImages = computed(() => {
  const images = safeArray(displayImages.value);
  return images.slice(0, 4);
});

const sentProductImage = computed(() => {
  if (thumbnailImages.value.length) return thumbnailImages.value[0].image;
  return order.value?.base_product?.image || '';
});

const sentProductName = computed(() => {
  return effectiveVariant.value?.name || effectiveVariant.value?.title || order.value?.base_product?.title || '-';
});

const sentProductQty = computed(() => {
  return order.value?.base_product?.qty || 1;
});

const sentProductDesc = computed(() => {
  return effectiveVariant.value?.options || order.value?.notes || order.value?.status?.details_text || '-';
});

const addressText = computed(() => {
  const location = order.value?.location || order.value?.address;
  return location?.map_desc || '-';
});

const textDetails = computed(() => {
  return order.value?.notes || order.value?.return_reason || '-';
});

const providerTextDetails = computed(() => {
  return order.value?.offer?.notes || '';
});

const delegateData = computed(() => {
  if (order.value?.delegate) return order.value.delegate;
  if (order.value?.user_delegate) return order.value.user_delegate;
  return null;
});

const currentReview = computed(() => safeArray(order.value?.rates)[0] || null);
const currentReviewRate = computed(() => Number(currentReview.value?.rate || 0));
const currentReviewName = computed(() => currentReview.value?.rater?.name || currentReview.value?.name || '-');

const withCurrency = (value, currency) => {
  if (value === null || value === undefined || value === '') return '-';
  return `${value} ${currency || ''}`.trim();
};

const detailRows = computed(() => {
  const paymentSystem = order.value?.pay_data?.title || t('quote.not_determined_yet');
  return [
    { label: t('quote.order_number'), value: order.value?.order_num || order.value?.id || '-' },
    { label: t('quote.main_category'), value: order.value?.main_category || '-' },
    { label: t('quote.sub_category'), value: order.value?.sub_category || '-' },
    { label: t('quote.order_time'), value: order.value?.time || order.value?.created_at || '-' },
    { label: t('quote.city'), value: order.value?.city || order.value?.user?.city || '-' },
    { label: t('quote.location'), value: addressText.value, isLocation: true },
    { label: t('quote.payment_system'), value: paymentSystem },
  ];
});

const summaryRows = computed(() => {
  const financials = order.value?.financials || {};
  const currency = financials.currency;

  return [
    { label: t('quoteAccepted.order_value'), value: withCurrency(financials.products_price, currency) },
    { label: 'باقي المبلغ', value: withCurrency(financials.total_price, currency) },
    { label: t('quoteAccepted.static.commission_value'), value: withCurrency(financials.admin_commission, currency) },
    { label: t('quoteAccepted.tax_value'), value: withCurrency(financials.vat_amount, currency) },
    { label: t('quoteAccepted.execution_duration'), value: financials.execution_time || '-' },
    { label: t('quoteAccepted.delivery_value'), value: withCurrency(financials.delivery_price, currency) },
    { label: t('quoteAccepted.total'), value: withCurrency(financials.total_price, currency), total: true },
  ];
});

const displayImages = computed(() => {
  const orderImages = safeArray(order.value?.images).map((image) => ({ image }));

  if (orderImages.length) return orderImages;

  const variantImages = safeArray(order.value?.variant?.images).map((image) => ({ image }));
  if (variantImages.length) return variantImages;

  const offerVariantImages = safeArray(order.value?.offer?.variant?.images).map((image) => ({ image }));
  if (offerVariantImages.length) return offerVariantImages;

  if (order.value?.base_product?.image) {
    return [{ image: order.value.base_product.image }];
  }

  return [];
});

const deliveryTypeKey = computed(() => order.value?.delivery_type?.key);

const isPreparedWithoutDelegate = computed(() => {
  const value = deliveryTypeKey.value;
  return value === 0 || value === '0';
});

const isFinalPriceRequired = computed(() => {
  const value = order.value?.offer_price_is_required;
  return value === true || value === 1 || value === '1' || value === 'true';
});

const finalPriceLabel = computed(() => {
  return isFinalPriceRequired.value ? 'السعر النهائي' : 'السعر النهائي';
});

const fetchDetails = async () => {
  loading.value = true;
  try {
    const result = isNormalOrder.value
      ? await getNormalOrderDetails(id)
      : await getRetrievalOrderDetails(id);

    if (!result.ok) {
      errorToast(result.msg || 'Failed to load order details');
      order.value = null;
      return;
    }

    order.value = result.data;
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to load order details');
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const loadDelegates = async () => {
  try {
    const result = await getProviderDelegates();
    if (!result.ok) {
      errorToast(result.msg || 'Failed to load delegates');
      delegates.value = [];
      return;
    }
    delegates.value = safeArray(result.data);
  } catch (err) {
    console.error(err);
    delegates.value = [];
  }
};

const loadProductsForOffer = async () => {
  products.value = [];
  variants.value = [];

  const baseProductId = order.value?.base_product?.id;
  if (!baseProductId) {
    errorToast('Base product is missing for this order');
    return;
  }

  try {
    const result = await getProductsFromBaseProduct(baseProductId);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to load products');
      return;
    }
    products.value = safeArray(result.data).map((item) => ({
      id: item.id,
      name: item.name || item.title || `#${item.id}`,
    }));
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to load products');
  }
};

const onOfferProductChange = async (productId) => {
  offerForm.value.variant_id = null;
  variants.value = [];

  if (!productId) return;

  try {
    const result = await getVariantsFromProduct(productId);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to load variants');
      return;
    }

    variants.value = safeArray(result.data).map((variant) => ({
      id: variant.id,
      name: variant.title || variant.name || `#${variant.id}`,
      raw: variant,
    }));
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to load variants');
  }
};

const openOfferDialog = async () => {
  offerForm.value = {
    product_id: null,
    variant_id: order.value?.offer?.variant_id || null,
    price: order.value?.offer?.price || '',
    execution_time: order.value?.offer?.execution_time ? String(order.value.offer.execution_time).replace(/\D/g, '') : '',
    notes: order.value?.offer?.notes || '',
  };

  offerDialog.value = true;
  await loadProductsForOffer();

  if (products.value.length && !offerForm.value.product_id) {
    offerForm.value.product_id = products.value[0].id;
    await onOfferProductChange(offerForm.value.product_id);
  }
};

const goToQuoteForm = () => {
  navigateTo({
    path: '/sendQuoteForm',
    query: {
      order_id: id,
      mode: normalActions.value.update_offer_button ? 'edit' : 'send',
    },
  });
};

const submitOffer = async () => {
  if (!offerForm.value.variant_id) return errorToast('variant_id is required');
  if (!offerForm.value.price || Number(offerForm.value.price) <= 0) return errorToast('price is required and must be numeric');
  if (!offerForm.value.execution_time || Number(offerForm.value.execution_time) < 0) return errorToast('execution_time is required');

  actionLoading.offer = true;
  try {
    const payload = {
      order_id: id,
      price: offerForm.value.price,
      execution_time: offerForm.value.execution_time,
      notes: offerForm.value.notes,
      variant_id: offerForm.value.variant_id,
    };

    const result = await sendOrUpdateOffer(payload);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to send offer');
      return;
    }

    successToast(result.msg || 'Offer sent successfully');
    offerDialog.value = false;
    await fetchDetails();
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to send offer');
  } finally {
    actionLoading.offer = false;
  }
};

const openIssueInvoiceDialog = async () => {
  invoiceForm.value.final_price = '';

  if (!isFinalPriceRequired.value) {
    await submitIssueInvoice();
    return;
  }

  invoiceIssueDialog.value = true;
};

const submitIssueInvoice = async () => {
  if (isFinalPriceRequired.value && (!invoiceForm.value.final_price || Number(invoiceForm.value.final_price) <= 0)) {
    return errorToast('السعر النهائي مطلوب');
  }

  actionLoading.invoice = true;
  try {
    const payload = {
      order_id: id,
      final_price: invoiceForm.value.final_price,
    };

    const result = await issueInvoice(payload);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to issue invoice');
      return;
    }

    successToast(result.msg || 'Invoice issued successfully');
    invoiceIssueDialog.value = false;
    await fetchDetails();
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to issue invoice');
  } finally {
    actionLoading.invoice = false;
  }
};

const openPreparedDialog = async () => {
  preparedForm.value.delegate_id = null;

  if (isPreparedWithoutDelegate.value) {
    await submitPrepared();
    return;
  }

  preparedDialog.value = true;
  await loadDelegates();
};

const submitPrepared = async () => {
  actionLoading.prepared = true;
  try {
    const result = await preparedOrder(id, preparedForm.value.delegate_id);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to prepare order');
      return;
    }

    successToast(result.msg || 'Order prepared successfully');
    preparedDialog.value = false;
    await fetchDetails();
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to prepare order');
  } finally {
    actionLoading.prepared = false;
  }
};

const handleDeliverToDelegate = async () => {
  actionLoading.deliver = true;
  try {
    const result = await deliverToUserDelegate(id);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to deliver order to user delegate');
      return;
    }

    successToast(result.msg || 'Order delivered to user delegate successfully');
    await fetchDetails();
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to deliver order to user delegate');
  } finally {
    actionLoading.deliver = false;
  }
};

const handleRejectOrder = async () => {
  actionLoading.reject = true;
  try {
    const result = await rejectOrder(id);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to reject order');
      return;
    }

    successToast(result.msg || 'تم رفض الطلب بنجاح');
    // await fetchDetails();
    navigateTo('/orders-main');
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to reject order');
  } finally {
    actionLoading.reject = false;
  }
};

const openDispatchDialog = async () => {
  dispatchForm.value.delegate_id = null;
  dispatchDialog.value = true;
  await loadDelegates();
};

const submitDispatch = async () => {
  actionLoading.dispatch = true;
  try {
    const payload = {
      order_id: id,
      delegate_id: dispatchForm.value.delegate_id,
    };

    const result = await dispatchRetrievalOrder(payload);
    if (!result.ok) {
      errorToast(result.msg || 'Failed to dispatch retrieval order');
      return;
    }

    successToast(result.msg || 'Retrieval order dispatched successfully');
    dispatchDialog.value = false;
    await fetchDetails();
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Failed to dispatch retrieval order');
  } finally {
    actionLoading.dispatch = false;
  }
};

const handleAcceptToSendDelegateContact = async () => {
  actionLoading.acceptDelegateContact = true;
  try {
    const result = await acceptToSendDelegateContact(id);
    if (!result.ok) {
      errorToast(result.msg || 'Action failed');
      return;
    }

    successToast(result.msg || 'Action completed successfully');
    await fetchDetails();
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Action failed');
  } finally {
    actionLoading.acceptDelegateContact = false;
  }
};

const openInvoiceDialog = async () => {
  invoiceDialog.value = true;
  invoiceLoading.value = true;
  invoiceData.value = null;

  try {
    const result = await getOrderInvoice(id);
    if (!result.ok) {
      errorToast(result.msg || 'Cannot load invoice');
      return;
    }
    invoiceData.value = result.data;
  } catch (err) {
    console.error(err);
    errorToast(err?.response?.data?.msg || 'Cannot load invoice');
  } finally {
    invoiceLoading.value = false;
  }
};

onMounted(async () => {
  await fetchDetails();
});
</script>

<style scoped lang="scss">
.preparing-screen {
  background: #ededed;
  min-height: calc(100vh - 240px);
  border-top: 1px solid #d9d9d9;
  padding: 20px 0 48px;
}

.preparing-container {
  max-width: 920px;
  margin: 0 auto;
}

.preparing-head {
  margin-bottom: 20px;
}

.preparing-title {
  margin: 0;
  color: #2c58a2;
  font-size: 22px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2c58a2;
}

.truck-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
}

.truck-img {
  width: 250px;
  max-width: 100%;
  height: auto;
}

.preparing-card {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  color: #272727;
  font-size: 18px;
  font-weight: 500;
  text-align: right;
}

.card-divider {
  border-top: 1px solid #ececec;
  margin: 8px 0 12px;
}

.product-images-row {
  display: flex;
  gap: 16px;
}

.product-thumb,
.sent-product-thumb {
  width: 80px;
  height: 70px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  overflow: hidden;
}

.product-thumb img,
.sent-product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sent-product-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: start;
}

.sent-product-info {
  text-align: right;
}

.product-name {
  color: #2c58a2;
  font-size: 16px;
  text-decoration: underline;
  margin-bottom: 8px;
  display: inline-block;
}

.product-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.product-qty {
  color: #1a1a1a;
  font-size: 16px;
}

.details-card {
  padding-bottom: 18px;
}

.details-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 10px;
  column-gap: 24px;
  align-items: center;
}

.detail-label {
  color: #666;
  font-size: 16px;
  text-align: right;
}

.detail-value {
  color: #1a1a1a;
  font-size: 16px;
  text-align: end;
}

.location-val i {
  color: #2c58a2;
  margin-inline-start: 6px;
}

.summary-grid .total-label {
  color: #1a1a1a;
  font-weight: 600;
}

.summary-grid .total-value {
  color: #2c58a2;
  font-size: 20px;
  font-weight: 600;
}

.text-card .card-title {
  margin-bottom: 0;
}

.text-details {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.7;
  text-align: right;
}

.client-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.client-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
  font-size: 14px;
}

.client-item i {
  color: #2c58a2;
}

.review-content {
  padding: 8px 4px 18px;
}

.review-head {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 12px;
}

.review-name {
  margin: 0;
  color: #222;
  font-size: 20px;
  font-weight: 700;
}

.review-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ffc12e;
  font-size: 14px;
}

.review-stars .muted {
  color: #d8d8d8;
}

.review-comment {
  max-width: 720px;
  margin: 0 auto;
  color: #666;
  font-size: 18px;
  line-height: 1.8;
}

.review-empty {
  margin: 0;
  color: #666;
  text-align: center;
  font-size: 16px;
}

.driver-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.driver-thumb {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border: 1px solid #dadada;
  overflow: hidden;
}

.driver-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.driver-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.driver-name,
.driver-phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
  font-size: 14px;
}

.driver-phone {
  color: #666;
  font-size: 10px;
}

.driver-name i,
.driver-phone i {
  color: #2c58a2;
}

.actions-column {
  display: flex;
  gap: 10px;
}

.done-btn {
  width: 100%;
  min-height: 48px;
  border-radius: 8px;
  border: 0;
  background: #2c58a2;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.done-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reject-btn {
  background: #ef4444;
}

.todo-box {
  border: 1px dashed #e09f3e;
  background: #fff8e8;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  margin-top: 12px;
}

@media (max-width: 992px) {
  .preparing-container {
    padding-inline: 12px;
  }

  .preparing-title {
    font-size: 22px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .sent-product-row {
    grid-template-columns: 1fr;
  }

  .product-images-row {
    justify-content: flex-start;
  }
}
</style>
