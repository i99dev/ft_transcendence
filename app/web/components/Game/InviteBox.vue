<template>
    <div class="fixed inset-0 bg-black bg-opacity-10 z-20">
        <div
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-background bg-opacity-90 py-6 px-10 rounded-lg shadow-tertiary shadow-md border-1 border-secondary_light space-y-4"
        >
            <div v-if="inviteModal.type == 'invited'" key="invited">
                <h2 class="text-2xl text-center text-white font-bold mb-4">
                    {{ invite?.inviterId }} Called you to a Yonko Duel! Do you accept?
                </h2>
                <div v-if="inviteModal.gameType === 'custom'">
                    <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
                        Pick Two PowerUps
                    </h3>
                    <div class="flex justify-center">
                        <div class="grid grid-cols-2 gap-2 text-white">
                            <div
                                v-for="(powerup, index) in powerups"
                                :key="index"
                                class="flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    :id="powerup"
                                    :value="powerup"
                                    v-model="selectedPowerups"
                                    @change="checkPowerupLimit"
                                    class="form-checkbox text-blue-500"
                                />
                                <label :for="powerup" class="ml-2">{{ powerup }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-4 justify-center mt-4">
                    <button
                        :disabled="
                            inviteModal.gameType === 'custom' && selectedPowerups.length != 2
                        "
                        class="py-2 px-4 border-1 border-white rounded-md text-white bg-primary bg-opacity-75 hover:bg-opacity-100 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        @click="acceptInvite"
                    >
                        Accept
                    </button>
                    <button
                        class="py-2 px-4 border-1 border-white rounded-md text-white bg-background bg-opacity-75 hover:bg-opacity-100 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        @click="declineInvite"
                    >
                        Decline
                    </button>
                </div>
            </div>

            <div v-else key="inviting">
                <div v-if="!inviteModal.rejected && !isLoading">
                    <div>
                        <h2 class="text-2xl text-center text-white font-bold mb-4">
                            Invite {{ inviteModal.target }} to a Duel !
                        </h2>
                        <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
                            Select Game Type
                        </h3>
                        <ul class="space-y-2">
                            <li>
                                <button
                                    :class="mode === 'classic' ? 'bg-opacity-100' : 'bg-opacity-75'"
                                    class="w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-opacity-100 border-1 border-white transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                                    @click="selectMode('classic')"
                                >
                                    Classic Pong
                                </button>
                            </li>
                            <li>
                                <button
                                    :class="mode === 'custom' ? 'bg-opacity-100' : 'bg-opacity-75'"
                                    class="w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-opacity-100 border-1 border-white transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                                    @click="selectMode('custom')"
                                >
                                    Custom Pong
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div v-if="mode === 'custom'">
                        <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
                            Choose Two PowerUps
                        </h3>
                        <div class="grid grid-cols-2 gap-2 text-white">
                            <div
                                v-for="(powerup, index) in powerups"
                                :key="index"
                                class="flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    :id="powerup"
                                    :value="powerup"
                                    v-model="selectedPowerups"
                                    @change="checkPowerupLimit"
                                    class="form-checkbox text-blue-500"
                                />
                                <label :for="powerup" class="ml-2">{{ powerup }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="inviteModal.rejected">
                    <h2 class="text-2xl text-center text-white font-bold mb-4">Invite Failed</h2>
                    <p v-if="inviteModal.playerStatus != 'online'" class="text-center text-white">
                        {{ inviteModal.target }} is {{ inviteModal.playerStatus }}
                    </p>
                    <p v-else class="text-center text-white">
                        {{ inviteModal.target }} declined your invite
                    </p>
                </div>
                <div
                    v-if="!isLoading || inviteModal.rejected"
                    class="mt-10 flex space-x-4 justify-center"
                >
                    <button
                        class="py-2 px-4 rounded-md text-white bg-background bg-opacity-75 hover:bg-opacity-100 border-1 border-whiute transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        @click="
                            () => {
                                inviteModal.open = false
                            }
                        "
                    >
                        Close
                    </button>
                    <button
                        :disabled="
                            (mode === 'custom' && selectedPowerups.length != 2) ||
                            inviteModal.rejected
                        "
                        class="py-2 px-4 border-1 border-white rounded-md text-white bg-tertiary bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                        @click="sendInvite"
                    >
                        Send Invite
                    </button>
                </div>
            </div>
            <div v-if="isLoading && !inviteModal.rejected" class="box">
                <div class="loading-container flex flex-col items-center justify-center">
                    <CommonLoading />
                    <p class="loading-text mt-2 text-lg font-bold text-white">
                        Let's see if {{ inviteModal.target }} is
                    </p>
                    <p class="loading-text mt-2 text-lg font-bold text-white">
                        up for the challenge! Sending invite...
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFriends } from '~~/composables/useFriends'
const mode = ref('' as string)
const selectedPowerups = ref<string[]>([])
const isLoading = ref(false)
const { invite, inviteModal, send, accept, decline } = await useGameInvite()
const { chat_info } = useChat()
const { friends_info } = await useFriends()
const { showDublicateModal, isClientConnected } = useDublicateModal()

const powerups = ['Hiken', 'Baika no Jutsu', 'Shinigami', 'Shunshin no Jutsu']

watchEffect(() => {
    if (inviteModal.value.type === 'invited') {
        chat_info.value.chatModalOpen = false
        friends_info.value.friendsModalOpen = false
    }
})

const selectMode = (newMode: string) => {
    mode.value = newMode
}

onBeforeUnmount(() => {
    if (inviteModal.value.type === 'invited') {
        decline()
    }
})

const checkPowerupLimit = () => {
    if (selectedPowerups.value.length > 2) {
        selectedPowerups.value.shift()
    }
}

const acceptInvite = () => {
    invite.value.powerups = selectedPowerups.value
    accept()
    inviteModal.value.type = ''
}

const declineInvite = () => {
    invite.value.powerups = selectedPowerups.value
    decline()
    inviteModal.value.type = ''
}

const sendInvite = () => {
    if (!isClientConnected()) {
        showDublicateModal.value = true
        return
    }
    isLoading.value = true
    send({
        inviterId: '',
        invitedId: inviteModal.value.target,
        gameType: mode.value,
        powerups: selectedPowerups.value,
    })
}
</script>
