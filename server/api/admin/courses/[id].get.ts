import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { courses, materials, questions, tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  const course = (await db.select().from(courses).where(eq(courses.id, id)))[0]
  if (!course) throw createError({ statusCode: 404, statusMessage: 'Курс не найден' })

  const mats = await db.select().from(materials).where(eq(materials.courseId, id))
  const test = (await db.select().from(tests).where(eq(tests.courseId, id)))[0] ?? null

  let testWithQuestions = null
  if (test) {
    const qs = await db.select().from(questions).where(eq(questions.testId, test.id))
    testWithQuestions = {
      ...test,
      questions: qs
        .sort((a, b) => a.sort - b.sort)
        .map(q => ({ ...q, options: JSON.parse(q.options) as string[] }))
    }
  }

  return {
    ...course,
    materials: mats.sort((a, b) => a.sort - b.sort),
    test: testWithQuestions
  }
})
