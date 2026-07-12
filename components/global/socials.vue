<template>

    <ul class="social_ d-flex gap-4 mb-2">
        <li v-for="item in social" :key="item">
          <a :href="item.link" target="_blank">
            <img :src="item.icon" :alt="item.name" />
          </a>
        </li>
    </ul>

</template>

<script setup>
const {
  payload: socialPayload,
} = await useApiData("socials", {
  cacheKey: "api:socials",
});

const social = computed(() => socialPayload.value || []);

</script>


<style lang="scss">

.social_ {
      a {
        display: block;
        width: 40px;
        height: 40px;
        border: 1px solid #EEE;
        overflow: hidden;
        border-radius: 10px;
        &:hover {
          transform: rotate(360deg);
          border-radius: 50%;
        }
          img {
              width: 100%;
              height: 100%;
              border-radius: 10px;
          }
        }
}

</style>
