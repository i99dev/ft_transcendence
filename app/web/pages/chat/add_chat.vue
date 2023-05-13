<template>
    <div class="bg-gray-200 py-10 p-2 max-h-screen h-screen">
        <form id="form" v-on:submit.prevent>
            <div class="container mx-auto shadow bg-white dark:bg-gray-800 rounded p-2">
                <div class="w-11/12 mx-auto pb-3">
                    <div class="xl:w-9/12 mx-auto xl:mx-0">
                        <div class="mt-16 flex flex-col xl:w-2/6 lg:w-2/6 w-full">
                            <label
                                for="username"
                                class="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100"
                                >Room Name</label
                            >
                            <input
                                type="text"
                                id="username"
                                name="username"
                                class="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 text-gray-800 bg-transparent dark:text-gray-100"
                                placeholder="Our Game"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="w-full py-4 sm:px-12 px-4 bg-gray-100 dark:bg-gray-700 flex justify-end"
                >
                    <button
                        class="text-sm focus:outline-none text-white dark:text-gray-400 border border-gray-300 dark:hover:border-gray-500 py-2 px-6 mr-4 rounded hover:bg-gray-200 transition duration-150 ease-in-out bg-indigo-500"
                    >
                        Create
                    </button>
                    <button
                        class="bg-red-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm focus:outline-none"
                        type="submit"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'FormCardUserProfile',
    mounted: function () {
        this.submit()
    },
    methods: {
        submit() {
            let form = document.getElementById('form')
            form.addEventListener(
                'submit',
                function () {
                    let elements = form.elements
                    let payload = {}
                    for (let i = 0; i < elements.length; i++) {
                        let item = elements.item(i)
                        switch (item.type) {
                            case 'checkbox':
                                payload[item.name] = item.checked
                                break
                            case 'submit':
                                break
                            default:
                                payload[item.name] = item.value
                                break
                        }
                    }
                    // Place your API call here to submit your payload.
                },
                true,
            )
        },
    },
}
</script>
