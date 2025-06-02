export default (url: string, options: any = {}) => {
    const { getAccessToken } = useAuth()
    const token = getAccessToken()

    return $fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
    })
}