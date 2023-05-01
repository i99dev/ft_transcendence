export async function useMe(): Promise<any> {
    const {
        data,
        error: errorRef,
        refresh,
        pending,
    } = await useFetch('users/me', {
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
        server: false,
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error, refresh, pending }
}

export const useUserInfo = () => {
    const user_info = useState<any | null>('user_info', () => {})

    const setUserInfo = (user: any) => {
        user_info.value = user
    }

    const removeUserInfo = () => {
        user_info.value = null
    }

    const setUserName = (name: string) => {
        user_info.value.username = name
    }
    const setUserAvatar = (avatar: string) => {
        user_info.value.image = avatar
    }
    const setUserTwoFacAuth = (two_fac_auth: boolean) => {
        user_info.value.two_fac_auth = two_fac_auth
    }
    const setFriends = (friends: any) => {
        user_info.value.friends.push(friends)
    }
    const removeFriends = (friends: any) => {
        user_info.value.friends = user_info.value.friends.filter(
            (friend: any) => friend.id !== friends.id,
        )
    }

    return { user_info, setUserInfo, removeUserInfo, setUserName, setUserAvatar, setUserTwoFacAuth, removeFriends }
}

export async function useUpdateUserInfo(): Promise<any> {
    const store = useUserInfo()
    const { login, image, username, two_fac_auth }: any = store.user_info.value
    const { data, error: errorRef } = await useFetch(`users/${login}`, {
        method: 'PATCH',
        body: {
            username,
            image,
            two_fac_auth
        },
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value as FetchError<any> | null
    return { data, error }
}

interface FetchError<T> extends Error {
    status: number
    statusText: string
}
