<template>
  <div class="fixed inset-0 bg-black bg-opacity-10 z-20">
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 bg-opacity-90 py-6 px-10 rounded-lg shadow-lg border border-violet-700 space-y-4">
      <div v-if="inviteModal.type == 'invited'" key="invited">
        <h2 class="text-2xl text-center text-white font-bold mb-4">{{ invite?.inviterId }} Called you to a Yonko Duel! Do
          you accept?</h2>
        <div v-if="inviteModal.gameType === 'custom'">
          <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
            Pick Two PowerUps
          </h3>
          <div class="flex justify-center ">
            <div class="grid grid-cols-2 gap-2 text-white">
              <div v-for="(powerup, index) in powerups" :key="index" class="flex items-center">
                <input type="checkbox" :id="powerup" :value="powerup" v-model="selectedPowerups"
                  @change="checkPowerupLimit" class="form-checkbox text-blue-500" />
                <label :for="powerup" class="ml-2">{{ powerup }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="flex space-x-4 justify-center mt-4">
          <button :disabled="inviteModal.gameType === 'custom' && selectedPowerups.length != 2"
            class="py-2 px-4 border-2 border-green-700 rounded-md text-white bg-green-700 hover:bg-green-800 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="acceptInvite">
            Accept
          </button>
          <button
            class="py-2 px-4 border-2 border-red-700 rounded-md text-white bg-red-700 hover:bg-red-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="declineInvite">
            Decline
          </button>
        </div>
      </div>

      <div v-else key="inviting">

        <div v-if="!inviteModal.rejected && !isLoading">
          <div>
            <h2 class="text-2xl text-center text-white font-bold mb-4">Invite {{ inviteModal.target }} to a Duel !</h2>
            <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
              Select Game Type
            </h3>
            <ul class="space-y-2">
              <li>
                <button :class="mode === 'classic' ? 'bg-green-500' : 'bg-blue-500'"
                  class="w-full py-2 px-4 rounded-md text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                  @click="selectMode('classic')">
                  Classic Pong
                </button>
              </li>
              <li>
                <button :class="mode === 'custom' ? 'bg-green-500' : 'bg-blue-500'"
                  class="w-full py-2 px-4 rounded-md text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                  @click="selectMode('custom')">
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
              <div v-for="(powerup, index) in powerups" :key="index" class="flex items-center">
                <input type="checkbox" :id="powerup" :value="powerup" v-model="selectedPowerups"
                  @change="checkPowerupLimit" class="form-checkbox text-blue-500" />
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
        <div v-if="!isLoading || inviteModal.rejected" class="mt-10 flex space-x-4 justify-center">
          <button
            class="py-2 px-4 rounded-md text-white bg-red-500 bg-opacity-75 hover:bg-opacity-100 border-2 border-red-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="inviteModal.open = false">
            Close
          </button>
          <button :disabled="(mode === 'custom' && selectedPowerups.length != 2) || inviteModal.rejected"
            class="py-2 px-4 border-2 border-blue-700 rounded-md text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="sendInvite">
            Send Invite
          </button>
        </div>
      </div>
      <div v-if="isLoading && !inviteModal.rejected" class="box">
        <div class="loading-container flex flex-col items-center justify-center">
          <div class="half-circle-spinner">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
          </div>
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
  
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref('' as string)
const selectedPowerups = ref<string[]>([])
const isLoading = ref(false)
const { invite, inviteModal, send, accept, decline, reset } = useGameInvite()

const powerups = ['Hiken', 'Baika no Jutsu', 'Shinigami', 'Shunshin no Jutsu']

const selectMode = (newMode: string) => {
  mode.value = newMode
}

const checkPowerupLimit = () => {
  if (selectedPowerups.value.length > 2) {
    selectedPowerups.value.shift()
  }
}

const acceptInvite = () => {
  invite.value.powerups = selectedPowerups.value
  accept()
  navigateTo('/play')
}

const declineInvite = () => {
  invite.value.powerups = selectedPowerups.value
  decline()
  reset()

}

const sendInvite = () => {
  isLoading.value = true
  send({
    inviterId: '',
    invitedId: inviteModal.value.target,
    gameType: mode.value,
    powerups: selectedPowerups.value
  })
}
</script>

<style scoped>
.half-circle-spinner,
.half-circle-spinner * {
  box-sizing: border-box;
}

.half-circle-spinner {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  position: relative;
}

.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: #ff1d5e;
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: #00b6e9;
  animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>