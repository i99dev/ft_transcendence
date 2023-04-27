<template>
    <div class="flex min-h-screen flex-col space-y-1 overflow-hidden bg-gray-100 p-2 py-6 sm:py-12">
        <div class="pb-2">
            <button class="rounded bg-blue-500 p-2 font-normal text-white">+ Create Room</button>
        </div>
        <div class="rounded bg-white p-2">
            <div class="flex flex-row justify-between">
                <div class="flex flex-row items-center ps-5">
                    <div class="text-lg font-bold leading-normal">Rooms</div>
                    <div class="flex space-x-3 ps-20">
                        <div>Users</div>
                    </div>
                </div>

                <div class="pe-8">Role</div>
            </div>
            <div class="space-y-1 rounded-md bg-gray-100 p-2">
                <div class="border- rounded bg-white py-2 shadow">
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row items-center ps-5">
                            <img src="" alt="" />
                            <div class="cursor-pointer text-lg font-medium underline">
                                <div class="flex flex-row truncate">
                                    <span>#</span>
                                    <p>Our Game</p>
                                </div>
                            </div>
                            <div class="flex space-x-3 ps-10">
                                <div
                                    class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-xs font-semibold text-white"
                                >
                                    15
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center pe-5">
                            <div class="justify-center text-xs">privet</div>
                        </div>
                    </div>
                </div>
                <div class="border- rounded bg-white py-2 shadow">
                    <div class="flex flex-row justify-between">
                        <div class="flex flex-row items-center ps-5">
                            <img src="" alt="" />
                            <div class="cursor-pointer text-lg font-medium underline">
                                <div class="flex flex-row truncate">
                                    <span>#</span>
                                    <p>Our Game</p>
                                </div>
                            </div>
                            <div class="flex space-x-3 ps-10">
                                <div
                                    class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-xs font-semibold text-white"
                                >
                                    15
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center pe-5">
                            <div class="justify-center text-xs">privet</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>
