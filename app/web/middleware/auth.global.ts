
export default defineNuxtRouteMiddleware((to, from) => {

	// console.log("Middleware: to rseponse ", to);
	// console.log("Middleware: from response ", from);
	console.log("from ", from.fullPath);
	console.log("to ", to.fullPath);
	// if (from.fullPath == '/login_new_user?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request.')
	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		if (to.fullPath == '/login_new_user?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request.')
			return navigateTo('/');
		return navigateTo('/login_new_user');
	}
	// console.log("bye");
});
