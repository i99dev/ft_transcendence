export default defineNuxtRouteMiddleware(async (to, from) => {
    if (typeof window !== 'undefined') {
        if (!from.query.code) return useRouter().push('/login')
        const { data, error } = await useLogin(from.query.code.toString())
        console.log(data, error)
        if (data.value.access_token) {
            useCookie('access_token').value = data.value.access_token
            if (typeof window !== 'undefined') {
                window.location.href = '/'
            }
        } else {
            useRouter().push('/login')
        }
    }
})
