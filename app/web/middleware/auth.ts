export default defineNuxtRouteMiddleware((to, from) => {

	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		return navigateTo('/login');
	}
	else if (from.query.code)
	{
		/*  get token from backend */
        // Token = post_req(form.query.code)
        //create Cookie with token
		const AuthCode = useCookie('authCode')
		AuthCode.value = from.query.code
		
		const token = useCookie('token')
		token.value = "Token123999999"
		console.log(token.value);
        /* If any error -> redirect to login, else redirect to root or "From" */
		return navigateTo('/');
	}
	else
		return navigateTo('/login');

});
