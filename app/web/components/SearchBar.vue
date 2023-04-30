<template>
    <div class="z-50 relative mx-auto">
        <div class="bg-white w-30 h-11 rounded-xl mb-3 shadow-lg p-2">
            <input
                v-model="searchInput"
                @keyup.enter="$emit('userInput', searchInput)"
                @input="onInputChange"
                type="text"
                placeholder="Search"
                class="w-full h-full text-2xl rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>

        <!-- suggestions -->
        <div
            v-if="showSuggestions"
            class="bg-white w-full rounded-xl shadow-xl overflow-hidden p-1"
        >
            <!-- items -->
            <div
                v-for="user in users" :key="user" class="w-full flex p-3 pl-4 items-center hover:bg-gray-300 rounded-lg cursor-pointer"
            >
                <div class="mr-4">
                    <div class="h-9 w-9 rounded-sm flex items-center justify-center text-3xl">
                        <img :src="user.image" />
                    </div>
                </div>
                <div>
                    <div class="font-bold text-lg">UserName: {{ user.username }} </div>
                    <div class="text-xs text-gray-500">
                        <span class="mr-2">Ladder: {{ user.ladder }} </span>
                        <span class="mr-2">Name: {{ user.first_name }} </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SearchUserNames } from '../composables/useUsers'

const searchInput = ref('')

const users = ref([] as any[])

const showSuggestions = ref(false)

const debounce = (func: (...args: any[]) => any, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
            timeoutId = null
        }, delay)
    }
}

const onInputChange = () => {
    console.log('oninp', searchInput.value)
    debounce(async () => {
        console.log('debounce', searchInput.value)
        const data = await SearchUserNames(searchInput.value)
        console.log('data', data, data?.length)
		showSuggestions.value = (data && data?.length > 0) ? true : false
		users.value = data ? data : []
    }, 500)()
}
</script>
