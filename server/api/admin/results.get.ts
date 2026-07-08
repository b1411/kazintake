import { db } from '../../utils/db'
import { courses, participants, testResults } from '../../db/schema'
import { requireAdmin } from '../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const [results, allParticipants, allCourses] = await Promise.all([
    db.select().from(testResults),
    db.select().from(participants),
    db.select().from(courses)
  ])
  return results
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 10)
    .map(r => ({
      ...r,
      participantName: allParticipants.find(p => p.id === r.participantId)?.fullName ?? '—',
      courseTitle: allCourses.find(c => c.id === r.courseId)?.title ?? '—'
    }))
})
