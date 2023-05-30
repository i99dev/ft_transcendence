export const useGroupChatSearching = () => {
  const groupChatSearching = useState<boolean>('group_chat_search', () => false)

  const setGroupChatSearching = async (status: boolean) => {
      groupChatSearching.value = status
  }

  return { groupChatSearching, setGroupChatSearching }
}