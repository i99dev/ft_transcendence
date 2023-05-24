export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsAuth()
    if (!isLogin) return navigateTo('/login')
    if (from.path !== '/' && to.path === '/')
        useSound().play('login')
})
