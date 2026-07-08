// Типизация сессии nuxt-auth-utils
declare module '#auth-utils' {
  interface User {
    role: 'admin' | 'participant'
    name: string
    participantId?: number
  }
}

export {}
