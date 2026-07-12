<template>
    <div>
        <div class="text-center mb-4">

            <div class="d-flex mb-4 align-items-center justify-content-center" v-if="!loading">
                <img :src="aboutImage || defaultAboutImage" alt="about image" class="about_img" />
            </div>

            <h1 v-if="!loading && aboutTitle && props.main_content" class="main-title main-cl bold lg mb-3">
                {{ aboutTitle }}
            </h1>

            <p class="main-title normal about-content" v-html="displayContent"></p>

            <div class="text-center" v-if="loading">
                <Skeleton class="mb-4 mr-auto" v-for="i in 3" :key="i" width="80%" height=".7rem"></Skeleton>
            </div>
        </div>
    </div>
</template>

<script setup>
const about = ref('');
const aboutTitle = ref('');
const aboutImage = ref('');
const defaultAboutImage = '/assets/images/whous.png';

const props = defineProps({
    main_content: {
        type: Boolean,
        default: false,
    },
    sub_content: {
        type: Boolean,
        default: false,
    },
});

const getFirst30Words = (htmlContent) => {
    if (!htmlContent) return '';

    const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ').filter((word) => word.length > 0).slice(0, 30);

    if (!words.length) return '';

    const truncatedText = words.join(' ');
    const hasMoreContent = textContent.split(' ').filter((word) => word.length > 0).length > 30;

    return truncatedText + (hasMoreContent ? '...' : '');
};

const displayContent = computed(() => {
    if (!about.value) return '';

    if (props.sub_content) {
        return getFirst30Words(about.value);
    }

    return about.value;
});

const request = useApiMutation();

const { data: aboutResponse, pending: loading } = await useAsyncData(
    "api:about-content",
    async () => {
        try {
            return await request("about", { method: "GET" });
        } catch {
            return await request("general/who-we-are", { method: "GET" });
        }
    },
);

watchEffect(() => {
    const payload = aboutResponse.value?.data;
    if (!payload) return;

    if (typeof payload === "string") {
        about.value = payload;
        aboutTitle.value = "";
        aboutImage.value = "";
        return;
    }

    about.value = payload?.content || "";
    aboutTitle.value = payload?.title || "";
    aboutImage.value = payload?.image || "";
});
</script>

<style lang="scss">
    .about_img {
        height: 100px;
    }
</style>
