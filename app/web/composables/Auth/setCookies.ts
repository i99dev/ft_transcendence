export const setCookies = (tokenInfo: AccessTokenDto) => {
  useCookie('access_token').value = tokenInfo.access_token
  useCookie('created_at').value = tokenInfo.created_at
  useCookie('expires_at').value = tokenInfo.expires_at
}