// middleware/auth.global.ts
import type {userData} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
    const isLoggedIn = useCookie('isLoggedIn').value

    // If not logged in and trying to access /dashboard, redirect to /login
    if (!isLoggedIn && to.path.startsWith('/dashboard')) {
        return navigateTo('/login')
    }

    // If already logged in and trying to access /login, redirect to /dashboard
    if (isLoggedIn && to.path.startsWith('/login')) {
        return navigateTo('/dashboard')
    }


    // Optionally, add more conditions for further route checks
})
