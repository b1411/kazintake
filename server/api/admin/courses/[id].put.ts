import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { courses } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional()
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const data = schema.parse(await readBody(event))
  const [course] = await db.update(courses).set(data).where(eq(courses.id, id)).returning()
  if (!course) throw createError({ statusCode: 404, statusMessage: 'Курс не найден' })
  return course
})
