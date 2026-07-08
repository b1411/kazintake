import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { questions, tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  const test = (await db.select().from(tests).where(eq(tests.id, id)))[0]
  if (!test) throw createError({ statusCode: 404, statusMessage: 'Тест не найден' })

  const qs = await db.select().from(questions).where(eq(questions.testId, id))
  return {
    ...test,
    questions: qs
      .sort((a, b) => a.sort - b.sort)
      .map(q => ({ id: q.id, text: q.text, options: JSON.parse(q.options) as string[], correctAnswer: q.correctAnswer }))
  }
})
