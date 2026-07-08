import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

// ==========================================
// Схема БД LMS KazInTake (Turso / libSQL)
// ==========================================

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`)
})

export const materials = sqliteTable('materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['text', 'pdf', 'video'] }).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  sort: integer('sort').notNull().default(0)
})

export const tests = sqliteTable('tests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull()
}, t => [uniqueIndex('tests_course_uq').on(t.courseId)])

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  testId: integer('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  options: text('options').notNull(), // JSON-массив строк
  correctAnswer: integer('correct_answer').notNull(), // индекс в options
  sort: integer('sort').notNull().default(0)
})

export const participants = sqliteTable('participants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`)
}, t => [uniqueIndex('participants_phone_uq').on(t.phone)])

export const enrollments = sqliteTable('enrollments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  participantId: integer('participant_id').notNull().references(() => participants.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`)
}, t => [uniqueIndex('enrollments_uq').on(t.participantId, t.courseId)])

export const coursePins = sqliteTable('course_pins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  period: text('period').notNull(), // YYYY-MM
  pin: text('pin').notNull(),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`)
}, t => [uniqueIndex('course_pins_uq').on(t.courseId, t.period)])

export const testResults = sqliteTable('test_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  participantId: integer('participant_id').notNull().references(() => participants.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  testId: integer('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
  completedAt: text('completed_at').notNull().default(sql`(current_timestamp)`)
})

export const schema = {
  courses,
  materials,
  tests,
  questions,
  participants,
  enrollments,
  coursePins,
  testResults
}
