import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { db } from '../utils/db'
import { courses, enrollments, coursePins, materials, questions, testResults, tests } from './schema'
import { parseDocxTest } from './parseDocx'

// ==========================================
// Seed: курсы + видео-материалы + тесты из .docx
// Запуск: pnpm db:seed
// ==========================================

const TESTS_DIR = join(process.cwd(), 'тесты')

function embed(id: string) {
  return `https://www.youtube.com/embed/${id}`
}

interface Vid { ru?: string, kz?: string }

interface CourseDef {
  title: string
  description: string
  testKey?: string // подстрока имени .docx (без «ТЕСТ » и «.docx»)
  video?: Vid
}

// ВНИМАНИЕ: соответствие курс↔видео для строк с пометкой (?) не подтверждено заказчиком.
const CATALOG: CourseDef[] = [
  {
    title: 'Первая доврачебная помощь «Парамедик»',
    description: 'Обучение оказанию первой доврачебной медицинской помощи.',
    testKey: 'первая помощь',
    video: { ru: 'xJ0bOpOE8z8', kz: 'uGz-27358EE' }
  },
  {
    title: 'Электробезопасность',
    description: 'Курс по электробезопасности.',
    testKey: 'электробез',
    video: { ru: 'gIVwoS3iaOc', kz: 'kc69OUOgSz4' }
  },
  {
    title: 'Обучение членов согласительной комиссии',
    description: 'Обучение членов согласительной комиссии.',
    testKey: 'согласительная',
    video: { ru: 'n1nucwgMpxE' }
  },
  {
    title: 'Противодействие коррупции «Офицер комплаенс»',
    description: 'Обучение по противодействию коррупции.',
    testKey: 'антикоррупция',
    video: { ru: 'VzHAxZetj1s' }
  },
  {
    title: 'Пожарная безопасность (ПТМ)',
    description: 'Пожарно-технический минимум.',
    testKey: 'ПБ'
    // видео ПТМ/БиОТ не подтверждено заказчиком — не привязываем
  },
  {
    title: 'Охрана труда (БиОТ)',
    description: 'Безопасность и охрана труда.',
    testKey: 'ОТ'
    // видео ПТМ/БиОТ не подтверждено заказчиком — не привязываем
  },
  {
    title: 'Антитеррористическая защищённость',
    description: 'Обучение по антитеррористической защищённости.',
    testKey: 'антитеррор'
    // видео нет — уточнить у заказчика
  },
  {
    title: 'Кадровое дело',
    description: 'Обучение по кадровому делопроизводству.',
    testKey: 'кадровое'
    // видео нет
  },
  {
    title: 'ПВК и ПОД/ФТ (финансовый мониторинг)',
    description: 'Правила внутреннего контроля, ПОД/ФТ.',
    testKey: 'ПВК'
    // видео нет
  },
  {
    title: 'Промышленная безопасность',
    description: 'Обучение по промышленной безопасности.',
    testKey: 'промбез'
    // видео нет
  },
  {
    title: 'Обучение декретированной группы населения',
    description: 'Обучение декретированной группы населения.',
    video: { ru: 'uZloNWNvg2Y', kz: 'KkXYJ62c43s' }
    // тест — уточнить у заказчика
  },
  {
    title: 'Профилактика буллинга',
    description: 'Профилактика буллинга (травли).',
    video: { ru: '1ByjRBAZYrY', kz: 'Tiz6qbBm0HA' }
    // тест — уточнить у заказчика
  }
]

function findDocx(testKey: string): string | null {
  const files = readdirSync(TESTS_DIR).filter(f => f.toLowerCase().endsWith('.docx'))
  for (const f of files) {
    const base = f.replace(/^ТЕСТ\s+/i, '').replace(/\.docx$/i, '').trim()
    if (base === testKey || base.includes(testKey)) return join(TESTS_DIR, f)
  }
  return null
}

async function main() {
  // Очистка контента (идемпотентность). Порядок — от детей к родителям.
  await db.delete(testResults)
  await db.delete(questions)
  await db.delete(coursePins)
  await db.delete(enrollments)
  await db.delete(tests)
  await db.delete(materials)
  await db.delete(courses)

  let totalQuestions = 0

  for (const def of CATALOG) {
    const [course] = await db.insert(courses)
      .values({ title: def.title, description: def.description })
      .returning()
    const courseId = course!.id

    // Видео-материалы
    const mats: { courseId: number, type: 'video', title: string, content: string, sort: number }[] = []
    if (def.video?.ru) mats.push({ courseId, type: 'video', title: 'Видео (рус)', content: embed(def.video.ru), sort: 0 })
    if (def.video?.kz) mats.push({ courseId, type: 'video', title: 'Видео (каз)', content: embed(def.video.kz), sort: 1 })
    if (mats.length) await db.insert(materials).values(mats)

    // Тест из .docx
    if (def.testKey) {
      const path = findDocx(def.testKey)
      if (!path) {
        console.warn(`⚠️  Не найден .docx для «${def.title}» (ключ: ${def.testKey})`)
        continue
      }
      const parsed = parseDocxTest(path)
      if (parsed.length === 0) {
        console.warn(`⚠️  0 вопросов распарсено для «${def.title}» (${path})`)
        continue
      }
      const [test] = await db.insert(tests)
        .values({ courseId, title: `Тест: ${def.title}` })
        .returning()
      await db.insert(questions).values(
        parsed.map((q, i) => ({
          testId: test!.id,
          text: q.text,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          sort: i
        }))
      )
      totalQuestions += parsed.length
      console.log(`✅ ${def.title}: ${parsed.length} вопросов`)
    } else {
      console.log(`•  ${def.title}: без теста`)
    }
  }

  console.log(`\nИтого: ${CATALOG.length} курсов, ${totalQuestions} вопросов.`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
