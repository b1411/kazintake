// Middleware: защита роутов по сессии (nuxt-auth-utils)
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()

  const publicPages = ['/login', '/', '/about', '/programs']
  if (publicPages.includes(to.path)) return

  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // /admin/* — только администратор
  if (to.path.startsWith('/admin') && user.value?.role !== 'admin') {
    return navigateTo('/student/dashboard')
  }

  // /student/* — только курсант
  if (to.path.startsWith('/student') && user.value?.role !== 'participant') {
    return navigateTo('/admin')
  }
})
