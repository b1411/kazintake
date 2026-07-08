import { db } from '../../../utils/db'
import { courses } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'
import { currentPeriod, getOrCreateCurrentPin } from '../../../utils/pin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const allCourses = await db.select().from(courses)
  const period = currentPeriod()

  const result = []
  for (const c of allCourses) {
    const p = await getOrCreateCurrentPin(c.id)
    result.push({ courseId: c.id, courseTitle: c.title, period, pin: p.pin })
  }
  return result
})
