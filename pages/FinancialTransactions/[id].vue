<template>
  <div class="settlement-details-page">
    <div class="container details-container">
      <div v-if="loadingDetails" class="settlement-shell">
        <Skeleton width="160px" height="20px" class="mb-4 mx-auto" />
        <Skeleton width="100%" height="170px" class="mb-5 rounded-4" />
        <Skeleton width="120px" height="20px" class="mb-3 ms-auto" />
        <Skeleton v-for="i in 3" :key="i" width="100%" height="112px" class="mb-3 rounded-4" />
      </div>

      <div v-else-if="settlementDetails" class="settlement-shell">
        <div class="status-line">
          <span class="status-dot" :class="settlementDetails.status"></span>
          <span class="status-text" :class="settlementDetails.status">
            {{ settlementDetails.status_text || "-" }}
          </span>
        </div>

        <div class="summary-card">
          <div class="summary-header">
            <i class="fas fa-chevron-down summary-chevron"></i>
            <span>القيم الإجمالية</span>
          </div>

          <div class="summary-body">
            <div class="summary-row">
              <span class="summary-label">إجمالي الطلبات</span>
              <span class="summary-value">{{ formatMoney(settlementDetails.total_orders_amount) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">إجمالي العمولة</span>
              <span class="summary-value">{{ formatMoney(settlementDetails.total_admin_commission) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">إجمالي القيمة المضافة</span>
              <span class="summary-value">{{ formatMoney(settlementDetails.total_vat_amount) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total">
              <span class="summary-label">المستحق</span>
              <span class="summary-value">{{ formatMoney(settlementDetails.total_provider_amount) }}</span>
            </div>
          </div>
        </div>

        <p v-if="settlementDetails.msg" class="settlement-message">
          {{ settlementDetails.msg }}
        </p>

        <section v-if="settlementDetails.image" class="transfer-section">
          <h2 class="transfer-title">صورة الحوالة</h2>
          <div class="transfer-image-wrap">
            <img :src="settlementDetails.image" alt="transfer receipt" class="transfer-image" />
          </div>
        </section>

        <section v-if="isRejected" class="reject-card">
          <h2 class="reject-title">سبب الرفض</h2>
          <div class="reject-divider"></div>
          <p class="reject-text">{{ rejectionReason }}</p>
        </section>

        <section class="orders-section">
          <h2 class="orders-title">الطلبات</h2>

          <div v-if="loadingOrders" class="orders-list">
            <Skeleton v-for="i in 3" :key="i" width="100%" height="112px" class="rounded-4" />
          </div>

          <div v-else-if="settlementOrders.length" class="orders-list">
            <article v-for="item in settlementOrders" :key="item.id" class="order-card">
              <div class="order-head">
                <div class="order-time">
                  <i class="far fa-clock"></i>
                  <span>{{ item.created_at || "-" }}</span>
                </div>
                <h3 class="order-number">رقم الطلب {{ item.order_num || "-" }}</h3>
              </div>

              <div class="order-values">
                <div class="order-metric">
                  <span class="metric-label">قيمة الطلب</span>
                  <span class="metric-value">{{ formatMoney(item.order_price, item.currency) }}</span>
                </div>
                <div class="order-metric">
                  <span class="metric-label">عمولة التطبيق</span>
                  <span class="metric-value">{{ formatMoney(item.admin_commission, item.currency) }}</span>
                </div>
                <div class="order-metric">
                  <span class="metric-label">القيمة المضافة</span>
                  <span class="metric-value">{{ formatMoney(item.vat_amount, item.currency) }}</span>
                </div>
              </div>

              <div class="order-divider"></div>

              <div class="order-total">
                <span>الإجمالي</span>
                <strong>{{ formatMoney(item.total_price, item.currency) }}</strong>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <img src="@/assets/images/home-boxe.svg" alt="no orders" class="empty-img" />
            <p>لا توجد طلبات</p>
          </div>

          <div class="paginate-parent" v-if="showPaginate">
            <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalItems" class="mt-4" dir="ltr" />
          </div>
        </section>
      </div>

      <div v-else class="empty-state page-empty">
        <img src="@/assets/images/home-boxe.svg" alt="no details" class="empty-img" />
        <p>{{ $t("settlements.no_data") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Titles.order_details",
  authIsRequired: true,
  middleware: "auth",
});

const route = useRoute();
const id = route.params.id;
const currentPage = ref(1);
const pageLimit = ref(20);
const totalItems = ref(0);

const {
  payload: settlementDetailsPayload,
  pending: loadingDetails,
} = await useApiData(`provider/settlements/orders-details/${id}`, {
  auth: true,
  cacheKey: `api:settlement-details:${id}`,
});

const {
  payload: settlementOrdersPayload,
  pending: loadingOrders,
} = await useApiData(`provider/settlements/orders/${id}`, {
  auth: true,
  query: computed(() => ({ page: currentPage.value })),
  watch: [currentPage],
});

const settlementDetails = computed(() => settlementDetailsPayload.value || null);
const settlementOrders = computed(
  () => settlementOrdersPayload.value?.settlement_orders || [],
);

watchEffect(() => {
  const pagination = settlementOrdersPayload.value?.pagination || {};
  totalItems.value = pagination.total_items || 0;
  pageLimit.value = pagination.per_page || 20;
});

const defaultCurrency = computed(() => settlementOrders.value[0]?.currency || "ر.س");
const showPaginate = computed(() => totalItems.value > pageLimit.value);
const isRejected = computed(() => settlementDetails.value?.status === "rejected");
const rejectionReason = computed(() => {
  return (
    settlementDetails.value?.refuse_reason ||
    settlementDetails.value?.reject_reason ||
    settlementDetails.value?.rejected_reason ||
    settlementDetails.value?.reason ||
    settlementDetails.value?.msg ||
    "-"
  );
});

const formatMoney = (value, currency = defaultCurrency.value) => {
  if (value === null || value === undefined || value === "") return `0 ${currency}`;
  return `${value} ${currency}`.trim();
};

const fetchSettlementDetails = async () => {
  loadingDetails.value = true;
  try {
    const res = await axios.get(`provider/settlements/orders-details/${id}`, config.value);
    if (response(res) === "success" || res.data?.key === "success") {
      settlementDetails.value = res.data?.data || null;
      return;
    }

    settlementDetails.value = null;
    errorToast(res.data?.msg || "تعذر تحميل تفاصيل التسوية");
  } catch (err) {
    console.error("Fetch settlement details error:", err);
    settlementDetails.value = null;
    errorToast(err.response?.data?.msg || "تعذر تحميل تفاصيل التسوية");
  } finally {
    loadingDetails.value = false;
  }
};

const fetchSettlementOrders = async () => {
  loadingOrders.value = true;
  try {
    const res = await axios.get(`provider/settlements/orders/${id}?page=${currentPage.value}`, config.value);
    if (response(res) === "success" || res.data?.key === "success") {
      const data = res.data?.data || {};
      const pagination = data.pagination || {};

      settlementOrders.value = Array.isArray(data.settlement_orders) ? data.settlement_orders : [];
      totalItems.value = pagination.total_items || 0;
      pageLimit.value = pagination.per_page || 20;
      return;
    }

    settlementOrders.value = [];
    totalItems.value = 0;
    errorToast(res.data?.msg || "تعذر تحميل الطلبات");
  } catch (err) {
    console.error("Fetch settlement orders error:", err);
    settlementOrders.value = [];
    totalItems.value = 0;
    errorToast(err.response?.data?.msg || "تعذر تحميل الطلبات");
  } finally {
    loadingOrders.value = false;
  }
};

const onPaginate = (e) => {
  currentPage.value = e.page + 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

</script>

<style scoped lang="scss">
.settlement-details-page {
  background: #fff;
  direction: rtl;
  min-height: 500px;
  padding: 46px 0 70px;
}

.details-container {
  max-width: 920px;
}

.settlement-shell {
  max-width: 660px;
  margin: 0 auto;
}

.status-line {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row-reverse;
  gap: 8px;
  margin-bottom: 34px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #2c58a2;

  &.rejected {
    background: #dc3545;
  }

  &.approved,
  &.finished {
    background: #198754;
  }
}

.status-text {
  color: #2c58a2;
  font-size: 15px;
  font-weight: 700;

  &.rejected {
    color: #dc3545;
  }

  &.approved,
  &.finished {
    color: #198754;
  }
}

.summary-card,
.order-card {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}

.summary-card {
  overflow: hidden;
}

.summary-header {
  min-height: 46px;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 0 16px;
  color: #222;
  font-size: 13px;
  font-weight: 600;
}

.summary-chevron {
  color: #aaa;
  font-size: 12px;
}

.summary-body {
  padding: 14px 16px 16px;
  direction: rtl;
}

.summary-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.summary-label {
  color: #222;
  font-size: 14px;
  text-align: right;
}

.summary-value {
  color: #111;
  font-size: 15px;
  text-align: left;
  white-space: nowrap;
}

.summary-divider {
  height: 1px;
  background: #efefef;
  margin: 12px 0;
}

.summary-row.total {
  margin-bottom: 0;

  .summary-label,
  .summary-value {
    color: #2c58a2;
    font-weight: 700;
  }
}

.settlement-message {
  color: #666;
  font-size: 14px;
  line-height: 1.7;
  margin: 14px 0 32px;
  text-align: right;
}

.transfer-section {
  margin: 28px 0 38px;
}

.transfer-title {
  color: #222;
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 16px;
}

.transfer-image {
  width: min(360px, 100%);
  max-height: 180px;
  border-radius: 12px;
  object-fit: cover;
}

.reject-card {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px 16px 18px;
  margin: 28px 0 38px;
  background: #fff;
}

.reject-title {
  color: #e34d4d;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  text-align: right;
}

.reject-divider {
  height: 1px;
  background: #efefef;
  margin: 10px 0 12px;
}

.reject-text {
  color: #777;
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
  text-align: center;
}

.orders-section {
  margin-top: 42px;
}

.orders-title {
  color: #222;
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 14px;
  text-align: right;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-card {
  padding: 12px 16px 10px;
}

.order-head {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 10px;
}

.order-number {
  color: #222;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  text-align: right;
}

.order-time {
  display: inline-flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 5px;
  color: #9a9a9a;
  font-size: 11px;
  white-space: nowrap;
}

.order-values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  direction: rtl;
  text-align: center;
}

.order-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  color: #9a9a9a;
  font-size: 12px;
}

.metric-value {
  color: #222;
  font-size: 12px;
}

.order-divider {
  height: 1px;
  background: #efefef;
  margin: 12px 0 8px;
}

.order-total {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  color: #222;
  font-size: 15px;
}

.order-total strong {
  color: #2c58a2;
  font-weight: 700;
}

.empty-state {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #777;
  text-align: center;
}

.page-empty {
  min-height: 360px;
}

.empty-img {
  width: 130px;
  height: auto;
  opacity: 0.75;
}

.paginate-parent {
  display: flex;
  justify-content: center;
}

@media (max-width: 575px) {
  .settlement-details-page {
    padding-top: 28px;
  }

  .summary-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .summary-value {
    text-align: right;
  }

  .order-head {
    align-items: flex-start;
    flex-direction: column-reverse;
  }

  .order-values {
    grid-template-columns: 1fr;
    text-align: right;
  }

  .order-total {
    justify-content: space-between;
  }
}
</style>
