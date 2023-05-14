
import { Socket } from 'socket.io-client'

const nuxtApp = useNuxtApp()
export const useFriends = async () => {
    const order = ['ONLINE', 'INQUEUE', 'INGAME', 'OFFLINE'];
    const notifications = useState<NotificationDto[] | null>('notifications', () => {
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

    const friends_info = useState<any | null>('friends_info', () => {
        return {
            friendsModalOpen: false,
            friends: data.value?.map(friend => {
                return {
                    id: friend.id,
                    name: friend.login,
                    photo: friend.image,
                    status: friend.status
                }
            })
        }
    })
    const setupSocketHandlers = () => {
        socket.value.on('notification', (payload) => {
            if (!Array.isArray(payload)) {
                payload = [payload];
            }
            payload.forEach((notif: NotificationDto) => {
                if (!notifications.value?.find((currentNotif: NotificationDto) => currentNotif.id === notif.id)) {
                    notifications.value?.push(notif);
                }
            });
        })

        socket.value.on('friends-list', (payload) => {
            friends_info.value.friends = payload.map((friend: UserGetDto) => {
                return {
                    id: friend.id,
                    name: friend.login,
                    photo: friend.image,
                    status: friend.status
                }
            })
            sortFriends()

        })
    }

    const sortFriends = () => {
        friends_info.value.friends.sort((friend1: any, friend2: any) => {
            return order.indexOf(friend1.status) - order.indexOf(friend2.status);
        })
    }

    const setFriendsModalOpen = (open: boolean) => {
        friends_info.value.friendsModalOpen = open
    }

    const addFriend = (friend: string) => {
        socket.value.emit("add-friend", JSON.stringify({ friend_login: friend }))
    }

    const removeFriend = (friend: string) => {
        socket.value.emit('delete-friend', JSON.stringify({ friend_login: friend }))
    }

    sortFriends()

    return { friends_info, setFriendsModalOpen, addFriend, setupSocketHandlers, notifications, removeFriend }
}
