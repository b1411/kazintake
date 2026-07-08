// Авторизация поверх nuxt-auth-utils
export function useAuth() {
  const { user, loggedIn, fetch: refreshSession, clear } = useUserSession()

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStudent = computed(() => user.value?.role === 'participant')

  async function adminLogin(phone: string, password: string) {
    await $fetch('/api/auth/admin-login', { method: 'POST', body: { phone, password } })
    await refreshSession()
  }

  async function participantLogin(phone: string, pin: string) {
    await $fetch('/api/auth/participant-login', { method: 'POST', body: { phone, pin } })
    await refreshSession()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await navigateTo('/login')
  }

  return { user, loggedIn, isAdmin, isStudent, adminLogin, participantLogin, logout }
}
