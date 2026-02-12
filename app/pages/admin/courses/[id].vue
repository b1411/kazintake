<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Редактор курса' })

const route = useRoute()
const toast = useToast()
const courseId = Number(route.params.id)

const { getCourse, updateCourse, getTestByCourse } = useMockData()

const course = computed(() => getCourse(courseId))
const test = computed(() => getTestByCourse(courseId))

// Локальные редактируемые данные
const editTitle = ref(course.value?.title || '')
const editDescription = ref(course.value?.description || '')

// Новый материал
const showAddMaterial = ref(false)
const newMaterial = reactive({
  type: 'text' as 'text' | 'pdf' | 'video',
  title: '',
  content: ''
})

const materialTypeOptions = [
  { label: 'Текст', value: 'text' },
  { label: 'PDF (ссылка)', value: 'pdf' },
  { label: 'Видео (ссылка)', value: 'video' }
]

function materialIcon(type: string) {
  switch (type) {
    case 'text': return 'i-lucide-file-text'
    case 'pdf': return 'i-lucide-file-type'
    case 'video': return 'i-lucide-video'
    default: return 'i-lucide-file'
  }
}

function materialBadgeColor(type: string) {
  switch (type) {
    case 'text': return 'primary' as const
    case 'pdf': return 'error' as const
    case 'video': return 'success' as const
    default: return 'neutral' as const
  }
}

function saveCourse() {
  updateCourse(courseId, {
    title: editTitle.value,
    description: editDescription.value
  })
  toast.add({ title: 'Курс сохранён', color: 'success', icon: 'i-lucide-check-circle' })
}

function addMaterial() {
  if (!newMaterial.title.trim()) return
  if (!course.value) return

  const maxId = Math.max(0, ...course.value.materials.map(m => m.id))
  course.value.materials.push({
    id: maxId + 1,
    type: newMaterial.type,
    title: newMaterial.title,
    content: newMaterial.content
  })

  newMaterial.type = 'text'
  newMaterial.title = ''
  newMaterial.content = ''
  showAddMaterial.value = false
  toast.add({ title: 'Материал добавлен', color: 'success', icon: 'i-lucide-check-circle' })
}

function removeMaterial(materialId: number) {
  if (!course.value) return
  course.value.materials = course.value.materials.filter(m => m.id !== materialId)
  toast.add({ title: 'Материал удалён', color: 'success', icon: 'i-lucide-check-circle' })
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
    <!-- Навигация -->
    <div class="flex items-center gap-2">
      <UButton
        to="/admin/courses"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        label="Назад к курсам"
      />
    </div>

    <!-- Основная информация -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-lg">
          Основная информация
        </h3>
      </template>
      <div class="space-y-4">
        <UFormField
          label="Название курса"
          required
        >
          <UInput
            v-model="editTitle"
            placeholder="Название курса"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Описание">
          <UTextarea
            v-model="editDescription"
            placeholder="Описание курса"
            :rows="3"
            class="w-full"
          />
        </UFormField>
        <div class="flex justify-end">
          <UButton
            label="Сохранить"
            icon="i-lucide-save"
            @click="saveCourse"
          />
        </div>
      </div>
    </UCard>

    <!-- Материалы курса -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-lg">
            Материалы курса ({{ course.materials.length }})
          </h3>
          <UButton
            icon="i-lucide-plus"
            label="Добавить"
            size="sm"
            @click="showAddMaterial = true"
          />
        </div>
      </template>

      <div
        v-if="course.materials.length === 0"
        class="text-muted text-sm py-4 text-center"
      >
        Материалы ещё не добавлены
      </div>

      <div
        v-else
        class="divide-y divide-default"
      >
        <div
          v-for="material in course.materials"
          :key="material.id"
          class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div class="flex items-center gap-3">
            <UIcon
              :name="materialIcon(material.type)"
              class="size-5 text-muted"
            />
            <div>
              <p class="font-medium">
                {{ material.title }}
              </p>
              <UBadge
                :color="materialBadgeColor(material.type)"
                variant="subtle"
                size="xs"
              >
                {{ material.type === 'text' ? 'Текст' : material.type === 'pdf' ? 'PDF' : 'Видео' }}
              </UBadge>
            </div>
          </div>
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="xs"
            square
            @click="removeMaterial(material.id)"
          />
        </div>
      </div>
    </UCard>

    <!-- Привязанный тест -->
    <UCard>
      <template #header>
        <h3 class="font-semibold text-lg">
          Привязанный тест
        </h3>
      </template>
      <div
        v-if="test"
        class="flex items-center justify-between"
      >
        <div>
          <p class="font-medium">
            {{ test.title }}
          </p>
          <p class="text-sm text-muted">
            {{ test.questions.length }} вопросов
          </p>
        </div>
        <UButton
          :to="`/admin/tests/${test.id}`"
          label="Редактировать тест"
          icon="i-lucide-pencil"
          variant="outline"
          size="sm"
        />
      </div>
      <div
        v-else
        class="text-muted text-sm"
      >
        Тест не привязан.
        <UButton
          to="/admin/tests"
          label="Создать тест"
          variant="link"
          size="sm"
          class="ml-1"
        />
      </div>
    </UCard>

    <!-- Модальное окно: добавить материал -->
    <UModal
      v-model:open="showAddMaterial"
      title="Добавить материал"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Тип материала">
            <USelect
              v-model="newMaterial.type"
              :items="materialTypeOptions"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Заголовок"
            required
          >
            <UInput
              v-model="newMaterial.title"
              placeholder="Название материала"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="newMaterial.type === 'text' ? 'Содержимое (HTML)' : 'URL'">
            <UTextarea
              v-if="newMaterial.type === 'text'"
              v-model="newMaterial.content"
              placeholder="<h2>Заголовок</h2><p>Текст...</p>"
              :rows="5"
              class="w-full"
            />
            <UInput
              v-else
              v-model="newMaterial.content"
              :placeholder="newMaterial.type === 'pdf' ? 'https://example.com/doc.pdf' : 'https://youtube.com/embed/...'"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showAddMaterial = false"
          />
          <UButton
            label="Добавить"
            icon="i-lucide-plus"
            @click="addMaterial"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
