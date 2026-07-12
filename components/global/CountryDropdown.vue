<template>
    <div class="card d-flex justify-content-center dropdown_card country-dropdown-card">
        <Select v-model="internalValue" :options="countries" filter optionLabel="name" :placeholder="placeholder"
            :emptyMessage="$t('Global.no_available_options')" :emptyFilterMessage="$t('Global.emptyFilterMessage')">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex-group-me">
                    <img v-if="slotProps.value.image" loading="lazy" :alt="slotProps.value.label || slotProps.value.name"
                        :src="slotProps.value.image" :class="`mr-2 flag flag-${slotProps.value.key}`"
                        style="width: 24px" />
                    <div>{{ slotProps.value.key }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex-group-me">
                    <img v-if="slotProps.option.image" loading="lazy"
                        :alt="slotProps.option.label || slotProps.option.name" :src="slotProps.option.image"
                        :class="`mr-2 flag flag-${slotProps.option.key}`" style="width: 24px" />
                    <div>{{ slotProps.option.name }}</div>
                    <div>{{ slotProps.option.key }}</div>
                </div>
            </template>
        </Select>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Object,
        default: null
    },
    placeholder: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);
const { payload: countriesPayload, isSuccess } = await useApiData("countries", {
    cacheKey: "api:countries",
});

const countries = computed(() => countriesPayload.value || []);

const internalValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const selectDefaultCountry = () => {
    if (props.modelValue || !countries.value.length) return;

    const defaultCountry = countries.value.find((country) => country.id == 1 || country.key == '966');
    if (defaultCountry) {
        emit('update:modelValue', { ...defaultCountry });
    }
};

watch(countries, selectDefaultCountry, { immediate: true });

watch(isSuccess, (value) => {
    if (value) {
        selectDefaultCountry();
    }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.country-dropdown-card {
    border: 0;
}
</style>
