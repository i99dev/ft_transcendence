import useAuthCode from "~~/composables/states";

export default defineNuxtRouteMiddleware((to, from) => {

	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		return navigateTo('/login');
	}
	else if (from.query.code)
	{
		useCookie('authCode').value = from.query.code
		const {sendAuthCode} = useAuthCode();
		sendAuthCode()
		.then((res) => {
			console.log("success");
			useCookie('token').value = res.data.value.access_token
			return navigateTo('/')
		}).catch((err) => {
			console.log("Error");
			console.log(err);
			return navigateTo('/login')
		});
	}
	else
		return navigateTo('/login');

});
