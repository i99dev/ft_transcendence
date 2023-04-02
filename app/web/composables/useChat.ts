export const useChat = () => {
    const chat_info = useState<any | null>('chat_info', () => {
        return {
            chatModalOpen: false,
            messages: [],
            newMessage: '',
        }
    })

    const setChatModalOpen = (open: boolean) => {
        chat_info.value.chatModalOpen = open
    }

    const send_message = async (message: string) => {
        chat_info.value.messages.push({
            message,
            user: 'me',
        })
        chat_info.value.newMessage = ''
    }

    return { chat_info, setChatModalOpen, send_message }
}
