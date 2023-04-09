<template>
  <div class="bg-slate-200 rounded-lg">
    <div
        class="p-2 bg-slate-200 relative flex"
    >
        <button @click="$emit('exitChat')">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#555" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12l14 0"></path>
                <path d="M5 12l6 6"></path>
                <path d="M5 12l6 -6"></path>
            </svg>
        </button>
        
        <img
            :src="currentChat.users[1].image"
            alt="User Photo"
            class="rounded-full w-10 h-10 object-cover mx-1"
        />
        <span
        class="absolute bottom-2 left-16 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
        />
        <div class="text-slate-700 ml-2 text-xl py-1">{{ currentChat.users[1].username }}</div>
    </div>
    <div class="flex flex-col justify-between overflow-hidden w-full h-full" style="height: 90vh;">
        <div id="chat-messages" class=" overflow-y-scroll pr-10 box-content flex flex-col bg-white">
            <div
                class="bg-gray-200 rounded-lg p-2 mx-2 my-2 w-3/4 "
                v-for="(message, index) in messages"
                :key="index"
                :class="{ 'bg-green-200': message.sender_id === user_info.id, 'self-end': message.sender_id === user_info.id}"
            >
                <div class="">
                    {{ message.content }}
                </div>
                <div class="text-gray-600 text-sm flex justify-end">
                    <!-- {{ new Date(message.created_at).toLocaleDateString('en-GB') }} -->
                    {{ new Date(message.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}
                </div>
            </div>
        </div>
        <div>
            <form @submit.prevent="sendMessage">
                <input
                    v-model="newMessage"
                    type="text"
                    placeholder="Message"
                    class="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-400 mb-2"
                    style="outline: none;"
                />
                <button
                    type="submit"
                    class=" bg-blue-500 text-white py-2 px-2 -ml-10 mt-4 rounded-full h-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10 14l11 -11"></path>
                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                    </svg>
                </button>
            </form>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Socket } from 'socket.io-client';

const { user_info } = useUserInfo()

const chatSocket = useNuxtApp().chatSocket as Ref<Socket>
const messages = ref()
const newMessage = ref('')

const { currentChat } = defineProps(['currentChat'])

onMounted(async () => {
    chatSocket.value.on('add-message', (payload : chatMessage) => {
        messages.value.push(payload)
        
        //scroll to bottom
        const chatMessages = document.getElementById('chat-messages') as HTMLElement
        setTimeout(() => {chatMessages.scrollTop = chatMessages.scrollHeight}, 100)
    })


    const { data } = await useChatMessages(currentChat.chat_room_id)
    if (data) {
        messages.value = data.value.messages   
    }
})


const sendMessage = () => {
    chatSocket.value.emit('add-message', {room_id: 'direct_room1', message: "first message from client"})
    newMessage.value = ''
}

</script>

<style scoped>
#chat-messages {
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

#chat-messages::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}

/* screen width is less than 768px (medium) */
#chat-messages {
    height: 82vh;
}
</style>