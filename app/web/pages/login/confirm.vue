<template>
    <div>
        <Toast />
        <div class="centered flex-col h-screen w-full">
            <div class="centered flex-col border border-tertiary shadow-xl shadow-tertiary p-5 rounded-2xl" style="max-width: 80vw">
                <h1
                    class="text-white text-xl md:text-2xl lg:text-3xl text-center capitalize p-2 mb-8"
                >
                    Hi
                    <div class="capitalize m-2 text-white p-2 rounded-xl bg-primary inline-block cursor-default smooth-transition hover:scale-110">{{
                        useRoute().query.login
                    }}</div>
                </h1>
                <h1 class="text-white text-md md:text-2xl lg:text-3xl text-center p-2 mb-1 w-full">
                    Please enter the {{ useRoute().query.code_length }}-digits verification code we
                    sent via {{ useRoute().query.type }}
                </h1>
                <LoginOTPInput @submitCode="submitCode" class="my-4"/>
                <h3
                    v-if="timer"
                    title="expires in"
                    class="text-white text-md md:text-lg text-center mt-8 p-2 animate-pulse bg whitespace-nowrap"
                >
                    <div class="">
                        {{ Math.trunc(timer / 60) }} :
                        {{ timer % 60 > 0 ? timer % 60 : 0 }}
                    </div>
                </h3>
                <h3
                    v-else
                    title="expired"
                    class="text-white text-md md:text-lg text-center mt-8 p-2 bg whitespace-nowrap opacity-70"
                >
                    code is expired
                </h3>
                <h2 class="text-white text-md md:text-lg lg:text-xl text-center capitalize p-2">
                    Didn't receive the code?
                    <button
                        class="bg-secondary hover:bg-primary smooth-transition rounded-xl p-2 m-2"
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
