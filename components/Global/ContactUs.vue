<template>
    <!-- <div class="contact-us">

        <div class="container">

            <div class="main-text text-center mb-4">
                <h1 class="main-title main-cl lg">{{ $t('Home.connect_us') }}</h1>
                <p class="main-title normal">{{ $t('Home.connect_msg') }}</p>
            </div>

            <GlobalSocials class="d-flex align-items-center justify-content-center mb-4" />

            <form @submit.prevent="submitData" ref="contactForm">
                <div class="row">
                    <div class="col-12 col-xl-9 mr-auto">
                        <div class="row">

                            <div class="col-12 col-md-6 mb-4">
                                <div class="form-group">
        
                                    <label class="label">
                                        {{ $t('Auth.mobile_number') }}
                                    </label>
                                    
                                    <div class="with_cun_select">
                                        <div class="main_input">
                                            <input type="number" class="custum-input-icon validInputs" valid="phone" name="phone" :placeholder="$t('Auth.please_mobile_number')">
                                        </div>
                                        <div class="card d-flex justify-content-center dropdown_card">
                                        <Dropdown
                                        v-model="selectedCountry"
                                        :options="countries"
                                        filter
                                        optionLabel="name"
                                        :emptyMessage="$t('Home.no_available_options')"
                                        :emptyFilterMessage="$t('Home.emptyFilterMessage')"
                                        >
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value" class="flex-group-me">
                                            <img
                                                loading="lazy"
                                                :alt="slotProps.value.label"
                                                :src="slotProps.value.image"
                                                :class="`mr-2 flag flag-${slotProps.value.key}`"
                                                style="width: 24px"
                                            />
                                            <div>{{ slotProps.value.key }}</div>
                                            </div>
                                            <span v-else>
                                            {{ slotProps.placeholder }}
                                            </span>
                                        </template>
                                        <template #option="slotProps">
                                            <div class="flex-group-me">
                                                <img
                                                    loading="lazy"
                                                    :alt="slotProps.option.label"
                                                    :src="slotProps.option.image"
                                                    :class="`mr-2 flag flag-${slotProps.option.key}`"
                                                    style="width: 24px"/>
                                                <div>{{ slotProps.option.name }}</div>
                                                <div>{{ slotProps.option.key }}</div>
                                            </div>
                                        </template>
                                        </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
                            <div class="col-12 col-md-6 mb-4">
                                <div class="form-group">
                                    <label class="label">
                                        {{ $t('Auth.email') }}
                                    </label>
                                    <div class="main_input">
                                        <input type="email" class="custum-input-icon validInputs" valid="email" name="email" :placeholder="$t('Auth.enter_email')">
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 mb-4">
                                <div class="form-group">
                                    <label class="label">
                                        {{ $t('message_title') }}
                                    </label>
                                    <div class="main_input">
                                        <input type="text" class="custum-input-icon validInputs" valid="title" name="title" :placeholder="$t('enter_message_title')">
                                    </div>
                                </div>
                            </div>
        
                            <div class="col-12 mb-3">
                                <div class="form-group">
                                    <label class="label">{{ $t("Home.message_content") }}</label>
                                    <textarea  class="main_input main_area validInputs" name="complaint" :placeholder="$t('Home.enter_message_content')" valid="content"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <button type="submit" class="custom-btn mr-auto">
                                {{ $t("Global.send") }}
                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>

                </div>
            </form>
            
        </div>
    </div> -->
<div>
    <h1>Contact Us</h1>
</div>
</template>

<script setup>

    // store
    const store = useAuthStore();   

    const { countries, token } = storeToRefs(store);
    
    const errors = ref([]);
    const loading = ref(false);
    const axios = useApi();
    const { response } = responseApi();
    const selectedCountry = ref(null);

    import { useI18n } from 'vue-i18n';

    const { t } = useI18n({ useScope: 'global' });

    const { successToast, errorToast } = toastMsg();

    const contactForm = ref(null);

    // config
    const config = computed(()=> {
       return { headers: { Authorization: `Bearer ${token.value}` } }
    });

    // method

    // validation Function
    const validate = () => {
        let allInputs = contactForm.value.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].getAttribute('valid')}`));
            }
        }
    }

    // submitData complaints
    const submitData = async () => {
        loading.value = true;
        const fd = new FormData(contactForm.value);
        fd.append('country_code', selectedCountry.value.key);
        validate();
        if (errors.value.length) {
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {
            
            await axios.post('contact-us', fd, config.value).then(res => {
                if (response(res) == "success") {
                    successToast(res.data.msg);
                    contactForm.value.reset();
                } else {
                    errorToast(res.data.msg);
                }
            }).catch(err => console.log(err));
        }
        loading.value = false;
    }

    onMounted( async () => {

        const result = await store.getCountriesHandler();
  
        if (result.status === "success") {
            const defaultCountry = store.countries.find(country => country.id == 1);
            
            if (defaultCountry) {
            selectedCountry.value = { ...defaultCountry };
            }
        }
    });

</script>

<style lang="scss" scoped>
    .contact-us {
        padding: 50px 0;
        background-color: #FCFCFC;
    }
</style>