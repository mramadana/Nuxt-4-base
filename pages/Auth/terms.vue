<template>
    <div class="w-100 mt-4">

        <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mx-auto mb-4" />

        <h1 class="main-title text-center md bold mb-4">
            {{ termsTitle || $t("Auth.terms_and_conditions") }}
        </h1>

        <div class="text-layout w-100 mb-4">

            <!-- loading -->
            <div v-if="loading" class="text-center">
                <Skeleton v-for="i in 8" :key="i" height="1rem" width="100%" class="rounded-5 mb-3 mx-auto"></Skeleton>
            </div>

            <!-- content -->
            <div v-if="!loading && termsImage" class="terms-image-wrap mb-3">
                <img :src="termsImage" alt="terms-image" class="terms-image" />
            </div>
            <div v-if="!loading && termsContent" class="main-title normal mt-3 about_disc" v-html="termsContent"></div>

            <!-- checkbox -->
            <div class="radios form-group check-inner mt-4 mb-4">
                <div class="d-flex gap-3">
                    <label class="custom-radio custom-check">
                        <input type="checkbox" name="terms" v-model="terms" class="d-none" />
                        <span class="mark">
                            <i class="fas fa-check icon"></i>
                        </span>
                        <div class="check-text hint d-flex">
                            <div class="new-sign mb-0">
                                <NuxtLink to="/terms" class="anchor">
                                    {{ $t("Auth.terms_conditions") }}
                                </NuxtLink>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- submit -->
            <button class="custom-btn w-100" @click="submitApproval" :disabled="submitting">
                <div>{{ $t("Auth.create_terms_account") }}</div>
                <div v-if="submitting">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </div>
            </button>
        </div>

        <!-- success modal -->
        <!-- <Dialog v-model:visible="accept_create_acount" modal class="custum_dialog_width without-close"
            :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("Auth.hint_success") }}
                </h1>
                <p class="desc lg">{{ $t("Auth.hint_success_desc") }}</p>
            </div>
        </Dialog> -->

    </div>
</template>

<script setup>
definePageMeta({
    name: "Auth.terms_and_conditions",
    layout: "auth",
    showBackLink: true,
    hideHeader: true,
})

import { useI18n } from "vue-i18n"

const { t } = useI18n({ useScope: "global" })

const globalStore = useGlobalStore()
const axios = useApi()
const { response } = responseApi()
const { successToast, errorToast } = toastMsg()
const { token } = storeToRefs(
    useAuthStore()
);

// config
const config = computed(() => {
    return { headers: { Authorization: `Bearer ${token.value}` } }
});

const loading = ref(true)
const submitting = ref(false)
const terms = ref(false)
const termsTitle = ref("")
const termsImage = ref("")
const termsContent = ref("")
const accept_create_acount = ref(false)

/**
 * تنظيف الـ HTML من \r\n و \\r\\n
 */
const cleanHtml = (html) => {
    if (!html) return ""
    return html
        .replace(/\\r\\n/g, "") // \\r\\n
        .replace(/\r\n/g, "")   // \r\n
        .replace(/\n/g, "")     // \n
}

/**
 * Get Terms
 */
const getTerms = async () => {
    loading.value = true
    try {
        const res = await axios.get("provider/terms")
        if (response(res) === "success") {
            const payload = res?.data?.data
            if (typeof payload === "string") {
                termsContent.value = cleanHtml(payload)
                termsTitle.value = ""
                termsImage.value = ""
            } else {
                termsContent.value = cleanHtml(payload?.content || "")
                termsTitle.value = payload?.title || ""
                termsImage.value = payload?.image || ""
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

/**
 * Submit Approval
 */
// const submitApproval = async () => {
//     // التحقق من موافقة الشروط والأحكام أولاً
//     if (!terms.value) {
//         errorToast(t("validation.conditions"))
//         return
//     }

//     submitting.value = true
//     try {
//         const res = await axios.post("provider/auth/temporary-approve-by-admin", {}, config.value)
//         if (response(res) === "success") {
//             accept_create_acount.value = true
//             successToast(res.data.msg)
//             setTimeout(() => {
//                 accept_create_acount.value = false
//                 navigateTo('/Auth/completePayment')
//             }, 500)
//         } else {
//             errorToast(res.data.msg)
//         }
//     } catch (err) {
//         console.error(err)
//         errorToast("حدث خطأ أثناء الإرسال")
//     } finally {
//         submitting.value = false
//     }
// }

const submitApproval = async () => {
    // التحقق من موافقة الشروط والأحكام أولاً
    if (!terms.value) {
        errorToast(t("validation.conditions"))
        return
    }

    accept_create_acount.value = true
    setTimeout(() => {
        accept_create_acount.value = false
        setTimeout(() => {
            navigateTo('/Auth/login')
        }, 1000)
    }, 1500)
}

onMounted(() => {
    getTerms()
})
</script>

<style lang="scss" scoped>
.about_disc {
    * {
        &:first-child {
            font-size: 16px;
            font-weight: bold;
        }
    }
}

.text-layout {
    padding: 15px 25px 30px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 25px;
    margin: 0 auto;
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
