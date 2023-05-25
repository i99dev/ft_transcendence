<template>
    <div v-if="useRoute().path !== '/play'" class="sticky flex flex-col top-0 w-full h-10vh mb-5 z-10">
        <button v-click-effect:login="()=>navigateTo('/')" class="justify-self-center self-center w-32 h-1/3 mt-5">
            <LoginLogo :horizontal="true" class="text-2xl" />
        </button>
        <div class="flex justify-center items-start w-full">
            <div class="md:w-1/2 w-3/4">
                <UserProfileList
                    :reset="true"
                    :search="true"
                    @selectUser="navigateTo(`/users/${$event?.username}`)"
                />
            </div>
        </div>
    </div>
</template>
