<template>
    <header
        v-if="useRoute().path !== '/play'"
        class="relative flex flex-col top-0 w-full h-10vh mb-10 z-10"
    >
        <button @click="handleHomeNav" class="justify-self-center self-center w-32 h-1/3 mt-5">
            <LoginLogo :horizontal="true" class="text-2xl" />
        </button>
        <div class="flex justify-center items-start w-full">
            <div class="md:w-1/2 w-3/4">
                <UserProfileList
                    :reset="true"
                    :search="true"
                    :noFocus="true"
                    :clear="clear"
                    :focusNow="focusNow"
                    :focusNowEabled="true"
                    @selectUser="navigateTo(`/users/${$event?.username}`)"
                />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const clear = ref(false)
const focusNow = ref(false)

onMounted(() => {
    document.addEventListener('keydown', e => {
        if (e.key === 'k' && e.ctrlKey) {
            e.preventDefault()
            focusSearch()
        }
    })
})

const handleHomeNav = () => {
    clearSearch()
    navigateTo('/')
    useEmit('soundTrack', 'on')
}

const clearSearch = () => {
    clear.value = true
    setTimeout(() => {
        clear.value = false
    }, 100)
}

const focusSearch = () => {
    focusNow.value = true
    setTimeout(() => {
        focusNow.value = false
    }, 100)
}
</script>
