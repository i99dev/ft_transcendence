<template>
    <div class="flex flex-col w-full items-center">
        <div
            class="w-full items-center pb-2 flex mobile:space-x-4 sm:space-x-6 lg:space-x-10 justify-center"
        >
            <button v-for="tab in tabs" :key="tab.name" class="flex flex-col">
                <div
                v-click-effect="() => setActiveTab(tab)"
                    class="py-2 ease-in duration-150 rounded md:flex text-white whitespace-nowrap"
                >
                    <div
                        class="smooth-transition text-white"
                        :class="{
                            'border-b-2 p-2 border-secondary text-lg': isActive(tab),
                            'opacity-50 hover:opacity-100 text-md': !isActive(tab),
                        }"
                    >
                        {{ tab.name }}
                    </div>
                </div>
            </button>
        </div>

        <div class="w-full px-3">
            <component :is="getComponent(activeTab)" />

            <DashMatchHistory v-if="isActive(tabs[0])" :username="props.username" />
            <DashAchievement v-if="isActive(tabs[1])" :username="props.username" />
            <DashLeaderBoard v-if="isMe && isActive(tabs[2])" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
    username: {
        type: String,
        default: false,
    },
})

const user = await getUserbyUserName(props.username)
const { user_info } = useUserInfo()

const isMe = computed(() => {
    return user_info.value?.id === user.id
})

//tabs
const tabs = computed(() => {
    if (isMe.value)
        return [
            {
                name: 'Match History',
                component: 'DashMatchHistory',
            },
            {
                name: 'Achievements',
                component: 'DashAchievement',
            },
            {
                name: 'Leaderboard',
                component: 'DashLeaderBoard',
            },
        ]
    return [
        {
            name: 'Match History',
            component: 'DashMatchHistory',
        },
        {
            name: 'Achievements',
            component: 'DashAchievement',
        },
    ]
})

const activeTab = ref(tabs.value[0])

const setActiveTab = (tab: any) => {
    activeTab.value = tab
}

const isActive = (tab: any) => {
    return activeTab.value?.name === tab.name
}

const getComponent = (tab: any) => {
    return isActive(tab) ? tab.component : null
}
</script>
