<template>
    <Dialog modal class="custum_dialog_width auth-daialog" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/main-logo.svg" alt="login-logo" class="login-logo" loading="lazy">
                <h1 class="main-title mb-3 main-cl">{{ $t("Home.sorry") }}</h1>
                <p class="main-desc">{{ $t("Auth.login_first") }}</p>
                <div class="section-btns mt-4">
                    <button type="button" class="custom-btn d-inline-flex" @click="GoHome">
                        {{ $t("Home.login") }}
                    </button>
                </div>
            </div>
    </Dialog>
</template>

<script setup>

const emit  = defineEmits(['AuthDailog']);

// when route to home 
const GoHome = () => {
    emit('AuthDailog');
}

</script>
