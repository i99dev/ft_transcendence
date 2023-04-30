<template>
    <div>
        <!-- Acheivement popup -->
        <div v-if="showAciev">
            <div v-for="(achv, index) in achievements" :key="index">
                <div
                    v-if="checkAnnounceAchiev(index)"
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
                                            Congratulations ! You just have unlocked "
                                            {{ achv }} " Achievement !
                                        </p>
                                        <div class="w-full mt-6">
                                            <a
                                                @click="closeAcievPopUp(index)"
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
import { getNewAchievement, deleteNewAchievement } from '../composables/useAchievement'
import { ref, onMounted, computed } from 'vue'

const newAchievement = await getNewAchievement()

const announceAchiev = ref([] as boolean[])

const showAciev = ref(false)

const closeAcievPopUp = async (index: number) => {
    if (newAchievement && index < newAchievement.length) {
        announceAchiev.value[index] = false
        return
    }
    showAciev.value = false
}

const checkAnnounceAchiev = (index: number) => {
    if (!announceAchiev.value[index] && newAchievement) deleteNewAchievement(newAchievement[index])
    return announceAchiev.value[index]
}

console.log('newAchievement', newAchievement)
const achievements = computed(() => newAchievement)


onMounted(() => {
    if (newAchievement && newAchievement.length > 0) {
        showAciev.value = true
        announceAchiev.value = new Array(newAchievement.length).fill(true)
    }
})

</script>
