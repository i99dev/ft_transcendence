export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsAuth()
    if (!isLogin) return navigateTo('/login')
	if (to.path === '/' && to.query.status === '201' && from.path !== '/callback')
		return navigateTo('/')
})
