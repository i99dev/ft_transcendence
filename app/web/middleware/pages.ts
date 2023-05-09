export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsAuth()
    if (!isLogin) return navigateTo('/login')
    // else if ((from.path === '/login' || from.path === '/login/confirm')) return navigateTo('/')
})
