<template>
    <div
        id="Home"
        class="flex min-h-screen justify-center overflow-hidden bg-gray-50 dark:bg-gray-700 py-6 sm:py-12 mobile:p-2"
    >
        <div class="flex flex-col w-full space-y-6 items-center">
            <div class="flex flex-row justify-center w-1/2 mobile:w-full">
                <UserProfileCardOne class="w-full" />
            </div>
            <button
                @click="() => navigateTo('/play')"
                class="h-10 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            >
                Play
            </button>
            <div class="grid grid-flow-col-dense sm:flex gap-4 w-full justify-center"></div>

            <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between w-full">
                <div
                    class="w-full sm:w-1/4 rounded-t sm:rounded-l sm:rounded-t-none shadow bg-white dark:bg-gray-800"
                ></div>
                <div class="w-full sm:w-1/2 dark:bg-gray-800">
                    <DashTab />
                </div>
                <div
                    class="w-full sm:w-1/4 rounded-b sm:rounded-b-none shadow bg-white dark:bg-gray-800"
                ></div>
            </div>

            <!-- Acheivement popup -->
            <div v-if="announceAchiev">
                <div
                    v-for="(achv, index) in achievements" :key="index"
                    class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center"
                >
                    <div
                        class="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
                    >
                        <div
                            class="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24"
                        >
                            <div class="grid grid-cols-1">
                                <div class="mt-4 mr-auto mb-4 ml-auto bg-white max-w-lg">
                                    <div class="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                                        <img src="../assets/devilfruit.png" />
                                        <p
                                            class="mt-8 text-2xl font-semibold leading-none text-gray tracking-tighter lg:text-3xl"
                                        >
                                            {{ achv }}
                                        </p>
                                        <p
											class="mt-3 text-base leading-relaxed text-center text-gray-600"
										>
											Congratulations ! You just have unlocked " {{ achv }} " Achievement !
										</p>
                                        <div class="w-full mt-6">
                                            <a
                                                @click="closeAceiPopUp()"
                                                class="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >YAY !</a
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getNewAchievement, useAchievement } from '../composables/useAchievement'
import { ref, onMounted, computed } from 'vue'

definePageMeta({
    middleware: ['pages'],
})


const { achievement } = useAchievement()


const newAchievement = getNewAchievement()

const announceAchiev = ref(false)

const closeAceiPopUp = () => {
    announceAchiev.value = false
}

console.log('newAchievement', newAchievement)
const achievements = computed(() => achievement.value)

onMounted(() => {
    console.log('mounted', achievement.value)
    if (achievement.value) {
        announceAchiev.value = true
    }
})
</script>
