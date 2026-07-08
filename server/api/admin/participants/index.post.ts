import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { enrollments, participants } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

const schema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  courseIds: z.array(z.number().int()).default([])
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const data = schema.parse(await readBody(event))
  const phone = data.phone.trim()

  const existing = (await db.select().from(participants).where(eq(participants.phone, phone)))[0]
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Курсант с таким телефоном уже есть' })
  }

  const [participant] = await db.insert(participants)
    .values({ fullName: data.fullName.trim(), phone })
    .returning()

  if (data.courseIds.length) {
    await db.insert(enrollments)
      .values(data.courseIds.map(courseId => ({ participantId: participant!.id, courseId })))
      .onConflictDoNothing()
  }

  return { ...participant, courseIds: data.courseIds }
})
