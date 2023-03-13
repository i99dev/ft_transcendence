<template> 
    <div>
        <Header />
        <slot />
    </div>
</template>

<script setup>
if (typeof window !== 'undefined') {
    if (useIsAuth()) {
        const { data : user, error } = await useGetMe()
    }
}
</script>
