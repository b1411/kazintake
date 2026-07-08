<script setup lang="ts">
definePageMeta({ layout: 'student', title: 'Курс' })

interface Material { id: number, type: 'text' | 'pdf' | 'video', title: string, content: string }
interface CourseDetail { id: number, title: string, description: string, materials: Material[], testId: number | null }
interface MyCourse { id: number, result: { score: number, total: number, passed: boolean } | null }

const route = useRoute()
const courseId = Number(route.params.id)

const { data: course } = await useFetch<CourseDetail>(`/api/courses/${courseId}`)
const { data: myCourses } = await useFetch<MyCourse[]>('/api/my/courses', { default: () => [] })

const result = computed(() => myCourses.value.find(c => c.id === courseId)?.result ?? null)

function materialIcon(type: string) {
  switch (type) {
    case 'text': return 'i-lucide-file-text'
    case 'pdf': return 'i-lucide-file-type'
    case 'video': return 'i-lucide-video'
    default: return 'i-lucide-file'
  }
}

const expandedMaterial = ref<number | null>(null)
function toggleMaterial(id: number) {
  expandedMaterial.value = expandedMaterial.value === id ? null : id
}
</script>

<template>
  <div
    v-if="!course"
    class="flex items-center justify-center h-64"
  >
    <UAlert
      title="Курс не найден"
      icon="i-lucide-alert-triangle"
      color="warning"
    />
  </div>

  <div
    v-else
    class="space-y-6"
  >
    <div class="flex items-center gap-2">
      <UButton
        to="/student/dashboard"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        label="Мои курсы"
      />
    </div>

    <div>
      <h2 class="text-2xl font-bold">
        {{ course.title }}
      </h2>
      <p class="text-muted mt-1">
        {{ course.description }}
      </p>
    </div>

    <div class="space-y-3">
      <h3 class="font-semibold text-lg">
        Материалы курса
      </h3>

      <div
        v-if="course.materials.length === 0"
        class="text-muted text-sm"
      >
        Материалы ещё не добавлены.
      </div>

      <UCard
        v-for="material in course.materials"
        :key="material.id"
      >
        <div class="space-y-3">
          <div
            class="flex items-center gap-3 cursor-pointer"
            @click="toggleMaterial(material.id)"
          >
            <UIcon
              :name="materialIcon(material.type)"
              class="size-5 text-primary"
            />
            <span class="font-medium flex-1">{{ material.title }}</span>
            <UBadge
              :color="material.type === 'text' ? 'primary' : material.type === 'pdf' ? 'error' : 'success'"
              variant="subtle"
              size="xs"
            >
              {{ material.type === 'text' ? 'Текст' : material.type === 'pdf' ? 'PDF' : 'Видео' }}
            </UBadge>
            <UIcon
              :name="expandedMaterial === material.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="size-5 text-muted"
            />
          </div>

          <div v-if="expandedMaterial === material.id">
            <USeparator class="my-3" />

            <div
              v-if="material.type === 'text'"
              class="prose dark:prose-invert max-w-none"
              v-html="material.content"
            />

            <div
              v-else-if="material.type === 'pdf'"
              class="space-y-2"
            >
              <p class="text-sm text-muted">
                PDF-документ:
              </p>
              <UButton
                :to="material.content"
                target="_blank"
                label="Открыть PDF"
                icon="i-lucide-external-link"
                variant="outline"
              />
            </div>

            <div
              v-else-if="material.type === 'video'"
              class="space-y-2"
            >
              <div class="aspect-video rounded-lg overflow-hidden bg-muted/30">
                <iframe
                  :src="material.content"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UCard
      v-if="course.testId"
      class="border-primary/30"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-clipboard-check"
            class="size-5 text-primary"
          />
          <h3 class="font-semibold text-lg">
            Финальный тест
          </h3>
        </div>
      </template>

      <div class="space-y-3">
        <p class="text-sm text-muted">
          Для прохождения необходимо набрать не менее 70% правильных ответов.
        </p>

        <div
          v-if="result"
          class="flex items-center gap-4"
        >
          <UBadge
            :color="result.passed ? 'success' : 'error'"
            variant="subtle"
            size="lg"
          >
            {{ result.passed ? 'Тест сдан' : 'Тест не сдан' }}: {{ result.score }}/{{ result.total }}
          </UBadge>
          <UButton
            :to="`/student/courses/${courseId}/result`"
            label="Подробнее"
            variant="outline"
            size="sm"
          />
        </div>

        <div class="flex gap-2">
          <UButton
            :to="`/student/courses/${courseId}/test`"
            :label="result ? 'Пересдать тест' : 'Начать тест'"
            :icon="result ? 'i-lucide-refresh-cw' : 'i-lucide-play'"
          />
        </div>
      </div>
    </UCard>

    <UCard v-else>
      <div class="flex items-center gap-3 text-muted">
        <UIcon
          name="i-lucide-info"
          class="size-5"
        />
        <p>Для этого курса тест не предусмотрен</p>
      </div>
    </UCard>
  </div>
</template>
