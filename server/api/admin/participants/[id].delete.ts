import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { enrollments, participants, testResults } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(enrollments).where(eq(enrollments.participantId, id))
  await db.delete(testResults).where(eq(testResults.participantId, id))
  await db.delete(participants).where(eq(participants.id, id))
  return { ok: true }
})
