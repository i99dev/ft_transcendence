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

let newAchievement = await getNewAnnouncement('ACHIEVEMENT') as NotificationDto[]

let newPunish = await getNewAnnouncement('PUNISHMENT') as NotificationDto[]

let newCompensate = await getNewAnnouncement('COMPENSATION') as NotificationDto[]

let newRank = await getNewRank()

console.log('PUNISHMENT', newPunish)

console.log('COMPENSATION', newCompensate)

console.log('RANK', newRank)

console.log('ACHIEVEMENT', newAchievement)

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
        announcement.value != undefined
        )
        deleteNewNotif(announcement.value[index].id)

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
    if (newRank && newRank.rank != null)
        value?.push({
            content: newRank.rank,
            type: newRank.isUp ? 'RANK_DOWN' : 'RANK_UP',
            id: newRank.id,
        })
    if (newPunish && newPunish.length > 0 )
        newPunish.forEach((punish) => {
            value.push({
                content: punish.content,
                type: 'PUNISHMENT',
                id: punish.id,
            });
        });
    if (newCompensate && newCompensate.length > 0)
        newCompensate.forEach((compensate) => {
            value.push({
                content: compensate.content,
                type: 'COMPENSATION',
                id: compensate.id,
            });
        });

    return value
})

onMounted(async () => {
    const totalSize = (newAchievement ? newAchievement.length : 0) + (newRank && newRank.rank != null ? 1 : 0) + (newPunish.length > 0 ? 1 : 0) + (newCompensate.length > 0 ? 1 : 0)
    if (totalSize > 0) {
        isAnnounce.value = true
        announceState.value = new Array(totalSize).fill(true)
    }
})

const getImagePath = (ImageName: string) => {
    return `/announce/${ImageName}.gif`
}

const getAnnounceTitle = (ann: any) => {
    if (ann.type ==  'PUNISHMENT' || ann.type == 'COMPENSATION')
        return 'Attention !'
    return (ann.type == 'ACHIEVEMENT' || ann.type ==  'PUNISHMENT' || ann.type == 'COMPENSATION') ? ann.content : getLadderRank(ann.content)
}

const getAnnounceContent = (ann: any) => {
    if (ann.type == 'ACHIEVEMENT')
        return `Congratulations ! You just have unlocked " ${ann.content} " Achievement !`
    else if (ann.type == 'RANK_UP')
        return `Congratulations ! You just have ranked up to " ${getLadderRank(ann.content)} " !`
    else if (ann.type == 'RANK_DOWN')
        return `Sorry ! You just have ranked down to " ${getLadderRank(ann.content)} "  !`
    else if (ann.type == 'PUNISHMENT')
        return `Bad News ! You have been punished for leaving the match, 20% of your XP has been deducted, your new XP is " ${ann.content} " !`
    else if (ann.type == 'COMPENSATION')
        return `Good News! Compensation have been applied for the time you lost when the opponent left the match, your new XP is " ${ann.content} " !`

}

const getButtonName = (ann: any) => {
    return (ann.type == 'RANK_DOWN' || ann.type == 'PUNISHMENT') ? 'OOPS !' : 'YAY !'
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
