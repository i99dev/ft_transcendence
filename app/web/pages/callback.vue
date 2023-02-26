<template>
    <div>
        <h1>Callback</h1>
    </div>
</template>

<script setup>
definePageMeta({
    // middleware: ['auth'],
})

const query = useRoute().query
const { data, error } = await sendAuthCode(query.code)
console.log(data)
console.log(useRuntimeConfig().API_URL)
if (data.value.access_token) {
    const usetoken = useCookie('access_token')
    usetoken.value = data.value.access_token
    if (typeof window !== 'undefined') {
        window.location.href = '/'
    }
} else {
    useRouter().push('/login')
}
</script>
