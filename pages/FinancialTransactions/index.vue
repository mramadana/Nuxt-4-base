<template>
  <div class="settlements-page">
    <!-- Page Header / Breadcrumbs -->
    <h4 class="main-title lg mb-5 page-title">
      <div class="container fs17">
        <nuxt-link to="/"><i class="fas fa-home c-main"></i></nuxt-link>
        /
        {{ $t("settlements.title") }}
      </div>
    </h4>

    <div class="container settlements-container">
      <!-- Tabs Switcher -->
      <div class="settlements-tabs-container">
        <div class="settlements-tabs-pill">
          <button
            type="button"
            class="settlements-tab-btn"
            :class="{ active: activeTab === 'due' }"
            @click="switchTab('due')"
          >
            {{ $t("settlements.tab_due") }}
          </button>
          <button
            type="button"
            class="settlements-tab-btn"
            :class="{ active: activeTab === 'pending' }"
            @click="switchTab('pending')"
          >
            {{ $t("settlements.tab_pending") }}
          </button>
          <button
            type="button"
            class="settlements-tab-btn"
            :class="{ active: activeTab === 'finished' }"
            @click="switchTab('finished')"
          >
            {{ $t("settlements.tab_finished") }}
          </button>
        </div>
      </div>

      <!-- Tab Content: Due (مستحقة) -->
      <div v-if="activeTab === 'due'" class="settlements-tab-content">
        <!-- Details Box -->
        <div class="details-card-wrapper mb-5">
          <div v-if="detailsLoading" class="details-skeleton">
            <Skeleton width="100%" height="240px" class="rounded-4" />
          </div>
          <div v-else-if="details" class="details-card">
            <div class="details-header d-flex justify-content-between align-items-center">
              <span class="details-title">{{ $t("settlements.total_values") }}</span>
              <i class="fas fa-chevron-down chevron-icon text-muted"></i>
            </div>
            
            <div class="details-body">
              <div class="detail-row">
                <span class="detail-label">{{ $t("settlements.total_orders_amount") }}</span>
                <span class="detail-value">{{ details.total_orders_amount }} {{ $t("Global.Rs") }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">{{ $t("settlements.total_admin_commission") }}</span>
                <span class="detail-value">{{ details.total_admin_commission }} {{ $t("Global.Rs") }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">{{ $t("settlements.total_vat_amount") }}</span>
                <span class="detail-value">{{ details.total_vat_amount }} {{ $t("Global.Rs") }}</span>
              </div>
              
              <hr class="divider-line" />
              
              <div class="detail-row total-row">
                <span class="detail-label font-bold">{{ $t("settlements.due_amount") }}</span>
                <span class="detail-value font-bold c-main">{{ details.total_provider_amount }} {{ $t("Global.Rs") }}</span>
              </div>

              <!-- Settlement request message from api if any -->
              <p v-if="details.msg" class="msg-text text-muted text-center mt-3 mb-3">{{ details.msg }}</p>

              <!-- Request Settlement Button -->
              <button
                type="button"
                class="custom-btn w-100 py-3 mt-2 request-btn"
                :disabled="!details.send_request_button || submitLoading"
                @click="sendSettlementRequest"
              >
                <span v-if="submitLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ $t("settlements.request_settlement") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Orders Section -->
        <div class="orders-section">
          <h5 class="section-title mb-4">{{ $t("settlements.orders") }}</h5>

          <!-- Loading State -->
          <div v-if="ordersLoading" class="row g-4">
            <div v-for="i in 3" :key="i" class="col-12">
              <Skeleton width="100%" height="180px" class="rounded-4" />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!settlements.length" class="empty-state py-5 text-center">
            <img src="@/assets/images/home-boxe.svg" alt="no settlements" class="empty-img mb-4" />
            <p class="text-muted">{{ $t("settlements.no_data") }}</p>
          </div>

          <!-- Orders Grid -->
          <div v-else class="row g-4">
            <div v-for="item in settlements" :key="item.id" class="col-12">
              <div class="order-card-new">
                <div class="order-card-header d-flex justify-content-between align-items-center">
                  <span class="order-number-title">{{ $t("settlements.order_num") }} {{ item.order_num }}</span>
                  <span class="order-time-text text-muted d-inline-flex align-items-center gap-2">
                    <i class="far fa-clock"></i>
                    {{ item.created_at }}
                  </span>
                </div>

                <div class="order-card-body mt-4">
                  <div class="row text-center g-3">
                    <div class="col-4 border-end-custom">
                      <p class="meta-label mb-2 text-muted">{{ $t("settlements.order_price") }}</p>
                      <p class="meta-value font-bold">{{ item.order_price }} {{ $t("Global.Rs") }}</p>
                    </div>
                    <div class="col-4 border-end-custom">
                      <p class="meta-label mb-2 text-muted">{{ $t("settlements.admin_commission") }}</p>
                      <p class="meta-value font-bold">{{ item.admin_commission }} {{ $t("Global.Rs") }}</p>
                    </div>
                    <div class="col-4">
                      <p class="meta-label mb-2 text-muted">{{ $t("settlements.vat_amount") }}</p>
                      <p class="meta-value font-bold">{{ item.vat_amount }} {{ $t("Global.Rs") }}</p>
                    </div>
                  </div>
                </div>

                <hr class="divider-line" />

                <div class="order-card-footer d-flex justify-content-between align-items-center mt-3">
                  <span class="total-label-text font-bold">{{ $t("settlements.total") }}</span>
                  <span class="total-value-text font-bold c-main">{{ item.total_price }} {{ $t("Global.Rs") }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="showPaginate" class="pagination-wrapper mt-5">
            <Paginator
              :rows="pageLimit"
              @page="onPaginate"
              :totalRecords="totalPage"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <!-- Tab Content: Pending (جديدة) & Finished (منتهية) -->
      <div v-else class="settlements-tab-content">
        <!-- Loading State -->
        <div v-if="ordersLoading" class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div v-for="i in 8" :key="i" class="col">
            <Skeleton width="100%" height="160px" class="rounded-4" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!settlements.length" class="empty-state py-5 text-center">
          <img src="@/assets/images/home-boxe.svg" alt="no settlements" class="empty-img mb-4" />
          <p class="text-muted">{{ $t("settlements.no_data") }}</p>
        </div>

        <!-- Settlements Grid -->
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div v-for="item in settlements" :key="item.id" class="col">
            <div class="settlement-grid-card cursor-pointer" @click="navigateTo(`/FinancialTransactions/${item.id}`)">
              <div class="grid-card-header d-flex justify-content-between align-items-center">
                <span class="order-number-title">{{ $t("settlements.order_num") }} {{ item.order_num }}</span>
                <span class="order-time-text text-muted d-inline-flex align-items-center gap-1">
                  {{ item.created_at }}
                </span>
              </div>
              
              <hr class="divider-line" />
              
              <div class="grid-card-footer d-flex justify-content-between align-items-center">
                <span 
                  class="status-badge" 
                  :class="item.status?.key"
                >
                  {{ item.status?.title || item.status?.name }}
                </span>
                
                <span class="amount-text">
                  {{ $t("settlements.order_price") }}:
                  <span class="font-bold c-main">{{ item.total_provider_amount }} {{ $t("Global.Rs") }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="showPaginate" class="pagination-wrapper mt-5">
          <Paginator
            :rows="pageLimit"
            @page="onPaginate"
            :totalRecords="totalPage"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

definePageMeta({
  name: "Titles.payment_requests",
  authIsRequired: true,
  middleware: "auth",
});

const { t } = useI18n({ useScope: "global" });
const request = useApiMutation();
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// State variables
const activeTab = ref("due"); // 'due', 'pending', 'finished'
const submitLoading = ref(false);

// Pagination
const currentPage = ref(1);
const pageLimit = ref(20);
const totalPage = ref(0);

const settlementsEndpoint = computed(() => {
  if (activeTab.value === "pending") {
    return "provider/settlements/pending";
  }

  if (activeTab.value === "finished") {
    return "provider/settlements/finished";
  }

  return "provider/settlements/index";
});

const {
  payload: detailsPayload,
  pending: detailsLoading,
  refresh: refreshDueDetails,
} = await useApiData("provider/settlements/index-details", {
  auth: true,
  cacheKey: "api:settlements:due-details",
});

const {
  payload: settlementsPayload,
  pending: ordersLoading,
  refresh: refreshSettlements,
} = await useApiData(() => settlementsEndpoint.value, {
  auth: true,
  query: computed(() => ({ page: currentPage.value })),
  watch: [activeTab, currentPage],
});

const details = computed(() => detailsPayload.value || null);
const settlements = computed(
  () => settlementsPayload.value?.settlements || [],
);

watchEffect(() => {
  const pagination = settlementsPayload.value?.pagination || {};
  totalPage.value = pagination.total_items || 0;
  pageLimit.value = pagination.per_page || 20;
});

const showPaginate = computed(() => {
  return totalPage.value > pageLimit.value;
});

// Send settlement request
const sendSettlementRequest = async () => {
  if (submitLoading.value) return;
  submitLoading.value = true;

  try {
    const res = await request("provider/settlements/send-request", {
      method: "POST",
      auth: true,
      body: {},
    });

    if (res.key === "success") {
      successToast(res.msg || t("Global.Saving_changes_success"));
      // Refresh statistics and list
      await refreshDueDetails();
      await refreshSettlements();
    } else {
      errorToast(res.msg || t("Global.error_sending"));
    }
  } catch (err) {
    console.error("Send settlement request error:", err);
    errorToast(err.response?.data?.msg || t("Global.error_sending"));
  } finally {
    submitLoading.value = false;
  }
};

// Handle paginator changes
const onPaginate = (e) => {
  currentPage.value = e.page + 1;
  window.scrollTo(0, 0);
};

// Switch active tab
const switchTab = (tab) => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  currentPage.value = 1;
};
</script>

<style scoped lang="scss">
.settlements-page {
  background: #fff;
  min-height: 500px;
  padding-bottom: 60px;
}

.page-title {
  background: #f8f9fa;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.settlements-container {
  max-width: 1440px;
  padding-top: 10px;
}

/* Tabs switcher styling matching screenshots */
.settlements-tabs-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 35px;
}

.settlements-tabs-pill {
  display: flex;
  background: #e8ebf0;
  border-radius: 12px;
  padding: 6px;
  width: 100%;
  max-width: 480px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.settlements-tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  outline: none;

  &.active {
    background: #2c58a2;
    color: #fff;
    box-shadow: 0 4px 10px rgba(44, 88, 162, 0.3);
  }
}

/* Values summary card */
.details-card-wrapper {
  display: flex;
  justify-content: center;
}

.details-card {
  width: 100%;
  max-width: 680px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  .details-header {
    margin-bottom: 24px;

    .details-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a202c;
    }

    .chevron-icon {
      font-size: 14px;
    }
  }

  .details-body {
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      font-size: 15px;

      .detail-label {
        color: #4a5568;
      }

      .detail-value {
        color: #1a202c;
        font-weight: 600;
      }

      &.total-row {
        margin-top: 14px;
        margin-bottom: 20px;
        font-size: 17px;
      }
    }

    .divider-line {
      border: 0;
      border-top: 1px solid #edf2f7;
      margin: 18px 0;
    }

    .msg-text {
      font-size: 13px;
      line-height: 1.5;
    }

    .request-btn {
      font-weight: bold;
      border-radius: 8px;
      height: 48px;
    }
  }
}

