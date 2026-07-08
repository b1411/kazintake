import { db } from '../../../utils/db'
import { courses, questions, tests } from '../../../db/schema'
import { requireAdmin } from '../../../utils/guards'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const [allTests, allCourses, allQuestions] = await Promise.all([
    db.select().from(tests),
    db.select().from(courses),
    db.select().from(questions)
  ])
  return allTests.map(t => ({
    id: t.id,
    title: t.title,
    courseId: t.courseId,
    courseTitle: allCourses.find(c => c.id === t.courseId)?.title ?? `#${t.courseId}`,
    questionCount: allQuestions.filter(q => q.testId === t.id).length
  }))
})
