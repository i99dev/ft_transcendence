export const useChatType = () => {
  const chatType = useState<ChatRoomType | null>('chat_type', () => 'DM')

  const setChatType = async (type: ChatRoomType | null) => {
      const { setChats } = useChats()
      let chats = [] as any
      let page = 1
      while (true) {
          const { data } =
              type === 'DM'
                  ? await useDirectChats(page)
                  : type === 'GROUP'
                  ? await useGroupChats(page)
                  : { data: { value: undefined } }
          if (data.value && chats) chats = chats?.concat(data.value)
          if (!data.value || data.value?.length < 20) break
          page++
      }
      setChats(chats)

      chatType.value = type
  }

  setChatType(chatType.value)

  return { chatType, setChatType }
}