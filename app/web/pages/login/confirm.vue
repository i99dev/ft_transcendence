<template>
    <div>
        <Toast />
        <div class="centered flex-col h-screen w-full">
            <div class="centered flex-col" style="max-width: 80vw">
                <h1
                    class="text-white text-xl md:text-2xl lg:text-3xl text-center capitalize p-2 mb-1"
                >
                    Hi
                    <span class="capitalize m-2 text-white p-2 rounded-xl bg-primary">{{
                        useRoute().query.login
                    }}</span>
                </h1>
                <h1 class="text-primary text-xl md:text-2xl lg:text-3xl text-center p-2 mb-1">
                    Please enter the {{ useRoute().query.code_length }}-digits verification code we
                    sent via {{ useRoute().query.type }}
                </h1>
                <h3
                    v-if="timer"
                    class="text-white text-md md:text-lg lg:text-xl text-center normal-case mb-5 p-2"
                >
                    code will expire in {{ Math.trunc(timer / 60) }} :
                    {{ timer % 60 > 0 ? timer % 60 : 0 }}
                </h3>
                <h3
                    v-else
                    class="text-white text-md md:text-lg lg:text-xl text-center normal-case mb-5 p-2"
                >
                    code is expired
                </h3>
                <LoginOTPInput @submitCode="submitCode" />
                <h2 class="text-white text-md md:text-lg lg:text-xl text-center capitalize m-5 p-2">
                    Didn't receive the code?
                    <button
                        class="text-primary underline underline-offset-8 hover:text-tertiary hover:cursor-pointer transition duration-200 ease-in-out ml-2"
                        v-click-effect="resendCode"
                    >
                        Resend
                    </button>
                </h2>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'

const toast = useToast()

definePageMeta({
    layout: false,
})

if (await useIsAuth()) navigateTo('/')

const timer = ref()

onMounted(() => {
    timerCountdown()
})
let timerId: any
const timerCountdown = () => {
    if (useRoute().query.period) {
        timer.value = useRoute().query.period
        timerId = setInterval(() => {
            if (timer.value > 0) timer.value -= 1
            else window.clearInterval(timerId)
        }, 1000)
    }
}

const submitCode = async (code: string) => {
    const login = useRoute().query.login
    if (login) {
        const { data, error } = await useSubmitConfirmationCode(login.toString(), code)
        if (data.value) {
            useCookie('access_token').value = data.value?.access_token
            navigateTo('/')
        } else {
            toast.add({
                severity: 'error',
                summary: 'Incorrect',
                detail: 'Incorrect verification code',
                life: 3000,
            })
        }
    }
}

const resendCode = async () => {
    const login = useRoute().query.login as string
    if (!login) return

    const { data, error } = await useResendVerificationCode(login.toString())

    if (data.value) {
        toast.add({
            severity: 'success',
            summary: 'Sent',
            detail: 'New verification code has sent',
            life: 3000,
        })
        window.clearInterval(timerId)
        timerCountdown()
    } else
        toast.add({
            severity: 'error',
            summary: 'Cannot send',
            detail: 'Cannot send new verification code yet. Please try again after 30 seconds',
            life: 3000,
        })
}
</script>
