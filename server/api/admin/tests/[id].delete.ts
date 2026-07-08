import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { questions, tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(questions).where(eq(questions.testId, id))
  await db.delete(tests).where(eq(tests.id, id))
  return { ok: true }
})
