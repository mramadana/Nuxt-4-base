<template>
    <div class="form-group">
        <label v-if="label" class="label">
            {{ label }}
            <span v-if="requiredSymbol" class="label-symbol">{{ requiredSymbol }}</span>
        </label>
        <div class="d-flex justify-content-center align-items-center dropdown_card special-custom" :class="{ 'is-invalid': isInvalid }">
            <div class="hasicon" v-if="hasIcon">
                <i :class="`fas ${icon} select-icon`"></i>
            </div>
            <MultiSelect
                v-if="multiple"
                v-model="internalValue"
                optionLabel="name"
                :optionValue="props.optionValue"
                display="chip"
                :options="options"
                :placeholder="placeholder"
                :maxSelectedLabels="maxSelectedLabels"
                class="custom-dropdown"
                @change="handleChange"
                :disabled="disabled"
                :emptyMessage="$t('Global.no_available_options')"
                :emptyFilterMessage="$t('Global.emptyFilterMessage')"
            />
            <Dropdown 
                v-else
                v-model="internalValue"
                optionLabel="name" 
                :optionValue="props.optionValue"
                display="chip"
                :options="options" 
                :placeholder="placeholder"
                :maxSelectedLabels="maxSelectedLabels" 
                class="custom-dropdown"
                @change="handleChange"
                :disabled="disabled"
                :emptyMessage="$t('Global.no_available_options')"
                :emptyFilterMessage="$t('Global.emptyFilterMessage')"
            />
        </div>
        <!-- validation تلقائي -->
        <div v-if="isInvalid" style="color: red; font-size: 12px; margin-top: 5px;">
            {{ label }} مطلوب
        </div>
    </div>
</template>

<script setup>

    const props = defineProps({
        options: {
            type: Array,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        requiredSymbol: {
            type: String,
            default: ''
        },
        maxSelectedLabels: {
            type: Number,
            default: null
        },
        hasIcon: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: 'fa-venus-mars'
        },
        modelValue: [Number, String, Array],
        disabled: {
            type: Boolean,
            default: false
        },
        optionValue: { type: String, default: null },
        showValidation: { type: Boolean, default: false },
        validationSchema: { type: Function, required: false },
        multiple: { type: Boolean, default: false },
    });

    const emit = defineEmits(['update:modelValue', 'change']);

    const internalValue = computed({
        get() { return props.modelValue },
        set(val) { emit('update:modelValue', val) }
    })

    const isInvalid = computed(() => {
        if (!props.showValidation) return false;

        if (props.validationSchema) {
            try {
                props.validationSchema.validateSync(props.modelValue);
                return false;
            } catch (error) {
                return true;
            }
        }

        if (props.multiple) return !props.modelValue || props.modelValue.length === 0;
        return !props.modelValue;
    });

    const handleChange = (event) => {
        if (props.disabled) return  
        emit('change', event.value);
        emit('update:modelValue', event.value);
    }

</script>

<style lang="scss" scoped>
.label-symbol {
    color: red;
    margin-inline-start: 4px;
    font-size: 17px;
}

.special-custom {
    // padding: 0 !important;
    // border: none !important;
    // background: transparent !important;

    :deep(.custom-dropdown:hover),
    :deep(.custom-dropdown.p-focus),
    :deep(.custom-dropdown:focus-within) {
        border-color: var(--main);
    }

    :deep(.p-dropdown-label),
    :deep(.p-multiselect-label) {
        font-size: 14px;
        color: #333;
        text-align: start;
        background: transparent;
        padding-inline: 12px;
        padding-block: 12px;
    }

    :deep(.p-dropdown-trigger),
    :deep(.p-multiselect-trigger) {
        width: auto;
        color: #999;
        padding-inline: 10px;
    }

    :deep(.p-inputtext) {
        border: none;
        box-shadow: none;
        background: transparent;
    }
}

.is-invalid :deep(.custom-dropdown) {
    border-color: #e74c3c !important;
    // box-shadow: 0 0 5px rgba(231, 76, 60, 0.25) !important;
}
</style>
