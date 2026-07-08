import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { enrollments, participants } from '../../db/schema'
import { getOrCreateCurrentPin } from '../../utils/pin'

const schema = z.object({
  phone: z.string().min(1),
  pin: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const { phone, pin } = schema.parse(await readBody(event))

  const participant = (await db.select().from(participants)
    .where(eq(participants.phone, phone.trim())))[0]
  if (!participant) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный телефон или PIN' })
  }

  // Курсы, на которые записан курсант
  const enrolled = await db.select().from(enrollments)
    .where(eq(enrollments.participantId, participant.id))

  // PIN должен совпасть с текущим кодом хотя бы одного из курсов курсанта
  let matched = false
  for (const e of enrolled) {
    const p = await getOrCreateCurrentPin(e.courseId)
    if (p.pin === pin.trim()) {
      matched = true
      break
    }
  }

  if (!matched) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный телефон или PIN' })
  }

  await setUserSession(event, {
    user: { role: 'participant', participantId: participant.id, name: participant.fullName }
  })
  return { ok: true }
})
