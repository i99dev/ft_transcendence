<template>
    <div class="w-full px-4">
        <Popover class="relative">
            <PopoverButton class="outline-none">
                <slot name="button"></slot>
            </PopoverButton>

            <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-1 opacity-0"
            >
                <PopoverPanel
                    class="absolute py-2 m-2 border-2 rounded-lg shadow-lg z-10"
                    :class="props?.styles"
                >
                    <slot />
                </PopoverPanel>
            </transition>
        </Popover>
    </div>
</template>

<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
const props = defineProps(['styles'])
</script>
