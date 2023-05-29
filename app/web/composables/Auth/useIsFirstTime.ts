export const useIsFirstTime = () => {
  const isFirstTimeLogin = useState<boolean>('first_time_login', () => false)

  const setIsFirstTimeLogin = (status: boolean) => {
      isFirstTimeLogin.value = status
  }

  return { isFirstTimeLogin, setIsFirstTimeLogin }
}