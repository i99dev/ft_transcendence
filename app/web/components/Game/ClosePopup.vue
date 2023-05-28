<template>
    <div class="z-20 fixed overlay bg-black w-full h-full transparent bg-opacity-30">
        <div
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-21 bg-background_light bg-opacity-20 py-6 px-10 rounded-lg border border-white space-y-4"
        >
            <div class="centered">
                <img src="/imgs/warning-48.png" class="centered" />
            </div>
            <h3 class="text-xl text-center text-white font-bold mb-4">
                {{ detail }}
            </h3>
            <h3 class="text-l text-center text-white font-bold mb-4">
                {{ confirmation }}
            </h3>
            <div class="flex justify-center space-x-4">
                <button
                    v-click-effect="() => $emit('closePopup')"
                    class="py-1 px-4 rounded-md text-white bg-background transparent bg-opacity-90 hover:bg-opacity-100 border-1 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                >
                    Cancel
                </button>
                <button
                    v-click-effect="() => $emit('GiveUp')"
                    class="py-1 px-4 rounded-md text-white bg-primary transparent bg-opacity-90 hover:bg-opacity-100 border-1 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                >
                    Exit
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { detail, confirmation } = defineProps(['summary', 'detail', 'confirmation'])
</script>
