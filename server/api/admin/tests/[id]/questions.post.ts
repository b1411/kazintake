import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../../../utils/db'
import { questions } from '../../../../db/schema'
import { requireAdmin } from '../../../../utils/guards'

const schema = z.object({
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.number().int().min(0)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const testId = Number(getRouterParam(event, 'id'))
  const data = schema.parse(await readBody(event))

  const count = (await db.select().from(questions).where(eq(questions.testId, testId))).length

  const [q] = await db.insert(questions).values({
    testId,
    text: data.text,
    options: JSON.stringify(data.options),
    correctAnswer: data.correctAnswer,
    sort: count
  }).returning()

  return { id: q!.id, text: q!.text, options: data.options, correctAnswer: q!.correctAnswer }
})
