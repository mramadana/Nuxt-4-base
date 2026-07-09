<template>
    <div>

        <div class="dir" v-if="!loading">

            <Galleria v-model:activeIndex="activeIndex" :value="images" :responsiveOptions="responsiveOptions" v-if="Array.isArray(images) && images.length > 0"
                :numVisible="images.length < 4 ? images.length : 4" :circular="true" :autoPlay="true"
                :transitionInterval="3000">
                <template #item="slotProps">
                    <img  loading="lazy" class="galleria_img" :src="slotProps.item.image" alt="product image"
                        style="width: 100%; display: block" />
                    <Image :src="slotProps.item.image" alt="Image" class="fancyImg" preview />
                </template>
                <template #thumbnail="slotProps">
                    <img  loading="lazy" class="thumbnail_image" :src="slotProps.item.image" alt="thumbnail" style="display: block" />
                </template>
            </Galleria>
            

            <div class="no-data bg-light lg d-flex align-items-center justify-content-center flex-column" v-else>
                <img  loading="lazy" src="@/assets/images/no_data.png" alt="image" class="no-data-img mb-3">
                <div class="no-data-text">{{ $t('Global.imgs') }}</div>
            </div>
            
        </div>

        <div v-if="loading">
            <Skeleton height="300px" class="product-img"></Skeleton>
            <div class="thumbnail_parent">
                <Skeleton v-for="i in 4" :key="i" class="thumbnail_skelton" :class="`thumbnail_skelton_${i}`"></Skeleton>
            </div>
        </div>
    </div>
</template>

<script setup>

    const activeIndex = ref(0);

    const responsiveOptions = ref([
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 2
        }
    ]);

    const props = defineProps({
        loading: {
                type: Boolean,
                default: false,
        },

        images: {
            type: [Array, Object],
            default: () => ([]),
        }
    })

    // Computed property to ensure `images` is reactive
    const images = computed(() => props.images);

    watch(images, () => {
        activeIndex.value = 0;
    });



    onMounted(() => {
        const observer = new MutationObserver(() => {
            const nextButton = document.querySelector('.p-galleria-thumbnail-next');
            const prevButton = document.querySelector('.p-galleria-thumbnail-prev');

            if (nextButton) {
                nextButton.classList.remove('p-disabled');
                nextButton.removeAttribute('disabled');   
            }

            if (prevButton) {
                prevButton.classList.remove('p-disabled');
                prevButton.removeAttribute('disabled');   
            }

            if (nextButton && prevButton) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });


</script>

<style lang="scss" scoped>
    .product-img {
        width: 100%;
        height: 300px !important;
        object-fit: cover;
        border-radius: 10px;
    }

    .thumbnail_parent {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 20px;
        .thumbnail_skelton {
            width: 85px !important;
            height: 85px !important;
            border-radius: 10px;
        }
        @media (max-width: 790px) {
            
       .thumbnail_skelton_4 {
           display: none !important;
        }
        
        .thumbnail_skelton {
            width: 70px !important;
            height: 70px !important;
       }
        }
    }
</style>

