<template>
    <div class="fixed overlay bg-black w-full h-full transparent bg-opacity-30 ">
        <div
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-21 bg-primary bg-opacity-50 py-6 px-10 rounded-lg border border-white space-y-4">

            <h2 v-if="!isLoading" class="text-2xl text-center text-white font-bold mb-4">
                Game on! Your competitor has arrived. are you ready?
            </h2>
            <div v-if="!isLoading" class="flex justify-center mt-4">
                <button
                    class="py-2 px-4 rounded-md text-white bg-background transparent bg-opacity-50  hover:bg-opacity-100 border-1  transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    v-click-effect="readyToStart">
                    Ready
                </button>
            </div>

            <div v-if="isLoading" class="box">
                <div class="loading-container flex flex-col items-center justify-center">
                    <Loading />
                    <p class="loading-text mt-2 text-lg font-bold text-white">
                        Waiting Opponent to be ready...
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '~~/composables/Game/useSocket'

const { emitReady } = useSocket()

const isLoading = ref(false)

const readyToStart = () => {
    isLoading.value = true
    emitReady()
}
</script>
