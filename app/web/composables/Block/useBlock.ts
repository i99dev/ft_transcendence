export const useBlock = () => {
    let blockList = useState<UserGetDto[]>('blockList', () => [])

    const addUserToBlockList = async (user: UserGetDto) => {
        blockList.value?.push(user)
        useBlockUser(user.login)
    }

    const removeUserFromBlockList = async (user: UserGetDto) => {
        blockList.value = blockList.value?.filter(u => u.login !== user.login)
        useUnBlockUser(user.login)
    }

    const setBlockList = async (users: UserGetDto[]) => {
        blockList.value = users
    }

    const isBlocked = (user: UserGetDto | undefined) => {
        if (!user) return false
        return blockList.value?.some(u => u.login === user.login)
    }

    return { blockList, addUserToBlockList, removeUserFromBlockList, setBlockList, isBlocked }
}
