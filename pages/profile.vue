<template>
    <div>

        <div class="container">

            <div class="layout-form custom-width mb-5">
                <h1 class="main-title lg mb-5">{{ $t("Global.my_data") }}</h1>
                <form @submit.prevent="editProfile" ref="editProfileform">
                    <div class="row">
                        <div class="col-12 col-md-8 mr-auto">

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.username') }}
                                </label>
                                <div class="main_input">
                                    <input type="text" class="custum-input-icon" readonly v-model="name"
                                        :placeholder="$t('Auth.enter_username')">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.mobile_number') }}
                                </label>
                                <div class="with_cun_select">
                                    <div class="main_input">
                                        <input type="number" class="custum-input-icon" readonly v-model="phone"
                                            :placeholder="$t('Auth.please_mobile_number')">
                                    </div>
                                    <div class="card d-flex justify-content-center dropdown_card">
                                        <Dropdown v-model="selectedCountry" :options="countries" optionLabel="name"
                                            disabled>
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value" class="flex-group-me">
                                                    <img :alt="slotProps.value.label" :src="slotProps.value.image"
                                                        :class="`mr-2 flag flag-${slotProps.value.key}`"
                                                        style="width: 24px" />
                                                    <div>{{ slotProps.value.key }}</div>
                                                </div>
                                                <span v-else>
                                                    {{ slotProps.placeholder }}
                                                </span>
                                            </template>
                                            <template #option="slotProps">
                                                <div class="flex-group-me">
                                                    <img :alt="slotProps.option.label" :src="slotProps.option.image"
                                                        :class="`mr-2 flag flag-${slotProps.option.key}`"
                                                        style="width: 24px" />
                                                    <div>{{ slotProps.option.key }}</div>
                                                </div>
                                            </template>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.city') }}
                                </label>
                                <div class="flex justify-content-center dropdown_card main_input special-custom">
                                    <Dropdown v-model="city" disabled :options="cities"
                                        :emptyMessage="$t('Home.no_available_options')" optionLabel="name"
                                        :placeholder="$t('Auth.select_city')"
                                        class="w-full md:w-14rem custum-dropdown" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.neighborhood') }}
                                </label>
                                <div class="flex justify-content-center dropdown_card main_input special-custom">
                                    <Dropdown v-model="neighborhood" disabled :options="neighborhoods"
                                        :emptyMessage="$t('Home.no_available_options')" optionLabel="name"
                                        :placeholder="$t('Auth.select_neighborhood')"
                                        class="w-full md:w-14rem custum-dropdown" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.email') }}
                                </label>
                                <div class="main_input">
                                    <input type="email" class="custum-input-icon" readonly v-model="email"
                                        :placeholder="$t('Auth.enter_email')">
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>

        </div>






    </div>

</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    name: "Home.profile_personly",
    authIsRequired: true,
    middleware: 'auth'
});
// pinia store

// success response
const { response } = responseApi();

const PageSeo = ref(null);

const { getSeoData, checkSeoKey } = useSeo();

// // Axios
const axios = useApi();


/******************* Data *******************/

// Store
const store = useAuthStore();

const { token } = storeToRefs(store);

const selectedCountry = ref(null)
const countries = ref([]);
const name = ref('');
const phone = ref('');

const city = ref(null);

const cities = ref([]);

const city_id = ref(null);

const neighborhood = ref(null);

const neighborhoods = ref([]);

const neighborhood_id = ref(null);

const email = ref('');

const editProfileform = ref(null);

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

//  get profile data
const profile = async () => {
    await axios.get('profile', config).then(res => {
        name.value = res.data.data.name;
        phone.value = res.data.data.phone;
        city_id.value = res.data.data.city_id;
        neighborhood_id.value = res.data.data.neighborhood_id;
        email.value = res.data.data.email;
        if (selectedCountry.value) {
            selectedCountry.value.key = res.data.data.country_code;
        }
    }).catch(err => console.log(err));
}

// Get All cities
const getCities = async () => {
    await axios.get('cities').then(res => {
        if (response(res) == "success") {
            cities.value = res.data.data;
            for (let i = 0; i < cities.value.length; i++) {
                if (cities.value[i].id == city_id.value) {
                    city.value = cities.value[i];
                }
            }
        }
    }).catch(err => console.log(err));
};

// Get All neighborhoods
const getNeighborhoods = async (cityId) => {
    if (!cityId) {
        neighborhoods.value = [];
        neighborhood.value = null;
        return;
    }
    
    await axios.get(`neighborhoods/${cityId}`).then(res => {
        if (response(res) == "success") {
            neighborhoods.value = res.data.data;
            for (let i = 0; i < neighborhoods.value.length; i++) {
                if (neighborhoods.value[i].id == neighborhood_id.value) {
                    neighborhood.value = neighborhoods.value[i];
                }
            }
        } else {
            neighborhoods.value = [];
        }
    }).catch(err => {
        console.log(err);
        neighborhoods.value = [];
    });
};

onMounted(async () => {
    await profile();
    await getCities();
    if (city_id.value) {
        await getNeighborhoods(city_id.value);
    }
    const result = await store.getCountriesHandler();

    if (result.status === "success") {
        const defaultCountry = store.countries.find(country => country.id == 1);

        if (defaultCountry) {
            selectedCountry.value = { ...defaultCountry };
        }
    }

    await getSeoData();
    PageSeo.value = checkSeoKey("profile");

    useHead({
        title: PageSeo.value?.meta_title,
        meta: [
            { name: 'description', content: PageSeo.value?.meta_description },
            { name: 'keywords', content: PageSeo.value?.meta_keywords },
            { property: 'og:url', content: PageSeo.value?.meta_url }
        ]
    });
});

watch(
    () => PageSeo.value,
    (newVal) => {
        if (!newVal) {
            PageSeo.value = checkSeoKey("profile");
        }
    },
    { immediate: true }
);
</script>
