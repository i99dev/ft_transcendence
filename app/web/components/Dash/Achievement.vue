<template>
    <div>
        <div
            class="grid grid-cols-1 md:grid-cols-3 group text-white shadow-xl shadow-secondary border"
        >
            <div
                v-for="(acheivement, index) in acheivements"
                :key="index"
                class="p-10 flex flex-col items-center text-center group border-r"
            >
                <span class="p-5 rounded-full smooth-transition text-white">
                    <img src="../../assets/devilfruit.png" alt="Achievement Image" />
                </span>
                <p class="text-xl font-medium text-white mt-3">{{ acheivement.type }}</p>
                <p class="mt-2 text-sm text-white">{{ acheivement.description }}</p>
            </div>
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
