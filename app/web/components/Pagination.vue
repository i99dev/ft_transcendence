<template>
    <div
        class="w-full items-center bg-background border-1 border-white px-4 py-3 sm:px-6 rounded m-2 shadow-sm p-2"
    >
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-white">
                    <span class="font-medium"> {{ currentPage }}</span>
                    of
                    <span class="font-medium"> {{ pageNumber }} </span>
                    pages
                </p>
            </div>

            <div>
                <nav
                    class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                >
                    <button
                        @click=" handlePagination(currentPage - 1)"
                        type="button"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-white ring-1 ring-inset ring-secondary hover:bg-primary smooth-transition focus:z-20 focus:outline-offset-0"
                    >
                        <span class="sr-only">Previous</span>
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    <div
                        aria-current="page"
                        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 smooth-transition z-10 bg-tertiary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        {{ currentPage }}
                    </div>

                    <button
                        @click=" handlePagination(currentPage + 1)"
                        type="button"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-white ring-1 ring-inset ring-secondary hover:bg-primary smooth-transition focus:z-20 focus:outline-offset-0"
                    >
                        <span class="sr-only">Next</span>
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps({
    url: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['page'])
const isPage = ref(new Map<number, boolean>())

const pageNumber = ref(0)

const currentPage = ref(1)

const handlePagination = async (page: number) => {
    if (page < 1 || page > pageNumber.value) return
    for (const key of isPage.value?.keys()) isPage.value?.set(key, false)
    isPage.value?.set(page, true)
    currentPage.value = page
    emit('page', currentPage.value)
}

onMounted(async () => {
    const totalPages = await getTotalPages()
    if (totalPages) pageNumber.value = totalPages
    for (let i = 1; i <= pageNumber.value; i++) isPage.value?.set(i, false)
    isPage.value?.set(1, true)
})

const getTotalPages = async () => {
    const { data } = await useFetch<number>(`${props.url}`, {
        method: 'GET',
        baseURL: useRuntimeConfig().API_URL,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    return data.value
}
</script>
