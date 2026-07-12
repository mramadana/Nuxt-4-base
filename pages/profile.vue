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
                                        <Select v-model="selectedCountry" :options="countries" optionLabel="name"
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
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.city') }}
                                </label>
                                <div class="flex justify-content-center dropdown_card main_input special-custom">
                                    <Select v-model="city" disabled :options="cities"
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
                                    <Select v-model="neighborhood" disabled :options="neighborhoods"
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

const { getSeoData, checkSeoKey } = useSeo();
await getSeoData();
const pageSeo = computed(() => checkSeoKey("profile") || null);


/******************* Data *******************/

// Store
const store = useAuthStore();

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

const { payload: profilePayload } = await useApiData("provider/profile", {
    auth: true,
    cacheKey: "api:profile",
});

const { payload: citiesPayload } = await useApiData("cities", {
    cacheKey: "api:cities",
});

const { payload: countriesPayload } = await useApiData("countries", {
    cacheKey: "api:countries",
});

const initialCityId = profilePayload.value?.city?.id || profilePayload.value?.city_id || null;
const neighborhoodData = initialCityId
    ? await useApiData(`neighborhoods/${initialCityId}`, {
        cacheKey: `api:neighborhoods:${initialCityId}`,
      })
    : null;

watchEffect(() => {
    const profileData = profilePayload.value;
    if (!profileData) return;

    name.value = profileData.name?.ar || profileData.name?.en || profileData.name || "";
    phone.value = profileData.phone || "";
    city_id.value = profileData.city?.id || profileData.city_id || null;
    neighborhood_id.value = profileData.neighborhood_id || null;
    email.value = profileData.email || "";
});

watchEffect(() => {
    cities.value = citiesPayload.value || [];
    city.value = cities.value.find((item) => item.id == city_id.value) || null;
});

watchEffect(() => {
    countries.value = countriesPayload.value || [];
    const fallbackCountry = countries.value.find((country) => country.id == 1) || null;
    const selectedByCode = countries.value.find((country) => country.key == profilePayload.value?.country_code) || fallbackCountry;
    if (selectedByCode) {
        selectedCountry.value = { ...selectedByCode };
    }
});

watchEffect(() => {
    neighborhoods.value = neighborhoodData?.payload.value || [];
    neighborhood.value =
        neighborhoods.value.find((item) => item.id == neighborhood_id.value) || null;
});

useHead(() => ({
    title: pageSeo.value?.meta_title,
    meta: [
        { name: 'description', content: pageSeo.value?.meta_description },
        { name: 'keywords', content: pageSeo.value?.meta_keywords },
        { property: 'og:url', content: pageSeo.value?.meta_url }
    ]
}));
</script>
