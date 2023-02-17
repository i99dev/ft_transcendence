import next from "next";
import useAuthCode from "~~/composables/states";



export default defineNuxtRouteMiddleware((to, from) => {

	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		return navigateTo('/login');
	}
	else if (from.query.code)
	{
		const authCode = useCookie('authCode')
		const token = useCookie('token')
		authCode.value = from.query.code
		const {sendAuthCode} = useAuthCode();
		sendAuthCode()
		.then((res) => {
			console.log("success");
			console.log("res: ", res.data.value.access_token);
			token.value = res.data.value.access_token
			console.log("token: ", token.value);
			return navigateTo('/')
		}).catch((err) => {
			console.log("HHHHHEEREEEE");
			console.log("Error");
			return navigateTo('/login')
		});
	}
	else
		return navigateTo('/login');

});
