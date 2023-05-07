<template>
    <div class="flex flex-row h-screen max-h-screen">
        <div class="flex-grow-0 w-1/4 shadow">user list</div>
        <div class="flex-grow">
            <div class="flex flex-col max-h-screen">
                <div class="bg-white h-12 shadow">header</div>
                <div class="bg-gray-200 rounded max-h-screen h-screen">
                    <div class="chat-messages overflow-y-auto pb-22 min-h-full">
                        <div
                            class="bg-white rounded-lg p-2 my-2 m-2"
                            v-for="(message, index) in messages"
                            :key="index"
                        >
                            <div class="text-gray-700 font-semibold">
                                {{ message.name }}
                            </div>
                            <div class="text-gray-600 text-sm">
                                {{ message.time }}
                            </div>
                            <div>
                                {{ message.message }}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="p-1">
                        <form @submit.prevent="sendMessage" class="flex flex-row">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                class="w-full p-2 border-gray-300 rounded-l"
                                v-model="newMessage"
                            />
                            <button
                                type="submit"
                                class="bg-blue-500 text-white py-2 px-4 rounded-r"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { id } = router.currentRoute.value.params
const messages = useState('message', () => []) as any
const newMessage = ref('')
const sendMessage = () => {
    messages.value.push({
        name: 'me',
        time: new Date().toLocaleTimeString(),
        message: newMessage.value,
    })
    newMessage.value = ''
    const chatMessages = document.querySelector('.chat-messages') as any
    // scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
}
</script>

<style>
.chat-messages {
    scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
    width: 0.5rem;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
}
/* screen width is less than 768px (medium) */
.chat-messages {
    height: 70vh;
    scroll-padding: 100px;
}
</style>
