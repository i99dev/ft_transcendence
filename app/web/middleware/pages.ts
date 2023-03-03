export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsLogin()
    if (!isLogin) return navigateTo('/login')
})
