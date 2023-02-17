// import { redirect } from "next/dist/server/api-utils"

export const useIsLogin = () => { 
    return checkCookies()
}

export const checkCookies = () => {
    const cookie = useCookie('token')
    console.log("Checking Cookies")
    if(cookie.value)
    {
        console.log("Yes Cookies !")
        return true
    }
    else
    {
        console.log("No Cookies :(")
        return false
    }
}

export const useLogout = () => {

	const token = useCookie('token')
	token.value = ''
	const code = useCookie('code')
	code.value = ''
	return navigateTo('/login')
}

export default function useAuthCode() {

	const authCode = useCookie('authCode')
	// const config = useRuntimeConfig()
	async function sendAuthCode() {
		const { data, pending, error, refresh } = await useFetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			body: {
				grant_type: "authorization_code",
				client_id: "u-s4t2ud-0790e6eeae1028551e49d7958f62e9e0194a3816c15060dfedd2064583678acb",
				client_secret:"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",
				redirect_uri: "http://localhost:3000/callback",
				// client_id:config.public.CLIENT_ID,
				// client_secret: config.public.CLIENT_SECRET,
				// redirect_uri: config.public.EDIRECT_URI,
				code: authCode.value,
			},
		});
		return { data }
	}
	return {
		sendAuthCode
	}
}

