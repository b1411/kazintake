import type { H3Event } from 'h3'

// Требовать сессию администратора.
export async function requireAdmin(event: H3Event) {
  const { user } = await requireUserSession(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Только для администратора' })
  }
  return user
}

// Требовать сессию курсанта; вернуть participantId.
export async function requireParticipant(event: H3Event) {
  const { user } = await requireUserSession(event)
  if (user.role !== 'participant' || !user.participantId) {
    throw createError({ statusCode: 403, statusMessage: 'Только для курсанта' })
  }
  return { participantId: user.participantId, name: user.name }
}
