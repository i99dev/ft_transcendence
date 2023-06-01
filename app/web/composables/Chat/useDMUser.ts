export const useDMUser = async (user_login: string) => {
    const openDM = (chat: GroupChat & DirectChat) => {
        const { setChatModalOpen } = useChat()
        const { setChatType } = useChatType()
        const { setChatView } = useChatView()
        const { setCurrentChat } = useCurrentChat()
        const { setGroupChatSearching } = useGroupChatSearching()

        setGroupChatSearching(false)
        setChatModalOpen(true)
        setChatType('DM')
        setCurrentChat(chat)
        setChatView(false)
    }

    const { data } = await useDirectChatWith(user_login)
    if (data.value && data.value.length !== 0) openDM(data.value[0])
    else {
        const { chatSocket } = useChatSocket()
        chatSocket.value?.emit('create-direct-chat', JSON.stringify({ user: user_login }))
        chatSocket.value?.on('new-direct-list', async (payload: any) => {
            const { data } = await useDirectChatWith(user_login)
            if (data.value && data.value.length !== 0) openDM(data.value[0])
            else return false
        })
    }
    return true
}
