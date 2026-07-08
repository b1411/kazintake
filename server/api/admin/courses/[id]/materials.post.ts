import { z } from 'zod'
import { db } from '../../../../utils/db'
import { materials } from '../../../../db/schema'
import { requireAdmin } from '../../../../utils/guards'

const schema = z.object({
  type: z.enum(['text', 'pdf', 'video']),
  title: z.string().min(1),
  content: z.string().min(1),
  sort: z.number().int().default(0)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const courseId = Number(getRouterParam(event, 'id'))
  const data = schema.parse(await readBody(event))
  const [material] = await db.insert(materials).values({ ...data, courseId }).returning()
  return material
})
