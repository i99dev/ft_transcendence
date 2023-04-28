export const useAchievement = () => {
    const achievement = useState<any | null>('achievement', () => {})

    const setAchievement = (ach: any) => {
        achievement.value = ach
    }

    return { achievement, setAchievement }
}