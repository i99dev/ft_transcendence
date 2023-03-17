import { defineStore } from 'pinia'

export const useUserData = defineStore('useUserData', {
    state: () => ({
        userData: {},
    }),

    getters: {
        user_info: state => state.userData,
    },

    actions: {
        async getUserData() {
            const response = useFetch('users/me', {
                baseURL: useRuntimeConfig().API_URL,
                headers: {
                    Authorization: `Bearer ${useCookie('access_token').value}`,
                },
                server: false,
                lazy: true,
                key: 'meUser',
            })
            this.userData = response.data
        },
    },
})
