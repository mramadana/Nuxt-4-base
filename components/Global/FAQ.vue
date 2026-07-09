<template>
    <section>
        <div class="container">
            <div class="main-title mb-5 text-center">{{ $t("Titles.faq") }}</div>

            <Accordion class="accordFaq" v-if="!loading">
                <AccordionTab v-for="item in FAQ" :header="item.question" :key="item.id">
                    <p class="m-0">
                        {{ item.answer }}
                    </p>
                </AccordionTab>
            </Accordion>

            <div class="accordFaq mt-5" v-if="loading">
                <div class="layout-Faq d-flex alighn-items-center justify-content-between" v-for="i in 4" :key="i">
                    <Skeleton width="70%" height=".7rem" class="small"></Skeleton>
                    <Skeleton width="5%" height=".4rem" class="small"></Skeleton>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

const loading = ref(true);
const { response } = responseApi();

const axios = useApi();

const FAQ = ref([]);


const getData = async () => {
  loading.value = true;
  await axios.get('fqss').then(res => {
    if (response(res) == "success") {
      FAQ.value = res.data.data;
    }
    loading.value = false;
  }).catch(err => console.log(err));
};


onMounted(() => {
    getData();
});

</script>


<style lang="scss">

.accordFaq {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
    font-family: 'main_font' !important;
    font-size: 14px !important;

    .p-accordion-header-link {
        padding: 20px 10px;
        background-color: #FFF;
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        color: #000;

        // svg{
        //     transform: scaleX(-1);
        // }

    }

    .p-accordion-tab{margin: 0 !important;
        .p-accordion-header{
            border-bottom: 1px solid #EEE;
        }
    }
    .p-accordion-header-text {
        line-height: 20px;
    }

    .layout-Faq {
        background-color: var(--wh);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.10);
        border-radius: 10px;
        margin-bottom: 30px;
        padding: 18px;
    }

    @media (max-width: 550px) {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        .p-accordion-header-text {
            font-size: 13px;
        }
    }
}




</style>