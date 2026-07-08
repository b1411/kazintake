import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

const schema = z.object({
  title: z.string().min(1),
  courseId: z.number().int()
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const data = schema.parse(await readBody(event))

  const existing = (await db.select().from(tests).where(eq(tests.courseId, data.courseId)))[0]
  if (existing) throw createError({ statusCode: 409, statusMessage: 'У курса уже есть тест' })

  const [test] = await db.insert(tests).values(data).returning()
  return test
})
