interface Friend{
    id: number
    name: string
    photo: string
}


export  const useFriends =  async () => {

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

const setFriendsModalOpen = (open: boolean) => {
    friends_info.value.friendsModalOpen = open
}

const add_friend = async (friend: string) => {
    friends_info.value.friends.push({
        friend,
    })
}

return { friends_info, setFriendsModalOpen, add_friend }
}
