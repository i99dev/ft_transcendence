<template>
    <div
        class="flex min-h-screen justify-center mobile:flex-col overflow-hidden bg-gray-50 dark:bg-gray-700 py-6 sm:py-12 mobile:p-2"
    >
        <!-- component -->
        <div style="background-color: #fff" class="sm:mx-32 lg:mx-32 xl:mx-72">
            <div class="flex justify-between container mx-auto">
                <div class="w-full">
                    <div class="mt-4 px-4">
                        <h1 class="font-thinner flex text-4xl pt-10 px-5">Setup Your Profile</h1>

                        <form class="mx-5 my-5">
                            <label
                                class="relative block p-3 border-2 border-black rounded"
                                htmlFor="name"
                            >
                                <span class="text-md font-semibold text-zinc-900" htmlFor="name">
                                    User Name
                                </span>
                                <input
                                    class="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                                    id="name"
                                    type="text"
                                    :placeholder="userData.username"
                                />
                            </label>
                            <div class="shrink-0 mt-10">
                                <img
                                    class="h-20 w-20 object-cover rounded-full"
                                    :src="userData.image"
                                    alt="Current profile photo"
                                />
                            </div>
                            <label class="block pt-2">
                                <span class="sr-only t-2">Choose profile photo</span>
                                <input
                                    type="file"
                                    class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900 file:text-zinc-900 hover:file:bg-blue-300"
                                />
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { user_info, setUserName, setUserAvatar, setUserTwoFacAuth } = useUserInfo()

const userData = computed(() => {
    const { username, image } = user_info.value
    return { username, image }
})


</script>
