<script setup lang="ts">
definePageMeta({ layout: 'student', title: 'Прохождение теста' })

interface Q { id: number, text: string, options: string[] }
interface TestData { id: number, title: string, questions: Q[] }

const route = useRoute()
const courseId = Number(route.params.id)
const toast = useToast()

const { data: test } = await useFetch<TestData>(`/api/courses/${courseId}/test`)

const answers = ref<Record<number, number>>({})
const currentQuestion = ref(0)
const isSubmitting = ref(false)

const totalQuestions = computed(() => test.value?.questions.length || 0)
const answeredCount = computed(() => Object.keys(answers.value).length)
const allAnswered = computed(() => answeredCount.value === totalQuestions.value)

const correctLabels = ['A', 'B', 'C', 'D']

function selectAnswer(questionIndex: number, optionIndex: number) {
  answers.value[questionIndex] = optionIndex
}
function goNext() {
  if (currentQuestion.value < totalQuestions.value - 1) currentQuestion.value++
}
function goPrev() {
  if (currentQuestion.value > 0) currentQuestion.value--
}

async function handleSubmit() {
  if (!test.value) return
  isSubmitting.value = true
  try {
    const answersArray = test.value.questions.map((_, i) => answers.value[i] ?? -1)
    const result = await $fetch<{ score: number, total: number, passed: boolean }>(
      `/api/courses/${courseId}/test/submit`,
      { method: 'POST', body: { answers: answersArray } }
    )
    toast.add({
      title: result.passed ? 'Тест сдан!' : 'Тест не сдан',
      description: `Результат: ${result.score} из ${result.total}`,
      color: result.passed ? 'success' : 'error',
      icon: result.passed ? 'i-lucide-check-circle' : 'i-lucide-x-circle'
    })
    await navigateTo(`/student/courses/${courseId}/result`)
  } finally {
    isSubmitting.value = false
  }
}
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
    class="space-y-6 max-w-3xl mx-auto"
  >
    <div class="flex items-center gap-2">
      <UButton
        :to="`/student/courses/${courseId}`"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        label="Вернуться к курсу"
      />
    </div>

    <div class="space-y-2">
      <h2 class="text-xl font-bold">
        {{ test.title }}
      </h2>
      <div class="flex items-center gap-4">
        <UProgress
          :model-value="(answeredCount / totalQuestions) * 100"
          size="sm"
          class="flex-1"
        />
        <span class="text-sm text-muted font-mono">{{ answeredCount }}/{{ totalQuestions }}</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="(q, qi) in test.questions"
        :key="q.id"
        :label="`${qi + 1}`"
        :color="answers[qi] !== undefined ? 'primary' : 'neutral'"
        :variant="currentQuestion === qi ? 'solid' : (answers[qi] !== undefined ? 'subtle' : 'outline')"
        size="sm"
        square
        @click="currentQuestion = qi"
      />
    </div>

    <UCard>
      <div class="space-y-4">
        <p class="font-medium text-lg">
          <span class="text-muted">{{ currentQuestion + 1 }}.</span>
          {{ test.questions[currentQuestion]?.text }}
        </p>

        <div class="space-y-2">
          <button
            v-for="(option, oi) in test.questions[currentQuestion]?.options"
            :key="oi"
            class="w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
            :class="answers[currentQuestion] === oi
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-default hover:border-primary/50 hover:bg-muted/30'"
            @click="selectAnswer(currentQuestion, oi)"
          >
            <span
              class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0"
              :class="answers[currentQuestion] === oi ? 'bg-primary text-white' : 'bg-muted/50 text-muted'"
            >
              {{ correctLabels[oi] }}
            </span>
            <span>{{ option }}</span>
          </button>
        </div>

        <div class="flex items-center justify-between pt-2">
          <UButton
            label="Назад"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="outline"
            :disabled="currentQuestion === 0"
            @click="goPrev"
          />
          <UButton
            v-if="currentQuestion < totalQuestions - 1"
            label="Далее"
            trailing-icon="i-lucide-arrow-right"
            @click="goNext"
          />
          <UButton
            v-else
            label="Завершить тест"
            icon="i-lucide-check"
            color="success"
            :disabled="!allAnswered"
            :loading="isSubmitting"
            @click="handleSubmit"
          />
        </div>
      </div>
    </UCard>

    <UAlert
      v-if="!allAnswered"
      color="warning"
      icon="i-lucide-alert-triangle"
      title="Не все вопросы отвечены"
      :description="`Ответьте на все ${totalQuestions} вопросов, чтобы завершить тест.`"
    />
  </div>
</template>
