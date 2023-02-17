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

	const authCode = useCookie('authCode');
	const token = useCookie('token');
	const  config  = useRuntimeConfig();
	config.public.CLIENT_ID

	async function sendAuthCode() {
		const { data, pending, error, refresh } = await useFetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			body: {
				grant_type: "authorization_code",
				client_id:config.public.CLIENT_ID,
				client_secret: config.public.CLIENT_SECRET,
				redirect_uri: config.public.EDIRECT_URI,
				code: authCode.value,
			},
		})
		if (data) {
			token.value = data.value.access_token
		}
	}
	return {
		sendAuthCode
	  }
}
