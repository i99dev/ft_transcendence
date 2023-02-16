export const useIsLogin = () => useState<boolean>('isLogin', () => false)

export const useIsAuthenticated = () => useState<boolean>('isAuthenticated', () => false)

export const useAuthCode = () => useState<string>('authCode', () => '')
// export const useIsLogin = () => {

// 	const isLogin =  useState<boolean>('isLogin', () => false)
// 	const setIsLogin = (value: boolean) => {
// 		isLogin.value = value 
// 	}
// 	return { isLogin, setIsLogin }

// }
