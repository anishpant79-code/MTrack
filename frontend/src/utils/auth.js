const TOKEN_KEY = 'mtrack_ai_token'
const USER_KEY = 'mtrack_ai_user'

export const getAuthToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export const setAuthToken = (token) => {
    try {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token)
        } else {
            localStorage.removeItem(TOKEN_KEY)
        }
    } catch (err) {
        console.error('Failed to save auth token:', err)
    }
}

export const removeAuthToken = () => {
    try {
        localStorage.removeItem(TOKEN_KEY)
    } catch (err) {
        console.error('Failed to remove auth token:', err)
    }
}

export const getCurrentUser = () => {
    try {
        const raw = localStorage.getItem(USER_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export const setCurrentUser = (user) => {
    try {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(USER_KEY)
        }
    } catch (err) {
        console.error('Failed to save user profile:', err)
    }
}

export const removeCurrentUser = () => {
    try {
        localStorage.removeItem(USER_KEY)
    } catch (err) {
        console.error('Failed to remove user profile:', err)
    }
}

export const isAuthenticated = () => {
    return Boolean(getAuthToken())
}

export const logout = () => {
    removeAuthToken()
    removeCurrentUser()
}

export const getAuthHeaders = (extraHeaders = {}) => {
    const token = getAuthToken()
    const headers = {
        'Content-Type': 'application/json',
        ...extraHeaders,
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return headers
}
