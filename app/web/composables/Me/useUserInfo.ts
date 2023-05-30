export const useUserInfo = () => {
  const user_info = useState<any | null>('user_info', () => {})

  const setUserInfo = (user: any) => {
      user_info.value = user
  }

  const setUserStatus = (status: string) => {
      user_info.value.status = status
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

  return {
      user_info,
      setUserInfo,
      removeUserInfo,
      setUserName,
      setUserAvatar,
      setUserTwoFacAuth,
      setFriends,
      removeFriends,
      setUserStatus,
  }
}