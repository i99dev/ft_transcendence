export const useGroupChatParticipants = () => {
    const participants = useState<ChatUser[] | null>('group_chat_participants', () => null)
    const participantsType = useState<string>('group_chat_participants_type', () => 'NORMAL')

    const setParticipants = (groupChatParticipants: ChatUser[] | null) => {
        participants.value = groupChatParticipants
    }

    const setParticipantsType = (groupChatParticipantsType: string) => {
        participantsType.value = groupChatParticipantsType
    }

    const updateParticipants = async (user_type: string = 'NORMAL') => {
        const { currentChat } = useCurrentChat()
        if (currentChat.value) {
            const { data: chatUsers } = await useGetGroupChatParticipants(
                currentChat.value.chat_room_id,
                user_type,
            )
            if (chatUsers.value?.chat_user) setParticipants(chatUsers.value?.chat_user)
            if (user_type === 'BAN') participantsType.value = 'BAN'
            else participantsType.value = 'NORMAL'
        }
    }

    return {
        participants,
        setParticipantsType,
        participantsType,
        setParticipants,
        updateParticipants,
    }
}
