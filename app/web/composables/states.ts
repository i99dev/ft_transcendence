export const useIsLogin = () => { 
    return checkCookies()
}

export const checkCookies = () => {
    const cookie = useCookie('token')
    console.log("Checking Cookies")
    if(cookie.value)
    {
        console.log("Yes Cookies !")
        return true
    }
    else
    {
        console.log("No Cookies :(")
        return false
    }
}

