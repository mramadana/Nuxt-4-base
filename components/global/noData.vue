<template>
    <div class="nodata d-flex justify-content-center">
        <div class="no-data">
            <img  loading="lazy" src="@/assets/images/no-data.webp" alt="image" class="no-data-img">
            <div class="no-data-text">{{ noData_text }}</div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        noData_text: {
            type: String,
            required: true
        }
    });
</script>