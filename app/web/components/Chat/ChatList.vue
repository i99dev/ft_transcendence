<template>
  <div class="border-y mt-2 border-gray-200 h-full">
      <div class=" overflow-y-auto" style="max-height: 92vh; height: 92vh;">
          <!-- chat list -->
          <div
              class="flex flex-col"
              x-descriptions="Tab component"
          >

              <!-- chat element -->
              <button v-for="chat in chats"
                  @click="$emit('selectChat', chat)"
                  class="p-2 border-y border-slate-100 bg-slate-200 hover:bg-slate-100 relative"
              >
                  <img
                      :src="chat.users[1].image"
                      alt="User Photo"
                      class="rounded-full w-10 h-10 object-cover"
                  />
                  <!-- online badge -->
                  <span
                  class="absolute bottom-2 left-9 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                  />
                  <div class="absolute top-2 left-16 block text-slate-700">{{ chat.users[1].username }}</div>
              </button>
          </div>
      </div>
  </div>
</template>

<script setup>


const chats = ref()
const chatType = ref('DM')

onMounted(async () => {
  const { data } = chatType.value === 'DM' ? await useDirectChats() : await useGroupChats()
  
  if (data) chats.value = data.value

})

</script>
