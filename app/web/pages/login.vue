<template>
    <div
        class="flex h-screen w-full items-center justify-center bg-gray-900 bg-no-repeat"
        style="
            background-image: url('https://d1an7elaqzcblb.cloudfront.net/RSMIG/PROD/eukddc/PACKSHOTS/d5f7084f485e1f652784217487fe278c.jpeg');
            background-size: 100% 100%;
        "
    >
        <div
            class="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8"
        >
            <div class="text-white">
                <div class="mb-8 flex flex-col items-center">
                    <img
                        src="https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_6-1024.png"
                        width="150"
                        alt=""
                        srcset=""
                    />
                    <h1 class="mb-2 text-2xl">Ping Pong</h1>
                </div>
                <form action="#">
                    <div class="mt-8 flex justify-center text-lg text-black">
                        <div
                            class="rounded-3xl bg-gray-90 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600"
                        >
                            <img
                                src="https://signin.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg"
                                v-on:click="go"
                                width="35"
                                height="20"
                                alt="icon"
                            />
                        </div>
                    </div>
                    <!-- <dashboard /> -->
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
/* Anything written in setup will be ran during the creation of the component
   and before mounting it to the main html page. so if isLogin is true, user will
   be redirected to the home page before the component is mounted.
 */

// remove the layout in login page
definePageMeta({
    layout: false,
})

const go = () => {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
        useRuntimeConfig().CLIENT_ID
    }&redirect_uri=${useRuntimeConfig().REDIRECT_URI}&response_type=code`
}
</script>
