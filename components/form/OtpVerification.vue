<template>
    <div>
        <div class="layout-activate d-flex" dir="ltr">
            <v-otp-input
                ref="otpInput"
                v-model:value="otpValue"
                input-classes="otp-input"
                separator=" "
                :num-inputs="numInputs"
                :should-auto-focus="shouldAutoFocus"
                :is-input-num="isInputNum"
                :placeholder="['-', '-', '-', '-']"
            />
        </div>

        <div class="resend-section d-flex align-items-center justify-content-between mt-4 mb-4">
            <div class="new-sign d-flex align-items-center">
                <span class="ml-1">{{ $t('Auth.havent_received_code') }}</span>
                <button 
                    type="button" 
                    @click="handleResendCode" 
                    :disabled="countStatus" 
                    :class="{'disabledClass' : countStatus}"
                >
                    {{ $t('Auth.resend_code') }}
                </button>
            </div>

            <div class="text-center col-wh" v-if="countStatus">
                <span>{{ countDown }} :</span>  <span>00</span> 
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import VOtpInput from "vue3-otp-input";

const { t } = useI18n({ useScope: 'global' });

// Props
const props = defineProps({
    numInputs: {
        type: Number,
        default: 4
    },
    shouldAutoFocus: {
        type: Boolean,
        default: true
    },
    isInputNum: {
        type: Boolean,
        default: true
    },
    initialCountdown: {
        type: Number,
        default: 60
    }
});

// Emits
const emit = defineEmits(['update:modelValue', 'resend-code']);

// Refs
const otpInput = ref(null);
const otpValue = ref('');
const countStatus = ref(false);
const countDown = ref(props.initialCountdown);

// Watch for OTP value changes and emit to parent
watch(otpValue, (newValue) => {
    emit('update:modelValue', newValue);
});

// Expose OTP value as model
const modelValue = defineModel('modelValue', {
    type: String,
    default: ''
});

// Sync modelValue with otpValue
watch(modelValue, (newValue) => {
    otpValue.value = newValue;
}, { immediate: true });

watch(otpValue, (newValue) => {
    modelValue.value = newValue;
});

// Countdown functionality
const startCountdown = () => {
    countStatus.value = true;
    countDown.value = props.initialCountdown;
    
    const interval = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
            clearInterval(interval);
            countStatus.value = false;
            countDown.value = props.initialCountdown;
        }
    }, 1000);
};

// Handle resend code
const handleResendCode = () => {
    if (!countStatus.value) {
        emit('resend-code');
        startCountdown();
    }
};

// Expose methods to parent component
defineExpose({
    startCountdown,
    clearOtp: () => {
        otpValue.value = '';
        modelValue.value = '';
    }
});

// Start countdown on mount if needed
onMounted(() => {
    // You can start countdown automatically if needed
    // startCountdown();
});
</script>

<style scoped>
.disabledClass {
    opacity: 0.6;
    cursor: not-allowed;
}

.main-cl {
    color: var(--main);
    font-weight: bold;
}

.layout-activate {
    justify-content: center;
}

.resend-section {
    max-width: 300px;
    margin: 0 auto;
    width: 100%;
}
</style>
