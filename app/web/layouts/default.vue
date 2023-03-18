<script setup>
const { data, error, pending, refresh, execute } = await useGetMe()
const { user_info, setUserInfo } = useUserInfo()

if (data) {
    await setUserInfo(data.value)
}
</script>

<template>
    <div>
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="data">
            <Header />
            <slot />
        </div>
    </div>
</template>
