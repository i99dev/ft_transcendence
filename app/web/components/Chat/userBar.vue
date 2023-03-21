<!-- src/components/Navbar.vue -->
<template>
    <nav class="bg-blue-500 p-4">
        <div class="container mx-auto">
            <div class="flex justify-between items-center">
                <div class="text-white font-bold">Logo</div>

                <div class="relative">
                    <button @click="toggleChatModal" class="p-2 rounded-full bg-white">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User Photo"
                            class="rounded-full w-10 h-10"
                        />
                    </button>

                    <div
                        v-if="setChatModalOpen"
                        class="absolute right-0 mt-4 w-80 bg-white shadow-md rounded-lg p-4"
                    >
                        <h2 class="text-gray-700 font-semibold mb-2">Chat with User</h2>

                        <div class="chat-messages h-48 overflow-y-auto mb-2">
                            <div
                                class="bg-gray-200 rounded-lg p-2 my-2"
                                v-for="(message, index) in messages"
                                :key="index"
                            >
                                {{ message }}
                            </div>
                        </div>

                        <form @submit.prevent="sendMessage">
                            <input
                                v-model="newMessage"
                                type="text"
                                placeholder="Type your message..."
                                class="w-full p-2 border-2 border-gray-300 rounded"
                            />
                            <button
                                type="submit"
                                class="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
const { chat_info, setChatModalOpen, send_message } = useChat()
console.log(chat_info)
// export default {
//     data() {
//         return {
//             chatModalOpen: false,
//             messages: [],
//             newMessage: '',
//         }
//     },
//     methods: {
//         toggleChatModal() {
//             this.chatModalOpen = !this.chatModalOpen
//         },
//         sendMessage() {
//             if (this.newMessage.trim() !== '') {
//                 this.messages.push(this.newMessage.trim())
//                 this.newMessage = ''
//             }
//         },
//     },
// }
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
