<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { CourseTest } from '~/composables/useMockData'

definePageMeta({ layout: 'admin', title: 'Тесты' })

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { tests, courses, deleteTest } = useMockData()
const toast = useToast()

const showAddModal = ref(false)
const newTest = reactive({
  title: '',
  courseId: null as number | null
})

const availableCourses = computed(() =>
  courses.value
    .filter(c => !c.testId)
    .map(c => ({ label: c.title, value: c.id }))
)

const columns: TableColumn<CourseTest>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Название' },
  {
    accessorKey: 'courseId',
    header: 'Курс',
    cell: ({ row }) => {
      const courseId = row.getValue('courseId') as number
      const course = courses.value.find(c => c.id === courseId)
      return course?.title || `#${courseId}`
    }
  },
  {
    accessorKey: 'questions',
    header: 'Вопросов',
    cell: ({ row }) => {
      const questions = row.getValue('questions') as CourseTest['questions']
      return h(UBadge, { variant: 'subtle', color: 'neutral' }, () => `${questions.length}`)
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-1' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          color: 'neutral',
          variant: 'ghost',
          size: 'xs',
          square: true,
          to: `/admin/tests/${row.original.id}`
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          color: 'error',
          variant: 'ghost',
          size: 'xs',
          square: true,
          onClick: () => handleDelete(row.original.id)
        })
      ])
    }
  }
]

function handleDelete(id: number) {
  deleteTest(id)
  toast.add({ title: 'Тест удалён', color: 'success', icon: 'i-lucide-check-circle' })
}

function handleAdd() {
  if (!newTest.title.trim() || !newTest.courseId) return
  const { addTest } = useMockData()
  addTest({
    title: newTest.title,
    courseId: newTest.courseId,
    questions: []
  })
  newTest.title = ''
  newTest.courseId = null
  showAddModal.value = false
  toast.add({ title: 'Тест создан', color: 'success', icon: 'i-lucide-check-circle' })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Все тесты ({{ tests.length }})
      </h2>
      <UButton
        icon="i-lucide-plus"
        label="Создать тест"
        @click="showAddModal = true"
      />
    </div>

    <UTable
      :data="tests"
      :columns="columns"
      class="w-full"
    />

    <UModal
      v-model:open="showAddModal"
      title="Новый тест"
      description="Создайте тест и привяжите к курсу"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Название теста"
            required
          >
            <UInput
              v-model="newTest.title"
              placeholder="Например: Тест по охране труда"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Курс"
            required
          >
            <USelect
              v-model="newTest.courseId"
              :items="availableCourses"
              placeholder="Выберите курс"
              class="w-full"
            />
          </UFormField>
          <p
            v-if="availableCourses.length === 0"
            class="text-sm text-muted"
          >
            Все курсы уже имеют привязанные тесты.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showAddModal = false"
          />
          <UButton
            label="Создать"
            icon="i-lucide-plus"
            @click="handleAdd"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
