<template>
    <div class="centered h-screen w-full">
        <div class="rounded-xl bg-opacity-50 px-16 py-10 backdrop-blur-md max-sm:px-8">
            <div class="text-white centered flex-col">
                <div class="h-32 w-32">
                    <Logo />
                </div>
                <div class="mt-8 flex justify-center text-lg text-black">
                    <CyberPunkButton buttonName="Login" @click="loginWithIntra" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// remove the layout in login page
definePageMeta({
    layout: false,
    // middleware: ['pages'],
})

if (await useIsAuth())
    navigateTo('/')
const loginWithIntra = () => {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
        useRuntimeConfig().CLIENT_ID
    }&redirect_uri=${useRuntimeConfig().REDIRECT_URI}&response_type=code`
}
</script>
