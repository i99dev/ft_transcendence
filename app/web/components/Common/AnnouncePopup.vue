<template>
    <div v-for="(ann, index) in announcement" :key="index">
        <CommonMainPopup
            :show="isAnnounce && checkAnnounceAchiev(index)"
            @closeMainPopup="closeAcievPopUp(index)"
        >
            <div class="centered flex-col p-10 text-white">
                <div class="rounded-full p-2 border border-white hover:scale-105 smooth-transition">
                    <img
                        class="rounded-full w-56 aspect-square object-cover"
                        :src="getImagePath(ann.type)"
                    />
                </div>
                <span class="mt-8 text-2xl font-semibold leading-none tracking-tighter lg:text-3xl">
                    {{ getAnnounceTitle(ann) }}
                </span>
                <span class="mt-3 text-base leading-relaxed text-center opacity-80">
                    {{ getAnnounceContent(ann) }}
                </span>
                <button
                    @click="closeAcievPopUp(index)"
                    class="centered mt-6 w-full py-4 px-10 text-xl font-medium bg-secondary rounded-xl transition duration-500 ease-in-out transform hover:bg-primary focus:outline-none"
                >
                    {{ getButtonName(ann) }}
                </button>
            </div>
        </CommonMainPopup>
    </div>
</template>

<script setup lang="ts">
let newAchievement = (await getNewAnnouncement('ACHIEVEMENT')) as NotificationDto[]

let newPunish = (await getNewAnnouncement('PUNISHMENT')) as NotificationDto[]

let newCompensate = (await getNewAnnouncement('COMPENSATION')) as NotificationDto[]

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
    if (!announceState.value[index] && announcement.value != undefined)
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
    if (newPunish && newPunish.length > 0)
        newPunish.forEach(punish => {
            value.push({
                content: punish.content,
                type: 'PUNISHMENT',
                id: punish.id,
            })
        })
    if (newCompensate && newCompensate.length > 0)
        newCompensate.forEach(compensate => {
            value.push({
                content: compensate.content,
                type: 'COMPENSATION',
                id: compensate.id,
            })
        })
    value.reverse()
    return value
})

onMounted(async () => {
    const totalSize =
        (newAchievement ? newAchievement.length : 0) +
        (newRank && newRank.rank != null ? 1 : 0) +
        (newPunish.length > 0 ? newPunish.length : 0) +
        (newCompensate.length > 0 ? newCompensate.length : 0)
    if (totalSize > 0) {
        isAnnounce.value = true
        announceState.value = new Array(totalSize).fill(true)
    }
})

const getImagePath = (ImageName: string) => {
    return `/announce/${ImageName}.gif`
}

const getAnnounceTitle = (ann: any) => {
    if (ann.type == 'PUNISHMENT' || ann.type == 'COMPENSATION') return 'Attention !'
    return ann.type == 'ACHIEVEMENT' || ann.type == 'PUNISHMENT' || ann.type == 'COMPENSATION'
        ? ann.content
        : getLadderRank(ann.content)
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
    return ann.type == 'RANK_DOWN' || ann.type == 'PUNISHMENT' ? 'OOPS !' : 'YAY !'
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
