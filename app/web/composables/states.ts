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
	const { data, error: errorRef } = await useFetch("https://api.intra.42.fr/oauth/token", {
		method: "POST",
		body: {
			grant_type: "authorization_code",
			client_id: "u-s4t2ud-0790e6eeae1028551e49d7958f62e9e0194a3816c15060dfedd2064583678acb",
			client_secret:"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",
			redirect_uri: "http://localhost:3000/callback",
			code: useCookie('authCode').value,
		},
	});
	const error = errorRef.value as FetchError<any> | null;

	return { data, error };
}
