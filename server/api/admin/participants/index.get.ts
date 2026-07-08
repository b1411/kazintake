import { db } from '../../../utils/db'
import { enrollments, participants } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const [all, enr] = await Promise.all([
    db.select().from(participants),
    db.select().from(enrollments)
  ])
  return all.map(p => ({
    ...p,
    courseIds: enr.filter(e => e.participantId === p.id).map(e => e.courseId)
  }))
})
