import { eq, inArray } from 'drizzle-orm'
import { db } from '../../utils/db'
import { courses, enrollments, testResults, tests } from '../../db/schema'
import { requireParticipant } from '../../utils/guards'

export default defineEventHandler(async (event) => {
  const { participantId } = await requireParticipant(event)

  const enr = await db.select().from(enrollments).where(eq(enrollments.participantId, participantId))
  const courseIds = enr.map(e => e.courseId)
  if (courseIds.length === 0) return []

  const [myCourses, allTests, results] = await Promise.all([
    db.select().from(courses).where(inArray(courses.id, courseIds)),
    db.select().from(tests).where(inArray(tests.courseId, courseIds)),
    db.select().from(testResults).where(eq(testResults.participantId, participantId))
  ])

  return myCourses.map(c => ({
    ...c,
    testId: allTests.find(t => t.courseId === c.id)?.id ?? null,
    result: results.find(r => r.courseId === c.id) ?? null
  }))
})
