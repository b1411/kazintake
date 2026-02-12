// ==========================================
// Типы данных LMS-платформы KazInTake
// ==========================================

export interface CourseMaterial {
  id: number
  type: 'text' | 'pdf' | 'video'
  title: string
  content: string // для text — HTML, для pdf/video — URL
}

export interface Course {
  id: number
  title: string
  description: string
  materials: CourseMaterial[]
  testId: number | null
  createdAt: string
}

export interface TestQuestion {
  id: number
  text: string
  options: string[]
  correctAnswer: number // index в массиве options
}

export interface CourseTest {
  id: number
  title: string
  courseId: number
  questions: TestQuestion[]
}

export interface Student {
  id: number
  phone: string
  name: string
  password: string
  groupName: string
}

export interface Assignment {
  id: number
  courseId: number
  studentIds: number[]
  assignedAt: string
}

export interface TestResult {
  id: number
  studentId: number
  courseId: number
  testId: number
  score: number
  total: number
  passed: boolean
  completedAt: string
}

// ==========================================
// Моковые данные
// ==========================================

const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Охрана труда: базовый курс',
    description: 'Основные принципы и нормы охраны труда на предприятии. Обязательный курс для всех сотрудников.',
    materials: [
      { id: 1, type: 'text', title: 'Введение в охрану труда', content: '<h2>Введение</h2><p>Охрана труда — система сохранения жизни и здоровья работников в процессе трудовой деятельности, включающая правовые, социально-экономические, организационно-технические, санитарно-гигиенические, лечебно-профилактические, реабилитационные и иные мероприятия.</p><p>Каждый работник обязан соблюдать требования охраны труда, установленные законами и иными нормативными правовыми актами.</p>' },
      { id: 2, type: 'pdf', title: 'Нормативные документы', content: 'https://example.com/docs/safety-regulations.pdf' },
      { id: 3, type: 'video', title: 'Видеоинструктаж по ОТ', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    testId: 1,
    createdAt: '2026-01-15'
  },
  {
    id: 2,
    title: 'Пожарная безопасность',
    description: 'Курс по основам пожарной безопасности, правилам эвакуации и использованию средств пожаротушения.',
    materials: [
      { id: 4, type: 'text', title: 'Основы пожарной безопасности', content: '<h2>Пожарная безопасность</h2><p>Пожарная безопасность — состояние объекта, при котором исключается возможность пожара, а в случае его возникновения предотвращается воздействие на людей опасных факторов пожара и обеспечивается защита материальных ценностей.</p><p>Основные причины пожаров: неисправность электрооборудования, нарушение технологических процессов, неосторожное обращение с огнём.</p>' },
      { id: 5, type: 'video', title: 'Правила эвакуации', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 6, type: 'pdf', title: 'План эвакуации (образец)', content: 'https://example.com/docs/evacuation-plan.pdf' }
    ],
    testId: 2,
    createdAt: '2026-01-20'
  },
  {
    id: 3,
    title: 'Электробезопасность II группа',
    description: 'Квалификационный курс для получения II группы допуска по электробезопасности.',
    materials: [
      { id: 7, type: 'text', title: 'Действие электрического тока на организм', content: '<h2>Действие электрического тока</h2><p>Проходя через тело человека, электрический ток оказывает термическое, электролитическое и биологическое действие. Степень поражения зависит от величины тока, продолжительности воздействия, пути прохождения тока и индивидуальных особенностей организма.</p>' },
      { id: 8, type: 'text', title: 'Средства защиты', content: '<h2>Средства защиты от поражения электрическим током</h2><p>К основным средствам защиты относятся: изолирующие штанги, изолирующие клещи, электроизмерительные клещи, указатели напряжения, диэлектрические перчатки (при напряжении до 1000 В).</p>' },
      { id: 9, type: 'pdf', title: 'Правила технической эксплуатации', content: 'https://example.com/docs/electrical-safety.pdf' }
    ],
    testId: 3,
    createdAt: '2026-02-01'
  },
  {
    id: 4,
    title: 'Первая помощь пострадавшим',
    description: 'Обучение навыкам оказания первой доврачебной помощи при несчастных случаях на производстве.',
    materials: [
      { id: 10, type: 'text', title: 'Алгоритм оказания первой помощи', content: '<h2>Алгоритм действий</h2><p>1. Убедитесь в отсутствии опасности для себя и пострадавшего.<br>2. Вызовите скорую медицинскую помощь (103 или 112).<br>3. Проверьте сознание и дыхание пострадавшего.<br>4. Окажите необходимую помощь до прибытия бригады СМП.</p>' },
      { id: 11, type: 'video', title: 'Сердечно-лёгочная реанимация', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    testId: null,
    createdAt: '2026-02-05'
  }
]

const initialTests: CourseTest[] = [
  {
    id: 1,
    title: 'Тест: Охрана труда',
    courseId: 1,
    questions: [
      {
        id: 1,
        text: 'Что такое охрана труда?',
        options: [
          'Система сохранения жизни и здоровья работников',
          'Только использование средств индивидуальной защиты',
          'Проведение инструктажей раз в год',
          'Оплата больничных листов'
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        text: 'Кто несёт ответственность за обеспечение охраны труда в организации?',
        options: [
          'Только специалист по охране труда',
          'Работодатель',
          'Профсоюз',
          'Государственная инспекция труда'
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        text: 'Как часто должен проводиться повторный инструктаж?',
        options: [
          'Раз в год',
          'Раз в квартал',
          'Не реже одного раза в шесть месяцев',
          'По требованию работника'
        ],
        correctAnswer: 2
      },
      {
        id: 4,
        text: 'Что обязан работник при несчастном случае на производстве?',
        options: [
          'Продолжить работу',
          'Немедленно сообщить руководителю',
          'Уйти домой',
          'Написать заявление'
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        text: 'Какой вид инструктажа проводится при приёме на работу?',
        options: [
          'Повторный',
          'Целевой',
          'Вводный',
          'Внеплановый'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: 'Тест: Пожарная безопасность',
    courseId: 2,
    questions: [
      {
        id: 6,
        text: 'Какой номер телефона пожарной охраны?',
        options: ['101', '102', '103', '104'],
        correctAnswer: 0
      },
      {
        id: 7,
        text: 'Что нужно делать в первую очередь при обнаружении пожара?',
        options: [
          'Тушить самостоятельно',
          'Сообщить в пожарную охрану',
          'Собрать личные вещи',
          'Открыть все окна'
        ],
        correctAnswer: 1
      },
      {
        id: 8,
        text: 'Каким огнетушителем нельзя тушить электроустановки под напряжением?',
        options: [
          'Углекислотным',
          'Порошковым',
          'Пенным',
          'Хладоновым'
        ],
        correctAnswer: 2
      },
      {
        id: 9,
        text: 'Что запрещено при эвакуации?',
        options: [
          'Двигаться к выходу',
          'Пользоваться лифтом',
          'Помогать пострадавшим',
          'Закрывать двери за собой'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 3,
    title: 'Тест: Электробезопасность II группа',
    courseId: 3,
    questions: [
      {
        id: 10,
        text: 'Какое напряжение считается безопасным в сухих помещениях?',
        options: ['До 12 В', 'До 36 В', 'До 42 В', 'До 220 В'],
        correctAnswer: 2
      },
      {
        id: 11,
        text: 'Какой ток наиболее опасен для человека?',
        options: [
          'Постоянный',
          'Переменный частотой 50 Гц',
          'Переменный частотой 500 Гц',
          'Статический'
        ],
        correctAnswer: 1
      },
      {
        id: 12,
        text: 'Что нужно сделать в первую очередь при поражении человека электрическим током?',
        options: [
          'Вызвать скорую',
          'Освободить пострадавшего от действия тока',
          'Сделать искусственное дыхание',
          'Дать воды'
        ],
        correctAnswer: 1
      }
    ]
  }
]

const initialStudents: Student[] = [
  { id: 1, phone: '+7 (900) 111-0001', name: 'Иванов Иван Петрович', password: 'student1', groupName: 'Группа А' },
  { id: 2, phone: '+7 (900) 111-0002', name: 'Петрова Мария Сергеевна', password: 'student2', groupName: 'Группа А' },
  { id: 3, phone: '+7 (900) 111-0003', name: 'Сидоров Алексей Николаевич', password: 'student3', groupName: 'Группа А' },
  { id: 4, phone: '+7 (900) 111-0004', name: 'Козлова Елена Владимировна', password: 'student4', groupName: 'Группа Б' },
  { id: 5, phone: '+7 (900) 111-0005', name: 'Морозов Дмитрий Андреевич', password: 'student5', groupName: 'Группа Б' },
  { id: 6, phone: '+7 (900) 111-0006', name: 'Новикова Ольга Игоревна', password: 'student6', groupName: 'Группа Б' },
  { id: 7, phone: '+7 (900) 111-0007', name: 'Волков Артём Дмитриевич', password: 'student7', groupName: 'Группа В' },
  { id: 8, phone: '+7 (900) 111-0008', name: 'Соколова Анна Юрьевна', password: 'student8', groupName: 'Группа В' }
]

const initialAssignments: Assignment[] = [
  { id: 1, courseId: 1, studentIds: [1, 2, 3, 4, 5, 6, 7, 8], assignedAt: '2026-01-20' },
  { id: 2, courseId: 2, studentIds: [1, 2, 3, 4, 5, 6], assignedAt: '2026-01-25' },
  { id: 3, courseId: 3, studentIds: [4, 5, 6, 7, 8], assignedAt: '2026-02-01' }
]

const initialTestResults: TestResult[] = [
  { id: 1, studentId: 1, courseId: 1, testId: 1, score: 5, total: 5, passed: true, completedAt: '2026-02-01' },
  { id: 2, studentId: 2, courseId: 1, testId: 1, score: 4, total: 5, passed: true, completedAt: '2026-02-02' },
  { id: 3, studentId: 3, courseId: 1, testId: 1, score: 2, total: 5, passed: false, completedAt: '2026-02-03' },
  { id: 4, studentId: 1, courseId: 2, testId: 2, score: 3, total: 4, passed: true, completedAt: '2026-02-05' }
]

// ==========================================
// Composable: useMockData
// ==========================================

export function useMockData() {
  const courses = useState<Course[]>('mock-courses', () => initialCourses)
  const tests = useState<CourseTest[]>('mock-tests', () => initialTests)
  const students = useState<Student[]>('mock-students', () => initialStudents)
  const assignments = useState<Assignment[]>('mock-assignments', () => initialAssignments)
  const testResults = useState<TestResult[]>('mock-test-results', () => initialTestResults)

  // --- Курсы ---
  function getCourse(id: number) {
    return courses.value.find(c => c.id === id)
  }

  function addCourse(course: Omit<Course, 'id' | 'createdAt'>) {
    const newId = Math.max(0, ...courses.value.map(c => c.id)) + 1
    courses.value.push({
      ...course,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]!
    })
    return newId
  }

  function updateCourse(id: number, data: Partial<Course>) {
    const idx = courses.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      courses.value[idx] = { ...courses.value[idx]!, ...data }
    }
  }

  function deleteCourse(id: number) {
    courses.value = courses.value.filter(c => c.id !== id)
  }

  // --- Тесты ---
  function getTest(id: number) {
    return tests.value.find(t => t.id === id)
  }

  function getTestByCourse(courseId: number) {
    return tests.value.find(t => t.courseId === courseId)
  }

  function addTest(test: Omit<CourseTest, 'id'>) {
    const newId = Math.max(0, ...tests.value.map(t => t.id)) + 1
    tests.value.push({ ...test, id: newId })
    // Привязать тест к курсу
    const course = courses.value.find(c => c.id === test.courseId)
    if (course) course.testId = newId
    return newId
  }

  function updateTest(id: number, data: Partial<CourseTest>) {
    const idx = tests.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tests.value[idx] = { ...tests.value[idx]!, ...data }
    }
  }

  function deleteTest(id: number) {
    const test = tests.value.find(t => t.id === id)
    if (test) {
      const course = courses.value.find(c => c.id === test.courseId)
      if (course) course.testId = null
    }
    tests.value = tests.value.filter(t => t.id !== id)
  }

  // --- Студенты ---
  function getStudent(id: number) {
    return students.value.find(s => s.id === id)
  }

  function addStudent(student: Omit<Student, 'id'>) {
    const newId = Math.max(0, ...students.value.map(s => s.id)) + 1
    students.value.push({ ...student, id: newId })
    return newId
  }

  function addStudentsBatch(phones: string[], groupName: string) {
    const added: Student[] = []
    for (const phone of phones) {
      const exists = students.value.find(s => s.phone === phone)
      if (!exists) {
        const newId = Math.max(0, ...students.value.map(s => s.id)) + 1
        const student: Student = {
          id: newId,
          phone,
          name: `Студент ${newId}`,
          password: `pass${newId}`,
          groupName
        }
        students.value.push(student)
        added.push(student)
      }
    }
    return added
  }

  function deleteStudent(id: number) {
    students.value = students.value.filter(s => s.id !== id)
    // Удалить из назначений
    for (const a of assignments.value) {
      a.studentIds = a.studentIds.filter(sid => sid !== id)
    }
  }

  // --- Назначения ---
  function getAssignmentsForStudent(studentId: number) {
    return assignments.value.filter(a => a.studentIds.includes(studentId))
  }

  function getCoursesForStudent(studentId: number) {
    const courseIds = assignments.value
      .filter(a => a.studentIds.includes(studentId))
      .map(a => a.courseId)
    return courses.value.filter(c => courseIds.includes(c.id))
  }

  function addAssignment(courseId: number, studentIds: number[]) {
    const existing = assignments.value.find(a => a.courseId === courseId)
    if (existing) {
      const newIds = studentIds.filter(id => !existing.studentIds.includes(id))
      existing.studentIds.push(...newIds)
    } else {
      const newId = Math.max(0, ...assignments.value.map(a => a.id)) + 1
      assignments.value.push({
        id: newId,
        courseId,
        studentIds: [...studentIds],
        assignedAt: new Date().toISOString().split('T')[0]!
      })
    }
  }

  function removeAssignment(courseId: number, studentId: number) {
    const assignment = assignments.value.find(a => a.courseId === courseId)
    if (assignment) {
      assignment.studentIds = assignment.studentIds.filter(id => id !== studentId)
    }
  }

  // --- Результаты тестов ---
  function getResultsForStudent(studentId: number) {
    return testResults.value.filter(r => r.studentId === studentId)
  }

  function getResultForStudentCourse(studentId: number, courseId: number) {
    return testResults.value.find(r => r.studentId === studentId && r.courseId === courseId)
  }

  function getResultsForCourse(courseId: number) {
    return testResults.value.filter(r => r.courseId === courseId)
  }

  function submitTestResult(studentId: number, courseId: number, testId: number, answers: number[]) {
    const test = getTest(testId)
    if (!test) return null

    let score = 0
    for (let i = 0; i < test.questions.length; i++) {
      if (answers[i] === test.questions[i]!.correctAnswer) score++
    }

    const total = test.questions.length
    const passed = score / total >= 0.7 // 70% порог прохождения

    // Удалить старый результат, если есть
    testResults.value = testResults.value.filter(
      r => !(r.studentId === studentId && r.courseId === courseId)
    )

    const newId = Math.max(0, ...testResults.value.map(r => r.id)) + 1
    const result: TestResult = {
      id: newId,
      studentId,
      courseId,
      testId,
      score,
      total,
      passed,
      completedAt: new Date().toISOString().split('T')[0]!
    }
    testResults.value.push(result)
    return result
  }

  // --- Группы ---
  function getGroups() {
    return [...new Set(students.value.map(s => s.groupName))]
  }

  function getStudentsByGroup(groupName: string) {
    return students.value.filter(s => s.groupName === groupName)
  }

  return {
    courses,
    tests,
    students,
    assignments,
    testResults,
    // Курсы
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    // Тесты
    getTest,
    getTestByCourse,
    addTest,
    updateTest,
    deleteTest,
    // Студенты
    getStudent,
    addStudent,
    addStudentsBatch,
    deleteStudent,
    // Назначения
    getAssignmentsForStudent,
    getCoursesForStudent,
    addAssignment,
    removeAssignment,
    // Результаты
    getResultsForStudent,
    getResultForStudentCourse,
    getResultsForCourse,
    submitTestResult,
    // Группы
    getGroups,
    getStudentsByGroup
  }
}
