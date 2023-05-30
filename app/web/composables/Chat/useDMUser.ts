import { useToast } from 'primevue/usetoast'

export const useDMUser = async (user_login: string) => {
  const toast = useToast()
  const openDM = (chat: GroupChat & DirectChat) => {
      const { setChatModalOpen } = useChat()
      const { setChatView } = useChatView()
      const { setCurrentChat } = useCurrentChat()
      setChatModalOpen(true)
      setChatView(true)
      setCurrentChat(chat)
  }

  const { data } = await useDirectChatWith(user_login)
  if (data.value && data.value.length !== 0) openDM(data.value[0])
  else {
      const { chatSocket } = useChatSocket()
      chatSocket.value?.emit('create-direct-chat', JSON.stringify({ user: user_login }))
      chatSocket.value?.on('new-direct-list', async (payload: any) => {
          const { data } = await useDirectChatWith(user_login)
          if (data.value && data.value.length !== 0) openDM(data.value[0])
          else
              toast.add({
                  severity: 'error',
                  summary: 'Opps!',
                  detail: `error: can't DM ${user_login}`,
                  life: 3000,
              })
      })
  }
}
