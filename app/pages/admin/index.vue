<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Панель администратора' })

const { courses, students, tests, assignments, testResults } = useMockData()

const stats = computed(() => [
  {
    label: 'Курсов',
    value: courses.value.length,
    icon: 'i-lucide-book-open',
    color: 'text-primary'
  },
  {
    label: 'Тестов',
    value: tests.value.length,
    icon: 'i-lucide-clipboard-check',
    color: 'text-success'
  },
  {
    label: 'Студентов',
    value: students.value.length,
    icon: 'i-lucide-users',
    color: 'text-warning'
  },
  {
    label: 'Назначений',
    value: assignments.value.length,
    icon: 'i-lucide-link',
    color: 'text-info'
  }
])

const recentResults = computed(() => {
  return testResults.value
    .slice()
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 5)
    .map((r) => {
      const student = students.value.find(s => s.id === r.studentId)
      const course = courses.value.find(c => c.id === r.courseId)
      return {
        ...r,
        studentName: student?.name || '—',
        courseTitle: course?.title || '—'
      }
    })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Статистика -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
      >
        <div class="flex items-center gap-4">
          <UIcon
            :name="stat.icon"
            :class="[stat.color, 'size-10']"
          />
          <div>
            <p class="text-3xl font-bold">
              {{ stat.value }}
            </p>
            <p class="text-sm text-muted">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Быстрые действия -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-lg">
          Быстрые действия
        </h3>
      </template>
      <div class="flex flex-wrap gap-3">
        <UButton
          to="/admin/courses"
          icon="i-lucide-plus"
          label="Добавить курс"
        />
        <UButton
          to="/admin/tests"
          icon="i-lucide-plus"
          label="Создать тест"
          color="success"
        />
        <UButton
          to="/admin/students"
          icon="i-lucide-upload"
          label="Импорт студентов"
          color="warning"
        />
        <UButton
          to="/admin/assignments"
          icon="i-lucide-link"
          label="Назначить курсы"
          color="neutral"
          variant="outline"
        />
      </div>
    </UCard>

    <!-- Последние результаты тестов -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-lg">
          Последние результаты аттестации
        </h3>
      </template>
      <div
        v-if="recentResults.length === 0"
        class="text-muted text-sm"
      >
        Результатов пока нет
      </div>
      <div
        v-else
        class="divide-y divide-default"
      >
        <div
          v-for="result in recentResults"
          :key="result.id"
          class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div>
            <p class="font-medium">
              {{ result.studentName }}
            </p>
            <p class="text-sm text-muted">
              {{ result.courseTitle }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-mono">{{ result.score }}/{{ result.total }}</span>
            <UBadge
              :color="result.passed ? 'success' : 'error'"
              :label="result.passed ? 'Сдан' : 'Не сдан'"
              variant="subtle"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
