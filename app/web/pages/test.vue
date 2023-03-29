<template>
    <div>
        <button @click="getMatchHistory">My Match History</button>
    </div>
    <div>
        <button @click="getVictories">victories</button>
    </div>
</template>

<script setup>
const getMatchHistory = async () => {
    const api = useRuntimeConfig().API_URL
    const playerId = 'oal-tena' // Replace with actual player ID
    const { data, error: errorRef } = await useFetch(`/match-history/${playerId}`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value
    if (error) {
        console.error('Failed to get match history:', error)
    } else {
        console.log('Match history:', data.value)
    }
}

const getVictories = async () => {
    const api = useRuntimeConfig().API_URL
    const playerId = 'oal-tena' // Replace with actual player ID
    const { data, error: errorRef } = await useFetch(`/match-history/${playerId}?winning=true&losing=false`, {
        method: 'GET',
        baseURL: api,
        headers: {
            Authorization: `Bearer ${useCookie('access_token').value}`,
        },
    })
    const error = errorRef.value
    if (error) {
        console.error('Failed to get match history:', error)
    } else {
        console.log('Victories:', data.value)
    }
}
</script>
