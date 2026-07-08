import { z } from 'zod'
import { db } from '../../../utils/db'
import { courses } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().default('')
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const data = schema.parse(await readBody(event))
  const [course] = await db.insert(courses).values(data).returning()
  return course
})
