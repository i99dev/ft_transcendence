<template>
    <!---- rank dropdown -->
    <div class="mt-4 w-full">
        <CommonMainPopover
            :styles="'-left-9 md:-left-6 bg-background_light w-40'"
            class="text-white flex justify-start mobile:justify-center"
        >
            <template #button>
                <button
                    @click="handleDropDown"
                    class="sm:text-xl text-center p-2 w-fit rounded-xl text-lg text-white hover:bg-primary smooth-transition focus:outline-none"
                    :title="`${
                        user_info?.username === props.username ? 'Your' : props.username
                    } Rank`"
                >
                    {{ getLadderRank(props.ladder) }}
                </button>
            </template>
            <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out"
                >XP level: {{ props.xp }}</span
            >
            <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out"
                >Winning Rate: {{ (WinRate * 100).toFixed(2) }}%
            </span>
            <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out"
                >Total Wins: {{ totalWins }}
            </span>
            <span class="block px-4 py-2 text-xs text-white transition duration-150 ease-in-out"
                >Total Loses: {{ totaLoses }}</span
            >
        </CommonMainPopover>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    ladder: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    username: {
        type: String,
        default: '',
    },
})

// Handle player stat drop down
const showstat = ref(false)

const { user_info } = useUserInfo()

function handleDropDown() {
    showstat.value = !showstat.value
}

const user = await getUserbyUserName(props.username)

const WinRate = (await getPlayerWinRate(user.login)) as number

const totaLoses = await getPlayerGameResult(user.login, false)

const totalWins = await getPlayerGameResult(user.login, true)

const getLadderRank = (ladder: number) => {
    switch (ladder) {
        case 1:
            return 'Kaizoku Ou'
        case 2:
            return 'Yonkou'
        case 3:
            return 'Shichibukai'
        case 4:
            return 'Super Rookie'
        case 5:
            return 'Kaizoku'
        case 6:
            return 'Capin Boy'
    }
}
</script>
