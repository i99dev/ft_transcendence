export async function useLogin(code: string): Promise<any> {
  let status = 200
  const { data, error: errorRef } = await useFetch('auth/login', {
      onResponse({ response }) {
          status = response.status
      },
      method: 'POST',
      body: {
          code: code,
      },
      baseURL: useRuntimeConfig().API_URL,
  })
  const error = errorRef.value as FetchError<any> | null
  return { data, error, status }
}