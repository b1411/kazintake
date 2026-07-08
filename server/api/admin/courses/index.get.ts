import { db } from '../../../utils/db'
import { courses, materials, tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [allCourses, allMaterials, allTests] = await Promise.all([
    db.select().from(courses),
    db.select().from(materials),
    db.select().from(tests)
  ])

  return allCourses.map(c => ({
    ...c,
    materials: allMaterials
      .filter(m => m.courseId === c.id)
      .sort((a, b) => a.sort - b.sort),
    testId: allTests.find(t => t.courseId === c.id)?.id ?? null
  }))
})
