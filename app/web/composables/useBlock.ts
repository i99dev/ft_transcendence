export const useBlock = () => {
    let blockList = useState<UserGetDto[]>('blockList', () => [])

    const addUserToBlockList = async (user: UserGetDto) => {
        blockList.value.push(user)
        useBlockUser(user.login)
    }

    const removeUserFromBlockList = async (user: UserGetDto) => {
        blockList.value = blockList.value.filter(u => u.login !== user.login)
        useUnBlockUser(user.login)
    }

    const setBlockList = async (users: UserGetDto[]) => {
        blockList.value = users
    }

    const isBlocked = (user: UserGetDto | undefined) => {
        if (!user) return false
        return blockList.value.some(u => u.login === user.login)
    }

    return { blockList, addUserToBlockList, removeUserFromBlockList, setBlockList, isBlocked }
}

export async function useBlockList(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch(`block/list/me`, {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useBlockUser(login: string): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch(`block/${login}`, {
        method: 'POST',
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export async function useUnBlockUser(login: string): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch(`block/${login}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}
