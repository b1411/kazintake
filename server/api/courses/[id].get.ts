import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { courses, materials, tests } from '../../db/schema'
import { requireParticipant } from '../../utils/guards'
import { assertEnrolled } from '../../utils/enroll'

export default defineEventHandler(async (event) => {
  const { participantId } = await requireParticipant(event)
  const id = Number(getRouterParam(event, 'id'))
  await assertEnrolled(event, participantId, id)

  const course = (await db.select().from(courses).where(eq(courses.id, id)))[0]
  if (!course) throw createError({ statusCode: 404, statusMessage: 'Курс не найден' })

  const mats = await db.select().from(materials).where(eq(materials.courseId, id))
  const test = (await db.select().from(tests).where(eq(tests.courseId, id)))[0] ?? null

  return {
    ...course,
    materials: mats.sort((a, b) => a.sort - b.sort),
    testId: test?.id ?? null
  }
})
