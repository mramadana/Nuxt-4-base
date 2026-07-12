<template>
    <div>
        <div v-if="!loading">
            
            <div v-if="complaints?.length">
                <ComplaintsCardComplaint :complaints="complaints" />
            </div>
    
            <div class="d-flex align-items-center justify-content-center mb-5" v-if="!complaints?.length">
                <div class="no-data">
                    <img  loading="lazy" src="@/assets/images/no_data.png" alt="image" class="no-data-img car-img">
                    <div class="no-data-text">{{ $t('Global.no_complaints') }}</div>
                </div>
            </div>
        </div>

        <div v-if="loading">
            <ComplaintsComplaintSkeleton />
        </div>

        <!--***** Paginator *****-->
        <div class="paginate-parent" v-if="showPaginate">
            <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-4 mb-4" dir="ltr" />
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    status: {
        type: String,
        default: 'under_review'
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
    payload: complaintsPayload,
    pending: loading,
    refresh: refreshComplaints,
} = await useApiData(`complaints`, {
    auth: true,
    query: computed(() => ({
        page: currentPage.value,
        ...(props.status ? { status: props.status } : {}),
    })),
    watch: [currentPage, () => props.status],
});

const complaints = computed(() => complaintsPayload.value?.complaints || []);

watchEffect(() => {
    const pagination = complaintsPayload.value?.pagination || {};
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

watch(() => props.status, async () => {
    currentPage.value = 1;
    await refreshComplaints();
});

const reloadTrigger = inject('reloadComplaints', ref(0));

watch(reloadTrigger, async (newVal) => {
    if (newVal > 0) {
        currentPage.value = 1;
        await refreshComplaints();
    }
});

/******************* Expose *******************/
defineExpose({
    getComplaints: refreshComplaints
});
</script>

