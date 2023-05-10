export default defineNuxtRouteMiddleware(async (to, from) => {
    return await useAuth(from)
})
