<template>
    <div>
        <h1>Callback</h1>
    </div>
</template>

<script setup>
definePageMeta({
    // middleware: ['auth'],
})

console.log('callback')
const query = useRoute().query
const { data, error } = await sendAuthCode(query.code)
console.log(data)
console.log(useRuntimeConfig().API_URL)
if (data.value.access_token) {
    const usetoken = useCookie('access_token')
    console.log(`data.value.access_token: ${data.value.access_token}`)
    usetoken.value = data.value.access_token
    if (typeof window !== 'undefined') {
        window.location.href = '/'
    }
} else {
    console.log('access_token not found')
    useRouter().push('/login')
}
</script>
