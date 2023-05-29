export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsAuth()
    if (!isLogin) return navigateTo('/login')
    if (to.path === '/' && from.path !== '/') useEmit('soundTrack', 'play')
})
