<template>
    <div class="notif-page">
        <div class="container">

            <!-- Delete all -->
            <div class="mb-4 delete-all-link-cont" v-if="notifications.length && !loading">
                <button type="button" class="delete-all-link" @click="deleteAll">
                    <span v-if="!deleteLoading">{{ $t("Global.delete_all") }}</span>
                    <span class="spinner-border spinner-border-sm m-0" v-else role="status"
                        aria-hidden="true"></span>
                </button>
            </div>

            <!-- Notifications list -->
            <transition-group name="fade" tag="div" class="notif-list" v-if="!loading">

                <div class="notif-card" v-for="(result, index) in notifications" :key="result.id || index">
                    <!-- Delete (X) button -->
                    <button class="notif-close" @click="removenotifation(index)">
                        <i class="fas fa-times" v-if="!deleteLoading"></i>
                        <span class="spinner-border spinner-border-sm" v-else role="status"
                            aria-hidden="true"></span>
                    </button>

                    <nuxt-link :to="getNotificationRoute(result)"
                        class="notif-card-inner d-flex align-items-start gap-3">
                        <!-- Bell circle icon -->
                        <div class="notif-icon-circle">
                            <i class="fas fa-bell"></i>
                        </div>

                        <!-- Content -->
                        <div class="notif-content">
                            <h3 class="notif-title">{{ result.title }}</h3>
                            <p class="notif-body">{{ result.body }}</p>
                            <div class="notif-time">
                                <span>{{ result.created_at }}</span>
                                <i class="far fa-clock"></i>
                            </div>
                        </div>
                    </nuxt-link>
                </div>

                <div v-if="!notifications.length" key="empty" class="text-center py-5 text-muted">
                    {{ $t("Global.no_notifications") }}
                </div>

            </transition-group>

            <!-- Loading skeletons -->
            <div v-if="loading" class="notif-list">
                <div class="notif-card skeleton-card" v-for="i in 5" :key="i">
                    <div class="d-flex align-items-start gap-3 w-100" style="direction: rtl;">
                        <Skeleton shape="circle" size="3rem"></Skeleton>
                        <div class="flex-grow-1">
                            <Skeleton height=".8rem" width="8rem" class="mb-2"></Skeleton>
                            <Skeleton height=".6rem" width="16rem" class="mb-2"></Skeleton>
                            <Skeleton height=".5rem" width="6rem"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Paginator -->
            <div class="paginate-parent" v-if="showPaginate">
                <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-5" dir="ltr" />
            </div>

        </div>
    </div>
</template>

<script setup>

// toast
const { successToast, errorToast } = toastMsg();
const request = useApiMutation();

// pinia store
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// delete loading
const deleteLoading = ref(false);

const { getSeoData, checkSeoKey } = useSeo();
await getSeoData();
const pageSeo = computed(() => checkSeoKey("notifications") || null);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();
const {
    payload: notificationsPayload,
    pending: loading,
    refresh: refreshNotifications,
} = await useApiData(`provider/notifications`, {
    auth: true,
    query: computed(() => ({ page: currentPage.value })),
    watch: [currentPage],
});

const notifications = computed(() => {
    const notificationsResponse = notificationsPayload.value?.notifications || notificationsPayload.value || {};
    return notificationsResponse.data || [];
});

watchEffect(() => {
    const notificationsResponse = notificationsPayload.value?.notifications || notificationsPayload.value || {};
    const pagination = notificationsResponse.pagination || {};
    totalPage.value = pagination.total_items || 0;
    pageLimit.value = pagination.per_page || 20;
});

definePageMeta({
    authIsRequired: true,
    middleware: 'auth',
    name: 'Global.notifications'
});



/******************* Methods *******************/

