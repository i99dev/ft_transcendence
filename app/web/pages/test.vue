<template>
	<div>
		<div>
			<button @click="getMatchHistory">My Match History</button>
		</div>
		<div>
			<button @click="getVictories">victories</button>
		</div>
		<div>
			<button @click="getDefeats">Defeats</button>
		</div>
		<div>
			<button @click="getHighScore">High Scores</button>
		</div>
		<div>
			<button @click="getLowScore">Low Scores</button>
		</div>
	</div>
</template>

<script setup>
const getMatchHistory = async () => {
    const api = useRuntimeConfig().API_URL
    const { data, error: errorRef } = await useFetch(`/match-history`, {
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
    const { data, error: errorRef } = await useFetch(`/match-history/result?winning=true&losing=false`, {
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

const getDefeats = async () => {
    const api = useRuntimeConfig().API_URL
    const { data, error: errorRef } = await useFetch(`/match-history/result?winning=false&losing=true`, {
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
        console.log('Defeats:', data.value)
    }
}

const getLowScore = async () => {
    const api = useRuntimeConfig().API_URL
    const { data, error: errorRef } = await useFetch(`/match-history/score?sort=asc`, {
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
        console.log('Defeats:', data.value)
    }
}

const getHighScore = async () => {
    const api = useRuntimeConfig().API_URL
    const { data, error: errorRef } = await useFetch(`/match-history/score?sort=desc`, {
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
        console.log('Defeats:', data.value)
    }
}

</script>
