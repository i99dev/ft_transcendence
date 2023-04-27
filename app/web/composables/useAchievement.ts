export const useAchievement = () => {
    const acheivement = useState<any | null>('acheivement', () => {})

    const setAchievement = (ach: any) => {
        acheivement.value = ach
    }

    return { acheivement, setAchievement }
}