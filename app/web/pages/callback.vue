<template>
    <div>
        <h1>Callback</h1>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['auth'],
})

const query = useRoute().query
const { data, error } = await sendAuthCode(query.code)
if (data.value.access_token) {
    const usetoken = useCookie('access_token')
    usetoken.value = data.value.access_token
    useRouter().push('/')
} else {
    useRouter().push('/login')
}
</script>
