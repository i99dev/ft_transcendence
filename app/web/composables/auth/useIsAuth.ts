export const useIsAuth = async () => {
  
  return useCookie('access_token').value

  // const { data, error: errorRef } = await useFetch('/users/me', {
  //     baseURL: useRuntimeConfig().API_URL,
  //     headers: {
  //         Authorization: `Bearer ${useCookie('access_token').value}`,
  //     },
  // })
  // return  true
}