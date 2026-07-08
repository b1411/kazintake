<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'admin', title: 'Курсы' })

interface CourseRow {
  id: number
  title: string
  description: string
  createdAt: string
  materials: unknown[]
  testId: number | null
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const toast = useToast()
const { data: courses, refresh } = await useFetch<CourseRow[]>('/api/admin/courses', { default: () => [] })

const showAddModal = ref(false)
const newCourse = reactive({ title: '', description: '' })

const columns: TableColumn<CourseRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Название' },
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
      return testId
        ? h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Есть')
        : h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Нет теста')
    }
  },
  {
    accessorKey: 'materials',
    header: 'Материалы',
    cell: ({ row }) => `${(row.getValue('materials') as unknown[]).length} шт.`
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h('div', { class: 'flex gap-1' }, [
      h(UButton, {
        icon: 'i-lucide-pencil', color: 'neutral', variant: 'ghost', size: 'xs', square: true,
        to: `/admin/courses/${row.original.id}`
      }),
      h(UButton, {
        icon: 'i-lucide-trash-2', color: 'error', variant: 'ghost', size: 'xs', square: true,
        onClick: () => handleDelete(row.original.id)
      })
    ])
  }
]

async function handleDelete(id: number) {
  await $fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
  await refresh()
  toast.add({ title: 'Курс удалён', color: 'success', icon: 'i-lucide-check-circle' })
}

async function handleAdd() {
  if (!newCourse.title.trim()) return
  await $fetch('/api/admin/courses', { method: 'POST', body: { ...newCourse } })
  newCourse.title = ''
  newCourse.description = ''
  showAddModal.value = false
  await refresh()
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
