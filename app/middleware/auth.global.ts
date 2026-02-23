// Middleware: защита роутов по авторизации
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isAdmin, isStudent } = useMockAuth()

  // Публичные страницы
  const publicPages = ['/login', '/', '/about', '/programs']
  if (publicPages.includes(to.path)) return

  // Не авторизован — на логин
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Защита /admin/* — только для администратора
  if (to.path.startsWith('/admin') && !isAdmin.value) {
    return navigateTo('/student/dashboard')
  }

  // Защита /student/* — только для студентов
  if (to.path.startsWith('/student') && !isStudent.value) {
    return navigateTo('/admin')
  }
})
