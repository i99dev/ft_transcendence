<template>
  <div class="flex flex-row mb-2">
      <button class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mx-2"
          :class="{'bg-white': chatType !== 'GROUP', 'bg-indigo-400': chatType === 'GROUP'}"
          @click="$emit('switchChatType','GROUP')">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users-group" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
              <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"></path>
              <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
              <path d="M17 10h2a2 2 0 0 1 2 2v1"></path>
              <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
              <path d="M3 13v-1a2 2 0 0 1 2 -2h2"></path>
          </svg>
      </button>
      <button class="border rounded-full hover:bg-indigo-200 ease-in-out transition duration-200 p-2 mx-2"
          :class="{'bg-white': chatType !== 'DM', 'bg-indigo-400': chatType === 'DM'}"
          @click="$emit('switchChatType','DM')">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
          </svg>
      </button>
  </div>
</template>

<script lang="ts" setup>

const { chatType } = defineProps(['chatType'])

</script>
