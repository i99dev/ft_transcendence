// import { redirect } from "next/dist/server/api-utils"

import { NextApiResponse } from "next"

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


interface FetchError<T> extends Error {
	status: number;
	statusText: string;
}

interface AuthResponse {
	data: any;
	error: FetchError<any> | null;
}


export async function sendAuthCode(): Promise<AuthResponse> {
	const runtimeConfig = useRuntimeConfig()
	const { data, error: errorRef } = await useFetch("https://api.intra.42.fr/oauth/token", {
		method: "POST",
		body: {
			grant_type: "authorization_code",
			client_id: runtimeConfig.CLIENT_ID,
			client_secret:runtimeConfig.CLIENT_SECRET,
			redirect_uri: runtimeConfig.redirect_uri,
			code: useCookie('authCode').value,
		},
	});
	const error = errorRef.value as FetchError<any> | null;

	return { data, error };
}
