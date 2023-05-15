<template>
    <div>
        <div class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50">
            <div
                class="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
            >
                <div
                    class="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24"
                >
                    <div class="mt-4 mr-auto mb-4 ml-auto bg-white max-w-lg">
                        <div class="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                            <!-- component -->

                            <h1 class="font-thinner flex text-4xl pt-10 px-5 py-20">
                                Setup Your Profile
                            </h1>

                            <form class="mx-5 my-5">
                                <label
                                    class="relative block p-3 border-2 border-black rounded"
                                    htmlFor="name"
                                >
                                    <span
                                        class="text-md font-semibold text-zinc-900"
                                        htmlFor="name"
                                    >
                                        User Name
                                    </span>
                                    <input
                                        class="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                                        id="name"
                                        type="text"
                                        :placeholder="userData.username"
                                        v-model="newUsername"
                                    />
                                </label>
                                <div class="mt-10 px-20">
                                    <img
                                        class="h-20 w-20 object-cover rounded-full"
                                        :src="image"
                                        alt="Current profile photo"
                                    />
                                </div>
                                <label class="block pt-2">
                                    <span class="sr-only t-2">Choose profile photo</span>
                                    <input
                                        type="file"
										accept="image/*"
										@change="uploadeImage"
                                        class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900 file:text-zinc-900 hover:file:bg-blue-300"
                                    />
                                </label>
                            </form>
                            <button
                                @click="submitProfile()"
                                class="h-10 mt-20 w-30 text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { user_info, setUserName, setUserAvatar } = useUserInfo()
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close'])
const userData = computed(() => {
	const { username, image, login } = user_info.value
    return { username, image, login }
})

const newUsername = ref('')
const newAvatar = ref(null as any)
const image = ref(userData.value.image)

const uploadeImage = async (event) => {
	const file = event.target.files[0]
	console.log('file', file)
	if (!file) return
	const readData = (f) => 
	new Promise((resolve) => {
		const reader = new FileReader()
		reader.onloadend = (e) => resolve(reader.result)
		newAvatar.value = reader.result
		reader.readAsDataURL(f)
	})
	const data = await readData(file)
	image.value = data
	// console.log('data', data)
}

const submitProfile = async () => {
    if (newUsername.value != '') {
        setUserName(newUsername.value)
        await useUpdateUserInfo()
    }
	if (newAvatar.value != '') {
		await useUplaod(userData.value.login, newAvatar.value)
	}
	console.log('newUsername', newUsername.value)
    emit('close')
	navigateTo('/')
}
</script>
