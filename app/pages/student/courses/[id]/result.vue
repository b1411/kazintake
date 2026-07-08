<script setup lang="ts">
definePageMeta({ layout: 'student', title: 'Результат теста' })

interface Result { score: number, total: number, passed: boolean, completedAt: string }
interface MyCourse { id: number, title: string, result: Result | null }

const route = useRoute()
const courseId = Number(route.params.id)

const { data: myCourses } = await useFetch<MyCourse[]>('/api/my/courses', { default: () => [] })

const course = computed(() => myCourses.value.find(c => c.id === courseId) ?? null)
const result = computed(() => course.value?.result ?? null)
const scorePercent = computed(() =>
  result.value ? Math.round((result.value.score / result.value.total) * 100) : 0
)
</script>

<template>
  <div
    v-if="!result"
    class="flex items-center justify-center h-64"
  >
    <div class="text-center space-y-4">
      <UIcon
        name="i-lucide-clipboard-x"
        class="size-12 text-muted mx-auto"
      />
      <p class="text-muted">
        Результаты теста не найдены
      </p>
      <UButton
        :to="`/student/courses/${courseId}`"
        label="Перейти к курсу"
        icon="i-lucide-arrow-left"
      />
    </div>
  </div>

  <div
    v-else
    class="space-y-6 max-w-2xl mx-auto"
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

    <UCard>
      <div class="text-center space-y-6 py-4">
        <div
          class="mx-auto flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold"
          :class="result.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'"
        >
          {{ scorePercent }}%
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold">
            {{ result.passed ? '🎉 Тест сдан!' : '❌ Тест не сдан' }}
          </h2>
          <p class="text-muted">
            {{ course?.title }}
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">
              {{ result.score }}
            </p>
            <p class="text-xs text-muted">
              Правильных
            </p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">
              {{ result.total }}
            </p>
            <p class="text-xs text-muted">
              Всего
            </p>
          </div>
          <div class="text-center">
            <p
              class="text-2xl font-bold"
              :class="result.passed ? 'text-success' : 'text-error'"
            >
              {{ scorePercent }}%
            </p>
            <p class="text-xs text-muted">
              Результат
            </p>
          </div>
        </div>

        <UProgress
          :model-value="scorePercent"
          :color="result.passed ? 'success' : 'error'"
          size="lg"
          class="max-w-sm mx-auto"
        />

        <p class="text-sm text-muted">
          Порог прохождения: 70% • Дата: {{ result.completedAt }}
        </p>
      </div>
    </UCard>

    <div class="flex justify-center gap-3">
      <UButton
        to="/student/dashboard"
        label="К моим курсам"
        icon="i-lucide-home"
        color="neutral"
        variant="outline"
      />
      <UButton
        v-if="!result.passed"
        :to="`/student/courses/${courseId}/test`"
        label="Пересдать"
        icon="i-lucide-refresh-cw"
      />
      <UButton
        v-else
        :to="`/student/courses/${courseId}`"
        label="Вернуться к курсу"
        icon="i-lucide-book-open"
      />
    </div>
  </div>
</template>
