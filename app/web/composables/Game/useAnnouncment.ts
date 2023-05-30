
export function useGameAnnouncment() {
    const showAnnouncment = useState<boolean>('showAnnouncment', () => false)
    const announcmentMessage = useState<string>('announcmentMessage', () => '')

    const resetAnnouncment = () => {
        showAnnouncment.value = false
        announcmentMessage.value = ''
    }

    return { showAnnouncment, announcmentMessage, resetAnnouncment }
}