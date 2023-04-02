<template>
    <div class="flex flex-col w-full items-center">
        <div
            class="w-full items-center pb-2 border-b border-gray-200 flex sm:space-x-0 space-x-6 justify-center"
        >
            <div v-for="tab in tabs" :key="tab.name" class="flex flex-col">
                <!-- desktop:start -->
                <div
                    @click="setActiveTab(tab)"
                    class="py-2 px-12 ease-in duration-150 rounded hidden md:flex cursor-pointer"
                >
                    <div
                        :class="{
                            'text-indigo-700 border-b-2 border-indigo-700 text-xs': isActive(tab),
                            'text-gray-600 text-xs': !isActive(tab),
                        }"
                    >
                        <p
                            class="text-xs xl:text-lg font-bold leading-none text-center"
                            :class="{
                                'text-indigo-700 dark:text-orange-300 border-b-2 border-orange-300 text-xs':
                                    isActive(tab),
                                'text-gray-600 dark:text-white text-xs': !isActive(tab),
                            }"
                        >
                            {{ tab.name }}
                        </p>
                    </div>
                </div>
                <!-- desktop:end -->
                <!-- mobile:start -->
                <div
                    @click="setActiveTab(tab)"
                    class="flex w-full text-xs justify-between md:hidden my-4 items-center border-b border-gray-200 cursor-pointer"
                >
                    <div
                        :class="{
                            'text-indigo-700 border-b-2 border-indigo-700 text-xs': isActive(tab),
                            'text-gray-600 text-xs': !isActive(tab),
                        }"
                    >
                        <p
                            class="text-xs xl:text-sm leading-none text-center"
                            :class="{
                                'text-indigo-700 border-b-2 border-indigo-700 text-xs':
                                    isActive(tab),
                                'text-gray-600 text-xs': !isActive(tab),
                            }"
                        >
                            {{ tab.name }}
                        </p>
                    </div>
                </div>
                <!-- mobile:end -->
            </div>
        </div>

        <div class="w-full px-3">
            <component :is="getComponent(activeTab)" />

            <DashTimeLine v-if="isActive(tabs[0])" />
            <DashAchievement v-if="isActive(tabs[1])" />
            <DashLeaderBoard v-if="isActive(tabs[2])" />
        </div>
    </div>
</template>

<script setup>
//tabs
const tabs = [
    {
        name: 'Timeline',
        component: 'DashTimeLine',
    },
    {
        name: 'achievement',
        component: 'DashAchievement',
    },
    {
        name: 'Leader Board',
        component: 'DashLeaderBoard',
    },
]

const activeTab = ref(tabs[0])

const setActiveTab = tab => {
    activeTab.value = tab
}

const isActive = tab => {
    return activeTab.value.name === tab.name
}

const getComponent = tab => {
    return isActive(tab) ? tab.component : null
}
</script>
