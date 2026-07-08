import { and, eq } from 'drizzle-orm'
import { db } from './db'
import { coursePins } from '../db/schema'

// Текущий период ротации PIN — YYYY-MM (UTC).
export function currentPeriod(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function genPin() {
  // 6-значный, без ведущего нуля-«обрезания»
  return String(100000 + Math.floor(Math.random() * 900000))
}

// Вернуть PIN курса за текущий месяц; создать, если ещё нет (ленивая ротация).
export async function getOrCreateCurrentPin(courseId: number) {
  const period = currentPeriod()
  const existing = (await db.select().from(coursePins)
    .where(and(eq(coursePins.courseId, courseId), eq(coursePins.period, period))))[0]
  if (existing) return existing

  await db.insert(coursePins)
    .values({ courseId, period, pin: genPin() })
    .onConflictDoNothing()

  return (await db.select().from(coursePins)
    .where(and(eq(coursePins.courseId, courseId), eq(coursePins.period, period))))[0]!
}

// Принудительно сгенерировать новый PIN за текущий месяц.
export async function rotatePin(courseId: number) {
  const period = currentPeriod()
  await db.delete(coursePins)
    .where(and(eq(coursePins.courseId, courseId), eq(coursePins.period, period)))
  const [row] = await db.insert(coursePins)
    .values({ courseId, period, pin: genPin() })
    .returning()
  return row!
}
