<template>
    <div>

        <div class="row">

            <div class="col-md-12 col-xl-10 mx-auto">

                <!-- start to make card Add to cart -->
                <div class="row g-3" v-if="!cartLoading">
                    <div class="col-12 col-md-6 mb-4" v-for="cart in carts" :key="cart.id">
                        <div class="cart-item CartLayout">
                            <img :src="cart.product_image" alt="cart-img" class="cart-img" loading="lazy">
                            <div class="cart-info d-flex flex-column h-100">
                                <div class="top-title">
                                    
                                    <h3 class="main-title normal mb-0">{{ cart.product_name }}</h3>

                                    <button class="remove-btn" @click="removeCart(cart)" v-if="cartTool">
                                        <i class="fas fa-trash-alt" v-if="!loading[cart.id]"></i>
                                        <span class="spinner-border spinner-border-sm m-0" v-if="loading[cart.id]" role="status" aria-hidden="true"></span>
                                    </button>

                        
                                    <!-- <div class="new-sign mb-0" v-if="rateOrder && !props.isRated" @click="$emit('rateOrderFun', cart)">
                                        <button class="decoration">{{ $t('orderDetails.rate') }}</button>
                                    </div> -->

                                    <div v-if="props.isRated && cart.avg_rate">
                                        <Rating :modelValue="cart.avg_rate" class="small product_rating text-center" readonly :cancel="false" />
                                    </div>

                                    <div class="custom-radio" v-if="cancelOrderChecked">
                                        <label>
                                            <input type="checkbox" name="cancel_reason_id" :value="cart" v-model="selectedIds" class="d-none new-mark" @change="emitSelectedCarts"/>
                                            <span class="mark new-mark"></span>
                                        </label>
                                    </div>
                                </div>
                                <p class="product_retrieval_text mb-3" v-if="cart.retrieval_text">{{ cart.retrieval_text }}</p>
                                <h5 class="main-desc sm product-description flex-grow-1">{{ cart.product_description }}</h5>
                                <div class="cart-foot">
                                    <span class="main-cl"> {{ cart.total_product_price || cart.product_total || cart.total }}</span>
                                    <div class="counter-section">
                                        <div class="update-btn overflow-hidden" v-if="cartTool">
                                            <button class="update-cart" :class="{'active': cart.isActive}" @click="updateCart(cart)">
                                                <span v-if="!loadingUpdate[cart.id]">{{ $t('products.update') }}</span>
                                                <span class="spinner-border spinner-border-sm m-0" v-if="loadingUpdate[cart.id]" role="status" aria-hidden="true"></span>
                                            </button>
                                        </div>
                                        <button class="plus-btn" v-if="cartTool" @click="updateCounter(cart, 'plus')"><i class="fas fa-plus plus main-cl"></i></button>
                                        <span class="counter">{{ cart.qty || cart.quantity }}</span>
                                        <button class="minus-btn" v-if="cartTool" @click="updateCounter(cart, 'minus')"><i class="fas fa-minus minus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- start to make card skeleton -->
                <div class="row" v-if="cartLoading">
                    <div class="col-12 col-md-6 mb-5" v-for="i in 2" :key="i">
                        <div class="cart-item CartLayout align-items-center">
                            <div class="cart-img-skeleton">
                                <Skeleton class="rounded-2 cart-img"></Skeleton>
                            </div>
                            <div class="cart-info">
                                <div class="top-title">
                                    <Skeleton height=".7rem" width="30%" class="mb-2"></Skeleton>
                                    <Skeleton height="24px" width="24px" class="remove-btn-skeleton" v-if="cartTool"></Skeleton>
                                </div>
                                <Skeleton height=".7rem" width="55%" class="mb-2"></Skeleton>
                                <div class="cart-foot">
                                    <Skeleton height=".7rem" width="30%" class="main-cl-skeleton"></Skeleton>
                                    <div class="counter-section">
                                        <Skeleton height="7px" width="22px" class="plus-btn-skeleton" v-if="cartTool"></Skeleton>
                                        <Skeleton height="30px" width="30px" class="counter-skeleton rounded-5"></Skeleton>
                                        <Skeleton height="7px" width="22px" class="minus-btn-skeleton" v-if="cartTool"></Skeleton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- if no product found -->
        <div class="no-data mb-5" v-if="!carts?.length && !cartLoading">
            <img  loading="lazy" src="@/assets/images/no_data.png" alt="image" class="no-data-img">
            <div class="no-data-text">{{ propTitle }}</div>
        </div>
        
    </div>
