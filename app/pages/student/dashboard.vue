<script setup lang="ts">
definePageMeta({ layout: 'student', title: 'Мои курсы' })

const { user } = useMockAuth()
const { getCoursesForStudent, getResultForStudentCourse, getTestByCourse } = useMockData()

const myCourses = computed(() => {
  if (!user.value) return []
  return getCoursesForStudent(user.value.id).map((course) => {
    const result = getResultForStudentCourse(user.value!.id, course.id)
    const test = getTestByCourse(course.id)
    return {
      ...course,
      result,
      hasTest: !!test,
      status: result
        ? (result.passed ? 'passed' : 'failed')
        : 'in-progress'
    }
  })
})

function statusLabel(status: string) {
  switch (status) {
    case 'passed': return 'Сдан'
    case 'failed': return 'Не сдан'
    default: return 'В процессе'
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'passed': return 'success' as const
    case 'failed': return 'error' as const
    default: return 'warning' as const
  }
}

function statusIcon(status: string) {
  switch (status) {
    case 'passed': return 'i-lucide-check-circle'
    case 'failed': return 'i-lucide-x-circle'
    default: return 'i-lucide-clock'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold">
        Добро пожаловать, {{ user?.name }}
      </h2>
      <p class="text-muted">
        Ваши назначенные курсы и прогресс обучения
      </p>
    </div>

    <div
      v-if="myCourses.length === 0"
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
        v-for="course in myCourses"
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
              :color="statusColor(course.status)"
              :icon="statusIcon(course.status)"
              variant="subtle"
            >
              {{ statusLabel(course.status) }}
            </UBadge>
          </div>

          <div class="flex items-center gap-4 text-sm text-muted">
            <span class="flex items-center gap-1">
              <UIcon
                name="i-lucide-file-text"
                class="size-4"
              />
              {{ course.materials.length }} материалов
            </span>
            <span
              v-if="course.hasTest"
              class="flex items-center gap-1"
            >
              <UIcon
                name="i-lucide-clipboard-check"
                class="size-4"
              />
              Тест
            </span>
          </div>

          <!-- Результат если есть -->
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
