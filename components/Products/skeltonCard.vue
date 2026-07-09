<template>
    <div>

        <!-- start to make skelton for card -->
        <div class="product_card" v-if="loading_Product">
            <div class="product_img product_img_skelton">
                <Skeleton height="210px" class="rounded-0"></Skeleton>
                <div v-if="isRated" class="skeleton-star-container product_rating">
                    <Skeleton class="skeleton-star"></Skeleton>
                    <Skeleton class="skeleton-star"></Skeleton>
                    <Skeleton class="skeleton-star"></Skeleton>
                    <Skeleton class="skeleton-star"></Skeleton>
                    <Skeleton class="skeleton-star"></Skeleton>
                </div>
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
</template>

<script setup>
    const props = defineProps({
        isRated: {
            type: Boolean,
            default: false
        },

        loading_Product: {
            type: Boolean,
            default: false,
        },
    })
</script>

<style lang="scss" scoped>
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
    .skeleton-star-container {
        display: flex;
        align-items: center;
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