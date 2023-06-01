export const useCurrentChat = () => {
    const currentChat = useState<(GroupChat & DirectChat) | null>('current_chat', () => null)

    const setCurrentChat = (chat: (GroupChat & DirectChat) | null) => {
        currentChat.value = chat
    }

    return { currentChat, setCurrentChat }
}
