<template>
    <div class="fixed z-21 inset-0 bg-black bg-opacity-70 flex items-center justify-center">
        <div class="bg-background border-1 border-white text-white p-6 rounded-md text-center z-21">
            <h2 class="text-xl font-semibold text-white mb-4">
                You cant perform this task while having anohter tab open!
            </h2>
            <p>Please use the other tab. if you don't have another active tab, refresh the page</p>
            <button
                class="mt-4 bg-secondary hover:bg-primary smooth-transition hover:scale-105 active:scale-95 border-1 text-white rounded-md px-4 py-2"
                v-click-effect="() => (showDublicateModal = false)"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDublicateModal } from '@/composables/Game/useSocket'
const { showDublicateModal } = useDublicateModal()
</script>
