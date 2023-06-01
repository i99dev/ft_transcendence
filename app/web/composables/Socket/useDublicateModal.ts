export function useDublicateModal() {
    const showDublicateModal = useState<boolean>('showDublicateModal', () => false)
    const { gameSocket } = useGameSocket()
    const isClientConnected = () => {
        return gameSocket.value?.connected
    }

    return { showDublicateModal, isClientConnected }
}
