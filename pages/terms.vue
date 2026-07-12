<template>
    <div>
        
        <div class="container">
            <div class="layout-form custom-width lg">
                <h1 class="main-title bold">{{ termsTitle || $t("Global.terms_and_conditions") }}</h1>

                <div v-if="!loading && termsImage" class="terms-image-wrap mt-3">
                    <img :src="termsImage" alt="terms-image" class="terms-image" />
                </div>

                <div class="main-title normal mt-3 about_disc" v-if="!loading" v-html="terms" >

                </div>

                <div v-if="loading">
                    <div v-for="i in 8" :key="i">
                        <Skeleton height=".5rem" width="80%" class="rounded-0 mb-2 mx-auto"></Skeleton>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>

definePageMeta({
    name: "Global.terms_and_conditions",
});

const {
    payload: termsPayload,
    pending: loading,
} = await useApiData("provider/terms", {
    cacheKey: "api:provider-terms",
});

const terms = computed(() => {
    if (typeof termsPayload.value === "string") {
        return termsPayload.value;
    }

    return termsPayload.value?.content || "";
});

const termsTitle = computed(() => {
    if (typeof termsPayload.value === "string") {
        return "";
    }

    return termsPayload.value?.title || "";
});

const termsImage = computed(() => {
    if (typeof termsPayload.value === "string") {
        return "";
    }

    return termsPayload.value?.image || "";
});

</script>

<style lang="scss">
    .about_disc {
        * {
            &:first-child {
                font-size: 16px;
                font-weight: bold;
            }
        }
    }

    .terms-image-wrap {
        text-align: center;
    }

    .terms-image {
        max-width: 120px;
        height: auto;
        border-radius: 10px;
    }
</style>
