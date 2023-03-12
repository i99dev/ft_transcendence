import Header_Cyan from '~~/components/Header_Cyan.vue';

<template>
    <div>
        <!-- <Header_Cyan/> -->
        <Header_Cyan />
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
