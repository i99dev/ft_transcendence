<template>
    <div class="z-0 relative">
        <div class="bg-white w-30 h-11 rounded-xl mb-3 shadow-sm p-2">
            <input
                v-model="searchInput"
                @keyup.enter="$emit('userInput', searchInput)"
                @input="onInputChange"
                @focus="showSuggestions = true"
                @blur="hideSuggestions"
                type="text"
                placeholder="Search"
                class="w-full h-full text-2xl rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>

        <!-- suggestions -->
        <div v-if="showSuggestions">
            <div class="bg-white w-full rounded-xl shadow-xl overflow-hidden p-1">
                <!-- items -->
                <div v-for="user in users" :key="user">
                    <div
                        @click="$emit('userInput', user.username)"
                        class="w-full flex p-3 pl-4 items-center hover:bg-gray-300 rounded-lg cursor-pointer"
                    >
                        <div class="mr-4">
                            <div
                                class="h-9 w-9 rounded-sm flex items-center justify-center text-3xl"
                            >
                                <img :src="user.image" />
                            </div>
                        </div>
                        <div>
                            <div class="font-bold text-lg">{{ user.username }}</div>
                            <div class="text-xs text-gray-500">
                                <span class="mr-2">Ladder: {{ getLadderRank(user.ladder) }} </span>
                                <span class="mr-2">Name: {{ user.first_name }} </span>
                            </div>
                        </div>
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

const hideSuggestions = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

const getLadderRank = (ladder: number) => {
    switch (ladder) {
        case 1:
            return 'Kaizoku Ou'
        case 2:
            return 'Yonkou'
        case 3:
            return 'Shichibukai'
        case 4:
            return 'Super Rookie'
        case 5:
            return 'Kaizoku'
        case 6:
            return 'Capin Boy'
    }
}

const onInputChange = () => {
    debounce(async () => {
        if (!searchInput.value) return (showSuggestions.value = false)
        const data = await SearchUserNames(searchInput.value)
        showSuggestions.value = data && data?.length > 0 ? true : false
        users.value = data ? data : []
        if (users.value?.length > 10) users.value = users.value?.slice(0, 10)
    }, 500)()
}
</script>
