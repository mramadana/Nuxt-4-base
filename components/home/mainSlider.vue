<template>
    <section>
        
        <div v-if="!loading && !loading_2">

            <div class="slider" :class="[showTitleOnly ? 'categoryClass' : '']" dir="ltr" v-if="slider?.length">
                <Carousel :value="slider" :numVisible="numVisible" :numScroll="numScroll" :responsiveOptions="responsiveOptions" :autoplayInterval="5000" :transitionInterval="3000" class="dir-slider">
                    <template #item="slotProps">

                        <div v-if="showTitleOnly" :class="['titleOnlyClass']">
                            <nuxtLink :to=" '/categories/' + slotProps.data.id" class="slider-link slider-item">
                                <img :src="slotProps.data.image" loading="lazy" alt="slider-img" class="slider-img">
                                <!-- <div class="slider_text withDark"></div>
                                <div class="text" v-if="showTitleOnly">{{ slotProps.data.name }}</div> -->
                            </nuxtLink>
                        </div>

                        
                        <div v-else :class="['slider-item']">
                            <img :src="slotProps.data.image" loading="lazy" alt="slider-img" class="slider-img">

                            <!-- <div class="slider_text" v-if="props.slider_title">
                                <h1 class="title-banner">{{ slotProps.data.title }}</h1>
                                <h4 class="desc-banner">{{ slotProps.data.content }}</h4>
                                <button type="button" @click="scrollToProducts" class="custom-btn md">{{ $t('Home.shop_now') }}</button>
                            </div> -->

                        </div>

                        
                    </template>
                </Carousel>
            </div>
    
            <div class="no-data" v-else>
                <img  loading="lazy" src="@/assets/images/no_data.png" alt="image" class="no-data-img">
                <div class="no-data-text">{{ noDataMessage }}</div>
            </div>
            
        </div>
        
        <div class="position-relative" v-if="loading">
            <Skeleton width="100%" height="480px" class="slider-img rounded-0"></Skeleton>
            <img  loading="lazy" src="@/assets/images/main-logo.svg" alt="image" class="login_logo sm position">
        </div>

        <div class="position-relative d-flex justify-content-around" v-if="loading_2">
            <div class="category_item slider-link" v-for="i in 5" :key="i" :class="'item-' + i">
                <Skeleton shape="circle" size="100%"></Skeleton>
            </div>
        </div>
        
    </section>
</template>


<script setup>
    const props = defineProps({

    slider: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false,
    },
    loading_2: {
        type: Boolean,
        default: false,
    },

    slider_title: {
        type: Boolean,
        default: false,
    },
    showTitleOnly: {
        type: Boolean,
        default: false,
    },

    numVisible: {
        type: Number,
        default: 1
    },
    numScroll: {
        type: Number,
        default: 1
    },

    responsiveOptions: {
        type: Array,
        default: () => []
    },

    noDataMessage: {
      type: String
    }
});

    const emit = defineEmits(['shop-now-click']);

    const scrollToProducts = () => {
        emit('shop-now-click');
    };
</script>


<style lang="scss">


    .slider-item {
        position: relative;
        .slider_text {
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 30%);
            width: 100%;
            height: 100%;
            color: #fff;
            gap: 15px;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;
            align-items: center;
        }

        .slider-img {
            display: block;
        }
        .title-banner {
            font-size: 25px;
            font-weight: bold;
            color: var(--wh);
            margin-bottom: 0;
        }
        .desc-banner {
            font-size: 16px;
            font-weight: 400;
            color: var(--wh);
        }

        .custom-btn {
            @media (max-width: 768px) {
                min-width: auto;
            }
        }
    }

    .titleOnlyClass {

        align-items: center;
        display: flex;
        flex-direction: column;

        .text {
            font-size: 14px;
            padding: 10px;
            z-index: 1;
        }
    }

    // .slider_text {
    //     &.withDark {
    //         background: rgba(0, 0, 0, 70%) !important;
    //     }
    // }
</style>