</template>


<script setup>

    // props
    const props = defineProps(['carts', 'cartLoading', "cartTool", "propTitle", "rateOrder", "cancelOrderChecked", "isRated"]);

    // Store
    const store = useAuthStore();

    const { token, cartVal, isLoggedIn, notificationToken } = storeToRefs(store);

    /******************* composables *******************/

    const { response } = responseApi();

    const axios = useApi();

    // config
    const config = computed(()=> {
       return { headers: { Authorization: `Bearer ${token.value}` } }
    });

    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });

    // toast
    const { successToast, errorToast } = toastMsg();

    // loading
    const loading = ref({});

    const loadingUpdate = ref({});

    const selectedIds = ref([]);

    const mac_address = ref(null);

    // emit
    const emit = defineEmits(['UpdateCart', 'cancelOrderFun']);

    // Emit selected carts with product_id and qty
    const emitSelectedCarts = () => {
    const formattedCarts = selectedIds.value.map(cart => ({
        product_id: cart.product_id, // get id from the cart object
        qty: cart.qty || cart.quantity // get qty from the cart object
    }));

        emit('cancelOrderFun', formattedCarts); // Emit the formatted array to the parent
    };


    /******************* Methods *******************/

    // plus and minus method for counter with param (pluss, minus) 
    const updateCounter = (cart, type) => {
        if (type === 'plus') {
            if (cart.qty < cart.product_qty) {
                cart.qty++;
                cart.total_product_price = parseFloat((cart.qty * parseFloat(cart.product_price)).toFixed(2));
                cart.isActive = true;
            } else {
                errorToast(t('products.maximum_count_reached'));
            }
        } else if (type === 'minus' && cart.qty > 1) {
            cart.qty--;
            cart.total_product_price = parseFloat((cart.qty * parseFloat(cart.product_price)).toFixed(2));
            cart.isActive = true;
        } else if (cart.qty == 1) {
            cart.isActive = false;
        }
    };

    // update cart

    const updateCart = (cart) => {
        loadingUpdate.value[cart.id] = true;
        const fd = new FormData();
        
        fd.append('qty', cart.qty);
        fd.append('cart_id', cart.id);
        fd.append('device_id', notificationToken.value);
        // fd.append('coupon_num', "test");
        let UpdateCartRes;
        if (isLoggedIn.value) {
            UpdateCartRes = axios.post(`update-cart`, fd, config.value);
        } else {
            UpdateCartRes = axios.post('update-cart?mac_address=' + mac_address.value, fd);
          }
        UpdateCartRes.then((res) => {
            if (res.data.key == "success" || response(res) == "success") {
                successToast(res.data.msg);
                loadingUpdate.value[cart.id] = false;
                cart.isActive = false;
                emit('UpdateCart');
            } else {
                errorToast(res.data.msg);
            }
            loadingUpdate.value[cart.id] = false;
        }).catch((err) => {
            console.error(err);
            loadingUpdate.value[cart.id] = false;
        });
    }

    // remove cart
    const removeCart = async (cart) => {
        loading.value[cart.id] = true;
        const fd = new FormData();
        fd.append('cart_id', cart.id);
        if (!isLoggedIn.value) {
            fd.append('mac_address', mac_address.value);
        }
        await axios.post(`remove-item-from-cart`, fd, config.value).then(res => {
            if (res.data.key == "success" || response(res) == "success") {
                successToast(res.data.msg);
                loading.value[cart.id] = false;
                const index = props.carts.indexOf(cart);
                if (index > -1) {
                    loading.value[cart.id] = false;
                    props.carts.splice(index, 1);
                }
                cartVal.value -= 1;
            } else {
                errorToast(res.data.msg);
            }
            loading.value[cart.id] = false;
        }).catch(err => {
            console.error(err);
            loading.value[cart.id] = false;
        });
    };

    // mac_address
    onBeforeMount(() => {
        store.checkMacAddress();
        mac_address.value = store.mac_address;
    });

</script>

<style lang="scss" scoped>
    .product-description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5;
        max-height: 3em; /* 2 lines * 1.5 line-height */
    }
</style>
