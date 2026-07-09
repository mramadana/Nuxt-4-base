<template>
    <section>
        <div class="inner-layout">
            <div class="container_auth">
                <div class="auth-layout">
                    <div class="inner-Auth">
                        <div class="auth-content-layout">
                            <div v-if="!hideHeader" class="header-Auth">
                                <button v-if="showBackButton" type="button" @click="handleCustomBack" class="back-btn-box">
                                    <i class="fa-solid" :class="locale === 'ar' ? 'fa-angle-right' : 'fa-angle-left'"></i>
                                </button>
                                <div class="AuthLang">
                                    <GlobalLang />
                                </div>
                            </div>
                            <slot />
                        </div>
                    </div>
                    <CommonWaveShape />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "#vue-router";

const { t, locale } = useI18n();

// Get page meta data
const route = useRoute();

// Get back link configuration from page meta
const hasCustomHandler = computed(() => route.meta.customBackHandler || false);
const showBackButton = computed(() => route.name !== "Auth.login");
const hideHeader = computed(() => route.meta.hideHeader || false);

// Get reference to the page component
const pageRef = ref(null);

// Handle custom back button click
const handleCustomBack = () => {
    // Check if page has custom handler
    if (hasCustomHandler.value) {
        // Emit a global event that the page can listen to
        if (process.client) {
            window.dispatchEvent(new CustomEvent("customBackClick"));
        }
    } else {
        // For regular pages, just go back normally
        if (process.client) {
            window.history.back();
        }
    }
};

watchEffect(() => {
    useHead({
        title: `${t(route.name)}`,
    });
});
</script>

<style lang="scss">
.inner-layout {
    min-height: 100vh;
    background: #fff;
}

.container_auth {
    min-height: 100vh;
}

.auth-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: row-reverse;
    align-items: stretch;
    background-color: #fff;
}

/* Ensure the layout always renders Form on the Right and Wave/Oval on the Left */
html[dir="rtl"] {
    .auth-layout {
        flex-direction: row;
    }
}

html[dir="ltr"] {
    .auth-layout {
        flex-direction: row-reverse;
    }
}

.auth-content-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
    // width: min(640px, 100%);
    padding: 28px 24px;
    background-color: #fff;
    position: relative;
}

.back-btn-box {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: var(--main);
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(44, 88, 162, 0.2);

    &:hover {
        background-color: #254b8a;
        transform: translateY(-2px);
    }

    i {
        font-size: 16px;
    }
}
.header-Auth {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 24px;
}

.AuthLang {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
}

.header-Auth .lang-pill-button {
    min-width: 80px;
    height: 36px;
    border-radius: 10px;
    border-color: #0e3b64;
    padding: 6px 12px;
}

.header-Auth .lang-pill-button p {
    color: #0e3b64;
    font-size: 12px;
}

.inner-Auth {
    width: 50%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Hide the duplicate logo inside the form on desktop screens, as it is already centered in the left wave panel */
@media (min-width: 768px) {
    .logo-image {
        display: none !important;
    }
}

@media (max-width: 992px) {
    .auth-layout {
        flex-direction: column !important;
    }

    .inner-Auth {
        width: 100%;
        min-height: auto;
    }

    .auth-content-layout {
        margin: 0;
        padding: 88px 20px 40px;
        width: auto;
    }
}
</style>
