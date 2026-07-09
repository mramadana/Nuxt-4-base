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

// success response
const { response } = responseApi();

// Toast
const { errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

// loading
const loading = ref(true);

// complaints
const complaints = ref([]);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

/******************* Methods *******************/

// getComplaints
const getComplaints = async () => {
    loading.value = true;
    const statusParam = props.status ? `&status=${props.status}` : '';
    await axios.get(`complaints?page=${currentPage.value}${statusParam}`, config.value).then(res => {
        if (response(res) == "success") {
            complaints.value = res.data.data.complaints;
            totalPage.value = res.data.data.pagination.total_items;
            pageLimit.value = res.data.data.pagination.per_page;
        } else {
            errorToast(res.data.msg);
        }
        loading.value = false;
    }).catch(err => {
        console.error(err);
        loading.value = false;
    });
}

// Paginate Function
const onPaginate = (e) => {
    loading.value = true;
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    getComplaints();
};

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value;
});

/******************* Watch *******************/

watch(() => props.status, async () => {
    currentPage.value = 1;
    await getComplaints();
});

const reloadTrigger = inject('reloadComplaints', ref(0));

watch(reloadTrigger, async (newVal) => {
    if (newVal > 0) {
        currentPage.value = 1;
        await getComplaints();
    }
});

/******************* Expose *******************/
defineExpose({
    getComplaints
});

/******************* Mounted *******************/
onMounted(async () => {
    await getComplaints();
});
</script>

