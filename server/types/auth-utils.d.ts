// Типизация сессии nuxt-auth-utils в контексте сервера
declare module '#auth-utils' {
  interface User {
    role: 'admin' | 'participant'
    name: string
    participantId?: number
  }
}

export {}
