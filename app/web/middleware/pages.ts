export default defineNuxtRouteMiddleware((to, from) => {

	console.log("In Pages MiddleWare")
	const isLogin = useIsLogin();

	console.log(isLogin)
    
	if(isLogin === true)
	{
		console.log("Token Found In Cookies!")
		// return navigateTo(from)
	}
	else{
		console.log("No Token Found in Cookies!")
		return navigateTo('/login')
	}
});