<template>
    <div>
        <Dialog modal :visible="visible" @update:visible="handleClose" class="custum_dialog_width lg auth-daialog"
            :draggable="false">
            
            <div class="main-text center mb-4">
                <img src="@/assets/images/main-logo.svg" alt="login-logo" class="login-logo" loading="lazy">
                <h1 class="main-title main-cl">{{ $t('Home.complaints_and_suggestions') }}</h1>
                <p class="main-desc">{{ $t("Home.enter_complaints") }}</p>
            </div>

            <form @submit.prevent="submitData" ref="complaintsForm">

                <!-- <div class="d-flex gap-4 mb-3">

                    <label class="custom-radio mb-3">
    
                        <input type="radio" name="suggestion" v-model="suggestion" value="complaint" class="d-none new-mark" @change="getProducts"/>
                        <span class="mark new-mark"></span>
                        <p class="hint">
                            {{ $t("Home.complaint") }}
                        </p>
                    </label>
    
                    <label class="custom-radio mb-3">
    
                        <input type="radio" name="suggestion" v-model="suggestion" value="suggestion" class="d-none new-mark" @change="getProducts"/>
                        <span class="mark new-mark"></span>
                        <p class="hint">
                            {{ $t("Home.proposed") }}
                        </p>
                    </label>

                </div> -->

                <div class="row">

                    <div class="col-12 mb-4">
                        <div class="form-group">

                            <label class="label">
                                {{ $t('Auth.mobile_number') }}
                            </label>

                            <div class="with_cun_select">
                                <div class="main_input">
                                    <input type="number" class="custum-input-icon validInputs" valid="phone"
                                        name="phone" :placeholder="$t('Auth.please_mobile_number')">
                                </div>
                                <div class="card d-flex justify-content-center dropdown_card">
                                    <Select v-model="selectedCountry" :options="countries" filter optionLabel="name"
                                        :emptyMessage="$t('Home.no_available_options')"
                                        :emptyFilterMessage="$t('Home.emptyFilterMessage')">
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value" class="flex-group-me">
                                                <img loading="lazy" :alt="slotProps.value.label"
                                                    :src="slotProps.value.image"
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
                                                <img loading="lazy" :alt="slotProps.option.label"
                                                    :src="slotProps.option.image"
                                                    :class="`mr-2 flag flag-${slotProps.option.key}`"
                                                    style="width: 24px" />
                                                <div>{{ slotProps.option.name }}</div>
                                                <div>{{ slotProps.option.key }}</div>
                                            </div>
                                        </template>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 mb-3">
                        <div class="form-group">
                            <label class="label">{{ $t("Home.message_content") }}</label>
                            <textarea class="main_input main_area validInputs" name="complaint"
                                :placeholder="$t('Home.enter_message_content')" valid="message"></textarea>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="label">{{ $t('complaintsDialog.attach_image') }}</label>
                    <div class="input_auth without-edit radius">
                        <img src="@/assets/images/upload.svg" loading="lazy" alt="default-img"
                            :class="{ 'hidden-default': uploadedImage.length > 0, 'default-class': true }">
                        <ImgUploader acceptedFiles="image/*" @uploaded-images-updated="updateUploadedImages" />
                    </div>
                </div>

                <button type="submit" class="custom-btn mr-auto" :disabled="loading">
                    {{ $t('Global.send') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                        aria-hidden="true"></span>
                </button>
            </form>

        </Dialog>
    </div>
</template>

<script setup>

const props = defineProps({
    visible: Boolean
})

// store
const store = useAuthStore();

const { token } = storeToRefs(store);

const errors = ref([]);

const { countries } = storeToRefs(store);

const uploadedImage = ref([]);

const config = computed(() => {
    return { headers: { Authorization: `Bearer ${token.value}` } }
});

const suggestion = ref('complaint');

const loading = ref(false);

const { response } = responseApi();

const axios = useApi();

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const { successToast, errorToast } = toastMsg();

const selectedCountry = ref(null);

const complaintsForm = ref(null);

const emit = defineEmits(['close-dialog']);

const shouldReload = ref(false);

// methods

const handleClose = (value) => {
    if (!value) {
        emit('close-dialog', shouldReload.value);
        shouldReload.value = false;
    }
};

// Image upload handlers
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

// validation Function
const validate = () => {
    let allInputs = complaintsForm.value.querySelectorAll('.validInputs');
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].value === '') {
            errors.value.push(t(`validation.${allInputs[i].getAttribute('valid')}`));
        }
    }
    if (uploadedImage.value.length == 0) {
        errors.value.push(t(`validation.image`));
    }
}

// submitData complaints
const submitData = async () => {
    loading.value = true;
    const fd = new FormData(complaintsForm.value);
    fd.append('country_code', selectedCountry.value.key);
    fd.append('image', uploadedImage.value);
    validate();
    if (errors.value.length) {
        errorToast(errors.value[0]);
        loading.value = false;
        errors.value = [];
    } else {

        await axios.post('new-complaint', fd, config.value).then(res => {
            if (response(res) == "success") {
                successToast(res.data.msg);
                complaintsForm.value.reset();
                uploadedImage.value = [];
                shouldReload.value = true;
                emit('close-dialog', true);
            } else {
                errorToast(res.data.msg);
            }
        }).catch(err => console.log(err));
    }
    loading.value = false;
}

watch(() => props.visible, async (newVal) => {
    if (newVal === true) {
        const result = await store.getCountriesHandler();
        if (result.status === "success") {
            const defaultCountry = store.countries.find(country => country.id == 1);
            if (defaultCountry) {
                selectedCountry.value = { ...defaultCountry };
            }
        }
    }
});

</script>
