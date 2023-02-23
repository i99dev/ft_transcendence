import { sendAuthCode } from '~~/composables/states'

export default defineNuxtRouteMiddleware((to, from) => {
    const isLogin = useAuth().value
    if (isLogin) return useRouter().push('/')
})
