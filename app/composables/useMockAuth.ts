// ==========================================
// Composable: useMockAuth
// Имитация авторизации по номеру телефона
// ==========================================

export interface AuthUser {
  id: number
  phone: string
  name: string
  role: 'admin' | 'student'
}

// Администратор (жёстко зашит)
const ADMIN_CREDENTIALS = {
  phone: '+7 (900) 000-0001',
  password: 'admin123',
  name: 'Администратор'
}

export function useMockAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStudent = computed(() => user.value?.role === 'student')

  function login(phone: string, password: string): { success: boolean, error?: string } {
    // Проверяем администратора
    if (phone === ADMIN_CREDENTIALS.phone && password === ADMIN_CREDENTIALS.password) {
      user.value = {
        id: 0,
        phone: ADMIN_CREDENTIALS.phone,
        name: ADMIN_CREDENTIALS.name,
        role: 'admin'
      }
      return { success: true }
    }

    // Проверяем студентов
    const { students } = useMockData()
    const student = students.value.find(s => s.phone === phone && s.password === password)
    if (student) {
      user.value = {
        id: student.id,
        phone: student.phone,
        name: student.name,
        role: 'student'
      }
      return { success: true }
    }

    return { success: false, error: 'Неверный номер телефона или пароль' }
  }

  function logout() {
    user.value = null
    navigateTo('/login')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isStudent,
    login,
    logout
  }
}
