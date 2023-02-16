
// import { useStore } from '@nuxtjs/composition-api'

// console.log("from ", from.fullPath);
// console.log("to ", to.fullPath);
// console.log("query");
// console.log(from.query)

// console.log(from.path)

// console.log(from.path.indexOf("?code"))
// console.log(from.path.indexOf('?error'))
export default defineNuxtRouteMiddleware((to, from) => {

	// const {isLogin, setIsLogin} = useIsLogin();
	const isLogin = useIsLogin();
	const isAuthenticated = useIsAuthenticated();
	const authCode = useAuthCode();
	
	
	if (from.query.error == 'access_denied' && from.query.error_description == 'The resource owner or authorization server denied the request.')
	{
		console.log("not authorized");
		isAuthenticated.value = false;
		return navigateTo('/');
	}
	else if (from.query.code)
	{
		authCode.value = from.query.code
		isAuthenticated.value = true;
		console.log("authCode.value");
		console.log(authCode.value);
	}
	else
		navigateTo('/');

	
	/* 
		! this state is assigned in dashboard after extracting the Authcode .. 
		! accessing this page through the browser is available
		! since the state get reset when the page is refreshed
		! the cookies is needed for this to work
	*/
	// else if (isAuthenticated.value == false) 
	// 	return navigateTo('/');
	isLogin.value = true;
});
