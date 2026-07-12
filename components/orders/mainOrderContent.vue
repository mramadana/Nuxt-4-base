<template>
    <div>
        <div v-if="!loading">
            
            <div v-if="orders?.length">
                <OrdersCardOrder :orders="orders" :orderType="orderType" />
            </div>
    
            <div class="d-flex align-items-center justify-content-center mb-5" v-if="!orders?.length">
                <div class="no-data">
                    <img  loading="lazy" src="@/assets/images/no_data.png" alt="image" class="no-data-img car-img">
                    <div class="no-data-text">{{ $t('Global.no_orders') }}</div>
                </div>
            </div>
        </div>

        <div v-if="loading">
            <OrdersOrderSkeleton />
        </div>

        <!--***** Paginator *****-->
        <div class="paginate-parent" v-if="showPaginate">
            <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-4 mb-4" dir="ltr" />
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    ordersName: {
        type: String,
        required: true
    },
    noData: {
        type: String,
        required: true
    },
    orderType: {
        type: String,
        default: 'general', // 'general' for myorders, 'special' for specialOrder
        validator: (value) => ['general', 'special'].includes(value)
    }
});

// pinia store
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

const {
    payload: ordersPayload,
    pending: loading,
} = await useApiData(() => props.ordersName, {
    auth: true,
    query: computed(() => ({ page: currentPage.value })),
    watch: [currentPage, () => props.ordersName],
});

const orders = computed(() => ordersPayload.value?.orders || []);

watchEffect(() => {
    const pagination = ordersPayload.value?.pagination || {};
    totalPage.value = pagination.total_items || 0;
    pageLimit.value = pagination.per_page || 20;
});

/******************* Methods *******************/

// Paginate Function
const onPaginate = (e) => {
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
};

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value;
});

/******************* Watch *******************/
</script>
