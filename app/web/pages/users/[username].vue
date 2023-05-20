<template>
    <div class="">
        <Home :username="route.params.username"/>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const user = await getUserbyUserName(route.params.username?.toString())
if (!user) throw createError({ statusCode: 404, statusMessage: `User Not Found: ${useRoute().params.username?.toString()}`, fatal: true })
</script>
