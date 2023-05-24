<template>
  <div>
    <MainPopup appear as="template" :show="props?.show" @closeMainPopup="$emit('closeChatUsers')">
      <div
          v-for="user in users"
          :key="user.username"
          class="flex-row inline-flex flex-nowrap"
      >
          <button
              class="border rounded-full bg-background ease-in-out transition duration-200 m-2 relative"
              @click="removeUser(user)"
          >
              <img
                  class="rounded-full w-8 h-8 object-cover"
                  :src="user.image"
                  :alt="user.username"
              />
              <div
                  class="absolute -right-1 -bottom-1 rounded-full p-1 bg-white text-primary hover:bg-primary hover:text-white smooth-transition"
              >
                  <XMarkIcon class="h-2 w-2" aria-hidden="true" />
              </div>
          </button>
      </div>
      <UserProfileList
          @selectUser="selectUser"
          :search="true"
          :unwantedUsers="props.participants?.map((a : ChatUser) => a.user)"
      />
      <div class="flex justify-end mt-2">
          <button
              class="flex-shrink-0 bg-secondary hover:bg-primary text-white py-1 px-2 rounded capitalize"
              type="button"
              @click="addUsers"
          >
              add
          </button>
      </div>
    </MainPopup>
  </div>
</template>

<script lang="ts" setup>

// const isAddUserOpened = ref(true)
const { user_info } = useUserInfo()
const users = ref([] as UserGetDto[])
const props = defineProps(['participants', 'show'])
const emit = defineEmits(['addUsers'])

const addUsers = () => {
    closeAddUsersPopup()
    emit('addUsers', users.value)
}

const selectUser = (user: UserGetDto) => {
    if (
        !users.value?.find(u => u.login === user.login) &&
        user.login !== user_info.value?.login &&
        !props.participants?.find((p : ChatUser) => p.user_login === user.login)
    )
        users.value?.push(user)
}


const removeUser = (user: UserGetDto) => {
    users.value = users.value?.filter(u => u.id !== user.id)
}

const closeAddUsersPopup = () => {
    setTimeout(() => {
        users.value = []
    }, 200)
    // isAddUserOpened.value = false
}
</script>
