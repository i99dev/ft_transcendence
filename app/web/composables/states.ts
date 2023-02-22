// import { redirect } from "next/dist/server/api-utils"

import { NextApiResponse } from "next"


export const useProfileAvatar = () => useState<string>('ProfileAvatar', () => 'https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_6-1024.png')

export const useNickName = () => useState<string>('NickName', () => 'NickName')

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


export async function sendAuthCode(code:string): Promise<any> {
	const runtimeConfig = useRuntimeConfig()
	console.log("Sending Auth Code",code)
	const { data, error: errorRef } = await useFetch("http://localhost:8000/api/auth", {
		method: "POST",
		body: {
			// grant_type: "authorization_code",
			// client_id: runtimeConfig.CLIENT_ID,
			// client_secret:runtimeConfig.CLIENT_SECRET,
			// redirect_uri: "http://localhost:3000/callback",
			code: code,
		},
	});
	
	const error = errorRef.value as FetchError<any> | null;
	return { data, error };
}

export const useAuth = () => {

}