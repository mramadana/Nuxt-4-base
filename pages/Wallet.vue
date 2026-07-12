<template>
    <div>

        <div class="container">
    
            <div class="layout-form custom-width md mb-5">
                <h1 class="main-title bold lg mb-5">{{ $t("Global.wallet") }}</h1>
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">
                        <div class="text-center mb-4">
                            <img src="@/assets/images/walletillustration.png" alt="restore-image" class="restore-image mb-4">
                            <div class="mb-3">
                                <h4 class="main-desc mb-3">{{ $t("Global.wallet_balance") }}</h4>
                                <h2 v-if="!loading" class="main-title main-cl">{{ walletValue?.balance }} {{ walletValue?.currency }}</h2>
                                <div class="d-flex align-items-center justify-content-center mt-3 mb-3" v-if="loading">
                                    <Skeleton height=".9rem" width="4rem"></Skeleton>
                                </div>
                            </div>
                        </div>
                        <button type="button" @click="successfullySent = true"  class="custom-btn cancel md mr-auto">
                             {{ $t('Global.charge_balance') }} 
                        </button>
                    </div>
                </div>
            </div>
    
        </div>

    
       
        
    
        <Dialog v-model:visible="successfullySent" modal class="custum_dialog_width auth-daialog" :draggable="false" >
    
            <div class="main-text center">
                <img src="@/assets/images/main-logo.svg" alt="login-logo" class="login-logo" loading="lazy">
                <h1 class="main-title main-cl">{{ $t('Global.charge_balance') }}</h1>
                <p class="main-desc">{{ $t('Global.please_enter_amount') }}</p>
            </div>
    
            <div class="mt-3">
                <div class="form-group">
                    <label class="label">
                        {{ $t('Global.balance') }}
                    </label>
                    <div class="main_input">
                        <input type="number" class="custum-input-icon" name="amount" v-model="amount" :placeholder="$t('order.enter_amount')">
                    </div>
                </div>
    
                <button type="button" @click="chargeWallet" class="custom-btn md mr-auto">
                    {{ $t('Global.charge') }} 
                    <span class="spinner-border spinner-border-sm" v-if="chargeLoading" role="status" aria-hidden="true"></span>
                </button>
            </div>
        </Dialog>

    </div>
</template>

<script setup>

    definePageMeta({
        name: "Home.portfolio",
        authIsRequired: true,
        middleware: 'auth'
    })

    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });

    const amount = ref('');

    const successfullySent = ref(false);

   const redirectUrl = ref(null);
    const { getSeoData, checkSeoKey } = useSeo();
    await getSeoData();
    const pageSeo = computed(() => checkSeoKey("wallet") || null);

    // Store
    const store = useAuthStore();
    const { token } = storeToRefs(store);

    const { payload: walletPayload, pending: loading, refresh: refreshWallet } = await useApiData('wallet-balance', {
        auth: true,
        cacheKey: 'api:wallet-balance'
    });
    const walletValue = computed(() => walletPayload.value || {});
    const chargeLoading = ref(false);

    // success response
    const { response } = responseApi();

    // Toast
    const { successToast, errorToast } = toastMsg();

    // Axios
    const axios = useApi();

    // config
    const config = {
        headers: { Authorization: `Bearer ${token.value}` }
    };

    const chargeWallet = async () => {
        chargeLoading.value = true;
        const fd = new FormData();
        fd.append('balance', amount.value);
        fd.append('platform', "web");
        if (amount.value == '') {
            errorToast(t(`order.enter_amount`));
            chargeLoading.value = false;
        } else if (amount.value <= 0) {
            errorToast(t(`order.enter_amount`));
            amount.value = null;
            chargeLoading.value = false;
        } else {
            try {
                const res = await axios.post(`charge-wallet-online`, fd, config);
                if (response(res) == "success") {
                    amount.value = null;
                    successfullySent.value = false;
                    redirectUrl.value = res.data.data;
                    await refreshWallet();
                    // Redirect to payment page in the same window
                    window.location.href = redirectUrl.value;
                    successToast(res.data.msg);
                } else {
                    errorToast(res.data.msg);
                }
            } catch (err) {
                console.error(err);
            } finally {
                chargeLoading.value = false;
            }
        }
        
    };

    useHead(() => ({
            title: pageSeo.value?.meta_title,
            meta: [
                { name: 'description', content: pageSeo.value?.meta_description },
                { name: 'keywords', content: pageSeo.value?.meta_keywords },
                { property: 'og:url', content: pageSeo.value?.meta_url }
            ]
        }));
</script>
