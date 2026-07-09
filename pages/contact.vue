<template>
  <div class="contact-page mt-4">
    <div class="container">
      <h1 class="main-title lg bold contact-title">{{ pageTitle }}</h1>

      <div class="contact-card">
        <img
          src="@/assets/images/otp_verification.svg"
          alt="contact"
          class="contact-illustration"
        />

        <form class="contact-form" @submit.prevent="submitData">
          <div class="form-group mb-4">
            <label class="label mb-2 d-block">{{ messageLabel }}</label>
            <div class="main_input main_area">
              <textarea
                style="resize: none"
                v-model="message"
                class="custum-input-icon"
                :placeholder="messagePlaceholder"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            class="custom-btn contact-submit-btn"
            :disabled="loading"
          >
            {{ sendLabel }}
            <span
              class="spinner-border spinner-border-sm"
              v-if="loading"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
        </form>
      </div>
    </div>

    <Dialog
      v-model:visible="successDialogVisible"
      modal
      :draggable="false"
      class="custum_dialog_width auth-daialog without-close"
    >
      <div class="success-wrap">
        <div class="success-icon-container text-center">
          <img src="@/assets/images/gif-img/Done.gif" alt="" class="img-done" />
        </div>

        <p class="success-text text-center mb-3">{{ successDialogMessage }}</p>

        <button
          type="button"
          class="custom-btn w-100"
          @click="handleSuccessContinue"
        >
          {{ $t("followers.follow") }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Home.connect_us",
});

import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });
const axios = useApi();
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

const store = useAuthStore();
const { token } = storeToRefs(store);

const loading = ref(false);
const message = ref("");

const successDialogVisible = ref(false);
const successDialogMessage = ref("");

const pageTitle = computed(() => {
  const value = t("deliveryMethod.contact_us");
  return value === "deliveryMethod.contact_us" ? "Contact Us" : value;
});

const messageLabel = computed(() => {
  const value = t("quoteAccepted.static.later_message");
  return value === "quoteAccepted.static.later_message" ? "Message" : value;
});

const messagePlaceholder = computed(() => {
  const value = t("quoteAccepted.static.enter_message");
  return value === "quoteAccepted.static.enter_message" ? "Enter text" : value;
});

const sendLabel = computed(() => {
  const value = t("Global.send");
  return value === "Global.send" ? "Send" : value;
});

const requiredMessageError = computed(() => {
  const value = t("Global.please_enter_message");
  return value === "Global.please_enter_message"
    ? "Please enter the message"
    : value;
});

const handleSuccessContinue = () => {
  successDialogVisible.value = false;
};

const submitData = async () => {
  if (!message.value.trim()) {
    errorToast(requiredMessageError.value);
    return;
  }

  loading.value = true;
  const fd = new FormData();
  fd.append("message", message.value.trim());

  const headers = {};
  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`;
  }

  try {
    const res = await axios.post("send-contact-message", fd, { headers });

    if (response(res) === "success" || res.data?.key === "success") {
      successToast(res.data?.msg || "Success");
      successDialogMessage.value =
        res.data?.msg || t("contact.request_sent_success");
      successDialogVisible.value = true;
      message.value = "";
    } else {
      errorToast(res.data?.msg || "An error occurred");
    }
  } catch (err) {
    errorToast(err?.response?.data?.msg || "An error occurred");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.contact-page {
  padding: 20px 0 32px;
}

.contact-title {
  margin-bottom: 18px;
}

.contact-card {
  max-width: 640px;
  margin: 0 auto;
}

.contact-illustration {
  width: 220px;
  max-width: 100%;
  display: block;
  margin: 0 auto 20px;
}

.contact-form {
  width: 100%;
}

.contact-submit-btn {
  width: 72%;
  display: block;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .contact-title {
    margin-bottom: 14px;
  }

  .contact-card {
    max-width: 100%;
  }

  .contact-illustration {
    width: 180px;
    margin-bottom: 16px;
  }

  .contact-submit-btn {
    width: 100%;
  }
}
</style>