// Get notification route based on type
const getNotificationRoute = (notification) => {
    const type = notification.type || '';
    const data = notification.data || {};
    const productId = data.product_id || data.model_id;

    if (type.includes('product') && productId) {
        return `/products/${productId}`;
    }

    // Get order ID from different possible fields
    const orderId = data.order_id || data.special_order_id || data.retrieval_order_id || data.model_id;

    if (!orderId) {
        return '#';
    }

    const orderType = String(data.order_type ?? '');

    if (orderType === '1') {
        return `/retrieval-orders/${orderId}`;
    }

    if (orderType === '0') {
        return `/order-details/${orderId}`;
    }

    // Special orders (special_order_in_transit, special_order_in_progress, etc.)
    if (type.includes('special_order')) {
        return `/orders/specialOrder/${orderId}`;
    }

    // Retrieval / return orders
    if (type.includes('retrieval_order') || type.includes('return_order')) {
        // Check if it's related to a special order
        if (data.special_order_id || type.includes('special')) {
            return `/orders/specialReturnOrders/${orderId}`;
        }
        // Normal return order
        return `/retrieval-orders/${orderId}`;
    }

    // Default: normal orders
    return `/order-details/${orderId}`;
};

// Paginate Function
const onPaginate = (e) => {
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
};

// Remove Single Notification
const removenotifation = async (index) => {
    const res = await request(`general/delete-notification/${notifications.value[index].id}`, {
        method: "DELETE",
        auth: true
    });
    if (res.key === "success") {
        await refreshNotifications();
        successToast(res.msg);
    } else {
        errorToast(res.msg);
    }
}

//  Delete All Notifications

const deleteAll = async () => {
    const res = await request(`general/delete-notifications`, {
        method: "DELETE",
        auth: true
    });
    if (res.key === "success") {
        successToast(res.msg);
        await refreshNotifications();
    } else {
        errorToast(res.msg);
    }
}

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
});


/******************* Mounted *******************/

useHead(() => ({
        title: pageSeo.value?.meta_title,
        meta: [
            { name: 'description', content: pageSeo.value?.meta_description },
            { name: 'keywords', content: pageSeo.value?.meta_keywords },
            { property: 'og:url', content: pageSeo.value?.meta_url }
        ]
    }));

onMounted(async () => {
    // Listen for new notification events to refresh the list
    if (process.client) {
        const handleNewNotification = () => {
            // Reset to first page and refresh notifications
            currentPage.value = 1;
            refreshNotifications();
        };

        window.addEventListener('new-notification-received', handleNewNotification);

        // Cleanup event listener on unmount
        onBeforeUnmount(() => {
            window.removeEventListener('new-notification-received', handleNewNotification);
        });
    }
});




</script>


<style lang="scss" scoped>
.notif-page {
    min-height: 400px;
    padding: 30px 0 60px;
}

/* Breadcrumb */
.notif-breadcrumb {
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    .breadcrumb-slash {
        font-size: 18px;
        color: #999;
    }

    .breadcrumb-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
    }

    .breadcrumb-icon-box {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background: var(--main, #c8a45a);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
    }
}

/* Delete all link */
.delete-all-link-cont {
    display: flex;
    align-items: center;
    justify-content: end;
}

.delete-all-link {
    background: none;
    border: none;
    color: red !important;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;

    &:hover {
        text-decoration: underline;
    }
}

/* Notification list */
.notif-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Notification card */
.notif-card {
    position: relative;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    border-right: 4px solid var(--main, #c8a45a);
    padding: 18px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    &.skeleton-card {
        border-right-color: #eee;
    }
}

.notif-card-inner {
    text-decoration: none;
    color: inherit;
    direction: rtl;
}

/* Close / X button */
.notif-close {
    position: absolute;
    top: 14px;
    left: 14px;
    background: none;
    border: none;
    color: #bbb;
    font-size: 14px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    transition: color 0.2s;

    &:hover {
        color: #e74c3c;
    }
}

/* Circle bell icon */
.notif-icon-circle {
    width: 46px;
    height: 46px;
    min-width: 46px;
    border-radius: 50%;
    background: #1e3a5f;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
}

/* Content */
.notif-content {
    flex: 1;
    text-align: right;

    .notif-title {
        font-size: 15px;
        font-weight: 700;
        color: #222;
        margin: 0 0 4px;
    }

    .notif-body {
        font-size: 13px;
        color: #555;
        margin: 0 0 6px;
        word-break: break-word;
    }

    .notif-time {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        font-size: 12px;
        color: #999;

        i {
            font-size: 12px;
        }
    }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
