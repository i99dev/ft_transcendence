<template>
    <div
        id="Home"
        class="flex min-h-screen justify-center overflow-hidden bg-gray-50 py-6 sm:py-12 mobile:p-2"
    >
        <div class="flex flex-col w-full space-y-6 items-center">
            <div class="flex flex-row justify-center">
                <UserProfileCardOne class="items-start justify-start xs:w-full xs:mx-4" />
            </div>
            <div class="grid grid-flow-col-dense sm:flex gap-4 w-full justify-center">
                <UserProfileCardState
                    :percentage="90"
                    :color="'#DD9933'"
                    chartKey="One"
                    title="Win Streak"
                />
                <UserProfileCardState
                    :percentage="20"
                    :color="'#F87171'"
                    chartKey="Two"
                    title="Win"
                />
                <UserProfileCardState
                    :percentage="30"
                    :color="'#F87171'"
                    chartKey="Three"
                    title="loses"
                />
            </div>

            <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between w-full">
                <div
                    class="w-full sm:w-1/4 rounded-t sm:rounded-l sm:rounded-t-none shadow bg-white dark:bg-gray-800"
                ></div>
                <div class="w-full sm:w-1/2 shadow bg-white dark:bg-gray-800">
                    <DashTab />
                </div>
                <div
                    class="w-full sm:w-1/4 rounded-b sm:rounded-b-none shadow bg-white dark:bg-gray-800"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['pages'],
})
</script>
