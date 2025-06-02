import {jwtDecode} from "jwt-decode"
import useFetchApi from "~/composables/useFetchApi"

export interface userData {
    id: string, // Changed from number to string
    email: string,
    name: string,
    role: string,
    created_at: string,
    updated_at: string
}

interface userRegister {
    name: string,
    email: string,
    password: string
}

interface userLogin {
    email: string,
    password: string
}

export default () => {
    useState('loading', () => true)
    const loading = () => useState('loading')
    const accessToken = () => useState('accessToken')
    const userAuth = () => useState('user')
    const isLoggedIn = () => useCookie('isLoggedIn')
    // Add user data cookie - store as string
    const userCookie = () => useCookie('userData', {
        default: () => '',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    const setLoading = (status: boolean) => {
        loading().value = status
    }

    const getIsLoading = () => {
        return loading().value
    }

    const setAccessToken = (token: string | null) => {
        accessToken().value = token
    }

    const getAccessToken = () => {
        return accessToken().value as string
    }

    const setUserAuth = (data: userData | null) => {
        // Set both state and cookie
        userAuth().value = data
        // Store as JSON string in cookie
        userCookie().value = data ? JSON.stringify(data) : ''
    }

    const getUserAuth = () => {
        // Try to get from state first, fallback to cookie
        const stateUser = userAuth().value as userData
        const cookieUserString = userCookie().value as string

        // If state is empty but cookie has data, sync them
        if (!stateUser && cookieUserString) {
            try {
                const cookieUser = JSON.parse(cookieUserString) as userData
                userAuth().value = cookieUser
                return cookieUser
            } catch (error) {
                // Clear invalid cookie
                userCookie().value = ''
                return null
            }
        }

        return stateUser
    }

    // Helper function to safely check login status
    const isUserLoggedIn = () => {
        const cookieValue = isLoggedIn().value
        // Handle string, boolean, null, or undefined values
        return cookieValue === 'true' || String(cookieValue) === 'true'
    }

    // Clear all auth state and cookies
    const clearAuthState = () => {
        isLoggedIn().value = 'false'
        setUserAuth(null)
        setAccessToken(null)

        // Clear any other auth-related cookies if they exist
        const refreshTokenCookie = useCookie('refreshToken')
        if (refreshTokenCookie.value) {
            refreshTokenCookie.value = null
        }
    }

    const register = async (data: userRegister): Promise<{
        statusCode: number,
        message: string
    }> => {
        try {
            const response: any = await useFetchApi('/api/auth/register', {
                method: 'POST',
                body: {
                    name: data.name,
                    email: data.email,
                    password: data.password
                }
            })
            return {
                statusCode: response.statusCode,
                message: response.message ?? "Kesalahan ketika mendaftarkan akun"
            }
        } catch (error: any) {
            return {
                statusCode: error?.data?.statusCode,
                message: error?.data?.message ?? "Gagal mendaftarkan akun"
            }
        }
    }

    const login = async (data: userLogin): Promise<{
        statusCode: number,
        message: string
    }> => {
        try {
            const response: any = await useFetchApi('/api/auth/login', {
                method: 'POST',
                body: {
                    email: data.email,
                    password: data.password
                }
            })

            if (response.statusCode !== 200) {
                return {
                    statusCode: response.statusCode,
                    message: response.message ?? "Kesalahan ketika login"
                }
            }

            // Set access token and user data from response
            setAccessToken(response?.data?.access_token)
            setUserAuth(response?.data?.user) // This will now set both state and cookie
            isLoggedIn().value = 'true'

            return {
                statusCode: response.statusCode,
                message: response.message ?? "Login berhasil"
            }
        } catch (error: any) {
            return {
                statusCode: error?.data?.statusCode,
                message: error?.data?.message ?? "Gagal login"
            }
        }
    }

    const refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response: any = await useFetchApi('/api/auth/refresh', {
                    method: 'POST'
                })

                if (response.statusCode === 200) {
                    setAccessToken(response?.data?.access_token)
                    setUserAuth(response?.data?.user)
                    resolve(true)
                } else {
                    throw new Error(response.message || 'Refresh token failed')
                }
            } catch (error: any) {
                // Only clear auth state if refresh token is actually invalid
                // Don't clear on network errors or temporary failures
                if (error?.data?.statusCode === 401 || error?.data?.statusCode === 403) {
                    clearAuthState()
                }
                reject(error)
            }
        })
    }

    const getMe = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response: any = await useFetchApi('/api/auth/me', {
                    method: 'GET',
                })

                if (response.statusCode === 200) {
                    setUserAuth(response?.data?.user) // This will now set both state and cookie
                    resolve(true)
                } else {
                    throw new Error(response.message || 'Get user data failed')
                }
            } catch (error: any) {
                // Only clear auth state on authentication errors, not network errors
                if (error?.data?.statusCode === 401 || error?.data?.statusCode === 403) {
                    clearAuthState()
                }
                reject(error)
            }
        })
    }

    const reRefreshAccessToken = () => {
        const authToken: string = getAccessToken()

        if (!authToken) {
            return
        }

        try {
            const jwt: any = jwtDecode(authToken)
            const currentTime = Math.floor(Date.now() / 1000)
            const expiresIn = jwt?.exp - currentTime
            const naturalTime = (expiresIn - 10) * 1000

            if (naturalTime <= 0) {
                // If token already expired or very close to expiration
                refreshToken()
                    .then(() => reRefreshAccessToken())
                    .catch((error) => {
                        // Auth state already cleared in refreshToken catch block if needed
                    })
                return
            }

            setTimeout(async () => {
                try {
                    await refreshToken()
                    reRefreshAccessToken()
                } catch (err) {
                    // Auth state already cleared in refreshToken catch block if needed
                }
            }, naturalTime)
        } catch (error) {
            // Clear auth state if token is invalid
            clearAuthState()
        }
    }

    const initAuth = () => {
        return new Promise(async (resolve, reject) => {
            try {
                setLoading(true)

                // Check if user appears to be logged in
                if (!isUserLoggedIn()) {
                    resolve(true) // Don't reject, just skip
                    return
                }

                // Sync user data from cookie to state if needed
                const cookieUserString = userCookie().value as string
                if (cookieUserString && !userAuth().value) {
                    try {
                        const cookieUser = JSON.parse(cookieUserString)
                        userAuth().value = cookieUser
                    } catch (error) {
                        userCookie().value = ''
                    }
                }

                try {
                    // Try to refresh token first
                    await refreshToken()

                    // Setup auto refresh after successful token refresh
                    reRefreshAccessToken()

                    resolve(true)
                } catch (refreshError: any) {

                    // Only clear auth and reject if it's an authentication error
                    if (refreshError?.data?.statusCode === 401 || refreshError?.data?.statusCode === 403) {
                        clearAuthState()
                        reject(refreshError)
                    } else {
                        // For network errors or other temporary issues, don't clear auth state
                        resolve(true) // Resolve to continue with existing state
                    }
                }

            } catch (error: any) {
                // Only clear auth state on authentication errors
                if (error?.data?.statusCode === 401 || error?.data?.statusCode === 403) {
                    clearAuthState()
                }
                reject(error)
            } finally {
                setLoading(false)
            }
        })
    }

    const logout = () => {
        return new Promise(async (resolve, reject) => {
            try {
                // Try to call logout API
                await useFetchApi('/api/auth/logout', {
                    method: 'POST'
                })
                resolve(true)
            } catch (error: any) {
                // Even if API call fails, we still want to clear local state
                reject(error)
            } finally {
                // Always clear auth state regardless of API success/failure
                clearAuthState()

                // Navigate to home page
                if (process.client) {
                    await navigateTo('/')
                }
            }
        })
    }

    // Check if current session is valid
    const checkAuthValidity = () => {
        try {
            const token = getAccessToken()
            const user = getUserAuth()
            const cookieValue = isLoggedIn().value
            const loggedIn = isUserLoggedIn()

            // If user is marked as logged in but missing critical data
            if (loggedIn && (!token || !user)) {
                // Don't immediately clear auth state, try to refresh first
                if (process.client) {
                    refreshToken()
                        .then(() => {
                        })
                        .catch((error) => {
                            if (error?.data?.statusCode === 401 || error?.data?.statusCode === 403) {
                                clearAuthState()
                            }
                        })
                }
                return false
            }

            // If we have a token, check if it's expired
            if (token) {
                try {
                    const jwt: any = jwtDecode(token)
                    const currentTime = Math.floor(Date.now() / 1000)

                    if (jwt.exp <= currentTime) {
                        // Try to refresh token instead of immediately clearing auth state
                        if (process.client) {
                            refreshToken()
                                .then(() => {
                                })
                                .catch((error) => {
                                    if (error?.data?.statusCode === 401 || error?.data?.statusCode === 403) {
                                        clearAuthState()
                                    }
                                })
                        }
                        return false
                    }
                } catch (decodeError) {
                    clearAuthState()
                    return false
                }
            }

            const isValid = loggedIn && !!token && !!user
            return isValid

        } catch (error) {
            // Don't immediately clear auth state on general errors
            return false
        }
    }

    // Force stop loading state (for debugging)
    const forceStopLoading = () => {
        setLoading(false)
    }

    // Check loading state with timeout
    const checkLoadingWithTimeout = (timeoutMs = 5000) => {
        return new Promise((resolve) => {
            if (!getIsLoading()) {
                resolve(false)
                return
            }

            const timeout = setTimeout(() => {
                forceStopLoading()
                resolve(true) // timeout occurred
            }, timeoutMs)

            const checkInterval = setInterval(() => {
                if (!getIsLoading()) {
                    clearTimeout(timeout)
                    clearInterval(checkInterval)
                    resolve(false) // loading completed normally
                }
            }, 100)
        })
    }

    return {
        register,
        login,
        getUserAuth,
        getAccessToken,
        initAuth,
        logout,
        getIsLoading,
        setLoading,
        clearAuthState,
        checkAuthValidity,
        forceStopLoading,
        checkLoadingWithTimeout,
        isUserLoggedIn
    }
}