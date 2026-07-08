<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Панель администратора' })

const { data: courses } = await useFetch('/api/admin/courses', { default: () => [] })
const { data: participants } = await useFetch('/api/admin/participants', { default: () => [] })
const { data: tests } = await useFetch('/api/admin/tests', { default: () => [] })
const { data: results } = await useFetch('/api/admin/results', { default: () => [] })

const enrollmentsCount = computed(() =>
  participants.value.reduce((sum, p) => sum + p.courseIds.length, 0)
)

const stats = computed(() => [
  { label: 'Курсов', value: courses.value.length, icon: 'i-lucide-book-open', color: 'text-primary' },
  { label: 'Тестов', value: tests.value.length, icon: 'i-lucide-clipboard-check', color: 'text-success' },
  { label: 'Курсантов', value: participants.value.length, icon: 'i-lucide-users', color: 'text-warning' },
  { label: 'Записей на курсы', value: enrollmentsCount.value, icon: 'i-lucide-link', color: 'text-info' }
])
</script>

<template>
  <div class="space-y-6">
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
          to="/admin/students"
          icon="i-lucide-user-plus"
          label="Добавить курсанта"
          color="warning"
        />
        <UButton
          to="/admin/assignments"
          icon="i-lucide-link"
          label="Записать на курс"
          color="neutral"
          variant="outline"
        />
        <UButton
          to="/admin/pins"
          icon="i-lucide-key-round"
          label="Коды доступа"
          color="neutral"
          variant="outline"
        />
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="font-semibold text-lg">
          Последние результаты аттестации
        </h3>
      </template>
      <div
        v-if="results.length === 0"
        class="text-muted text-sm"
      >
        Результатов пока нет
      </div>
      <div
        v-else
        class="divide-y divide-default"
      >
        <div
          v-for="result in results"
          :key="result.id"
          class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div>
            <p class="font-medium">
              {{ result.participantName }}
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
