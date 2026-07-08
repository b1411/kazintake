import AdmZip from 'adm-zip'

export interface ParsedQuestion {
  text: string
  options: string[]
  correctAnswer: number // индекс правильного в options
}

// Достать текст из .docx: каждый абзац (<w:p>) — отдельная строка.
function docxToLines(path: string): string[] {
  const zip = new AdmZip(path)
  const xml = zip.readAsText('word/document.xml')
  const withBreaks = xml.replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '')
  const unescaped = withBreaks
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, '\'')
  return unescaped.split('\n').map(l => l.trim()).filter(Boolean)
}

// Формат строки-вопроса:
//   <Текст вопроса>A) o1 B) o2 C) o3 D) o4✅ <Буква>
// Символ ✅ помечает правильный ответ (буква после него).
export function parseDocxTest(path: string): ParsedQuestion[] {
  const lines = docxToLines(path)
  const questions: ParsedQuestion[] = []

  for (const line of lines) {
    const ans = line.match(/✅\s*([A-DА-Г])/i)
    if (!ans) continue // не строка-вопрос

    const correctLetter = ans[1]!.toUpperCase()
    const body = line.slice(0, ans.index).trim()

    // Разбить на [qtext, 'A', o1, 'B', o2, ...]
    const parts = body.split(/\s*([A-DА-Г])\)\s*/i)
    if (parts.length < 3) continue

    const text = parts[0]!.trim()
    const options: string[] = []
    const letters: string[] = []
    for (let i = 1; i < parts.length; i += 2) {
      const letter = parts[i]!.toUpperCase()
      const opt = (parts[i + 1] ?? '').trim()
      if (!opt) continue
      letters.push(letter)
      options.push(opt)
    }
    if (options.length < 2) continue

    let correctAnswer = letters.indexOf(correctLetter)
    if (correctAnswer === -1) correctAnswer = 0

    questions.push({ text, options, correctAnswer })
  }

  return questions
}
