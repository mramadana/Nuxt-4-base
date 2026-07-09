<template>
  <div class="form-group">
    <label :for="name" class="label" :style="{ color: labelColor }">
      {{ label }}
      <span v-if="requiredSymbol" class="label-symbol">{{ requiredSymbol }}</span>
    </label>
    <span v-if="subLabel" class="sub-label ms-1" :style="{ color: subLabelColor }">{{ subLabel }}</span>
    <div class="input-wrapper">

      <template v-if="readonly">
        <div class="position-relative" :class="{ 'with_icon': with_icon }">
          <input :value="modelValue" :type="type" :name="name" :placeholder="placeholder" readonly class="main_input" />
          <img v-if="icon" :src="icon" alt="icon" class="input-icon" :class="localeDir" />
        </div>
      </template>

      <template v-else>
        <div class="position-relative" :class="{ 'with_icon': with_icon }">
          <input v-model="modelValue" :type="type" :name="name" :placeholder="placeholder" class="main_input"
            :class="{ 'is-invalid': shouldShowError && !moveErrorToParent }" @input="onInput" @keydown="onKeydown" />
          <img v-if="icon" :src="icon" alt="icon" class="input-icon" :class="localeDir" />
          <slot name="rightIcon"></slot>
        </div>

        <!-- Display validation error message -->
        <p v-if="shouldShowError && !moveErrorToParent" class="error-message text-danger" :class="localeDir">{{
          errorMessage }}</p>
      </template>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { nextTick, watch } from 'vue';


const props = defineProps({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false
  },
  requiredSymbol: {
    type: String,
    default: ''
  },
  subLabel: {
    type: String,
    required: false
  },
  labelColor: {
    type: String,
    required: false
  },
  subLabelColor: {
    type: String,
    required: false,
    default: '#AEAEAE'
  },
  placeholder: {
    type: String,
    required: false
  },
  icon: {
    type: String,
    required: false
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  value: {
    type: String,
    required: false
  },
  validationSchema: { type: Function, required: false },
  showErrors: {
    type: Boolean,
    default: false
  },
  with_icon: {
    type: Boolean,
    default: false
  },
  moveErrorToParent: {
    type: Boolean,
    default: false
  },
  hasRightIcon: {
    type: Boolean,
    default: false
  }
})

const { t, locale } = useI18n({ useScope: 'global' });

const localeDir = computed(() => {
  return locale.value === 'en' ? 'ltr' : 'rtl';
})

const modelValue = defineModel('modelValue')

// Track if user started typing
const touched = ref(false)

// Handle input event
const onInput = (event) => {
  touched.value = true
}

// Handle keydown event to prevent negative signs and decimals
const onKeydown = (event) => {
  if (props.type === 'number') {
    // Prevent minus sign (-) and decimal point (.)
    if (event.key === '-' || event.key === '.' || event.key === '+' || event.key === 'e' || event.key === 'E') {
      event.preventDefault()
      touched.value = true // Show validation immediately
      return false
    }
  }
}

// Show error if touched OR showErrors prop is true
const shouldShowError = computed(() => {
  return (touched.value || props.showErrors) && hasError.value
})

// Manual validation
const hasError = computed(() => {
  // If validation schema is provided, use it
  if (props.validationSchema) {
    try {
      props.validationSchema.validateSync(modelValue.value);
      return false; // No error
    } catch (error) {
      return true; // Has error
    }
  }

  // Fallback to basic validation
  if (!modelValue.value || modelValue.value.toString().trim() === '') {
    return true;
  }

  if (props.type === 'number') {
    const stringValue = String(modelValue.value);
    // Check for negative signs or decimals immediately
    if (stringValue.includes('-') || stringValue.includes('.')) {
      return true;
    }
    const numValue = Number(modelValue.value);
    if (isNaN(numValue) || numValue <= 0) {
      return true;
    }
  }

  if (props.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(modelValue.value)) {
      return true;
    }
  }

  return false;
});

const errorMessage = computed(() => {
  if (!hasError.value) return '';

  // If validation schema is provided, use its error message
  if (props.validationSchema) {
    try {
      props.validationSchema.validateSync(modelValue.value);
      return '';
    } catch (error) {
      return error.message;
    }
  }

  // Fallback to basic error messages
  const fieldName = props.label || props.name;

  if (props.type === 'email' && modelValue.value && modelValue.value.trim() !== '') {
    return t('validation.email', { field: fieldName });
  }

  if (props.type === 'number' && modelValue.value && modelValue.value.trim() !== '') {
    return t('validation.number', { field: fieldName });
  }

  return t('validation.required_with_label', { field: fieldName });
});

// Expose validation state to parent when moveErrorToParent is true
defineExpose({
  hasError,
  shouldShowError,
  errorMessage,
  localeDir
});

// Watch for showErrors to reset touched when validation passes
watch(() => props.showErrors, (newVal) => {
  if (!newVal) touched.value = false;
});
</script>

<style lang="scss">
.error-message {
  font-size: 12px;
  margin-top: 8px;
}

.label-symbol {
  color: red;
  margin-inline-start: 4px;
  font-size: 17px;
}
</style>
