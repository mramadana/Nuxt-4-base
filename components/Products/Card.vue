<template>
    <div>



        <!-- start to make card  -->

        <div :class="['grid-res grid-res2', viewMode === 'list' ? 'grid-list' : 'grid-4']" v-if="!loading_Product">
            <div class="product_card" :data-product-id="product.id" v-for="product in products" :key="product.id">
                <div class="fav_icon" v-if="isLoggedIn && product?.user?.id != user.id" @click="addToFavautire(product)" :class="{ isFav: product.is_favorited && isLoggedIn, 'activeFavorite': product.isActive }">
                    <div v-if="!loading[product.id]">
                        <i class="fas fa-heart"></i>
                    </div>
                    <span class="spinner-border spinner-border-sm m-0" v-if="loading[product.id]" role="status" aria-hidden="true"></span>
                </div>
                <div class="fav_icon" v-if="isLoggedIn && product?.user?.id == user.id" @click="navigateTo(`/myProducts/create?id=${product.id}`)" :class="{ isFav: product.is_favorited && isLoggedIn, 'activeFavorite': product.isActive }">
                    <div v-if="!loading[product.id]">
                        <i class="fas fa-heart"></i>
                    </div>
                    <span class="spinner-border spinner-border-sm m-0" v-if="loading[product.id]" role="status" aria-hidden="true"></span>
                </div>

                <div class="status-main">{{ product.condition?.label }}</div>

                <div v-if="!disableRoute" class="product_img d-block">
                    <img loading="lazy" :src="product.image || product.images[0]?.image" alt="image" />
                    <!-- <Rating v-model="product.avg_rate" v-if="isRated" class="small product_rating" readonly :cancel="false" /> -->
                </div>

                <NuxtLink v-else :to="`/products/${product.id}`" class="product_img d-block">
                    <img loading="lazy" :src="product.image || product.images[0]?.image" alt="image" />
                    <!-- <Rating v-model="product.avg_rate" v-if="isRated" class="small product_rating" readonly :cancel="false" /> -->
                </NuxtLink>
                
                <div class="product_body">
                    <div class="info">
                        <NuxtLink :to="`/products/${product.id}`" class="product_name">
                            {{ product.service_type?.label }}
                        </NuxtLink> 
                        <NuxtLink :to="`/products/${product.id}`" class="product_name text-center">
                            {{ product.is_insured ? $t('products.insured') : $t('products.not_insured') }}
                        </NuxtLink>
                        <NuxtLink :to="`/products/${product.id}`" class="product_name c-main" style="text-align:left">
                            {{ product.avg_rating }} <i class="fas fa-star c-black"></i>
                        </NuxtLink>
                    </div>
                    <p class="product_desc font-bold">{{ product.title }}</p>
                    <p class="product_desc">{{ product.city?.name }} - {{ product.city?.country?.name }}</p>
                    <div class="info">
                        <NuxtLink :to="`/products/${product.id}`" class="product_name font-bold">
                            {{ product.category?.name }}
                        </NuxtLink>
                        <p class="product_price font-bold">{{ product.price }} <img src="@/assets/images/Saudi_Riyal_Symbol-2 1 (1).png" alt=""></p>
                    </div>

                    <!-- <span class="product_retrieval_text" v-if="product?.retrieval_text">{{ product.retrieval_text }}</span> -->


                    <!-- <button class="custom-btn mr-auto shop-now" v-if="product.qty" :data-product-id="product.id" @click="addToCart(product)" :disabled="loadingCart[product.id]">
                        
                        <i class="fas fa-check-circle card-check"></i>
                            <span class="btn-inner">
                                {{ $t('products.addToCart') }}
                                <i class="fas fa-cart-arrow-down cart-icon"></i>
                            </span>
                    </button> -->
                    
                    <!-- <div class="custom-btn cancel mr-auto" v-else> {{ $t('Home.quantity_stock') }}</div> -->
                </div>
            </div>
        </div>

        <!-- start to make skelton for card -->

        <div class="row" v-if="loading_Product">
            <div class="col-12 col-xl-3 col-md-4 mb-5" v-for="i in 4" :key="i" :class="'skelton-' + i">
                <div class="product_card" >
                    <div class="product_img product_img_skelton">
                        <Skeleton height="210px" class="rounded-0"></Skeleton>
                    </div>
                    <div class="product_body">
                        <div class="info gap-3 mb-1">
                            <Skeleton height=".7rem" width="80%" class="mb-3"></Skeleton>
                            <Skeleton height=".7rem" width="20%" class="mb-3 product_price"></Skeleton>
                        </div>
                        <Skeleton width="100%" height=".7rem" class="mb-3 small"></Skeleton>
                        <div>
                            <Skeleton  class="mr-auto custom-btn skelton-btn"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- if no product found -->
         
        <div class="no-data" v-if="!products?.length && !loading_Product">
            <img  loading="lazy" src="@/assets/images/no_data.png" alt="image" class="no-data-img">
            <div class="no-data-text">{{ $t('products.no_products') }}</div>
        </div>

    </div>
