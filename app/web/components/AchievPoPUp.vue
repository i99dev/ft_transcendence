<template>
    <div>
        <!-- Acheivement popup -->
        <div v-if="showAciev">
            <div v-for="(achv, index) in achievements" :key="index">
                <div v-if="checkAnnounceAchiev(index)"
                    class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                    <div
                        class="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                        <div class="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24">
                            <div class="grid grid-cols-1">
                                <div class="mt-4 mr-auto mb-4 ml-auto bg-white max-w-lg">
                                    <div class="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                                        <img class="rounded-full" :src=getImagePath(achv.type) />
                                        <p
                                            class="mt-8 text-2xl font-semibold leading-none text-gray tracking-tighter lg:text-3xl">
                                            {{ getAnnounceTitle(achv) }}
                                        </p>
                                        <p class="mt-3 text-base leading-relaxed text-center text-gray-600">
                                            {{ getAnnounceContent(achv) }}
                                        </p>
                                        <div class="w-full mt-6">
                                            <a v-click-effect="() => closeAcievPopUp(index)"
                                                class="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                {{ getButtonName(achv) }} </a>
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

let newAchievement = await getNewAchievement()

let newRank = await getNewRank()

const announceAchiev = ref([] as boolean[])

const showAciev = ref(false)

const closeAcievPopUp = async (index: number) => {
    if (achievements && achievements.value && index < achievements.value?.length) {
        announceAchiev.value[index] = false
        return
    }
    showAciev.value = false
}

const checkAnnounceAchiev = (index: number) => {
    if (
        !announceAchiev.value[index] &&
        achievements.value != undefined &&
        achievements.value[index].type == 'ACHIEVEMENT'
    )
        deleteNewNotif(achievements.value[index].id)
    else if (
        !announceAchiev.value[index] &&
        achievements.value != undefined &&
        achievements.value[index].type == 'RANK_UP'
    )
        deleteNewNotif(achievements.value[index].id)
    else if (
        !announceAchiev.value[index] &&
        achievements.value != undefined &&
        achievements.value[index].type == 'RANK_DOWN'
    ) {
        deleteNewNotif(achievements.value[index].id)
    }
    return announceAchiev.value[index]
}

const achievements = computed(() => {
    const value = newAchievement?.map(achievement => {
        return {
            content: achievement.content,
            type: 'ACHIEVEMENT',
            id: achievement.id,
        }
    })
    if (newRank)
        value?.push({
            content: newRank.rank,
            type: newRank.isUp ? 'RANK_DOWN' : 'RANK_UP',
            id: newRank.id,
        })
    return value
})

onMounted(async () => {
    newAchievement = await getNewAchievement()
    newRank = await getNewRank()
    if (newAchievement && newAchievement.length > 0) {
        showAciev.value = true
        announceAchiev.value = new Array(newAchievement.length).fill(true)
        if (newRank && newRank.rank != null) announceAchiev.value?.push(true)
    } else if (newRank && newRank.rank != null) {
        showAciev.value = true
        announceAchiev.value = new Array(1).fill(true)
    }
})

const getImagePath = (ImageName: string) => {
    return `/announce/${ImageName}.gif`
}

const getAnnounceTitle = (achv: any) => {
    return achv.type == 'ACHIEVEMENT' ? achv.content : getLadderRank(achv.content)
}

const getAnnounceContent = (achv: any) => {
    if (achv.type == 'ACHIEVEMENT')
        return `Congratulations ! You just have unlocked " ${achv.content} " Achievement !`
    else if (achv.type == 'RANK_UP')
        return `Congratulations ! You just have ranked up to " ${getLadderRank(achv.content)} " !`
    else if (achv.type == 'RANK_DOWN')
        return `Sorry ! You just have ranked down to " ${getLadderRank(achv.content)} "  !`

}

const getButtonName = (achv: any) => {
    return achv.type == 'RANK_DOWN' ? 'OOPS !' : 'YAY !'
}

const getLadderRank = (ladder: string) => {
    switch (ladder) {
        case '1':
            return 'Kaizoku Ou'
        case '2':
            return 'Yonkou'
        case '3':
            return 'Shichibukai'
        case '4':
            return 'Super Rookie'
        case '5':
            return 'Kaizoku'
        case '6':
            return 'Capin Boy'
    }
}
</script>
