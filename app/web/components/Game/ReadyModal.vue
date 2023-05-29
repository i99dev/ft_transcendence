<template>
    <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-21 bg-violet-900 bg-opacity-70 py-6 px-10 rounded-lg shadow-lg border border-violet-700 space-y-4"
    >
        <h2 v-if="!isLoading" class="text-2xl text-center text-white font-bold mb-4">
            Game on! Your competitor has arrived. are you ready?
        </h2>
        <div v-if="!isLoading" class="flex justify-center mt-4">
            <button
                class="py-2 px-4 rounded-md text-white bg-green-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-green-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                @click="readyToStart"
            >
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
