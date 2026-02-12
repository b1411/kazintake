<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Редактор теста' })

const route = useRoute()
const toast = useToast()
const testId = Number(route.params.id)

const { getTest, updateTest, getCourse } = useMockData()

const test = computed(() => getTest(testId))
const course = computed(() => test.value ? getCourse(test.value.courseId) : null)

// Добавление вопроса
const showAddQuestion = ref(false)
const newQuestion = reactive({
  text: '',
  options: ['', '', '', ''],
  correctAnswer: 0
})

function addQuestion() {
  if (!test.value) return
  if (!newQuestion.text.trim()) return
  const filledOptions = newQuestion.options.filter(o => o.trim())
  if (filledOptions.length < 2) return

  const maxId = Math.max(0, ...test.value.questions.map(q => q.id))
  test.value.questions.push({
    id: maxId + 1,
    text: newQuestion.text,
    options: filledOptions,
    correctAnswer: newQuestion.correctAnswer
  })

  newQuestion.text = ''
  newQuestion.options = ['', '', '', '']
  newQuestion.correctAnswer = 0
  showAddQuestion.value = false
  toast.add({ title: 'Вопрос добавлен', color: 'success', icon: 'i-lucide-check-circle' })
}

function removeQuestion(questionId: number) {
  if (!test.value) return
  test.value.questions = test.value.questions.filter(q => q.id !== questionId)
  toast.add({ title: 'Вопрос удалён', color: 'success', icon: 'i-lucide-check-circle' })
}

const correctLabels = ['A', 'B', 'C', 'D']
</script>

<template>
  <div
    v-if="!test"
    class="flex items-center justify-center h-64"
  >
    <UAlert
      title="Тест не найден"
      icon="i-lucide-alert-triangle"
      color="warning"
    />
  </div>

  <div
    v-else
    class="space-y-6"
  >
    <!-- Навигация -->
    <div class="flex items-center gap-2">
      <UButton
        to="/admin/tests"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        label="Назад к тестам"
      />
    </div>

    <!-- Информация о тесте -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-lg">
              {{ test.title }}
            </h3>
            <p
              v-if="course"
              class="text-sm text-muted"
            >
              Курс: {{ course.title }}
            </p>
          </div>
          <UBadge
            variant="subtle"
            color="neutral"
          >
            {{ test.questions.length }} вопросов
          </UBadge>
        </div>
      </template>
    </UCard>

    <!-- Вопросы -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">
          Вопросы
        </h3>
        <UButton
          icon="i-lucide-plus"
          label="Добавить вопрос"
          size="sm"
          @click="showAddQuestion = true"
        />
      </div>

      <div
        v-if="test.questions.length === 0"
        class="text-center py-8 text-muted"
      >
        Вопросы ещё не добавлены
      </div>

      <UCard
        v-for="(question, qi) in test.questions"
        :key="question.id"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-4">
            <p class="font-medium">
              <span class="text-muted">{{ qi + 1 }}.</span> {{ question.text }}
            </p>
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              square
              @click="removeQuestion(question.id)"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="(option, oi) in question.options"
              :key="oi"
              class="flex items-center gap-2 p-2 rounded-md"
              :class="oi === question.correctAnswer ? 'bg-success/10 border border-success/30' : 'bg-muted/30'"
            >
              <span class="font-mono text-xs font-bold w-5">{{ correctLabels[oi] }}</span>
              <span class="text-sm">{{ option }}</span>
              <UIcon
                v-if="oi === question.correctAnswer"
                name="i-lucide-check"
                class="size-4 text-success ml-auto"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Модальное окно: добавить вопрос -->
    <UModal
      v-model:open="showAddQuestion"
      title="Добавить вопрос"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Текст вопроса"
            required
          >
            <UTextarea
              v-model="newQuestion.text"
              placeholder="Введите вопрос..."
              class="w-full"
            />
          </UFormField>
          <UFormField
            v-for="(_, i) in newQuestion.options"
            :key="i"
            :label="`Вариант ${correctLabels[i]}`"
          >
            <div class="flex items-center gap-2">
              <UInput
                v-model="newQuestion.options[i]"
                :placeholder="`Вариант ответа ${correctLabels[i]}`"
                class="flex-1"
              />
              <UButton
                :icon="newQuestion.correctAnswer === i ? 'i-lucide-check-circle' : 'i-lucide-circle'"
                :color="newQuestion.correctAnswer === i ? 'success' : 'neutral'"
                variant="ghost"
                square
                @click="newQuestion.correctAnswer = i"
              />
            </div>
          </UFormField>
          <p class="text-xs text-muted">
            Нажмите на иконку справа, чтобы отметить правильный ответ.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showAddQuestion = false"
          />
          <UButton
            label="Добавить"
            icon="i-lucide-plus"
            @click="addQuestion"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
