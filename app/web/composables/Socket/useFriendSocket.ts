import { Socket, io } from 'socket.io-client'

export const useFriendSocket = () => {
  const friendSocket = useState<Socket | undefined>('friendSocket', undefined)

  const connectFriendSocket = (): void => {
      friendSocket.value = io(`ws://${useRuntimeConfig().IP}/friend`, {
          withCredentials: true,
          extraHeaders: {
              Authorization: `Bearer ${useCookie('access_token').value}`,
          },
          path: '/socket.io',
      })
  }

  const disconnectFriendSocket = (): void => {
      friendSocket.value?.disconnect()
  }

  const reconnectFriendSocket = (): void => {
      disconnectFriendSocket()
      connectFriendSocket()
  }

  return { friendSocket, connectFriendSocket, disconnectFriendSocket, reconnectFriendSocket }
}