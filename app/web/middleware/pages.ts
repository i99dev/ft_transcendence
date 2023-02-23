export default defineNuxtRouteMiddleware((to, from) => {
    const isLogin = useIsLogin()
    if (!isLogin) return navigateTo('/login')
})
