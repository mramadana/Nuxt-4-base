<template>
    <div class="container">
        <div class="layout-form custom-width">
            <h1 class="main-title bold lg mb-5">{{ $t("Home.edit_profile") }}</h1>
            <form @submit.prevent="editProfile" ref="editProfileform">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">

                        <div class="form-group text-center">
                            <div class="input_auth">
                                <div class="edit-label">
                                    <i class="fas fa-edit"></i>
                                </div>
                                <img src="@/assets/images/upload_layout.png" loading="lazy" alt="default-img" :class="{'hidden-default' : uploadedImage.length > 0, 'default-class': true}">
                                <ImgUploader acceptedFiles="image/*" :newImages="image" name="image" @uploaded-images-updated="updateUploadedImages_1" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.username') }}
                                <span class="hint-red">*</span>
                            </label>
                            <div class="main_input">
                                <i class="fas fa-user sm-icon"></i>
                                <input type="text" class="custum-input-icon validInputs" valid="name" name="name" v-model="name" :placeholder="$t('Auth.enter_username')">
                            </div>
                        </div>
                        
                        
                        <button class="custom-btn w-100 mt-5">
                            {{ $t('Global.Saving_changes') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <Dialog v-model:visible="successfullyChange" modal class="custum_dialog_width without-close" :draggable="false" >
            <div class="text-center">
                <img src="@/assets/images/check.png" alt="check-img" class="check-img" loading="lazy">
                <h3 class="main-title bold mb-4">{{ $t('Global.Saving_changes_success') }}</h3>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "Home.edit_profile",
        // authIsRequired: true,
        // middleware: 'auth'
    });

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

// pinia store
import { useAuthStore } from '~/stores/auth';


// Store
const store = useAuthStore();

const { profileHandler } = store;

// // Toast
const { successToast, errorToast } = toastMsg();

/******************* Data *******************/

const successfullyChange = ref(false);
const errors = ref([]);

const loading = ref(false);
const uploadedImage = ref([]);
const editProfileform = ref(null);

const {
    payload: profilePayload,
} = await useApiData('provider/profile', {
    auth: true,
    cacheKey: 'api:edit-profile',
});

const image = computed(() => profilePayload.value?.image || '');
const name = ref('');

watchEffect(() => {
    const currentName = profilePayload.value?.name;
    name.value = currentName?.ar || currentName?.en || currentName || '';
});

        // Validation Function
        function validate() {
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].name}`));
            }
        }
    };

    const editProfile = async () => {
        loading.value = true;
        const fd = new FormData(editProfileform.value);
        loading.value = true;

        validate();

        // Get Returned Data From Store
        const res = await profileHandler(fd);

        if (res.status == "success") {
            successToast(res.msg);
            successfullyChange.value = true;
            setTimeout(() => {
                successfullyChange.value = false
                navigateTo("/settings");
            }, 1000);
        } else {
            errorToast(res.msg);
        }

        loading.value = false;

    }
</script>
