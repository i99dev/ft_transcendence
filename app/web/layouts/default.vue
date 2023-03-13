<template> 
    <div>
        <Header />
        <slot />
    </div>
</template>

<script setup>
if (typeof window !== 'undefined') {
    const { data, error } = await fetchUser()
    const user = useAuth()
    user.value = data.value
}
</script>
