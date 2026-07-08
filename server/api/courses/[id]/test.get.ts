import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { questions, tests } from '../../../db/schema'
import { requireParticipant } from '../../../utils/guards'
import { assertEnrolled } from '../../../utils/enroll'

export default defineEventHandler(async (event) => {
  const { participantId } = await requireParticipant(event)
  const courseId = Number(getRouterParam(event, 'id'))
  await assertEnrolled(event, participantId, courseId)

  const test = (await db.select().from(tests).where(eq(tests.courseId, courseId)))[0]
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Тест не найден' })

  const qs = await db.select().from(questions).where(eq(questions.testId, test.id))

  // Отдаём БЕЗ correctAnswer
  return {
    id: test.id,
    courseId,
    title: test.title,
    questions: qs
      .sort((a, b) => a.sort - b.sort)
      .map(q => ({ id: q.id, text: q.text, options: JSON.parse(q.options) as string[] }))
  }
})
