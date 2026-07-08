import { z } from 'zod'
import { db } from '../../utils/db'
import { enrollments } from '../../db/schema'
import { requireAdmin } from '../../utils/guards'

const schema = z.object({
  participantId: z.number().int(),
  courseId: z.number().int()
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const data = schema.parse(await readBody(event))
  await db.insert(enrollments).values(data).onConflictDoNothing()
  return { ok: true }
})
