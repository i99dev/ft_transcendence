export function useGameSound(playSoundCallback: (sound: string) => void) {
  const { gameSocket } = useGameSocket()

  gameSocket.value?.on('play-sound', (payload: string) => {
      playSoundCallback(payload)
  })

  return {}
}