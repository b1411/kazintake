import type { H3Event } from 'h3'
import { and, eq } from 'drizzle-orm'
import { db } from './db'
import { enrollments } from '../db/schema'

// Проверить, что обучающийся записан на курс, иначе 403.
export async function assertEnrolled(event: H3Event, participantId: number, courseId: number) {
  const row = (await db.select().from(enrollments)
    .where(and(eq(enrollments.participantId, participantId), eq(enrollments.courseId, courseId))))[0]
  if (!row) {
    throw createError({ statusCode: 403, statusMessage: 'Нет доступа к курсу' })
  }
}
