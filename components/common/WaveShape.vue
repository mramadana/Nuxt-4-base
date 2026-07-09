<template>
  <div class="wave-container">
    <div class="wave-panel w-100 h-100 d-flex align-items-center justify-content-center">
      <div class="logo-wrapper d-flex flex-column align-items-center justify-content-center">
        <img src="@/assets/images/layout-img.svg" alt="Asas and Tamim Logo" class="auth-logo">
        <h2 class="brand-name">{{ authTitle }}</h2>
        <div class="logo-subtitle">
          <span class="subtitle-text">{{ authSubtitle }}</span>
          <span class="subtitle-text">{{ authDescription }}</span>
        </div>
        <div class="feature-list">
          <div v-for="feature in authFeatures" :key="feature.label" class="feature-card">
            <span class="feature-icon">
              <i :class="feature.icon"></i>
            </span>
            <span class="feature-label">{{ feature.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const authTitle = computed(() => t('Auth.wave_title'));
const authSubtitle = computed(() => t('Auth.wave_subtitle'));
const authDescription = computed(() => t('Auth.wave_description'));

const authFeatures = computed(() => [
  {
    label: t('Auth.wave_feature_products'),
    icon: 'fas fa-cube'
  },
  {
    label: t('Auth.wave_feature_orders'),
    icon: 'fas fa-clipboard-list'
  },
  {
    label: t('Auth.wave_feature_reports'),
    icon: 'fas fa-chart-bar'
  }
]);
</script>

<style lang="scss">
.wave-container {
  width: 50%;
  // max-width: 696px;
  display: flex;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 0;

  .wave-panel {
    position: relative;
    background: url("@/assets/images/Auth-image.svg") lightgray 50% / cover no-repeat;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(14, 59, 100, 0.75);
      pointer-events: none;
      // opacity: 0.75;
    }
  }

  .logo-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: min(450px, 72%);
    min-height: 373px;
    direction: rtl;
    animation: fadeInLogo 1s ease-out;
  }

  .auth-logo {
    width: 150px;
    max-width: 100%;
    height: auto;
    object-fit: contain;
    margin-bottom: 28px;
  }

  .brand-name {
    font-size: 36px;
    line-height: 1.25;
    font-weight: 400;
    color: #fff;
    margin: 0 0 14px;
    text-align: center;
    direction: rtl;
    letter-spacing: 0;
  }

  .logo-subtitle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 4px;

    .subtitle-text {
      font-size: 16px;
      line-height: 1.55;
      font-weight: 400;
      color: #FFFFFFCC;
      text-align: center;
      direction: rtl;
    }
  }

  .feature-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 34px;
    width: 100%;
  }

  .feature-card {
    width: 96px;
    height: 96px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.26);
    box-shadow: 0 18px 36px rgba(0, 24, 51, 0.16);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #0e5a94;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    line-height: 1;
  }

  .feature-label {
    color: #27445f;
    font-size: 12px;
    line-height: 1.3;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
  }

  @keyframes fadeInLogo {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media screen and (max-width: 992px) {
    display: none;
  }
}
</style>
