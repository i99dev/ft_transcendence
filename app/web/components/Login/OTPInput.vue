<template>
    <div class="centered w-full h-full">
        <v-otp-input
            ref="otpInput"
            v-model:value="bindModal"
            input-classes="otp-input"
            separator="-"
            :num-inputs="6"
            :should-auto-focus="true"
            input-type="number"
            :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
            :placeholder="['*', '*', '*', '*', '*', '*']"
            @on-complete="$emit('submitCode', bindModal)"
        />
    </div>
</template>
<script lang="ts" setup>
import VOtpInput from 'vue3-otp-input'

const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null)
const bindModal = ref('')
</script>

<style>
.otp-input {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    margin: 0 0.2rem;
    font-size: 90%;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
}
/* Background colour of an input field with value */
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input::placeholder {
    font-size: 100%;
    text-align: center;
    font-weight: 600;
}
</style>
