<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Course } from '~/composables/useMockData'

definePageMeta({ layout: 'admin', title: 'Курсы' })

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { courses, tests, deleteCourse } = useMockData()
const toast = useToast()

const showAddModal = ref(false)
const newCourse = reactive({
  title: '',
  description: ''
})

const columns: TableColumn<Course>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: 'Название'
  },
  {
    accessorKey: 'description',
    header: 'Описание',
    cell: ({ row }) => {
      const desc = row.getValue('description') as string
      return desc.length > 60 ? desc.slice(0, 60) + '...' : desc
    }
  },
  {
    accessorKey: 'testId',
    header: 'Тест',
    cell: ({ row }) => {
      const testId = row.getValue('testId') as number | null
      if (testId) {
        const test = tests.value.find(t => t.id === testId)
        return h(UBadge, { color: 'success', variant: 'subtle' }, () => test?.title || `Тест #${testId}`)
      }
      return h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Нет теста')
    }
  },
  {
    accessorKey: 'materials',
    header: 'Материалы',
    cell: ({ row }) => {
      const materials = row.getValue('materials') as Course['materials']
      return `${materials.length} шт.`
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Дата создания'
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
          to: `/admin/courses/${row.original.id}`
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
  deleteCourse(id)
  toast.add({ title: 'Курс удалён', color: 'success', icon: 'i-lucide-check-circle' })
}

function handleAdd() {
  if (!newCourse.title.trim()) return
  const { addCourse } = useMockData()
  addCourse({
    title: newCourse.title,
    description: newCourse.description,
    materials: [],
    testId: null
  })
  newCourse.title = ''
  newCourse.description = ''
  showAddModal.value = false
  toast.add({ title: 'Курс создан', color: 'success', icon: 'i-lucide-check-circle' })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Все курсы ({{ courses.length }})
      </h2>
      <UButton
        icon="i-lucide-plus"
        label="Добавить курс"
        @click="showAddModal = true"
      />
    </div>

    <UTable
      :data="courses"
      :columns="columns"
      class="w-full"
    />

    <UModal
      v-model:open="showAddModal"
      title="Новый курс"
      description="Введите данные нового курса"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Название курса"
            required
          >
            <UInput
              v-model="newCourse.title"
              placeholder="Например: Охрана труда"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Описание">
            <UTextarea
              v-model="newCourse.description"
              placeholder="Краткое описание курса"
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
