<template> 
	<div>
	welocome to dashboard
	{{ isLogin }}
	</div>
</template>

<script setup>
definePageMeta({
	middleware: ["auth"]
	// or middleware: 'auth'
})

const isLogin = useIsLogin()
const authCode = useAuthCode()
const isAuth = useIsAuthenticated()

const { route } = getCurrentInstance().proxy

onMounted(() => {
	console.log(useRoute().query.code)
	if (useRoute().query.code) {
		isAuth.value = true
		navigateTo('/dashboard')
	}
	authCode.value = useRoute().query.code
	console.log("authCode.value :")
	console.log(authCode.value)
})
// const {isLogin, setIsLogin} = useIsLogin()

</script>