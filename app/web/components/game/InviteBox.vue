<template>
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-violet-900 bg-opacity-90 py-6 px-10 rounded-lg shadow-lg border border-violet-700 space-y-4"
    >
      <div v-if="inviteModal.type=='invited'" key="invited">
        <h2 class="text-2xl text-center text-white font-bold mb-4">You are invited!</h2>
        <div v-if="inviteModal.gameType === 'custom'">
          <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
            Pick Two PowerUps
          </h3>
          <div class="grid grid-cols-2 gap-2 text-white">
            <div
              v-for="(powerup, index) in powerups"
              :key="index"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="'invited-' + powerup"
                :value="powerup"
                v-model="selectedPowerups"
                @change="checkPowerupLimit"
                class="form-checkbox text-blue-500"
              />
              <label :for="'invited-' + powerup" class="ml-2">{{ powerup }}</label>
            </div>
          </div>
        </div>
        <div class="flex space-x-4 justify-center mt-4">
          <button
            :disabled="mode === 'custom' && selectedPowerups.length != 2"
            class="py-2 px-4 border-2 border-green-700 rounded-md text-white bg-green-700 hover:bg-green-800 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="acceptInvite"
          >
            Accept
          </button>
          <button
            class="py-2 px-4 border-2 border-red-700 rounded-md text-white bg-red-700 hover:bg-red-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="declineInvite"
          >
            Decline
          </button>
        </div>
      </div>
  
      <div v-else key="inviting">
        <h2 class="text-2xl text-center text-white font-bold mb-4">Invite a Friend</h2>
        <div>
          <h3 class="text-xl text-bold text-center text-white mt-4 mb-2">
            Choose Game Mode
          </h3>
          <div class="flex space-x-4 justify-center mb-4">
            <button
              :class="mode === 'classic' ? 'bg-green-500' : 'bg-blue-500'"
              class="py-2 px-4 rounded-md text-white bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              @click="selectMode('classic')"
            >
              Classic
            </button>
            <button
              :class="mode === 'custom' ? 'bg-green-500' : 'bg-blue-500'"
              class="py-2 px-4 rounded-md text-white bg-opacity-75 hover:bg-opacity-100 border-2 border-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              @click="selectMode('custom')"
            >
              Custom
            </button>
          </div>
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
        <div class="mt-10 flex space-x-4 justify-center">
          <button
            class="py-2 px-4 border-2 border-blue-700 rounded-md text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            @click="inviteModal.open=false"
          >
            Close
          </button>
          <button
          :disabled="mode === 'custom' && selectedPowerups.length != 2"
          class="py-2 px-4 border-2 border-blue-700 rounded-md text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          @click="sendInvite"
        >
          Send Invite
        </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const mode = ref('' as string)
  const selectedPowerups = ref<string[]>([])
  const {inviteModal} = useGameInvite()
  
  const powerups = ['Hiken', 'Baika no Jutsu', 'Shinigami', 'Shunshin no Jutsu']
  
  console.log('GameInvite created')

  const selectMode = (newMode: string) => {
    mode.value = newMode
  }
  
  const checkPowerupLimit = () => {
    if (selectedPowerups.value.length > 2) {
      selectedPowerups.value.shift()
    }
  }
  
  const acceptInvite = () => {
  }
  
  const declineInvite = () => {
  }
  
  const sendInvite = () => {
  }
  </script>