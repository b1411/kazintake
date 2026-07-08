// Общие типы для клиента и сервера (Nuxt 4 auto-import из shared/)

export type MaterialType = 'text' | 'pdf' | 'video'

export interface Material {
  id: number
  courseId: number
  type: MaterialType
  title: string
  content: string
  sort: number
}

export interface Course {
  id: number
  title: string
  description: string
  createdAt: string
}

export interface CourseWithMaterials extends Course {
  materials: Material[]
  testId: number | null
}

export interface TestQuestion {
  id: number
  text: string
  options: string[]
  correctAnswer?: number // сервер отдаёт курсанту БЕЗ этого поля
}

export interface CourseTest {
  id: number
  courseId: number
  title: string
  questions: TestQuestion[]
}

export interface Participant {
  id: number
  fullName: string
  phone: string
  createdAt: string
}

export interface Enrollment {
  id: number
  participantId: number
  courseId: number
  createdAt: string
}

export interface CoursePin {
  courseId: number
  courseTitle: string
  period: string // YYYY-MM
  pin: string
}

export interface TestResult {
  id: number
  participantId: number
  courseId: number
  testId: number
  score: number
  total: number
  passed: boolean
  completedAt: string
}

export type SessionUser
  = | { role: 'admin', name: string }
    | { role: 'participant', participantId: number, name: string }
