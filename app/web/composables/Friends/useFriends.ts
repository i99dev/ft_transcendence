
import { Socket } from 'socket.io-client'

const nuxtApp = useNuxtApp()
export const useFriends = async () => {
    const notifications = useState<any | null>('notifications', () => {
        return []
    })

    const socket = ref(nuxtApp.friendsSocket as Socket)
    const { data } = await useFetch<UserGetDto[]>("/users/me/friends",
        {
            method: "GET",
            baseURL: useRuntimeConfig().API_URL,
            headers: {
                Authorization: `Bearer ${useCookie('access_token').value}`,
            },
        }
    )

    console.log("FRIENDS =>>>> ||", data.value, "||")
    const friends_info = useState<any | null>('friends_info', () => {
        return {
            friendsModalOpen: false,
            friends: data.value?.map(friend => {
                return {
                    id: friend.id,
                    name: friend.login,
                    photo: friend.image
                }
            })
        }
    })

    const setupSocketHandlers = () => {
        console.log("Setup Socket Handlers!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        socket.value.on('notification', (payload) => {
            notifications.value.push(payload)
        })

        socket.value.on('friends-list', (payload) => {
            console.log("freind Listtttt", payload)
            friends_info.value.friends = payload.map((friend: UserGetDto) => {
                return {
                    id: friend.id,
                    name: friend.login,
                    photo: friend.image
                }
            })
        })
    }

    const setFriendsModalOpen = (open: boolean) => {
        friends_info.value.friendsModalOpen = open
    }

    const addFriend = (friend: string) => {
        socket.value.emit("add-friend", { friend_login: friend })
    }

    const removeFriend = (friend: string) => {
        socket.value.emit('delete-friend', { friend_login: friend })
    }

    return { friends_info, setFriendsModalOpen, addFriend, setupSocketHandlers, notifications, removeFriend }
}
