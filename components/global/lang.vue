<template>
  <div class="lang-pill" :class="{ 'color-lang': colorLang }">
    <button @click="toggleLang" class="lang-pill-button">
      <p>{{ htmlLang === "ar" ? "English" : "Ar" }}</p>
      <img :src="currentFlag" :alt="htmlLang === 'ar' ? 'English' : 'Arabic'" class="icon" />
    </button>
  </div>
</template>

<script setup>
import { useCookie } from "#app";
import flagEn from "~/assets/images/auth-img/en-img.svg";
import languageSkill from "~/assets/images/auth-img/ksa-img.webp";

const props = defineProps({
  colorLang: {
    type: Boolean,
    default: false,
  },
});

const htmlLang = ref("");
const currentFlag = computed(() => {
  const flag = htmlLang.value === "ar" ? flagEn : languageSkill;
  console.log("Current Lang:", htmlLang.value, "Flag:", flag);
  return flag;
});
const changeDir = (dir) => {
  const element = document.documentElement;
  element.setAttribute("lang", dir);
  element.setAttribute("dir", dir === "ar" ? "rtl" : "ltr");
  htmlLang.value = dir;
};

const switchLang = (newLang) => {
  const lang = useCookie("lang");
  if (newLang !== lang.value) {
    lang.value = newLang;
    localStorage.setItem("locale", newLang);
    location.reload();
  }
};

const toggleLang = () => {
  const newLang = htmlLang.value === "ar" ? "en" : "ar";
  switchLang(newLang);
};

onMounted(() => {
  const savedLang =
    localStorage.getItem("locale") || useCookie("lang").value || "ar";
  changeDir(savedLang);
});
</script>

<style lang="scss" scoped>
.lang-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .lang-pill-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 10px;
    border: 1px solid var(--main);
    background-color: #fff;
    border-radius: 10px;
    cursor: pointer;
    color: #fff;
    transition: all 0.3s ease;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;

    .icon {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    p {
      margin: 0;
      color: var(--main);
      font-size: 13px;
    }
  }

  &.color-lang .lang-pill-button {
    background-color: transparent;
    color: red;
  }
}
</style>
