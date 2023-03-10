export const useLogout = () => {
  useCookie('access_token').value = ''
  useCookie('authCode').value = ''
  return useRouter().push('/login')
}