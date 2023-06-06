export const useSearchedGroupChats = () => {
    const searchedGroupChats = useState<(GroupChat & DirectChat) | null>(
        'SearchedGroupChats',
        () => null,
    )

    const setSearchedGroupChats = async (name: string) => {
        const { setChats } = useChats()
        if (!name) {
            setChats([])
            return
        }
        const { data } = await useGroupChatSearch(name)
        setChats(data.value)
    }

    return { searchedGroupChats, setSearchedGroupChats }
}
