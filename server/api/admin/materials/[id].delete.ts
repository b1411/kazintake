import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { materials } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(materials).where(eq(materials.id, id))
  return { ok: true }
})
