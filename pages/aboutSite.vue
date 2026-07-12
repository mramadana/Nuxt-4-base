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

const { getSeoData, checkSeoKey } = useSeo();
await getSeoData();

const pageSeo = computed(() => checkSeoKey("about") || null);

useHead(() => ({
        title: pageSeo.value?.meta_title,
        meta: [
            { name: 'description', content: pageSeo.value?.meta_description },
            { name: 'keywords', content: pageSeo.value?.meta_keywords },
            { property: 'og:url', content: pageSeo.value?.meta_url }
        ]
}));
</script>
