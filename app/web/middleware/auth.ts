
// import { useStore } from '@nuxtjs/composition-api'

export default defineNuxtRouteMiddleware((to, from) => {

	// const {isLogin, setIsLogin} = useIsLogin();
	const isLogin = useIsLogin();
	const isAuthenticated = useIsAuthenticated();
	console.log("from ", from.fullPath);
	console.log("to ", to.fullPath);
	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		isAuthenticated.value = false;
		return navigateTo('/');
	}
	isLogin.value = true;
});
