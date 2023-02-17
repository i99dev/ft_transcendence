import { sendAuthCode } from "~~/composables/states";

export default defineNuxtRouteMiddleware((to, from) => {

	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		return navigateTo('/login');
	}
	else if (from.query.code)
	{
		useCookie('authCode').value = from.query.code.toString()
		sendAuthCode()
		.then((res) => {
			console.log("success");
			useCookie('token').value = res.data.value.access_token
			navigateTo('/')
			return ;
		}).catch((err) => {
			console.log("Error");
			console.log(err);
			navigateTo('/login')
			return ;
		});
	}
	else
		return navigateTo('/login');

});
