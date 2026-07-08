import { z } from 'zod'
import { inArray } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { enrollments, participants } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

// Массовое добавление обучающихся.
// text — по одной строке на человека: «ФИО, телефон» (разделитель , ; или Tab).
const schema = z.object({
  text: z.string().min(1),
  courseIds: z.array(z.number().int()).default([])
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { text, courseIds } = schema.parse(await readBody(event))

  const parsed: { fullName: string, phone: string }[] = []
  const invalid: string[] = []

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const parts = line.split(/[;,\t]/).map(p => p.trim())
    const fullName = parts[0] ?? ''
    const phone = parts.slice(1).join(' ').trim()
    if (!fullName || !phone) {
      invalid.push(line)
      continue
    }
    parsed.push({ fullName, phone })
  }

  // Уже существующие телефоны
  const existingPhones = new Set(
    (await db.select().from(participants)).map(p => p.phone)
  )

  const added: { id: number, fullName: string, phone: string }[] = []
  const skipped: string[] = []
  const seen = new Set<string>()

  for (const p of parsed) {
    if (existingPhones.has(p.phone) || seen.has(p.phone)) {
      skipped.push(p.phone)
      continue
    }
    seen.add(p.phone)
    const [row] = await db.insert(participants).values(p).returning()
    added.push({ id: row!.id, fullName: row!.fullName, phone: row!.phone })
  }

  // Записать всех новых на выбранные курсы
  if (courseIds.length && added.length) {
    const values = added.flatMap(a => courseIds.map(courseId => ({ participantId: a.id, courseId })))
    await db.insert(enrollments).values(values).onConflictDoNothing()
  }

  return { addedCount: added.length, skipped, invalid }
})
