<script setup>
const { data, error, pending, refresh, execute } = await fetchUser()
</script>

<template>
    <div>
        <!-- loading -->
        <div v-if="pending">Loading...</div>
        <!-- error -->
        <div v-if="error">Error: {{ error.message }}</div>
        <!-- success -->
        <div v-if="data">
            <Header :user="data" />
            <slot />
        </div>
    </div>
</template>
