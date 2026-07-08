<script setup lang="ts">
definePageMeta({ layout: 'student', title: 'Мои курсы' })

interface MyCourse {
  id: number
  title: string
  description: string
  testId: number | null
  result: { score: number, total: number, passed: boolean } | null
}

const { user } = useAuth()
const { data: courses } = await useFetch<MyCourse[]>('/api/my/courses', { default: () => [] })

function status(c: MyCourse) {
  if (!c.result) return 'in-progress'
  return c.result.passed ? 'passed' : 'failed'
}
function statusLabel(s: string) {
  return s === 'passed' ? 'Сдан' : s === 'failed' ? 'Не сдан' : 'В процессе'
}
function statusColor(s: string) {
  return s === 'passed' ? 'success' as const : s === 'failed' ? 'error' as const : 'warning' as const
}
function statusIcon(s: string) {
  return s === 'passed' ? 'i-lucide-check-circle' : s === 'failed' ? 'i-lucide-x-circle' : 'i-lucide-clock'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold">
        Добро пожаловать, {{ user?.name }}
      </h2>
      <p class="text-muted">
        Ваши курсы и прогресс обучения
      </p>
    </div>

    <div
      v-if="courses.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-book-open"
        class="size-12 text-muted mx-auto mb-4"
      />
      <p class="text-muted text-lg">
        Вам пока не назначено ни одного курса
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <UCard
        v-for="course in courses"
        :key="course.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <h3 class="font-semibold text-lg">
                {{ course.title }}
              </h3>
              <p class="text-sm text-muted line-clamp-2">
                {{ course.description }}
              </p>
            </div>
            <UBadge
              :color="statusColor(status(course))"
              :icon="statusIcon(status(course))"
              variant="subtle"
            >
              {{ statusLabel(status(course)) }}
            </UBadge>
          </div>

          <div
            v-if="course.testId"
            class="flex items-center gap-1 text-sm text-muted"
          >
            <UIcon
              name="i-lucide-clipboard-check"
              class="size-4"
            />
            Есть тест
          </div>

          <div
            v-if="course.result"
            class="flex items-center gap-2"
          >
            <UProgress
              :model-value="(course.result.score / course.result.total) * 100"
              :color="course.result.passed ? 'success' : 'error'"
              size="sm"
              class="flex-1"
            />
            <span class="text-sm font-mono">
              {{ course.result.score }}/{{ course.result.total }}
            </span>
          </div>

          <div class="flex gap-2">
            <UButton
              :to="`/student/courses/${course.id}`"
              label="Изучить"
              icon="i-lucide-play"
              variant="outline"
              class="flex-1"
            />
            <UButton
              v-if="course.result"
              :to="`/student/courses/${course.id}/result`"
              label="Результат"
              icon="i-lucide-bar-chart-2"
              color="neutral"
              variant="outline"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
