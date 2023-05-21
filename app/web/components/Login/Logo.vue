<template>
    <div class="w-full h-full flex justify-center items-center"
        :class="{
            'flex-col': !horizontal,
            'flex-row': horizontal,
        }"
    >
        <div
            class="w-1/2 aspect-square centered rounded-full bg-gradient-to-b from-primary to-secondary animate-bounce"
        >
            <img src="/crack-icon.png" alt="cracked ball" class="h-full w-full p-3 pt-1 pl-1" />
        </div>
        <h1 class="text-primary w-fit m-2 text-center whitespace-nowrap font-[CyberGlitch]">
            {{ useRuntimeConfig().GAME_NAME }}
        </h1>
    </div>
</template>

<script lang="ts" setup>

const horizontal = ref(false)
const props = defineProps(['horizontal'])

onMounted(() => {
    if (props.horizontal) horizontal.value = props.horizontal
})

</script>