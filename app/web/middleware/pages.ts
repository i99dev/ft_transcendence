export default defineNuxtRouteMiddleware(async (to, from) => {
    const isLogin = await useIsAuth()
    if (!isLogin) return navigateTo('/login')
    console.log('mm', to.path, from.path)
    if (to.path === '/' && from.path === '/callback') useSound().play('login')
})
