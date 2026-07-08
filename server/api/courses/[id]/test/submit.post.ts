import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../../utils/db'
import { questions, testResults, tests } from '../../../../db/schema'
import { requireParticipant } from '../../../../utils/guards'
import { assertEnrolled } from '../../../../utils/enroll'

const schema = z.object({
  answers: z.array(z.number().int()) // индекс выбранного ответа по каждому вопросу
})

const PASS_RATIO = 0.7

export default defineEventHandler(async (event) => {
  const { participantId } = await requireParticipant(event)
  const courseId = Number(getRouterParam(event, 'id'))
  await assertEnrolled(event, participantId, courseId)

  const { answers } = schema.parse(await readBody(event))

  const test = (await db.select().from(tests).where(eq(tests.courseId, courseId)))[0]
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Тест не найден' })

  const qs = (await db.select().from(questions).where(eq(questions.testId, test.id)))
    .sort((a, b) => a.sort - b.sort)

  // Балл считаем ТОЛЬКО на сервере
  let score = 0
  for (let i = 0; i < qs.length; i++) {
    if (answers[i] === qs[i]!.correctAnswer) score++
  }
  const total = qs.length
  const passed = total > 0 && score / total >= PASS_RATIO

  // Перезаписать прошлый результат
  await db.delete(testResults)
    .where(and(eq(testResults.participantId, participantId), eq(testResults.courseId, courseId)))

  const [result] = await db.insert(testResults)
    .values({ participantId, courseId, testId: test.id, score, total, passed })
    .returning()

  return result
})
