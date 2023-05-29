export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsAuth()
    if (!isLogin) return navigateTo('/login')
})
