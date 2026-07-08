import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { enrollments } from '../../db/schema'
import { requireAdmin } from '../../utils/guards'

const schema = z.object({
  participantId: z.coerce.number().int(),
  courseId: z.coerce.number().int()
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { participantId, courseId } = schema.parse(getQuery(event))
  await db.delete(enrollments)
    .where(and(eq(enrollments.participantId, participantId), eq(enrollments.courseId, courseId)))
  return { ok: true }
})
