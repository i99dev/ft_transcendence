<template>
    <div style="height: 90vh;" class="centered">
        <div class="bg-background_light centered mobile:flex-col p-10 w-1/2 rounded-2xl relative">
            <img
                src="https://media.tenor.com/mpRJETAa-WwAAAAC/chopper-tony-chopper.gif"
                class="w-1/3 w-n mobile:h-1/3 aspect-square object-cover rounded-full"
            />
            <div
                class="centered flex-col text-center text-white w-2/3 mobile:h-2/3"
            >
                <h1 class="mt-6 font-bold tracking-tight text-accent lg:text-9xl text-5xl">
                    {{ error.statusCode }}
                </h1>
                <h2 class="m-5 w-full text-lg h-1/2 max-h-28 text-ellipsis overflow-hidden text-white">
                    {{ error.statusMessage }}
                </h2>
                <button
                    @click="handleError"
                    class="rounded-md capitalize bg-primary px-3 py-2 m-2 text-xl font-semibold text-white shadow-sm shadow-white hover:scale-125 smooth-transition"
                >
                    home
                </button>
            </div>  
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps(['error'])

const handleError = () => clearError({ redirect: '/' })
</script>
