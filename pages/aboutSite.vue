<template>

    <div class="container mt-5">

        <div class="layout-form custom-width lg mb-5">

            <HomeAbout :main_content="true" />

        </div>

    </div>

</template>

<script setup>

definePageMeta({
    name: "Global.about_site",
});

const PageSeo = ref(null);
const { getSeoData, checkSeoKey } = useSeo();

onMounted(async () => {
    await getSeoData();
    PageSeo.value = checkSeoKey("about");

    useHead({
        title: PageSeo.value?.meta_title,
        meta: [
            { name: 'description', content: PageSeo.value?.meta_description },
            { name: 'keywords', content: PageSeo.value?.meta_keywords },
            { property: 'og:url', content: PageSeo.value?.meta_url }
        ]
    });
})

watch(
    () => PageSeo.value,
    (newVal) => {
        if (!newVal) {
            PageSeo.value = checkSeoKey("about");
        }
    },
    { immediate: true }
);
</script>
