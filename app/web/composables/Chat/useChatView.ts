export const useChatView = () => {
    const chatView = useState<boolean>('chat_view', () => true)

    const setChatView = (view: boolean) => {
        chatView.value = view
    }

    return { chatView, setChatView }
}
