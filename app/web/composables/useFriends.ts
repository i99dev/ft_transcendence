export const useFriends = () => {
    const friends_info = useState<any | null>('friends_info', () => {
        return {
            friendsModalOpen: false,
            friends: [
                {
                    id: 1,
                    name: 'John',
                    photo: 'https://www.w3schools.com/howto/img_avatar.png',
                },
            ],
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