.details-skeleton {
  width: 100%;
  max-width: 680px;
}

/* Section title */
.section-title {
  font-size: 19px;
  font-weight: 700;
  color: #1a202c;
}

/* Orders Cards - Tab: Due */
.order-card-new {
  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }

  .order-number-title {
    font-size: 16px;
    font-weight: 700;
    color: #2d3748;
  }

  .order-time-text {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    
    i {
      font-size: 14px;
    }
  }

  .border-end-custom {
    border-inline-end: 1px solid #edf2f7;
  }

  .meta-label {
    font-size: 12px;
    color: #718096;
  }

  .meta-value {
    font-size: 16px;
    color: #2d3748;
  }

  .divider-line {
    border: 0;
    border-top: 1px solid #f7fafc;
    margin: 16px 0 12px;
  }

  .total-label-text {
    font-size: 15px;
    color: #4a5568;
  }

  .total-value-text {
    font-size: 18px;
  }
}

/* Grid layout cards - Tabs: Pending, Finished */
.settlement-grid-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  height: 100%;

  .order-number-title {
    font-size: 14px;
    font-weight: 700;
    color: #2d3748;
  }

  .order-time-text {
    font-size: 11px;
    color: #718096;
  }

  .divider-line {
    border: 0;
    border-top: 1px solid #edf2f7;
    margin: 12px 0;
  }

  .grid-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    font-size: 12px;

    .status-badge {
      font-weight: bold;
      
      /* Color states matching status key */
      &.pending {
        color: #2c58a2;
      }
      
      &.rejected {
        color: #d56470;
      }
      
      &.approved, &.finished {
        color: #2c58a2;
      }
    }

    .amount-text {
      color: #718096;
    }
  }
}

/* Empty State Styling */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  
  .empty-img {
    width: 140px;
    height: auto;
    opacity: 0.7;
  }

  p {
    font-size: 15px;
    margin: 0;
  }
}

/* Colors utility helper */
.c-main {
  color: #2c58a2 !important;
}

/* Pagination Wrapper */
.pagination-wrapper {
  display: flex;
  justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
