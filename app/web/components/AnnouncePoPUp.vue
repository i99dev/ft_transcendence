<template>
    <div>
        <!-- Announcement popup -->
        <div v-if="isAnnounce">
            <div v-for="(ann, index) in announcement" :key="index">
                <div v-if="checkAnnounceAchiev(index)"
                    class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                    <div
                        class="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                        <div class="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24">
                            <div class="grid grid-cols-1">
                                <div class="mt-4 mr-auto mb-4 ml-auto bg-white max-w-lg">
                                    <div class="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                                        <img class="rounded-full" :src=getImagePath(ann.type) />
                                        <p
                                            class="mt-8 text-2xl font-semibold leading-none text-gray tracking-tighter lg:text-3xl">
                                            {{ getAnnounceTitle(ann) }}
                                        </p>
                                        <p class="mt-3 text-base leading-relaxed text-center text-gray-600">
                                            {{ getAnnounceContent(ann) }}
                                        </p>
                                        <div class="w-full mt-6">
                                            <a v-click-effect="() => closeAcievPopUp(index)"
                                                class="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                {{ getButtonName(ann) }} </a>
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

let newAchievement = await getNewAnnouncement('ACHIEVEMENT')

let newPaunish = await getNewAnnouncement('PUNISHMENT')

let newCompensate = await getNewAnnouncement('COMPENSATION')

console.log('PUNISHMENT', newPaunish)

console.log('COMPENSATION', newCompensate)

let newRank = await getNewRank()

const announceState = ref([] as boolean[])

const isAnnounce = ref(false)

const closeAcievPopUp = async (index: number) => {
    if (announcement && announcement.value && index < announcement.value?.length) {
        announceState.value[index] = false
        return
    }
    isAnnounce.value = false
}

const checkAnnounceAchiev = (index: number) => {
    if (
        !announceState.value[index] &&
        announcement.value != undefined &&
        announcement.value[index].type == 'ACHIEVEMENT'
    )
        deleteNewNotif(announcement.value[index].id)
    else if (
        !announceState.value[index] &&
        announcement.value != undefined &&
        announcement.value[index].type == 'RANK_UP'
    )
        deleteNewNotif(announcement.value[index].id)
    else if (
        !announceState.value[index] &&
        announcement.value != undefined &&
        announcement.value[index].type == 'RANK_DOWN'
    ) {
        deleteNewNotif(announcement.value[index].id)
    }
    return announceState.value[index]
}

const announcement = computed(() => {
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
    if (newAchievement && newAchievement.length > 0) {
        isAnnounce.value = true
        announceState.value = new Array(newAchievement.length).fill(true)
        if (newRank && newRank.rank != null) announceState.value?.push(true)
    } else if (newRank && newRank.rank != null) {
        isAnnounce.value = true
        announceState.value = new Array(1).fill(true)
    }
})

const getImagePath = (ImageName: string) => {
    return `/announce/${ImageName}.gif`
}

const getAnnounceTitle = (ann: any) => {
    return ann.type == 'ACHIEVEMENT' ? ann.content : getLadderRank(ann.content)
}

const getAnnounceContent = (ann: any) => {
    if (ann.type == 'ACHIEVEMENT')
        return `Congratulations ! You just have unlocked " ${ann.content} " Achievement !`
    else if (ann.type == 'RANK_UP')
        return `Congratulations ! You just have ranked up to " ${getLadderRank(ann.content)} " !`
    else if (ann.type == 'RANK_DOWN')
        return `Sorry ! You just have ranked down to " ${getLadderRank(ann.content)} "  !`

}

const getButtonName = (ann: any) => {
    return ann.type == 'RANK_DOWN' ? 'OOPS !' : 'YAY !'
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