</template>

<script setup>

    /******************* Props *******************/
    const props = defineProps({

        products: {
            type: Array,
            required: true,
        },

        isRated: {
            type: Boolean,
            default: false
        },

        loading_Product: {
            type: Boolean,
            default: false,
        },

        route: {
            type: String
        },

        title: {
            type: String,
        },

        disableRoute: { 
            type: Boolean,
            default: false
        },

        anchorTitle: {
            type: Boolean,
            default: true
        },

        viewMode: {
            type: String,
            default: 'grid'
        }
    })


    /******************* composables *******************/
    const { response } = responseApi();

    const axios = useApi();

    // Store
    const store = useAuthStore();
    const { token, user , isLoggedIn, notificationToken } = storeToRefs(store);

    const mac_address = ref(null);
    

    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });

    // Toast
    const { successToast, errorToast } = toastMsg();

    /******************* Data *******************/

    // Fav
    const fav = ref(false);

    // loading
    const loading = ref({});
    const loadingCart = ref({});

    // emit
    const emit = defineEmits(['toggleFavautire']);

    /******************* Methods *******************/

    // Toggle favourite method
    const addToFavautire = async (product) => {
        // product.isActive = !product.isActive;
        product.is_favorited ? product.is_favorited = false : product.is_favorited = true;
        // config
        const config = {
            headers: { Authorization: `Bearer ${token.value}` }
        };

        loading.value[product.id] = true;

        const fd = new FormData();
        fd.append('advertisement_id', product.id);

        await axios.post(`user/advertisements/favorites/toggle`, fd, config).then(res => {
            if (response(res) == "success") {
                fav.value = res.data.data.is_favorite;

                successToast(res.data.msg);

                // Add To Favourite

                // emit method to toggle favourite and and delete card from favorite
                emit('toggleFavautire', product.id);

            } else {
                errorToast(res.data.msg);
            }
            loading.value[product.id] = false;
        }).catch(err => {
            console.error(err);
        });

    }



    onBeforeMount(() => {
        store.checkMacAddress();
        mac_address.value = store.mac_address;
    });

</script>

<style lang="scss" scoped>
.grid-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}
.status-main{
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;
    padding: 5px 10px;
    background-color: #132e4e;
    color: #fff;
    border-radius: 15px;
    font-size: 14px;
}
    .skelton-btn {
        width: 220px !important;
        background-color: #cecfd3 !important;
        border: 1px solid #cecfd3 !important;
    }
    .skeleton-star {
        display: inline-block;
        width: 20px !important;
        height: 20px !important;
        background-color: #c8bcbc;
        clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
        );
        position: relative;
        margin-inline-end: 3px;
        animation: loading 1.5s infinite; 
    }

    @keyframes loading {
        0% {
            background-position: -100% 0;
        }
        100% {
            background-position: 100% 0;
        }
    }
    .shop-now:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }
    @media (max-width: 1024px) {
        .product_img_skelton {
            height: auto;
        }
        .skelton-4 {
            display: none;
        }
    }
</style>
