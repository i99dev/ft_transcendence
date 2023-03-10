<template>
    <nav class="w-full mx-auto bg-cyan-500 shadow border-b-4 border-solid border-cyan-200">
        <div class="container px-6 justify-between h-16 flex items-center lg:items-stretch mx-auto">
            <div class="h-full flex items-center">
                <div class="mr-10 flex items-center">
                    <h3
                        class="text-base text-cyan-100 font-bold tracking-normal leading-tight ml-3 hidden lg:block"
                    >
                        PongPing
                    </h3>
                </div>
                <ul class="pr-12 xl:flex items-center h-full hidden">
                    <li
                        @click="go('/')"
                        class="cursor-pointer h-full flex items-center hover:text-cyan-200 text-sm text-cyan-100 border-sky-100"
                    >
                        Home
                    </li>
                    <li
                        @click="go('play')"
                        class="cursor-pointer h-full flex items-center hover:text-cyan-200 text-sm text-cyan-100 mx-10 tracking-normal"
                    >
                        play
                    </li>
                    <li
                        @click="go('MatchHistory')"
                        class="cursor-pointer h-full flex items-center hover:text-cyan-200 text-sm text-cyan-100 mr-10 tracking-normal"
                    >
                        Match History
                    </li>
                    <li
                        @click="go('Leaderboard')"
                        class="cursor-pointer h-full flex items-center hover:text-cyan-200 text-sm text-cyan-100 tracking-normal"
                    >
                        Leaderboard
                    </li>
                </ul>
            </div>
            <div class="h-full xl:flex items-center justify-end hidden">
                <div class="w-full h-full flex items-center">
                    <div class="w-full h-full flex">
                        <div
                            class="w-32 h-full flex items-center justify-center border-teal-400 border-r text-teal-300 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-bell"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path
                                    d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
                                />
                                <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                            </svg>
                        </div>
                        <div
                            class="w-full flex items-center justify-end relative cursor-pointer"
                            @click="dropdownHandler($event)"
                        >
                            <ul
                                class="p-2 w-40 border-r bg-white absolute rounded left-0 shadow mt-16 top-0 hidden"
                            >
                                <li
                                    @click="toggleProfileWindow"
                                    class="cursor-pointer text-slate-800 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none"
                                >
                                    <div class="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icon-tabler-user"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <circle cx="12" cy="7" r="4" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        </svg>
                                        <span class="ml-2">My Profile</span>
                                    </div>
                                </li>
                                <li
                                    @click="logout"
                                    class="cursor-pointer text-slate-800 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-settings"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                                        />
                                        <path d="M7 12h14l-3 -3m0 6l3 -3" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span class="ml-2">Logout</span>
                                </li>
                            </ul>
                            <img
                                class="rounded h-14 w-14 object-cover"
                                :src="profilePhoto"
                                alt="logo"
                            />
                            <p class="text-sky-100 text-sm ml-2">{{ Nickname }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex items-center xl:hidden">
                <ul
                    class="p-2 border-r bg-sky-100 absolute rounded top-0 left-0 right-0 shadow mt-16 md:mt-16 hidden"
                >
                    <li
                        class="flex md:hidden cursor-pointer text-sky-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none"
                    >
                        <div class="flex items-center">
                            <span @click="go('/')" class="ml-2 font-bold">Home</span>
                        </div>
                    </li>
                    <li
                        class="flex md:hidden flex-col cursor-pointer text-sky-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none justify-center"
                    >
                        <div class="flex items-center">
                            <span @click="go('play')" class="ml-2 font-bold">play</span>
                        </div>
                    </li>
                    <li
                        class="flex md:hidden flex-col cursor-pointer text-sky-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none justify-center"
                    >
                        <div class="flex items-center">
                            <span @click="go('Match History')" class="ml-2 font-bold"
                                >Match History</span
                            >
                        </div>
                    </li>
                    <li
                        class="border-b border-sky-300 md:hidden cursor-pointer text-sky-600 text-sm leading-3 tracking-normal pt-2 pb-4 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none"
                    >
                        <span @click="go('Leaderboard')" class="ml-2 font-bold">Leaderboard</span>
                    </li>

                    <li
                        class="cursor-pointer text-sky-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none"
                    >
                        <div class="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-user"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <circle cx="12" cy="7" r="4" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            </svg>
                            <span @click="toggleProfileWindow" class="ml-2">Profile</span>
                        </div>
                    </li>
                    <li
                        class="cursor-pointer text-sky-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-logout"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path
                                d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                            />
                            <path d="M7 12h14l-3 -3m0 6l3 -3" />
                        </svg>
                        <span @click="logout" class="ml-2">Logout</span>
                    </li>
                </ul>
                <svg
                    @click="MenuHandler($event, true)"
                    aria-haspopup="true"
                    aria-label="Main Menu"
                    xmlns="http://www.w3.org/2000/svg"
                    class="visible xl:hidden icon icon-tabler icon-tabler-menu show-m-menu"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
                <div @click="MenuHandler($event, false)" class="hidden close-m-menu p-1">
                    <svg
                        aria-label="Close"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </div>
            </div>
        </div>
    </nav>
    <div id="pro" v-if="showProfile">
        <Profile @close="hideProfileWindow" />
    </div>
</template>
<script setup>
const { data: user } = await useGetMe()

const profilePhoto = user.value?.image
const Nickname = user.value?.username

const dropdownHandler = event => {
    let single = event.currentTarget.getElementsByTagName('ul')[0]
    single.classList.toggle('hidden')
}
const MenuHandler = (el, val) => {
    let MainList = el.currentTarget.parentElement.getElementsByTagName('ul')[0]
    let closeIcon = el.currentTarget.parentElement.getElementsByClassName('close-m-menu')[0]
    let showIcon = el.currentTarget.parentElement.getElementsByClassName('show-m-menu')[0]
    if (val) {
        MainList.classList.remove('hidden')
        el.currentTarget.classList.add('hidden')
        closeIcon.classList.remove('hidden')
    } else {
        showIcon.classList.remove('hidden')
        MainList.classList.add('hidden')
        el.currentTarget.classList.add('hidden')
    }
}
const showProfile = ref(false)

const logout = () => {
    useLogout()
}

const go = path => {
    hideProfileWindow()
    useRouter().push(path)
}

const toggleProfileWindow = () => {
    showProfile.value = !showProfile.value
}
const hideProfileWindow = () => {
    showProfile.value = false
}
</script>

<style scoped>
#pro {
    display: flex;
    justify-content: center;
    /* margin-top: 100px */
}
</style>
