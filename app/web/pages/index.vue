<template>
    <div
        id="Home"
        class="flex min-h-screen justify-center overflow-hidden bg-gray-50 py-6 sm:py-12"
    >
        <div class="flex flex-col w-full space-y-6 container">
            <div class="flex flex-row justify-center">
                <UserProfileCardOne class="items-start justify-start xs:w-full xs:mx-4" />
            </div>
            <div class="grid grid-flow-col-dense sm:flex gap-4 w-full justify-center">
                <UserProfileCardState :percentage="90" :color="'#DD9933'" chartKey="One" />
                <UserProfileCardState :percentage="20" :color="'#F87171'" chartKey="Two" />
                <UserProfileCardState :percentage="30" :color="'#F87171'" chartKey="Three" />
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['pages'],
})
</script>
