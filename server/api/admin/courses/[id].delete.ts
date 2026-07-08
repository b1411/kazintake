import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { courses, coursePins, enrollments, materials, questions, testResults, tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  // Явное удаление детей (FK cascade в libSQL по умолчанию выключен)
  const test = (await db.select().from(tests).where(eq(tests.courseId, id)))[0]
  if (test) await db.delete(questions).where(eq(questions.testId, test.id))
  await db.delete(tests).where(eq(tests.courseId, id))
  await db.delete(materials).where(eq(materials.courseId, id))
  await db.delete(coursePins).where(eq(coursePins.courseId, id))
  await db.delete(enrollments).where(eq(enrollments.courseId, id))
  await db.delete(testResults).where(eq(testResults.courseId, id))
  await db.delete(courses).where(eq(courses.id, id))

  return { ok: true }
})
