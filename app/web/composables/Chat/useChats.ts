export const useChats = () => {
  const chats = useState<any | null>('chats', () => null)
  const searchedGroupChats = useState<(GroupChat[] & DirectChat[]) | null>(
      'SearchedGroupChats',
      () => null,
  )

  const setChats = (chatList: (GroupChat[] & DirectChat[]) | null) => {
      chats.value = chatList
  }

  const setSearchedGroupChats = async (name: string) => {
      if (!name) {
          setChats([])
          return
      }
      const { data } = await useGroupChatSearch(name)
      setChats(data.value)
  }

  return { chats, searchedGroupChats, setSearchedGroupChats, setChats }
}