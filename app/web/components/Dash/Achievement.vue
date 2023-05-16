<template>
    <div>
        <div
            class="grid grid-cols-1 md:lg:xl:grid-cols-3 group bg-white shadow-xl shadow-neutral-100 border"
        >
            <div
                v-for="(acheivement, index) in acheivements"
                :key="index"
                class="p-10 flex flex-col items-center text-center group md:lg:xl:border-r md:lg:xl:border-b hover:bg-slate-50 cursor-pointer"
            >
                <span class="p-5 rounded-full bg-white text-white shadow-lg shadow-blue-800">
                    <img src="../../assets/devilfruit.png" alt="Achievement Image" />
                </span>
                <!-- <div> {{ acheivement.image }}</div> -->
                <p class="text-xl font-medium text-slate-700 mt-3">{{ acheivement.type }}</p>
                <p class="mt-2 text-sm text-slate-500">{{ acheivement.description }}</p>
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
