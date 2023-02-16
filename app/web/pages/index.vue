<template> 
	{{ isLogin }}
	<login v-if="!isLogin"/>

</template>

<script setup>

const isLogin = useIsLogin()
// const {isLogin, setIsLogin} = useIsLogin()



</script>
