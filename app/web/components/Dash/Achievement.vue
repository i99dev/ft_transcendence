<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 group text-white">
        <div
            v-for="(acheivement, index) in acheivements"
            :key="index"
            class="p-10 m-4 flex flex-col items-center text-center group border border-tertiary rounded-xl shadow-xl shadow-secondary smooth-transition hover:scale-105"
        >
            <span class="p-2 rounded-full border border-tertiary smooth-transition text-white">
                <img :src="acheivement.image" alt="Achievement Image" class="rounded-full" />
            </span>
            <p class="text-xl font-medium mt-3 whitespace-nowrap">{{ acheivement.type }}</p>
            <p class="mt-2 text-sm overflow-hidden opacity-70">{{ acheivement.description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    username: {
        type: String,
        default: false,
    },
})

const user = await getUserbyUserName(props.username)

const plyracheivement = await getPlayerAchievement(user.login)

const acheivements = computed(() => plyracheivement)
</script>

<style></style>
